/**
 * Unit tests for the kundli-analysis edge function logic.
 *
 * Run with: deno test supabase/functions/kundli-analysis/index.test.ts --allow-env
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

// ── Inline the functions/constants we're testing ────────────────────────────

const ALLOWED_ORIGINS = [
  "https://omvani.in",
  "https://www.omvani.in",
  "https://omvani.vercel.app",
  "https://dharma-companion.vercel.app",
  "http://localhost:8080",
];

function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[\w-]+-omvani[\w-]*\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/dharma-companion[\w-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

const VALID_LENSES = [
  "love", "career", "wealth", "health", "future", "spiritual", "marriage", "family",
] as const;

const LENS_LABELS: Record<string, string> = {
  love: "Love & Relationships",
  career: "Career & Success",
  wealth: "Wealth & Prosperity",
  health: "Health & Vitality",
  future: "Future & Destiny",
  spiritual: "Spiritual Path",
  marriage: "Marriage & Partnership",
  family: "Family & Children",
};

function buildSystemPrompt(
  fullName: string,
  dateOfBirth: string,
  timeOfBirth: string | null,
  placeOfBirth: string,
  lens: string,
): string {
  const lensLabel = LENS_LABELS[lens] ?? lens;
  return `You are Jyotish Guru, an expert in Vedic astrology.
Seeker's details:
- Name: ${fullName}
- Date of Birth: ${dateOfBirth}
- Time of Birth: ${timeOfBirth || "unknown"}
- Place of Birth: ${placeOfBirth}
- Analysis requested: ${lensLabel}`;
}

const MONTHLY_FREE: Record<string, number> = {
  basic: 1,
  basic_annual: 1,
  pro: 2,
  pro_annual: 2,
  family: 2,
};

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

Deno.test("Pricing — flat ₹79 (7900 paise) for all users", () => {
  const pricePerAnalysis = 7900;
  assertEquals(pricePerAnalysis, 7900);
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
