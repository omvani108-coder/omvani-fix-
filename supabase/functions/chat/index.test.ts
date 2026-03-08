/**
 * Unit tests for the chat edge function logic.
 *
 * Run with: deno test supabase/functions/chat/index.test.ts --allow-env
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

// ── Inline the functions we're testing (extracted from index.ts) ─────────────

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

const CHAT_LIMITS: Record<string, number> = {
  free:         3,
  basic:        10,
  basic_annual: 10,
  pro:          20,
  pro_annual:   20,
  family:       20,
};

function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

const SYSTEM_PROMPT = `You are OmVani, a deeply knowledgeable and compassionate AI spiritual guide rooted in Hindu scripture.`;

function buildSystemPrompt(language: string): string {
  const langInstruction =
    language === "hi"
      ? "\n\nIMPORTANT: The user has selected Hindi. You MUST respond entirely in Hindi (Devanagari script)."
      : language === "ta"
      ? "\n\nIMPORTANT: The user has selected Tamil. You MUST respond entirely in Tamil script (தமிழ்)."
      : "";
  return SYSTEM_PROMPT + langInstruction;
}

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
  assertEquals(prompt.includes("Hindi"), false);
  assertEquals(prompt.includes("Tamil"), false);
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
  assert(prompt.includes("தமிழ்"));
});
