/**
 * Shared CORS configuration for all Supabase Edge Functions.
 *
 * Single source of truth — both edge function handlers and Deno tests
 * import from here, so values can never drift.
 */

export const ALLOWED_ORIGINS = [
  "https://omvani.in",
  "https://www.omvani.in",
  "https://omvani.vercel.app",
  "https://dharma-companion.vercel.app",
  "http://localhost:8080",
];

export function isAllowedOrigin(origin: string): boolean {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[\w-]+-omvani[\w-]*\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/dharma-companion[\w-]*\.vercel\.app$/.test(origin)) return true;
  return false;
}

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}
