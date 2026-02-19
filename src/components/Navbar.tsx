import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslations } from "@/hooks/useTranslations";

type NavLink = { label: string; href: string; isPage?: boolean };

const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const { user, signOut }               = useAuth();
  const navigate                        = useNavigate();
  const { t }                           = useTranslations();
  const profileRef                      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown when clicking outside
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
    setMenuOpen(false);
    if (link.isPage) {
      navigate(link.href);
    } else {
      const el = document.querySelector(link.href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    navigate("/");
  };

  // Get display name and avatar letter
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Seeker";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-serif font-bold text-gradient-sacred">OmVani</span>
          <span className="text-gold-light text-base hidden sm:inline" aria-hidden="true">🪔</span>
        </Link>

        {/* Desktop nav links */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Language toggle */}
          <LanguageToggle variant={scrolled ? "dark" : "light"} />

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              /* Profile avatar + dropdown */
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 group"
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-white font-sans font-bold text-sm shadow-sacred">
                    {avatarLetter}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      scrolled ? "text-foreground" : "text-gold-light"
                    } ${profileOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-sacred overflow-hidden z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-sans font-semibold text-foreground truncate">{displayName}</p>
                        <p className="text-[10px] font-sans text-muted-foreground truncate">{user.email}</p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/chat"); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <span aria-hidden="true" className="text-base">ॐ</span>
                          Talk to Guru
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <User className="w-4 h-4 text-saffron" aria-hidden="true" />
                          View Profile
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-foreground hover:bg-muted transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-saffron" aria-hidden="true" />
                          Settings
                        </button>
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-border py-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-sans text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                  <Button variant="hero" size="sm">
                    {t.nav.startTrial}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`md:hidden transition-colors ${
              scrolled ? "text-foreground" : "text-gold-light"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X className="w-6 h-6" aria-hidden="true" />
              : <Menu className="w-6 h-6" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleAnchor(link)}
                  className="text-left text-sm font-sans font-medium text-foreground hover:text-saffron transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-2 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    {/* Mobile user info */}
                    <div className="flex items-center gap-3 px-1 pb-2">
                      <div className="w-8 h-8 rounded-full bg-sacred-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {avatarLetter}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-sans font-medium text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      className="w-full"
                      onClick={() => { navigate("/chat"); setMenuOpen(false); }}
                    >
                      Talk to Guru
                    </Button>
                    <button
                      onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                      className="w-full text-left text-sm font-sans text-muted-foreground hover:text-foreground py-1 transition-colors"
                    >
                      View Profile & Settings
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-sm font-sans text-red-500 py-1"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full font-sans">
                        {t.nav.signIn}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <Button variant="hero" size="sm" className="w-full">
                        {t.nav.startTrial}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
