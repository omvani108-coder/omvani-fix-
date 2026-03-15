import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { captureException } from "../_shared/sentry.ts";

// ── Report limits per plan ────────────────────────────────────────────────────
const REPORT_LIMITS: Record<string, { type: "lifetime" | "monthly"; limit: number }> = {
  free:         { type: "lifetime", limit: 1 },
  basic:        { type: "monthly",  limit: 14 },
  basic_annual: { type: "monthly",  limit: 14 },
  // Pro and Family: unlimited (not in this map)
};

function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function getMonthStartIST(): string {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

const SYSTEM_PROMPT = `You are OmVani's Sadhana Analyst — a wise, compassionate guide rooted in Sanatan Dharam.

Based on the user's daily sadhana questionnaire answers, generate a personalized daily report.

RULES:
1. Ground insights in traditional Hindu wisdom (Gita, Yoga Sutras, Vedas).
2. Be encouraging and constructive — never judgmental.
3. Give specific, actionable advice based on their actual answers.
4. The consistency_score should be 1-10 based on depth, duration, regularity, and variety of their practice.
5. Return ONLY valid JSON — no markdown, no explanation.

Return JSON in this exact format:
{
  "summary": "Brief overview of today's sadhana (2-3 sentences)",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Area 1", "Area 2"],
  "spiritual_progress": "What they may attain if they continue (2-3 sentences, based on scripture)",
  "recommendation": "One specific actionable suggestion for tomorrow",
  "consistency_score": 7
}`;

serve(async (req) => {
  const CORS = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    // ── Verify JWT ────────────────────────────────────────────────────────
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

    // ── Parse request ─────────────────────────────────────────────────────
    const { answers, language = "en", is_free = false, razorpay_payment_id } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return new Response(
        JSON.stringify({ error: "answers array is required" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    // ── Get user's plan ───────────────────────────────────────────────────
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", user.id)
      .maybeSingle();

    const plan = (sub?.plan as string) ?? "free";

    // ── Paywall check ─────────────────────────────────────────────────────
    const limitConfig = REPORT_LIMITS[plan];
    if (limitConfig) {
      let countQuery = supabase
        .from("sadhana_reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (limitConfig.type === "monthly") {
        countQuery = countQuery.gte("created_at", getMonthStartIST());
      }

      const { count } = await countQuery;
      const currentCount = count ?? 0;

      if (currentCount >= limitConfig.limit && !is_free && !razorpay_payment_id) {
        return new Response(
          JSON.stringify({
            error: "report_limit_reached",
            used: currentCount,
            limit: limitConfig.limit,
            plan,
          }),
          { status: 402, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
    }

    // ── Call Gemini Flash to generate report ─────────────────────────────
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const langInstruction =
      language === "hi"
        ? "\n\nRespond entirely in Hindi (Devanagari). Include Sanskrit terms."
        : language === "ta"
          ? "\n\nRespond entirely in Tamil. Include Sanskrit terms."
          : "";

    // Build the Q&A context
    const qaText = answers
      .map((a: { question: string; answer: string }, i: number) =>
        `Q${i + 1}: ${a.question}\nA: ${a.answer}`
      )
      .join("\n\n");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}${langInstruction}\n\nHere are my sadhana answers for today:\n\n${qaText}\n\nGenerate my daily sadhana report. Return only JSON.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return new Response(
        JSON.stringify({ error: `AI error: ${err}` }),
        { status: response.status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let report;
    try {
      report = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      report = match ? JSON.parse(match[0]) : {};
    }

    // ── Store report in database ──────────────────────────────────────────
    const paymentAmount = razorpay_payment_id ? 3000 : 0; // ₹30 in paise
    const paymentStatus = razorpay_payment_id ? "paid" : "free";

    const { data: savedReport, error: insertErr } = await supabase
      .from("sadhana_reports")
      .insert({
        user_id: user.id,
        questions: answers,
        report,
        consistency_score: report.consistency_score ?? null,
        is_free: is_free || !razorpay_payment_id,
        razorpay_payment_id: razorpay_payment_id ?? null,
        payment_amount: paymentAmount,
        payment_status: paymentStatus,
      })
      .select("id, created_at")
      .single();

    if (insertErr) {
      console.error("Failed to save sadhana report:", insertErr);
    }

    return new Response(
      JSON.stringify({
        report,
        reportId: savedReport?.id,
        createdAt: savedReport?.created_at,
      }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    captureException(err, { function: "sadhana-report" });
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
