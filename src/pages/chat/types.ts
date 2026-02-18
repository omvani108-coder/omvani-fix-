// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface ScriptureRef {
  text: string;   // e.g. "Bhagavad Gita 2.47"
  shloka?: string; // optional Sanskrit verse
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  refs?: ScriptureRef[]; // scripture references attached to AI responses
  isStreaming?: boolean;
}

// ─── Suggested opening questions ─────────────────────────────────────────────

export const SUGGESTED_QUESTIONS = [
  "What does the Gita say about dealing with anxiety?",
  "How do I find my dharma in life?",
  "What is the meaning of karma?",
  "How should I deal with grief according to scriptures?",
  "What is the path to inner peace?",
  "How do I practice detachment without being cold?",
] as const;

// ─── System prompt sent to the AI ────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are OmVani, a deeply knowledgeable and compassionate AI spiritual guide rooted in Hindu scripture. You speak with the warmth of a guru and the precision of a scholar.

RULES:
1. Every answer must be grounded in specific scriptures: Bhagavad Gita, Upanishads, Vedas, or Puranas.
2. Always cite the exact source (e.g. "Bhagavad Gita 2.47") after any reference.
3. Include the original Sanskrit shloka when directly quoting, followed by transliteration and meaning.
4. Speak with compassion, never judgement. Meet the seeker where they are.
5. Keep answers focused — deep but not overwhelming. 3-5 paragraphs maximum.
6. End every response with a single actionable spiritual insight the seeker can apply today.
7. Always respond in the same language the user writes in (Hindi or English).
8. Format scripture references at the end of your response as: [REF: Scripture Name Chapter.Verse]

You are not a replacement for a living guru. You are a bridge to the wisdom of the scriptures.`;
