import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4ModalsPurpose(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: OBLIGACIÓN REAL (Have to vs Must)
    {
      title: "Obligación y Necesidad: Have to y Must",
      focus: "Diferenciar reglas externas (have to) de convicción personal (must)",
      payload: {
        ruleTaglineSpanish:
          "Usa 'have to' cuando una regla o situación externa te obliga (I have to wear a badge). Usa 'must' para un deber moral o personal fuerte. Y 'don't have to' significa que no es necesario, no que esté prohibido.",
        formulaSegments: [
          { label: "REGLA EXTERNA", token: "I have to / She has to + verb", tone: "violet" },
          { label: "DEBER PERSONAL", token: "I must + verb (sin to)", tone: "emerald" },
          { label: "NO ES OBLIGATORIO", token: "You don't have to + verb", tone: "sky" },
        ],
        commonMistake: {
          wrong: "You must to finish this.",
          wrongToken: "must to finish",
          correct: "You must finish this.",
          correctToken: "must finish",
          whySpanish: "Después del modal 'must' el verbo entra limpio sin 'to'.",
        },
        examples: [
          {
            english: "I have to submit the report before five.",
            spanish: "Tengo que entregar el reporte antes de las cinco.",
            pronunciationHint: "ai jav tu sabmít de ripórt bifór fáiv",
          },
          {
            english: "You don't have to stay late today.",
            spanish: "No tienes que quedarte hasta tarde hoy.",
            pronunciationHint: "yu dóunt jav tu stéi léit tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Tengo que entregar esto hoy",
          targetTokens: ["I", "have", "to", "submit", "this", "today"],
          distractorTokens: ["must to"],
          successTipSpanish: "¡Excelente! 'Have to submit' describe una responsabilidad profesional clara.",
          mistakeHintSpanish: "Usa 'I have to submit this today' para expresar obligación.",
        },
        voicePractice: {
          sentenceEnglish: "I have to finish this task today.",
          spanishMeaning: "Tengo que terminar esta tarea hoy.",
          pronunciationHint: "ai jav tu fínish dis task tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Describe tus responsabilidades pasadas diciendo 'In my previous role, I had to...'.",
        },
      },
    },

    // BASE 18: EL CONSEJO AMABLE (Should / Shouldn't)
    {
      title: "El Consejo Amable: Should y Shouldn't",
      focus: "Dar sugerencias, recomendaciones y pedir opiniones profesionales",
      payload: {
        ruleTaglineSpanish:
          "Para aconsejar sin sonar impositivo usa 'should' (deberías) o 'shouldn't' (no deberías). Es un modal noble: nunca lleva '-s' ni lleva 'to' antes del siguiente verbo.",
        formulaSegments: [
          { label: "QUIÉN", token: "You / We / I", tone: "violet" },
          { label: "CONSEJO", token: "should / shouldn't", tone: "emerald" },
          { label: "ACCIÓN DIRECTA", token: "review · double-check · rest", tone: "sky" },
        ],
        commonMistake: {
          wrong: "You should to take a break.",
          wrongToken: "should to take",
          correct: "You should take a break.",
          correctToken: "should take",
          whySpanish: "'Should' va directo al verbo sin 'to': 'You should take'.",
        },
        examples: [
          {
            english: "You should double-check the figures before sending.",
            spanish: "Deberías verificar dos veces las cifras antes de enviar.",
            pronunciationHint: "yu shúd dábol chek de fíguiurs bifór sénding",
          },
          {
            english: "We shouldn't rush this decision.",
            spanish: "No deberíamos apresurar esta decisión.",
            pronunciationHint: "ui shúdent rash dis desíshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Deberías revisar esto hoy",
          targetTokens: ["You", "should", "review", "this", "today"],
          distractorTokens: ["to review"],
          successTipSpanish: "¡Muy profesional! 'You should review' suena cordial y experto.",
          mistakeHintSpanish: "Pon 'should' seguido directamente de 'review' sin 'to'.",
        },
        voicePractice: {
          sentenceEnglish: "You should take a short break.",
          spanishMeaning: "Deberías tomarte un breve descanso.",
          pronunciationHint: "yu shúd téik a short bréik",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Ofrece recomendaciones amables a tus compañeros en correos con 'We should consider...'.",
        },
      },
    },

    // BASE 19: POSIBILIDAD INCIERTA (May / Might)
    {
      title: "Posibilidad Incierta: May y Might",
      focus: "Expresar probabilidad, incertidumbre y cautela sin comprometerse en exceso",
      payload: {
        ruleTaglineSpanish:
          "Cuando algo no es seguro pero es posible (tal vez ocurra), usa 'may' o 'might' (podría). Te permite ser prudente y profesional al estimar plazos o resultados.",
        formulaSegments: [
          { label: "SUJETO", token: "It / We / They", tone: "violet" },
          { label: "PROBABILIDAD", token: "might / may", tone: "emerald" },
          { label: "ACCIÓN BASE", token: "take more time / rain / change", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Maybe it will to rain.",
          wrongToken: "will to",
          correct: "It might rain later.",
          correctToken: "might rain",
          whySpanish: "'Might' ya expresa posibilidad futura de forma mucho más nativa y limpia.",
        },
        examples: [
          {
            english: "The delivery might take a few extra days.",
            spanish: "La entrega podría tardar unos días adicionales.",
            pronunciationHint: "de delíveri máit téik a fiú ékstra déis",
          },
          {
            english: "We may need more information from the client.",
            spanish: "Es posible que necesitemos más información del cliente.",
            pronunciationHint: "ui méi níd mor informéishon from de kláient",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esto podría tardar más tiempo",
          targetTokens: ["This", "might", "take", "more", "time"],
          distractorTokens: ["to take"],
          successTipSpanish: "¡Cautela profesional dominada! 'This might take' es sumamente natural.",
          mistakeHintSpanish: "Coloca 'might' y luego la acción 'take more time'.",
        },
        voicePractice: {
          sentenceEnglish: "This might take a few minutes.",
          spanishMeaning: "Esto podría tardar unos minutos.",
          pronunciationHint: "dis máit téik a fiú mínits",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica hipótesis y probabilidades en reportes técnicos con 'might' y 'may'.",
        },
      },
    },

    // BASE 20: EL PROPÓSITO LIMPIO (To + Verbo sin 'For to')
    {
      title: "El Propósito Limpio: To + Verbo",
      focus: "Expresar la finalidad de una acción sin la interferencia del español 'para'",
      payload: {
        ruleTaglineSpanish:
          "En español decimos 'Llamo para confirmar', pero en inglés NUNCA juntes 'for to' ni pongas 'for' delante de un verbo base: un simple 'to' ya significa 'para': I call to confirm.",
        formulaSegments: [
          { label: "ACCIÓN INICIAL", token: "I practice daily / I called you", tone: "violet" },
          { label: "PROPÓSITO (PARA)", token: "to", tone: "emerald" },
          { label: "ACCIÓN META", token: "learn faster / confirm the hour", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I study for to learn English.",
          wrongToken: "for to learn",
          correct: "I study to learn English.",
          correctToken: "to learn",
          whySpanish: "Delante de un verbo en infinitivo, 'to' solito ya expresa propósito ('para aprender').",
        },
        examples: [
          {
            english: "I called to confirm the appointment.",
            spanish: "Llamé para confirmar la cita.",
            pronunciationHint: "ai kold tu konférm di apóintment",
          },
          {
            english: "We meet early to review the plan.",
            spanish: "Nos reunimos temprano para revisar el plan.",
            pronunciationHint: "ui mít érli tu riviú de plan",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Llamo para confirmar la reunión",
          targetTokens: ["I", "call", "to", "confirm", "the", "meeting"],
          distractorTokens: ["for to", "for"],
          successTipSpanish: "¡Cero traducción literal! 'To confirm' es conciso y 100% nativo.",
          mistakeHintSpanish: "No uses 'for' ni 'for to'; usa directamente 'to confirm'.",
        },
        voicePractice: {
          sentenceEnglish: "I practice every day to improve.",
          spanishMeaning: "Practico todos los días para mejorar.",
          pronunciationHint: "ai práktis évri déi tu imprúv",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a 'Why are you here?' abriendo con 'I am here to contribute and grow'.",
        },
      },
    },

    // BASE 21: PHRASAL VERBS COTIDIANOS
    {
      title: "Phrasal Verbs Cotidianos: Verbos con Partícula",
      focus: "Los phrasal verbs inseparables más usados (turn on/off, pick up, set up, find out)",
      payload: {
        ruleTaglineSpanish:
          "Un Phrasal Verb es un verbo que se casa con una preposición y juntos crean un significado nuevo: turn on (encender), turn off (apagar), set up (configurar), look for (buscar), y pick up (recoger).",
        formulaSegments: [
          { label: "VERBO + PARTÍCULA", token: "turn on · pick up · set up · find out", tone: "violet" },
          { label: "OBJETO", token: "the computer · the call · the details", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I am searching my keys (literal).",
          wrongToken: "searching my keys",
          correct: "I am looking for my keys.",
          correctToken: "looking for",
          whySpanish: "En el día a día se usa el phrasal verb 'look for', no el formal 'search'.",
        },
        examples: [
          {
            english: "Please turn off the lights when you leave.",
            spanish: "Por favor apaga las luces cuando salgas.",
            pronunciationHint: "plís tern of de láits uén yu liv",
          },
          {
            english: "We need to set up the new workstation.",
            spanish: "Necesitamos configurar el nuevo puesto de trabajo.",
            pronunciationHint: "ui níd tu set áp de niú uórk-steishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Necesitamos configurar el plan hoy",
          targetTokens: ["We", "need", "to", "set", "up", "the", "plan"],
          distractorTokens: ["configure"],
          successTipSpanish: "¡Nativo al 100%! 'Set up' es el phrasal verb predilecto en ambientes de trabajo.",
          mistakeHintSpanish: "Usa el phrasal verb 'set up' para referirte a configurar o preparar.",
        },
        voicePractice: {
          sentenceEnglish: "Please set up the meeting today.",
          spanishMeaning: "Por favor organiza la reunión hoy.",
          pronunciationHint: "plís set áp de míting tudéi",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce de inmediato combinaciones con 'up', 'down', 'on' y 'off' en artículos.",
        },
      },
    },
  ];
}

