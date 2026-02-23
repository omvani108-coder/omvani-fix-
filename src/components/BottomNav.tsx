/**
 * BottomNav — OmVani mobile bottom navigation
 *
 * Layout (5 slots):
 *   [Gita]  [Puja]  [AI Guru FAB]  [Bhajans]  [Divya Drishti]
 *
 * Changes from original:
 *   • Profile slot → Divya Drishti (AI Image Identifier at /identify)
 *   • Center slot = "AI Guru" as a floating FAB — 20% larger, elevated,
 *     saffron-to-gold gradient, sacred glow + pulse ring on active
 *   • Saffron/gold spiritual palette throughout
 *   • Top border styled with gradient accent for temple-wood feel
 */

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Flame, Music, Eye } from "lucide-react";

// ─── Pages where the bottom nav is hidden ─────────────────────────────────────

const HIDDEN_ON = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
];

// ─── Reusable icon tab button ─────────────────────────────────────────────────

interface NavButtonProps {
  icon:    React.ElementType;
  label:   string;
  active:  boolean;
  onClick: () => void;
}

function NavButton({ icon: Icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full
                 transition-colors pb-1 focus-visible:outline-none"
    >
      {/* Active pill background */}
      <AnimatePresence>
        {active && (
          <motion.div
            layoutId="bottom-nav-active"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute top-1.5 inset-x-1 h-8 rounded-xl bg-saffron/10"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <motion.div
        animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative z-10"
        aria-hidden="true"
      >
        <Icon
          className={`w-5 h-5 transition-colors ${
            active ? "text-saffron" : "text-muted-foreground"
          }`}
        />
      </motion.div>

      {/* Label */}
      <span
        className={`relative z-10 text-[10px] font-sans font-medium transition-colors leading-none ${
          active ? "text-saffron" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t }    = useTranslations();

  if (HIDDEN_ON.includes(location.pathname)) return null;

  const leftItems = [
    { label: t.bottomNav.gita,   icon: BookOpen, href: "/scriptures"  },
    { label: t.bottomNav.puja,   icon: Flame,    href: "/puja-tracker" },
  ] as const;

  const rightItems = [
    { label: t.bottomNav.bhajans,      icon: Music, href: "/bhajans"  },
    { label: t.bottomNav.divyaDrishti, icon: Eye,   href: "/identify" },
  ] as const;

  const isChatActive = location.pathname === "/chat";

  return (
    <>
      {/* Spacer so page content doesn't hide behind the bar */}
      <div className="h-24 md:hidden" aria-hidden="true" />

      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/97 backdrop-blur-md"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Gradient top border — saffron to gold, temple-wood aesthetic */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, hsl(33 100% 50%) 30%, hsl(45 90% 50%) 70%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="flex items-end justify-around px-1 h-16">

          {/* Left two icons */}
          {leftItems.map((item) => (
            <NavButton
              key={item.href}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          ))}

          {/* ── Center FAB — AI Guru ─────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-end pb-1 flex-1">
            <button
              onClick={() => navigate("/chat")}
              aria-label={t.bottomNav.chat}
              aria-current={isChatActive ? "page" : undefined}
              className="relative flex flex-col items-center gap-1 focus-visible:outline-none"
            >
              {/* The FAB disc — floats 20px above the bar */}
              <motion.div
                animate={{
                  scale: isChatActive ? 1.08 : 1,
                  boxShadow: isChatActive
                    ? "0 0 28px 6px hsla(33,100%,50%,0.45), 0 4px 16px hsla(33,100%,50%,0.3)"
                    : "0 4px 14px rgba(0,0,0,0.22), 0 0 8px hsla(33,100%,50%,0.18)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="
                  w-[3.75rem] h-[3.75rem] rounded-full
                  bg-sacred-gradient
                  flex items-center justify-center
                  -mt-5 relative z-10
                  ring-[3px] ring-background
                "
              >
                {/* OM glyph */}
                <span
                  className="text-[1.7rem] font-serif font-bold text-white leading-none select-none
                             drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                  aria-hidden="true"
                >
                  ॐ
                </span>

                {/* Pulse ring when active */}
                {isChatActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-saffron/50"
                    animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    aria-hidden="true"
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-[10px] font-sans font-semibold leading-none mt-0.5 transition-colors ${
                  isChatActive ? "text-saffron" : "text-muted-foreground"
                }`}
              >
                {t.bottomNav.chat}
              </span>
            </button>
          </div>

          {/* Right two icons */}
          {rightItems.map((item) => (
            <NavButton
              key={item.href}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.href}
              onClick={() => navigate(item.href)}
            />
          ))}
        </div>
      </nav>
    </>
  );
}
