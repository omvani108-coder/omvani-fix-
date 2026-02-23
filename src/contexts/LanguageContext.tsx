import { createContext, useContext, useState, ReactNode } from "react";

// ── "ta" added for Tamil ───────────────────────────────────────────────────────
type Language = "en" | "hi" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isHindi: boolean;
  isTamil: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isHindi: false,
  isTamil: false,
});

export const useLanguage = () => useContext(LanguageContext);

const VALID_LANGUAGES: Language[] = ["en", "hi", "ta"];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("omvani-language") as Language;
    return VALID_LANGUAGES.includes(stored) ? stored : "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("omvani-language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        isHindi: language === "hi",
        isTamil: language === "ta",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

