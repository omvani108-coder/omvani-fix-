/**
 * LanguageToggle.tsx
 * A pill-shaped EN ↔ हि toggle that lives in the Navbar.
 * Animates smoothly between the two states.
 */

import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

interface LanguageToggleProps {
  /** "light" = on transparent hero navbar, "dark" = on scrolled/white navbar */
  variant?: "light" | "dark";
}

export function LanguageToggle({ variant = "dark" }: LanguageToggleProps) {
  const { isHindi, toggleLanguage } = useTranslations();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={isHindi ? "Switch to English" : "हिंदी में बदलें"}
      className={`
        relative flex items-center rounded-full p-0.5 transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-saffron outline-none
        ${variant === "light"
          ? "bg-white/15 hover:bg-white/25 border border-white/20"
          : "bg-secondary hover:bg-saffron/10 border border-border"
        }
      `}
    >
      {/* Sliding pill indicator */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-sacred-gradient shadow-sm"
        style={{ left: isHindi ? "calc(50% + 2px)" : "2px" }}
      />

      {/* EN label */}
      <span
        className={`
          relative z-10 px-3 py-1 text-xs font-sans font-semibold transition-colors duration-200 rounded-full
          ${!isHindi
            ? "text-white"
            : variant === "light" ? "text-white/60" : "text-muted-foreground"
          }
        `}
      >
        EN
      </span>

      {/* HI label */}
      <span
        className={`
          relative z-10 px-3 py-1 text-xs font-sans font-semibold transition-colors duration-200 rounded-full
          ${isHindi
            ? "text-white"
            : variant === "light" ? "text-white/60" : "text-muted-foreground"
          }
        `}
      >
        हि
      </span>
    </button>
  );
}
