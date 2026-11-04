import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2Routines(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 6: ACCIONES DEL DÍA A DÍA (Presente Simple con I, You, We, They)
    {
      title: "Acciones del Día a Día: Hábitos y Rutinas",
      focus: "Presente simple para hechos permanentes y hábitos",
      payload: {
        ruleTaglineSpanish:
          "Para hábitos diarios con I, You, We y They, usa el verbo directo en su forma base.",
        formulaSegments: [
          { label: "PERSONA", token: "I / You / We / They", tone: "violet" },
          { label: "ACCIÓN BASE", token: "work / live / study", tone: "emerald" },
          { label: "FRECUENCIA", token: "every day", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "Hábito Directo",
            segments: [
              { label: "PERSONA", token: "I / You / We / They", tone: "violet" },
              { label: "ACCIÓN BASE", token: "work / live / study", tone: "emerald" },
              { label: "FRECUENCIA", token: "every day", tone: "sky" },
            ],
            explanationSpanish:
              "Con I, You, We y They el verbo va directo y limpio, sin meter 'am' ni 'are' en medio.",
            exampleEnglish: "We study English here.",
          },
        ],
        commonMistake: {
          wrong: "I am live in the city.",
          wrongToken: "am live",
          correct: "I live in the city.",
          correctToken: "live",
          whySpanish: "No mezcles 'am' con verbos de acción. Di directamente 'I live' o 'I work'.",
        },
        examples: [
          {
            english: "We study English every morning.",
            spanish: "Estudiamos inglés cada mañana.",
            pronunciationHint: "ui stádi ínglish évri mórning",
          },
          {
            english: `I work ${roleExampleNoun} with my colleagues.`,
            spanish: `Yo trabajo ${roleExampleEsp} con mis compañeros.`,
            pronunciationHint: "ai uórk uiz mai kóligs",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Nosotros estudiamos inglés aquí",
          targetTokens: ["We", "study", "English", "here"],
          distractorTokens: ["are"],
          successTipSpanish: "¡Muy bien! Usaste el verbo directo 'study' sin meter 'are' por error.",
          mistakeHintSpanish: "Coloca 'We', luego la acción 'study' y al final 'English here'.",
        },
        voicePractice: {
          sentenceEnglish: "We study English here.",
          spanishMeaning: "Nosotros estudiamos inglés aquí.",
          pronunciationHint: "ui stádi ínglish jíar",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe tres oraciones simples sobre tus rutinas de trabajo en Writing Studio.",
        },
      },
    },

    // BASE 7: LA 'S' MÁGICA DE TERCERA PERSONA (He, She, It)
    {
      title: "La 'S' Mágica de Tercera Persona",
      focus: "Presente simple en 3ra persona (He / She / It)",
      payload: {
        ruleTaglineSpanish:
          "En rutinas presentes, He, She e It activan una '-s' final en el verbo.",
        formulaSegments: [
          { label: "3RA PERSONA", token: "He / She / It", tone: "violet" },
          { label: "VERBO + S", token: "works / helps / has", tone: "emerald" },
          { label: "RUTINA", token: "every day", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · I · You · We · They",
            segments: [
              { label: "PERSONA", token: "I / You / We / They", tone: "violet" },
              { label: "VERBO SIN -S", token: "work / help / have", tone: "emerald" },
              { label: "RUTINA", token: "every day", tone: "sky" },
            ],
            explanationSpanish:
              "Con I, You, We y They el verbo queda intacto en su forma original.",
            exampleEnglish: "We work every day.",
          },
          {
            label: "02 · He · She · It (+s)",
            segments: [
              { label: "3RA PERSONA", token: "He / She / It", tone: "violet" },
              { label: "VERBO + S", token: "works / helps / has", tone: "emerald" },
              { label: "RUTINA", token: "every day", tone: "sky" },
            ],
            explanationSpanish:
              "Al hablar de él, ella o eso en singular, añade '-s' al verbo ('have' cambia a 'has').",
            exampleEnglish: "She works every day.",
          },
        ],
        commonMistake: {
          wrong: "She work with me.",
          wrongToken: "work",
          correct: "She works with me.",
          correctToken: "works",
          whySpanish: "En presente simple, 'She', 'He' e 'It' siempre activan la '-s' final del verbo.",
        },
        examples: [
          {
            english: "He helps the team every single day.",
            spanish: "Él ayuda al equipo cada uno de los días.",
            pronunciationHint: "ji jélps de tím évri síngol déi",
          },
          {
            english: "She works with great focus.",
            spanish: "Ella trabaja con gran concentración.",
            pronunciationHint: "shi uórks uiz gréit fókus",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ella trabaja todos los días",
          targetTokens: ["She", "works", "every", "day"],
          distractorTokens: ["work"],
          successTipSpanish: "¡Exacto! Elegiste 'works' con la '-s' de tercera persona.",
          mistakeHintSpanish: "Al hablar de 'She', recuerda activar la terminación con '-s': 'works'.",
        },
        voicePractice: {
          sentenceEnglish: "She works every day.",
          spanishMeaning: "Ella trabaja todos los días.",
          pronunciationHint: "shi uórks évri déi",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Fíjate en Reading cómo los artículos añaden la '-s' al hablar de especialistas.",
        },
      },
    },

    // BASE 8: EL ESCUDO NEGATIVO (Don't vs Doesn't)
    {
      title: "El Escudo Negativo: Don't y Doesn't",
      focus: "Negación limpia en presente simple",
      payload: {
        ruleTaglineSpanish:
          "Para negar acciones en presente usamos dos escudos según la persona: 'don't' o 'doesn't'.",
        formulaSegments: [
          { label: "PERSONA", token: "I / You / We / They", tone: "violet" },
          { label: "ESCUDO", token: "don't", tone: "emerald" },
          { label: "VERBO BASE", token: "need / have", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Con Don't",
            segments: [
              { label: "PERSONA", token: "I / You / We / They", tone: "violet" },
              { label: "ESCUDO", token: "don't", tone: "emerald" },
              { label: "VERBO BASE", token: "need / understand", tone: "sky" },
            ],
            explanationSpanish:
              "Con I, You, We y They coloca 'don't' antes del verbo; nunca digas 'I no understand'.",
            exampleEnglish: "I don't need more time.",
          },
          {
            label: "02 · Con Doesn't",
            segments: [
              { label: "3RA PERSONA", token: "He / She / It", tone: "violet" },
              { label: "ESCUDO", token: "doesn't", tone: "emerald" },
              { label: "VERBO SIN -S", token: "work / need / have", tone: "sky" },
            ],
            explanationSpanish:
              "Con He, She e It usa 'doesn't'. Como 'doesn't' absorbe la S, el verbo queda puro.",
            exampleEnglish: "He doesn't work on the weekend.",
          },
        ],
        commonMistake: {
          wrong: "I no understand the question.",
          wrongToken: "no understand",
          correct: "I don't understand the question.",
          correctToken: "don't understand",
          whySpanish: "Usa 'don't' antes de la acción para negar con naturalidad y limpieza.",
        },
        examples: [
          {
            english: "I don't have any questions right now.",
            spanish: "No tengo ninguna pregunta en este momento.",
            pronunciationHint: "ai dóunt jav éni kuéschons ráit náu",
          },
          {
            english: "He doesn't work on the weekend.",
            spanish: "Él no trabaja el fin de semana.",
            pronunciationHint: "ji dásent uórk on de uíkend",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo no necesito más tiempo",
          targetTokens: ["I", "don't", "need", "more", "time"],
          distractorTokens: ["no", "doesn't"],
          successTipSpanish: "¡Excelente! 'I don't need' suena 100% nativo.",
          mistakeHintSpanish: "Después de 'I', pon el escudo 'don't' seguido de 'need more time'.",
        },
        voicePractice: {
          sentenceEnglish: "I don't need more time.",
          spanishMeaning: "No necesito más tiempo.",
          pronunciationHint: "ai dóunt níd mor táim",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Usa 'I don't understand' con soltura si necesitas pedir que repitan una idea.",
        },
      },
    },

    // BASE 9: LA LLAVE DE PREGUNTAS DIRECTAS (Do / Does)
    {
      title: "La Llave de Preguntas Directas: Do y Does",
      focus: "Inversión auxiliar para preguntas en presente simple",
      payload: {
        ruleTaglineSpanish:
          "En inglés no existe el signo '¿': abrimos la pregunta con 'Do' o 'Does' según la persona.",
        formulaSegments: [
          { label: "LLAVE", token: "Do", tone: "violet" },
          { label: "PERSONA", token: "you / we / they", tone: "emerald" },
          { label: "VERBO BASE", token: "have / live?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Con Do (You · We · They)",
            segments: [
              { label: "LLAVE", token: "Do", tone: "violet" },
              { label: "PERSONA", token: "you / we / they", tone: "emerald" },
              { label: "VERBO BASE", token: "have / live / work?", tone: "sky" },
            ],
            explanationSpanish:
              "Con I, You, We y They abrimos la pregunta con 'Do' y dejamos el verbo en forma base.",
            exampleEnglish: "Do you have a minute?",
          },
          {
            label: "02 · Con Does (He · She · It)",
            segments: [
              { label: "LLAVE", token: "Does", tone: "violet" },
              { label: "3RA PERSONA", token: "he / she / it", tone: "emerald" },
              { label: "VERBO SIN -S", token: "have / live / work?", tone: "sky" },
            ],
            explanationSpanish:
              "Con He, She o It abrimos con 'Does' y el verbo pierde la S porque 'Does' ya la lleva.",
            exampleEnglish: "Does she live in this city?",
          },
        ],
        commonMistake: {
          wrong: "You have time now?",
          wrongToken: "You have",
          correct: "Do you have time now?",
          correctToken: "Do you have",
          whySpanish: "Abre siempre preguntas de sí o no con 'Do' o 'Does' para sonar auténtico.",
        },
        examples: [
          {
            english: "Do you have a minute to talk?",
            spanish: "¿Tienes un minuto para hablar?",
            pronunciationHint: "du yu jav a mínit tu tok?",
          },
          {
            english: "Does she live in this city?",
            spanish: "¿Ella vive en esta ciudad?",
            pronunciationHint: "das shi liv in dis síti?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Tienes un minuto?",
          targetTokens: ["Do", "you", "have", "a", "minute?"],
          distractorTokens: ["Are"],
          successTipSpanish: "¡Magnífico! Activaste la pregunta con la llave 'Do'.",
          mistakeHintSpanish: "Pon primero la llave 'Do', luego 'you' y después 'have a minute?'.",
        },
        voicePractice: {
          sentenceEnglish: "Do you have a minute?",
          spanishMeaning: "¿Tienes un minuto?",
          pronunciationHint: "du yu jav a mínit?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Escucha cómo el entrevistador abre sus preguntas directas con 'Do you...'.",
        },
      },
    },

    // BASE 10: VERBOS ENCADENADOS CON 'TO' (Want to, Need to, Have to)
    {
      title: "Verbos Encadenados: Want to, Need to y Have to",
      focus: "Conectar dos acciones con la partícula 'to'",
      payload: {
        ruleTaglineSpanish:
          "Al unir dos acciones de deseo o necesidad, conéctalas siempre con el puente 'to'.",
        formulaSegments: [
          { label: "VERBO 1", token: "I want / need / have", tone: "violet" },
          { label: "PUENTE", token: "to", tone: "emerald" },
          { label: "VERBO 2 BASE", token: "learn / start", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "Puente 'To'",
            segments: [
              { label: "VERBO 1", token: "I want / need / have", tone: "violet" },
              { label: "PUENTE", token: "to", tone: "emerald" },
              { label: "VERBO 2 BASE", token: "learn / speak / start", tone: "sky" },
            ],
            explanationSpanish:
              "Nunca pegues dos verbos seguidos sin el puente 'to' en medio: 'want to learn'.",
            exampleEnglish: "I want to learn English today.",
          },
        ],
        commonMistake: {
          wrong: "I want learn English.",
          wrongToken: "want learn",
          correct: "I want to learn English.",
          correctToken: "want to learn",
          whySpanish: "Nunca pegues dos verbos juntos sin el puente 'to': 'want to', 'need to'.",
        },
        examples: [
          {
            english: "I want to improve my English speaking.",
            spanish: "Quiero mejorar mi fluidez en inglés.",
            pronunciationHint: "ai uónt tu imprúv mai ínglish spíking",
          },
          {
            english: "I have to finish this task today.",
            spanish: "Tengo que terminar esta tarea hoy.",
            pronunciationHint: "ai jav tu fínish dis task tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo quiero aprender inglés hoy",
          targetTokens: ["I", "want", "to", "learn", "English", "today"],
          distractorTokens: ["learning"],
          successTipSpanish: "¡Impecable! Usaste el puente 'want to learn' de forma natural.",
          mistakeHintSpanish: "Después de 'want', pon siempre 'to' antes de 'learn'.",
        },
        voicePractice: {
          sentenceEnglish: "I want to learn English today.",
          spanishMeaning: "Yo quiero aprender inglés hoy.",
          pronunciationHint: "ai uónt tu lérn ínglish tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Explica tus metas diciendo 'I want to grow' y 'I need to practice'.",
        },
      },
    },

    // BASE 11: GUSTOS Y PREFERENCIAS (Like, Love, Hate)
    {
      title: "Gustos y Preferencias: Like, Love y Hate",
      focus: "Expresar preferencias con sustantivo o acción terminada en -ing",
      payload: {
        ruleTaglineSpanish:
          "Después de 'like' o 'love' puedes nombrar una cosa directa o una actividad con '-ing'.",
        formulaSegments: [
          { label: "PERSONA", token: "I / We", tone: "violet" },
          { label: "PREFERENCIA", token: "like / love", tone: "emerald" },
          { label: "ACTIVIDAD -ING", token: "learning / reading", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Con una Cosa",
            segments: [
              { label: "PERSONA", token: "I / We", tone: "violet" },
              { label: "GUSTO", token: "like / love", tone: "emerald" },
              { label: "SUSTANTIVO", token: "coffee / music", tone: "sky" },
            ],
            explanationSpanish:
              "Para cosas u objetos pon el sustantivo directo después de 'like' o 'love' (con She/He añade -s: 'She loves').",
            exampleEnglish: "She loves her work.",
          },
          {
            label: "02 · Con una Acción (-ing)",
            segments: [
              { label: "PERSONA", token: "I / We", tone: "violet" },
              { label: "GUSTO", token: "like / love", tone: "emerald" },
              { label: "ACCIÓN + ING", token: "learning / reading", tone: "sky" },
            ],
            explanationSpanish:
              "Para pasatiempos o acciones añade '-ing' al segundo verbo: di 'like reading', nunca 'like read'.",
            exampleEnglish: "I like learning English.",
          },
        ],
        commonMistake: {
          wrong: "I like read books.",
          wrongToken: "like read",
          correct: "I like reading books.",
          correctToken: "like reading",
          whySpanish: "Después de 'like', la acción como pasatiempo suele llevar '-ing' (reading, cooking).",
        },
        examples: [
          {
            english: "I like learning new skills.",
            spanish: "Me gusta aprender nuevas habilidades.",
            pronunciationHint: "ai láik lérning niú skils",
          },
          {
            english: "She loves her work.",
            spanish: "A ella le encanta su trabajo.",
            pronunciationHint: "shi lavs jer uórk",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Me gusta aprender inglés",
          targetTokens: ["I", "like", "learning", "English"],
          distractorTokens: ["to learn"],
          successTipSpanish: "¡Brillante! 'I like learning' suena súper fluido y natural.",
          mistakeHintSpanish: "Usa 'I like' seguido de la acción con '-ing' ('learning English').",
        },
        voicePractice: {
          sentenceEnglish: "I like learning English.",
          spanishMeaning: "Me gusta aprender inglés.",
          pronunciationHint: "ai láik lérning ínglish",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe un párrafo sobre tus pasatiempos y gustos profesionales.",
        },
      },
    },
  ];
}
