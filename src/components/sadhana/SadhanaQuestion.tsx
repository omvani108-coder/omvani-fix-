import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SadhanaQuestion as QuestionType, SadhanaAnswer } from "@/hooks/useSadhanaReport";
import { useTranslations } from "@/hooks/useTranslations";

interface Props {
  questions: QuestionType[];
  onComplete: (answers: SadhanaAnswer[]) => void;
}

export function SadhanaQuestionFlow({ questions, onComplete }: Props) {
  const { t } = useTranslations();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string; isCustom: boolean }>>({});
  const [customText, setCustomText] = useState("");
  const [direction, setDirection] = useState(1); // 1=forward, -1=back

  const q = questions[currentIdx];
  const currentAnswer = answers[q?.id];
  const isLast = currentIdx === questions.length - 1;
  const hasAnswer = !!currentAnswer?.answer;

  // Reset custom text when navigating
  useEffect(() => {
    if (q) {
      const saved = answers[q.id];
      setCustomText(saved?.isCustom ? saved.answer : "");
    }
  }, [currentIdx, q?.id]);

  const selectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { answer: option, isCustom: false },
    }));
    setCustomText("");
  };

  const handleCustomChange = (text: string) => {
    // Enforce 5-word limit
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length > 5) return;
    setCustomText(text);
    if (text.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: { answer: text.trim(), isCustom: true },
      }));
    } else {
      // Clear custom answer — restore MCQ if previously selected
      setAnswers((prev) => {
        const existing = prev[q.id];
        if (existing?.isCustom) {
          const { [q.id]: _, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    }
  };

  const goNext = () => {
    if (isLast) {
      // Submit all answers
      const result: SadhanaAnswer[] = questions.map((question) => ({
        questionId: question.id,
        question: question.question,
        answer: answers[question.id]?.answer ?? "",
        isCustom: answers[question.id]?.isCustom ?? false,
      }));
      onComplete(result);
    } else {
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentIdx((i) => Math.max(0, i - 1));
  };

  if (!q) return null;

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Progress */}
      <div className="mb-6">
        <p className="text-xs font-sans text-muted-foreground mb-2">
          {t.sadhana.questionOf
            ?.replace("{current}", String(currentIdx + 1))
            .replace("{total}", String(questions.length))
            ?? `Q${currentIdx + 1} of ${questions.length}`}
        </p>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-saffron rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question with animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={q.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.25 }}
        >
          {/* Question text */}
          <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
            {q.question}
          </h3>

          {/* MCQ options */}
          <div className="space-y-2.5 mb-5">
            {q.options.map((option) => {
              const isSelected = currentAnswer?.answer === option && !currentAnswer.isCustom;
              return (
                <button
                  key={option}
                  onClick={() => selectOption(option)}
                  className={`
                    w-full text-left px-4 py-3 rounded-xl border-2 font-sans text-sm
                    transition-all duration-200
                    ${isSelected
                      ? "border-saffron bg-saffron/10 text-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-saffron/40"
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-saffron" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-saffron"
                        />
                      )}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-sans">
              {t.sadhana.orWriteOwn ?? "or"}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Custom text input */}
          <Input
            value={customText}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder={t.sadhana.customPlaceholder ?? "Write your own (1-5 words)..."}
            className="text-sm"
          />
          <p className="text-[10px] text-muted-foreground/60 font-sans mt-1 text-right">
            {t.sadhana.maxWords ?? "Max 5 words"}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={currentIdx === 0}
          className="font-sans gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.common.back}
        </Button>

        <Button
          variant="hero"
          size="sm"
          onClick={goNext}
          disabled={!hasAnswer}
          className="font-sans gap-1"
        >
          {isLast ? (
            <>
              <Sparkles className="w-4 h-4" />
              {t.sadhana.generateReport ?? "Generate My Report"}
            </>
          ) : (
            <>
              {t.common.next}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
