import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ScrollText } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import type { KundliAnalysis } from "@/hooks/useKundli";

// ── Lens emoji map ──────────────────────────────────────────────────────────

const LENS_EMOJI: Record<string, string> = {
  love: "💕",
  wealth: "💰",
  future: "🔮",
  career: "💼",
  marriage: "💍",
  health: "🌿",
  spiritual: "🙏",
  family: "👨‍👩‍👧",
};

// ── Props ───────────────────────────────────────────────────────────────────

interface KundliHistoryProps {
  readings: KundliAnalysis[];
  onNewAnalysis: () => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export function KundliHistory({ readings, onNewAnalysis }: KundliHistoryProps) {
  const { t } = useTranslations();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (readings.length === 0) {
    return (
      <div className="text-center py-8">
        <ScrollText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-muted-foreground font-sans text-sm">
          {t.kundli.noPastReadings}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-semibold text-lg text-foreground">
          {t.kundli.pastReadings}
        </h3>
        <button
          onClick={onNewAnalysis}
          className="text-saffron font-sans text-sm font-medium hover:underline"
        >
          + {t.kundli.newAnalysis}
        </button>
      </div>

      {readings.slice(0, 10).map((reading) => {
        const isExpanded = expandedId === reading.id;
        const emoji = LENS_EMOJI[reading.lens] ?? "🔮";
        const lensLabel = t.kundli.lenses[reading.lens as keyof typeof t.kundli.lenses] ?? reading.lens;
        const date = new Date(reading.created_at).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return (
          <motion.div
            key={reading.id}
            layout
            className="border border-border rounded-2xl overflow-hidden bg-card"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : reading.id)}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{emoji}</span>
                <div className="min-w-0">
                  <p className="font-sans font-medium text-sm text-foreground truncate">
                    {lensLabel}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {reading.full_name} · {date}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && reading.result && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-border/50 pt-3">
                    <div className="prose prose-sm max-w-none font-sans text-foreground/90 whitespace-pre-wrap">
                      {reading.result.split("\n").map((line, i) => {
                        // Render **bold** headings
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={i} className="font-serif font-bold text-foreground mt-3 mb-1">
                              {line.replace(/\*\*/g, "")}
                            </p>
                          );
                        }
                        if (line.includes("**")) {
                          const parts = line.split(/\*\*(.*?)\*\*/g);
                          return (
                            <p key={i} className="mb-1.5 leading-relaxed text-sm">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? (
                                  <strong key={j} className="font-semibold text-foreground">
                                    {part}
                                  </strong>
                                ) : (
                                  <span key={j}>{part}</span>
                                ),
                              )}
                            </p>
                          );
                        }
                        if (!line.trim()) return <br key={i} />;
                        return (
                          <p key={i} className="mb-1.5 leading-relaxed text-sm">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default KundliHistory;
