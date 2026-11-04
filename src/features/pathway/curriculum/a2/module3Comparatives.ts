import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3Comparatives(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: COMPARATIVOS CORTOS (-er than)
    {
      title: "Comparativos Cortos: La Terminación -er than",
      focus: "Adjetivos de una sílaba o terminados en -y (faster, easier, bigger than)",
      payload: {
        ruleTaglineSpanish:
          "Si un adjetivo es corto (1 sílaba como fast o cheap), no uses 'more': agrégale '-er' al final y compáralo con 'than'. Si termina en 'y', cámbiala por 'i' (easy -> easier).",
        formulaSegments: [
          { label: "ADJETIVO CORTO + ER", token: "faster · cheaper · easier · bigger", tone: "violet" },
          { label: "QUE", token: "than", tone: "emerald" },
          { label: "SEGUNDO ELEMENTO", token: "the old one / yesterday", tone: "sky" },
        ],
        commonMistake: {
          wrong: "This process is more easy than before.",
          wrongToken: "more easy",
          correct: "This process is easier than before.",
          correctToken: "easier",
          whySpanish: "Las palabras cortas o que terminan en 'y' se transforman con '-ier' (easier), nunca con 'more'.",
        },
        examples: [
          {
            english: "This new method is much faster than the old one.",
            spanish: "Este método nuevo es mucho más rápido que el anterior.",
            pronunciationHint: "dis niú mézod is mach fáster dan di óuld uán",
          },
          {
            english: "It is easier than you think.",
            spanish: "Es más fácil de lo que crees.",
            pronunciationHint: "it is ísi-er dan yu zink",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esto es más fácil que antes",
          targetTokens: ["This", "is", "easier", "than", "before"],
          distractorTokens: ["more easy"],
          successTipSpanish: "¡Dominado! 'Easier than' es la forma nativa para adjetivos en 'y'.",
          mistakeHintSpanish: "Usa 'easier than' sin anteponer 'more'.",
        },
        voicePractice: {
          sentenceEnglish: "This solution is faster than before.",
          spanishMeaning: "Esta solución es más rápida que antes.",
          pronunciationHint: "dis solúshon is fáster dan bifór",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Compara resultados y rendimientos en lecturas reconociendo las formas terminadas en -er.",
        },
      },
    },

    // BASE 13: COMPARATIVOS LARGOS (More ... than)
    {
      title: "Comparativos Largos: More ... than",
      focus: "Adjetivos de 2 o más sílabas (more important, more expensive)",
      payload: {
        ruleTaglineSpanish:
          "Si el adjetivo tiene 2 o más sílabas (important, expensive, comfortable), no le agregues '-er'. Pon 'more' adelante y 'than' después: more important than.",
        formulaSegments: [
          { label: "MÁS", token: "more", tone: "violet" },
          { label: "ADJETIVO LARGO", token: "important · practical · expensive", tone: "emerald" },
          { label: "QUE", token: "than", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Speed is important-er than clarity.",
          wrongToken: "important-er",
          correct: "Clarity is more important than speed.",
          correctToken: "more important than",
          whySpanish: "Las palabras largas nunca llevan '-er'; se comparan con 'more... than'.",
        },
        examples: [
          {
            english: "Clarity is more important than speed.",
            spanish: "La claridad es más importante que la velocidad.",
            pronunciationHint: "kláriti is mor impórtant dan spíd",
          },
          {
            english: "This option is more practical for the team.",
            spanish: "Esta opción es más práctica para el equipo.",
            pronunciationHint: "dis ópshon is mor práktikal for de tím",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La claridad es más importante que la velocidad",
          targetTokens: ["Clarity", "is", "more", "important", "than", "speed"],
          distractorTokens: ["importanter"],
          successTipSpanish: "¡Perfecto! 'More important than' es limpio y armónico.",
          mistakeHintSpanish: "Pon 'more' antes de 'important' y 'than' antes de 'speed'.",
        },
        voicePractice: {
          sentenceEnglish: "Clarity is more important than speed.",
          spanishMeaning: "La claridad es más importante que la velocidad.",
          pronunciationHint: "kláriti is mor impórtant dan spíd",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Explica tus decisiones diciendo 'Option A was more efficient than Option B'.",
        },
      },
    },

    // BASE 14: SUPERLATIVOS DE EXCELENCIA (The -est y The Most)
    {
      title: "Superlativos de Excelencia: The -est y The Most",
      focus: "Destacar el máximo absoluto (the fastest, the most important)",
      payload: {
        ruleTaglineSpanish:
          "Para decir que algo es 'el más' de todos, siempre abre con 'The'. Si es corto, añade '-est' (the fastest). Si es largo, usa 'the most' (the most important).",
        formulaSegments: [
          { label: "EL / LA MÁS (CORTO)", token: "the fastest · the simplest · the highest", tone: "violet" },
          { label: "EL / LA MÁS (LARGO)", token: "the most effective · the most reliable", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "This is most important step.",
          wrongToken: "most important",
          correct: "This is the most important step.",
          correctToken: "the most important",
          whySpanish: "Nunca olvides 'the': en superlativos siempre se dice 'THE most' o 'THE fastest'.",
        },
        examples: [
          {
            english: "This is the most effective approach.",
            spanish: "Este es el enfoque más efectivo.",
            pronunciationHint: "dis is de móust eféktiv apróuch",
          },
          {
            english: "It was the simplest solution available.",
            spanish: "Fue la solución más simple disponible.",
            pronunciationHint: "it uás de símplest solúshon avéilabol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Este es el paso más importante",
          targetTokens: ["This", "is", "the", "most", "important", "step"],
          distractorTokens: ["more"],
          successTipSpanish: "¡Impecable! Usaste 'the most important' con su artículo obligatorio.",
          mistakeHintSpanish: "Asegúrate de incluir 'the' antes de 'most important step'.",
        },
        voicePractice: {
          sentenceEnglish: "This is the most important step.",
          spanishMeaning: "Este es el paso más importante.",
          pronunciationHint: "dis is de móust impórtant step",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Destaca tus mayores logros en tu perfil usando superlativos como 'the most successful'.",
        },
      },
    },

    // BASE 15: LOS IRREGULARES CLAVE (Good -> Better -> The Best)
    {
      title: "Los Irregulares de Oro: Better, Best, Worse y Worst",
      focus: "Comparativos y superlativos irregulares que transforman su raíz",
      payload: {
        ruleTaglineSpanish:
          "En español decimos 'mejor' y 'peor', nunca 'más bueno' o 'más malo'. En inglés igual: good se vuelve 'better' (mejor que) y 'the best' (el mejor). Bad se vuelve 'worse' (peor que) y 'the worst' (el peor).",
        formulaSegments: [
          { label: "BUENO -> MEJOR", token: "good -> better than -> the best", tone: "violet" },
          { label: "MALO -> PEOR", token: "bad -> worse than -> the worst", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "This plan is more good than that one.",
          wrongToken: "more good",
          correct: "This plan is better than that one.",
          correctToken: "better",
          whySpanish: "'More good' no existe; el comparativo de 'good' es siempre 'better'.",
        },
        examples: [
          {
            english: "This idea is much better than the previous one.",
            spanish: "Esta idea es mucho mejor que la anterior.",
            pronunciationHint: "dis aidía is mach béter dan de prívios uán",
          },
          {
            english: "We want to deliver the best quality possible.",
            spanish: "Queremos entregar la mejor calidad posible.",
            pronunciationHint: "ui uónt tu delíver de best kuáliti pósibol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Este resultado es mejor que el anterior",
          targetTokens: ["This", "result", "is", "better", "than", "before"],
          distractorTokens: ["more good"],
          successTipSpanish: "¡Magnífico! 'Better than' es la forma exacta e irregular.",
          mistakeHintSpanish: "Reemplaza 'more good' por la palabra irregular 'better'.",
        },
        voicePractice: {
          sentenceEnglish: "This is the best option for us.",
          spanishMeaning: "Esta es la mejor opción para nosotros.",
          pronunciationHint: "dis is de best ópshon for as",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Explica tus preferencias diciendo 'I work better in collaborative environments'.",
        },
      },
    },

    // BASE 16: LA COMPARACIÓN DE IGUALDAD (As ... as)
    {
      title: "La Comparación de Igualdad: As ... as",
      focus: "Comparar dos elementos en pie de igualdad (tan ... como) o desigualdad (not as ... as)",
      payload: {
        ruleTaglineSpanish:
          "Para decir que algo es 'tan bueno como' o 'no tan caro como', encierra el adjetivo normalito entre dos 'as': as easy as (tan fácil como), not as fast as (no tan rápido como).",
        formulaSegments: [
          { label: "TAN", token: "as", tone: "violet" },
          { label: "ADJETIVO NORMAL", token: "clear · fast · effective", tone: "emerald" },
          { label: "COMO", token: "as", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It is so easy than I thought.",
          wrongToken: "so easy than",
          correct: "It is as easy as I thought.",
          correctToken: "as easy as",
          whySpanish: "Para igualdad la pareja es siempre 'as... as', nunca 'so... than'.",
        },
        examples: [
          {
            english: "This tool is as easy as it looks.",
            spanish: "Esta herramienta es tan fácil como parece.",
            pronunciationHint: "dis tul is as ísi as it luks",
          },
          {
            english: "It is not as difficult as people say.",
            spanish: "No es tan difícil como la gente dice.",
            pronunciationHint: "it is not as dífikolt as pípol séi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No es tan difícil como parece",
          targetTokens: ["It", "is", "not", "as", "difficult", "as", "it", "looks"],
          distractorTokens: ["than"],
          successTipSpanish: "¡Brillante! La estructura 'as difficult as' denota un inglés maduro y natural.",
          mistakeHintSpanish: "Usa la pareja 'as... as' para encerrar el adjetivo 'difficult'.",
        },
        voicePractice: {
          sentenceEnglish: "It is not as hard as it seems.",
          spanishMeaning: "No es tan difícil como parece.",
          pronunciationHint: "it is not as jard as it síms",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe valoraciones equilibradas con 'as efficient as' en revisiones técnicas.",
        },
      },
    },
  ];
}

