export type Bhajan = {
  id: string;
  title: string;
  deity: string;
  artist: string;
  language: "Hindi" | "Sanskrit" | "Both";
  category: "Bhajan" | "Mantra" | "Aarti" | "Chalisa" | "Stotra";
  youtubeId: string;
  duration: string;
  lyrics: string;
  meaning: string;
  tags: string[];
};

export const bhajans: Bhajan[] = [
  {
    id: "1",
    title: "Hanuman Chalisa",
    deity: "Hanuman",
    artist: "Gulshan Kumar & Hariharan",
    language: "Hindi",
    category: "Chalisa",
    youtubeId: "AETFvQonfV8",
    duration: "9:54",
    tags: ["hanuman", "chalisa", "tuesday", "strength", "devotion"],
    lyrics: `श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि।
बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥

बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुद्धि विद्या देहु मोहिं, हरहु कलेस विकार॥

जय हनुमान ज्ञान गुन सागर।
जय कपीस तिहुँ लोक उजागर॥

राम दूत अतुलित बल धामा।
अंजनि-पुत्र पवनसुत नामा॥`,
    meaning: `Hanuman Chalisa is a 40-verse devotional hymn dedicated to Lord Hanuman. 
Written by Tulsidas in the 16th century, it praises Hanuman's strength, wisdom, and devotion to Lord Rama. 
Reciting it regularly is believed to ward off evil, grant courage, and fulfill wishes. 
Hanuman symbolizes selfless service, bhakti (devotion), and the power of faith.`,
  },
  {
    id: "2",
    title: "Gayatri Mantra",
    deity: "Surya / Savitr",
    artist: "Traditional",
    language: "Sanskrit",
    category: "Mantra",
    youtubeId: "M4GJQzXKaH0",
    duration: "10:00",
    tags: ["gayatri", "mantra", "surya", "wisdom", "morning", "vedic"],
    lyrics: `ॐ भूर्भुवः स्वः
तत्सवितुर्वरेण्यम्
भर्गो देवस्य धीमहि
धियो यो नः प्रचोदयात्`,
    meaning: `The Gayatri Mantra is the most sacred mantra from the Rigveda (3.62.10).
O Divine Creator, you who pervade the earth, atmosphere, and heavens — 
we meditate upon your most adorable radiance.
May that divine light illuminate and guide our intellect.

Reciting 108 times at dawn, noon, and dusk is considered highly auspicious.
It awakens the intellect, purifies the mind, and connects one to the universal consciousness.`,
  },
  {
    id: "3",
    title: "Om Namah Shivaya",
    deity: "Shiva",
    artist: "Pandit Jasraj",
    language: "Sanskrit",
    category: "Mantra",
    youtubeId: "xBQvSS2SOJY",
    duration: "6:10",
    tags: ["shiva", "mantra", "om", "panchakshara", "monday"],
    lyrics: `ॐ नमः शिवाय
ॐ नमः शिवाय
ॐ नमः शिवाय

नागेन्द्रहाराय त्रिलोचनाय
भस्माङ्गरागाय महेश्वराय
नित्याय शुद्धाय दिगम्बराय
तस्मै नकाराय नमः शिवाय`,
    meaning: `Om Namah Shivaya — "I bow to Shiva" — is the Panchakshara (five-syllable) mantra.
Each syllable represents one of the five elements:
Na = Earth, Ma = Water, Shi = Fire, Va = Air, Ya = Sky (Akasha).

This mantra purifies the five elements within the body, dissolves the ego, 
and leads the devotee toward liberation (moksha). 
It is the heart of Shaivite tradition and among the most powerful mantras in existence.`,
  },
  {
    id: "4",
    title: "Jai Jagdish Hare (Aarti)",
    deity: "Vishnu",
    artist: "Anuradha Paudwal",
    language: "Hindi",
    category: "Aarti",
    youtubeId: "R4LwLSEJYHM",
    duration: "7:25",
    tags: ["vishnu", "aarti", "evening", "puja", "lord"],
    lyrics: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।
भक्त जनों के संकट, दास जनों के संकट,
क्षण में दूर करे॥ ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे, दुख बिनसे मन का।
स्वामी दुख बिनसे मन का।
सुख सम्पति घर आवे, सुख सम्पति घर आवे,
कष्ट मिटे तन का॥ ॐ जय जगदीश हरे॥`,
    meaning: `Jai Jagdish Hare is one of the most popular aartis sung across India during evening prayers.
"O Lord of the Universe, Victory to you!" 

This aarti expresses complete surrender to the divine, seeking relief from all suffering.
The devotee praises the Lord who removes sorrows of his devotees in an instant,
and blesses them with happiness, prosperity, and health.
Singing this aarti daily during the evening brings peace and divine blessings.`,
  },
  {
    id: "5",
    title: "Achyutam Keshavam",
    deity: "Krishna",
    artist: "Shankar Mahadevan",
    language: "Sanskrit",
    category: "Bhajan",
    youtubeId: "pI6WFNVpRSs",
    duration: "5:30",
    tags: ["krishna", "vishnu", "bhajan", "devotion", "names"],
    lyrics: `अच्युतम् केशवम् कृष्ण दामोदरम्
राम नारायणम् जानकी वल्लभम्

कौशल्या नन्दनम् दशरथ प्रियम्
भरत वन्दितम् भवबय हारिणम्

अच्युतम् केशवम् कृष्ण दामोदरम्
राम नारायणम् जानकी वल्लभम्`,
    meaning: `Achyutam Keshavam is a beautiful Sanskrit devotional composition glorifying Lord Vishnu and Krishna.
"Achyuta" means the infallible one who never falls.
"Keshava" means the one with beautiful hair, or the slayer of the demon Keshi.
"Damodara" means the one with a rope around the belly — a name for Krishna in his childhood.

This bhajan lists the divine names of Vishnu-Krishna, 
each name holding infinite spiritual power. 
Chanting divine names (Namajapanam) is the simplest and most powerful path in this age (Kali Yuga).`,
  },
  {
    id: "6",
    title: "Mahamrityunjaya Mantra",
    deity: "Shiva",
    artist: "Shankar Sahney",
    language: "Sanskrit",
    category: "Mantra",
    youtubeId: "X5_qB1aMDFU",
    duration: "8:00",
    tags: ["shiva", "healing", "death", "liberation", "health", "maha"],
    lyrics: `ॐ त्र्यम्बकं यजामहे
सुगन्धिं पुष्टिवर्धनम्।
उर्वारुकमिव बन्धनान्
मृत्योर्मुक्षीय मामृतात्॥`,
    meaning: `The Mahamrityunjaya Mantra (Great Death-Conquering Mantra) is from the Rigveda (7.59.12).
"We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings.
May He liberate us from death as a cucumber is severed from the vine,
and grant us immortality."

This mantra is recited for healing illness, overcoming fear of death, 
granting long life, and for the peace of departed souls.
The "three-eyed" (Tryambaka) refers to Shiva's third eye of wisdom.`,
  },
  {
    id: "7",
    title: "Shri Ram Chandra Kripalu",
    deity: "Rama",
    artist: "Lata Mangeshkar",
    language: "Sanskrit",
    category: "Bhajan",
    youtubeId: "2OGvDe9LKLY",
    duration: "6:45",
    tags: ["rama", "bhajan", "classical", "devotion", "ayodhya"],
    lyrics: `श्री राम चन्द्र कृपालु भजु मन
हरण भव भय दारुणम्।
नव कंज लोचन कंज मुख कर,
कंज पद कन्जारुणम्॥

कन्दर्प अगणित अमित छवि,
नव नील नीरद सुन्दरम्।
पट पीत मानहुँ तड़ित रुचि-शुचि,
नौमि जनक सुतावरम्॥`,
    meaning: `Shri Ram Chandra Kripalu is a sublime Sanskrit devotional hymn composed by Goswami Tulsidas.

"O mind, worship Lord Rama, the merciful one who destroys the terrible fear of worldly existence.
His eyes are like fresh lotuses, his face is like a lotus, his hands are like lotuses,
and his feet are lotus-red."

This bhajan describes the divine beauty of Lord Rama through exquisite Sanskrit poetry.
Meditating on Rama's divine form while chanting purifies the mind 
and liberates the devotee from the cycle of birth and death.`,
  },
  {
    id: "8",
    title: "Ganesh Vandana",
    deity: "Ganesha",
    artist: "Suresh Wadkar",
    language: "Sanskrit",
    category: "Stotra",
    youtubeId: "3YSLiJfpW6Q",
    duration: "5:00",
    tags: ["ganesha", "ganpati", "stotra", "beginning", "success", "obstacle"],
    lyrics: `वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥

गणनायकाय गणदेवताय गणाध्यक्षाय धीमहि।
गुणशरीराय गुणमण्डिताय गुणेशानाय धीमहि॥`,
    meaning: `Vakratunda Mahakaya — this famous shloka is recited before beginning any auspicious work.

"O Lord Ganesha with the curved trunk and massive body,
whose radiance is equal to millions of suns —
please make all my endeavors free from obstacles, always."

Lord Ganesha is worshipped as the remover of obstacles (Vighnaharta) and the lord of new beginnings.
He is always invoked first before any prayer, ritual, or important undertaking.
His elephant head symbolizes wisdom; the broken tusk represents sacrifice for knowledge.`,
  },
  {
    id: "9",
    title: "Lakshmi Aarti",
    deity: "Lakshmi",
    artist: "Anuradha Paudwal",
    language: "Hindi",
    category: "Aarti",
    youtubeId: "5CaJMSBqfSw",
    duration: "6:20",
    tags: ["lakshmi", "wealth", "friday", "aarti", "prosperity", "diwali"],
    lyrics: `ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।
तुमको निसदिन सेवत, हरि विष्णु विधाता॥

उमा, रमा, ब्रह्माणी, तुम हो जग-माता।
सूर्य-चन्द्रमा ध्यावत, नारद ऋषि गाता॥

दुर्गा रूप निरंजनी, सुख-सम्पत्ति दाता।
जो कोई तुमको ध्यावत, ऋद्धि-सिद्धि धन पाता॥`,
    meaning: `The Lakshmi Aarti is sung in praise of Goddess Lakshmi, the goddess of wealth, prosperity, and fortune.

"Victory to you, O Mother Lakshmi! Vishnu and Brahma serve you day and night."

Goddess Lakshmi represents not just material wealth but also spiritual abundance, beauty, and grace.
She is worshipped especially on Fridays and during Diwali.
This aarti is traditionally sung after the evening prayer (sandhya puja) 
to invite her blessings of prosperity and well-being into the home.`,
  },
  {
    id: "10",
    title: "Saraswati Vandana",
    deity: "Saraswati",
    artist: "Pt. Bhimsen Joshi",
    language: "Sanskrit",
    category: "Stotra",
    youtubeId: "bEFEbvflHAg",
    duration: "4:30",
    tags: ["saraswati", "education", "wisdom", "art", "basant panchami"],
    lyrics: `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता।
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥
या ब्रह्माच्युतशंकरप्रभृतिभिर्देवैः सदा वन्दिता।
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥`,
    meaning: `"She who is white as the kunda flower, the moon, frost, and garland of pearls,
who is dressed in white garments,
whose hands are adorned with the vina (lute) and the boon-granting staff,
who is seated on a white lotus —

She who is always worshipped by Brahma, Vishnu, and Shiva —
May that Goddess Saraswati protect me and remove all my dullness."

Goddess Saraswati is the divine embodiment of knowledge, music, arts, speech, and wisdom.
Worshipped on Vasant Panchami, students seek her blessings for learning and eloquence.`,
  },
  {
    id: "11",
    title: "Durga Chalisa",
    deity: "Durga",
    artist: "Narendra Chanchal",
    language: "Hindi",
    category: "Chalisa",
    youtubeId: "9XsMNBPwZsA",
    duration: "11:00",
    tags: ["durga", "navratri", "shakti", "goddess", "chalisa", "power"],
    lyrics: `नमो नमो दुर्गे सुख करनी।
नमो नमो अम्बे दुःख हरनी॥

निराकार है ज्योति तुम्हारी।
तिहूँ लोक फैली उजियारी॥

शशि ललाट मुख महाविशाला।
नेत्र लाल भृकुटि विकराला॥`,
    meaning: `Durga Chalisa is a 40-verse devotional hymn in praise of Goddess Durga, the embodiment of divine feminine power.

"Salutations to Durga, the giver of happiness. 
Salutations to Amba, the remover of sorrows."

Goddess Durga represents the supreme power (Shakti) that overcomes evil.
She rides a lion and carries weapons in her many arms to battle the demons of the universe.
The nine nights of Navratri are dedicated to her nine forms.
Reciting the Durga Chalisa grants protection, removes fear, and bestows strength.`,
  },
  {
    id: "12",
    title: "Shyam Teri Bansi",
    deity: "Krishna",
    artist: "Anup Jalota",
    language: "Hindi",
    category: "Bhajan",
    youtubeId: "oVppOxvU77A",
    duration: "7:15",
    tags: ["krishna", "vrindavan", "bansi", "flute", "bhajan", "love"],
    lyrics: `श्याम तेरी बंसी पुकारे राधा नाम।
अँखियाँ तरसें दर्शन को, लगे न मोहे काम॥

बृन्दावन की गली गली में, रास रचाया।
गोपियों संग खेले होली, रंग लगाया॥

मन मोहन मनोहर, मोहना मेरे राम।
श्याम तेरी बंसी पुकारे राधा नाम॥`,
    meaning: `"O Shyam (Krishna), your flute calls out Radha's name.
My eyes long for your vision; nothing else interests me."

This beautiful bhajan captures the essence of Bhakti — the longing of the soul for the divine.
Lord Krishna's flute (Murali/Bansi) represents the divine call that awakens spiritual yearning.

The gopika women of Vrindavan represent souls fully surrendered to God.
Vrindavan is considered the most sacred place on earth — the eternal playground of Krishna.
This bhajan is especially beloved among devotees of the Vaishnava tradition.`,
  },
];
