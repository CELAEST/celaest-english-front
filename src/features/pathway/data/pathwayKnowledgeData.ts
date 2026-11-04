export interface PronounItem {
  token: string;
  spanish: string;
  role: string;
  exampleEnglish: string;
  exampleSpanish: string;
}

export interface VerbExampleItem {
  token: string;
  spanish: string;
  category: "action" | "state" | "modal";
  exampleEnglish: string;
  exampleSpanish: string;
}

export interface PhoneticSoundItem {
  id: string;
  ipa: string;
  category: "vowel_long" | "vowel_short" | "schwa" | "consonant_trap";
  name: string;
  sampleWord: string;
  sampleIpa: string;
  contrastWord?: string | undefined;
  mouthTip: string;
}

export const PRONOUNS_DATA: PronounItem[] = [
  { token: "I", spanish: "Yo", role: "Siempre con mayúscula. Nunca digas solo 'learn', di 'I learn'.", exampleEnglish: "I learn English every day.", exampleSpanish: "Yo aprendo inglés todos los días." },
  { token: "You", spanish: "Tú / Usted / Ustedes", role: "Sirve tanto para una sola persona como para un grupo.", exampleEnglish: "You understand very fast.", exampleSpanish: "Tú entiendes muy rápido." },
  { token: "He", spanish: "Él", role: "Para hombres o personas masculinas.", exampleEnglish: "He works at the office.", exampleSpanish: "Él trabaja en la oficina." },
  { token: "She", spanish: "Ella", role: "Para mujeres o personas femeninas.", exampleEnglish: "She speaks with confidence.", exampleSpanish: "Ella habla con confianza." },
  { token: "It", spanish: "Eso / Ello (Cosas o Clima)", role: "¡En inglés el clima y los objetos tienen sujeto obligatorio!", exampleEnglish: "It works perfectly.", exampleSpanish: "Funciona perfectamente." },
  { token: "We", spanish: "Nosotros / Nosotras", role: "Tú incluido en el equipo.", exampleEnglish: "We review the plan together.", exampleSpanish: "Revisamos el plan juntos." },
  { token: "They", spanish: "Ellos / Ellas", role: "Otras personas, objetos o cosas en plural.", exampleEnglish: "They prepare the report.", exampleSpanish: "Ellos preparan el informe." },
];

export const VERBS_DATA: VerbExampleItem[] = [
  { token: "learn", spanish: "aprender", category: "action", exampleEnglish: "I learn step by step.", exampleSpanish: "Aprendo paso a paso." },
  { token: "work", spanish: "trabajar", category: "action", exampleEnglish: "We work with focus.", exampleSpanish: "Trabajamos con enfoque." },
  { token: "review", spanish: "revisar / examinar", category: "action", exampleEnglish: "I review the details.", exampleSpanish: "Reviso los detalles." },
  { token: "be (am/is/are)", spanish: "ser o estar", category: "state", exampleEnglish: "I am ready.", exampleSpanish: "Estoy listo." },
  { token: "have", spanish: "tener", category: "state", exampleEnglish: "We have clear goals.", exampleSpanish: "Tenemos metas claras." },
  { token: "can", spanish: "poder (habilidad)", category: "modal", exampleEnglish: "I can speak English.", exampleSpanish: "Puedo hablar inglés." },
];

export const PHONETICS_DATA: PhoneticSoundItem[] = [
  {
    id: "vowel-long-i",
    ipa: "/iː/",
    category: "vowel_long",
    name: "I Larga (Sonrisa tensa)",
    sampleWord: "sheep",
    sampleIpa: "/ʃiːp/",
    contrastWord: "ship /ʃɪp/",
    mouthTip: "Estira los labios como una sonrisa amplia. El sonido se sostiene tenso.",
  },
  {
    id: "vowel-short-i",
    ipa: "/ɪ/",
    category: "vowel_short",
    name: "I Corta (Relajada, entre E e I)",
    sampleWord: "ship",
    sampleIpa: "/ʃɪp/",
    contrastWord: "sheep /ʃiːp/",
    mouthTip: "Relaja la mandíbula inferior como si fueras a decir 'e', pero emite una 'i' corta.",
  },
  {
    id: "vowel-ae",
    ipa: "/æ/",
    category: "vowel_short",
    name: "A Abierta (Entre A y E)",
    sampleWord: "cat",
    sampleIpa: "/kæt/",
    contrastWord: "cut /kʌt/",
    mouthTip: "Baja la mandíbula ampliamente y aplana la lengua en el fondo.",
  },
  {
    id: "vowel-central-wedge",
    ipa: "/ʌ/",
    category: "vowel_short",
    name: "U Corta Central",
    sampleWord: "cup",
    sampleIpa: "/kʌp/",
    contrastWord: "cap /kæp/",
    mouthTip: "Sonido corto en el centro de la boca, sin redondear los labios.",
  },
  {
    id: "vowel-long-u",
    ipa: "/uː/",
    category: "vowel_long",
    name: "U Larga (Labios en tubo)",
    sampleWord: "boot",
    sampleIpa: "/buːt/",
    contrastWord: "book /bʊk/",
    mouthTip: "Labios muy redondeados hacia adelante sosteniendo el sonido tenso.",
  },
  {
    id: "vowel-short-u",
    ipa: "/ʊ/",
    category: "vowel_short",
    name: "U Corta Relajada",
    sampleWord: "book",
    sampleIpa: "/bʊk/",
    contrastWord: "boot /buːt/",
    mouthTip: "Labios ligeramente relajados, emisión corta de aire sin tensar.",
  },
  {
    id: "schwa-neutral",
    ipa: "/ə/",
    category: "schwa",
    name: "Schwa (El Sonido Rey del Inglés)",
    sampleWord: "about",
    sampleIpa: "/əˈbaʊt/",
    contrastWord: "camera /ˈkæm.rə/",
    mouthTip: "Relaja totalmente la boca como un suspiro perezoso 'eh'. Es el sonido más común en sílabas sin acento.",
  },
  {
    id: "consonant-th-voiceless",
    ipa: "/θ/",
    category: "consonant_trap",
    name: "TH Sorda (Aire suave)",
    sampleWord: "think",
    sampleIpa: "/θɪŋk/",
    contrastWord: "sink /sɪŋk/",
    mouthTip: "Coloca la punta de la lengua entre los dientes y sopla aire sin vibrar la garganta.",
  },
  {
    id: "consonant-th-voiced",
    ipa: "/ð/",
    category: "consonant_trap",
    name: "TH Sonora (Zumbido)",
    sampleWord: "this",
    sampleIpa: "/ðɪs/",
    contrastWord: "dis /dɪs/",
    mouthTip: "Punta de la lengua entre los dientes haciendo vibrar las cuerdas vocales (zumbido).",
  },
  {
    id: "consonant-v-labiodental",
    ipa: "/v/",
    category: "consonant_trap",
    name: "V Labiodental",
    sampleWord: "very",
    sampleIpa: "/ˈver.i/",
    contrastWord: "berry /ˈber.i/",
    mouthTip: "Dientes superiores tocan suavemente el labio inferior. ¡No juntes ambos labios como en español!",
  },
  {
    id: "consonant-s-cluster",
    ipa: "/s/",
    category: "consonant_trap",
    name: "S Inicial Pura (Sin 'E')",
    sampleWord: "speak",
    sampleIpa: "/spiːk/",
    contrastWord: "start /stɑːrt/",
    mouthTip: "Comienza directo con el siseo de una serpiente /ssss/. Jamás agregues una 'e' al inicio.",
  },
  {
    id: "consonant-sh",
    ipa: "/ʃ/",
    category: "consonant_trap",
    name: "SH (Pedir Silencio)",
    sampleWord: "shine",
    sampleIpa: "/ʃaɪn/",
    contrastWord: "chin /tʃɪn/",
    mouthTip: "Labios hacia afuera haciendo el sonido de 'shhh' para pedir silencio.",
  },
];

