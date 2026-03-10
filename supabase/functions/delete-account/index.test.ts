/**
 * Unit tests for the delete-account edge function logic.
 *
 * Run with: deno test supabase/functions/delete-account/index.test.ts --allow-env --allow-net
 */

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";

import { DELETION_TABLE_ORDER } from "./logic.ts";

Deno.test("Deletion order — has 7 tables", () => {
  assertEquals(DELETION_TABLE_ORDER.length, 7);
});

Deno.test("Deletion order — chat_messages before conversations (FK constraint)", () => {
  const messagesIdx = DELETION_TABLE_ORDER.indexOf("chat_messages");
  const convoIdx = DELETION_TABLE_ORDER.indexOf("conversations");
  assert(messagesIdx < convoIdx, "chat_messages must be deleted before conversations");
});

Deno.test("Deletion order — subscriptions is last (most independent)", () => {
  assertEquals(DELETION_TABLE_ORDER[DELETION_TABLE_ORDER.length - 1], "subscriptions");
});

Deno.test("Deletion order — includes all expected tables", () => {
  const expected = [
    "chat_messages",
    "conversations",
    "usage_logs",
    "reminder_logs",
    "reminder_preferences",
    "kundli_analyses",
    "subscriptions",
  ];
  for (const table of expected) {
    assert(DELETION_TABLE_ORDER.includes(table), `Missing table: ${table}`);
  }
});

Deno.test("Deletion order — reminder_logs before reminder_preferences (FK)", () => {
  const logsIdx = DELETION_TABLE_ORDER.indexOf("reminder_logs");
  const prefsIdx = DELETION_TABLE_ORDER.indexOf("reminder_preferences");
  assert(logsIdx < prefsIdx, "reminder_logs must be deleted before reminder_preferences");
});
