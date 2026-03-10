/**
 * Pure logic for the identify-deity edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

// ── Daily identify limits per plan ──────────────────────────────────────────
export const IDENTIFY_LIMITS: Record<string, number> = {
  free:         1,
  basic:        3,
  basic_annual: 3,
  // pro, pro_annual, family → unlimited (not in this map)
};

/** Maximum base64 image size in bytes (5MB base64 ≈ 3.75MB raw) */
export const MAX_IMAGE_SIZE = 5_000_000;
