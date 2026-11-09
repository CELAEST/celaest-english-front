import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5SubjunctivePassive(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: SUBJUNTIVO MANDATIVO FORMAL
    {
      title: "El Subjuntivo Mandativo Formal: I insist that he BE present",
      focus: "Uso de la forma base pura sin flexión tras verbos de demanda (We recommend that she review...)",
      payload: {
        ruleTaglineSpanish:
          "En el registro formal británico y estadounidense, verbos de recomendación, urgencia o mandato (demand, insist, recommend, suggest, require) exigen que el verbo de la cláusula subordinada se mantenga en su FORMA BASE PURA, incluso con 'he/she/it': 'I insist that he BE on time' (jamás 'is').",
        formulaSegments: [
          { label: "VERBO DE DEMANDA", token: "The director demanded that", tone: "violet" },
          { label: "SUJETO TERCERA PERSONA", token: "the report / each delegate", tone: "emerald" },
          { label: "FORMA BASE PURA", token: "be submitted / attend the briefing", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Mandato sobre una persona: base sin -s",
            segments: [
              { label: "VERBO DE DEMANDA", token: "demand / insist / require that", tone: "violet" },
              { label: "PERSONA EN TERCERA", token: "he · she · the delegate", tone: "emerald" },
              { label: "FORMA BASE", token: "carry · submit · attend (sin -s)", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el sujeto de la cláusula es una sola persona (he, she, the delegate), el verbo queda en forma base sin -s. Señal: si delante hay un verbo de demanda, no conjugues. Contraste: 'he carries' es indicativo; aquí va 'that he carry'.",
            exampleEnglish: "The board requires that she submit the budget.",
          },
          {
            label: "02 · Prohibición formal: not antes de la base",
            segments: [
              { label: "DEMANDA NEGATIVA", token: "insist that · recommend that", tone: "violet" },
              { label: "NEGACIÓN", token: "not", tone: "emerald" },
              { label: "FORMA BASE", token: "not travel · not sign", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el mandato es una prohibición, la negación va con 'not' delante de la forma base, sin do ni don't. Señal: el 'not' no toca el verbo principal. Contraste: 'that she doesn't travel' es indicativo y pierde el tono formal.",
            exampleEnglish: "They insisted that she not travel alone.",
          },
          {
            label: "03 · Mandato en pasiva: be + participio",
            segments: [
              { label: "DEMANDA INSTITUCIONAL", token: "demand that · require that", tone: "violet" },
              { label: "SUJETO OBJETO", token: "all files / the report", tone: "emerald" },
              { label: "PASIVA EN BASE", token: "be archived · be signed", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando lo exigido no es una persona sino un documento o un proceso, la forma base es 'be' más participio. Señal: nunca 'is' ni 'was' después de la demanda. Contraste: 'the files are archived' describe un hecho; aquí es una exigencia.",
            exampleEnglish: "Management demands that all files be archived.",
          },
        ],
        commonMistake: {
          wrong: "The committee recommended that he attends the meeting.",
          wrongToken: "that he attends",
          correct: "The committee recommended that he attend the meeting.",
          correctToken: "that he attend",
          whySpanish: "En el subjuntivo formal no se añade '-s' a la tercera persona; se utiliza la raíz limpia del verbo.",
        },
        examples: [
          {
            english: "The director demanded that the preliminary report be submitted before five o'clock.",
            spanish: "El director exigió que el informe preliminar sea entregado antes de las cinco.",
            pronunciationHint: "de dairéktor dimánded dat de prilíminari ripórt bi submíted bifór fáiv oklók",
          },
          {
            english: "We strongly recommend that every participant review the safety protocols thoroughly.",
            spanish: "Recomendamos enfáticamente que cada participante revise minuciosamente los protocolos de seguridad.",
            pronunciationHint: "ui stróngli rékoménd dat évri partísipant riviú de séifti prótokols zórouli",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El director exigió que el informe sea entregado antes de las cinco",
          targetTokens: ["The", "director", "demanded", "that", "the", "report", "be", "submitted"],
          distractorTokens: ["was", "is", "submitting", "to"],
          successTipSpanish: "¡Subjuntivo mandativo exacto! 'be submitted' en forma base pura.",
          mistakeHintSpanish: "Mantén 'be' en forma base limpia: 'that the report be submitted'.",
        },
        voicePractice: {
          sentenceEnglish: "It is essential that each member be present at the opening session.",
          spanishMeaning: "Es esencial que cada miembro esté presente en la sesión de apertura.",
          pronunciationHint: "it is esénshal dat ich mémber bi prézent at di óupening séshon",
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
      focus: "Pasado con valor presente para indicar que algo debió haberse hecho antes (It's high time...)",
      payload: {
        ruleTaglineSpanish:
          "Para expresar que ya es hora de hacer algo y que debió haberse hecho hace rato, usa 'It is (high / about) time + Sujeto + Pasado simple': 'It's high time we addressed this challenge'. Aunque el verbo va en pasado ('addressed'), el significado se refiere al presente inmediato.",
        formulaSegments: [
          { label: "FÓRMULA DE URGENCIA", token: "It is high time / about time", tone: "violet" },
          { label: "SUJETO + PASADO IRREAL", token: "we addressed the root cause of this issue.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Urgencia inmediata: high time + pasado",
            segments: [
              { label: "FÓRMULA DE URGENCIA", token: "It is high time", tone: "violet" },
              { label: "SUJETO", token: "we / they / the team", tone: "emerald" },
              { label: "PASADO IRREAL", token: "revised · reviewed · stopped", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando algo debió hacerse ya y sigue pendiente, usa 'It is high time' más pasado simple. Señal: el verbo va en pasado aunque hable del presente. Contraste: 'it's time we revise' suena a traducción; el inglés pide 'we revised'.",
            exampleEnglish: "It's high time we revised that policy.",
          },
          {
            label: "02 · Reproche leve: about time",
            segments: [
              { label: "FÓRMULA SUAVE", token: "It is about time", tone: "violet" },
              { label: "HECHO ESPERADO", token: "they answered · he called", tone: "emerald" },
              { label: "MATIZ", token: "ya era hora, sin dureza", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando lo esperado llega tarde y querés marcar impaciencia sin dureza, usa 'It is about time'. Señal: mismo pasado irreal que 'high time', pero el tono es más coloquial. Contraste: 'high time' suena a reproche serio; 'about time' a alivio con ironía.",
            exampleEnglish: "It's about time they answered our email.",
          },
          {
            label: "03 · Sin sujeto nuevo: time + to",
            segments: [
              { label: "FÓRMULA", token: "It is time", tone: "violet" },
              { label: "INFINITIVO CON TO", token: "to close · to send", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando no necesitás un segundo sujeto y el que actúa es el mismo hablante o el grupo, la fórmula se cierra con infinitivo con 'to'. Señal: no aparece otro sujeto. Contraste: con sujeto propio ('we') necesitás pasado: 'we closed'.",
            exampleEnglish: "It's time to close the meeting.",
          },
        ],
        commonMistake: {
          wrong: "It is high time that we take action",
          wrongToken: "that we take",
          correct: "It is high time we took action.",
          correctToken: "we took action",
          whySpanish: "La fórmula 'It is high time' dispara un pasado irreal de urgencia obligatorio en inglés.",
        },
        examples: [
          {
            english: "It is high time we addressed the root cause of this persistent challenge honestly.",
            spanish: "Ya es hora de que abordemos la raíz de este persistente desafío con honestidad.",
            pronunciationHint: "it is jai táim ui adrést de rut kos ov dis persístent cháliny ónestli",
          },
          {
            english: "It's about time they made a clear, transparent public statement.",
            spanish: "Ya va siendo hora de que emitan una declaración pública clara y transparente.",
            pronunciationHint: "its abáut táim dei méid a klíer, transpérent páblik stéitment",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ya es hora de que abordemos la raíz del problema con honestidad",
          targetTokens: ["It", "is", "high", "time", "we", "addressed", "the", "root", "cause"],
          distractorTokens: ["take", "to", "address", "addressing"],
          successTipSpanish: "¡Urgencia británica impecable! 'It is high time we addressed...' con pasado subjuntivo.",
          mistakeHintSpanish: "Recuerda: 'It is high time we addressed...' (verbo en pasado).",
        },
        voicePractice: {
          sentenceEnglish: "It is high time we established clear accountability standards.",
          spanishMeaning: "Ya es hora de que establezcamos estándares claros de rendición de cuentas.",
          pronunciationHint: "it is jai táim ui estáblisht klíer akauntabíliti stándards",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula llamados a la acción constructivos con 'It is high time' en debates orales.",
        },
      },
    },

    // BASE 24: VERBOS DE PERCEPCIÓN (INFINITIVO VS GERUNDIO) - CHECKPOINT 3 ANCHOR
    {
      title: "Verbos de Percepción: I heard him explain vs I heard him explaining",
      focus: "Presenciar un hecho completo (base sin to) vs presenciarlo en desarrollo (-ing)",
      payload: {
        ruleTaglineSpanish:
          "Tras verbos de percepción (see, hear, notice, watch), el verbo que sigue define tu punto de vista: Si viste la acción completa de principio a fin, usa la forma base pura sin 'to': 'I saw her sign the document'. Si la viste en pleno desarrollo solo por un momento, usa '-ing': 'I saw her signing the papers'.",
        formulaSegments: [
          { label: "ACCIÓN COMPLETA (BASE)", token: "I heard the professor explain the whole theory", tone: "violet" },
          { label: "ACCIÓN EN PROGRESO (-ING)", token: "We watched the waves breaking against the cliffs", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Acción completa: base sin to",
            segments: [
              { label: "VERBO DE PERCEPCIÓN", token: "see · hear · watch", tone: "violet" },
              { label: "PERSONA", token: "her · the professor", tone: "emerald" },
              { label: "FORMA BASE", token: "sign · explain (sin to)", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando presenciaste la acción entera, de principio a fin, el verbo va en forma base sin 'to'. Señal: viste el final del acto. Contraste: con 'to' el inglés lo rechaza; 'I saw her to sign' no existe.",
            exampleEnglish: "I saw her sign the agreement.",
          },
          {
            label: "02 · Acción en curso: -ing",
            segments: [
              { label: "VERBO DE PERCEPCIÓN", token: "hear · notice · watch", tone: "violet" },
              { label: "PERSONA", token: "the team · him", tone: "emerald" },
              { label: "GERUNDIO", token: "discussing · working", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando solo captaste un momento de la acción porque seguía en desarrollo, usá -ing. Señal: no viste el comienzo ni el final, entraste a mitad. Contraste: la forma base presenta el acto cerrado; -ing lo muestra en marcha.",
            exampleEnglish: "We heard the team discussing the plan.",
          },
        ],
        commonMistake: {
          wrong: "I heard him to explain the concept during the seminar.",
          wrongToken: "him to explain",
          correct: "I heard him explain the concept during the seminar.",
          correctToken: "him explain",
          whySpanish: "Los verbos de percepción física jamás aceptan 'to' con el infinitivo.",
        },
        examples: [
          {
            english: "I heard the professor explain the entire theoretical model from start to finish.",
            spanish: "Escuché al profesor explicar el modelo teórico completo de principio a fin.",
            pronunciationHint: "ai yérd de profésor ekspléin di entáier diorétikal módel from start tu fínish",
          },
          {
            english: "We watched the skilled artisans crafting delicate ceramics with patient precision.",
            spanish: "Observamos a los hábiles artesanos elaborando cerámicas delicadas con paciente precisión.",
            pronunciationHint: "ui uótcht de skíld ártisans kráfting déliket serámiks uid péishent prezíshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Escuché al profesor explicar la teoría completa de principio a fin",
          targetTokens: ["I", "heard", "the", "professor", "explain", "the", "entire", "theory"],
          distractorTokens: ["to", "explaining", "explained", "explains"],
          successTipSpanish: "¡Acción presenciada de principio a fin! 'heard the professor explain' sin 'to'.",
          mistakeHintSpanish: "Usa la forma base limpia sin 'to': 'heard [alguien] explain'.",
        },
        voicePractice: {
          sentenceEnglish: "I watched the team present their findings to the executive board.",
          spanishMeaning: "Observé al equipo presentar sus hallazgos ante la junta directiva.",
          pronunciationHint: "ai uótcht de tim prezént der fáindings tu di igzékutiv bord",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza testimonios y crónicas periciales distinguiendo acciones completas de acciones en curso.",
        },
      },
    },

    // BASE 25: PASIVA IMPERSONAL E INSTITUCIONAL
    {
      title: "Pasiva Impersonal e Institucional: The policy is reported to have...",
      focus: "Objetividad y neutralidad informativa sin atribuir juicios personales (It is widely acknowledged that...)",
      payload: {
        ruleTaglineSpanish:
          "Para reportar hechos con rigor profesional sin decir 'People say', usa la pasiva institucional: 'The initiative is reported to have improved access'. Puedes formularlo con 'It is believed that...' o personalizándolo: '[Sujeto] is thought to be...'.",
        formulaSegments: [
          { label: "SUJETO INSTITUCIONAL", token: "The new framework is considered", tone: "violet" },
          { label: "INFINITIVO COMPUESTO", token: "to have brought significant stability to the region.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Fuente anónima: It is + participio + that",
            segments: [
              { label: "IMPRESONAL", token: "It is believed / It is said", tone: "violet" },
              { label: "CLÁUSULA COMPLETA", token: "that the market will recover", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el dato circula sin fuente identificable y querés neutralidad, abrí con 'It is' más participio y seguí con 'that'. Señal: no nombrás a nadie. Contraste: 'People say' señala a la gente; esta forma borra al hablante.",
            exampleEnglish: "It is believed that the market will recover.",
          },
          {
            label: "02 · Hecho anterior: to have + participio",
            segments: [
              { label: "SUJETO", token: "The company / The program", tone: "violet" },
              { label: "PASIVA DE REPORTE", token: "is reported / is said", tone: "emerald" },
              { label: "INFINITIVO COMPUESTO", token: "to have doubled profits", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el hecho reportado ocurrió antes del reporte, el infinitivo se vuelve compuesto: 'to have' más participio. Señal: el suceso ya terminó. Contraste: el infinitivo simple habla del presente; 'to have done' fija el pasado.",
            exampleEnglish: "The company is reported to have doubled profits.",
          },
          {
            label: "03 · Estado vigente: to be + adjetivo",
            segments: [
              { label: "SUJETO", token: "The system / The results", tone: "violet" },
              { label: "PASIVA DE REPORTE", token: "is understood / is thought", tone: "emerald" },
              { label: "INFINITIVO SIMPLE", token: "to be reliable", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando lo reportado es un estado actual y no un suceso terminado, usá 'to be' más adjetivo o sustantivo. Señal: describe cómo es algo hoy. Contraste: si el hecho ya pasó, cambiás a 'to have been'.",
            exampleEnglish: "The system is understood to be reliable.",
          },
        ],
        commonMistake: {
          wrong: "People say that the organization had success",
          wrongToken: "People say that",
          correct: "The organization is reported to have achieved great success.",
          correctToken: "is reported to have achieved",
          whySpanish: "La pasiva impersonal eleva la objetividad y neutralidad del informe.",
        },
        examples: [
          {
            english: "The new community program is considered to have a lasting positive impact on youth.",
            spanish: "Se considera que el nuevo programa comunitario tiene un impacto positivo duradero en la juventud.",
            pronunciationHint: "de niú komiúniti prógram is konsíderd tu jav a lásting pósitiv ímpakt on yúz",
          },
          {
            english: "It is widely acknowledged that ongoing professional development enhances overall performance.",
            spanish: "Se reconoce ampliamente que el desarrollo profesional continuo mejora el rendimiento general.",
            pronunciationHint: "it is uáidli aknóledzt dat óngóuing proféshonal divélopment enjánses óuverol perfórmans",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Se considera que el programa tiene un impacto positivo duradero",
          targetTokens: ["The", "program", "is", "considered", "to", "have", "positive", "lasting", "impact"],
          distractorTokens: ["people", "say", "has", "having"],
          successTipSpanish: "¡Elegancia institucional! 'The program is considered to have...' aporta neutralidad.",
          mistakeHintSpanish: "Ordena: 'The program is considered to have positive lasting impact'.",
        },
        voicePractice: {
          sentenceEnglish: "The strategy is understood to reflect the best global practices.",
          spanishMeaning: "Se entiende que la estrategia refleja las mejores prácticas globales.",
          pronunciationHint: "de strátedyi is anderstúd tu riflékt de best glóubal práktises",
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
      title: "Reporting Verbs de Precisión: Urge, apologize for, deny having done",
      focus: "Superar el plano 'He said that' transmitiendo la verdadera intención psicológica del orador",
      payload: {
        ruleTaglineSpanish:
          "Un hablante avanzado no repite 'said that' diez veces en un reporte. Usa verbos matizados: 'She apologized for being late' (se disculpó por), 'He urged the council to reconsider' (instó a), 'They denied having signed the paper' (negaron haber firmado). Cada verbo tiene su propio patrón sintáctico.",
        formulaSegments: [
          { label: "VERBO CON PREPOSICIÓN + ING", token: "She apologized for delaying the final review", tone: "violet" },
          { label: "VERBO CON OBJETO + TO", token: "He urged the delegates to reconsider their stance", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Disculpa formal: apologize for + -ing",
            segments: [
              { label: "VERBO DE REPORTE", token: "apologized", tone: "violet" },
              { label: "PREPOSICIÓN", token: "for", tone: "emerald" },
              { label: "GERUNDIO", token: "missing · delaying", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando reportás una disculpa por un hecho ya ocurrido, 'apologize' pide 'for' más gerundio. Señal: después de 'for' nunca va infinitivo. Contraste: 'said sorry that' es infantil; 'apologized for missing' es el estándar profesional.",
            exampleEnglish: "She apologized for missing the review.",
          },
          {
            label: "02 · Instar a actuar: urge + objeto + to",
            segments: [
              { label: "VERBO DE REPORTE", token: "urged / advised", tone: "violet" },
              { label: "PERSONA U ORGANISMO", token: "the board / the committee", tone: "emerald" },
              { label: "INFINITIVO CON TO", token: "to act · to reconsider", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando reportás presión para que otro haga algo, 'urge' exige objeto más infinitivo con 'to'. Señal: hay una persona que debe actuar. Contraste: 'apologize' y 'deny' no llevan objeto más 'to'; cada verbo tiene su patrón.",
            exampleEnglish: "He urged the board to act quickly.",
          },
          {
            label: "03 · Negar un hecho previo: deny + having",
            segments: [
              { label: "VERBO DE REPORTE", token: "denied", tone: "violet" },
              { label: "GERUNDIO COMPUESTO", token: "having", tone: "emerald" },
              { label: "PARTICIPIO", token: "disclosed · received", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien niega un hecho anterior al reporte, 'deny' se cierra con 'having' más participio. Señal: primero negó, el hecho fue antes. Contraste: 'denied to receive' no es inglés; 'denied having received' fija el orden temporal.",
            exampleEnglish: "They denied having received the payment.",
          },
        ],
        commonMistake: {
          wrong: "She said sorry that she arrived late",
          wrongToken: "said sorry that",
          correct: "She apologized for arriving late.",
          correctToken: "apologized for arriving",
          whySpanish: "El verbo 'apologize for + ing' es el estándar profesional para disculpas formales.",
        },
        examples: [
          {
            english: "She firmly denied having disclosed any proprietary details to third parties.",
            spanish: "Ella negó rotundamente haber revelado detalles confidenciales a terceros.",
            pronunciationHint: "shi férmli dináid jáving disklóuzd éni propráietari dítéils tu zérd pártis",
          },
          {
            english: "The senior advisor urged the committee to explore alternative funding sources.",
            spanish: "El asesor principal instó al comité a explorar fuentes alternativas de financiamiento.",
            pronunciationHint: "de sínior adváizor eryd de komíti tu eksplór oltérnativ fánding sórses",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ella negó rotundamente haber revelado los detalles confidenciales",
          targetTokens: ["She", "firmly", "denied", "having", "disclosed", "the", "confidential", "details"],
          distractorTokens: ["said", "not", "to", "disclose"],
          successTipSpanish: "¡Precisión psicológica! 'denied having disclosed' reporta el acto con nitidez.",
          mistakeHintSpanish: "Con 'deny' usa participio compuesto o gerundio: 'denied having disclosed...'.",
        },
        voicePractice: {
          sentenceEnglish: "He congratulated the entire committee on reaching a milestone.",
          spanishMeaning: "Felicitó a todo el comité por alcanzar un hito importante.",
          pronunciationHint: "ji kongrátyuléited di entáier komíti on ríching a máilstoun",
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

