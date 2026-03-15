import { motion } from "framer-motion";
import { Lock, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SadhanaEligibility } from "@/hooks/useSadhanaReport";
import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  eligibility: SadhanaEligibility;
  onPayPerReport: () => void;
  onUpgrade: () => void;
}

export function SadhanaPaywall({ eligibility, onPayPerReport, onUpgrade }: Props) {
  const { t } = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 text-center"
    >
      {/* Lock icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-saffron/10 border-2 border-saffron/20 flex items-center justify-center">
          <Lock className="w-7 h-7 text-saffron" />
        </div>
      </div>

      {/* Message */}
      <h2 className="font-serif text-xl font-bold text-foreground mb-2">
        {t.sadhana.paywallTitle ?? "Unlock Your Sadhana Insights"}
      </h2>
      <p className="text-sm text-muted-foreground font-sans mb-6 max-w-sm mx-auto leading-relaxed">
        {t.sadhana.paywallSubtitle ??
          "You've used your free report. Unlock more insights into your sadhana journey."}
      </p>

      {/* Usage display */}
      <div className="bg-muted/50 rounded-xl px-4 py-3 mb-6 inline-block">
        <p className="text-xs font-sans text-muted-foreground">
          {eligibility.used} {t.common.of} {eligibility.limit === Infinity ? "∞" : eligibility.limit}{" "}
          {t.sadhana.reportsUsed ?? "reports used"}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {/* Pay per report */}
        <button
          onClick={onPayPerReport}
          className="w-full bg-card border-2 border-saffron/40 hover:border-saffron rounded-xl p-4 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-saffron" />
            </div>
            <div className="text-left flex-1">
              <p className="font-sans font-semibold text-sm text-foreground">
                {t.sadhana.payPerReport ?? "Single Report — ₹30"}
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                {t.sadhana.payPerReportDesc ?? "One-time payment for this report"}
              </p>
            </div>
          </div>
        </button>

        {/* Upgrade to Basic */}
        {eligibility.plan === "free" && (
          <button
            onClick={onUpgrade}
            className="w-full bg-card border-2 border-gold/40 hover:border-gold rounded-xl p-4 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left flex-1">
                <p className="font-sans font-semibold text-sm text-foreground">
                  {t.sadhana.upgradeBasic ?? "Sadhak Plan — ₹199/mo"}
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  {t.sadhana.upgradeBasicDesc ?? "14 daily reports + full app access"}
                </p>
              </div>
            </div>
          </button>
        )}

        {/* Upgrade to Pro */}
        <button
          onClick={onUpgrade}
          className="w-full bg-card border-2 border-lotus-pink/40 hover:border-lotus-pink rounded-xl p-4 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lotus-pink/10 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-lotus-pink" />
            </div>
            <div className="text-left flex-1">
              <p className="font-sans font-semibold text-sm text-foreground">
                {eligibility.plan === "free"
                  ? (t.sadhana.upgradePro ?? "Guru Plan — Unlimited Reports")
                  : (t.sadhana.upgradePro ?? "Upgrade to Guru — Unlimited Reports")}
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                {t.sadhana.upgradeProDesc ?? "Unlimited sadhana reports + all premium features"}
              </p>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
