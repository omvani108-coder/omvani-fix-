import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, BookOpen, Music, MapPin, Home } from "lucide-react";

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Chat",
    icon: MessageCircle,
    href: "/chat",
  },
  {
    label: "Gita",
    icon: BookOpen,
    href: "/scriptures",
  },
  {
    label: "Bhajans",
    icon: Music,
    href: "/bhajans",
  },
  {
    label: "Mandirs",
    icon: MapPin,
    href: "/mandirs",
  },
] as const;

// ─── Pages where the bottom nav should NOT show ───────────────────────────────
// e.g. login, signup, onboarding

const HIDDEN_ON = ["/login", "/signup", "/forgot-password", "/reset-password"];

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on auth pages
  if (HIDDEN_ON.includes(location.pathname)) return null;

  return (
    <>
      {/* Spacer so page content doesn't hide behind the bar */}
      <div className="h-20 md:hidden" aria-hidden="true" />

      {/* The bar — mobile only */}
      <nav
        aria-label="Main navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
              >
                {/* Active pill background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-1 inset-x-2 h-8 rounded-xl bg-saffron/10"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative z-10"
                  aria-hidden="true"
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-saffron" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] font-sans font-medium transition-colors leading-none ${
                    isActive ? "text-saffron" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
