import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Sparkles, X, Loader2, Eye, Info, Star, MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";

type DeityResult = {
  name: string;
  type: string;
  confidence: "High" | "Medium" | "Low";
  description: string;
  significance: string;
  attributes: string[];
  associated_with: string[];
  mantras: string[];
  best_time_to_worship: string;
  interesting_fact: string;
  location: string;
};

const confidenceColors = {
  High: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-600 bg-amber-50 border-amber-200",
  Low: "text-red-500 bg-red-50 border-red-200",
};

const typeEmojis: Record<string, string> = {
  Deity: "🕉️",
  Temple: "🛕",
  Ritual: "🪔",
  "Sacred Art": "🎨",
  Festival: "🎆",
  "Sacred Object": "📿",
  "Mantra/Symbol": "ॐ",
  Unknown: "🔍",
};

const Identify = () => {
  const { t } = useTranslations();
  const { canIdentify, incrementUsage } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>("image/jpeg");
  const [result, setResult] = useState<DeityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB.");
      return;
    }
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // Extract base64 part
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setResult(null);
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file. Please try again.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleIdentify = async () => {
    if (!imageBase64) return;
    // Paywall check
    if (!canIdentify) {
      setUpgradeOpen(true);
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/identify-deity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ imageBase64, mimeType: imageMime }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) toast.error("Rate limit reached. Please wait a moment.");
        else if (response.status === 402) toast.error("AI usage limit reached.");
        else toast.error(data.error || "Identification failed.");
        return;
      }

      setResult(data);
      await incrementUsage("identify");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} trigger="identify" />
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-secondary/60 to-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron font-sans text-sm tracking-[0.25em] uppercase mb-3"
          >
            {t.identify.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Deity Identifier
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans max-w-xl mx-auto"
          >
            {t.identify.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {!imagePreview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                dragOver
                  ? "border-saffron bg-saffron/5 scale-[1.01]"
                  : "border-border hover:border-saffron/60 hover:bg-secondary/30"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-sacred-gradient flex items-center justify-center">
                  <Upload className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-serif font-bold text-foreground text-xl mb-1">{t.identify.dropTitle}</p>
                  <p className="text-muted-foreground font-sans text-sm">{t.identify.dropSubtitle}</p>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground font-sans">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Deities</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Temples</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Rituals</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sacred Objects</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl border border-border overflow-hidden bg-card shadow-sacred">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full max-h-80 object-contain bg-secondary/20"
                />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 flex items-center justify-between gap-4">
                <p className="text-sm font-sans text-muted-foreground">{t.identify.imageReady}</p>
                <Button
                  onClick={handleIdentify}
                  disabled={loading}
                  variant="hero"
                  className="gap-2 shrink-0"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{t.identify.identifying}</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />{t.identify.identify}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-sacred-gradient flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🕉️</span>
                </div>
                <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-saffron animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-serif font-bold text-foreground">{t.identify.consultingTexts}</p>
                <p className="text-sm text-muted-foreground font-sans mt-1">{t.identify.analyzingImage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Identity Card */}
              <div className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden">
                <div className="bg-sacred-gradient p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
                      {typeEmojis[result.type] || "🔍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h2 className="font-serif font-bold text-accent-foreground text-2xl leading-tight">{result.name}</h2>
                        <span className={`shrink-0 text-xs font-sans font-bold px-3 py-1 rounded-full border ${confidenceColors[result.confidence]}`}>
                          {result.confidence} {t.identify.confidence}
                        </span>
                      </div>
                      <p className="text-accent-foreground/80 font-sans text-sm mt-1">{result.type}</p>
                      {result.location && (
                        <div className="flex items-center gap-1 mt-2 text-accent-foreground/70 text-xs font-sans">
                          <MapPin className="w-3 h-3" />
                          {result.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Description */}
                  <div>
                    <h3 className="flex items-center gap-2 font-sans font-semibold text-foreground text-sm mb-2">
                      <Info className="w-4 h-4 text-saffron" /> About
                    </h3>
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed">{result.description}</p>
                  </div>

                  {/* Significance */}
                  {result.significance && (
                    <div>
                      <h3 className="flex items-center gap-2 font-sans font-semibold text-foreground text-sm mb-2">
                        <Star className="w-4 h-4 text-gold" /> Spiritual Significance
                      </h3>
                      <p className="text-muted-foreground font-sans text-sm leading-relaxed">{result.significance}</p>
                    </div>
                  )}

                  {/* Attributes */}
                  {result.attributes?.length > 0 && (
                    <div>
                      <h3 className="font-sans font-semibold text-foreground text-sm mb-2">{t.identify.keyAttributes}</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.attributes.map((attr, i) => (
                          <span key={i} className="text-xs font-sans bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Associated With */}
                    {result.associated_with?.length > 0 && (
                      <div className="bg-secondary/40 rounded-xl p-4">
                        <h3 className="font-sans font-semibold text-foreground text-xs mb-2 uppercase tracking-wide">Associated With</h3>
                        <ul className="space-y-1">
                          {result.associated_with.map((item, i) => (
                            <li key={i} className="text-xs text-muted-foreground font-sans flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-saffron shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Mantras */}
                    {result.mantras?.length > 0 && result.mantras[0] && (
                      <div className="bg-secondary/40 rounded-xl p-4">
                        <h3 className="font-sans font-semibold text-foreground text-xs mb-2 uppercase tracking-wide">Sacred Mantra</h3>
                        {result.mantras.map((mantra, i) => (
                          <p key={i} className="text-xs text-muted-foreground font-sans italic leading-relaxed">{mantra}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Best Time & Interesting Fact */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.best_time_to_worship && (
                      <div className="flex items-start gap-3 bg-saffron/5 border border-saffron/20 rounded-xl p-4">
                        <Clock className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-sans font-semibold text-foreground mb-0.5">Best Time to Worship</p>
                          <p className="text-xs text-muted-foreground font-sans">{result.best_time_to_worship}</p>
                        </div>
                      </div>
                    )}
                    {result.interesting_fact && (
                      <div className="flex items-start gap-3 bg-gold/5 border border-gold/20 rounded-xl p-4">
                        <Zap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-sans font-semibold text-foreground mb-0.5">Interesting Fact</p>
                          <p className="text-xs text-muted-foreground font-sans">{result.interesting_fact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Try Another */}
              <div className="text-center">
                <Button variant="outline" onClick={reset} className="font-sans">
                  Identify Another Image
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Examples hint */}
        {!imagePreview && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {["Lord Ganesha", "Shiva Lingam", "Golden Temple", "Aarti Ceremony"].map((example) => (
              <div key={example} className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-2xl mb-1">
                  {example === "Lord Ganesha" ? "🐘" : example === "Shiva Lingam" ? "🔱" : example === "Golden Temple" ? "🛕" : "🪔"}
                </p>
                <p className="text-xs text-muted-foreground font-sans">{example}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-1 font-serif text-xl font-bold text-gradient-sacred">
            <span>ॐ</span><span>Vani</span>
          </Link>
          <p className="text-xs text-muted-foreground/60 font-sans mt-2">
            © 2026 ॐVani · {t.identify.footerNote}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Identify;
