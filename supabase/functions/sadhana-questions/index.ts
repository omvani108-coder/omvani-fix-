import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { captureException } from "../_shared/sentry.ts";

const SYSTEM_PROMPT = `You are an AI assistant for OmVani, a Hindu spiritual practice (sadhana) tracking app.

Generate a daily sadhana questionnaire with 6-7 questions to understand the user's spiritual practice for today.

RULES:
1. Each question must have 3-5 contextually relevant multiple-choice options.
2. Questions should cover: type of practice, duration, technique, emotional/spiritual state, goals, obstacles, consistency, and special experiences.
3. Vary the questions slightly — don't ask the exact same set every time.
4. Keep questions warm, encouraging, and non-judgmental.
5. Options should be practical and relatable.
6. Return ONLY valid JSON — no markdown, no explanation.

Return a JSON array in this exact format:
[
  {
    "id": "q1",
    "question": "What sadhana did you practice today?",
    "options": ["Japa (Mantra chanting)", "Dhyana (Meditation)", "Pranayama (Breathing)", "Kirtan / Bhajan", "Scripture Reading"]
  }
]`;

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
    const { language = "en" } = await req.json().catch(() => ({}));

    const langInstruction =
      language === "hi"
        ? "\n\nGenerate questions and options in Hindi (Devanagari script). Keep spiritual terms in Sanskrit with Hindi explanation."
        : language === "ta"
          ? "\n\nGenerate questions and options in Tamil. Keep spiritual terms in Sanskrit with Tamil explanation."
          : "";

    // ── Call Gemini Flash to generate questions ─────────────────────────
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const dayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "Asia/Kolkata" });

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
                  text: `${SYSTEM_PROMPT}${langInstruction}\n\nGenerate today's sadhana questionnaire. Today is ${dayOfWeek}. Return only the JSON array.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1024,
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
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    // Parse the JSON from the AI response
    let questions;
    try {
      questions = JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const match = text.match(/\[[\s\S]*\]/);
      questions = match ? JSON.parse(match[0]) : [];
    }

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    captureException(err, { function: "sadhana-questions" });
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
