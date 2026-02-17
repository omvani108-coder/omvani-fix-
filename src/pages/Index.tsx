import { motion } from "framer-motion";
import { MessageCircle, Music, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

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
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Sacred temple at golden hour"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
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
            Talk to a spiritual guru anytime, in your language — no waiting, no
            travel.
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
              <Button
                variant="hero-outline"
                size="lg"
                className="text-base px-8 py-6"
              >
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
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
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-3">
                      {f.description}
                    </p>
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

      {/* Pricing */}
      <section className="py-24 px-4 bg-secondary/50">
        <div className="max-w-4xl mx-auto">
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
              Simple Pricing
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4"
            >
              Begin Your Spiritual Journey
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-muted-foreground font-sans"
            >
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
                <h3 className="text-2xl font-serif font-bold text-foreground mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-serif font-bold text-gradient-sacred">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-sans text-sm">
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 text-sm font-sans text-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-saffron/15 flex items-center justify-center text-saffron text-xs">
                        ✓
                      </span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-serif text-2xl font-bold text-gradient-sacred mb-4">
            OmVani
          </p>
          <p className="text-xs text-muted-foreground font-sans max-w-lg mx-auto mb-6 leading-relaxed">
            Disclaimer: OmVani is an AI-powered tool designed to assist with
            spiritual learning. It is not a replacement for a living guru or
            personal spiritual practice. All answers are sourced from authentic
            scriptures but should be used for guidance only.
          </p>
          <p className="text-xs text-muted-foreground/60 font-sans">
            © 2026 OmVani. All rights reserved. · Users must be 14+ to use this
            service.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
