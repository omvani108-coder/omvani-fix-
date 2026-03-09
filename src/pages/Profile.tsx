import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";
import ReminderSettings from "@/components/ReminderSettings";
import { SeoHead } from "@/components/SeoHead";

// ── Profile sub-components ─────────────────────────────────────────────────────
import ProfileHeader from "@/components/profile/ProfileHeader";
import AccountInfoCard from "@/components/profile/AccountInfoCard";
import PlanCard from "@/components/profile/PlanCard";
import AppearanceCard from "@/components/profile/AppearanceCard";
import LanguageCard from "@/components/profile/LanguageCard";
import PasswordCard from "@/components/profile/PasswordCard";
import NotificationsCard from "@/components/profile/NotificationsCard";
import SuprabhatCard from "@/components/profile/SuprabhatCard";
import QuickLinksCard from "@/components/profile/QuickLinksCard";
import DeleteAccountCard from "@/components/profile/DeleteAccountCard";

export default function Profile() {
  const { signOut } = useAuth();
  const { isHindi, isTamil } = useLanguage();
  const navigate = useNavigate();

  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success(tx("Signed out successfully", "आप सफलतापूर्वक साइन आउट हो गए", "வெற்றிகரமாக வெளியேறினீர்கள்"));
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Profile"
        description="Manage your OmVani account, subscription, and preferences."
        canonicalPath="/profile"
      />
      <Navbar />

      <ProfileHeader />

      <div className="max-w-2xl mx-auto px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] space-y-6">
        <AccountInfoCard />
        <PlanCard />
        <AppearanceCard />
        <LanguageCard />
        <PasswordCard />
        <NotificationsCard />
        <SuprabhatCard />

        {/* Puja Reminders (Email/WhatsApp) */}
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp}>
          <ReminderSettings />
        </motion.div>

        <QuickLinksCard />

        {/* Legal Links */}
        <motion.div
          initial="hidden" animate="visible" custom={8} variants={fadeUp}
          className="flex justify-center gap-4 text-xs font-sans text-muted-foreground"
        >
          <Link to="/privacy" className="hover:text-saffron hover:underline">
            {tx("Privacy Policy", "गोपनीयता नीति", "தனியுரிமைக் கொள்கை")}
          </Link>
          <span className="text-border">|</span>
          <Link to="/terms" className="hover:text-saffron hover:underline">
            {tx("Terms of Service", "सेवा की शर्तें", "சேவை விதிமுறைகள்")}
          </Link>
        </motion.div>

        {/* Sign Out */}
        <motion.div initial="hidden" animate="visible" custom={9} variants={fadeUp}>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 font-sans text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {tx("Sign Out", "साइन आउट करें", "வெளியேறு")}
          </button>
        </motion.div>

        <DeleteAccountCard />
      </div>
    </div>
  );
}
