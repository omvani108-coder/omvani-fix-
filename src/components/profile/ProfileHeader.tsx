import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileHeader() {
  const { user } = useAuth();
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const email = user?.email || "";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      })
    : "";

  return (
    <section className="pt-24 pb-10 px-4 bg-gradient-to-b from-secondary/60 to-background">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-sacred-gradient flex items-center justify-center text-3xl mx-auto mb-4 shadow-sacred"
        >
          &#x0950;
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-serif font-bold text-foreground mb-1"
        >
          {displayName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-sans text-sm"
        >
          {email} &middot; {tx("Member", "सदस्य", "உறுப்பினர்")} {joinDate}
        </motion.p>
      </div>
    </section>
  );
}
