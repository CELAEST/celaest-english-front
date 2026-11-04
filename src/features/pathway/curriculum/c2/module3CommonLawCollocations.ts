import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3CommonLawCollocations(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: BINOMIOS Y TRINOMIOS DE LA COMMON LAW
    {
      title: "Binomios de la Common Law: Part and parcel / Null and void",
      focus: "Dominar las parejas gemelas de la tradición jurídica anglosajona que denotan rigor contractual",
      payload: {
        ruleTaglineSpanish:
          "El inglés formal está impregnado de fórmulas dobles originadas en la tradición jurídica anglosajona: 'part and parcel' (parte consustancial e inseparable), 'null and void' (nulo de pleno derecho), 'aid and abet' (ayudar y encubrir), 'lock, stock, and barrel' (en su totalidad absoluta). Su orden léxico es sagrado.",
        formulaSegments: [
          { label: "PRINCIPIO INSTITUCIONAL", token: "Rigorous ethical accountability is", tone: "violet" },
          { label: "BINOMIO LEGAL", token: "part and parcel of", tone: "emerald" },
          { label: "ÁMBITO DE APLICACIÓN", token: "any legitimate system of governance.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It is an inseparable part of the system (correcto pero plano).",
          wrongToken: "an inseparable part of",
          correct: "It is part and parcel of the system.",
          correctToken: "part and parcel of",
          whySpanish: "'Part and parcel' es la colocación fija que denota que algo es inherente por naturaleza.",
        },
        examples: [
          {
            english: "Rigorous accountability is part and parcel of any legitimate governance.",
            spanish: "La rendición de cuentas rigurosa es consustancial a cualquier gobernanza legítima.",
            pronunciationHint: "rígorus akaúntabíliti is part and pársel ov éni lidyítimet gáverns",
          },
          {
            english: "Any agreement entered into under duress is rendered null and void by operation of law.",
            spanish: "Cualquier acuerdo celebrado bajo coacción queda declarado nulo de pleno derecho por ministerio de la ley.",
            pronunciationHint: "éni agríment énterd íntu ánder diurés is rénderd nal and vóid bai óperéishon ov lo",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La rendición de cuentas es consustancial a cualquier gobernanza legítima",
          targetTokens: ["Accountability", "is", "part", "and", "parcel", "of", "legitimate", "governance"],
          distractorTokens: ["inseparable", "portion", "parting", "valid"],
          successTipSpanish: "¡Binomio de la Common Law perfecto! 'part and parcel of' transmite legitimidad jurídica.",
          mistakeHintSpanish: "Usa la locución consagrada 'part and parcel of...'.",
        },
        voicePractice: {
          sentenceEnglish: "Constructive friction is part and parcel of genuine intellectual discovery.",
          spanishMeaning: "La fricción constructiva es consustancial al auténtico descubrimiento intelectual.",
          pronunciationHint: "konstráktiv fríkshon is part and pársel ov yéniuin íntelékchual diskóveri",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza estatutos constitutivos y sentencias judiciales de la Cámara de los Lores en Reading.",
        },
      },
    },

    // BASE 13: COLOCACIONES ADJETIVO-SUSTANTIVO DE PRECISIÓN QUIRÚRGICA
    {
      title: "Colocaciones de Alta Densidad: Foregone conclusion / Pivotal juncture",
      focus: "Reemplazar adjetivos genéricos por parejas léxicas exactas e indiscutibles",
      payload: {
        ruleTaglineSpanish:
          "En C2 se destierra el lenguaje genérico. Un resultado predecible no es 'an obvious result', es a 'foregone conclusion'. Una encrucijada histórica no es 'an important moment', es a 'pivotal juncture'. Un fracaso absoluto es an 'unmitigated disaster'. Las palabras tienen gravedad colocacional propia.",
        formulaSegments: [
          { label: "UBICACIÓN HISTÓRICA", token: "We stand at a pivotal juncture", tone: "violet" },
          { label: "EXIGENCIA ÉTICA", token: "that demands", tone: "emerald" },
          { label: "RESPUESTA MADURA", token: "measured and courageous deliberation.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "We are in an important crossroad (calco literal poco natural).",
          wrongToken: "in an important crossroad",
          correct: "We stand at a pivotal juncture.",
          correctToken: "stand at a pivotal juncture",
          whySpanish: "'Stand at a pivotal juncture' es la colocación soberana para describir encrucijadas históricas.",
        },
        examples: [
          {
            english: "We stand at a pivotal juncture that demands measured deliberation.",
            spanish: "Nos encontramos en una encrucijada decisiva que exige deliberación serena.",
            pronunciationHint: "ui stand at a pívotal yánkchur dat dimánds méshurd delíberéishon",
          },
          {
            english: "The ratification of the accord was by no means a foregone conclusion.",
            spanish: "La ratificación del acuerdo distaba mucho de ser una conclusión cantada de antemano.",
            pronunciationHint: "de rátifikéishon ov di akórd uos bai nóu minz a forgón konklúshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Nos encontramos en una encrucijada decisiva que exige deliberación serena",
          targetTokens: ["We", "stand", "at", "a", "pivotal", "juncture", "that", "demands", "measured", "deliberation"],
          distractorTokens: ["are", "crossroads", "demanding", "deliberate"],
          successTipSpanish: "¡Colocación quirúrgica! 'stand at a pivotal juncture' aporta gravedad histórica instantánea.",
          mistakeHintSpanish: "Abre con 'We stand at a pivotal juncture that demands...'.",
        },
        voicePractice: {
          sentenceEnglish: "Without disciplined stewardship, the transition could degenerate into an unmitigated disaster.",
          spanishMeaning: "Sin una custodia disciplinada, la transición podría degenerar en un desastre sin atenuantes.",
          pronunciationHint: "uidáut dísaplind stiúardship, de transíshon kud didyénereit íntu an anmítigéited dizáster",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos editoriales de análisis geopolítico con colocaciones de alta densidad.",
        },
      },
    },

    // BASE 14: METÁFORAS CONCEPTUALES ARQUETÍPICAS
    {
      title: "Metáforas Arquetípicas de Transformación: Watershed moment / Sea change",
      focus: "Evocar imágenes universales del pensamiento anglosajón para describir cambios de época",
      payload: {
        ruleTaglineSpanish:
          "Las metáforas arquetípicas describen la profundidad de los giros históricos: 'a watershed moment' (un hito de inflexión tras el cual nada vuelve a ser igual, como una divisoria de aguas) o 'a sea change' (una transformación radical y profunda que altera todo el ecosistema cultural o institucional).",
        formulaSegments: [
          { label: "SUCESO HISTÓRICO", token: "The publication of the groundbreaking treaty", tone: "violet" },
          { label: "METÁFORA DE INFLEXIÓN", token: "marked a definitive watershed moment", tone: "emerald" },
          { label: "ÁMBITO DEL CAMBIO", token: "in multilateral international diplomacy.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It was a turning point of water (calco erróneo).",
          wrongToken: "turning point of water",
          correct: "It was a watershed moment in our history.",
          correctToken: "a watershed moment",
          whySpanish: "'Watershed moment' es la expresión universal inglesa para una línea divisoria histórica.",
        },
        examples: [
          {
            english: "The publication of the treaty marked a watershed moment in global cooperation.",
            spanish: "La publicación del tratado marcó un punto de inflexión histórico en la cooperación internacional.",
            pronunciationHint: "de páblikéishon ov de tríti markt a uótershed móument in glóubal kó-operéishon",
          },
          {
            english: "Recent technological advancements have catalyzed a profound sea change in scientific research.",
            spanish: "Los recientes avances tecnológicos han catalizado una transformación radical en la investigación científica.",
            pronunciationHint: "rísent téknolódzyikal advánsments jav kátaláizd a profáund si chéiny in sáientífik risérch",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La publicación del tratado marcó un punto de inflexión histórico",
          targetTokens: ["The", "publication", "of", "the", "treaty", "marked", "a", "watershed", "moment", "in", "cooperation"],
          distractorTokens: ["turning", "water", "marking", "history"],
          successTipSpanish: "¡Metáfora de época! 'marked a watershed moment' encapsula un antes y un después indiscutible.",
          mistakeHintSpanish: "Utiliza 'marked a watershed moment in...'.",
        },
        voicePractice: {
          sentenceEnglish: "This judicial precedent represents a true watershed moment in civil liberties jurisprudence.",
          spanishMeaning: "Este precedente judicial representa un verdadero punto de inflexión histórico en la jurisprudencia de libertades civiles.",
          pronunciationHint: "dis dyudíshal président réprezénts a tru uótershed móument in sívil líbertis dyúrisprúdens",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica 'watershed moment' y 'sea change' en análisis de prospectiva y tratados históricos.",
        },
      },
    },

    // BASE 15: EXPRESIONES CON POLARIDAD NEGATIVA FIJA
    {
      title: "Polaridad Negativa Fija: Beyond the shadow of a doubt / Not give an inch",
      focus: "Expresar certidumbre incontestable o firmeza inamovible mediante modismos de polaridad estricta",
      payload: {
        ruleTaglineSpanish:
          "Ciertos modismos de élite solo se activan en presencia de partículas negativas o restrictivas: 'beyond the shadow of a doubt' (más allá de toda duda razonable), 'not give an inch' (no ceder ni un milímetro en principios), 'not for the life of me' (por nada del mundo). Su fuerza radica en su absolutismo.",
        formulaSegments: [
          { label: "EVIDENCIA INCONTESTABLE", token: "The empirical evidence established their innocence", tone: "violet" },
          { label: "CERTEZA ABSOLUTA", token: "beyond the shadow of a doubt,", tone: "emerald" },
          { label: "EFECTO JURÍDICO", token: "silencing all unfounded conjecture.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Without any doubt at all (coloquial y desgastado).",
          wrongToken: "Without any doubt at all",
          correct: "beyond the shadow of a doubt.",
          correctToken: "beyond the shadow of a doubt",
          whySpanish: "'Beyond the shadow of a doubt' es la fórmula forense más solemne para certidumbre incontrovertible.",
        },
        examples: [
          {
            english: "The empirical evidence established their integrity beyond the shadow of a doubt.",
            spanish: "La evidencia empírica estableció su integridad más allá de toda duda razonable.",
            pronunciationHint: "di empírikal évidens estáblisht der intégriti biyond de shádou ov a dáut",
          },
          {
            english: "On matters of fundamental ethics, the committee refused to give an inch.",
            spanish: "En cuestiones de ética fundamental, el comité se negó a ceder ni un solo milímetro.",
            pronunciationHint: "on máters ov fándaméntal éziks, de komíti rifiúzd tu giv an inch",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La evidencia empírica estableció su integridad más allá de toda duda",
          targetTokens: ["The", "empirical", "evidence", "established", "their", "integrity", "beyond", "the", "shadow", "of", "a", "doubt"],
          distractorTokens: ["without", "any", "establishing", "doubts"],
          successTipSpanish: "¡Fórmula forense incontestable! 'beyond the shadow of a doubt' zanja la deliberación.",
          mistakeHintSpanish: "Ordena: '...established their integrity beyond the shadow of a doubt'.",
        },
        voicePractice: {
          sentenceEnglish: "The comprehensive audit proved the authenticity of the ledger beyond the shadow of a doubt.",
          spanishMeaning: "La auditoría integral probó la autenticidad del libro contable más allá de toda duda.",
          pronunciationHint: "de kómprejénsiv ódit pruvd di ózentísiti ov de lédzher biyond de shádou ov a dáut",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Defiende certezas absolutas y posiciones innegociables con fórmulas de polaridad fija en Interview.",
        },
      },
    },

    // BASE 16: ENSAYO DE CRÍTICA INSTITUCIONAL Y FILOSÓFICA (CHECKPOINT 2 ANCHOR)
    {
      title: "Crítica Institucional y Filosófica Integrada: La Síntesis Léxica",
      focus: "Articular un dictamen formal combinando binomios legales, colocaciones precisas y metáforas arquetípicas",
      payload: {
        ruleTaglineSpanish:
          "Esta base integra el Módulo 3. Combina la colocación de encrucijada ('At this pivotal juncture,'), el binomio consustancial de la Common Law ('rigorous accountability is part and parcel of our mission;') y la metáfora de época ('this moment marks a definitive watershed moment.'). Prosa majestuosa sin fisuras.",
        formulaSegments: [
          { label: "ENCRUCIJADA HISTÓRICA", token: "At this pivotal juncture,", tone: "violet" },
          { label: "PRINCIPIO CONSUSTANCIAL", token: "accountability is part and parcel of our covenant;", tone: "emerald" },
          { label: "METÁFORA DE INFLEXIÓN", token: "this decisive accord marks a true watershed moment.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Mezclar vocabulario informal cotidiano dentro de un dictamen solemne.",
          wrongToken: "inconsistencia de registro",
          correct: "Mantener una densidad léxica armónica y homogénea en todo el párrafo.",
          correctToken: "consistencia tonal C2",
          whySpanish: "El estudiante C2 mantiene la dignidad de registro de la primera a la última palabra.",
        },
        examples: [
          {
            english: "At this pivotal juncture, accountability is part and parcel of our mission; this marks a watershed moment.",
            spanish: "En esta encrucijada decisiva, la rendición de cuentas es consustancial a nuestra misión; este momento representa un punto de inflexión histórico.",
            pronunciationHint: "at dis pívotal yánkchur, akaúntabíliti is part and pársel ov áuer míshon; dis marks a uótershed móument",
          },
          {
            english: "Standing at this historical juncture, mutual respect is part and parcel of survival; we witness a genuine sea change.",
            spanish: "Situados en esta encrucijada histórica, el respeto mutuo es consustancial a la supervivencia; presenciamos una auténtica transformación radical.",
            pronunciationHint: "stánding at dis jistórikal yánkchur, miúchual rispékt is part and pársel ov serváival; ui uítnes a yéniuin si chéiny",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: En esta encrucijada decisiva, la rendición de cuentas es consustancial a nuestra misión; es un punto de inflexión",
          targetTokens: ["At", "this", "pivotal", "juncture,", "accountability", "is", "part", "and", "parcel", "of", "our", "mission"],
          distractorTokens: ["important", "moment", "inseparable", "part"],
          successTipSpanish: "¡Síntesis léxica monumental! Has entrelazado colocación quirúrgica y binomio de Common Law.",
          mistakeHintSpanish: "Ordena: 'At this pivotal juncture, accountability is part and parcel of our mission'.",
        },
        voicePractice: {
          sentenceEnglish: "At this critical juncture, ethical vigilance is part and parcel of our duty to future generations.",
          spanishMeaning: "En esta encrucijada crítica, la vigilancia ética es consustancial a nuestro deber hacia las generaciones futuras.",
          pronunciationHint: "at dis krítikal yánkchur, ézikal vídyilans is part and pársel ov áuer diúti tu fiúchur yéneréishons",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos institucionales y declaraciones de principios para organismos internacionales.",
        },
      },
    },
  ];
}

