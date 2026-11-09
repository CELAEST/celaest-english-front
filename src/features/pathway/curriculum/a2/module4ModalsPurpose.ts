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
        formulaCases: [
          {
            label: "01 · Regla externa: have to",
            segments: [
              { label: "OBLIGACIÓN EXTERNA", token: "I have to / She has to + verb", tone: "violet" },
              { label: "SEÑAL", token: "badge · deadline · schedule", tone: "emerald" },
              { label: "TERCERA PERSONA", token: "has to", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la obligación viene de una regla, un jefe o un horario, usa 'have to': la presión está afuera de ti. Con he, she o it cambia a 'has to'. En cambio, 'must' habla de tu propia convicción, no de una norma.",
            exampleEnglish: "I have to wear a badge at work.",
          },
          {
            label: "02 · Deber personal: must",
            segments: [
              { label: "CONVICCIÓN PROPIA", token: "I must + verb", tone: "violet" },
              { label: "SIN 'TO'", token: "must finish · must call", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la obligación nace de tu conciencia o de una decisión personal fuerte, usa 'must'. Va directo al verbo, sin 'to'. Contraste: si la regla es externa, 'have to' suena más natural y menos solemne.",
            exampleEnglish: "I must call my family tonight.",
          },
          {
            label: "03 · No es obligatorio: don't have to",
            segments: [
              { label: "NO HACE FALTA", token: "don't / doesn't have to + verb", tone: "violet" },
              { label: "NO ES PROHIBICIÓN", token: "optional, not banned", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando algo es opcional y nadie te obliga, usa 'don't have to'. Ojo: eso no significa prohibido; para prohibir se usa 'mustn't'. Es la confusión más común de esta base.",
            exampleEnglish: "We don't have to print the agenda.",
          },
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
        formulaCases: [
          {
            label: "01 · Consejo: should",
            segments: [
              { label: "CONSEJO", token: "should + verb", tone: "violet" },
              { label: "SIN -S NI 'TO'", token: "she should review", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres recomendar algo sin imponerlo, usa 'should': es un consejo, no una orden. El verbo siguiente va limpio, sin 'to' y sin '-s'. Contraste: 'have to' obliga; 'should' solo sugiere.",
            exampleEnglish: "You should ask for the details.",
          },
          {
            label: "02 · Consejo negativo: shouldn't",
            segments: [
              { label: "CONSEJO NEGATIVO", token: "shouldn't + verb", tone: "violet" },
              { label: "SEÑAL", token: "rushing · deleting · waiting", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres desaconsejar una acción, usa 'shouldn't': suaviza el 'no lo hagas'. No es una prohibición formal, es una recomendación. Contraste: si algo está prohibido de verdad, se usa 'mustn't'.",
            exampleEnglish: "You shouldn't send that email today.",
          },
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
        formulaCases: [
          {
            label: "01 · Posibilidad: may",
            segments: [
              { label: "POSIBILIDAD CON BASE", token: "may + verb", tone: "violet" },
              { label: "REGISTRO", token: "formal y prudente", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando ves una posibilidad con algo de base, usa 'may': es formal, deja la puerta abierta y funciona muy bien en correos y reuniones. Contraste: 'will' afirma; 'may' solo plantea que puede pasar.",
            exampleEnglish: "The client may ask for a discount.",
          },
          {
            label: "02 · Posibilidad más incierta: might",
            segments: [
              { label: "POSIBILIDAD DÉBIL", token: "might + verb", tone: "violet" },
              { label: "SEÑAL", token: "sospecha, sin datos", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la posibilidad es más remota o insegura, usa 'might': es la opción más común al hablar para especular. Contraste: 'may' suena más formal y algo más probable; 'might' deja más duda.",
            exampleEnglish: "It might rain before the meeting.",
          },
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
        formulaCases: [
          {
            label: "01 · Propósito afirmativo: to + verbo",
            segments: [
              { label: "ACCIÓN INICIAL", token: "I called / We meet", tone: "violet" },
              { label: "PROPÓSITO (PARA)", token: "to + verb", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres decir para qué haces algo, une las dos acciones con 'to' y el verbo base. Nunca pongas 'for' delante del verbo: 'for to confirm' no existe. Contraste: 'for' solo aparece antes de un sustantivo.",
            exampleEnglish: "She saved money to buy a laptop.",
          },
          {
            label: "02 · Propósito negativo: not to",
            segments: [
              { label: "ACCIÓN INICIAL", token: "I left early", tone: "violet" },
              { label: "PROPÓSITO NEGADO", token: "not to + verb", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el propósito es evitar algo, el 'not' va delante del 'to': 'not to miss'. No digas 'to not' ni 'for not', porque suenan forzados o incorrectos. Contraste: 'not to' explica intención; 'don't' da una orden.",
            exampleEnglish: "I took a taxi not to be late.",
          },
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
        formulaCases: [
          {
            label: "01 · Separables: turn it off",
            segments: [
              { label: "VERBO + PARTÍCULA", token: "turn off · pick up · set up", tone: "violet" },
              { label: "PRONOMBRE EN MEDIO", token: "turn it off · pick them up", tone: "emerald" },
            ],
            explanationSpanish:
              "Con un pronombre (it, them) la partícula se separa: 'turn it off', nunca 'turn off it'. Con un sustantivo tienes dos opciones: 'turn off the lights' o 'turn the lights off'. La señal es el pronombre en medio.",
            exampleEnglish: "Can you set it up tonight?",
          },
          {
            label: "02 · Inseparables: look for",
            segments: [
              { label: "VERBO + PARTÍCULA", token: "look for · find out", tone: "violet" },
              { label: "JUNTOS SIEMPRE", token: "look for my keys", tone: "emerald" },
            ],
            explanationSpanish:
              "En los inseparables la partícula no se mueve: decimos 'look for my keys', nunca 'look my keys for'. La señal está en el significado: verbo y partícula forman una unidad y no admiten nada en medio.",
            exampleEnglish: "We are looking for the invoice.",
          },
          {
            label: "03 · Intransitivos: sin objeto",
            segments: [
              { label: "VERBO + PARTÍCULA", token: "wake up · get up · come back", tone: "violet" },
              { label: "SIN OBJETO", token: "I woke up late", tone: "emerald" },
            ],
            explanationSpanish:
              "Algunos phrasal verbs no llevan objeto: 'wake up', 'get up' o 'come back' se usan solos. Si les agregas un objeto, la frase deja de funcionar. Contraste: 'turn on' sí pide objeto; 'wake up' no.",
            exampleEnglish: "I woke up late this morning.",
          },
        ],
        commonMistake: {
          wrong: "I am searching my keys.",
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

