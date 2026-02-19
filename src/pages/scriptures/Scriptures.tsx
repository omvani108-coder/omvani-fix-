import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, BookmarkCheck, Share2,
  ChevronLeft, ChevronRight, MessageSquare,
  X, Send, Loader2, Menu, BookOpen, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import {
  chapters, searchShlokas, getBookmarks,
  toggleBookmark, isBookmarked,
  type Chapter, type Shloka,
} from "./gitaData";
import {
  upanishads, searchUpanishadVerses, getUpanishadBookmarks,
  toggleUpanishadBookmark, isUpanishadBookmarked,
  type Upanishad, type Verse,
} from "./upanishadData";

// ─── Types ────────────────────────────────────────────────────────────────────
type Scripture = "gita" | "upanishad";

// ─── AI Ask Panel ─────────────────────────────────────────────────────────────
function AskPanel({
  title, sanskrit, meaning, onClose,
}: {
  title: string; sanskrit: string; meaning: string; onClose: () => void;
}) {
  const { t } = useTranslations();
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const ask = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setAnswer("");
    abortRef.current = new AbortController();
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const prompt = `The user is reading ${title}:\n\nSanskrit: ${sanskrit}\nMeaning: ${meaning}\n\nTheir question: ${input}\n\nAnswer their question in the context of this verse. Be concise, warm, and cite related teachings if relevant. Maximum 3 paragraphs.`;
      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST", signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          system: "You are OmVani, a compassionate AI spiritual guide rooted in Hindu scripture. Answer questions about sacred verses with wisdom, warmth and precision.",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setAnswer(accumulated);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError")
        toast.error("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-sm font-serif font-bold text-foreground">Ask the Guru</p>
          <p className="text-xs text-muted-foreground font-sans">{title}</p>
        </div>
        <button onClick={onClose} aria-label="Close panel"
          className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
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
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }}
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

// ─── Book Page — Gita Shloka ──────────────────────────────────────────────────
function GitaPage({ shloka, onAsk }: { shloka: Shloka; onAsk: (s: Shloka) => void }) {
  const { t } = useTranslations();
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(shloka.id));
  const [showWords, setShowWords] = useState(false);

  const handleBookmark = () => {
    const added = toggleBookmark(shloka.id);
    setBookmarked(added);
    toast.success(added ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved);
  };

  const handleShare = async () => {
    const text = `Bhagavad Gita ${shloka.id}\n\n${shloka.sanskrit}\n\n${shloka.meaning}\n\n— OmVani`;
    if (navigator.share) await navigator.share({ title: `Bhagavad Gita ${shloka.id}`, text });
    else { await navigator.clipboard.writeText(text); toast.success(t.scriptures.copied); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Parchment page card */}
      <div className="relative bg-[hsl(36,33%,97%)] dark:bg-[hsl(20,15%,10%)] border border-[hsl(32,25%,80%)] dark:border-[hsl(32,15%,20%)] rounded-sm shadow-[0_2px_16px_-4px_rgba(120,80,20,0.12),0_1px_4px_-1px_rgba(120,80,20,0.08)] overflow-hidden">
        
        {/* Top decorative rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />
        
        {/* Verse header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-3">
          <div className="flex items-center gap-3">
            {/* Ornamental verse number */}
            <div className="flex flex-col items-center">
              <div className="w-px h-3 bg-saffron/40" />
              <span className="text-[10px] font-sans font-bold text-saffron tracking-[0.2em] uppercase my-1">
                {shloka.id}
              </span>
              <div className="w-px h-3 bg-saffron/40" />
            </div>
          </div>
          {/* Actions — always visible on mobile, hover on desktop */}
          <div className="flex items-center gap-1">
            <button onClick={handleBookmark} aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              className="w-8 h-8 rounded-lg hover:bg-saffron/10 flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-saffron" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button onClick={handleShare} aria-label="Share"
              className="w-8 h-8 rounded-lg hover:bg-saffron/10 flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => onAsk(shloka)}
              className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-saffron/10 hover:bg-saffron/20 text-saffron transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              Ask Guru
            </button>
          </div>
        </div>

        {/* Sanskrit — centred, large, elegant */}
        <div className="px-8 pb-6 text-center">
          <p className="font-serif text-xl md:text-2xl text-foreground leading-[2] whitespace-pre-line tracking-wide">
            {shloka.sanskrit}
          </p>

          {/* Central ornament */}
          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-saffron/40" />
            <span className="text-saffron/60 text-sm">❧</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-saffron/40" />
          </div>

          {/* Transliteration */}
          <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line mb-5">
            {shloka.transliteration}
          </p>

          {/* Meaning — justified like a book */}
          <p className="text-base font-sans text-foreground/85 leading-8 max-w-2xl mx-auto text-justify hyphens-auto">
            {shloka.meaning}
          </p>

          {/* Word meanings */}
          {shloka.word_meanings && (
            <div className="mt-6">
              <button onClick={() => setShowWords(v => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 hover:text-saffron transition-colors">
                <ChevronDown className={`w-3 h-3 transition-transform ${showWords ? "rotate-180" : ""}`} />
                {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
              </button>
              <AnimatePresence>
                {showWords && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 pt-4 border-t border-border/50 text-left">
                      {shloka.word_meanings}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom decorative rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />
        
        {/* Page-footer style bottom strip */}
        <div className="flex items-center justify-center py-2 px-8">
          <span className="text-[9px] font-sans text-muted-foreground/30 tracking-[0.3em] uppercase">
            Bhagavad Gita · {shloka.id}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Book Page — Upanishad Verse ──────────────────────────────────────────────
function UpanishadPage({ verse, onAsk }: { verse: Verse; onAsk: (v: Verse) => void }) {
  const { t } = useTranslations();
  const [bookmarked, setBookmarked] = useState(() => isUpanishadBookmarked(verse.id));
  const [showWords, setShowWords] = useState(false);

  const handleBookmark = () => {
    const added = toggleUpanishadBookmark(verse.id);
    setBookmarked(added);
    toast.success(added ? t.scriptures.bookmarked : t.scriptures.bookmarkRemoved);
  };

  const handleShare = async () => {
    const text = `${verse.upanishad} Upanishad · ${verse.section}\n\n${verse.sanskrit}\n\n${verse.meaning}\n\n— OmVani`;
    if (navigator.share) await navigator.share({ title: `${verse.upanishad} Upanishad`, text });
    else { await navigator.clipboard.writeText(text); toast.success(t.scriptures.copied); }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative bg-[hsl(36,33%,97%)] dark:bg-[hsl(20,15%,10%)] border border-[hsl(32,25%,80%)] dark:border-[hsl(32,15%,20%)] rounded-sm shadow-[0_2px_16px_-4px_rgba(120,80,20,0.12),0_1px_4px_-1px_rgba(120,80,20,0.08)] overflow-hidden">
        
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="flex items-center justify-between px-8 pt-6 pb-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-sans font-bold text-gold tracking-[0.2em] uppercase">
              {verse.upanishad} Upanishad
            </span>
            <span className="text-[9px] font-sans text-muted-foreground/60 mt-0.5">{verse.section}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleBookmark} aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              className="w-8 h-8 rounded-lg hover:bg-gold/10 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-gold" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button onClick={handleShare} aria-label="Share"
              className="w-8 h-8 rounded-lg hover:bg-gold/10 flex items-center justify-center text-muted-foreground hover:text-gold transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => onAsk(verse)}
              className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              Ask Guru
            </button>
          </div>
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="font-serif text-xl md:text-2xl text-foreground leading-[2] whitespace-pre-line tracking-wide">
            {verse.sanskrit}
          </p>

          <div className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/40" />
            <span className="text-gold/60 text-sm">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <p className="text-sm font-sans italic text-muted-foreground leading-relaxed whitespace-pre-line mb-5">
            {verse.transliteration}
          </p>

          <p className="text-base font-sans text-foreground/85 leading-8 max-w-2xl mx-auto text-justify hyphens-auto">
            {verse.meaning}
          </p>

          {verse.word_meanings && (
            <div className="mt-6">
              <button onClick={() => setShowWords(v => !v)}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground/60 hover:text-gold transition-colors">
                <ChevronDown className={`w-3 h-3 transition-transform ${showWords ? "rotate-180" : ""}`} />
                {showWords ? t.scriptures.hide : t.scriptures.show} {t.scriptures.wordMeanings}
              </button>
              <AnimatePresence>
                {showWords && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <p className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 pt-4 border-t border-border/50 text-left">
                      {verse.word_meanings}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="flex items-center justify-center py-2 px-8">
          <span className="text-[9px] font-sans text-muted-foreground/30 tracking-[0.3em] uppercase">
            {verse.upanishad} Upanishad · {verse.section}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Scripture Switcher ───────────────────────────────────────────────────────
function ScriptureSwitcher({ active, onChange }: { active: Scripture; onChange: (s: Scripture) => void }) {
  return (
    <div className="inline-flex items-center bg-secondary border border-border rounded-xl p-1 gap-1">
      {([
        { id: "gita" as const,      label: "Bhagavad Gita",  sanskrit: "भगवद्गीता" },
        { id: "upanishad" as const, label: "Upanishads",     sanskrit: "उपनिषद्"   },
      ]).map(({ id, label, sanskrit }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative px-4 py-2 rounded-lg text-xs font-sans font-semibold transition-all duration-200 ${
            active === id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {active === id && (
            <motion.div layoutId="scripture-pill"
              className="absolute inset-0 rounded-lg bg-card shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex flex-col items-center gap-0.5">
            <span>{label}</span>
            <span className="text-[9px] font-sans text-muted-foreground/60 font-normal">{sanskrit}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Gita Sidebar ─────────────────────────────────────────────────────────────
function GitaSidebar({ current, onSelect, onClose }: { current: number; onSelect: (n: number) => void; onClose?: () => void }) {
  return (
    <nav aria-label="Gita chapters">
      <p className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
        18 Chapters
      </p>
      <div className="space-y-0.5">
        {chapters.map(ch => (
          <button key={ch.number} onClick={() => { onSelect(ch.number); onClose?.(); }}
            aria-current={current === ch.number ? "page" : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 ${
              current === ch.number ? "bg-saffron/10 text-saffron" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
            <span className="text-xs font-sans font-semibold block">Ch. {ch.number}</span>
            <span className="text-[10px] font-sans truncate block opacity-70">{ch.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Upanishad Sidebar ────────────────────────────────────────────────────────
function UpanishadSidebar({ currentId, onSelect, onClose }: { currentId: string; onSelect: (id: string) => void; onClose?: () => void }) {
  return (
    <nav aria-label="Upanishads">
      <p className="text-[10px] font-sans font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
        Upanishads
      </p>
      <div className="space-y-0.5">
        {upanishads.map(u => (
          <button key={u.id} onClick={() => { onSelect(u.id); onClose?.(); }}
            aria-current={currentId === u.id ? "page" : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 ${
              currentId === u.id ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
            <span className="text-xs font-sans font-semibold block">{u.name}</span>
            <span className="text-[10px] font-sans block opacity-60">{u.sanskrit}</span>
            <span className="text-[9px] font-sans block opacity-50 mt-0.5">{u.tradition}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Scriptures() {
  const { t } = useTranslations();
  const [scripture, setScripture] = useState<Scripture>("gita");

  // Gita state
  const [currentChapter, setCurrentChapter] = useState(1);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  // Upanishad state
  const [currentUpanishad, setCurrentUpanishad] = useState("isha");

  // Shared state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<(Shloka | Verse)[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ask panel state
  const [askData, setAskData] = useState<{ title: string; sanskrit: string; meaning: string } | null>(null);

  const chapter = chapters.find(c => c.number === currentChapter)!;
  const upanishad = upanishads.find(u => u.id === currentUpanishad)!;

  useEffect(() => { setBookmarkIds(getBookmarks()); }, [askData]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    const timer = setTimeout(() => {
      if (scripture === "gita") setSearchResults(searchShlokas(searchQuery));
      else setSearchResults(searchUpanishadVerses(searchQuery));
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, scripture]);

  const goToChapter = (n: number) => {
    setCurrentChapter(n); setSearchQuery(""); setShowBookmarks(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToUpanishad = (id: string) => {
    setCurrentUpanishad(id); setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const switchScripture = (s: Scripture) => {
    setScripture(s); setSearchQuery(""); setShowBookmarks(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // What to show
  const gitaShlokas: Shloka[] = searchQuery
    ? (searchResults as Shloka[])
    : showBookmarks
    ? chapter.shlokas.filter(s => bookmarkIds.includes(s.id))
    : chapter.shlokas;

  const upanishadVerses: Verse[] = searchQuery
    ? (searchResults as Verse[])
    : upanishad.chapters.flatMap(c => c.verses);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Sacred Scriptures"
        description="Read the Bhagavad Gita and Upanishads with Sanskrit, transliteration and meaning. Ask the AI guru any question."
        canonicalPath="/scriptures"
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="flex gap-8">

          {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
          <aside className="hidden lg:block w-52 shrink-0 pt-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
            {/* Scripture switcher in sidebar */}
            <div className="mb-6 space-y-1">
              {([
                { id: "gita" as const,      label: "Bhagavad Gita",  sanskrit: "भगवद्गीता", color: "saffron" },
                { id: "upanishad" as const, label: "Upanishads",     sanskrit: "उपनिषद्",   color: "gold"    },
              ]).map(({ id, label, sanskrit, color }) => (
                <button key={id} onClick={() => switchScripture(id)}
                  className={`w-full text-left px-3 py-3 rounded-xl border-2 transition-all duration-200 ${
                    scripture === id
                      ? color === "saffron" ? "border-saffron/40 bg-saffron/8 text-saffron" : "border-gold/40 bg-gold/8 text-gold"
                      : "border-transparent text-muted-foreground hover:bg-muted"
                  }`}>
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

            <div className="border-t border-border pt-5">
              {scripture === "gita"
                ? <GitaSidebar current={currentChapter} onSelect={goToChapter} />
                : <UpanishadSidebar currentId={currentUpanishad} onSelect={goToUpanishad} />
              }
            </div>
          </aside>

          {/* ── Mobile Sidebar ────────────────────────────────────────────── */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
                <motion.div
                  initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 p-5 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-serif font-bold text-foreground">Scriptures</p>
                    <button onClick={() => setSidebarOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                  {/* Mobile scripture switch */}
                  <div className="mb-4 space-y-1">
                    {([
                      { id: "gita" as const, label: "Bhagavad Gita" },
                      { id: "upanishad" as const, label: "Upanishads" },
                    ]).map(({ id, label }) => (
                      <button key={id} onClick={() => { switchScripture(id); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans font-semibold transition-all ${
                          scripture === id ? "bg-saffron/10 text-saffron" : "text-muted-foreground hover:bg-muted"
                        }`}>{label}</button>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4">
                    {scripture === "gita"
                      ? <GitaSidebar current={currentChapter} onSelect={goToChapter} onClose={() => setSidebarOpen(false)} />
                      : <UpanishadSidebar currentId={currentUpanishad} onSelect={goToUpanishad} onClose={() => setSidebarOpen(false)} />
                    }
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Main Content ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 pt-8 pb-32">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Mobile scripture switcher */}
              <div className="lg:hidden">
                <ScriptureSwitcher active={scripture} onChange={switchScripture} />
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t.scriptures.searchPlaceholder}
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all" />
              </div>

              {/* Bookmark toggle — Gita only */}
              {scripture === "gita" && (
                <button onClick={() => setShowBookmarks(v => !v)} aria-pressed={showBookmarks}
                  className={`p-2.5 rounded-xl border transition-all ${
                    showBookmarks ? "bg-saffron/10 border-saffron/30 text-saffron" : "border-border text-muted-foreground hover:border-saffron/20 hover:text-saffron"
                  }`}>
                  <Bookmark className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── GITA VIEW ─────────────────────────────────────────────── */}
            {scripture === "gita" && (
              <>
                {/* Chapter header */}
                {!searchQuery && !showBookmarks && (
                  <motion.div key={currentChapter} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }} className="mb-10">

                    {/* Book title treatment */}
                    <div className="relative text-center mb-8 py-8 px-6">
                      {/* Decorative corner marks */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-saffron/30 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-saffron/30 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-saffron/30 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-saffron/30 rounded-br" />

                      <p className="text-[10px] font-sans text-saffron/70 tracking-[0.4em] uppercase mb-2">
                        Bhagavad Gita · Chapter {chapter.number}
                      </p>
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">
                        {chapter.title}
                      </h1>
                      <p className="text-saffron font-sans text-sm italic mb-4">{chapter.subtitle}</p>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-saffron/20" />
                        <span className="text-saffron/40 text-xs">❦</span>
                        <div className="h-px w-12 bg-saffron/20" />
                      </div>
                      <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xl mx-auto text-center">
                        {chapter.summary}
                      </p>
                      <p className="text-xs text-muted-foreground/40 font-sans mt-3">{chapter.total_verses} verses</p>
                    </div>

                    {/* Chapter navigation */}
                    <div className="flex items-center justify-between">
                      <button onClick={() => goToChapter(Math.max(1, currentChapter - 1))} disabled={currentChapter === 1}
                        className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                        <ChevronLeft className="w-3.5 h-3.5" /> Previous Chapter
                      </button>
                      <span className="text-xs font-sans text-muted-foreground/50">{currentChapter} of 18</span>
                      <button onClick={() => goToChapter(Math.min(18, currentChapter + 1))} disabled={currentChapter === 18}
                        className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                        Next Chapter <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Search/bookmark label */}
                {(searchQuery || showBookmarks) && (
                  <p className="text-sm font-sans text-muted-foreground mb-6">
                    {searchQuery
                      ? isSearching ? t.scriptures.searching
                        : `${(searchResults as Shloka[]).length} result${(searchResults as Shloka[]).length !== 1 ? "s" : ""} for "${searchQuery}"`
                      : `${gitaShlokas.length} bookmarked shloka${gitaShlokas.length !== 1 ? "s" : ""}`
                    }
                  </p>
                )}

                {/* Verses — book-like continuous scroll */}
                <div className="space-y-6">
                  {gitaShlokas.length > 0 ? gitaShlokas.map(shloka => (
                    <GitaPage key={shloka.id} shloka={shloka}
                      onAsk={s => setAskData({ title: `Gita ${s.id}`, sanskrit: s.sanskrit, meaning: s.meaning })} />
                  )) : (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">{showBookmarks ? "🔖" : "📖"}</div>
                      <p className="text-muted-foreground font-sans text-sm">
                        {showBookmarks ? t.scriptures.noBookmarks : searchQuery ? t.scriptures.noResults : "No shlokas available for this chapter yet."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom chapter nav */}
                {!searchQuery && !showBookmarks && gitaShlokas.length > 0 && (
                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
                    <button onClick={() => goToChapter(Math.max(1, currentChapter - 1))} disabled={currentChapter === 1}
                      className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button onClick={() => goToChapter(Math.min(18, currentChapter + 1))} disabled={currentChapter === 18}
                      className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── UPANISHAD VIEW ────────────────────────────────────────── */}
            {scripture === "upanishad" && (
              <>
                {!searchQuery && (
                  <motion.div key={currentUpanishad} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }} className="mb-10">

                    {/* Upanishad title treatment */}
                    <div className="relative text-center mb-8 py-8 px-6">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gold/30 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gold/30 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gold/30 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gold/30 rounded-br" />

                      <p className="text-[10px] font-sans text-gold/70 tracking-[0.4em] uppercase mb-2">
                        {upanishad.tradition}
                      </p>
                      <p className="font-serif text-2xl text-muted-foreground/50 mb-1">{upanishad.sanskrit}</p>
                      <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                        {upanishad.name}
                      </h1>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-gold/20" />
                        <span className="text-gold/40 text-xs">✦</span>
                        <div className="h-px w-12 bg-gold/20" />
                      </div>
                      <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-xl mx-auto">
                        {upanishad.summary}
                      </p>
                    </div>

                    {/* Upanishad nav */}
                    <div className="flex items-center justify-between">
                      {(() => {
                        const idx = upanishads.findIndex(u => u.id === currentUpanishad);
                        const prev = upanishads[idx - 1];
                        const next = upanishads[idx + 1];
                        return (
                          <>
                            <button onClick={() => prev && goToUpanishad(prev.id)} disabled={!prev}
                              className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-gold/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                              <ChevronLeft className="w-3.5 h-3.5" /> Previous
                            </button>
                            <span className="text-xs font-sans text-muted-foreground/50">
                              {upanishads.findIndex(u => u.id === currentUpanishad) + 1} of {upanishads.length}
                            </span>
                            <button onClick={() => next && goToUpanishad(next.id)} disabled={!next}
                              className="flex items-center gap-1.5 text-xs font-sans px-4 py-2.5 rounded-lg border border-border hover:border-gold/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
                              Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}

                {searchQuery && (
                  <p className="text-sm font-sans text-muted-foreground mb-6">
                    {isSearching ? t.scriptures.searching
                      : `${upanishadVerses.length} result${upanishadVerses.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    }
                  </p>
                )}

                {/* Upanishad chapter sections */}
                {!searchQuery && upanishad.chapters.map(ch => (
                  <div key={ch.number} className="mb-12">
                    <div className="text-center mb-8 py-4">
                      <p className="text-[10px] font-sans text-gold/60 tracking-[0.3em] uppercase mb-1">
                        Section {ch.number}
                      </p>
                      <h2 className="text-xl font-serif font-bold text-foreground">{ch.title}</h2>
                      <p className="text-sm font-sans italic text-muted-foreground mt-1">{ch.subtitle}</p>
                      <p className="text-xs font-sans text-muted-foreground/60 mt-3 max-w-lg mx-auto leading-relaxed">{ch.summary}</p>
                    </div>
                    <div className="space-y-6">
                      {ch.verses.map(verse => (
                        <UpanishadPage key={verse.id} verse={verse}
                          onAsk={v => setAskData({ title: `${v.upanishad} · ${v.section}`, sanskrit: v.sanskrit, meaning: v.meaning })} />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Search results */}
                {searchQuery && (
                  <div className="space-y-6">
                    {upanishadVerses.length > 0 ? upanishadVerses.map(verse => (
                      <UpanishadPage key={verse.id} verse={verse}
                        onAsk={v => setAskData({ title: `${v.upanishad} · ${v.section}`, sanskrit: v.sanskrit, meaning: v.meaning })} />
                    )) : (
                      <div className="text-center py-16">
                        <div className="text-4xl mb-3">📖</div>
                        <p className="text-muted-foreground font-sans text-sm">{t.scriptures.noResults}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

          </main>
        </div>
      </div>

      {/* Ask Panel */}
      <AnimatePresence>
        {askData && (
          <AskPanel
            title={askData.title}
            sanskrit={askData.sanskrit}
            meaning={askData.meaning}
            onClose={() => setAskData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
