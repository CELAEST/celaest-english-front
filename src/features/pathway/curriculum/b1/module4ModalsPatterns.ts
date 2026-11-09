import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4ModalsPatterns(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: DEDUCCIÓN LÓGICA (Must be, Can't be, Might be)
    {
      title: "Deducción Lógica: Must be, Can't be y Might be",
      focus: "Especular y concluir con base en evidencia real",
      payload: {
        ruleTaglineSpanish:
          "Si la evidencia te da 99% de certeza positiva di 'must be' (Las luces están prendidas, debe estar ahí). Si es 99% imposible di 'can't be' (¡Eso no puede ser verdad!). Si es 50% probable di 'might be'.",
        formulaSegments: [
          { label: "CASI SEGURO (SÍ)", token: "He must be at the office (su auto está afuera)", tone: "violet" },
          { label: "IMPOSIBLE (NO)", token: "That can't be true (es absurdo)", tone: "emerald" },
          { label: "QUIZÁS", token: "She might be in a meeting", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Casi seguro: must be",
            segments: [
              { label: "CONCLUSIÓN POR EVIDENCIA", token: "must be + estado", tone: "violet" },
              { label: "SEÑAL", token: "luces prendidas · auto afuera", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la evidencia apunta a algo casi seguro, usa 'must be': es una conclusión, no una obligación. Contraste: con 'might be' dejas la duda abierta; con 'can't be' afirmas que es imposible.",
            exampleEnglish: "The lights are on, he must be home.",
          },
          {
            label: "02 · Imposible: can't be",
            segments: [
              { label: "CONCLUSIÓN IMPOSIBLE", token: "can't be + estado", tone: "violet" },
              { label: "SEÑAL", token: "contradice los hechos", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando algo no puede ser cierto según la evidencia, usa 'can't be': niega la conclusión, no la acción. Contraste: 'must be' afirma lo probable; 'can't be' descarta lo absurdo; 'might be' solo especula.",
            exampleEnglish: "That can't be the final price.",
          },
          {
            label: "03 · Probable: might be",
            segments: [
              { label: "HIPÓTESIS ABIERTA", token: "might be + estado", tone: "violet" },
              { label: "SIN PRUEBAS FIRMES", token: "cincuenta por ciento", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando tienes una hipótesis sin pruebas firmes, usa 'might be': dejas la puerta abierta. Contraste: 'must be' suena a conclusión casi segura y 'can't be' descarta; 'might be' es la opción prudente.",
            exampleEnglish: "He might be waiting for us.",
          },
        ],
        commonMistake: {
          wrong: "He can't be late.",
          wrongToken: "can't be late",
          correct: "He must be running late.",
          correctToken: "must be",
          whySpanish: "Para una conclusión positiva basada en evidencia, usa 'must be', no 'can'.",
        },
        examples: [
          {
            english: "You have worked all day, you must be exhausted.",
            spanish: "Has trabajado todo el día, debes estar agotado.",
            pronunciationHint: "yu jav uórkt ol déi, yu mast bi egsóstid",
          },
          {
            english: "This can't be the final version, it has errors.",
            spanish: "Esta no puede ser la versión final, tiene errores.",
            pronunciationHint: "dis kant bi de fáinal vérshon, it jas érrors",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Debes estar muy cansado hoy",
          targetTokens: ["You", "must", "be", "very", "tired", "today"],
          distractorTokens: ["can", "have to"],
          successTipSpanish: "¡Deducción perfecta! 'You must be' empatiza lógicamente con la evidencia.",
          mistakeHintSpanish: "Usa 'You must be very tired today' para concluir con base en lo que ves.",
        },
        voicePractice: {
          sentenceEnglish: "You must be very proud of this result.",
          spanishMeaning: "Debes estar muy orgulloso de este resultado.",
          pronunciationHint: "yu mast bi véri práud of dis risólt",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Demuestra pensamiento analítico diciendo 'The root cause must be related to...'.",
        },
      },
    },

    // BASE 18: GERUNDIO OBLIGATORIO (Enjoy, Avoid, Mind + -ing)
    {
      title: "Gerundio Obligatorio: Verbos Seguidos de -ing",
      focus: "Verbos específicos que exigen que la siguiente acción termine en -ing (enjoy, avoid, consider, mind)",
      payload: {
        ruleTaglineSpanish:
          "En español decimos 'disfruto aprender', pero en inglés ciertos verbos NO aceptan 'to': exigen obligatoriamente '-ing': enjoy learning, avoid making mistakes, consider moving, would you mind waiting?.",
        formulaSegments: [
          { label: "VERBO IMÁN -ING", token: "enjoy · avoid · consider · mind · finish", tone: "violet" },
          { label: "ACCIÓN CON -ING", token: "working · learning · reviewing", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Gusto y rechazo: enjoy y avoid",
            segments: [
              { label: "GUSTO O RECHAZO", token: "enjoy · avoid + -ing", tone: "violet" },
              { label: "ACCIÓN EN -ING", token: "working · making · reviewing", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hablas de lo que disfrutas o de lo que quieres evitar, usa 'enjoy' y 'avoid' con '-ing': nunca con 'to'. Contraste: 'enjoy working' suena natural; 'enjoy to work' es el error típico.",
            exampleEnglish: "I avoid checking emails at night.",
          },
          {
            label: "02 · Cortesía y cierre: mind y finish",
            segments: [
              { label: "CORTESÍA O CIERRE", token: "mind · finish + -ing", tone: "violet" },
              { label: "SIN 'TO'", token: "mind waiting · finish reviewing", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando pides un favor con cortesía con 'would you mind' o cierras una acción terminada con 'finish', el verbo siguiente va en '-ing'. Contraste: 'mind waiting' es cortés; 'mind to wait' no existe en inglés.",
            exampleEnglish: "We finished reviewing the budget yesterday.",
          },
        ],
        commonMistake: {
          wrong: "I enjoy to work with this team.",
          wrongToken: "enjoy to work",
          correct: "I enjoy working with this team.",
          correctToken: "enjoy working",
          whySpanish: "Después del verbo 'enjoy' jamás se usa 'to': siempre va con '-ing'.",
        },
        examples: [
          {
            english: "We should avoid making hasty decisions.",
            spanish: "Deberíamos evitar tomar decisiones apresuradas.",
            pronunciationHint: "ui shúd avóid méiking jéisti desíshons",
          },
          {
            english: "Would you mind closing the door, please?",
            spanish: "¿Te importaría cerrar la puerta, por favor?",
            pronunciationHint: "uúd yu máind klóusing de dor, plís?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Disfruto trabajar con este equipo",
          targetTokens: ["I", "enjoy", "working", "with", "this", "team"],
          distractorTokens: ["to work"],
          successTipSpanish: "¡Cero titubeo! 'Enjoy working' es la combinación obligatoria y limpia.",
          mistakeHintSpanish: "Después de 'enjoy', la acción lleva '-ing': 'enjoy working'.",
        },
        voicePractice: {
          sentenceEnglish: "I enjoy solving complex problems.",
          spanishMeaning: "Disfruto resolver problemas complejos.",
          pronunciationHint: "ai enyói sólving kómpleks próblems",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce cómo los perfiles profesionales usan 'I enjoy leading teams' con total naturalidad.",
        },
      },
    },

    // BASE 19: INFINITIVO CON 'TO' (Decide, Plan, Hope, Manage + To)
    {
      title: "Infinitivo con 'To': Decide, Plan, Hope y Manage",
      focus: "Verbos de intención y propósito que exigen 'to + verbo base' después",
      payload: {
        ruleTaglineSpanish:
          "A diferencia de 'enjoy', los verbos que miran hacia adelante (decisiones, planes, esperanzas y logros) exigen siempre el puente 'to': decide to leave, plan to expand, hope to see, manage to finish.",
        formulaSegments: [
          { label: "VERBO DE INTENCIÓN", token: "decide · plan · hope · manage · afford", tone: "violet" },
          { label: "PUENTE TO", token: "to", tone: "emerald" },
          { label: "VERBO BASE", token: "expand · achieve · deliver", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Decisión y plan: decide y plan",
            segments: [
              { label: "DECISIÓN Y PLAN", token: "decide · plan + to", tone: "violet" },
              { label: "PUENTE TO", token: "to expand · to hire", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hablas de una decisión tomada o de un plan hacia adelante, usa 'decide' y 'plan' con 'to'. Contraste: 'decided to expand' es correcto; 'decided expanding' es el error típico de quien traduce del español.",
            exampleEnglish: "They plan to hire two designers.",
          },
          {
            label: "02 · Logro y esperanza: manage y hope",
            segments: [
              { label: "LOGRO Y ESPERANZA", token: "manage · hope + to", tone: "violet" },
              { label: "VERBO BASE LIMPIO", token: "to deliver · to see", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando relatas un logro que costó esfuerzo o una esperanza futura, usa 'manage' y 'hope' con 'to'. Contraste: 'manage to' implica dificultad superada; 'hope to' apunta al futuro y nunca lleva '-ing'.",
            exampleEnglish: "She managed to catch the last train.",
          },
        ],
        commonMistake: {
          wrong: "We decided expanding the project.",
          wrongToken: "decided expanding",
          correct: "We decided to expand the project.",
          correctToken: "decided to expand",
          whySpanish: "Después de 'decide' se usa infinitivo con 'to', nunca gerundio.",
        },
        examples: [
          {
            english: "We managed to achieve all our quarterly targets.",
            spanish: "Logramos alcanzar todas nuestras metas del trimestre.",
            pronunciationHint: "ui mánached tu achív ol áuar kuórterli tárguets",
          },
          {
            english: "She plans to open a new office next year.",
            spanish: "Ella planea abrir una nueva oficina el próximo año.",
            pronunciationHint: "shi plans tu óupen a niú ófis nekst yíar",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Decidimos expandir el plan hoy",
          targetTokens: ["We", "decided", "to", "expand", "the", "plan", "today"],
          distractorTokens: ["expanding"],
          successTipSpanish: "¡Exacto! 'Decided to expand' respeta la regla de intención.",
          mistakeHintSpanish: "Con 'decided', utiliza el puente 'to expand'.",
        },
        voicePractice: {
          sentenceEnglish: "We managed to deliver on time.",
          spanishMeaning: "Logramos entregar a tiempo.",
          pronunciationHint: "ui mánached tu delíver on táim",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Relata logros con 'We managed to reduce costs by 15%' de forma impactante.",
        },
      },
    },

    // BASE 20: VERBOS DE DOBLE SENTIDO (Stop, Remember, Forget)
    {
      title: "Verbos de Doble Sentido: Stop, Remember y Forget",
      focus: "El cambio radical de significado entre usar 'to' o usar '-ing'",
      payload: {
        ruleTaglineSpanish:
          "¡Cuidado con estos verbos! 'I stopped to drink coffee' = hice una pausa en mi camino para tomar café. Pero 'I stopped drinking coffee' = abandoné el hábito de tomar café. El sentido cambia por completo.",
        formulaSegments: [
          { label: "PAUSA PARA HACER", token: "stop to do (hacer una pausa para)", tone: "violet" },
          { label: "ABANDONAR HÁBITO", token: "stop doing (dejar de hacer)", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Pausa para hacer: stop to",
            segments: [
              { label: "PAUSA CON PROPÓSITO", token: "stop to + verbo", tone: "violet" },
              { label: "SEÑAL", token: "interrumpes para hacer otra cosa", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando interrumpes una acción para hacer otra cosa, usa 'stop to': marca una pausa con propósito. Contraste: 'stopped to drink coffee' es la pausa; 'stopped drinking coffee' es abandonar el hábito.",
            exampleEnglish: "We stopped to check the map.",
          },
          {
            label: "02 · Abandonar el hábito: stop + -ing",
            segments: [
              { label: "HÁBITO ABANDONADO", token: "stop + -ing", tone: "violet" },
              { label: "SEÑAL", token: "cambio definitivo", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando dejas un hábito de forma definitiva, usa 'stop' con '-ing': la acción queda abandonada. Contraste: con 'to' sería una pausa momentánea; con '-ing' el cambio se entiende como permanente.",
            exampleEnglish: "She stopped using that old app.",
          },
          {
            label: "03 · Tarea pendiente o recuerdo: remember y forget",
            segments: [
              { label: "TAREA PENDIENTE", token: "remember · forget + to", tone: "violet" },
              { label: "RECUERDO YA VIVIDO", token: "remember + -ing", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando hablas de una tarea pendiente, usa 'remember to' o 'forget to'; cuando hablas de un recuerdo ya vivido, usa '-ing'. Contraste: 'remember to send' es deberlo hacer; 'remember sending' es tenerlo hecho.",
            exampleEnglish: "Don't forget to call the client.",
          },
        ],
        commonMistake: {
          wrong: "I stopped to smoke last year.",
          wrongToken: "stopped to smoke",
          correct: "I stopped smoking last year.",
          correctToken: "stopped smoking",
          whySpanish: "Para decir que dejaste un hábito definitivamente, usa '-ing': 'stopped smoking'.",
        },
        examples: [
          {
            english: "Remember to send the email before five.",
            spanish: "Recuerda enviar el correo antes de las 5 PM.",
            pronunciationHint: "rimémber tu send di iméil bifór fáiv pi em",
          },
          {
            english: "I remember sending the email yesterday.",
            spanish: "Recuerdo haber enviado el correo ayer.",
            pronunciationHint: "ai rimémber sénding di iméil yésterdei",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Dejé de revisar el teléfono de noche",
          targetTokens: ["I", "stopped", "checking", "my", "phone", "at", "night"],
          distractorTokens: ["to check"],
          successTipSpanish: "¡Maestría semántica! 'Stopped checking' significa que eliminaste ese hábito.",
          mistakeHintSpanish: "Para abandonar una costumbre o hábito, usa 'stopped' con '-ing' ('checking').",
        },
        voicePractice: {
          sentenceEnglish: "Remember to lock the door.",
          spanishMeaning: "Recuerda cerrar la puerta con llave.",
          pronunciationHint: "rimémber tu lok de dor",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Evita malentendidos en tus notas recordando la diferencia entre 'stopped to' y 'stopped doing'.",
        },
      },
    },

    // BASE 21: ADJETIVOS CON -ED VS -ING (Bored vs Boring)
    {
      title: "Adjetivos con -ed vs -ing: Bored vs Boring",
      focus: "Sensación personal (-ed) versus característica del objeto (-ing)",
      payload: {
        ruleTaglineSpanish:
          "No pases vergüenzas: si dices 'I am boring' estás diciendo que tú eres una persona aburrida. Si quieres decir que estás aburrido por una situación, di 'I am bored'. '-ed' es lo que sientes; '-ing' es lo que lo causa.",
        formulaSegments: [
          { label: "¿CÓMO TE SIENTES?", token: "I am bored · interested · excited", tone: "violet" },
          { label: "¿CÓMO ES LA COSA?", token: "The movie is boring · interesting · exciting", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Lo que siente la persona: -ed",
            segments: [
              { label: "SENSACIÓN RECIBIDA", token: "bored · interested · excited", tone: "violet" },
              { label: "TERMINACIÓN -ED", token: "la persona lo siente", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando describes cómo se siente una persona, usa '-ed': 'bored', 'interested'. La persona recibe la sensación, no la provoca. Contraste: si dices 'I am boring', afirmas que tú aburres a los demás.",
            exampleEnglish: "The team was excited about the news.",
          },
          {
            label: "02 · Lo que causa la sensación: -ing",
            segments: [
              { label: "ORIGEN DEL EFECTO", token: "boring · interesting · exciting", tone: "violet" },
              { label: "TERMINACIÓN -ING", token: "la cosa lo provoca", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando describes la cosa que provoca la sensación (una reunión, un libro), usa '-ing': 'boring', 'interesting'. Contraste: '-ed' describe a quien lo siente; '-ing' describe el origen del efecto.",
            exampleEnglish: "That documentary was really confusing.",
          },
        ],
        commonMistake: {
          wrong: "I am very boring in this meeting.",
          wrongToken: "I am very boring",
          correct: "I am very bored in this meeting.",
          correctToken: "I am very bored",
          whySpanish: "Tú sientes el aburrimiento ('bored'); la reunión es la que aburre ('boring').",
        },
        examples: [
          {
            english: "I am very interested in this new opportunity.",
            spanish: "Estoy muy interesado en esta nueva oportunidad.",
            pronunciationHint: "ai am véri íntrestid in dis niú oportúniti",
          },
          {
            english: "The presentation was truly inspiring.",
            spanish: "La presentación fue verdaderamente inspiradora.",
            pronunciationHint: "de presantéishon uás trúli inspáiring",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estoy muy interesado en este proyecto",
          targetTokens: ["I", "am", "very", "interested", "in", "this", "project"],
          distractorTokens: ["interesting"],
          successTipSpanish: "¡Exacto! Usaste 'interested' para describir tu estado de ánimo personal.",
          mistakeHintSpanish: "Para lo que tú sientes, usa la terminación '-ed': 'interested'.",
        },
        voicePractice: {
          sentenceEnglish: "I am very interested in this role.",
          spanishMeaning: "Estoy muy interesado en este rol.",
          pronunciationHint: "ai am véri íntrestid in dis róul",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Comunica entusiasmo en entrevistas diciendo 'I was fascinated by your latest initiative'.",
        },
      },
    },
  ];
}

