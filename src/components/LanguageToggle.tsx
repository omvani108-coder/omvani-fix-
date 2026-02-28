/**
 * LanguageToggle.tsx
 *
 * A tall tic-tac shaped button showing the active language.
 * Click → dropdown slides down with 3 options.
 * Select → dropdown closes, button updates.
 *
 * Desktop & Mobile identical behaviour.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "EN", full: "English" },
  { lang: "hi" as const, label: "हि", full: "हिंदी"  },
  { lang: "ta" as const, label: "த",  full: "தமிழ்"  },
];

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isLight = variant === "light";
  const current = OPTIONS.find((o) => o.lang === language)!;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (lang: typeof OPTIONS[number]["lang"]) => {
    setLanguage(lang);
    setOpen(false);
  };

  // Tic-tac pill button styles
  const pillBase = `
    relative flex items-center justify-center
    w-8 rounded-full border
    text-[11px] font-sans font-bold
    transition-all duration-200 cursor-pointer
    focus-visible:ring-2 focus-visible:ring-saffron outline-none
    select-none
  `;

  const pillClosed = isLight
    ? "bg-black/35 backdrop-blur-md border-white/25 text-white shadow-md"
    : "bg-secondary border-border text-foreground";

  const pillOpen = "bg-sacred-gradient border-transparent text-white shadow-sacred";

  return (
    <div ref={ref} className="relative z-[100]">

      {/* ── The tic-tac button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        aria-expanded={open}
        className={`${pillBase} ${open ? pillOpen : pillClosed}`}
        style={{ height: 44, paddingTop: 2, paddingBottom: 2 }}
      >
        {current.label}
      </button>

      {/* ── Dropdown ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.85 }}
            animate={{ opacity: 1, y: 0,  scaleY: 1    }}
            exit={{   opacity: 0, y: -6,  scaleY: 0.85 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            style={{ transformOrigin: "top center" }}
            className={`
              absolute top-[calc(100%+6px)] right-0
              flex flex-col overflow-hidden
              rounded-2xl border shadow-xl min-w-[110px]
              ${isLight
                ? "bg-black/60 backdrop-blur-xl border-white/15"
                : "bg-card border-border"
              }
            `}
          >
            {OPTIONS.map(({ lang, label, full }) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => handleSelect(lang)}
                  className={`
                    flex items-center gap-3 px-4 py-3
                    text-sm font-sans font-semibold text-left
                    transition-colors duration-150 w-full
                    ${isActive
                      ? "bg-sacred-gradient text-white"
                      : isLight
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <span className="text-base w-5 text-center leading-none">{label}</span>
                  <span className="text-xs opacity-75">{full}</span>
                  {isActive && <span className="ml-auto text-[10px]">✓</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
