import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6FluencyAndBridge(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 29: LA ACCIÓN EN VIVO (Present Continuous)
    {
      title: "La Acción en Vivo: Present Continuous (-ing)",
      focus: "Estar haciendo algo en este segundo exacto (To Be + -ing)",
      payload: {
        ruleTaglineSpanish:
          "Para lo que ocurre ahora mismo combina dos piezas inseparables: To Be + verbo con '-ing'.",
        formulaSegments: [
          { label: "YO + AM", token: "I am", tone: "violet" },
          { label: "ACCIÓN -ING", token: "learning / speaking", tone: "emerald" },
          { label: "AHORA", token: "right now", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Yo en Vivo (I am)",
            segments: [
              { label: "SUJETO + AM", token: "I am (I'm)", tone: "violet" },
              { label: "VERBO -ING", token: "learning / working", tone: "emerald" },
              { label: "MOMENTO", token: "right now", tone: "sky" },
            ],
            explanationSpanish:
              "Nunca olvides 'am' entre 'I' y el verbo con '-ing': di 'I am studying', jamás 'I studying'.",
            exampleEnglish: "I am learning English right now.",
          },
          {
            label: "02 · Él · Ella · Grupo (Is / Are)",
            segments: [
              { label: "GRUPO + ARE", token: "We / They are", tone: "violet" },
              { label: "VERBO -ING", token: "preparing / talking", tone: "emerald" },
              { label: "MOMENTO", token: "now", tone: "sky" },
            ],
            explanationSpanish:
              "Con plurales o 'you' usa 'are + -ing', y con una persona singular usa 'is + -ing' ('She is working').",
            exampleEnglish: "We are preparing the next step.",
          },
        ],
        commonMistake: {
          wrong: "I studying right now.",
          wrongToken: "I studying",
          correct: "I am studying right now.",
          correctToken: "I am studying",
          whySpanish: "Nunca olvides el verbo To Be: no digas 'Yo estudiando', sino 'Yo ESTOY estudiando'.",
        },
        examples: [
          {
            english: "I am learning English right now.",
            spanish: "Estoy aprendiendo inglés ahora mismo.",
            pronunciationHint: "ai am lérning ínglish ráit náu",
          },
          {
            english: "We are preparing the next step.",
            spanish: "Estamos preparando el siguiente paso.",
            pronunciationHint: "ui ar prepéring de nekst step",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estoy aprendiendo inglés ahora mismo",
          targetTokens: ["I", "am", "learning", "English", "right", "now"],
          distractorTokens: ["learn"],
          successTipSpanish: "¡Genial! No olvidaste 'am' antes de 'learning'.",
          mistakeHintSpanish: "Pon 'I am', luego la acción con '-ing' ('learning') y 'English right now'.",
        },
        voicePractice: {
          sentenceEnglish: "I am learning English right now.",
          spanishMeaning: "Estoy aprendiendo inglés ahora mismo.",
          pronunciationHint: "ai am lérning ínglish ráit náu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Describe lo que estás haciendo en tu trabajo actual con 'Currently, I am working on...'.",
        },
      },
    },

    // BASE 30: EL GRAN CONTRASTE: RUTINA VS EN VIVO
    {
      title: "El Gran Contraste: Rutina vs En Vivo",
      focus: "Presente Simple (hábitos) vs Presente Continuo (este instante)",
      payload: {
        ruleTaglineSpanish:
          "Separa dos tiempos clave: tu rutina habitual va en simple y la excepción de hoy lleva '-ing'.",
        formulaSegments: [
          { label: "RUTINA FIJA", token: "I work here,", tone: "violet" },
          { label: "CONTRASTE", token: "but today", tone: "emerald" },
          { label: "EN VIVO", token: "I am learning", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Hábito Fijo (Simple)",
            segments: [
              { label: "PERSONA", token: "I", tone: "violet" },
              { label: "SEÑAL HABITUAL", token: "usually / always", tone: "emerald" },
              { label: "VERBO SIMPLE", token: "work / drink coffee", tone: "sky" },
            ],
            explanationSpanish:
              "Para lo que se repite cada día o semana usa el verbo simple, sin 'am' ni '-ing'.",
            exampleEnglish: "I always work on Mondays.",
          },
          {
            label: "02 · Excepción de Hoy (-ing)",
            segments: [
              { label: "MOMENTO ACTUAL", token: "Today / Right now", tone: "violet" },
              { label: "TO BE", token: "I am", tone: "emerald" },
              { label: "ACCIÓN -ING", token: "learning / drinking tea", tone: "sky" },
            ],
            explanationSpanish:
              "Para lo temporal que está pasando hoy o en este segundo exacto, activa 'am / is / are + -ing'.",
            exampleEnglish: "I work here, but today I am learning.",
          },
        ],
        commonMistake: {
          wrong: "I am always working on Mondays.",
          wrongToken: "am always working",
          correct: "I always work on Mondays.",
          correctToken: "always work",
          whySpanish: "Las rutinas semanales van en presente simple: 'I work', no 'I am working'.",
        },
        examples: [
          {
            english: "I usually drink coffee, but today I am drinking tea.",
            spanish: "Usualmente tomo café, pero hoy estoy tomando té.",
            pronunciationHint: "ai yúshuali drink kófi, bat tudéi ai am drínking ti",
          },
          {
            english: "She lives in Bogota, but this week she is staying in Medellin.",
            spanish: "Ella vive en Bogotá, pero esta semana se está quedando en Medellín.",
            pronunciationHint: "shi livs in Bogota, bat dis uík shi is stéying in Medellin",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo trabajo aquí, pero hoy estoy aprendiendo",
          targetTokens: ["I", "work", "here,", "but", "today", "I", "am", "learning"],
          distractorTokens: ["am working"],
          successTipSpanish: "¡Nivel maestro! Supiste diferenciar tu hábito de tu momento en vivo.",
          mistakeHintSpanish: "Usa 'I work here' para la rutina y 'I am learning' para hoy.",
        },
        voicePractice: {
          sentenceEnglish: "I work here, but today I am learning.",
          spanishMeaning: "Yo trabajo aquí, pero hoy estoy aprendiendo.",
          pronunciationHint: "ai uórk jíar, bat tudéi ai am lérning",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe actualizaciones de estado diferenciando tus tareas fijas de tus proyectos de hoy.",
        },
      },
    },

    // BASE 31: CONECTORES Y SECUENCIADORES DE DISCURSO
    {
      title: "Conectores de Fluidez: And, But, Because, So y Secuenciadores",
      focus: "Enlazar oraciones y narrar un día completo (First, Then, Finally)",
      payload: {
        ruleTaglineSpanish:
          "Conecta ideas completas: 'because' explica el motivo, 'so' el resultado y 'first / then' el orden.",
        formulaSegments: [
          { label: "ACCIÓN", token: "I practice", tone: "violet" },
          { label: "CAUSA", token: "because", tone: "emerald" },
          { label: "MOTIVO", token: "I want to improve", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Dar el Motivo (Because)",
            segments: [
              { label: "IDEA PRINCIPAL", token: "I practice", tone: "violet" },
              { label: "PORQUE", token: "because", tone: "emerald" },
              { label: "RAZÓN", token: "I want to improve", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'because' antes de la razón o el porqué de tu acción.",
            exampleEnglish: "I practice because I want to improve.",
          },
          {
            label: "02 · Dar el Resultado (So)",
            segments: [
              { label: "SITUACIÓN", token: "It is late,", tone: "violet" },
              { label: "ASÍ QUE", token: "so", tone: "emerald" },
              { label: "CONSECUENCIA", token: "we need to go", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'so' para introducir la consecuencia lógica ('por lo tanto / así que').",
            exampleEnglish: "I am ready, so we can start.",
          },
          {
            label: "03 · Narrar en Orden",
            segments: [
              { label: "PASO 1", token: "First I review,", tone: "violet" },
              { label: "PASO 2", token: "and then I speak", tone: "emerald" },
            ],
            explanationSpanish:
              "Para contar tu rutina sin trabarte enlaza pasos con 'First', 'then' y 'finally'.",
            exampleEnglish: "First I review the notes, and then I speak.",
          },
        ],
        commonMistake: {
          wrong: "I practice English so it is important.",
          wrongToken: "so it is",
          correct: "I practice English because it is important.",
          correctToken: "because it is",
          whySpanish: "Usa 'because' para la causa ('porque') y 'so' para el resultado ('así que').",
        },
        examples: [
          {
            english: "I practice every day because I want to improve.",
            spanish: "Practico todos los días porque quiero mejorar.",
            pronunciationHint: "ai práktis évri déi bikós ai uónt tu imprúv",
          },
          {
            english: "First I review the notes, and then I speak.",
            spanish: "Primero reviso los apuntes, y luego hablo.",
            pronunciationHint: "férst ai riviú de nóuts, and den ai spík",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Practico porque quiero mejorar",
          targetTokens: ["I", "practice", "because", "I", "want", "to", "improve"],
          distractorTokens: ["so"],
          successTipSpanish: "¡Magnífico! Conectaste la razón con 'because' con total soltura.",
          mistakeHintSpanish: "Para dar la causa o razón ('porque'), usa 'because'.",
        },
        voicePractice: {
          sentenceEnglish: "I practice because I want to improve.",
          spanishMeaning: "Practico porque quiero mejorar.",
          pronunciationHint: "ai práktis bikós ai uónt tu imprúv",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Enlaza tus respuestas con soltura usando 'because' y 'so' en Interview.",
        },
      },
    },

    // BASE 32: EL GRAN PUENTE A A2: EL PASADO DE TO BE (Was / Were)
    {
      title: "El Gran Puente a A2: El Pasado de To Be (Was / Were)",
      focus: "Reconocer el pasado de To Be y señales temporales (Yesterday, Last night)",
      payload: {
        ruleTaglineSpanish:
          "En pasado To Be se reduce a dos formas claras: 'was' en singular y 'were' con You y plurales.",
        formulaSegments: [
          { label: "CUÁNDO", token: "Yesterday", tone: "violet" },
          { label: "PERSONA + WAS", token: "I was", tone: "emerald" },
          { label: "ESTADO", token: "very busy", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Singular (Was)",
            segments: [
              { label: "1 PERSONA", token: "I / He / She / It", tone: "violet" },
              { label: "PASADO", token: "was / wasn't", tone: "emerald" },
              { label: "AYER", token: "busy yesterday", tone: "sky" },
            ],
            explanationSpanish:
              "Con 'I, He, She, It', tanto 'am' como 'is' se unen en una sola palabra pasada: 'was'.",
            exampleEnglish: "Yesterday I was very busy.",
          },
          {
            label: "02 · Tú y Plurales (Were)",
            segments: [
              { label: "TÚ / GRUPO", token: "You / We / They", tone: "violet" },
              { label: "PASADO", token: "were / weren't", tone: "emerald" },
              { label: "MOMENTO", token: "in the meeting", tone: "sky" },
            ],
            explanationSpanish:
              "Todo lo que en presente llevaba 'are' ('You, We, They') pasa al pasado como 'were'.",
            exampleEnglish: "We were in the meeting all morning.",
          },
        ],
        commonMistake: {
          wrong: "Yesterday I am very busy.",
          wrongToken: "am",
          correct: "Yesterday I was very busy.",
          correctToken: "was",
          whySpanish: "Si la frase ocurrió 'yesterday', el verbo 'am' se transforma en 'was'.",
        },
        examples: [
          {
            english: "Yesterday I was very tired, but today I am ready.",
            spanish: "Ayer estaba muy cansado, pero hoy estoy listo.",
            pronunciationHint: "yésterdei ai uás véri táiard, bat tudéi ai am rédi",
          },
          {
            english: "We were in the meeting all morning.",
            spanish: "Estuvimos en la reunión toda la mañana.",
            pronunciationHint: "ui uér in de míting ol mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ayer estuve muy ocupado",
          targetTokens: ["Yesterday", "I", "was", "very", "busy"],
          distractorTokens: ["am", "were"],
          successTipSpanish: "¡Felicidades! Conquistaste las 32 bases de A1 y diste el primer paso firme hacia A2.",
          mistakeHintSpanish: "Con 'Yesterday' y 'I', usa el pasado 'was'.",
        },
        voicePractice: {
          sentenceEnglish: "Yesterday I was very busy.",
          spanishMeaning: "Ayer estuve muy ocupado.",
          pronunciationHint: "yésterdei ai uás véri bísi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "¡Nivel A1 culminado al 100%! Ya puedes contar tus primeras experiencias pasadas en Interview.",
        },
      },
    },
  ];
}
