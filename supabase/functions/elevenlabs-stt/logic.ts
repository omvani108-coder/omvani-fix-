/**
 * Pure logic for the elevenlabs-stt edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

// ── Daily STT limits per plan ───────────────────────────────────────────────
export const STT_LIMITS: Record<string, number> = {
  free: 5,
  basic: 20,
  basic_annual: 20,
  // pro, pro_annual, family → unlimited (not in map)
};

/** Valid app languages and their ElevenLabs language codes */
export const LANGUAGE_MAP: Record<string, string> = {
  en: "eng",
  hi: "hin",
  ta: "tam",
};

export const VALID_LANGUAGES = ["en", "hi", "ta"] as const;

/** Sanitize a language code to a valid value */
export function sanitizeLanguage(lang: string | undefined): string {
  if (lang && VALID_LANGUAGES.includes(lang as typeof VALID_LANGUAGES[number])) return lang;
  return "en";
}
