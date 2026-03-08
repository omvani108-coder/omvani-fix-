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

// ─── DB row → Message converter ──────────────────────────────────────────────

export function dbRowToMessage(row: {
  id: string;
  role: string;
  content: string;
  created_at: string;
  source_references: unknown;
}): Message {
  const refs = Array.isArray(row.source_references)
    ? (row.source_references as { text: string }[]).map((r) => ({ text: r.text }))
    : [];
  return {
    id: row.id,
    role: row.role as "user" | "assistant",
    content: row.content,
    timestamp: new Date(row.created_at),
    refs: refs.length > 0 ? refs : undefined,
  };
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

