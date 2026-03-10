/**
 * Unit tests for the elevenlabs-tts edge function logic.
 *
 * Run with: deno test supabase/functions/elevenlabs-tts/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { TTS_LIMITS, DEFAULT_VOICE_ID } from "./logic.ts";

Deno.test("TTS limits — free plan gets 5/day", () => {
  assertEquals(TTS_LIMITS["free"], 5);
});

Deno.test("TTS limits — basic plan gets 20/day", () => {
  assertEquals(TTS_LIMITS["basic"], 20);
  assertEquals(TTS_LIMITS["basic_annual"], 20);
});

Deno.test("TTS limits — pro plan is unlimited (not in map)", () => {
  assertEquals(TTS_LIMITS["pro"], undefined);
  assertEquals(TTS_LIMITS["pro_annual"], undefined);
  assertEquals(TTS_LIMITS["family"], undefined);
});

Deno.test("DEFAULT_VOICE_ID — is set (Lily voice)", () => {
  assert(DEFAULT_VOICE_ID.length > 10, "Voice ID should be a non-trivial string");
});
