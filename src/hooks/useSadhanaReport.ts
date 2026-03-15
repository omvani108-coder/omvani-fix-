import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ── Types ───────────────────────────────────────────────────────────────────

export interface SadhanaQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface SadhanaAnswer {
  questionId: string;
  question: string;
  answer: string;
  isCustom: boolean;
}

export interface SadhanaReportData {
  summary: string;
  strengths: string[];
  improvements: string[];
  spiritual_progress: string;
  recommendation: string;
  consistency_score: number;
}

export interface SadhanaEligibility {
  canGenerate: boolean;
  used: number;
  limit: number; // Infinity for unlimited
  plan: string;
}

// ── Env vars ────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getAuthHeaders(accessToken: string | undefined) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken ?? SUPABASE_KEY}`,
    apikey: SUPABASE_KEY,
  };
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useSadhanaReport() {
  const { user } = useAuth();

  const [questions, setQuestions] = useState<SadhanaQuestion[]>([]);
  const [report, setReport] = useState<SadhanaReportData | null>(null);
  const [eligibility, setEligibility] = useState<SadhanaEligibility | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Check eligibility ─────────────────────────────────────────────────
  const checkEligibility = useCallback(async (): Promise<SadhanaEligibility | null> => {
    if (!user) return null;

    try {
      // Get plan
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();

      const plan = (sub?.plan as string) ?? "free";

      // Pro/Family = unlimited
      if (["pro", "pro_annual", "family"].includes(plan)) {
        const result: SadhanaEligibility = { canGenerate: true, used: 0, limit: Infinity, plan };
        setEligibility(result);
        return result;
      }

      // Count existing reports
      let query = supabase
        .from("sadhana_reports")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      // For basic plans, count only this month
      if (plan === "basic" || plan === "basic_annual") {
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        query = query.gte("created_at", monthStart);
      }

      const { count } = await query;
      const used = count ?? 0;

      const limitMap: Record<string, number> = {
        free: 1,
        basic: 14,
        basic_annual: 14,
      };
      const limit = limitMap[plan] ?? 1;

      const result: SadhanaEligibility = {
        canGenerate: used < limit,
        used,
        limit,
        plan,
      };
      setEligibility(result);
      return result;
    } catch (err) {
      console.error("Failed to check sadhana eligibility:", err);
      return null;
    }
  }, [user]);

  // ── Fetch AI-generated questions ──────────────────────────────────────
  const fetchQuestions = useCallback(async (language = "en") => {
    if (!user) return;
    setIsLoadingQuestions(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = getAuthHeaders(session?.access_token);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/sadhana-questions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ language }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Failed to generate questions" }));
        throw new Error(body.error || "Failed to generate questions");
      }

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoadingQuestions(false);
    }
  }, [user]);

  // ── Generate report from answers ──────────────────────────────────────
  const generateReport = useCallback(async (
    answers: SadhanaAnswer[],
    language = "en",
    paymentId?: string,
  ) => {
    if (!user) return;
    setIsLoadingReport(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = getAuthHeaders(session?.access_token);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/sadhana-report`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          answers: answers.map((a) => ({
            question: a.question,
            answer: a.answer,
            isCustom: a.isCustom,
          })),
          language,
          is_free: !paymentId,
          razorpay_payment_id: paymentId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Failed to generate report" }));
        if (body.error === "report_limit_reached") {
          setEligibility((prev) =>
            prev ? { ...prev, canGenerate: false, used: body.used, limit: body.limit } : prev
          );
          throw new Error("report_limit_reached");
        }
        throw new Error(body.error || "Failed to generate report");
      }

      const data = await res.json();
      setReport(data.report);
      // Refresh eligibility after successful report
      checkEligibility();
      return data.report as SadhanaReportData;
    } catch (err) {
      setError(String(err));
      throw err;
    } finally {
      setIsLoadingReport(false);
    }
  }, [user, checkEligibility]);

  // ── Reset state ───────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setQuestions([]);
    setReport(null);
    setError(null);
  }, []);

  return {
    questions,
    report,
    eligibility,
    isLoadingQuestions,
    isLoadingReport,
    error,
    checkEligibility,
    fetchQuestions,
    generateReport,
    reset,
  };
}
