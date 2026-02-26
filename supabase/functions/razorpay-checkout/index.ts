import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://omvani.app",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

// ── Plan configuration ──────────────────────────────────────────────────────
// razorpay_plan_id is the ID you create in the Razorpay dashboard for
// recurring subscriptions.  One-time (annual) plans use amount instead.

interface PlanConfig {
  name: string;
  type: "subscription" | "order";
  razorpay_plan_id?: string;        // only for subscriptions
  amount?: number;                   // paise — only for one-time orders
  currency?: string;
}

const PLANS: Record<string, PlanConfig> = {
  basic: {
    name: "Sadhak Monthly",
    type: "subscription",
    razorpay_plan_id: Deno.env.get("RAZORPAY_PLAN_BASIC"),
  },
  basic_annual: {
    name: "Sadhak Annual",
    type: "order",
    amount: 149900,   // ₹1,499
    currency: "INR",
  },
  pro: {
    name: "Guru Monthly",
    type: "subscription",
    razorpay_plan_id: Deno.env.get("RAZORPAY_PLAN_PRO"),
  },
  pro_annual: {
    name: "Guru Annual",
    type: "order",
    amount: 299900,   // ₹2,999
    currency: "INR",
  },
  family: {
    name: "Family Monthly",
    type: "subscription",
    razorpay_plan_id: Deno.env.get("RAZORPAY_PLAN_FAMILY"),
  },
};

const VALID_PLAN_IDS = Object.keys(PLANS);

// ── Helpers ─────────────────────────────────────────────────────────────────

function jsonResponse(body: Record<string, unknown>, cors: Record<string, string>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function razorpayRequest(
  path: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
  const credentials = btoa(`${keyId}:${keySecret}`);

  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.error?.description ?? data?.error ?? "Razorpay API error";
    throw new Error(String(msg));
  }
  return data;
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Step 1 — Verify JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Missing authorization token" }, corsHeaders, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return jsonResponse({ error: "Invalid or expired token" }, corsHeaders, 401);
    }

    // Step 2 — Parse and validate body
    const { plan, enable_trial } = await req.json();

    if (!plan || !VALID_PLAN_IDS.includes(plan)) {
      return jsonResponse(
        { error: `Invalid plan. Must be one of: ${VALID_PLAN_IDS.join(", ")}` },
        corsHeaders,
        400,
      );
    }

    const planConfig = PLANS[plan];
    const keyId = Deno.env.get("RAZORPAY_KEY_ID")!;

    // Step 3 — Create subscription or order via Razorpay
    if (planConfig.type === "subscription") {
      if (!planConfig.razorpay_plan_id) {
        return jsonResponse(
          { error: `Razorpay plan ID not configured for "${plan}"` },
          corsHeaders,
          500,
        );
      }

      const subscriptionBody: Record<string, unknown> = {
        plan_id: planConfig.razorpay_plan_id,
        total_count: 12,
        notes: {
          supabase_user_id: user.id,
          plan_key: plan,
        },
      };

      if (enable_trial) {
        subscriptionBody.start_at =
          Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days from now
      }

      const data = await razorpayRequest("/subscriptions", subscriptionBody);

      return jsonResponse({
        type: "subscription",
        key_id: keyId,
        plan_name: planConfig.name,
        subscription_id: data.id,
      }, corsHeaders);
    }

    // One-time order (annual plans)
    const orderBody: Record<string, unknown> = {
      amount: planConfig.amount,
      currency: planConfig.currency,
      notes: {
        supabase_user_id: user.id,
        plan_key: plan,
      },
    };

    const data = await razorpayRequest("/orders", orderBody);

    return jsonResponse({
      type: "order",
      key_id: keyId,
      plan_name: planConfig.name,
      order_id: data.id,
      amount: planConfig.amount,
      currency: planConfig.currency,
    }, corsHeaders);
  } catch (err) {
    console.error("razorpay-checkout error:", err);
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Unknown error" },
      corsHeaders,
      500,
    );
  }
});
