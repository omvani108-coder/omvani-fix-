import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, BookmarkCheck, Share2,
  ChevronLeft, ChevronRight, MessageSquare,
  X, Send, Loader2, Mic, MicOff, Lock, BookOpen, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import { DivyaSandeshModal } from "@/components/DivyaSandeshModal";
import { streamAI } from "@/lib/streamAI";
import { trackScriptureRead } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScriptureBookmarks, type ScriptureType } from "@/hooks/useScriptureBookmarks";
import { useScripture, type Scripture, type ScriptureChapter, type ScriptureVerse } from "@/hooks/useScripture";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "library" | "reader";

// ─── Map scripture IDs to bookmark keys ──────────────────────────────────────
const BOOKMARK_KEY_MAP: Record<string, ScriptureType> = {
  "gita": "gita",
  "upanishad": "upanishad",
  "yoga-sutras": "yoga_sutras",
  "hanuman-chalisa": "hanuman_chalisa",
  "sunderkand": "sunderkand",
  "vishnu-sahasranama": "vishnu_sahasranama",
  "lalita-sahasranama": "lalita_sahasranama",
  "shiv-tandav": "shiv_tandav",
  "aditya-hridayam": "aditya_hridayam",
  "guru-granth-sahib": "guru_granth_sahib",
};

// ─── OmVoiceButton ────────────────────────────────────────────────────────────
function OmVoiceButton({ scriptureName, currentContext }: { scriptureName: string; currentContext: string }) {
  const { language } = useLanguage();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle"|"listening"|"thinking"|"answer">("idle");
  const abortRef = useRef<AbortController | null>(null);
  const recogRef = useRef<SpeechRecognition | null>(null);

  const SpeechRecog: SpeechRecognitionConstructor | undefined = typeof window !== "undefined"
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;

  const reset = () => { abortRef.current?.abort(); recogRef.current?.abort(); setListening(false); setTranscript(""); setAnswer(""); setLoading(false); setPhase("idle"); };
  const close = () => { reset(); setOpen(false); };

  const startListening = useCallback(() => {
    if (!SpeechRecog) { toast.error("Voice not supported in this browser"); return; }
    recogRef.current?.abort();
    const rec = new SpeechRecog();
    rec.continuous = false; rec.interimResults = false;
    rec.lang = language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-US";
    rec.onstart = () => { setListening(true); setPhase("listening"); setTranscript(""); setAnswer(""); };
    rec.onresult = (e: SpeechRecognitionEvent) => { const text = e.results[0][0].transcript; setTranscript(text); setListening(false); askAI(text); };
    rec.onerror = () => { setListening(false); setPhase("idle"); toast.error("Could not hear you. Try again."); };
    rec.onend = () => setListening(false);
    recogRef.current = rec; rec.start();
  }, [SpeechRecog, currentContext, language]);

  const askAI = async (question: string) => {
    setLoading(true); setPhase("thinking"); setAnswer("");
    abortRef.current = new AbortController();
    const prompt = `The user is reading the ${scriptureName}. Currently viewing: ${currentContext}.\n\nVoice question: "${question}"\n\nAnswer concisely in 2-3 paragraphs. Be warm, clear, and cite the relevant text.`;
    try { await streamAI(prompt, text => { setAnswer(text); setPhase("answer"); }, abortRef.current.signal); }
    catch (err) { if (err instanceof Error && err.name !== "AbortError") toast.error("Something went wrong."); setPhase("idle"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <motion.div className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}>
        <motion.div className="absolute inset-0 rounded-full bg-sacred-gradient opacity-30 blur-md"
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <button onClick={() => { setOpen(true); setPhase("idle"); }} aria-label="Open voice scripture guide"
          className="relative w-14 h-14 rounded-full bg-sacred-gradient shadow-[0_4px_24px_rgba(234,120,30,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
          <span className="text-white text-xl font-serif leading-none select-none" style={{ fontFamily: "serif" }}>ॐ</span>
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card border-2 border-background shadow flex items-center justify-center">
            <Mic className="w-2.5 h-2.5 text-saffron" />
          </div>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] bg-card border border-border rounded-t-2xl md:rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-sacred-gradient flex items-center justify-center text-white text-base shadow-sacred">ॐ</div>
                  <div>
                    <p className="font-serif font-bold text-foreground text-sm">{t.scriptures.voiceGuru}</p>
                    <p className="text-[10px] font-sans text-muted-foreground">{t.scriptures.askAnything}</p>
                  </div>
                </div>
                <button onClick={close} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
              <div className="mx-5 mb-3 bg-secondary/80 rounded-xl px-3 py-2 border border-border">
                <p className="text-[9px] font-sans text-muted-foreground/60 uppercase tracking-widest">{t.scriptures.currentlyReading}</p>
                <p className="text-xs font-sans text-foreground/80 font-medium truncate">{currentContext}</p>
              </div>
              <div className="px-5 pb-6">
                {phase === "idle" && (
                  <div className="flex flex-col items-center py-4">
                    <p className="text-sm font-sans text-muted-foreground mb-6 text-center">{t.scriptures.tapMicInstruction}</p>
                    <button onClick={startListening} className="relative w-20 h-20 rounded-full bg-sacred-gradient shadow-[0_8px_32px_rgba(234,120,30,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                      <Mic className="w-8 h-8 text-white" />
                    </button>
                    <p className="text-xs font-sans text-muted-foreground/50 mt-5">{t.common.orTypeBelow}</p>
                    <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 mt-2 w-full focus-within:ring-2 focus-within:ring-saffron/30">
                      <input type="text" placeholder={t.scriptures.typeYourQuestion}
                        className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                        onKeyDown={e => { if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) { askAI((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} />
                      <Send className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </div>
                  </div>
                )}
                {phase === "listening" && (
                  <div className="flex flex-col items-center py-6">
                    <p className="text-sm font-sans text-saffron font-semibold mb-6 animate-pulse">{t.common.listening}</p>
                    <div className="relative flex items-center justify-center">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div key={i} className="absolute rounded-full border-2 border-saffron/40"
                          style={{ width: 80 + i * 30, height: 80 + i * 30 }}
                          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.1, 0.5] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeInOut" }} />
                      ))}
                      <button onClick={() => { recogRef.current?.stop(); setListening(false); setPhase("idle"); }}
                        className="relative z-10 w-20 h-20 rounded-full bg-red-500 shadow-lg flex items-center justify-center hover:bg-red-600">
                        <MicOff className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                {phase === "thinking" && (
                  <div className="flex flex-col items-center py-6">
                    {transcript && <div className="w-full bg-secondary/60 rounded-xl px-3 py-2.5 border border-border mb-5">
                      <p className="text-[9px] font-sans text-muted-foreground/60 uppercase tracking-widest mb-0.5">{t.scriptures.youAsked}</p>
                      <p className="text-sm font-sans text-foreground italic">"{transcript}"</p>
                    </div>}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sacred-gradient flex items-center justify-center text-xs">ॐ</div>
                      <div className="flex gap-1">{[0, 0.2, 0.4].map((d, i) => (
                        <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.7, repeat: Infinity, delay: d }} className="w-1.5 h-1.5 rounded-full bg-saffron/70" />
                      ))}</div>
                      <span className="text-sm font-sans text-muted-foreground">{t.scriptures.guruThinking}</span>
                    </div>
                  </div>
                )}
                {phase === "answer" && (
                  <div className="space-y-3">
                    {transcript && <div className="bg-secondary/60 rounded-xl px-3 py-2.5 border border-border">
                      <p className="text-[9px] font-sans text-muted-foreground/60 uppercase tracking-widest mb-0.5">{t.scriptures.youAsked}</p>
                      <p className="text-sm font-sans text-foreground/80 italic">"{transcript}"</p>
                    </div>}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs shrink-0">ॐ</div>
                      <span className="text-xs font-sans font-semibold text-saffron">OmVani</span>
                      {loading && <Loader2 className="w-3 h-3 text-saffron animate-spin" />}
                    </div>
                    <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5" style={{ scrollbarWidth: "thin" }}>
                      {answer.split("\n").map((line, i) => line.trim() === "" ? <div key={i} className="h-1" /> :
                        <p key={i} className="text-sm font-sans text-foreground/85 leading-relaxed">{line}</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button onClick={() => { setPhase("idle"); setTranscript(""); setAnswer(""); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-sans text-muted-foreground hover:text-foreground transition-all">
                        <Mic className="w-3 h-3" /> {t.common.askAgain}
                      </button>
                      <button onClick={startListening}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-sacred-gradient text-white text-xs font-sans font-semibold shadow hover:opacity-90">
                        <Mic className="w-3 h-3" /> {t.common.newQuestion}
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

// ─── AskPanel (per-verse) ─────────────────────────────────────────────────────
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
    try { await streamAI(prompt, setAnswer, abortRef.current.signal); }
    catch (err) { if (err instanceof Error && err.name !== "AbortError") toast.error("Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-sm font-serif font-bold text-foreground">{t.scriptures.askTheGuru}</p>
          <p className="text-xs text-muted-foreground font-sans">{title}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"><X className="w-4 h-4" /></button>
      </div>
      <div className="mx-5 my-3 p-3 bg-secondary/60 rounded-xl border border-border">
        <p className="text-xs font-sans text-saffron font-semibold mb-1">{title}</p>
        <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">{meaning}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {!answer && !loading && <div className="text-center py-8"><div className="text-3xl mb-3">🙏</div><p className="text-sm text-muted-foreground font-sans">{t.scriptures.askAboutVerse}</p></div>}
        {loading && answer === "" && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs">ॐ</div>
            <div className="flex gap-1">{[0, 0.15, 0.3].map((d, i) => (
              <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} className="w-1.5 h-1.5 rounded-full bg-saffron/60" />
            ))}</div>
          </div>
        )}
        {answer && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs shrink-0">ॐ</div>
              <span className="text-xs font-sans font-semibold text-saffron">OmVani</span>
            </div>
            {answer.split("\n").map((line, i) => line.trim() === "" ? <div key={i} className="h-2" /> :
              <p key={i} className="text-sm font-sans text-foreground/80 leading-relaxed">{line}</p>
            )}
          </motion.div>
        )}
      </div>
      <div className="px-5 pb-5 border-t border-border pt-3">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-saffron/30">
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

// ─── Scripture Book Card (library view) ───────────────────────────────────────
function ScriptureCard({ scripture, isActive, isLocked, onSelect, eager }: {
  scripture: Scripture; isActive: boolean; isLocked: boolean;
  onSelect: () => void; eager?: boolean;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`group relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isActive ? "border-saffron/40 shadow-lg shadow-saffron/10" : "border-border hover:border-saffron/20 hover:shadow-md"
      }`}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: scripture.cover_image ? undefined : `linear-gradient(145deg, ${scripture.accent_color}15, ${scripture.accent_color}05, hsl(var(--card)))` }}>

        {/* Cover image (if available) */}
        {scripture.cover_image ? (
          <>
            <img
              src={scripture.cover_image}
              alt={scripture.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={eager ? "eager" : "lazy"}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Lock badge */}
            {isLocked && (
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur flex items-center justify-center z-10">
                <Lock className="w-3 h-3 text-white/80" />
              </div>
            )}

            {/* Text over image */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
              <h3 className="text-sm font-serif font-bold text-white text-center leading-tight drop-shadow-lg">{scripture.name}</h3>
              <span className="mt-1.5 mx-auto block w-fit text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white/90 backdrop-blur-sm">{scripture.category}</span>
            </div>
          </>
        ) : (
          <>
            {/* Lock badge */}
            {isLocked && (
              <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-muted/80 backdrop-blur flex items-center justify-center">
                <Lock className="w-3 h-3 text-muted-foreground" />
              </div>
            )}

            {/* Decorative top line */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: scripture.accent_color }} />

            {/* Emoji / symbol */}
            <span className="text-4xl mb-3 select-none">{scripture.emoji}</span>

            {/* Sanskrit name */}
            <p className="text-lg font-serif text-foreground/30 mb-1 select-none">{scripture.name_sanskrit}</p>

            {/* Title */}
            <h3 className="text-sm font-serif font-bold text-foreground text-center leading-tight">{scripture.name}</h3>

            {/* Category pill */}
            <span className="mt-2 text-[9px] font-sans font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: scripture.accent_color + "18", color: scripture.accent_color }}>{scripture.category}</span>
          </>
        )}
      </div>

      {/* Bottom info */}
      <div className="px-3 py-2.5 bg-card border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-sans text-muted-foreground">{scripture.total_chapters} chapters</span>
          <span className="text-[10px] font-sans text-muted-foreground">{scripture.total_verses} verses</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Unified Verse Card (clean reader style) ──────────────────────────────────
function VerseCard({ id, label, sublabel, sanskrit, transliteration, meaning, wordMeanings, accentColor, isBookmarked, onBookmark, onShare, onAsk }: {
  id: string; label: string; sublabel?: string;
  sanskrit: string; transliteration: string | null; meaning: string; wordMeanings?: string | null;
  accentColor: string; isBookmarked: boolean;
  onBookmark: () => void; onShare: () => void; onAsk: () => void;
}) {
  const { t } = useTranslations();
  const [showWords, setShowWords] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Accent top bar */}
      <div className="h-0.5" style={{ background: accentColor }} />

      <div className="p-5 md:p-7">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em]" style={{ color: accentColor }}>{label}</span>
            {sublabel && <p className="text-[10px] font-sans text-muted-foreground/60 mt-0.5">{sublabel}</p>}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={onBookmark} aria-label="Bookmark"
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" style={{ color: accentColor }} /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button onClick={onShare} aria-label="Share"
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={onAsk}
              className="flex items-center gap-1 text-[11px] font-sans font-medium px-2.5 py-1.5 rounded-lg transition-colors"
              style={{ background: accentColor + "12", color: accentColor }}>
              <MessageSquare className="w-3 h-3" /> Ask
            </button>
          </div>
        </div>

        {/* Sanskrit */}
        <p className="font-serif text-lg md:text-xl text-foreground leading-[2] whitespace-pre-line text-center mb-4">{sanskrit}</p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${accentColor}40)` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor + "50" }} />
          <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${accentColor}40)` }} />
        </div>

        {/* Transliteration */}
        {transliteration && (
          <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line text-center mb-4">{transliteration}</p>
        )}

        {/* Meaning */}
        <p className="text-[15px] font-sans text-foreground/85 leading-7 text-justify hyphens-auto">{meaning}</p>

        {/* Word meanings */}
        {wordMeanings && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <button onClick={() => setShowWords(v => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 hover:text-foreground transition-colors">
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showWords ? "rotate-180" : ""}`} />
              {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
            </button>
            <AnimatePresence>
              {showWords && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-2">{wordMeanings}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// ─── Chapter List Item ────────────────────────────────────────────────────────
function ChapterItem({ number, title, subtitle, verseCount, isActive, isLocked, accent, onSelect }: {
  number: number; title: string; subtitle?: string | null; verseCount: number;
  isActive: boolean; isLocked: boolean; accent: string; onSelect: () => void;
}) {
  return (
    <button onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 ${
        isActive ? "border-current shadow-sm" : isLocked ? "border-border opacity-50" : "border-border hover:border-current/30 hover:bg-muted/50"
      }`}
      style={isActive ? { borderColor: accent + "55", background: accent + "08", color: accent } : { color: accent }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-lg font-serif font-bold shrink-0" style={{ color: isActive ? accent : "hsl(var(--muted-foreground))" }}>
            {number}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-sans font-medium truncate ${isActive ? "" : "text-foreground"}`}>{title}</p>
            {subtitle && <p className="text-[10px] font-sans text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-sans text-muted-foreground">{verseCount}v</span>
          {isLocked && <Lock className="w-3 h-3 text-muted-foreground/50" />}
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Scriptures() {
  const { t } = useTranslations();
  const { canAccessAllScriptures, scripturePageLimit, refreshSubscription } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [divyaOpen, setDivyaOpen] = useState(false);
  const [divyaData, setDivyaData] = useState<{ title: string; sanskrit: string; meaning: string; deity: string } | null>(null);

  const handleShare = (data: { title: string; sanskrit: string; meaning: string; deity: string }) => { setDivyaData(data); setDivyaOpen(true); };

  // ── useScripture hook for all data ──────────────────────────────────────────
  const {
    scriptures,
    chapters,
    verses,
    loadingVerses,
    searchResults,
    isSearching,
    currentScriptureId,
    currentChapterId,
    selectScripture,
    selectChapter,
    searchVerses,
  } = useScripture();

  // ── Bookmark hook — keyed by current scripture ──────────────────────────────
  const bookmarkKey = BOOKMARK_KEY_MAP[currentScriptureId] ?? "gita";
  const bookmarks = useScriptureBookmarks(bookmarkKey);

  const [view, setView] = useState<View>("library");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [askData, setAskData] = useState<{ title: string; sanskrit: string; meaning: string } | null>(null);

  // ── Derived data ────────────────────────────────────────────────────────────
  const currentScripture = useMemo(
    () => scriptures.find(s => s.id === currentScriptureId),
    [scriptures, currentScriptureId]
  );

  const currentChapter = useMemo(
    () => chapters.find(c => c.id === currentChapterId),
    [chapters, currentChapterId]
  );

  const currentChapterIndex = useMemo(
    () => chapters.findIndex(c => c.id === currentChapterId),
    [chapters, currentChapterId]
  );

  const accent = currentScripture?.accent_color ?? "hsl(28,90%,55%)";

  // ── Search debounce ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { searchVerses(""); return; }
    const timer = setTimeout(() => searchVerses(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchVerses]);

  // ── Display verses: search results, bookmarks, or current chapter ──────────
  const displayVerses = useMemo(() => {
    if (searchQuery) return searchResults;
    if (showBookmarks) return verses.filter(v => bookmarks.isBookmarked(v.id));
    return verses;
  }, [searchQuery, searchResults, showBookmarks, verses, bookmarks]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const openScripture = (id: string) => {
    const s = scriptures.find(sc => sc.id === id);
    if (s && !s.is_free && !canAccessAllScriptures) { setUpgradeOpen(true); return; }
    trackScriptureRead(id);
    selectScripture(id);
    setSearchQuery(""); setShowBookmarks(false); setView("reader"); scrollTop();
  };

  const goToChapter = (chapterId: string, chapterNumber: number) => {
    // For Gita: free users limited to scripturePageLimit chapters
    if (currentScriptureId === "gita" && chapterNumber > scripturePageLimit) {
      setUpgradeOpen(true); return;
    }
    selectChapter(chapterId);
    setSearchQuery(""); scrollTop();
  };

  const backToLibrary = () => { setView("library"); setSearchQuery(""); setShowBookmarks(false); scrollTop(); };

  const voiceContext = currentChapter
    ? `${currentScripture?.name ?? "Scripture"} — ${currentChapter.title}`
    : currentScripture?.name ?? "Scripture";

  // ── Featured verse (Gita 2.47 from first loaded data) ─────────────────────
  const featuredVerse = useMemo(() => {
    // Try to find 2.47 from the verses if gita is selected
    // For featured, we just show a static known verse
    return {
      label: "Bhagavad Gita 2.47",
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      meaning: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    };
  }, []);

  // ─── Library View ─────────────────────────────────────────────────────────
  if (view === "library") {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead title="Sacred Scriptures" description="Read the Bhagavad Gita, Upanishads, Yoga Sutras and more." canonicalPath="/scriptures" />
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 pt-24 pb-32">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-saffron mb-1">Sacred Library</p>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Scriptures</h1>
            <p className="text-sm font-sans text-muted-foreground mt-1">Timeless wisdom from the ancient texts</p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <input type="search" placeholder="Search scriptures..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all" />
          </div>

          {/* Scripture Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {scriptures.map((s, i) => (
              <ScriptureCard
                key={s.id}
                scripture={s}
                isActive={false}
                isLocked={!s.is_free && !canAccessAllScriptures}
                onSelect={() => openScripture(s.id)}
                eager={i < 4}
              />
            ))}
          </div>

          {/* Featured verse */}
          <div className="mb-8">
            <h2 className="text-lg font-serif font-bold text-foreground mb-4">Featured Verse</h2>
            <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.15em] text-saffron">{featuredVerse.label}</span>
              </div>
              <p className="font-serif text-lg text-foreground leading-[1.9] whitespace-pre-line text-center mb-3">
                {featuredVerse.sanskrit}
              </p>
              <p className="text-sm font-sans text-muted-foreground text-center leading-relaxed">
                {featuredVerse.meaning}
              </p>
              <div className="flex justify-center mt-4">
                <button onClick={() => { openScripture("gita"); }}
                  className="text-xs font-sans font-semibold px-4 py-2 rounded-xl bg-saffron/10 text-saffron hover:bg-saffron/20 transition-colors">
                  Read Bhagavad Gita
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Reader View ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={`${currentScripture?.name ?? "Scripture"} — Sacred Scriptures`} description={`Read ${currentScripture?.name ?? "scripture"} with Sanskrit, transliteration and English meaning.`} canonicalPath="/scriptures" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-20 pb-32">
        <div className="flex gap-6">

          {/* ── Left: Chapter sidebar (desktop) ───────────────────────────── */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-8" style={{ scrollbarWidth: "thin" }}>
            {/* Back to library */}
            <button onClick={backToLibrary}
              className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground mb-4 py-1 transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" /> All Scriptures
            </button>

            {/* Scripture selector pills */}
            <div className="flex flex-col gap-1 mb-4">
              {scriptures.map(s => (
                <button key={s.id} onClick={() => openScripture(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                    currentScriptureId === s.id ? "bg-card border border-border shadow-sm" : "hover:bg-muted"
                  }`}>
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <p className={`text-xs font-sans font-semibold ${currentScriptureId === s.id ? "text-foreground" : "text-muted-foreground"}`}>{s.name}</p>
                    <p className="text-[9px] font-sans text-muted-foreground/60">{s.name_sanskrit}</p>
                  </div>
                  {!s.is_free && !canAccessAllScriptures && <Lock className="w-3 h-3 text-muted-foreground/40 ml-auto" />}
                </button>
              ))}
            </div>

            <div className="h-px bg-border mb-4" />

            {/* Chapter list */}
            <p className="text-[9px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
              {chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
            </p>
            <div className="space-y-1">
              {chapters.map(ch => (
                <ChapterItem key={ch.id} number={ch.number} title={ch.title} subtitle={ch.subtitle}
                  verseCount={ch.total_verses} isActive={currentChapterId === ch.id}
                  isLocked={currentScriptureId === "gita" && ch.number > scripturePageLimit && !canAccessAllScriptures}
                  accent={accent} onSelect={() => goToChapter(ch.id, ch.number)} />
              ))}
            </div>
          </aside>

          {/* ── Right: Content area ───────────────────────────────────────── */}
          <main className="flex-1 min-w-0 pt-2">

            {/* Mobile: back button + scripture name */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <button onClick={backToLibrary} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-lg font-serif font-bold text-foreground">{currentScripture?.name}</h1>
                <p className="text-[10px] font-sans text-muted-foreground">{currentScripture?.name_sanskrit}</p>
              </div>
            </div>

            {/* Mobile: chapter pills (horizontal scroll) */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
              {chapters.map(ch => (
                <button key={ch.id} onClick={() => goToChapter(ch.id, ch.number)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition-all ${
                    currentChapterId === ch.id
                      ? "border-saffron/30 text-saffron" : (currentScriptureId === "gita" && ch.number > scripturePageLimit && !canAccessAllScriptures)
                      ? "border-border text-muted-foreground/40" : "border-border text-muted-foreground hover:border-saffron/20"
                  }`}
                  style={currentChapterId === ch.id ? { background: accent + "15", borderColor: accent + "40", color: accent } : undefined}>
                  {ch.number}
                </button>
              ))}
            </div>

            {/* Search + bookmark bar */}
            <div className="flex items-center gap-2 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.scriptures.searchPlaceholder}
                  className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-saffron/20 transition-all" />
              </div>
              <button onClick={() => setShowBookmarks(v => !v)} aria-pressed={showBookmarks}
                className={`p-2.5 rounded-xl border transition-all ${showBookmarks ? "bg-saffron/10 border-saffron/30 text-saffron" : "border-border text-muted-foreground hover:text-saffron"}`}>
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Chapter / section header */}
            {!searchQuery && !showBookmarks && currentChapter && (
              <motion.div key={`${currentScriptureId}-${currentChapterId}`}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 rounded-full" style={{ background: accent }} />
                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.15em]" style={{ color: accent }}>
                      Chapter {currentChapter.number} {t.common.of} {chapters.length}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-1">
                    {currentChapter.title}
                  </h2>
                  {currentChapter.subtitle && (
                    <p className="text-sm font-sans italic text-muted-foreground mb-3">{currentChapter.subtitle}</p>
                  )}
                  {currentChapter.summary && (
                    <p className="text-sm font-sans text-muted-foreground/80 leading-relaxed">{currentChapter.summary}</p>
                  )}

                  {/* Prev/Next nav */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <button disabled={currentChapterIndex <= 0}
                      onClick={() => { const prev = chapters[currentChapterIndex - 1]; if (prev) goToChapter(prev.id, prev.number); }}
                      className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button disabled={currentChapterIndex >= chapters.length - 1}
                      onClick={() => { const next = chapters[currentChapterIndex + 1]; if (next) goToChapter(next.id, next.number); }}
                      className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Search/bookmark status */}
            {(searchQuery || showBookmarks) && (
              <p className="text-sm font-sans text-muted-foreground mb-4">
                {searchQuery
                  ? (isSearching ? t.scriptures.searching : `${displayVerses.length} results for "${searchQuery}"`)
                  : `${displayVerses.length} bookmarks`}
              </p>
            )}

            {/* Loading indicator */}
            {loadingVerses && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-saffron animate-spin" />
              </div>
            )}

            {/* Verse list */}
            {!loadingVerses && (
              <div className="space-y-4">
                {displayVerses.length > 0 ? displayVerses.map(v => (
                  <VerseCard key={v.id} id={v.id}
                    label={`Verse ${v.verse_number}`}
                    sublabel={currentChapter?.title}
                    sanskrit={v.sanskrit}
                    transliteration={v.transliteration}
                    meaning={v.meaning}
                    wordMeanings={v.word_meanings}
                    accentColor={accent}
                    isBookmarked={bookmarks.isBookmarked(v.id)}
                    onBookmark={() => { const a = bookmarks.toggleBookmark(v.id); toast.success(a ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved); }}
                    onShare={() => handleShare({ title: `${currentScripture?.name ?? "Scripture"} ${v.id}`, sanskrit: v.sanskrit, meaning: v.meaning, deity: "Krishna" })}
                    onAsk={() => setAskData({ title: `${currentScripture?.name ?? "Scripture"} — Verse ${v.verse_number}`, sanskrit: v.sanskrit, meaning: v.meaning })}
                  />
                )) : (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">{showBookmarks ? "🔖" : "📖"}</div>
                    <p className="text-muted-foreground text-sm">
                      {showBookmarks ? t.scriptures.noBookmarks : searchQuery ? t.scriptures.noResults : "No verses in this chapter yet."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom nav */}
            {!searchQuery && !showBookmarks && chapters.length > 1 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <button disabled={currentChapterIndex <= 0}
                  onClick={() => { const prev = chapters[currentChapterIndex - 1]; if (prev) goToChapter(prev.id, prev.number); }}
                  className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-xl border border-border text-muted-foreground disabled:opacity-30 hover:border-saffron/20 transition-all">
                  <ChevronLeft className="w-3.5 h-3.5" /> {t.common.previous}
                </button>
                <button disabled={currentChapterIndex >= chapters.length - 1}
                  onClick={() => { const next = chapters[currentChapterIndex + 1]; if (next) goToChapter(next.id, next.number); }}
                  className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-xl border border-border text-muted-foreground disabled:opacity-30 hover:border-saffron/20 transition-all">
                  {t.common.next} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} trigger="scriptures" refreshSubscription={refreshSubscription} />
      {divyaData && <DivyaSandeshModal open={divyaOpen} onClose={() => { setDivyaOpen(false); setDivyaData(null); }}
        type="shloka" title={divyaData.title} sanskrit={divyaData.sanskrit} translation={divyaData.meaning} deity={divyaData.deity} />}

      <OmVoiceButton scriptureName={currentScripture?.name ?? "Scripture"} currentContext={voiceContext} />
      <AnimatePresence>
        {askData && <AskPanel title={askData.title} sanskrit={askData.sanskrit} meaning={askData.meaning} onClose={() => setAskData(null)} />}
      </AnimatePresence>
    </div>
  );
}
