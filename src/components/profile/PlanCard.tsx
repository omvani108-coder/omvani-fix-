import { useState } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp } from "@/lib/animations";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

export default function PlanCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;
  const { plan, status, isFree, isTrialing, trialEndsAt, isAnnual, refreshSubscription } =
    useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <>
      <motion.div
        initial="hidden" animate="visible" custom={1} variants={fadeUp}
        className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Crown className="w-4 h-4 text-saffron" />
          <h2 className="font-sans font-semibold text-foreground text-sm">
            {tx("Your Plan", "आपकी योजना", "உங்கள் திட்டம்")}
          </h2>
        </div>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs text-muted-foreground font-sans mb-0.5">
                {tx("Current Plan", "वर्तमान योजना", "தற்போதைய திட்டம்")}
              </p>
              <p className="text-sm font-sans text-foreground font-medium">
                {plan === "free" && "Seeker (Free)"}
                {(plan === "basic" || plan === "basic_annual") && "Sadhak"}
                {(plan === "pro" || plan === "pro_annual") && "Guru"}
                {plan === "family" && "Family"}
                {isAnnual && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({tx("Annual", "वार्षिक", "வருடாந்திர")})
                  </span>
                )}
              </p>
            </div>
            <span
              className={`text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full ${
                status === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : status === "trialing"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : status === "cancelled"
                  ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {status === "active" && tx("Active", "सक्रिय", "செயலில்")}
              {status === "trialing" && tx("Trial", "परीक्षण", "சோதனை")}
              {status === "cancelled" && tx("Cancelled", "रद्द", "ரத்து")}
              {status === "expired" && tx("Expired", "समाप्त", "காலாவதி")}
            </span>
          </div>
          {isTrialing && trialEndsAt && (
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground font-sans mb-0.5">
                  {tx("Trial Ends", "परीक्षण समाप्ति", "சோதனை முடிவு")}
                </p>
                <p className="text-sm font-sans text-foreground font-medium">
                  {trialEndsAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="px-6 py-4">
            {isFree ? (
              <Button
                onClick={() => setUpgradeOpen(true)}
                className="w-full bg-sacred-gradient text-white hover:opacity-90 font-sans font-semibold text-sm"
              >
                {tx("Upgrade Plan", "योजना अपग्रेड करें", "திட்டத்தை மேம்படுத்தவும்")}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground font-sans text-center">
                {tx(
                  "Manage your subscription from your Razorpay account",
                  "अपनी सदस्यता Razorpay खाते से प्रबंधित करें",
                  "உங்கள் சந்தாவை Razorpay கணக்கிலிருந்து நிர்வகிக்கவும்"
                )}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        refreshSubscription={refreshSubscription}
      />
    </>
  );
}
