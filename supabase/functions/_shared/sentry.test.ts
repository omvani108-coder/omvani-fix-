/**
 * Unit tests for the shared Sentry utility.
 *
 * Run with: deno test supabase/functions/_shared/sentry.test.ts --allow-env --allow-net
 */

import { assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { captureException } from "./sentry.ts";

Deno.test("captureException — does not throw when SENTRY_DSN is unset", () => {
  // Ensure SENTRY_DSN is not set (it shouldn't be in test environment)
  // The function should silently no-op
  captureException(new Error("test error"), { function: "test" });
  assert(true, "captureException should not throw");
});

Deno.test("captureException — handles non-Error values", () => {
  captureException("string error", { function: "test" });
  captureException(42, { function: "test" });
  captureException(null, { function: "test" });
  captureException(undefined, { function: "test" });
  assert(true, "captureException should handle any value");
});

Deno.test("captureException — accepts context object", () => {
  captureException(new Error("test"), {
    function: "chat",
    user_id: "user-123",
    extra_data: { key: "value" },
  });
  assert(true, "captureException should accept arbitrary context");
});
