import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Copy, MessageCircle, RotateCcw, CheckCircle2, X, Shield, Upload, ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { useTranslations } from "@/hooks/useTranslations";
import { useKundli, type KundliLens } from "@/hooks/useKundli";
import { KundliHistory } from "@/components/KundliHistory";
import { toast } from "sonner";

// ── Lens options ────────────────────────────────────────────────────────────

const LENS_OPTIONS: { key: KundliLens; emoji: string }[] = [
  { key: "love",      emoji: "💕" },
  { key: "wealth",    emoji: "💰" },
  { key: "future",    emoji: "🔮" },
  { key: "career",    emoji: "💼" },
  { key: "marriage",  emoji: "💍" },
  { key: "health",    emoji: "🌿" },
  { key: "spiritual", emoji: "🙏" },
  { key: "family",    emoji: "👨‍👩‍👧" },
];

// ── Phase type ──────────────────────────────────────────────────────────────

type Phase = "form" | "payment" | "result";

// ── Markdown-ish renderer ───────────────────────────────────────────────────

function RenderResult({ text }: { text: string }) {
  return (
    <div className="font-sans text-foreground/90 leading-relaxed">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-serif font-bold text-foreground text-base mt-4 mb-1.5">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }
        if (line.includes("**")) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="mb-1.5 text-sm">
              {parts.map((part, j) =>
                j % 2 === 1 ? (
                  <strong key={j} className="font-semibold text-foreground">{part}</strong>
                ) : (
                  <span key={j}>{part}</span>
                ),
              )}
            </p>
          );
        }
        if (!line.trim()) return <br key={i} />;
        return <p key={i} className="mb-1.5 text-sm">{line}</p>;
      })}
    </div>
  );
}

// ── StreamCursor ────────────────────────────────────────────────────────────

function StreamCursor() {
  return (
    <motion.span
      className="inline-block w-2 h-4 bg-saffron rounded-sm ml-0.5"
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
    />
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const Kundli = () => {
  const { t } = useTranslations();
  const navigate = useNavigate();
  const {
    isLoading,
    isStreaming,
    result,
    eligibility,
    pastReadings,
    checkEligibility,
    initiatePayment,
    runAnalysis,
    fetchPastReadings,
    reset,
  } = useKundli();

  // ── Form state ────────────────────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [selectedLens, setSelectedLens] = useState<KundliLens | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [kundliImage, setKundliImage] = useState<File | null>(null);
  const [kundliImagePreview, setKundliImagePreview] = useState<string | null>(null);

  // ── On mount: check eligibility and load past readings ────────────────
  useEffect(() => {
    checkEligibility();
    fetchPastReadings();
  }, [checkEligibility, fetchPastReadings]);

  // ── Derived values ────────────────────────────────────────────────────
  const isFormValid = fullName.trim() && dateOfBirth && placeOfBirth.trim() && selectedLens;
  const isFreeAnalysis = eligibility ? !eligibility.hasUsedFree : false;
  const priceDisplay = eligibility
    ? `₹${eligibility.pricePerAnalysis / 100}`
    : "₹60";

  // ── Convert image to base64 ──────────────────────────────────────────
  const getImageBase64 = useCallback(async (): Promise<string | undefined> => {
    if (!kundliImage) return undefined;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(kundliImage);
    });
  }, [kundliImage]);

  // ── Handle submit ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!isFormValid || !selectedLens) return;

    if (isFreeAnalysis) {
      // Free — go straight to analysis
      setPhase("result");
      const imageBase64 = await getImageBase64();
      await runAnalysis({
        full_name: fullName.trim(),
        date_of_birth: dateOfBirth,
        time_of_birth: timeOfBirth || null,
        place_of_birth: placeOfBirth.trim(),
        lens: selectedLens,
        is_free: true,
        kundli_image_base64: imageBase64,
      });
      // Refresh eligibility after using free
      checkEligibility();
      fetchPastReadings();
    } else {
      // Paid — show payment modal
      setPaymentModalOpen(true);
    }
  }, [isFormValid, isFreeAnalysis, selectedLens, fullName, dateOfBirth, timeOfBirth, placeOfBirth, runAnalysis, checkEligibility, fetchPastReadings, getImageBase64]);

  // ── Handle payment ────────────────────────────────────────────────────
  const handlePayment = useCallback(async () => {
    if (!eligibility || !selectedLens) return;

    setPaymentModalOpen(false);
    const paymentId = await initiatePayment(eligibility.pricePerAnalysis);

    if (!paymentId) {
      toast.error("Payment was cancelled or failed.");
      return;
    }

    // Payment successful — run analysis
    setPhase("result");
    const imageBase64 = await getImageBase64();
    await runAnalysis({
      full_name: fullName.trim(),
      date_of_birth: dateOfBirth,
      time_of_birth: timeOfBirth || null,
      place_of_birth: placeOfBirth.trim(),
      lens: selectedLens,
      is_free: false,
      razorpay_payment_id: paymentId,
      kundli_image_base64: imageBase64,
    });
    fetchPastReadings();
  }, [eligibility, selectedLens, fullName, dateOfBirth, timeOfBirth, placeOfBirth, initiatePayment, runAnalysis, fetchPastReadings, getImageBase64]);

  // ── Handle new analysis ───────────────────────────────────────────────
  const handleNewAnalysis = useCallback(() => {
    reset();
    setPhase("form");
    setSelectedLens(null);
    setKundliImage(null);
    setKundliImagePreview(null);
    checkEligibility();
    fetchPastReadings();
  }, [reset, checkEligibility, fetchPastReadings]);

  // ── Copy reading to clipboard ─────────────────────────────────────────
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result).then(() => {
      toast.success("Reading copied to clipboard!");
    });
  }, [result]);

  // ── Kundli image upload ─────────────────────────────────────────────
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }

    setKundliImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setKundliImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const removeImage = useCallback(() => {
    setKundliImage(null);
    setKundliImagePreview(null);
  }, []);

  return (
    <>
      <SeoHead
        title="Astro Kundli — AI Vedic Birth Chart — OmVani"
        description="Get an AI-powered Vedic birth chart analysis rooted in Jyotish Shastra. Love, career, wealth, health, and more."
        canonicalPath="/kundli"
      />
      <Navbar />

      <div className="min-h-screen bg-background pt-20 pb-28">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* PHASE 1 — Form                                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-lg mx-auto px-4 pt-6"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center mx-auto mb-4">
                  <Orbit className="w-8 h-8 text-saffron" />
                </div>
                <h1 className="font-serif font-bold text-2xl text-foreground">
                  {t.kundli.title}
                </h1>
                <p className="font-serif text-sm text-saffron/70 mt-0.5">
                  {t.kundli.titleHindi}
                </p>
                <p className="text-muted-foreground font-sans text-sm mt-2">
                  {t.kundli.subtitle}
                </p>
              </div>

              {/* Birth details form */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="font-sans text-sm">{t.kundli.fullName}</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="font-sans text-sm">{t.kundli.dateOfBirth}</Label>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="font-sans text-sm">{t.kundli.timeOfBirth}</Label>
                    <Input
                      type="time"
                      value={timeOfBirth}
                      onChange={(e) => setTimeOfBirth(e.target.value)}
                      className="mt-1.5"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {t.kundli.timeOfBirthHelper}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="font-sans text-sm">{t.kundli.placeOfBirth}</Label>
                  <Input
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra, India"
                    className="mt-1.5"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {t.kundli.placeOfBirthHelper}
                  </p>
                </div>
              </div>

              {/* ── Kundli Image Upload ─────────────────────────────────── */}
              <div className="mb-6">
                <div className="border-2 border-dashed border-saffron/30 rounded-2xl bg-saffron/[0.03] p-4 transition-colors hover:border-saffron/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Upload className="w-4 h-4 text-saffron" />
                    <Label className="font-sans text-sm font-medium">
                      {t.kundli.uploadSection}
                    </Label>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-sans mb-3">
                    {t.kundli.uploadHelper}
                  </p>

                  {kundliImagePreview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden border border-border bg-card"
                    >
                      <img
                        src={kundliImagePreview}
                        alt="Uploaded kundli chart"
                        className="w-full max-h-52 object-contain bg-muted/30"
                      />
                      <div className="flex items-center justify-between px-3 py-2 bg-card border-t border-border">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-saffron" />
                          <span className="font-sans text-xs text-foreground font-medium">
                            {t.kundli.uploadedLabel}
                          </span>
                        </div>
                        <button
                          onClick={removeImage}
                          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-sans font-medium transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          {t.kundli.removeUpload}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 py-5 rounded-xl border border-border bg-card/50 cursor-pointer hover:bg-saffron/5 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-saffron/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-saffron" />
                      </div>
                      <span className="font-sans text-xs font-medium text-muted-foreground">
                        {t.kundli.uploadButton}
                      </span>
                      <span className="font-sans text-[10px] text-muted-foreground/60">
                        JPG, PNG — max 5 MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Lens selector */}
              <div className="mb-6">
                <Label className="font-sans text-sm font-medium mb-3 block">
                  {t.kundli.chooseLens}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {LENS_OPTIONS.map(({ key, emoji }) => {
                    const isSelected = selectedLens === key;
                    const label = t.kundli.lenses[key];
                    return (
                      <motion.button
                        key={key}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedLens(key)}
                        className={`
                          relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2
                          transition-all duration-200 font-sans text-xs font-medium
                          ${isSelected
                            ? "border-saffron bg-saffron/10 ring-2 ring-saffron/30 text-foreground"
                            : "border-border bg-card hover:border-saffron/50 hover:bg-saffron/5 text-muted-foreground"
                          }
                        `}
                      >
                        <span className="text-xl">{emoji}</span>
                        <span className="text-center leading-tight">{label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Eligibility banner */}
              {eligibility && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`
                    rounded-xl px-4 py-3 mb-5 text-center font-sans text-sm font-medium
                    ${!eligibility.hasUsedFree
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : eligibility.isPaidPlan
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }
                  `}
                >
                  {!eligibility.hasUsedFree
                    ? `✨ ${t.kundli.freeNotice}`
                    : eligibility.isPaidPlan
                      ? t.kundli.paidNoticePaid
                      : t.kundli.paidNoticeFree
                  }
                </motion.div>
              )}

              {/* CTA */}
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full py-6 rounded-2xl bg-sacred-gradient text-white font-sans font-semibold text-base
                           shadow-sacred hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFreeAnalysis
                  ? `✨ ${t.kundli.revealCta}`
                  : `${t.kundli.payCta} ${priceDisplay}`
                }
              </Button>

              {/* Past readings */}
              {pastReadings.length > 0 && (
                <div className="mt-10">
                  <KundliHistory readings={pastReadings} onNewAnalysis={handleNewAnalysis} />
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* PHASE 3 — Result (streaming or complete)                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-lg mx-auto px-4 pt-6"
            >
              {/* Compact birth details summary */}
              <div className="border border-border rounded-xl bg-card/50 px-4 py-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-medium text-sm text-foreground">{fullName}</p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {dateOfBirth} {timeOfBirth ? `· ${timeOfBirth}` : ""} · {placeOfBirth}
                    </p>
                  </div>
                  {selectedLens && (
                    <span className="text-xs font-sans font-medium bg-saffron/10 text-saffron px-3 py-1 rounded-full">
                      {LENS_OPTIONS.find((l) => l.key === selectedLens)?.emoji}{" "}
                      {t.kundli.lenses[selectedLens]}
                    </span>
                  )}
                </div>
              </div>

              {/* Streaming state */}
              {isStreaming && !result && (
                <div className="text-center py-16">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl font-serif font-bold text-saffron mb-4 select-none"
                  >
                    ॐ
                  </motion.div>
                  <p className="font-sans text-muted-foreground text-sm mb-3">
                    {t.kundli.streaming}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}

              {/* Result card */}
              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-border rounded-2xl bg-card p-5 mb-6"
                >
                  <RenderResult text={result} />
                  {isStreaming && <StreamCursor />}

                  {/* Completion indicator */}
                  {!isStreaming && result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-border/50"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="font-sans text-sm text-emerald-600 font-medium">
                        Reading complete
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Action buttons */}
              {!isStreaming && result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-2.5 mb-8"
                >
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="flex-1 gap-2 font-sans"
                  >
                    <Copy className="w-4 h-4" />
                    {t.kundli.copyReading}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNewAnalysis}
                    className="flex-1 gap-2 font-sans"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.kundli.newAnalysis}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `/chat?prefill=${encodeURIComponent(
                          `I want to discuss my kundli reading for ${selectedLens}...`,
                        )}`,
                      )
                    }
                    className="flex-1 gap-2 font-sans"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t.kundli.askGuru}
                  </Button>
                </motion.div>
              )}

              {/* Past readings (below result) */}
              {!isStreaming && pastReadings.length > 0 && (
                <div className="mt-4">
                  <KundliHistory readings={pastReadings} onNewAnalysis={handleNewAnalysis} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* Payment confirmation modal (overlay)                         */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {paymentModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setPaymentModalOpen(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-lg text-foreground">
                    {t.kundli.paymentTitle}
                  </h3>
                  <button onClick={() => setPaymentModalOpen(false)}>
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-1.5">
                  {selectedLens && (
                    <p className="font-sans text-sm">
                      <span className="text-muted-foreground">Analysis: </span>
                      <span className="font-medium">
                        {LENS_OPTIONS.find((l) => l.key === selectedLens)?.emoji}{" "}
                        {t.kundli.lenses[selectedLens]}
                      </span>
                    </p>
                  )}
                  <p className="font-sans text-sm">
                    <span className="text-muted-foreground">Name: </span>
                    <span className="font-medium">{fullName}</span>
                  </p>
                  <p className="font-sans text-sm">
                    <span className="text-muted-foreground">Amount: </span>
                    <span className="font-bold text-foreground text-lg">{priceDisplay}</span>
                  </p>
                </div>

                {/* Secure badge */}
                <div className="flex items-center gap-2 mb-5 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span className="font-sans text-xs">{t.kundli.paymentSecure}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPaymentModalOpen(false)}
                    className="flex-1 font-sans"
                  >
                    {t.common.cancel}
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="flex-1 bg-sacred-gradient text-white font-sans font-semibold"
                  >
                    {t.kundli.payNow} {priceDisplay}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Kundli;
