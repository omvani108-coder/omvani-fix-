import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, ExternalLink, ChevronDown, ChevronUp, Navigation, XCircle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { mandirs, type Mandir } from "@/data/mandirs";

const CATEGORIES = ["All", "Jyotirlinga", "Shakti Peeth", "Char Dham", "Divya Desam", "Ashtavinayak", "Famous Temple"] as const;
const STATES = ["All States", ...Array.from(new Set(mandirs.map((m) => m.state))).sort()];

const categoryColors: Record<string, string> = {
  Jyotirlinga: "bg-saffron/15 text-saffron border-saffron/30",
  "Shakti Peeth": "bg-lotus-pink/15 text-lotus-pink border-lotus-pink/30",
  "Char Dham": "bg-gold/15 text-gold border-gold/30",
  "Divya Desam": "bg-primary/15 text-primary border-primary/30",
  Ashtavinayak: "bg-maroon/10 text-maroon border-maroon/30",
  "Famous Temple": "bg-muted text-muted-foreground border-border",
};

// ── Skeleton card (shown while page hydrates) ─────────────────────────────────

function MandirsSkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary rounded w-3/4" />
          <div className="h-3 bg-secondary rounded w-1/2" />
          <div className="h-3 bg-secondary rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-secondary rounded w-full" />
        <div className="h-3 bg-secondary rounded w-5/6" />
        <div className="h-3 bg-secondary rounded w-4/6" />
      </div>
      <div className="h-10 bg-secondary rounded-lg mb-4" />
      <div className="h-8 bg-secondary rounded-lg" />
    </div>
  );
}

function MandirsSkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <MandirsSkeletonCard key={i} />
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

interface MandirsEmptyStateProps {
  search:   string;
  category: string;
  state:    string;
  onReset:  () => void;
}

function MandirsEmptyState({ search, category, state, onReset }: MandirsEmptyStateProps) {
  const hasFilter = search || category !== "All" || state !== "All States";
  return (
    <div className="text-center py-20 px-4">
      <div className="text-6xl mb-4 select-none">🛕</div>
      <h3 className="font-serif font-bold text-xl text-foreground mb-2">
        {hasFilter ? "No temples match your filters" : "No temples found"}
      </h3>
      <p className="text-muted-foreground font-sans text-sm max-w-sm mx-auto mb-6">
        {hasFilter
          ? "Try broadening your search — clear the filters or use a shorter keyword."
          : "We couldn't find any temples right now. Please try again."}
      </p>
      {hasFilter && (
        <Button
          variant="outline"
          onClick={onReset}
          className="gap-2 font-sans"
        >
          <XCircle className="w-4 h-4" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const Mandirs = () => {
  const { t } = useTranslations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [state, setState] = useState<string>("All States");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Simulate a tiny hydration delay so the skeleton has a chance to flash
  // (static data loads instantly, but this gives the UX the feel of a real load)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setState("All States");
  };

  const filtered = mandirs.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.deity.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q) ||
      m.state.toLowerCase().includes(q) ||
      m.famous_for.toLowerCase().includes(q);
    const matchCategory = category === "All" || m.category === category;
    const matchState = state === "All States" || m.state === state;
    return matchSearch && matchCategory && matchState;
  });

  const counts = {
    Jyotirlinga: mandirs.filter((m) => m.category === "Jyotirlinga").length,
    "Shakti Peeth": mandirs.filter((m) => m.category === "Shakti Peeth").length,
    "Char Dham": mandirs.filter((m) => m.category === "Char Dham").length,
    "Divya Desam": mandirs.filter((m) => m.category === "Divya Desam").length,
  };

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
            🛕 Sacred Shrines of India
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            {t.mandirs.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans max-w-xl mx-auto mb-6"
          >
            Explore {mandirs.length} sacred temples across India — timings, history, and directions.
          </motion.p>

          {/* Mandirs Nearby Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-6"
          >
            <a
              href={`https://www.google.com/maps/search/Hindu+Temple/@20.5937,78.9629,5z`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" className="gap-2 text-sm px-6">
                <Navigation className="w-4 h-4" />
                Find Mandirs Near Me
              </Button>
            </a>
            <p className="text-xs text-muted-foreground font-sans mt-2">Opens Google Maps with temples near your location</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {Object.entries(counts).map(([key, val]) => (
              <div key={key} className={`px-4 py-2 rounded-full border text-xs font-sans font-semibold ${categoryColors[key]}`}>
                {val} {key}s
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.mandirs.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 font-sans"
              />
            </div>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-md border border-border bg-background px-3 text-sm font-sans text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

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
          </div>
        </div>
      </div>

      {/* Temple List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {ready && (
          <p className="text-xs text-muted-foreground font-sans mb-6">
            Showing {filtered.length} of {mandirs.length} temples
          </p>
        )}

        {!ready ? (
          <MandirsSkeletonGrid />
        ) : filtered.length === 0 ? (
          <MandirsEmptyState
            search={search}
            category={category}
            state={state}
            onReset={resetFilters}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((mandir, i) => (
              <motion.div
                key={mandir.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card rounded-xl border border-border shadow-sacred hover:border-saffron/40 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sacred-gradient flex items-center justify-center text-2xl shrink-0">
                      {mandir.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-serif font-bold text-foreground text-lg leading-tight">{mandir.name}</h3>
                        <span className={`shrink-0 text-xs font-sans font-semibold px-2 py-0.5 rounded-full border ${categoryColors[mandir.category]}`}>
                          {mandir.category}
                        </span>
                      </div>
                      <p className="text-saffron font-sans text-sm font-medium truncate">{mandir.deity}</p>
                      <div className="flex items-center gap-1 text-muted-foreground font-sans text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        {mandir.city}, {mandir.state}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">
                    {mandir.description.length > 180 ? mandir.description.slice(0, 180) + "..." : mandir.description}
                  </p>

                  {/* Timings */}
                  <div className="flex items-start gap-2 bg-secondary/50 rounded-lg p-3 mb-4">
                    <Clock className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-sans font-semibold text-foreground mb-0.5">Timings</p>
                      <p className="text-xs font-sans text-muted-foreground">{mandir.timings}</p>
                    </div>
                  </div>

                  {/* Famous for */}
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-sans font-semibold text-foreground mb-0.5">Famous For</p>
                      <p className="text-xs font-sans text-muted-foreground">{mandir.famous_for}</p>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded === mandir.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-border space-y-3"
                    >
                      <div>
                        <p className="text-xs font-sans font-semibold text-foreground mb-1">📍 Address</p>
                        <p className="text-xs font-sans text-muted-foreground">{mandir.address}</p>
                      </div>
                      <div>
                        <p className="text-xs font-sans font-semibold text-foreground mb-1">🏛️ Established</p>
                        <p className="text-xs font-sans text-muted-foreground">{mandir.established}</p>
                      </div>
                      <div>
                        <p className="text-xs font-sans font-semibold text-foreground mb-1">🌤️ Best Time to Visit</p>
                        <p className="text-xs font-sans text-muted-foreground">{mandir.bestTime}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === mandir.id ? null : mandir.id)}
                    className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expanded === mandir.id ? (
                      <><ChevronUp className="w-3.5 h-3.5" /> Less info</>
                    ) : (
                      <><ChevronDown className="w-3.5 h-3.5" /> More info</>
                    )}
                  </button>
                  <div className="flex-1" />
                  <a
                    href={`https://www.google.com/maps/search/${mandir.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-sacred-gradient text-accent-foreground rounded-lg px-3 py-2 text-xs font-sans font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Get Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-1 font-serif text-xl font-bold text-gradient-sacred">
            <span>ॐ</span><span>Vani</span>
          </Link>
          <p className="text-xs text-muted-foreground/60 font-sans mt-2">
            © 2026 ॐVani · Temple data is for pilgrimage guidance. Verify timings before visiting.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Mandirs;
