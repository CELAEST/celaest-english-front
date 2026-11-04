import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1Conditionals(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: HECHOS Y VERDADES (Zero Conditional)
    {
      title: "Hechos y Verdades Universales: Zero Conditional",
      focus: "Causa y consecuencia automática en presente (If + Present, Present)",
      payload: {
        ruleTaglineSpanish:
          "Para verdades científicas, reglas fijas o hábitos automáticos, usa presente en ambas partes: If you heat water, it boils. No necesitas meter 'will' porque no es una promesa futura, es una realidad.",
        formulaSegments: [
          { label: "CONDICIÓN EN PRESENTE", token: "If you heat / If we practice", tone: "violet" },
          { label: "RESULTADO EN PRESENTE", token: "it boils / we improve", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If you heat water, it will boil (para hechos universales).",
          wrongToken: "it will boil",
          correct: "If you heat water, it boils.",
          correctToken: "it boils",
          whySpanish: "Las leyes naturales y reglas automáticas usan presente simple en ambos lados.",
        },
        examples: [
          {
            english: "If you press this button, the system restarts.",
            spanish: "Si presionas este botón, el sistema se reinicia.",
            pronunciationHint: "if yu pres dis báton, de sístem ristárts",
          },
          {
            english: "When we practice consistently, we build confidence.",
            spanish: "Cuando practicamos con constancia, construimos confianza.",
            pronunciationHint: "uén ui práktis konsístentli, ui bíld kónfidens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si practicas a diario, mejoras",
          targetTokens: ["If", "you", "practice", "daily,", "you", "improve"],
          distractorTokens: ["will improve"],
          successTipSpanish: "¡Exacto! Hecho automático y verdadero: ambos lados en presente.",
          mistakeHintSpanish: "Usa 'If you practice daily, you improve' sin 'will'.",
        },
        voicePractice: {
          sentenceEnglish: "If you practice daily, you improve steadily.",
          spanishMeaning: "Si practicas a diario, mejoras de forma constante.",
          pronunciationHint: "if yu práktis déili, yu imprúv stédili",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica reglas operativas y manuales de instrucciones redactados con Zero Conditional.",
        },
      },
    },

    // BASE 2: CAUSA Y EFECTO FUTURO (First Conditional)
    {
      title: "Causa y Efecto Futuro: First Conditional",
      focus: "Condiciones reales y posibles en el futuro (If + Present, Will + Verbo)",
      payload: {
        ruleTaglineSpanish:
          "Para situaciones reales que podrían ocurrir, pon la condición en presente (If it rains) y el resultado con 'will' (I will stay home). La trampa de oro: nunca pongas 'will' dentro de la cláusula con 'if'.",
        formulaSegments: [
          { label: "CONDICIÓN (PRESENTE)", token: "If we finish early", tone: "violet" },
          { label: "RESULTADO (FUTURO)", token: "we will review the next step", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If it will rain tomorrow, I stay at home.",
          wrongToken: "If it will rain",
          correct: "If it rains tomorrow, I will stay at home.",
          correctToken: "If it rains",
          whySpanish: "La parte con 'If' siempre va en presente simple; el 'will' va solo en el resultado.",
        },
        examples: [
          {
            english: "If we receive the confirmation, we will proceed immediately.",
            spanish: "Si recibimos la confirmación, procederemos de inmediato.",
            pronunciationHint: "if ui risív de konfirméishon, ui uíl prosíd immídietli",
          },
          {
            english: "She will call you if there are any questions.",
            spanish: "Ella te llamará si hay alguna pregunta.",
            pronunciationHint: "shi uíl kol yu if der ar éni kuéschons",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si terminamos temprano, te llamaré",
          targetTokens: ["If", "we", "finish", "early,", "I", "will", "call", "you"],
          distractorTokens: ["will finish"],
          successTipSpanish: "¡Impecable! Mantuviste el presente en 'If we finish' y 'will' en el resultado.",
          mistakeHintSpanish: "Abre con 'If we finish early,' y coloca 'I will call you' al final.",
        },
        voicePractice: {
          sentenceEnglish: "If we finish early, I will contact you.",
          spanishMeaning: "Si terminamos temprano, te contactaré.",
          pronunciationHint: "if ui fínish érli, ai uíl kóntakt yu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Plantea planes contingentes diciendo 'If selected, I will contribute from day one'.",
        },
      },
    },

    // BASE 3: SALVEDADES Y ADVERTENCIAS (Unless, As soon as, In case)
    {
      title: "Salvedades y Advertencias: Unless, As soon as e In case",
      focus: "Conectores condicionales avanzados sin doble negación",
      payload: {
        ruleTaglineSpanish:
          "'Unless' significa 'a menos que'. Como ya lleva la palabra 'no' implícita, el verbo que sigue va en afirmativo: Unless you call (a menos que llames). Y 'as soon as' significa 'tan pronto como'.",
        formulaSegments: [
          { label: "A MENOS QUE", token: "Unless we act now", tone: "violet" },
          { label: "TAN PRONTO COMO", token: "as soon as we arrive", tone: "emerald" },
          { label: "EN CASO DE QUE", token: "in case you need help", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Unless you don't call me, I will leave.",
          wrongToken: "Unless you don't call",
          correct: "Unless you call me, I will leave.",
          correctToken: "Unless you call",
          whySpanish: "'Unless' ya incluye el significado negativo ('a menos que no').",
        },
        examples: [
          {
            english: "I will notify you as soon as the file arrives.",
            spanish: "Te avisaré tan pronto como llegue el archivo.",
            pronunciationHint: "ai uíl nóutifai yu as sun as de fáil arráivs",
          },
          {
            english: "Take an umbrella in case it rains.",
            spanish: "Lleva un paraguas en caso de que llueva.",
            pronunciationHint: "téik an ambréla in kéis it réins",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Te avisaré tan pronto como termine",
          targetTokens: ["I", "will", "notify", "you", "as", "soon", "as", "I", "finish"],
          distractorTokens: ["unless"],
          successTipSpanish: "¡Estructura ejecutiva de oro! 'As soon as' para avisos inmediatos.",
          mistakeHintSpanish: "Usa 'I will notify you as soon as I finish'.",
        },
        voicePractice: {
          sentenceEnglish: "I will call you as soon as I arrive.",
          spanishMeaning: "Te llamaré tan pronto como llegue.",
          pronunciationHint: "ai uíl kol yu as sun as ai arráiv",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe condiciones formales de entrega usando 'as soon as' en tus correos.",
        },
      },
    },

    // BASE 4: EL MUNDO IMAGINARIO (Second Conditional)
    {
      title: "El Mundo Imaginario: Second Conditional",
      focus: "Situaciones hipotéticas, irreales o improbables en el presente (If + Past, Would + Verbo)",
      payload: {
        ruleTaglineSpanish:
          "Para soñar despierto o imaginar qué pasaría si las cosas fueran diferentes hoy, usa Pasado Simple en la condición (If I had more time) y 'would' en el resultado (I would learn German).",
        formulaSegments: [
          { label: "CONDICIÓN HIPOTÉTICA", token: "If I had more time / If we lived in London", tone: "violet" },
          { label: "RESULTADO IMAGINARIO", token: "I would travel / we would visit", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If I have more money, I would buy a car.",
          wrongToken: "If I have",
          correct: "If I had more money, I would buy a car.",
          correctToken: "If I had",
          whySpanish: "Con 'would' en el resultado, la condición debe ir obligatoriamente en pasado ('had').",
        },
        examples: [
          {
            english: "If I had more free time, I would read every day.",
            spanish: "Si tuviera más tiempo libre, leería todos los días.",
            pronunciationHint: "if ai jad mor fri táim, ai uúd ríd évri déi",
          },
          {
            english: "What would you do if you were in charge?",
            spanish: "¿Qué harías si estuvieras a cargo?",
            pronunciationHint: "uát uúd yu du if yu uér in charch?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si tuviera más tiempo, leería más",
          targetTokens: ["If", "I", "had", "more", "time,", "I", "would", "read", "more"],
          distractorTokens: ["have", "will"],
          successTipSpanish: "¡Magistral! Second Conditional dominado con 'had' y 'would read'.",
          mistakeHintSpanish: "Usa 'If I had' para la condición hipotética y 'I would read' para el resultado.",
        },
        voicePractice: {
          sentenceEnglish: "If I had more time, I would travel more.",
          spanishMeaning: "Si tuviera más tiempo, viajaría más.",
          pronunciationHint: "if ai jad mor táim, ai uúd trável mor",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde preguntas de liderazgo situacional como 'What would you do in a conflict?'.",
        },
      },
    },

    // BASE 5: EL SUBJUNTIVO IRREAL ("If I were you...")
    {
      title: "El Subjuntivo Irreal: La Fórmula 'If I were you'",
      focus: "Uso de 'were' para todas las personas en hipótesis formales de consejo",
      payload: {
        ruleTaglineSpanish:
          "En hipótesis irreales, el inglés culto y profesional prefiere usar 'were' para todas las personas, incluso con I, He y She: If I were you (Si yo fuera tú). Es la fórmula reina para aconsejar.",
        formulaSegments: [
          { label: "SI YO FUERA TÚ", token: "If I were you", tone: "violet" },
          { label: "CONSEJO HIPOTÉTICO", token: "I would take the offer / I wouldn't worry", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If I was you, I would accept (muy informal).",
          wrongToken: "If I was you",
          correct: "If I were you, I would accept.",
          correctToken: "If I were you",
          whySpanish: "En el estándar profesional internacional se usa 'were' para el subjuntivo irreal.",
        },
        examples: [
          {
            english: "If I were you, I would clarify that point immediately.",
            spanish: "Si yo fuera tú, aclararía ese punto de inmediato.",
            pronunciationHint: "if ai uér yu, ai uúd klárifai dat póint immídietli",
          },
          {
            english: "If she were available, she would join the call.",
            spanish: "Si ella estuviera disponible, se uniría a la llamada.",
            pronunciationHint: "if shi uér avéilabol, shi uúd yóin de kol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si yo fuera tú, aceptaría la oferta",
          targetTokens: ["If", "I", "were", "you,", "I", "would", "accept", "the", "offer"],
          distractorTokens: ["was", "will"],
          successTipSpanish: "¡Inglés de alta diplomacia! 'If I were you' demuestra madurez lingüística.",
          mistakeHintSpanish: "Abre con 'If I were you,' y añade 'I would accept the offer'.",
        },
        voicePractice: {
          sentenceEnglish: "If I were you, I would accept the proposal.",
          spanishMeaning: "Si yo fuera tú, aceptaría la propuesta.",
          pronunciationHint: "if ai uér yu, ai uúd aksépt de propóusal",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Ofrece recomendaciones consultivas en reportes usando 'If we were in their position...'.",
        },
      },
    },

    // BASE 6: GRAN CONTRASTE (Realidad vs Hipótesis)
    {
      title: "Gran Contraste: Realidad vs Hipótesis (First vs Second)",
      focus: "Diferenciar posibilidades reales (First) de fantasías remotas (Second)",
      payload: {
        ruleTaglineSpanish:
          "¿Es una posibilidad real de mañana? Usa First Conditional: If I get the job, I will move. ¿Es un sueño improbable hoy? Usa Second Conditional: If I won the lottery, I would buy an island.",
        formulaSegments: [
          { label: "PROBABLE (PRESENTE + WILL)", token: "If I have time tomorrow, I will call", tone: "violet" },
          { label: "IMPROBABLE (PASADO + WOULD)", token: "If I had wings, I would fly", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If I will have time, I would call.",
          wrongToken: "If I will have... would",
          correct: "If I have time, I will call.",
          correctToken: "have... will call",
          whySpanish: "Nunca mezcles 'will' con 'would': mantén la coherencia de cada condicional.",
        },
        examples: [
          {
            english: "If it rains, we will stay inside; if we had a car, we would drive.",
            spanish: "Si llueve, nos quedaremos adentro; si tuviéramos auto, manejaríamos.",
            pronunciationHint: "if it réins, ui uíl stéi insáid; if ui jad a kar, ui uúd dráiv",
          },
          {
            english: "I will attend if I finish, but I would love to go now.",
            spanish: "Asistiré si termino, pero me encantaría ir ahora.",
            pronunciationHint: "ai uíl aténd if ai fínish, bat ai uúd lav tu góu náu",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si tengo tiempo mañana, asistiré",
          targetTokens: ["If", "I", "have", "time", "tomorrow,", "I", "will", "attend"],
          distractorTokens: ["had", "would"],
          successTipSpanish: "¡Perfecto! Identificaste una posibilidad real de mañana.",
          mistakeHintSpanish: "Para una posibilidad real futura, usa presente 'have' y 'will attend'.",
        },
        voicePractice: {
          sentenceEnglish: "If I have time, I will attend the session.",
          spanishMeaning: "Si tengo tiempo, asistiré a la sesión.",
          pronunciationHint: "if ai jav táim, ai uíl aténd de séshon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Demuestra agilidad mental cambiando de hipótesis a compromisos firmes en tus respuestas.",
        },
      },
    },
  ];
}

