/**
 * Lightweight Sentry error reporting for Supabase Edge Functions (Deno).
 *
 * Uses the Sentry Store API directly via fetch — no SDK dependency needed.
 * Fire-and-forget: never blocks the request or throws on failure.
 *
 * Usage:
 *   import { captureException } from "../_shared/sentry.ts";
 *   captureException(err, { function: "chat", user_id: "..." });
 */

interface SentryContext {
  /** Edge function name, e.g. "chat", "kundli-analysis" */
  function?: string;
  /** Optional user id for context */
  user_id?: string;
  /** Any extra data to attach */
  [key: string]: unknown;
}

/** Parse a Sentry DSN into its parts. */
function parseDsn(dsn: string) {
  // Format: https://<public_key>@<host>/<project_id>
  const match = dsn.match(
    /^https?:\/\/([a-f0-9]+)@([^/]+)\/(\d+)$/,
  );
  if (!match) return null;
  return { publicKey: match[1], host: match[2], projectId: match[3] };
}

/**
 * Send an error event to Sentry via the Store API.
 *
 * Non-blocking — returns immediately without awaiting the fetch.
 * Silently no-ops if SENTRY_DSN is not configured.
 */
export function captureException(
  error: unknown,
  context: SentryContext = {},
): void {
  try {
    const dsn = Deno.env.get("SENTRY_DSN");
    if (!dsn) return; // Sentry not configured — silently skip

    const parsed = parseDsn(dsn);
    if (!parsed) {
      console.error("[sentry] Invalid SENTRY_DSN format");
      return;
    }

    const err =
      error instanceof Error
        ? error
        : new Error(String(error));

    const event = {
      event_id: crypto.randomUUID().replace(/-/g, ""),
      timestamp: new Date().toISOString(),
      platform: "node",
      level: "error",
      server_name: "supabase-edge",
      environment: Deno.env.get("ENVIRONMENT") ?? "production",
      tags: {
        runtime: "deno",
        edge_function: context.function ?? "unknown",
      },
      user: context.user_id ? { id: context.user_id } : undefined,
      extra: context,
      exception: {
        values: [
          {
            type: err.name,
            value: err.message,
            stacktrace: err.stack
              ? {
                  frames: err.stack
                    .split("\n")
                    .slice(1, 20) // up to 20 frames
                    .map((line: string) => ({ filename: line.trim() })),
                }
              : undefined,
          },
        ],
      },
    };

    const url = `https://${parsed.host}/api/${parsed.projectId}/store/`;

    // Fire-and-forget — don't await or block the response
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${parsed.publicKey}, sentry_client=omvani-edge/1.0`,
      },
      body: JSON.stringify(event),
    }).catch(() => {
      // Silently ignore — we never want Sentry to break the edge function
    });
  } catch {
    // Absolute last resort — never let Sentry crash the function
  }
}
