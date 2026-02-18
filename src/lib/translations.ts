/**
 * translations.ts
 * All UI text for English and Hindi.
 * Usage: const { t } = useTranslations();  →  t("nav.chat")
 */

export const translations = {
  en: {
    // ── Navbar ──────────────────────────────────────────────────────────────
    nav: {
      features: "Features",
      scriptures: "Scriptures",
      bhajans: "Bhajans",
      mandirs: "Mandirs",
      identify: "Identify",
      pricing: "Pricing",
      signIn: "Sign In",
      startTrial: "Start Free Trial",
      openChat: "Open Chat",
    },

    // ── Bottom Nav ───────────────────────────────────────────────────────────
    bottomNav: {
      chat: "Chat",
      gita: "Gita",
      puja: "Puja",
      bhajans: "Bhajans",
      mandirs: "Mandirs",
    },

    // ── Home / Landing ───────────────────────────────────────────────────────
    home: {
      eyebrow: "Your Spiritual Companion",
      title: "OmVani",
      subtitle: "Talk to a spiritual guru anytime, in your language — no waiting, no travel.",
      scriptureNote: "100% scripture-based answers from the Gita, Vedas & Puranas",
      talkButton: "ॐ Talk to Guru",
      featuresEyebrow: "What OmVani Offers",
      featuresTitle: "Ancient Wisdom, Modern Access",
      ctaEyebrow: "Begin Today",
      ctaTitle: "Your Spiritual Journey Awaits",
      ctaSubtitle: "Join thousands of seekers finding answers from our ancient scriptures — anytime, in your language.",
      ctaButton: "Start Free Trial — No Card Needed",
    },

    // ── Shloka Carousel ──────────────────────────────────────────────────────
    shloka: {
      label: "Shloka of the Day",
      prev: "Previous shloka",
      next: "Next shloka",
      listen: "Listen to shloka",
      stop: "Stop audio",
    },

    // ── Chat ─────────────────────────────────────────────────────────────────
    chat: {
      guruPresent: "Guru is present",
      clear: "Clear",
      askTitle: "Ask the Guru",
      askSubtitle: "Seek wisdom from the Bhagavad Gita, Vedas & Puranas. Every answer is rooted in authentic scripture.",
      placeholder: "Ask anything about dharma, karma, or life…",
      disclaimer: "OmVani draws from authentic scriptures. Not a substitute for a living guru.",
      hint: "Press Enter to send · Shift+Enter for new line",
      thinking: "Guru is thinking…",
      suggestedQuestions: [
        "What does the Gita say about dealing with anxiety?",
        "How do I find my dharma in life?",
        "What is the meaning of karma?",
        "How should I deal with grief according to scriptures?",
        "What is the path to inner peace?",
        "How do I practice detachment without being cold?",
      ],
    },

    // ── Puja Tracker ─────────────────────────────────────────────────────────
    puja: {
      eyebrow: "Daily Sadhana",
      title: "Puja Tracker",
      subtitle: "Build a sacred daily routine. Track each step of your puja for every day of the month.",
      streakLabel: "Current Streak",
      days: "days",
      day: "day",
      fullDays: "Full days",
      thisMonth: "This month",
      today: "Today",
      ritualsCompleted: "rituals completed",
      of: "of",
      resetLabel: "Reset today's puja",
      infoLabel: "Show ritual descriptions",
      futureDay: "This day is yet to come. Come back then to track your puja.",
      completeTitle: "Puja Complete!",
      completeSubtitle: "Your devotion today is seen by the divine. Om Shanti.",
      aboutTitle: "About These Rituals",
      notStarted: "Not started",
      partial: "Partial",
      complete: "Complete",
      done: "Done ✓",
    },

    // ── Puja Items ────────────────────────────────────────────────────────────
    pujaItems: {
      snan: { name: "Morning Bath", description: "Ritual purification before puja" },
      deepak: { name: "Light Deepak", description: "Invoke the divine light" },
      incense: { name: "Offer Incense", description: "Purify the space with fragrance" },
      flowers: { name: "Offer Flowers", description: "Devotion through nature's beauty" },
      mantra: { name: "Chant Mantra", description: "108 repetitions of your chosen mantra" },
      aarti: { name: "Perform Aarti", description: "Wave the lamp before the deity" },
      prasad: { name: "Offer Prasad", description: "Sacred food offered to the divine" },
      meditation: { name: "Meditation", description: "Sit in silence for 10+ minutes" },
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
      disclaimer: "OmVani is an AI-powered tool designed to assist with spiritual learning. It is not a replacement for a living guru or personal spiritual practice. All answers are sourced from authentic scriptures but should be used for guidance only.",
      rights: "© 2026 OmVani. All rights reserved. · Users must be 14+ to use this service.",
    },
  },

  // ── HINDI ────────────────────────────────────────────────────────────────────
  hi: {
    nav: {
      features: "विशेषताएं",
      scriptures: "धर्मग्रंथ",
      bhajans: "भजन",
      mandirs: "मंदिर",
      identify: "पहचानें",
      pricing: "मूल्य",
      signIn: "साइन इन",
      startTrial: "निःशुल्क परीक्षण",
      openChat: "चैट खोलें",
    },

    bottomNav: {
      chat: "चैट",
      gita: "गीता",
      puja: "पूजा",
      bhajans: "भजन",
      mandirs: "मंदिर",
    },

    home: {
      eyebrow: "आपका आध्यात्मिक साथी",
      title: "OmVani",
      subtitle: "कभी भी, अपनी भाषा में एक आध्यात्मिक गुरु से बात करें — कोई प्रतीक्षा नहीं, कोई यात्रा नहीं।",
      scriptureNote: "गीता, वेद और पुराणों से १००% शास्त्र-आधारित उत्तर",
      talkButton: "ॐ गुरु से बात करें",
      featuresEyebrow: "OmVani क्या प्रदान करता है",
      featuresTitle: "प्राचीन ज्ञान, आधुनिक पहुँच",
      ctaEyebrow: "आज से शुरू करें",
      ctaTitle: "आपकी आध्यात्मिक यात्रा प्रतीक्षारत है",
      ctaSubtitle: "हजारों साधकों के साथ जुड़ें जो हमारे प्राचीन शास्त्रों से उत्तर पा रहे हैं — कभी भी, अपनी भाषा में।",
      ctaButton: "निःशुल्क परीक्षण शुरू करें — कार्ड की आवश्यकता नहीं",
    },

    shloka: {
      label: "आज का श्लोक",
      prev: "पिछला श्लोक",
      next: "अगला श्लोक",
      listen: "श्लोक सुनें",
      stop: "ऑडियो बंद करें",
    },

    chat: {
      guruPresent: "गुरु उपस्थित हैं",
      clear: "साफ़ करें",
      askTitle: "गुरु से पूछें",
      askSubtitle: "भगवद्गीता, वेदों और पुराणों से ज्ञान प्राप्त करें। हर उत्तर प्रामाणिक शास्त्र पर आधारित है।",
      placeholder: "धर्म, कर्म या जीवन के बारे में कुछ भी पूछें…",
      disclaimer: "OmVani प्रामाणिक शास्त्रों से ज्ञान लेता है। यह जीवित गुरु का विकल्प नहीं है।",
      hint: "भेजने के लिए Enter दबाएं · नई पंक्ति के लिए Shift+Enter",
      thinking: "गुरु विचार कर रहे हैं…",
      suggestedQuestions: [
        "चिंता से निपटने के बारे में गीता क्या कहती है?",
        "मैं जीवन में अपना धर्म कैसे खोजूं?",
        "कर्म का अर्थ क्या है?",
        "शास्त्रों के अनुसार दुःख से कैसे निपटें?",
        "आंतरिक शांति का मार्ग क्या है?",
        "ठंडे हुए बिना वैराग्य का अभ्यास कैसे करें?",
      ],
    },

    puja: {
      eyebrow: "दैनिक साधना",
      title: "पूजा ट्रैकर",
      subtitle: "एक पवित्र दैनिक दिनचर्या बनाएं। महीने के हर दिन अपनी पूजा के प्रत्येक चरण को ट्रैक करें।",
      streakLabel: "वर्तमान स्ट्रीक",
      days: "दिन",
      day: "दिन",
      fullDays: "पूर्ण दिन",
      thisMonth: "इस महीने",
      today: "आज",
      ritualsCompleted: "अनुष्ठान पूर्ण",
      of: "में से",
      resetLabel: "आज की पूजा रीसेट करें",
      infoLabel: "अनुष्ठान विवरण दिखाएं",
      futureDay: "यह दिन अभी आना बाकी है। तब वापस आएं और अपनी पूजा ट्रैक करें।",
      completeTitle: "पूजा सम्पन्न!",
      completeSubtitle: "आज आपकी भक्ति ईश्वर को दिखती है। ॐ शांति।",
      aboutTitle: "इन अनुष्ठानों के बारे में",
      notStarted: "शुरू नहीं",
      partial: "आंशिक",
      complete: "पूर्ण",
      done: "हो गया ✓",
    },

    pujaItems: {
      snan: { name: "प्रातः स्नान", description: "पूजा से पहले शुद्धिकरण" },
      deepak: { name: "दीप प्रज्वलन", description: "दिव्य प्रकाश का आह्वान" },
      incense: { name: "धूप अर्पण", description: "सुगंध से स्थान को पवित्र करें" },
      flowers: { name: "पुष्प अर्पण", description: "प्रकृति की सुंदरता से भक्ति" },
      mantra: { name: "मंत्र जाप", description: "अपने चुने हुए मंत्र की १०८ माला" },
      aarti: { name: "आरती", description: "देवता के सामने दीप घुमाएं" },
      prasad: { name: "प्रसाद", description: "ईश्वर को अर्पित पवित्र भोजन" },
      meditation: { name: "ध्यान", description: "१०+ मिनट मौन में बैठें" },
    },

    footer: {
      disclaimer: "OmVani एक AI-संचालित उपकरण है जो आध्यात्मिक शिक्षा में सहायता के लिए बनाया गया है। यह जीवित गुरु या व्यक्तिगत आध्यात्मिक अभ्यास का विकल्प नहीं है।",
      rights: "© 2026 OmVani. सर्वाधिकार सुरक्षित। · इस सेवा का उपयोग करने के लिए उपयोगकर्ताओं की आयु १४+ होनी चाहिए।",
    },
  },
} as const;

export type TranslationKey = typeof translations;
export type Language = keyof TranslationKey;
