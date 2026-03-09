import { motion } from "framer-motion";
import { Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function LanguageCard() {
  const { language, setLanguage, isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  return (
    <motion.div
      initial="hidden" animate="visible" custom={2} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <Globe className="w-4 h-4 text-saffron" />
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Language / भाषा / மொழி", "भाषा / Language / மொழி", "மொழி / Language / भाषा")}
        </h2>
      </div>
      <div className="px-6 py-5">
        <p className="text-xs text-muted-foreground font-sans mb-4">
          {tx(
            "Choose the language for the app UI and AI Guru responses",
            "ऐप UI और AI गुरु के उत्तर की भाषा चुनें",
            "பயன்பாட்டு UI மற்றும் AI குரு பதில்களுக்கான மொழியை தேர்வு செய்க"
          )}
        </p>
        <div className="flex gap-3">
          {[
            { lang: "en" as const, flag: "🇬🇧", name: "English", sub: "Respond in English" },
            { lang: "hi" as const, flag: "🇮🇳", name: "हिंदी", sub: "हिंदी में उत्तर दें" },
            { lang: "ta" as const, flag: "🇮🇳", name: "தமிழ்", sub: "தமிழில் பதில் தருக" },
          ].map(({ lang, flag, name, sub }) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                language === lang
                  ? "border-saffron bg-saffron/10 text-saffron"
                  : "border-border text-muted-foreground hover:border-saffron/40"
              }`}
            >
              <span className="text-2xl">{flag}</span>
              <span className="font-sans font-semibold text-sm">{name}</span>
              <span className="font-sans text-xs opacity-70 text-center leading-tight">{sub}</span>
              {language === lang && <CheckCircle className="w-4 h-4 text-saffron" />}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
