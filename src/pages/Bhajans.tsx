import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Pause, ChevronDown, ChevronUp, BookOpen, Music, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { bhajans, type Bhajan } from "@/data/bhajans";

const CATEGORIES = ["All", "Bhajan", "Mantra", "Aarti", "Chalisa", "Stotra"] as const;
const LANGUAGES = ["All", "Hindi", "Sanskrit", "Both"] as const;
const DEITIES = ["All", "Shiva", "Vishnu", "Krishna", "Rama", "Ganesha", "Durga", "Lakshmi", "Saraswati", "Hanuman"];

const categoryColors: Record<string, string> = {
  Bhajan: "bg-saffron/10 text-saffron",
  Mantra: "bg-maroon/10 text-maroon",
  Aarti: "bg-gold/10 text-gold",
  Chalisa: "bg-lotus-pink/10 text-lotus-pink",
  Stotra: "bg-primary/10 text-primary",
};

const Bhajans = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [language, setLanguage] = useState<string>("All");
  const [deity, setDeity] = useState<string>("All");
  const [selectedBhajan, setSelectedBhajan] = useState<Bhajan | null>(null);
  const [expandedLyrics, setExpandedLyrics] = useState<string | null>(null);
  const [expandedMeaning, setExpandedMeaning] = useState<string | null>(null);

  const filtered = bhajans.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.deity.toLowerCase().includes(q) ||
      b.tags.some((t) => t.includes(q));
    const matchCategory = category === "All" || b.category === category;
    const matchLanguage = language === "All" || b.language === language;
    const matchDeity =
      deity === "All" || b.deity.toLowerCase().includes(deity.toLowerCase());
    return matchSearch && matchCategory && matchLanguage && matchDeity;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-secondary/60 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron font-sans text-sm tracking-[0.25em] uppercase mb-3"
          >
            🎵 Sacred Sounds
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Bhajans & Mantras
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans max-w-xl mx-auto"
          >
            Sacred hymns, powerful mantras, and aartis — with lyrics, meanings, and audio.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, deity, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-sans"
            />
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-sans font-medium border transition-all ${
                  category === c
                    ? "bg-saffron text-accent-foreground border-saffron"
                    : "border-border text-muted-foreground hover:border-saffron"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="w-px bg-border shrink-0" />
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-sans font-medium border transition-all ${
                  language === l
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Deity filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {DEITIES.map((d) => (
              <button
                key={d}
                onClick={() => setDeity(d)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-sans font-medium border transition-all ${
                  deity === d
                    ? "bg-gold text-accent-foreground border-gold"
                    : "border-border text-muted-foreground hover:border-gold"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Song Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-xs text-muted-foreground font-sans mb-6">
          {filtered.length} of {bhajans.length} hymns
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-muted-foreground font-sans">No results found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border shadow-sacred hover:border-saffron/50 transition-all duration-300 flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-foreground text-lg leading-tight">{b.title}</h3>
                      <p className="text-muted-foreground font-sans text-xs mt-0.5">{b.deity} · {b.artist}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-sans font-semibold px-2 py-0.5 rounded-full ${categoryColors[b.category]}`}>
                      {b.category}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="text-xs font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{b.language}</span>
                    <span className="text-xs font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded-full">⏱ {b.duration}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {b.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground/70 font-sans">#{tag}</span>
                    ))}
                  </div>

                  {/* Lyrics toggle */}
                  <div className="border-t border-border pt-3">
                    <button
                      onClick={() => setExpandedLyrics(expandedLyrics === b.id ? null : b.id)}
                      className="flex items-center gap-2 text-xs font-sans font-medium text-saffron hover:underline w-full"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Lyrics
                      {expandedLyrics === b.id ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                    </button>
                    <AnimatePresence>
                      {expandedLyrics === b.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <pre className="mt-2 text-xs font-sans text-foreground/80 whitespace-pre-wrap leading-relaxed bg-secondary/40 rounded-lg p-3">
                            {b.lyrics}
                          </pre>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Meaning toggle */}
                  <div className="border-t border-border pt-3 mt-3">
                    <button
                      onClick={() => setExpandedMeaning(expandedMeaning === b.id ? null : b.id)}
                      className="flex items-center gap-2 text-xs font-sans font-medium text-primary hover:underline w-full"
                    >
                      <Music className="w-3.5 h-3.5" />
                      Meaning & Significance
                      {expandedMeaning === b.id ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                    </button>
                    <AnimatePresence>
                      {expandedMeaning === b.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 text-xs font-sans text-muted-foreground leading-relaxed bg-secondary/40 rounded-lg p-3 whitespace-pre-line">
                            {b.meaning}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Play Button */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => setSelectedBhajan(b)}
                    className="w-full flex items-center justify-center gap-2 bg-sacred-gradient text-accent-foreground rounded-lg py-2.5 text-sm font-sans font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    <Play className="w-4 h-4" />
                    Play on YouTube
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Player Modal */}
      <AnimatePresence>
        {selectedBhajan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedBhajan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <h3 className="font-serif font-bold text-foreground">{selectedBhajan.title}</h3>
                  <p className="text-xs text-muted-foreground font-sans">{selectedBhajan.deity} · {selectedBhajan.artist}</p>
                </div>
                <button
                  onClick={() => setSelectedBhajan(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* YouTube Embed */}
              <div className="aspect-video bg-background">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedBhajan.youtubeId}?autoplay=1&rel=0`}
                  title={selectedBhajan.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className={`text-xs font-sans font-semibold px-2 py-0.5 rounded-full ${categoryColors[selectedBhajan.category]}`}>
                    {selectedBhajan.category}
                  </span>
                  <span className="text-xs font-sans text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {selectedBhajan.language}
                  </span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedBhajan.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-saffron hover:underline font-sans"
                >
                  Open in YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="font-serif text-xl font-bold text-gradient-sacred">OmVani</Link>
          <p className="text-xs text-muted-foreground/60 font-sans mt-2">
            © 2026 OmVani · Audio content powered by YouTube
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Bhajans;
