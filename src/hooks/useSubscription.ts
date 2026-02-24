// ═══════════════════════════════════════════════════════════════════════════
// OmVani — useSubscription Hook
// File path in your project:
//   src/hooks/useSubscription.ts
//
// What this does:
//   This is the "brain" of your paywall system.
//   Every page that needs to check limits imports this hook.
//   It tells you:
//     - What plan the user is on (free / basic / pro / family etc.)
//     - How many times they've used each feature today
//     - Whether they CAN still use a feature right now
//     - How many uses they have REMAINING (for soft limit warnings)
//   
//   Usage resets at midnight IST (India Standard Time) — not midnight UTC.
//   This means a user in London gets their reset at 18:30 their time,
//   and a user in New York at 13:30 — always aligned to India time.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Plan types ─────────────────────────────────────────────────────────────────
export type Plan =
  | "free"
  | "basic"
  | "basic_annual"
  | "pro"
  | "pro_annual"
  | "family";

export type PlanStatus = "active" | "trialing" | "cancelled" | "expired";

// ── Feature usage counts for today ────────────────────────────────────────────
interface UsageToday {
  chat:     number;
  identify: number;
}

// ── Daily limits per plan ──────────────────────────────────────────────────────
// Infinity means truly unlimited — no counter needed.
const DAILY_LIMITS: Record<Plan, { chat: number; identify: number; bhajans: number }> = {
  free:         { chat: 3,        identify: 1,        bhajans: 1         },
  basic:        { chat: 30,       identify: 3,        bhajans: 10        },
  basic_annual: { chat: 30,       identify: 3,        bhajans: 10        },
  pro:          { chat: Infinity, identify: Infinity, bhajans: Infinity  },
  pro_annual:   { chat: Infinity, identify: Infinity, bhajans: Infinity  },
  family:       { chat: Infinity, identify: Infinity, bhajans: Infinity  },
};

// ── Puja tracker history limit ─────────────────────────────────────────────────
const PUJA_HISTORY_DAYS: Record<Plan, number> = {
  free:         7,
  basic:        Infinity,
  basic_annual: Infinity,
  pro:          Infinity,
  pro_annual:   Infinity,
  family:       Infinity,
};

// ── Scripture access ───────────────────────────────────────────────────────────
// free → only Gita, and only 4 pages
// paid → all scriptures, unlimited
const SCRIPTURE_PAGES: Record<Plan, number> = {
  free:         4,
  basic:        Infinity,
  basic_annual: Infinity,
  pro:          Infinity,
  pro_annual:   Infinity,
  family:       Infinity,
};

// ── Helper: get today's date in IST as a YYYY-MM-DD string ────────────────────
// This is what we use as the "day" key for usage resets.
// No matter where in the world the user is, this returns the Indian date.
function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // Returns "YYYY-MM-DD"
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useSubscription() {
  const { user } = useAuth();

  const [plan,   setPlan]   = useState<Plan>("free");
  const [status, setStatus] = useState<PlanStatus>("active");
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [usage,  setUsage]  = useState<UsageToday>({ chat: 0, identify: 0 });

  // ── Fetch subscription + today's usage from Supabase ────────────────────────
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // ── 1. Get subscription ────────────────────────────────────────────────
      const { data: sub, error: subErr } = await supabase
        .from("subscriptions")
        .select("plan, status, trial_ends_at, current_period_end, family_owner_id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (subErr) throw subErr;

      // If no subscription row exists yet (shouldn't happen — trigger creates it)
      // default to free
      if (!sub) {
        setPlan("free");
        setStatus("active");
      } else {
        // Check if subscription has actually expired
        const now = new Date();
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
        const isExpired = periodEnd && periodEnd < now && sub.status === "active";

        if (isExpired) {
          setPlan("free");
          setStatus("expired");
        } else {
          setPlan(sub.plan as Plan);
          setStatus(sub.status as PlanStatus);
          setTrialEndsAt(sub.trial_ends_at ? new Date(sub.trial_ends_at) : null);
        }
      }

      // ── 2. Get today's usage (IST date) ───────────────────────────────────
      const todayIST = getTodayIST();

      const { data: usageRows, error: usageErr } = await supabase
        .from("usage_logs")
        .select("feature, count")
        .eq("user_id", user.id)
        .eq("date_ist", todayIST);
      if (usageErr) throw usageErr;

      const counts: UsageToday = { chat: 0, identify: 0 };
      usageRows?.forEach((row) => {
        if (row.feature === "chat")     counts.chat     = row.count;
        if (row.feature === "identify") counts.identify = row.count;
      });
      setUsage(counts);

    } catch (err) {
      console.error("useSubscription fetchData error:", err);
      // Fail safe — treat as free if anything goes wrong
      setPlan("free");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Increment a feature's usage counter ───────────────────────────────────
  // Call this AFTER a successful feature use (e.g., after AI responds).
  const incrementUsage = useCallback(async (feature: "chat" | "identify") => {
    if (!user) return;

    const todayIST = getTodayIST();
    let newCount = 0;

    // Optimistically update local state using functional form to read latest state
    setUsage(prev => {
      newCount = (prev[feature] ?? 0) + 1;
      return { ...prev, [feature]: newCount };
    });

    // Then persist to DB (upsert = insert or update if row exists)
    const { error } = await supabase.from("usage_logs").upsert({
      user_id:    user.id,
      feature,
      date_ist:   todayIST,
      count:      newCount,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,feature,date_ist" });

    if (error) {
      console.error("Failed to increment usage:", error);
      // Roll back using functional form to decrement from latest state
      setUsage(prev => ({ ...prev, [feature]: Math.max(0, (prev[feature] ?? 0) - 1) }));
    }
  }, [user]);

  // ── Derived plan info ─────────────────────────────────────────────────────
  const limits       = DAILY_LIMITS[plan];
  const isPaid       = plan !== "free";
  const isFree       = plan === "free";
  const isTrialing   = status === "trialing";
  const isPro        = plan === "pro"   || plan === "pro_annual"   || plan === "family";
  const isBasic      = plan === "basic" || plan === "basic_annual";
  const isAnnual     = plan === "basic_annual" || plan === "pro_annual";
  const isFamily     = plan === "family";

  // ── Remaining uses today ───────────────────────────────────────────────────
  // These power the SOFT LIMIT warnings ("You have 1 chat left today")
  const chatRemaining     = Math.max(0, limits.chat     - usage.chat);
  const identifyRemaining = Math.max(0, limits.identify - usage.identify);

  // ── Can use feature right now? ─────────────────────────────────────────────
  // true = go ahead | false = show upgrade prompt
  const canChat     = chatRemaining     > 0;
  const canIdentify = identifyRemaining > 0;

  // ── Warning thresholds (show soft warning when this many uses remain) ──────
  // For free (3 chat limit): warn at 1 remaining
  // For basic (30 chat limit): warn at 3 remaining
  const chatWarning     = !isPro && chatRemaining     <= (isFree ? 1 : 3);
  const identifyWarning = !isPro && identifyRemaining <= 1;

  // ── Bhajan access ──────────────────────────────────────────────────────────
  // Returns how many search results to show
  const bhajanLimit = limits.bhajans === Infinity ? 999 : limits.bhajans;

  // ── Scripture access ───────────────────────────────────────────────────────
  const scripturePageLimit  = SCRIPTURE_PAGES[plan];
  const canAccessAllScriptures = isPaid;

  // ── Puja tracker ──────────────────────────────────────────────────────────
  const pujaHistoryDays = PUJA_HISTORY_DAYS[plan];

  return {
    // Plan info
    plan,
    status,
    isPaid,
    isFree,
    isPro,
    isBasic,
    isAnnual,
    isFamily,
    isTrialing,
    trialEndsAt,
    loading,

    // Usage counts
    usage,
    chatRemaining,
    identifyRemaining,

    // Can use checks
    canChat,
    canIdentify,

    // Soft warning flags
    chatWarning,
    identifyWarning,

    // Feature-specific limits
    bhajanLimit,
    scripturePageLimit,
    canAccessAllScriptures,
    pujaHistoryDays,

    // Actions
    incrementUsage,
    refreshSubscription: fetchData,
  };
}
