import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useCallback } from "react";
import UpgradeModal from "@/components/UpgradeModal";
import { DivyaSandeshModal } from "@/components/DivyaSandeshModal";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  X,
  Send,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import heroBg from "@/assets/hero-bg.jpg";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { useShlokaAudio } from "@/hooks/useShlokaAudio";
import {
  features,
  shlokas,
  getDailyShloka,
  scriptures,
  stats,
  plans,
} from "@/data/landingData";

// ─── Shloka Carousel ──────────────────────────────────────────────────────────

function ShlokaCarousel() {
  const { t } = useTranslations();
  const todayIndex = useMemo(
    () => shlokas.findIndex((s) => s.id === getDailyShloka().id),
    []
  );
  const [index,      setIndex]      = useState(todayIndex);
  const [dragDir,    setDragDir]    = useState<number>(0);
  const [shareOpen,  setShareOpen]  = useState(false);
  const shloka = shlokas[index];

  const ttsText = `${shloka.sanskrit}. Meaning: ${shloka.meaning}`;
  const { isPlaying, isLoading, handleToggle, stop } = useShlokaAudio({ text: ttsText });

  const goTo = (dir: number) => {
    stop();
    setDragDir(dir);
    setIndex((i) => (i + dir + shlokas.length) % shlokas.length);
  };

  const jumpTo = (i: number) => {
    stop();
    setDragDir(i > index ? 1 : -1);
    setIndex(i);
  };

  return (
    <section aria-label="Shloka of the Day" className="py-12 px-4 bg-sacred-gradient overflow-hidden">
      <div className="max-w-3xl mx-auto">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-accent-foreground/70 font-sans text-xs tracking-[0.25em] uppercase">
              ✦ Shloka of the Day
            </p>
            <p className="text-accent-foreground/50 font-sans text-xs mt-0.5">
              {shloka.ref}
            </p>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Shloka navigation">
            <button
              onClick={() => goTo(-1)}
              aria-label={t.shloka.prev}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="text-accent-foreground/50 font-sans text-xs min-w-[2.5rem] text-center"
            >
              {index + 1}/{shlokas.length}
            </span>

            <button
              onClick={() => goTo(1)}
              aria-label={t.shloka.next}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={handleToggle}
              disabled={isLoading}
              aria-label={isPlaying ? t.shloka.stop : t.shloka.listen}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors disabled:opacity-50 ml-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Divya Sandesh — share button */}
            <button
              onClick={() => setShareOpen(true)}
              aria-label="Create Divine Status"
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors ml-1"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Divya Sandesh modal */}
        <DivyaSandeshModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          type="shloka"
          title={shloka.ref}
          sanskrit={shloka.sanskrit}
          translation={shloka.meaning}
          deity="Krishna"
        />

        {/* Swipeable shloka content */}
        <motion.div
          key="swipe-container"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -60) goTo(1);
            else if (info.offset.x > 60) goTo(-1);
          }}
          className="cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <AnimatePresence mode="wait" custom={dragDir}>
            <motion.div
              key={shloka.id}
              custom={dragDir}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-center select-none"
            >
              <p className="text-accent-foreground font-serif text-xl md:text-2xl font-semibold mb-4 leading-relaxed whitespace-pre-line">
                {shloka.sanskrit}
              </p>
              <div className="w-12 h-px bg-accent-foreground/30 mx-auto mb-4" aria-hidden="true" />
              <p className="text-accent-foreground/90 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
                {shloka.meaning}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6" role="tablist" aria-label="Shloka selector">
          {shlokas.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to shloka ${i + 1}`}
              onClick={() => jumpTo(i)}
              className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent-foreground ${
                i === index
                  ? "w-4 h-2 bg-accent-foreground"
                  : "w-2 h-2 bg-accent-foreground/30 hover:bg-accent-foreground/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Home Voice Button ────────────────────────────────────────────────────────

function streamAI(
  prompt: string,
  onChunk: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  return fetch(`${supabaseUrl}/functions/v1/chat`, {
    method: "POST", signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      system:
        "You are OmVani, a compassionate AI spiritual guide rooted in Hindu scripture and yoga philosophy. Answer spiritual questions with wisdom, warmth, and precision. Keep answers to 2-3 paragraphs — clear and spoken-friendly.",
    }),
  }).then(async (res) => {
    if (!res.ok) throw new Error("Failed");
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        onChunk(accumulated);
      }
    }
  });
}

function HomeVoiceButton() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "listening" | "thinking" | "answer">("idle");
  const [typeInput, setTypeInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const recogRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecog: any =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  const reset = () => {
    abortRef.current?.abort();
    recogRef.current?.stop();
    setListening(false);
    setTranscript("");
    setAnswer("");
    setLoading(false);
    setPhase("idle");
    setTypeInput("");
  };

  const close = () => {
    reset();
    setOpen(false);
  };

  const askAI = useCallback(async (question: string) => {
    setLoading(true);
    setPhase("thinking");
    setAnswer("");
    abortRef.current = new AbortController();
    const prompt = `Voice question from user: "${question}"\n\nAnswer concisely in 2-3 paragraphs. Be warm, clear, and cite relevant scripture where appropriate.`;
    try {
      await streamAI(
        prompt,
        (text) => {
          setAnswer(text);
          setPhase("answer");
        },
        abortRef.current.signal
      );
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") toast.error("Something went wrong.");
      setPhase("idle");
    } finally {
      setLoading(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecog) {
      toast.error("Voice not supported in this browser");
      return;
    }
    recogRef.current?.stop();
    const rec = new SpeechRecog();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onstart = () => {
      setListening(true);
      setPhase("listening");
      setTranscript("");
      setAnswer("");
    };
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      askAI(text);
    };
    rec.onerror = () => {
      setListening(false);
      setPhase("idle");
      toast.error("Could not hear you. Try again.");
    };
    rec.onend = () => setListening(false);
    recogRef.current = rec;
    rec.start();
  }, [SpeechRecog, askAI]);

  const rings = [0, 0.2, 0.4];

  return (
    <>
      {/* Floating OM button */}
      <motion.div
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.4 }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-sacred-gradient opacity-30 blur-md"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <button
          onClick={() => { setOpen(true); setPhase("idle"); }}
          aria-label="Open voice spiritual guide"
          className="relative w-16 h-16 rounded-full bg-sacred-gradient shadow-[0_4px_24px_rgba(234,120,30,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="text-white text-2xl font-serif leading-none select-none" style={{ fontFamily: "serif" }}>
            ॐ
          </span>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-background shadow flex items-center justify-center">
            <Mic className="w-3 h-3 text-saffron" />
          </div>
        </button>
      </motion.div>

      {/* Voice Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[440px] bg-card border border-border rounded-t-3xl md:rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sacred-gradient flex items-center justify-center text-white text-lg shadow-sacred">
                    ॐ
                  </div>
                  <div>
                    <p className="font-serif font-bold text-foreground text-sm">Voice Guru</p>
                    <p className="text-[10px] font-sans text-muted-foreground">
                      Ask anything about dharma, karma & spiritual life
                    </p>
                  </div>
                </div>
                <button
                  onClick={close}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Interaction area */}
              <div className="px-6 pb-8">
                {/* IDLE */}
                {phase === "idle" && (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-sans text-muted-foreground mb-8 text-center">
                      Tap the mic and ask your spiritual question aloud
                    </p>
                    <button
                      onClick={startListening}
                      aria-label="Start listening"
                      className="relative w-24 h-24 rounded-full bg-sacred-gradient shadow-[0_8px_32px_rgba(234,120,30,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Mic className="w-10 h-10 text-white" />
                    </button>
                    <p className="text-xs font-sans text-muted-foreground/50 mt-6">or type below</p>
                    {/* Type fallback */}
                    <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 mt-2 w-full focus-within:ring-2 focus-within:ring-saffron/30 transition-all">
                      <input
                        type="text"
                        value={typeInput}
                        onChange={(e) => setTypeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && typeInput.trim()) {
                            setTranscript(typeInput);
                            askAI(typeInput);
                            setTypeInput("");
                          }
                        }}
                        placeholder="Type your question…"
                        className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (typeInput.trim()) {
                            setTranscript(typeInput);
                            askAI(typeInput);
                            setTypeInput("");
                          }
                        }}
                        disabled={!typeInput.trim() || loading}
                        className="w-7 h-7 rounded-lg bg-sacred-gradient flex items-center justify-center disabled:opacity-30"
                      >
                        {loading ? (
                          <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* LISTENING */}
                {phase === "listening" && (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-sans text-saffron font-semibold mb-8 animate-pulse">
                      Listening…
                    </p>
                    <div className="relative flex items-center justify-center">
                      {rings.map((delay, i) => (
                        <motion.div
                          key={i}
                          className="absolute rounded-full border-2 border-saffron/40"
                          style={{ width: 96 + i * 36, height: 96 + i * 36 }}
                          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.1, 0.5] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeInOut" }}
                        />
                      ))}
                      <button
                        onClick={() => { recogRef.current?.stop(); setListening(false); setPhase("idle"); }}
                        className="relative z-10 w-24 h-24 rounded-full bg-red-500 shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <MicOff className="w-10 h-10 text-white" />
                      </button>
                    </div>
                    <p className="text-xs font-sans text-muted-foreground/50 mt-10">Tap to stop</p>
                  </div>
                )}

                {/* THINKING */}
                {phase === "thinking" && (
                  <div className="flex flex-col items-center py-8">
                    {transcript && (
                      <div className="w-full bg-secondary/60 rounded-xl px-4 py-3 border border-border mb-6">
                        <p className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest mb-1">You asked</p>
                        <p className="text-sm font-sans text-foreground italic">"{transcript}"</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-sm">ॐ</div>
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay }}
                            className="w-2 h-2 rounded-full bg-saffron/70"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-sans text-muted-foreground">Guru is thinking…</span>
                    </div>
                  </div>
                )}

                {/* ANSWER */}
                {phase === "answer" && (
                  <div className="space-y-4">
                    {transcript && (
                      <div className="bg-secondary/60 rounded-xl px-4 py-3 border border-border">
                        <p className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest mb-1">You asked</p>
                        <p className="text-sm font-sans text-foreground/80 italic">"{transcript}"</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-sacred-gradient flex items-center justify-center text-xs shrink-0">ॐ</div>
                      <span className="text-xs font-sans font-semibold text-saffron">OmVani</span>
                      {loading && <Loader2 className="w-3 h-3 text-saffron animate-spin" />}
                    </div>
                    <div className="max-h-52 overflow-y-auto pr-1 space-y-2" style={{ scrollbarWidth: "thin" }}>
                      {answer.split("\n").map((line, i) =>
                        line.trim() === "" ? (
                          <div key={i} className="h-1" />
                        ) : (
                          <p key={i} className="text-sm font-sans text-foreground/85 leading-relaxed">{line}</p>
                        )
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() => { setPhase("idle"); setTranscript(""); setAnswer(""); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-saffron/30 transition-all"
                      >
                        <Mic className="w-3.5 h-3.5" /> Ask again
                      </button>
                      <button
                        onClick={startListening}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sacred-gradient text-white text-xs font-sans font-semibold shadow hover:opacity-90 transition-opacity"
                      >
                        <Mic className="w-3.5 h-3.5" /> New question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Index = () => {
  const { t } = useTranslations();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead />
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#1a0a00" }}>
        <img
          src={heroBg}
          alt="Sacred temple at golden hour"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" aria-hidden="true" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-light font-sans text-sm tracking-[0.3em] uppercase mb-4"
          >
            ॐ &nbsp; Your Spiritual Companion
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 leading-tight"
          >
            Om<span className="text-gradient-sacred">Vani</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gold-light/90 max-w-2xl mx-auto mb-4 font-sans"
          >
            {t.home.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-sm text-gold-light/60 mb-10 font-sans"
          >
            {t.home.scriptureNote}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center"
          >
            <Link to="/chat">
              <Button
                size="lg"
                className="text-base px-10 py-6 bg-saffron hover:bg-saffron/90 text-white font-semibold shadow-lg shadow-saffron/30 transition-all duration-300"
              >
                ॐ Talk to Guru
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-gold-light/50 flex justify-center pt-1"
          >
            <div className="w-1 h-2 rounded-full bg-gold-light/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Shloka of the Day ─────────────────────────────────────────────────── */}
      <ShlokaCarousel />

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
              What OmVani Offers
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Ancient Wisdom, Modern Access
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <Link to={feature.href} key={feature.title}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i}
                  className="group bg-card rounded-xl p-8 shadow-sacred border border-border hover:border-saffron hover:shadow-lg hover:-translate-y-0.5 focus-within:border-gold-light transition-all duration-300 cursor-pointer h-full"
                >
                  <div className="flex items-start gap-5">
                    <div aria-hidden="true" className="shrink-0 w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground font-sans leading-relaxed mb-3">{feature.description}</p>
                      <span className="inline-block text-xs font-sans font-medium text-saffron bg-saffron/10 px-3 py-1 rounded-full">
                        {feature.tag}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sacred Scriptures ─────────────────────────────────────────────────── */}
      <section id="scriptures" className="py-24 px-4 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
              Our Sources
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Rooted in Sacred Scriptures
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans max-w-xl mx-auto">
              {t.home.scripturesSubtitle}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {scriptures.map((scripture, i) => (
              <motion.div
                key={scripture.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`bg-gradient-to-br ${scripture.color} rounded-xl p-8 border border-border hover:shadow-sacred transition-all duration-300`}
              >
                <div aria-hidden="true" className="w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center mb-5">
                  <scripture.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{scripture.name}</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">{scripture.description}</p>
                <span className="text-xs font-sans font-semibold text-saffron">{scripture.chapters}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-card rounded-xl border border-border shadow-sacred">
                <dd className="text-3xl font-serif font-bold text-gradient-sacred mb-1">{stat.number}</dd>
                <dt className="text-sm text-muted-foreground font-sans">{stat.label}</dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
              Simple Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Begin Your Spiritual Journey
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans">
              {t.home.pricingSubtitle}
            </motion.p>
          </motion.div>

          <UpgradeModal
            open={upgradeOpen}
            onClose={() => setUpgradeOpen(false)}
            trigger="general"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? "bg-card border-saffron shadow-sacred scale-[1.02]"
                    : "bg-card border-border"
                }`}
              >
                {plan.popular && (
                  <span
                    aria-label="Most popular plan"
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sacred-gradient text-accent-foreground text-xs font-sans font-semibold px-4 py-1 rounded-full"
                  >
                    Most Popular
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {"emoji" in plan && <span className="text-2xl">{(plan as any).emoji}</span>}
                  <h3 className="text-2xl font-serif font-bold text-foreground">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-serif font-bold text-gradient-sacred">{plan.price}</span>
                  <span className="text-muted-foreground font-sans text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8" aria-label={`${plan.name} plan features`}>
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm font-sans text-foreground">
                      <span aria-hidden="true" className="w-5 h-5 rounded-full bg-saffron/15 flex items-center justify-center text-saffron text-xs">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                {"id" in plan && (plan as any).id === "free" ? (
                  <Link to="/signup">
                    <Button variant="outline" size="lg" className="w-full">
                      {plan.cta ?? "Get Started"}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    size="lg"
                    className="w-full"
                    onClick={() => setUpgradeOpen(true)}
                  >
                    {plan.cta ?? t.home.startFreeTrial}
                  </Button>
                )}

                {"trialNote" in plan && (plan as any).trialNote && (
                  <p className="text-center text-xs text-muted-foreground font-sans mt-2">
                    {(plan as any).trialNote}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-sacred-gradient">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-accent-foreground/80 font-sans text-sm tracking-widest uppercase mb-3">
            <span aria-hidden="true">🙏</span> Begin Today
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-accent-foreground mb-5">
            Your Spiritual Journey Awaits
          </h2>
          <p className="text-accent-foreground/80 font-sans mb-8 text-sm">
            {t.home.ctaSubtitle}
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-accent-foreground text-accent font-sans font-semibold px-10 hover:bg-accent-foreground/90 transition-colors">
              Start Free Trial — No Card Needed
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 border-t border-border" role="contentinfo">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl font-bold text-gradient-sacred mb-2">ॐVani</p>
          <p className="text-saffron font-sans text-xs mb-4" aria-label="Om Tat Sat">ॐ तत् सत्</p>
          <p className="text-xs text-muted-foreground font-sans max-w-lg mx-auto mb-6 leading-relaxed">
            Disclaimer: ॐVani is an AI-powered tool designed to assist with spiritual learning. It is
            not a replacement for a living guru or personal spiritual practice. All answers are sourced
            from authentic scriptures but should be used for guidance only.
          </p>
          <p className="text-xs text-muted-foreground/60 font-sans">
            {t.home.footerRights}
          </p>
        </div>
      </footer>

      {/* ── Floating Voice Guru Button ──────────────────────────────────────── */}
      <HomeVoiceButton />

    </div>
  );
};

export default Index;
