import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, User, Calendar, Globe, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type Language = "en" | "hi" | "ta";

interface OnboardingData {
  firstName: string;
  lastName: string;
  age: string;
  dob: string;
  language: Language;
}

// ── Language options ──────────────────────────────────────────────────────────

const LANGUAGES: {
  code: Language;
  flag: string;
  name: string;
  native: string;
  greeting: string;
}[] = [
  { code: "en", flag: "🇬🇧", name: "English", native: "English",  greeting: "Namaste 🙏" },
  { code: "hi", flag: "🇮🇳", name: "Hindi",   native: "हिंदी",    greeting: "नमस्ते 🙏" },
  { code: "ta", flag: "🇮🇳", name: "Tamil",   native: "தமிழ்",    greeting: "வணக்கம் 🙏" },
];

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    icon: User,
    title: "What's your name?",
    subtitle: "Let the Guru know what to call you",
  },
  {
    id: 2,
    icon: Calendar,
    title: "Your age & birthday",
    subtitle: "Help us personalise your spiritual journey",
  },
  {
    id: 3,
    icon: Globe,
    title: "Preferred language",
    subtitle: "Choose how the Guru speaks to you",
  },
] as const;

// ── Slide animation ───────────────────────────────────────────────────────────

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
};

const transition = { duration: 0.28, ease: "easeInOut" as const };

// ── Age helper — calculate actual age from a YYYY-MM-DD date string ───────────

function calcAgeFromDob(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── sessionStorage keys ───────────────────────────────────────────────────────

const SS_DATA = "omvani_onboarding";
const SS_STEP = "omvani_onboarding_step";

function clearSession() {
  sessionStorage.removeItem(SS_DATA);
  sessionStorage.removeItem(SS_STEP);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const [dir,    setDir]    = useState(1);
  const [saving, setSaving] = useState(false);

  // ── Fix 2: Restore step from sessionStorage on mount ──────────────────────
  const [step, setStep] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(SS_STEP);
      if (saved) {
        const n = parseInt(saved, 10);
        if (n >= 1 && n <= 3) return n;
      }
    } catch {}
    return 1;
  });

  // ── Fix 2: Restore form data from sessionStorage on mount ─────────────────
  const [data, setData] = useState<OnboardingData>(() => {
    try {
      const saved = sessionStorage.getItem(SS_DATA);
      if (saved) return JSON.parse(saved) as OnboardingData;
    } catch {}
    return { firstName: "", lastName: "", age: "", dob: "", language: "en" };
  });

  // ── Fix 2: Persist data & step to sessionStorage on every change ───────────
  useEffect(() => {
    try { sessionStorage.setItem(SS_DATA, JSON.stringify(data)); } catch {}
  }, [data]);

  useEffect(() => {
    try { sessionStorage.setItem(SS_STEP, String(step)); } catch {}
  }, [step]);

  const totalSteps = STEPS.length;
  const pct        = Math.round((step / totalSteps) * 100);

  // ── Fix 1: Derived age-mismatch check ─────────────────────────────────────
  const dobAge     = data.dob ? calcAgeFromDob(data.dob) : null;
  const ageMismatch =
    step === 2 &&
    data.age !== "" &&
    data.dob !== "" &&
    dobAge !== null &&
    Math.abs(parseInt(data.age, 10) - dobAge) > 1;

  // ── Validation ──────────────────────────────────────────────────────────────

  const canProceed = () => {
    if (step === 1) return data.firstName.trim() !== "" && data.lastName.trim() !== "";
    if (step === 2) {
      if (!data.age.trim() || !data.dob.trim()) return false;
      // Fix 1: Block continuation if age doesn't match DOB (±1 yr tolerance)
      if (ageMismatch) return false;
      return true;
    }
    if (step === 3) return !!data.language;
    return false;
  };

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goNext = () => {
    if (!canProceed()) return;
    setDir(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDir(-1);
    setStep(s => s - 1);
  };

  // ── Finish & save ───────────────────────────────────────────────────────────

  const handleFinish = async () => {
    if (!canProceed()) return;
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name:          data.firstName,
        last_name:           data.lastName,
        full_name:           `${data.firstName} ${data.lastName}`,
        age:                 data.age,
        date_of_birth:       data.dob,
        preferred_language:  data.language,
        onboarding_complete: true,
      },
    });

    if (error) {
      toast.error("Could not save your details. Please try again.");
      setSaving(false);
      return;
    }

    // Fix 2: Clear persisted session data
    clearSession();

    // Fix 3: Sync chosen language into LanguageContext + localStorage immediately
    // so the very first chat page render is already in the correct language.
    setLanguage(data.language);

    toast.success("Welcome to ॐVani! 🙏");
    navigate("/chat");
  };

  // ── Step content ─────────────────────────────────────────────────────────────

  const currentStep = STEPS[step - 1];
  const StepIcon    = currentStep.icon;

  const renderStep = () => {
    switch (step) {

      // Step 1 — Name
      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-sans text-sm font-medium text-foreground">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="e.g. Arjun"
                value={data.firstName}
                autoFocus
                onChange={e => setData(d => ({ ...d, firstName: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && goNext()}
                className="h-12 font-sans text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-sans text-sm font-medium text-foreground">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="e.g. Sharma"
                value={data.lastName}
                onChange={e => setData(d => ({ ...d, lastName: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && goNext()}
                className="h-12 font-sans text-base"
              />
            </div>
          </div>
        );

      // Step 2 — Age & DOB
      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="age" className="font-sans text-sm font-medium text-foreground">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g. 28"
                min={14}
                max={120}
                value={data.age}
                autoFocus
                onChange={e => setData(d => ({ ...d, age: e.target.value }))}
                className="h-12 font-sans text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="font-sans text-sm font-medium text-foreground">
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={data.dob}
                max={new Date().toISOString().split("T")[0]}
                onChange={e => setData(d => ({ ...d, dob: e.target.value }))}
                className={`h-12 font-sans text-base ${ageMismatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {/* Fix 1: Inline error when age and DOB don't match */}
              {ageMismatch && dobAge !== null && (
                <p className="text-xs text-destructive font-sans mt-1">
                  Age doesn't match your date of birth (expected ~{dobAge})
                </p>
              )}
            </div>
          </div>
        );

      // Step 3 — Language
      case 3:
        return (
          <div className="space-y-3">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setData(d => ({ ...d, language: lang.code }))}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  data.language === lang.code
                    ? "border-saffron bg-saffron/10"
                    : "border-border bg-card hover:border-saffron/40 hover:bg-saffron/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl leading-none">{lang.flag}</span>
                  <div>
                    <p className={`font-sans font-semibold text-sm ${
                      data.language === lang.code ? "text-saffron" : "text-foreground"
                    }`}>
                      {lang.name}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">
                      {lang.native} · {lang.greeting}
                    </p>
                  </div>
                </div>
                {data.language === lang.code && (
                  <CheckCircle className="w-5 h-5 text-saffron shrink-0" />
                )}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-serif font-bold text-gradient-sacred mb-1">
          <span>ॐ</span>Vani
        </h1>
        <p className="text-muted-foreground font-sans text-xs tracking-[0.25em] uppercase">
          ॐ Your Spiritual Companion
        </p>
      </motion.div>

      <div className="w-full max-w-md">

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {/* Bar */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-sans text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-xs font-sans text-saffron font-semibold">
              {pct}% complete
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sacred-gradient rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {STEPS.map(s => (
              <motion.div
                key={s.id}
                animate={{
                  width:           s.id === step ? 24 : 8,
                  backgroundColor: s.id <= step ? "hsl(var(--saffron))" : "hsl(var(--border))",
                  opacity:         s.id < step ? 0.5 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          {/* Step header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`header-${step}`}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="flex items-center gap-4"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-sacred-gradient flex items-center justify-center shadow-sacred shrink-0">
                  <StepIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-foreground leading-tight">
                    {currentStep.title}
                  </h2>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5">
                    {currentStep.subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step body */}
          <div className="px-8 py-7">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`body-${step}`}
                custom={dir}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <div className="px-8 pb-8 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={goBack}
                className="flex-1 font-sans gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                variant="hero"
                size="lg"
                onClick={goNext}
                disabled={!canProceed()}
                className="flex-1 font-sans gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                size="lg"
                onClick={handleFinish}
                disabled={!canProceed() || saving}
                className="flex-1 font-sans gap-2"
              >
                {saving ? "Saving…" : "Enter ॐVani 🙏"}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Skip */}
        <p className="text-center mt-5">
          <button
            onClick={() => {
              // Fix 2: Clear session data when skipping
              clearSession();
              navigate("/chat");
            }}
            className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Skip for now
          </button>
        </p>

      </div>
    </div>
  );
}
