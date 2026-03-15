import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { captureException } from "../_shared/sentry.ts";
import {
  VALID_LENSES,
  LENS_LABELS,
  KUNDLI_PRICE_PER_ANALYSIS,
  MONTHLY_FREE,
  buildSystemPrompt,
} from "./logic.ts";

// ── Helpers ─────────────────────────────────────────────────────────────────

function jsonResponse(
  body: Record<string, unknown>,
  cors: Record<string, string>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

// ── Razorpay payment verification ────────────────────────────────────────────

async function verifyRazorpayPayment(paymentId: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) {
    return { valid: false, error: "Razorpay credentials not configured" };
  }

  const credentials = btoa(`${keyId}:${keySecret}`);
  const res = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    },
  );

  if (!res.ok) {
    return { valid: false, error: `Razorpay API returned ${res.status}` };
  }

  const payment = await res.json();

  if (payment.status !== "captured") {
    return { valid: false, error: `Payment status is "${payment.status}", expected "captured"` };
  }

  if (payment.amount !== KUNDLI_PRICE_PER_ANALYSIS) {
    return { valid: false, error: `Payment amount ${payment.amount} does not match expected ${KUNDLI_PRICE_PER_ANALYSIS}` };
  }

  if (payment.currency !== "INR") {
    return { valid: false, error: `Payment currency "${payment.currency}" is not INR` };
  }

  return { valid: true };
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  const CORS = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, CORS, 405);
  }

  try {
    // ── Step 1: Verify JWT ────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, CORS, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Unauthorized" }, CORS, 401);
    }

    // ── Step 2: Parse body ────────────────────────────────────────────────
    const body = await req.json();
    const { action } = body;

    // ══════════════════════════════════════════════════════════════════════
    // Mode A: Check eligibility
    // ══════════════════════════════════════════════════════════════════════
    if (action === "check-eligibility") {
      // Check if user has used their lifetime free kundli
      const { data: hasUsed, error: rpcErr } = await supabase.rpc(
        "has_used_free_kundli",
        { p_user_id: user.id },
      );
      if (rpcErr) {
        console.error("has_used_free_kundli error:", rpcErr);
      }
      const hasUsedFree = hasUsed === true;

      // Get user's subscription plan
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();

      const plan = (sub?.plan as string) ?? "free";
      const isPaidPlan =
        plan !== "free" &&
        ["basic", "basic_annual", "pro", "pro_annual", "family"].includes(plan);
      const pricePerAnalysis = KUNDLI_PRICE_PER_ANALYSIS;
      const monthlyAllowance = MONTHLY_FREE[plan] ?? 0;

      // Count this month's readings (IST timezone)
      let monthlyFreeRemaining = 0;
      if (monthlyAllowance > 0) {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        const monthStart = `${istNow.getFullYear()}-${String(istNow.getMonth() + 1).padStart(2, "0")}-01`;
        const nextMonth = istNow.getMonth() === 11
          ? `${istNow.getFullYear() + 1}-01-01`
          : `${istNow.getFullYear()}-${String(istNow.getMonth() + 2).padStart(2, "0")}-01`;

        const { count, error: countErr } = await supabase
          .from("kundli_analyses")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_free", true)
          .gte("created_at", monthStart)
          .lt("created_at", nextMonth);

        if (countErr) {
          console.error("Monthly kundli count error:", countErr);
        }
        const monthlyFreeReadings = count ?? 0;
        monthlyFreeRemaining = Math.max(0, monthlyAllowance - monthlyFreeReadings);
      }

      return jsonResponse(
        { hasUsedFree, isPaidPlan, pricePerAnalysis, monthlyFreeRemaining },
        CORS,
      );
    }

    // ══════════════════════════════════════════════════════════════════════
    // Mode B: Run analysis
    // ══════════════════════════════════════════════════════════════════════
    if (action === "analyse") {
      const {
        full_name,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        lens,
        is_free,
        razorpay_payment_id,
      } = body;

      // Validate required fields
      if (!full_name || !date_of_birth || !place_of_birth || !lens) {
        return jsonResponse(
          { error: "Missing required fields: full_name, date_of_birth, place_of_birth, lens" },
          CORS,
          400,
        );
      }

      // Validate lens
      if (!VALID_LENSES.includes(lens)) {
        return jsonResponse(
          { error: `Invalid lens. Must be one of: ${VALID_LENSES.join(", ")}` },
          CORS,
          400,
        );
      }

      // Validate payment: either free or has payment_id
      if (!is_free && !razorpay_payment_id) {
        return jsonResponse(
          { error: "Payment required: provide razorpay_payment_id or is_free must be true" },
          CORS,
          400,
        );
      }

      // ── Server-side payment verification for paid analyses ──────────────
      if (!is_free && razorpay_payment_id) {
        // Check for duplicate payment ID usage
        const { count: existingCount, error: dupErr } = await supabase
          .from("kundli_analyses")
          .select("id", { count: "exact", head: true })
          .eq("razorpay_payment_id", razorpay_payment_id);

        if (dupErr) {
          console.error("Duplicate payment check error:", dupErr);
        }

        if (existingCount && existingCount > 0) {
          return jsonResponse(
            { error: "This payment has already been used for an analysis" },
            CORS,
            400,
          );
        }

        // Verify payment with Razorpay API
        const verification = await verifyRazorpayPayment(razorpay_payment_id);
        if (!verification.valid) {
          console.error("Payment verification failed:", verification.error);
          return jsonResponse(
            { error: "Payment verification failed" },
            CORS,
            400,
          );
        }
      }

      // If claiming free, verify eligibility (lifetime first-free OR monthly allowance)
      if (is_free) {
        const { data: hasUsed } = await supabase.rpc("has_used_free_kundli", {
          p_user_id: user.id,
        });

        // Get subscription plan for monthly free check
        const { data: subCheck } = await supabase
          .from("subscriptions")
          .select("plan")
          .eq("user_id", user.id)
          .maybeSingle();
        const checkPlan = (subCheck?.plan as string) ?? "free";

        const monthlyAllowance = MONTHLY_FREE[checkPlan] ?? 0;

        let monthlyFreeEligible = false;
        if (monthlyAllowance > 0 && hasUsed === true) {
          const now = new Date();
          const istOffset = 5.5 * 60 * 60 * 1000;
          const istNow = new Date(now.getTime() + istOffset);
          const monthStart = `${istNow.getFullYear()}-${String(istNow.getMonth() + 1).padStart(2, "0")}-01`;
          const nextMonth = istNow.getMonth() === 11
            ? `${istNow.getFullYear() + 1}-01-01`
            : `${istNow.getFullYear()}-${String(istNow.getMonth() + 2).padStart(2, "0")}-01`;

          const { count } = await supabase
            .from("kundli_analyses")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("is_free", true)
            .gte("created_at", monthStart)
            .lt("created_at", nextMonth);

          monthlyFreeEligible = (count ?? 0) < monthlyAllowance;
        }

        if (hasUsed === true && !monthlyFreeEligible) {
          return jsonResponse(
            { error: "Free analysis already used" },
            CORS,
            403,
          );
        }
      }

      // Determine payment amount — ₹79 flat (7900 paise) for paid analyses
      const paymentAmount = is_free ? 0 : KUNDLI_PRICE_PER_ANALYSIS;

      // ── Call Anthropic API FIRST ──────────────────────────────────────
      // We call the API before inserting the DB row so that if the API
      // fails, we don't consume the user's free allowance with nothing
      // to show for it.
      const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!anthropicKey) {
        return jsonResponse(
          { error: "ANTHROPIC_API_KEY not configured" },
          CORS,
          500,
        );
      }

      const systemPrompt = buildSystemPrompt(
        full_name,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        lens,
      );

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 2048,
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          stream: true,
          messages: [
            {
              role: "user",
              content: `Please provide my ${LENS_LABELS[lens] ?? lens} Kundli analysis.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Anthropic API error:", response.status, err);
        return jsonResponse(
          { error: "AI service error" },
          CORS,
          502,
        );
      }

      if (!response.body) {
        throw new Error("Anthropic response did not include a stream body");
      }

      // ── Anthropic responded OK — now safe to insert DB row ──────────
      const { data: analysisRow, error: insertErr } = await supabase
        .from("kundli_analyses")
        .insert({
          user_id: user.id,
          full_name,
          date_of_birth,
          time_of_birth: time_of_birth || null,
          place_of_birth,
          lens,
          is_free: is_free === true,
          razorpay_payment_id: razorpay_payment_id || null,
          payment_amount: paymentAmount,
          payment_status: is_free ? "free" : "paid",
        })
        .select("id")
        .single();

      if (insertErr) {
        console.error("Insert kundli_analyses error:", insertErr);
        return jsonResponse({ error: "Failed to create analysis record" }, CORS, 500);
      }

      const analysisId = analysisRow.id;

      // ── Stream response (same pattern as chat edge function) ──────────
      let fullResult = "";

      const stream = new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let buffer = "";

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
                    fullResult += parsed.delta.text;
                    controller.enqueue(encoder.encode(parsed.delta.text));
                  }
                } catch {
                  // Skip malformed SSE lines
                }
              }
            }

            // Flush remaining buffer
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
                    fullResult += parsed.delta.text;
                    controller.enqueue(encoder.encode(parsed.delta.text));
                  }
                } catch {
                  // Skip
                }
              }
            }
          } finally {
            // Save the completed analysis result
            await supabase
              .from("kundli_analyses")
              .update({ result: fullResult })
              .eq("id", analysisId)
              .then(({ error }) => {
                if (error) console.error("Failed to save kundli result:", error);
              });

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
          "X-Kundli-Analysis-Id": analysisId,
        },
      });
    }

    // Unknown action
    return jsonResponse({ error: "Invalid action" }, CORS, 400);
  } catch (err) {
    console.error("kundli-analysis error:", err);
    captureException(err, { function: "kundli-analysis" });
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
