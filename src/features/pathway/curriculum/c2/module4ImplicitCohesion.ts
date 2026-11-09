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
        formulaCases: [
          {
            label: "01 · Cláusula que define el mecanismo",
            segments: [
              { label: "NORMA O MARCO", token: "A charter", tone: "violet" },
              { label: "MECANISMO ESTATUTARIO", token: "whereby every member", tone: "emerald" },
              { label: "EFECTO VINCULANTE", token: "holds one vote.", tone: "sky" },
            ],
            explanationSpanish:
              "Úsalo cuando la cláusula siguiente explica cómo funciona lo que acabas de nombrar: el estatuto define el procedimiento. 'Whereby' condensa 'by which' en una palabra. Si sólo agregás información, usá 'and'; si describís el medio legal, 'whereby' es la forma exacta.",
            exampleEnglish: "A charter whereby every member holds one vote.",
          },
          {
            label: "02 · Acto formal y secuencia inmediata",
            segments: [
              { label: "ACTO CUMPLIDO", token: "The oath was administered,", tone: "violet" },
              { label: "SECUENCIA INMEDIATA", token: "whereupon the session", tone: "emerald" },
              { label: "CONSECUENCIA", token: "formally opened.", tone: "sky" },
            ],
            explanationSpanish:
              "Emplealo cuando un acto formal desencadena el paso siguiente sin demora. 'Whereupon' une la consecuencia al acto con inevitabilidad jurídica. 'And then' narra de forma coloquial y deja los hechos sueltos; aquí el segundo hecho nace del primero.",
            exampleEnglish: "The oath was administered, whereupon the session formally opened.",
          },
          {
            label: "03 · Vigencia que acaba de cambiar",
            segments: [
              { label: "ESTADO ANTERIOR", token: "Heretofore confidential", tone: "violet" },
              { label: "CAMBIO DE RÉGIMEN", token: "minutes are now", tone: "emerald" },
              { label: "NUEVA SITUACIÓN", token: "publicly available.", tone: "sky" },
            ],
            explanationSpanish:
              "Sirve para declarar un estado que valía hasta hoy y ya no rige. 'Heretofore' presupone registro oficial y contraste con el presente. 'Previously' sólo ordena el tiempo; la forma arcaica añade solemnidad de acta y marca que hubo un cambio formal.",
            exampleEnglish: "Heretofore confidential minutes are now publicly available.",
          },
        ],
        commonMistake: {
          wrong: "A framework through which they can resolve disputes.",
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
        formulaCases: [
          {
            label: "01 · Objeción de costo o plazo",
            segments: [
              { label: "OBJECIÓN ANTICIPADA", token: "It may be objected that cost is steep;", tone: "violet" },
              { label: "RÉPLICA INMEDIATA", token: "inaction costs more.", tone: "emerald" },
            ],
            explanationSpanish:
              "Anticipá la objeción de viabilidad antes de que el rival la pronuncie. Abrís con 'It may be objected that...' y refutás en la misma frase. Si contestás después de que habló, ya perdiste el marco; así fijás el terreno y tu respuesta suena concluyente.",
            exampleEnglish: "It may be objected that cost is steep; inaction costs more.",
          },
          {
            label: "02 · Objeción de principio",
            segments: [
              { label: "CRÍTICA MÁS FUERTE", token: "One might contend that speed endangers quality;", tone: "violet" },
              { label: "RÉPLICA DE FONDO", token: "to this I submit that", tone: "emerald" },
              { label: "TESIS SOSTENIDA", token: "deliberate speed protects it.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la crítica es de principio y no de recursos, concedé su versión más fuerte con 'One might contend that...' antes de refutar. Reconocer el mejor argumento rival te presta autoridad. Ignorarlo te deja expuesto a que el público lo escuche de boca ajena.",
            exampleEnglish: "One might contend that speed endangers quality; I submit otherwise.",
          },
        ],
        commonMistake: {
          wrong: "Some people say it is too fast, but they are wrong.",
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
        formulaCases: [
          {
            label: "01 · Eco del término final",
            segments: [
              { label: "FRASE A", token: "The merger demanded patience.", tone: "violet" },
              { label: "ECO CON SUCH", token: "Such patience", tone: "emerald" },
              { label: "CONSECUENCIA", token: "preserved the alliance.", tone: "sky" },
            ],
            explanationSpanish:
              "Tomá el último sustantivo de la frase A y reabrí la frase B con 'Such + sustantivo'. Esa repetición señala consecuencia sin conector. 'Furthermore' sólo suma un dato; 'Such patience' retoma lo dicho y lo convierte en la causa de lo que sigue.",
            exampleEnglish: "The merger demanded patience. Such patience preserved the alliance.",
          },
          {
            label: "02 · Idea dominante como sujeto",
            segments: [
              { label: "IDEA QUE CRECE", token: "Trust grew slowly.", tone: "violet" },
              { label: "MISMO SUJETO", token: "Trust carried", tone: "emerald" },
              { label: "DESENLACE", token: "the negotiation.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando una idea debe dominar el párrafo, repetí ese sustantivo como sujeto de la frase siguiente y omití el conector. La repetición deliberada crea jerarquía. Con 'In addition' ambas frases pesan igual y la idea central se diluye entre detalles.",
            exampleEnglish: "Trust grew slowly. Trust carried the negotiation.",
          },
          {
            label: "03 · Elipsis del verbo ya dicho",
            segments: [
              { label: "PRIMER SUJETO Y VERBO", token: "They ratified the treaty;", tone: "violet" },
              { label: "SEGUNDO SUJETO", token: "we could not", tone: "emerald" },
              { label: "VERBO OMITIDO", token: "(ratify)", tone: "sky" },
            ],
            explanationSpanish:
              "Si el verbo de la segunda frase ya se entiende, omitilo en vez de repetirlo o de añadir un conector. 'we could not' deja el verbo en el aire y el paralelismo hace el trabajo. Repetirlo suena a informe; omitirlo demuestra dominio del ritmo.",
            exampleEnglish: "They ratified the treaty; we could not.",
          },
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
        formulaCases: [
          {
            label: "01 · Datos que contradicen el deseo",
            segments: [
              { label: "DESEO CONCEDIDO", token: "Much though one might wish otherwise,", tone: "violet" },
              { label: "HECHO QUE IMPONE", token: "the evidence is", tone: "emerald" },
              { label: "VEREDICTO", token: "conclusive.", tone: "sky" },
            ],
            explanationSpanish:
              "Usalo cuando los datos contradicen lo que deseabas y la honestidad exige decirlo. La fórmula concede el deseo antes de afirmar el hecho. 'Unfortunately' se lamenta y debilita; esta apertura asume la realidad con entereza y sin dramatismo.",
            exampleEnglish: "Much though one might wish otherwise, the evidence is conclusive.",
          },
          {
            label: "02 · Futuro incierto, deber intacto",
            segments: [
              { label: "DESENLACE ABIERTO", token: "Be that as it will,", tone: "violet" },
              { label: "OBLIGACIÓN PRESENTE", token: "our duty to them", tone: "emerald" },
              { label: "FIRMEZA", token: "stands unchanged.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el desenlace futuro es incierto pero tu obligación no cambia, abrí con 'Be that as it will'. Acepta cualquier giro de los acontecimientos y sostiene el deber presente. 'Whatever happens' es correcto pero coloquial; esta forma pertenece al registro deliberativo.",
            exampleEnglish: "Be that as it will, our duty to them stands.",
          },
        ],
        commonMistake: {
          wrong: "Although we want that it was different.",
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
        formulaCases: [
          {
            label: "01 · Método que rinde al revés",
            segments: [
              { label: "APERTURA PARADÓJICA", token: "Paradoxically enough,", tone: "violet" },
              { label: "DECISIÓN DE MÉTODO", token: "pausing the rollout", tone: "emerald" },
              { label: "EFECTO MEDIBLE", token: "accelerated adoption.", tone: "sky" },
            ],
            explanationSpanish:
              "Usalo cuando una decisión de método produce el resultado opuesto al esperado y querés que se lea como hallazgo, no como error. 'Paradoxically enough' avisa que la contradicción es el punto. 'Surprisingly' sólo expresa sorpresa y no explica la causa.",
            exampleEnglish: "Paradoxically enough, pausing the rollout accelerated adoption.",
          },
          {
            label: "02 · Menos presión, más compromiso",
            segments: [
              { label: "APERTURA PARADÓJICA", token: "Paradoxically enough,", tone: "violet" },
              { label: "ESTÍMULO REDUCIDO", token: "fewer incentives", tone: "emerald" },
              { label: "RESULTADO INVERSO", token: "produced deeper commitment.", tone: "sky" },
            ],
            explanationSpanish:
              "Para presentar un resultado de gestión que contradice la intuición, abrí con 'Paradoxically enough' y nombralo como ley del sistema. La partícula 'enough' invita al lector a compartir el descubrimiento. 'Ironically' señala burla; aquí no hay burla, hay comprensión.",
            exampleEnglish: "Paradoxically enough, fewer incentives produced deeper commitment.",
          },
          {
            label: "03 · Verdad parcial que oculta la causa",
            segments: [
              { label: "CONCESIÓN", token: "True though the claim is,", tone: "violet" },
              { label: "GIRO DIALÉCTICO", token: "it hides", tone: "emerald" },
              { label: "FACTOR REAL", token: "the real cause.", tone: "sky" },
            ],
            explanationSpanish:
              "Concedé que la observación es cierta y señalá en la misma frase que oculta el factor decisivo. El acuerdo previo da credibilidad al giro. 'But' niega de frente y desperdicia la concesión; esta fórmula conserva lo válido y reorienta la explicación.",
            exampleEnglish: "True though the claim is, it hides the real cause.",
          },
        ],
        commonMistake: {
          wrong: "In a paradoxical way, to slow down was faster.",
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

