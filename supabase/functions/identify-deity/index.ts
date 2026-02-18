import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert in Hindu deities, temples, sacred art, rituals, and iconography with deep knowledge of Sanatana Dharma.

When given an image, identify what is shown and provide rich, respectful, and educational information.

You must respond with ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "name": "Name of deity/temple/ritual/sacred item",
  "type": "Deity" | "Temple" | "Ritual" | "Sacred Art" | "Festival" | "Sacred Object" | "Mantra/Symbol" | "Unknown",
  "confidence": "High" | "Medium" | "Low",
  "description": "2-3 sentence description of what this is",
  "significance": "Spiritual and religious significance in 2-3 sentences",
  "attributes": ["key attribute 1", "key attribute 2", "key attribute 3"],
  "associated_with": ["associated deity/concept 1", "associated deity/concept 2"],
  "mantras": ["relevant mantra or prayer if applicable"],
  "best_time_to_worship": "Best time/day/occasion for worship if applicable",
  "interesting_fact": "One fascinating fact about this deity/temple/ritual",
  "location": "Location if it's a temple, or 'Various temples across India' for deities"
}

If you cannot identify the image as anything Hindu/spiritual, set type to "Unknown" and provide a polite explanation in the description field.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please identify the deity, temple, ritual, or sacred element in this image and provide detailed information in the requested JSON format.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "";

    // Try to parse JSON from response
    let result;
    try {
      // Strip markdown code blocks if present
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        name: "Identification Result",
        type: "Unknown",
        confidence: "Low",
        description: rawContent,
        significance: "",
        attributes: [],
        associated_with: [],
        mantras: [],
        best_time_to_worship: "",
        interesting_fact: "",
        location: "",
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("identify-deity error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
