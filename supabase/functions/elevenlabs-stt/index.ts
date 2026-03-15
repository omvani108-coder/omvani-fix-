import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { captureException } from "../_shared/sentry.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // ── Verify JWT ────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Check daily STT usage limit ──────────────────────────────────────
    const STT_LIMITS: Record<string, number> = {
      free: 5, basic: 20, basic_annual: 20,
      // pro, pro_annual, family → unlimited (not in map)
    };

    const { data: sub } = await supabase
      .from("subscriptions").select("plan")
      .eq("user_id", user.id).maybeSingle();
    const plan = (sub?.plan as string) ?? "free";

    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const sttLimit = STT_LIMITS[plan];

    if (sttLimit !== undefined) {
      const { data: usageRow } = await supabase
        .from("usage_logs").select("count")
        .eq("user_id", user.id).eq("feature", "stt").eq("date_ist", todayIST)
        .maybeSingle();

      if ((usageRow?.count ?? 0) >= sttLimit) {
        return new Response(JSON.stringify({ error: "Daily STT limit reached" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio");
    const rawLang = formData.get("language") as string || "en";
    const language = ["en", "hi", "ta"].includes(rawLang) ? rawLang : "en";

    if (!audioFile || !(audioFile instanceof File)) {
      return new Response(JSON.stringify({ error: "No audio file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reject oversized audio to prevent excessive ElevenLabs API costs
    if (audioFile.size > 10_000_000) {
      return new Response(JSON.stringify({ error: "Audio file too large. Maximum 10MB." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    const apiFormData = new FormData();
    apiFormData.append("file", audioFile);
    apiFormData.append("model_id", "scribe_v2");

    // Map language codes (ta = Tamil)
    const langMap: Record<string, string> = { en: "eng", hi: "hin", ta: "tam" };
    apiFormData.append("language_code", langMap[language] || "eng");

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs STT error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Speech-to-text failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transcription = await response.json();

    // Increment STT usage after successful transcription
    if (sttLimit !== undefined) {
      await supabase.rpc("increment_usage", {
        p_user_id: user.id, p_feature: "stt", p_date_ist: todayIST,
      }).then(({ error: incErr }) => {
        if (incErr) console.error("Failed to increment STT usage:", incErr);
      });
    }

    return new Response(JSON.stringify(transcription), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("STT error:", e);
    captureException(e, { function: "elevenlabs-stt" });
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
