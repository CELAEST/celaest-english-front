import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5Communication(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 24: LA BRÚJULA DE PREGUNTAS WH-
    {
      title: "La Brújula de Preguntas: What, Where, When, Why, Who, Which",
      focus: "Palabras interrogativas Wh- para pedir información específica",
      payload: {
        ruleTaglineSpanish:
          "Abre con la palabra Wh- y conserva detrás la inversión de pregunta (con Do/Does o con To Be).",
        formulaSegments: [
          { label: "BRÚJULA WH-", token: "Where / What", tone: "violet" },
          { label: "AUXILIAR", token: "do", tone: "emerald" },
          { label: "PERSONA + ACCIÓN", token: "you work?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Con Acciones (Wh- + Do)",
            segments: [
              { label: "BRÚJULA WH-", token: "Where / What / When", tone: "violet" },
              { label: "LLAVE", token: "do", tone: "emerald" },
              { label: "PERSONA + VERBO", token: "you work / need?", tone: "sky" },
            ],
            explanationSpanish:
              "Con verbos de acción pon Wh- y luego 'do' (o 'does' para he/she: 'Where does she live?').",
            exampleEnglish: "Where do you work?",
          },
          {
            label: "02 · Con To Be (Wh- + Is/Are)",
            segments: [
              { label: "BRÚJULA WH-", token: "Where / Who", tone: "violet" },
              { label: "TO BE", token: "is", tone: "emerald" },
              { label: "SUJETO", token: "the meeting / your boss?", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando preguntas con ser o estar no uses 'do': pon 'is' o 'are' justo tras la palabra Wh-.",
            exampleEnglish: "Where is the meeting?",
          },
        ],
        commonMistake: {
          wrong: "Where you work?",
          wrongToken: "Where you",
          correct: "Where do you work?",
          correctToken: "Where do you",
          whySpanish: "Después de 'Where' no olvides poner la llave auxiliar 'do' o 'does'.",
        },
        examples: [
          {
            english: "Where do you work?",
            spanish: "¿Dónde trabajas?",
            pronunciationHint: "uér du yu uórk?",
          },
          {
            english: "What do you need right now?",
            spanish: "¿Qué necesitas ahora mismo?",
            pronunciationHint: "uát du yu níd ráit náu?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Dónde trabajas tú?",
          targetTokens: ["Where", "do", "you", "work?"],
          distractorTokens: ["are"],
          successTipSpanish: "¡Brillante! Combinaste 'Where' con la llave auxiliar 'do'.",
          mistakeHintSpanish: "Abre con 'Where', añade la llave 'do' y finaliza con 'you work?'.",
        },
        voicePractice: {
          sentenceEnglish: "Where do you work?",
          spanishMeaning: "¿Dónde trabajas tú?",
          pronunciationHint: "uér du yu uórk?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Reconoce al instante las preguntas del entrevistador que inician con 'What' y 'Why'.",
        },
      },
    },

    // BASE 25: PREGUNTAS DE CANTIDAD Y MEDIDA (How much, How many, How often)
    {
      title: "Preguntas de Cantidad y Medida: How Much, How Many y How Often",
      focus: "Preguntar precios, cantidades contables y frecuencia con 'How'",
      payload: {
        ruleTaglineSpanish:
          "Combina 'How' según qué midas: precio/masa (much), unidades (many) o frecuencia (often).",
        formulaSegments: [
          { label: "MEDIDA", token: "How much", tone: "violet" },
          { label: "TO BE", token: "is", tone: "emerald" },
          { label: "OBJETO", token: "this?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Precio o Masa (How much)",
            segments: [
              { label: "MEDIDA", token: "How much", tone: "violet" },
              { label: "PREGUNTA", token: "is this? / time do we have?", tone: "emerald" },
            ],
            explanationSpanish:
              "Usa 'How much' para preguntar cuánto cuesta algo o medir tiempo y dinero incontable.",
            exampleEnglish: "How much is this?",
          },
          {
            label: "02 · Contables (How many)",
            segments: [
              { label: "CONTEO", token: "How many", tone: "violet" },
              { label: "PLURAL", token: "people / options", tone: "emerald" },
              { label: "CIERRE", token: "are here?", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'How many' seguido de un sustantivo plural para contar unidades o personas.",
            exampleEnglish: "How many people are here?",
          },
          {
            label: "03 · Frecuencia (How often)",
            segments: [
              { label: "FRECUENCIA", token: "How often", tone: "violet" },
              { label: "AUXILIAR + TÚ", token: "do you", tone: "emerald" },
              { label: "ACCIÓN", token: "study English?", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'How often' para preguntar cada cuánto ocurre un hábito o rutina.",
            exampleEnglish: "How often do you study English?",
          },
        ],
        commonMistake: {
          wrong: "How many is it?",
          wrongToken: "How many",
          correct: "How much is it?",
          correctToken: "How much",
          whySpanish: "Para preguntar el costo o precio de algo, usa siempre 'How much'.",
        },
        examples: [
          {
            english: "How much does it cost?",
            spanish: "¿Cuánto cuesta?",
            pronunciationHint: "jáu mach das it kost?",
          },
          {
            english: "How often do you study English?",
            spanish: "¿Con qué frecuencia estudias inglés?",
            pronunciationHint: "jáu ófen du yu stádi ínglish?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Cuánto cuesta esto?",
          targetTokens: ["How", "much", "is", "this?"],
          distractorTokens: ["many"],
          successTipSpanish: "¡Genial! 'How much is this?' es la frase exacta para compras y cotizaciones.",
          mistakeHintSpanish: "Para precios usa 'How much', no 'How many'.",
        },
        voicePractice: {
          sentenceEnglish: "How much is this?",
          spanishMeaning: "¿Cuánto cuesta esto?",
          pronunciationHint: "jáu mach is dis?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a 'How often do you use English?' diciendo 'Every single day'.",
        },
      },
    },

    // BASE 26: CAPACIDAD Y PERMISO CON 'CAN'
    {
      title: "Poder Hacer con 'Can': La Palabra Invencible",
      focus: "Habilidad, posibilidad y permiso con el modal 'Can'",
      payload: {
        ruleTaglineSpanish:
          "'Can' es idéntico para todas las personas: nunca lleva '-s' ni necesita 'to' detrás.",
        formulaSegments: [
          { label: "CUALQUIER PERSONA", token: "I / She / We", tone: "violet" },
          { label: "PODER", token: "can / can't", tone: "emerald" },
          { label: "VERBO SIN TO", token: "learn / speak", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "Fórmula Única",
            segments: [
              { label: "CUALQUIER PERSONA", token: "I / She / We", tone: "violet" },
              { label: "PODER", token: "can / can't", tone: "emerald" },
              { label: "VERBO PURO", token: "learn / speak / help", tone: "sky" },
            ],
            explanationSpanish:
              "Con I, She o They, 'can' jamás cambia de forma y el verbo que sigue va directo sin 'to'.",
            exampleEnglish: "I can learn English today.",
          },
        ],
        commonMistake: {
          wrong: "She cans speak English.",
          wrongToken: "cans",
          correct: "She can speak English.",
          correctToken: "can",
          whySpanish: "'Can' nunca cambia de forma; jamás le agregues '-s'.",
        },
        examples: [
          {
            english: "I can communicate clearly in English.",
            spanish: "Puedo comunicarme con claridad en inglés.",
            pronunciationHint: "ai kan komyúnikeit klíarli in ínglish",
          },
          {
            english: "Can you help me with this detail?",
            spanish: "¿Puedes ayudarme con este detalle?",
            pronunciationHint: "kan yu jélp mi uiz dis ditéil?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo puedo aprender inglés hoy",
          targetTokens: ["I", "can", "learn", "English", "today"],
          distractorTokens: ["cans", "to learn"],
          successTipSpanish: "¡Perfecto! Usaste 'can' seguido del verbo base puro 'learn'.",
          mistakeHintSpanish: "Pon 'I can' y el verbo en su forma base 'learn'.",
        },
        voicePractice: {
          sentenceEnglish: "I can learn English today.",
          spanishMeaning: "Yo puedo aprender inglés hoy.",
          pronunciationHint: "ai kan lérn ínglish tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Expresa tus fortalezas en Interview diciendo 'I can adapt quickly'.",
        },
      },
    },

    // BASE 27: CORTESÍA Y PETICIONES REALES (Would like / Could you)
    {
      title: "Cortesía y Peticiones Reales: Would Like y Could You",
      focus: "Pedir favores y ordenar de manera educada en el mundo real",
      payload: {
        ruleTaglineSpanish:
          "Suena amable y profesional con dos fórmulas clave: 'I would like' y 'Could you...?'.",
        formulaSegments: [
          { label: "PERSONA", token: "I", tone: "violet" },
          { label: "DESEO CORTÉS", token: "would like", tone: "emerald" },
          { label: "PEDIDO", token: "a call / to schedule", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Pedir Algo (Would like)",
            segments: [
              { label: "PERSONA", token: "I", tone: "violet" },
              { label: "CORTESÍA", token: "would like (I'd like)", tone: "emerald" },
              { label: "PEDIDO", token: "a coffee / a call", tone: "sky" },
            ],
            explanationSpanish:
              "Reemplaza 'I want' por 'I would like' en tiendas, restaurantes o reuniones de trabajo.",
            exampleEnglish: "I would like a call today.",
          },
          {
            label: "02 · Pedir un Favor (Could you)",
            segments: [
              { label: "APERTURA", token: "Could you", tone: "violet" },
              { label: "ACCIÓN PURA", token: "send me / help me", tone: "emerald" },
              { label: "DETALLE", token: "with the file?", tone: "sky" },
            ],
            explanationSpanish:
              "Abre tus solicitudes a colegas o desconocidos con 'Could you...?' para sonar cordial.",
            exampleEnglish: "Could you send me the file?",
          },
        ],
        commonMistake: {
          wrong: "Give me a coffee now.",
          wrongToken: "Give me",
          correct: "I would like a coffee, please.",
          correctToken: "I would like",
          whySpanish: "Para sonar amable y profesional, abre con 'I would like' o 'Could you'.",
        },
        examples: [
          {
            english: "I would like to schedule a call.",
            spanish: "Me gustaría agendar una llamada.",
            pronunciationHint: "ai uúd láik tu skédyul a kol",
          },
          {
            english: "Could you send me the file?",
            spanish: "¿Podrías enviarme el archivo?",
            pronunciationHint: "kúd yu send mi de fáil?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Me gustaría una llamada hoy",
          targetTokens: ["I", "would", "like", "a", "call", "today"],
          distractorTokens: ["want to"],
          successTipSpanish: "¡Muy profesional! 'I would like' abre puertas en cualquier contexto.",
          mistakeHintSpanish: "Abre con 'I would like' para formular tu petición con cortesía.",
        },
        voicePractice: {
          sentenceEnglish: "I would like a call today.",
          spanishMeaning: "Me gustaría una llamada hoy.",
          pronunciationHint: "ai uúd láik a kol tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Redacta peticiones corteses en tus correos con 'Could you please...'.",
        },
      },
    },

    // BASE 28: INSTRUCCIONES E IMPERATIVOS
    {
      title: "Instrucciones e Imperativos: Directos y Negativos",
      focus: "Dar indicaciones, instrucciones de uso y advertencias cotidianas",
      payload: {
        ruleTaglineSpanish:
          "Para dar indicaciones arranca directo con el verbo sin 'you'; para frenar abre con 'Don't'.",
        formulaSegments: [
          { label: "CORTESÍA", token: "Please", tone: "violet" },
          { label: "VERBO DIRECTO", token: "check / open", tone: "emerald" },
          { label: "DETALLE", token: "this today", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Indicación Directa",
            segments: [
              { label: "CORTESÍA", token: "Please", tone: "violet" },
              { label: "VERBO SIN SUJETO", token: "check / listen / wait", tone: "emerald" },
              { label: "OBJETO", token: "this file", tone: "sky" },
            ],
            explanationSpanish:
              "Las instrucciones no llevan 'you': empieza directamente con el verbo base (con o sin 'Please').",
            exampleEnglish: "Please check this today.",
          },
          {
            label: "02 · Advertir o Calmar (Don't)",
            segments: [
              { label: "FRENO INICIAL", token: "Don't", tone: "violet" },
              { label: "VERBO BASE", token: "worry / close", tone: "emerald" },
              { label: "DETALLE", token: "the window", tone: "sky" },
            ],
            explanationSpanish:
              "Para decir 'no hagas algo' o 'no te preocupes', abre con 'Don't' seguido del verbo puro.",
            exampleEnglish: "Don't worry, everything is under control.",
          },
        ],
        commonMistake: {
          wrong: "You listen to me.",
          wrongToken: "You listen",
          correct: "Please listen to this.",
          correctToken: "Please listen",
          whySpanish: "Las instrucciones no necesitan la persona 'you'; arrancan directo con la acción.",
        },
        examples: [
          {
            english: "Please check the information below.",
            spanish: "Por favor revisa la información abajo.",
            pronunciationHint: "plís chek di informéishon bilóu",
          },
          {
            english: "Don't worry, everything is under control.",
            spanish: "No te preocupes, todo está bajo control.",
            pronunciationHint: "dóunt uórri, évrizing is ánder kontról",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por favor revisa esto hoy",
          targetTokens: ["Please", "check", "this", "today"],
          distractorTokens: ["you check"],
          successTipSpanish: "¡Impecable! Diste una indicación limpia y directa.",
          mistakeHintSpanish: "Pon 'Please' seguido de la acción directa 'check this today'.",
        },
        voicePractice: {
          sentenceEnglish: "Please check this today.",
          spanishMeaning: "Por favor revisa esto hoy.",
          pronunciationHint: "plís chek dis tudéi",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica instrucciones operativas en guías de software y manuales.",
        },
      },
    },
  ];
}
