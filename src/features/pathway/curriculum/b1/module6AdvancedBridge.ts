import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6AdvancedBridge(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: ARREPENTIMIENTO TARDÍO (Should have + Participio)
    {
      title: "Arrepentimiento y Consejo Tardío: Should Have + Participio",
      focus: "Expresar lo que debió haberse hecho en el pasado pero no se hizo",
      payload: {
        ruleTaglineSpanish:
          "Para hablar de errores del pasado o cosas que debieron hacerse mejor, usa 'should have' (o pronunciado rápido 'should've') más el participio: I should have called earlier (Debí haber llamado antes).",
        formulaSegments: [
          { label: "DEBÍ / DEBIÓ HABER", token: "I should have ('ve) · We should have", tone: "violet" },
          { label: "PARTICIPIO PASADO", token: "checked · called · started · prepared", tone: "emerald" },
          { label: "CONTEXTO", token: "earlier / before leaving / more carefully", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Lamentar lo que no hiciste",
            segments: [
              { label: "YO + DEBÍ HABER", token: "I should have ('ve)", tone: "violet" },
              { label: "PARTICIPIO", token: "called · checked · asked", tone: "emerald" },
              { label: "MARCO PASADO", token: "earlier / before the meeting", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el lamento es tuyo y la acción ya no se puede cambiar, usas 'I should have + participio': hablas del pasado desde el presente. La señal es 'yo debí'; en cambio, para el futuro dirías 'I should call'.",
            exampleEnglish: "I should have asked before signing.",
          },
          {
            label: "02 · Criticar lo que otro no hizo",
            segments: [
              { label: "OTRO + DEBÍA HABER", token: "You should have · They should have", tone: "violet" },
              { label: "PARTICIPIO", token: "confirmed · warned · replied", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la acción faltante es de otra persona y buscas señalar su error, cambias el sujeto: 'You/They should have + participio'. La señal es quién debía actuar; con 'I' es lamento propio, con 'they' es crítica.",
            exampleEnglish: "The team should have confirmed the dates.",
          },
        ],
        commonMistake: {
          wrong: "I should have call you yesterday.",
          wrongToken: "should have call",
          correct: "I should have called you yesterday.",
          correctToken: "should have called",
          whySpanish: "Después de 'should have', el verbo debe ser siempre participio pasado ('called').",
        },
        examples: [
          {
            english: "We should have reviewed the numbers more carefully.",
            spanish: "Debimos haber revisado las cifras con más cuidado.",
            pronunciationHint: "ui shúd jav riviúd de námbers mor kérfuli",
          },
          {
            english: "You should have told me about the delay.",
            spanish: "Debiste haberme avisado sobre el retraso.",
            pronunciationHint: "yu shúd jav tóuld mi abáut de diléi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Debí haber llamado antes",
          targetTokens: ["I", "should", "have", "called", "earlier"],
          distractorTokens: ["call", "had"],
          successTipSpanish: "¡Estructura clave de madurez profesional! 'Should have called' reconoce oportunidades.",
          mistakeHintSpanish: "Usa 'I should have' seguido del participio 'called earlier'.",
        },
        voicePractice: {
          sentenceEnglish: "I should have called earlier today.",
          spanishMeaning: "Debí haber llamado más temprano hoy.",
          pronunciationHint: "ai shúd jav kold érli-er tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a 'What would you do differently in past projects?' con 'I should have communicated earlier'.",
        },
      },
    },

    // BASE 28: OPORTUNIDADES NO APROVECHADAS (Could have + Participio)
    {
      title: "Oportunidades No Aprovechadas: Could Have + Participio",
      focus: "Hablar de posibilidades del pasado que eran factibles pero no se ejecutaron",
      payload: {
        ruleTaglineSpanish:
          "Usa 'could have' más el participio para lo que 'pudo haber sido': You could have won the contract (Pudiste haber ganado el contrato). También se usa para alivio ante algo que casi sale mal: It could have been worse.",
        formulaSegments: [
          { label: "PUDO HABER SIDO", token: "We could have done · It could have been", tone: "violet" },
          { label: "PARTICIPIO", token: "achieved · avoided · delivered", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Oportunidad que no tomaste",
            segments: [
              { label: "PUDIMOS HABER", token: "We could have · I could have", tone: "violet" },
              { label: "PARTICIPIO", token: "won · applied · delivered", tone: "emerald" },
              { label: "RESULTADO NO REAL", token: "but we didn't", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando existía la posibilidad y no la tomaste, usas 'could have + participio' para nombrarla: la habilidad estaba, el resultado no ocurrió. La señal es 'pude y no lo hice'; en cambio, 'I could win' habla de hoy o del futuro.",
            exampleEnglish: "We could have applied for that grant.",
          },
          {
            label: "02 · Alivio por un riesgo pasado",
            segments: [
              { label: "PUDO HABER SIDO PEOR", token: "It could have been worse", tone: "violet" },
              { label: "PARTICIPIO", token: "been · caused · failed", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando algo salió bien por poco y quieres mostrar alivio, usas 'it could have been + participio': describes el desastre que no pasó. La señal es el alivio; con 'it was worse' afirmarías un hecho, no una posibilidad abierta.",
            exampleEnglish: "The delay could have caused bigger problems.",
          },
        ],
        commonMistake: {
          wrong: "We could have win if we tried.",
          wrongToken: "could have win",
          correct: "We could have won if we had tried.",
          correctToken: "could have won",
          whySpanish: "Después de 'could have' se exige participio pasado ('won', no 'win').",
        },
        examples: [
          {
            english: "We could have avoided this misunderstanding easily.",
            spanish: "Pudimos haber evitado este malentendido fácilmente.",
            pronunciationHint: "ui kúd jav avóidid dis misanderstánding ísili",
          },
          {
            english: "Don't worry, it could have been much worse.",
            spanish: "No te preocupes, pudo haber sido mucho peor.",
            pronunciationHint: "dóunt uórri, it kúd jav bin mach uórs",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Pudimos haber evitado esto fácilmente",
          targetTokens: ["We", "could", "have", "avoided", "this", "easily"],
          distractorTokens: ["avoid", "can"],
          successTipSpanish: "¡Brillante! 'Could have avoided' evalúa alternativas pasadas con gran soltura.",
          mistakeHintSpanish: "Combina 'We could have' con el participio 'avoided this easily'.",
        },
        voicePractice: {
          sentenceEnglish: "We could have done this earlier.",
          spanishMeaning: "Pudimos haber hecho esto antes.",
          pronunciationHint: "ui kúd jav dan dis érli-er",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe análisis post-mortem de proyectos evaluando qué cosas 'could have been improved'.",
        },
      },
    },

    // BASE 29: PREGUNTAS COLETILLA (Question Tags)
    {
      title: "Preguntas Coletilla de Confirmación: Question Tags",
      focus: "Confirmar acuerdos y buscar complicidad al final de la frase (don't you?, isn't it?)",
      payload: {
        ruleTaglineSpanish:
          "Las coletillas funcionan como un espejo invertido: si tu frase es positiva, la coletilla es negativa (You speak English, DON'T YOU?). Si tu frase es negativa, la coletilla es positiva (You don't smoke, DO YOU?).",
        formulaSegments: [
          { label: "FRASE AFIRMATIVA", token: "She is coming · You work here", tone: "violet" },
          { label: "COLETILLA NEGATIVA", token: "isn't she? · don't you?", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Confirmar una afirmación",
            segments: [
              { label: "FRASE POSITIVA", token: "You are ready · She works here", tone: "violet" },
              { label: "COLETILLA NEGATIVA", token: "aren't you? · doesn't she?", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando afirmas algo y buscas que el otro lo confirme, la coletilla va negativa y con el mismo auxiliar: 'You are ready, aren't you?'. La señal es que tu frase no lleva 'not'; el error típico es añadir 'yes?' en lugar de la coletilla.",
            exampleEnglish: "You are joining us, aren't you?",
          },
          {
            label: "02 · Pedir confirmación de algo negativo",
            segments: [
              { label: "FRASE NEGATIVA", token: "You haven't seen it · He isn't ready", tone: "violet" },
              { label: "COLETILLA POSITIVA", token: "have you? · is he?", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando tu frase ya es negativa, la coletilla se vuelve positiva y repite el auxiliar: 'He isn't ready, is he?'. La señal es la palabra 'not' en tu frase; si pones otra negación, tendrías dos y sonaría forzado.",
            exampleEnglish: "He isn't ready yet, is he?",
          },
        ],
        commonMistake: {
          wrong: "You are ready, yes?",
          wrongToken: "yes? / no?",
          correct: "You are ready, aren't you?",
          correctToken: "aren't you?",
          whySpanish: "En inglés nativo se usa el auxiliar correspondiente ('aren't you?'), no un simple 'yes/no'.",
        },
        examples: [
          {
            english: "This proposal makes total sense, doesn't it?",
            spanish: "Esta propuesta tiene total sentido, ¿no es así?",
            pronunciationHint: "dis propóusal méiks tóutal sens, dásent it?",
          },
          {
            english: "You haven't seen the manager yet, have you?",
            spanish: "Aún no has visto al gerente, ¿verdad?",
            pronunciationHint: "yu jávent sin de mánacher yet, jav yu?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Trabajas aquí, ¿verdad?",
          targetTokens: ["You", "work", "here,", "don't", "you?"],
          distractorTokens: ["aren't you?", "yes?"],
          successTipSpanish: "¡Inglés ultra conversacional! 'Don't you?' corresponde al presente simple de 'work'.",
          mistakeHintSpanish: "Con el verbo de acción 'work', la coletilla es 'don't you?'.",
        },
        voicePractice: {
          sentenceEnglish: "You work here, don't you?",
          spanishMeaning: "Trabajas aquí, ¿verdad?",
          pronunciationHint: "yu uórk jíar, dóunt yu?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Crea empatía y conexión con el entrevistador cerrando afirmaciones con naturalidad.",
        },
      },
    },

    // BASE 30: CONECTORES FORMALES DE CONTRASTE (Despite vs Although)
    {
      title: "Conectores Formales de Contraste: Despite vs Although",
      focus: "Distinguir 'Despite + sustantivo/-ing' de 'Although + oración con verbo'",
      payload: {
        ruleTaglineSpanish:
          "La diferencia que todos confunden: 'Although' va seguido de una frase completa con sujeto y verbo (Although it was raining). 'Despite' o 'In spite of' va seguido de un sustantivo o un gerundio: Despite the rain / Despite working hard.",
        formulaSegments: [
          { label: "AUNQUE (+ ORACIÓN)", token: "Although the schedule was tight", tone: "violet" },
          { label: "A PESAR DE (+ SUSTANTIVO)", token: "Despite the obstacles / Despite being tired", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Contraste con sustantivo o -ing",
            segments: [
              { label: "DESPITE + SUSTANTIVO", token: "Despite the delay · Despite the cost", tone: "violet" },
              { label: "O BIEN + -ING", token: "Despite being tired", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el contraste va seguido de un sustantivo o de un verbo en -ing, usa 'despite': 'Despite the delay' o 'Despite working late'. La señal es que no hay sujeto ni verbo conjugado; en cambio, si necesitas una oración completa, iría 'although'.",
            exampleEnglish: "Despite the heavy traffic, we arrived early.",
          },
          {
            label: "02 · Contraste con una oración completa",
            segments: [
              { label: "ALTHOUGH + SUJETO", token: "Although it was raining", tone: "violet" },
              { label: "Y VERBO CONJUGADO", token: "Although we were tired", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres contrastar dos ideas completas, cada una con sujeto y verbo, abre con 'although': 'Although the price was high, we signed'. La señal es que la primera parte tiene verbo conjugado; si solo hay un sustantivo, tendrías que decir 'despite'.",
            exampleEnglish: "Although the price was high, we signed.",
          },
        ],
        commonMistake: {
          wrong: "Despite of the rain.",
          wrongToken: "Despite of",
          correct: "Despite the rain.",
          correctToken: "Despite the rain",
          whySpanish: "'Despite' va solo sin 'of'. Si quieres usar 'of', di 'In spite of'.",
        },
        examples: [
          {
            english: "Despite the short deadline, we delivered high quality.",
            spanish: "A pesar del plazo tan corto, entregamos alta calidad.",
            pronunciationHint: "dispáit de short dédlain, ui delíverd jai kuáliti",
          },
          {
            english: "Although we encountered difficulties, we stayed on track.",
            spanish: "Aunque encontramos dificultades, nos mantuvimos en curso.",
            pronunciationHint: "oldóu ui enkáunterd dífikoltis, ui stéid on trak",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: A pesar de los desafíos, tuvimos éxito",
          targetTokens: ["Despite", "the", "challenges,", "we", "succeeded"],
          distractorTokens: ["Despite of", "Although the"],
          successTipSpanish: "¡Estructura de ensayo ejecutivo! 'Despite the challenges' sin el error de 'of'.",
          mistakeHintSpanish: "Usa 'Despite' directo seguido de 'the challenges, we succeeded'.",
        },
        voicePractice: {
          sentenceEnglish: "Despite the challenges, we delivered on time.",
          spanishMeaning: "A pesar de los desafíos, entregamos a tiempo.",
          pronunciationHint: "dispáit de chálendyis, ui delíverd on táim",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe párrafos argumentativos de alto nivel contrastando resultados con 'Despite'.",
        },
      },
    },

    // BASE 31: DESEOS Y REALIDADES ALTERNATIVAS (I wish + Past Simple)
    {
      title: "Deseos y Realidades Alternativas: I Wish + Pasado",
      focus: "Expresar deseos sobre situaciones actuales que quisiéramos que fueran diferentes",
      payload: {
        ruleTaglineSpanish:
          "Para decir 'Ojalá tuviera más tiempo' o 'Desearía saber la respuesta', usa 'I wish' seguido de Pasado Simple: I wish I had more time, I wish I knew. El pasado indica que la situación no es real hoy.",
        formulaSegments: [
          { label: "DESEARÍA / OJALÁ", token: "I wish", tone: "violet" },
          { label: "SITUACIÓN DESEADA (PASADO)", token: "I had more time · I knew the answer · we lived closer", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Desear algo distinto hoy",
            segments: [
              { label: "I WISH + PASADO", token: "I wish I had · I wish she were here", tone: "violet" },
              { label: "SITUACIÓN IRREAL HOY", token: "more time · speak French", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando deseas algo distinto en tu presente, usas 'I wish + pasado simple': 'I wish I had a bigger team'. La señal es que hoy no es así; el pasado marca distancia, no tiempo. Con presente dirías 'I hope', que sí espera algo posible.",
            exampleEnglish: "I wish I had a bigger office.",
          },
          {
            label: "02 · Arrepentirse de una decisión",
            segments: [
              { label: "I WISH + HAD DONE", token: "I wish I had studied", tone: "violet" },
              { label: "PASADO QUE YA NO CAMBIA", token: "wish we had asked", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el deseo apunta a algo que ya hiciste o no hiciste, el pasado se dobla: 'I wish I had studied more'. La señal es que la decisión ya ocurrió; en cambio, para el presente basta un pasado simple: 'I wish I studied medicine'.",
            exampleEnglish: "I wish we had asked for help.",
          },
        ],
        commonMistake: {
          wrong: "I wish I have more time today.",
          wrongToken: "wish I have",
          correct: "I wish I had more time today.",
          correctToken: "wish I had",
          whySpanish: "Para deseos sobre el presente, el verbo que sigue a 'wish' siempre va en pasado ('had').",
        },
        examples: [
          {
            english: "I wish I spoke more languages fluently.",
            spanish: "Desearía hablar más idiomas con fluidez.",
            pronunciationHint: "ai uísh ai spóuk mor lánguachis flúentli",
          },
          {
            english: "We wish we had started this initiative earlier.",
            spanish: "Desearíamos haber comenzado esta iniciativa antes.",
            pronunciationHint: "ui uísh ui jad stártid dis iníshiativ érli-er",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ojalá tuviera más tiempo hoy",
          targetTokens: ["I", "wish", "I", "had", "more", "time", "today"],
          distractorTokens: ["have", "will have"],
          successTipSpanish: "¡Sensibilidad y sutileza lingüística! 'I wish I had' es perfecto.",
          mistakeHintSpanish: "Después de 'I wish', pon la persona 'I' y el verbo en pasado 'had'.",
        },
        voicePractice: {
          sentenceEnglish: "I wish I knew the answer.",
          spanishMeaning: "Ojalá supiera la respuesta.",
          pronunciationHint: "ai uísh ai niú di ánser",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica reflexiones de líderes y autores que expresan visión con 'We wish we could...'.",
        },
      },
    },

    // BASE 32: EL SALTO CUÁNTICO A B2: EL TERCER CONDICIONAL
    {
      title: "El Salto Cuántico a B2: Tercer Condicional y Autonomía Fluida",
      focus: "La hipótesis sobre el pasado inmutable (If + Had Done, Would Have Done)",
      payload: {
        ruleTaglineSpanish:
          "¡Tu coronación hacia B2! El Tercer Condicional analiza qué habría pasado en una historia pasada si algo hubiera sido diferente: If I had known the answer, I would have told you (Si hubiera sabido, te habría dicho).",
        formulaSegments: [
          { label: "SI HUBIERA (HAD + PART)", token: "If I had known / If we had prepared", tone: "violet" },
          { label: "HABRÍA (WOULD HAVE + PART)", token: "I would have told you / we would have won", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Cambiar la hipótesis del pasado",
            segments: [
              { label: "IF + HAD + PARTICIPIO", token: "If I had checked · If we had planned", tone: "violet" },
              { label: "SIN WOULD EN EL IF", token: "nunca 'If I would have'", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando imaginas que algo pasado fue distinto, la condición va con 'had + participio': 'If I had checked the file'. La señal es la parte con 'if'; ahí nunca entra 'would have', que es justo el error que delata la traducción del español.",
            exampleEnglish: "If we had planned better, we would have won.",
          },
          {
            label: "02 · El resultado que no existió",
            segments: [
              { label: "WOULD HAVE + PARTICIPIO", token: "I would have told you · we would have won", tone: "violet" },
              { label: "SOLO EN EL RESULTADO", token: "nunca en la parte con 'if'", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando describes el resultado que no ocurrió, usas 'would have + participio': 'I would have called you'. La señal es que no es un hecho sino una consecuencia imaginaria; en cambio, en la parte con 'if' no va 'would', sino 'had'.",
            exampleEnglish: "The client would have approved the offer.",
          },
        ],
        commonMistake: {
          wrong: "If I would have known, I would have told you.",
          wrongToken: "If I would have known",
          correct: "If I had known, I would have told you.",
          correctToken: "If I had known",
          whySpanish: "Nunca pongas 'would have' en la parte con 'If': usa 'had + participio' ('If I had known').",
        },
        examples: [
          {
            english: "If we had left earlier, we would have caught the flight.",
            spanish: "Si hubiéramos salido antes, habríamos alcanzado el vuelo.",
            pronunciationHint: "if ui jad left érli-er, ui uúd jav kot de fláit",
          },
          {
            english: "She would have succeeded if she had received proper support.",
            spanish: "Ella habría tenido éxito si hubiera recibido el apoyo adecuado.",
            pronunciationHint: "shi uúd jav saksídid if shi jad risívd próper sapórt",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Si hubiera sabido esto, te lo habría dicho",
          targetTokens: ["If", "I", "had", "known", "this,", "I", "would", "have", "told", "you"],
          distractorTokens: ["would have known", "will tell"],
          successTipSpanish: "¡Graduación triunfal de Nivel B1! Conquistaste las 32 bases y entras a B2 con maestría.",
          mistakeHintSpanish: "Abre con 'If I had known this,' y formula el resultado con 'I would have told you'.",
        },
        voicePractice: {
          sentenceEnglish: "If I had known, I would have called you.",
          spanishMeaning: "Si hubiera sabido, te habría llamado.",
          pronunciationHint: "if ai jad nóun, ai uúd jav kold yu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "¡Nivel B1 culminado al 100%! Domina debates y análisis estratégicos al ingresar al Nivel B2.",
        },
      },
    },
  ];
}

