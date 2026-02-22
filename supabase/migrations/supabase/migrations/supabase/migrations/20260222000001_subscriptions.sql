-- ═══════════════════════════════════════════════════════════════════════════
-- OmVani — Subscriptions & Usage Tracking Migration
-- File path in your project:
--   supabase/migrations/20260222000001_subscriptions.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Subscriptions table ────────────────────────────────────────────────────
-- Stores every user's current plan, trial status, and payment info.
CREATE TABLE public.subscriptions (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                     TEXT        NOT NULL DEFAULT 'free',
  -- Possible values: 'free' | 'basic' | 'basic_annual' | 'pro' | 'pro_annual' | 'family'
  status                   TEXT        NOT NULL DEFAULT 'active',
  -- Possible values: 'active' | 'trialing' | 'cancelled' | 'expired'
  trial_ends_at            TIMESTAMPTZ,
  current_period_end       TIMESTAMPTZ,
  razorpay_payment_id      TEXT,
  razorpay_order_id        TEXT,
  razorpay_subscription_id TEXT,
  -- For family plan: if this row is a family MEMBER (not the owner), store owner's id
  family_owner_id          UUID        REFERENCES auth.users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscription (or family members can see owner's)
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = family_owner_id);

-- Only the service role (your edge functions) can write to this table
CREATE POLICY "Service role can write subscriptions"
  ON public.subscriptions FOR ALL
  TO service_role
  USING (true);

-- ── 2. Usage logs table ───────────────────────────────────────────────────────
-- Tracks how many times each user uses each feature per day (in IST timezone).
-- "date_ist" resets at midnight India time — not midnight UTC.
CREATE TABLE public.usage_logs (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature    TEXT    NOT NULL,
  -- Possible values: 'chat' | 'identify'
  date_ist   DATE    NOT NULL DEFAULT (
    (now() AT TIME ZONE 'Asia/Kolkata')::DATE
  ),
  count      INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature, date_ist)
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own usage"
  ON public.usage_logs FOR ALL
  USING (auth.uid() = user_id);

-- ── 3. Family members table ───────────────────────────────────────────────────
-- When a family plan owner invites members, each invite is a row here.
CREATE TABLE public.family_members (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email TEXT    NOT NULL,
  member_id    UUID    REFERENCES auth.users(id),
  status       TEXT    NOT NULL DEFAULT 'pending',
  -- 'pending' = invited but not joined | 'active' = joined
  invited_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  joined_at    TIMESTAMPTZ,
  UNIQUE(owner_id, member_email)
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage family members"
  ON public.family_members FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Member can view own invite"
  ON public.family_members FOR SELECT
  USING (auth.uid() = member_id);

-- ── 4. Auto-create a free subscription for every new user ─────────────────────
-- This trigger fires automatically when someone signs up.
-- It creates a 'free' plan row so we never have a user without a subscription row.
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription();

-- ── 5. Updated_at auto-timestamps ─────────────────────────────────────────────
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_logs_updated_at
  BEFORE UPDATE ON public.usage_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── 6. Scheduled jobs (pg_cron) ───────────────────────────────────────────────
-- These run automatically every day at midnight IST (= 18:30 UTC)
-- They expire free trials and lapsed subscriptions back to 'free' plan.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

-- Expire trials that have ended
SELECT cron.schedule(
  'expire-trials',
  '30 18 * * *',
  $$
    UPDATE public.subscriptions
    SET status = 'expired', plan = 'free', updated_at = now()
    WHERE status = 'trialing'
      AND trial_ends_at < now();
  $$
);

-- Expire paid subscriptions that weren't renewed
SELECT cron.schedule(
  'expire-subscriptions',
  '30 18 * * *',
  $$
    UPDATE public.subscriptions
    SET status = 'expired', plan = 'free', updated_at = now()
    WHERE status = 'active'
      AND current_period_end IS NOT NULL
      AND current_period_end < now();
  $$
);
