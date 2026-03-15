import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useSadhanaReport } from "@/hooks/useSadhanaReport";
import type { SadhanaAnswer } from "@/hooks/useSadhanaReport";
import { SadhanaQuestionFlow } from "@/components/sadhana/SadhanaQuestion";
import { SadhanaReportView } from "@/components/sadhana/SadhanaReport";
import { SadhanaPaywall } from "@/components/sadhana/SadhanaPaywall";
import UpgradeModal from "@/components/UpgradeModal";
import PujaTracker from "@/pages/PujaTracker";
import { toast } from "sonner";

// ── AI Report flow states ───────────────────────────────────────────────────
type FlowState = "start" | "loading-questions" | "questions" | "loading-report" | "report" | "paywall";

// ── Main Sadhana Page ───────────────────────────────────────────────────────

const Sadhana = () => {
  const { t, language } = useTranslations();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── AI Report state ─────────────────────────────────────────────────────
  const {
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
  } = useSadhanaReport();

  const [flow, setFlow] = useState<FlowState>("start");
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    if (user) checkEligibility();
  }, [user, checkEligibility]);

  useEffect(() => {
    if (isLoadingQuestions) setFlow("loading-questions");
    else if (isLoadingReport) setFlow("loading-report");
    else if (report) setFlow("report");
    else if (questions.length > 0) setFlow("questions");
  }, [isLoadingQuestions, isLoadingReport, report, questions.length]);

  useEffect(() => {
    if (error && error !== "report_limit_reached") toast.error(error);
    if (error === "report_limit_reached") setFlow("paywall");
  }, [error]);

  const handleStart = useCallback(async () => {
    if (!user) { navigate("/login"); return; }
    const elig = await checkEligibility();
    if (elig && !elig.canGenerate) { setFlow("paywall"); return; }
    fetchQuestions(language);
  }, [user, navigate, checkEligibility, fetchQuestions, language]);

  const handleAnswersComplete = useCallback(async (answers: SadhanaAnswer[]) => {
    try { await generateReport(answers, language); } catch { /* handled by useEffect */ }
  }, [generateReport, language]);

  const handleNewSession = useCallback(() => { reset(); setFlow("start"); }, [reset]);

  const remainingText = eligibility
    ? eligibility.limit === Infinity
      ? (t.sadhana.unlimitedReports ?? "Unlimited reports")
      : `${eligibility.used} ${t.common.of} ${eligibility.limit} ${t.sadhana.reportsUsed ?? "reports used"}`
    : null;

  return (
    <>
      <SeoHead
        title="Sadhana — Daily Practice & AI Analysis — OmVani"
        description="Track your daily sadhana rituals and get AI-powered analysis rooted in Sanatan Dharam."
        canonicalPath="/sadhana"
      />
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — Full Puja Tracker (calendar, streak, tasks)
          ══════════════════════════════════════════════════════════════════ */}
      <PujaTracker embedded />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — AI Sadhana Analysis
          ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-background pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto px-4">
          {/* Divider */}
          <div className="h-px bg-border mb-8" />

          {/* Section header */}
          <div className="text-center mb-4">
            <h2 className="font-serif font-bold text-lg text-foreground">
              {t.sadhana.aiSubtitle ?? "AI-Powered Daily Practice Analysis"}
            </h2>
            {remainingText && flow !== "report" && (
              <p className="text-xs text-muted-foreground/60 font-sans mt-1">
                {remainingText}
              </p>
            )}
          </div>

          {/* ── AI Flow content ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {/* START */}
            {flow === "start" && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground font-sans mb-5 leading-relaxed">
                  {t.sadhana.startDescription ??
                    "Answer a few questions about your daily practice and receive personalized insights based on Sanatan Dharam wisdom."}
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleStart}
                  className="font-sans gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {t.sadhana.beginAnalysis ?? "Begin Today's Sadhana Analysis"}
                </Button>
              </motion.div>
            )}

            {/* LOADING QUESTIONS */}
            {flow === "loading-questions" && (
              <motion.div
                key="loading-questions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Loader2 className="w-8 h-8 text-saffron animate-spin mb-4" />
                <p className="text-sm text-muted-foreground font-sans animate-pulse">
                  {t.sadhana.preparingQuestions ?? "Preparing your questions..."}
                </p>
              </motion.div>
            )}

            {/* QUESTIONS */}
            {flow === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SadhanaQuestionFlow
                  questions={questions}
                  onComplete={handleAnswersComplete}
                />
              </motion.div>
            )}

            {/* LOADING REPORT */}
            {flow === "loading-report" && (
              <motion.div
                key="loading-report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-full bg-saffron/10 flex items-center justify-center">
                    <span className="text-xl font-serif font-bold text-saffron animate-pulse select-none">ॐ</span>
                  </div>
                  <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-saffron animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground font-sans animate-pulse">
                  {t.sadhana.analyzingPractice ?? "Analyzing your sadhana..."}
                </p>
              </motion.div>
            )}

            {/* REPORT */}
            {flow === "report" && report && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SadhanaReportView report={report} onNewSession={handleNewSession} />
              </motion.div>
            )}

            {/* PAYWALL */}
            {flow === "paywall" && eligibility && (
              <motion.div
                key="paywall"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SadhanaPaywall
                  eligibility={eligibility}
                  onPayPerReport={() => { toast.info("Per-report payment coming soon."); setUpgradeOpen(true); }}
                  onUpgrade={() => setUpgradeOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} trigger="sadhana" />
    </>
  );
};

export default Sadhana;
