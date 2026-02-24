/**
 * Navbar — OmVani top navigation
 *
 * Desktop: Logo · nav links · language toggle · profile avatar/dropdown
 * Mobile:  Om-circle profile trigger (top-left) · centered Logo · language (top-right)
 *          The hamburger is REMOVED. Mobile navigation lives entirely in BottomNav.
 */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslations } from "@/hooks/useTranslations";

type NavLink = { label: string; href: string; isPage?: boolean };

// ── Om Circle — mobile profile trigger ───────────────────────────────────────

interface OmCircleProps {
  onClick:  () => void;
  letter:   string;
  scrolled: boolean;
  open:     boolean;
}

function OmCircle({ onClick, letter, scrolled, open }: OmCircleProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open profile menu"
      aria-expanded={open}
      className={`
        relative w-10 h-10 rounded-full flex items-center justify-center
        transition-all duration-300 focus-visible:ring-2 focus-visible:ring-saffron
        ${scrolled
          ? "bg-sacred-gradient shadow-sacred"
          : "bg-black/20 backdrop-blur-sm border border-white/20"}
      `}
    >
      {/* OM symbol */}
      <span
        className={`text-[1.15rem] font-serif font-bold leading-none select-none ${
          scrolled ? "text-white" : "text-saffron drop-shadow"
        }`}
        aria-hidden="true"
      >
        ॐ
      </span>

      {/* Initial badge — tiny chip at bottom-right corner */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full
                   bg-background border border-border
                   flex items-center justify-center
                   text-[8px] font-bold text-foreground font-sans leading-none"
        aria-hidden="true"
      >
        {letter}
      </span>
    </button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut }             = useAuth();
  const navigate                      = useNavigate();
  const { t }                         = useTranslations();
  const profileRef                    = useRef<HTMLDivElement>(null);

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks: NavLink[] = [
    { label: t.nav.features,   href: "#features" },
    { label: t.nav.scriptures, href: "/scriptures", isPage: true },
    { label: t.nav.bhajans,    href: "/bhajans",    isPage: true },
    { label: t.nav.mandirs,    href: "/mandirs",    isPage: true },
    { label: t.nav.identify,   href: "/identify",   isPage: true },
    { label: t.nav.pricing,    href: "#pricing" },
  ];

  const handleAnchor = (link: NavLink) => {
    setProfileOpen(false);
    if (link.isPage) {
      navigate(link.href);
    } else {
      document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  const displayName  = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // ── Shared profile dropdown ────────────────────────────────────────────────
  const ProfileDropdown = () => (
    <AnimatePresence>
      {profileOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full mt-2 w-56 bg-card border border-border
                     rounded-2xl shadow-sacred overflow-hidden z-50
                     left-0 md:left-auto md:right-0"
        >
          {/* User header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center
                              text-white font-bold text-sm shrink-0 shadow-sacred">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-sans font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-[10px] font-sans text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { setProfileOpen(false); navigate("/chat"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans
                         text-foreground hover:bg-muted transition-colors text-left"
            >
              <span className="text-base font-serif text-saffron leading-none" aria-hidden="true">ॐ</span>
              Talk to Guru
            </button>
            <button
              onClick={() => { setProfileOpen(false); navigate("/profile"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans
                         text-foreground hover:bg-muted transition-colors text-left"
            >
              <User className="w-4 h-4 text-saffron" aria-hidden="true" />
              View Profile
            </button>
            <button
              onClick={() => { setProfileOpen(false); navigate("/profile"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans
                         text-foreground hover:bg-muted transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-saffron" aria-hidden="true" />
              Settings
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-border py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans
                         text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Mobile left: Om circle (profile) or Om home link ──────────── */}
        <div className="md:hidden" ref={profileRef}>
          {user ? (
            <div className="relative">
              <OmCircle
                onClick={() => setProfileOpen(!profileOpen)}
                letter={avatarLetter}
                scrolled={scrolled}
                open={profileOpen}
              />
              <ProfileDropdown />
            </div>
          ) : (
            /* Guest — Om links back to home */
            <Link
              to="/"
              aria-label="OmVani home"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                scrolled
                  ? "bg-sacred-gradient shadow-sacred"
                  : "bg-black/15 backdrop-blur-sm border border-white/20"
              }`}
            >
              <span className={`text-[1.15rem] font-serif font-bold ${scrolled ? "text-white" : "text-saffron"}`}>
                ॐ
              </span>
            </Link>
          )}
        </div>

        {/* ── Logo: centered on mobile, left on desktop ─────────────────── */}
        <Link
          to="/"
          className={`
            flex items-center gap-1.5
            absolute left-1/2 -translate-x-1/2
            md:static md:translate-x-0
          `}
        >
          <span className="text-2xl font-serif font-bold text-gradient-sacred">ॐ</span>
          <span className="text-2xl font-serif font-bold text-gradient-sacred">Vani</span>
        </Link>

        {/* ── Desktop nav links ──────────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleAnchor(link)}
              className={`text-sm font-sans font-medium transition-colors hover:text-saffron ${
                scrolled ? "text-foreground" : "text-gold-light"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* ── Right side: language + desktop auth ───────────────────────── */}
        <div className="flex items-center gap-3">

          <LanguageToggle variant={scrolled ? "dark" : "light"} />

          {/* Desktop auth controls */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center
                                  text-white font-sans font-bold text-sm shadow-sacred">
                    {avatarLetter}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      scrolled ? "text-foreground" : "text-gold-light"
                    } ${profileOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <ProfileDropdown />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`font-sans ${
                      scrolled
                        ? "text-foreground hover:text-saffron"
                        : "text-gold-light hover:text-gold-light/80"
                    }`}
                  >
                    {t.nav.signIn}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="sm">{t.nav.startTrial}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile: compact sign-in when logged out */}
          {!user && (
            <Link to="/login" className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className={`font-sans text-xs px-2 ${
                  scrolled ? "text-foreground" : "text-gold-light"
                }`}
              >
                {t.nav.signIn}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
