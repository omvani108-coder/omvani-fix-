/**
 * Seed data for Sunderkand (from Ramcharitmanas by Tulsidas)
 *
 * The Sunderkand is the fifth chapter (kand) of the Ramcharitmanas,
 * composed by Goswami Tulsidas in the 16th century in Awadhi Hindi.
 * It narrates Hanuman's journey to Lanka in search of Sita.
 *
 * This file contains 30 key dohas and chaupais that are most commonly
 * recited during Sunderkand path.
 */

export const scripture = {
  id: "sunderkand",
  name: "Sunderkand",
  name_sanskrit: "सुन्दरकाण्ड",
  tradition: "Ramcharitmanas",
  category: "Epic",
  total_verses: 60,
  total_chapters: 1,
  summary:
    "The beautiful chapter from the Ramcharitmanas by Tulsidas, narrating Hanuman's journey to Lanka in search of Sita. It is the most recited section of the Ramayana, known for its power to remove obstacles and bring divine grace.",
  accent_color: "hsl(15,80%,50%)",
  is_free: false,
  sort_order: 4,
};

export const chapters = [
  {
    id: "sunderkand-main",
    scripture_id: "sunderkand",
    number: 1,
    title: "Sunderkand",
    subtitle: "The Beautiful Chapter",
    summary:
      "Hanuman leaps across the ocean to Lanka, finds Sita in Ashok Vatika, burns Lanka, and returns triumphant. This chapter celebrates devotion, courage, and the power of divine grace.",
    total_verses: 60,
    is_free: false,
    sort_order: 1,
  },
];

export const verses = [
  // ─── 1. Opening Doha — Invocation ─────────────────────────────────────────
  {
    id: "sk-1",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 1,
    sanskrit:
      "शान्तं शाश्वतमप्रमेयमनघं निर्वाणशान्तिप्रदं\nब्रह्माशम्भुफणीन्द्रसेव्यमनिशं वेदान्तवेद्यं विभुम्।\nरामाख्यं जगदीश्वरं सुरगुरुं मायामनुष्यं हरिं\nवन्देऽहं करुणाकरं रघुवरं भूपालचूडामणिम्॥",
    transliteration:
      "Shantam shashvatam aprameyam anagham nirvanashantipradam\nBrahma-shambhu-phanindra-sevyam anisham vedanta-vedyam vibhum.\nRamakhyam jagadishvaram suragurum mayamanushyam harim\nVande'ham karunakaram raghu-varam bhupalacudamanim.",
    meaning:
      "I bow to Lord Rama, who is peaceful, eternal, beyond measure, sinless, and the bestower of liberation and peace. He is served by Brahma, Shiva, and Shesha; known through the Vedanta; the lord of the universe, the guru of the gods, Hari in human form, the ocean of compassion, the best of the Raghus, and the crown jewel among kings.",
    word_meanings:
      "shantam = peaceful; shashvatam = eternal; aprameyam = beyond measure; anagham = sinless; nirvanashantipradam = bestower of liberation and peace; Ramakhyam = known as Rama; jagadishvaram = lord of the universe; karunakaram = ocean of compassion; raghu-varam = best of Raghu dynasty",
    is_key_verse: true,
    sort_order: 0,
  },

  // ─── 2. Invocation to Hanuman ──────────────────────────────────────────────
  {
    id: "sk-2",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 2,
    sanskrit:
      "नानापुराणनिगमागमसम्मतं यद्\nरामायणे निगदितं क्वचिदन्यतोऽपि।\nस्वान्तःसुखाय तुलसी रघुनाथगाथा\nभाषानिबन्धमतिमञ्जुलमातनोति॥",
    transliteration:
      "Nanapurana-nigamagama-sammatam yad\nRamayane nigaditam kvacid anyato'pi.\nSvantah-sukhaya Tulasi Raghunatha-gatha\nBhasha-nibandham atimanjulam atanoti.",
    meaning:
      "That which is approved by the various Puranas, Vedas, and Agamas, narrated in the Ramayana and elsewhere too — for the joy of his own heart, Tulsidas presents that story of Lord Raghunath in most beautiful vernacular verse.",
    word_meanings:
      "nanapurana = various Puranas; nigama = Vedas; agama = scriptures; sammatam = approved; svantah-sukhaya = for the joy of one's own heart; Tulasi = Tulsidas; Raghunatha-gatha = story of Lord Raghunath; bhasha = vernacular language; atimanjulam = most beautiful",
    is_key_verse: true,
    sort_order: 1,
  },

  // ─── 3. Hanuman prepares to leap — Chaupai ────────────────────────────────
  {
    id: "sk-3",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 3,
    sanskrit:
      "जामवंत के बचन सुहाए। सुनि हनुमंत हृदय अति भाए॥\nतब लगि मोहि परिखेहु तुम्ह भाई। सहि दुख कंद मूल फल खाई॥",
    transliteration:
      "Jamavanta ke bachana suhae. Suni Hanumanta hridaya ati bhae.\nTaba lagi mohi parikhahu tumha bhai. Sahi dukha kanda mula phala khai.",
    meaning:
      "The sweet words of Jambavan pleased Hanuman's heart greatly. Jambavan said: 'Wait for me, brothers, enduring hardship and eating roots and fruits.'",
    word_meanings:
      "Jamavanta = Jambavan (the bear king); bachana = words; suhae = pleasant; hridaya = heart; bhae = pleased; parikhahu = wait; kanda = tubers; mula = roots; phala = fruits",
    is_key_verse: false,
    sort_order: 2,
  },

  // ─── 4. Jambavan reminds Hanuman of his power ─────────────────────────────
  {
    id: "sk-4",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 4,
    sanskrit:
      "कहइ रीछपति सुनु हनुमाना। का चुप साधि रहे बलवाना॥\nपवन तनय बल पवन समाना। बुधि बिबेक बिग्यान निधाना॥",
    transliteration:
      "Kahai richapati sunu Hanumana. Ka chupa sadhi rahe balavana.\nPavana tanaya bala pavana samana. Budhi bibeka bigyaana nidhana.",
    meaning:
      "The king of the bears (Jambavan) said: 'Listen Hanuman! Why do you sit in silence, O mighty one? O son of the Wind, your strength equals the wind itself. You are a treasure-house of wisdom, discernment, and knowledge.'",
    word_meanings:
      "richapati = king of bears (Jambavan); chupa = silence; balavana = mighty one; pavana tanaya = son of the Wind; bala = strength; budhi = wisdom; bibeka = discernment; bigyaana = knowledge; nidhana = treasure-house",
    is_key_verse: true,
    sort_order: 3,
  },

  // ─── 5. Hanuman grows in size ──────────────────────────────────────────────
  {
    id: "sk-5",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 5,
    sanskrit:
      "कनक बरन तन तेज बिराजा। दुंदुभी नाद गरज सो गाजा॥\nबार बार रघुनाथ सँभारी। तरकेउ पवनतनय बल भारी॥",
    transliteration:
      "Kanaka barana tana teja biraja. Dundubhi nada garaja so gaja.\nBara bara Raghunatha sambhari. Tarakeu pavanatanaya bala bhari.",
    meaning:
      "His golden body shone with radiance. He roared like a thundering kettledrum. Remembering Lord Raghunath again and again, the mighty son of the Wind leapt forth.",
    word_meanings:
      "kanaka = golden; barana = color; tana = body; teja = radiance; biraja = shining; dundubhi = kettledrum; nada = sound; garaja = thunder; Raghunatha = Lord Rama; sambhari = remembering; tarakeu = leapt; pavanatanaya = son of the Wind; bala bhari = mighty",
    is_key_verse: true,
    sort_order: 4,
  },

  // ─── 6. Hanuman leaps across the ocean ─────────────────────────────────────
  {
    id: "sk-6",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 6,
    sanskrit:
      "जेहिं गिरि चरन देइ हनुमंता। चलेउ सो गा पाताल तुरंता॥\nजिमि अमोघ रघुपति कर बाना। एही भाँति चलेउ हनुमाना॥",
    transliteration:
      "Jehi giri charana dei Hanumanta. Chaleu so ga patala turanta.\nJimi amogha Raghupati kara bana. Ehi bhanti chaleu Hanumana.",
    meaning:
      "The mountain on which Hanuman placed his feet sank instantly into the netherworld. Just as the infallible arrow of Lord Rama (never misses its mark), so did Hanuman proceed forth.",
    word_meanings:
      "giri = mountain; charana = feet; patala = netherworld; turanta = immediately; amogha = infallible; Raghupati = Lord Rama; bana = arrow; chaleu = proceeded",
    is_key_verse: false,
    sort_order: 5,
  },

  // ─── 7. Surasa tests Hanuman ───────────────────────────────────────────────
  {
    id: "sk-7",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 7,
    sanskrit:
      "आइ सबल रघुपति की दूती। ताकर बचन मानि केहि भूती॥\nराम काजु सबु करिहउँ आई। मत मोहि जबहिं तब भीतर जाई॥",
    transliteration:
      "Ai sabala Raghupati ki duti. Takara bachana mani kehi bhuti.\nRama kaju sabu karihau ai. Mata mohi jabahi taba bhitara jai.",
    meaning:
      "Hanuman said to Surasa: 'You are a powerful messenger of Lord Rama. I shall honor your words. Let me first complete Lord Rama's task and return, then I shall enter your mouth, O mother.'",
    word_meanings:
      "sabala = powerful; duti = messenger; bachana = words; mani = honor; Rama kaju = Rama's task; karihau = I shall do; mata = mother; bhitara = inside; jai = go",
    is_key_verse: false,
    sort_order: 6,
  },

  // ─── 8. Hanuman outwits Surasa — Doha ──────────────────────────────────────
  {
    id: "sk-8",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 8,
    sanskrit:
      "सुरसा बदन पैठि पुनि बाहेर आवा। सत्यमेव जयति बचन सुनावा॥\nतात मोर बचन सब साचा। राम काज करि बिलंब न राखा॥",
    transliteration:
      "Surasa badana paithi puni bahera ava. Satyameva jayati bachana sunava.\nTata mora bachana saba sacha. Rama kaja kari bilamba na rakha.",
    meaning:
      "Hanuman entered Surasa's mouth and came out again instantly, saying 'Truth alone triumphs.' He declared: 'My words are all true. I have fulfilled your condition without delaying Lord Rama's mission.'",
    word_meanings:
      "badana = mouth; paithi = entered; bahera = outside; ava = came; satyameva jayati = truth alone triumphs; bachana = words; sacha = true; Rama kaja = Rama's task; bilamba = delay",
    is_key_verse: false,
    sort_order: 7,
  },

  // ─── 9. Hanuman arrives at Lanka — Doha ────────────────────────────────────
  {
    id: "sk-9",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 9,
    sanskrit:
      "पुर रखवारे देखि बहु कपि मन कीन्ह बिचार।\nअति लघु रूप धरेउँ निसि नगर करौं पइसार॥",
    transliteration:
      "Pura rakhavare dekhi bahu kapi mana kinha bichara.\nAti laghu rupa dhareu nisi nagara karau paisara.",
    meaning:
      "Seeing many guards protecting the city, the monkey (Hanuman) thought: 'I shall assume a very tiny form and enter the city at night.'",
    word_meanings:
      "pura = city; rakhavare = guards; bahu = many; kapi = monkey; bichara = thought; ati laghu = very small; rupa = form; dhareu = assumed; nisi = night; nagara = city; paisara = enter",
    is_key_verse: false,
    sort_order: 8,
  },

  // ─── 10. Lankini encounter ─────────────────────────────────────────────────
  {
    id: "sk-10",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 10,
    sanskrit:
      "लंकनि बोलि चली कोलाहा। लात उरहि मारा कपि नाहा॥\nरुधिर बमत धरनीं ढ़नमानी। कह कपि मारा मोहि बिलानी॥",
    transliteration:
      "Lankani boli chali kolaha. Lata urahi mara kapi naha.\nRudhira bamata dharani dhanamani. Kaha kapi mara mohi bilani.",
    meaning:
      "Lankini (the guardian deity of Lanka) challenged with a roar. The lord of monkeys struck her on the chest with his foot. Vomiting blood and falling to the ground, she cried: 'The monkey has struck me down!'",
    word_meanings:
      "Lankani = Lankini, guardian deity of Lanka; kolaha = roar; lata = kick; urahi = on the chest; kapi naha = lord of monkeys; rudhira = blood; bamata = vomiting; dharani = ground",
    is_key_verse: false,
    sort_order: 9,
  },

  // ─── 11. Lankini's prophecy ────────────────────────────────────────────────
  {
    id: "sk-11",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 11,
    sanskrit:
      "जब मैं हरि को मार खाई। तब जानेउँ नगर सब काई॥\nतात मोर अति पुन्य बहूता। देखेउँ नयन राम कर दूता॥",
    transliteration:
      "Jaba mai hari ko mara khai. Taba janeu nagara saba kai.\nTata mora ati punya bahuta. Dekheu nayana Rama kara duta.",
    meaning:
      "Lankini said: 'When I receive a blow from a monkey, then know that the end of all Lanka has come. My great fortune is immense, for I have beheld with my own eyes the messenger of Lord Rama.'",
    word_meanings:
      "hari = monkey; mara = blow; khai = received; nagara = city; punya = merit/fortune; bahuta = great; nayana = eyes; Rama kara duta = messenger of Rama",
    is_key_verse: true,
    sort_order: 10,
  },

  // ─── 12. Hanuman searches Lanka ────────────────────────────────────────────
  {
    id: "sk-12",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 12,
    sanskrit:
      "मंदिर मंदिर प्रति करि सोधा। देखे जहँ तहँ अगनित जोधा॥\nगयउ दसानन मंदिर माहीं। अति बिचित्र कहि जात सो नाहीं॥",
    transliteration:
      "Mandira mandira prati kari sodha. Dekhe jahan tahan aganita jodha.\nGayau Dasanana mandira mahin. Ati bichitra kahi jata so nahin.",
    meaning:
      "Searching palace after palace, he saw countless warriors everywhere. He went into Ravana's palace, which was extraordinarily magnificent beyond description.",
    word_meanings:
      "mandira = palace; prati = each; sodha = search; aganita = countless; jodha = warriors; Dasanana = Ravana (ten-headed); bichitra = wondrous; kahi jata = can be described; nahin = not",
    is_key_verse: false,
    sort_order: 11,
  },

  // ─── 13. Hanuman sees Vibhishan ────────────────────────────────────────────
  {
    id: "sk-13",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 13,
    sanskrit:
      "पुनि सप्रेम बोलेउ हनुमाना। सुनहु बिभीषन परम सुजाना॥\nजासु नाम जपि सुनहु बिभीषन। भव सिंधु गोपद इव तरि जाना॥",
    transliteration:
      "Puni saprema boleu Hanumana. Sunahu Bibhishana parama sujana.\nJasu nama japi sunahu Bibhishana. Bhava sindhu gopada iva tari jana.",
    meaning:
      "Then Hanuman spoke with love: 'Listen, O most wise Vibhishan. By chanting whose name, O Vibhishan, one can cross the ocean of worldly existence as if it were a mere puddle.'",
    word_meanings:
      "saprema = with love; boleu = spoke; parama = most; sujana = wise; nama = name; japi = chanting; bhava sindhu = ocean of worldly existence; gopada = cow's hoofprint (puddle); tari = cross",
    is_key_verse: true,
    sort_order: 12,
  },

  // ─── 14. Vibhishan pledges devotion to Rama ───────────────────────────────
  {
    id: "sk-14",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 14,
    sanskrit:
      "होइहि सोइ जो राम रचि राखा। को करि तर्क बढ़ावै साखा॥\nअस कहि लगे जपन हरिनामा। गयउ बिभीषन जहँ श्रीरामा॥",
    transliteration:
      "Hoihi soi jo Rama rachi rakha. Ko kari tarka badhavai sakha.\nAsa kahi lage japana Harinama. Gayau Bibhishana jahan Shrirama.",
    meaning:
      "Whatever Lord Rama has ordained shall come to pass. Who can alter fate by mere argument? Saying this, Vibhishan began chanting the name of Hari and went to where Lord Rama was.",
    word_meanings:
      "hoihi = shall happen; soi = that; Rama rachi rakha = Rama has ordained; tarka = argument; sakha = branch (fate); japana = chanting; Harinama = name of Hari; gayau = went",
    is_key_verse: false,
    sort_order: 13,
  },

  // ─── 15. Hanuman finds Sita in Ashok Vatika — key moment ──────────────────
  {
    id: "sk-15",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 15,
    sanskrit:
      "तहँ देखी सीता प्रभु माहीं। क्षीन सत्त्व रघुपति बिन नाहीं॥\nतरु पल्लव महँ रहा लुकाई। करइ बिचार करौं का भाई॥",
    transliteration:
      "Tahan dekhi Sita prabhu mahin. Kshina sattva Raghupati bina nahin.\nTaru pallava mahan raha lukai. Karai bichara karau ka bhai.",
    meaning:
      "There he saw Sita in the grove, her strength waning without Lord Rama. Hiding among the leaves of a tree, he pondered: 'What should I do now, brother?'",
    word_meanings:
      "tahan = there; dekhi = saw; Sita = Sita; kshina = weakened; sattva = strength; Raghupati = Lord Rama; taru = tree; pallava = leaves; lukai = hiding; bichara = deliberation",
    is_key_verse: true,
    sort_order: 14,
  },

  // ─── 16. Hanuman sings Rama's glory to Sita ───────────────────────────────
  {
    id: "sk-16",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 16,
    sanskrit:
      "रामचन्द्र गुन बरनैं लागा। सुनतहिं सीता कर दुख भागा॥\nरघुपति दूत जानि मन माहीं। आनन्दहि मन अधिक उछाहीं॥",
    transliteration:
      "Ramachandra guna barnaim laga. Sunatahim Sita kara dukha bhaga.\nRaghupati duta jani mana mahin. Anandahi mana adhika uchhahin.",
    meaning:
      "Hanuman began to describe the virtues of Lord Ramachandra. Hearing them, Sita's sorrow fled away. Knowing him in her heart to be Lord Rama's messenger, her mind was filled with great joy.",
    word_meanings:
      "Ramachandra = Lord Rama; guna = virtues; barnaim = describe; sunatahim = upon hearing; dukha = sorrow; bhaga = fled; duta = messenger; jani = knowing; anandahi = with joy; uchhahin = elated",
    is_key_verse: true,
    sort_order: 15,
  },

  // ─── 17. Hanuman reveals himself to Sita ───────────────────────────────────
  {
    id: "sk-17",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 17,
    sanskrit:
      "कपि के बचन सप्रेम सुनि उपजा मन बिस्वास।\nजाना मन क्रम बचन यह कृपासिंधु कर दास॥",
    transliteration:
      "Kapi ke bachana saprema suni upaja mana bisvasa.\nJana mana krama bachana yaha kripasindhu kara dasa.",
    meaning:
      "Hearing the monkey's loving words, faith arose in Sita's heart. She recognized that this was indeed the servant of the Ocean of Mercy (Lord Rama) in thought, deed, and word.",
    word_meanings:
      "kapi = monkey; bachana = words; saprema = with love; upaja = arose; bisvasa = faith; mana = mind; krama = deed; kripasindhu = ocean of mercy; dasa = servant",
    is_key_verse: true,
    sort_order: 16,
  },

  // ─── 18. Hanuman gives Rama's ring to Sita ────────────────────────────────
  {
    id: "sk-18",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 18,
    sanskrit:
      "तब हनुमंत निकट चलि गयऊ। फिरि बैठी मन बिसमय भयऊ॥\nराम नाम अंगूठी दीन्हि। जनकी हरष प्रान सम कीन्हि॥",
    transliteration:
      "Taba Hanumanta nikata chali gayau. Phiri baithi mana bismaya bhayau.\nRama nama anguthi dinhi. Janaki harasha prana sama kinhi.",
    meaning:
      "Then Hanuman approached nearby. Sita turned and sat, wonderstruck. He gave her the ring bearing Rama's name. Janaki (Sita) was overjoyed and held it as dear as her very life.",
    word_meanings:
      "nikata = near; bismaya = wonder; anguthi = ring; dinhi = gave; Janaki = Sita (daughter of Janak); harasha = joy; prana = life; sama = equal",
    is_key_verse: true,
    sort_order: 17,
  },

  // ─── 19. Sita's message to Rama ───────────────────────────────────────────
  {
    id: "sk-19",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 19,
    sanskrit:
      "कहु कपि केहि बिधि राखौं प्राना। तुम्हहू तात कहत अब जाना॥\nतोहि देखि सीतलि भइ छाती। पुनि मो कहुँ सोइ दिनु सो राती॥",
    transliteration:
      "Kahu kapi kehi bidhi rakhau prana. Tumhahu tata kahata aba jana.\nTohi dekhi sitali bhai chhati. Puni mo kahun soi dinu so rati.",
    meaning:
      "Sita said: 'Tell me, O monkey, how shall I sustain my life? You too, dear one, say you must now leave. Seeing you, my heart was cooled (comforted), but without you, every day and night will be the same (of suffering).'",
    word_meanings:
      "kahu = tell; kehi bidhi = by what means; rakhau = sustain; prana = life; tata = dear one; jana = go; sitali = cooled; chhati = chest/heart; dinu = day; rati = night",
    is_key_verse: false,
    sort_order: 18,
  },

  // ─── 20. Hanuman reassures Sita ────────────────────────────────────────────
  {
    id: "sk-20",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 20,
    sanskrit:
      "जनकसुतहि समुझाइ करि बहु बिधि धीरजु दीन्ह।\nचरन कमल सिरु नाइ कपि गवनु राम पहिं कीन्ह॥",
    transliteration:
      "Janakasutahi samujhai kari bahu bidhi dhiraju dinha.\nCharana kamala siru nai kapi gavanu Rama pahin kinha.",
    meaning:
      "Consoling the daughter of Janak (Sita) in many ways and giving her courage, the monkey bowed his head at her lotus feet and departed to return to Lord Rama.",
    word_meanings:
      "Janakasutahi = daughter of Janak (Sita); samujhai = consoling; dhiraju = courage/patience; dinha = gave; charana kamala = lotus feet; siru nai = bowed his head; gavanu = departed",
    is_key_verse: false,
    sort_order: 19,
  },

  // ─── 21. Hanuman destroys Ashok Vatika ─────────────────────────────────────
  {
    id: "sk-21",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 21,
    sanskrit:
      "कछु खाइ कछु बिडारि डारा। कछु मलीन करि नाखेस बारा॥\nतरु तोरि-तोरि खाई फलन के ढेरा। राखत बन उजारि घनेरा॥",
    transliteration:
      "Kachhu khai kachhu bidari dara. Kachhu malina kari nakhesa bara.\nTaru tori-tori khai phalana ke dhera. Rakhata bana ujari ghanera.",
    meaning:
      "He ate some fruits, destroyed some, and defiled others by throwing them away. Breaking tree after tree, he consumed heaps of fruits and devastated the entire grove.",
    word_meanings:
      "kachhu = some; khai = ate; bidari = destroyed; malina = defiled; nakhesa = threw; taru = trees; tori = breaking; phalana = fruits; dhera = heaps; bana = grove; ujari = devastated",
    is_key_verse: false,
    sort_order: 20,
  },

  // ─── 22. Hanuman defeats Akshay Kumar (Ravana's son) ──────────────────────
  {
    id: "sk-22",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 22,
    sanskrit:
      "कनक भूधराकार सरीरा। समर भयंकर अतिबल बीरा॥\nकूदि चढ़ा कपि कनक अटारीं। भइ सभा सब सकल पुर नारीं॥",
    transliteration:
      "Kanaka bhudharakara sarira. Samara bhayankara atibala bira.\nKudi chadha kapi kanaka atarin. Bhai sabha saba sakala pura narin.",
    meaning:
      "With a body like a golden mountain, fearsome in battle, supremely powerful and heroic — the monkey leapt atop the golden turrets. All the women of the city gathered to watch.",
    word_meanings:
      "kanaka = golden; bhudharakara = mountain-like; sarira = body; samara = battle; bhayankara = fearsome; atibala = supremely powerful; bira = heroic; kudi = leapt; atarin = turrets; pura = city; narin = women",
    is_key_verse: false,
    sort_order: 21,
  },

  // ─── 23. Meghnad captures Hanuman with Brahmastra ─────────────────────────
  {
    id: "sk-23",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 23,
    sanskrit:
      "ब्रह्म अस्त्र तेहिं साँधा कपि पर। परतिहुँ बार काटि नहिं सकई पर॥\nब्रह्मा बर दीन्ह कपि मानत। बंदि परेउ स्वयं सो जानत॥",
    transliteration:
      "Brahma astra tehi sandha kapi para. Paratihu bara kati nahin sakai para.\nBrahma bara dinha kapi manata. Bandi pareu svayam so janata.",
    meaning:
      "Meghnad aimed the Brahmastra at the monkey, yet even though it struck, it could not truly bind him. Out of respect for Brahma's boon, the monkey voluntarily submitted to capture, knowing full well what he was doing.",
    word_meanings:
      "Brahma astra = weapon of Brahma; sandha = aimed; kapi = monkey; kati = cut/harm; sakai = could; Brahma bara = Brahma's boon; manata = respecting; bandi = captive; pareu = became; svayam = voluntarily; janata = knowing",
    is_key_verse: false,
    sort_order: 22,
  },

  // ─── 24. Hanuman in Ravana's court ─────────────────────────────────────────
  {
    id: "sk-24",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 24,
    sanskrit:
      "कपि बंधन सुनि निसिचर धावा। कौतुक लागि सभा सब आवा॥\nदसमुख सभा दीखि कपि जाई। कहि न जाइ कछु अति प्रभुताई॥",
    transliteration:
      "Kapi bandhana suni nisichara dhava. Kautuka lagi sabha saba ava.\nDasamukha sabha dikhi kapi jai. Kahi na jai kachhu ati prabhutai.",
    meaning:
      "Hearing of the monkey's capture, the demons rushed forth. The entire assembly came out of curiosity. The monkey beheld Ravana's court — its grandeur was indescribable.",
    word_meanings:
      "kapi = monkey; bandhana = capture; nisichara = demons; dhava = rushed; kautuka = curiosity; sabha = assembly; Dasamukha = ten-faced (Ravana); dikhi = beheld; prabhutai = grandeur; kahi na jai = indescribable",
    is_key_verse: false,
    sort_order: 23,
  },

  // ─── 25. Hanuman's fearless speech to Ravana ──────────────────────────────
  {
    id: "sk-25",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 25,
    sanskrit:
      "जानि मन कपि अजर अमर। देखि अमित बल बपुष अपर॥\nमूढ़ तोहि अतिसय अभिमाना। नहिं सुधि श्रीरघुनाथ कर बाना॥",
    transliteration:
      "Jani mana kapi ajara amara. Dekhi amita bala bapusha apara.\nMudha tohi atisaya abhimana. Nahin sudhi Shri Raghunatha kara bana.",
    meaning:
      "Hanuman said: 'O fool, you are filled with excessive pride. You have no idea about the arrows of Lord Raghunath. Know this — this monkey is ageless and immortal, with boundless strength and a magnificent form.'",
    word_meanings:
      "mudha = fool; atisaya = excessive; abhimana = pride; sudhi = awareness; Raghunatha = Lord Rama; bana = arrows; ajara = ageless; amara = immortal; amita = boundless; bala = strength; bapusha = form",
    is_key_verse: true,
    sort_order: 24,
  },

  // ─── 26. Hanuman's tail is set on fire ─────────────────────────────────────
  {
    id: "sk-26",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 26,
    sanskrit:
      "पूँछ बुड़ाइ लंक सब दहई। कूदि परा पुनि सिंधु महँ अहई॥\nबालक बिनय सुनि सनमानी। फिरि बैठी मन अति हरषानी॥",
    transliteration:
      "Puncha budhai Lanka saba dahai. Kudi para puni sindhu mahan ahai.\nBalaka binaya suni sanamani. Phiri baithi mana ati harashani.",
    meaning:
      "With his burning tail, Hanuman set all of Lanka ablaze. Then he leapt into the ocean. Hearing the child's (Hanuman's) humble prayer, Sita was honored and sat with her heart greatly delighted.",
    word_meanings:
      "puncha = tail; budhai = dipped/set afire; Lanka = Lanka; dahai = burned; kudi = leapt; sindhu = ocean; balaka = child; binaya = humble prayer; sanamani = honored; harashani = delighted",
    is_key_verse: true,
    sort_order: 25,
  },

  // ─── 27. Lanka burns — famous chaupai ──────────────────────────────────────
  {
    id: "sk-27",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 27,
    sanskrit:
      "हरि प्रेरित तेहि अवसर चले मरुत उनचास।\nअट्टहास करि गर्जा कपि बढ़ी लाग अकास॥",
    transliteration:
      "Hari prerita tehi avasara chale maruta unachasa.\nAttahasa kari garja kapi badhi laga akasa.",
    meaning:
      "At that moment, impelled by the Lord, forty-nine winds began to blow. The monkey roared with a thunderous laugh, and the flames grew to touch the sky.",
    word_meanings:
      "Hari = Lord Vishnu; prerita = impelled; maruta = winds; unachasa = forty-nine; attahasa = thunderous laugh; garja = roared; kapi = monkey; badhi = grew; akasa = sky",
    is_key_verse: true,
    sort_order: 26,
  },

  // ─── 28. Hanuman returns triumphant — Doha ─────────────────────────────────
  {
    id: "sk-28",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 28,
    sanskrit:
      "कपि के बचन सुनत मन भयऊ सुख कंद।\nतुलसीदास सदा हरि चेरा कीन्ह अनंद॥",
    transliteration:
      "Kapi ke bachana sunata mana bhayau sukha kanda.\nTulasidasa sada hari chera kinha ananda.",
    meaning:
      "Hearing the monkey's words, the heart became a bulb of joy. Tulsidas, forever a servant of Hari, was filled with bliss.",
    word_meanings:
      "kapi = monkey; bachana = words; mana = heart; sukha = joy; kanda = bulb/root; Tulasidasa = Tulsidas (the poet); sada = always; hari chera = servant of Hari; ananda = bliss",
    is_key_verse: false,
    sort_order: 27,
  },

  // ─── 29. Hanuman reports to Rama ───────────────────────────────────────────
  {
    id: "sk-29",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 29,
    sanskrit:
      "सुनि सीता दुख प्रभु सुख अयना। भगति मनोरथ पूरन ग्याना॥\nकपिपति बहु प्रकार समुझावा। फिरि सुग्रीव सबहिं समुझावा॥",
    transliteration:
      "Suni Sita dukha Prabhu sukha ayana. Bhagati manoratha purana gyana.\nKapipati bahu prakara samujhava. Phiri Sugriva sabahi samujhava.",
    meaning:
      "Hearing of Sita's suffering, the Lord who is the abode of bliss, whose devotion fulfills all wishes and who is the embodiment of knowledge, was moved. The chief of monkeys (Hanuman) explained everything in detail. Then Sugriva counseled everyone.",
    word_meanings:
      "Sita dukha = Sita's suffering; Prabhu = Lord; sukha ayana = abode of bliss; bhagati = devotion; manoratha = wishes; purana = fulfills; gyana = knowledge; kapipati = chief of monkeys; samujhava = explained; Sugriva = Sugriva (monkey king)",
    is_key_verse: false,
    sort_order: 28,
  },

  // ─── 30. Rama embraces Hanuman — most famous verse ────────────────────────
  {
    id: "sk-30",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 30,
    sanskrit:
      "सुनि सब कथा राम अभिरामा। बोले बचन परम ललामा॥\nपरसा सीस सकल गुन धामा। तात तुम्हार तुल्य कोउ नाहीं॥",
    transliteration:
      "Suni saba katha Rama Abhirama. Bole bachana parama lalama.\nParasa sisa sakala guna dhama. Tata tumhara tulya kou nahin.",
    meaning:
      "Hearing the entire account, the supremely beautiful Lord Rama spoke gracious words. Touching Hanuman's head — that abode of all virtues — He said: 'Dear one, there is none equal to you.'",
    word_meanings:
      "katha = story; Abhirama = supremely beautiful; bachana = words; parama = supreme; lalama = gracious; parasa = touched; sisa = head; sakala = all; guna = virtues; dhama = abode; tata = dear one; tulya = equal; kou nahin = none",
    is_key_verse: true,
    sort_order: 29,
  },

  // ─── 31. Rama praises Hanuman's devotion ───────────────────────────────────
  {
    id: "sk-31",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 31,
    sanskrit:
      "सुनु कपि तोहि समान उपकारी। नहिं कोउ सुर नर मुनि तनुधारी॥\nप्रति उपकार करौं का तोरा। सनमुख होइ न सकत मन मोरा॥",
    transliteration:
      "Sunu kapi tohi samana upakari. Nahin kou sura nara muni tanudhhari.\nPrati upakara karau ka tora. Sanmukha hoi na sakata mana mora.",
    meaning:
      "Lord Rama said: 'Listen, O monkey — there is no benefactor equal to you among gods, humans, or sages. What can I do to repay your service? My heart cannot face you (out of gratitude and love).'",
    word_meanings:
      "kapi = monkey; samana = equal; upakari = benefactor; sura = gods; nara = humans; muni = sages; prati upakara = repayment; karau = can I do; sanmukha = face; mana mora = my heart",
    is_key_verse: true,
    sort_order: 30,
  },

  // ─── 32. Rama's embrace — climactic moment ────────────────────────────────
  {
    id: "sk-32",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 32,
    sanskrit:
      "सुनि प्रभु बचन बिलोकि मुख गात हरषि कपि चंचल।\nप्रेम मगन कपि देखि प्रभु पुलकित तन नयन सजल॥",
    transliteration:
      "Suni Prabhu bachana biloki mukha gata harashi kapi chanchala.\nPrema magana kapi dekhi Prabhu pulakita tana nayana sajala.",
    meaning:
      "Hearing the Lord's words and gazing at His face, the monkey's body thrilled with joy. Seeing the monkey immersed in love, the Lord's body was covered in goosebumps and His eyes filled with tears.",
    word_meanings:
      "Prabhu = Lord; bachana = words; biloki = gazing; mukha = face; gata = body; harashi = thrilled; chanchala = restless; prema = love; magana = immersed; pulakita = goosebumps; nayana = eyes; sajala = tearful",
    is_key_verse: true,
    sort_order: 31,
  },

  // ─── 33. The army prepares to march ────────────────────────────────────────
  {
    id: "sk-33",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 33,
    sanskrit:
      "बोलेउ कपिपति संग बिचारी। अंगद हनुमत नीलहु भारी॥\nकपि सेन सब धीर समाजा। बोलेउ कटकटाइ बालि कुमार सो ताजा॥",
    transliteration:
      "Boleu kapipati sanga bichari. Angada Hanumata Nilahu bhari.\nKapi sena saba dhira samaja. Boleu katakatai Bali kumara so taja.",
    meaning:
      "The monkey king (Sugriva) consulted with Angad, Hanuman, and the mighty Neel. The entire monkey army was a brave assembly. Bali's son (Angad) spoke boldly.",
    word_meanings:
      "kapipati = monkey king (Sugriva); sanga = with; bichari = consulted; Angada = Angad; Nilahu = Neel; bhari = mighty; kapi sena = monkey army; dhira = brave; samaja = assembly; Bali kumara = son of Bali",
    is_key_verse: false,
    sort_order: 32,
  },

  // ─── 34. Building the bridge to Lanka ──────────────────────────────────────
  {
    id: "sk-34",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 34,
    sanskrit:
      "नल नील सिल धरहिं संवारी। देखि केहरि बचन उचारी॥\nराम प्रताप सुमिरि मन माहीं। करहिं सेतु सिंधु पर छाहीं॥",
    transliteration:
      "Nala Nila sila dharahim sanvari. Dekhi kehari bachana uchari.\nRama pratapa sumiri mana mahin. Karahim setu sindhu para chhahin.",
    meaning:
      "Nala and Nila placed the rocks carefully. Watching this, the ocean spoke. Remembering Lord Rama's glory in their hearts, they built the bridge across the ocean with its shadow falling upon the waters.",
    word_meanings:
      "Nala Nila = the monkey engineers; sila = rocks; dharahim = placed; sanvari = carefully; Rama pratapa = Rama's glory; sumiri = remembering; setu = bridge; sindhu = ocean; chhahin = shadow",
    is_key_verse: false,
    sort_order: 33,
  },

  // ─── 35. Famous doha — Power of Rama's name ───────────────────────────────
  {
    id: "sk-35",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 35,
    sanskrit:
      "राम नाम महिमा सुरसरि समान सब कहँ सुखदानि।\nकहत सुनत गुनत जपत हरत सकल कलि मल गुन खानि॥",
    transliteration:
      "Rama nama mahima Surasari samana saba kahan sukhadani.\nKahata sunata gunata japata harata sakala kali mala guna khani.",
    meaning:
      "The glory of Rama's name is like the celestial Ganga — it bestows happiness upon all. Whether spoken, heard, contemplated, or chanted, it removes all the impurities of the Kali age and is a mine of virtues.",
    word_meanings:
      "Rama nama = Rama's name; mahima = glory; Surasari = celestial Ganga; sukhadani = giver of happiness; kahata = speaking; sunata = hearing; gunata = contemplating; japata = chanting; harata = removes; kali mala = impurities of Kali age; guna khani = mine of virtues",
    is_key_verse: true,
    sort_order: 34,
  },

  // ─── 36. Devotion conquers all — Chaupai ───────────────────────────────────
  {
    id: "sk-36",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 36,
    sanskrit:
      "भजु राम मन बचन काया। सब दिन सकल सुमंगल दाया॥\nसंसृत मूल अविद्या भ्रम सो। भजि राम कहँ जाइ तम सो॥",
    transliteration:
      "Bhaju Rama mana bachana kaya. Saba dina sakala sumangala daya.\nSansrita mula avidya bhrama so. Bhaji Rama kahan jai tama so.",
    meaning:
      "Worship Lord Rama with mind, speech, and body. He bestows all auspiciousness for all time. The root of worldly existence is ignorance and delusion — by worshipping Rama, that darkness is dispelled.",
    word_meanings:
      "bhaju = worship; mana = mind; bachana = speech; kaya = body; sumangala = auspiciousness; daya = bestows; sansrita = worldly existence; mula = root; avidya = ignorance; bhrama = delusion; tama = darkness",
    is_key_verse: true,
    sort_order: 35,
  },

  // ─── 37. The grace of the guru ─────────────────────────────────────────────
  {
    id: "sk-37",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 37,
    sanskrit:
      "गुर पद पंकज सेवत नीत। बिनु श्रम जपत राम गुन गीत॥\nमुद मंगलमय संत समाजा। जोग भगति बिग्यान बिराजा॥",
    transliteration:
      "Gura pada pankaja sevata nita. Binu shrama japata Rama guna gita.\nMuda mangalamaya santa samaja. Joga bhagati bigyana biraja.",
    meaning:
      "Serving the lotus feet of the guru constantly and effortlessly chanting the songs of Rama's virtues — the assembly of saints is full of joy and auspiciousness, where yoga, devotion, and divine knowledge shine.",
    word_meanings:
      "gura = guru; pada pankaja = lotus feet; sevata = serving; nita = constantly; binu shrama = effortlessly; japata = chanting; guna = virtues; gita = songs; muda = joy; mangalamaya = auspicious; santa samaja = assembly of saints; joga = yoga; bhagati = devotion; bigyana = divine knowledge",
    is_key_verse: false,
    sort_order: 36,
  },

  // ─── 38. The power of faith — Doha ────────────────────────────────────────
  {
    id: "sk-38",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 38,
    sanskrit:
      "एहि महँ रघुपति नाम उदारा। अति पावन पुरान श्रुति सारा॥\nमंगल भवन अमंगल हारी। द्रवउ सो दशरथ अजिर बिहारी॥",
    transliteration:
      "Ehi mahan Raghupati nama udara. Ati pavana purana shruti sara.\nMangala bhavana amangala hari. Dravau so Dasharatha ajira bihari.",
    meaning:
      "In this world, the name of Lord Raghupati is most generous — supremely sacred and the essence of the Puranas and Vedas. It is the abode of auspiciousness and the destroyer of all that is inauspicious. May that Lord who played in the courtyard of Dasharatha be gracious.",
    word_meanings:
      "Raghupati nama = Rama's name; udara = generous; pavana = sacred; purana = Puranas; shruti = Vedas; sara = essence; mangala bhavana = abode of auspiciousness; amangala hari = destroyer of inauspiciousness; dravau = be gracious; Dasharatha ajira = courtyard of Dasharatha",
    is_key_verse: true,
    sort_order: 37,
  },

  // ─── 39. Tulsidas on surrender ─────────────────────────────────────────────
  {
    id: "sk-39",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 39,
    sanskrit:
      "सकल सुमंगल दायक रघुनायक गुन गान।\nसादर सुनहिं ते तरहिं भव सिंधु बिना जलजान॥",
    transliteration:
      "Sakala sumangala dayaka Raghunayaka guna gana.\nSadara sunahim te tarahim bhava sindhu bina jalajana.",
    meaning:
      "The singing of the virtues of Lord Raghunayak bestows all auspiciousness. Those who listen with reverence cross the ocean of worldly existence without needing a boat.",
    word_meanings:
      "sakala = all; sumangala = auspiciousness; dayaka = bestower; Raghunayaka = Lord Rama; guna gana = singing of virtues; sadara = with reverence; sunahim = listen; tarahim = cross; bhava sindhu = ocean of worldly existence; jalajana = boat",
    is_key_verse: true,
    sort_order: 38,
  },

  // ─── 40. Closing — Tulsidas's prayer ───────────────────────────────────────
  {
    id: "sk-40",
    scripture_id: "sunderkand",
    chapter_id: "sunderkand-main",
    verse_number: 40,
    sanskrit:
      "निज बल राम सरन तजि दोऊ। तिहि संसृत नहिं तरइ न कोऊ॥\nतुलसीदास सब भाँति भलाई। जो रघुनाथ चरन चित लाई॥",
    transliteration:
      "Nija bala Rama sarana taji dou. Tihi sansrita nahin tarai na kou.\nTulasidasa saba bhanti bhalai. Jo Raghunatha charana chita lai.",
    meaning:
      "One who abandons both self-effort and Rama's refuge — such a person can never cross the ocean of worldly existence. Tulsidas says: all goodness in every way comes to the one who fixes their mind on the feet of Lord Raghunath.",
    word_meanings:
      "nija bala = self-effort; Rama sarana = Rama's refuge; taji = abandoning; dou = both; sansrita = worldly existence; tarai = cross; Tulasidasa = Tulsidas; bhanti = way; bhalai = goodness; Raghunatha = Lord Rama; charana = feet; chita = mind; lai = fix",
    is_key_verse: true,
    sort_order: 39,
  },
];
