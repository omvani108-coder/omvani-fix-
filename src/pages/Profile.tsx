import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, LogOut, ChevronRight, Shield, Bell, BellOff, Globe, Eye, EyeOff, CheckCircle } from "lucide-react";
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

export default function Profile() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, isHindi } = useLanguage();
  const navigate = useNavigate();
  const { supported: notifSupported, enabled: notifEnabled, permission, toggleNotifications } = useNotifications();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const email = user?.email || "";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long" })
    : "";
  const provider = user?.app_metadata?.provider || "email";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success(isHindi ? "आप सफलतापूर्वक साइन आउट हो गए" : "Signed out successfully");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(isHindi ? "पासवर्ड मेल नहीं खाते" : "Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error(isHindi ? "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए" : "Password must be at least 8 characters");
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
      toast.success(isHindi ? "पासवर्ड सफलतापूर्वक बदला गया" : "Password updated successfully");
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
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
            {email} · {isHindi ? "सदस्य" : "Member"} {joinDate}
          </motion.p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">

        {/* Account Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <User className="w-4 h-4 text-saffron" />
            <h2 className="font-sans font-semibold text-foreground text-sm">
              {isHindi ? "खाता जानकारी" : "Account Info"}
            </h2>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground font-sans mb-0.5">{isHindi ? "नाम" : "Name"}</p>
                <p className="text-sm font-sans text-foreground font-medium">{displayName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground font-sans mb-0.5">{isHindi ? "ईमेल" : "Email"}</p>
                <p className="text-sm font-sans text-foreground font-medium">{email}</p>
              </div>
              <Mail className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs text-muted-foreground font-sans mb-0.5">{isHindi ? "साइन-इन विधि" : "Sign-in method"}</p>
                <p className="text-sm font-sans text-foreground font-medium capitalize">
                  {provider === "google" ? "🔵 Google" : "📧 Email & Password"}
                </p>
              </div>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Language Toggle */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Globe className="w-4 h-4 text-saffron" />
            <h2 className="font-sans font-semibold text-foreground text-sm">
              {isHindi ? "भाषा / Language" : "Language / भाषा"}
            </h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-xs text-muted-foreground font-sans mb-4">
              {isHindi
                ? "चैट में AI गुरु किस भाषा में उत्तर देंगे"
                : "Choose the language for AI Guru responses in chat"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                  language === "en"
                    ? "border-saffron bg-saffron/10 text-saffron"
                    : "border-border text-muted-foreground hover:border-saffron/40"
                }`}
              >
                <span className="text-2xl">🇬🇧</span>
                <span className="font-sans font-semibold text-sm">English</span>
                <span className="font-sans text-xs opacity-70">Respond in English</span>
                {language === "en" && (
                  <CheckCircle className="w-4 h-4 text-saffron" />
                )}
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-200 ${
                  language === "hi"
                    ? "border-saffron bg-saffron/10 text-saffron"
                    : "border-border text-muted-foreground hover:border-saffron/40"
                }`}
              >
                <span className="text-2xl">🇮🇳</span>
                <span className="font-sans font-semibold text-sm">हिंदी</span>
                <span className="font-sans text-xs opacity-70">हिंदी में उत्तर दें</span>
                {language === "hi" && (
                  <CheckCircle className="w-4 h-4 text-saffron" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Change Password — only for email users */}
        {provider !== "google" && (
          <motion.div
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Lock className="w-4 h-4 text-saffron" />
              <h2 className="font-sans font-semibold text-foreground text-sm">
                {isHindi ? "पासवर्ड बदलें" : "Change Password"}
              </h2>
            </div>
            <form onSubmit={handlePasswordChange} className="px-6 py-5 space-y-4">
              <div className="space-y-2">
                <Label className="font-sans text-xs text-muted-foreground">
                  {isHindi ? "नया पासवर्ड" : "New Password"}
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
                  {isHindi ? "पासवर्ड की पुष्टि करें" : "Confirm New Password"}
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
                {passwordLoading ? (
                  isHindi ? "अपडेट हो रहा है..." : "Updating..."
                ) : passwordSuccess ? (
                  <><CheckCircle className="w-4 h-4" /> {isHindi ? "सफल!" : "Updated!"}</>
                ) : (
                  isHindi ? "पासवर्ड अपडेट करें" : "Update Password"
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {/* Notifications */}
        {notifSupported && (
          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
              <Bell className="w-4 h-4 text-saffron" />
              <h2 className="font-sans font-semibold text-foreground text-sm">
                {isHindi ? "सूचनाएं" : "Notifications"}
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-xs text-muted-foreground font-sans mb-4">
                {isHindi
                  ? "हर सुबह 7 बजे दैनिक श्लोक प्राप्त करें"
                  : "Receive your daily shloka every morning at 7am"}
              </p>
              <button
                onClick={async () => {
                  await toggleNotifications();
                  if (!notifEnabled) {
                    toast.success(isHindi ? "सूचनाएं सक्षम की गईं 🔔" : "Notifications enabled 🔔");
                  } else {
                    toast.success(isHindi ? "सूचनाएं बंद की गईं" : "Notifications disabled");
                  }
                }}
                disabled={permission === "denied"}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  notifEnabled
                    ? "border-saffron bg-saffron/10"
                    : "border-border hover:border-saffron/40"
                } ${permission === "denied" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${
                    notifEnabled ? "bg-sacred-gradient shadow-sacred" : "bg-muted"
                  }`}>
                    ॐ
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-sans font-semibold ${notifEnabled ? "text-saffron" : "text-foreground"}`}>
                      {isHindi ? "दैनिक श्लोक" : "Daily Shloka"}
                    </p>
                    <p className="text-xs font-sans text-muted-foreground">
                      {permission === "denied"
                        ? (isHindi ? "ब्राउज़र ने ब्लॉक किया" : "Blocked by browser")
                        : notifEnabled
                        ? (isHindi ? "सक्षम — हर सुबह 7 बजे" : "Enabled — every morning at 7am")
                        : (isHindi ? "बंद है" : "Currently off")}
                    </p>
                  </div>
                </div>
                {notifEnabled
                  ? <Bell className="w-5 h-5 text-saffron shrink-0" aria-hidden="true" />
                  : <BellOff className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                }
              </button>
              {permission === "denied" && (
                <p className="text-[10px] text-muted-foreground font-sans mt-2 text-center">
                  {isHindi
                    ? "नोटिफिकेशन के लिए ब्राउज़र सेटिंग में अनुमति दें"
                    : "Allow notifications in your browser settings to enable this"}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Bell className="w-4 h-4 text-saffron" />
            <h2 className="font-sans font-semibold text-foreground text-sm">
              {isHindi ? "त्वरित लिंक" : "Quick Links"}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: isHindi ? "गुरु से बात करें" : "Talk to Guru", labelHi: "", href: "/chat", emoji: "ॐ" },
              { label: isHindi ? "भगवद गीता पढ़ें" : "Read Bhagavad Gita", href: "/scriptures", emoji: "📖" },
              { label: isHindi ? "भजन सुनें" : "Listen to Bhajans", href: "/bhajans", emoji: "🎵" },
              { label: isHindi ? "मंदिर खोजें" : "Find Mandirs", href: "/mandirs", emoji: "🛕" },
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

        {/* Sign Out */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={5}
          variants={fadeUp}
        >
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border border-border bg-card text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200 font-sans text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            {isHindi ? "साइन आउट करें" : "Sign Out"}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
