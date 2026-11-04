import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3PastDeduction(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: CERTEZA LÃ“GICA PASADA (MUST HAVE VS CAN'T HAVE)
    {
      title: "DeducciÃ³n LÃ³gica Pasada: Must have been vs Can't have been",
      focus: "Conclusiones irrefutables sobre el pasado basadas en evidencia (It must have been / She can't have done)",
      payload: {
        ruleTaglineSpanish:
          "Cuando estÃ¡s 99% seguro de que algo ocurriÃ³ en el pasado segÃºn las pruebas que ves hoy, usa 'must have + participio'. Pero si estÃ¡s 99% seguro de que era imposible que ocurriera, usa 'can't have + participio' (jamÃ¡s 'must not have').",
        formulaSegments: [
          { label: "EVIDENCIA POSITIVA", token: "It must have been a difficult discussion", tone: "violet" },
          { label: "IMPOSIBILIDAD TOTAL", token: "He can't have received the letter yet", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "He must not have been at home because the door was locked (para deducciÃ³n imposible).",
          wrongToken: "must not have been",
          correct: "He can't have been at home because the door was locked.",
          correctToken: "can't have been",
          whySpanish: "Para decir 'no pudo haber sido' o 'es imposible que fuera', el inglÃ©s exige 'can't have + participio'.",
        },
        examples: [
          {
            english: "It must have been a very challenging conversation for both parties.",
            spanish: "DebiÃ³ haber sido una conversaciÃ³n muy difÃ­cil para ambas partes.",
            pronunciationHint: "it mast jav bin a vÃ©ri chÃ¡linying kÃ³nversÃ©ishon for bÃ³z pÃ¡rtis",
          },
          {
            english: "She can't have forgotten the meeting; she wrote it down in her personal diary.",
            spanish: "No puede haber olvidado la reuniÃ³n; la anotÃ³ en su agenda personal.",
            pronunciationHint: "shi kant jav forgÃ³ten de mÃ­ting; shi rÃ³ut it dÃ¡un in jer pÃ©rsonal dÃ¡iari",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: DebiÃ³ haber sido una conversaciÃ³n muy difÃ­cil",
          targetTokens: ["It", "must", "have", "been", "a", "very", "difficult", "conversation"],
          distractorTokens: ["should", "has", "was", "be"],
          successTipSpanish: "Â¡DeducciÃ³n lÃ³gica impecable! 'must have been' indica certeza basada en hechos.",
          mistakeHintSpanish: "Construye: 'It must have been a very difficult conversation'.",
        },
        voicePractice: {
          sentenceEnglish: "It must have been a challenging journey for everyone.",
          spanishMeaning: "DebiÃ³ haber sido una travesÃ­a desafiante para todos.",
          pronunciationHint: "it mast jav bin a chÃ¡linying yÃ©rni for Ã©vriuan",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza artÃ­culos de investigaciÃ³n forense y deducciÃ³n lÃ³gica en Reading.",
        },
      },
    },

    // BASE 13: ESPECULACIÃ“N Y PROBABILIDAD PASADA
    {
      title: "EspeculaciÃ³n Pasada: Might have vs May have vs Could have",
      focus: "Plantear hipÃ³tesis razonables ante la incertidumbre (They might have misunderstood...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando no tienes certeza absoluta y solo barajas posibilidades de lo que pudo haber ocurrido, usa 'might have' o 'may have + participio'. 'They might have misunderstood' significa 'Es posible que hayan malinterpretado'.",
        formulaSegments: [
          { label: "SUJETO", token: "They / The team / The driver", tone: "violet" },
          { label: "MODAL DE DUDA", token: "might have / may have / could have", tone: "emerald" },
          { label: "PARTICIPIO PASADO", token: "misunderstood the guidelines", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Maybe they misunderstood (estilo plano y repetitivo).",
          wrongToken: "Maybe they",
          correct: "They might have misunderstood the instructions.",
          correctToken: "might have misunderstood",
          whySpanish: "El uso de modales compuestos eleva la sofisticaciÃ³n del discurso mÃ¡s allÃ¡ de 'maybe'.",
        },
        examples: [
          {
            english: "They might have misunderstood the original instructions during the briefing.",
            spanish: "Es posible que hayan malinterpretado las instrucciones originales durante la sesiÃ³n informativa.",
            pronunciationHint: "dei mÃ¡it jav mÃ¡isanderstÃºd di orÃ­yinal instrÃ¡kshons diÃºring de brÃ­fing",
          },
          {
            english: "The package could have been delivered to a neighboring address by mistake.",
            spanish: "El paquete pudo haber sido entregado en una direcciÃ³n vecina por error.",
            pronunciationHint: "de pÃ¡kedz kud jav bin delÃ­verd tu a nÃ©iboring adrÃ©s bai mistÃ©ik",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Es posible que hayan malinterpretado las instrucciones originales",
          targetTokens: ["They", "might", "have", "misunderstood", "the", "original", "instructions"],
          distractorTokens: ["must", "can", "misunderstanding", "did"],
          successTipSpanish: "Â¡EspeculaciÃ³n razonable! 'might have misunderstood' plantea la hipÃ³tesis sin juzgar.",
          mistakeHintSpanish: "Ordena: 'They might have misunderstood the original instructions'.",
        },
        voicePractice: {
          sentenceEnglish: "They might have overlooked that minor detail during inspection.",
          spanishMeaning: "Es posible que hayan pasado por alto ese detalle menor durante la inspecciÃ³n.",
          pronunciationHint: "dei mÃ¡it jav Ã³uverlukt dat mÃ¡inor ditÃ©il diÃºring inspÃ©kshon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula explicaciones tentativas con cautela profesional en simulaciones de entrevistas.",
        },
      },
    },

    // BASE 14: ACCIONES INNECESARIAS (NEEDN'T HAVE DONE VS DIDN'T NEED TO)
    {
      title: "El Matiz CrÃ­tico: Needn't have done vs Didn't need to do",
      focus: "Diferenciar entre hacer algo en vano y no tener la obligaciÃ³n de hacerlo",
      payload: {
        ruleTaglineSpanish:
          "Este es uno de los secretos mejor guardados de B2: Si hiciste un esfuerzo inÃºtil (por ejemplo imprimiste 50 pÃ¡ginas y luego te dijeron que todo era digital), dices 'I needn't have printed them'. Pero si sabÃ­as de antemano que era digital y no imprimiste nada, dices 'I didn't need to print them'.",
        formulaSegments: [
          { label: "HECHO EN VANO", token: "You needn't have prepared so much food (lo hiciste)", tone: "violet" },
          { label: "NO ERA NECESARIO Y SE EVITÃ“", token: "We didn't need to book a taxi (no lo hicimos)", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I didn't need to bring my umbrella, but I brought it (redundante y poco natural).",
          wrongToken: "didn't need to bring... but I brought",
          correct: "I needn't have brought my umbrella.",
          correctToken: "needn't have brought",
          whySpanish: "'Needn't have + participio' condensa en cuatro sÃ­labas la idea de haber hecho algo innecesariamente.",
        },
        examples: [
          {
            english: "You needn't have prepared so much coffee; most guests had already left.",
            spanish: "No hacÃ­a falta que prepararas tanto cafÃ©; la mayorÃ­a de los invitados ya se habÃ­an ido.",
            pronunciationHint: "yu nÃ­dnt jav prepÃ©rd sou mach kÃ³fi; mÃ³ust gests jad olrÃ©di left",
          },
          {
            english: "We didn't need to wait in line because we had reserved our tickets online.",
            spanish: "No tuvimos que esperar en la fila porque habÃ­amos reservado los boletos por internet.",
            pronunciationHint: "ui dÃ­dnt nid tu uÃ©it in lÃ¡in bikÃ³s ui jad rizÃ©rvd Ã¡uer tÃ­kets onlÃ¡in",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: No hacÃ­a falta que prepararas tanto cafÃ©",
          targetTokens: ["You", "needn't", "have", "prepared", "so", "much", "coffee"],
          distractorTokens: ["didn't", "need", "prepare", "mustn't"],
          successTipSpanish: "Â¡Sutileza absoluta! 'needn't have prepared' expresa el esfuerzo inÃºtil.",
          mistakeHintSpanish: "Usa 'You needn't have prepared so much coffee'.",
        },
        voicePractice: {
          sentenceEnglish: "You needn't have rushed; the meeting was rescheduled.",
          spanishMeaning: "No hacÃ­a falta que te apresuraras; la reuniÃ³n fue reprogramada.",
          pronunciationHint: "yu nÃ­dnt jav rasht; de mÃ­ting uos riskÃ©dyuld",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe reflexiones sobre eficiencia operativa y ahorro de tiempo en Writing Studio.",
        },
      },
    },

    // BASE 15: EXPECTATIVAS NO CUMPLIDAS
    {
      title: "Expectativas y Destino: Was supposed to vs Were bound to",
      focus: "Hablar de compromisos incumplidos o consecuencias que eran inevitables (was supposed to...)",
      payload: {
        ruleTaglineSpanish:
          "Usa 'was/were supposed to + base' para indicar que habÃ­a un plan o compromiso acordado pero la realidad fue distinta: 'The flight was supposed to leave at noon'. Usa 'bound to' para consecuencias que eran lÃ³gicamente inevitables: 'They were bound to succeed'.",
        formulaSegments: [
          { label: "PLAN O EXPECTATIVA", token: "The conference was supposed to start at ten,", tone: "violet" },
          { label: "INEVITABILIDAD", token: "delays were bound to happen with this weather.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "The flight had the expectation to depart on time.",
          wrongToken: "had the expectation to",
          correct: "The flight was supposed to depart on time.",
          correctToken: "was supposed to depart",
          whySpanish: "El modismo nativo para 'se suponÃ­a que' es 'was supposed to + verbo'.",
        },
        examples: [
          {
            english: "The flight was supposed to depart at noon, but there was an unexpected delay.",
            spanish: "Se suponÃ­a que el vuelo saldrÃ­a al mediodÃ­a, pero hubo un retraso inesperado.",
            pronunciationHint: "de flÃ¡it uos sapÃ³ust tu dipÃ¡rt at nun, bat der uos an Ã¡nekspÃ©kted dilÃ©i",
          },
          {
            english: "With such thorough dedication, their initiative was bound to produce remarkable results.",
            spanish: "Con una dedicaciÃ³n tan rigurosa, su iniciativa estaba destinada a producir resultados notables.",
            pronunciationHint: "uid sach zÃ³rou dedikÃ©ishon, der inÃ­shietiv uos bÃ¡und tu prodÃºs rimÃ¡rkabl rizÃ³lts",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Se suponÃ­a que el vuelo saldrÃ­a al mediodÃ­a",
          targetTokens: ["The", "flight", "was", "supposed", "to", "depart", "at", "noon"],
          distractorTokens: ["is", "supposing", "has", "departed"],
          successTipSpanish: "Â¡Exacto! 'was supposed to depart' refleja la expectativa previa.",
          mistakeHintSpanish: "Ordena: 'The flight was supposed to depart at noon'.",
        },
        voicePractice: {
          sentenceEnglish: "The presentation was supposed to start ten minutes ago.",
          spanishMeaning: "Se suponÃ­a que la presentaciÃ³n comenzarÃ­a hace diez minutos.",
          pronunciationHint: "de prezantÃ©ishon uos sapÃ³ust tu start ten mÃ­nits agÃ³u",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Justifica retrasos e imprevistos de manera fluida y educada en entrevistas.",
        },
      },
    },

    // BASE 16: OPORTUNIDADES DESPERDICIADAS (CHECKPOINT 2 ANCHOR)
    {
      title: "Oportunidades Desperdiciadas: Could have done",
      focus: "Reproche constructivo y caminos alternativos que no se tomaron (We could have negotiated better)",
      payload: {
        ruleTaglineSpanish:
          "Usa 'could have + participio' para seÃ±alar que existÃ­a una posibilidad real y accesible en el pasado pero se tomÃ³ una decisiÃ³n diferente. Aporta un tono de anÃ¡lisis estratÃ©gico y evaluaciÃ³n retrospectiva.",
        formulaSegments: [
          { label: "OPORTUNIDAD PERDIDA", token: "We could have negotiated better terms,", tone: "violet" },
          { label: "DECISIÃ“N ADOPTADA", token: "but we settled for the initial proposal.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "We can have negotiated better (error de tiempo verbal).",
          wrongToken: "We can have",
          correct: "We could have negotiated better terms.",
          correctToken: "We could have",
          whySpanish: "'Can' no se combina con 'have + participio' para oportunidades pasadas; se requiere 'could have'.",
        },
        examples: [
          {
            english: "We could have negotiated more favorable terms, but we accepted the initial offer too quickly.",
            spanish: "PodrÃ­amos haber negociado tÃ©rminos mÃ¡s favorables, pero aceptamos la oferta inicial demasiado rÃ¡pido.",
            pronunciationHint: "ui kud jav nigÃ³ushieited mor fÃ©ivorabl terms, bat ui aksÃ©pted di inÃ­shal Ã³fer tu kuÃ­kli",
          },
          {
            english: "You could have asked for guidance before making such a permanent adjustment.",
            spanish: "PodrÃ­as haber pedido orientaciÃ³n antes de hacer un ajuste tan permanente.",
            pronunciationHint: "yu kud jav askt for gÃ¡idans bifÃ³r mÃ©iking sach a pÃ©rmanent adyÃ¡stment",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: PodrÃ­amos haber negociado mejores tÃ©rminos, pero aceptamos",
          targetTokens: ["We", "could", "have", "negotiated", "better", "terms,", "but", "we", "accepted"],
          distractorTokens: ["can", "negotiate", "accepting", "must"],
          successTipSpanish: "Â¡Oportunidad pasada analizada! 'could have negotiated' sin reproches destructivos.",
          mistakeHintSpanish: "Usa 'We could have negotiated better terms, but we accepted'.",
        },
        voicePractice: {
          sentenceEnglish: "We could have explored more alternatives before deciding.",
          spanishMeaning: "PodrÃ­amos haber explorado mÃ¡s alternativas antes de decidir.",
          pronunciationHint: "ui kud jav eksplÃ³rd mor oltÃ©rnativs bifÃ³r desÃ¡iding",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe reportes retrospectivos identificando oportunidades de mejora en Writing Studio.",
        },
      },
    },
  ];
}

