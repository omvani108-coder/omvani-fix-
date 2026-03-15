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

    // ── Check daily TTS usage limit ──────────────────────────────────────
    const TTS_LIMITS: Record<string, number> = {
      free: 5, basic: 20, basic_annual: 20,
      // pro, pro_annual, family → unlimited (not in map)
    };

    const { data: sub } = await supabase
      .from("subscriptions").select("plan")
      .eq("user_id", user.id).maybeSingle();
    const plan = (sub?.plan as string) ?? "free";

    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const ttsLimit = TTS_LIMITS[plan];

    if (ttsLimit !== undefined) {
      const { data: usageRow } = await supabase
        .from("usage_logs").select("count")
        .eq("user_id", user.id).eq("feature", "tts").eq("date_ist", todayIST)
        .maybeSingle();

      if ((usageRow?.count ?? 0) >= ttsLimit) {
        return new Response(JSON.stringify({ error: "Daily TTS limit reached" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { text, voiceId } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reject oversized text to prevent excessive ElevenLabs API costs
    if (text.length > 5000) {
      return new Response(JSON.stringify({ error: "Text too long. Maximum 5000 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    // Validate voiceId to prevent path traversal / injection
    const VOICE_ID_PATTERN = /^[a-zA-Z0-9]{10,30}$/;
    const selectedVoice = (voiceId && VOICE_ID_PATTERN.test(voiceId))
      ? voiceId
      : "pFZP5JQG7iQjIQuC4Bku"; // Lily - warm female voice

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}/stream?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs TTS error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Text-to-speech failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Increment TTS usage after successful response
    if (ttsLimit !== undefined) {
      await supabase.rpc("increment_usage", {
        p_user_id: user.id, p_feature: "tts", p_date_ist: todayIST,
      }).then(({ error: incErr }) => {
        if (incErr) console.error("Failed to increment TTS usage:", incErr);
      });
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e) {
    console.error("TTS error:", e);
    captureException(e, { function: "elevenlabs-tts" });
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
