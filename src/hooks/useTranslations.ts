/**
 * useTranslations.ts
 * Simple hook — returns the full translation object for the current language.
 *
 * Usage:
 *   const { t, language, setLanguage, isHindi, isTamil } = useTranslations();
 *   <p>{t.home.subtitle}</p>
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function useTranslations() {
  const { language, setLanguage, isHindi, isTamil } = useLanguage();

  // Fall back to English if key is missing (safety net during dev)
  const t = (translations as unknown as Record<string, typeof translations.en>)[language] ?? translations.en;

  // Cycles EN → HI → TA → EN (kept for backward compat)
  const toggleLanguage = () => {
    if (language === "en") setLanguage("hi");
    else if (language === "hi") setLanguage("ta");
    else setLanguage("en");
  };

  return { t, language, setLanguage, toggleLanguage, isHindi, isTamil };
}
