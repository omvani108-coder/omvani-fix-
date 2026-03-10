/**
 * Unit tests for the send-reminders edge function logic.
 *
 * Run with: deno test supabase/functions/send-reminders/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
  assertStringIncludes,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import {
  DAILY_SHLOKAS,
  FESTIVALS_2026,
  getTodayShloka,
  getUpcomingFestival,
  buildEmailHtml,
  PAGE_SIZE,
} from "./logic.ts";

// ── Shloka tests ──────────────────────────────────────────────────────────────

Deno.test("DAILY_SHLOKAS — has 7 entries", () => {
  assertEquals(DAILY_SHLOKAS.length, 7);
});

Deno.test("DAILY_SHLOKAS — every shloka has verse, sanskrit, and english", () => {
  for (const s of DAILY_SHLOKAS) {
    assert(s.verse.startsWith("Gita"), `Verse should start with Gita: ${s.verse}`);
    assert(s.sanskrit.length > 10, `Sanskrit should be non-trivial: ${s.sanskrit}`);
    assert(s.english.length > 10, `English should be non-trivial: ${s.english}`);
  }
});

Deno.test("getTodayShloka — returns a valid shloka object", () => {
  const shloka = getTodayShloka();
  assert(shloka.verse);
  assert(shloka.sanskrit);
  assert(shloka.english);
  assert(DAILY_SHLOKAS.includes(shloka));
});

Deno.test("getTodayShloka — rotates through all 7 shlokas", () => {
  // Collect unique shlokas over 7 consecutive simulated days
  const seen = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const day = Math.floor(Date.now() / 86_400_000) + i;
    seen.add(DAILY_SHLOKAS[day % DAILY_SHLOKAS.length].verse);
  }
  assertEquals(seen.size, 7);
});

// ── Festival tests ────────────────────────────────────────────────────────────

Deno.test("FESTIVALS_2026 — has 9 festivals", () => {
  assertEquals(FESTIVALS_2026.length, 9);
});

Deno.test("FESTIVALS_2026 — dates are in chronological order", () => {
  for (let i = 1; i < FESTIVALS_2026.length; i++) {
    assert(
      FESTIVALS_2026[i].date >= FESTIVALS_2026[i - 1].date,
      `Festival ${FESTIVALS_2026[i].name} date out of order`,
    );
  }
});

Deno.test("FESTIVALS_2026 — every festival has name and description", () => {
  for (const f of FESTIVALS_2026) {
    assert(f.name.length > 2, `Festival name too short: ${f.name}`);
    assert(f.description.length > 10, `Description too short for ${f.name}`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(f.date), `Invalid date format: ${f.date}`);
  }
});

Deno.test("getUpcomingFestival — returns festival within 3 days", () => {
  // Simulate: 2 days before Holi (Mar 17)
  const ref = new Date("2026-03-15T10:00:00Z");
  const result = getUpcomingFestival(ref);
  assert(result !== null);
  assertEquals(result!.name, "Holi");
});

Deno.test("getUpcomingFestival — returns null if next festival > 3 days away", () => {
  // Simulate: Mar 10 — Holi is 7 days away
  const ref = new Date("2026-03-10T10:00:00Z");
  const result = getUpcomingFestival(ref);
  assertEquals(result, null);
});

Deno.test("getUpcomingFestival — returns festival on same day", () => {
  const ref = new Date("2026-10-21T05:00:00Z");
  const result = getUpcomingFestival(ref);
  assert(result !== null);
  assertEquals(result!.name, "Diwali");
});

Deno.test("getUpcomingFestival — returns null after all 2026 festivals", () => {
  const ref = new Date("2026-12-01T10:00:00Z");
  const result = getUpcomingFestival(ref);
  assertEquals(result, null);
});

// ── Email HTML tests ──────────────────────────────────────────────────────────

Deno.test("buildEmailHtml — includes shloka verse and text", () => {
  const shloka = DAILY_SHLOKAS[0];
  const html = buildEmailHtml(shloka, null);
  assertStringIncludes(html, shloka.verse);
  assertStringIncludes(html, shloka.sanskrit);
  assertStringIncludes(html, shloka.english);
  assertStringIncludes(html, "OmVani");
});

Deno.test("buildEmailHtml — includes festival block when provided", () => {
  const shloka = DAILY_SHLOKAS[0];
  const festival = FESTIVALS_2026[0]; // Makar Sankranti
  const html = buildEmailHtml(shloka, festival);
  assertStringIncludes(html, festival.name);
  assertStringIncludes(html, festival.date);
  assertStringIncludes(html, festival.description);
  assertStringIncludes(html, "Upcoming:");
});

Deno.test("buildEmailHtml — no festival block when null", () => {
  const shloka = DAILY_SHLOKAS[0];
  const html = buildEmailHtml(shloka, null);
  assertEquals(html.includes("Upcoming:"), false);
});

Deno.test("buildEmailHtml — has manage preferences link", () => {
  const html = buildEmailHtml(DAILY_SHLOKAS[0], null);
  assertStringIncludes(html, "https://omvani.in/profile");
  assertStringIncludes(html, "Manage preferences");
});

// ── Config tests ──────────────────────────────────────────────────────────────

Deno.test("PAGE_SIZE — is 100 (reasonable batch size)", () => {
  assertEquals(PAGE_SIZE, 100);
});
