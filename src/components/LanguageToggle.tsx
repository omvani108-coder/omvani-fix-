/**
 * LanguageToggle.tsx
 * A pill-shaped 3-way toggle: EN | हि | த
 *
 * • Desktop  → horizontal row (original layout)
 * • Mobile   → vertical column with a semi-transparent backdrop so it
 *              never overlaps or clashes with the centred hero text
 */

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  /** "light" = on transparent hero navbar, "dark" = on scrolled/solid navbar */
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "EN", ariaLabel: "Switch to English" },
  { lang: "hi" as const, label: "हि", ariaLabel: "हिंदी में बदलें" },
  { lang: "ta" as const, label: "த",  ariaLabel: "தமிழில் மாற்றுக" },
];

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const activeIndex = OPTIONS.findIndex((o) => o.lang === language);

  const lightBg = "bg-black/30 border border-white/25 backdrop-blur-md";
  const darkBg  = "bg-secondary border border-border";

  return (
    <>
      {/* ── MOBILE: vertical stack ───────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Select language"
        className={`
          md:hidden
          relative flex flex-col items-center rounded-2xl p-0.5
          ${variant === "light" ? lightBg : darkBg}
        `}
      >
        {/* Sliding pill moves vertically */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute left-0.5 right-0.5 rounded-xl bg-sacred-gradient shadow-sm pointer-events-none"
          style={{
            top:    `calc(${activeIndex} * (100% / 3) + 2px)`,
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
                relative z-10 w-8 h-7 text-[11px] font-sans font-bold
                transition-colors duration-200 rounded-xl text-center
                focus-visible:ring-2 focus-visible:ring-saffron outline-none
                ${isActive
                  ? "text-white"
                  : variant === "light"
                    ? "text-white/55 hover:text-white/90"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── DESKTOP: original horizontal row ─────────────────────────────── */}
      <div
        role="group"
        aria-label="Select language"
        className={`
          hidden md:flex
          relative items-center rounded-full p-0.5
          ${variant === "light"
            ? "bg-white/15 border border-white/20"
            : darkBg
          }
        `}
      >
        {/* Sliding pill moves horizontally */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute top-0.5 bottom-0.5 rounded-full bg-sacred-gradient shadow-sm pointer-events-none"
          style={{
            left:  `calc(${activeIndex} * (100% / 3) + 2px)`,
            width: "calc(100% / 3 - 4px)",
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
                relative z-10 w-9 py-1 text-xs font-sans font-semibold
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
    </>
  );
}
