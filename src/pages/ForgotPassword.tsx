import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side email validation
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      toast({
        title: t.auth.email,
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SeoHead title="Forgot Password" canonicalPath="/forgot-password" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-serif font-bold text-gradient-sacred mb-2">ॐVani</h1>
          </Link>
          <p className="text-muted-foreground font-sans text-sm">
            {t.auth.forgotPassword || "Reset your password"}
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sacred border border-border">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="font-serif font-bold text-foreground text-lg">Check your email</h2>
              <p className="text-muted-foreground font-sans text-sm">
                We sent a password reset link to <strong className="text-foreground">{email.trim()}</strong>.
                Check your inbox (and spam folder).
              </p>
              <div className="pt-2 space-y-3">
                <Button
                  variant="outline"
                  className="w-full font-sans"
                  onClick={() => { setSent(false); setEmail(""); }}
                >
                  Try a different email
                </Button>
                <Link to="/login">
                  <Button variant="ghost" className="w-full font-sans text-saffron">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-sans text-sm">{t.auth.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.auth.emailPlaceholder || "your@email.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <p className="text-center text-sm text-muted-foreground font-sans">
                <Link to="/login" className="text-saffron hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
