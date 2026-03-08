/**
 * Unit tests for the kundli-analysis edge function logic.
 *
 * Run with: deno test supabase/functions/kundli-analysis/index.test.ts --allow-env --allow-net
 *
 * These tests verify:
 *   1. CORS origin validation
 *   2. Valid lens validation
 *   3. System prompt construction
 *   4. Monthly free allowance logic
 *   5. Pricing constants
 */

import {
  assertEquals,
  assert,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

// ── Import directly from source — no copy-paste ─────────────────────────────
import { isAllowedOrigin } from "../_shared/cors.ts";
import {
  VALID_LENSES,
  LENS_LABELS,
  KUNDLI_PRICE_PER_ANALYSIS,
  MONTHLY_FREE,
  buildSystemPrompt,
} from "./logic.ts";

// ── Tests ────────────────────────────────────────────────────────────────────

Deno.test("CORS — allows production origins", () => {
  assert(isAllowedOrigin("https://omvani.in"));
  assert(isAllowedOrigin("https://www.omvani.in"));
});

Deno.test("CORS — rejects unknown origins", () => {
  assertEquals(isAllowedOrigin("https://attacker.com"), false);
  assertEquals(isAllowedOrigin(""), false);
});

Deno.test("Valid lenses — all 8 lenses are defined", () => {
  assertEquals(VALID_LENSES.length, 8);
  assert(VALID_LENSES.includes("love"));
  assert(VALID_LENSES.includes("career"));
  assert(VALID_LENSES.includes("wealth"));
  assert(VALID_LENSES.includes("health"));
  assert(VALID_LENSES.includes("future"));
  assert(VALID_LENSES.includes("spiritual"));
  assert(VALID_LENSES.includes("marriage"));
  assert(VALID_LENSES.includes("family"));
});

Deno.test("Valid lenses — invalid lens rejected", () => {
  assertEquals(VALID_LENSES.includes("invalid" as any), false);
  assertEquals(VALID_LENSES.includes("" as any), false);
});

Deno.test("Lens labels — all lenses have labels", () => {
  for (const lens of VALID_LENSES) {
    assert(LENS_LABELS[lens], `Missing label for lens: ${lens}`);
  }
});

Deno.test("buildSystemPrompt — includes seeker details", () => {
  const prompt = buildSystemPrompt(
    "Arjun Sharma",
    "1995-03-15",
    "08:30",
    "Mumbai, Maharashtra, India",
    "career",
  );
  assertStringIncludes(prompt, "Arjun Sharma");
  assertStringIncludes(prompt, "1995-03-15");
  assertStringIncludes(prompt, "08:30");
  assertStringIncludes(prompt, "Mumbai, Maharashtra, India");
  assertStringIncludes(prompt, "Career & Success");
});

Deno.test("buildSystemPrompt — handles unknown birth time", () => {
  const prompt = buildSystemPrompt(
    "Test User",
    "2000-01-01",
    null,
    "Delhi, India",
    "love",
  );
  assertStringIncludes(prompt, "unknown");
  assertStringIncludes(prompt, "Love & Relationships");
});

Deno.test("buildSystemPrompt — handles unknown lens gracefully", () => {
  const prompt = buildSystemPrompt(
    "Test User",
    "2000-01-01",
    null,
    "Delhi, India",
    "nonexistent",
  );
  // Falls back to the raw lens string
  assertStringIncludes(prompt, "nonexistent");
});

// This now tests the ACTUAL exported constant from the source code,
// not a local copy. If the edge function price changes, this test catches it.
Deno.test("Pricing — flat ₹79 (7900 paise) for all users", () => {
  assertEquals(KUNDLI_PRICE_PER_ANALYSIS, 7900);
});

Deno.test("Monthly free allowances — free plan gets 0", () => {
  assertEquals(MONTHLY_FREE["free"] ?? 0, 0);
});

Deno.test("Monthly free allowances — basic plan gets 1/month", () => {
  assertEquals(MONTHLY_FREE["basic"], 1);
  assertEquals(MONTHLY_FREE["basic_annual"], 1);
});

Deno.test("Monthly free allowances — pro plan gets 2/month", () => {
  assertEquals(MONTHLY_FREE["pro"], 2);
  assertEquals(MONTHLY_FREE["pro_annual"], 2);
  assertEquals(MONTHLY_FREE["family"], 2);
});

Deno.test("Monthly free remaining calculation", () => {
  // Simulate: pro user with 1 reading this month
  const plan = "pro";
  const allowance = MONTHLY_FREE[plan] ?? 0;
  const monthlyReadings = 1;
  const remaining = Math.max(0, allowance - monthlyReadings);
  assertEquals(remaining, 1); // 2 allowance - 1 used = 1 remaining

  // Simulate: basic user with 1 reading (used up)
  const basicRemaining = Math.max(0, (MONTHLY_FREE["basic"] ?? 0) - 1);
  assertEquals(basicRemaining, 0);

  // Simulate: pro user with 3 readings (exceeded)
  const exceededRemaining = Math.max(0, (MONTHLY_FREE["pro"] ?? 0) - 3);
  assertEquals(exceededRemaining, 0);
});
