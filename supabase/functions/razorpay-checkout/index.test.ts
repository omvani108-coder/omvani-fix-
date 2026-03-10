/**
 * Unit tests for the razorpay-checkout edge function logic.
 *
 * Run with: deno test supabase/functions/razorpay-checkout/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { PLAN_STRUCTURE, VALID_PLAN_IDS, KUNDLI_AMOUNT } from "./logic.ts";

// ── Plan structure tests ────────────────────────────────────────────────────

Deno.test("Plans — has 5 valid plan IDs", () => {
  assertEquals(VALID_PLAN_IDS.length, 5);
  assert(VALID_PLAN_IDS.includes("basic"));
  assert(VALID_PLAN_IDS.includes("basic_annual"));
  assert(VALID_PLAN_IDS.includes("pro"));
  assert(VALID_PLAN_IDS.includes("pro_annual"));
  assert(VALID_PLAN_IDS.includes("family"));
});

Deno.test("Plans — invalid plans rejected", () => {
  assertEquals(VALID_PLAN_IDS.includes("free"), false);
  assertEquals(VALID_PLAN_IDS.includes("enterprise"), false);
  assertEquals(VALID_PLAN_IDS.includes(""), false);
});

Deno.test("Plans — monthly plans are subscription type", () => {
  assertEquals(PLAN_STRUCTURE["basic"].type, "subscription");
  assertEquals(PLAN_STRUCTURE["pro"].type, "subscription");
  assertEquals(PLAN_STRUCTURE["family"].type, "subscription");
});

Deno.test("Plans — annual plans are order type with amounts", () => {
  const basicAnnual = PLAN_STRUCTURE["basic_annual"];
  assertEquals(basicAnnual.type, "order");
  assertEquals(basicAnnual.amount, 149900); // ₹1,499
  assertEquals(basicAnnual.currency, "INR");

  const proAnnual = PLAN_STRUCTURE["pro_annual"];
  assertEquals(proAnnual.type, "order");
  assertEquals(proAnnual.amount, 299900); // ₹2,999
  assertEquals(proAnnual.currency, "INR");
});

Deno.test("Plans — subscription plans need razorpay_plan_id", () => {
  assert(PLAN_STRUCTURE["basic"].has_plan_id);
  assert(PLAN_STRUCTURE["pro"].has_plan_id);
  assert(PLAN_STRUCTURE["family"].has_plan_id);
});

Deno.test("Plans — order plans don't need razorpay_plan_id", () => {
  assertEquals(PLAN_STRUCTURE["basic_annual"].has_plan_id, false);
  assertEquals(PLAN_STRUCTURE["pro_annual"].has_plan_id, false);
});

Deno.test("Plans — pro annual is more expensive than basic annual", () => {
  assert(PLAN_STRUCTURE["pro_annual"].amount! > PLAN_STRUCTURE["basic_annual"].amount!);
});

Deno.test("Plans — all plans have display names", () => {
  for (const [id, config] of Object.entries(PLAN_STRUCTURE)) {
    assert(config.name.length > 3, `Plan ${id} should have a display name`);
  }
});

// ── Kundli pricing tests ────────────────────────────────────────────────────

Deno.test("Kundli amount — ₹79 flat (7900 paise)", () => {
  assertEquals(KUNDLI_AMOUNT, 7900);
});
