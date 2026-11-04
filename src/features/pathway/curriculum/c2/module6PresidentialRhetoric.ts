import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6PresidentialRhetoric(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: EL TRICOLON RÍTMICO Y LA REGLA DEL TRES
    {
      title: "El Tricolon Rítmico: Claridad en el propósito, disciplina en la acción...",
      focus: "Agrupar tres elementos de estructura y longitud idéntica para crear resonancia emocional imborrable",
      payload: {
        ruleTaglineSpanish:
          "El 'tricolon' es el recurso rítmico más célebre de la historia retórica ('Veni, vidi, vici' / 'Of the people, by the people, for the people'). Tres frases gemelas de longitud y entonación paralelas que ascienden en intensidad emocional hasta una resolución majestuosa.",
        formulaSegments: [
          { label: "PRIMER PILAR", token: "We demand clarity in purpose,", tone: "violet" },
          { label: "SEGUNDO PILAR", token: "discipline in execution,", tone: "emerald" },
          { label: "CLÍMAX Y RESOLUCIÓN", token: "and humility in triumph.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "We need clarity, to be disciplined, and having humility (romper el paralelismo sintáctico).",
          wrongToken: "clarity, to be disciplined, and having humility",
          correct: "clarity in purpose, discipline in execution, and humility in triumph.",
          correctToken: "clarity in purpose, discipline in execution, and humility in triumph",
          whySpanish: "El tricolon exige simetría gramatical perfecta en los tres componentes.",
        },
        examples: [
          {
            english: "We demand clarity in purpose, discipline in execution, and humility in triumph.",
            spanish: "Exigimos claridad en el propósito, disciplina en la ejecución y humildad en el triunfo.",
            pronunciationHint: "ui dimánd kláriti in pérpos, dísaplin in éksikiúshon, and jiumíliti in tráiomf",
          },
          {
            english: "Let us stand together: patient in deliberation, decisive in action, and steadfast in resolve.",
            spanish: "Permanezcamos unidos: pacientes en la deliberación, decisivos en la acción e inamovibles en la determinación.",
            pronunciationHint: "let as stand tuguéder: péishent in delíberéishon, desáisiv in ákshon, and stédfast in rizólv",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Exigimos claridad en el propósito, disciplina en la ejecución y humildad en el triunfo",
          targetTokens: ["We", "demand", "clarity", "in", "purpose,", "discipline", "in", "execution,", "and", "humility", "in", "triumph"],
          distractorTokens: ["to", "be", "disciplined", "humble"],
          successTipSpanish: "¡Tricolon presidencial perfecto! Tres pilares sintácticos gemelos con cadencia hipnótica.",
          mistakeHintSpanish: "Mantén el paralelismo exacto: 'clarity in..., discipline in..., and humility in...'.",
        },
        voicePractice: {
          sentenceEnglish: "True greatness is forged through courage in adversity, wisdom in governance, and generosity in peace.",
          spanishMeaning: "La verdadera grandeza se forja mediante el valor en la adversidad, la sabiduría en la gobernanza y la generosidad en la paz.",
          pronunciationHint: "tru gréitnes is foryzd zru káridzh in advérsiti, uísdom in gáverns, and yénerósiti in pis",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Diserta discursos de liderazgo culminando con tricolon rítmico en simulaciones orales de Interview.",
        },
      },
    },

    // BASE 28: EL QUIASMO RETÓRICO (INVERSIÓN SIMÉTRICA)
    {
      title: "El Quiasmo Retórico: Ask not what your country can do for you...",
      focus: "Cruzar el orden de dos términos clave en frases consecutivas para acuñar aforismos inmortales",
      payload: {
        ruleTaglineSpanish:
          "El 'quiasmo' cruza la simetría de las palabras ($A \rightarrow B, B \rightarrow A$): 'Ask not what your country can do for you — ask what you can do for your country'. 'Let us never negotiate out of fear, but let us never fear to negotiate'. La mente del oyente queda atrapada en la belleza de la geometría conceptual.",
        formulaSegments: [
          { label: "CLÁUSULA A (VIVIR PARA TRABAJAR)", token: "Let us not live to work;", tone: "violet" },
          { label: "CONEXIÓN DE QUIASMO", token: "let us rather work to live", tone: "emerald" },
          { label: "CLÁUSULA B (TRABAJAR PARA VIVIR)", token: "with unyielding dignity and purpose.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Don't live for work, you should work so you can live well (prosa vulgar).",
          wrongToken: "you should work so you can live well",
          correct: "Let us not live to work; let us work to live.",
          correctToken: "Let us not live to work; let us work to live",
          whySpanish: "El quiasmo invierte los dos verbos exactamente en espejo para crear una ley moral imborrable.",
        },
        examples: [
          {
            english: "Let us not live to work; let us work to live with dignity and purpose.",
            spanish: "No vivamos para trabajar; trabajemos para vivir con dignidad y sentido.",
            pronunciationHint: "let as not liv tu uórk; let as uórk tu liv uid dígniti and pérpos",
          },
          {
            english: "We shape our institutions, and thereafter our institutions shape us.",
            spanish: "Nosotros forjamos nuestras instituciones, y a partir de entonces nuestras instituciones nos forjan a nosotros.",
            pronunciationHint: "ui shéip áuer ínstitiúshons, and déraftér áuer ínstitiúshons shéip as",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No vivamos para trabajar; trabajemos para vivir con dignidad",
          targetTokens: ["Let", "us", "not", "live", "to", "work;", "let", "us", "work", "to", "live", "with", "dignity"],
          distractorTokens: ["living", "working", "should", "for"],
          successTipSpanish: "¡Corona de la retórica presidencial! El quiasmo 'live to work / work to live' deslumbra por su simetría.",
          mistakeHintSpanish: "Ordena en espejo: 'Let us not live to work; let us work to live with dignity'.",
        },
        voicePractice: {
          sentenceEnglish: "Let us never compromise principle for peace, but let us never refuse peace when founded upon principle.",
          spanishMeaning: "Jamás comprometamos el principio por la paz, pero jamás rechacemos la paz cuando esté fundada en el principio.",
          pronunciationHint: "let as néver kómpramáiz prínsipol for pis, bat let as néver rifiús pis uén fáunded apón prínsipol",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe manifiestos de liderazgo y aforismos aplicando quiasmo retórico en Writing Studio.",
        },
      },
    },

    // BASE 29: EL DOMINIO DEL SUBTEXTO Y LA PRESUPOSICIÓN PRAGMÁTICA
    {
      title: "El Dominio del Subtexto: Presuposición Pragmática",
      focus: "Comunicar verdades complejas mediante presuposición sin necesidad de formular acusaciones explícitas",
      payload: {
        ruleTaglineSpanish:
          "En la oratoria C2 no necesitas lanzar ataques directos. Utiliza la presuposición pragmática: al decir 'When the administration finally recognizes the accumulated evidence, we shall proceed', estás comunicando de forma irrefutable que hasta hoy no la han reconocido, sin necesidad de usar insultos ni adjetivos agresivos.",
        formulaSegments: [
          { label: "CLÁUSULA TEMPORAL CON PRESUPOSICIÓN", token: "When the committee finally acknowledges", tone: "violet" },
          { label: "HECHO INEVITABLE", token: "the overwhelming weight of empirical evidence,", tone: "emerald" },
          { label: "ACCIÓN FUTURA SOBERANA", token: "we stand prepared to collaborate without rancor.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The committee is blind and refuses to see the truth (agresivo y tosco).",
          wrongToken: "is blind and refuses to see",
          correct: "When the committee finally acknowledges the evidence, progress will follow.",
          correctToken: "When the committee finally acknowledges",
          whySpanish: "La presuposición con 'finally' transmite la falta ajena como un hecho consumado e indiscutible.",
        },
        examples: [
          {
            english: "When the committee finally acknowledges the accumulated evidence, we shall proceed.",
            spanish: "Cuando el comité finalmente reconozca la evidencia acumulada, podremos avanzar.",
            pronunciationHint: "uén de komíti fáinali aknóledzhes di akiúmiuléited évidens, ui shal prosíd",
          },
          {
            english: "Once institutional transparency ceases to be a slogan and becomes a practice, trust will be restored.",
            spanish: "Una vez que la transparencia institucional deje de ser un eslogan y se convierta en práctica, la confianza se restaurará.",
            pronunciationHint: "uans ínstitiúshonal transpérensi síses tu bi a slóugan and bikóms a práktis, trast uil bi ristórd",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Cuando el comité finalmente reconozca la evidencia, podremos avanzar",
          targetTokens: ["When", "the", "committee", "finally", "acknowledges", "the", "accumulated", "evidence,", "we", "shall", "proceed"],
          distractorTokens: ["if", "acknowledging", "should", "will"],
          successTipSpanish: "¡Subtexto soberano impecable! Presupones la verdad fáctica con elegancia inatacable.",
          mistakeHintSpanish: "Abre con 'When the committee finally acknowledges...'.",
        },
        voicePractice: {
          sentenceEnglish: "When our shared commitment transcends temporary political convenience, enduring stability will prevail.",
          spanishMeaning: "Cuando nuestro compromiso compartido trascienda la conveniencia política temporal, la estabilidad duradera prevalecerá.",
          pronunciationHint: "uén áuer sherd komítment transénds témporari polítikal konvíniens, endiúring stabíliti uil privéil",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza el subtexto y las presuposiciones en debates parlamentarios históricos en Reading.",
        },
      },
    },

    // BASE 30: PROSODIA DE AUTORIDAD SERENA E INFLEXIÓN C2
    {
      title: "Prosodia de Autoridad Serena: La Inflexión Cadente y el Pacing Monumental",
      focus: "Eliminar el tono interrogativo involuntario (uptalk) proyectando serenidad soberana en cada enunciado",
      payload: {
        ruleTaglineSpanish:
          "El error fatal de los oradores inseguros es el 'uptalk': subir la entonación al final de las frases afirmativas como pidiendo permiso para hablar. El maestro C2 aplica la inflexión cadente: cada enunciado concluye en una nota grave, firme y sostenida. Cada frase aterriza como un bloque de mármol que nadie puede mover.",
        formulaSegments: [
          { label: "APERTURA SERENA", token: "This resolution is not open to compromise;", tone: "violet" },
          { label: "SILENCIO INTENCIONAL", token: "[strategic resonant silence]", tone: "emerald" },
          { label: "CADENCIA DESCENDENTE FIRME", token: "it embodies our definitive institutional standard.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Terminar oraciones afirmativas con tono ascendente agudo (hace que una certeza suene a duda).",
          wrongToken: "uptalk interrogativo",
          correct: "Descender el tono de voz en la última sílaba con firmeza serena y tranquila.",
          correctToken: "inflexión cadente C2",
          whySpanish: "La autoridad serena no grita; proyecta certeza mediante notas graves y silencios deliberados.",
        },
        examples: [
          {
            english: "This covenant is not subject to renegotiation; it embodies our permanent commitment.",
            spanish: "Este pacto no está sujeto a renegociación; encarna nuestro compromiso permanente.",
            pronunciationHint: "dis kávenant is not sabdyékt tu rinígoushiéishon; it embódis áuer pérmanent komítment",
          },
          {
            english: "On this matter of fundamental ethics, our position is immutable.",
            spanish: "En este asunto de ética fundamental, nuestra posición es inmutable.",
            pronunciationHint: "on dis máter ov fándaméntal éziks, áuer pozíshon is imiútabl",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: En este asunto de ética fundamental, nuestra posición es inmutable",
          targetTokens: ["On", "this", "matter", "of", "fundamental", "ethics,", "our", "position", "is", "immutable"],
          distractorTokens: ["are", "ethic", "immutably", "being"],
          successTipSpanish: "¡Gravedad y peso marmóreo! Cada palabra asienta con autoridad serena.",
          mistakeHintSpanish: "Construye con 'On this matter of fundamental ethics, our position is immutable'.",
        },
        voicePractice: {
          sentenceEnglish: "Our allegiance is pledged not to fleeting trends, but to timeless principles of justice.",
          spanishMeaning: "Nuestra lealtad está empeñada no ante tendencias pasajeras, sino ante principios atemporales de justicia.",
          pronunciationHint: "áuer alídyans is pledyzd not tu flíting trends, bat tu táimlis prínsipols ov dyástis",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Graba tu voz modulando la cadencia descendente y eliminando el uptalk en simulaciones de Interview.",
        },
      },
    },

    // BASE 31: LA TÉCNICA DEL BRIDGE AND PIVOT DIALÉCTICO DE ÉLITE
    {
      title: "El Bridge and Pivot Dialéctico: Reorientar Debates Hostiles con Distinción",
      focus: "Responder a preguntas capciosas o tendenciosas reconduciendo el foco hacia el mensaje central",
      payload: {
        ruleTaglineSpanish:
          "Cuando te formulen una pregunta capciosa o malintencionada en una rueda de prensa o debate público, no caigas en la trampa defensiva. Valida la pregunta con cortesía ('That is indeed an intriguing inquiry;') y tiende un puente de pivote hacia tu eje medular: 'however, the more foundational dilemma we must confront is ethical viability'.",
        formulaSegments: [
          { label: "VALIDACIÓN CORTÉS (PUENTE)", token: "That is indeed a legitimate inquiry;", tone: "violet" },
          { label: "PIVOTE ESTRATÉGICO", token: "however, the foundational dilemma", tone: "emerald" },
          { label: "RECONDUCCIÓN SOBERANA", token: "we must confront is long-term ethical viability.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I won't answer that because your question is biased (confrontación torpe).",
          wrongToken: "your question is biased",
          correct: "That is an intriguing question; however, the core issue is...",
          correctToken: "however, the core issue is...",
          whySpanish: "El 'bridge and pivot' desactiva la trampa sin hostilidad y te devuelve el control absoluto del escenario.",
        },
        examples: [
          {
            english: "That is a legitimate inquiry; however, the foundational dilemma we must confront is ethical viability.",
            spanish: "Esa es una pregunta legítima; sin embargo, el dilema fundamental que debemos encarar es la viabilidad ética.",
            pronunciationHint: "dat is a lidyítimet inkuáiri; jáuever, de faundéishonal diléma ui mast konfránt is ézikal váiabíliti",
          },
          {
            english: "I understand that concern; nevertheless, the overarching imperative remains systemic resilience.",
            spanish: "Comprendo esa inquietud; no obstante, el imperativo primordial sigue siendo la resiliencia sistémica.",
            pronunciationHint: "ai anderstánd dat konsérn; néverdelés, di óuverárching impérativ riméins sistémik rizíliens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esa es una pregunta legítima; sin embargo, el dilema fundamental es la viabilidad ética",
          targetTokens: ["That", "is", "a", "legitimate", "inquiry;", "however,", "the", "foundational", "dilemma", "is", "ethical", "viability"],
          distractorTokens: ["bad", "question", "answering", "ethic"],
          successTipSpanish: "¡Técnica de cancillería suprema! Reconduces el debate con cortesía inquebrantable.",
          mistakeHintSpanish: "Abre con 'That is a legitimate inquiry; however, the foundational dilemma is...'.",
        },
        voicePractice: {
          sentenceEnglish: "While that perspective is well-taken, the paramount challenge before us is preserving public trust.",
          spanishMeaning: "Si bien esa perspectiva es atendible, el desafío primordial ante nosotros es preservar la confianza pública.",
          pronunciationHint: "uáil dat perspéktiv is uel-téiken, de páramaunt cháliny bifór as is prizérving páblik trast",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Ejercita la técnica del bridge and pivot ante preguntas inquisitivas en simulaciones de Interview.",
        },
      },
    },

    // BASE 32: GRAN CERTIFICACIÓN C2: THE SOVEREIGN SPEAKER (LA CONSAGRACIÓN)
    {
      title: "Gran Certificación C2: The Sovereign Speaker (La Consagración)",
      focus: "La prueba final de maestría absoluta: integración total de oratoria, quiasmo, tricolon y soberanía lingüística",
      payload: {
        ruleTaglineSpanish:
          "Has alcanzado la cima del idioma inglés. Dominas las cláusulas absolutas ('The deliberations concluded,'), el tricolon rítmico ('clarity in purpose, discipline in execution, and humility in triumph'), el quiasmo aforístico ('Let us not live to work; let us work to live') y la hendidura invertida. Ya no hablas inglés: habitas el idioma con soberanía absoluta.",
        formulaSegments: [
          { label: "CLÁUSULA ABSOLUTA DE APERTURA", token: "The deliberations concluded,", tone: "violet" },
          { label: "TRICOLON PRESIDENCIAL", token: "we demand clarity in purpose, discipline in execution, and humility in triumph.", tone: "emerald" },
          { label: "QUIASMO HISTÓRICO FINAL", token: "That enduring perseverance it was that prevailed beyond the shadow of a doubt.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Dudar o sentir que el idioma es una barrera ajena.",
          wrongToken: "barrera idiomática",
          correct: "Habitar el idioma con libertad estética, rigor conceptual y autoridad serena.",
          correctToken: "soberanía C2 definitiva",
          whySpanish: "El Sovereign Speaker piensa, siente y persuade directamente en la lengua inglesa sin intermediación del español.",
        },
        examples: [
          {
            english: "The deliberations concluded, we demand clarity in purpose, discipline in execution, and humility in triumph. That unyielding perseverance it was that prevailed.",
            spanish: "Concluidas las deliberaciones, exigimos claridad en el propósito, disciplina en la ejecución y humildad en el triunfo. Esa inquebrantable perseverancia fue la que prevaleció.",
            pronunciationHint: "de delíberéishons konklúded, ui dimánd kláriti in pérpos, dísaplin in éksikiúshon, and jiumíliti in tráiomf. dat an-yílding pérsevírans it uos dat privéild",
          },
          {
            english: "Standing at this historical juncture, let us not live to work; let us work to live with dignity. Prevailed we have, beyond the shadow of a doubt.",
            spanish: "Situados en esta encrucijada histórica, no vivamos para trabajar; trabajemos para vivir con dignidad. Prevalecer hemos prevalecido, más allá de toda duda razonable.",
            pronunciationHint: "stánding at dis jistórikal yánkchur, let as not liv tu uórk; let as uórk tu liv uid dígniti. privéild ui jav, biyond de shádou ov a dáut",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Concluidas las deliberaciones, exigimos claridad en el propósito, disciplina en la ejecución y humildad en el triunfo",
          targetTokens: ["The", "deliberations", "concluded,", "we", "demand", "clarity", "in", "purpose,", "discipline", "in", "execution,", "and", "humility", "in", "triumph"],
          distractorTokens: ["When", "were", "disciplined", "humble"],
          successTipSpanish: "¡Consagración C2 absoluta! Eres The Sovereign Speaker: dominas la lengua inglesa en su más alta cumbre.",
          mistakeHintSpanish: "Ordena: 'The deliberations concluded, we demand clarity in purpose, discipline in execution, and humility in triumph'.",
        },
        voicePractice: {
          sentenceEnglish: "The deliberations concluded, we stand sovereign: clear in purpose, resolute in execution, and humble in triumph.",
          spanishMeaning: "Concluidas las deliberaciones, nos erigimos soberanos: claros en el propósito, resueltos en la ejecución y humildes en el triunfo.",
          pronunciationHint: "de delíberéishons konklúded, ui stand sóvrin: klíar in pérpos, rézolut in éksikiúshon, and jámbl in tráiomf",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Diserta tu discurso final de graduación C2 ante el mentor Gonzalo para obtener tu consagración como Sovereign Speaker.",
        },
      },
    },
  ];
}

