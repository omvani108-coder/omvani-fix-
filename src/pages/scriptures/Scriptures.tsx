import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, BookmarkCheck, Share2,
  ChevronLeft, ChevronRight, MessageSquare,
  X, Send, Loader2, Menu, BookOpen, ChevronDown, Mic, MicOff,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import {
  chapters, searchShlokas, getBookmarks,
  toggleBookmark, isBookmarked,
  type Shloka,
} from "./gitaData";
import {
  upanishads, searchUpanishadVerses,
  toggleUpanishadBookmark, isUpanishadBookmarked,
  type Verse,
} from "./upanishadData";
import {
  padas, searchSutras,
  toggleSutraBookmark, isSutraBookmarked,
  type Sutra,
} from "./yogaSutrasData";

// ─── Types ────────────────────────────────────────────────────────────────────
type Scripture = "gita" | "upanishad" | "sutras";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function streamAI(
  prompt: string,
  onChunk: (text: string) => void,
  signal: AbortSignal
): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  return fetch(`${supabaseUrl}/functions/v1/chat`, {
    method: "POST", signal,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      system: "You are OmVani, a compassionate AI spiritual guide rooted in Hindu scripture and yoga philosophy. Answer questions about sacred texts with wisdom, warmth and precision. When the user asks verbally, keep answers to 2-3 paragraphs — clear and spoken-friendly.",
    }),
  }).then(async res => {
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

// ─── OM Voice Button ──────────────────────────────────────────────────────────
function OmVoiceButton({ scripture, currentContext }: { scripture: Scripture; currentContext: string }) {
  const [open, setOpen]           = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [phase, setPhase]         = useState<"idle"|"listening"|"thinking"|"answer">("idle");
  const abortRef  = useRef<AbortController | null>(null);
  const recogRef  = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecog: any = typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

  const reset = () => {
    abortRef.current?.abort();
    recogRef.current?.abort();
    setListening(false); setTranscript(""); setAnswer(""); setLoading(false); setPhase("idle");
  };

  const close = () => { reset(); setOpen(false); };

  const startListening = useCallback(() => {
    if (!SpeechRecog) { toast.error("Voice not supported in this browser"); return; }
    recogRef.current?.abort();
    const rec = new SpeechRecog();
    rec.continuous = false; rec.interimResults = false; rec.lang = "en-US";
    rec.onstart = () => { setListening(true); setPhase("listening"); setTranscript(""); setAnswer(""); };
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      askAI(text);
    };
    rec.onerror = () => { setListening(false); setPhase("idle"); toast.error("Could not hear you. Try again."); };
    rec.onend   = () => setListening(false);
    recogRef.current = rec;
    rec.start();
  }, [SpeechRecog, currentContext]);

  const askAI = async (question: string) => {
    setLoading(true); setPhase("thinking"); setAnswer("");
    abortRef.current = new AbortController();
    const prompt = `The user is reading the ${
      scripture === "gita" ? "Bhagavad Gita" : scripture === "upanishad" ? "Upanishads" : "Yoga Sutras of Patanjali"
    }. Currently viewing: ${currentContext}.\n\nVoice question: "${question}"\n\nAnswer concisely in 2-3 paragraphs. Be warm, clear, and cite the relevant text.`;
    try {
      await streamAI(prompt, text => { setAnswer(text); setPhase("answer"); }, abortRef.current.signal);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") toast.error("Something went wrong.");
      setPhase("idle");
    } finally { setLoading(false); }
  };

  // Pulse rings for listening state
  const rings = [0, 0.2, 0.4];

  return (
    <>
      {/* ── Floating OM Button ────────────────────────────────────────── */}
      <motion.div
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
      >
        {/* Subtle idle glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-sacred-gradient opacity-30 blur-md"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <button
          onClick={() => { setOpen(true); setPhase("idle"); }}
          aria-label="Open voice scripture guide"
          className="relative w-16 h-16 rounded-full bg-sacred-gradient shadow-[0_4px_24px_rgba(234,120,30,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          {/* OM symbol */}
          <span className="text-white text-2xl font-serif leading-none select-none" style={{ fontFamily: "serif" }}>
            ॐ
          </span>
          {/* Mic badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-background shadow flex items-center justify-center">
            <Mic className="w-3 h-3 text-saffron" />
          </div>
        </button>
      </motion.div>

      {/* ── Voice Panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
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
                      Ask anything about {scripture === "gita" ? "the Gita" : scripture === "upanishad" ? "the Upanishads" : "the Yoga Sutras"}
                    </p>
                  </div>
                </div>
                <button onClick={close} aria-label="Close"
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Context pill */}
              <div className="mx-6 mb-4">
                <div className="bg-secondary/80 rounded-xl px-4 py-2.5 border border-border">
                  <p className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest mb-0.5">Currently reading</p>
                  <p className="text-xs font-sans text-foreground/80 font-medium truncate">{currentContext}</p>
                </div>
              </div>

              {/* Main interaction area */}
              <div className="px-6 pb-8">

                {/* IDLE — big mic to start */}
                {phase === "idle" && (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-sans text-muted-foreground mb-8 text-center">
                      Tap the mic and ask your question aloud
                    </p>
                    <button
                      onClick={startListening}
                      aria-label="Start listening"
                      className="relative w-24 h-24 rounded-full bg-sacred-gradient shadow-[0_8px_32px_rgba(234,120,30,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                      <Mic className="w-10 h-10 text-white" />
                    </button>
                    <p className="text-xs font-sans text-muted-foreground/50 mt-6">or type your question below</p>
                    <TypeQuestion onAsk={askAI} loading={loading} />
                  </div>
                )}

                {/* LISTENING — animated pulse */}
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
                          <motion.div key={i} animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay }}
                            className="w-2 h-2 rounded-full bg-saffron/70" />
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
                        line.trim() === "" ? <div key={i} className="h-1" /> :
                        <p key={i} className="text-sm font-sans text-foreground/85 leading-relaxed">{line}</p>
                      )}
                    </div>
                    {/* Ask again */}
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button onClick={() => { setPhase("idle"); setTranscript(""); setAnswer(""); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-saffron/30 transition-all">
                        <Mic className="w-3.5 h-3.5" /> Ask again
                      </button>
                      <button onClick={startListening}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sacred-gradient text-white text-xs font-sans font-semibold shadow hover:opacity-90 transition-opacity">
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

// ─── Inline type-question fallback ───────────────────────────────────────────
function TypeQuestion({ onAsk, loading }: { onAsk: (q: string) => void; loading: boolean }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 mt-2 w-full focus-within:ring-2 focus-within:ring-saffron/30 transition-all">
      <input
        type="text" value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) { onAsk(val); setVal(""); } }}
        placeholder="Type your question…"
        className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
      />
      <button onClick={() => { if (val.trim()) { onAsk(val); setVal(""); } }}
        disabled={!val.trim() || loading}
        className="w-7 h-7 rounded-lg bg-sacred-gradient flex items-center justify-center disabled:opacity-30">
        {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
      </button>
    </div>
  );
}

// ─── Text Ask Panel (per-verse) ───────────────────────────────────────────────
function AskPanel({ title, sanskrit, meaning, onClose }: { title: string; sanskrit: string; meaning: string; onClose: () => void }) {
  const { t } = useTranslations();
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const ask = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setAnswer("");
    abortRef.current = new AbortController();
    const prompt = `The user is reading ${title}:\n\nSanskrit: ${sanskrit}\nMeaning: ${meaning}\n\nQuestion: ${input}\n\nAnswer concisely and warmly. Max 3 paragraphs.`;
    try {
      await streamAI(prompt, setAnswer, abortRef.current.signal);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") toast.error("Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-sm font-serif font-bold text-foreground">Ask the Guru</p>
          <p className="text-xs text-muted-foreground font-sans">{title}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mx-5 my-4 p-4 bg-secondary/60 rounded-xl border border-border">
        <p className="text-xs font-sans text-saffron font-semibold mb-1">{title}</p>
        <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">{meaning}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {!answer && !loading && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🙏</div>
            <p className="text-sm text-muted-foreground font-sans">Ask anything about this verse — its meaning, application, or related teachings.</p>
          </div>
        )}
        {loading && answer === "" && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs">ॐ</div>
            <div className="flex gap-1">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                  className="w-1.5 h-1.5 rounded-full bg-saffron/60" />
              ))}
            </div>
          </div>
        )}
        {answer && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs shrink-0">ॐ</div>
              <span className="text-xs font-sans font-semibold text-saffron">OmVani</span>
            </div>
            {answer.split("\n").map((line, i) =>
              line.trim() === "" ? <div key={i} className="h-2" /> :
              <p key={i} className="text-sm font-sans text-foreground/80 leading-relaxed">{line}</p>
            )}
          </motion.div>
        )}
      </div>
      <div className="px-5 pb-5 border-t border-border pt-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-saffron/30 transition-all">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }}
            placeholder={t.scriptures.askPlaceholder}
            className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          <button onClick={ask} disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-lg bg-sacred-gradient flex items-center justify-center disabled:opacity-30 hover:opacity-90">
            {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Parchment Page wrapper ───────────────────────────────────────────────────
function PageCard({ accentClass, ornament, footerText, children }: {
  accentClass: string; ornament: string; footerText: string; children: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative bg-[hsl(36,33%,97%)] dark:bg-[hsl(20,15%,10%)] border border-[hsl(32,25%,80%)] dark:border-[hsl(32,15%,20%)] rounded-sm shadow-[0_2px_16px_-4px_rgba(120,80,20,0.12)] overflow-hidden">
        <div className={`h-px bg-gradient-to-r from-transparent ${accentClass} to-transparent`} />
        {children}
        <div className={`h-px bg-gradient-to-r from-transparent ${accentClass} to-transparent opacity-50`} />
        <div className="flex items-center justify-center py-2">
          <span className="text-[9px] font-sans text-muted-foreground/30 tracking-[0.3em] uppercase">{footerText}</span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Gita Verse Card ──────────────────────────────────────────────────────────
function GitaPage({ shloka, onAsk }: { shloka: Shloka; onAsk: (s: Shloka) => void }) {
  const { t } = useTranslations();
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(shloka.id));
  const [showWords, setShowWords]   = useState(false);

  const handleBookmark = () => { const a = toggleBookmark(shloka.id); setBookmarked(a); toast.success(a ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved); };
  const handleShare = async () => {
    const text = `Bhagavad Gita ${shloka.id}\n\n${shloka.sanskrit}\n\n${shloka.meaning}\n\n— OmVani`;
    if (navigator.share) await navigator.share({ title: `Gita ${shloka.id}`, text });
    else { await navigator.clipboard.writeText(text); toast.success(t.scriptures.copied); }
  };

  return (
    <PageCard accentClass="via-saffron/30" ornament="❧" footerText={`Bhagavad Gita · ${shloka.id}`}>
      <div className="flex items-center justify-between px-8 pt-6 pb-3">
        <div className="flex flex-col items-start">
          <div className="w-px h-3 bg-saffron/40 ml-2" />
          <span className="text-[10px] font-sans font-bold text-saffron tracking-[0.2em] uppercase my-1">{shloka.id}</span>
          <div className="w-px h-3 bg-saffron/40 ml-2" />
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleBookmark} aria-label="Bookmark" className="w-8 h-8 rounded-lg hover:bg-saffron/10 flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors">
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-saffron" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button onClick={handleShare} aria-label="Share" className="w-8 h-8 rounded-lg hover:bg-saffron/10 flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => onAsk(shloka)} className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-saffron/10 hover:bg-saffron/20 text-saffron transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> Ask Guru
          </button>
        </div>
      </div>
      <div className="px-8 pb-6 text-center">
        <p className="font-serif text-xl md:text-2xl text-foreground leading-[2] whitespace-pre-line tracking-wide">{shloka.sanskrit}</p>
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-saffron/40" />
          <span className="text-saffron/60 text-sm">❧</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-saffron/40" />
        </div>
        <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line mb-5">{shloka.transliteration}</p>
        <p className="text-base font-sans text-foreground/85 leading-8 max-w-2xl mx-auto text-justify hyphens-auto">{shloka.meaning}</p>
        {shloka.word_meanings && (
          <div className="mt-6">
            <button onClick={() => setShowWords(v => !v)} className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 hover:text-saffron transition-colors">
              <ChevronDown className={`w-3 h-3 transition-transform ${showWords ? "rotate-180" : ""}`} />
              {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
            </button>
            <AnimatePresence>
              {showWords && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 pt-4 border-t border-border/50 text-left">{shloka.word_meanings}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageCard>
  );
}

// ─── Upanishad Verse Card ─────────────────────────────────────────────────────
function UpanishadPage({ verse, onAsk }: { verse: Verse; onAsk: (v: Verse) => void }) {
  const { t } = useTranslations();
  const [bookmarked, setBookmarked] = useState(() => isUpanishadBookmarked(verse.id));
  const [showWords, setShowWords]   = useState(false);

  const handleBookmark = () => { const a = toggleUpanishadBookmark(verse.id); setBookmarked(a); toast.success(a ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved); };
  const handleShare = async () => {
    const text = `${verse.upanishad} Upanishad · ${verse.section}\n\n${verse.sanskrit}\n\n${verse.meaning}\n\n— OmVani`;
    if (navigator.share) await navigator.share({ title: `${verse.upanishad} Upanishad`, text });
    else { await navigator.clipboard.writeText(text); toast.success(t.scriptures.copied); }
  };

  return (
    <PageCard accentClass="via-gold/30" ornament="✦" footerText={`${verse.upanishad} Upanishad · ${verse.section}`}>
      <div className="flex items-center justify-between px-8 pt-6 pb-3">
        <div>
          <span className="text-[10px] font-sans font-bold text-gold tracking-[0.2em] uppercase block">{verse.upanishad} Upanishad</span>
          <span className="text-[9px] font-sans text-muted-foreground/60">{verse.section}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleBookmark} aria-label="Bookmark" className="w-8 h-8 rounded-lg hover:bg-gold/10 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-gold" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button onClick={handleShare} aria-label="Share" className="w-8 h-8 rounded-lg hover:bg-gold/10 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => onAsk(verse)} className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> Ask Guru
          </button>
        </div>
      </div>
      <div className="px-8 pb-6 text-center">
        <p className="font-serif text-xl md:text-2xl text-foreground leading-[2] whitespace-pre-line tracking-wide">{verse.sanskrit}</p>
        <div className="flex items-center justify-center gap-3 my-5">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="text-gold/60 text-sm">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line mb-5">{verse.transliteration}</p>
        <p className="text-base font-sans text-foreground/85 leading-8 max-w-2xl mx-auto text-justify hyphens-auto">{verse.meaning}</p>
        {verse.word_meanings && (
          <div className="mt-6">
            <button onClick={() => setShowWords(v => !v)} className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 hover:text-gold transition-colors">
              <ChevronDown className={`w-3 h-3 transition-transform ${showWords ? "rotate-180" : ""}`} />
              {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
            </button>
            <AnimatePresence>
              {showWords && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 pt-4 border-t border-border/50 text-left">{verse.word_meanings}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageCard>
  );
}

// ─── Yoga Sutra Card ──────────────────────────────────────────────────────────
function SutraPage({ sutra, onAsk }: { sutra: Sutra; onAsk: (s: Sutra) => void }) {
  const { t } = useTranslations();
  const [bookmarked, setBookmarked] = useState(() => isSutraBookmarked(sutra.id));
  const [showWords, setShowWords]   = useState(false);

  const handleBookmark = () => { const a = toggleSutraBookmark(sutra.id); setBookmarked(a); toast.success(a ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved); };
  const handleShare = async () => {
    const text = `Yoga Sutras · ${sutra.section}\n\n${sutra.sanskrit}\n\n${sutra.meaning}\n\n— OmVani`;
    if (navigator.share) await navigator.share({ title: `Yoga Sutras ${sutra.id}`, text });
    else { await navigator.clipboard.writeText(text); toast.success(t.scriptures.copied); }
  };

  // Lotus-pink / maroon accent for Sutras
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative bg-[hsl(36,33%,97%)] dark:bg-[hsl(20,15%,10%)] border border-[hsl(32,25%,80%)] dark:border-[hsl(32,15%,20%)] rounded-sm shadow-[0_2px_16px_-4px_rgba(120,80,20,0.12)] overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(340,60%,65%)]/40 to-transparent" />
        <div className="flex items-center justify-between px-8 pt-6 pb-3">
          <div>
            <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase block" style={{ color: "hsl(340,60%,55%)" }}>Yoga Sutras · {sutra.section}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleBookmark} aria-label="Bookmark" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground transition-colors hover:opacity-80" style={{ background: "hsl(340,60%,65%,0.1)" }}>
              {bookmarked ? <BookmarkCheck className="w-4 h-4" style={{ color: "hsl(340,60%,55%)" }} /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button onClick={handleShare} aria-label="Share" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:opacity-80 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => onAsk(sutra)} className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg transition-colors" style={{ background: "hsl(340,60%,65%,0.12)", color: "hsl(340,60%,48%)" }}>
              <MessageSquare className="w-3.5 h-3.5" /> Ask Guru
            </button>
          </div>
        </div>
        <div className="px-8 pb-6 text-center">
          <p className="font-serif text-xl md:text-2xl text-foreground leading-[2] whitespace-pre-line tracking-wide">{sutra.sanskrit}</p>
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[hsl(340,60%,65%)]/40" />
            <span className="text-sm" style={{ color: "hsl(340,60%,65%,0.7)" }}>❈</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[hsl(340,60%,65%)]/40" />
          </div>
          <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line mb-5">{sutra.transliteration}</p>
          <p className="text-base font-sans text-foreground/85 leading-8 max-w-2xl mx-auto text-justify hyphens-auto">{sutra.meaning}</p>
          {sutra.word_meanings && (
            <div className="mt-6">
              <button onClick={() => setShowWords(v => !v)} className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 transition-colors hover:opacity-80">
                <ChevronDown className={`w-3 h-3 transition-transform ${showWords ? "rotate-180" : ""}`} />
                {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
              </button>
              <AnimatePresence>
                {showWords && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 pt-4 border-t border-border/50 text-left">{sutra.word_meanings}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[hsl(340,60%,65%)]/20 to-transparent" />
        <div className="flex items-center justify-center py-2">
          <span className="text-[9px] font-sans text-muted-foreground/30 tracking-[0.3em] uppercase">Yoga Sutras of Patanjali · {sutra.id}</span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Sidebars ─────────────────────────────────────────────────────────────────
function GitaSidebar({ current, onSelect, onClose }: { current: number; onSelect: (n: number) => void; onClose?: () => void }) {
  return (
    <nav aria-label="Gita chapters">
      <p className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">18 Chapters</p>
      <div className="space-y-0.5">
        {chapters.map(ch => (
          <button key={ch.number} onClick={() => { onSelect(ch.number); onClose?.(); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-xs ${current === ch.number ? "bg-saffron/10 text-saffron" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <span className="font-semibold block">Ch. {ch.number}</span>
            <span className="opacity-60 truncate block text-[10px]">{ch.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function UpanishadSidebar({ currentId, onSelect, onClose }: { currentId: string; onSelect: (id: string) => void; onClose?: () => void }) {
  return (
    <nav aria-label="Upanishads">
      <p className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">Upanishads</p>
      <div className="space-y-0.5">
        {upanishads.map(u => (
          <button key={u.id} onClick={() => { onSelect(u.id); onClose?.(); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-xs ${currentId === u.id ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <span className="font-semibold block">{u.name}</span>
            <span className="opacity-50 block text-[9px]">{u.tradition}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function SutraSidebar({ current, onSelect, onClose }: { current: number; onSelect: (n: number) => void; onClose?: () => void }) {
  return (
    <nav aria-label="Yoga Sutras padas">
      <p className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">4 Padas</p>
      <div className="space-y-0.5">
        {padas.map(p => (
          <button key={p.number} onClick={() => { onSelect(p.number); onClose?.(); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-xs ${current === p.number ? "text-[hsl(340,60%,50%)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            style={current === p.number ? { background: "hsl(340,60%,65%,0.1)" } : {}}>
            <span className="font-semibold block">Pada {p.number}</span>
            <span className="opacity-60 truncate block text-[10px]">{p.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Chapter/section title block ──────────────────────────────────────────────
function TitleBlock({ eyebrow, title, subtitle, summary, stat, accentColor, ornament }: {
  eyebrow: string; title: string; subtitle: string; summary: string; stat?: string;
  accentColor: string; ornament: string;
}) {
  return (
    <div className="relative text-center mb-8 py-8 px-6">
      <div className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 rounded-tl`} style={{ borderColor: accentColor + "50" }} />
      <div className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 rounded-tr`} style={{ borderColor: accentColor + "50" }} />
      <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 rounded-bl`} style={{ borderColor: accentColor + "50" }} />
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 rounded-br`} style={{ borderColor: accentColor + "50" }} />
      <p className="text-[10px] font-sans tracking-[0.4em] uppercase mb-2" style={{ color: accentColor + "aa" }}>{eyebrow}</p>
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">{title}</h1>
      <p className="text-sm font-sans italic mb-4" style={{ color: accentColor }}>{subtitle}</p>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${accentColor}33)` }} />
        <span className="text-sm" style={{ color: accentColor + "66" }}>{ornament}</span>
        <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${accentColor}33)` }} />
      </div>
      <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xl mx-auto">{summary}</p>
      {stat && <p className="text-xs text-muted-foreground/40 font-sans mt-3">{stat}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Scriptures() {
  const { t } = useTranslations();
  const [scripture, setScripture]           = useState<Scripture>("gita");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentUpanishad, setCurrentUpanishad] = useState("isha");
  const [currentPada, setCurrentPada]       = useState(1);
  const [bookmarkIds, setBookmarkIds]       = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks]   = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState<(Shloka | Verse | Sutra)[]>([]);
  const [isSearching, setIsSearching]       = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [askData, setAskData]               = useState<{ title: string; sanskrit: string; meaning: string } | null>(null);

  const chapter    = chapters.find(c => c.number === currentChapter)!;
  const upanishad  = upanishads.find(u => u.id === currentUpanishad)!;
  const pada       = padas.find(p => p.number === currentPada)!;

  useEffect(() => { setBookmarkIds(getBookmarks()); }, [askData]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (scripture === "gita")      setSearchResults(searchShlokas(searchQuery));
      else if (scripture === "upanishad") setSearchResults(searchUpanishadVerses(searchQuery));
      else                           setSearchResults(searchSutras(searchQuery));
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, scripture]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const switchScripture = (s: Scripture) => { setScripture(s); setSearchQuery(""); setShowBookmarks(false); scrollTop(); };

  // Current context string for voice button
  const voiceContext = scripture === "gita"
    ? `Chapter ${currentChapter} — ${chapter.title}`
    : scripture === "upanishad"
    ? `${upanishad.name}`
    : `${pada.name} (Pada ${currentPada}) of Yoga Sutras`;

  const gitaShlokas: Shloka[] = searchQuery ? (searchResults as Shloka[])
    : showBookmarks ? chapter.shlokas.filter(s => bookmarkIds.includes(s.id))
    : chapter.shlokas;

  const upanishadVerses: Verse[] = searchQuery ? (searchResults as Verse[]) : upanishad.chapters.flatMap(c => c.verses);
  const sutras: Sutra[]          = searchQuery ? (searchResults as Sutra[]) : pada.sutras;

  const SCRIPTURES = [
    { id: "gita" as const,      label: "Bhagavad Gita",           sanskrit: "भगवद्गीता", accent: "hsl(28,90%,55%)" },
    { id: "upanishad" as const, label: "Upanishads",              sanskrit: "उपनिषद्",   accent: "hsl(42,85%,55%)" },
    { id: "sutras" as const,    label: "Yoga Sutras",             sanskrit: "योगसूत्राणि", accent: "hsl(340,60%,55%)" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Sacred Scriptures" description="Read the Bhagavad Gita, Upanishads and Yoga Sutras of Patanjali." canonicalPath="/scriptures" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 pt-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
            <div className="mb-5 space-y-1">
              {SCRIPTURES.map(({ id, label, sanskrit, accent }) => (
                <button key={id} onClick={() => switchScripture(id)}
                  className={`w-full text-left px-3 py-3 rounded-xl border-2 transition-all duration-200 ${scripture === id ? "" : "border-transparent text-muted-foreground hover:bg-muted"}`}
                  style={scripture === id ? { borderColor: accent + "66", background: accent + "10", color: accent } : {}}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <div>
                      <p className="text-xs font-sans font-semibold">{label}</p>
                      <p className="text-[9px] font-sans opacity-60">{sanskrit}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              {scripture === "gita"      && <GitaSidebar current={currentChapter} onSelect={n => { setCurrentChapter(n); setSearchQuery(""); scrollTop(); }} />}
              {scripture === "upanishad" && <UpanishadSidebar currentId={currentUpanishad} onSelect={id => { setCurrentUpanishad(id); setSearchQuery(""); scrollTop(); }} />}
              {scripture === "sutras"    && <SutraSidebar current={currentPada} onSelect={n => { setCurrentPada(n); setSearchQuery(""); scrollTop(); }} />}
            </div>
          </aside>

          {/* Mobile sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
                <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 p-5 overflow-y-auto lg:hidden">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-serif font-bold text-foreground">Scriptures</p>
                    <button onClick={() => setSidebarOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  <div className="mb-4 space-y-1">
                    {SCRIPTURES.map(({ id, label }) => (
                      <button key={id} onClick={() => { switchScripture(id); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans font-semibold transition-all ${scripture === id ? "bg-saffron/10 text-saffron" : "text-muted-foreground hover:bg-muted"}`}>{label}</button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    {scripture === "gita"      && <GitaSidebar current={currentChapter} onSelect={n => { setCurrentChapter(n); setSearchQuery(""); setSidebarOpen(false); scrollTop(); }} />}
                    {scripture === "upanishad" && <UpanishadSidebar currentId={currentUpanishad} onSelect={id => { setCurrentUpanishad(id); setSearchQuery(""); setSidebarOpen(false); scrollTop(); }} />}
                    {scripture === "sutras"    && <SutraSidebar current={currentPada} onSelect={n => { setCurrentPada(n); setSearchQuery(""); setSidebarOpen(false); scrollTop(); }} />}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main */}
          <main className="flex-1 min-w-0 pt-8 pb-36">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"><Menu className="w-5 h-5 text-muted-foreground" /></button>

              {/* Mobile scripture tabs */}
              <div className="lg:hidden flex gap-1 bg-secondary border border-border rounded-xl p-1">
                {SCRIPTURES.map(({ id, label }) => (
                  <button key={id} onClick={() => switchScripture(id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-semibold transition-all ${scripture === id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                    {label.split(" ")[0]}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.scriptures.searchPlaceholder}
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all" />
              </div>

              {scripture === "gita" && (
                <button onClick={() => setShowBookmarks(v => !v)} aria-pressed={showBookmarks}
                  className={`p-2.5 rounded-xl border transition-all ${showBookmarks ? "bg-saffron/10 border-saffron/30 text-saffron" : "border-border text-muted-foreground hover:text-saffron"}`}>
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── GITA ─────────────────────────────────────────────────── */}
            {scripture === "gita" && (
              <>
                {!searchQuery && !showBookmarks && (
                  <motion.div key={currentChapter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
                    <TitleBlock
                      eyebrow={`Bhagavad Gita · Chapter ${chapter.number}`}
                      title={chapter.title} subtitle={chapter.subtitle} summary={chapter.summary}
                      stat={`${chapter.total_verses} verses`} accentColor="hsl(28,90%,55%)" ornament="❦"
                    />
                    <div className="flex items-center justify-between">
                      <button onClick={() => { setCurrentChapter(Math.max(1, currentChapter - 1)); scrollTop(); }} disabled={currentChapter === 1}
                        className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                      </button>
                      <span className="text-xs font-sans text-muted-foreground/50">{currentChapter} of 18</span>
                      <button onClick={() => { setCurrentChapter(Math.min(18, currentChapter + 1)); scrollTop(); }} disabled={currentChapter === 18}
                        className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                        Next <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {(searchQuery || showBookmarks) && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {searchQuery ? (isSearching ? t.scriptures.searching : `${gitaShlokas.length} results for "${searchQuery}"`) : `${gitaShlokas.length} bookmarks`}
                  </p>
                )}
                <div className="space-y-6">
                  {gitaShlokas.length > 0 ? gitaShlokas.map(s => (
                    <GitaPage key={s.id} shloka={s} onAsk={x => setAskData({ title: `Gita ${x.id}`, sanskrit: x.sanskrit, meaning: x.meaning })} />
                  )) : (
                    <div className="text-center py-16"><div className="text-4xl mb-3">{showBookmarks ? "🔖" : "📖"}</div>
                      <p className="text-muted-foreground text-sm">{showBookmarks ? t.scriptures.noBookmarks : t.scriptures.noResults}</p>
                    </div>
                  )}
                </div>
                {!searchQuery && !showBookmarks && gitaShlokas.length > 0 && (
                  <div className="flex justify-between mt-10 pt-8 border-t border-border">
                    <button onClick={() => { setCurrentChapter(Math.max(1, currentChapter - 1)); scrollTop(); }} disabled={currentChapter === 1}
                      className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground disabled:opacity-30 transition-all">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button onClick={() => { setCurrentChapter(Math.min(18, currentChapter + 1)); scrollTop(); }} disabled={currentChapter === 18}
                      className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground disabled:opacity-30 transition-all">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── UPANISHADS ────────────────────────────────────────────── */}
            {scripture === "upanishad" && (
              <>
                {!searchQuery && (
                  <motion.div key={currentUpanishad} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
                    <TitleBlock eyebrow={upanishad.tradition} title={upanishad.name} subtitle={upanishad.sanskrit} summary={upanishad.summary} accentColor="hsl(42,85%,55%)" ornament="✦" />
                    <div className="flex items-center justify-between">
                      {(() => {
                        const idx = upanishads.findIndex(u => u.id === currentUpanishad);
                        const prev = upanishads[idx - 1]; const next = upanishads[idx + 1];
                        return (<>
                          <button onClick={() => { if(prev) { setCurrentUpanishad(prev.id); scrollTop(); } }} disabled={!prev}
                            className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border hover:border-gold/30 text-muted-foreground disabled:opacity-30 transition-all">
                            <ChevronLeft className="w-3.5 h-3.5" /> Previous
                          </button>
                          <span className="text-xs text-muted-foreground/50">{idx + 1} of {upanishads.length}</span>
                          <button onClick={() => { if(next) { setCurrentUpanishad(next.id); scrollTop(); } }} disabled={!next}
                            className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border hover:border-gold/30 text-muted-foreground disabled:opacity-30 transition-all">
                            Next <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </>);
                      })()}
                    </div>
                  </motion.div>
                )}
                {searchQuery && <p className="text-sm text-muted-foreground mb-6">{isSearching ? t.scriptures.searching : `${upanishadVerses.length} results for "${searchQuery}"`}</p>}
                {!searchQuery && upanishad.chapters.map(ch => (
                  <div key={ch.number} className="mb-12">
                    <div className="text-center mb-8 py-4">
                      <p className="text-[10px] font-sans text-gold/60 tracking-[0.3em] uppercase mb-1">Section {ch.number}</p>
                      <h2 className="text-xl font-serif font-bold text-foreground">{ch.title}</h2>
                      <p className="text-sm font-sans italic text-muted-foreground mt-1">{ch.subtitle}</p>
                      <p className="text-xs font-sans text-muted-foreground/60 mt-3 max-w-lg mx-auto leading-relaxed">{ch.summary}</p>
                    </div>
                    <div className="space-y-6">
                      {ch.verses.map(v => <UpanishadPage key={v.id} verse={v} onAsk={x => setAskData({ title: `${x.upanishad} · ${x.section}`, sanskrit: x.sanskrit, meaning: x.meaning })} />)}
                    </div>
                  </div>
                ))}
                {searchQuery && (
                  <div className="space-y-6">
                    {upanishadVerses.length > 0 ? upanishadVerses.map(v => <UpanishadPage key={v.id} verse={v} onAsk={x => setAskData({ title: `${x.upanishad} · ${x.section}`, sanskrit: x.sanskrit, meaning: x.meaning })} />)
                      : <div className="text-center py-16"><div className="text-4xl mb-3">📖</div><p className="text-muted-foreground text-sm">{t.scriptures.noResults}</p></div>}
                  </div>
                )}
              </>
            )}

            {/* ── YOGA SUTRAS ───────────────────────────────────────────── */}
            {scripture === "sutras" && (
              <>
                {!searchQuery && (
                  <motion.div key={currentPada} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
                    <TitleBlock
                      eyebrow={`Yoga Sutras of Patanjali · Pada ${pada.number}`}
                      title={pada.name} subtitle={pada.subtitle} summary={pada.summary}
                      stat={`${pada.total_sutras} sutras`} accentColor="hsl(340,60%,55%)" ornament="❈"
                    />
                    <div className="flex items-center justify-between">
                      <button onClick={() => { setCurrentPada(Math.max(1, currentPada - 1)); scrollTop(); }} disabled={currentPada === 1}
                        className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border text-muted-foreground disabled:opacity-30 transition-all hover:border-[hsl(340,60%,55%)]/30">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Pada
                      </button>
                      <span className="text-xs text-muted-foreground/50">Pada {currentPada} of 4</span>
                      <button onClick={() => { setCurrentPada(Math.min(4, currentPada + 1)); scrollTop(); }} disabled={currentPada === 4}
                        className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border text-muted-foreground disabled:opacity-30 transition-all hover:border-[hsl(340,60%,55%)]/30">
                        Next Pada <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {searchQuery && <p className="text-sm text-muted-foreground mb-6">{isSearching ? t.scriptures.searching : `${sutras.length} results for "${searchQuery}"`}</p>}
                <div className="space-y-6">
                  {sutras.length > 0 ? sutras.map(s => <SutraPage key={s.id} sutra={s} onAsk={x => setAskData({ title: `Yoga Sutras ${x.id}`, sanskrit: x.sanskrit, meaning: x.meaning })} />)
                    : <div className="text-center py-16"><div className="text-4xl mb-3">📖</div><p className="text-muted-foreground text-sm">{t.scriptures.noResults}</p></div>}
                </div>
                {!searchQuery && sutras.length > 0 && (
                  <div className="flex justify-between mt-10 pt-8 border-t border-border">
                    <button onClick={() => { setCurrentPada(Math.max(1, currentPada - 1)); scrollTop(); }} disabled={currentPada === 1}
                      className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border text-muted-foreground disabled:opacity-30 transition-all">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button onClick={() => { setCurrentPada(Math.min(4, currentPada + 1)); scrollTop(); }} disabled={currentPada === 4}
                      className="flex items-center gap-1.5 text-xs px-4 py-2.5 rounded-lg border border-border text-muted-foreground disabled:opacity-30 transition-all">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {/* ── OM Floating Voice Button ─────────────────────────────────────── */}
      <OmVoiceButton scripture={scripture} currentContext={voiceContext} />

      {/* ── Text Ask Panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {askData && <AskPanel title={askData.title} sanskrit={askData.sanskrit} meaning={askData.meaning} onClose={() => setAskData(null)} />}
      </AnimatePresence>
    </div>
  );
}
