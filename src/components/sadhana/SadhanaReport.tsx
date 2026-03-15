import { motion } from "framer-motion";
import {
  FileText,
  ThumbsUp,
  TrendingUp,
  Compass,
  Lightbulb,
  Award,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SadhanaReportData } from "@/hooks/useSadhanaReport";
import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  report: SadhanaReportData;
  onNewSession: () => void;
}

// Score color based on value
function scoreColor(score: number): string {
  if (score >= 8) return "text-green-500";
  if (score >= 5) return "text-saffron";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 8) return "bg-green-500/10 border-green-500/30";
  if (score >= 5) return "bg-saffron/10 border-saffron/30";
  return "bg-red-400/10 border-red-400/30";
}

export function SadhanaReportView({ report, onNewSession }: Props) {
  const { t } = useTranslations();

  const sections = [
    {
      icon: FileText,
      title: t.sadhana.reportSummary ?? "Summary",
      content: report.summary,
      type: "text" as const,
    },
    {
      icon: ThumbsUp,
      title: t.sadhana.reportStrengths ?? "Strengths",
      content: report.strengths,
      type: "list" as const,
    },
    {
      icon: TrendingUp,
      title: t.sadhana.reportImprovements ?? "Areas for Improvement",
      content: report.improvements,
      type: "list" as const,
    },
    {
      icon: Compass,
      title: t.sadhana.reportProgress ?? "Spiritual Progress Insight",
      content: report.spiritual_progress,
      type: "text" as const,
    },
    {
      icon: Lightbulb,
      title: t.sadhana.reportRecommendation ?? "Personalized Recommendation",
      content: report.recommendation,
      type: "text" as const,
    },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="font-serif text-xl font-bold text-foreground mb-1">
          {t.sadhana.reportTitle ?? "Your Sadhana Report"}
        </h2>
        <p className="text-xs text-muted-foreground font-sans">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Kolkata",
          })}
        </p>
      </motion.div>

      {/* Consistency Score Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="flex justify-center mb-6"
      >
        <div
          className={`
            flex flex-col items-center justify-center w-24 h-24 rounded-full border-2
            ${scoreBg(report.consistency_score)}
          `}
        >
          <Award className={`w-5 h-5 mb-1 ${scoreColor(report.consistency_score)}`} />
          <span className={`text-2xl font-serif font-bold ${scoreColor(report.consistency_score)}`}>
            {report.consistency_score}
          </span>
          <span className="text-[9px] text-muted-foreground font-sans">/ 10</span>
        </div>
      </motion.div>

      {/* Report sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2.5">
              <section.icon className="w-4 h-4 text-saffron shrink-0" />
              <h3 className="font-sans font-semibold text-sm text-foreground">
                {section.title}
              </h3>
            </div>

            {section.type === "text" ? (
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                {section.content as string}
              </p>
            ) : (
              <ul className="space-y-1.5">
                {(section.content as string[]).map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground font-sans">
                    <span className="text-saffron mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

      {/* New session button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <Button
          variant="outline"
          onClick={onNewSession}
          className="font-sans gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t.sadhana.newSession ?? "Start New Session"}
        </Button>
      </motion.div>
    </div>
  );
}
