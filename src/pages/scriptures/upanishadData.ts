// ─── Types (shared with gitaData) ─────────────────────────────────────────────

export interface Verse {
  id: string;          // e.g. "isha.1" or "katha.1.2.20"
  upanishad: string;
  section: string;     // e.g. "Verse 1" or "Chapter 1, Section 2"
  sanskrit: string;
  transliteration: string;
  meaning: string;
  word_meanings?: string;
}

export interface UpanishadChapter {
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  total_verses: number;
  verses: Verse[];
}

export interface Upanishad {
  id: string;
  name: string;
  sanskrit: string;
  tradition: string;   // which Veda it belongs to
  summary: string;
  chapters: UpanishadChapter[];
}

// ─── Upanishads Data ──────────────────────────────────────────────────────────

export const upanishads: Upanishad[] = [
  {
    id: "isha",
    name: "Isha Upanishad",
    sanskrit: "ईशावास्योपनिषद्",
    tradition: "Shukla Yajurveda",
    summary: "The shortest and perhaps most profound of all Upanishads, with only 18 verses. It teaches the vision of the Supreme Self pervading all existence, and reconciles the active and contemplative paths of life.",
    chapters: [
      {
        number: 1,
        title: "The Isha Upanishad",
        subtitle: "All is pervaded by the Lord",
        summary: "The Isha Upanishad presents 18 sublime mantras that form the foundation of Vedantic thought. The text opens with the mahavakya that the entire universe is pervaded by the Lord, and teaches that one must renounce attachment while still performing one's duties.",
        total_verses: 18,
        verses: [
          {
            id: "isha.1",
            upanishad: "Isha",
            section: "Verse 1",
            sanskrit: "ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम्॥",
            transliteration: "Isavasyam idam sarvam yat kinca jagatyam jagat,\ntena tyaktena bhunjitha ma grdhah kasya svid dhanam.",
            meaning: "All this — whatever exists in this changing universe — is pervaded by the Lord. Protect yourself through that renunciation. Do not covet the wealth of anyone.",
            word_meanings: "isa — by the Lord; avasyam — must be pervaded; idam — this; sarvam — all; yat — whatever; kinca — everything; jagatyam — in the universe; jagat — all that is changing; tena — by Him; tyaktena — through renunciation; bhunjitha — you should enjoy; ma — do not; grdhah — covet; kasya svit — of anyone; dhanam — wealth.",
          },
          {
            id: "isha.2",
            upanishad: "Isha",
            section: "Verse 2",
            sanskrit: "कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः।\nएवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे॥",
            transliteration: "Kurvanneveha karmani jijivisec chatam samah,\nevam tvayi nanyatheto 'sti na karma lipyate nare.",
            meaning: "Performing actions here, one should wish to live a hundred years. Thus it is for you — there is no other way. Action does not cling to a person who lives thus.",
            word_meanings: "kurvan — performing; eva — certainly; iha — here; karmani — actions; jijiviset — should wish to live; satam — hundred; samah — years; evam — thus; tvayi — for you; na — not; anyatha — otherwise; itah — from this; asti — there is; na — not; karma — action; lipyate — clings; nare — to a person.",
          },
          {
            id: "isha.6",
            upanishad: "Isha",
            section: "Verse 6",
            sanskrit: "यस्तु सर्वाणि भूतान्यात्मन्येवानुपश्यति।\nसर्वभूतेषु चात्मानं ततो न विजुगुप्सते॥",
            transliteration: "Yas tu sarvani bhutany atmany evanupassyati,\nsarva-bhutesu catmanam tato na vijugupsate.",
            meaning: "One who sees all beings in the Self alone, and the Self in all beings, feels no hatred by virtue of that understanding.",
            word_meanings: "yah — who; tu — but; sarvani — all; bhutani — beings; atmani — in the Self; eva — certainly; anupasyati — sees; sarva-bhutesu — in all beings; ca — and; atmanam — the Self; tatah — therefore; na — not; vijugupsate — hates.",
          },
          {
            id: "isha.7",
            upanishad: "Isha",
            section: "Verse 7",
            sanskrit: "यस्मिन्सर्वाणि भूतान्यात्मैवाभूद्विजानतः।\nतत्र को मोहः कः शोक एकत्वमनुपश्यतः॥",
            transliteration: "Yasmin sarvani bhutany atmaivabhud vijanatah,\ntatra ko mohah kah soka ekatvam anupasyatah.",
            meaning: "When, to one who knows, all beings have become the very Self — then what delusion, what sorrow can there be for that seer of oneness?",
            word_meanings: "yasmin — when; sarvani — all; bhutani — beings; atma — Self; eva — certainly; abhut — become; vijanatah — for the knower; tatra — there; kah — what; mohah — delusion; kah — what; sokah — sorrow; ekatvam — oneness; anupasyatah — for one who sees.",
          },
          {
            id: "isha.15",
            upanishad: "Isha",
            section: "Verse 15",
            sanskrit: "हिरण्मयेन पात्रेण सत्यस्यापिहितं मुखम्।\nतत्त्वं पूषन्नपावृणु सत्यधर्माय दृष्टये॥",
            transliteration: "Hiranmayena patrena satyasyapihitam mukham,\ntat tvam pusan apavrnu satyadharmaya drstaye.",
            meaning: "The face of Truth is covered by a golden vessel. O Pushan, remove it so that I, who am devoted to Truth, may behold it.",
            word_meanings: "hiranmayena — golden; patrena — by a vessel; satyasya — of Truth; apihitam — covered; mukham — face; tat — that; tvam — you; pusan — O Sun, O nourisher; apavrnu — remove; satyadharmaya — devoted to truth; drstaye — for the sake of seeing.",
          },
        ],
      },
    ],
  },
  {
    id: "katha",
    name: "Katha Upanishad",
    sanskrit: "कठोपनिषद्",
    tradition: "Krishna Yajurveda",
    summary: "A profound dialogue between the young Nachiketa and Yama, the god of death. Nachiketa receives the highest knowledge of the immortal Self directly from Death himself. This Upanishad contains the famous teaching on the difference between the pleasant and the good.",
    chapters: [
      {
        number: 1,
        title: "The Dialogue with Death",
        subtitle: "Nachiketa seeks the highest truth",
        summary: "Young Nachiketa arrives at the abode of Yama. Pleased by the boy's persistence, Yama grants him three boons. For the third boon, Nachiketa asks about the mystery of death and the immortal Self.",
        total_verses: 29,
        verses: [
          {
            id: "katha.1.2.20",
            upanishad: "Katha",
            section: "Chapter 1, Section 2, Verse 20",
            sanskrit: "अणोरणीयान्महतो महीयानात्मा गुहायां निहितोऽस्य जन्तोः।\nतमक्रतुः पश्यति वीतशोको धातुः प्रसादान्महिमानमात्मनः॥",
            transliteration: "Anor aniyan mahato mahiyan atma guhayam nihito 'sya jantoh,\ntam akratuh pasyati vita-soko dhatuh prasadan mahimanam atmanah.",
            meaning: "The Self, smaller than the small and greater than the great, is hidden in the heart of the creature. One free from desire, with mind at peace, sees the glory of the Self through the grace of the Creator.",
            word_meanings: "anoh — than the atom; aniyan — smaller; mahatah — than the great; mahiyan — greater; atma — the Self; guhayam — in the cave of the heart; nihitah — hidden; asya — of this; jantoh — creature; tam — that; akratuh — one free from desire; pasyati — sees; vita-sokah — free from sorrow; dhatuh — of the Creator; prasadat — by grace; mahimanam — glory; atmanah — of the Self.",
          },
          {
            id: "katha.1.2.23",
            upanishad: "Katha",
            section: "Chapter 1, Section 2, Verse 23",
            sanskrit: "नायमात्मा प्रवचनेन लभ्यो न मेधया न बहुना श्रुतेन।\nयमेवैष वृणुते तेन लभ्यस्तस्यैष आत्मा विवृणुते तनूं स्वाम्॥",
            transliteration: "Nayam atma pravacanena labhyo na medhaya na bahuna srutena,\nyam evaisah vrnute tena labhyas tasyaisa atma vivrnute tanum svam.",
            meaning: "This Self cannot be attained by study of the scriptures, nor by intelligence, nor by much learning. It is attained by the one whom the Self chooses. To that one, the Self reveals its own nature.",
            word_meanings: "na — not; ayam — this; atma — Self; pravacanena — by lectures; labhyah — attained; na — not; medhaya — by intellect; na — not; bahuna — by much; srutena — by hearing; yam — whom; eva — only; esah — this Self; vrnute — chooses; tena — by that one; labhyah — attained; tasya — of that one; esah — this; atma — Self; vivrnute — reveals; tanum — form; svam — its own.",
          },
          {
            id: "katha.2.1.1",
            upanishad: "Katha",
            section: "Chapter 2, Section 1, Verse 1",
            sanskrit: "परांचि खानि व्यतृणत्स्वयंभूस्तस्मात्पराङ्पश्यति नान्तरात्मन्।\nकश्चिद्धीरः प्रत्यगात्मानमैक्षदावृत्तचक्षुरमृतत्वमिच्छन्॥",
            transliteration: "Paranci khani vyatrnat svayambhus tasmac param pasyati nantaratman,\nkas cid dhirah pratyag atmanam aiksad avritta-caksur amrtatvam icchan.",
            meaning: "The Self-existent Lord pierced the sense organs outward; therefore one sees outward, not the inner Self. But a rare wise person, longing for immortality, turns his gaze inward and sees the inner Self.",
            word_meanings: "paranci — outward; khani — apertures/senses; vyatrnat — pierced; svayambhuh — the Self-existent; tasmat — therefore; param — outward; pasyati — sees; na — not; antar — inner; atman — Self; kascit — some rare; dhirah — wise one; pratyak — inward; atmanam — Self; aiksad — saw; avritta — turned inward; caksuh — eyes; amrtatvam — immortality; icchan — desiring.",
          },
          {
            id: "katha.2.2.15",
            upanishad: "Katha",
            section: "Chapter 2, Section 2, Verse 15 — The Mahavakya",
            sanskrit: "न जायते म्रियते वा विपश्चिन्नायं कुतश्चिन्न बभूव कश्चित्।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
            transliteration: "Na jayate mriyate va vipascin nayam kutascin na babhuva kascit,\najo nityah sasvato 'yam purano na hanyate hanyamane sarire.",
            meaning: "The knowing Self is never born, nor does it die. It has not come from anywhere and has not become anyone. Unborn, eternal, ever-existing, and primeval — it is not slain when the body is slain.",
            word_meanings: "na — not; jayate — born; mriyate — dies; va — or; vipascit — the knower; na — not; ayam — this; kutascit — from anywhere; na — not; babhuva — came to be; kascit — anyone; ajah — unborn; nityah — eternal; sasvata — ever-existing; ayam — this; puranah — primeval; na — not; hanyate — is slain; hanyamane — being slain; sarire — when the body.",
          },
        ],
      },
      {
        number: 2,
        title: "The Two Paths",
        subtitle: "The pleasant vs. the good",
        summary: "Yama explains the two paths available to human beings — the pleasant (preya) and the good (shreya). He reveals the nature of the cosmic Self, the chariot metaphor of the body and soul, and the ultimate teaching on the immortal Atman.",
        total_verses: 25,
        verses: [
          {
            id: "katha.1.2.1",
            upanishad: "Katha",
            section: "Chapter 1, Section 2, Verse 1",
            sanskrit: "श्रेयश्च प्रेयश्च मनुष्यमेतस्तौ सम्परीत्य विविनक्ति धीरः।\nश्रेयो हि धीरोऽभिप्रेयसो वृणीते प्रेयो मन्दो योगक्षेमाद्वृणीते॥",
            transliteration: "Sreyas ca preyas ca manusyam etas tau samparitya vivinakti dhirah,\nsreyo hi dhiro 'bhipreyaso vrnite preyo mando yoga-ksemad vrnite.",
            meaning: "Both the good (shreya) and the pleasant (preya) approach a person. The wise one discriminates between them and chooses the good; the fool chooses the pleasant out of greed and attachment.",
            word_meanings: "sreyah — the good; ca — and; preyah — the pleasant; ca — and; manusyam — a person; etau — these two; samparitya — having approached; vivinakti — discriminates; dhirah — the wise; sreyah — the good; hi — indeed; dhirah — the wise; abhi — certainly; preyasah — than the pleasant; vrnite — chooses; preyah — the pleasant; mandah — the fool; yoga-ksemat — for welfare; vrnite — chooses.",
          },
          {
            id: "katha.3.3",
            upanishad: "Katha",
            section: "Chapter 1, Section 3, Verse 3 — The Chariot",
            sanskrit: "आत्मानं रथिनं विद्धि शरीरं रथमेव तु।\nबुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च॥",
            transliteration: "Atmanam rathinam viddhi sariram ratham eva tu,\nbuddhim tu sarathim viddhi manah pragraham eva ca.",
            meaning: "Know the Self as the master of the chariot, the body as the chariot, the intellect as the charioteer, and the mind as the reins.",
            word_meanings: "atmanam — the Self; rathinam — the owner of the chariot; viddhi — know; sariram — the body; ratham — the chariot; eva — certainly; tu — indeed; buddhim — the intellect; tu — indeed; sarathim — the charioteer; viddhi — know; manah — the mind; pragraham — the reins; eva — certainly; ca — and.",
          },
        ],
      },
    ],
  },
  {
    id: "mandukya",
    name: "Mandukya Upanishad",
    sanskrit: "माण्डूक्योपनिषद्",
    tradition: "Atharvaveda",
    summary: "The shortest Upanishad with only 12 verses, yet considered the most important by Adi Shankaracharya. It reveals the nature of OM (AUM) and the four states of consciousness: waking, dreaming, deep sleep, and the fourth — Turiya.",
    chapters: [
      {
        number: 1,
        title: "The Four States of Consciousness",
        subtitle: "The meaning of OM",
        summary: "These 12 verses form a complete and self-sufficient treatise on consciousness. The Mandukya teaches that all of existence is OM, and that OM contains four quarters corresponding to the four states of consciousness — waking (jagrat), dreaming (svapna), deep sleep (susupti), and the transcendent fourth (turiya).",
        total_verses: 12,
        verses: [
          {
            id: "mandukya.1",
            upanishad: "Mandukya",
            section: "Verse 1",
            sanskrit: "ओमित्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोंकार एव।\nयच्चान्यत्त्रिकालातीतं तदप्योंकार एव॥",
            transliteration: "Om ity etad aksaram idam sarvam tasyopavyakhyanam bhutam bhavad bhavisyad iti sarvam onkara eva,\nyac canyat trikala-atitam tad apy onkara eva.",
            meaning: "All this is OM. A clear explanation of it: all that is past, present and future — all of this is only OM. And whatever is beyond the three times — that too is only OM.",
            word_meanings: "om — the sacred syllable OM; iti — thus; etat — this; aksaram — syllable; idam — this; sarvam — all; tasya — of it; upavyakhyanam — explanation; bhutam — past; bhavat — present; bhavisyat — future; iti — thus; sarvam — all; onkara — OM; eva — only; yat — what; ca — and; anyat — other; trikala — three times; atitam — beyond; tat — that; api — also; onkara — OM; eva — only.",
          },
          {
            id: "mandukya.2",
            upanishad: "Mandukya",
            section: "Verse 2",
            sanskrit: "सर्वं ह्येतद्ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात्॥",
            transliteration: "Sarvam hy etad brahma ayam atma brahma so 'yam atma catuspat.",
            meaning: "All this is indeed Brahman. This Self is Brahman. This very Self has four quarters.",
            word_meanings: "sarvam — all; hi — indeed; etat — this; brahma — Brahman; ayam — this; atma — Self; brahma — Brahman; sah — that; ayam — this; atma — Self; catuspat — four-footed/quartered.",
          },
          {
            id: "mandukya.7",
            upanishad: "Mandukya",
            section: "Verse 7 — Turiya",
            sanskrit: "नान्तःप्रज्ञं न बहिष्प्रज्ञं नोभयतःप्रज्ञं न प्रज्ञानघनं न प्रज्ञं नाप्रज्ञम्।\nअदृष्टमव्यवहार्यमग्राह्यमलक्षणमचिन्त्यमव्यपदेश्यमेकात्मप्रत्ययसारं प्रपञ्चोपशमं शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः॥",
            transliteration: "Nantah-prajnam na bahis-prajnam nobhayatah-prajnam na prajna-ghanam na prajnam naprajnam,\nadrustam avyavaharayam agrahyam alaksanam acintyam avyapadesyam ekatma-pratyaya-saram prapacopasanam santam sivam advaitam caturtham manyante sa atma sa vijneyah.",
            meaning: "The fourth is not that which cognises the internal, nor that which cognises the external, nor that which cognises both. It is not a mass of consciousness; it is not conscious; it is not unconscious. It is unseen, beyond empirical transaction, beyond the reach of senses, without attributes, beyond thought, beyond words. Its essence is the experience of pure consciousness alone. It is the cessation of all phenomena, tranquil, auspicious, non-dual. This is the Self. This is to be realised.",
            word_meanings: "na — not; antah-prajnam — inner consciousness; na — not; bahis-prajnam — outer consciousness; na — not; ubhayatah-prajnam — both; na — not; prajna-ghanam — mass of consciousness; na — not; prajnam — conscious; na — not; aprajnam — unconscious; adrstam — unseen; avyavaharyam — beyond transaction; agrahyam — beyond grasp; alaksanam — without marks; acintyam — beyond thought; avyapadesyam — beyond words; santam — tranquil; sivam — auspicious; advaitam — non-dual; caturtham — the fourth; sa — that; atma — Self; vijneyah — to be realised.",
          },
        ],
      },
    ],
  },
  {
    id: "chandogya",
    name: "Chandogya Upanishad",
    sanskrit: "छान्दोग्योपनिषद्",
    tradition: "Samaveda",
    summary: "One of the oldest and largest Upanishads, famous for the teaching 'Tat Tvam Asi' (That Thou Art) — one of the four great mahavakyas. The father Uddalaka teaches his son Shvetaketu about the nature of Brahman and the ultimate identity of the individual self with the universal Self.",
    chapters: [
      {
        number: 1,
        title: "Tat Tvam Asi — That Thou Art",
        subtitle: "The identity of Self and Brahman",
        summary: "The great dialogue between Uddalaka and his son Shvetaketu reveals the ultimate truth of non-duality. Through nine powerful analogies — the salt in water, the seed of a tree, and more — Uddalaka demonstrates that the innermost essence of all things is identical to the universal Brahman, and that Shvetaketu himself is that.",
        total_verses: 16,
        verses: [
          {
            id: "chandogya.6.8.7",
            upanishad: "Chandogya",
            section: "Chapter 6, Section 8, Verse 7 — First Mahavakya",
            sanskrit: "स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो॥",
            transliteration: "Sa ya eso 'nima aitadatmyam idam sarvam tat satyam sa atma tat tvam asi svetaketo.",
            meaning: "That which is the finest essence — this whole world has that as its Self. That is the Real. That is the Self. That art thou, O Shvetaketu.",
            word_meanings: "sa — that; ya — which; esah — this; anima — finest essence; aitadatmyam — having this as self; idam — this; sarvam — all; tat — that; satyam — the Real; sa — that; atma — the Self; tat — that; tvam — thou; asi — art; svetaketo — O Shvetaketu.",
          },
          {
            id: "chandogya.6.12",
            upanishad: "Chandogya",
            section: "Chapter 6, Section 12 — The Seed of the Fig Tree",
            sanskrit: "न्यग्रोधफलमत आनयेति। इदं भगव इति। भिन्धीति। भिन्नं भगव इति। किमत्र पश्यसीति।\nअण्व्य इवेमा धाना भगव इति। असां अङ्गैकामभिन्धीति। भिन्ना भगव इति।\nकिमत्र पश्यसीति। न किञ्चन भगव इति॥",
            transliteration: "Nyagrodha-phalam ata anayeti. Idam bhagava iti. Bhindhiti. Bhinnam bhagava iti. Kim atra pasyasiti. Anvy iva ima dhana bhagava iti. Asam angaikam abhindhi iti. Bhinna bhagava iti. Kim atra pasyasiti. Na kincana bhagava iti.",
            meaning: "\"Bring me a fig from that tree.\" \"Here it is, venerable sir.\" \"Break it.\" \"It is broken, sir.\" \"What do you see in it?\" \"Very tiny seeds, sir.\" \"Break one of those.\" \"It is broken, sir.\" \"What do you see?\" \"Nothing at all, sir.\" [Then Uddalaka says: That subtle essence which you cannot perceive — from that very essence this great fig tree arises. Believe me, my son, that the finest essence here — all this world has that as its Self. That is the Real. That art thou, Shvetaketu.]",
            word_meanings: "nyagrodha — fig tree; phalam — fruit; bhindhi — break; anvy — tiny; dhana — seeds; na kincana — nothing at all. The dialogue illustrates how Brahman, though imperceptible, is the source and substance of all existence.",
          },
          {
            id: "chandogya.6.13",
            upanishad: "Chandogya",
            section: "Chapter 6, Section 13 — Salt in Water",
            sanskrit: "यथा सोम्य मधु मधुकृतो निस्तिष्ठन्ति नानात्ययानां वृक्षाणां रसान् समवहारमेकतां रसं गमयन्ति।\nते यथा तत्र न विवेकं लभन्ते 'मुष्याहं वृक्षस्य रसोऽस्म्यमुष्याहं वृक्षस्य रसोऽस्मीत्येवमेव खलु सोम्येमाः सर्वाः प्रजाः सति सम्पद्य न विदुः सति सम्पद्यामहे इति॥",
            transliteration: "Yatha somya madhu madhukrto nististhanti nana-tya-yanam vrksanam rasan samavaharam ekatam rasam gamayanti. Te yatha tatra na vivekam labhante 'musyaham vrksasya raso 'smy amusyaham vrksasya raso 'smity evam eva khalu somyemah sarvah prajah sati sampadya na viduh sati sampadyamahe iti.",
            meaning: "Just as, dear one, bees make honey by collecting the juices of various trees and reduce them to one form of juice — and as those juices have no discrimination saying 'I am the juice of this tree or that tree' — even so, all these beings, when they merge into Being, know not that they have merged into Being.",
            word_meanings: "madhu — honey; madhukrtah — bees; rasan — juices; samavaharam — bringing together; ekatam — oneness; rasam — juice; vivekam — discrimination; sati — into Being/Brahman; sampadya — having merged; na viduh — do not know. The analogy shows how individual souls merge into Brahman without losing their ultimate nature.",
          },
        ],
      },
    ],
  },
  {
    id: "mundaka",
    name: "Mundaka Upanishad",
    sanskrit: "मुण्डकोपनिषद्",
    tradition: "Atharvaveda",
    summary: "The Mundaka distinguishes between higher knowledge (para vidya) — knowledge of Brahman — and lower knowledge (apara vidya) — knowledge of the world. It teaches that knowing Brahman, one knows everything. Contains the beautiful metaphor of two birds on the same tree.",
    chapters: [
      {
        number: 1,
        title: "Higher and Lower Knowledge",
        subtitle: "Para Vidya and Apara Vidya",
        summary: "A seeker named Shaunaka asks the sage Angiras: what, if known, allows one to know everything? Angiras reveals the two types of knowledge and teaches that Brahman is the source of all creation.",
        total_verses: 13,
        verses: [
          {
            id: "mundaka.1.1.3",
            upanishad: "Mundaka",
            section: "Chapter 1, Section 1, Verse 3",
            sanskrit: "द्वे विद्ये वेदितव्ये इति ह स्म यद्ब्रह्मविदो वदन्ति परा चैवापरा च॥",
            transliteration: "Dve vidye veditavye iti ha sma yad brahma-vido vadanti para caiva apara ca.",
            meaning: "Two kinds of knowledge must be known — this is what the knowers of Brahman tell us. They are the higher (para) and the lower (apara) knowledge.",
            word_meanings: "dve — two; vidye — kinds of knowledge; veditavye — to be known; brahma-vidah — knowers of Brahman; vadanti — say; para — higher; ca — and; eva — indeed; apara — lower; ca — and.",
          },
          {
            id: "mundaka.3.1.1",
            upanishad: "Mundaka",
            section: "Chapter 3, Section 1, Verse 1 — Two Birds",
            sanskrit: "द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते।\nतयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति॥",
            transliteration: "Dva suparna sayuja sakhaya samanam vrksam pari-sasvajate,\ntayor anyah pippalam svadv atty anasnan anyo abhicakasiti.",
            meaning: "Two birds, inseparable companions, dwell on the same tree. One eats the fruits of the tree; the other simply watches without eating.",
            word_meanings: "dva — two; suparna — beautiful-winged birds; sayuja — eternally united; sakhaya — companions; samanam — same; vrksam — tree; pari-sasvajate — cling together; tayoh — of those two; anyah — one; pippalam — fruits; svadu — sweet; atti — eats; anasnan — not eating; anyah — the other; abhicakasiti — only watches.",
          },
          {
            id: "mundaka.3.1.2",
            upanishad: "Mundaka",
            section: "Chapter 3, Section 1, Verse 2",
            sanskrit: "समाने वृक्षे पुरुषो निमग्नोऽनीशया शोचति मुह्यमानः।\nजुष्टं यदा पश्यत्यन्यमीशमस्य महिमानमिति वीतशोकः॥",
            transliteration: "Samane vrkse puruso nimagno 'nisaya socati muhyamana,\njustam yada pasyaty anyam isam asya mahimanam iti vita-sokah.",
            meaning: "Sitting on the same tree, the individual self is deluded and grieves, being powerless. But when it sees the other — the Lord — and knows His glory, it becomes free from sorrow.",
            word_meanings: "samane — same; vrkse — tree; purusah — individual self; nimagnah — immersed; anisaya — powerless; socati — grieves; muhyamanah — deluded; justam — worshipped; yada — when; pasyati — sees; anyam — the other; isam — the Lord; asya — His; mahimanam — glory; vita-sokah — free from sorrow.",
          },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function searchUpanishadVerses(query: string): Verse[] {
  const q = query.toLowerCase();
  const results: Verse[] = [];
  for (const upanishad of upanishads) {
    for (const chapter of upanishad.chapters) {
      for (const verse of chapter.verses) {
        if (
          verse.meaning.toLowerCase().includes(q) ||
          verse.sanskrit.toLowerCase().includes(q) ||
          verse.id.toLowerCase().includes(q) ||
          verse.section.toLowerCase().includes(q) ||
          upanishad.name.toLowerCase().includes(q)
        ) {
          results.push(verse);
        }
      }
    }
  }
  return results;
}

export function getAllUpanishadVerses(): Verse[] {
  return upanishads.flatMap(u => u.chapters.flatMap(c => c.verses));
}

// Bookmark storage (shared key-space with Gita using prefix)
const UPANISHAD_BOOKMARK_KEY = "omvani_upanishad_bookmarks";

export function getUpanishadBookmarks(): string[] {
  try { return JSON.parse(localStorage.getItem(UPANISHAD_BOOKMARK_KEY) ?? "[]"); }
  catch { return []; }
}

export function toggleUpanishadBookmark(verseId: string): boolean {
  const bookmarks = getUpanishadBookmarks();
  const idx = bookmarks.indexOf(verseId);
  if (idx === -1) {
    bookmarks.push(verseId);
    localStorage.setItem(UPANISHAD_BOOKMARK_KEY, JSON.stringify(bookmarks));
    return true;
  } else {
    bookmarks.splice(idx, 1);
    localStorage.setItem(UPANISHAD_BOOKMARK_KEY, JSON.stringify(bookmarks));
    return false;
  }
}

export function isUpanishadBookmarked(verseId: string): boolean {
  return getUpanishadBookmarks().includes(verseId);
}
