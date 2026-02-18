/**
 * useTranslations.ts
 * Simple hook — returns the full translation object for the current language.
 *
 * Usage:
 *   const { t, language, toggleLanguage, isHindi } = useTranslations();
 *   <p>{t.home.subtitle}</p>
 */

import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function useTranslations() {
  const { language, setLanguage, isHindi } = useLanguage();

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return { t, language, setLanguage, toggleLanguage, isHindi };
}
