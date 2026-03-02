import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import { Eye, EyeOff, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslations();

  useEffect(() => {
    // Check for recovery token in URL hash (Supabase appends it as #access_token=...&type=recovery)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
      setChecking(false);
      return;
    }

    // Also listen for Supabase auth state change — PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setChecking(false);
      }
    });

    // Give Supabase a moment to process the hash and emit the event
    const timeout = setTimeout(() => {
      setChecking(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: t.auth.password || "Password",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Handle common error cases with friendly messages
      const msg = error.message.toLowerCase();
      if (msg.includes("expired") || msg.includes("invalid")) {
        toast({
          title: "Link expired",
          description: "This reset link has expired. Please request a new one.",
          variant: "destructive",
        });
      } else if (msg.includes("same")) {
        toast({
          title: "Same password",
          description: "Your new password must be different from the old one.",
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    }
    setLoading(false);
  };

  // Loading state while checking for recovery token
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SeoHead title="Reset Password" canonicalPath="/reset-password" />
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-saffron animate-spin mx-auto" />
          <p className="text-muted-foreground font-sans text-sm">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired link
  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SeoHead title="Reset Password" canonicalPath="/reset-password" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-serif font-bold text-gradient-sacred mb-2">ॐVani</h1>
            </Link>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sacred border border-border text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Invalid or Expired Link
            </h2>
            <p className="text-muted-foreground font-sans text-sm">
              This password reset link is invalid or has expired.
              Reset links are valid for a limited time for security.
            </p>
            <div className="pt-2 space-y-3">
              <Link to="/forgot-password">
                <Button variant="hero" className="w-full">Request New Link</Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="w-full font-sans text-saffron">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SeoHead title="Password Updated" canonicalPath="/reset-password" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-serif font-bold text-gradient-sacred mb-2">ॐVani</h1>
            </Link>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sacred border border-border text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">Password Updated!</h2>
            <p className="text-muted-foreground font-sans text-sm">
              Your password has been successfully updated.
              Redirecting to login...
            </p>
            <Link to="/login">
              <Button variant="hero" className="w-full">Go to Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SeoHead title="Reset Password" canonicalPath="/reset-password" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-serif font-bold text-gradient-sacred mb-2">ॐVani</h1>
          </Link>
          <p className="text-muted-foreground font-sans text-sm">Set your new password</p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sacred border border-border">
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-sans text-sm">
                {t.auth.password || "New Password"}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.auth.passwordPlaceholder || "At least 6 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="font-sans text-sm">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Password strength hint */}
            {password.length > 0 && password.length < 6 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-sans">
                Password needs at least 6 characters ({6 - password.length} more)
              </p>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Updating...</>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
