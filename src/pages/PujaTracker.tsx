import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, RotateCcw, Info, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SeoHead } from "@/components/SeoHead";
import { useTranslations } from "@/hooks/useTranslations";
import { fadeUp } from "@/lib/animations";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import { usePujaSync } from "@/hooks/usePujaSync";
import { trackPujaComplete } from "@/lib/analytics";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PujaItem {
  id: string;
  emoji: string;
  name: string;
  sanskrit: string;
  description: string;
}

// DayRecord and MonthRecord are re-exported from usePujaSync
import type { MonthRecord, DayRecord } from "@/hooks/usePujaSync";

// ── Puja items list ───────────────────────────────────────────────────────────

const PUJA_ITEM_BASE = [
  { id: "snan",       emoji: "🪔",  sanskrit: "प्रातः स्नान" },
  { id: "deepak",     emoji: "🕯️", sanskrit: "दीप प्रज्वलन" },
  { id: "incense",    emoji: "🌿",  sanskrit: "धूप अर्पण" },
  { id: "flowers",    emoji: "🌸",  sanskrit: "पुष्प अर्पण" },
  { id: "mantra",     emoji: "📿",  sanskrit: "मंत्र जाप" },
  { id: "aarti",      emoji: "🔔",  sanskrit: "आरती" },
  { id: "prasad",     emoji: "🍬",  sanskrit: "प्रसाद" },
  { id: "meditation", emoji: "🧘",  sanskrit: "ध्यान" },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

const toKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Motivational messages based on streak — uses translation keys
const streakMessage = (streak: number, t: Record<string, Record<string, string>>) => {
  if (streak === 0) return t.puja.streakStart;
  if (streak === 1) return t.puja.streakFirst;
  if (streak < 7)  return `${streak} ${t.puja.days} 🪔`;
  if (streak < 14) return t.puja.streakWeek;
  if (streak < 21) return `${streak} ${t.puja.days}! ${t.puja.streakShine}`;
  if (streak < 30) return `${t.puja.streakIncredible} ${streak} ${t.puja.days}`;
  return t.puja.streakMonth;
};

// ── Day cell in the calendar grid ─────────────────────────────────────────────

interface DayCellProps {
  day: number;
  dateKey: string;
  record: DayRecord | undefined;
  isToday: boolean;
  isFuture: boolean;
  isLocked: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function DayCell({ day, dateKey, record, isToday, isFuture, isLocked, isSelected, onClick }: DayCellProps) {
  const totalItems = PUJA_ITEM_BASE.length;
  const checked = Object.values(record ?? {}).filter(Boolean).length;
  const pct = checked / totalItems;
  const isComplete = pct === 1;

  return (
    <motion.button
      whileTap={{ scale: (isFuture || isLocked) ? 1 : 0.92 }}
      onClick={onClick}
      disabled={isFuture}
      aria-label={isLocked ? `${dateKey} — locked` : `${dateKey} — ${checked} of ${totalItems} completed`}
      aria-pressed={isSelected}
      className={`
        relative flex flex-col items-center justify-center rounded-xl
        aspect-square text-xs font-sans transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-saffron outline-none
        ${isFuture ? "opacity-30 cursor-default" : "cursor-pointer"}
        ${isLocked
          ? "opacity-40 bg-muted border border-border cursor-pointer"
          : isSelected
            ? "bg-sacred-gradient text-white shadow-sacred scale-105"
            : isComplete
              ? "bg-gold/15 border border-gold/40 text-foreground"
              : isToday
                ? "border-2 border-saffron/60 bg-saffron/5 text-foreground"
                : "bg-card border border-border hover:border-saffron/40 text-foreground"
        }
      `}
    >
      {/* Completion glow ring */}
      {isComplete && !isSelected && !isLocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-xl ring-2 ring-gold/50 pointer-events-none"
        />
      )}

      <span className={`font-semibold ${isSelected ? "text-white" : ""}`}>{day}</span>

      {/* Lock icon for locked days */}
      {isLocked && !isFuture && (
        <Lock className="w-3 h-3 text-muted-foreground/50 mt-0.5" />
      )}

      {/* Progress dots */}
      {!isFuture && !isLocked && (
        <div className="flex gap-0.5 mt-0.5">
          {pct === 0 ? (
            <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
          ) : isComplete ? (
            <Check className={`w-3 h-3 ${isSelected ? "text-white" : "text-gold"}`} />
          ) : (
            Array.from({ length: Math.min(checked, 4) }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80" : "bg-saffron/70"}`}
              />
            ))
          )}
        </div>
      )}
    </motion.button>
  );
}

// ── Single puja task row ───────────────────────────────────────────────────────

interface TaskRowProps {
  item: PujaItem;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}

function TaskRow({ item, checked, disabled, onToggle }: TaskRowProps) {
  const { t } = useTranslations();
  return (
    <motion.button
      layout
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onToggle}
      disabled={disabled}
      aria-label={`${item.name} — ${checked ? "completed" : "not completed"}`}
      aria-pressed={checked}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border text-left
        transition-all duration-250 focus-visible:ring-2 focus-visible:ring-saffron outline-none
        ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}
        ${checked
          ? "bg-gold/8 border-gold/30"
          : "bg-card border-border hover:border-saffron/30 hover:bg-saffron/3"
        }
      `}
    >
      {/* Checkbox */}
      <div
        className={`
          shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
          transition-all duration-300
          ${checked
            ? "bg-sacred-gradient shadow-sacred"
            : "bg-secondary border border-border"
          }
        `}
      >
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          ) : (
            <motion.span
              key="emoji"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-base"
            >
              {item.emoji}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-sm text-foreground">
          {item.name}
        </p>
        <p className="text-muted-foreground font-sans text-xs mt-0.5 leading-relaxed">
          {item.sanskrit} · {item.description}
        </p>
      </div>

      {/* Completion badge */}
      {checked && (
        <motion.span
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="shrink-0 text-[10px] font-sans font-semibold text-gold bg-gold/15 px-2 py-0.5 rounded-full"
        >
          {t.puja.done}
        </motion.span>
      )}
    </motion.button>
  );
}

// ── Compact horizontal ritual slider (used in embedded/Sadhana mode) ──────────

function CompactRitualSlider({
  items,
  record,
  onToggle,
}: {
  items: PujaItem[];
  record: DayRecord;
  onToggle: (itemId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-10 w-7 h-7 rounded-full bg-background/90 border border-border shadow flex items-center justify-center"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const done = !!record[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`
                relative flex-shrink-0 w-20 flex flex-col items-center gap-1.5 py-3 px-2
                rounded-2xl border transition-all duration-200
                ${done
                  ? "bg-saffron/10 border-saffron/30 shadow-sm"
                  : "bg-card border-border hover:border-saffron/20"
                }
              `}
            >
              <span className="text-2xl select-none">{item.emoji}</span>
              <span className={`text-[10px] font-sans font-medium leading-tight text-center line-clamp-2 ${
                done ? "text-saffron" : "text-muted-foreground"
              }`}>
                {item.name}
              </span>
              <div className={`
                absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
                transition-all duration-200
                ${done
                  ? "bg-saffron text-white scale-100"
                  : "bg-muted text-muted-foreground/40 scale-90"
                }
              `}>
                <Check className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-10 w-7 h-7 rounded-full bg-background/90 border border-border shadow flex items-center justify-center"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PujaTracker({ embedded = false }: { embedded?: boolean }) {
  const { t } = useTranslations();
  const { pujaHistoryDays, refreshSubscription } = useSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const { data, loading, toggleItem: syncToggle, resetDay: syncReset } = usePujaSync();
  // Memoize so `today` stays stable across re-renders within the same session.
  // Note: won't auto-update at midnight — user must refresh the page.
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showInfo, setShowInfo] = useState(false);

  // ✅ Bug 3 fix: wrapped in useMemo so it only rebuilds when language changes
  const PUJA_ITEMS = useMemo<PujaItem[]>(
    () =>
      PUJA_ITEM_BASE.map((item) => ({
        ...item,
        name: t.pujaItems[item.id as keyof typeof t.pujaItems].name,
        description: t.pujaItems[item.id as keyof typeof t.pujaItems].description,
      })),
    [t]
  );

  // Build calendar grid
  const { calendarDays, firstDow } = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDow = new Date(viewYear, viewMonth, 1).getDay();
    return {
      calendarDays: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      firstDow,
    };
  }, [viewYear, viewMonth]);

  // Selected day state
  const selectedKey = toKey(viewYear, viewMonth, selectedDay);
  const selectedRecord = data[selectedKey] ?? {};
  const isTodaySelected =
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    selectedDay === today.getDate();
  const isSelectedFuture = new Date(viewYear, viewMonth, selectedDay) > today;

  // Toggle a puja item
  const toggleItem = (itemId: string) => {
    if (isSelectedFuture) return;
    trackPujaComplete(itemId);
    syncToggle(selectedKey, itemId);
  };

  // Stats for this month
  const monthStats = useMemo(() => {
    let totalDays = 0, completeDays = 0, totalItems = 0, checkedItems = 0;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
    const limit = isCurrentMonth ? today.getDate() : daysInMonth;

    for (let d = 1; d <= limit; d++) {
      const key = toKey(viewYear, viewMonth, d);
      const rec = data[key] ?? {};
      const checked = Object.values(rec).filter(Boolean).length;
      totalDays++;
      totalItems += PUJA_ITEMS.length;
      checkedItems += checked;
      if (checked === PUJA_ITEMS.length) completeDays++;
    }

    return { totalDays, completeDays, totalItems, checkedItems };
  }, [data, viewYear, viewMonth, today, PUJA_ITEMS]);

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date(today);
    while (true) {
      const key = toKey(d.getFullYear(), d.getMonth(), d.getDate());
      const rec = data[key] ?? {};
      const checked = Object.values(rec).filter(Boolean).length;
      if (checked < PUJA_ITEMS.length) break;
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [data, today, PUJA_ITEMS]);

  // Nav months
  const goMonth = (dir: number) => {
    const d = new Date(viewYear, viewMonth + dir, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    setSelectedDay(1);
  };

  const canGoNext = new Date(viewYear, viewMonth + 1, 1) <= new Date(today.getFullYear(), today.getMonth() + 1, 1);

  // Reset selected day
  const resetDay = () => {
    if (isSelectedFuture) return;
    syncReset(selectedKey);
  };

  const selectedChecked = Object.values(selectedRecord).filter(Boolean).length;
  const selectedPct = selectedChecked / PUJA_ITEMS.length;

  return (
    <div className={`${embedded ? "" : "min-h-screen"} bg-background overflow-x-hidden`}>
      {!embedded && (
        <>
          <SeoHead
            title="Puja Tracker — ॐVani"
            description="Track your daily puja routine. Build a sacred habit and maintain your spiritual streak."
            canonicalPath="/puja-tracker"
          />
          <Navbar />
        </>
      )}

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <section className={`${embedded ? "pt-20" : "pt-24"} pb-8 px-4 bg-gradient-to-b from-secondary/50 to-background`}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron font-sans text-xs tracking-[0.28em] uppercase mb-3"
          >
            {t.puja.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3"
          >
            {t.puja.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground font-sans text-sm max-w-sm mx-auto"
          >
            {t.puja.subtitle}
          </motion.p>
        </div>
      </section>

      <div className={`max-w-2xl mx-auto px-4 ${embedded ? "pb-6" : "pb-[calc(8rem+env(safe-area-inset-bottom))]"} space-y-6`}>

        {/* ── Streak banner ──────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl bg-sacred-gradient p-5 shadow-sacred"
        >
          {/* Decorative Om */}
          <span
            aria-hidden="true"
            className="absolute right-5 top-1/2 -translate-y-1/2 text-7xl font-serif text-white/10 select-none pointer-events-none"
          >
            ॐ
          </span>

          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-white/70 font-sans text-xs tracking-widest uppercase mb-1">
                {t.puja.streakLabel}
              </p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-serif font-bold text-white leading-none">{streak}</span>
                <span className="text-white/80 font-sans text-sm mb-1">
                  {streak === 1 ? t.puja.day : t.puja.days}
                </span>
              </div>
              <p className="text-white/70 font-sans text-xs mt-2">{streakMessage(streak, t)}</p>
            </div>

            {/* Month summary pills */}
            <div className="flex flex-col gap-2 text-right">
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <p className="text-white font-sans font-bold text-lg leading-none">{monthStats.completeDays}</p>
                <p className="text-white/70 font-sans text-[10px] mt-0.5">{t.puja.fullDays}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2">
                <p className="text-white font-sans font-bold text-lg leading-none">
                  {monthStats.totalItems > 0
                    ? Math.round((monthStats.checkedItems / monthStats.totalItems) * 100)
                    : 0}%
                </p>
                <p className="text-white/70 font-sans text-[10px] mt-0.5">{t.puja.thisMonth}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Sync status notice ──────────────────────────────────────── */}
        {loading ? (
          <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 text-center font-sans">
            ☁️ Loading your puja history…
          </p>
        ) : (
          <p className="text-xs text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-lg px-3 py-2 text-center font-sans">
            ☁️ Your puja streak is saved to the cloud and syncs across all your devices.
          </p>
        )}

        {/* ── Calendar ───────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="bg-card rounded-2xl border border-border shadow-sacred overflow-hidden"
        >
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <button
              onClick={() => goMonth(-1)}
              aria-label="Previous month"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-saffron/10 flex items-center justify-center text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <h2 className="font-serif font-bold text-lg text-foreground">
              {t.puja.monthNames[viewMonth]} {viewYear}
            </h2>

            <button
              onClick={() => goMonth(1)}
              disabled={!canGoNext}
              aria-label="Next month"
              className="w-8 h-8 rounded-full bg-secondary hover:bg-saffron/10 flex items-center justify-center text-foreground transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 mb-2">
              {t.puja.dayLabels.map((d: string) => (
                <p
                  key={d}
                  className="text-center text-[10px] font-sans font-semibold text-muted-foreground tracking-wide py-1"
                >
                  {d}
                </p>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDow }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {calendarDays.map((day) => {
                const key = toKey(viewYear, viewMonth, day);
                const isToday =
                  viewYear === today.getFullYear() &&
                  viewMonth === today.getMonth() &&
                  day === today.getDate();
                const isFuture = new Date(viewYear, viewMonth, day) > today;
                const dayDate = new Date(viewYear, viewMonth, day);
                const diffDays = Math.floor((today.getTime() - dayDate.getTime()) / 86_400_000);
                const isLocked = !isFuture && diffDays > pujaHistoryDays;

                return (
                  <DayCell
                    key={day}
                    day={day}
                    dateKey={key}
                    record={data[key]}
                    isToday={isToday}
                    isFuture={isFuture}
                    isLocked={isLocked}
                    isSelected={selectedDay === day && !isLocked}
                    onClick={() => isLocked ? setUpgradeOpen(true) : setSelectedDay(day)}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-border">
              {[
                { color: "bg-card border border-border", label: t.puja.notStarted },
                { color: "bg-saffron/20", label: t.puja.partial },
                { color: "bg-gold/20 border border-gold/40", label: t.puja.complete },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-[10px] font-sans text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Selected day tasks ─────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          {/* Day heading */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-foreground">
                {selectedDay} {t.puja.monthNames[viewMonth]}
                {isTodaySelected && (
                  <span className="ml-2 text-xs font-sans font-semibold text-saffron bg-saffron/10 px-2 py-0.5 rounded-full align-middle">
                    {t.puja.today}
                  </span>
                )}
              </h3>
              <p className="text-muted-foreground font-sans text-xs mt-0.5">
                {selectedChecked} {t.puja.of} {PUJA_ITEMS.length} {t.puja.ritualsCompleted}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Info toggle */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                aria-label={t.puja.infoLabel}
                className="w-8 h-8 rounded-full bg-secondary hover:bg-saffron/10 flex items-center justify-center text-muted-foreground hover:text-saffron transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Reset day */}
              {selectedChecked > 0 && !isSelectedFuture && (
                <button
                  onClick={resetDay}
                  aria-label={t.puja.resetLabel}
                  className="w-8 h-8 rounded-full bg-secondary hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sacred-gradient rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${selectedPct * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Future day notice */}
          {isSelectedFuture && (
            <div className="text-center py-6 text-muted-foreground font-sans text-sm">
              <p className="text-2xl mb-2">🌙</p>
              {t.puja.futureDay}
            </div>
          )}

          {/* Task display — compact slider when embedded, full list otherwise */}
          {!isSelectedFuture && embedded && (
            <CompactRitualSlider
              items={PUJA_ITEMS}
              record={selectedRecord}
              onToggle={toggleItem}
            />
          )}
          {!isSelectedFuture && !embedded && (
            <div className="flex flex-col gap-2.5">
              <AnimatePresence>
                {PUJA_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <TaskRow
                      item={item}
                      checked={!!selectedRecord[item.id]}
                      disabled={false}
                      onToggle={() => toggleItem(item.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Completion celebration */}
          <AnimatePresence>
            {selectedPct === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="mt-5 rounded-2xl bg-gold/10 border border-gold/30 p-5 text-center"
              >
                <motion.p
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-3xl mb-2"
                >
                  🙏
                </motion.p>
                <p className="font-serif font-bold text-foreground text-lg">{t.puja.completeTitle}</p>
                <p className="text-muted-foreground font-sans text-sm mt-1">
                  {t.puja.completeSubtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── How it works / info ────────────────────────────────────────── */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-secondary/50 rounded-2xl border border-border p-5">
                <p className="font-serif font-semibold text-foreground mb-3">{t.puja.aboutTitle}</p>
                <div className="space-y-3">
                  {PUJA_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <div>
                        <p className="font-sans font-semibold text-sm text-foreground">
                          {item.name} <span className="font-normal text-muted-foreground">· {item.sanskrit}</span>
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        trigger="puja"
        refreshSubscription={refreshSubscription}
      />
    </div>
  );
}
