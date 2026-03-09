import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function QuickLinksCard() {
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const links = [
    { label: tx("Talk to Guru", "गुरु से बात करें", "குருவிடம் பேசுங்கள்"), href: "/chat", emoji: "ॐ" },
    { label: tx("Read Bhagavad Gita", "भगवद गीता पढ़ें", "பகவத் கீதை படிக்க"), href: "/scriptures", emoji: "📖" },
    { label: tx("Listen to Bhajans", "भजन सुनें", "பஜனைகள் கேளுங்கள்"), href: "/bhajans", emoji: "🎵" },
    { label: tx("Find Mandirs", "मंदिर खोजें", "கோயில்கள் தேடுங்கள்"), href: "/mandirs", emoji: "🛕" },
  ];

  return (
    <motion.div
      initial="hidden" animate="visible" custom={7} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <ChevronRight className="w-4 h-4 text-saffron" />
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Quick Links", "त्वरित लिंक", "விரைவு இணைப்புகள்")}
        </h2>
      </div>
      <div className="divide-y divide-border">
        {links.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-sans text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-saffron transition-colors" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
