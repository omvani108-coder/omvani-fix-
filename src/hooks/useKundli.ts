import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ── Types ───────────────────────────────────────────────────────────────────

export type KundliLens =
  | "love" | "career" | "wealth" | "health"
  | "future" | "spiritual" | "marriage" | "family";

export interface KundliEligibility {
  hasUsedFree: boolean;
  isPaidPlan: boolean;
  pricePerAnalysis: number; // paise
  monthlyFreeRemaining?: number; // monthly free readings left (paid plans only)
}

export interface KundliAnalysis {
  id: string;
  full_name: string;
  date_of_birth: string;
  time_of_birth: string | null;
  place_of_birth: string;
  lens: KundliLens;
  result: string | null;
  is_free: boolean;
  payment_status: string;
  created_at: string;
}

export interface RunAnalysisParams {
  full_name: string;
  date_of_birth: string;
  time_of_birth: string | null;
  place_of_birth: string;
  lens: KundliLens;
  is_free: boolean;
  razorpay_payment_id?: string;
  kundli_image_base64?: string;
}

// ── Env vars (validated once at module level) ───────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getAuthHeaders(accessToken: string | undefined) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase environment variables");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken ?? SUPABASE_KEY}`,
    apikey: SUPABASE_KEY,
  };
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useKundli() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<KundliEligibility | null>(null);
  const [pastReadings, setPastReadings] = useState<KundliAnalysis[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  // ── Check eligibility ─────────────────────────────────────────────────
  const checkEligibility = useCallback(async (): Promise<KundliEligibility | null> => {
    if (!user) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = getAuthHeaders(session?.access_token);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/kundli-analysis`, {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "check-eligibility" }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(errText);
      }

      const data = await res.json() as KundliEligibility;
      setEligibility(data);
      return data;
    } catch (err) {
      console.error("checkEligibility error:", err);
      return null;
    }
  }, [user]);

  // ── Initiate Razorpay payment ─────────────────────────────────────────
  const initiatePayment = useCallback(async (
    amount: number,
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = getAuthHeaders(session?.access_token);

      // Create Razorpay order via the checkout edge function
      const res = await fetch(`${SUPABASE_URL}/functions/v1/razorpay-checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify({ plan: "kundli_analysis", amount }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(errText);
      }

      const orderData = await res.json();

      // Open Razorpay checkout
      return new Promise<string | null>((resolve) => {
        const RazorpayCtor = window.Razorpay;
        if (!RazorpayCtor) {
          toast.error("Payment gateway not loaded. Please refresh the page.");
          resolve(null);
          return;
        }

        const options: RazorpayOptions = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "OmVani",
          description: "Kundli Analysis",
          order_id: orderData.order_id,
          handler: (response: RazorpayPaymentResponse) => {
            resolve(response.razorpay_payment_id);
          },
          modal: {
            ondismiss: () => resolve(null),
          },
          prefill: {
            email: user.email ?? "",
          },
          theme: {
            color: "#CC9933",
          },
        };

        const rzp = new RazorpayCtor(options);
        rzp.open();
      });
    } catch (err) {
      console.error("initiatePayment error:", err);
      toast.error("Payment failed. Please try again.");
      return null;
    }
  }, [user]);

  // ── Run analysis (streaming) ──────────────────────────────────────────
  const runAnalysis = useCallback(async (params: RunAnalysisParams) => {
    if (!user) return;

    setIsLoading(true);
    setIsStreaming(true);
    setResult("");
    setError(null);
    abortRef.current = new AbortController();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = getAuthHeaders(session?.access_token);

      const res = await fetch(`${SUPABASE_URL}/functions/v1/kundli-analysis`, {
        method: "POST",
        signal: abortRef.current.signal,
        headers,
        body: JSON.stringify({
          action: "analyse",
          ...params,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(`Analysis failed: ${res.status} — ${errText}`);
      }

      // Stream the response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setResult(accumulated);
        }
        accumulated += decoder.decode();
        setResult(accumulated);
      }

      setIsStreaming(false);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      console.error("runAnalysis error:", err);
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      toast.error("Could not complete your Kundli reading. Please try again.");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [user]);

  // ── Fetch past readings ───────────────────────────────────────────────
  const fetchPastReadings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fetchErr } = await supabase
        .from("kundli_analyses")
        .select("id, full_name, date_of_birth, time_of_birth, place_of_birth, lens, result, is_free, payment_status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (fetchErr) throw fetchErr;
      setPastReadings((data ?? []) as KundliAnalysis[]);
    } catch (err) {
      console.error("fetchPastReadings error:", err);
    }
  }, [user]);

  // ── Reset for new analysis ────────────────────────────────────────────
  const reset = useCallback(() => {
    abortRef.current?.abort();
    setResult("");
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  return {
    // State
    isLoading,
    isStreaming,
    result,
    error,
    eligibility,
    pastReadings,

    // Actions
    checkEligibility,
    initiatePayment,
    runAnalysis,
    fetchPastReadings,
    reset,
  };
}
