// ═══════════════════════════════════════════════════════════════════════════
// OmVani — Upgrade Modal Component
// File path in your project:
//   src/components/UpgradeModal.tsx
//
// What this does:
//   This is the popup that appears when a user hits a limit.
//   It shows the 3 paid plans (Sadhak / Guru / Family),
//   lets users toggle between monthly and annual pricing,
//   and opens the Razorpay payment checkout when they click buy.
//
//   Soft limit messages are customised based on what triggered the modal
//   (e.g., "You have 0 AI chats left today" vs "Bhajans are for paid users")
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2, Zap, Crown, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UpgradeTrigger =
  | "chat"
  | "identify"
  | "bhajans"
  | "scriptures"
  | "puja"
  | "general";

interface UpgradeModalProps {
  open:       boolean;
  onClose:    () => void;
  trigger?:   UpgradeTrigger;
  onSuccess?: () => void;
  // Pass remaining count for soft-limit messages (e.g., 0 chats left)
  remaining?: number;
}

// ── Plan data ─────────────────────────────────────────────────────────────────

interface PlanDef {
  id:           string; // matches PLANS keys in edge function
  annualId:     string;
  name:         string;
  emoji:        string;
  monthlyPrice: string;
  annualPrice:  string;
  annualSaving: string;
  period:       string;
  badge:        string | null;
  color:        string;
  features:     string[];
}

const PLANS: PlanDef[] = [
  {
    id:           "basic",
    annualId:     "basic_annual",
    name:         "Sadhak",
    emoji:        "🪔",
    monthlyPrice: "₹199",
    annualPrice:  "₹1,499",
    annualSaving: "Save ₹889/yr",
    period:       "/month",
    badge:        null,
    color:        "border-saffron/60 hover:border-saffron",
    features: [
      "30 AI Guru conversations/day",
      "All 3 scriptures — unlimited",
      "Deity identifier — 3/day",
      "Top 10 Bhajans",
      "Full Puja Tracker",
      "Email reminders",
    ],
  },
  {
    id:           "pro",
    annualId:     "pro_annual",
    name:         "Guru",
    emoji:        "👑",
    monthlyPrice: "₹399",
    annualPrice:  "₹2,999",
    annualSaving: "Save ₹1,789/yr",
    period:       "/month",
    badge:        "Most Popular",
    color:        "border-gold hover:border-gold",
    features: [
      "Unlimited AI Guru conversations",
      "All 3 scriptures — unlimited",
      "Deity identifier — unlimited",
      "All Bhajans — full library",
      "Full Puja Tracker",
      "WhatsApp + Email reminders",
      "Priority support",
    ],
  },
  {
    id:           "family",
    annualId:     "family",  // family is monthly only for simplicity
    name:         "Family",
    emoji:        "🏠",
    monthlyPrice: "₹599",
    annualPrice:  "₹599",   // same (no annual family plan in this version)
    annualSaving: "5 accounts",
    period:       "/month",
    badge:        "Best Value",
    color:        "border-lotus-pink/60 hover:border-lotus-pink",
    features: [
      "Everything in Guru",
      "5 family accounts included",
      "Shared family dashboard",
      "Individual profiles per member",
      "Manage members from your account",
    ],
  },
];

// ── Trigger messages ──────────────────────────────────────────────────────────
// These show at the top of the modal explaining WHY it appeared.

function getTriggerMessage(trigger: UpgradeTrigger, remaining: number): {
  title: string;
  subtitle: string;
} {
  const messages: Record<UpgradeTrigger, { title: string; subtitle: string }> = {
    chat: remaining === 0
      ? {
          title:    "You've used all your free chats today",
          subtitle: "Upgrade to keep talking to the Guru — resets at midnight IST 🌙",
        }
      : {
          title:    `Only ${remaining} free chat${remaining === 1 ? "" : "s"} left today`,
          subtitle: "Upgrade now for unlimited conversations with the Guru",
        },
    identify: remaining === 0
      ? {
          title:    "Free deity identification used",
          subtitle: "Upgrade to identify more deities, temples & sacred objects",
        }
      : {
          title:    `${remaining} identification${remaining === 1 ? "" : "s"} remaining today`,
          subtitle: "Upgrade for unlimited AI-powered deity identification",
        },
    bhajans: {
      title:    "Unlock the full Bhajans library",
      subtitle: "Access all bhajans, mantras, aartis and stotras",
    },
    scriptures: {
      title:    "Unlock all sacred scriptures",
      subtitle: "Read Upanishads, Yoga Sutras and the full Bhagavad Gita without limits",
    },
    puja: {
      title:    "Your 7-day Puja Tracker history is full",
      subtitle: "Upgrade to track your spiritual practice across all time",
    },
    general: {
      title:    "Upgrade your spiritual journey",
      subtitle: "Start your 7-day free trial — cancel anytime",
    },
  };

  return messages[trigger] ?? messages.general;
}

// ── Razorpay checkout opener ──────────────────────────────────────────────────

declare global {
  interface Window { Razorpay: any; }
}

async function loadRazorpaySDK(): Promise<void> {
  if (window.Razorpay) return; // Already loaded
  return new Promise((resolve, reject) => {
    const script   = document.createElement("script");
    script.src     = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function UpgradeModal({
  open,
  onClose,
  trigger    = "general",
  onSuccess,
  remaining  = 0,
}: UpgradeModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isAnnual,    setIsAnnual]    = useState(false);
  // isAnnual = true → show annual prices with savings badge

  const message = getTriggerMessage(trigger, remaining);

  const handleUpgrade = async (planDef: PlanDef) => {
    const planId = isAnnual && planDef.annualId !== planDef.id
      ? planDef.annualId
      : planDef.id;

    setLoadingPlan(planId);

    try {
      // Step 1: Load Razorpay JS if not already loaded
      await loadRazorpaySDK();

      // Step 2: Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in first to upgrade");
        return;
      }

      // Step 3: Call our edge function to create a Razorpay order/subscription
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/razorpay-checkout`,
        {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${session.access_token}`,
            "apikey":        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            plan:         planId,
            enable_trial: true, // Always offer 7-day trial
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Failed to create payment");
      }

      const orderData = await res.json();

      // Step 4: Open Razorpay checkout popup
      const rzpOptions: Record<string, any> = {
        key:         orderData.key_id,
        name:        "ॐVani",
        description: orderData.plan_name,
        image:       "/favicon.ico",
        prefill:     { email: session.user.email },
        theme:       { color: "#EA781E" }, // Saffron brand colour
        handler: () => {
          // Called when payment is successful
          // The webhook will actually upgrade the user in DB
          toast.success("🙏 Payment successful! Your plan is being activated...");
          onSuccess?.();
          onClose();
          // Reload after 2 seconds to refresh subscription state
          setTimeout(() => window.location.reload(), 2000);
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoadingPlan(null);
          },
        },
      };

      // Subscriptions and orders have slightly different options
      if (orderData.type === "subscription") {
        rzpOptions.subscription_id = orderData.subscription_id;
      } else {
        rzpOptions.order_id = orderData.order_id;
        rzpOptions.amount   = orderData.amount;
        rzpOptions.currency = orderData.currency;
      }

      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();

    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[700px] bg-card rounded-2xl border border-border shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="relative px-6 pt-7 pb-5 text-center border-b border-border bg-gradient-to-b from-secondary/50 to-card">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 rounded-full bg-sacred-gradient flex items-center justify-center text-2xl mx-auto mb-3 shadow-sacred">
                ॐ
              </div>

              <h2 className="font-serif font-bold text-xl text-foreground mb-1">
                {message.title}
              </h2>
              <p className="text-sm font-sans text-muted-foreground max-w-sm mx-auto">
                {message.subtitle}
              </p>

              {/* 7-day trial badge */}
              <div className="inline-flex items-center gap-1.5 mt-3 bg-saffron/10 text-saffron border border-saffron/20 rounded-full px-3 py-1 text-xs font-sans font-semibold">
                <Sparkles className="w-3 h-3" />
                7-day free trial · Cancel anytime
              </div>
            </div>

            {/* ── Monthly / Annual toggle ────────────────────────────────── */}
            <div className="flex items-center justify-center gap-3 pt-5 pb-1 px-6">
              <span className={`text-sm font-sans font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isAnnual ? "bg-saffron" : "bg-muted"}`}
                aria-label="Toggle annual pricing"
              >
                <motion.div
                  animate={{ x: isAnnual ? 20 : 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </button>
              <span className={`text-sm font-sans font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
                Annual
              </span>
              {isAnnual && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-sans font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"
                >
                  Save up to 37%
                </motion.span>
              )}
            </div>

            {/* ── Plan cards ─────────────────────────────────────────────── */}
            <div className="p-5 grid md:grid-cols-3 gap-4">
              {PLANS.map((planDef) => {
                const activePlanId = isAnnual && planDef.annualId !== planDef.id
                  ? planDef.annualId
                  : planDef.id;
                const isLoading = loadingPlan === activePlanId;
                const price = isAnnual ? planDef.annualPrice : planDef.monthlyPrice;
                const saving = isAnnual ? planDef.annualSaving : null;

                return (
                  <div
                    key={planDef.id}
                    className={`relative rounded-xl border-2 p-5 transition-all duration-200 ${planDef.color} bg-card flex flex-col`}
                  >
                    {/* Popular / Best Value badge */}
                    {planDef.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sacred-gradient text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {planDef.badge}
                      </span>
                    )}

                    {/* Plan name */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{planDef.emoji}</span>
                      <h3 className="font-serif font-bold text-foreground text-lg">
                        {planDef.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="mb-1">
                      <span className="text-3xl font-serif font-bold text-gradient-sacred">
                        {price}
                      </span>
                      <span className="text-muted-foreground text-xs font-sans ml-1">
                        {isAnnual ? "/year" : "/month"}
                      </span>
                    </div>

                    {/* Annual saving or family note */}
                    {saving && (
                      <p className="text-xs font-sans text-emerald-600 font-semibold mb-3">
                        {saving}
                      </p>
                    )}
                    {!saving && <div className="mb-3" />}

                    {/* Features */}
                    <ul className="space-y-1.5 mb-5 flex-1">
                      {planDef.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-xs font-sans text-foreground/80">
                          <Check className="w-3.5 h-3.5 text-saffron shrink-0 mt-0.5" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* CTA button */}
                    <Button
                      onClick={() => handleUpgrade(planDef)}
                      disabled={!!loadingPlan}
                      className="w-full bg-sacred-gradient text-white hover:opacity-90 font-sans font-semibold text-sm mt-auto"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing…</>
                      ) : (
                        <>Start Free Trial</>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* ── Footer note ────────────────────────────────────────────── */}
            <div className="px-6 pb-6 text-center space-y-1">
              <p className="text-xs font-sans text-muted-foreground">
                7-day free trial included · No charge until trial ends · Cancel anytime
              </p>
              <p className="text-xs font-sans text-muted-foreground/50">
                Free plan continues: 3 chats/day · Gita only · 7-day Puja history
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
