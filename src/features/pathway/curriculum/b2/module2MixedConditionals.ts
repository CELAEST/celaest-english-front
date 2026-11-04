import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2MixedConditionals(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: CONDICIONAL MIXTO (PASADO A PRESENTE)
    {
      title: "Condicional Mixto Tipo 1: DecisiÃ³n Pasada, Realidad Presente",
      focus: "Conectar una causa pasada con una consecuencia que vives hoy (If I had accepted, I would live...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando una decisiÃ³n o suceso del pasado determina tu realidad actual en este momento, mezcla los tiempos: usa Past Perfect en la condiciÃ³n ('If I had taken...') y 'would + forma base' en el resultado ('I would be... now'). No pongas 'would have' porque el resultado no es pasado, es tu presente.",
        formulaSegments: [
          { label: "CONDICIÃ“N PASADA (IRREAL)", token: "If I had accepted that offer,", tone: "violet" },
          { label: "RESULTADO PRESENTE (HOY)", token: "I would live in Montreal now.", tone: "emerald" },
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
            spanish: "Si hubiera aceptado esa beca el aÃ±o pasado, ahora vivirÃ­a en Montreal.",
            pronunciationHint: "if ai jad aksÃ©pted dat skÃ³larship last yier, ai uud liv in montriÃ³l nÃ¡u",
          },
          {
            english: "If we had invested in training earlier, our organization would be much stronger today.",
            spanish: "Si hubiÃ©ramos invertido en capacitaciÃ³n antes, nuestra organizaciÃ³n serÃ­a mucho mÃ¡s sÃ³lida hoy.",
            pronunciationHint: "if ui jad invÃ©sted in trÃ©ining Ã©rlier, Ã¡uer Ã³rganaisÃ©ishon uud bi mach strÃ³nger tudÃ©i",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Si hubiera aceptado esa beca, ahora vivirÃ­a en Montreal",
          targetTokens: ["If", "I", "had", "accepted", "that", "scholarship,", "I", "would", "live", "in", "Montreal", "now"],
          distractorTokens: ["have", "lived", "will", "am"],
          successTipSpanish: "Â¡Condicional mixto perfecto! Causa en Past Perfect y consecuencia presente en 'would live'.",
          mistakeHintSpanish: "Recuerda: 'If I had accepted..., I would live in Montreal now'.",
        },
        voicePractice: {
          sentenceEnglish: "If we had planned earlier, we would be ready now.",
          spanishMeaning: "Si hubiÃ©ramos planificado antes, ahora estarÃ­amos listos.",
          pronunciationHint: "if ui jad pland Ã©rlier, ui uud bi rÃ©di nÃ¡u",
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
      focus: "Explicar cÃ³mo una cualidad estable alterÃ³ un hecho histÃ³rico (If I were more patient, I would have...)",
      payload: {
        ruleTaglineSpanish:
          "Si tu rasgo de personalidad, idioma o estado general es permanente ('If I spoke German / If I were calmer'), pero el resultado ocurriÃ³ ayer o el mes pasado, usa pasado simple en la condiciÃ³n y 'would have + participio' en el resultado.",
        formulaSegments: [
          { label: "ESTADO PERMANENTE", token: "If I were more patient,", tone: "violet" },
          { label: "RESULTADO EN PASADO", token: "I would have handled that situation better.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If I would be more patient, I wouldn't have reacted that way.",
          wrongToken: "If I would be",
          correct: "If I were more patient, I wouldn't have reacted that way.",
          correctToken: "If I were",
          whySpanish: "JamÃ¡s uses 'would' dentro de la clÃ¡usula de 'if'; usa el pasado subjuntivo 'were'.",
        },
        examples: [
          {
            english: "If I were not so hesitant, I would have spoken at yesterday's conference.",
            spanish: "Si no fuera tan indeciso, habrÃ­a hablado en la conferencia de ayer.",
            pronunciationHint: "if ai uÃ©r not sou jÃ©zitent, ai uud jav spÃ³uken at iÃ©stardeis kÃ³nferens",
          },
          {
            english: "If she spoke fluent French, she would have applied for the Geneva position.",
            spanish: "Si hablara francÃ©s fluido, habrÃ­a postulado a la posiciÃ³n en Ginebra.",
            pronunciationHint: "if shi spÃ³uk flÃºent french, shi uud jav aplÃ¡id for de yenÃ­va pozÃ­shon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Si no fuera tan indeciso, habrÃ­a hablado ayer",
          targetTokens: ["If", "I", "were", "not", "so", "hesitant,", "I", "would", "have", "spoken", "yesterday"],
          distractorTokens: ["was", "had", "speak", "spoke"],
          successTipSpanish: "Â¡Genial! 'If I were not so hesitant' combinado con 'would have spoken'.",
          mistakeHintSpanish: "Usa 'were' para la condiciÃ³n permanente y 'would have spoken' para ayer.",
        },
        voicePractice: {
          sentenceEnglish: "If I were more fluent, I would have led the discussion yesterday.",
          spanishMeaning: "Si tuviera mÃ¡s fluidez, habrÃ­a liderado la discusiÃ³n de ayer.",
          pronunciationHint: "if ai uÃ©r mor flÃºent, ai uud jav led de diskÃ¡shon iÃ©stardei",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos reflexivos combinando rasgos estables con consecuencias histÃ³ricas.",
        },
      },
    },

    // BASE 9: SUPOSICIONES FORMALES Y CONDICIONES ALTERNATIVAS
    {
      title: "Condicionales de NegociaciÃ³n: Provided that / As long as",
      focus: "Acuerdos formales y estipulaciones sin abusar de 'if' (provided that, on condition that)",
      payload: {
        ruleTaglineSpanish:
          "En contratos, acuerdos de equipo y discusiones profesionales, reemplaza 'if' por conectores precisos: 'provided that' (siempre y cuando), 'as long as' (mientras que) o 'supposing' (en el supuesto de que).",
        formulaSegments: [
          { label: "COMPROMISO PRINCIPAL", token: "We will support the proposal", tone: "violet" },
          { label: "CONECTOR FORMAL", token: "provided that / on condition that", tone: "emerald" },
          { label: "ESTIPULACIÃ“N", token: "the budget remains balanced", tone: "sky" },
        ],
        commonMistake: {
          wrong: "We will accept always and when you deliver on time (calco de siempre y cuando).",
          wrongToken: "always and when",
          correct: "We will accept provided that you deliver on time.",
          correctToken: "provided that",
          whySpanish: "'Always and when' no existe en inglÃ©s; la traducciÃ³n formal de 'siempre y cuando' es 'provided that'.",
        },
        examples: [
          {
            english: "We will approve the initiative provided that the budget remains balanced.",
            spanish: "Aprobaremos la iniciativa siempre y cuando el presupuesto se mantenga equilibrado.",
            pronunciationHint: "ui uil aprÃºv di inÃ­shietiv provÃ¡ided dat de bÃ¡dyet rimÃ©ins bÃ¡lanst",
          },
          {
            english: "You can lead the project as long as you provide clear weekly milestones.",
            spanish: "Puedes liderar el proyecto siempre y cuando presentes hitos semanales claros.",
            pronunciationHint: "yu kan lid de prÃ³yekt as long as yu provÃ¡id klÃ­er uÃ­kli mÃ¡ilstouns",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Aprobaremos el plan siempre y cuando el presupuesto se mantenga estable",
          targetTokens: ["We", "will", "approve", "the", "plan", "provided", "that", "the", "budget", "remains", "stable"],
          distractorTokens: ["if", "always", "and", "when"],
          successTipSpanish: "Â¡Elegancia total! 'provided that' eleva el acuerdo al estÃ¡ndar formal.",
          mistakeHintSpanish: "Utiliza 'provided that' para traducir 'siempre y cuando'.",
        },
        voicePractice: {
          sentenceEnglish: "We will endorse the plan provided that timelines are respected.",
          spanishMeaning: "Respaldaremos el plan siempre y cuando se respeten los plazos.",
          pronunciationHint: "ui uil endÃ³rs de plan provÃ¡ided dat tÃ¡imlÃ¡ins ar rispÃ©kted",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza tÃ©rminos y condiciones y acuerdos de gobernanza redactados con 'provided that'.",
        },
      },
    },

    // BASE 10: INVERSIÃ“N CONDICIONAL DIPLOMÃTICA
    {
      title: "InversiÃ³n Condicional DiplomÃ¡tica: Should you need / Had I known",
      focus: "Eliminar 'if' para alcanzar el registro diplomÃ¡tico mÃ¡s alto (Should you require assistance...)",
      payload: {
        ruleTaglineSpanish:
          "Puedes omitir la palabra 'if' completamente invirtiendo el auxiliar al inicio: en futuro/cortesÃ­a usa 'Should you need...' (en vez de 'If you need'), y en pasado usa 'Had we known...' (en vez de 'If we had known'). Suena extremadamente refinado y profesional.",
        formulaSegments: [
          { label: "INVERSIÃ“N CONDICIONAL", token: "Should you require / Had we known", tone: "violet" },
          { label: "SUJETO + VERBO BASE", token: "further information / about the changes", tone: "emerald" },
          { label: "CLÃUSULA DE ACCIÃ“N", token: "please let us know / we would have adapted", tone: "sky" },
        ],
        commonMistake: {
          wrong: "If should you need any help, contact us.",
          wrongToken: "If should you",
          correct: "Should you need any assistance, please contact us.",
          correctToken: "Should you need",
          whySpanish: "Cuando usas la inversiÃ³n con 'Should', la palabra 'if' se elimina por completo.",
        },
        examples: [
          {
            english: "Should you need any further clarification, please do not hesitate to contact me.",
            spanish: "Si llega a necesitar alguna aclaraciÃ³n adicional, por favor no dude en comunicarse conmigo.",
            pronunciationHint: "shud yu nid Ã©ni fÃ©rder klÃ¡rifikÃ©ishon, plis du not jÃ©zitÃ©it tu kÃ¡ntakt mi",
          },
          {
            english: "Had we known about the revised timeline, we would have adjusted our schedule.",
            spanish: "Si hubiÃ©ramos sabido sobre el cronograma modificado, habrÃ­amos ajustado nuestro horario.",
            pronunciationHint: "jad ui nÃ³un abÃ¡ut de rivÃ¡izd tÃ¡imlain, ui uud jav adyÃ¡sted Ã¡uer skÃ©dyul",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Si necesita alguna aclaraciÃ³n, no dude en comunicarse conmigo",
          targetTokens: ["Should", "you", "need", "any", "clarification,", "please", "do", "not", "hesitate", "to", "reach", "out"],
          distractorTokens: ["If", "would", "needing", "contacted"],
          successTipSpanish: "Â¡Diplomacia pura! 'Should you need...' prescinde de 'if' con mÃ¡xima cortesÃ­a.",
          mistakeHintSpanish: "Inicia directamente con 'Should you need any clarification...'.",
        },
        voicePractice: {
          sentenceEnglish: "Should you have questions, please feel free to ask.",
          spanishMeaning: "Si llegara a tener preguntas, por favor siÃ©ntase en libertad de consultar.",
          pronunciationHint: "shud yu jav kuÃ©stions, plis fil fri tu ask",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula ofertas de ayuda diplomÃ¡ticas y respuestas respetuosas en simulaciones de entrevistas.",
        },
      },
    },

    // BASE 11: DESEOS Y LAMENTOS AVANZADOS
    {
      title: "Deseos y Lamentos Complejos: I wish / If only + had done vs would do",
      focus: "Diferenciar arrepentimiento de hechos pasados vs quejas de comportamientos ajenos",
      payload: {
        ruleTaglineSpanish:
          "Para un lamento sobre un hecho pasado que ya no puedes cambiar, usa 'I wish / If only + had done': 'I wish we had consulted an expert'. Pero si te quejas de un hÃ¡bito molesto de otra persona en el presente, usa 'would': 'I wish you would listen'. JamÃ¡s uses 'would' para hablar de ti mismo.",
        formulaSegments: [
          { label: "LAMENTO PASADO", token: "If only we had consulted", tone: "violet" },
          { label: "OBJETO DEL LAMENTO", token: "a specialist before deciding", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I wish I would have studied more (error informal recurrente).",
          wrongToken: "I would have studied",
          correct: "I wish I had studied more.",
          correctToken: "I had studied",
          whySpanish: "Para arrepentimientos propios sobre el pasado, la norma culta exige Past Perfect ('had studied').",
        },
        examples: [
          {
            english: "If only we had consulted a specialist before making that critical decision.",
            spanish: "OjalÃ¡ hubiÃ©ramos consultado a un especialista antes de tomar esa decisiÃ³n crÃ­tica.",
            pronunciationHint: "if Ã³unli ui jad konsÃ³lted a spÃ©shalist bifÃ³r mÃ©iking dat krÃ­tikal desÃ­shon",
          },
          {
            english: "I wish our collaborators would communicate more openly during project updates.",
            spanish: "OjalÃ¡ nuestros colaboradores se comunicaran con mayor apertura durante las actualizaciones.",
            pronunciationHint: "ai uÃ­sh Ã¡uer kolÃ¡boreitors uud komiÃºnikÃ©it mor Ã³upenli diÃºring prÃ³yekt apdÃ©its",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: OjalÃ¡ hubiÃ©ramos consultado a un especialista antes de decidir",
          targetTokens: ["If", "only", "we", "had", "consulted", "a", "specialist", "before", "deciding"],
          distractorTokens: ["would", "have", "consult", "decided"],
          successTipSpanish: "Â¡Arrepentimiento pasado perfecto! 'If only we had consulted...'.",
          mistakeHintSpanish: "Usa Past Perfect ('had consulted') para lamentos sobre decisiones pasadas.",
        },
        voicePractice: {
          sentenceEnglish: "If only we had reviewed the guidelines more thoroughly.",
          spanishMeaning: "OjalÃ¡ hubiÃ©ramos revisado las pautas con mayor detenimiento.",
          pronunciationHint: "if Ã³unli ui jad riviÃºd de gÃ¡idlÃ¡ins mor zÃ³rouli",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos de autocrÃ­tica constructiva y lecciones aprendidas en Writing Studio.",
        },
      },
    },
  ];
}

