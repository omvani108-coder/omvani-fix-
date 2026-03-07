import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, LogOut, ChevronRight, Shield, Bell, BellOff, Globe, Eye, EyeOff, CheckCircle, Moon, Sun, Sunrise, Clock, Crown, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";
import { useNotifications } from "@/hooks/useNotifications";
import { useSuprabhat } from "@/hooks/useSuprabhat";
import ReminderSettings from "@/components/ReminderSettings";
import UpgradeModal from "@/components/UpgradeModal";
import { useSubscription } from "@/hooks/useSubscription";
import { useTheme } from "next-themes";
import { SeoHead } from "@/components/SeoHead";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, isHindi, isTamil } = useLanguage();
  const navigate = useNavigate();
  const { supported: notifSupported, enabled: notifEnabled, permission, toggleNotifications } = useNotifications();
  const {
    enabled:         suprabhatEnabled,
    time:            suprabhatTime,
    supported:       suprabhatSupported,
    toggleSuprabhat,
    setTime:         setSuprabhatTime,
    sendTestCard,
  } = useSuprabhat();
  const { theme, setTheme } = useTheme();
  const { plan, status, isPaid, isFree, isTrialing, trialEndsAt, isAnnual, refreshSubscription } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const email = user?.email || "";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : "";
  const provider = user?.app_metadata?.provider || "email";

  // Helper: pick text by active language (EN / HI / TA)
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success(tx("Signed out successfully", "आप सफलतापूर्वक साइन आउट हो गए", "வெற்றிகரமாக வெளியேறினீர்கள்"));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(tx("Passwords do not match", "पासवर्ड मेल नहीं खाते", "கடவுச்சொற்கள் பொருந்தவில்லை"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(tx("Password must be at least 8 characters", "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए", "கடவுச்சொல் குறைந்தது 8 எழுத்துகளாக இருக்க வேண்டும்"));
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      toast.success(tx("Password updated successfully", "पासवर्ड सफलतापूर्वक बदला गया", "கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது"));
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleteLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(`${supabaseUrl}/functions/v1/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account");
      }
      await supabase.auth.signOut();
      navigate("/");
      toast.success(tx("Account deleted. We're sorry to see you go.", "खाता हटा दिया गया।", "கணக்கு நீக்கப்பட்டது."));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Profile" description="Manage your OmVani account, subscription, and preferences." canonicalPath="/profile" />
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-10 px-4 bg-gradient-to-b from-secondary/60 to-background">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-sacred-gradient flex items-center justify-center text-3xl mx-auto mb-4 shadow-sacred"
          >
            ॐ
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
            {email} · {tx("Member", "सदस्य", "உறுப்பினர்")} {joinDate}
          </motion.p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] space-y-6">

        {/* Account Info */}
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

        {/* Your Plan */}
        <motion.div
          initial="hidden" animate="visible" custom={1} variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Crown className="w-4 h-4 text-saffron" />
            <h2 className="font-sans font-semibold text-foreground text-sm">
              {tx("Your Plan", "आपकी योजना", "உங்கள் திட்டம்")}
            </h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground font-sans mb-0.5">{tx("Current Plan", "वर्तमान योजना", "தற்போதைய திட்டம்")}</p>
                <p className="text-sm font-sans text-foreground font-medium">
                  {plan === "free" && "Seeker (Free)"}
                  {(plan === "basic" || plan === "basic_annual") && "Sadhak"}
                  {(plan === "pro" || plan === "pro_annual") && "Guru"}
                  {plan === "family" && "Family"}
                  {isAnnual && <span className="text-xs text-muted-foreground ml-1">({tx("Annual", "वार्षिक", "வருடாந்திர")})</span>}
                </p>
              </div>
              <span className={`text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full ${
                status === "active"    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                status === "trialing"  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                status === "cancelled" ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" :
                                         "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {status === "active" && tx("Active", "सक्रिय", "செயலில்")}
                {status === "trialing" && tx("Trial", "परीक्षण", "சோதனை")}
                {status === "cancelled" && tx("Cancelled", "रद्द", "ரத்து")}
                {status === "expired" && tx("Expired", "समाप्त", "காலாவதி")}
              </span>
            </div>
            {isTrialing && trialEndsAt && (
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-xs text-muted-foreground font-sans mb-0.5">{tx("Trial Ends", "परीक्षण समाप्ति", "சோதனை முடிவு")}</p>
                  <p className="text-sm font-sans text-foreground font-medium">
                    {trialEndsAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}
            <div className="px-6 py-4">
              {isFree ? (
                <Button
                  onClick={() => setUpgradeOpen(true)}
                  className="w-full bg-sacred-gradient text-white hover:opacity-90 font-sans font-semibold text-sm"
                >
                  {tx("Upgrade Plan", "योजना अपग्रेड करें", "திட்டத்தை மேம்படுத்தவும்")}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground font-sans text-center">
                  {tx("Manage your subscription from your Razorpay account",
                      "अपनी सदस्यता Razorpay खाते से प्रबंधित करें",
                      "உங்கள் சந்தாவை Razorpay கணக்கிலிருந்து நிர்வகிக்கவும்")}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          refreshSubscription={refreshSubscription}
        />

        {/* Appearance */}
        <motion.div
          initial="hidden" animate="visible" custom={2} variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            {theme === "dark" ? <Moon className="w-4 h-4 text-saffron" /> : <Sun className="w-4 h-4 text-saffron" />}
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
                { value: "dark",  icon: <Moon className="w-6 h-6" />, label: tx("Dark",  "डार्क",  "இருள்") },
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

        {/* Language — 3-option: EN / HI / TA */}
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
                { lang: "en" as const, flag: "🇬🇧", name: "English",  sub: "Respond in English" },
                { lang: "hi" as const, flag: "🇮🇳", name: "हिंदी",    sub: "हिंदी में उत्तर दें" },
                { lang: "ta" as const, flag: "🇮🇳", name: "தமிழ்",   sub: "தமிழில் பதில் தருக" },
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

        {/* Change Password */}
        {provider !== "google" && (
          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeUp}
            className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Lock className="w-4 h-4 text-saffron" />
              <h2 className="font-sans font-semibold text-foreground text-sm">
                {tx("Change Password", "पासवर्ड बदलें", "கடவுச்சொல் மாற்று")}
              </h2>
            </div>
            <form onSubmit={handlePasswordChange} className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Label className="font-sans text-xs text-muted-foreground">
                  {tx("New Password", "नया पासवर्ड", "புதிய கடவுச்சொல்")}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs text-muted-foreground">
                  {tx("Confirm New Password", "पासवर्ड की पुष्टि करें", "கடவுச்சொல்லை உறுதிப்படுத்துக")}
                </Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="sm"
                disabled={passwordLoading || !newPassword || !confirmPassword}
                className="w-full gap-2"
              >
                {passwordLoading
                  ? tx("Updating...", "अपडेट हो रहा है...", "புதுப்பிக்கிறோம்...")
                  : passwordSuccess
                  ? <><CheckCircle className="w-4 h-4" /> {tx("Updated!", "सफल!", "வெற்றி!")}</>
                  : tx("Update Password", "पासवर्ड अपडेट करें", "கடவுச்சொல் புதுப்பி")}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Notifications */}
        {notifSupported && (
          <motion.div
            initial="hidden" animate="visible" custom={4} variants={fadeUp}
            className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Bell className="w-4 h-4 text-saffron" />
              <h2 className="font-sans font-semibold text-foreground text-sm">
                {tx("Notifications", "सूचनाएं", "அறிவிப்புகள்")}
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs text-muted-foreground font-sans mb-4">
                {tx(
                  "Receive your daily shloka every morning at 7am",
                  "हर सुबह 7 बजे दैनिक श्लोक प्राप्त करें",
                  "தினமும் காலை 7 மணிக்கு தினசரி ஸ்லோகம் பெறுங்கள்"
                )}
              </p>
              <button
                onClick={async () => {
                  await toggleNotifications();
                  toast.success(notifEnabled
                    ? tx("Notifications disabled", "सूचनाएं बंद की गईं", "அறிவிப்புகள் நிறுத்தப்பட்டன")
                    : tx("Notifications enabled 🔔", "सूचनाएं सक्षम की गईं 🔔", "அறிவிப்புகள் இயக்கப்பட்டன 🔔")
                  );
                }}
                disabled={permission === "denied"}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  notifEnabled ? "border-saffron bg-saffron/10" : "border-border hover:border-saffron/40"
                } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                    notifEnabled ? "bg-sacred-gradient shadow-sacred" : "bg-muted"
                  }`}>ॐ</div>
                  <div className="text-left">
                    <p className={`text-sm font-sans font-semibold ${notifEnabled ? "text-saffron" : "text-foreground"}`}>
                      {tx("Daily Shloka", "दैनिक श्लोक", "தினசரி ஸ்லோகம்")}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground">
                      {permission === "denied"
                        ? tx("Blocked by browser", "ब्राउज़र ने ब्लॉक किया", "உலாவியால் தடுக்கப்பட்டது")
                        : notifEnabled
                        ? tx("Enabled — every morning at 7am", "सक्षम — हर सुबह 7 बजे", "இயக்கப்பட்டது — தினமும் காலை 7 மணி")
                        : tx("Currently off", "बंद है", "தற்போது அணைக்கப்பட்டுள்ளது")}
                    </p>
                  </div>
                </div>
                {notifEnabled
                  ? <Bell className="w-5 h-5 text-saffron shrink-0" aria-hidden="true" />
                  : <BellOff className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />}
              </button>
              {permission === "denied" && (
                <p className="text-[10px] text-muted-foreground font-sans mt-2 text-center">
                  {tx(
                    "Allow notifications in your browser settings to enable this",
                    "नोटिफिकेशन के लिए ब्राउज़र सेटिंग में अनुमति दें",
                    "இதை இயக்க உங்கள் உலாவி அமைப்புகளில் அறிவிப்புகளை அனுமதிக்கவும்"
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Suprabhat — Morning Card Automation */}
        {suprabhatSupported && (
          <motion.div
            initial="hidden" animate="visible" custom={5} variants={fadeUp}
            className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Sunrise className="w-4 h-4 text-saffron" />
              <h2 className="font-sans font-semibold text-foreground text-sm">
                {tx("Suprabhat / सुप्रभात", "सुप्रभात / Good Morning", "சுப்ரபாதம்")}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-xs text-muted-foreground font-sans">
                {tx(
                  "Get a divine morning blessing card at your chosen time each day — ready to share on WhatsApp Status.",
                  "हर दिन अपने चुने समय पर दिव्य सुप्रभात कार्ड पाएं — WhatsApp Status पर शेयर करने के लिए तैयार।",
                  "ஒவ்வொரு நாளும் தேர்ந்த நேரத்தில் தெய்வீக காலை வாழ்த்து அட்டை பெறுங்கள் — WhatsApp Status-ல் பகிர தயார்."
                )}
              </p>

              {/* Enable / Disable toggle */}
              <button
                onClick={async () => {
                  await toggleSuprabhat();
                  toast.success(suprabhatEnabled
                    ? tx("Suprabhat disabled", "सुप्रभात बंद किया गया", "சுப்ரபாதம் நிறுத்தப்பட்டது")
                    : tx("Suprabhat enabled 🌅", "सुप्रभात सक्षम हुआ 🌅", "சுப்ரபாதம் இயக்கப்பட்டது 🌅")
                  );
                }}
                disabled={permission === "denied"}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  suprabhatEnabled ? "border-saffron bg-saffron/10" : "border-border hover:border-saffron/40"
                } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                    suprabhatEnabled ? "bg-sacred-gradient shadow-sacred" : "bg-muted"
                  }`}>🌅</div>
                  <div className="text-left">
                    <p className={`text-sm font-sans font-semibold ${suprabhatEnabled ? "text-saffron" : "text-foreground"}`}>
                      {tx("Morning Blessing Card", "प्रातः आशीर्वाद कार्ड", "காலை ஆசீர்வாத அட்டை")}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground">
                      {permission === "denied"
                        ? tx("Blocked by browser", "ब्राउज़र ने ब्लॉक किया", "உலாவியால் தடுக்கப்பட்டது")
                        : suprabhatEnabled
                        ? tx(`Enabled — sends at ${suprabhatTime}`, `सक्षम — ${suprabhatTime} बजे`, `இயக்கப்பட்டது — ${suprabhatTime}`)
                        : tx("Currently off", "बंद है", "தற்போது அணைக்கப்பட்டுள்ளது")}
                    </p>
                  </div>
                </div>
                {suprabhatEnabled
                  ? <Sunrise className="w-5 h-5 text-saffron shrink-0" aria-hidden="true" />
                  : <Sunrise className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />}
              </button>

              {/* Time picker — only shown when enabled */}
              {suprabhatEnabled && (
                <div className="flex items-center gap-3 px-1">
                  <Clock className="w-4 h-4 text-saffron shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground font-sans block mb-1">
                      {tx("Send at time", "किस समय भेजें", "எந்த நேரத்தில் அனுப்பு")}
                    </label>
                    <input
                      type="time"
                      value={suprabhatTime}
                      onChange={(e) => {
                        setSuprabhatTime(e.target.value);
                        toast.info(tx(`Morning card set for ${e.target.value}`, `सुप्रभात समय: ${e.target.value}`, `நேரம் அமைக்கப்பட்டது: ${e.target.value}`));
                      }}
                      className="font-sans text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-saffron/40 w-36"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      sendTestCard();
                      toast.success(tx("Test card sent! Check your notifications.", "टेस्ट कार्ड भेजा गया! नोटिफिकेशन देखें।", "சோதனை அட்டை அனுப்பப்பட்டது!"));
                    }}
                    className="shrink-0 border-saffron/40 text-saffron hover:bg-saffron/10 font-sans text-xs"
                  >
                    {tx("Send Test", "टेस्ट करें", "சோதனை")}
                  </Button>
                </div>
              )}

              {permission === "denied" && (
                <p className="text-[10px] text-muted-foreground font-sans text-center">
                  {tx(
                    "Allow notifications in your browser settings to enable Suprabhat",
                    "सुप्रभात के लिए ब्राउज़र सेटिंग में नोटिफिकेशन की अनुमति दें",
                    "சுப்ரபாதம் இயக்க உலாவி அமைப்புகளில் அறிவிப்புகளை அனுமதிக்கவும்"
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Puja Reminders (Email/WhatsApp) */}
        <motion.div initial="hidden" animate="visible" custom={6} variants={fadeUp}>
          <ReminderSettings />
        </motion.div>

        {/* Quick Links */}
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
            {[
              { label: tx("Talk to Guru", "गुरु से बात करें", "குருவிடம் பேசுங்கள்"), href: "/chat", emoji: "ॐ" },
              { label: tx("Read Bhagavad Gita", "भगवद गीता पढ़ें", "பகவத் கீதை படிக்க"), href: "/scriptures", emoji: "📖" },
              { label: tx("Listen to Bhajans", "भजन सुनें", "பஜனைகள் கேளுங்கள்"), href: "/bhajans", emoji: "🎵" },
              { label: tx("Find Mandirs", "मंदिर खोजें", "கோயில்கள் தேடுங்கள்"), href: "/mandirs", emoji: "🛕" },
            ].map((item) => (
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

        {/* Legal Links */}
        <motion.div initial="hidden" animate="visible" custom={8} variants={fadeUp}
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

        {/* Delete Account */}
        <motion.div initial="hidden" animate="visible" custom={10} variants={fadeUp}>
          {!deleteConfirmOpen ? (
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl border border-red-200 dark:border-red-900/40 bg-card text-red-400 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 font-sans text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {tx("Delete Account", "खाता हटाएं", "கணக்கை நீக்கு")}
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-sans font-semibold text-red-700 dark:text-red-400">
                    {tx("This action cannot be undone", "यह क्रिया पूर्ववत नहीं हो सकती", "இந்த செயலை மீட்க முடியாது")}
                  </p>
                  <p className="text-xs font-sans text-red-600/70 dark:text-red-400/70 mt-1">
                    {tx(
                      "All your data including conversations, puja history, and subscription will be permanently deleted.",
                      "आपकी सभी बातचीत, पूजा इतिहास और सदस्यता स्थायी रूप से हटा दी जाएगी।",
                      "உரையாடல்கள், பூஜை வரலாறு மற்றும் சந்தா உள்ளிட்ட அனைத்து தரவும் நிரந்தரமாக நீக்கப்படும்."
                    )}
                  </p>
                </div>
              </div>
              <div>
                <Label className="font-sans text-xs text-red-600 dark:text-red-400">
                  {tx('Type "DELETE" to confirm', '"DELETE" टाइप करें', '"DELETE" என்று தட்டச்சு செய்யவும்')}
                </Label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="mt-1 border-red-200 dark:border-red-800 focus:ring-red-400"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 font-sans text-xs"
                  onClick={() => { setDeleteConfirmOpen(false); setDeleteConfirmText(""); }}
                >
                  {tx("Cancel", "रद्द करें", "ரத்து")}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-sans text-xs"
                  disabled={deleteConfirmText !== "DELETE" || deleteLoading}
                  onClick={handleDeleteAccount}
                >
                  {deleteLoading
                    ? tx("Deleting...", "हटा रहे हैं...", "நீக்குகிறோம்...")
                    : tx("Permanently Delete", "स्थायी रूप से हटाएं", "நிரந்தரமாக நீக்கு")}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

