import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3PastDeduction(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: CERTEZA LÓGICA PASADA (MUST HAVE VS CAN'T HAVE)
    {
      title: "Deducción Lógica Pasada: Must have been vs Can't have been",
      focus: "Conclusiones irrefutables sobre el pasado basadas en evidencia (It must have been / She can't have done)",
      payload: {
        ruleTaglineSpanish:
          "Cuando estás 99% seguro de que algo ocurrió en el pasado según las pruebas que ves hoy, usa 'must have + participio'. Pero si estás 99% seguro de que era imposible que ocurriera, usa 'can't have + participio' (jamás 'must not have').",
        formulaSegments: [
          { label: "EVIDENCIA POSITIVA", token: "It must have been a difficult discussion", tone: "violet" },
          { label: "IMPOSIBILIDAD TOTAL", token: "He can't have received the letter yet", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Evidencia que confirma",
            segments: [
              { label: "CONCLUSIÓN SEGURA", token: "must have + participio", tone: "violet" },
              { label: "PRUEBA VISIBLE HOY", token: "las huellas siguen ahí", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando las pruebas de hoy solo encajan con una explicación, usa 'must have + participio': afirmas una conclusión, no una obligación. Contraste: si la evidencia fuera dudosa, dirías 'might have'.",
            exampleEnglish: "It must have been a hard decision.",
          },
          {
            label: "02 · Imposibilidad comprobada",
            segments: [
              { label: "CONCLUSIÓN IMPOSIBLE", token: "can't have + participio", tone: "violet" },
              { label: "PRUEBA QUE LA DESCARTA", token: "la puerta estaba cerrada", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la evidencia descarta la posibilidad, usa 'can't have + participio'. No digas 'must not have': eso niega una obligación. Contraste: 'must have' afirma lo seguro y 'can't have' descarta lo imposible.",
            exampleEnglish: "He can't have received my message yet.",
          },
        ],
        commonMistake: {
          wrong: "He must not have been at home because the door was locked",
          wrongToken: "must not have been",
          correct: "He can't have been at home because the door was locked.",
          correctToken: "can't have been",
          whySpanish: "Para decir 'no pudo haber sido' o 'es imposible que fuera', el inglés exige 'can't have + participio'.",
        },
        examples: [
          {
            english: "It must have been a very challenging conversation for both parties.",
            spanish: "Debió haber sido una conversación muy difícil para ambas partes.",
            pronunciationHint: "it mast jav bin a véri chálinying kónverséishon for bóz pártis",
          },
          {
            english: "She can't have forgotten the meeting; she wrote it down in her personal diary.",
            spanish: "No puede haber olvidado la reunión; la anotó en su agenda personal.",
            pronunciationHint: "shi kant jav forgóten de míting; shi róut it dáun in jer pérsonal dáiari",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Debió haber sido una conversación muy difícil",
          targetTokens: ["It", "must", "have", "been", "a", "very", "difficult", "conversation"],
          distractorTokens: ["should", "has", "was", "be"],
          successTipSpanish: "¡Deducción lógica impecable! 'must have been' indica certeza basada en hechos.",
          mistakeHintSpanish: "Construye: 'It must have been a very difficult conversation'.",
        },
        voicePractice: {
          sentenceEnglish: "It must have been a challenging journey for everyone.",
          spanishMeaning: "Debió haber sido una travesía desafiante para todos.",
          pronunciationHint: "it mast jav bin a chálinying yérni for évriuan",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza artículos de investigación forense y deducción lógica en Reading.",
        },
      },
    },

    // BASE 13: ESPECULACIÓN Y PROBABILIDAD PASADA
    {
      title: "Especulación Pasada: Might have vs May have vs Could have",
      focus: "Plantear hipótesis razonables ante la incertidumbre (They might have misunderstood...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando no tienes certeza absoluta y solo barajas posibilidades de lo que pudo haber ocurrido, usa 'might have' o 'may have + participio'. 'They might have misunderstood' significa 'Es posible que hayan malinterpretado'.",
        formulaSegments: [
          { label: "SUJETO", token: "They / The team / The driver", tone: "violet" },
          { label: "MODAL DE DUDA", token: "might have / may have / could have", tone: "emerald" },
          { label: "PARTICIPIO PASADO", token: "misunderstood the guidelines", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Hipótesis razonable",
            segments: [
              { label: "SUPOSICIÓN ABIERTA", token: "might have + participio", tone: "violet" },
              { label: "SIN PRUEBAS FIRMES", token: "no hay testigos", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando barajas una explicación posible sin pruebas firmes, usa 'might have'. Señal: tu frase admite 'es posible que'. Contraste: 'must have' afirma casi con certeza y 'can't have' descarta.",
            exampleEnglish: "They might have missed the last train.",
          },
          {
            label: "02 · Especulación formal",
            segments: [
              { label: "REGISTRO CUIDADO", token: "may have + participio", tone: "emerald" },
              { label: "INFORME O ANÁLISIS", token: "sin señalar culpables", tone: "sky" },
            ],
            explanationSpanish:
              "En informes y explicaciones profesionales, 'may have' suena más formal que 'might have' con la misma duda. Señal: escribes para un cliente o un jefe. Contraste: en conversación cotidiana gana 'might have'.",
            exampleEnglish: "The team may have misread the schedule.",
          },
          {
            label: "03 · Posibilidad remota",
            segments: [
              { label: "OPCIÓN POCO PROBABLE", token: "could have + participio", tone: "sky" },
              { label: "NO SE PUEDE DESCARTAR", token: "queda una puerta abierta", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando una posibilidad remota sigue en pie, usa 'could have' para no cerrar el caso. Señal: no tienes cómo comprobarlo. Contraste: 'might have' es la hipótesis más probable; 'could have' la menos probable.",
            exampleEnglish: "The fault could have started in the old cable.",
          },
        ],
        commonMistake: {
          wrong: "Maybe they misunderstood the instructions.",
          wrongToken: "Maybe they",
          correct: "They might have misunderstood the instructions.",
          correctToken: "might have misunderstood",
          whySpanish: "El uso de modales compuestos eleva la sofisticación del discurso más allá de 'maybe'.",
        },
        examples: [
          {
            english: "They might have misunderstood the original instructions during the briefing.",
            spanish: "Es posible que hayan malinterpretado las instrucciones originales durante la sesión informativa.",
            pronunciationHint: "dei máit jav máisanderstúd di oríyinal instrákshons diúring de brífing",
          },
          {
            english: "The package could have been delivered to a neighboring address by mistake.",
            spanish: "El paquete pudo haber sido entregado en una dirección vecina por error.",
            pronunciationHint: "de pákedz kud jav bin delíverd tu a néiboring adrés bai mistéik",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Es posible que hayan malinterpretado las instrucciones originales",
          targetTokens: ["They", "might", "have", "misunderstood", "the", "original", "instructions"],
          distractorTokens: ["must", "can", "misunderstanding", "did"],
          successTipSpanish: "¡Especulación razonable! 'might have misunderstood' plantea la hipótesis sin juzgar.",
          mistakeHintSpanish: "Ordena: 'They might have misunderstood the original instructions'.",
        },
        voicePractice: {
          sentenceEnglish: "They might have overlooked that minor detail during inspection.",
          spanishMeaning: "Es posible que hayan pasado por alto ese detalle menor durante la inspección.",
          pronunciationHint: "dei máit jav óuverlukt dat máinor ditéil diúring inspékshon",
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
      title: "El Matiz Crítico: Needn't have done vs Didn't need to do",
      focus: "Diferenciar entre hacer algo en vano y no tener la obligación de hacerlo",
      payload: {
        ruleTaglineSpanish:
          "Este es uno de los secretos mejor guardados de B2: Si hiciste un esfuerzo inútil (por ejemplo imprimiste 50 páginas y luego te dijeron que todo era digital), dices 'I needn't have printed them'. Pero si sabías de antemano que era digital y no imprimiste nada, dices 'I didn't need to print them'.",
        formulaSegments: [
          { label: "HECHO EN VANO", token: "You needn't have prepared so much food (lo hiciste)", tone: "violet" },
          { label: "NO ERA NECESARIO Y SE EVITÓ", token: "We didn't need to book a taxi (no lo hicimos)", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Esfuerzo inútil",
            segments: [
              { label: "LO HICISTE PARA NADA", token: "needn't have + participio", tone: "violet" },
              { label: "SEÑAL", token: "el resultado lo volvió inútil", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hiciste el esfuerzo y después supiste que no servía, usa 'needn't have + participio'. Señal: ya está hecho. Contraste: 'didn't need to' habla de algo que no hiciste porque no era necesario.",
            exampleEnglish: "You needn't have printed all those pages.",
          },
          {
            label: "02 · No hacía falta y no lo hiciste",
            segments: [
              { label: "SIN OBLIGACIÓN", token: "didn't need to + verbo", tone: "emerald" },
              { label: "SEÑAL", token: "lo supiste antes y no actuaste", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando sabías de antemano que no era obligatorio y por eso no lo hiciste, usa 'didn't need to + verbo'. Señal: no hubo esfuerzo. Contraste: 'needn't have' confiesa un esfuerzo que sobró.",
            exampleEnglish: "We didn't need to book a taxi.",
          },
        ],
        commonMistake: {
          wrong: "I didn't need to bring my umbrella, but I brought it",
          wrongToken: "didn't need to bring... but I brought",
          correct: "I needn't have brought my umbrella.",
          correctToken: "needn't have brought",
          whySpanish: "'Needn't have + participio' condensa en cuatro sílabas la idea de haber hecho algo innecesariamente.",
        },
        examples: [
          {
            english: "You needn't have prepared so much coffee; most guests had already left.",
            spanish: "No hacía falta que prepararas tanto café; la mayoría de los invitados ya se habían ido.",
            pronunciationHint: "yu nídnt jav prepérd sou mach kófi; móust gests jad olrédi left",
          },
          {
            english: "We didn't need to wait in line because we had reserved our tickets online.",
            spanish: "No tuvimos que esperar en la fila porque habíamos reservado los boletos por internet.",
            pronunciationHint: "ui dídnt nid tu uéit in láin bikós ui jad rizérvd áuer tíkets onláin",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No hacía falta que prepararas tanto café",
          targetTokens: ["You", "needn't", "have", "prepared", "so", "much", "coffee"],
          distractorTokens: ["didn't", "need", "prepare", "mustn't"],
          successTipSpanish: "¡Sutileza absoluta! 'needn't have prepared' expresa el esfuerzo inútil.",
          mistakeHintSpanish: "Usa 'You needn't have prepared so much coffee'.",
        },
        voicePractice: {
          sentenceEnglish: "You needn't have rushed; the meeting was rescheduled.",
          spanishMeaning: "No hacía falta que te apresuraras; la reunión fue reprogramada.",
          pronunciationHint: "yu nídnt jav rasht; de míting uos riskédyuld",
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
          "Usa 'was/were supposed to + base' para indicar que había un plan o compromiso acordado pero la realidad fue distinta: 'The flight was supposed to leave at noon'. Usa 'bound to' para consecuencias que eran lógicamente inevitables: 'They were bound to succeed'.",
        formulaSegments: [
          { label: "PLAN O EXPECTATIVA", token: "The conference was supposed to start at ten,", tone: "violet" },
          { label: "INEVITABILIDAD", token: "delays were bound to happen with this weather.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Plan que no se cumplió",
            segments: [
              { label: "ACUERDO PREVIO", token: "was / were supposed to + verbo", tone: "violet" },
              { label: "SEÑAL", token: "la realidad fue distinta", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando había un plan acordado y la realidad fue otra, usa 'was supposed to + verbo'. Señal: tu frase lleva un 'pero' implícito. Contraste: 'was bound to' no habla de planes, sino de lo inevitable.",
            exampleEnglish: "The call was supposed to end at five.",
          },
          {
            label: "02 · Consecuencia inevitable",
            segments: [
              { label: "RESULTADO LÓGICO", token: "was / were bound to + verbo", tone: "emerald" },
              { label: "SEÑAL", token: "las condiciones lo anunciaban", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando las condiciones hacían el resultado casi obligatorio, usa 'were bound to + verbo'. Señal: nadie se sorprendió. Contraste: 'was supposed to' describe un acuerdo; 'were bound to' una consecuencia que se veía venir.",
            exampleEnglish: "With that plan, they were bound to fail.",
          },
        ],
        commonMistake: {
          wrong: "The flight had the expectation to depart on time.",
          wrongToken: "had the expectation to",
          correct: "The flight was supposed to depart on time.",
          correctToken: "was supposed to depart",
          whySpanish: "El modismo nativo para 'se suponía que' es 'was supposed to + verbo'.",
        },
        examples: [
          {
            english: "The flight was supposed to depart at noon, but there was an unexpected delay.",
            spanish: "Se suponía que el vuelo saldría al mediodía, pero hubo un retraso inesperado.",
            pronunciationHint: "de fláit uos sapóust tu dipárt at nun, bat der uos an ánekspékted diléi",
          },
          {
            english: "With such thorough dedication, their initiative was bound to produce remarkable results.",
            spanish: "Con una dedicación tan rigurosa, su iniciativa estaba destinada a producir resultados notables.",
            pronunciationHint: "uid sach zórou dedikéishon, der iníshietiv uos báund tu prodús rimárkabl rizólts",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Se suponía que el vuelo saldría al mediodía",
          targetTokens: ["The", "flight", "was", "supposed", "to", "depart", "at", "noon"],
          distractorTokens: ["is", "supposing", "has", "departed"],
          successTipSpanish: "¡Exacto! 'was supposed to depart' refleja la expectativa previa.",
          mistakeHintSpanish: "Ordena: 'The flight was supposed to depart at noon'.",
        },
        voicePractice: {
          sentenceEnglish: "The presentation was supposed to start ten minutes ago.",
          spanishMeaning: "Se suponía que la presentación comenzaría hace diez minutos.",
          pronunciationHint: "de prezantéishon uos sapóust tu start ten mínits agóu",
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
          "Usa 'could have + participio' para señalar que existía una posibilidad real y accesible en el pasado pero se tomó una decisión diferente. Aporta un tono de análisis estratégico y evaluación retrospectiva.",
        formulaSegments: [
          { label: "OPORTUNIDAD PERDIDA", token: "We could have negotiated better terms,", tone: "violet" },
          { label: "DECISIÓN ADOPTADA", token: "but we settled for the initial proposal.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Oportunidad no tomada",
            segments: [
              { label: "POSIBILIDAD REAL", token: "could have + participio", tone: "violet" },
              { label: "SEÑAL", token: "elegiste otra opción", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando existía una opción real y elegiste otra, usa 'could have + participio'. Señal: la alternativa estaba a tu alcance. Contraste: 'might have' solo especula; 'could have' evalúa una decisión pasada.",
            exampleEnglish: "We could have asked for more time.",
          },
          {
            label: "02 · Imposibilidad sin culpa",
            segments: [
              { label: "NO ERA POSIBLE", token: "couldn't have + participio", tone: "emerald" },
              { label: "SEÑAL", token: "nadie podía saberlo", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando nadie habría podido hacerlo de otra forma, usa 'couldn't have + participio' y quita la culpa. Señal: faltaba la información que hoy tienes. Contraste: 'could have' reprocha una opción real; 'couldn't have' la descarta.",
            exampleEnglish: "Nobody could have predicted this result.",
          },
        ],
        commonMistake: {
          wrong: "We can have negotiated better",
          wrongToken: "We can have",
          correct: "We could have negotiated better terms.",
          correctToken: "We could have",
          whySpanish: "'Can' no se combina con 'have + participio' para oportunidades pasadas; se requiere 'could have'.",
        },
        examples: [
          {
            english: "We could have negotiated more favorable terms, but we accepted the initial offer too quickly.",
            spanish: "Podríamos haber negociado términos más favorables, pero aceptamos la oferta inicial demasiado rápido.",
            pronunciationHint: "ui kud jav nigóushieited mor féivorabl terms, bat ui aksépted di iníshal ófer tu kuíkli",
          },
          {
            english: "You could have asked for guidance before making such a permanent adjustment.",
            spanish: "Podrías haber pedido orientación antes de hacer un ajuste tan permanente.",
            pronunciationHint: "yu kud jav askt for gáidans bifór méiking sach a pérmanent adyástment",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Podríamos haber negociado mejores términos, pero aceptamos",
          targetTokens: ["We", "could", "have", "negotiated", "better", "terms,", "but", "we", "accepted"],
          distractorTokens: ["can", "negotiate", "accepting", "must"],
          successTipSpanish: "¡Oportunidad pasada analizada! 'could have negotiated' sin reproches destructivos.",
          mistakeHintSpanish: "Usa 'We could have negotiated better terms, but we accepted'.",
        },
        voicePractice: {
          sentenceEnglish: "We could have explored more alternatives before deciding.",
          spanishMeaning: "Podríamos haber explorado más alternativas antes de decidir.",
          pronunciationHint: "ui kud jav eksplórd mor oltérnativs bifór desáiding",
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

