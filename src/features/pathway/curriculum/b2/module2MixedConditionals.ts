import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2MixedConditionals(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: CONDICIONAL MIXTO (PASADO A PRESENTE)
    {
      title: "Condicional Mixto Tipo 1: Decisión Pasada, Realidad Presente",
      focus: "Conectar una causa pasada con una consecuencia que vives hoy (If I had accepted, I would live...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando una decisión o suceso del pasado determina tu realidad actual en este momento, mezcla los tiempos: usa Past Perfect en la condición ('If I had taken...') y 'would + forma base' en el resultado ('I would be... now'). No pongas 'would have' porque el resultado no es pasado, es tu presente.",
        formulaSegments: [
          { label: "CONDICIÓN PASADA (IRREAL)", token: "If I had accepted that offer,", tone: "violet" },
          { label: "RESULTADO PRESENTE (HOY)", token: "I would live in Montreal now.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Decisión propia que pesa hoy",
            segments: [
              { label: "CONDICIÓN PASADA", token: "If I had studied law", tone: "violet" },
              { label: "RESULTADO PRESENTE", token: "I would be a partner now", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando tu decisión del pasado explica dónde estás hoy, la condición lleva Past Perfect ('I had studied') y el resultado 'would + base'. Si el efecto fuera pasado dirías 'would have studied'; con 'now' en la frase, ese 'would have' ya no sirve.",
            exampleEnglish: "If I had studied law, I would be a partner now.",
          },
          {
            label: "02 · Suceso externo, situación de hoy",
            segments: [
              { label: "HECHO PASADO AJENO", token: "If the flight had left on time", tone: "violet" },
              { label: "SITUACIÓN ACTUAL", token: "we would be in Berlin today", tone: "emerald" },
            ],
            explanationSpanish:
              "También funciona cuando la causa no fue tu decisión sino un hecho externo: un vuelo, una mudanza, un recorte. La forma no cambia, Past Perfect más 'would + base', porque lo que importa es que la consecuencia se vive hoy, no antes.",
            exampleEnglish: "If the flight had left on time, we would be in Berlin.",
          },
        ],
        commonMistake: {
          wrong: "If I had accepted that scholarship, I would have lived in Montreal now.",
          wrongToken: "would have lived",
          correct: "If I had accepted that scholarship, I would live in Montreal now.",
          correctToken: "would live",
          whySpanish: "Si el efecto ocurre hoy ('now'), se usa 'would + base', no 'would have + participio'.",
        },
        examples: [
          {
            english: "If I had accepted that scholarship last year, I would live in Montreal now.",
            spanish: "Si hubiera aceptado esa beca el año pasado, ahora viviría en Montreal.",
            pronunciationHint: "if ai jad aksépted dat skólarship last yier, ai uud liv in montriól náu",
          },
          {
            english: "If we had invested in training earlier, our organization would be much stronger today.",
            spanish: "Si hubiéramos invertido en capacitación antes, nuestra organización sería mucho más sólida hoy.",
            pronunciationHint: "if ui jad invésted in tréining érlier, áuer órganaiséishon uud bi mach strónger tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si hubiera aceptado esa beca, ahora viviría en Montreal",
          targetTokens: ["If", "I", "had", "accepted", "that", "scholarship,", "I", "would", "live", "in", "Montreal", "now"],
          distractorTokens: ["have", "lived", "will", "am"],
          successTipSpanish: "¡Condicional mixto perfecto! Causa en Past Perfect y consecuencia presente en 'would live'.",
          mistakeHintSpanish: "Recuerda: 'If I had accepted..., I would live in Montreal now'.",
        },
        voicePractice: {
          sentenceEnglish: "If we had planned earlier, we would be ready now.",
          spanishMeaning: "Si hubiéramos planificado antes, ahora estaríamos listos.",
          pronunciationHint: "if ui jad pland érlier, ui uud bi rédi náu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Explica decisiones clave de tu trayectoria profesional usando condicionales mixtos.",
        },
      },
    },

    // BASE 8: CONDICIONAL MIXTO (PRESENTE A PASADO) - CHECKPOINT 1 ANCHOR
    {
      title: "Condicional Mixto Tipo 2: Rasgo Permanente, Resultado en Pasado",
      focus: "Explicar cómo una cualidad estable alteró un hecho histórico (If I were more patient, I would have...)",
      payload: {
        ruleTaglineSpanish:
          "Si tu rasgo de personalidad, idioma o estado general es permanente ('If I spoke German / If I were calmer'), pero el resultado ocurrió ayer o el mes pasado, usa pasado simple en la condición y 'would have + participio' en el resultado.",
        formulaSegments: [
          { label: "ESTADO PERMANENTE", token: "If I were more patient,", tone: "violet" },
          { label: "RESULTADO EN PASADO", token: "I would have handled that situation better.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Rasgo de carácter, hecho de ayer",
            segments: [
              { label: "RASGO PERMANENTE", token: "If I were more organised", tone: "violet" },
              { label: "RESULTADO PASADO", token: "I would have finished on Friday", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hablas de cómo eres, no de un momento concreto, la condición va en pasado ('If I were more organised') y el resultado en 'would have + participio'. Ese contraste es la señal: rasgo de siempre, consecuencia de ayer.",
            exampleEnglish: "If I were less stubborn, I would have accepted the offer.",
          },
          {
            label: "02 · Habilidad o idioma, resultado perdido",
            segments: [
              { label: "HABILIDAD ESTABLE", token: "If she spoke German", tone: "violet" },
              { label: "RESULTADO PERDIDO", token: "she would have led the meeting", tone: "emerald" },
            ],
            explanationSpanish:
              "Un idioma o una habilidad que no tienes es un estado estable, así que la condición va en pasado simple, no en 'would'. Si pusieras 'If she would speak German', rompes la regla; el 'would' pertenece solo al resultado pasado.",
            exampleEnglish: "If he spoke German, he would have won that account.",
          },
        ],
        commonMistake: {
          wrong: "If I would be more patient, I wouldn't have reacted that way.",
          wrongToken: "If I would be",
          correct: "If I were more patient, I wouldn't have reacted that way.",
          correctToken: "If I were",
          whySpanish: "Jamás uses 'would' dentro de la cláusula de 'if'; usa el pasado subjuntivo 'were'.",
        },
        examples: [
          {
            english: "If I were not so hesitant, I would have spoken at yesterday's conference.",
            spanish: "Si no fuera tan indeciso, habría hablado en la conferencia de ayer.",
            pronunciationHint: "if ai uér not sou jézitent, ai uud jav spóuken at iéstardeis kónferens",
          },
          {
            english: "If she spoke fluent French, she would have applied for the Geneva position.",
            spanish: "Si hablara francés fluido, habría postulado a la posición en Ginebra.",
            pronunciationHint: "if shi spóuk flúent french, shi uud jav apláid for de yeníva pozíshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si no fuera tan indeciso, habría hablado ayer",
          targetTokens: ["If", "I", "were", "not", "so", "hesitant,", "I", "would", "have", "spoken", "yesterday"],
          distractorTokens: ["was", "had", "speak", "spoke"],
          successTipSpanish: "¡Genial! 'If I were not so hesitant' combinado con 'would have spoken'.",
          mistakeHintSpanish: "Usa 'were' para la condición permanente y 'would have spoken' para ayer.",
        },
        voicePractice: {
          sentenceEnglish: "If I were more fluent, I would have led the discussion yesterday.",
          spanishMeaning: "Si tuviera más fluidez, habría liderado la discusión de ayer.",
          pronunciationHint: "if ai uér mor flúent, ai uud jav led de diskáshon iéstardei",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos reflexivos combinando rasgos estables con consecuencias históricas.",
        },
      },
    },

    // BASE 9: SUPOSICIONES FORMALES Y CONDICIONES ALTERNATIVAS
    {
      title: "Condicionales de Negociación: Provided that / As long as",
      focus: "Acuerdos formales y estipulaciones sin abusar de 'if' (provided that, on condition that)",
      payload: {
        ruleTaglineSpanish:
          "En contratos, acuerdos de equipo y discusiones profesionales, reemplaza 'if' por conectores precisos: 'provided that' (siempre y cuando), 'as long as' (mientras que) o 'supposing' (en el supuesto de que).",
        formulaSegments: [
          { label: "COMPROMISO PRINCIPAL", token: "We will support the proposal", tone: "violet" },
          { label: "CONECTOR FORMAL", token: "provided that / on condition that", tone: "emerald" },
          { label: "ESTIPULACIÓN", token: "the budget remains balanced", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Exigencia formal escrita",
            segments: [
              { label: "COMPROMISO", token: "We will sign the contract", tone: "violet" },
              { label: "EXIGENCIA FORMAL", token: "provided that / on condition that", tone: "emerald" },
              { label: "CONDICIÓN", token: "payment arrives by Friday", tone: "sky" },
            ],
            explanationSpanish:
              "En contratos y actas, 'provided that' u 'on condition that' marcan una exigencia que no se negocia. Usa 'if' y el acuerdo suena informal; usa estos conectores y queda claro que el compromiso depende de un requisito escrito.",
            exampleEnglish: "We will sign the contract provided that payment arrives by Friday.",
          },
          {
            label: "02 · Permiso que dura mientras se cumpla",
            segments: [
              { label: "PERMISO", token: "You can work remotely", tone: "violet" },
              { label: "LÍMITE CONTINUO", token: "as long as", tone: "emerald" },
              { label: "CONDICIÓN ABIERTA", token: "you answer messages daily", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando das permiso y la condición debe mantenerse en el tiempo, 'as long as' comunica ese control continuo mejor que 'provided that', que suena a cláusula única. El límite no se cumple una vez: se sostiene mientras dure el permiso.",
            exampleEnglish: "You can work remotely as long as you answer messages daily.",
          },
        ],
        commonMistake: {
          wrong: "We will accept always and when you deliver on time",
          wrongToken: "always and when",
          correct: "We will accept provided that you deliver on time.",
          correctToken: "provided that",
          whySpanish: "'Always and when' no existe en inglés; la traducción formal de 'siempre y cuando' es 'provided that'.",
        },
        examples: [
          {
            english: "We will approve the initiative provided that the budget remains balanced.",
            spanish: "Aprobaremos la iniciativa siempre y cuando el presupuesto se mantenga equilibrado.",
            pronunciationHint: "ui uil aprúv di iníshietiv prováided dat de bádyet riméins bálanst",
          },
          {
            english: "You can lead the project as long as you provide clear weekly milestones.",
            spanish: "Puedes liderar el proyecto siempre y cuando presentes hitos semanales claros.",
            pronunciationHint: "yu kan lid de próyekt as long as yu prováid klíer uíkli máilstouns",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Aprobaremos el plan siempre y cuando el presupuesto se mantenga estable",
          targetTokens: ["We", "will", "approve", "the", "plan", "provided", "that", "the", "budget", "remains", "stable"],
          distractorTokens: ["if", "always", "and", "when"],
          successTipSpanish: "¡Elegancia total! 'provided that' eleva el acuerdo al estándar formal.",
          mistakeHintSpanish: "Utiliza 'provided that' para traducir 'siempre y cuando'.",
        },
        voicePractice: {
          sentenceEnglish: "We will endorse the plan provided that timelines are respected.",
          spanishMeaning: "Respaldaremos el plan siempre y cuando se respeten los plazos.",
          pronunciationHint: "ui uil endórs de plan prováided dat táimláins ar rispékted",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza términos y condiciones y acuerdos de gobernanza redactados con 'provided that'.",
        },
      },
    },

    // BASE 10: INVERSIÓN CONDICIONAL DIPLOMÁTICA
    {
      title: "Inversión Condicional Diplomática: Should you need / Had I known",
      focus: "Eliminar 'if' para alcanzar el registro diplomático más alto (Should you require assistance...)",
      payload: {
        ruleTaglineSpanish:
          "Puedes omitir la palabra 'if' completamente invirtiendo el auxiliar al inicio: en futuro/cortesía usa 'Should you need...' (en vez de 'If you need'), y en pasado usa 'Had we known...' (en vez de 'If we had known'). Suena extremadamente refinado y profesional.",
        formulaSegments: [
          { label: "INVERSIÓN CONDICIONAL", token: "Should you require / Had we known", tone: "violet" },
          { label: "SUJETO + VERBO BASE", token: "further information / about the changes", tone: "emerald" },
          { label: "CLÁUSULA DE ACCIÓN", token: "please let us know / we would have adapted", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Oferta de ayuda, registro diplomático",
            segments: [
              { label: "INVERSIÓN CORTÉS", token: "Should you need", tone: "violet" },
              { label: "MOTIVO", token: "any additional details", tone: "emerald" },
              { label: "ACCIÓN ABIERTA", token: "please contact my office", tone: "sky" },
            ],
            explanationSpanish:
              "En cartas y correos formales, 'Should you need' sustituye a 'If you need' y elimina 'if'. La señal es la posición: el auxiliar abre la frase. Si escribes 'If should you need', duplicas la marca y el registro se rompe.",
            exampleEnglish: "Should you need more details, please contact my office.",
          },
          {
            label: "02 · Lamento pasado con inversión",
            segments: [
              { label: "INVERSIÓN PASADA", token: "Had we known", tone: "violet" },
              { label: "ACLARACIÓN", token: "about the new deadline", tone: "emerald" },
              { label: "RESULTADO IRREAL", token: "we would have planned differently", tone: "sky" },
            ],
            explanationSpanish:
              "Para lamentar un pasado, inviertes 'had' y el resultado lleva 'would have + participio'. Se usa en informes y negociaciones donde 'if we had known' resultaría demasiado coloquial; la inversión marca distancia y responsabilidad compartida.",
            exampleEnglish: "Had we known the risks, we would have postponed the launch.",
          },
        ],
        commonMistake: {
          wrong: "If should you need any help, contact us.",
          wrongToken: "If should you",
          correct: "Should you need any assistance, please contact us.",
          correctToken: "Should you need",
          whySpanish: "Cuando usas la inversión con 'Should', la palabra 'if' se elimina por completo.",
        },
        examples: [
          {
            english: "Should you need any further clarification, please do not hesitate to contact me.",
            spanish: "Si llega a necesitar alguna aclaración adicional, por favor no dude en comunicarse conmigo.",
            pronunciationHint: "shud yu nid éni férder klárifikéishon, plis du not jézitéit tu kántakt mi",
          },
          {
            english: "Had we known about the revised timeline, we would have adjusted our schedule.",
            spanish: "Si hubiéramos sabido sobre el cronograma modificado, habríamos ajustado nuestro horario.",
            pronunciationHint: "jad ui nóun abáut de riváizd táimlain, ui uud jav adyásted áuer skédyul",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si necesita alguna aclaración, no dude en comunicarse conmigo",
          targetTokens: ["Should", "you", "need", "any", "clarification,", "please", "do", "not", "hesitate", "to", "reach", "out"],
          distractorTokens: ["If", "would", "needing", "contacted"],
          successTipSpanish: "¡Diplomacia pura! 'Should you need...' prescinde de 'if' con máxima cortesía.",
          mistakeHintSpanish: "Inicia directamente con 'Should you need any clarification...'.",
        },
        voicePractice: {
          sentenceEnglish: "Should you have questions, please feel free to ask.",
          spanishMeaning: "Si llegara a tener preguntas, por favor siéntase en libertad de consultar.",
          pronunciationHint: "shud yu jav kuéstions, plis fil fri tu ask",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula ofertas de ayuda diplomáticas y respuestas respetuosas en simulaciones de entrevistas.",
        },
      },
    },

    // BASE 11: DESEOS Y LAMENTOS AVANZADOS
    {
      title: "Deseos y Lamentos Complejos: I wish / If only + had done vs would do",
      focus: "Diferenciar arrepentimiento de hechos pasados vs quejas de comportamientos ajenos",
      payload: {
        ruleTaglineSpanish:
          "Para un lamento sobre un hecho pasado que ya no puedes cambiar, usa 'I wish / If only + had done': 'I wish we had consulted an expert'. Pero si te quejas de un hábito molesto de otra persona en el presente, usa 'would': 'I wish you would listen'. Jamás uses 'would' para hablar de ti mismo.",
        formulaSegments: [
          { label: "LAMENTO PASADO", token: "If only we had consulted", tone: "violet" },
          { label: "OBJETO DEL LAMENTO", token: "a specialist before deciding", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Lamento propio por un hecho pasado",
            segments: [
              { label: "SEÑAL DE LAMENTO", token: "I wish / If only", tone: "violet" },
              { label: "HECHO IRREVERSIBLE", token: "we had asked first", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el arrepentimiento es tuyo y el hecho ya no se puede cambiar, usas Past Perfect después de 'I wish' o 'If only'. Si dices 'I wish I would have asked', suena a error oral; el 'would' nunca describe tu propio pasado.",
            exampleEnglish: "I wish we had asked for feedback before launching.",
          },
          {
            label: "02 · Queja sobre un hábito ajeno",
            segments: [
              { label: "QUEJA PRESENTE", token: "I wish you would", tone: "violet" },
              { label: "HÁBITO MOLESTO", token: "reply to my emails", tone: "emerald" },
            ],
            explanationSpanish:
              "Para pedir un cambio de comportamiento a otra persona, 'wish + would' es la fórmula: habla de un hábito presente que te molesta, no de un hecho pasado. La señal es el sujeto distinto: 'I wish you would', nunca 'I wish I would'.",
            exampleEnglish: "I wish he would listen during team meetings.",
          },
        ],
        commonMistake: {
          wrong: "I wish I would have studied more",
          wrongToken: "I would have studied",
          correct: "I wish I had studied more.",
          correctToken: "I had studied",
          whySpanish: "Para arrepentimientos propios sobre el pasado, la norma culta exige Past Perfect ('had studied').",
        },
        examples: [
          {
            english: "If only we had consulted a specialist before making that critical decision.",
            spanish: "Ojalá hubiéramos consultado a un especialista antes de tomar esa decisión crítica.",
            pronunciationHint: "if óunli ui jad konsólted a spéshalist bifór méiking dat krítikal desíshon",
          },
          {
            english: "I wish our collaborators would communicate more openly during project updates.",
            spanish: "Ojalá nuestros colaboradores se comunicaran con mayor apertura durante las actualizaciones.",
            pronunciationHint: "ai uísh áuer koláboreitors uud komiúnikéit mor óupenli diúring próyekt apdéits",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ojalá hubiéramos consultado a un especialista antes de decidir",
          targetTokens: ["If", "only", "we", "had", "consulted", "a", "specialist", "before", "deciding"],
          distractorTokens: ["would", "have", "consult", "decided"],
          successTipSpanish: "¡Arrepentimiento pasado perfecto! 'If only we had consulted...'.",
          mistakeHintSpanish: "Usa Past Perfect ('had consulted') para lamentos sobre decisiones pasadas.",
        },
        voicePractice: {
          sentenceEnglish: "If only we had reviewed the guidelines more thoroughly.",
          spanishMeaning: "Ojalá hubiéramos revisado las pautas con mayor detenimiento.",
          pronunciationHint: "if óunli ui jad riviúd de gáidláins mor zórouli",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos de autocrítica constructiva y lecciones aprendidas en Writing Studio.",
        },
      },
    },
  ];
}

