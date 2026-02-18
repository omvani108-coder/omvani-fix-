import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type NavLink = { label: string; href: string; isPage?: boolean };

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Scriptures", href: "#scriptures" },
  { label: "Bhajans", href: "/bhajans", isPage: true },
  { label: "Mandirs", href: "/mandirs", isPage: true },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (link: NavLink) => {
    setMenuOpen(false);
    if (link.isPage) {
      navigate(link.href);
    } else {
      const el = document.querySelector(link.href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <span className="text-gold-light text-base hidden sm:inline">🪔</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Button variant="hero" size="sm" onClick={() => navigate("/chat")}>
              Open Chat
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`font-sans ${scrolled ? "text-foreground hover:text-saffron" : "text-gold-light hover:text-gold-light/80"}`}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Start Free Trial
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden transition-colors ${scrolled ? "text-foreground" : "text-gold-light"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
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
                  <Button variant="hero" size="sm" className="w-full" onClick={() => { navigate("/chat"); setMenuOpen(false); }}>
                    Open Chat
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full font-sans">Sign In</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <Button variant="hero" size="sm" className="w-full">Start Free Trial</Button>
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
