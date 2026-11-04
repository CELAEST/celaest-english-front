import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2FutureDecisions(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: PLANES CONFIRMADOS (Be going to)
    {
      title: "Planes Confirmados: Be Going to",
      focus: "Planes e intenciones premeditadas para el futuro",
      payload: {
        ruleTaglineSpanish:
          "Cuando ya tomaste una decisión antes de hablar y tienes un plan en mente, usa 'am / is / are going to' seguido del verbo base: I am going to travel next month.",
        formulaSegments: [
          { label: "SUJETO + TO BE", token: "I am · She is · We are", tone: "violet" },
          { label: "INTENCIÓN", token: "going to", tone: "emerald" },
          { label: "VERBO BASE", token: "start · learn · visit", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I going to start tomorrow.",
          wrongToken: "I going",
          correct: "I am going to start tomorrow.",
          correctToken: "I am going",
          whySpanish: "Nunca olvides el verbo To Be ('am / is / are') antes de 'going to'.",
        },
        examples: [
          {
            english: "I am going to take a new course next month.",
            spanish: "Voy a tomar un curso nuevo el próximo mes.",
            pronunciationHint: "ai am góing tu téik a niú kors nekst manz",
          },
          {
            english: "We are going to launch the initiative soon.",
            spanish: "Vamos a lanzar la iniciativa pronto.",
            pronunciationHint: "ui ar góing tu lonch di iníshiativ sun",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Voy a empezar mañana",
          targetTokens: ["I", "am", "going", "to", "start", "tomorrow"],
          distractorTokens: ["is"],
          successTipSpanish: "¡Impecable! Incluiste 'am' antes de 'going to'.",
          mistakeHintSpanish: "Recuerda incluir 'am' después de 'I': 'I am going to start tomorrow'.",
        },
        voicePractice: {
          sentenceEnglish: "I am going to start tomorrow morning.",
          spanishMeaning: "Voy a empezar mañana por la mañana.",
          pronunciationHint: "ai am góing tu stárt tumórou mórning",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe tus metas del próximo mes usando 'I am going to...' en tus planes semanales.",
        },
      },
    },

    // BASE 8: DECISIONES AL INSTANTE (Will / Won't)
    {
      title: "Decisiones al Instante y Promesas: Will y Won't",
      focus: "Decisiones espontáneas tomadas en el momento, promesas y ofrecimientos",
      payload: {
        ruleTaglineSpanish:
          "Si decides algo en el segundo exacto en que estás hablando (el teléfono suena, alguien necesita ayuda), usa 'will' (o 'won't' para negar). Es directo y nunca cambia.",
        formulaSegments: [
          { label: "QUIÉN", token: "I / You / We / They", tone: "violet" },
          { label: "FUTURO INSTANTÁNEO", token: "will ('ll) / will not (won't)", tone: "emerald" },
          { label: "ACCIÓN PURA", token: "help you · answer · check that", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The phone is ringing. I am going to answer it.",
          wrongToken: "am going to",
          correct: "The phone is ringing. I will answer it.",
          correctToken: "will answer",
          whySpanish: "Para decisiones repentinas al instante, usa 'will', no 'going to'.",
        },
        examples: [
          {
            english: "Don't worry, I will help you with this.",
            spanish: "No te preocupes, yo te ayudaré con esto.",
            pronunciationHint: "dóunt uórri, ai uíl jélp yu uiz dis",
          },
          {
            english: "I will send you the information right away.",
            spanish: "Te enviaré la información de inmediato.",
            pronunciationHint: "ai uíl send yu di informéishon ráit auéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Te ayudaré con esto hoy",
          targetTokens: ["I", "will", "help", "you", "with", "this", "today"],
          distractorTokens: ["going to"],
          successTipSpanish: "¡Elegante y decidido! 'I will help' es la respuesta inmediata ideal.",
          mistakeHintSpanish: "Usa 'I will help you' para ofrecer tu ayuda en el momento.",
        },
        voicePractice: {
          sentenceEnglish: "I will help you right now.",
          spanishMeaning: "Te ayudaré ahora mismo.",
          pronunciationHint: "ai uíl jélp yu ráit náu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Haz compromisos firmes en entrevistas diciendo 'I will deliver results'.",
        },
      },
    },

    // BASE 9: CITAS FIJAS EN AGENDA (Present Continuous con Sentido Futuro)
    {
      title: "Citas Fijas en Agenda: Present Continuous con Valor Futuro",
      focus: "Compromisos fijos con hora, fecha y personas coordinadas",
      payload: {
        ruleTaglineSpanish:
          "En el mundo profesional, cuando una reunión o viaje ya tiene fecha, hora o billete comprado, los nativos usan Presente Continuo: I am meeting the director tomorrow at 10 AM.",
        formulaSegments: [
          { label: "SUJETO + TO BE", token: "I am · She is · We are", tone: "violet" },
          { label: "ACCIÓN CON -ING", token: "meeting · flying · having lunch", tone: "emerald" },
          { label: "HORA / FECHA FIJA", token: "tomorrow at 3 PM / next Friday", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I will meet the doctor tomorrow at 4 PM (suena como que lo decidiste ya).",
          wrongToken: "will meet",
          correct: "I am meeting the doctor tomorrow at 4 PM.",
          correctToken: "am meeting",
          whySpanish: "Para citas agendadas con fecha y hora fija, el presente continuo es la forma más natural.",
        },
        examples: [
          {
            english: "We are meeting the team tomorrow morning.",
            spanish: "Nos reuniremos con el equipo mañana por la mañana.",
            pronunciationHint: "ui ar míting de tím tumórou mórning",
          },
          {
            english: "She is flying to Chicago next Thursday.",
            spanish: "Ella vuela a Chicago el próximo jueves.",
            pronunciationHint: "shi is fláying tu Chikágo nekst zúrsdei",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Me reuniré con el equipo mañana",
          targetTokens: ["I", "am", "meeting", "the", "team", "tomorrow"],
          distractorTokens: ["meet"],
          successTipSpanish: "¡Superlativo! Usaste el presente continuo para una cita agendada.",
          mistakeHintSpanish: "Pon 'I am meeting', luego 'the team' y al final 'tomorrow'.",
        },
        voicePractice: {
          sentenceEnglish: "I am meeting the team tomorrow.",
          spanishMeaning: "Me reuniré con el equipo mañana.",
          pronunciationHint: "ai am míting de tím tumórou",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Coordina calendarios profesionales escribiendo 'I am attending the conference on Friday'.",
        },
      },
    },

    // BASE 10: LA TRÍADA DEL FUTURO (Contraste Definitivo)
    {
      title: "La Tríada del Futuro: Will vs Going To vs Continuous",
      focus: "El mapa mental para elegir el futuro correcto en 1 segundo",
      payload: {
        ruleTaglineSpanish:
          "La regla definitiva: ¿Decisión instantánea? Usa 'will'. ¿Plan personal previo? Usa 'going to'. ¿Cita confirmada con fecha y hora en el calendario? Usa Presente Continuo.",
        formulaSegments: [
          { label: "INSTANTE / PROMESA", token: "I will call you", tone: "violet" },
          { label: "PLAN PREVIO", token: "I am going to study tonight", tone: "emerald" },
          { label: "CITA EN AGENDA", token: "I am seeing the doctor at 4", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I will travel to Madrid next week (cuando ya compraste los boletos).",
          wrongToken: "will travel",
          correct: "I am going to travel to Madrid next week.",
          correctToken: "am going to travel",
          whySpanish: "Si ya planeaste el viaje y compraste pasajes, usa 'going to' o 'I am traveling'.",
        },
        examples: [
          {
            english: "I think it will be a productive day.",
            spanish: "Creo que será un día productivo.",
            pronunciationHint: "ai zink it uíl bi a prodáktiv déi",
          },
          {
            english: "What are you going to do this weekend?",
            spanish: "¿Qué vas a hacer este fin de semana?",
            pronunciationHint: "uát ar yu góing tu du dis uíkend?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Qué vas a hacer este fin de semana?",
          targetTokens: ["What", "are", "you", "going", "to", "do", "this", "weekend?"],
          distractorTokens: ["will"],
          successTipSpanish: "¡Magistral! Preguntaste por los planes de alguien usando 'going to'.",
          mistakeHintSpanish: "Abre con 'What are you going to do', y cierra con 'this weekend?'.",
        },
        voicePractice: {
          sentenceEnglish: "What are you going to do tomorrow?",
          spanishMeaning: "¿Qué vas a hacer mañana?",
          pronunciationHint: "uát ar yu góing tu du tumórou?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a la clásica pregunta 'Where do you see yourself in 3 years?' con precisión futura.",
        },
      },
    },

    // BASE 11: SEÑALES TEMPORALES DE FUTURO (Tomorrow, Soon, In two days)
    {
      title: "Señales Temporales de Futuro: Marcadores de Tiempo Precisos",
      focus: "Uso de 'in two weeks', 'next Friday' y 'soon' sin errores de preposición",
      payload: {
        ruleTaglineSpanish:
          "Para decir 'dentro de dos días' en inglés se dice 'in two days' (no 'inside two days'). Y con 'next' nunca pongas 'the': di 'next week', no 'the next week'.",
        formulaSegments: [
          { label: "DENTRO DE X TIEMPO", token: "in two days · in five minutes", tone: "violet" },
          { label: "EL PRÓXIMO", token: "next week · next month · next year", tone: "emerald" },
          { label: "MUY PRONTO", token: "soon · later today · tonight", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I see you the next Monday.",
          wrongToken: "the next Monday",
          correct: "I will see you next Monday.",
          correctToken: "next Monday",
          whySpanish: "Delante de 'next Monday' o 'next week' nunca se coloca 'the'.",
        },
        examples: [
          {
            english: "The project will be ready in two weeks.",
            spanish: "El proyecto estará listo dentro de dos semanas.",
            pronunciationHint: "de próyekt uíl bi rédi in tu uíks",
          },
          {
            english: "We will discuss this again next week.",
            spanish: "Discutiremos esto de nuevo la próxima semana.",
            pronunciationHint: "ui uíl diskás dis aguén nekst uík",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El reporte estará listo en dos días",
          targetTokens: ["The", "report", "will", "be", "ready", "in", "two", "days"],
          distractorTokens: ["the next", "inside"],
          successTipSpanish: "¡Exacto! Usaste 'in two days' para indicar el plazo temporal.",
          mistakeHintSpanish: "Usa 'in two days' para decir 'dentro de dos días'.",
        },
        voicePractice: {
          sentenceEnglish: "Everything will be ready in two days.",
          spanishMeaning: "Todo estará listo dentro de dos días.",
          pronunciationHint: "évrizing uíl bi rédi in tu déis",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Establece plazos y fechas límite claras en correos usando 'in three business days'.",
        },
      },
    },
  ];
}

