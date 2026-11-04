import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4ImplicitCohesion(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: CONECTORES ARCAICOS DE PRECISIÓN INSTITUCIONAL
    {
      title: "Conectores de Precisión Institucional: Whereby / Whereupon / Heretofore",
      focus: "Establecer relaciones mecánicas de causa y procedimiento con la concisión de los tratados constitutivos",
      payload: {
        ruleTaglineSpanish:
          "En tratados internacionales, leyes estatutarias y documentos de gobernanza, los conectores relativos arcaicos aportan una precisión inigualable: 'whereby' (por medio del cual / conforme al cual), 'whereupon' (acto seguido / tras lo cual), 'heretofore' (hasta el momento presente). Evitan rodeos toscos como 'through which it is done'.",
        formulaSegments: [
          { label: "MECANISMO INSTITUCIONAL", token: "They established a transparent framework,", tone: "violet" },
          { label: "CONECTOR ESTATUTARIO", token: "whereby all subsequent disputes", tone: "emerald" },
          { label: "PROCEDIMIENTO VINCULANTE", token: "are systematically and impartially resolved.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "A framework through which they can resolve disputes (estilo plano).",
          wrongToken: "through which they can resolve",
          correct: "A framework whereby all disputes are resolved.",
          correctToken: "whereby all disputes are resolved",
          whySpanish: "'Whereby' condensa en una sola palabra 'by which' o 'according to which' con solemnidad jurídica.",
        },
        examples: [
          {
            english: "They established a transparent protocol whereby all disputes are systematically resolved.",
            spanish: "Establecieron un protocolo transparente mediante el cual se resuelven sistemáticamente todas las disputas.",
            pronunciationHint: "dei estáblisht a transpérent prótokol uér-bai ol dispíuts ar sístemátikali rizólvd",
          },
          {
            english: "The verdict was formally read, whereupon the assembly stood in solemn tribute.",
            spanish: "El veredicto fue leído formalmente, tras lo cual la asamblea se puso de pie en solemne homenaje.",
            pronunciationHint: "de vérdikt uos fórmali red, uér-apón di asémbli stud in sólem tríbiut",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Establecieron un protocolo transparente mediante el cual se resuelven todas las disputas",
          targetTokens: ["They", "established", "a", "transparent", "protocol", "whereby", "all", "disputes", "are", "resolved"],
          distractorTokens: ["through", "which", "establishing", "were"],
          successTipSpanish: "¡Precisión estatutaria perfecta! 'whereby all disputes are resolved' otorga solidez jurídica.",
          mistakeHintSpanish: "Usa el conector 'whereby' para introducir el procedimiento vinculado.",
        },
        voicePractice: {
          sentenceEnglish: "Heretofore unresolved questions were clarified during the plenary session.",
          spanishMeaning: "Preguntas hasta el momento no resueltas fueron aclaradas durante la sesión plenaria.",
          pronunciationHint: "jíer-tu-for ánrizólvd kuéstions uér klárifaid diúring de plénari séshon",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza tratados fundacionales de la Unión Europea y las Naciones Unidas con conectores de precisión.",
        },
      },
    },

    // BASE 18: LA PROLEPSIS RETÓRICA
    {
      title: "La Prolepsis Retórica: Anticipar y Desactivar la Objeción del Rival",
      focus: "Formular la crítica más incisiva del adversario y refutarla antes de que tenga la oportunidad de hablar",
      payload: {
        ruleTaglineSpanish:
          "La 'prolepsis' es el arma dialéctica definitiva: anticipas la objeción del rival, la describes con respeto y la derribas con un argumento concluyente antes de que el público la escuche de boca ajena: 'It may be objected that the timeline is ambitious; to this I would counter that urgency demands immediate resolve'.",
        formulaSegments: [
          { label: "ANTICIPACIÓN DE LA OBJECIÓN", token: "It may be objected that the timeline is excessively ambitious;", tone: "violet" },
          { label: "RÉPLICA DIALÉCTICA", token: "to this I would counter that", tone: "emerald" },
          { label: "REFUTACIÓN CONCLUYENTE", token: "unprecedented challenges demand proportionate resolve.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Some people say it is too fast, but they are wrong (coloquial y confrontativo).",
          wrongToken: "Some people say... they are wrong",
          correct: "It may be objected that the pace is rapid; to this I counter that urgency is paramount.",
          correctToken: "It may be objected... to this I counter",
          whySpanish: "La fórmula proléptica 'It may be objected that...; to this I would counter...' es el modelo clásico de la retórica académica.",
        },
        examples: [
          {
            english: "It may be objected that the timeline is ambitious; to this I would counter that urgency demands resolve.",
            spanish: "Podría objetarse que el cronograma es ambicioso; a esto respondería que la urgencia exige determinación.",
            pronunciationHint: "it mei bi obdyékted dat de táimlain is ambíshus; tu dis ai uud káunter dat éryensi dimánds rizólv",
          },
          {
            english: "One might contend that the cost is steep; to such concerns I submit that inaction is infinitely more expensive.",
            spanish: "Podría sostenerse que el costo es elevado; ante tales preocupaciones expongo que la inacción es infinitamente más costosa.",
            pronunciationHint: "uan mait konténd dat de kost is stip; tu sach konsérns ai submít dat inákshon is ínfinitli mor ekspénsiv",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Podría objetarse que el cronograma es ambicioso; a esto respondería que la urgencia exige determinación",
          targetTokens: ["It", "may", "be", "objected", "that", "the", "timeline", "is", "ambitious;", "to", "this", "I", "counter"],
          distractorTokens: ["objecting", "some", "say", "saying"],
          successTipSpanish: "¡Prolepsis dialéctica magistral! Desarmas la crítica antes de que el rival tome el micrófono.",
          mistakeHintSpanish: "Abre con 'It may be objected that...; to this I counter...'.",
        },
        voicePractice: {
          sentenceEnglish: "It may be argued that simpler solutions exist; to this I respond that durable excellence rejects superficial shortcuts.",
          spanishMeaning: "Podría argumentarse que existen soluciones más simples; a esto respondo que la excelencia duradera rechaza los atajos superficiales.",
          pronunciationHint: "it mei bi árguiud dat símpler solúshons egzíst; tu dis ai rispónd dat diúrabl ékselens ridyékts súperfíshal shórtkats",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Aplica prolepsis en debates y conferencias para desactivar las preguntas más hostiles del panel.",
        },
      },
    },

    // BASE 19: COHESIÓN SEMÁNTICA IMPLÍCITA
    {
      title: "Cohesión Semántica Implícita: Fluidez sin Conectores Visibles",
      focus: "Eliminar conectores mecánicos haciendo que las frases fluyan por resonancia léxica y paralelismo",
      payload: {
        ruleTaglineSpanish:
          "Un error del nivel intermedio es llenar cada frase de conectores mecánicos (*However*, *Furthermore*, *In addition*, *Moreover*). En C2, la cohesión es implícita: la última idea de una oración se convierte en el sujeto transformado de la siguiente: 'The institution pursues excellence with rigor. Such rigor defines every standard we uphold'.",
        formulaSegments: [
          { label: "ORACIÓN A (TÉRMINO FINAL)", token: "The institution pursues excellence with uncompromising rigor.", tone: "violet" },
          { label: "ECO ANFÓRICO EN B", token: "Such rigor defines", tone: "emerald" },
          { label: "CONTINUIDAD ORGÁNICA", token: "every standard we solemnly proclaim.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The team worked hard. Furthermore, they are disciplined. In addition, they succeeded.",
          wrongToken: "Furthermore... In addition...",
          correct: "The team worked with rare discipline. Such discipline ensured their ultimate triumph.",
          correctToken: "Such discipline ensured",
          whySpanish: "El encadenamiento léxico 'Such [Sustantivo]' reemplaza a los conectores toscos con naturalidad musical.",
        },
        examples: [
          {
            english: "The institution pursues excellence with rigor. Such rigor defines every standard we uphold.",
            spanish: "La institución persigue la excelencia con rigor. Ese rigor define cada estándar que sostenemos.",
            pronunciationHint: "di ínstitiúshon persiús ékselens uid rígur. sach rígur difáins évri stándard ui apjóuld",
          },
          {
            english: "They cultivated deep mutual trust. Trust alone made ambitious collaboration possible.",
            spanish: "Cultivaron una profunda confianza mutua. Solo la confianza hizo posible una colaboración ambiciosa.",
            pronunciationHint: "dei káltivéited dip miúchual trast. trast alóun méid ambíshus koláboreishon pósibl",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La institución persigue la excelencia con rigor. Ese rigor define cada estándar",
          targetTokens: ["The", "institution", "pursues", "excellence", "with", "rigor.", "Such", "rigor", "defines", "every", "standard"],
          distractorTokens: ["Furthermore,", "In", "addition,", "moreover"],
          successTipSpanish: "¡Cohesión orgánica soberana! 'Such rigor defines...' fluye sin conectores mecánicos de relleno.",
          mistakeHintSpanish: "Encadena las oraciones retomando el término final con 'Such rigor defines...'.",
        },
        voicePractice: {
          sentenceEnglish: "Our scholars embraced intellectual humility. Humility became the foundation of their enduring discoveries.",
          spanishMeaning: "Nuestros académicos acogieron la humildad intelectual. La humildad se convirtió en la base de sus perdurables descubrimientos.",
          pronunciationHint: "áuer skólars embréist íntelékchual jiumíliti. jiumíliti bikéim de faundéishon ov der endiúring diskóveris",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe párrafos con cohesión semántica pura eliminando conectores de plantilla en Writing Studio.",
        },
      },
    },

    // BASE 20: CONCESIÓN HIPOTÉTICA CON BE THAT AS IT WILL
    {
      title: "Concesión y Aceptación Estoica: Much though one might wish otherwise",
      focus: "Reconocer deseos hipotéticos irreales aceptando la realidad fáctica con madurez filosófica",
      payload: {
        ruleTaglineSpanish:
          "Para expresar que desearíamos que el mundo o los datos fueran distintos, pero que la dignidad exige aceptar la verdad empírica, formula: 'Much though one might wish otherwise, the objective facts demand a comprehensive revision'. Suena estoico, sabio y científicamente intachable.",
        formulaSegments: [
          { label: "DESEO HIPOTÉTICO RESPETUOSO", token: "Much though one might wish otherwise,", tone: "violet" },
          { label: "REALIDAD EMPÍRICA INEXORABLE", token: "the objective evidence demands", tone: "emerald" },
          { label: "ACCION REQUERIDA", token: "a thorough and unsparing review.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Although we want that it was different (pobreza sintáctica).",
          wrongToken: "Although we want that it was different",
          correct: "Much though one might wish otherwise, the facts are clear.",
          correctToken: "Much though one might wish otherwise",
          whySpanish: "'Much though one might wish otherwise' es la locución canónica de la filosofía estoica en lengua inglesa.",
        },
        examples: [
          {
            english: "Much though one might wish otherwise, the objective facts demand a thorough review.",
            spanish: "Por mucho que uno deseara lo contrario, los hechos objetivos exigen una revisión completa.",
            pronunciationHint: "mach dou uan mait uish áderuais, di obdyéktiv fakts dimánd a zórou riviú",
          },
          {
            english: "Be that as it will, our obligations to the vulnerable remain non-negotiable.",
            spanish: "Sea lo que fuere en el futuro, nuestras obligaciones hacia los vulnerables siguen siendo innegociables.",
            pronunciationHint: "bi dat as it uil, áuer óbligéishons tu de válnarabl riméin nón-nigóushiabl",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por mucho que uno deseara lo contrario, los hechos objetivos exigen una revisión",
          targetTokens: ["Much", "though", "one", "might", "wish", "otherwise,", "the", "objective", "facts", "demand", "a", "review"],
          distractorTokens: ["Although", "we", "wishing", "wished"],
          successTipSpanish: "¡Estoicismo intelectual sublime! 'Much though one might wish otherwise,' acepta la realidad con entereza.",
          mistakeHintSpanish: "Abre con 'Much though one might wish otherwise, the objective facts...'.",
        },
        voicePractice: {
          sentenceEnglish: "Much though one might desire swift simplicity, complex systems yield only to patient understanding.",
          spanishMeaning: "Por mucho que uno deseara una rápida simplicidad, los sistemas complejos responden solo a la comprensión paciente.",
          pronunciationHint: "mach dou uan mait dizáier suíft simplísiti, kómpleks sístems yild óunli tu péishent ánderstánding",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Lee ensayos de filosofía moral y teoría del conocimiento analizando concesiones hipotéticas.",
        },
      },
    },

    // BASE 21: PARADOJA Y CONTRASTE DIALÉCTICO CON PARADOXICALLY ENOUGH
    {
      title: "Paradoja Dialéctica Iluminadora: Paradoxically enough...",
      focus: "Destacar verdades contraintuitivas que revelan una comprensión profunda de sistemas complejos",
      payload: {
        ruleTaglineSpanish:
          "En el pensamiento de alto nivel, las soluciones más profundas suelen ser paradójicas: 'Paradoxically enough, moderating our initial pace accelerated the ultimate delivery'. La partícula 'enough' pospuesta añade un tono de descubrimiento compartido con el lector.",
        formulaSegments: [
          { label: "APERTURA PARADÓJICA", token: "Paradoxically enough,", tone: "violet" },
          { label: "ACCIÓN CONTRAINTUITIVA", token: "moderating our initial pace", tone: "emerald" },
          { label: "RESULTADO ÓPTIMO", token: "accelerated the ultimate delivery of the project.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "In a paradoxical way, to slow down was faster (expresión infantil).",
          wrongToken: "In a paradoxical way",
          correct: "Paradoxically enough, slowing down accelerated progress.",
          correctToken: "Paradoxically enough",
          whySpanish: "'Paradoxically enough' introduce verdades contraintuitivas con elegancia conversacional culta.",
        },
        examples: [
          {
            english: "Paradoxically enough, moderating our initial pace accelerated the ultimate delivery.",
            spanish: "Por paradójico que parezca, ralentizar el ritmo inicial aceleró la entrega final.",
            pronunciationHint: "párradóksikali ináf, móderéiting áuer iníshal péis aksélereited di áltimet delíveri",
          },
          {
            english: "True though that observation may be, it paradoxically obscures the underlying catalyst.",
            spanish: "Cierta aunque pueda ser esa observación, paradójicamente oscurece el catalizador de fondo.",
            pronunciationHint: "tru dou dat óbservéishon mei bi, it párradóksikali obskiúrs di ánderlái-ing kátalist",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por paradójico que parezca, moderar el ritmo inicial aceleró la entrega",
          targetTokens: ["Paradoxically", "enough,", "moderating", "our", "initial", "pace", "accelerated", "the", "delivery"],
          distractorTokens: ["Paradoxical", "in", "way", "to", "moderate"],
          successTipSpanish: "¡Dialéctica contraintuitiva! 'Paradoxically enough,' revela la sabiduría detrás de la aparente contradicción.",
          mistakeHintSpanish: "Comienza con 'Paradoxically enough, moderating our initial pace...'.",
        },
        voicePractice: {
          sentenceEnglish: "Paradoxically enough, acknowledging vulnerability often establishes the deepest professional authority.",
          spanishMeaning: "Por paradójico que parezca, reconocer la vulnerabilidad a menudo forja la autoridad profesional más profunda.",
          pronunciationHint: "párradóksikali ináf, aknóledzhing válnerabíliti ófen estáblishes de dípest proféshonal ozóriti",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Explica lecciones contraintuitivas y aprendizajes de liderazgo utilizando 'Paradoxically enough'.",
        },
      },
    },
  ];
}

