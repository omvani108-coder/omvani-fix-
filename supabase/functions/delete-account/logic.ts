/**
 * Pure logic for the delete-account edge function.
 *
 * Exported so tests can import directly — no copy-paste.
 */

/**
 * Tables to delete from, in order (respects foreign key constraints).
 * chat_messages depends on conversations, so it must be deleted first.
 */
export const DELETION_TABLE_ORDER = [
  "chat_messages",
  "conversations",
  "usage_logs",
  "reminder_logs",
  "reminder_preferences",
  "kundli_analyses",
  "subscriptions",
];
