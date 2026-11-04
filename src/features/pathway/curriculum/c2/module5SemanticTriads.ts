import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5SemanticTriads(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: TRIADAS SEMÁNTICAS DE PRECISIÓN
    {
      title: "Triadas Semánticas de Precisión: Continuous vs Continual vs Constant",
      focus: "Distinguir sinónimos engañosos que diferencian a un hablante culto de uno que comete imprecisiones",
      payload: {
        ruleTaglineSpanish:
          "En C2 cada palabra ocupa su coordenada exacta: 'Continuous' describe algo ininterrumpido en el tiempo (una línea recta sin pausa); 'Continual' describe algo que se repite frecuentemente a intervalos regulares (olas que chocan contra la orilla); 'Constant' describe algo que no varía en magnitud ni lealtad.",
        formulaSegments: [
          { label: "REPETICIÓN A INTERVALOS", token: "The continual constructive reminders", tone: "violet" },
          { label: "ACCIÓN", token: "facilitated steady and continuous progress", tone: "emerald" },
          { label: "CONSTANCIA", token: "under constant ethical scrutiny.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The continuous rain stopped and started all day (error conceptual).",
          wrongToken: "continuous rain stopped and started",
          correct: "The continual rain stopped and started all day.",
          correctToken: "continual rain",
          whySpanish: "Si se detiene y vuelve a empezar, es 'continual'; si nunca se detuvo durante 5 horas, es 'continuous'.",
        },
        examples: [
          {
            english: "The continual constructive reminders facilitated steady and continuous progress throughout the year.",
            spanish: "Los continuos recordatorios (a intervalos) facilitaron un progreso constante e ininterrumpido a lo largo del año.",
            pronunciationHint: "de kontíniual konstráktiv rimáinders fasílitáited stédi and kontíniuus prógres zru-áut de yier",
          },
          {
            english: "His constant dedication provided a continuous anchor during turbulent times.",
            spanish: "Su leal dedicación invariable proporcionó un ancla ininterrumpida durante tiempos turbulentos.",
            pronunciationHint: "jis kónstant dédikéishon prováided a kontíniuus ánkor diúring térbiulent táims",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Los continuos recordatorios (a intervalos) facilitaron un progreso ininterrumpido",
          targetTokens: ["The", "continual", "reminders", "facilitated", "steady", "and", "continuous", "progress", "all", "year"],
          distractorTokens: ["continuous", "constantly", "continually", "facilitating"],
          successTipSpanish: "¡Distinción semántica quirúrgica! 'continual' para intervalos y 'continuous' para flujo ininterrumpido.",
          mistakeHintSpanish: "Usa 'continual' para los recordatorios repetidos y 'continuous' para el progreso sin pausa.",
        },
        voicePractice: {
          sentenceEnglish: "Continual refinement of our hypothesis led to continuous alignment across the entire research consortium.",
          spanishMeaning: "El perfeccionamiento continuo a intervalos de nuestra hipótesis condujo a una alineación ininterrumpida en todo el consorcio.",
          pronunciationHint: "kontíniual rifáinment ov áuer jaipózesis led tu kontíniuus aláinment akrós di entáier risérch konsórtium",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza diccionarios de uso culto (Fowler's Modern English Usage) distinguiendo triadas semánticas.",
        },
      },
    },

    // BASE 23: DESINTERESADO VS INDIFERENTE
    {
      title: "Desinteresado vs Indiferente: Disinterested vs Uninterested",
      focus: "Respetar la distinción más vulnerada del idioma entre imparcialidad ética y apatía",
      payload: {
        ruleTaglineSpanish:
          "Esta es la prueba de fuego de un hablante C2: 'Disinterested' significa imparcial, neutral y sin conflicto de intereses personales ('a disinterested judge / arbiter'). 'Uninterested' significa aburrido, apático o sin curiosidad ('an uninterested spectator'). Confundirlas destruye la precisión legal.",
        formulaSegments: [
          { label: "REQUISITO ÉTICO", token: "We require a completely disinterested mediator", tone: "violet" },
          { label: "OBJETIVO PROCESAL", token: "to guarantee absolute procedural fairness", tone: "emerald" },
          { label: "GARANTÍA", token: "for all parties involved.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The judge was uninterested in the outcome (significa que estaba aburrido o dormido).",
          wrongToken: "was uninterested in the outcome",
          correct: "The judge was completely disinterested in the outcome.",
          correctToken: "completely disinterested",
          whySpanish: "Un juez debe ser 'disinterested' (imparcial y sin ganancias personales en el fallo).",
        },
        examples: [
          {
            english: "We require a completely disinterested mediator to guarantee procedural fairness.",
            spanish: "Requerimos un mediador completamente imparcial y desinteresado para garantizar la equidad procesal.",
            pronunciationHint: "ui rikuáier a komplítli dis-íntarested mídi-éitor tu gárantí prosídyural férnes",
          },
          {
            english: "Far from being uninterested in the debate, the scholars listened with rapt attention.",
            spanish: "Lejos de mostrarse indiferentes al debate, los académicos escucharon con absorta atención.",
            pronunciationHint: "far from bí-ing an-íntarested in de dibéit, de skólars lísend uid rapt aténshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Requerimos un mediador completamente imparcial para garantizar la equidad procesal",
          targetTokens: ["We", "require", "a", "completely", "disinterested", "mediator", "to", "guarantee", "procedural", "fairness"],
          distractorTokens: ["uninterested", "requiring", "interest", "fair"],
          successTipSpanish: "¡Maestría jurídica! 'disinterested' denota imparcialidad ética libre de conflicto de interés.",
          mistakeHintSpanish: "Usa 'disinterested' para referirte a la neutralidad e imparcialidad del mediador.",
        },
        voicePractice: {
          sentenceEnglish: "A disinterested evaluation of the data is the only foundation for credible scientific consensus.",
          spanishMeaning: "Una evaluación imparcial y desinteresada de los datos es la única base para un consenso científico creíble.",
          pronunciationHint: "a dis-íntarested iváliuéishon ov de déita is di óunli faundéishon for krédibl sáientífik konsénsus",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Ejerce el rol de evaluador o árbitro imparcial ('disinterested') en tribunales simulados en Interview.",
        },
      },
    },

    // BASE 24: VERBOS DE AGUDEZA FILOSÓFICA (CHECKPOINT 3 ANCHOR)
    {
      title: "Verbos de Precisión Catedrática: Delineate / Extrapolate / Disabuse",
      focus: "Exponer metodologías complejas con verbos grecolatinos de exactitud indiscutible",
      payload: {
        ruleTaglineSpanish:
          "La prosa culta sustituye explicaciones vagas por verbos exactos: 'delineate' (trazar con rigor los límites exactos de una teoría), 'extrapolate' (deducir tendencias futuras a partir de datos conocidos), 'disabuse' (desengañar a alguien o librarlo de una falsa creencia: 'disabuse them of that error').",
        formulaSegments: [
          { label: "SUJETO ANALÍTICO", token: "The comprehensive treatise meticulously delineates", tone: "violet" },
          { label: "OBJETO DELIMITADO", token: "the precise ethical boundaries", tone: "emerald" },
          { label: "ALCANCE EPISTEMOLÓGICO", token: "governing future empirical research.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The paper shows where the limits are (estilo básico escolar).",
          wrongToken: "shows where the limits are",
          correct: "The treatise meticulously delineates the boundaries.",
          correctToken: "meticulously delineates",
          whySpanish: "'Delineate' comunica la precisión geométrica de trazar límites conceptuales sin ambigüedad.",
        },
        examples: [
          {
            english: "The report meticulously delineates the ethical responsibilities of each participant.",
            spanish: "El informe delimita con meticulosidad las responsabilidades éticas de cada participante.",
            pronunciationHint: "de ripórt métíkiulasli dilínieits di ézikal rispónsabílitis ov ich partísipant",
          },
          {
            english: "Allow me to disabuse you of the notion that consensus implies compromise of principle.",
            spanish: "Permíteme sacarte del engaño de que el consenso implica renunciar a los principios.",
            pronunciationHint: "aláu mi tu dísabiús yu ov de nóushon dat konsénsus impláis kómpramáiz ov prínsipol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El informe delimita con meticulosidad las responsabilidades éticas de cada participante",
          targetTokens: ["The", "report", "meticulously", "delineates", "the", "ethical", "responsibilities", "of", "each", "participant"],
          distractorTokens: ["shows", "describes", "delineating", "ethic"],
          successTipSpanish: "¡Rigor catedrático sublime! 'meticulously delineates' define las fronteras con exactitud de cirujano.",
          mistakeHintSpanish: "Ordena: 'The report meticulously delineates the ethical responsibilities...'.",
        },
        voicePractice: {
          sentenceEnglish: "From these verified observations, we may cautiously extrapolate broader sociological tendencies.",
          spanishMeaning: "A partir de estas observaciones verificadas, podemos extrapolar con cautela tendencias sociológicas más amplias.",
          pronunciationHint: "from diz vérifaid óbservéishons, ui mei kóshusli ekstrápoléit bróder sóusiolódzyikal téndansis",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe tratados de revisión crítica utilizando verbos de agudeza filosófica en Writing Studio.",
        },
      },
    },

    // BASE 25: PASIVA MEDIATIZADA Y DEONTOLOGÍA INSTITUCIONAL
    {
      title: "Deontología Solemne y Carga Procesal: The onus lies upon...",
      focus: "Asignar la carga de la prueba o la responsabilidad ética con la máxima gravedad legal",
      payload: {
        ruleTaglineSpanish:
          "En el lenguaje institucional de alto nivel, la responsabilidad no se pide: se formula mediante la 'onus' latina: 'The onus lies / falls squarely upon [Institución] to demonstrate compliance'. Y en peticiones solemnes: 'It is respectfully submitted that justice demands a full acquittal'.",
        formulaSegments: [
          { label: "CARGA PROBATORIA / ÉTICA", token: "The onus lies unequivocally upon", tone: "violet" },
          { label: "SUJETO OBLIGADO", token: "the supervisory board", tone: "emerald" },
          { label: "DEBER INELUDIBLE", token: "to substantiate every material claim.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It is the responsibility of the board to prove it (estilo llano).",
          wrongToken: "It is the responsibility of the board",
          correct: "The onus lies upon the board to substantiate the claim.",
          correctToken: "The onus lies upon",
          whySpanish: "'The onus lies upon' es la expresión jurídica por excelencia para la carga de la prueba.",
        },
        examples: [
          {
            english: "The onus lies unequivocally upon the claimant to substantiate the allegation.",
            spanish: "La carga de la prueba recae inequívocamente sobre la parte demandante para sustentar la acusación.",
            pronunciationHint: "di óunus láis yúnikuívokali apón de kléimant tu sabstánshiéit di álegéishon",
          },
          {
            english: "It is respectfully submitted that the tribunal lack jurisdiction in this particular matter.",
            spanish: "Se expone con el debido respeto que el tribunal carece de jurisdicción en este asunto particular.",
            pronunciationHint: "it is rispéktfuli submíted dat de traibiúnal lak dyúrisdíkshon in dis partíkiular máter",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La carga de la prueba recae inequívocamente sobre el demandante para sustentar la acusación",
          targetTokens: ["The", "onus", "lies", "unequivocally", "upon", "the", "claimant", "to", "substantiate", "allegations"],
          distractorTokens: ["responsibility", "is", "lying", "proving"],
          successTipSpanish: "¡Lenguaje de tribunal supremo! 'The onus lies unequivocally upon...' zanja la carga probatoria.",
          mistakeHintSpanish: "Abre con 'The onus lies unequivocally upon the claimant...'.",
        },
        voicePractice: {
          sentenceEnglish: "The onus rests upon our leadership to demonstrate fidelity to the covenant we established.",
          spanishMeaning: "La carga recae sobre nuestro liderazgo para demostrar fidelidad al pacto que establecimos.",
          pronunciationHint: "di óunus rests apón áuer lídership tu démonstréit fidéliti tu de kávenant ui estáblisht",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza escritos procesales ante la Corte Internacional de Justicia de La Haya.",
        },
      },
    },

    // BASE 26: ELIPSIS DIALÉCTICA EN RÉPLICAS CONCISAS
    {
      title: "Elipsis Dialéctica de Dos Palabras: Far from it / Scarcely so",
      focus: "Responder a una premisa equivocada con una sola fórmula magistral de impacto categórico",
      payload: {
        ruleTaglineSpanish:
          "Cuando en un debate te pregunten si tu posición claudicó o si la iniciativa fracasó, no des explicaciones defensivas largas. Zanja la cuestión con una elipsis dialéctica de dos palabras: 'Have we compromised our vision? Far from it; we have reaffirmed it' o 'Is that the case? Scarcely so'.",
        formulaSegments: [
          { label: "PREGUNTA RETÓRICA HOSTIL", token: "Have we compromised our foundational vision?", tone: "violet" },
          { label: "RÉPLICA FULMINANTE", token: "Far from it;", tone: "emerald" },
          { label: "REAFIRMACIÓN SOBERANA", token: "we have redoubled our commitment.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "No, that is not true at all, we did not do that (tono defensivo y atropellado).",
          wrongToken: "No, that is not true at all",
          correct: "Far from it; our resolve is firmer than ever.",
          correctToken: "Far from it",
          whySpanish: "'Far from it' o 'Quite the contrary' proyecta serenidad soberana sin entrar en pánico explicativo.",
        },
        examples: [
          {
            english: "Have we compromised our vision? Far from it; we have reaffirmed it.",
            spanish: "¿Acaso hemos renunciado a nuestra visión? — Lejos de ello; la hemos redoblado.",
            pronunciationHint: "jav ui kómpramáizd áuer víshon? far from it; ui jav ríaférmd it",
          },
          {
            english: "Has our progress stalled in the face of headwinds? Scarcely so.",
            spanish: "¿Acaso nuestro progreso se ha estancado ante los vientos en contra? — Apenas si cabe pensarlo.",
            pronunciationHint: "jas áuer prógres stold in de féis ov jéd-uinds? skérsli sou",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: ¿Acaso hemos comprometido nuestra visión? Lejos de ello; la hemos reafirmado",
          targetTokens: ["Have", "we", "compromised", "our", "vision?", "Far", "from", "it;", "we", "have", "reaffirmed", "it"],
          distractorTokens: ["Not", "at", "all", "compromise"],
          successTipSpanish: "¡Soberanía dialéctica instantánea! 'Far from it;' fulmina la sospecha con serenidad absoluta.",
          mistakeHintSpanish: "Usa la fórmula de réplica 'Far from it;' seguida de la reafirmación.",
        },
        voicePractice: {
          sentenceEnglish: "Did our conviction waver under intense public scrutiny? Scarcely so; it solidified our purpose.",
          spanishMeaning: "¿Acaso flaqueó nuestra convicción bajo el intenso escrutinio público? — En absoluto; consolidó nuestro propósito.",
          pronunciationHint: "did áuer konvíkshon uéiver ánder inténs páblik skrútini? skérsli sou; it solídifaid áuer pérpos",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Practica réplicas fulminantes y serenas ante interpelaciones hostiles en Interview.",
        },
      },
    },
  ];
}

