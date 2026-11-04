import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3ObjectsPossession(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: ARTÍCULOS INDEFINIDOS (A vs An)
    {
      title: "Artículos Indefinidos: A vs An",
      focus: "Uso de A y An guiado por el sonido inicial",
      payload: {
        ruleTaglineSpanish:
          "Elige 'a' o 'an' según cómo SUENA la palabra que sigue, no según su letra escrita.",
        formulaSegments: [
          { label: "ARTÍCULO", token: "an", tone: "violet" },
          { label: "SONIDO VOCAL", token: "idea / apple / hour", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Sonido Consonante (A)",
            segments: [
              { label: "ARTÍCULO", token: "a", tone: "violet" },
              { label: "SONIDO CONSONANTE", token: "plan / car / university", tone: "emerald" },
            ],
            explanationSpanish:
              "Usa 'a' frente a sonidos consonantes (incluso 'university', porque empieza sonando 'yu').",
            exampleEnglish: "We need a clear plan.",
          },
          {
            label: "02 · Sonido Vocal (An)",
            segments: [
              { label: "ARTÍCULO", token: "an", tone: "violet" },
              { label: "SONIDO VOCAL", token: "idea / apple / hour", tone: "emerald" },
            ],
            explanationSpanish:
              "Usa 'an' frente a sonidos vocales (incluso 'hour', porque la H es muda) para enlazar fluido.",
            exampleEnglish: "I have an idea today.",
          },
        ],
        commonMistake: {
          wrong: "I have a idea.",
          wrongToken: "a idea",
          correct: "I have an idea.",
          correctToken: "an idea",
          whySpanish: "Antes del sonido vocal de 'idea', usa 'an' para que las palabras no choquen.",
        },
        examples: [
          {
            english: "I have an important question.",
            spanish: "Tengo una pregunta importante.",
            pronunciationHint: "ai jav an impórtant kuéschon",
          },
          {
            english: "We need a clear plan.",
            spanish: "Necesitamos un plan claro.",
            pronunciationHint: "ui níd a klíar plan",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Tengo una idea hoy",
          targetTokens: ["I", "have", "an", "idea", "today"],
          distractorTokens: ["a"],
          successTipSpanish: "¡Perfecto! Elegiste 'an' porque 'idea' comienza con sonido vocal.",
          mistakeHintSpanish: "Frente a 'idea', utiliza 'an' para facilitar la pronunciación continua.",
        },
        voicePractice: {
          sentenceEnglish: "I have an idea today.",
          spanishMeaning: "Tengo una idea hoy.",
          pronunciationHint: "ai jav an aidía tudéi",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Observa en los artículos cómo se combinan 'a' y 'an' con adjetivos descriptivos.",
        },
      },
    },

    // BASE 13: 'THE' VS EL 'ZERO ARTICLE'
    {
      title: "'The' vs El 'Zero Article'",
      focus: "Cuándo usar 'The' para lo específico y omitirlo en generalidades",
      payload: {
        ruleTaglineSpanish:
          "Las ideas generales van sin artículo; usa 'the' solo para algo puntual y específico.",
        formulaSegments: [
          { label: "PERSONA + GUSTO", token: "I like", tone: "violet" },
          { label: "GENERAL (SIN THE)", token: "coffee / music", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · En General (Sin The)",
            segments: [
              { label: "SUJETO + VERBO", token: "I like / love", tone: "violet" },
              { label: "TEMA GENERAL", token: "coffee / music", tone: "emerald" },
            ],
            explanationSpanish:
              "Al hablar de gustos o temas universales omite 'the': di 'I like coffee', no 'the coffee'.",
            exampleEnglish: "I like coffee in the morning.",
          },
          {
            label: "02 · Algo Específico (The)",
            segments: [
              { label: "ARTÍCULO", token: "The", tone: "violet" },
              { label: "COSA PUNTUAL", token: "meeting / coffee here", tone: "emerald" },
              { label: "DETALLE", token: "is at 3:00", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando ambos sabemos exactamente de qué reunión o taza hablamos, activamos 'The'.",
            exampleEnglish: "The meeting is at three o'clock.",
          },
        ],
        commonMistake: {
          wrong: "I love the music and the coffee.",
          wrongToken: "the music",
          correct: "I love music and coffee.",
          correctToken: "music and coffee",
          whySpanish: "Cuando hablas de cosas en general como gustos, omite 'the' por completo.",
        },
        examples: [
          {
            english: "Practice builds confidence.",
            spanish: "La práctica construye confianza.",
            pronunciationHint: "práktis bílds kónfidens",
          },
          {
            english: "The meeting is at three o'clock.",
            spanish: "La reunión es a las tres en punto.",
            pronunciationHint: "de míting is at zrí o klók",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Me gusta el café por la mañana",
          targetTokens: ["I", "like", "coffee", "in", "the", "morning"],
          distractorTokens: ["the coffee"],
          successTipSpanish: "¡Excelente! No pusiste 'the' antes de 'coffee' porque hablas en general.",
          mistakeHintSpanish: "Para el café en general usa solo 'coffee', sin 'the'.",
        },
        voicePractice: {
          sentenceEnglish: "I like coffee in the morning.",
          spanishMeaning: "Me gusta el café por la mañana.",
          pronunciationHint: "ai láik kófi in de mórning",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe afirmaciones generales en Writing Studio sin meter 'the' innecesario.",
        },
      },
    },

    // BASE 14: PLURALES REGULARES E IRREGULARES DE ORO
    {
      title: "Plurales en Inglés: Regulares e Irregulares",
      focus: "Formación de plurales (-s, -es) y casos irregulares clave",
      payload: {
        ruleTaglineSpanish:
          "Casi todos los plurales suman '-s', salvo un grupo clave que cambia de palabra.",
        formulaSegments: [
          { label: "CANTIDAD", token: "Many / Two", tone: "violet" },
          { label: "PLURAL IRREGULAR", token: "people / children", tone: "emerald" },
          { label: "ACCIÓN", token: "work here", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Regulares (+s / +es)",
            segments: [
              { label: "CANTIDAD", token: "Two / Many", tone: "violet" },
              { label: "SUSTANTIVO + S", token: "books / classes / days", tone: "emerald" },
            ],
            explanationSpanish:
              "La mayoría de objetos suman '-s' (books) o '-es' si terminan en s, sh o ch (classes).",
            exampleEnglish: "I read two books every month.",
          },
          {
            label: "02 · Irregulares Esenciales",
            segments: [
              { label: "CANTIDAD", token: "Many / Two", tone: "violet" },
              { label: "CAMBIA LA PALABRA", token: "people / children / men", tone: "emerald" },
            ],
            explanationSpanish:
              "Nunca agregues '-s' aquí: person pasa a 'people', child a 'children' y woman a 'women'.",
            exampleEnglish: "Many people work here.",
          },
        ],
        commonMistake: {
          wrong: "There are five persons in the room.",
          wrongToken: "persons",
          correct: "There are five people in the room.",
          correctToken: "people",
          whySpanish: "En inglés cotidiano, el plural natural de 'person' es siempre 'people'.",
        },
        examples: [
          {
            english: "Many people support this idea.",
            spanish: "Muchas personas apoyan esta idea.",
            pronunciationHint: "méni pípol sapórt dis aidía",
          },
          {
            english: "Two children are playing outside.",
            spanish: "Dos niños están jugando afuera.",
            pronunciationHint: "tu chíldren ar pléying áutsaid",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Muchas personas trabajan aquí",
          targetTokens: ["Many", "people", "work", "here"],
          distractorTokens: ["persons"],
          successTipSpanish: "¡Súper! Usaste el plural irregular 'people' como un nativo.",
          mistakeHintSpanish: "Elige 'people' para referirte a 'personas' en lugar de 'persons'.",
        },
        voicePractice: {
          sentenceEnglish: "Many people work here.",
          spanishMeaning: "Muchas personas trabajan aquí.",
          pronunciationHint: "méni pípol uórk jíar",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce de inmediato los plurales irregulares como 'children' y 'people' en lecturas cortas.",
        },
      },
    },

    // BASE 15: DE QUIÉN ES CADA COSA (Posesivos Adjetivos)
    {
      title: "De Quién es Cada Cosa: Posesivos sin Confusión",
      focus: "Adjetivos posesivos (My, Your, His, Her, Its, Our, Their)",
      payload: {
        ruleTaglineSpanish:
          "En inglés 'su' se divide según el dueño: 'his' (de él), 'her' (de ella) y 'their' (de ellos).",
        formulaSegments: [
          { label: "DUEÑO (ÉL)", token: "His", tone: "violet" },
          { label: "PERTENENCIA", token: "project", tone: "emerald" },
          { label: "ESTADO", token: "is ready", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · De Él (His)",
            segments: [
              { label: "DUEÑO HOMBRE", token: "His", tone: "violet" },
              { label: "OBJETO", token: "project / name", tone: "emerald" },
              { label: "ESTADO", token: "is ready", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el dueño es un hombre ('él'), usa siempre 'his' sin importar si posee una o diez cosas.",
            exampleEnglish: "His project is ready now.",
          },
          {
            label: "02 · De Ella (Her)",
            segments: [
              { label: "DUEÑA MUJER", token: "Her", tone: "violet" },
              { label: "OBJETO", token: "team / report", tone: "emerald" },
              { label: "ESTADO", token: "is ready", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la dueña es una mujer ('ella'), usa siempre 'her'. Jamás cambies a 'hers' antes del objeto.",
            exampleEnglish: "Her report is on the desk.",
          },
          {
            label: "03 · De Grupo (Our · Their)",
            segments: [
              { label: "GRUPO DUEÑO", token: "Our / Their", tone: "violet" },
              { label: "OBJETO", token: "team / office", tone: "emerald" },
              { label: "ACCIÓN", token: "works well", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'our' para lo nuestro y 'their' para lo de ellos, igual para singular o plural.",
            exampleEnglish: "Our team delivers great results.",
          },
        ],
        commonMistake: {
          wrong: "Maria loves his job.",
          wrongToken: "his",
          correct: "Maria loves her job.",
          correctToken: "her",
          whySpanish: "El posesivo depende de QUIÉN posee: como María es mujer, su trabajo es 'her job'.",
        },
        examples: [
          {
            english: "His plan is ready, but her report is missing.",
            spanish: "El plan de él está listo, pero el reporte de ella falta.",
            pronunciationHint: "jis plan is rédi, bat jer ripórt is mísing",
          },
          {
            english: "Our team delivers great results every week.",
            spanish: "Nuestro equipo entrega grandes resultados cada semana.",
            pronunciationHint: "áuar tím delívers gréit risólts évri uík",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Su proyecto de él está listo ahora",
          targetTokens: ["His", "project", "is", "ready", "now"],
          distractorTokens: ["Her"],
          successTipSpanish: "¡Muy bien! Usaste 'His' porque la pertenencia es de él.",
          mistakeHintSpanish: "Para pertenencia masculina de él, abre con 'His', no con 'Her'.",
        },
        voicePractice: {
          sentenceEnglish: "His project is ready now.",
          spanishMeaning: "Su proyecto de él está listo ahora.",
          pronunciationHint: "jis próyekt is rédi náu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Describe a tu equipo y a tu supervisor usando 'our team' y 'my manager'.",
        },
      },
    },

    // BASE 16: EL GENITIVO SAJÓN ('S) Y POSESIVOS LIBRES
    {
      title: "El Genitivo Sajón ('s) y Posesivos Libres",
      focus: "Pertenencia con apóstrofe 's y pronombres posesivos (Mine, Yours)",
      payload: {
        ruleTaglineSpanish:
          "Nombra primero al dueño con apóstrofe 's, o cierra la frase con 'mine / yours' sin sustantivo.",
        formulaSegments: [
          { label: "OBJETO", token: "This book", tone: "violet" },
          { label: "TO BE", token: "is", tone: "emerald" },
          { label: "POSESIVO FINAL", token: "mine / yours", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Dueño + 's",
            segments: [
              { label: "DUEÑO + 'S", token: "Carlos's / John's", tone: "violet" },
              { label: "PERTENENCIA", token: "laptop / office", tone: "emerald" },
            ],
            explanationSpanish:
              "En lugar de 'la laptop de Carlos', pon primero a la persona con 's y luego el objeto.",
            exampleEnglish: "This is Carlos's laptop.",
          },
          {
            label: "02 · Cierre con Mine / Yours",
            segments: [
              { label: "SUJETO + IS", token: "This book is", tone: "violet" },
              { label: "SIN SUSTANTIVO", token: "mine / yours / hers", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el posesivo cierra la oración sin repetir el objeto, usa 'mine' o 'yours', nunca 'my'.",
            exampleEnglish: "This book is mine today.",
          },
        ],
        commonMistake: {
          wrong: "This book is my.",
          wrongToken: "my",
          correct: "This book is mine.",
          correctToken: "mine",
          whySpanish: "Al final de la frase o sin un sustantivo después, usa 'mine' (mío), no 'my' (mi).",
        },
        examples: [
          {
            english: "This is Carlos's laptop.",
            spanish: "Esta es la laptop de Carlos.",
            pronunciationHint: "dis is Kárlos-es láptop",
          },
          {
            english: "That seat is yours.",
            spanish: "Ese asiento es tuyo.",
            pronunciationHint: "dat sít is yóurs",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Este libro es mío hoy",
          targetTokens: ["This", "book", "is", "mine", "today"],
          distractorTokens: ["my"],
          successTipSpanish: "¡Genial! 'Mine' es la forma correcta cuando no hay sustantivo después.",
          mistakeHintSpanish: "Para decir 'es mío', usa 'mine' al final.",
        },
        voicePractice: {
          sentenceEnglish: "This book is mine today.",
          spanishMeaning: "Este libro es mío hoy.",
          pronunciationHint: "dis buk is máin tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Usa el genitivo sajón 's en tus correos para mencionar clientes y colegas de forma concisa.",
        },
      },
    },

    // BASE 17: EL RECEPTOR DE LA ACCIÓN (Pronombres Objeto)
    {
      title: "El Receptor de la Acción: Me, Him, Her, Us, Them",
      focus: "Pronombres objeto después del verbo y preposiciones",
      payload: {
        ruleTaglineSpanish:
          "Quien recibe la acción después del verbo usa forma objeto: me, him, her, us o them.",
        formulaSegments: [
          { label: "QUIÉN HACE", token: "She", tone: "violet" },
          { label: "ACCIÓN", token: "calls / helps", tone: "emerald" },
          { label: "QUIÉN RECIBE", token: "me / him / them", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Tras un Verbo",
            segments: [
              { label: "QUIÉN HACE", token: "We / They", tone: "violet" },
              { label: "ACCIÓN", token: "call / help", tone: "emerald" },
              { label: "RECEPTOR", token: "me / him / her / them", tone: "sky" },
            ],
            explanationSpanish:
              "Después del verbo cambia 'I, he, they' por 'me, him, them': di 'call me', jamás 'call I'.",
            exampleEnglish: "Please call me today.",
          },
          {
            label: "02 · Tras Preposición",
            segments: [
              { label: "ACCIÓN", token: "Work / Talk", tone: "violet" },
              { label: "PREPOSICIÓN", token: "with / for / to", tone: "emerald" },
              { label: "RECEPTOR", token: "me / us / her / them", tone: "sky" },
            ],
            explanationSpanish:
              "Después de 'with', 'for' o 'to' también usamos siempre la forma objeto: 'with us', 'for her'.",
            exampleEnglish: "We can help them with this task.",
          },
        ],
        commonMistake: {
          wrong: "She called I yesterday.",
          wrongToken: "called I",
          correct: "She called me yesterday.",
          correctToken: "called me",
          whySpanish: "Después del verbo nunca pongas 'I' ni 'he': usa las formas objeto 'me', 'him', 'her'.",
        },
        examples: [
          {
            english: "Please call me in the afternoon.",
            spanish: "Por favor llámame por la tarde.",
            pronunciationHint: "plís kol mi in di áfternun",
          },
          {
            english: "We can help them with this task.",
            spanish: "Podemos ayudarlos a ellos con esta tarea.",
            pronunciationHint: "ui kan jélp dem uiz dis task",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por favor llámame hoy",
          targetTokens: ["Please", "call", "me", "today"],
          distractorTokens: ["I"],
          successTipSpanish: "¡Eso es! Usaste 'me' como receptor de la llamada.",
          mistakeHintSpanish: "Después del verbo 'call', el receptor es 'me', no 'I'.",
        },
        voicePractice: {
          sentenceEnglish: "Please call me today.",
          spanishMeaning: "Por favor llámame hoy.",
          pronunciationHint: "plís kol mi tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Aprende a decir 'Let me explain' con soltura durante tus respuestas de Interview.",
        },
      },
    },
  ];
}
