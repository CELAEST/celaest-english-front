import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1InversionEmphasis(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: INVERSIÃ“N NEGATIVA FORMAL
    {
      title: "InversiÃ³n Negativa Formal: Rarely / Under no circumstances",
      focus: "Elegancia y oratoria ejecutiva invirtiendo sujeto y auxiliar (Rarely have I seen...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando abres una frase con un adverbio negativo o restrictivo (Rarely, Seldom, Never, Under no circumstances), la oraciÃ³n invierte el sujeto y el auxiliar como si fuera una pregunta. No dices 'Rarely I have seen', sino 'Rarely have I seen'.",
        formulaSegments: [
          { label: "ADVERBIO NEGATIVO", token: "Rarely / Seldom / Under no circumstances", tone: "violet" },
          { label: "AUXILIAR + SUJETO", token: "have we / should you / did they", tone: "emerald" },
          { label: "VERBO + COMPLEMENTO", token: "witnessed such dedication", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Under no circumstances you should share this information.",
          wrongToken: "you should share",
          correct: "Under no circumstances should you share this information.",
          correctToken: "should you share",
          whySpanish: "Tras un adverbio restrictivo inicial, el auxiliar precede obligatoriamente al sujeto.",
        },
        examples: [
          {
            english: "Rarely have we witnessed such genuine dedication to quality.",
            spanish: "Raramente hemos presenciado una dedicaciÃ³n tan genuina a la calidad.",
            pronunciationHint: "rÃ©rli jav ui uÃ­tnest sach yÃ©niuin dedikÃ©ishon",
          },
          {
            english: "Under no circumstances should you compromise on safety.",
            spanish: "Bajo ninguna circunstancia debes comprometer la seguridad.",
            pronunciationHint: "Ã¡nder nÃ³u sÃ©rkemstÃ¡nses shud yu kÃ³mpramÃ¡iz on sÃ©ifti",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Bajo ninguna circunstancia debemos compartir informaciÃ³n confidencial",
          targetTokens: ["Under", "no", "circumstances", "should", "we", "share", "confidential", "details"],
          distractorTokens: ["we", "should", "sharing", "rarely"],
          successTipSpanish: "Â¡Estructura impecable! Auxiliar 'should' antes del sujeto 'we'.",
          mistakeHintSpanish: "Recuerda invertir: 'Under no circumstances should we share...'.",
        },
        voicePractice: {
          sentenceEnglish: "Rarely have we seen such outstanding commitment.",
          spanishMeaning: "Raramente hemos visto un compromiso tan sobresaliente.",
          pronunciationHint: "rÃ©rli jav ui sin sach autstÃ¡nding komÃ­tment",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza discursos histÃ³ricos y ensayos formales que utilizan inversiÃ³n estilÃ­stica.",
        },
      },
    },

    // BASE 2: CLEFT SENTENCES CON WHAT
    {
      title: "Cleft Sentences con What: Focalizar la Idea Central",
      focus: "Poner el reflector sobre el punto crÃ­tico (What I really need is...)",
      payload: {
        ruleTaglineSpanish:
          "En lugar de una frase plana como 'I need more clarity', usa una 'cleft sentence': 'What I really need is more clarity'. El pronombre 'What' actÃºa como un foco de atenciÃ³n que prepara a la audiencia para el dato clave.",
        formulaSegments: [
          { label: "FOCO WHAT", token: "What + Sujeto + Verbo", tone: "violet" },
          { label: "CÃ“PULA", token: "is / was", tone: "emerald" },
          { label: "NÃšCLEO ENFATIZADO", token: "the clarity of the proposal", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The that I need is more time (traducciÃ³n literal de 'lo que').",
          wrongToken: "The that I need",
          correct: "What I need is more time.",
          correctToken: "What I need",
          whySpanish: "En inglÃ©s 'lo que...' se introduce limpiamente con 'What', jamÃ¡s con 'The that'.",
        },
        examples: [
          {
            english: "What really caught my attention was the clarity of the proposal.",
            spanish: "Lo que realmente me llamÃ³ la atenciÃ³n fue la claridad de la propuesta.",
            pronunciationHint: "uot rÃ­eli kot mai atÃ©nshon uos de klÃ¡riti ov de propÃ³usal",
          },
          {
            english: "What we truly value is consistency over rapid shortcuts.",
            spanish: "Lo que verdaderamente valoramos es la consistencia sobre los atajos rÃ¡pidos.",
            pronunciationHint: "uot ui trÃºli vÃ¡liu is konsÃ­stensi Ã³uver rÃ¡pid shÃ³rtkats",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Lo que realmente me llamÃ³ la atenciÃ³n fue la propuesta",
          targetTokens: ["What", "really", "caught", "my", "attention", "was", "the", "proposal"],
          distractorTokens: ["The", "that", "is", "catching"],
          successTipSpanish: "Â¡Perfecto! 'What really caught my attention' enfoca la idea.",
          mistakeHintSpanish: "Abre con 'What really caught my attention was the proposal'.",
        },
        voicePractice: {
          sentenceEnglish: "What we truly value is steady consistency.",
          spanishMeaning: "Lo que verdaderamente valoramos es la consistencia constante.",
          pronunciationHint: "uot ui trÃºli vÃ¡liu is stÃ©di konsÃ­stensi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Emplea oraciones hendidas en Writing Studio para destacar tus argumentos clave.",
        },
      },
    },

    // BASE 3: CLEFT SENTENCES CON IT
    {
      title: "Cleft Sentences con It: AtribuciÃ³n de Causa y AutorÃ­a",
      focus: "Destacar al responsable o la causa decisiva (It was that decision that changed...)",
      payload: {
        ruleTaglineSpanish:
          "Para atribuir con precisiÃ³n quiÃ©n o quÃ© causÃ³ un acontecimiento, usa 'It was [Elemento] that / who...'. No digas 'My mentor was who helped me', di con elegancia: 'It was my mentor who helped me'.",
        formulaSegments: [
          { label: "INTRODUCCIÃ“N IT", token: "It is / It was", tone: "violet" },
          { label: "ELEMENTO DESTACADO", token: "that strategic decision", tone: "emerald" },
          { label: "CONECTOR + RESTO", token: "that changed our trajectory", tone: "sky" },
        ],
        commonMistake: {
          wrong: "That decision was that changed everything.",
          wrongToken: "That decision was that",
          correct: "It was that decision that changed everything.",
          correctToken: "It was that decision that",
          whySpanish: "La fÃ³rmula de hendidura requiere 'It was [X] that/who...'.",
        },
        examples: [
          {
            english: "It was my mentor who pointed out the alternative path.",
            spanish: "Fue mi mentor quien seÃ±alÃ³ el camino alternativo.",
            pronunciationHint: "it uos mai mÃ©ntor ju pÃ³inted Ã¡ut di oltÃ©rnativ paz",
          },
          {
            english: "It is this commitment that drives long-term success.",
            spanish: "Es este compromiso el que impulsa el Ã©xito a largo plazo.",
            pronunciationHint: "it is dis komÃ­tment dat drÃ¡ivs long-term saksÃ©s",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Fue esa decisiÃ³n la que cambiÃ³ la direcciÃ³n del proyecto",
          targetTokens: ["It", "was", "that", "decision", "that", "changed", "the", "direction"],
          distractorTokens: ["Was", "which", "decision", "changing"],
          successTipSpanish: "Â¡Impecable! 'It was [X] that changed...' destaca la causa raÃ­z.",
          mistakeHintSpanish: "Inicia con 'It was that decision that changed...'.",
        },
        voicePractice: {
          sentenceEnglish: "It was that decision that changed our entire direction.",
          spanishMeaning: "Fue esa decisiÃ³n la que cambiÃ³ toda nuestra direcciÃ³n.",
          pronunciationHint: "it uos dat desÃ­shon dat chÃ©inygd Ã¡uer entÃ¡ier dirÃ©kshon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Resalta tus logros y decisiones cruciales usando cleft sentences con 'It was'.",
        },
      },
    },

    // BASE 4: AUXILIAR ENFATIZADOR EN AFIRMATIVO
    {
      title: "Ã‰nfasis Afirmativo con Auxiliar: I DO understand",
      focus: "Reafirmar convicciÃ³n o defenderse de una duda (I do value your perspective)",
      payload: {
        ruleTaglineSpanish:
          "Para expresar una certeza profunda o aclarar un malentendido sin sonar defensivo, inserta 'do / does / did' antes del verbo afirmativo con entonaciÃ³n marcada: 'I DO understand your point'. Suena mucho mÃ¡s natural y maduro que repetir 'really' continuamente.",
        formulaSegments: [
          { label: "SUJETO", token: "I / We / She", tone: "violet" },
          { label: "AUXILIAR ENFÃTICO", token: "do / does / did (tÃ³nico)", tone: "emerald" },
          { label: "VERBO FORMA BASE", token: "appreciate / agree / finish", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I really really understand (abuso de really).",
          wrongToken: "really really",
          correct: "I do understand your perspective.",
          correctToken: "do understand",
          whySpanish: "El auxiliar enfÃ¡tico 'do/did' aporta firmeza elegante sin infantilizar el discurso.",
        },
        examples: [
          {
            english: "I do understand your concern, and we are addressing it right now.",
            spanish: "SÃ­ entiendo tu preocupaciÃ³n, y la estamos atendiendo justo ahora.",
            pronunciationHint: "ai dÃº anderstÃ¡nd yor konsÃ©rn, and ui ar adrÃ©sing it",
          },
          {
            english: "We did complete the review before the final deadline.",
            spanish: "SÃ­ completamos la revisiÃ³n antes del plazo final.",
            pronunciationHint: "ui dÃ­d komplÃ­t de riviÃº bifÃ³r de fÃ¡inal dÃ©dlain",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Yo sÃ­ valoro tu perspectiva honesta",
          targetTokens: ["I", "do", "value", "your", "honest", "perspective"],
          distractorTokens: ["really", "valued", "am", "valuing"],
          successTipSpanish: "Â¡Exacto! El auxiliar 'do' aporta convicciÃ³n madura.",
          mistakeHintSpanish: "Construye: 'I do value your honest perspective'.",
        },
        voicePractice: {
          sentenceEnglish: "I do understand your concern, and we are acting on it.",
          spanishMeaning: "SÃ­ entiendo tu preocupaciÃ³n, y estamos actuando al respecto.",
          pronunciationHint: "ai dÃº anderstÃ¡nd yor konsÃ©rn, and ui ar Ã¡kting on it",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Practica respuestas con auxiliares enfÃ¡ticos para responder objeciones con seguridad.",
        },
      },
    },

    // BASE 5: COMPARATIVAS DOBLES CORRELATIVAS
    {
      title: "Comparativas Dobles Proporcionales: The more... the more...",
      focus: "Expresar evoluciÃ³n simultÃ¡nea de variables (The more we practice, the clearer it gets)",
      payload: {
        ruleTaglineSpanish:
          "Para indicar que el aumento de una variable produce un cambio directo en otra, usa la estructura correlativa: 'The [comparativo]..., the [comparativo]...'. Es la fÃ³rmula mÃ¡s compacta y potente para explicar relaciones causa-efecto complejas.",
        formulaSegments: [
          { label: "VARIABLE 1", token: "The more we analyze the findings,", tone: "violet" },
          { label: "VARIABLE 2", token: "the clearer the pattern becomes.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "More we practice, more we improve.",
          wrongToken: "More we practice",
          correct: "The more we practice, the more we improve.",
          correctToken: "The more we practice",
          whySpanish: "Ambos miembros requieren obligatoriamente el artÃ­culo 'The' antes del adjetivo comparativo.",
        },
        examples: [
          {
            english: "The more we analyze the findings, the clearer the pattern becomes.",
            spanish: "Cuanto mÃ¡s analizamos los hallazgos, mÃ¡s claro se vuelve el patrÃ³n.",
            pronunciationHint: "de mor ui Ã¡nalÃ¡iz de fÃ¡indings, de klÃ­erer de pÃ¡tern bikÃ³ms",
          },
          {
            english: "The earlier we establish the guidelines, the smoother the process will be.",
            spanish: "Cuanto antes establezcamos las pautas, mÃ¡s fluido serÃ¡ el proceso.",
            pronunciationHint: "di Ã©rlyer ui estÃ¡blish de gÃ¡idlÃ¡ins, de smÃºder de prÃ³ses uil bi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Cuanto mÃ¡s analizamos los datos, mÃ¡s claro es el resultado",
          targetTokens: ["The", "more", "we", "analyze", "the", "data,", "the", "clearer", "the", "result"],
          distractorTokens: ["More", "most", "analyzing", "clear"],
          successTipSpanish: "Â¡Estructura paralela impecable! 'The more... the clearer...'.",
          mistakeHintSpanish: "Comienza ambos bloques con 'The': 'The more..., the clearer...'.",
        },
        voicePractice: {
          sentenceEnglish: "The more we collaborate, the stronger our outcomes become.",
          spanishMeaning: "Cuanto mÃ¡s colaboramos, mÃ¡s sÃ³lidos se vuelven nuestros resultados.",
          pronunciationHint: "de mor ui kolÃ¡boreit, de strÃ³nger Ã¡uer Ã¡utkams bikÃ³m",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce correlaciones proporcionales en informes de investigaciÃ³n y anÃ¡lisis de tendencias.",
        },
      },
    },

    // BASE 6: INVERSIÃ“N NARRATIVA DRAMÃTICA
    {
      title: "InversiÃ³n Narrativa Inmediata: Hardly had we... when...",
      focus: "Acciones consecutivas inmediatas y dramatismo (Hardly had we arrived when...)",
      payload: {
        ruleTaglineSpanish:
          "Para narrar que una acciÃ³n ocurriÃ³ inmediatamente despuÃ©s de otra, usa 'Hardly had [Sujeto] [Participio] when...'. Es una inversiÃ³n del Past Perfect que crea suspenso y dinamismo narrativo en relatos y anÃ©cdotas de alto nivel.",
        formulaSegments: [
          { label: "INVERSIÃ“N PASADO PERFECTO", token: "Hardly had we signed the contract", tone: "violet" },
          { label: "CONEXIÃ“N INMEDIATA", token: "when a new opportunity arose", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Hardly we had arrived when it started raining.",
          wrongToken: "Hardly we had arrived",
          correct: "Hardly had we arrived when it started raining.",
          correctToken: "Hardly had we arrived",
          whySpanish: "Tras 'Hardly' o 'Scarcely', el auxiliar 'had' debe colocarse antes del sujeto.",
        },
        examples: [
          {
            english: "Hardly had we finalized the agreement when an unexpected opportunity arose.",
            spanish: "Apenas habÃ­amos finalizado el acuerdo cuando surgiÃ³ una oportunidad inesperada.",
            pronunciationHint: "jÃ¡rdli jad ui fÃ¡inalÃ¡izd di agrÃ­ment uÃ©n an Ã¡nekspÃ©kted Ã³portÃºniti arÃ³us",
          },
          {
            english: "No sooner had the presentation ended than the questions began.",
            spanish: "Apenas habÃ­a terminado la presentaciÃ³n cuando comenzaron las preguntas.",
            pronunciationHint: "nÃ³u sÃºner jad de prezantÃ©ishon Ã©nded dan de kuÃ©stions bigÃ¡n",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Apenas habÃ­amos firmado el acuerdo cuando surgiÃ³ una oportunidad",
          targetTokens: ["Hardly", "had", "we", "signed", "the", "agreement", "when", "an", "opportunity", "arose"],
          distractorTokens: ["we", "had", "than", "signing"],
          successTipSpanish: "Â¡InversiÃ³n narrativa exacta! 'Hardly had we signed... when...'.",
          mistakeHintSpanish: "Ordena: 'Hardly had we signed the agreement when...'.",
        },
        voicePractice: {
          sentenceEnglish: "Hardly had the meeting started when a resolution was reached.",
          spanishMeaning: "Apenas habÃ­a comenzado la reuniÃ³n cuando se alcanzÃ³ una resoluciÃ³n.",
          pronunciationHint: "jÃ¡rdli jad de mÃ­ting stÃ¡rted uÃ©n a rezolÃºshon uos richt",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe narraciones dinÃ¡micas con inversiones temporales en Writing Studio.",
        },
      },
    },
  ];
}

