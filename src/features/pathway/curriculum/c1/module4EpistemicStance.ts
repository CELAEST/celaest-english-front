import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4EpistemicStance(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: LITOTES Y UNDERSTATEMENT BRITÁNICO
    {
      title: "Litotes y Understatement Británico: Not entirely inaccurate...",
      focus: "Afirmar algo positivo negando su opuesto con sutil ironía y contención diplomática",
      payload: {
        ruleTaglineSpanish:
          "El 'litote' o 'understatement' es la firma de la prudencia culta británica: en vez de afirmar con arrogancia 'This was a massive failure', di con contención: 'To say that the project faced challenges would be a significant understatement'. Y para decir que algo fue bueno: 'It was not an entirely unsuccessful effort'.",
        formulaSegments: [
          { label: "PREMISIS DE CONTENCIÓN", token: "To say that the initiative faced opposition", tone: "violet" },
          { label: "CONDICIONAL MODERADO", token: "would be", tone: "emerald" },
          { label: "LITOTE RETÓRICO", token: "a considerable understatement.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Elogiar sin jactancia (not without merit)",
            segments: [
              { label: "NEGACIÓN DEL OPUESTO", token: "is not without", tone: "violet" },
              { label: "CUALIDAD", token: "merit / value", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres elogiar algo sin parecer entusiasta ingenuo, niega el opuesto: 'not without merit' vale más que 'good' en un informe. 'Good' evalúa y cierra; la negación del opuesto sugiere que sopesaste defectos y aun así lo apruebas.",
            exampleEnglish: "The proposal is not without merit.",
          },
          {
            label: "02 · Suavizar lo negativo (less than + adjetivo)",
            segments: [
              { label: "SUJETO", token: "The response", tone: "violet" },
              { label: "ATENUADOR", token: "was less than", tone: "emerald" },
              { label: "ADJETIVO", token: "enthusiastic", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la realidad es claramente mala y no querés ser brutal en público, usa 'less than + adjetivo': 'less than enthusiastic' dice fracaso sin decirlo. Decir 'bad' o 'a disaster' cierra la conversación y te deja sin margen.",
            exampleEnglish: "The response was less than enthusiastic.",
          },
          {
            label: "03 · Nombrar lo evidente como understatement",
            segments: [
              { label: "MARCO RETÓRICO", token: "To call that delay", tone: "violet" },
              { label: "LITOTE", token: "would be an understatement", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el hecho es tan obvio que negarlo te haría perder credibilidad, reconócelo con 'To say / To call X would be an understatement'. La frase admite la gravedad sin gritarla; describir el hecho con un adjetivo visceral te hace parecer descontrolado.",
            exampleEnglish: "To call that delay a setback would be an understatement.",
          },
        ],
        commonMistake: {
          wrong: "The meeting was a disaster and a total failure.",
          wrongToken: "a disaster and a total failure",
          correct: "To say the meeting was challenging would be an understatement.",
          correctToken: "would be an understatement",
          whySpanish: "El understatement británico modera la afirmación proyectando madurez y autocontrol emocional.",
        },
        examples: [
          {
            english: "To say that the initiative faced opposition would be a significant understatement.",
            spanish: "Decir que la iniciativa enfrentó oposición sería quedarse sumamente corto.",
            pronunciationHint: "tu séi dat di iníshietiv féist ópozíshon uud bi a signífikant ándarstéitment",
          },
          {
            english: "The preliminary prototype was not entirely without merit.",
            spanish: "El prototipo preliminar no carecía en absoluto de mérito.",
            pronunciationHint: "de prilíminari prótotáip uos not entáierli uidáut mérit",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Decir que la iniciativa enfrentó oposición sería quedarse corto",
          targetTokens: ["To", "say", "the", "initiative", "faced", "opposition", "would", "be", "an", "understatement"],
          distractorTokens: ["is", "saying", "overstatement", "was"],
          successTipSpanish: "¡Understatement magistral! 'would be an understatement' modula el impacto con maestría.",
          mistakeHintSpanish: "Abre con 'To say the initiative faced opposition would be an understatement'.",
        },
        voicePractice: {
          sentenceEnglish: "The committee's reaction was not entirely unexpected given the circumstances.",
          spanishMeaning: "La reacción del comité no fue del todo inesperada dadas las circunstancias.",
          pronunciationHint: "de komítis ríakshon uos not entáierli ánekspékted gíven de sérkemstánses",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Modera críticas y evaluaciones complejas utilizando understatement y litotes en entrevistas.",
        },
      },
    },

    // BASE 18: PROBABILIDAD Y CERTEZA GRADUAL
    {
      title: "Certeza Gradual sin Dogmatismo: All but impossible / By no means certain",
      focus: "Calibrar el grado de certidumbre con exactitud matemática evitando absolutos ingenuos",
      payload: {
        ruleTaglineSpanish:
          "Un pensador C1 evita decir categóricamente 'It is impossible' o 'It is certain'. Usa modificadores de probabilidad gradual: 'all but impossible' (prácticamente imposible), 'by no means certain' (dista mucho de ser seguro) o 'bound to happen' (inevitable lógicamente).",
        formulaSegments: [
          { label: "SUJETO / VARIABLE", token: "The ultimate outcome of the deliberation", tone: "violet" },
          { label: "CÓPULA", token: "is", tone: "emerald" },
          { label: "CALIBRACIÓN GRADUAL", token: "by no means certain.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Duda razonable sobre un resultado (by no means)",
            segments: [
              { label: "SUJETO", token: "The timeline", tone: "violet" },
              { label: "NEGACIÓN ENFÁTICA", token: "is by no means", tone: "emerald" },
              { label: "ESTADO", token: "settled", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la evidencia deja la pregunta abierta y no querés comprometerte, usa 'by no means + adjetivo'. Es la forma culta de negar con fuerza: 'not certain at all' suena coloquial y delata duda improvisada más que análisis.",
            exampleEnglish: "The timeline is by no means settled.",
          },
          {
            label: "02 · Casi imposible (all but)",
            segments: [
              { label: "CONDICIÓN", token: "Agreement without data", tone: "violet" },
              { label: "GRADO CASI TOTAL", token: "is all but", tone: "emerald" },
              { label: "RESULTADO", token: "impossible", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la lógica vuelve un resultado casi imposible, 'all but + adjetivo' transmite ese borde: no es imposible del todo, pero no queda margen práctico. 'Almost' describe una distancia; 'all but' argumenta que la excepción no sirve para decidir.",
            exampleEnglish: "Agreement without data is all but impossible.",
          },
          {
            label: "03 · Consecuencia inevitable (bound to)",
            segments: [
              { label: "SUJETO", token: "Prices", tone: "violet" },
              { label: "DEDUCCIÓN", token: "are bound to", tone: "emerald" },
              { label: "EFECTO", token: "rise", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando una cadena causal hace inevitable el efecto, usa 'is / are bound to + verbo'. Suena a deducción, no a promesa: 'will' anuncia tu voluntad o tu apuesta, mientras que 'bound to' muestra que las condiciones ya lo determinan.",
            exampleEnglish: "Prices are bound to rise after the announcement.",
          },
        ],
        commonMistake: {
          wrong: "The result is not certain at all.",
          wrongToken: "not certain at all",
          correct: "The result is by no means certain.",
          correctToken: "by no means certain",
          whySpanish: "'By no means certain' es la fórmula canónica para expresar duda razonable de alto nivel.",
        },
        examples: [
          {
            english: "The ultimate outcome of the deliberation is by no means certain.",
            spanish: "El resultado final de la deliberación dista mucho de ser seguro.",
            pronunciationHint: "di áltimet áutkam ov de delíberéishon is bai nóu minz sérten",
          },
          {
            english: "Achieving consensus without adequate preparation is all but impossible.",
            spanish: "Lograr consenso sin una preparación adecuada es prácticamente imposible.",
            pronunciationHint: "achíving konsénsus uidáut ádekuet préparéishon is ol bat impósibl",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El resultado final de la deliberación dista mucho de ser seguro",
          targetTokens: ["The", "ultimate", "outcome", "of", "the", "deliberation", "is", "by", "no", "means", "certain"],
          distractorTokens: ["not", "never", "at", "all"],
          successTipSpanish: "¡Precisión probabilística! 'by no means certain' matiza con rigor científico.",
          mistakeHintSpanish: "Ordena: '...is by no means certain'.",
        },
        voicePractice: {
          sentenceEnglish: "A complete recovery is by no means guaranteed without disciplined adherence to protocols.",
          spanishMeaning: "Una recuperación completa de ninguna manera está garantizada sin apego disciplinado a los protocolos.",
          pronunciationHint: "a komplít rikóveri is bai nóu minz gárantíd uidáut dísaplind adjírens tu prótokols",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza análisis de riesgos y estudios de prospectiva formulados con certeza gradual.",
        },
      },
    },

    // BASE 19: CONSTRUCCIONES CON STAND TO Y POISED TO
    {
      title: "Construcciones Dinámicas de Posición: Stand to gain / Poised to lead",
      focus: "Expresar potencial inminente de ganancia, pérdida o liderazgo con fuerza activa",
      payload: {
        ruleTaglineSpanish:
          "En lugar de decir estáticamente 'The company has an opportunity to win', usa la construcción dinámica: 'The community stands to gain immensely' (tiene todo por ganar) o 'They stand to lose everything' (arriesgan perderlo todo). Y para indicar que alguien está listo para el salto: 'is poised to expand'.",
        formulaSegments: [
          { label: "SUJETO ACTIVO", token: "The entire academic community", tone: "violet" },
          { label: "CONSTRUCCIÓN DINÁMICA", token: "stands to gain immensely", tone: "emerald" },
          { label: "CONDICIÓN DE IMPACTO", token: "from this collaborative partnership.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Lo que alguien gana o pierde (stand to)",
            segments: [
              { label: "SUJETO", token: "Small suppliers", tone: "violet" },
              { label: "EXPOSICIÓN", token: "stand to", tone: "emerald" },
              { label: "GANANCIA O RIESGO", token: "lose the most", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando una decisión expone a alguien a una consecuencia clara, usa 'stand to + gain / lose / benefit'. 'Has an opportunity' describe una posibilidad vaga; 'stands to lose' nombra el riesgo concreto y obliga a sopesarlo antes de votar.",
            exampleEnglish: "Small suppliers stand to lose the most.",
          },
          {
            label: "02 · Listo para el siguiente paso (poised to)",
            segments: [
              { label: "SUJETO", token: "The firm", tone: "violet" },
              { label: "POSICIÓN", token: "is poised to", tone: "emerald" },
              { label: "MOVIMIENTO", token: "enter the market", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando todo está preparado y solo falta ejecutar, usa 'is poised to + verbo'. Se distingue de 'ready to': 'ready' habla de disposición interna, mientras que 'poised' describe una posición estratégica desde la que el paso siguiente es natural.",
            exampleEnglish: "The firm is poised to enter the market.",
          },
        ],
        commonMistake: {
          wrong: "The team has the position to win.",
          wrongToken: "has the position to win",
          correct: "The team stands to gain immensely.",
          correctToken: "stands to gain",
          whySpanish: "'Stand to gain / lose' es el modismo nativo culto para beneficio o riesgo inminente.",
        },
        examples: [
          {
            english: "The entire academic community stands to gain immensely from this partnership.",
            spanish: "Toda la comunidad académica tiene mucho por ganar con esta colaboración.",
            pronunciationHint: "di entáier ákadémik komiúniti stands tu géin iménsli from dis pártnership",
          },
          {
            english: "The institution is poised to lead the transition toward sustainable practices.",
            spanish: "La institución está en posición inmejorable para liderar la transición hacia prácticas sostenibles.",
            pronunciationHint: "di ínstitiúshon is póist tu lid de transíshon touárd sostéinabl práktises",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La comunidad académica tiene mucho por ganar con esta colaboración",
          targetTokens: ["The", "academic", "community", "stands", "to", "gain", "immensely", "from", "this", "partnership"],
          distractorTokens: ["has", "gaining", "for", "stand"],
          successTipSpanish: "¡Dinamismo nativo! 'stands to gain immensely' proyecta visión estratégica.",
          mistakeHintSpanish: "Construye con 'stands to gain immensely from...'.",
        },
        voicePractice: {
          sentenceEnglish: "All stakeholders stand to benefit from a transparent and coherent framework.",
          spanishMeaning: "Todas las partes interesadas tienen todo por beneficiarse de un marco transparente y coherente.",
          pronunciationHint: "ol stéik-jóulders stand tu bénefit from a transpérent and kojírent fréimuork",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe propuestas estratégicas y análisis de valor con 'stands to gain' y 'poised to' en Writing Studio.",
        },
      },
    },

    // BASE 20: CONCESIÓN FORZOSA Y AXIOMAS INNEGABLES
    {
      title: "Concesión Forzosa: There is no denying that / It goes without saying",
      focus: "Admitir un hecho desfavorable o evidente antes de introducir el contraargumento de peso",
      payload: {
        ruleTaglineSpanish:
          "Para ganarte la confianza de un interlocutor escéptico, admite con nobleza la parte difícil de la realidad: 'There is no denying that the path is steep; nonetheless, the destination warrants the effort'. Desarmas la objeción antes de que la otra parte la pronuncie.",
        formulaSegments: [
          { label: "CONCESIÓN ADMITIDA", token: "There is no denying that the road is arduous;", tone: "violet" },
          { label: "PIVOTE RIGUROSO", token: "nonetheless, the ultimate destination", tone: "emerald" },
          { label: "JUSTIFICACIÓN FINAL", token: "fully warrants our disciplined persistence.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Admitir lo que el otro espera que niegues",
            segments: [
              { label: "CONCESIÓN IMPERSONAL", token: "There is no denying that", tone: "violet" },
              { label: "HECHO ADVERSO", token: "costs have risen", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando tu interlocutor espera que minimices un dato incómodo, admítelo con 'There is no denying that'. La fórmula impersonal da gravedad: 'Nobody can deny' suena a reto y pone al otro a la defensiva, justo lo contrario de lo que buscas.",
            exampleEnglish: "There is no denying that costs have risen sharply.",
          },
          {
            label: "02 · Dar por evidente un principio compartido",
            segments: [
              { label: "BASE ACEPTADA", token: "It goes without saying that", tone: "violet" },
              { label: "PRINCIPIO", token: "safety comes first", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el punto ya está aceptado por ambas partes y querés usarlo como base, decí 'It goes without saying that'. Ahorra una discusión inútil; 'obviously' consigue lo contrario, porque trata al oyente como si no hubiera entendido.",
            exampleEnglish: "It goes without saying that safety comes first.",
          },
          {
            label: "03 · Sostener la tesis tras conceder (nonetheless)",
            segments: [
              { label: "CONCESIÓN", token: "The evidence is thin;", tone: "violet" },
              { label: "PIVOTE", token: "nonetheless,", tone: "emerald" },
              { label: "TESIS", token: "the case deserves review", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando ya concediste un punto débil y no querés abandonar tu conclusión, abre la segunda parte con 'nonetheless'. Va tras punto o punto y coma, nunca después de 'and'. Con 'but' retrocedés; con 'nonetheless' mantenés la tesis sin negar el dato.",
            exampleEnglish: "The evidence is thin; nonetheless, the case deserves review.",
          },
        ],
        commonMistake: {
          wrong: "Nobody can deny that it is hard.",
          wrongToken: "Nobody can deny",
          correct: "There is no denying that it is arduous.",
          correctToken: "There is no denying that",
          whySpanish: "'There is no denying that' aporta la gravedad impersonal requerida en debates de alto nivel.",
        },
        examples: [
          {
            english: "There is no denying that the path is steep; nonetheless, the destination warrants the effort.",
            spanish: "No se puede negar que el camino es empinado; sin embargo, el destino amerita el esfuerzo.",
            pronunciationHint: "der is nóu dinái-ing dat de paz is stip; nándeless, de déstinéishon uórrants di éfort",
          },
          {
            english: "It goes without saying that rigorous ethical standards must guide every decision.",
            spanish: "Huelga decir que estándares éticos rigurosos deben guiar cada decisión.",
            pronunciationHint: "it góus uidáut séi-ing dat rígorus ézikal stándards mast gáid évri desíshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No se puede negar que el camino es empinado; sin embargo, el destino lo amerita",
          targetTokens: ["There", "is", "no", "denying", "that", "the", "path", "is", "steep;", "nonetheless,", "it", "warrants", "effort"],
          distractorTokens: ["Nobody", "can", "deny", "denied"],
          successTipSpanish: "¡Estrategia dialéctica magistral! Admitir con 'There is no denying that' desarma cualquier objeción.",
          mistakeHintSpanish: "Abre con la fórmula impersonal 'There is no denying that...'.",
        },
        voicePractice: {
          sentenceEnglish: "There is no denying that structural adjustments require patience and consistent resolve.",
          spanishMeaning: "No se puede negar que los ajustes estructurales requieren paciencia y determinación constante.",
          pronunciationHint: "der is nóu dinái-ing dat stráktchural adyástments rikuáier péishens and konsístent rizólv",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Reconoce dificultades sin perder la compostura aplicando concesión forzosa en debates en vivo.",
        },
      },
    },

    // BASE 21: CONTRASTE CONCESIVO CON MUCH AS
    {
      title: "Contraste Afectivo y Desacuerdo Firme: Much as I respect your view...",
      focus: "Expresar aprecio o respeto profundo inmediatamente antes de plantear una discrepancia innegociable",
      payload: {
        ruleTaglineSpanish:
          "Para disentir con la máxima finura diplomática, abre con 'Much as + Sujeto + Verbo de aprecio': 'Much as I respect your viewpoint, I must respectfully disagree with your conclusion'. Expresa que valoras a la persona, pero la evidencia te obliga a diferir.",
        formulaSegments: [
          { label: "APRECIO PREVIO", token: "Much as I respect your perspective,", tone: "violet" },
          { label: "DESACUERDO CORDIAL", token: "I must respectfully disagree", tone: "emerald" },
          { label: "NÚCLEO DE LA DISCREPANCIA", token: "with the proposed methodology.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Disentir de alguien que respetas",
            segments: [
              { label: "APRECIO", token: "Much as I respect her work,", tone: "violet" },
              { label: "DESACUERDO", token: "this draft is not ready", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la discrepancia es con alguien que valorás y temés ofender, abrí con 'Much as I respect + persona u opinión'. La inversión muestra que el respeto es real; 'I respect you, but' separa las frases y suena a preámbulo defensivo preparado.",
            exampleEnglish: "Much as I respect her work, this draft is not ready.",
          },
          {
            label: "02 · Rechazar un pedido sin despreciar a quien lo hace",
            segments: [
              { label: "VOLUNTAD REAL", token: "Much as I would like to help,", tone: "violet" },
              { label: "LÍMITE", token: "my schedule is full", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando rechazás un pedido por una limitación y no por falta de voluntad, usá 'Much as I would like to + verbo'. El énfasis demuestra que el pedido te importa; 'I would like to, but' en inglés suena a excusa tibia y deja al otro con la duda.",
            exampleEnglish: "Much as I would like to help, my week is full.",
          },
          {
            label: "03 · Lamentar una decisión que igual sostenés",
            segments: [
              { label: "LAMENTO", token: "Much as we regret the delay,", tone: "violet" },
              { label: "DECISIÓN FIRME", token: "the deadline stands", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando aplicás una norma que también te cuesta, decí 'Much as we regret + hecho' y después la decisión. Reconocer el coste sin cambiar de rumbo da credibilidad; 'We regret the delay' solo informa y deja la impresión de que la norma se impone sin criterio.",
            exampleEnglish: "Much as we regret the delay, the deadline stands.",
          },
        ],
        commonMistake: {
          wrong: "For much that I respect you, I disagree.",
          wrongToken: "For much that I respect",
          correct: "Much as I respect your perspective, I disagree.",
          correctToken: "Much as I respect",
          whySpanish: "En inglés culto la construcción es estrictamente 'Much as + sujeto + verbo'.",
        },
        examples: [
          {
            english: "Much as I respect your viewpoint, I must respectfully disagree with that conclusion.",
            spanish: "Por mucho que respete tu punto de vista, debo discrepar respetuosamente con esa conclusión.",
            pronunciationHint: "mach as ai rispékt yor viú-póint, ai mast rispéktfuli dísagrí uid dat konklúshon",
          },
          {
            english: "Much as we would like to proceed immediately, prudence dictates a measured pause.",
            spanish: "Por mucho que nos gustaría avanzar de inmediato, la prudencia dicta una pausa mesurada.",
            pronunciationHint: "mach as ui uud láik tu prosíd imídietli, prúdens diktéits a méshurd pos",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por mucho que respete tu punto de vista, debo discrepar con esa conclusión",
          targetTokens: ["Much", "as", "I", "respect", "your", "viewpoint,", "I", "must", "disagree", "with", "that", "conclusion"],
          distractorTokens: ["For", "that", "respecting", "disagreed"],
          successTipSpanish: "¡Diplomacia de élite! 'Much as I respect...' desarma la hostilidad del desacuerdo.",
          mistakeHintSpanish: "Comienza directamente con 'Much as I respect your viewpoint,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Much as I value the initial proposal, the empirical data warrants an alternative course.",
          spanishMeaning: "Por mucho que valore la propuesta inicial, los datos empíricos justifican un rumbo alternativo.",
          pronunciationHint: "mach as ai váliu di iníshal propóusal, di empírikal déita uórrants an oltérnativ kors",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos dialécticos de refutación cortés utilizando 'Much as' en Writing Studio.",
        },
      },
    },
  ];
}

