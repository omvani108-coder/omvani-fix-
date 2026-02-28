/**
 * LanguageToggle.tsx
 *
 * Desktop → compact horizontal pill (unchanged)
 * Mobile  → single button showing current language
 *           tap → animated dropdown with 3 vertical options
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "EN", full: "English" },
  { lang: "hi" as const, label: "हि", full: "हिंदी" },
  { lang: "ta" as const, label: "த",  full: "தமிழ்" },
];

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeIndex = OPTIONS.findIndex((o) => o.lang === language);
  const current = OPTIONS[activeIndex];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isLight = variant === "light";

  return (
    <>
      {/* ── MOBILE ───────────────────────────────────────────────────────── */}
      <div className="md:hidden relative" ref={ref}>

        {/* Trigger button — shows current language */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Select language"
          aria-expanded={open}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center
            text-[11px] font-sans font-bold transition-all duration-200
            focus-visible:ring-2 focus-visible:ring-saffron outline-none
            ${isLight
              ? open
                ? "bg-saffron text-white shadow-lg"
                : "bg-black/30 backdrop-blur-md border border-white/25 text-white shadow-md"
              : open
                ? "bg-saffron text-white shadow-sacred"
                : "bg-secondary border border-border text-foreground"
            }
          `}
        >
          {current.label}
        </button>

        {/* Dropdown — vertical list of options */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.85,  y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`
                absolute right-0 top-[calc(100%+8px)] z-[999]
                flex flex-col overflow-hidden rounded-2xl shadow-xl
                border min-w-[100px]
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
                    onClick={() => { setLanguage(lang); setOpen(false); }}
                    className={`
                      flex items-center gap-3 px-4 py-3
                      text-sm font-sans font-semibold text-left
                      transition-colors duration-150
                      ${isActive
                        ? "bg-sacred-gradient text-white"
                        : isLight
                          ? "text-white/80 hover:bg-white/10 hover:text-white"
                          : "text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <span className="text-base leading-none w-5 text-center">{label}</span>
                    <span className="text-xs opacity-80">{full}</span>
                    {isActive && (
                      <span className="ml-auto text-[10px] opacity-70">✓</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── DESKTOP: original horizontal pill ────────────────────────────── */}
      <div
        role="group"
        aria-label="Select language"
        className={`
          hidden md:flex
          relative items-center rounded-full p-0.5
          ${isLight
            ? "bg-white/15 border border-white/20"
            : "bg-secondary border border-border"
          }
        `}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute top-0.5 bottom-0.5 rounded-full bg-sacred-gradient shadow-sm pointer-events-none"
          style={{
            left:  `calc(${activeIndex} * (100% / 3) + 2px)`,
            width: "calc(100% / 3 - 4px)",
          }}
        />
        {OPTIONS.map(({ lang, label }) => {
          const isActive = language === lang;
          return (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              aria-pressed={isActive}
              className={`
                relative z-10 w-9 py-1 text-xs font-sans font-semibold
                transition-colors duration-200 rounded-full text-center
                focus-visible:ring-2 focus-visible:ring-saffron outline-none
                ${isActive
                  ? "text-white"
                  : isLight
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
