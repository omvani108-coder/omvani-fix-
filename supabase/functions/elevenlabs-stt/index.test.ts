/**
 * Unit tests for the elevenlabs-stt edge function logic.
 *
 * Run with: deno test supabase/functions/elevenlabs-stt/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { STT_LIMITS, LANGUAGE_MAP, VALID_LANGUAGES, sanitizeLanguage } from "./logic.ts";

Deno.test("STT limits — free plan gets 5/day", () => {
  assertEquals(STT_LIMITS["free"], 5);
});

Deno.test("STT limits — basic plan gets 20/day", () => {
  assertEquals(STT_LIMITS["basic"], 20);
  assertEquals(STT_LIMITS["basic_annual"], 20);
});

Deno.test("STT limits — pro plan is unlimited (not in map)", () => {
  assertEquals(STT_LIMITS["pro"], undefined);
  assertEquals(STT_LIMITS["pro_annual"], undefined);
  assertEquals(STT_LIMITS["family"], undefined);
});

Deno.test("LANGUAGE_MAP — maps all 3 app languages to ElevenLabs codes", () => {
  assertEquals(LANGUAGE_MAP["en"], "eng");
  assertEquals(LANGUAGE_MAP["hi"], "hin");
  assertEquals(LANGUAGE_MAP["ta"], "tam");
});

Deno.test("LANGUAGE_MAP — has exactly 3 entries", () => {
  assertEquals(Object.keys(LANGUAGE_MAP).length, 3);
});

Deno.test("VALID_LANGUAGES — has en, hi, ta", () => {
  assertEquals(VALID_LANGUAGES.length, 3);
  assert(VALID_LANGUAGES.includes("en"));
  assert(VALID_LANGUAGES.includes("hi"));
  assert(VALID_LANGUAGES.includes("ta"));
});

Deno.test("sanitizeLanguage — accepts valid languages", () => {
  assertEquals(sanitizeLanguage("en"), "en");
  assertEquals(sanitizeLanguage("hi"), "hi");
  assertEquals(sanitizeLanguage("ta"), "ta");
});

Deno.test("sanitizeLanguage — defaults to 'en' for invalid input", () => {
  assertEquals(sanitizeLanguage("fr"), "en");
  assertEquals(sanitizeLanguage(""), "en");
  assertEquals(sanitizeLanguage(undefined), "en");
});
