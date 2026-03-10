/**
 * Pure logic for the elevenlabs-tts edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

// ── Daily TTS limits per plan ───────────────────────────────────────────────
export const TTS_LIMITS: Record<string, number> = {
  free: 5,
  basic: 20,
  basic_annual: 20,
  // pro, pro_annual, family → unlimited (not in map)
};

/** Default voice ID — Lily warm female voice */
export const DEFAULT_VOICE_ID = "pFZP5JQG7iQjIQuC4Bku";
