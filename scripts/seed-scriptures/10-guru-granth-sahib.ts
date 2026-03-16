/**
 * Seed data for Sri Guru Granth Sahib
 *
 * The Guru Granth Sahib is the eternal, living Guru of the Sikhs.
 * It is a compilation of devotional hymns (shabads) composed by six Sikh Gurus,
 * fifteen Hindu and Muslim saints (Bhagats), and eleven Bhatts (bards).
 * Compiled primarily by Guru Arjan Dev Ji (fifth Guru) in 1604 CE and
 * finalized by Guru Gobind Singh Ji (tenth Guru) in 1708 CE.
 *
 * All Gurmukhi text is provided with deep reverence.
 * Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.
 */

export const scripture = {
  id: "guru-granth-sahib",
  name: "Guru Granth Sahib",
  name_sanskrit: "ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ",
  tradition: "Sikhism",
  category: "Granth",
  total_verses: 50,
  total_chapters: 1,
  summary:
    "The eternal Guru of the Sikhs — a sacred compilation of devotional hymns by Sikh Gurus, Hindu saints, and Sufi mystics. It teaches the unity of God, equality of all beings, and the path of honest living and selfless service.",
  accent_color: "hsl(45,80%,45%)",
  is_free: false,
  sort_order: 9,
};

export const chapters = [
  {
    id: "guru-granth-sahib-selected",
    scripture_id: "guru-granth-sahib",
    number: 1,
    title: "Selected Shabads",
    subtitle: "Key Hymns from Sri Guru Granth Sahib",
    summary:
      "A curated selection of the most beloved and profound shabads (hymns) from the Guru Granth Sahib, spanning the compositions of Guru Nanak, Guru Arjan, Guru Tegh Bahadur, Bhagat Kabir, Sheikh Farid, and others.",
    total_verses: 50,
    is_free: false,
    sort_order: 1,
  },
];

export const verses = [
  // ──────────────────────────────────────────────
  // 1. Mool Mantar — The Foundational Prayer
  // ──────────────────────────────────────────────
  {
    id: "ggs-1",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 1,
    sanskrit:
      "ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
    transliteration:
      "Ik Onkaar Sat Naam Kartaa Purakh Nirbhau Nirvair Akaal Moorat Ajooni Saibhang Gur Prasaad.",
    meaning:
      "There is One Universal Creator God. Truth is His Name. He is the Creative Being. Without fear. Without enmity. Undying Form. Unborn. Self-illuminated. Realized by the Guru's Grace.",
    word_meanings:
      "Ik Onkaar: One Universal Creator; Sat Naam: True Name; Kartaa Purakh: Creative Being; Nirbhau: Without fear; Nirvair: Without enmity; Akaal Moorat: Undying Form; Ajooni: Unborn; Saibhang: Self-illuminated; Gur Prasaad: by the Guru's Grace",
    is_key_verse: true,
    sort_order: 0,
  },

  // ──────────────────────────────────────────────
  // 2–6. Japji Sahib — Key Pauris (Guru Nanak Dev Ji)
  // ──────────────────────────────────────────────
  {
    id: "ggs-2",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 2,
    sanskrit:
      "ਸੋਚੈ ਸੋਚਿ ਨ ਹੋਵਈ ਜੇ ਸੋਚੀ ਲਖ ਵਾਰ ॥ ਚੁਪੈ ਚੁਪ ਨ ਹੋਵਈ ਜੇ ਲਾਇ ਰਹਾ ਲਿਵ ਤਾਰ ॥ ਭੁਖਿਆ ਭੁਖ ਨ ਉਤਰੀ ਜੇ ਬੰਨਾ ਪੁਰੀਆ ਭਾਰ ॥ ਸਹਸ ਸਿਆਣਪਾ ਲਖ ਹੋਹਿ ਤ ਇਕ ਨ ਚਲੈ ਨਾਲਿ ॥ ਕਿਵ ਸਚਿਆਰਾ ਹੋਈਐ ਕਿਵ ਕੂੜੈ ਤੁਟੈ ਪਾਲਿ ॥ ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਖਿਆ ਨਾਲਿ ॥੧॥",
    transliteration:
      "Sochai soch na hova-ee je sochee lakh vaar. Chupai chup na hova-ee je laa-e rahaa liv taar. Bhukhiaa bhukh na utree je bannaa pureeaa bhaar. Sahas siaanpaa lakh hohi ta ik na chalai naal. Kiv sachiaaraa ho-ee-ai kiv koorhai tutai paal. Hukam rajaa-ee chalnaa Naanak likhiaa naal. ||1||",
    meaning:
      "By thinking, one cannot reduce thoughts, even by thinking hundreds of thousands of times. By remaining silent, inner stillness is not obtained, even by remaining lovingly absorbed deep within. The hunger of the hungry is not appeased, even by piling up loads of worldly goods. Hundreds of thousands of clever tricks do not even work. So how can one become truthful? How can the veil of falsehood be torn away? O Nanak, it is written that one must walk in the way of His Will. ||1||",
    word_meanings:
      "Sochai: by thinking; Soch: thoughts; Lakh vaar: hundreds of thousands of times; Chupai: by remaining silent; Liv taar: deep continuous absorption; Bhukhiaa: of the hungry; Pureeaa bhaar: loads of worldly goods; Sahas: thousands; Siaanpaa: clever tricks; Sachiaaraa: truthful; Koorhai: falsehood; Paal: veil; Hukam: Divine Will; Rajaa-ee: in His pleasure; Likhiaa naal: as written",
    is_key_verse: true,
    sort_order: 1,
  },
  {
    id: "ggs-3",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 3,
    sanskrit:
      "ਹੁਕਮੀ ਹੋਵਨਿ ਆਕਾਰ ਹੁਕਮੁ ਨ ਕਹਿਆ ਜਾਈ ॥ ਹੁਕਮੀ ਹੋਵਨਿ ਜੀਅ ਹੁਕਮਿ ਮਿਲੈ ਵਡਿਆਈ ॥ ਹੁਕਮੀ ਉਤਮੁ ਨੀਚੁ ਹੁਕਮਿ ਲਿਖਿ ਦੁਖ ਸੁਖ ਪਾਈਅਹਿ ॥ ਇਕਨਾ ਹੁਕਮੀ ਬਖਸੀਸ ਇਕਿ ਹੁਕਮੀ ਸਦਾ ਭਵਾਈਅਹਿ ॥ ਹੁਕਮੈ ਅੰਦਰਿ ਸਭੁ ਕੋ ਬਾਹਰਿ ਹੁਕਮ ਨ ਕੋਇ ॥ ਨਾਨਕ ਹੁਕਮੈ ਜੇ ਬੁਝੈ ਤ ਹਉਮੈ ਕਹੈ ਨ ਕੋਇ ॥੨॥",
    transliteration:
      "Hukmee hovan aakaar hukam na kahiaa jaa-ee. Hukmee hovan jee-a hukam milai vadiaa-ee. Hukmee utam neech hukam likh dukh sukh paa-ee-ah. Iknaa hukmee bakhsees ik hukmee sadaa bhavaa-ee-ah. Hukmai andar sabh ko baahar hukam na ko-e. Naanak hukmai je bujhai ta haumai kahai na ko-e. ||2||",
    meaning:
      "By His Command, all forms come into being; His Command cannot be described. By His Command, beings are created; by His Command, glory is obtained. By His Command, some are high and some are low; by His written Command, pain and pleasure are experienced. Some, by His Command, receive blessings; others, by His Command, wander in cycles forever. Everyone is subject to His Command; no one is beyond it. O Nanak, one who understands His Command does not speak in ego. ||2||",
    word_meanings:
      "Hukmee: by His Command; Aakaar: forms; Jee-a: beings; Vadiaa-ee: glory; Utam: high; Neech: low; Likh: written; Dukh: pain; Sukh: pleasure; Bakhsees: blessings; Bhavaa-ee-ah: wander in cycles; Andar: within; Sabh ko: everyone; Haumai: ego",
    is_key_verse: true,
    sort_order: 2,
  },
  {
    id: "ggs-4",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 4,
    sanskrit:
      "ਗਾਵੈ ਕੋ ਤਾਣੁ ਹੋਵੈ ਕਿਸੈ ਤਾਣੁ ॥ ਗਾਵੈ ਕੋ ਦਾਤਿ ਜਾਣੈ ਨੀਸਾਣੁ ॥ ਗਾਵੈ ਕੋ ਗੁਣ ਵਡਿਆਈਆ ਚਾਰ ॥ ਗਾਵੈ ਕੋ ਵਿਦਿਆ ਵਿਖਮੁ ਵੀਚਾਰੁ ॥ ਗਾਵੈ ਕੋ ਸਾਜਿ ਕਰੈ ਤਨੁ ਖੇਹ ॥ ਗਾਵੈ ਕੋ ਜੀਅ ਲੈ ਫਿਰਿ ਦੇਹ ॥ ਗਾਵੈ ਕੋ ਜਾਪੈ ਦਿਸੈ ਦੂਰਿ ॥ ਗਾਵੈ ਕੋ ਵੇਖੈ ਹਾਦਰਾ ਹਦੂਰਿ ॥",
    transliteration:
      "Gaavai ko taan hovai kisai taan. Gaavai ko daat jaanai neesaan. Gaavai ko gun vadiaa-ee-aa chaar. Gaavai ko vidiaa vikham veechaar. Gaavai ko saaj karai tan kheh. Gaavai ko jee-a lai fir deh. Gaavai ko jaapai disai door. Gaavai ko vekhai haadraa hadoor.",
    meaning:
      "Some sing of His Power — who has that Power? Some sing of His Gifts, knowing His Sign. Some sing of His Glorious Virtues and His Greatness. Some sing of knowledge, contemplating His deep wisdom. Some sing that He fashions the body and then reduces it to dust. Some sing that He takes life away and then restores it again. Some sing that He seems so far away. Some sing that He watches over us, face to face, ever-present.",
    word_meanings:
      "Gaavai ko: some sing; Taan: power; Daat: gifts; Neesaan: sign; Gun: virtues; Vadiaa-ee-aa: greatness; Chaar: beauty; Vidiaa: knowledge; Vikham: deep/difficult; Veechaar: contemplation; Saaj: fashions; Tan: body; Kheh: dust; Jee-a: life; Deh: gives; Jaapai: seems; Disai: appears; Door: far away; Haadraa hadoor: face to face, ever-present",
    is_key_verse: true,
    sort_order: 3,
  },
  {
    id: "ggs-5",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 5,
    sanskrit:
      "ਆਖਾ ਜੀਵਾ ਵਿਸਰੈ ਮਰਿ ਜਾਉ ॥ ਆਖਣਿ ਅਉਖਾ ਸਾਚਾ ਨਾਉ ॥ ਸਾਚੇ ਨਾਮ ਕੀ ਲਾਗੈ ਭੂਖ ॥ ਉਤੁ ਭੂਖੈ ਖਾਇ ਚਲੀਅਹਿ ਦੂਖ ॥",
    transliteration:
      "Aakhaa jeevaa visrai mar jaa-o. Aakhan aukhaa saachaa naa-o. Saache naam kee laagai bhookh. Ut bhookhai khaa-e chalee-ah dookh.",
    meaning:
      "Chanting the Name, I live. Forgetting it, I die. It is so difficult to chant the True Name. If one feels the hunger for the True Name, that hunger consumes all sorrows.",
    word_meanings:
      "Aakhaa: chanting; Jeevaa: I live; Visrai: forgetting; Mar jaa-o: I die; Aakhan: to chant; Aukhaa: difficult; Saachaa naa-o: True Name; Bhookh: hunger; Dookh: sorrows; Khaa-e: consumes",
    is_key_verse: true,
    sort_order: 4,
  },
  {
    id: "ggs-6",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 6,
    sanskrit:
      "ਸੁਣਿਐ ਸਿਧ ਪੀਰ ਸੁਰਿ ਨਾਥ ॥ ਸੁਣਿਐ ਧਰਤਿ ਧਵਲ ਆਕਾਸ਼ ॥ ਸੁਣਿਐ ਦੀਪ ਲੋਅ ਪਾਤਾਲ ॥ ਸੁਣਿਐ ਪੋਹਿ ਨ ਸਕੈ ਕਾਲੁ ॥ ਨਾਨਕ ਭਗਤਾ ਸਦਾ ਵਿਗਾਸੁ ॥ ਸੁਣਿਐ ਦੂਖ ਪਾਪ ਕਾ ਨਾਸੁ ॥੮॥",
    transliteration:
      "Suniai sidh peer sur naath. Suniai dharat dhaval aakaash. Suniai deep lo-a paataal. Suniai pohi na sakai kaal. Naanak bhagtaa sadaa vigaas. Suniai dookh paap kaa naas. ||8||",
    meaning:
      "By listening — one attains the status of the Siddhas, the Pirs, the Suras, and the Naths. By listening — one comes to understand the earth, its support, and the sky. By listening — one knows the continents, the worlds, and the nether regions. By listening — Death cannot touch you. O Nanak, the devotees are forever in bliss. By listening — sorrow and sin are erased. ||8||",
    word_meanings:
      "Suniai: by listening; Sidh: adepts; Peer: Muslim saints; Sur: gods; Naath: masters; Dharat: earth; Dhaval: its support; Aakaash: sky; Deep: continents; Lo-a: worlds; Paataal: nether regions; Pohi na sakai: cannot touch; Kaal: death; Bhagtaa: devotees; Vigaas: bliss; Dookh: sorrow; Paap: sin; Naas: erased",
    is_key_verse: false,
    sort_order: 5,
  },

  // ──────────────────────────────────────────────
  // 7–12. Famous Shabads by Guru Nanak Dev Ji
  // ──────────────────────────────────────────────
  {
    id: "ggs-7",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 7,
    sanskrit:
      "ਪਵਣੁ ਗੁਰੂ ਪਾਣੀ ਪਿਤਾ ਮਾਤਾ ਧਰਤਿ ਮਹਤੁ ॥ ਦਿਵਸੁ ਰਾਤਿ ਦੁਇ ਦਾਈ ਦਾਇਆ ਖੇਲੈ ਸਗਲ ਜਗਤੁ ॥ ਚੰਗਿਆਈਆ ਬੁਰਿਆਈਆ ਵਾਚੈ ਧਰਮੁ ਹਦੂਰਿ ॥ ਕਰਮੀ ਆਪੋ ਆਪਣੀ ਕੇ ਨੇੜੈ ਕੇ ਦੂਰਿ ॥ ਜਿਨੀ ਨਾਮੁ ਧਿਆਇਆ ਗਏ ਮਸਕਤਿ ਘਾਲਿ ॥ ਨਾਨਕ ਤੇ ਮੁਖ ਉਜਲੇ ਕੇਤੀ ਛੁਟੀ ਨਾਲਿ ॥੧॥",
    transliteration:
      "Pavan guroo paanee pitaa maataa dharat mahat. Divas raat du-e daa-ee daa-iaa khelai sagal jagat. Changiaa-ee-aa buriaa-ee-aa vaachai dharam hadoor. Karmee aapo aapnee ke nerhai ke door. Jinee naam dhiaa-iaa ga-e maskat ghaal. Naanak te mukh ujle ketee chhutee naal. ||1||",
    meaning:
      "Air is the Guru, Water is the Father, and Earth is the Great Mother. Day and night are the two nurses, in whose lap the entire world plays. Good deeds and bad are assessed in the Presence of Dharma. By one's own actions, some are drawn closer and some are driven farther away. Those who have meditated on the Name and departed after effort and toil — O Nanak, their faces are radiant, and many others are liberated along with them. ||1||",
    word_meanings:
      "Pavan: air; Guroo: teacher; Paanee: water; Pitaa: father; Maataa: mother; Dharat: earth; Mahat: great; Divas: day; Raat: night; Daa-ee: nurses; Khelai: plays; Sagal jagat: entire world; Changiaa-ee-aa: good deeds; Buriaa-ee-aa: bad deeds; Vaachai: assessed; Dharam: Dharma/righteousness; Hadoor: in the Presence; Karmee: by actions; Nerhai: near; Door: far; Naam: Name; Dhiaa-iaa: meditated; Maskat ghaal: toil and effort; Mukh ujle: radiant faces; Chhutee: liberated",
    is_key_verse: false,
    sort_order: 6,
  },
  {
    id: "ggs-8",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 8,
    sanskrit:
      "ਧਨਾਸਰੀ ਮਹਲਾ ੧ ॥ ਗਗਨ ਮੈ ਥਾਲੁ ਰਵਿ ਚੰਦੁ ਦੀਪਕ ਬਨੇ ਤਾਰਿਕਾ ਮੰਡਲ ਜਨਕ ਮੋਤੀ ॥ ਧੂਪੁ ਮਲਆਨਲੋ ਪਵਣੁ ਚਵਰੋ ਕਰੇ ਸਗਲ ਬਨਰਾਇ ਫੂਲੰਤ ਜੋਤੀ ॥੧॥ ਕੈਸੀ ਆਰਤੀ ਹੋਇ ਭਵ ਖੰਡਨਾ ਤੇਰੀ ਆਰਤੀ ॥",
    transliteration:
      "Dhanaasiree mahlaa 1. Gagan mai thaal rav chand deepak bane taarikaa mandal janak motee. Dhoop mal-aanlo pavan chavro kare sagal banraa-e phoolant jotee. ||1|| Kaisee aartee ho-e bhav khandnaa teree aartee.",
    meaning:
      "Upon the plate of the sky, the sun and moon are the lamps; the stars and their constellations are the pearls. The fragrance of sandalwood is the incense, the wind is the fan, and all the forests are the flowers, O Luminous Lord. ||1|| What a beautiful Aartee, O Destroyer of fear, this is Your worship ceremony.",
    word_meanings:
      "Gagan: sky; Thaal: plate; Rav: sun; Chand: moon; Deepak: lamps; Taarikaa mandal: constellations of stars; Janak motee: pearls; Dhoop: incense; Mal-aanlo: sandalwood fragrance; Pavan: wind; Chavro: fan; Sagal banraa-e: all forests; Phoolant: flowers; Jotee: Luminous Lord; Aartee: worship ceremony; Bhav khandnaa: Destroyer of fear",
    is_key_verse: false,
    sort_order: 7,
  },
  {
    id: "ggs-9",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 9,
    sanskrit:
      "ਨਾਨਕ ਦੁਖੀਆ ਸਭੁ ਸੰਸਾਰੁ ॥ ਮੰਨੇ ਨਾਉ ਸੋਈ ਜਿਣਿ ਜਾਇ ॥ ਅਉਰੀ ਕਰਮ ਨ ਲੇਖੈ ਲਾਇ ॥",
    transliteration:
      "Naanak dukhee-aa sabh sansaar. Manne naa-o so-ee jin jaa-e. Auree karam na lekhai laa-e.",
    meaning:
      "O Nanak, the whole world is suffering. Only the one who believes in the Name is victorious. No other action is of any account.",
    word_meanings:
      "Dukhee-aa: suffering; Sabh: whole; Sansaar: world; Manne: believes in; Naa-o: Name; So-ee: that one; Jin jaa-e: is victorious; Auree: other; Karam: actions; Lekhai: account; Laa-e: of any use",
    is_key_verse: false,
    sort_order: 8,
  },
  {
    id: "ggs-10",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 10,
    sanskrit:
      "ਨੀਚਾ ਅੰਦਰਿ ਨੀਚ ਜਾਤਿ ਨੀਚੀ ਹੂ ਅਤਿ ਨੀਚੁ ॥ ਨਾਨਕੁ ਤਿਨ ਕੈ ਸੰਗਿ ਸਾਥਿ ਵਡਿਆ ਸਿਉ ਕਿਆ ਰੀਸ ॥ ਜਿਥੈ ਨੀਚ ਸਮਾਲੀਅਨਿ ਤਿਥੈ ਨਦਰਿ ਤੇਰੀ ਬਖਸੀਸ ॥੪॥੩॥",
    transliteration:
      "Neechaa andar neech jaat neechee hoo at neech. Naanak tin kai sang saath vadiaa si-o ki-aa rees. Jithai neech samaalee-an tithai nadar teree bakhsees. ||4||3||",
    meaning:
      "Nanak seeks the company of the lowest of the low, the very lowest of the low. Why should he try to compete with the great? In that place where the lowly are cared for, there rains Your Grace, O Lord. ||4||3||",
    word_meanings:
      "Neechaa: lowest; Andar: among; Neech jaat: low caste; Hoo at neech: the very lowest; Sang saath: company; Vadiaa: the great; Rees: compete; Jithai: where; Samaalee-an: are cared for; Tithai: there; Nadar: Grace; Bakhsees: blessings",
    is_key_verse: false,
    sort_order: 9,
  },
  {
    id: "ggs-11",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 11,
    sanskrit:
      "ਤਿਲੰਗ ਮਹਲਾ ੧ ॥ ਜੈਸੀ ਮੈ ਆਵੈ ਖਸਮ ਕੀ ਬਾਣੀ ਤੈਸੜਾ ਕਰੀ ਗਿਆਨੁ ਵੇ ਲਾਲੋ ॥ ਪਾਪ ਕੀ ਜੰਞ ਲੈ ਕਾਬਲਹੁ ਧਾਇਆ ਜੋਰੀ ਮੰਗੈ ਦਾਨੁ ਵੇ ਲਾਲੋ ॥",
    transliteration:
      "Tilang mahlaa 1. Jaisee mai aavai khasam kee baanee taisrhaa karee giaan ve laalo. Paap kee janj lai kaablahu dhaa-iaa joree mangai daan ve laalo.",
    meaning:
      "O Lalo, as the Word of the Lord comes to me, so do I express it. The wedding party of sin has come from Kabul, demanding the bride by force, O Lalo.",
    word_meanings:
      "Jaisee: as; Aavai: comes; Khasam: Lord/Master; Baanee: Word; Taisrhaa: so; Karee giaan: I express; Laalo: (Bhai Lalo, Guru Nanak's devoted follower); Paap: sin; Janj: wedding party; Kaablahu: from Kabul; Dhaa-iaa: rushed; Joree: by force; Mangai: demands; Daan: offering/bride",
    is_key_verse: false,
    sort_order: 10,
  },
  {
    id: "ggs-12",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 12,
    sanskrit:
      "ਮਃ ੧ ॥ ਵਿਸਮਾਦੁ ਨਾਦ ਵਿਸਮਾਦੁ ਵੇਦ ॥ ਵਿਸਮਾਦੁ ਜੀਅ ਵਿਸਮਾਦੁ ਭੇਦ ॥ ਵਿਸਮਾਦੁ ਰੂਪ ਵਿਸਮਾਦੁ ਰੰਗ ॥ ਵਿਸਮਾਦੁ ਨਾਗੇ ਫਿਰਹਿ ਜੰਤ ॥ ਵਿਸਮਾਦੁ ਪਉਣੁ ਵਿਸਮਾਦੁ ਪਾਣੀ ॥ ਵਿਸਮਾਦੁ ਅਗਨੀ ਖੇਡਹਿ ਵਿਡਾਣੀ ॥",
    transliteration:
      "Mahlaa 1. Vismaad naad vismaad ved. Vismaad jee-a vismaad bhed. Vismaad roop vismaad rang. Vismaad naage fireh jant. Vismaad pa-un vismaad paanee. Vismaad agnee khedeh vidaanee.",
    meaning:
      "Wonderful is the sound current of the Word, wonderful is the knowledge of the Vedas. Wonderful are the beings, wonderful are the species. Wonderful are the forms, wonderful are the colors. Wonderful are the beings who wander around naked. Wonderful is the wind, wonderful is the water. Wonderful is fire, which works wonders.",
    word_meanings:
      "Vismaad: wonderful/wondrous; Naad: sound current; Ved: Vedas/knowledge; Jee-a: beings; Bhed: species/varieties; Roop: forms; Rang: colors; Naage: naked; Fireh: wander; Jant: creatures; Pa-un: wind; Paanee: water; Agnee: fire; Khedeh vidaanee: works wonders",
    is_key_verse: false,
    sort_order: 11,
  },

  // ──────────────────────────────────────────────
  // 13–18. Key Shabads by Guru Arjan Dev Ji
  // ──────────────────────────────────────────────
  {
    id: "ggs-13",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 13,
    sanskrit:
      "ਗਉੜੀ ਸੁਖਮਨੀ ਮਃ ੫ ॥ ਸਲੋਕੁ ॥ ਆਦਿ ਗੁਰਏ ਨਮਹ ॥ ਜੁਗਾਦਿ ਗੁਰਏ ਨਮਹ ॥ ਸਤਿਗੁਰਏ ਨਮਹ ॥ ਸ੍ਰੀ ਗੁਰਦੇਵਏ ਨਮਹ ॥੧॥ ਅਸਟਪਦੀ ॥ ਸਿਮਰਉ ਸਿਮਰਿ ਸਿਮਰਿ ਸੁਖੁ ਪਾਵਉ ॥ ਕਲਿ ਕਲੇਸ ਤਨ ਮਾਹਿ ਮਿਟਾਵਉ ॥",
    transliteration:
      "Gaurhee Sukhmanee mahlaa 5. Salok. Aad gur-ay namah. Jugaad gur-ay namah. Satgur-ay namah. Sree gurdayv-ay namah. ||1|| Ashtpadee. Simra-o simar simar sukh paava-o. Kal kales tan maahi mitaava-o.",
    meaning:
      "Salutation to the Primal Guru. Salutation to the Guru of the ages. Salutation to the True Guru. Salutation to the Great Divine Guru. ||1|| I meditate, and meditating, meditating, I find peace. The troubles and afflictions of the body are driven away.",
    word_meanings:
      "Aad: primal; Gur-ay: to the Guru; Namah: salutation; Jugaad: of the ages; Satgur-ay: to the True Guru; Sree gurdayv-ay: to the Great Divine Guru; Simra-o: I meditate; Simar: meditating; Sukh: peace; Paava-o: I find; Kal kales: troubles and afflictions; Tan: body; Maahi: within; Mitaava-o: driven away",
    is_key_verse: false,
    sort_order: 12,
  },
  {
    id: "ggs-14",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 14,
    sanskrit:
      "ਮਃ ੫ ॥ ਤੇਰਾ ਕੀਤਾ ਜਾਤੋ ਨਾਹੀ ਮੈਨੋ ਜੋਗੁ ਕੀਤੋਈ ॥ ਮੈ ਨਿਰਗੁਣਿਆਰੇ ਕੋ ਗੁਣੁ ਨਾਹੀ ਆਪੇ ਤਰਸੁ ਪਇਓਈ ॥ ਤਰਸੁ ਪਇਆ ਮਿਹਰਾਮਤਿ ਹੋਈ ਸਤਿਗੁਰੁ ਸਜਣੁ ਮਿਲਿਆ ॥ ਨਾਨਕ ਨਾਮੁ ਮਿਲੈ ਤਾਂ ਜੀਵਾਂ ਤਨੁ ਮਨੁ ਥੀਵੈ ਹਰਿਆ ॥੧॥",
    transliteration:
      "Mahlaa 5. Teraa keetaa jaato naahee maino jog keetoyee. Mai nirguniaaare ko gun naahee aape taras pa-ioyee. Taras pa-iaa mihramat ho-ee satgur sajan miliaa. Naanak naam milai taan jeevaan tan man theevai hariaa. ||1||",
    meaning:
      "I have not appreciated what You have done for me, Lord; only You can make me worthy. I am worthless and without virtue; You have taken pity on me. You took pity on me, showed Your mercy, and I met the True Guru, my Friend. O Nanak, when I receive the Name, I live; my body and mind blossom forth in green. ||1||",
    word_meanings:
      "Teraa keetaa: what You have done; Jaato naahee: not appreciated; Jog: worthy; Nirguniaaare: worthless; Gun: virtue; Aape: You Yourself; Taras: pity; Pa-ioyee: took; Mihramat: mercy; Satgur: True Guru; Sajan: Friend; Naam: Name; Jeevaan: I live; Tan: body; Man: mind; Hariaa: blossoms/green",
    is_key_verse: false,
    sort_order: 13,
  },
  {
    id: "ggs-15",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 15,
    sanskrit:
      "ਮਃ ੫ ॥ ਤੂੰ ਮੇਰਾ ਪਿਤਾ ਤੂੰਹੈ ਮੇਰਾ ਮਾਤਾ ॥ ਤੂੰ ਮੇਰਾ ਬੰਧਪੁ ਤੂੰ ਮੇਰਾ ਭ੍ਰਾਤਾ ॥ ਤੂੰ ਮੇਰਾ ਰਾਖਾ ਸਭਨੀ ਥਾਈ ਤਾ ਭਉ ਕੇਹਾ ਕਾੜਾ ਜੀਉ ॥੧॥",
    transliteration:
      "Mahlaa 5. Toon meraa pitaa toonhai meraa maataa. Toon meraa bandhap toon meraa bhraataa. Toon meraa raakhaa sabhnee thaa-ee taa bha-o kehaa kaarhaa jee-o. ||1||",
    meaning:
      "You are my Father, You are my Mother. You are my Relative, You are my Brother. You are my Protector everywhere; so why should I feel any fear or anxiety? ||1||",
    word_meanings:
      "Toon: You; Meraa: my; Pitaa: Father; Maataa: Mother; Bandhap: relative/kinsman; Bhraataa: Brother; Raakhaa: Protector; Sabhnee thaa-ee: everywhere; Bha-o: fear; Kehaa: what; Kaarhaa: anxiety",
    is_key_verse: false,
    sort_order: 14,
  },
  {
    id: "ggs-16",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 16,
    sanskrit:
      "ਮਃ ੫ ॥ ਜਿਸ ਕੈ ਸਿਮਰਨਿ ਸੂਖੁ ਹੋਇ ॥ ਸਗਲ ਦੂਖ ਜਾਹਿ ਤਿਸ ਕੈ ਸਿਮਰਨਿ ਰੋਗੁ ਨ ਹੋਇ ॥ ਤਿਸ ਕੈ ਸਿਮਰਨਿ ਸਭੁ ਕਿਛੁ ਪਾਈਐ ॥ ਨਾਨਕ ਤਿਸ ਸਿਮਰਿ ਸਿਮਰਿ ਸੁਖੁ ਪਾਈਐ ॥",
    transliteration:
      "Mahlaa 5. Jis kai simran sookh ho-e. Sagal dookh jaahi tis kai simran rog na ho-e. Tis kai simran sabh kichh paa-ee-ai. Naanak tis simar simar sukh paa-ee-ai.",
    meaning:
      "By remembering Him, happiness is obtained. All sorrows depart; by remembering Him, no disease afflicts. By remembering Him, all things are obtained. O Nanak, meditating and meditating on Him, peace is obtained.",
    word_meanings:
      "Jis kai: by whose; Simran: remembrance/meditation; Sookh: happiness; Sagal: all; Dookh: sorrows; Jaahi: depart; Rog: disease; Sabh kichh: all things; Paa-ee-ai: is obtained; Simar: meditating; Sukh: peace",
    is_key_verse: false,
    sort_order: 15,
  },
  {
    id: "ggs-17",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 17,
    sanskrit:
      "ਮਃ ੫ ॥ ਤਾਤੀ ਵਾਉ ਨ ਲਗਈ ਪਾਰਬ੍ਰਹਮ ਸਰਣਾਈ ॥ ਚਉਗਿਰਦ ਹਮਾਰੈ ਰਾਮ ਕਾਰ ਦੁਖੁ ਲਗੈ ਨ ਭਾਈ ॥੧॥ ਸਤਿਗੁਰੁ ਪੂਰਾ ਭੇਟਿਆ ਜਿਨਿ ਬਣਤ ਬਣਾਈ ॥ ਰਾਮ ਨਾਮੁ ਅਉਖਧੁ ਦੀਆ ਏਕਾ ਲਿਵ ਲਾਈ ॥੨॥",
    transliteration:
      "Mahlaa 5. Taatee vaa-o na lag-ee paarbraham sarnaa-ee. Chaugird hamaarai raam kaar dukh lagai na bhaa-ee. ||1|| Satgur pooraa bheti-aa jin banat banaa-ee. Raam naam aukhadh dee-aa ekaa liv laa-ee. ||2||",
    meaning:
      "The hot wind does not even touch one who is under the shelter of the Supreme Lord. On all four sides I am surrounded by the Lord's Circle of Protection; pain does not afflict me, O brother. ||1|| I have met the Perfect True Guru, who has done this. He gave me the medicine of the Lord's Name, and I am absorbed in the One. ||2||",
    word_meanings:
      "Taatee vaa-o: hot wind; Na lag-ee: does not touch; Paarbraham: Supreme Lord; Sarnaa-ee: shelter; Chaugird: all four sides; Hamaarai: around me; Raam kaar: Lord's circle of protection; Dukh: pain; Bhaa-ee: O brother; Satgur pooraa: Perfect True Guru; Bheti-aa: met; Banat banaa-ee: has done this; Aukhadh: medicine; Ekaa liv: absorbed in the One",
    is_key_verse: false,
    sort_order: 16,
  },
  {
    id: "ggs-18",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 18,
    sanskrit:
      "ਮਃ ੫ ॥ ਦੁਖ ਭੰਜਨੁ ਤੇਰਾ ਨਾਮੁ ਜੀ ਦੁਖ ਭੰਜਨੁ ਤੇਰਾ ਨਾਮੁ ॥ ਆਠ ਪਹਰ ਆਰਾਧੀਐ ਪੂਰਨ ਸਤਿਗੁਰ ਗਿਆਨੁ ॥੧॥ ਰਹਾਉ ॥",
    transliteration:
      "Mahlaa 5. Dukh bhanjan teraa naam jee dukh bhanjan teraa naam. Aath pahar aaraadee-ai pooran satgur giaan. ||1|| Rahaa-o.",
    meaning:
      "Your Name is the Destroyer of Sorrow, O Lord, Your Name is the Destroyer of Sorrow. Worship Him twenty-four hours a day; this is the wisdom of the Perfect True Guru. ||1|| Pause.",
    word_meanings:
      "Dukh bhanjan: Destroyer of sorrow; Teraa: Your; Naam: Name; Jee: O Lord; Aath pahar: eight watches / twenty-four hours; Aaraadee-ai: worship; Pooran: Perfect; Satgur: True Guru; Giaan: wisdom; Rahaa-o: Pause (refrain)",
    is_key_verse: false,
    sort_order: 17,
  },

  // ──────────────────────────────────────────────
  // 19–22. Shabads by Bhagat Kabir Ji
  // ──────────────────────────────────────────────
  {
    id: "ggs-19",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 19,
    sanskrit:
      "ਕਬੀਰ ॥ ਮਨੁ ਮੈਲਾ ਸਭੁ ਕਿਛੁ ਮੈਲਾ ਤਨੁ ਧੋਤਾ ਹੋਇ ॥ ਮਨੁ ਹਛਾ ਸਭੁ ਹਛਾ ਜੇ ਮੁੰਡਾ ਕਰੋੜ ਸਮਾਇ ॥",
    transliteration:
      "Kabeer. Man mailaa sabh kichh mailaa tan dhotaa ho-e. Man hachhaa sabh hachhaa je mundaa karorh samaa-e.",
    meaning:
      "O Kabir, when the mind is polluted, everything is polluted, even though the body may be washed clean. When the mind is pure, everything is pure, even if you never bathe at all.",
    word_meanings:
      "Man: mind; Mailaa: polluted; Sabh kichh: everything; Tan: body; Dhotaa: washed; Hachhaa: pure/clean; Mundaa: shaven-headed (bathing rituals); Karorh: ten million; Samaa-e: times",
    is_key_verse: false,
    sort_order: 18,
  },
  {
    id: "ggs-20",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 20,
    sanskrit:
      "ਕਬੀਰ ॥ ਮਾਟੀ ਕਹੈ ਕੁਮ੍ਹਿਆਰ ਕਉ ਤੂ ਕਿਆ ਰੌਂਦੈ ਮੋਹਿ ॥ ਇਕ ਦਿਨ ਐਸਾ ਆਵੈਗਾ ਮੈ ਰੌਂਦੂੰਗੀ ਤੋਹਿ ॥੧੬੪॥",
    transliteration:
      "Kabeer. Maatee kahai kumhiaar ka-o too kiaa raundai mohi. Ik din aisaa aavaigaa mai raundoongee tohi. ||164||",
    meaning:
      "O Kabir, the clay says to the potter: Why do you trample me? One day will come when I shall trample you. ||164||",
    word_meanings:
      "Maatee: clay; Kahai: says; Kumhiaar: potter; Ka-o: to; Too: you; Kiaa: why; Raundai: trample; Mohi: me; Ik din: one day; Aisaa: such; Aavaigaa: will come; Raundoongee: I shall trample; Tohi: you",
    is_key_verse: false,
    sort_order: 19,
  },
  {
    id: "ggs-21",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 21,
    sanskrit:
      "ਕਬੀਰ ॥ ਅਵਲਿ ਅਲਹ ਨੂਰੁ ਉਪਾਇਆ ਕੁਦਰਤਿ ਕੇ ਸਭ ਬੰਦੇ ॥ ਏਕ ਨੂਰ ਤੇ ਸਭੁ ਜਗੁ ਉਪਜਿਆ ਕਉਣ ਭਲੇ ਕੋ ਮੰਦੇ ॥੧॥",
    transliteration:
      "Kabeer. Aval alah noor upaa-iaa kudrat ke sabh bande. Ek noor te sabh jag upji-aa ka-un bhale ko mande. ||1||",
    meaning:
      "O Kabir, first God created the Light; by His creative power, He made all beings. From the One Light, the entire world sprang forth. So who is good and who is bad? ||1||",
    word_meanings:
      "Aval: first; Alah: God; Noor: Light; Upaa-iaa: created; Kudrat: creative power; Sabh: all; Bande: beings/people; Ek noor te: from the One Light; Jag: world; Upji-aa: sprang forth; Ka-un: who; Bhale: good; Mande: bad",
    is_key_verse: false,
    sort_order: 20,
  },
  {
    id: "ggs-22",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 22,
    sanskrit:
      "ਕਬੀਰ ॥ ਜਬ ਹਮ ਹੋਤੇ ਤਬ ਤੂ ਨਾਹੀ ਅਬ ਤੂਹੀ ਮੈ ਨਾਹੀ ॥ ਅਨਲ ਅਗਮ ਜੈਸੇ ਲਹਰਿ ਮਈ ਓਦਧਿ ਜਲ ਕੇਵਲ ਜਲ ਮਾਂਹੀ ॥੨॥",
    transliteration:
      "Kabeer. Jab ham hote tab too naahee ab toohee mai naahee. Anal agam jaise lahar ma-ee odadh jal keval jal maanhee. ||2||",
    meaning:
      "O Kabir, when I existed (in ego), You were not present. Now You alone are, and I am not. Like the waves of an unfathomable ocean — when the waves rise, it is still only water within water. ||2||",
    word_meanings:
      "Jab: when; Ham: I/we; Hote: existed; Tab: then; Too: You; Naahee: were not; Ab: now; Toohee: You alone; Mai naahee: I am not; Anal: immeasurable; Agam: unfathomable; Jaise: like; Lahar: waves; Ma-ee: in; Odadh: ocean; Jal: water; Keval: only; Maanhee: within",
    is_key_verse: false,
    sort_order: 21,
  },

  // ──────────────────────────────────────────────
  // 23–25. Shabads by Sheikh Farid Ji
  // ──────────────────────────────────────────────
  {
    id: "ggs-23",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 23,
    sanskrit:
      "ਫਰੀਦਾ ਬੁਰੇ ਦਾ ਭਲਾ ਕਰਿ ਗੁਸਾ ਮਨਿ ਨ ਹਢਾਇ ॥ ਦੇਹੀ ਰੋਗੁ ਨ ਲਗਈ ਪਲੈ ਸਭੁ ਕਿਛੁ ਪਾਇ ॥੭੮॥",
    transliteration:
      "Fareedaa bure daa bhalaa kar gusaa man na hadhaa-e. Dehee rog na lag-ee palai sabh kichh paa-e. ||78||",
    meaning:
      "O Farid, answer evil with goodness; do not let anger fill your mind. Your body shall not suffer from any disease, and you shall obtain everything. ||78||",
    word_meanings:
      "Fareedaa: O Farid; Bure: evil; Daa: of; Bhalaa: good; Kar: do; Gusaa: anger; Man: mind; Na hadhaa-e: do not fill; Dehee: body; Rog: disease; Na lag-ee: shall not touch; Palai: in your lap; Sabh kichh: everything; Paa-e: obtain",
    is_key_verse: false,
    sort_order: 22,
  },
  {
    id: "ggs-24",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 24,
    sanskrit:
      "ਫਰੀਦਾ ਖਾਲਕੁ ਖਲਕ ਮਹਿ ਖਲਕ ਵਸੈ ਰਬ ਮਾਹਿ ॥ ਮੰਦਾ ਕਿਸ ਨੋ ਆਖੀਐ ਜਾਂ ਤਿਸੁ ਬਿਨੁ ਕੋਈ ਨਾਹਿ ॥੭੫॥",
    transliteration:
      "Fareedaa khaalak khalak mahi khalak vasai rab maahi. Mandaa kis no aakhee-ai jaan tis bin ko-ee naahi. ||75||",
    meaning:
      "O Farid, the Creator is in the creation, and the creation abides in the Creator. Whom should we call bad? There is no one without Him. ||75||",
    word_meanings:
      "Fareedaa: O Farid; Khaalak: Creator; Khalak: creation; Mahi: in; Vasai: abides; Rab: God; Maahi: within; Mandaa: bad; Kis no: whom; Aakhee-ai: should we call; Jaan: when; Tis bin: without Him; Ko-ee naahi: there is no one",
    is_key_verse: false,
    sort_order: 23,
  },
  {
    id: "ggs-25",
    scripture_id: "guru-granth-sahib",
    chapter_id: "guru-granth-sahib-selected",
    verse_number: 25,
    sanskrit:
      "ਫਰੀਦਾ ਜੇ ਤੂ ਅਕਲਿ ਲਤੀਫੁ ਕਾਲੇ ਲਿਖੁ ਨ ਲੇਖ ॥ ਆਪਨੜੇ ਗਿਰੀਵਾਨ ਮਹਿ ਸਿਰੁ ਨੀਵਾਂ ਕਰਿ ਡੇਖੁ ॥੬॥",
    transliteration:
      "Fareedaa je too akal lateef kaale likh na lekh. Aapnarhe gireevaan mahi sir neevaan kar dekh. ||6||",
    meaning:
      "O Farid, if you have a keen understanding, do not write blackened marks against anyone else. Look underneath your own collar instead (examine your own faults). ||6||",
    word_meanings:
      "Fareedaa: O Farid; Je: if; Too: you; Akal: intellect; Lateef: keen/subtle; Kaale: black; Likh: write; Na lekh: do not mark; Aapnarhe: your own; Gireevaan: collar; Mahi: under; Sir: head; Neevaan: lowered; Kar dekh: look and see",
    is_key_verse: false,
    sort_order: 24,
  },
];
