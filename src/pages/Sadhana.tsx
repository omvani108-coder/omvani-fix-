import { useState, Suspense, lazy } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { useTranslations } from "@/hooks/useTranslations";

// Lazy-load the original page components to keep Sadhana bundle small
const PujaTracker = lazy(() => import("./PujaTracker"));
const Identify = lazy(() => import("./Identify"));

// ── Tab type ────────────────────────────────────────────────────────────────

type SadhanaTab = "puja" | "drishti";

// ── Loading fallback ────────────────────────────────────────────────────────

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-3xl font-serif font-bold text-saffron animate-pulse select-none">
        ॐ
      </div>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────────────────

const Sadhana = () => {
  const { t } = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL or default to "puja"
  const initialTab = (searchParams.get("tab") === "drishti" ? "drishti" : "puja") as SadhanaTab;
  const [activeTab, setActiveTab] = useState<SadhanaTab>(initialTab);

  const handleTabChange = (tab: SadhanaTab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <>
      <SeoHead
        title="Sadhana — Daily Practice & Divine Perception — OmVani"
        description="Track your daily puja rituals and identify Hindu deities with AI-powered Divya Drishti."
        canonicalPath="/sadhana"
      />
      <Navbar />

      <div className="min-h-screen bg-background pt-20 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center px-4 mb-6">
          <h1 className="font-serif font-bold text-2xl text-foreground">
            {t.sadhana.title}
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            {t.sadhana.subtitle}
          </p>
        </div>

        {/* ── Tab pills ───────────────────────────────────────────────────── */}
        <div className="flex justify-center gap-2 px-4 mb-6">
          {(["puja", "drishti"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === "puja" ? t.sadhana.pujaTab : t.sadhana.drishtTab;
            return (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`
                  relative px-5 py-2.5 rounded-full font-sans text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? "bg-saffron text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sadhana-tab-pill"
                    className="absolute inset-0 rounded-full bg-saffron"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab content ─────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<TabLoader />}>
              {activeTab === "puja" ? <PujaTracker embedded /> : <Identify embedded />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sadhana;
