/**
 * LanguageToggle.tsx
 *
 * Both mobile & desktop → tall vertical "tic-tac" pill
 * • Click any language to select
 * • Drag/swipe up-down to slide between options
 * • Animated saffron indicator slides to active option
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "EN" },
  { lang: "hi" as const, label: "हि" },
  { lang: "ta" as const, label: "த"  },
];

const ITEM_H = 28; // px height of each slot

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const activeIndex = OPTIONS.findIndex((o) => o.lang === language);
  const isLight = variant === "light";

  // ── Drag support ────────────────────────────────────────────────────────────
  const dragStartY = useRef<number>(0);
  const dragStartIdx = useRef<number>(0);

  const onDragStart = (_: unknown, info: { point: { y: number } }) => {
    dragStartY.current = info.point.y;
    dragStartIdx.current = activeIndex;
  };

  const onDrag = (_: unknown, info: { point: { y: number } }) => {
    const delta = info.point.y - dragStartY.current;
    const steps = Math.round(delta / ITEM_H);
    const next = Math.min(Math.max(dragStartIdx.current + steps, 0), OPTIONS.length - 1);
    if (next !== activeIndex) setLanguage(OPTIONS[next].lang);
  };

  const containerBg = isLight
    ? "bg-black/30 backdrop-blur-md border-white/20"
    : "bg-secondary border-border";

  const totalH = OPTIONS.length * ITEM_H; // 84px

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`relative flex flex-col items-center rounded-full border p-[3px] select-none ${containerBg}`}
      style={{ width: 32, height: totalH + 6 }}
    >
      {/* Sliding saffron pill */}
      <motion.div
        animate={{ y: activeIndex * ITEM_H }}
        transition={{ type: "spring", stiffness: 500, damping: 36 }}
        className="absolute left-[3px] right-[3px] rounded-full bg-sacred-gradient shadow-sm pointer-events-none"
        style={{ height: ITEM_H - 2, top: 3 }}
      />

      {/* Drag capture layer — invisible, sits on top of the pill */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={onDragStart}
        onDrag={onDrag}
        className="absolute inset-0 rounded-full z-20 cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
      />

      {/* Language buttons */}
      {OPTIONS.map(({ lang, label }, i) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            aria-label={`Switch to ${lang}`}
            aria-pressed={isActive}
            className={`
              relative z-30 flex items-center justify-center
              text-[11px] font-sans font-bold rounded-full
              transition-colors duration-200
              focus-visible:ring-2 focus-visible:ring-saffron outline-none
              ${isActive
                ? "text-white"
                : isLight
                  ? "text-white/55 hover:text-white/90"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
            style={{ width: 26, height: ITEM_H }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
