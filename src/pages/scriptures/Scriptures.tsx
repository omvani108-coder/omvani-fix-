import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, BookmarkCheck, Share2,
  ChevronLeft, ChevronRight, MessageSquare,
  X, Send, Loader2, BookOpen, Menu
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { fadeUp, defaultViewport } from "@/lib/animations";
import {
  chapters, searchShlokas, getBookmarks,
  toggleBookmark, isBookmarked,
  type Chapter, type Shloka,
} from "./gitaData";

// ─── AI Ask Panel ─────────────────────────────────────────────────────────────

function AskPanel({
  shloka,
  onClose,
}: {
  shloka: Shloka;
  onClose: () => void;
}) {
  const [input, setInput]       = useState("");
  const [answer, setAnswer]     = useState("");
  const [loading, setLoading]   = useState(false);
  const abortRef                = useRef<AbortController | null>(null);

  const ask = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setAnswer("");
    abortRef.current = new AbortController();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      const prompt = `The user is reading Bhagavad Gita ${shloka.id}:

Sanskrit: ${shloka.sanskrit}
Meaning: ${shloka.meaning}

Their question: ${input}

Answer their question specifically in the context of this shloka. Be concise, warm, and cite related verses if relevant. Maximum 3 paragraphs.`;

      const res = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: "POST",
        signal: abortRef.current.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          system: "You are OmVani, a compassionate AI spiritual guide rooted in Hindu scripture. Answer questions about Bhagavad Gita verses with wisdom, warmth and precision.",
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
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Could not reach the guru. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-sm font-serif font-bold text-foreground">Ask the Guru</p>
          <p className="text-xs text-muted-foreground font-sans">About Gita {shloka.id}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Shloka preview */}
      <div className="mx-5 my-4 p-4 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs font-sans text-saffron font-semibold mb-1">{shloka.id}</p>
        <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-3">
          {shloka.meaning}
        </p>
      </div>

      {/* Answer area */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {!answer && !loading && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3" aria-hidden="true">🙏</div>
            <p className="text-sm text-muted-foreground font-sans">
              Ask anything about this shloka — its meaning, application, or related teachings.
            </p>
          </div>
        )}

        {loading && answer === "" && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs" aria-hidden="true">ॐ</div>
            <div className="flex gap-1">
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay }}
                  className="w-1.5 h-1.5 rounded-full bg-saffron/60"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="sr-only">Guru is thinking…</span>
          </div>
        )}

        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm max-w-none"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-sacred-gradient flex items-center justify-center text-xs shrink-0" aria-hidden="true">ॐ</div>
              <span className="text-xs font-sans font-semibold text-saffron">OmVani</span>
            </div>
            {answer.split("\n").map((line, i) =>
              line.trim() === "" ? <div key={i} className="h-2" /> : (
                <p key={i} className="text-sm font-sans text-foreground/80 leading-relaxed">{line}</p>
              )
            )}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 border-t border-border pt-4">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-saffron/30 transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about this shloka…"
            aria-label="Your question about this shloka"
            className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <button
            onClick={ask}
            disabled={!input.trim() || loading}
            aria-label="Send question"
            className="w-7 h-7 rounded-lg bg-sacred-gradient flex items-center justify-center disabled:opacity-30 transition-opacity hover:opacity-90"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" aria-hidden="true" />
              : <Send className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            }
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shloka Card ──────────────────────────────────────────────────────────────

function ShlokaCard({
  shloka,
  onAsk,
}: {
  shloka: Shloka;
  onAsk: (s: Shloka) => void;
}) {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(shloka.id));
  const [showWords, setShowWords]   = useState(false);

  const handleBookmark = () => {
    const added = toggleBookmark(shloka.id);
    setBookmarked(added);
    toast.success(added ? "Shloka bookmarked 🔖" : "Bookmark removed");
  };

  const handleShare = async () => {
    const text = `Bhagavad Gita ${shloka.id}\n\n${shloka.sanskrit}\n\n${shloka.meaning}\n\n— OmVani`;
    if (navigator.share) {
      await navigator.share({ title: `Bhagavad Gita ${shloka.id}`, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Shloka copied to clipboard!");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-saffron/20 transition-all duration-300"
      aria-label={`Shloka ${shloka.id}`}
    >
      {/* Verse number */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-sans font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full">
          {shloka.id}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleBookmark}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this shloka"}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors"
          >
            {bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-saffron" aria-hidden="true" />
              : <Bookmark className="w-4 h-4" aria-hidden="true" />
            }
          </button>
          <button
            onClick={handleShare}
            aria-label="Share this shloka"
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => onAsk(shloka)}
            aria-label="Ask the guru about this shloka"
            className="flex items-center gap-1.5 text-xs font-sans px-3 py-1.5 rounded-lg bg-saffron/10 hover:bg-saffron/20 text-saffron transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
            Ask Guru
          </button>
        </div>
      </div>

      {/* Sanskrit */}
      <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed whitespace-pre-line mb-4 text-center">
        {shloka.sanskrit}
      </p>

      <div className="w-8 h-px bg-saffron/30 mx-auto mb-4" aria-hidden="true" />

      {/* Transliteration */}
      <p className="text-sm font-sans italic text-muted-foreground text-center mb-5 leading-relaxed whitespace-pre-line">
        {shloka.transliteration}
      </p>

      {/* Meaning */}
      <p className="text-base font-sans text-foreground/80 leading-relaxed text-center max-w-2xl mx-auto">
        {shloka.meaning}
      </p>

      {/* Word meanings toggle */}
      {shloka.word_meanings && (
        <div className="mt-5">
          <button
            onClick={() => setShowWords(v => !v)}
            className="text-xs font-sans text-muted-foreground hover:text-saffron transition-colors mx-auto flex items-center gap-1"
          >
            {showWords ? "Hide" : "Show"} word meanings
          </button>
          <AnimatePresence>
            {showWords && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs font-sans text-muted-foreground/70 leading-relaxed mt-3 border-t border-border pt-3"
              >
                {shloka.word_meanings}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.article>
  );
}

// ─── Chapter List Sidebar ─────────────────────────────────────────────────────

function ChapterList({
  current,
  onSelect,
  onClose,
}: {
  current: number;
  onSelect: (n: number) => void;
  onClose?: () => void;
}) {
  return (
    <nav aria-label="Chapters">
      <p className="text-xs font-sans font-bold text-muted-foreground uppercase tracking-widest mb-4 px-2">
        18 Chapters
      </p>
      <div className="space-y-0.5">
        {chapters.map(ch => (
          <button
            key={ch.number}
            onClick={() => { onSelect(ch.number); onClose?.(); }}
            aria-current={current === ch.number ? "page" : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group ${
              current === ch.number
                ? "bg-saffron/10 text-saffron"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="text-xs font-sans font-semibold block">
              Chapter {ch.number}
            </span>
            <span className="text-xs font-sans truncate block opacity-70">
              {ch.title}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Main Scriptures Page ─────────────────────────────────────────────────────

export default function Scriptures() {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState<Shloka[]>([]);
  const [isSearching, setIsSearching]       = useState(false);
  const [askShloka, setAskShloka]           = useState<Shloka | null>(null);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [bookmarkIds, setBookmarkIds]       = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks]   = useState(false);

  const chapter = chapters.find(c => c.number === currentChapter)!;

  useEffect(() => {
    setBookmarkIds(getBookmarks());
  }, [askShloka]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    const t = setTimeout(() => {
      setSearchResults(searchShlokas(searchQuery));
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const displayedShlokas = searchQuery
    ? searchResults
    : showBookmarks
    ? chapter.shlokas.filter(s => bookmarkIds.includes(s.id))
    : chapter.shlokas;

  const goToChapter = (n: number) => {
    setCurrentChapter(n);
    setSearchQuery("");
    setShowBookmarks(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Bhagavad Gita"
        description="Read the complete Bhagavad Gita with Sanskrit, transliteration, and meaning. Ask the AI guru any question about each shloka."
        canonicalPath="/scriptures"
      />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="flex gap-8">

          {/* ── Sidebar — desktop ─────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0 pt-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
            <ChapterList current={currentChapter} onSelect={goToChapter} />
          </aside>

          {/* ── Mobile sidebar overlay ────────────────────────────────────── */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 p-5 overflow-y-auto lg:hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <p className="font-serif font-bold text-foreground">Bhagavad Gita</p>
                    <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                      <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    </button>
                  </div>
                  <ChapterList current={currentChapter} onSelect={goToChapter} onClose={() => setSidebarOpen(false)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0 pt-8 pb-24">

            {/* Top bar */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open chapter list"
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              </button>

              {/* Search */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search shlokas by keyword or verse…"
                  aria-label="Search shlokas"
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-saffron/30 transition-all"
                />
              </div>

              {/* Bookmarks toggle */}
              <button
                onClick={() => setShowBookmarks(v => !v)}
                aria-pressed={showBookmarks}
                aria-label="Show bookmarks"
                className={`p-2.5 rounded-xl border transition-all ${
                  showBookmarks
                    ? "bg-saffron/10 border-saffron/30 text-saffron"
                    : "border-border text-muted-foreground hover:border-saffron/20 hover:text-saffron"
                }`}
              >
                <Bookmark className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Chapter header — only show when not searching */}
            {!searchQuery && !showBookmarks && (
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-sans font-bold text-saffron bg-saffron/10 px-3 py-1 rounded-full">
                    Chapter {chapter.number}
                  </span>
                  <span className="text-xs font-sans text-muted-foreground">
                    {chapter.total_verses} verses
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">
                  {chapter.title}
                </h1>
                <p className="text-saffron font-sans text-sm mb-4">{chapter.subtitle}</p>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed max-w-2xl">
                  {chapter.summary}
                </p>

                {/* Chapter navigation */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => goToChapter(Math.max(1, currentChapter - 1))}
                    disabled={currentChapter === 1}
                    aria-label="Previous chapter"
                    className="flex items-center gap-1.5 text-xs font-sans px-3 py-2 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    Previous
                  </button>
                  <button
                    onClick={() => goToChapter(Math.min(18, currentChapter + 1))}
                    disabled={currentChapter === 18}
                    aria-label="Next chapter"
                    className="flex items-center gap-1.5 text-xs font-sans px-3 py-2 rounded-lg border border-border hover:border-saffron/30 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Search / bookmark header */}
            {(searchQuery || showBookmarks) && (
              <div className="mb-6">
                <p className="text-sm font-sans text-muted-foreground">
                  {searchQuery
                    ? isSearching
                      ? "Searching…"
                      : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`
                    : `${displayedShlokas.length} bookmarked shloka${displayedShlokas.length !== 1 ? "s" : ""}`
                  }
                </p>
              </div>
            )}

            {/* Shlokas */}
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {displayedShlokas.length > 0 ? (
                  displayedShlokas.map(shloka => (
                    <ShlokaCard
                      key={shloka.id}
                      shloka={shloka}
                      onAsk={setAskShloka}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-4xl mb-3" aria-hidden="true">
                      {showBookmarks ? "🔖" : "📖"}
                    </div>
                    <p className="text-muted-foreground font-sans text-sm">
                      {showBookmarks
                        ? "No bookmarks yet. Bookmark shlokas while reading."
                        : searchQuery
                        ? "No shlokas found. Try different keywords."
                        : "No shlokas available for this chapter yet."
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </main>
        </div>
      </div>

      {/* AI Ask Panel */}
      <AnimatePresence>
        {askShloka && (
          <AskPanel shloka={askShloka} onClose={() => setAskShloka(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
