import { supabase } from "@/integrations/supabase/client";

/**
 * Stream an AI response from the chat edge function.
 * Calls onChunk with the accumulated text as each chunk arrives.
 */
export async function streamAI(
  prompt: string,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
  }

  // Use the user's session token if logged in, otherwise fall back to anon key
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? supabaseKey;

  const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      apikey: supabaseKey,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      system:
        "You are OmVani, a compassionate AI spiritual guide rooted in Hindu scripture and yoga philosophy. Answer questions about sacred texts with wisdom, warmth and precision. When the user asks verbally, keep answers to 2-3 paragraphs — clear and spoken-friendly.",
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Chat request failed (${res.status}): ${body || "Unknown error"}`);
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      onChunk(accumulated);
    }
  }
}
