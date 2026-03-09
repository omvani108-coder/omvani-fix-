import { motion } from "framer-motion";
import { User, Mail, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { fadeUp } from "@/lib/animations";

export default function AccountInfoCard() {
  const { user } = useAuth();
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const email = user?.email || "";
  const provider = user?.app_metadata?.provider || "email";

  return (
    <motion.div
      initial="hidden" animate="visible" custom={0} variants={fadeUp}
      className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <User className="w-4 h-4 text-saffron" />
        <h2 className="font-sans font-semibold text-foreground text-sm">
          {tx("Account Info", "खाता जानकारी", "கணக்கு தகவல்")}
        </h2>
      </div>
      <div className="divide-y divide-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-sans mb-0.5">{tx("Name", "नाम", "பெயர்")}</p>
            <p className="text-sm font-sans text-foreground font-medium">{displayName}</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-sans mb-0.5">{tx("Email", "ईमेल", "மின்னஞ்சல்")}</p>
            <p className="text-sm font-sans text-foreground font-medium">{email}</p>
          </div>
          <Mail className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs text-muted-foreground font-sans mb-0.5">{tx("Sign-in method", "साइन-इन विधि", "உள்நுழைவு முறை")}</p>
            <p className="text-sm font-sans text-foreground font-medium capitalize">
              {provider === "google" ? "🔵 Google" : "📧 Email & Password"}
            </p>
          </div>
          <Shield className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
}
