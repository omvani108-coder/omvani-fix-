import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isHindi: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("omvani-language") as Language) || "en"
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("omvani-language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, isHindi: language === "hi" }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
