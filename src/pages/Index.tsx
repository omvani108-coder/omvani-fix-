import { motion } from "framer-motion";
import { MessageCircle, Music, Camera, MapPin, Star, BookOpen, Flame, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import Navbar from "@/components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: MessageCircle,
    title: "AI Spiritual Guide",
    description:
      "Ask any question about dharma, karma, or life — get accurate answers from the Gita, Vedas & Puranas with source shlokas.",
    tag: "Voice + Text · Hindi & English",
  },
  {
    icon: Music,
    title: "Bhajans & Mantras",
    description:
      "Curated library of sacred bhajans and mantras with lyrics, meanings, and soulful audio playback.",
    tag: "Audio · Lyrics · Meaning",
  },
  {
    icon: Camera,
    title: "AI Image Search",
    description:
      "Upload a photo of any deity, temple, or ritual — instantly identify it and learn the complete story behind it.",
    tag: "AI Vision · Instant ID",
  },
  {
    icon: MapPin,
    title: "Mandir Locator",
    description:
      "Find temples near you with directions, timings, and details. Never miss darshan wherever you are.",
    tag: "GPS · Directions · Timings",
  },
];

const dailyShloka = {
  sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
  transliteration: "Karmanye vadhikaras te ma phaleshu kadachana",
  meaning:
    "You have the right to perform your duties, but never to the fruits of your actions. — Bhagavad Gita 2.47",
};

const scriptures = [
  {
    icon: BookOpen,
    name: "Bhagavad Gita",
    description: "700 verses of eternal wisdom on dharma, yoga, and the nature of the Self.",
    chapters: "18 Chapters · 700 Shlokas",
    color: "from-saffron/20 to-gold/10",
  },
  {
    icon: Flame,
    name: "Vedas & Upanishads",
    description: "Ancient scriptures revealing the nature of Brahman, Atman, and cosmic truth.",
    chapters: "4 Vedas · 108 Upanishads",
    color: "from-lotus-pink/20 to-saffron/10",
  },
  {
    icon: Sun,
    name: "Puranas",
    description: "Stories of deities, creation, cosmology, and the cycles of time.",
    chapters: "18 Maha Puranas",
    color: "from-gold/20 to-saffron/10",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    location: "Mumbai",
    text: "OmVani answered my question about karma with a shloka from the Gita that I had been searching for years. It felt like speaking to a real guru.",
    avatar: "🙏",
  },
  {
    name: "Ramesh T.",
    location: "Bengaluru",
    text: "The voice mode is magical. I speak in Hindi and it responds instantly with deep answers and beautiful pronunciation. My morning sadhana is now complete.",
    avatar: "🕉️",
  },
  {
    name: "Ananya M.",
    location: "Delhi",
    text: "I uploaded a photo of a temple idol and OmVani told me its complete story — the deity, significance, and related mantras. Incredible!",
    avatar: "🌸",
  },
];

const plans = [
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    features: [
      "Unlimited AI conversations",
      "Voice + text in Hindi & English",
      "Full bhajan & mantra library",
      "AI image identification",
      "Temple locator",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "₹399",
    period: "/month",
    features: [
      "Everything in Pro",
      "Sanskrit language support",
      "Offline bhajan downloads",
      "Sadhana tracker & reminders",
      "Priority response speed",
      "ePuja guided rituals",
    ],
    popular: true,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Sacred temple at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-light font-sans text-sm tracking-[0.3em] uppercase mb-4"
          >
            ॐ &nbsp; Your Spiritual Companion
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6 leading-tight"
          >
            Om<span className="text-gradient-sacred">Vani</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gold-light/90 max-w-2xl mx-auto mb-4 font-sans"
          >
            Talk to a spiritual guru anytime, in your language — no waiting, no travel.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-sm text-gold-light/60 mb-10 font-sans"
          >
            100% scripture-based answers from the Gita, Vedas & Puranas
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Start 7-Day Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="hero-outline" size="lg" className="text-base px-8 py-6">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-5 h-8 rounded-full border-2 border-gold-light/50 flex justify-center pt-1"
            >
              <div className="w-1 h-2 rounded-full bg-gold-light/70" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Daily Shloka Banner */}
      <section className="py-10 px-4 bg-sacred-gradient">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-accent-foreground/70 font-sans text-xs tracking-[0.25em] uppercase mb-3">
            🪔 Shloka of the Day
          </p>
          <p className="text-accent-foreground font-serif text-xl md:text-2xl font-semibold mb-2 leading-relaxed">
            {dailyShloka.sanskrit}
          </p>
          <p className="text-accent-foreground/80 font-sans text-sm italic mb-3">
            {dailyShloka.transliteration}
          </p>
          <p className="text-accent-foreground/90 font-sans text-sm max-w-xl mx-auto">
            {dailyShloka.meaning}
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3"
            >
              What OmVani Offers
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-serif font-bold text-foreground"
            >
              Ancient Wisdom, Modern Access
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group relative bg-card rounded-xl p-8 shadow-sacred border border-border hover:border-gold-light transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-3">{f.description}</p>
                    <span className="inline-block text-xs font-sans font-medium text-saffron bg-saffron/10 px-3 py-1 rounded-full">
                      {f.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Scriptures */}
      <section id="scriptures" className="py-24 px-4 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3"
            >
              Our Sources
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4"
            >
              Rooted in Sacred Scriptures
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans max-w-xl mx-auto">
              Every answer OmVani provides is grounded in authentic, time-tested Hindu scriptures — never invented, always referenced.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {scriptures.map((s, i) => (
              <motion.div
                key={s.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`bg-gradient-to-br ${s.color} rounded-xl p-8 border border-border hover:shadow-sacred transition-all duration-300`}
              >
                <div className="w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center mb-5">
                  <s.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">{s.name}</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">{s.description}</p>
                <span className="text-xs font-sans font-semibold text-saffron">{s.chapters}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { number: "700+", label: "Shlokas Referenced" },
              { number: "2", label: "Languages Supported" },
              { number: "18", label: "Puranas Indexed" },
              { number: "24/7", label: "Guru Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-card rounded-xl border border-border shadow-sacred">
                <p className="text-3xl font-serif font-bold text-gradient-sacred mb-1">{stat.number}</p>
                <p className="text-sm text-muted-foreground font-sans">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
              Seekers Speak
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              What Our Community Says
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-xl p-8 border border-border shadow-sacred flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-saffron text-saffron" />
                  ))}
                </div>
                <p className="text-foreground/80 font-sans text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold font-sans text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
              Simple Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Begin Your Spiritual Journey
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans">
              Start with a 7-day free trial — full Pro access, no card required.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? "bg-card border-saffron shadow-sacred scale-[1.02]"
                    : "bg-card border-border"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sacred-gradient text-accent-foreground text-xs font-sans font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-serif font-bold text-foreground mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-serif font-bold text-gradient-sacred">{plan.price}</span>
                  <span className="text-muted-foreground font-sans text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm font-sans text-foreground">
                      <span className="w-5 h-5 rounded-full bg-saffron/15 flex items-center justify-center text-saffron text-xs">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button variant={plan.popular ? "hero" : "outline"} size="lg" className="w-full">
                    {plan.popular ? "Start Free Trial" : "Get Started"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-sacred-gradient">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-accent-foreground/80 font-sans text-sm tracking-widest uppercase mb-3">🙏 Begin Today</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-accent-foreground mb-5">
            Your Spiritual Journey Awaits
          </h2>
          <p className="text-accent-foreground/80 font-sans mb-8 text-sm">
            Join thousands of seekers finding answers from our ancient scriptures — anytime, in your language.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-accent-foreground text-accent font-sans font-semibold px-10 hover:bg-accent-foreground/90 transition-colors"
            >
              Start Free Trial — No Card Needed
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl font-bold text-gradient-sacred mb-2">OmVani</p>
          <p className="text-saffron font-sans text-xs mb-4">ॐ तत् सत्</p>
          <p className="text-xs text-muted-foreground font-sans max-w-lg mx-auto mb-6 leading-relaxed">
            Disclaimer: OmVani is an AI-powered tool designed to assist with spiritual learning. It is not a replacement for a living guru or personal spiritual practice. All answers are sourced from authentic scriptures but should be used for guidance only.
          </p>
          <p className="text-xs text-muted-foreground/60 font-sans">
            © 2026 OmVani. All rights reserved. · Users must be 14+ to use this service.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
