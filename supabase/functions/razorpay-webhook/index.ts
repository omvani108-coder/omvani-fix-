import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
// Webhook is called by Razorpay servers (not browsers), but we restrict CORS anyway
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://omvani.vercel.app",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-razorpay-signature",
};
 
// Map Razorpay plan IDs → your plan keys
const PLAN_MAP: Record<string, string> = {
  [Deno.env.get("RAZORPAY_PLAN_BASIC") ?? ""]:  "basic",
  [Deno.env.get("RAZORPAY_PLAN_PRO") ?? ""]:    "pro",
  [Deno.env.get("RAZORPAY_PLAN_FAMILY") ?? ""]: "family",
};
 
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
 
  const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
  const supabaseUrl   = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
 
  // 1. Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
 
  // 2. Verify HMAC-SHA256 signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, "0")).join("");
 
  if (expected !== signature) {
    console.error("Webhook signature mismatch");
    return new Response("Unauthorized", { status: 401 });
  }
 
  const event = JSON.parse(rawBody);
  const supabase = createClient(supabaseUrl, supabaseKey);
 
  // 3. Handle subscription.activated (monthly plans)
  if (event.event === "subscription.activated") {
    const sub = event.payload.subscription.entity;
    const userId = sub.notes?.supabase_user_id;
    const planKey = PLAN_MAP[sub.plan_id] ?? "basic";
 
    if (userId) {
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: planKey,
        status: "active",
        razorpay_subscription_id: sub.id,
        current_period_end: new Date(sub.current_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
  }
 
  // 4. Handle payment.captured (annual one-time orders)
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const userId = payment.notes?.supabase_user_id;
    const planKey = payment.notes?.plan_key;
 
    if (userId && planKey) {
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
 
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan: planKey,
        status: "active",
        razorpay_payment_id: payment.id,
        current_period_end: periodEnd.toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
  }
 
  // 5. Handle subscription.halted / cancelled
  if (["subscription.halted", "subscription.cancelled"].includes(event.event)) {
    const sub = event.payload.subscription.entity;
    const userId = sub.notes?.supabase_user_id;
 
    if (userId) {
      await supabase.from("subscriptions").update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      }).eq("user_id", userId);
    }
  }
 
  return new Response("ok", { status: 200 });
});
