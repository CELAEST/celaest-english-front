import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5PragmaticIdioms(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: METÁFORAS CONCEPTUALES INMUTABLES
    {
      title: "Metáforas Conceptuales Cultas: Double-edged sword / Strike a chord",
      focus: "Incorporar metáforas vivas que estructuran el pensamiento en inglés avanzado",
      payload: {
        ruleTaglineSpanish:
          "El inglés culto piensa a través de metáforas fijas que no deben traducirse con calcos del español: 'a double-edged sword' (un arma de doble filo), 'strike a chord' (resonar profundamente con alguien), 'bear in mind' (tener en cuenta), 'level playing field' (reglas de juego equitativas).",
        formulaSegments: [
          { label: "ESTRATEGIA EVALUADA", token: "That particular approach represents", tone: "violet" },
          { label: "METÁFORA CONCEPTUAL", token: "a double-edged sword", tone: "emerald" },
          { label: "JUSTIFICACIÓN", token: "for our institutional reputation.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It is an arm of double edge (traducción literal de 'arma de doble filo').",
          wrongToken: "an arm of double edge",
          correct: "It is a double-edged sword.",
          correctToken: "a double-edged sword",
          whySpanish: "Las metáforas conceptuales inglesas tienen formas léxicas inmutables.",
        },
        examples: [
          {
            english: "That particular strategy represents a double-edged sword for our reputation.",
            spanish: "Esa estrategia en particular representa un arma de doble filo para nuestra reputación.",
            pronunciationHint: "dat partíkiular strátedyi réprezénts a dábl-edzyd sord for áuer répiutéishon",
          },
          {
            english: "His insightful reflections struck a responsive chord with the entire audience.",
            spanish: "Sus perspicaces reflexiones resonaron profundamente en toda la audiencia.",
            pronunciationHint: "jis ínsaitful riflékshons strak a rispónsiv kord uid di entáier ódi-ens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esa estrategia en particular representa un arma de doble filo para nuestra reputación",
          targetTokens: ["That", "particular", "strategy", "represents", "a", "double-edged", "sword", "for", "our", "reputation"],
          distractorTokens: ["arm", "edge", "double", "representing"],
          successTipSpanish: "¡Metáfora nativa impecable! 'a double-edged sword' sin calcos del español.",
          mistakeHintSpanish: "Usa el binomio metafórico 'a double-edged sword'.",
        },
        voicePractice: {
          sentenceEnglish: "We must bear in mind that every structural decision carries long-term consequences.",
          spanishMeaning: "Debemos tener presente que cada decisión estructural conlleva consecuencias a largo plazo.",
          pronunciationHint: "ui mast ber in máind dat évri stráktchural desíshon kéris long-term kónsekuénses",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica metáforas conceptuales complejas en conferencias TED y ensayos de liderazgo.",
        },
      },
    },

    // BASE 23: EXPRESIONES DE DEBATE CRÍTICO
    {
      title: "Expresiones de Debate Crítico: Devil's advocate / Pinch of salt",
      focus: "Desafiar premisas de manera constructiva y fomentar la duda metódica en debates de alto nivel",
      payload: {
        ruleTaglineSpanish:
          "Para poner a prueba una idea sin ofender a sus autores, adopta el rol de 'devil's advocate' (abogado del diablo): 'Allow me to play devil's advocate: what happens if our core assumption is flawed?'. Y para sugerir escepticismo saludable: 'take these preliminary findings with a pinch of salt'.",
        formulaSegments: [
          { label: "APERTURA DIALÉCTICA", token: "Allow me to play devil's advocate:", tone: "violet" },
          { label: "PREGUNTA RETÓRICA DESAFIANTE", token: "what would happen if our initial premises", tone: "emerald" },
          { label: "ESCENARIO CRÍTICO", token: "proved fundamentally flawed?", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I want to be the advocate of the devil (traducción literal).",
          wrongToken: "advocate of the devil",
          correct: "Allow me to play devil's advocate.",
          correctToken: "play devil's advocate",
          whySpanish: "El modismo fijo en inglés culto es 'play devil's advocate'.",
        },
        examples: [
          {
            english: "Allow me to play devil's advocate: what would happen if our initial premises failed?",
            spanish: "Permíteme hacer de abogado del diablo: ¿qué sucedería si nuestras premisas iniciales fallaran?",
            pronunciationHint: "aláu mi tu pléi dévils ádvoket: uot uud jápen if áuer iníshal prémises féild?",
          },
          {
            english: "We should take early unverified estimates with a healthy pinch of salt.",
            spanish: "Deberíamos tomar las estimaciones preliminares no verificadas con un sano beneficio de la duda.",
            pronunciationHint: "ui shud téik érli ánvérifaid éstimáits uid a jélzi pinch ov solt",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Permíteme hacer de abogado del diablo: ¿qué pasaría si fallamos?",
          targetTokens: ["Allow", "me", "to", "play", "devil's", "advocate:", "what", "happens", "if", "we", "fail?"],
          distractorTokens: ["make", "advocating", "the", "devil"],
          successTipSpanish: "¡Herramienta dialéctica suprema! 'play devil's advocate' fomenta el debate constructivo.",
          mistakeHintSpanish: "Abre con 'Allow me to play devil's advocate:...'.",
        },
        voicePractice: {
          sentenceEnglish: "To play devil's advocate, are we certain that this methodology is universally applicable?",
          spanishMeaning: "Haciendo de abogado del diablo, ¿estamos seguros de que esta metodología es aplicable universalmente?",
          pronunciationHint: "tu pléi dévils ádvoket, ar ui sérten dat dis mezodólodzi is yúnivérsali áplikabl?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Ejercita el rol de abogado del diablo en debates orales simulados en Interview.",
        },
      },
    },

    // BASE 24: PARTÍCULAS INTENSIFICADORAS Y SCARCELY... WHEN (CHECKPOINT 3 ANCHOR)
    {
      title: "Inversión Literaria Suprema: Scarcely had... when...",
      focus: "Elevar el dramatismo temporal de eventos consecutivos con el registro literario más fino",
      payload: {
        ruleTaglineSpanish:
          "'Scarcely had [Sujeto] [Participio] when...' es la cúspide de las inversiones de inmediatez temporal. Expresa que apenas comenzaba a desplegarse un suceso cuando otro acontecimiento decisivo cambió las circunstancias por completo.",
        formulaSegments: [
          { label: "INVERSIÓN TEMPORAL LITERAL", token: "Scarcely had the session resumed", tone: "violet" },
          { label: "CONEXIÓN INMEDIATA", token: "when a unanimous consensus", tone: "emerald" },
          { label: "RESOLUCIÓN SOLEMNE", token: "was definitively reached.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Scarcely the session had resumed than a consensus was reached.",
          wrongToken: "Scarcely the session had resumed than",
          correct: "Scarcely had the session resumed when a consensus was reached.",
          correctToken: "Scarcely had the session resumed when",
          whySpanish: "'Scarcely' exige auxiliar 'had' invertido y se combina exclusivamente con 'when', jamás con 'than'.",
        },
        examples: [
          {
            english: "Scarcely had the session resumed when a unanimous consensus was reached.",
            spanish: "Apenas se había reanudado la sesión cuando se alcanzó un consenso unánime.",
            pronunciationHint: "skérsli jad de séshon riziúmd uén a yunánimes konsénsus uos richt",
          },
          {
            english: "Barely had the keynote address concluded when intense discussions erupted across the hall.",
            spanish: "Apenas había concluido el discurso magistral cuando estallaron intensas discusiones por todo el salón.",
            pronunciationHint: "bérli jad de kínout adrés konklúded uén inténs diskáshons irápted akrós de jol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Apenas se había reanudado la sesión cuando se alcanzó un consenso",
          targetTokens: ["Scarcely", "had", "the", "session", "resumed", "when", "a", "consensus", "was", "reached"],
          distractorTokens: ["than", "scarcely", "resuming", "did"],
          successTipSpanish: "¡Inversión literaria impecable! 'Scarcely had the session resumed when...'.",
          mistakeHintSpanish: "Con 'Scarcely' invierte 'had' antes del sujeto y conecta con 'when'.",
        },
        voicePractice: {
          sentenceEnglish: "Scarcely had the announcement been made when expressions of widespread support poured in.",
          spanishMeaning: "Apenas se había hecho el anuncio cuando llegaron expresiones de apoyo generalizado.",
          pronunciationHint: "skérsli jad di anáunsment bin méid uén ekspreshons ov uáidspred sapórt pord in",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe crónicas de eventos decisivos y relatos históricos con 'Scarcely had... when' en Writing Studio.",
        },
      },
    },

    // BASE 25: PASIVA ESTILÍSTICA CON SUJETO VACÍO
    {
      title: "Pasiva Estilística Impersonal: There are understood to be...",
      focus: "Presentar la existencia de factores complejos con prudencia y neutralidad de cátedra",
      payload: {
        ruleTaglineSpanish:
          "Para señalar que existen factores o discrepancias sin decir 'People think that there are many factors', utiliza la pasiva con 'There' anticipatorio: 'There are understood to be multiple variables involved' o 'There is believed to be substantial support'.",
        formulaSegments: [
          { label: "SUJETO VACÍO + PASIVA", token: "There are understood to be", tone: "violet" },
          { label: "FACTORES IDENTIFICADOS", token: "multiple underlying variables", tone: "emerald" },
          { label: "DELIMITACIÓN", token: "contributing to this phenomenon.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "People think that there is many factors (coloquial y error de concordancia).",
          wrongToken: "there is many factors",
          correct: "There are understood to be multiple factors.",
          correctToken: "There are understood to be",
          whySpanish: "Con sustantivos plurales ('factors') la pasiva utiliza 'There ARE understood to be'.",
        },
        examples: [
          {
            english: "There are understood to be multiple factors contributing to this complex phenomenon.",
            spanish: "Se considera que existen múltiples factores que contribuyen a este complejo fenómeno.",
            pronunciationHint: "der ar anderstúd tu bi máltipl fáktors kontríbiuting tu dis kómpleks fenámenon",
          },
          {
            english: "There is believed to be broad institutional consensus regarding the fundamental reform.",
            spanish: "Se cree que existe un amplio consenso institucional respecto a la reforma fundamental.",
            pronunciationHint: "der is bilívd tu bi brod ínstitiúshonal konsénsus rigárding de fándaméntal rifórm",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Se considera que existen múltiples factores contribuyendo al fenómeno",
          targetTokens: ["There", "are", "understood", "to", "be", "multiple", "factors", "contributing", "to", "phenomenon"],
          distractorTokens: ["is", "people", "say", "has"],
          successTipSpanish: "¡Elegancia científica! 'There are understood to be multiple factors' proyecta neutralidad.",
          mistakeHintSpanish: "Usa la fórmula impersonal plural 'There are understood to be...'.",
        },
        voicePractice: {
          sentenceEnglish: "There are reported to be several promising avenues for future inquiry.",
          spanishMeaning: "Se reporta que existen varias vías prometedoras para futuras indagaciones.",
          pronunciationHint: "der ar ripórted tu bi séveral prómising ávenius for fiúchur inkuáiri",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza artículos de investigación científica y reportes de organismos multilaterales.",
        },
      },
    },

    // BASE 26: REPORTING VERBS DE RIGOR ACADÉMICO
    {
      title: "Reporting Verbs de Rigor Epistémico: Posit / Contend / Refute / Concede",
      focus: "Articular debates científicos y filosóficos identificando la postura epistemológica exacta de cada autor",
      payload: {
        ruleTaglineSpanish:
          "Un pensador C1 no dice 'The author says that...'. Utiliza verbos de precisión analítica: 'posit' (postula como premisa base), 'contend' (sostiene con firmeza frente a oposición), 'concede' (admite a regañadientes un punto válido), 'refute' (demuestra con evidencia la falsedad de una tesis).",
        formulaSegments: [
          { label: "AUTOR / INVESTIGADOR", token: "The author posits that", tone: "violet" },
          { label: "TESIS FUNDAMENTAL", token: "sustainable development requires", tone: "emerald" },
          { label: "CONDICIÓN INDISPENSABLE", token: "a rigorous ethical balance.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The author says that ethics is needed (estilo escolar).",
          wrongToken: "says that ethics is needed",
          correct: "The author posits that ethics is indispensable.",
          correctToken: "posits that ethics is indispensable",
          whySpanish: "Los verbos de reporte avanzados revelan la relación lógica del autor con su propio argumento.",
        },
        examples: [
          {
            english: "The author posits that sustainable development requires a rigorous ethical balance.",
            spanish: "El autor postula que el desarrollo sostenible requiere un equilibrio ético riguroso.",
            pronunciationHint: "di ózor pózits dat sostéinabl divélopment rikuáiers a rígorus ézikal bálans",
          },
          {
            english: "While she conceded that initial metrics were flawed, she vehemently refuted the accusation of neglect.",
            spanish: "Si bien concedió que las métricas iniciales eran defectuosas, refutó con vehemencia la acusación de negligencia.",
            pronunciationHint: "uáil shi konsíded dat iníshal métriks uér flod, shi ví-ementli rifiúted di ákiuzéishon ov niglékt",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El autor postula que el desarrollo sostenible requiere un equilibrio ético",
          targetTokens: ["The", "author", "posits", "that", "sustainable", "development", "requires", "an", "ethical", "balance"],
          distractorTokens: ["says", "saying", "posited", "require"],
          successTipSpanish: "¡Rigor epistemológico! 'The author posits that...' eleva el análisis académico al máximo nivel.",
          mistakeHintSpanish: "Usa el verbo de reporte 'posits that' en presente.",
        },
        voicePractice: {
          sentenceEnglish: "Leading theorists contend that systemic adaptability is more vital than rigid forecasting.",
          spanishMeaning: "Destacados teóricos sostienen que la adaptabilidad sistémica es más vital que las proyecciones rígidas.",
          pronunciationHint: "líding zíorists konténd dat sistémik adáptabíliti is mor váital dan rídyid forkásting",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos de revisión bibliográfica y dialéctica académica con reporting verbs cultos.",
        },
      },
    },
  ];
}

