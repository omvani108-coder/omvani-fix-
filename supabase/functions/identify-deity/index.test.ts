/**
 * Unit tests for the identify-deity edge function logic.
 *
 * Run with: deno test supabase/functions/identify-deity/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { isAllowedOrigin } from "../_shared/cors.ts";
import { IDENTIFY_LIMITS, MAX_IMAGE_SIZE } from "./logic.ts";

// ── Limit tests ─────────────────────────────────────────────────────────────

Deno.test("Identify limits — free plan gets 1/day", () => {
  assertEquals(IDENTIFY_LIMITS["free"], 1);
});

Deno.test("Identify limits — basic plan gets 3/day", () => {
  assertEquals(IDENTIFY_LIMITS["basic"], 3);
  assertEquals(IDENTIFY_LIMITS["basic_annual"], 3);
});

Deno.test("Identify limits — pro plan is unlimited (not in map)", () => {
  assertEquals(IDENTIFY_LIMITS["pro"], undefined);
  assertEquals(IDENTIFY_LIMITS["pro_annual"], undefined);
  assertEquals(IDENTIFY_LIMITS["family"], undefined);
});

Deno.test("Identify limits — unknown plan is unlimited (not in map)", () => {
  assertEquals(IDENTIFY_LIMITS["nonexistent"], undefined);
});

// ── Size limits ─────────────────────────────────────────────────────────────

Deno.test("MAX_IMAGE_SIZE — is 5MB (base64)", () => {
  assertEquals(MAX_IMAGE_SIZE, 5_000_000);
});

// ── CORS — verifies shared module works ─────────────────────────────────────

Deno.test("CORS — allows production origin", () => {
  assert(isAllowedOrigin("https://omvani.in"));
});

Deno.test("CORS — rejects evil origin", () => {
  assertEquals(isAllowedOrigin("https://evil.com"), false);
});
