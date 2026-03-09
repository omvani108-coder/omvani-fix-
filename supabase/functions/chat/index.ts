import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { CHAT_LIMITS, getTodayIST, buildSystemPrompt, sanitizeLanguage } from "./logic.ts";

serve(async (req) => {
  const CORS = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    // ── Step 1: Verify JWT ──────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── Step 2: Get user's plan ─────────────────────────────────────────────
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();

    const plan = (sub?.plan as string) ?? "free";

    // ── Step 3: Check daily usage (IST) ─────────────────────────────────────
    const todayIST = getTodayIST();
    let currentCount = 0;

    const limit = CHAT_LIMITS[plan]; // undefined for unlimited plans

    if (limit !== undefined) {
      const { data: usageRow } = await supabase
        .from("usage_logs")
        .select("count")
        .eq("user_id", user.id)
        .eq("feature", "chat")
        .eq("date_ist", todayIST)
        .maybeSingle();

      currentCount = usageRow?.count ?? 0;

      if (currentCount >= limit) {
        return new Response(
          JSON.stringify({ error: "Daily limit reached" }),
          { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
    }

    // ── Step 4: Parse request body ──────────────────────────────────────────
    const { messages, language: rawLang } = await req.json();
    const language = sanitizeLanguage(rawLang);

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // Reject oversized messages to prevent excessive token usage
    const totalLength = messages.reduce((sum: number, m: { content?: string }) => sum + (m.content?.length ?? 0), 0);
    if (totalLength > 50000) {
      return new Response(
        JSON.stringify({ error: "Message content too large" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }


    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── Build system prompt with prompt caching ──────────────────────────
    // System prompt is server-side only. Client sends language preference.
    const systemText = buildSystemPrompt(language ?? "en");
    const systemBlocks = [
      { type: "text", text: systemText, cache_control: { type: "ephemeral" } },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: systemBlocks,
        stream: true,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: `Anthropic error: ${err}` }),
        { status: response.status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    if (!response.body) {
      throw new Error("Anthropic response did not include a stream body");
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";
        let receivedContent = false; // Track if AI actually sent content

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.type === "text_delta" &&
                  parsed.delta?.text
                ) {
                  controller.enqueue(encoder.encode(parsed.delta.text));
                  receivedContent = true;
                }
              } catch {
                // Skip malformed SSE lines
              }
            }
          }

          if (buffer.startsWith("data: ")) {
            const data = buffer.slice(6).trim();
            if (data && data !== "[DONE]") {
              try {
                const parsed = JSON.parse(data);
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.type === "text_delta" &&
                  parsed.delta?.text
                ) {
                  controller.enqueue(encoder.encode(parsed.delta.text));
                  receivedContent = true;
                }
              } catch {
                // Skip malformed trailing line
              }
            }
          }

          // ── Step 5: Only increment usage if AI actually responded ──────
          // This prevents counting failed/empty responses against the user's quota
          if (limit !== undefined && receivedContent) {
            await supabase.rpc("increment_usage", {
              p_user_id: user.id,
              p_feature: "chat",
              p_date_ist: todayIST,
            }).then(({ error }) => {
              if (error) console.error("Failed to increment chat usage:", error);
            });
          }
        } catch (streamErr) {
          console.error("Stream processing error:", streamErr);
          // Don't increment usage — the user didn't get a valid response
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...CORS,
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
