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
        formulaCases: [
          {
            label: "01 · Plan o intención ya decidida",
            segments: [
              { label: "SUJETO + TO BE", token: "I am · She is · We are", tone: "violet" },
              { label: "INTENCIÓN PREVIA", token: "going to", tone: "emerald" },
              { label: "VERBO BASE", token: "start · learn · visit", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando ya decidiste algo antes de hablar y tienes un plan en la cabeza, usas 'am / is / are going to' más el verbo base. Se distingue de 'will', que es la decisión tomada en el mismo segundo.",
            exampleEnglish: "She is going to visit her family on Sunday.",
          },
          {
            label: "02 · Negativo: no hay plan",
            segments: [
              { label: "TO BE + NOT", token: "am not · isn't · aren't", tone: "violet" },
              { label: "SIN INTENCIÓN", token: "not going to", tone: "emerald" },
              { label: "VERBO BASE", token: "cancel · buy · travel", tone: "sky" },
            ],
            explanationSpanish:
              "Para negar un plan pones 'not' después del verbo To Be: 'isn't going to', nunca 'don't going to'. La negación vive en el To Be, así que el resto de la frase no cambia.",
            exampleEnglish: "We are not going to buy that car.",
          },
          {
            label: "03 · Pregunta por el plan",
            segments: [
              { label: "PREGUNTA + TO BE", token: "Are you · Is she · What are", tone: "violet" },
              { label: "INTENCIÓN", token: "going to", tone: "emerald" },
              { label: "VERBO BASE", token: "study · work · do", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando preguntas por lo que alguien planeó, mueves el verbo To Be al inicio y no usas 'do': 'Are you going to study?'. Con 'will' preguntarías un caso distinto, sin plan previo.",
            exampleEnglish: "Are you going to study tonight?",
          },
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
        formulaCases: [
          {
            label: "01 · Decisión instantánea",
            segments: [
              { label: "DECISIÓN AL MOMENTO", token: "will ('ll)", tone: "violet" },
              { label: "ACCIÓN INMEDIATA", token: "answer · check · open", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el teléfono suena o alguien pide algo y decides en ese mismo segundo, usas 'will' más el verbo base. No hubo plan antes: por eso no usas 'going to', que anuncia una intención previa.",
            exampleEnglish: "I will answer the phone now.",
          },
          {
            label: "02 · Promesa u oferta",
            segments: [
              { label: "PROMESA", token: "I will · we will", tone: "violet" },
              { label: "COMPROMISO", token: "send it · call you · be there", tone: "emerald" },
              { label: "SEÑAL", token: "don't worry / I promise", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando prometes algo o te ofreces a ayudar, usas 'will' y el verbo base sin 'to'. La señal es que hablas de un compromiso tuyo frente a otra persona, no de un plan que ya existía.",
            exampleEnglish: "I will send the file after lunch.",
          },
          {
            label: "03 · Negativo: won't",
            segments: [
              { label: "WILL + NOT", token: "won't", tone: "violet" },
              { label: "VERBO BASE", token: "be late · forget · cancel", tone: "emerald" },
            ],
            explanationSpanish:
              "Para negar algo futuro con 'will' usas 'won't', la contracción de 'will not', con el verbo base. No digas 'don't will' ni 'won't to'; el verbo siempre queda limpio.",
            exampleEnglish: "She won't be late to the meeting.",
          },
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
        formulaCases: [
          {
            label: "01 · Cita fija con hora o fecha",
            segments: [
              { label: "ACCIÓN AGENDADA", token: "meeting · flying · attending", tone: "violet" },
              { label: "HORA / FECHA", token: "at 4 PM / next Friday", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la cita ya tiene hora o fecha en el calendario, usas el presente continuo: 'I am meeting... at 4 PM'. La señal es que la hora está fija, por eso no 'will', que sonaría a decisión del momento.",
            exampleEnglish: "I am seeing the doctor at four.",
          },
          {
            label: "02 · Arreglo ya acordado",
            segments: [
              { label: "ACUERDO PREVIO", token: "are meeting · is having lunch", tone: "violet" },
              { label: "CON QUIÉN / DÓNDE", token: "with the client · in Madrid", tone: "emerald" },
              { label: "MOMENTO", token: "tomorrow / on Monday", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando dos personas ya acordaron verse, el presente continuo muestra que el arreglo está hecho, no solo deseado. La señal es que hay otra persona involucrada; con 'going to' hablarías solo de tu intención.",
            exampleEnglish: "We are having lunch with the client.",
          },
        ],
        commonMistake: {
          wrong: "I will meet the doctor tomorrow at four.",
          wrongToken: "will meet",
          correct: "I am meeting the doctor tomorrow at four.",
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
        formulaCases: [
          {
            label: "01 · Decisión del momento: will",
            segments: [
              { label: "SIN PLAN PREVIO", token: "will ('ll)", tone: "violet" },
              { label: "ACCIÓN", token: "call back · check · help", tone: "emerald" },
            ],
            explanationSpanish:
              "Elige 'will' cuando decides al hablar: el teléfono suena, alguien te pide algo y respondes en ese instante. Si ya lo habías pensado antes, esa misma frase pide 'going to'.",
            exampleEnglish: "I will call you back in a minute.",
          },
          {
            label: "02 · Plan previo: going to",
            segments: [
              { label: "TO BE + GOING TO", token: "am · is · are going to", tone: "violet" },
              { label: "INTENCIÓN PENSADA", token: "move · study · sell", tone: "emerald" },
            ],
            explanationSpanish:
              "Elige 'going to' cuando la idea ya estaba en tu cabeza antes de hablar, aunque no haya fecha ni cita. La señal es 'lo pensé'; si además hay hora y otra persona, pasa al presente continuo.",
            exampleEnglish: "We are going to move the office next year.",
          },
          {
            label: "03 · Cita en agenda: continuo",
            segments: [
              { label: "TO BE + -ING", token: "am meeting · is flying", tone: "violet" },
              { label: "FECHA Y HORA", token: "at ten / tomorrow", tone: "emerald" },
            ],
            explanationSpanish:
              "Elige el presente continuo cuando la cita ya está en el calendario con hora, lugar o personas confirmadas. Es el futuro más concreto de los tres: no hay duda ni intención suelta, hay compromiso agendado.",
            exampleEnglish: "I am meeting Anna at ten tomorrow.",
          },
        ],
        commonMistake: {
          wrong: "I will travel to Madrid next week.",
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
        formulaCases: [
          {
            label: "01 · Plazo con in",
            segments: [
              { label: "IN + PERÍODO", token: "in two days · in a week", tone: "violet" },
              { label: "CUÁNTO FALTA", token: "desde ahora", tone: "emerald" },
            ],
            explanationSpanish:
              "Usas 'in' más un período para decir cuánto falta desde hoy: 'in two days' es dentro de dos días. No digas 'inside', que significa adentro de un lugar. Contrasta con 'next', que ubica el día en el calendario.",
            exampleEnglish: "The report will be ready in three days.",
          },
          {
            label: "02 · Próximo con next",
            segments: [
              { label: "NEXT + PERÍODO", token: "next week · next Monday", tone: "emerald" },
              { label: "SIN ARTÍCULO", token: "nunca 'the next week'", tone: "sky" },
            ],
            explanationSpanish:
              "Usas 'next' más el período para ubicar el siguiente del calendario: 'next Friday' es el viernes que viene. Nunca le pongas 'the' delante; 'the next week' cuenta semanas, no nombra la próxima.",
            exampleEnglish: "We will review the budget next Friday.",
          },
          {
            label: "03 · Pronto: soon, later, tonight",
            segments: [
              { label: "SIN FECHA EXACTA", token: "soon · later · tonight", tone: "sky" },
              { label: "CERCANÍA", token: "esta noche / en un rato", tone: "violet" },
            ],
            explanationSpanish:
              "Cuando no hay fecha exacta, solo cercanía, usas 'soon', 'later' o 'tonight' y van al final de la frase. La señal es que no puedes contar días ni nombrar un día: con 'in' o 'next' sí lo harías.",
            exampleEnglish: "I will send the details later today.",
          },
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

