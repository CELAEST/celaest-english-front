import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6DiscourseHedging(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: MARCADORES DE CONCESIÃ“N FORMAL (WHEREAS / NONETHELESS)
    {
      title: "Marcadores de ConcesiÃ³n Formal: Whereas / Nonetheless",
      focus: "Contrastar posturas opuestas con elegancia analÃ­tica (Some preferred X, whereas others...)",
      payload: {
        ruleTaglineSpanish:
          "Para comparar dos realidades contrastantes en una sola frase con rigor analÃ­tico, usa 'whereas' (mientras que) o 'nonetheless' (no obstante). Superas el repetitivo 'but' y le das a tu argumento la solidez de un editorial de prensa internacional.",
        formulaSegments: [
          { label: "POSTURA A", token: "Some participants favored the traditional approach,", tone: "violet" },
          { label: "CONTRASTE ANALÃTICO", token: "whereas others embraced modern innovation.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Some like this, in the other side others like that (calco errÃ³neo de 'por otro lado').",
          wrongToken: "in the other side",
          correct: "Some favor this approach, whereas others prefer that alternative.",
          correctToken: "whereas others prefer",
          whySpanish: "El conector 'whereas' vincula directamente dos alternativas contrastantes sin rodeos.",
        },
        examples: [
          {
            english: "Some participants favored the traditional approach, whereas others embraced innovation.",
            spanish: "Algunos participantes favorecieron el enfoque tradicional, mientras que otros acogieron la innovaciÃ³n.",
            pronunciationHint: "sam partÃ­sipants fÃ©ivord de tradÃ­shonal aprÃ³uch, uÃ©r-az Ã¡ders embrÃ©ist inovÃ©ishon",
          },
          {
            english: "The initial results were modest; nonetheless, the overarching trend remains highly encouraging.",
            spanish: "Los resultados iniciales fueron modestos; no obstante, la tendencia general sigue siendo muy alentadora.",
            pronunciationHint: "di inÃ­shal rizÃ³lts uÃ©r mÃ³dest; nÃ¡ndeless, di Ã³uverÃ¡rching trend rimÃ©ins jÃ¡ili enkÃ³ridying",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Algunos prefirieron el mÃ©todo tradicional, mientras que otros acogieron la innovaciÃ³n",
          targetTokens: ["Some", "preferred", "the", "traditional", "method,", "whereas", "others", "embraced", "innovation"],
          distractorTokens: ["but", "while", "preferring", "innovating"],
          successTipSpanish: "Â¡Contraste editorial impecable! 'whereas' vincula ambas perspectivas con rigor.",
          mistakeHintSpanish: "Une las clÃ¡usulas con 'whereas others embraced innovation'.",
        },
        voicePractice: {
          sentenceEnglish: "The challenges were significant; nonetheless, the team delivered excellence.",
          spanishMeaning: "Los desafÃ­os fueron significativos; no obstante, el equipo entregÃ³ excelencia.",
          pronunciationHint: "de chÃ¡linyis uÃ©r signÃ­fikant; nÃ¡ndeless, de tim delÃ­verd Ã©kselens",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Lee ensayos analÃ­ticos y artÃ­culos de opiniÃ³n en The Economist con conectores de concesiÃ³n.",
        },
      },
    },

    // BASE 28: MARCADORES DE REFORMULACIÃ“N Y PRECISIÃ“N
    {
      title: "ReformulaciÃ³n y PrecisiÃ³n: To put it another way / That is to say",
      focus: "Aclarar ideas complejas sin sonar condescendiente (To put it another way...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando explicas un concepto denso y quieres sintetizarlo para tu interlocutor, no digas 'I mean' (muy informal). Usa marcadores de precisiÃ³n ejecutiva: 'To put it another way' (dicho de otra manera) o 'That is to say' (es decir).",
        formulaSegments: [
          { label: "IDEA COMPLEJA PREVIA", token: "We need to optimize resource allocation.", tone: "violet" },
          { label: "CONECTOR DE PRECISIÃ“N", token: "To put it another way,", tone: "emerald" },
          { label: "SÃNTESIS CLARA", token: "we must prioritize long-term quality over speed.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I mean, what I want to say is that we must focus (demasiado coloquial).",
          wrongToken: "I mean, what I want to say",
          correct: "To put it another way, we must prioritize core quality.",
          correctToken: "To put it another way",
          whySpanish: "'To put it another way' proyecta claridad de pensamiento y respeto por la inteligencia del oyente.",
        },
        examples: [
          {
            english: "To put it another way, we must prioritize durability over immediate convenience.",
            spanish: "Dicho de otra manera, debemos priorizar la durabilidad sobre la conveniencia inmediata.",
            pronunciationHint: "tu put it anÃ¡der uÃ©i, ui mast praiÃ³ritÃ¡iz diÃºrabilÃ­ti Ã³uver imÃ­diet konvÃ­niens",
          },
          {
            english: "Every contributor retains complete autonomy; that is to say, participation is entirely voluntary.",
            spanish: "Cada colaborador conserva total autonomÃ­a; es decir, la participaciÃ³n es enteramente voluntaria.",
            pronunciationHint: "Ã©vri kontrÃ­biutor ritÃ©ins komplÃ­t otÃ³nomi; dat is tu sÃ©i, partÃ­sipÃ©ishon is entÃ¡ierli vÃ³lantari",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Dicho de otra manera, debemos priorizar la calidad sobre la velocidad",
          targetTokens: ["To", "put", "it", "another", "way,", "we", "must", "prioritize", "quality"],
          distractorTokens: ["I", "mean", "putting", "prioritizing"],
          successTipSpanish: "Â¡ReformulaciÃ³n ejecutiva! 'To put it another way,' sintetiza con tacto.",
          mistakeHintSpanish: "Abre con 'To put it another way, we must prioritize quality'.",
        },
        voicePractice: {
          sentenceEnglish: "To put it another way, clarity must precede speed in every initiative.",
          spanishMeaning: "Dicho de otra manera, la claridad debe preceder a la velocidad en cada iniciativa.",
          pronunciationHint: "tu put it anÃ¡der uÃ©i, klÃ¡riti mast prisÃ­d spid in Ã©vri inÃ­shietiv",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos argumentativos reformulando tesis complejas con elegancia en Writing Studio.",
        },
      },
    },

    // BASE 29: EL ARTE DEL HEDGING (DIPLOMACIA Y CAUTELA PROFESIONAL)
    {
      title: "El Arte del Hedging: Arguably / It would appear that...",
      focus: "Elegancia diplomÃ¡tica evitando afirmaciones tajantes (It would seem that...)",
      payload: {
        ruleTaglineSpanish:
          "En el mundo profesional anglosajÃ³n, afirmar cosas de manera dogmÃ¡tica ('This is wrong' / 'This is the best') se percibe como tosco. El 'hedging' modera tu afirmaciÃ³n con diplomacia cientÃ­fica: 'It would appear that this assumption is inaccurate' o 'Arguably, this is the most balanced solution'.",
        formulaSegments: [
          { label: "MODIFICADOR DIPLOMÃTICO", token: "Arguably / It would appear that", tone: "violet" },
          { label: "PROPUESTA O EVALUACIÃ“N", token: "this is the most sustainable approach we have evaluated.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "This is completely wrong and unacceptable (demasiado confrontativo).",
          wrongToken: "is completely wrong",
          correct: "It would appear that this conclusion requires further verification.",
          correctToken: "It would appear that",
          whySpanish: "El 'hedging' no es debilidad: es el sello de los profesionales que debaten con madurez e inteligencia emocional.",
        },
        examples: [
          {
            english: "Arguably, this is the most sustainable approach we have evaluated so far.",
            spanish: "PodrÃ­a decirse que este es el enfoque mÃ¡s sostenible que hemos evaluado hasta ahora.",
            pronunciationHint: "Ã¡rgiuabli, dis is de mÃ³ust sostÃ©inabl aprÃ³uch ui jav ivÃ¡liueited sou far",
          },
          {
            english: "The preliminary findings tend to suggest that gradual adaptation yields stronger resilience.",
            spanish: "Los hallazgos preliminares tienden a sugerir que la adaptaciÃ³n gradual genera mayor resiliencia.",
            pronunciationHint: "de prilÃ­minari fÃ¡indings tend tu sadyÃ©st dat grÃ¡dyual adaptÃ©ishon yilds strÃ³nger rizÃ­liens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: PodrÃ­a decirse que este es el enfoque mÃ¡s sostenible considerado",
          targetTokens: ["Arguably,", "this", "is", "the", "most", "sustainable", "approach", "considered"],
          distractorTokens: ["Sure", "absolute", "approaching", "is"],
          successTipSpanish: "Â¡Diplomacia cientÃ­fica! 'Arguably, this is the most sustainable...' aporta matiz reflexivo.",
          mistakeHintSpanish: "Inicia con el adverbio de matiz 'Arguably, this is...'.",
        },
        voicePractice: {
          sentenceEnglish: "It would appear that our initial estimates were slightly conservative.",
          spanishMeaning: "ParecerÃ­a que nuestras estimaciones iniciales fueron ligeramente conservadoras.",
          pronunciationHint: "it uud apÃ­er dat Ã¡uer inÃ­shal Ã©stimÃ¡its uÃ©r slÃ¡itli konsÃ©rvativ",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Defiende posturas en debates internacionales aplicando hedging para moderar opiniones.",
        },
      },
    },

    // BASE 30: COLOCACIONES AVANZADAS Y BINOMIOS IDIOMÃTICOS
    {
      title: "Binomios IdiomÃ¡ticos Naturales: Give and take / Safe and sound",
      focus: "Frases emparejadas fijas de orden inmutable (pros and cons, give and take)",
      payload: {
        ruleTaglineSpanish:
          "El inglÃ©s tiene parejas de palabras unidas por 'and' cuyo orden es sagrado e inmutable: 'give and take' (concesiones mutuas), 'pros and cons' (ventajas y desventajas), 'safe and sound' (sano y salvo), 'ups and downs' (altibajos). Cambiar el orden ('cons and pros') delata inmediatamente a un principiante.",
        formulaSegments: [
          { label: "SUJETO O CONTEXTO", token: "Any successful partnership requires", tone: "violet" },
          { label: "BINOMIO INMUTABLE", token: "a healthy degree of give and take.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "We weighed the cons and pros of the proposal.",
          wrongToken: "cons and pros",
          correct: "We weighed the pros and cons of the proposal.",
          correctToken: "pros and cons",
          whySpanish: "El orden de los binomios es fijo por convenciÃ³n fonÃ©tica y rÃ­tmica.",
        },
        examples: [
          {
            english: "Any genuine collaboration requires a healthy dose of give and take.",
            spanish: "Cualquier colaboraciÃ³n genuina requiere una dosis saludable de concesiones mutuas.",
            pronunciationHint: "Ã©ni yÃ©niuin kolÃ¡boreishon rikuÃ¡iers a jÃ©lzi dous ov giv and tÃ©ik",
          },
          {
            english: "Despite the turbulent journey, all team members arrived safe and sound.",
            spanish: "A pesar del viaje turbulento, todos los miembros del equipo llegaron sanos y salvos.",
            pronunciationHint: "dispÃ¡it de tÃ©rbiulent yÃ©rni, ol tim mÃ©mbers arrÃ¡ivd sÃ©if and sÃ¡und",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Toda negociaciÃ³n requiere una buena dosis de concesiones mutuas",
          targetTokens: ["Any", "negotiation", "requires", "a", "healthy", "dose", "of", "give", "and", "take"],
          distractorTokens: ["take", "and", "give", "giving"],
          successTipSpanish: "Â¡Naturalidad idiomÃ¡tica! 'give and take' con su orden inmutable.",
          mistakeHintSpanish: "El orden correcto es siempre 'give and take'.",
        },
        voicePractice: {
          sentenceEnglish: "We carefully evaluated all the pros and cons before committing.",
          spanishMeaning: "Evaluamos minuciosamente todos los pros y contras antes de comprometernos.",
          pronunciationHint: "ui kÃ©rfuli ivÃ¡liueited ol de pros and kons bifÃ³r komÃ­ting",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica binomios y colocaciones idiomÃ¡ticas en crÃ³nicas y literatura contemporÃ¡nea.",
        },
      },
    },

    // BASE 31: PREGUNTAS RETÃ“RICAS Y Ã‰NFASIS ORATORIO
    {
      title: "Preguntas RetÃ³ricas y Ã‰nfasis RÃ­tmico: Is it really worth...?",
      focus: "Guiar la conclusiÃ³n del oyente y generar impacto reflexivo (Is it really worth the risk?)",
      payload: {
        ruleTaglineSpanish:
          "Una pregunta retÃ³rica no busca una respuesta, sino plantar una certeza irrefutable en la mente del interlocutor: 'Is it really worth compromising our integrity for short-term gain?'. Combina auxiliar inicial con modulaciÃ³n rÃ­tmica para inspirar convicciÃ³n.",
        formulaSegments: [
          { label: "PREGUNTA RETÃ“RICA", token: "Is it really worth compromising", tone: "violet" },
          { label: "CONTRASTE Ã‰TICO/ESTRATÃ‰GICO", token: "our core values for a temporary gain?", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "It is worth compromising? (entonaciÃ³n plana sin Ã©nfasis auxiliar).",
          wrongToken: "It is worth",
          correct: "Is it really worth compromising our standards?",
          correctToken: "Is it really worth",
          whySpanish: "Las preguntas retÃ³ricas exigen el orden interrogativo estricto con el adverbio 'really' para mÃ¡xima fuerza.",
        },
        examples: [
          {
            english: "Is it really worth compromising our foundational values for a temporary advantage?",
            spanish: "Â¿Acaso vale la pena comprometer nuestros valores fundamentales por una ventaja temporal?",
            pronunciationHint: "is it rÃ­eli uÃ©rz kÃ³mpramÃ¡ising Ã¡uer faundÃ©ishonal vÃ¡lius for a tÃ©mporari advÃ¡ntidzh",
          },
          {
            english: "Why on earth would anyone overlook such a transparent inconsistency?",
            spanish: "Â¿Por quÃ© demonios pasarÃ­a alguien por alto una inconsistencia tan evidente?",
            pronunciationHint: "uÃ¡i on Ã©rz uud Ã©niuan Ã³uverluk sach a transpÃ©rent Ã­nkonsÃ­stensi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Â¿Acaso vale la pena comprometer nuestros valores por un beneficio breve?",
          targetTokens: ["Is", "it", "really", "worth", "compromising", "our", "values", "for", "short-term", "gain?"],
          distractorTokens: ["It", "worth", "compromise", "to"],
          successTipSpanish: "Â¡Fuerza oratoria! 'Is it really worth compromising...' planta la reflexiÃ³n.",
          mistakeHintSpanish: "Ordena: 'Is it really worth compromising our values for short-term gain?'.",
        },
        voicePractice: {
          sentenceEnglish: "Is it really worth sacrificing quality for immediate convenience?",
          spanishMeaning: "Â¿Acaso vale la pena sacrificar la calidad por conveniencia inmediata?",
          pronunciationHint: "is it rÃ­eli uÃ©rz sÃ¡krifÃ¡ising kuÃ³liti for imÃ­diet konvÃ­niens",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Cierra tus ensayos y artÃ­culos de opiniÃ³n con preguntas retÃ³ricas de alto impacto.",
        },
      },
    },

    // BASE 32: GRAN CERTIFICACIÃ“N B2 / PUENTE DEFINITIVO A C1
    {
      title: "Gran CertificaciÃ³n B2: El Salto Definitivo a C1",
      focus: "IntegraciÃ³n de oratoria, inversiÃ³n, condicional contrafÃ¡ctico y diplomacia ejecutiva",
      payload: {
        ruleTaglineSpanish:
          "Esta es la cÃºspide de B2. Has dominado las inversiones retÃ³ricas ('Rarely have we...'), las oraciones hendidas ('What we need...'), los condicionales mixtos ('Had we known...') y el arte diplomÃ¡tico del hedging. Ya no traduces: formulas argumentos con elegancia, precisiÃ³n y autoridad.",
        formulaSegments: [
          { label: "INVERSIÃ“N INICIAL", token: "Rarely have we encountered such complexity.", tone: "violet" },
          { label: "CLEFT FOCUS", token: "What matters now is that we proceed with absolute clarity.", tone: "emerald" },
          { label: "HIPÃ“TESIS AVANZADA", token: "Had we acted earlier, our position would be even stronger.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Recaer en estructuras simples de A2/B1 por temor a la sofisticaciÃ³n.",
          wrongToken: "recaer en bÃ¡sico",
          correct: "Usar inversiÃ³n, reducciÃ³n de participios y hedging de manera espontÃ¡nea.",
          correctToken: "espontaneidad C1",
          whySpanish: "El estudiante C1 se distingue por su variedad sintÃ¡ctica y su naturalidad reflexiva sin vacilaciones.",
        },
        examples: [
          {
            english: "Rarely have we faced such an intricate challenge. What we must do now is proceed with measured caution.",
            spanish: "Raramente hemos enfrentado un desafÃ­o tan intrincado. Lo que debemos hacer ahora es avanzar con cautela medida.",
            pronunciationHint: "rÃ©rli jav ui fÃ©ist sach an Ã­ntriket chÃ¡liny. uot ui mast du nÃ¡u is prosÃ­d uid mÃ©shurd kÃ³shon",
          },
          {
            english: "Had we foreseen this global shift, our community would be in an even stronger position today.",
            spanish: "Si hubiÃ©ramos previsto este cambio global, nuestra comunidad estarÃ­a hoy en una posiciÃ³n aÃºn mÃ¡s sÃ³lida.",
            pronunciationHint: "jad ui forsÃ­n dis glÃ³ubal shift, Ã¡uer komiÃºniti uud bi in an Ã­ven strÃ³nger pozÃ­shon tudÃ©i",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Raramente hemos enfrentado tal desafÃ­o. Lo que debemos hacer ahora es avanzar con cautela",
          targetTokens: ["Rarely", "have", "we", "faced", "such", "a", "challenge.", "What", "we", "must", "do", "is", "proceed", "with", "caution"],
          distractorTokens: ["we", "have", "that", "proceeding"],
          successTipSpanish: "Â¡MaestrÃ­a B2 certificada! InversiÃ³n retÃ³rica y cleft sentence combinadas a la perfecciÃ³n.",
          mistakeHintSpanish: "Combina: 'Rarely have we faced such a challenge. What we must do is proceed with caution'.",
        },
        voicePractice: {
          sentenceEnglish: "Rarely have we seen such dedication. What matters now is maintaining our momentum.",
          spanishMeaning: "Raramente hemos visto tanta dedicaciÃ³n. Lo que importa ahora es mantener nuestro impulso.",
          pronunciationHint: "rÃ©rli jav ui sin sach dedikÃ©ishon. uot mÃ¡ters nÃ¡u is mÃ©intÃ©ining Ã¡uer momÃ©ntam",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Demuestra tu fluidez avanzada en una conversaciÃ³n de graduaciÃ³n B2 con el mentor Gonzalo.",
        },
      },
    },
  ];
}

