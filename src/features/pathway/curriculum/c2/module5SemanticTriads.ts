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
        formulaCases: [
          {
            label: "01 · Algo que nunca se interrumpió (continuous)",
            segments: [
              { label: "SITUACIÓN SIN CORTE", token: "The generator ran", tone: "violet" },
              { label: "FLUJO ININTERRUMPIDO", token: "continuous power", tone: "emerald" },
              { label: "DURACIÓN VERIFICADA", token: "for nine hours.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando lo que describes no se interrumpió ni una vez durante todo el período, usa 'continuous'. La señal es que puedes decir 'de principio a fin sin pausa'. En contraste, si se detuvo y volvió a empezar, 'continuous' miente y corresponde 'continual', que marca intervalos.",
            exampleEnglish: "The laboratory needed continuous power for nine hours.",
          },
          {
            label: "02 · Algo que se repite a intervalos (continual)",
            segments: [
              { label: "EPISODIOS REPETIDOS", token: "Continual interruptions", tone: "violet" },
              { label: "EFECTO ACUMULADO", token: "slowed the negotiations", tone: "emerald" },
              { label: "PERÍODO", token: "for months.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando algo se repite una y otra vez a intervalos regulares, la palabra es 'continual'. La señal es que puedes contar las veces o decir 'una y otra vez'. En contraste, 'continuous' prometería un flujo que nunca se cortó, y aquí sí hubo pausas entre un episodio y el siguiente.",
            exampleEnglish: "Continual interruptions slowed the negotiations for months.",
          },
          {
            label: "03 · Algo que no varía en nivel ni lealtad (constant)",
            segments: [
              { label: "APOYO INALTERADO", token: "Her constant support", tone: "violet" },
              { label: "EFECTO", token: "reassured", tone: "emerald" },
              { label: "QUIEN RECIBE", token: "the entire research team.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando algo no cambia de nivel, de intensidad ni de lealtad, usa 'constant'. La señal es la ausencia de variación, no de pausa: mide magnitud o fidelidad. En contraste, 'continuous' habla de tiempo sin corte y 'continual' de repeticiones; solo 'constant' describe un valor que se mantiene igual.",
            exampleEnglish: "Her constant support reassured the entire research team.",
          },
        ],
        commonMistake: {
          wrong: "The continuous rain stopped and started all day.",
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
        formulaCases: [
          {
            label: "01 · Nombrar a un árbitro sin conflicto de interés (disinterested)",
            segments: [
              { label: "PARTE QUE DECIDE", token: "a disinterested arbiter", tone: "violet" },
              { label: "SIN GANANCIA PERSONAL", token: "keeps the hearing fair", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando eliges a alguien que debe decidir sin ganar nada con el resultado, la palabra es 'disinterested'. La señal es el conflicto de interés, no el aburrimiento. En contraste, 'uninterested' diría que la persona no tiene curiosidad, y descalificaría justo al árbitro que necesitas.",
            exampleEnglish: "We need a disinterested arbiter for this final hearing.",
          },
          {
            label: "02 · Describir apatía o falta de curiosidad (uninterested)",
            segments: [
              { label: "PÚBLICO PRESENTE", token: "The audience", tone: "violet" },
              { label: "APATÍA OBSERVADA", token: "seemed uninterested", tone: "emerald" },
              { label: "TEMA", token: "in the second proposal.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien no siente curiosidad por un tema, usa 'uninterested'. La señal es la indiferencia hacia el contenido, sin ninguna cuestión ética de por medio. En contraste, decir 'disinterested' aquí suena a elogio equivocado: presentarías como imparcial a quien simplemente no le importa.",
            exampleEnglish: "The audience seemed uninterested in the second proposal.",
          },
        ],
        commonMistake: {
          wrong: "The judge was uninterested in the outcome.",
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
        formulaCases: [
          {
            label: "01 · Fijar los límites exactos de un concepto (delineate)",
            segments: [
              { label: "TEXTO QUE ORDENA", token: "The chapter", tone: "violet" },
              { label: "FRONTERA TRAZADA", token: "delineates the boundaries", tone: "emerald" },
              { label: "ÁMBITO ACOTADO", token: "of informed consent.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando necesitas decir dónde empieza y dónde termina un concepto, usa 'delineate'. La señal es que el lector debe ver la frontera, no solo la idea. En contraste, 'shows' o 'explains' describen sin fijar límites, y la discusión vuelve a abrirse después por pura ambigüedad.",
            exampleEnglish: "The chapter delineates the boundaries of informed consent.",
          },
          {
            label: "02 · Deducir una tendencia desde datos parciales (extrapolate)",
            segments: [
              { label: "BASE MEDIDA", token: "From these figures", tone: "violet" },
              { label: "PROYECCIÓN", token: "we can extrapolate", tone: "emerald" },
              { label: "OBJETO FUTURO", token: "future demand.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando partes de cifras conocidas para hablar de lo que aún no se midió, el verbo es 'extrapolate'. La señal es la base empírica: hay datos y hay proyección. En contraste, 'guess' no reconoce esa base y resta credibilidad al cálculo ante un lector técnico.",
            exampleEnglish: "We can extrapolate future demand from these figures.",
          },
          {
            label: "03 · Desengañar de una creencia falsa (disabuse)",
            segments: [
              { label: "CREENCIA ERRÓNEA", token: "that old assumption", tone: "violet" },
              { label: "CORRECCIÓN", token: "the audit disabused us", tone: "emerald" },
              { label: "PREPOSICIÓN OBLIGATORIA", token: "of, never about", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien sostiene una creencia equivocada y quieres quitársela, usa 'disabuse'. La señal es que la otra persona ya cree algo falso. En contraste, 'convince' solo persuade de una idea nueva; 'disabuse' siempre pide la preposición 'of' y supone corregir un error previo.",
            exampleEnglish: "The audit disabused us of that old assumption.",
          },
        ],
        commonMistake: {
          wrong: "The paper shows where the limits are.",
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
        formulaCases: [
          {
            label: "01 · Asignar la carga de la prueba (the onus lies upon)",
            segments: [
              { label: "CARGA ASIGNADA", token: "The onus lies upon", tone: "violet" },
              { label: "PARTE OBLIGADA", token: "the regulator", tone: "emerald" },
              { label: "DEBER DE PROBAR", token: "to justify the ban.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando debes decir quién tiene que probar algo ante una instancia, usa 'the onus lies upon'. La señal es que hay una afirmación en disputa y alguien debe sostenerla. En contraste, 'it is the responsibility of' reparte deberes sin nombrar la prueba, y el argumento pierde filo.",
            exampleEnglish: "The onus lies upon the regulator to justify the ban.",
          },
          {
            label: "02 · Pedir solemnemente ante un tribunal (it is respectfully submitted)",
            segments: [
              { label: "FÓRMULA DE CORTESÍA", token: "It is respectfully submitted", tone: "violet" },
              { label: "CONTENIDO DE LA PETICIÓN", token: "that the evidence is incomplete", tone: "emerald" },
              { label: "FORO", token: "before the tribunal.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando te diriges a un tribunal o a un órgano formal, abre con 'it is respectfully submitted that'. La señal es el foro y la cortesía debida. En contraste, 'I think' o 'we want' presentan la petición como opinión personal y le quitan la autoridad procesal que el escrito necesita.",
            exampleEnglish: "It is respectfully submitted that the evidence is incomplete.",
          },
        ],
        commonMistake: {
          wrong: "It is the responsibility of the board to prove it.",
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
        formulaCases: [
          {
            label: "01 · Rechazar de plano una acusación (far from it)",
            segments: [
              { label: "ACUSACIÓN PLANTEADA", token: "Critics called it surrender.", tone: "violet" },
              { label: "RÉPLICA EN DOS PALABRAS", token: "Far from it;", tone: "emerald" },
              { label: "POSICIÓN REAFIRMADA", token: "we held firm.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la pregunta hostil insinúa que abandonaste algo, responde 'Far from it'. La señal es la sospecha de claudicación. En contraste, 'No, that is not true' suena defensivo y te obliga a explicar de más; la elipsis niega y da vuelta la acusación en dos palabras.",
            exampleEnglish: "Critics called it surrender. Far from it; we held firm.",
          },
          {
            label: "02 · Negar con frialdad un diagnóstico casi cierto (scarcely so)",
            segments: [
              { label: "DIAGNÓSTICO EXAGERADO", token: "Has morale collapsed?", tone: "violet" },
              { label: "NEGACIÓN SECA", token: "Scarcely so;", tone: "emerald" },
              { label: "HECHO QUE LO DESMIENTE", token: "the team regrouped.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la premisa es casi cierta pero no lo es, 'Scarcely so' niega con frialdad y sin alarma. La señal es un hecho exagerado o apenas aplicable. En contraste, 'Far from it' rechaza desde la raíz; 'Scarcely so' admite un resto mínimo y por eso suena más seco.",
            exampleEnglish: "Has morale collapsed? Scarcely so; the team regrouped.",
          },
        ],
        commonMistake: {
          wrong: "No, that is not true at all, we did not do that.",
          wrongToken: "No, that is not true at all",
          correct: "Far from it, our resolve is firmer than ever.",
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

