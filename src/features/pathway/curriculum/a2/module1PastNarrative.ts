import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1PastNarrative(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: EL PASADO SIMPLE REGULAR (-ED Y LOS 3 SONIDOS FONÉTICOS)
    {
      title: "El Pasado Simple Regular: La Terminación -ed y sus 3 Sonidos",
      focus: "Verbos regulares en pasado y fonética de -ed (/t/, /d/, /ɪd/)",
      payload: {
        ruleTaglineSpanish:
          "En pasado regular todos los verbos terminan en '-ed', pero nunca digas 'uork-ed' con dos sílabas. Solo pronuncias la 'e' si el verbo termina en sonido T o D como en needed o started.",
        formulaSegments: [
          { label: "SONIDO /t/ O /d/ (1 SÍLABA)", token: "worked /uórkt/ · called /kóld/", tone: "violet" },
          { label: "SONIDO /ɪd/ (EXTRA SÍLABA)", token: "needed /nídid/ · started /stártid/", tone: "emerald" },
          { label: "SEÑAL DE PASADO", token: "yesterday / last week", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I work-ed yesterday.",
          wrongToken: "work-ed",
          correct: "I worked yesterday.",
          correctToken: "worked",
          whySpanish: "Pronuncia 'worked' en un solo golpe /uórkt/, sin separar la 'e'.",
        },
        examples: [
          {
            english: "Yesterday we finished the task on time.",
            spanish: "Ayer terminamos la tarea a tiempo.",
            pronunciationHint: "yésterdei ui fínisht de task on táim",
          },
          {
            english: "She called her client this morning.",
            spanish: "Ella llamó a su cliente esta mañana.",
            pronunciationHint: "shi kold jer kláient dis mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ayer terminamos el trabajo a tiempo",
          targetTokens: ["Yesterday", "we", "finished", "the", "work", "on", "time"],
          distractorTokens: ["finish"],
          successTipSpanish: "¡Excelente! 'Finished' sirve igual para I, She o We.",
          mistakeHintSpanish: "Con 'Yesterday', elige el verbo en pasado ('finished').",
        },
        voicePractice: {
          sentenceEnglish: "Yesterday we finished on time.",
          spanishMeaning: "Ayer terminamos a tiempo.",
          pronunciationHint: "yésterdei ui fínisht on táim",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica la terminación -ed en artículos narrativos e historias profesionales.",
        },
      },
    },

    // BASE 2: LOS VERBOS IRREGULARES DE ORO EN PASADO
    {
      title: "Los Verbos Irregulares de Oro: Went, Saw, Had y Made",
      focus: "Los verbos de mayor frecuencia que cambian su raíz en pasado",
      payload: {
        ruleTaglineSpanish:
          "Los verbos más usados del inglés son rebeldes y cambian de raíz: go se vuelve went, see se vuelve saw, have se vuelve had, y make se vuelve made. Una sola forma sirve para todas las personas.",
        formulaSegments: [
          { label: "QUIÉN (TODOS IGUAL)", token: "I / He / She / We / They", tone: "violet" },
          { label: "IRREGULAR DE ORO", token: "went · saw · had · made · took", tone: "emerald" },
          { label: "MOMENTO", token: "yesterday / last night / two days ago", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I goed to the office yesterday.",
          wrongToken: "goed",
          correct: "I went to the office yesterday.",
          correctToken: "went",
          whySpanish: "El pasado de 'go' es 'went', nunca le pongas '-ed'.",
        },
        examples: [
          {
            english: "I went to the office early.",
            spanish: "Fui a la oficina temprano.",
            pronunciationHint: "ai uént tu di ófis érli",
          },
          {
            english: "We saw the report yesterday.",
            spanish: "Vimos el reporte ayer.",
            pronunciationHint: "ui so de ripórt yésterdei",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Fui a la reunión ayer",
          targetTokens: ["I", "went", "to", "the", "meeting", "yesterday"],
          distractorTokens: ["goed"],
          successTipSpanish: "¡Impecable! Usaste el pasado irregular 'went'.",
          mistakeHintSpanish: "Para decir 'fui', usa la forma irregular 'went'.",
        },
        voicePractice: {
          sentenceEnglish: "I went to the office yesterday.",
          spanishMeaning: "Fui a la oficina ayer.",
          pronunciationHint: "ai uént tu di ófis yésterdei",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Narra un resumen de lo que hiciste ayer usando went, saw y had.",
        },
      },
    },

    // BASE 3: EL ESCUDO NEGATIVO EN PASADO (Didn't + Verbo Base)
    {
      title: "El Escudo Negativo en Pasado: Didn't + Verbo Base",
      focus: "Negar en pasado simple eliminando el doble pasado",
      payload: {
        ruleTaglineSpanish:
          "Cuando entra el escudo 'didn't', él ya carga todo el pasado por ti. Por eso, el verbo que sigue vuelve a su forma base normal: nunca digas 'didn't went' ni 'didn't saw'.",
        formulaSegments: [
          { label: "QUIÉN", token: "I / She / We / They", tone: "violet" },
          { label: "ESCUDO PASADO", token: "didn't", tone: "emerald" },
          { label: "VERBO BASE PURO", token: "go · see · call · know", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I didn't saw the message.",
          wrongToken: "didn't saw",
          correct: "I didn't see the message.",
          correctToken: "didn't see",
          whySpanish: "Nunca pongas doble pasado: después de 'didn't', el verbo vuelve a 'see'.",
        },
        examples: [
          {
            english: "I didn't receive the document.",
            spanish: "No recibí el documento.",
            pronunciationHint: "ai dídent risív de dókyument",
          },
          {
            english: "She didn't know the answer.",
            spanish: "Ella no sabía la respuesta.",
            pronunciationHint: "shi dídent nóu di ánser",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo no vi el correo ayer",
          targetTokens: ["I", "didn't", "see", "the", "email", "yesterday"],
          distractorTokens: ["saw"],
          successTipSpanish: "¡Clave dominada! 'Didn't see' con el verbo en su forma base.",
          mistakeHintSpanish: "Como ya tienes 'didn't', usa 'see' en lugar de 'saw'.",
        },
        voicePractice: {
          sentenceEnglish: "I didn't see the message yesterday.",
          spanishMeaning: "No vi el mensaje ayer.",
          pronunciationHint: "ai dídent sí de mésech yésterdei",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Aprende a aclarar situaciones pasadas diciendo 'I didn't have that information'.",
        },
      },
    },

    // BASE 4: PREGUNTAS EN PASADO (Did you...? + Verbo Base)
    {
      title: "Preguntas en Pasado: La Llave Did y Respuestas Cortas",
      focus: "Inversión con 'Did' para preguntas cerradas y respuestas afirmativas/negativas",
      payload: {
        ruleTaglineSpanish:
          "Para preguntar sobre el pasado coloca 'Did' al inicio. Como 'Did' ya anuncia el pasado, el verbo se queda en su forma base. Responde con 'Yes, I did' o 'No, I didn't'.",
        formulaSegments: [
          { label: "LLAVE PASADO", token: "Did", tone: "violet" },
          { label: "QUIÉN", token: "you / she / they", tone: "emerald" },
          { label: "VERBO BASE", token: "find / call / understand?", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Did you called the client?",
          wrongToken: "called",
          correct: "Did you call the client?",
          correctToken: "call",
          whySpanish: "Como la pregunta ya empieza con 'Did', el verbo va normal: 'call'.",
        },
        examples: [
          {
            english: "Did you understand the instructions?",
            spanish: "¿Entendiste las instrucciones?",
            pronunciationHint: "did yu anderstánd di instrákshons?",
          },
          {
            english: "Did they arrive on time?",
            spanish: "¿Llegaron ellos a tiempo?",
            pronunciationHint: "did dei arráiv on táim?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Llamaste al cliente ayer?",
          targetTokens: ["Did", "you", "call", "the", "client", "yesterday?"],
          distractorTokens: ["called", "Do"],
          successTipSpanish: "¡Perfecto! 'Did you call' es la estructura nativa para preguntas en pasado.",
          mistakeHintSpanish: "Abre con 'Did you', pon el verbo base 'call' y termina con 'the client yesterday?'.",
        },
        voicePractice: {
          sentenceEnglish: "Did you see the latest update?",
          spanishMeaning: "¿Viste la última actualización?",
          pronunciationHint: "did yu sí de léitest apdéit?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Escucha cómo los reclutadores te preguntan con 'Did you work on...?' y responde con soltura.",
        },
      },
    },

    // BASE 5: LA ACCIÓN EN PROGRESO EN PASADO (Past Continuous)
    {
      title: "La Acción en Progreso en Pasado: Past Continuous",
      focus: "Describir lo que estaba ocurriendo en un momento específico (Was / Were + -ing)",
      payload: {
        ruleTaglineSpanish:
          "Para hablar de lo que estabas haciendo en un momento exacto del pasado, usa 'was' (I, he, she, it) o 'were' (you, we, they) seguido de la acción con '-ing'.",
        formulaSegments: [
          { label: "ESTABA / ESTÁBAMOS", token: "I was · She was · We were", tone: "violet" },
          { label: "HACIENDO EN PASADO", token: "working · traveling · reviewing", tone: "emerald" },
          { label: "HORA EXACTA", token: "at 8 PM yesterday / all morning", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I was work all morning.",
          wrongToken: "was work",
          correct: "I was working all morning.",
          correctToken: "was working",
          whySpanish: "Después de 'was' o 'were', la acción en progreso debe llevar '-ing'.",
        },
        examples: [
          {
            english: "I was preparing the presentation all morning.",
            spanish: "Estuve preparando la presentación toda la mañana.",
            pronunciationHint: "ai uás prepéring de presantéishon ol mórning",
          },
          {
            english: "They were discussing the new plan.",
            spanish: "Ellos estaban discutiendo el nuevo plan.",
            pronunciationHint: "dei uér diskásing de niú plan",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estuve trabajando toda la mañana",
          targetTokens: ["I", "was", "working", "all", "morning"],
          distractorTokens: ["were", "work"],
          successTipSpanish: "¡Súper! 'I was working' describe perfectamente una acción continua en el pasado.",
          mistakeHintSpanish: "Con 'I', usa 'was' y el verbo terminado en '-ing' ('working').",
        },
        voicePractice: {
          sentenceEnglish: "I was working on that project.",
          spanishMeaning: "Estaba trabajando en ese proyecto.",
          pronunciationHint: "ai uás uórking on dat próyekt",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe reportes describiendo qué actividades se estaban ejecutando en un horario determinado.",
        },
      },
    },

    // BASE 6: LA INTERRUPCIÓN EN EL TIEMPO (When y While)
    {
      title: "La Interrupción en el Tiempo: Past Continuous con When",
      focus: "Cruzar una acción en progreso (Past Continuous) con una acción puntual (Past Simple)",
      payload: {
        ruleTaglineSpanish:
          "Cuando estabas haciendo algo largo (was working) y algo repentino lo interrumpió, une las dos oraciones con 'when' seguido de Pasado Simple: I was working when the power went out.",
        formulaSegments: [
          { label: "ACCIÓN LARGA EN CURSO", token: "I was working / She was reading", tone: "violet" },
          { label: "INTERRUPCIÓN", token: "when", tone: "emerald" },
          { label: "ACCIÓN PUNTUAL", token: "the phone rang / he arrived", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I was working when the phone was ringing.",
          wrongToken: "was ringing",
          correct: "I was working when the phone rang.",
          correctToken: "rang",
          whySpanish: "La interrupción repentina va en Pasado Simple ('rang'), no en continuo.",
        },
        examples: [
          {
            english: "I was writing an email when my boss called.",
            spanish: "Estaba escribiendo un correo cuando mi jefe llamó.",
            pronunciationHint: "ai uás ráiting an iméil uén mai bos kold",
          },
          {
            english: "While we were discussing, the client arrived.",
            spanish: "Mientras estábamos conversando, el cliente llegó.",
            pronunciationHint: "uáil ui uér diskásing, de kláient arráivd",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estaba escribiendo cuando mi colega llamó",
          targetTokens: ["I", "was", "writing", "when", "my", "colleague", "called"],
          distractorTokens: ["were", "calling"],
          successTipSpanish: "¡Nivel cinematográfico! Combinaste la acción en curso con la interrupción puntual.",
          mistakeHintSpanish: "Usa 'I was writing' para la acción en curso y 'when my colleague called' para la interrupción.",
        },
        voicePractice: {
          sentenceEnglish: "I was writing when the call started.",
          spanishMeaning: "Estaba escribiendo cuando la llamada empezó.",
          pronunciationHint: "ai uás ráiting uén de kol stártid",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Cuenta anécdotas profesionales usando la estructura 'I was working on X when Y happened'.",
        },
      },
    },
  ];
}

