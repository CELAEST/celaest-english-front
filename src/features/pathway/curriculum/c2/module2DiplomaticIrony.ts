import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2DiplomaticIrony(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: IRONÍA SOCRÁTICA Y DISIMULO CORTÉS
    {
      title: "Ironía Socrática y Disimulo Cortés: One cannot help but wonder...",
      focus: "Señalar contradicciones flagrantes con la fingida modestia de quien simplemente se declara desconcertado",
      payload: {
        ruleTaglineSpanish:
          "En la alta diplomacia y el arbitraje internacional, la confrontación agresiva es vista como un signo de debilidad. El hablante C2 utiliza la ironía socrática: 'One cannot help but wonder whether such an omission was entirely accidental'. La duda aparente esconde una demolición lógica fulminante.",
        formulaSegments: [
          { label: "DISIMULO CORTÉS", token: "One cannot help but wonder", tone: "violet" },
          { label: "CONTRADICCIÓN INCÓMODA", token: "how such a glaring inconsistency", tone: "emerald" },
          { label: "CIERRE REFLEXIVO", token: "escaped rigorous editorial scrutiny.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "This is completely absurd and clearly false (demasiado visceral).",
          wrongToken: "completely absurd and clearly false",
          correct: "One cannot help but wonder how this escaped scrutiny.",
          correctToken: "One cannot help but wonder",
          whySpanish: "La ironía socrática destruye la premisa ajena manteniendo un tono de educada perplejidad.",
        },
        examples: [
          {
            english: "One cannot help but wonder how such a glaring inconsistency escaped scrutiny.",
            spanish: "Uno no puede evitar preguntarse cómo una inconsistencia tan flagrante pasó inadvertida.",
            pronunciationHint: "uan kannot jelp bat uánder jáu sach a gléiring ínkonsístensi eskéipt skrútini",
          },
          {
            english: "I am at a loss to comprehend how these two contradictory claims can coexist.",
            spanish: "Me hallo en la total incapacidad de comprender cómo dos afirmaciones contradictorias pueden coexistir.",
            pronunciationHint: "ai am at a los tu kómprejénd jáu diz tu kóntradíktori kléims kan kóuegzíst",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Uno no puede evitar preguntarse cómo tal inconsistencia escapó a la revisión",
          targetTokens: ["One", "cannot", "help", "but", "wonder", "how", "such", "inconsistency", "escaped", "scrutiny"],
          distractorTokens: ["nobody", "can", "wondering", "wondered"],
          successTipSpanish: "¡Ironía de salón impecable! 'One cannot help but wonder' desmonta el argumento con guante blanco.",
          mistakeHintSpanish: "Abre con la fórmula impersonal 'One cannot help but wonder how...'.",
        },
        voicePractice: {
          sentenceEnglish: "One cannot help but wonder whether alternative motives guided that sudden reversal.",
          spanishMeaning: "Uno no puede evitar preguntarse si otros motivos guiaron ese cambio repentino de postura.",
          pronunciationHint: "uan kannot jelp bat uánder uéder oltérnativ móutivs gáided dat sáden rivérsal",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula preguntas inquisitivas con ironía socrática en paneles de debate y entrevistas de alta presión.",
        },
      },
    },

    // BASE 8: LITOTES DOBLE Y ATENUACIÓN EXTREMA (CHECKPOINT 1 ANCHOR)
    {
      title: "Litotes Doble y Falsedad Atenuada: Somewhat less than honest",
      focus: "Denunciar incorrecciones graves sin emplear términos vetados como 'mentira' o 'engaño'",
      payload: {
        ruleTaglineSpanish:
          "Cuando necesites señalar que alguien faltó a la verdad en un ámbito protocolario, jamás uses la palabra 'lie'. Utiliza la atenuación extrema: 'To describe that account as accurate would be somewhat less than honest'. O para rechazar una idea: 'It is not entirely devoid of merit, yet...'.",
        formulaSegments: [
          { label: "EVALUACIÓN MODERADA", token: "To describe that retrospective account as thorough", tone: "violet" },
          { label: "CONDICIONAL DE PRUDENCIA", token: "would be somewhat", tone: "emerald" },
          { label: "LITOTE DEMOLEDOR", token: "less than honest.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "That report is a complete lie (inadmisible en entornos diplomáticos).",
          wrongToken: "a complete lie",
          correct: "would be somewhat less than honest.",
          correctToken: "would be somewhat less than honest",
          whySpanish: "El litotes doble permite descalificar una versión con impecable elegancia jurídica.",
        },
        examples: [
          {
            english: "To describe that report as thorough would be somewhat less than honest.",
            spanish: "Describir ese informe como minucioso sería faltar a la verdad.",
            pronunciationHint: "tu diskráib dat ripórt as zórou uud bi sám-uot les dan ónest",
          },
          {
            english: "The proposal is not entirely devoid of insight, though its premises remain fragile.",
            spanish: "La propuesta no carece del todo de perspicacia, aunque sus premisas siguen siendo frágiles.",
            pronunciationHint: "de propóusal is not entáierli divóid ov ínsait, dou its prémises riméin frádyil",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Describir ese informe como minucioso sería faltar a la verdad",
          targetTokens: ["To", "describe", "that", "report", "as", "thorough", "would", "be", "somewhat", "less", "than", "honest"],
          distractorTokens: ["is", "completely", "a", "lie"],
          successTipSpanish: "¡Atenuación diplomática maestra! 'would be somewhat less than honest' dice la verdad sin caer en la vulgaridad.",
          mistakeHintSpanish: "Ordena: 'To describe that report as thorough would be somewhat less than honest'.",
        },
        voicePractice: {
          sentenceEnglish: "To suggest that no warning was given would be somewhat less than candid.",
          spanishMeaning: "Sugerir que no se dio advertencia alguna sería faltar a la sinceridad.",
          pronunciationHint: "tu sadyést dat nóu uórning uos gíven uud bi sám-uot les dan kándid",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe réplicas de arbitraje y dictámenes periciales aplicando litotes doble en Writing Studio.",
        },
      },
    },

    // BASE 9: EUFEMISMOS DE ALTA DIPLOMACIA
    {
      title: "Eufemismos de Westminster y Ginebra: Economical with the truth",
      focus: "Navegar crisis éticas e institucionales utilizando el léxico protocolario de la diplomacia anglosajona",
      payload: {
        ruleTaglineSpanish:
          "En la tradición de Westminster, ciertas frases se convirtieron en eufemismos legendarios: 'economical with the truth' (que omitió la verdad de forma deliberada), 'a frank exchange of views' (una discusión acalorada donde casi se rompe la mesa), 'a full and frank discussion'.",
        formulaSegments: [
          { label: "SUJETO / DECLARACIÓN", token: "The testimony provided by the spokesperson", tone: "violet" },
          { label: "EUFEMISMO PROTOCOLARIO", token: "was arguably economical", tone: "emerald" },
          { label: "CONCEPTO VETADO", token: "with the truth.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "He lied during the press conference (lenguaje tabloide).",
          wrongToken: "He lied",
          correct: "He was somewhat economical with the truth.",
          correctToken: "economical with the truth",
          whySpanish: "'Economical with the truth' es la célebre fórmula acuñada para describir declaraciones engañosas sin violar el protocolo parlamentario.",
        },
        examples: [
          {
            english: "The spokesperson was, to say the least, economical with the truth during the briefing.",
            spanish: "El vocero fue, cuando menos, sumamente ahorrativo con la verdad durante la sesión informativa.",
            pronunciationHint: "de spóukspérson uos, tu séi de list, íkonomíkal uid de truz diúring de brífing",
          },
          {
            english: "The delegation engaged in a robust exchange of views regarding the disputed borders.",
            spanish: "La delegación sostuvo un intercambio franco y vehemente de opiniones sobre las fronteras en disputa.",
            pronunciationHint: "de délegéishon engéidzhd in a robást ekschéiny ov viús rigárding de dispíuted bórders",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El vocero fue sumamente ahorrativo con la verdad durante la sesión",
          targetTokens: ["The", "spokesperson", "was", "economical", "with", "the", "truth", "during", "the", "briefing"],
          distractorTokens: ["lying", "about", "lies", "truthful"],
          successTipSpanish: "¡Eufemismo de cancillería perfecto! 'economical with the truth' proyecta la máxima agudeza institucional.",
          mistakeHintSpanish: "Construye con 'was economical with the truth'.",
        },
        voicePractice: {
          sentenceEnglish: "The communique reflected a candid and constructive exchange between the two envoys.",
          spanishMeaning: "El comunicado reflejó un intercambio franco y constructivo entre ambos enviados.",
          pronunciationHint: "de komiúnikéi riflékted a kándid and konstráktiv ekschéiny bituín de tu énvois",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Descifra los comunicados oficiales de cumbres internacionales y embajadas en Reading.",
        },
      },
    },

    // BASE 10: RETINTÍN Y PREGUNTAS RETÓRICAS INSINUANTES
    {
      title: "Preguntas Retóricas Insinuantes: Dare we suggest...?",
      focus: "Guiar al oyente hacia una verdad incómoda formulándola como una sospecha reverente y prudente",
      payload: {
        ruleTaglineSpanish:
          "Para sembrar una sospecha de fondo sin asumir la carga probatoria inmediata de una acusación abierta, formula una pregunta insinuante con 'Dare we suggest...?': 'Dare we suggest that the original premise was flawed from the outset?'. El verbo 'dare' connota reverencia mientras propina un golpe intelectual certero.",
        formulaSegments: [
          { label: "APERTURA INQUISITIVA", token: "Dare we suggest that", tone: "violet" },
          { label: "HIPÓTESIS CRÍTICA", token: "the foundational premise was", tone: "emerald" },
          { label: "ALCANCE", token: "fundamentally compromised from the outset?", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Do we dare to say that it was wrong? (estilo plano).",
          wrongToken: "Do we dare to say",
          correct: "Dare we suggest that the premise was flawed?",
          correctToken: "Dare we suggest",
          whySpanish: "'Dare we suggest' opera como un modal invertido arcaico de altísima distinción retórica.",
        },
        examples: [
          {
            english: "Dare we suggest that the original premise was fundamentally flawed from the outset?",
            spanish: "¿Nos atreveremos a sugerir que la premisa original estaba viciada desde su origen?",
            pronunciationHint: "der ui sadyést dat di oríyinal prémis uos fándaméntali flod from di áutset?",
          },
          {
            english: "Could it be that our collective confidence was somewhat misplaced?",
            spanish: "¿Podría ser acaso que nuestra confianza colectiva estuviera ligeramente mal orientada?",
            pronunciationHint: "kud it bi dat áuer koléktiv kónfidens uos sám-uot mispléist?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: ¿Nos atreveremos a sugerir que la premisa original estaba viciada desde el inicio?",
          targetTokens: ["Dare", "we", "suggest", "that", "the", "original", "premise", "was", "flawed", "from", "the", "outset?"],
          distractorTokens: ["Do", "daring", "to", "say"],
          successTipSpanish: "¡Retórica inquisitiva de élite! 'Dare we suggest that...' plantea la duda con maestría.",
          mistakeHintSpanish: "Abre directamente con el modal arcaico 'Dare we suggest that...'.",
        },
        voicePractice: {
          sentenceEnglish: "Dare we ask whether expediency triumphed over principle in this instance?",
          spanishMeaning: "¿Nos atreveremos a preguntar si la conveniencia triunfó sobre el principio en esta ocasión?",
          pronunciationHint: "der ui ask uéder ekspídiensi tráiomft óuver prínsipol in dis ínstans?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Formula preguntas inquisitivas en debates parlamentarios y ruedas de prensa simuladas en Interview.",
        },
      },
    },

    // BASE 11: DESACUERDO CON CONCESIÓN PREVIA TOTAL
    {
      title: "Desacuerdo con Concesión Previa: Granted, ...; yet one must not conflate...",
      focus: "Conceder la razón al rival en un punto secundario para aislar y derribar su punto medular",
      payload: {
        ruleTaglineSpanish:
          "Para desmontar la tesis de un adversario respetable, concede primero la validez de su punto parcial con 'Granted, [X] is true; yet one must be careful not to conflate [A] with [B]'. El verbo 'conflate' (confundir dos conceptos distintos tratándolos como si fueran uno solo) es la piedra angular del rigor analítico.",
        formulaSegments: [
          { label: "CONCESIÓN TOTAL PREVIA", token: "Granted, the preliminary expenditure is substantial;", tone: "violet" },
          { label: "DISTINCIÓN CRÍTICA", token: "yet one must not conflate", tone: "emerald" },
          { label: "CONCEPTOS DISOCIADOS", token: "immediate cost with enduring investment.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Yes, it is expensive, but don't confuse cost and investment (demasiado coloquial).",
          wrongToken: "don't confuse cost and investment",
          correct: "one must not conflate immediate expenditure with enduring investment.",
          correctToken: "one must not conflate",
          whySpanish: "El verbo culto 'conflate' aporta una precisión intelectual muy superior al genérico 'confuse'.",
        },
        examples: [
          {
            english: "Granted, the cost is substantial; yet one must not conflate expenditure with investment.",
            spanish: "Es cierto que el costo es sustancial; no obstante, no debemos confundir gasto con inversión.",
            pronunciationHint: "gránted, de kost is sabstánshal; yet uan mast not konfléit ekspénditchur uid invéstment",
          },
          {
            english: "Granted, progress has been gradual; nonetheless, one must distinguish patience from complacency.",
            spanish: "Ciertamente el progreso ha sido gradual; no obstante, es preciso distinguir la paciencia de la complacencia.",
            pronunciationHint: "gránted, prógres jas bin grádyual; nándeless, uan mast distínguish péishens from kompléisensi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Es cierto que el costo es sustancial; pero no debemos confundir gasto con inversión",
          targetTokens: ["Granted,", "the", "cost", "is", "substantial;", "yet", "one", "must", "not", "conflate", "expenditure", "with", "investment"],
          distractorTokens: ["Yes", "confuse", "spending", "conflating"],
          successTipSpanish: "¡Rigor conceptual quirúrgico! 'Granted,... yet one must not conflate...' desarticula la objeción.",
          mistakeHintSpanish: "Usa 'Granted,' para la concesión y 'conflate expenditure with investment' para la distinción.",
        },
        voicePractice: {
          sentenceEnglish: "Granted, the methodology is demanding; yet one must never conflate rigor with obstinacy.",
          spanishMeaning: "Ciertamente la metodología es exigente; no obstante, jamás debemos confundir el rigor con la obstinación.",
          pronunciationHint: "gránted, de mezodólodzi is dimánding; yet uan mast néver konfléit rígur uid óbstinasi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos dialécticos de refutación de tesis utilizando 'conflate' y concesión 'Granted' en Writing Studio.",
        },
      },
    },
  ];
}

