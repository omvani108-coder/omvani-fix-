import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fadeUp } from "@/lib/animations";

export default function PasswordCard() {
  const { user } = useAuth();
  const { isHindi, isTamil } = useLanguage();
  const tx = (en: string, hi: string, ta: string) =>
    isTamil ? ta : isHindi ? hi : en;

  const provider = user?.app_metadata?.provider || "email";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  if (provider === "google") return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(tx("Passwords do not match", "पासवर्ड मेल नहीं खाते", "கடவுச்சொற்கள் பொருந்தவில்லை"));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(
        tx(
          "Password must be at least 8 characters",
          "पासवर्ड कम से कम 8 अक्षरों का होना चाहिए",
          "கடவுச்சொல் குறைந்தது 8 எழுத்துகளாக இருக்க வேண்டும்"
        )
      );
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
      toast.success(
        tx("Password updated successfully", "पासवर्ड सफलतापूर्वक बदला गया", "கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது")
      );
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordLoading(false);
  };

  return (
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
            ? (
              <>
                <CheckCircle className="w-4 h-4" /> {tx("Updated!", "सफल!", "வெற்றி!")}
              </>
            )
            : tx("Update Password", "पासवर्ड अपडेट करें", "கடவுச்சொல் புதுப்பி")}
        </Button>
      </form>
    </motion.div>
  );
}
