/**
 * LanguageToggle.tsx
 * A vertical pill-shaped 3-way toggle: EN / हि / த
 * Slides a highlight indicator to the active option.
 * Vertical layout prevents overlap with logo on mobile.
 */

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  /** "light" = on transparent hero navbar, "dark" = on scrolled/white navbar */
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "EN",  ariaLabel: "Switch to English" },
  { lang: "hi" as const, label: "हि",  ariaLabel: "हिंदी में बदलें" },
  { lang: "ta" as const, label: "த",  ariaLabel: "தமிழில் மாற்றுக" },
];

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const activeIndex = OPTIONS.findIndex((o) => o.lang === language);

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`
        relative flex flex-col items-center rounded-full p-0.5
        ${variant === "light"
          ? "bg-white/15 border border-white/20"
          : "bg-secondary border border-border"
        }
      `}
    >
      {/* Sliding pill indicator — moves vertically */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute left-0.5 right-0.5 rounded-full bg-sacred-gradient shadow-sm pointer-events-none"
        style={{
          top: `calc(${activeIndex} * (100% / 3) + 2px)`,
          height: "calc(100% / 3 - 4px)",
        }}
      />

      {OPTIONS.map(({ lang, label, ariaLabel }) => {
        const isActive = language === lang;
        return (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            className={`
              relative z-10 w-8 py-0.5 text-xs font-sans font-semibold
              transition-colors duration-200 rounded-full text-center
              focus-visible:ring-2 focus-visible:ring-saffron outline-none
              ${isActive
                ? "text-white"
                : variant === "light"
                  ? "text-white/60 hover:text-white/90"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
