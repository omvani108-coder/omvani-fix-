import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useTranslations } from "@/hooks/useTranslations";
import { SeoHead } from "@/components/SeoHead";
import heroBg from "@/assets/hero-bg.jpg";
import { fadeUp, defaultViewport } from "@/lib/animations";
import { useShlokaAudio } from "@/hooks/useShlokaAudio";
import {
  features,
  shlokas,
  getDailyShloka,
  scriptures,
  testimonials,
  stats,
  plans,
} from "@/data/landingData";

// ─── Shloka Carousel ──────────────────────────────────────────────────────────

function ShlokaCarousel() {
  const { t } = useTranslations();
  const todayIndex = useMemo(
    () => shlokas.findIndex((s) => s.id === getDailyShloka().id),
    []
  );
  const [index, setIndex] = useState(todayIndex);
  const shloka = shlokas[index];

  const ttsText = `${shloka.sanskrit}. ${shloka.transliteration}. Meaning: ${shloka.meaning}`;
  const { isPlaying, isLoading, handleToggle, stop } = useShlokaAudio({ text: ttsText });

  const goTo = (dir: number) => {
    stop();
    setIndex((i) => (i + dir + shlokas.length) % shlokas.length);
  };

  const jumpTo = (i: number) => {
    stop();
    setIndex(i);
  };

  return (
    <section aria-label="Shloka of the Day" className="py-12 px-4 bg-sacred-gradient overflow-hidden">
      <div className="max-w-3xl mx-auto">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-accent-foreground/70 font-sans text-xs tracking-[0.25em] uppercase">
              🪔 Shloka of the Day
            </p>
            <p className="text-accent-foreground/50 font-sans text-xs mt-0.5">
              {shloka.ref} · {shloka.theme}
            </p>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Shloka navigation">
            <button
              onClick={() => goTo(-1)}
              aria-label={t.shloka.prev}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="text-accent-foreground/50 font-sans text-xs min-w-[2.5rem] text-center"
            >
              {index + 1}/{shlokas.length}
            </span>

            <button
              onClick={() => goTo(1)}
              aria-label={t.shloka.next}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={handleToggle}
              disabled={isLoading}
              aria-label={isPlaying ? t.shloka.stop : t.shloka.listen}
              className="w-8 h-8 rounded-full bg-accent-foreground/10 hover:bg-accent-foreground/20 focus-visible:ring-2 focus-visible:ring-accent-foreground flex items-center justify-center text-accent-foreground transition-colors disabled:opacity-50 ml-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Volume2 className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Animated shloka content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={shloka.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-center"
          >
            <p className="text-accent-foreground font-serif text-xl md:text-2xl font-semibold mb-3 leading-relaxed whitespace-pre-line">
              {shloka.sanskrit}
            </p>
            <div className="w-12 h-px bg-accent-foreground/30 mx-auto mb-3" aria-hidden="true" />
            <p className="text-accent-foreground/80 font-sans text-sm italic mb-4 whitespace-pre-line">
              {shloka.transliteration}
            </p>
            <p className="text-accent-foreground/90 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
              {shloka.meaning}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6" role="tablist" aria-label="Shloka selector">
          {shlokas.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to shloka ${i + 1}`}
              onClick={() => jumpTo(i)}
              className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent-foreground ${
                i === index
                  ? "w-4 h-2 bg-accent-foreground"
                  : "w-2 h-2 bg-accent-foreground/30 hover:bg-accent-foreground/50"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Index = () => {
  const { t } = useTranslations();
  return (
  <div className="min-h-screen bg-background">
    <SeoHead />
    <Navbar />

    {/* ── Hero ──────────────────────────────────────────────────────────────── */}
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="Sacred temple at golden hour"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-overlay" aria-hidden="true" />

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
          {t.home.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="text-sm text-gold-light/60 mb-10 font-sans"
        >
          {t.home.scriptureNote}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <Link to="/chat">
            <Button
              size="lg"
              className="text-base px-10 py-6 bg-saffron hover:bg-saffron/90 text-white font-semibold shadow-lg shadow-saffron/30 transition-all duration-300"
            >
              ॐ Talk to Guru
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-gold-light/50 flex justify-center pt-1"
        >
          <div className="w-1 h-2 rounded-full bg-gold-light/70" />
        </motion.div>
      </motion.div>
    </section>

    {/* ── Shloka of the Day ─────────────────────────────────────────────────── */}
    <ShlokaCarousel />

    {/* ── Features ──────────────────────────────────────────────────────────── */}
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
            What OmVani Offers
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            Ancient Wisdom, Modern Access
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <Link to={feature.href} key={feature.title}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                custom={i}
                className="group bg-card rounded-xl p-8 shadow-sacred border border-border hover:border-saffron hover:shadow-lg hover:-translate-y-0.5 focus-within:border-gold-light transition-all duration-300 cursor-pointer h-full"
              >
                <div className="flex items-start gap-5">
                  <div aria-hidden="true" className="shrink-0 w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground font-sans leading-relaxed mb-3">{feature.description}</p>
                    <span className="inline-block text-xs font-sans font-medium text-saffron bg-saffron/10 px-3 py-1 rounded-full">
                      {feature.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ── Sacred Scriptures ─────────────────────────────────────────────────── */}
    <section id="scriptures" className="py-24 px-4 bg-secondary/40">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
            Our Sources
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Rooted in Sacred Scriptures
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans max-w-xl mx-auto">
            {t.home.scripturesSubtitle}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {scriptures.map((scripture, i) => (
            <motion.div
              key={scripture.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className={`bg-gradient-to-br ${scripture.color} rounded-xl p-8 border border-border hover:shadow-sacred transition-all duration-300`}
            >
              <div aria-hidden="true" className="w-12 h-12 rounded-lg bg-sacred-gradient flex items-center justify-center mb-5">
                <scripture.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">{scripture.name}</h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-4">{scripture.description}</p>
              <span className="text-xs font-sans font-semibold text-saffron">{scripture.chapters}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-card rounded-xl border border-border shadow-sacred">
              <dd className="text-3xl font-serif font-bold text-gradient-sacred mb-1">{stat.number}</dd>
              <dt className="text-sm text-muted-foreground font-sans">{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>

    {/* ── Testimonials ──────────────────────────────────────────────────────── */}
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
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
          {testimonials.map((testimonial, i) => (
            <motion.article
              key={testimonial.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-xl p-8 border border-border shadow-sacred flex flex-col gap-4"
            >
              <div className="flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-saffron text-saffron" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-foreground/80 font-sans text-sm leading-relaxed flex-1">
                "{testimonial.text}"
              </blockquote>
              <footer className="flex items-center gap-3">
                <span aria-hidden="true" className="text-2xl">{testimonial.avatar}</span>
                <div>
                  <p className="text-sm font-semibold font-sans text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-sans">{testimonial.location}</p>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    {/* ── Pricing ───────────────────────────────────────────────────────────── */}
    <section id="pricing" className="py-24 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="text-saffron font-sans text-sm tracking-[0.2em] uppercase mb-3">
            Simple Pricing
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Begin Your Spiritual Journey
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-muted-foreground font-sans">
            {t.home.pricingSubtitle}
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
                <span
                  aria-label="Most popular plan"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sacred-gradient text-accent-foreground text-xs font-sans font-semibold px-4 py-1 rounded-full"
                >
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-serif font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-serif font-bold text-gradient-sacred">{plan.price}</span>
                <span className="text-muted-foreground font-sans text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8" aria-label={`${plan.name} plan features`}>
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-sans text-foreground">
                    <span aria-hidden="true" className="w-5 h-5 rounded-full bg-saffron/15 flex items-center justify-center text-saffron text-xs">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant={plan.popular ? "hero" : "outline"} size="lg" className="w-full">
                  {plan.popular ? t.home.startFreeTrial : t.home.getStarted}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA Banner ────────────────────────────────────────────────────────── */}
    <section className="py-20 px-4 bg-sacred-gradient">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="max-w-2xl mx-auto text-center"
      >
        <p className="text-accent-foreground/80 font-sans text-sm tracking-widest uppercase mb-3">
          <span aria-hidden="true">🙏</span> Begin Today
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-accent-foreground mb-5">
          Your Spiritual Journey Awaits
        </h2>
        <p className="text-accent-foreground/80 font-sans mb-8 text-sm">
          {t.home.ctaSubtitle}
        </p>
        <Link to="/signup">
          <Button size="lg" className="bg-accent-foreground text-accent font-sans font-semibold px-10 hover:bg-accent-foreground/90 transition-colors">
            Start Free Trial — No Card Needed
          </Button>
        </Link>
      </motion.div>
    </section>

    {/* ── Footer ────────────────────────────────────────────────────────────── */}
    <footer className="py-12 px-4 border-t border-border" role="contentinfo">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-serif text-2xl font-bold text-gradient-sacred mb-2">OmVani</p>
        <p className="text-saffron font-sans text-xs mb-4" aria-label="Om Tat Sat">ॐ तत् सत्</p>
        <p className="text-xs text-muted-foreground font-sans max-w-lg mx-auto mb-6 leading-relaxed">
          Disclaimer: OmVani is an AI-powered tool designed to assist with spiritual learning. It is
          not a replacement for a living guru or personal spiritual practice. All answers are sourced
          from authentic scriptures but should be used for guidance only.
        </p>
        <p className="text-xs text-muted-foreground/60 font-sans">
          {t.home.footerRights}
        </p>
      </div>
    </footer>

  </div>
  );
};

export default Index;
