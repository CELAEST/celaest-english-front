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
        commonMistake: {
          wrong: "The meeting was a disaster and a total failure (demasiado visceral).",
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
        commonMistake: {
          wrong: "The result is not certain at all (coloquial y poco sofisticado).",
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
        commonMistake: {
          wrong: "The team has the position to win (calco poco idiomático).",
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
        commonMistake: {
          wrong: "Nobody can deny that it is hard (estilo coloquial).",
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
        commonMistake: {
          wrong: "For much that I respect you, I disagree (traducción literal de 'por mucho que').",
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

