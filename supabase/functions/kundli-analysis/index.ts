import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── CORS ────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  "https://omvani.in",
  "https://www.omvani.in",
  "https://omvani.app",
  "https://omvani.vercel.app",
  "https://dharma-companion.vercel.app",
  "http://localhost:8080",
];


function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[\w-]+-omvani[\w-]*\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/dharma-companion[\w-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

// ── Valid lenses ────────────────────────────────────────────────────────────

const VALID_LENSES = [
  "love", "career", "wealth", "health", "future", "spiritual", "marriage", "family",
] as const;

const LENS_LABELS: Record<string, string> = {
  love: "Love & Relationships",
  career: "Career & Success",
  wealth: "Wealth & Prosperity",
  health: "Health & Vitality",
  future: "Future & Destiny",
  spiritual: "Spiritual Path",
  marriage: "Marriage & Partnership",
  family: "Family & Children",
};

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

// ── System prompt builder ───────────────────────────────────────────────────

function buildSystemPrompt(
  fullName: string,
  dateOfBirth: string,
  timeOfBirth: string | null,
  placeOfBirth: string,
  lens: string,
): string {
  const lensLabel = LENS_LABELS[lens] ?? lens;
  const lensDescription = lensLabel;

  return `You are Jyotish Guru, an expert in Vedic astrology (Jyotish Shastra) with deep knowledge of \
Parashari and Jaimini systems, the Brihat Parashara Hora Shastra, nakshatras, dashas, and \
divisional charts.

A seeker has come to you for a kundli (birth chart) reading.

Seeker's details:
- Name: ${fullName}
- Date of Birth: ${dateOfBirth}
- Time of Birth: ${timeOfBirth || "unknown"}
- Place of Birth: ${placeOfBirth}
- Analysis requested: ${lensDescription}

Provide a detailed, insightful Vedic astrology analysis focused specifically on ${lensDescription}.

Structure your response as follows:
1. **Lagna & Key Planetary Positions** — briefly describe the ascendant and the most significant planetary influences relevant to this lens
2. **Core Reading** — the main detailed analysis for ${lensLabel} (3-5 paragraphs, specific and personal)
3. **Favourable Periods** — upcoming dasha/antardasha periods that support this area of life
4. **Remedies & Mantras** — 2-3 specific Vedic remedies (gemstones, fasting days, mantras, donations) tailored to strengthen the relevant planets
5. **Closing Blessing** — a short uplifting closure in the spirit of Jyotish

If birth time is unknown, clearly note that rising sign (lagna) cannot be determined, and base the reading on Chandra Lagna (Moon as ascendant) instead.

Respond in the language of the user's request. Be warm, compassionate, and specific — not generic.

Cite relevant Sanskrit shlokas from Brihat Parashara Hora Shastra or Phaladeepika where appropriate. Format using markdown-style bold headings (** **) that the frontend will render.

IMPORTANT: Do not make specific date predictions. Frame insights as tendencies and energies, \
not certainties. Include a brief note that Jyotish is a guide, not a deterministic system.`;
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  const CORS = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

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
      // Check if user has used their free kundli
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
      const pricePerAnalysis = isPaidPlan ? 2000 : 6000; // paise

      return jsonResponse(
        { hasUsedFree, isPaidPlan, pricePerAnalysis },
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

      // If claiming free, verify eligibility
      if (is_free) {
        const { data: hasUsed } = await supabase.rpc("has_used_free_kundli", {
          p_user_id: user.id,
        });
        if (hasUsed === true) {
          return jsonResponse(
            { error: "Free analysis already used" },
            CORS,
            403,
          );
        }
      }

      // Determine payment amount
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();
      const plan = (sub?.plan as string) ?? "free";
      const isPaidPlan =
        plan !== "free" &&
        ["basic", "basic_annual", "pro", "pro_annual", "family"].includes(plan);
      const paymentAmount = is_free ? 0 : isPaidPlan ? 2000 : 6000;

      // Create the analysis row
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

      // ── Call Anthropic API ────────────────────────────────────────────
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
        return jsonResponse(
          { error: `Anthropic error: ${err}` },
          CORS,
          response.status,
        );
      }

      if (!response.body) {
        throw new Error("Anthropic response did not include a stream body");
      }

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
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } },
    );
  }
});
