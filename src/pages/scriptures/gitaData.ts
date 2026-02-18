// ─── Types ────────────────────────────────────────────────────────────────────

export interface Shloka {
  id: string;        // e.g. "2.47"
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  word_meanings?: string; // word-by-word breakdown
}

export interface Chapter {
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  total_verses: number;
  shlokas: Shloka[];
}

// ─── Chapters ─────────────────────────────────────────────────────────────────
// Full Bhagavad Gita data — 18 chapters
// Currently includes key shlokas per chapter.
// Add remaining verses in the audioUrl field when you have them.

export const chapters: Chapter[] = [
  {
    number: 1,
    title: "Arjuna Vishada Yoga",
    subtitle: "The Yoga of Arjuna's Grief",
    summary: "On the battlefield of Kurukshetra, Arjuna sees his relatives and teachers on the opposing side and is overcome with grief and despair. He lays down his bow, refusing to fight.",
    total_verses: 47,
    shlokas: [
      {
        id: "1.1",
        chapter: 1,
        verse: 1,
        sanskrit: "धृतराष्ट्र उवाच\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥",
        transliteration: "Dhritarashtra uvaca\ndharma-ksetre kuru-ksetre samaveta yuyutsavah,\nmamakah pandavas caiva kim akurvata sanjaya.",
        meaning: "Dhritarashtra said: O Sanjaya, after assembling in the place of pilgrimage at Kurukshetra, what did my sons and the sons of Pandu do, being desirous to fight?",
        word_meanings: "dharma-ksetre — in the place of pilgrimage; kuru-ksetre — in the place named Kurukshetra; samaveta — assembled; yuyutsavah — desiring to fight; mamakah — my party; pandavah — the sons of Pandu; ca — and; eva — certainly; kim — what; akurvata — did they do; sanjaya — O Sanjaya.",
      },
      {
        id: "1.28",
        chapter: 1,
        verse: 28,
        sanskrit: "अर्जुन उवाच\ndṛṣṭvemaṁ sva-janaṁ kṛṣṇa yuyutsuṁ samupasthitam\nsīdanti mama gātrāṇi mukhaṁ ca pariśuṣyati",
        transliteration: "Arjuna uvaca\ndrstvedam sva-janam krsna yuyutsum samupasthitam,\nsidanti mama gatrani mukham ca parisusyati.",
        meaning: "Arjuna said: My dear Krishna, seeing my friends and relatives present before me in such a fighting spirit, I feel the limbs of my body quivering and my mouth drying up.",
        word_meanings: "drstvedam — on seeing; sva-janam — own kinsmen; krsna — O Krishna; yuyutsum — all in a fighting spirit; samupasthitam — present; sidanti — are quivering; mama — my; gatrani — limbs of the body; mukham — mouth; ca — also; parisusyati — drying up.",
      },
    ],
  },
  {
    number: 2,
    title: "Sankhya Yoga",
    subtitle: "The Yoga of Knowledge",
    summary: "Krishna begins His teachings by explaining the immortal nature of the soul. He introduces the concept of Sankhya philosophy and the path of detached action, urging Arjuna to rise and fight as his duty.",
    total_verses: 72,
    shlokas: [
      {
        id: "2.14",
        chapter: 2,
        verse: 14,
        sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
        transliteration: "Matra-sparsas tu kaunteya sitosna-sukha-duhkha-dah,\nagamapayino 'nityas tams titiksasva bharata.",
        meaning: "O son of Kunti, the transient heat and cold, pleasure and pain arise from sense perception. They are non-permanent, appearing and disappearing. Learn to tolerate them, O Bharata.",
        word_meanings: "matra-sparsah — sensory contact; tu — only; kaunteya — O son of Kunti; sita — cold; usna — heat; sukha — happiness; duhkha — distress; dah — giving; agama — appearing; apayi — disappearing; anityah — impermanent; tan — those; titiksasva — endure; bharata — O Bharata.",
      },
      {
        id: "2.19",
        chapter: 2,
        verse: 19,
        sanskrit: "य एनं वेत्ति हन्तारं यश्चैनं मन्यते हतम्।\nउभौ तौ न विजानीतो नायं हन्ति न हन्यते॥",
        transliteration: "Ya enam vetti hantaram yas cainam manyate hatam,\nubhau tau na vijanito nayam hanti na hanyate.",
        meaning: "He who thinks that this soul is a slayer, and he who thinks it is slain — both of them are in ignorance. The soul neither slays nor is slain.",
        word_meanings: "yah — anyone; enam — this; vetti — knows; hantaram — the killer; yah — anyone; ca — also; enam — this; manyate — thinks; hatam — killed; ubhau — both; tau — they; na — never; vijanitah — in knowledge; na — never; ayam — this; hanti — kills; na — nor; hanyate — is killed.",
      },
      {
        id: "2.20",
        chapter: 2,
        verse: 20,
        sanskrit: "न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे॥",
        transliteration: "Na jayate mriyate va kadacin\nnayam bhutva bhavita va na bhuyah,\nAjo nityah sasvato 'yam purano\nna hanyate hanyamane sarire.",
        meaning: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
        word_meanings: "na — never; jayate — takes birth; mriyate — dies; va — either; kadacit — at any time; na — never; ayam — this; bhutva — having come into being; bhavita — will come to be; va — or; na — not; bhuyah — or is again coming to be; ajah — unborn; nityah — eternal; sasvatah — permanent; ayam — this; puranah — the oldest; na — never; hanyate — is killed; hanyamane — being killed; sarire — the body.",
      },
      {
        id: "2.47",
        chapter: 2,
        verse: 47,
        sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
        transliteration: "Karmanye vadhikaras te ma phaleshu kadachana,\nMa karma-phala-hetur bhur ma te sango 'stv akarmani.",
        meaning: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
        word_meanings: "karmani — in prescribed duties; eva — certainly; adhikarah — right; te — of you; ma — never; phalesu — in the fruits; kadacana — at any time; ma — never; karma-phala — in the result of the work; hetuh — cause; bhuh — become; ma — never; te — of you; sangah — attachment; astu — there should be; akarmani — in not doing prescribed duties.",
      },
      {
        id: "2.48",
        chapter: 2,
        verse: 48,
        sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
        transliteration: "Yoga-sthah kuru karmani sangam tyaktva dhananjaya,\nsiddhy-asiddhyoh samo bhutva samatvam yoga ucyate.",
        meaning: "Be steadfast in the performance of duty, O Arjuna, abandoning attachment to success or failure. Such equanimity is called yoga.",
        word_meanings: "yoga-sthah — being fixed in yoga; kuru — perform; karmani — duties; sangam — attachment; tyaktva — giving up; dhananjaya — O Arjuna; siddhi-asiddhyoh — in success and failure; samah — equanimous; bhutva — becoming; samatvam — equanimity; yogah — yoga; ucyate — is called.",
      },
    ],
  },
  {
    number: 3,
    title: "Karma Yoga",
    subtitle: "The Yoga of Action",
    summary: "Krishna explains that action is superior to inaction. He teaches the concept of performing one's duty without attachment to results, and explains how desire and anger are the greatest enemies of the soul.",
    total_verses: 43,
    shlokas: [
      {
        id: "3.16",
        chapter: 3,
        verse: 16,
        sanskrit: "एवं प्रवर्तितं चक्रं नानुवर्तयतीह यः।\nअघायुरिन्द्रियारामो मोघं पार्थ स जीवति॥",
        transliteration: "Evam pravartitam cakram nanuvartayatiha yah,\naghayur indriyaramo mogham partha sa jivati.",
        meaning: "One who does not follow the cycle of sacrifice thus established by the Vedas certainly leads a life full of sin. Living only for the satisfaction of the senses, such a person lives in vain.",
        word_meanings: "evam — thus; pravartitam — established; cakram — cycle; na — does not; anuvartayati — follow; iha — in this life; yah — one who; agha-ayuh — whose life is full of sins; indriya-aramah — satisfied in sense gratification; mogham — uselessly; partha — O son of Prtha; sah — he; jivati — lives.",
      },
      {
        id: "3.37",
        chapter: 3,
        verse: 37,
        sanskrit: "श्री भगवानुवाच\nकाम एष क्रोध एष रजोगुणसमुद्भवः।\nमहाशनो महापाप्मा विद्ध्येनमिह वैरिणम्॥",
        transliteration: "Sri bhagavan uvaca\nkama esa krodha esa rajo-guna-samudbhavah,\nmahasano maha-papma viddhy enam iha vairinams.",
        meaning: "The Supreme Lord said: It is lust only, Arjuna, which is born of contact with the material mode of passion and later transformed into wrath — it is the all-devouring sinful enemy of this world.",
        word_meanings: "kama — lust; esah — this; krodhah — wrath; esah — this; rajah-guna — the mode of passion; samudbhavah — born of; maha-asanah — all-devouring; maha-papma — greatly sinful; viddhi — know; enam — this; iha — in the material world; vairinams — greatest enemy.",
      },
    ],
  },
  {
    number: 4,
    title: "Jnana Karma Sanyasa Yoga",
    subtitle: "The Yoga of Knowledge and Action",
    summary: "Krishna reveals the ancient tradition of this knowledge and explains the nature of divine incarnation. He describes different types of sacrifice and declares that the fire of knowledge burns all karmic reactions to ashes.",
    total_verses: 42,
    shlokas: [
      {
        id: "4.7",
        chapter: 4,
        verse: 7,
        sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
        transliteration: "Yada yada hi dharmasya glanir bhavati bharata,\nabhyutthanam adharmasya tadatmanam srjamy aham.",
        meaning: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion — at that time I descend Myself.",
        word_meanings: "yada — whenever; yada — wherever; hi — certainly; dharmasya — of religion; glanih — discrepancies; bhavati — become manifest; bharata — O descendant of Bharata; abhyutthanam — predominance; adharmasya — of irreligion; tada — at that time; atmanam — self; srjami — manifest; aham — I.",
      },
      {
        id: "4.8",
        chapter: 4,
        verse: 8,
        sanskrit: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥",
        transliteration: "Paritranaya sadhunam vinasaya ca duskrtam,\ndharma-samsthapanarthaya sambhavami yuge yuge.",
        meaning: "To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear millennium after millennium.",
        word_meanings: "paritranaya — for the deliverance; sadhunam — of the devotees; vinasaya — for the annihilation; ca — also; duskrtam — of the miscreants; dharma — principles of religion; samsthapana-arthaya — to reestablish; sambhavami — I appear; yuge — millennium; yuge — after millennium.",
      },
    ],
  },
  {
    number: 5,
    title: "Karma Sanyasa Yoga",
    subtitle: "The Yoga of Renunciation",
    summary: "Krishna reconciles the paths of renunciation and active service, explaining that both lead to the same destination. The wise person sees inaction in action and action in inaction.",
    total_verses: 29,
    shlokas: [
      {
        id: "5.18",
        chapter: 5,
        verse: 18,
        sanskrit: "विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि।\nशुनि चैव श्वपाके च पण्डिताः समदर्शिनः॥",
        transliteration: "Vidya-vinaya-sampanne brahmane gavi hastini,\nsuni caiva svapake ca panditah sama-darsinah.",
        meaning: "The humble sages, by virtue of true knowledge, see with equal vision a learned and gentle brahmin, a cow, an elephant, a dog and a dog-eater.",
        word_meanings: "vidya — education; vinaya — gentleness; sampanne — fully equipped; brahmane — in a brahmana; gavi — in a cow; hastini — in an elephant; suni — in a dog; ca — and; eva — certainly; svapake — in a dog-eater; ca — respectively; panditah — those who are wise; sama-darsinah — who see with equal vision.",
      },
    ],
  },
  {
    number: 6,
    title: "Atma Samyama Yoga",
    subtitle: "The Yoga of Self-Control",
    summary: "Krishna describes the practice of meditation and yoga, explaining how to control the mind and senses. He teaches that the mind can be both a friend and an enemy, and describes the characteristics of a true yogi.",
    total_verses: 47,
    shlokas: [
      {
        id: "6.5",
        chapter: 6,
        verse: 5,
        sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
        transliteration: "Uddhared atmanatmanam natmanam avasadayet,\natmaiva hy atmano bandhur atmaiva ripur atmanah.",
        meaning: "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
        word_meanings: "uddharet — one must deliver; atmana — by the mind; atmanam — the conditioned soul; na — never; atmanam — the conditioned soul; avasadayet — put into degradation; atma — mind; eva — certainly; hi — indeed; atmanah — of the conditioned soul; bandhuh — friend; atma — mind; eva — certainly; ripuh — enemy; atmanah — of the conditioned soul.",
      },
      {
        id: "6.35",
        chapter: 6,
        verse: 35,
        sanskrit: "श्री भगवानुवाच\nअसंशयं महाबाहो मनो दुर्निग्रहं चलम्।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते॥",
        transliteration: "Sri-bhagavan uvaca\nasamsayam maha-baho mano durnigraham calam,\nabhyasena tu kaunteya vairagyena ca grhyate.",
        meaning: "Lord Sri Krishna said: O mighty-armed son of Kunti, it is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment.",
        word_meanings: "sri-bhagavan uvaca — the Lord said; asamsayam — undoubtedly; maha-baho — O mighty-armed one; manah — the mind; durnigraham — difficult to curb; calam — flickering; abhyasena — by practice; tu — but; kaunteya — O son of Kunti; vairagyena — by detachment; ca — also; grhyate — can be so controlled.",
      },
    ],
  },
  {
    number: 7,
    title: "Jnana Vijnana Yoga",
    subtitle: "The Yoga of Knowledge and Wisdom",
    summary: "Krishna explains His relationship with the material and spiritual worlds. He reveals that only a rare soul truly knows Him and that those who worship demigods are actually worshipping Him indirectly.",
    total_verses: 30,
    shlokas: [
      {
        id: "7.7",
        chapter: 7,
        verse: 7,
        sanskrit: "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय।\nमयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव॥",
        transliteration: "Mattah parataram nanyat kincid asti dhananjaya,\nmayi sarvam idam protam sutre mani-gana iva.",
        meaning: "O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.",
        word_meanings: "mattah — beyond Me; para-taram — superior; na — not; anyat kincit — anything else; asti — there is; dhananjaya — O conqueror of wealth; mayi — in Me; sarvam — all; idam — this; protam — is strung; sutre — on a thread; mani-ganah — pearls; iva — like.",
      },
    ],
  },
  {
    number: 8,
    title: "Aksara Brahma Yoga",
    subtitle: "The Yoga of the Imperishable Absolute",
    summary: "Krishna explains what happens at the moment of death, describing the paths of light and darkness that souls take after leaving the body. He reveals that those who remember Him at death attain His eternal abode.",
    total_verses: 28,
    shlokas: [
      {
        id: "8.7",
        chapter: 8,
        verse: 7,
        sanskrit: "तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च।\nमय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम्॥",
        transliteration: "Tasmats sarvesu kalesu mam anusmara yudhya ca,\nmayy arpita-mano-buddhir mam evaisyasy asamsayam.",
        meaning: "Therefore, Arjuna, you should always think of Me in the form of Krishna and at the same time carry out your prescribed duty of fighting. With your activities dedicated to Me and your mind and intelligence fixed on Me, you will attain Me without doubt.",
        word_meanings: "tasmat — therefore; sarvesu — at all; kalesu — times; mam — Me; anusmara — remember; yudhya — fight; ca — also; mayi — unto Me; arpita — surrendered; manah — mind; buddhih — intellect; mam — unto Me; eva — certainly; esyasi — you will attain; asamsayam — beyond doubt.",
      },
    ],
  },
  {
    number: 9,
    title: "Raja Vidya Raja Guhya Yoga",
    subtitle: "The Yoga of Royal Knowledge and Royal Secret",
    summary: "Krishna reveals the most confidential knowledge — the science of devotional service. He explains how the entire cosmic creation rests in Him and how pure devotion leads to liberation.",
    total_verses: 34,
    shlokas: [
      {
        id: "9.22",
        chapter: 9,
        verse: 22,
        sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
        transliteration: "Ananyash cintayanto mam ye janah paryupasate,\ntesham nityabhiyuktanam yoga-ksemam vahamyaham.",
        meaning: "But those who always worship Me with exclusive devotion, meditating on My transcendental form — to them I carry what they lack, and I preserve what they have.",
        word_meanings: "ananyah — without deviation; cintayantah — concentrating; mam — on Me; ye — those who; janah — persons; paryupasate — worship properly; tesam — of them; nitya — always; abhiyuktanam — fixed in devotion; yoga — requirements; ksemam — protection; vahami — carry; aham — I.",
      },
      {
        id: "9.27",
        chapter: 9,
        verse: 27,
        sanskrit: "यत्करोषि यदश्नासि यज्जुहोषि ददासि यत्।\nयत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम्॥",
        transliteration: "Yat karosi yad asnasi yaj juhosi dadasi yat,\nyat tapasyasi kaunteya tat kurusva mad-arpanam.",
        meaning: "Whatever you do, whatever you eat, whatever you offer or give away, and whatever austerities you perform — do that, O son of Kunti, as an offering to Me.",
        word_meanings: "yat — whatever; karosi — you do; yat — whatever; asnasi — you eat; yat — whatever; juhosi — you offer; dadasi — you give away; yat — whatever; tapasyasi — austerities you perform; kaunteya — O son of Kunti; tat — that; kurusva — do; mat — to Me; arpanam — as an offering.",
      },
    ],
  },
  {
    number: 10,
    title: "Vibhuti Yoga",
    subtitle: "The Yoga of Divine Manifestations",
    summary: "Krishna describes His divine manifestations and opulences, explaining that He is the source of all existence. He declares that any magnificent or beautiful creation is but a spark of His splendour.",
    total_verses: 42,
    shlokas: [
      {
        id: "10.20",
        chapter: 10,
        verse: 20,
        sanskrit: "अहमात्मा गुडाकेश सर्वभूताशयस्थितः।\nअहमादिश्च मध्यं च भूतानामन्त एव च॥",
        transliteration: "Aham atma gudakesa sarva-bhutasaya-sthitah,\naham adis ca madhyam ca bhutanam anta eva ca.",
        meaning: "I am the soul, O Gudakesa, seated in the hearts of all living entities. I am the beginning, the middle and the end of all beings.",
        word_meanings: "aham — I; atma — the soul; gudakesa — O Arjuna; sarva-bhuta — of all living entities; asaya-sthitah — situated within the heart; aham — I am; adih — the origin; ca — also; madhyam — middle; ca — also; bhutanam — of all living entities; antah — end; eva — certainly; ca — and.",
      },
    ],
  },
  {
    number: 11,
    title: "Viswarupa Darsana Yoga",
    subtitle: "The Yoga of the Universal Form",
    summary: "Arjuna is granted divine vision to behold Krishna's universal form — a magnificent and terrifying cosmic vision containing all of existence. Overwhelmed, Arjuna prays to see Krishna's gentle four-armed form again.",
    total_verses: 55,
    shlokas: [
      {
        id: "11.33",
        chapter: 11,
        verse: 33,
        sanskrit: "तस्मात्त्वमुत्तिष्ठ यशो लभस्व\nजित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम्।\nमयैवैते निहताः पूर्वमेव\nनिमित्तमात्रं भव सव्यसाचिन्॥",
        transliteration: "Tasmat tvam uttistha yaso labhasva\njitva satrun bhunksva rajyam samrddham,\nmayaivaite nihatah purvam eva\nnimitta-matram bhava savyasacin.",
        meaning: "Therefore, get up and attain glory. Conquer your enemies and enjoy a prosperous kingdom. They are already put to death by My arrangement, and you, O Savyasachi, can be but an instrument in the fight.",
        word_meanings: "tasmat — therefore; tvam — you; uttistha — get up; yasah — glory; labhasva — gain; jitva — conquering; satrun — enemies; bhunksva — enjoy; rajyam — kingdom; samrddham — prosperous; maya — by Me; eva — certainly; ete — all these; nihatah — killed; purvam — before; eva — certainly; nimitta-matram — just the cause; bhava — become; savyasacin — O Savyasachi.",
      },
    ],
  },
  {
    number: 12,
    title: "Bhakti Yoga",
    subtitle: "The Yoga of Devotion",
    summary: "Krishna declares that devotional service is the highest path. He describes the qualities of a dear devotee — one who is free from hatred, friendly to all, content, and surrendered to God.",
    total_verses: 20,
    shlokas: [
      {
        id: "12.13",
        chapter: 12,
        verse: 13,
        sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥",
        transliteration: "Advesta sarva-bhutanam maitrah karuna eva ca,\nnirmamo nirahankarah sama-duhkha-sukhah ksami.",
        meaning: "One who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, who is tolerant — such a devotee of Mine is very dear to Me.",
        word_meanings: "advesta — nonenvious; sarva-bhutanam — toward all living entities; maitrah — friendly; karunah — kindly; eva — certainly; ca — also; nirmamah — with no sense of proprietorship; nirahankarah — without false ego; sama — equal; duhkha — in distress; sukhah — and happiness; ksami — forgiving.",
      },
    ],
  },
  {
    number: 13,
    title: "Kshetra Kshetrajna Vibhaga Yoga",
    subtitle: "The Yoga of the Field and Its Knower",
    summary: "Krishna distinguishes between the body (field) and the soul (knower of the field). He explains the nature of knowledge, the knowable, and the 24 elements of material nature.",
    total_verses: 35,
    shlokas: [
      {
        id: "13.3",
        chapter: 13,
        verse: 3,
        sanskrit: "क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत।\nक्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम॥",
        transliteration: "Ksetra-jnam capi mam viddhi sarva-ksetresu bharata,\nksetra-ksetrajnayor jnanam yat taj jnanam matam mama.",
        meaning: "O scion of Bharata, you should understand that I am also the knower in all bodies, and to understand this body and its knower is called knowledge. That is My opinion.",
        word_meanings: "ksetra-jnam — the knower of the field; ca — also; api — certainly; mam — Me; viddhi — know; sarva — all; ksetresu — in bodily fields; bharata — O son of Bharata; ksetra — the field of activities; ksetra-jnayoh — and the knower of the field; jnanam — knowledge; yat — that which; tat — that; jnanam — knowledge; matam — opinion; mama — My.",
      },
    ],
  },
  {
    number: 14,
    title: "Gunatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Three Modes of Nature",
    summary: "Krishna explains the three modes of material nature — goodness, passion and ignorance — and how they bind the soul to the material world. He describes how to transcend all three modes.",
    total_verses: 27,
    shlokas: [
      {
        id: "14.6",
        chapter: 14,
        verse: 6,
        sanskrit: "तत्र सत्त्वं निर्मलत्वात्प्रकाशकमनामयम्।\nसुखसङ्गेन बध्नाति ज्ञानसङ्गेन चानघ॥",
        transliteration: "Tatra sattvam nirmalatvat prakasakam anamayam,\nsukha-sangena badhnati jnana-sangena canagha.",
        meaning: "O sinless one, the mode of goodness, being purer than the others, is illuminating, and it frees one from all sinful reactions. Those situated in that mode become conditioned by a sense of happiness and knowledge.",
        word_meanings: "tatra — there; sattvam — the mode of goodness; nirmalatvat — being purest; prakasam — illumination; anamayam — without any sinful reaction; sukha — happiness; sangena — by association; badhnati — conditions; jnana — knowledge; sangena — by association; ca — also; anagha — O sinless one.",
      },
    ],
  },
  {
    number: 15,
    title: "Purushottama Yoga",
    subtitle: "The Yoga of the Supreme Person",
    summary: "Krishna describes the cosmic tree of material existence and explains how to cut it down with detachment. He then reveals the nature of the Supreme Person — beyond both the perishable and imperishable.",
    total_verses: 20,
    shlokas: [
      {
        id: "15.15",
        chapter: 15,
        verse: 15,
        sanskrit: "सर्वस्य चाहं हृदि सन्निविष्टो\nमत्तः स्मृतिर्ज्ञानमपोहनं च।\nवेदैश्च सर्वैरहमेव वेद्यो\nवेदान्तकृद्वेदविदेव चाहम्॥",
        transliteration: "Sarvasya caham hrdi sannivisto\nmattah smrtir jnanam apohanam ca,\nvedais ca sarvair aham eva vedyo\nvedanta-krd veda-vid eva caham.",
        meaning: "I am seated in everyone's heart, and from Me come remembrance, knowledge and forgetfulness. By all the Vedas, I am to be known. Indeed, I am the compiler of Vedanta, and I am the knower of the Vedas.",
        word_meanings: "sarvasya — of all living beings; ca — and; aham — I; hrdi — in the heart; sannivistah — situated; mattah — from Me; smrtih — remembrance; jnanam — knowledge; apohanam — forgetfulness; ca — and; vedaih — by the Vedas; ca — also; sarvaih — all; aham — I am; eva — certainly; vedyah — knowable; vedanta-krt — the compiler of the Vedanta; veda-vit — the knower of the Vedas; eva — certainly; ca — and; aham — I.",
      },
    ],
  },
  {
    number: 16,
    title: "Daivasura Sampad Vibhaga Yoga",
    subtitle: "The Yoga of Divine and Demoniac Natures",
    summary: "Krishna distinguishes between divine and demoniac qualities in human beings. He describes the characteristics of each and warns against the three gates to hell — lust, anger and greed.",
    total_verses: 24,
    shlokas: [
      {
        id: "16.21",
        chapter: 16,
        verse: 21,
        sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत्॥",
        transliteration: "Tri-vidham narakasyedam dvaram nasanam atmanah,\nkamah krodhas tatha lobhas tasmad etat trayam tyajet.",
        meaning: "There are three gates leading to the hell of self-destruction for the soul — lust, anger and greed. Every sane man should give these up, for they lead to the degradation of the soul.",
        word_meanings: "tri-vidham — three kinds of; narakasya — of hell; idam — this; dvaram — gate; nasanam — destructive; atmanah — of the self; kamah — lust; krodhah — anger; tatha — as well as; lobhah — greed; tasmat — therefore; etat — these; trayam — three; tyajet — must give up.",
      },
    ],
  },
  {
    number: 17,
    title: "Sraddhatraya Vibhaga Yoga",
    subtitle: "The Yoga of the Threefold Faith",
    summary: "Krishna explains how the three modes of nature influence a person's faith, food preferences, sacrifices, austerities and charity. He introduces the significance of Om Tat Sat.",
    total_verses: 28,
    shlokas: [
      {
        id: "17.3",
        chapter: 17,
        verse: 3,
        sanskrit: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः॥",
        transliteration: "Sattvanuruapa sarvasya sraddha bhavati bharata,\nsraddha-mayo 'yam puruso yo yac-chraddhahs sa eva sah.",
        meaning: "O son of Bharata, according to one's existence under the various modes of nature, one evolves a particular kind of faith. The living being is said to be of a particular faith according to the modes he has acquired.",
        word_meanings: "sattva-anurupah — according to the existence; sarvasya — of everyone; sraddha — faith; bhavati — becomes; bharata — O son of Bharata; sraddha — faith; mayah — full of; ayam — this; purusah — living entity; yah — who; yat — that particular; sraddhah — faith; sah — he; eva — certainly; sah — he.",
      },
    ],
  },
  {
    number: 18,
    title: "Moksha Sanyasa Yoga",
    subtitle: "The Yoga of Liberation and Renunciation",
    summary: "The concluding chapter summarises the entire Gita. Krishna explains the difference between renunciation and the renounced order. He reveals the most confidential knowledge — complete surrender to God — and promises liberation to all who do so.",
    total_verses: 78,
    shlokas: [
      {
        id: "18.65",
        chapter: 18,
        verse: 65,
        sanskrit: "मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे॥",
        transliteration: "Man-mana bhava mad-bhakto mad-yaji mam namaskuru,\nmam evaisyasi satyam te pratijane priyo 'si me.",
        meaning: "Always think of Me, become My devotee, worship Me and offer your homage to Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.",
        word_meanings: "mat-manah — thinking of Me; bhava — just become; mat-bhaktah — My devotee; mat-yaji — My worshiper; mam — unto Me; namaskuru — offer your obeisances; mam — unto Me; eva — certainly; esyasi — you will come; satyam — truly; te — to you; pratijane — I promise; priyah — dear; asi — you are; me — My.",
      },
      {
        id: "18.66",
        chapter: 18,
        verse: 66,
        sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
        transliteration: "Sarva-dharman parityajya mam ekam saranam vraja,\naham tvam sarva-papebhyo moksayisyami ma sucah.",
        meaning: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
        word_meanings: "sarva-dharman — all varieties of religion; parityajya — abandoning; mam — unto Me; ekam — only; saranam — surrender; vraja — go; aham — I; tvam — you; sarva — all; papebhyah — from sinful reactions; moksayisyami — will deliver; ma — do not; sucah — worry.",
      },
      {
        id: "18.78",
        chapter: 18,
        verse: 78,
        sanskrit: "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥",
        transliteration: "Yatra yogesvara krsno yatra partho dhanur-dharah,\ntatra srir vijayo bhutir dhruva nitir matir mama.",
        meaning: "Wherever there is Krishna, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality. That is my opinion.",
        word_meanings: "yatra — wherever; yoga-isvarah — the master of mysticism; krsnah — Lord Krishna; yatra — wherever; parthah — the son of Prtha; dhanuh-dharah — the carrier of the bow and arrow; tatra — there; srih — opulence; vijayah — victory; bhutih — exceptional power; dhruva — certain; nitih — morality; matih mama — my opinion.",
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getChapter(num: number): Chapter | undefined {
  return chapters.find(c => c.number === num);
}

export function getShloka(id: string): Shloka | undefined {
  for (const chapter of chapters) {
    const found = chapter.shlokas.find(s => s.id === id);
    if (found) return found;
  }
  return undefined;
}

export function searchShlokas(query: string): Shloka[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: Shloka[] = [];
  for (const chapter of chapters) {
    for (const shloka of chapter.shlokas) {
      if (
        shloka.meaning.toLowerCase().includes(q) ||
        shloka.transliteration.toLowerCase().includes(q) ||
        shloka.sanskrit.includes(query) ||
        shloka.id.includes(query)
      ) {
        results.push(shloka);
      }
    }
  }
  return results;
}

// ─── Bookmarks (localStorage) ─────────────────────────────────────────────────

const BOOKMARK_KEY = "omvani_bookmarks";

export function getBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARK_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function toggleBookmark(shlokaId: string): boolean {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(shlokaId);
  if (idx === -1) {
    bookmarks.push(shlokaId);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return true; // added
  } else {
    bookmarks.splice(idx, 1);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    return false; // removed
  }
}

export function isBookmarked(shlokaId: string): boolean {
  return getBookmarks().includes(shlokaId);
}
