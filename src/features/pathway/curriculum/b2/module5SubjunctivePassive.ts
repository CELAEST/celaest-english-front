import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5SubjunctivePassive(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: SUBJUNTIVO MANDATIVO FORMAL
    {
      title: "El Subjuntivo Mandativo Formal: I insist that he BE present",
      focus: "Uso de la forma base pura sin flexiÃ³n tras verbos de demanda (We recommend that she review...)",
      payload: {
        ruleTaglineSpanish:
          "En el registro formal britÃ¡nico y estadounidense, verbos de recomendaciÃ³n, urgencia o mandato (demand, insist, recommend, suggest, require) exigen que el verbo de la clÃ¡usula subordinada se mantenga en su FORMA BASE PURA, incluso con 'he/she/it': 'I insist that he BE on time' (jamÃ¡s 'is').",
        formulaSegments: [
          { label: "VERBO DE DEMANDA", token: "The director demanded that", tone: "violet" },
          { label: "SUJETO TERCERA PERSONA", token: "the report / each delegate", tone: "emerald" },
          { label: "FORMA BASE PURA", token: "be submitted / attend the briefing", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The committee recommended that he attends the meeting.",
          wrongToken: "that he attends",
          correct: "The committee recommended that he attend the meeting.",
          correctToken: "that he attend",
          whySpanish: "En el subjuntivo formal no se aÃ±ade '-s' a la tercera persona; se utiliza la raÃ­z limpia del verbo.",
        },
        examples: [
          {
            english: "The director demanded that the preliminary report be submitted before five o'clock.",
            spanish: "El director exigiÃ³ que el informe preliminar sea entregado antes de las cinco.",
            pronunciationHint: "de dairÃ©ktor dimÃ¡nded dat de prilÃ­minari ripÃ³rt bi submÃ­ted bifÃ³r fÃ¡iv oklÃ³k",
          },
          {
            english: "We strongly recommend that every participant review the safety protocols thoroughly.",
            spanish: "Recomendamos enfÃ¡ticamente que cada participante revise minuciosamente los protocolos de seguridad.",
            pronunciationHint: "ui strÃ³ngli rÃ©komÃ©nd dat Ã©vri partÃ­sipant riviÃº de sÃ©ifti prÃ³tokols zÃ³rouli",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: El director exigiÃ³ que el informe sea entregado antes de las cinco",
          targetTokens: ["The", "director", "demanded", "that", "the", "report", "be", "submitted"],
          distractorTokens: ["was", "is", "submitting", "to"],
          successTipSpanish: "Â¡Subjuntivo mandativo exacto! 'be submitted' en forma base pura.",
          mistakeHintSpanish: "MantÃ©n 'be' en forma base limpia: 'that the report be submitted'.",
        },
        voicePractice: {
          sentenceEnglish: "It is essential that each member be present at the opening session.",
          spanishMeaning: "Es esencial que cada miembro estÃ© presente en la sesiÃ³n de apertura.",
          pronunciationHint: "it is esÃ©nshal dat ich mÃ©mber bi prÃ©zent at di Ã³upening sÃ©shon",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Redacta peticiones formales y resoluciones usando el subjuntivo mandativo en Writing Studio.",
        },
      },
    },

    // BASE 23: ESTRUCTURAS CON IT'S (HIGH) TIME
    {
      title: "Urgencia y Reproche Constructivo: It's high time we took action",
      focus: "Pasado con valor presente para indicar que algo debiÃ³ haberse hecho antes (It's high time...)",
      payload: {
        ruleTaglineSpanish:
          "Para expresar que ya es hora de hacer algo y que debiÃ³ haberse hecho hace rato, usa 'It is (high / about) time + Sujeto + Pasado simple': 'It's high time we addressed this challenge'. Aunque el verbo va en pasado ('addressed'), el significado se refiere al presente inmediato.",
        formulaSegments: [
          { label: "FÃ“RMULA DE URGENCIA", token: "It is high time / about time", tone: "violet" },
          { label: "SUJETO + PASADO IRREAL", token: "we addressed the root cause of this issue.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "It is high time that we take action (usar presente).",
          wrongToken: "that we take",
          correct: "It is high time we took action.",
          correctToken: "we took action",
          whySpanish: "La fÃ³rmula 'It is high time' dispara un pasado irreal de urgencia obligatorio en inglÃ©s.",
        },
        examples: [
          {
            english: "It is high time we addressed the root cause of this persistent challenge honestly.",
            spanish: "Ya es hora de que abordemos la raÃ­z de este persistente desafÃ­o con honestidad.",
            pronunciationHint: "it is jai tÃ¡im ui adrÃ©st de rut kos ov dis persÃ­stent chÃ¡liny Ã³nestli",
          },
          {
            english: "It's about time they made a clear, transparent public statement.",
            spanish: "Ya va siendo hora de que emitan una declaraciÃ³n pÃºblica clara y transparente.",
            pronunciationHint: "its abÃ¡ut tÃ¡im dei mÃ©id a klÃ­er, transpÃ©rent pÃ¡blik stÃ©itment",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Ya es hora de que abordemos la raÃ­z del problema con honestidad",
          targetTokens: ["It", "is", "high", "time", "we", "addressed", "the", "root", "cause"],
          distractorTokens: ["take", "to", "address", "addressing"],
          successTipSpanish: "Â¡Urgencia britÃ¡nica impecable! 'It is high time we addressed...' con pasado subjuntivo.",
          mistakeHintSpanish: "Recuerda: 'It is high time we addressed...' (verbo en pasado).",
        },
        voicePractice: {
          sentenceEnglish: "It is high time we established clear accountability standards.",
          spanishMeaning: "Ya es hora de que establezcamos estÃ¡ndares claros de rendiciÃ³n de cuentas.",
          pronunciationHint: "it is jai tÃ¡im ui estÃ¡blisht klÃ­er akauntabÃ­liti stÃ¡ndards",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula llamados a la acciÃ³n constructivos con 'It is high time' en debates orales.",
        },
      },
    },

    // BASE 24: VERBOS DE PERCEPCIÃ“N (INFINITIVO VS GERUNDIO) - CHECKPOINT 3 ANCHOR
    {
      title: "Verbos de PercepciÃ³n: I heard him explain vs I heard him explaining",
      focus: "Presenciar un hecho completo (base sin to) vs presenciarlo en desarrollo (-ing)",
      payload: {
        ruleTaglineSpanish:
          "Tras verbos de percepciÃ³n (see, hear, notice, watch), el verbo que sigue define tu punto de vista: Si viste la acciÃ³n completa de principio a fin, usa la forma base pura sin 'to': 'I saw her sign the document'. Si la viste en pleno desarrollo solo por un momento, usa '-ing': 'I saw her signing the papers'.",
        formulaSegments: [
          { label: "ACCIÃ“N COMPLETA (BASE)", token: "I heard the professor explain the whole theory", tone: "violet" },
          { label: "ACCIÃ“N EN PROGRESO (-ING)", token: "We watched the waves breaking against the cliffs", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I heard him to explain the concept during the seminar.",
          wrongToken: "him to explain",
          correct: "I heard him explain the concept during the seminar.",
          correctToken: "him explain",
          whySpanish: "Los verbos de percepciÃ³n fÃ­sica jamÃ¡s aceptan 'to' con el infinitivo.",
        },
        examples: [
          {
            english: "I heard the professor explain the entire theoretical model from start to finish.",
            spanish: "EscuchÃ© al profesor explicar el modelo teÃ³rico completo de principio a fin.",
            pronunciationHint: "ai yÃ©rd de profÃ©sor eksplÃ©in di entÃ¡ier diorÃ©tikal mÃ³del from start tu fÃ­nish",
          },
          {
            english: "We watched the skilled artisans crafting delicate ceramics with patient precision.",
            spanish: "Observamos a los hÃ¡biles artesanos elaborando cerÃ¡micas delicadas con paciente precisiÃ³n.",
            pronunciationHint: "ui uÃ³tcht de skÃ­ld Ã¡rtisans krÃ¡fting dÃ©liket serÃ¡miks uid pÃ©ishent prezÃ­shon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: EscuchÃ© al profesor explicar la teorÃ­a completa de principio a fin",
          targetTokens: ["I", "heard", "the", "professor", "explain", "the", "entire", "theory"],
          distractorTokens: ["to", "explaining", "explained", "explains"],
          successTipSpanish: "Â¡AcciÃ³n presenciada de principio a fin! 'heard the professor explain' sin 'to'.",
          mistakeHintSpanish: "Usa la forma base limpia sin 'to': 'heard [alguien] explain'.",
        },
        voicePractice: {
          sentenceEnglish: "I watched the team present their findings to the executive board.",
          spanishMeaning: "ObservÃ© al equipo presentar sus hallazgos ante la junta directiva.",
          pronunciationHint: "ai uÃ³tcht de tim prezÃ©nt der fÃ¡indings tu di igzÃ©kutiv bord",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza testimonios y crÃ³nicas periciales distinguiendo acciones completas de acciones en curso.",
        },
      },
    },

    // BASE 25: PASIVA IMPERSONAL E INSTITUCIONAL
    {
      title: "Pasiva Impersonal e Institucional: The policy is reported to have...",
      focus: "Objetividad y neutralidad informativa sin atribuir juicios personales (It is widely acknowledged that...)",
      payload: {
        ruleTaglineSpanish:
          "Para reportar hechos con rigor profesional sin decir 'People say', usa la pasiva institucional: 'The initiative is reported to have improved access'. Puedes formularlo con 'It is believed that...' o personalizÃ¡ndolo: '[Sujeto] is thought to be...'.",
        formulaSegments: [
          { label: "SUJETO INSTITUCIONAL", token: "The new framework is considered", tone: "violet" },
          { label: "INFINITIVO COMPUESTO", token: "to have brought significant stability to the region.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "People say that the organization had success (estilo coloquial).",
          wrongToken: "People say that",
          correct: "The organization is reported to have achieved great success.",
          correctToken: "is reported to have achieved",
          whySpanish: "La pasiva impersonal eleva la objetividad y neutralidad del informe.",
        },
        examples: [
          {
            english: "The new community program is considered to have a lasting positive impact on youth.",
            spanish: "Se considera que el nuevo programa comunitario tiene un impacto positivo duradero en la juventud.",
            pronunciationHint: "de niÃº komiÃºniti prÃ³gram is konsÃ­derd tu jav a lÃ¡sting pÃ³sitiv Ã­mpakt on yÃºz",
          },
          {
            english: "It is widely acknowledged that ongoing professional development enhances overall performance.",
            spanish: "Se reconoce ampliamente que el desarrollo profesional continuo mejora el rendimiento general.",
            pronunciationHint: "it is uÃ¡idli aknÃ³ledzt dat Ã³ngÃ³uing profÃ©shonal divÃ©lopment enjÃ¡nses Ã³uverol perfÃ³rmans",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Se considera que el programa tiene un impacto positivo duradero",
          targetTokens: ["The", "program", "is", "considered", "to", "have", "positive", "lasting", "impact"],
          distractorTokens: ["people", "say", "has", "having"],
          successTipSpanish: "Â¡Elegancia institucional! 'The program is considered to have...' aporta neutralidad.",
          mistakeHintSpanish: "Ordena: 'The program is considered to have positive lasting impact'.",
        },
        voicePractice: {
          sentenceEnglish: "The strategy is understood to reflect the best global practices.",
          spanishMeaning: "Se entiende que la estrategia refleja las mejores prÃ¡cticas globales.",
          pronunciationHint: "de strÃ¡tedyi is anderstÃºd tu riflÃ©kt de best glÃ³ubal prÃ¡ktises",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe informes ejecutivos e institucionales con pasiva impersonal en Writing Studio.",
        },
      },
    },

    // BASE 26: REPORTING VERBS AVANZADOS
    {
      title: "Reporting Verbs de PrecisiÃ³n: Urge, apologize for, deny having done",
      focus: "Superar el plano 'He said that' transmitiendo la verdadera intenciÃ³n psicolÃ³gica del orador",
      payload: {
        ruleTaglineSpanish:
          "Un hablante avanzado no repite 'said that' diez veces en un reporte. Usa verbos matizados: 'She apologized for being late' (se disculpÃ³ por), 'He urged the council to reconsider' (instÃ³ a), 'They denied having signed the paper' (negaron haber firmado). Cada verbo tiene su propio patrÃ³n sintÃ¡ctico.",
        formulaSegments: [
          { label: "VERBO CON PREPOSICIÃ“N + ING", token: "She apologized for delaying the final review", tone: "violet" },
          { label: "VERBO CON OBJETO + TO", token: "He urged the delegates to reconsider their stance", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "She said sorry that she arrived late (estilo infantil).",
          wrongToken: "said sorry that",
          correct: "She apologized for arriving late.",
          correctToken: "apologized for arriving",
          whySpanish: "El verbo 'apologize for + ing' es el estÃ¡ndar profesional para disculpas formales.",
        },
        examples: [
          {
            english: "She firmly denied having disclosed any proprietary details to third parties.",
            spanish: "Ella negÃ³ rotundamente haber revelado detalles confidenciales a terceros.",
            pronunciationHint: "shi fÃ©rmli dinÃ¡id jÃ¡ving disklÃ³uzd Ã©ni proprÃ¡ietari dÃ­tÃ©ils tu zÃ©rd pÃ¡rtis",
          },
          {
            english: "The senior advisor urged the committee to explore alternative funding sources.",
            spanish: "El asesor principal instÃ³ al comitÃ© a explorar fuentes alternativas de financiamiento.",
            pronunciationHint: "de sÃ­nior advÃ¡izor eryd de komÃ­ti tu eksplÃ³r oltÃ©rnativ fÃ¡nding sÃ³rses",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Ella negÃ³ rotundamente haber revelado los detalles confidenciales",
          targetTokens: ["She", "firmly", "denied", "having", "disclosed", "the", "confidential", "details"],
          distractorTokens: ["said", "not", "to", "disclose"],
          successTipSpanish: "Â¡PrecisiÃ³n psicolÃ³gica! 'denied having disclosed' reporta el acto con nitidez.",
          mistakeHintSpanish: "Con 'deny' usa participio compuesto o gerundio: 'denied having disclosed...'.",
        },
        voicePractice: {
          sentenceEnglish: "He congratulated the entire committee on reaching a milestone.",
          spanishMeaning: "FelicitÃ³ a todo el comitÃ© por alcanzar un hito importante.",
          pronunciationHint: "ji kongrÃ¡tyulÃ©ited di entÃ¡ier komÃ­ti on rÃ­ching a mÃ¡ilstoun",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Sintetiza intervenciones de reuniones y declaraciones ajenas usando verbos de reporte avanzados.",
        },
      },
    },
  ];
}

