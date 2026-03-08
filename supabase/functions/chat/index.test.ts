/**
 * Unit tests for the chat edge function logic.
 *
 * Run with: deno test supabase/functions/chat/index.test.ts --allow-env --allow-net
 *
 * These tests verify:
 *   1. CORS origin validation (allowlist + regex patterns)
 *   2. Chat daily limits per plan
 *   3. IST date helper
 *   4. System prompt construction
 */

import {
  assertEquals,
  assertMatch,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

// ── Import directly from source — no copy-paste ─────────────────────────────
import { ALLOWED_ORIGINS, isAllowedOrigin } from "../_shared/cors.ts";
import { CHAT_LIMITS, getTodayIST, SYSTEM_PROMPT, buildSystemPrompt } from "./logic.ts";

// ── Tests ────────────────────────────────────────────────────────────────────

Deno.test("CORS — allows exact origins", () => {
  assert(isAllowedOrigin("https://omvani.in"));
  assert(isAllowedOrigin("https://www.omvani.in"));
  assert(isAllowedOrigin("https://omvani.vercel.app"));
  assert(isAllowedOrigin("http://localhost:8080"));
});

Deno.test("CORS — allows Vercel preview deployments", () => {
  assert(isAllowedOrigin("https://feat-xyz-omvani.vercel.app"));
  assert(isAllowedOrigin("https://fix-123-omvani-abc.vercel.app"));
});

Deno.test("CORS — rejects unknown origins", () => {
  assertEquals(isAllowedOrigin("https://evil.com"), false);
  assertEquals(isAllowedOrigin("https://omvani.evil.com"), false);
  assertEquals(isAllowedOrigin("http://omvani.in"), false); // http, not https
  assertEquals(isAllowedOrigin("https://omvani.in.evil.com"), false);
  assertEquals(isAllowedOrigin(""), false);
});

Deno.test("CORS — rejects crafted origins that look similar", () => {
  assertEquals(isAllowedOrigin("https://notomvani.vercel.app"), false);
  assertEquals(isAllowedOrigin("https://omvani.vercel.app.evil.com"), false);
});

Deno.test("Chat limits — free plan has 3 chats/day", () => {
  assertEquals(CHAT_LIMITS["free"], 3);
});

Deno.test("Chat limits — basic plan has 10 chats/day", () => {
  assertEquals(CHAT_LIMITS["basic"], 10);
  assertEquals(CHAT_LIMITS["basic_annual"], 10);
});

Deno.test("Chat limits — pro plan has 20 chats/day", () => {
  assertEquals(CHAT_LIMITS["pro"], 20);
  assertEquals(CHAT_LIMITS["pro_annual"], 20);
  assertEquals(CHAT_LIMITS["family"], 20);
});

Deno.test("Chat limits — unknown plan returns undefined (no limit)", () => {
  assertEquals(CHAT_LIMITS["nonexistent"], undefined);
});

Deno.test("getTodayIST returns YYYY-MM-DD format", () => {
  const today = getTodayIST();
  assertMatch(today, /^\d{4}-\d{2}-\d{2}$/);
});

Deno.test("buildSystemPrompt — English (default)", () => {
  const prompt = buildSystemPrompt("en");
  assert(prompt.includes("OmVani"));
  // English prompt should NOT have the appended Hindi/Tamil language instructions
  assertEquals(prompt.includes("You MUST respond entirely in Hindi"), false);
  assertEquals(prompt.includes("You MUST respond entirely in Tamil"), false);
});

Deno.test("buildSystemPrompt — Hindi adds Hindi instruction", () => {
  const prompt = buildSystemPrompt("hi");
  assert(prompt.includes("OmVani"));
  assert(prompt.includes("Hindi"));
  assert(prompt.includes("Devanagari"));
});

Deno.test("buildSystemPrompt — Tamil adds Tamil instruction", () => {
  const prompt = buildSystemPrompt("ta");
  assert(prompt.includes("OmVani"));
  assert(prompt.includes("Tamil"));
  assert(prompt.includes("\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"));
});
