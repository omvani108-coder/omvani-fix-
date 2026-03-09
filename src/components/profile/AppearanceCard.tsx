import { motion } from "framer-motion";
import { Moon, Sun, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { fadeUp } from "@/lib/animations";

export default function AppearanceCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial="hidden" animate="visible" custom={2} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-saffron" />
        ) : (
          <Sun className="w-4 h-4 text-saffron" />
        )}
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Appearance", "दिखावट", "தோற்றம்")}
        </h2>
      </div>
      <div className="px-6 py-5">
        <p className="text-xs text-muted-foreground font-sans mb-4">
          {tx("Choose the app theme", "ऐप की थीम चुनें", "பயன்பாட்டின் தீம் தேர்வு செய்க")}
        </p>
        <div className="flex gap-3">
          {[
            { value: "light", icon: <Sun className="w-6 h-6" />, label: tx("Light", "लाइट", "வெளிர்") },
            { value: "dark", icon: <Moon className="w-6 h-6" />, label: tx("Dark", "डार्क", "இருள்") },
          ].map(({ value, icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                theme === value
                  ? "border-saffron bg-saffron/10 text-saffron"
                  : "border-border text-muted-foreground hover:border-saffron/40"
              }`}
            >
              {icon}
              <span className="font-sans font-semibold text-sm">{label}</span>
              {theme === value && <CheckCircle className="w-4 h-4 text-saffron" />}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
