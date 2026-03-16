// ---------------------------------------------------------------------------
// Seed data: Hanuman Chalisa
// 43 verses = 2 opening dohas + 40 chaupais + 1 closing doha
// Composed by Goswami Tulsidas (16th century), Awadhi Hindi, Public Domain
// ---------------------------------------------------------------------------

export const scripture = {
  id: "hanuman-chalisa",
  name: "Hanuman Chalisa",
  name_sanskrit: "हनुमान चालीसा",
  tradition: "Ramcharitmanas",
  category: "Chalisa",
  total_verses: 43,
  total_chapters: 1,
  summary:
    "The Hanuman Chalisa is a devotional hymn of forty verses (chalisa) composed by the great poet-saint Tulsidas in the 16th century. Written in Awadhi Hindi, it is addressed to Lord Hanuman, the embodiment of devotion, courage, and selfless service. Recited daily by millions, it praises Hanuman's virtues, recounts his heroic deeds in the Ramayana, and invokes his blessings for strength, wisdom, and protection from all adversities.",
  accent_color: "hsl(25,85%,50%)",
  is_free: true,
  sort_order: 3,
};

export const chapters = [
  {
    id: "hanuman-chalisa-main",
    scripture_id: "hanuman-chalisa",
    number: 1,
    title: "Hanuman Chalisa",
    subtitle: "Forty Verses in Praise of Lord Hanuman",
    summary:
      "The complete Hanuman Chalisa comprising two invocatory dohas, forty chaupai verses glorifying Hanuman's divine qualities and exploits, and one concluding doha. Tulsidas extols Hanuman as the greatest devotee of Lord Rama and seeks his grace for devotion, strength, and liberation.",
    total_verses: 43,
    is_free: true,
    sort_order: 1,
  },
];

export const verses = [
  // ─── Opening Doha 1 ───────────────────────────────────────────────────
  {
    id: "hc-doha-1",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 1,
    sanskrit:
      "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥",
    transliteration:
      "shrīguru charana saroja raja nija manu mukuru sudhāri,\nbaranauṁ raghubara bimala jasu jo dāyaku phala chāri.",
    meaning:
      "Having purified the mirror of my mind with the dust of my Guru's lotus feet, I describe the pure glory of Sri Rama, the best of the Raghu dynasty, who bestows the four fruits of life — dharma, artha, kama, and moksha.",
    word_meanings:
      "shrīguru = revered Guru; charana = feet; saroja = lotus; raja = dust; nija = own; manu = mind; mukuru = mirror; sudhāri = having purified; baranauṁ = I describe; raghubara = best of Raghu dynasty (Rama); bimala = pure; jasu = glory; jo = who; dāyaku = bestower; phala = fruit; chāri = four",
    is_key_verse: true,
    sort_order: 0,
  },

  // ─── Opening Doha 2 ───────────────────────────────────────────────────
  {
    id: "hc-doha-2",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 2,
    sanskrit:
      "बुद्धिहीन तनु जानिके सुमिरौं पवनकुमार।\nबल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार॥",
    transliteration:
      "buddhihīna tanu jānike sumirauṁ pavanakumāra,\nbala budhi bidyā dehu mohiṁ harahu kalesa bikāra.",
    meaning:
      "Knowing myself to be ignorant, I remember the Son of the Wind (Hanuman). Grant me strength, wisdom, and knowledge, and remove my afflictions and impurities.",
    word_meanings:
      "buddhihīna = devoid of intelligence; tanu = body/self; jānike = knowing; sumirauṁ = I remember; pavanakumāra = son of the wind (Hanuman); bala = strength; budhi = wisdom; bidyā = knowledge; dehu = give; mohiṁ = to me; harahu = remove; kalesa = afflictions; bikāra = impurities/defects",
    is_key_verse: true,
    sort_order: 1,
  },

  // ─── Chaupai 1 ────────────────────────────────────────────────────────
  {
    id: "hc-1",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 3,
    sanskrit:
      "जय हनुमान ज्ञान गुन सागर।\nजय कपीस तिहुँ लोक उजागर॥",
    transliteration:
      "jaya hanumāna jñāna guna sāgara,\njaya kapīsa tihuṁ loka ujāgara.",
    meaning:
      "Victory to Hanuman, the ocean of wisdom and virtue! Victory to the Lord of Monkeys, illuminator of the three worlds!",
    word_meanings:
      "jaya = victory/glory; hanumāna = Hanuman; jñāna = wisdom; guna = virtue; sāgara = ocean; kapīsa = lord of monkeys; tihuṁ = three; loka = worlds; ujāgara = illuminator",
    is_key_verse: true,
    sort_order: 2,
  },

  // ─── Chaupai 2 ────────────────────────────────────────────────────────
  {
    id: "hc-2",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 4,
    sanskrit:
      "राम दूत अतुलित बल धामा।\nअंजनि पुत्र पवनसुत नामा॥",
    transliteration:
      "rāma dūta atulita bala dhāmā,\nañjani putra pavanasuta nāmā.",
    meaning:
      "You are the messenger of Rama, the abode of incomparable strength, known as the son of Anjani and the son of the Wind.",
    word_meanings:
      "rāma = Lord Rama; dūta = messenger; atulita = incomparable; bala = strength; dhāmā = abode; añjani = Anjani (mother); putra = son; pavanasuta = son of wind; nāmā = named",
    is_key_verse: true,
    sort_order: 3,
  },

  // ─── Chaupai 3 ────────────────────────────────────────────────────────
  {
    id: "hc-3",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 5,
    sanskrit:
      "महाबीर बिक्रम बजरंगी।\nकुमति निवार सुमति के संगी॥",
    transliteration:
      "mahābīra bikrama bajaraṅgī,\nkumati nivāra sumati ke saṅgī.",
    meaning:
      "O great hero of tremendous valor, whose body is as strong as a thunderbolt! You dispel evil thoughts and are the companion of those with good minds.",
    word_meanings:
      "mahābīra = great hero; bikrama = valor/prowess; bajaraṅgī = one with a body hard as a thunderbolt; kumati = evil thoughts; nivāra = remover; sumati = good thoughts; ke = of; saṅgī = companion",
    is_key_verse: true,
    sort_order: 4,
  },

  // ─── Chaupai 4 ────────────────────────────────────────────────────────
  {
    id: "hc-4",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 6,
    sanskrit:
      "कंचन बरन बिराज सुबेसा।\nकानन कुंडल कुंचित केसा॥",
    transliteration:
      "kañchana barana birāja subesā,\nkānana kuṇḍala kuñchita kesā.",
    meaning:
      "Your complexion is golden and your attire is splendid. You wear earrings in your ears and your hair is curly.",
    word_meanings:
      "kañchana = golden; barana = complexion; birāja = shining/splendid; subesā = beautiful attire; kānana = ears; kuṇḍala = earrings; kuñchita = curly; kesā = hair",
    is_key_verse: false,
    sort_order: 5,
  },

  // ─── Chaupai 5 ────────────────────────────────────────────────────────
  {
    id: "hc-5",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 7,
    sanskrit:
      "हाथ बज्र औ ध्वजा बिराजै।\nकाँधे मूँज जनेऊ साजै॥",
    transliteration:
      "hātha bajra au dhvajā birājai,\nkāṁdhe mūṁja janeū sājai.",
    meaning:
      "In your hands shine the thunderbolt mace and a banner, and on your shoulder adorns the sacred thread of munja grass.",
    word_meanings:
      "hātha = hand; bajra = thunderbolt/mace; au = and; dhvajā = flag/banner; birājai = shines; kāṁdhe = shoulder; mūṁja = munja grass; janeū = sacred thread; sājai = adorns",
    is_key_verse: false,
    sort_order: 6,
  },

  // ─── Chaupai 6 ────────────────────────────────────────────────────────
  {
    id: "hc-6",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 8,
    sanskrit:
      "शंकर सुवन केसरी नंदन।\nतेज प्रताप महा जग बंदन॥",
    transliteration:
      "śaṅkara suvana kesarī nandana,\nteja pratāpa mahā jaga bandana.",
    meaning:
      "You are an incarnation of Lord Shiva and the son of Kesari. Your radiance and might are great, and the whole world reveres you.",
    word_meanings:
      "śaṅkara = Shiva; suvana = incarnation/son; kesarī = Kesari (father); nandana = son/delight; teja = radiance; pratāpa = might/glory; mahā = great; jaga = world; bandana = worship/reverence",
    is_key_verse: true,
    sort_order: 7,
  },

  // ─── Chaupai 7 ────────────────────────────────────────────────────────
  {
    id: "hc-7",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 9,
    sanskrit:
      "बिद्यावान गुनी अति चातुर।\nराम काज करिबे को आतुर॥",
    transliteration:
      "bidyāvāna gunī ati chātura,\nrāma kāja karibe ko ātura.",
    meaning:
      "You are learned, virtuous, and supremely clever, and always eager to accomplish the work of Lord Rama.",
    word_meanings:
      "bidyāvāna = learned; gunī = virtuous; ati = very; chātura = clever; rāma = Lord Rama; kāja = work/task; karibe = to do; ko = for; ātura = eager",
    is_key_verse: true,
    sort_order: 8,
  },

  // ─── Chaupai 8 ────────────────────────────────────────────────────────
  {
    id: "hc-8",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 10,
    sanskrit:
      "प्रभु चरित्र सुनिबे को रसिया।\nराम लखन सीता मन बसिया॥",
    transliteration:
      "prabhu charitra sunibe ko rasiyā,\nrāma lakhana sītā mana basiyā.",
    meaning:
      "You delight in listening to the stories of the Lord. Rama, Lakshmana, and Sita dwell forever in your heart.",
    word_meanings:
      "prabhu = Lord; charitra = story/deeds; sunibe = to listen; ko = to; rasiyā = one who delights; rāma = Rama; lakhana = Lakshmana; sītā = Sita; mana = mind/heart; basiyā = dwell",
    is_key_verse: true,
    sort_order: 9,
  },

  // ─── Chaupai 9 ────────────────────────────────────────────────────────
  {
    id: "hc-9",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 11,
    sanskrit:
      "सूक्ष्म रूप धरि सियहिं दिखावा।\nबिकट रूप धरि लंक जरावा॥",
    transliteration:
      "sūkṣma rūpa dhari siyahiṁ dikhāvā,\nbikaṭa rūpa dhari laṅka jarāvā.",
    meaning:
      "Assuming a tiny form, you appeared before Sita; assuming a fearsome form, you set Lanka ablaze.",
    word_meanings:
      "sūkṣma = tiny/subtle; rūpa = form; dhari = assuming; siyahiṁ = to Sita; dikhāvā = showed; bikaṭa = fearsome; laṅka = Lanka; jarāvā = burned",
    is_key_verse: true,
    sort_order: 10,
  },

  // ─── Chaupai 10 ───────────────────────────────────────────────────────
  {
    id: "hc-10",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 12,
    sanskrit:
      "भीम रूप धरि असुर सँहारे।\nरामचन्द्र के काज सँवारे॥",
    transliteration:
      "bhīma rūpa dhari asura saṁhāre,\nrāmachandra ke kāja saṁvāre.",
    meaning:
      "Assuming a gigantic form, you destroyed the demons and accomplished the missions of Lord Rama.",
    word_meanings:
      "bhīma = gigantic/terrible; rūpa = form; dhari = assuming; asura = demons; saṁhāre = destroyed; rāmachandra = Lord Rama; ke = of; kāja = tasks; saṁvāre = accomplished",
    is_key_verse: true,
    sort_order: 11,
  },

  // ─── Chaupai 11 ───────────────────────────────────────────────────────
  {
    id: "hc-11",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 13,
    sanskrit:
      "लाय सजीवन लखन जियाये।\nश्रीरघुबीर हरषि उर लाये॥",
    transliteration:
      "lāya sajīvana lakhana jiyāye,\nshrīraghubīra haraṣi ura lāye.",
    meaning:
      "You brought the Sanjeevani herb and revived Lakshmana; Sri Rama embraced you with great joy.",
    word_meanings:
      "lāya = brought; sajīvana = Sanjeevani (life-giving herb); lakhana = Lakshmana; jiyāye = revived; shrīraghubīra = Sri Rama; haraṣi = with joy; ura = chest/heart; lāye = embraced",
    is_key_verse: false,
    sort_order: 12,
  },

  // ─── Chaupai 12 ───────────────────────────────────────────────────────
  {
    id: "hc-12",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 14,
    sanskrit:
      "रघुपति कीन्हीं बहुत बड़ाई।\nतुम मम प्रिय भरतहि सम भाई॥",
    transliteration:
      "raghupati kīnhī bahuta baḍāī,\ntuma mama priya bharatahi sama bhāī.",
    meaning:
      "Lord Rama praised you greatly and said: 'You are dear to me as my brother Bharata.'",
    word_meanings:
      "raghupati = Lord of Raghu dynasty (Rama); kīnhī = did; bahuta = much; baḍāī = praise; tuma = you; mama = my; priya = dear; bharatahi = like Bharata; sama = equal; bhāī = brother",
    is_key_verse: false,
    sort_order: 13,
  },

  // ─── Chaupai 13 ───────────────────────────────────────────────────────
  {
    id: "hc-13",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 15,
    sanskrit:
      "सहस बदन तुम्हरो जस गावैं।\nअस कहि श्रीपति कंठ लगावैं॥",
    transliteration:
      "sahasa badana tumharo jasa gāvaiṁ,\nasa kahi shrīpati kaṇṭha lagāvaiṁ.",
    meaning:
      "Saying thus, the Lord of Lakshmi (Rama) embraced you, declaring that Shesha with his thousand mouths sings your glory.",
    word_meanings:
      "sahasa = thousand; badana = mouths; tumharo = your; jasa = glory; gāvaiṁ = sing; asa = thus; kahi = saying; shrīpati = Lord of Lakshmi (Rama); kaṇṭha = throat/neck; lagāvaiṁ = embraced",
    is_key_verse: false,
    sort_order: 14,
  },

  // ─── Chaupai 14 ───────────────────────────────────────────────────────
  {
    id: "hc-14",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 16,
    sanskrit:
      "सनकादिक ब्रह्मादि मुनीसा।\nनारद सारद सहित अहीसा॥",
    transliteration:
      "sanakādika brahmādi munīsā,\nnārada sārada sahita ahīsā.",
    meaning:
      "Sanaka and the sages, Brahma and other gods, Narada, Saraswati, and the Serpent King all sing your praise.",
    word_meanings:
      "sanakādika = Sanaka and others; brahmādi = Brahma and others; munīsā = great sages; nārada = sage Narada; sārada = Saraswati; sahita = along with; ahīsā = lord of serpents (Shesha)",
    is_key_verse: false,
    sort_order: 15,
  },

  // ─── Chaupai 15 ───────────────────────────────────────────────────────
  {
    id: "hc-15",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 17,
    sanskrit:
      "जम कुबेर दिगपाल जहाँ ते।\nकबि कोबिद कहि सकैं कहाँ ते॥",
    transliteration:
      "jama kubera digapāla jahāṁ te,\nkabi kobida kahi sakaiṁ kahāṁ te.",
    meaning:
      "Yama, Kubera, and the guardians of the directions — how can even poets and scholars describe your glory?",
    word_meanings:
      "jama = Yama (god of death); kubera = Kubera (god of wealth); digapāla = guardians of directions; jahāṁ te = from where; kabi = poets; kobida = scholars; kahi = say; sakaiṁ = can; kahāṁ te = how",
    is_key_verse: false,
    sort_order: 16,
  },

  // ─── Chaupai 16 ───────────────────────────────────────────────────────
  {
    id: "hc-16",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 18,
    sanskrit:
      "तुम उपकार सुग्रीवहिं कीन्हा।\nराम मिलाय राजपद दीन्हा॥",
    transliteration:
      "tuma upakāra sugrīvahiṁ kīnhā,\nrāma milāya rājapada dīnhā.",
    meaning:
      "You rendered a great service to Sugriva by introducing him to Rama and restoring his kingdom.",
    word_meanings:
      "tuma = you; upakāra = favor/service; sugrīvahiṁ = to Sugriva; kīnhā = did; rāma = Rama; milāya = introduced; rājapada = kingship; dīnhā = gave",
    is_key_verse: false,
    sort_order: 17,
  },

  // ─── Chaupai 17 ───────────────────────────────────────────────────────
  {
    id: "hc-17",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 19,
    sanskrit:
      "तुम्हरो मंत्र बिभीषन माना।\nलंकेश्वर भये सब जग जाना॥",
    transliteration:
      "tumharo mantra bibhīṣana mānā,\nlaṅkeśvara bhaye saba jaga jānā.",
    meaning:
      "Vibhishana heeded your counsel and became the Lord of Lanka, as the whole world knows.",
    word_meanings:
      "tumharo = your; mantra = counsel/advice; bibhīṣana = Vibhishana; mānā = accepted; laṅkeśvara = lord of Lanka; bhaye = became; saba = all; jaga = world; jānā = knows",
    is_key_verse: false,
    sort_order: 18,
  },

  // ─── Chaupai 18 ───────────────────────────────────────────────────────
  {
    id: "hc-18",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 20,
    sanskrit:
      "जुग सहस्र जोजन पर भानू।\nलील्यो ताहि मधुर फल जानू॥",
    transliteration:
      "juga sahasra jojana para bhānū,\nlīlyo tāhi madhura phala jānū.",
    meaning:
      "The sun, situated thousands of yojanas away, you swallowed it thinking it to be a sweet fruit.",
    word_meanings:
      "juga = age/era; sahasra = thousand; jojana = yojana (unit of distance); para = away; bhānū = sun; līlyo = swallowed; tāhi = that; madhura = sweet; phala = fruit; jānū = thinking/knowing",
    is_key_verse: false,
    sort_order: 19,
  },

  // ─── Chaupai 19 ───────────────────────────────────────────────────────
  {
    id: "hc-19",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 21,
    sanskrit:
      "प्रभु मुद्रिका मेलि मुख माहीं।\nजलधि लाँघि गये अचरज नाहीं॥",
    transliteration:
      "prabhu mudrikā meli mukha māhīṁ,\njaladhi lāṁghi gaye acharaja nāhīṁ.",
    meaning:
      "Carrying the Lord's ring in your mouth, you leapt across the ocean — no wonder at all!",
    word_meanings:
      "prabhu = Lord; mudrikā = ring; meli = placing; mukha = mouth; māhīṁ = in; jaladhi = ocean; lāṁghi = leapt across; gaye = went; acharaja = wonder; nāhīṁ = not",
    is_key_verse: false,
    sort_order: 20,
  },

  // ─── Chaupai 20 ───────────────────────────────────────────────────────
  {
    id: "hc-20",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 22,
    sanskrit:
      "दुर्गम काज जगत के जेते।\nसुगम अनुग्रह तुम्हरे तेते॥",
    transliteration:
      "durgama kāja jagata ke jete,\nsugama anugraha tumhare tete.",
    meaning:
      "All the difficult tasks of the world become easy by your grace.",
    word_meanings:
      "durgama = difficult; kāja = tasks; jagata = world; ke = of; jete = as many as; sugama = easy; anugraha = grace; tumhare = your; tete = that many",
    is_key_verse: false,
    sort_order: 21,
  },

  // ─── Chaupai 21 ───────────────────────────────────────────────────────
  {
    id: "hc-21",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 23,
    sanskrit:
      "राम दुआरे तुम रखवारे।\nहोत न आज्ञा बिनु पैसारे॥",
    transliteration:
      "rāma duāre tuma rakhavāre,\nhota na ājñā binu paisāre.",
    meaning:
      "You are the gatekeeper at Rama's door; none may enter without your permission.",
    word_meanings:
      "rāma = Rama; duāre = door; tuma = you; rakhavāre = guardian; hota = happens; na = not; ājñā = command/permission; binu = without; paisāre = entry",
    is_key_verse: false,
    sort_order: 22,
  },

  // ─── Chaupai 22 ───────────────────────────────────────────────────────
  {
    id: "hc-22",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 24,
    sanskrit:
      "सब सुख लहै तुम्हारी सरना।\nतुम रक्षक काहू को डर ना॥",
    transliteration:
      "saba sukha lahai tumhārī saranā,\ntuma rakṣaka kāhū ko ḍara nā.",
    meaning:
      "All happiness is found in your refuge; with you as protector, there is no fear of anything.",
    word_meanings:
      "saba = all; sukha = happiness; lahai = obtain; tumhārī = your; saranā = refuge; tuma = you; rakṣaka = protector; kāhū = anyone; ko = of; ḍara = fear; nā = not",
    is_key_verse: false,
    sort_order: 23,
  },

  // ─── Chaupai 23 ───────────────────────────────────────────────────────
  {
    id: "hc-23",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 25,
    sanskrit:
      "आपन तेज सम्हारो आपै।\nतीनों लोक हाँक तें काँपै॥",
    transliteration:
      "āpana teja samhāro āpai,\ntīnoṁ loka hāṁka teṁ kāṁpai.",
    meaning:
      "Only you can control your own splendor; all three worlds tremble at your roar.",
    word_meanings:
      "āpana = own; teja = splendor/radiance; samhāro = control; āpai = yourself; tīnoṁ = three; loka = worlds; hāṁka = roar; teṁ = from; kāṁpai = tremble",
    is_key_verse: false,
    sort_order: 24,
  },

  // ─── Chaupai 24 ───────────────────────────────────────────────────────
  {
    id: "hc-24",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 26,
    sanskrit:
      "भूत पिसाच निकट नहिं आवै।\nमहाबीर जब नाम सुनावै॥",
    transliteration:
      "bhūta pisācha nikaṭa nahiṁ āvai,\nmahābīra jaba nāma sunāvai.",
    meaning:
      "Evil spirits and ghosts do not come near when the name of Mahavir (Hanuman) is uttered.",
    word_meanings:
      "bhūta = ghosts; pisācha = evil spirits; nikaṭa = near; nahiṁ = not; āvai = come; mahābīra = great hero (Hanuman); jaba = when; nāma = name; sunāvai = is heard/uttered",
    is_key_verse: false,
    sort_order: 25,
  },

  // ─── Chaupai 25 ───────────────────────────────────────────────────────
  {
    id: "hc-25",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 27,
    sanskrit:
      "नासै रोग हरै सब पीरा।\nजपत निरंतर हनुमत बीरा॥",
    transliteration:
      "nāsai roga harai saba pīrā,\njapata nirantara hanumata bīrā.",
    meaning:
      "All diseases are destroyed and all pain is removed by constantly chanting the name of brave Hanuman.",
    word_meanings:
      "nāsai = destroyed; roga = diseases; harai = removes; saba = all; pīrā = pain; japata = chanting; nirantara = constantly; hanumata = Hanuman; bīrā = brave",
    is_key_verse: false,
    sort_order: 26,
  },

  // ─── Chaupai 26 ───────────────────────────────────────────────────────
  {
    id: "hc-26",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 28,
    sanskrit:
      "संकट तें हनुमान छुड़ावै।\nमन क्रम बचन ध्यान जो लावै॥",
    transliteration:
      "saṅkaṭa teṁ hanumāna chuḍāvai,\nmana krama bachana dhyāna jo lāvai.",
    meaning:
      "Hanuman liberates from all troubles those who meditate on him in thought, deed, and word.",
    word_meanings:
      "saṅkaṭa = troubles; teṁ = from; hanumāna = Hanuman; chuḍāvai = liberates; mana = mind; krama = deed; bachana = word; dhyāna = meditation; jo = who; lāvai = applies",
    is_key_verse: false,
    sort_order: 27,
  },

  // ─── Chaupai 27 ───────────────────────────────────────────────────────
  {
    id: "hc-27",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 29,
    sanskrit:
      "सब पर राम तपस्वी राजा।\nतिन के काज सकल तुम साजा॥",
    transliteration:
      "saba para rāma tapasvī rājā,\ntina ke kāja sakala tuma sājā.",
    meaning:
      "Rama is the supreme ascetic king over all, and you carry out all his tasks.",
    word_meanings:
      "saba = all; para = over; rāma = Rama; tapasvī = ascetic; rājā = king; tina = his; ke = of; kāja = tasks; sakala = all; tuma = you; sājā = accomplished",
    is_key_verse: false,
    sort_order: 28,
  },

  // ─── Chaupai 28 ───────────────────────────────────────────────────────
  {
    id: "hc-28",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 30,
    sanskrit:
      "और मनोरथ जो कोई लावै।\nसोई अमित जीवन फल पावै॥",
    transliteration:
      "aura manoratha jo koī lāvai,\nsoī amita jīvana phala pāvai.",
    meaning:
      "Whoever comes to you with any desire obtains the imperishable fruit of life.",
    word_meanings:
      "aura = and; manoratha = desire; jo = who; koī = anyone; lāvai = brings; soī = that person; amita = imperishable/boundless; jīvana = life; phala = fruit; pāvai = obtains",
    is_key_verse: false,
    sort_order: 29,
  },

  // ─── Chaupai 29 ───────────────────────────────────────────────────────
  {
    id: "hc-29",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 31,
    sanskrit:
      "चारों जुग परताप तुम्हारा।\nहै परसिद्ध जगत उजियारा॥",
    transliteration:
      "chāroṁ juga paratāpa tumhārā,\nhai parasiddha jagata ujiyārā.",
    meaning:
      "Your glory pervades all four ages and your fame illuminates the entire world.",
    word_meanings:
      "chāroṁ = four; juga = ages/yugas; paratāpa = glory; tumhārā = your; hai = is; parasiddha = well-known; jagata = world; ujiyārā = light/illumination",
    is_key_verse: false,
    sort_order: 30,
  },

  // ─── Chaupai 30 ───────────────────────────────────────────────────────
  {
    id: "hc-30",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 32,
    sanskrit:
      "साधु संत के तुम रखवारे।\nअसुर निकंदन राम दुलारे॥",
    transliteration:
      "sādhu santa ke tuma rakhavāre,\nasura nikandana rāma dulāre.",
    meaning:
      "You are the protector of saints and sages, the destroyer of demons, and the beloved of Rama.",
    word_meanings:
      "sādhu = holy men; santa = saints; ke = of; tuma = you; rakhavāre = protector; asura = demons; nikandana = destroyer; rāma = Rama; dulāre = beloved",
    is_key_verse: false,
    sort_order: 31,
  },

  // ─── Chaupai 31 ───────────────────────────────────────────────────────
  {
    id: "hc-31",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 33,
    sanskrit:
      "अष्ट सिद्धि नौ निधि के दाता।\nअस बर दीन जानकी माता॥",
    transliteration:
      "aṣṭa siddhi nau nidhi ke dātā,\nasa bara dīna jānakī mātā.",
    meaning:
      "You have the power to grant the eight mystical perfections and nine treasures, a boon given to you by Mother Janaki (Sita).",
    word_meanings:
      "aṣṭa = eight; siddhi = supernatural powers; nau = nine; nidhi = treasures; ke = of; dātā = giver; asa = such; bara = boon; dīna = gave; jānakī = Sita; mātā = mother",
    is_key_verse: false,
    sort_order: 32,
  },

  // ─── Chaupai 32 ───────────────────────────────────────────────────────
  {
    id: "hc-32",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 34,
    sanskrit:
      "राम रसायन तुम्हरे पासा।\nसदा रहो रघुपति के दासा॥",
    transliteration:
      "rāma rasāyana tumhare pāsā,\nsadā raho raghupati ke dāsā.",
    meaning:
      "You possess the elixir of devotion to Rama; may you always remain the servant of Lord Rama.",
    word_meanings:
      "rāma = Rama; rasāyana = elixir; tumhare = your; pāsā = possession; sadā = always; raho = remain; raghupati = Lord of Raghu dynasty; ke = of; dāsā = servant",
    is_key_verse: false,
    sort_order: 33,
  },

  // ─── Chaupai 33 ───────────────────────────────────────────────────────
  {
    id: "hc-33",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 35,
    sanskrit:
      "तुम्हरे भजन राम को पावै।\nजनम जनम के दुख बिसरावै॥",
    transliteration:
      "tumhare bhajana rāma ko pāvai,\njanama janama ke dukha bisarāvai.",
    meaning:
      "By singing your praises, one attains Rama and the sorrows of many lifetimes are forgotten.",
    word_meanings:
      "tumhare = your; bhajana = devotional singing; rāma = Rama; ko = to; pāvai = attains; janama = birth/life; janama = birth/life; ke = of; dukha = sorrows; bisarāvai = forgotten/removed",
    is_key_verse: false,
    sort_order: 34,
  },

  // ─── Chaupai 34 ───────────────────────────────────────────────────────
  {
    id: "hc-34",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 36,
    sanskrit:
      "अंतकाल रघुबर पुर जाई।\nजहाँ जन्म हरिभक्त कहाई॥",
    transliteration:
      "antakāla raghubara pura jāī,\njahāṁ janma haribhakta kahāī.",
    meaning:
      "At the time of death, one goes to the abode of Rama; and wherever one takes birth, one is known as a devotee of Hari.",
    word_meanings:
      "antakāla = at the time of death; raghubara = best of Raghu dynasty (Rama); pura = abode; jāī = goes; jahāṁ = wherever; janma = birth; haribhakta = devotee of Hari; kahāī = called/known as",
    is_key_verse: false,
    sort_order: 35,
  },

  // ─── Chaupai 35 ───────────────────────────────────────────────────────
  {
    id: "hc-35",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 37,
    sanskrit:
      "और देवता चित्त न धरई।\nहनुमत सेइ सर्ब सुख करई॥",
    transliteration:
      "aura devatā chitta na dharaī,\nhanumata sei sarba sukha karaī.",
    meaning:
      "One need not think of any other deity; serving Hanuman alone gives all happiness.",
    word_meanings:
      "aura = other; devatā = deity; chitta = mind; na = not; dharaī = hold/think; hanumata = Hanuman; sei = serving; sarba = all; sukha = happiness; karaī = gives",
    is_key_verse: false,
    sort_order: 36,
  },

  // ─── Chaupai 36 ───────────────────────────────────────────────────────
  {
    id: "hc-36",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 38,
    sanskrit:
      "संकट कटै मिटै सब पीरा।\nजो सुमिरै हनुमत बलबीरा॥",
    transliteration:
      "saṅkaṭa kaṭai miṭai saba pīrā,\njo sumirai hanumata balabīrā.",
    meaning:
      "All troubles are cut away and all pain is removed for those who remember the mighty brave Hanuman.",
    word_meanings:
      "saṅkaṭa = troubles; kaṭai = cut away; miṭai = removed; saba = all; pīrā = pain; jo = who; sumirai = remembers; hanumata = Hanuman; balabīrā = mighty and brave",
    is_key_verse: false,
    sort_order: 37,
  },

  // ─── Chaupai 37 ───────────────────────────────────────────────────────
  {
    id: "hc-37",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 39,
    sanskrit:
      "जय जय जय हनुमान गोसाईं।\nकृपा करहु गुरुदेव की नाईं॥",
    transliteration:
      "jaya jaya jaya hanumāna gosāīṁ,\nkṛpā karahu gurudeva kī nāīṁ.",
    meaning:
      "Victory, victory, victory to Lord Hanuman! Bestow your grace upon me as a Guru does upon his disciple.",
    word_meanings:
      "jaya = victory; hanumāna = Hanuman; gosāīṁ = lord/master; kṛpā = grace; karahu = bestow; gurudeva = revered guru; kī = like; nāīṁ = manner",
    is_key_verse: false,
    sort_order: 38,
  },

  // ─── Chaupai 38 ───────────────────────────────────────────────────────
  {
    id: "hc-38",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 40,
    sanskrit:
      "जो सत बार पाठ कर कोई।\nछूटहि बंदि महा सुख होई॥",
    transliteration:
      "jo sata bāra pāṭha kara koī,\nchūṭahi bandi mahā sukha hoī.",
    meaning:
      "Whoever recites this a hundred times is freed from bondage and attains supreme bliss.",
    word_meanings:
      "jo = who; sata = hundred; bāra = times; pāṭha = recitation; kara = does; koī = anyone; chūṭahi = freed; bandi = bondage; mahā = great; sukha = happiness/bliss; hoī = happens",
    is_key_verse: false,
    sort_order: 39,
  },

  // ─── Chaupai 39 ───────────────────────────────────────────────────────
  {
    id: "hc-39",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 41,
    sanskrit:
      "जो यह पढ़ै हनुमान चालीसा।\nहोय सिद्धि साखी गौरीसा॥",
    transliteration:
      "jo yaha paḍhai hanumāna chālīsā,\nhoya siddhi sākhī gaurīsā.",
    meaning:
      "Whoever reads this Hanuman Chalisa attains spiritual perfection, as Lord Shiva himself bears witness.",
    word_meanings:
      "jo = who; yaha = this; paḍhai = reads; hanumāna = Hanuman; chālīsā = forty verses; hoya = attains; siddhi = spiritual perfection; sākhī = witness; gaurīsā = Lord of Gauri (Shiva)",
    is_key_verse: false,
    sort_order: 40,
  },

  // ─── Chaupai 40 ───────────────────────────────────────────────────────
  {
    id: "hc-40",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 42,
    sanskrit:
      "तुलसीदास सदा हरि चेरा।\nकीजै नाथ हृदय महँ डेरा॥",
    transliteration:
      "tulasīdāsa sadā hari cherā,\nkījai nātha hṛdaya mahaṁ ḍerā.",
    meaning:
      "Tulsidas is forever the servant of Hari; O Lord, make your abode in my heart.",
    word_meanings:
      "tulasīdāsa = Tulsidas (the poet); sadā = always; hari = Lord Hari (Vishnu/Rama); cherā = servant; kījai = make; nātha = Lord; hṛdaya = heart; mahaṁ = in; ḍerā = abode/dwelling",
    is_key_verse: false,
    sort_order: 41,
  },

  // ─── Closing Doha ─────────────────────────────────────────────────────
  {
    id: "hc-doha-3",
    scripture_id: "hanuman-chalisa",
    chapter_id: "hanuman-chalisa-main",
    verse_number: 43,
    sanskrit:
      "पवनतनय संकट हरन मंगल मूरति रूप।\nराम लखन सीता सहित हृदय बसहु सुर भूप॥",
    transliteration:
      "pavanatanaya saṅkaṭa harana maṅgala mūrati rūpa,\nrāma lakhana sītā sahita hṛdaya basahu sura bhūpa.",
    meaning:
      "O Son of the Wind, remover of all afflictions, embodiment of auspiciousness — dwell in my heart together with Rama, Lakshmana, and Sita, O King of the Gods.",
    word_meanings:
      "pavanatanaya = son of the wind (Hanuman); saṅkaṭa = afflictions; harana = remover; maṅgala = auspicious; mūrati = form/embodiment; rūpa = appearance; rāma = Rama; lakhana = Lakshmana; sītā = Sita; sahita = together with; hṛdaya = heart; basahu = dwell; sura = gods; bhūpa = king",
    is_key_verse: false,
    sort_order: 42,
  },
];
