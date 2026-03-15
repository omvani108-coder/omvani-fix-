/**
 * LanguageToggle.tsx
 * A Globe icon button that opens a dropdown to select the app language.
 */

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

const OPTIONS = [
  { lang: "en" as const, label: "English",  short: "EN" },
  { lang: "hi" as const, label: "हिंदी",    short: "हि" },
  { lang: "ta" as const, label: "தமிழ்",    short: "த"  },
];

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = OPTIONS.find((o) => o.lang === language) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        aria-expanded={open}
        className={`
          flex items-center gap-1.5 rounded-full px-2.5 py-1.5
          text-xs font-sans font-semibold transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-saffron outline-none
          ${variant === "light"
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }
        `}
      >
        <Globe className="w-4 h-4" />
        <span>{current.short}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 w-36 bg-card border border-border
                       rounded-xl shadow-lg overflow-hidden z-50"
          >
            {OPTIONS.map(({ lang, label, short }) => {
              const isActive = language === lang;
              return (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setOpen(false); }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5
                    text-sm font-sans transition-colors text-left
                    ${isActive
                      ? "bg-saffron/10 text-saffron font-semibold"
                      : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <span>{label}</span>
                  <span className="text-xs text-muted-foreground">{short}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
