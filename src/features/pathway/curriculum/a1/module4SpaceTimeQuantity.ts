import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4SpaceTimeQuantity(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 18: PUNTEROS EN EL ESPACIO (This, That, These, Those)
    {
      title: "Apuntar en el Espacio: This, That, These, Those",
      focus: "Demostrativos de cercanía vs distancia en singular y plural",
      payload: {
        ruleTaglineSpanish:
          "Señala según cantidad y distancia: This/That para 1 objeto y These/Those para varios.",
        formulaSegments: [
          { label: "CERCA PLURAL", token: "These", tone: "violet" },
          { label: "OBJETOS", token: "documents", tone: "emerald" },
          { label: "SON", token: "are important", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Uno Solo (This · That)",
            segments: [
              { label: "1 OBJETO", token: "This (aquí) / That (allá)", tone: "violet" },
              { label: "ES", token: "is", tone: "emerald" },
              { label: "DETALLE", token: "my notebook", tone: "sky" },
            ],
            explanationSpanish:
              "Para un solo objeto usa 'This' si está en tu mano o 'That' si está lejos, acompañados de 'is'.",
            exampleEnglish: "This is my daily notebook.",
          },
          {
            label: "02 · Varios (These · Those)",
            segments: [
              { label: "2+ OBJETOS", token: "These (aquí) / Those (allá)", tone: "violet" },
              { label: "SON", token: "are", tone: "emerald" },
              { label: "DETALLE", token: "important documents", tone: "sky" },
            ],
            explanationSpanish:
              "Para dos o más objetos usa 'These' (cerca) o 'Those' (lejos), siempre acompañados de 'are'.",
            exampleEnglish: "These documents are important.",
          },
        ],
        commonMistake: {
          wrong: "This documents are important.",
          wrongToken: "This documents",
          correct: "These documents are important.",
          correctToken: "These documents",
          whySpanish: "Para varios objetos cercanos, usa el plural 'these', no el singular 'this'.",
        },
        examples: [
          {
            english: "This is my daily notebook.",
            spanish: "Este es mi cuaderno diario.",
            pronunciationHint: "dis is mai déili nóutbuk",
          },
          {
            english: "Those reports over there are approved.",
            spanish: "Esos reportes de allá están aprobados.",
            pronunciationHint: "dóus ripórts óuver der ar aprúvd",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estos documentos son importantes",
          targetTokens: ["These", "documents", "are", "important"],
          distractorTokens: ["This"],
          successTipSpanish: "¡Bien hecho! Usaste 'These' con plural de cercanía.",
          mistakeHintSpanish: "Como hablamos de varios documentos ('are important'), usa 'These'.",
        },
        voicePractice: {
          sentenceEnglish: "These documents are important.",
          spanishMeaning: "Estos documentos son importantes.",
          pronunciationHint: "dís dókyuments ar impórtant",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Señala datos y gráficos en lecturas reconociendo 'this' y 'that' en pantalla.",
        },
      },
    },

    // BASE 19: LA EXISTENCIA EN EL MUNDO (There is · There are)
    {
      title: "La Existencia en el Mundo: There is y There are",
      focus: "Expresar existencia ('Hay') en singular y plural",
      payload: {
        ruleTaglineSpanish:
          "En inglés 'Hay' cambia según la cantidad: 'There is' para uno y 'There are' para varios.",
        formulaSegments: [
          { label: "EXISTENCIA (1)", token: "There is", tone: "violet" },
          { label: "OBJETO SINGULAR", token: "a clear solution", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Hay Uno (There is)",
            segments: [
              { label: "HAY (1)", token: "There is", tone: "violet" },
              { label: "1 COSA / INCONTABLE", token: "a solution / time", tone: "emerald" },
            ],
            explanationSpanish:
              "Usa 'There is' para una sola cosa o algo incontable. Jamás traduzcas 'hay' con 'have'.",
            exampleEnglish: "There is a clear solution.",
          },
          {
            label: "02 · Hay Varios (There are)",
            segments: [
              { label: "HAY (2+)", token: "There are", tone: "violet" },
              { label: "PLURAL", token: "several options / many people", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hay dos o más elementos, cambia obligatoriamente a 'There are'.",
            exampleEnglish: "There are several options available.",
          },
          {
            label: "03 · Preguntar (Is there?)",
            segments: [
              { label: "INVERSIÓN", token: "Is there", tone: "violet" },
              { label: "CONSULTA", token: "a bank near here?", tone: "emerald" },
            ],
            explanationSpanish:
              "Para preguntar '¿Hay...?' invierte el orden: abre con 'Is there...?' (o 'Are there...?' en plural).",
            exampleEnglish: "Is there a solution for this?",
          },
        ],
        commonMistake: {
          wrong: "Have many people in the room.",
          wrongToken: "Have",
          correct: "There are many people in the room.",
          correctToken: "There are",
          whySpanish: "Nunca uses el verbo 'have' para decir 'hay': la fórmula fija es 'There is' o 'There are'.",
        },
        examples: [
          {
            english: "There is a simple solution for this.",
            spanish: "Hay una solución sencilla para esto.",
            pronunciationHint: "der is a símpol solúshon for dis",
          },
          {
            english: "There are several options available.",
            spanish: "Hay varias opciones disponibles.",
            pronunciationHint: "der ar séveral ópshons avéilabol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Hay una solución clara",
          targetTokens: ["There", "is", "a", "clear", "solution"],
          distractorTokens: ["Have", "are"],
          successTipSpanish: "¡Cero interferencia del español! 'There is' para una solución.",
          mistakeHintSpanish: "Abre con 'There is' para indicar existencia en singular.",
        },
        voicePractice: {
          sentenceEnglish: "There is a clear solution.",
          spanishMeaning: "Hay una solución clara.",
          pronunciationHint: "der is a klíar solúshon",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Describe qué hay y qué falta en tu lugar de trabajo usando 'There is' y 'There are'.",
        },
      },
    },

    // BASE 20: CONTABLES E INCONTABLES (Much, Many, A lot of, Some, Any)
    {
      title: "Contables e Incontables: Much, Many, Some y Any",
      focus: "Cuantificadores para cosas que se cuentan vs líquidos/dinero/tiempo",
      payload: {
        ruleTaglineSpanish:
          "Elige 'many' para lo contable, 'much' para masas incontables y 'some / any' según afirmes o preguntes.",
        formulaSegments: [
          { label: "NEGACIÓN", token: "I don't have", tone: "violet" },
          { label: "CANTIDAD", token: "much", tone: "emerald" },
          { label: "INCONTABLE", token: "time / money", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Contables (Many)",
            segments: [
              { label: "CANTIDAD", token: "many", tone: "violet" },
              { label: "PLURAL CONTABLE", token: "questions / people / days", tone: "emerald" },
            ],
            explanationSpanish:
              "Si puedes contarlo con números (1, 2, 3 personas o días), usa 'many'.",
            exampleEnglish: "We have many questions today.",
          },
          {
            label: "02 · Incontables (Much)",
            segments: [
              { label: "NEGACIÓN / DUDA", token: "don't have", tone: "violet" },
              { label: "CANTIDAD", token: "much", tone: "emerald" },
              { label: "MASA / TIEMPO", token: "time / money / water", tone: "sky" },
            ],
            explanationSpanish:
              "Tiempo, dinero y líquidos no llevan plural: acompáñalos con 'much', nunca con 'many'.",
            exampleEnglish: "I don't have much time today.",
          },
          {
            label: "03 · Some (+) y Any (?)",
            segments: [
              { label: "PREGUNTA / DUDA", token: "Do you have", tone: "violet" },
              { label: "CUANTIFICADOR", token: "any", tone: "emerald" },
              { label: "CONSULTA", token: "questions / time?", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'any' para preguntar o negar ('any questions?'), y 'some' al afirmar ('We have some news').",
            exampleEnglish: "Do you have any questions?",
          },
        ],
        commonMistake: {
          wrong: "I don't have many time.",
          wrongToken: "many time",
          correct: "I don't have much time.",
          correctToken: "much time",
          whySpanish: "El tiempo es incontable; con tiempo y dinero usa 'much' o 'a lot of'.",
        },
        examples: [
          {
            english: "Do you have any questions?",
            spanish: "¿Tienes alguna pregunta?",
            pronunciationHint: "du yu jav éni kuéschons?",
          },
          {
            english: "We have some good news today.",
            spanish: "Tenemos algunas buenas noticias hoy.",
            pronunciationHint: "ui jav sam gud niús tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No tengo mucho tiempo hoy",
          targetTokens: ["I", "don't", "have", "much", "time", "today"],
          distractorTokens: ["many"],
          successTipSpanish: "¡Perfecto! 'Much time' es la combinación exacta para incontables.",
          mistakeHintSpanish: "Con 'time' (tiempo), usa 'much' en lugar de 'many'.",
        },
        voicePractice: {
          sentenceEnglish: "I don't have much time today.",
          spanishMeaning: "No tengo mucho tiempo hoy.",
          pronunciationHint: "ai dóunt jav mach táim tudéi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a preguntas sobre disponibilidad usando 'some time' y 'much experience'.",
        },
      },
    },

    // BASE 21: PREPOSICIONES DE LUGAR (In, On, At)
    {
      title: "El Radar Espacial: Lugares con In, On y At",
      focus: "Preposiciones de lugar: dentro (in), superficie (on), punto fijo (at)",
      payload: {
        ruleTaglineSpanish:
          "En inglés 'en' se divide en tres lentes espaciales: dentro (in), sobre (on) y punto fijo (at).",
        formulaSegments: [
          { label: "PERSONA", token: "I am", tone: "violet" },
          { label: "PUNTO / SEDE", token: "at", tone: "emerald" },
          { label: "ACTIVIDAD", token: "work / home", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Dentro (In)",
            segments: [
              { label: "ESTAR", token: "I am", tone: "violet" },
              { label: "DENTRO", token: "in", tone: "emerald" },
              { label: "ESPACIO / PAÍS", token: "the room / Colombia", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'in' cuando estás rodeado por paredes, barrios, ciudades o países.",
            exampleEnglish: "We are in the meeting room.",
          },
          {
            label: "02 · Superficie (On)",
            segments: [
              { label: "OBJETO", token: "It is", tone: "violet" },
              { label: "SOBRE", token: "on", tone: "emerald" },
              { label: "PLANO / PANTALLA", token: "the table / the screen", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'on' para superficies físicas, pisos de edificios, transporte grande (on the bus) y pantallas.",
            exampleEnglish: "The documents are on the table.",
          },
          {
            label: "03 · Punto o Sede (At)",
            segments: [
              { label: "PERSONA", token: "I am", tone: "violet" },
              { label: "PUNTO EXACTO", token: "at", tone: "emerald" },
              { label: "SEDE", token: "work / home / the door", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'at' para puntos exactos y sedes cotidianas fijas: 'at home', 'at work', 'at school'.",
            exampleEnglish: "I am at work now.",
          },
        ],
        commonMistake: {
          wrong: "I am in home right now.",
          wrongToken: "in home",
          correct: "I am at home right now.",
          correctToken: "at home",
          whySpanish: "Para decir 'en casa' o 'en el trabajo' la fórmula fija es 'at home' o 'at work'.",
        },
        examples: [
          {
            english: "I am at work right now.",
            spanish: "Estoy en el trabajo ahora mismo.",
            pronunciationHint: "ai am at uórk ráit náu",
          },
          {
            english: "The documents are on the table.",
            spanish: "Los documentos están sobre la mesa.",
            pronunciationHint: "de dókyuments ar on de téibol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Estoy en el trabajo ahora",
          targetTokens: ["I", "am", "at", "work", "now"],
          distractorTokens: ["in"],
          successTipSpanish: "¡Súper! 'At work' es la combinación natural que usan los nativos.",
          mistakeHintSpanish: "Para indicar tu presencia en el trabajo, usa 'at work', no 'in work'.",
        },
        voicePractice: {
          sentenceEnglish: "I am at work now.",
          spanishMeaning: "Estoy en el trabajo ahora.",
          pronunciationHint: "ai am at uórk náu",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Describe la ubicación de objetos y oficinas con precisión en tus correos.",
        },
      },
    },

    // BASE 22: PREPOSICIONES DE TIEMPO (At, On, In)
    {
      title: "El Radar del Tiempo: Horas, Días y Meses",
      focus: "Preposiciones de tiempo: At (horas), On (días), In (meses y años)",
      payload: {
        ruleTaglineSpanish:
          "Del punto más pequeño al más grande: 'at' para horas, 'on' para días y 'in' para meses o años.",
        formulaSegments: [
          { label: "ACCIÓN", token: "We meet", tone: "violet" },
          { label: "DÍA", token: "on Monday", tone: "emerald" },
          { label: "HORA", token: "at nine", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Hora Exacta (At)",
            segments: [
              { label: "EVENTO", token: "We start", tone: "violet" },
              { label: "RELOJ", token: "at", tone: "emerald" },
              { label: "HORA", token: "9:00 AM / night", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'at' para horas exactas del reloj y para la excepción fija 'at night'.",
            exampleEnglish: "The session starts at nine sharp.",
          },
          {
            label: "02 · Día o Fecha (On)",
            segments: [
              { label: "EVENTO", token: "We meet", tone: "violet" },
              { label: "CALENDARIO", token: "on", tone: "emerald" },
              { label: "DÍA / FECHA", token: "Monday / May 5th", tone: "sky" },
            ],
            explanationSpanish:
              "En inglés no decimos 'el lunes': cualquier día o fecha lleva siempre 'on' ('on Monday').",
            exampleEnglish: "We meet on Monday at nine.",
          },
          {
            label: "03 · Mes, Año o Mañana (In)",
            segments: [
              { label: "EVENTO", token: "I practice", tone: "violet" },
              { label: "PERIODO", token: "in", tone: "emerald" },
              { label: "TEMPORADA", token: "July / 2026 / the morning", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'in' para bloques largos (meses, años) y partes del día ('in the morning / afternoon').",
            exampleEnglish: "We meet on Tuesdays in the morning.",
          },
        ],
        commonMistake: {
          wrong: "I see you in Monday at the morning.",
          wrongToken: "in Monday",
          correct: "I see you on Monday in the morning.",
          correctToken: "on Monday",
          whySpanish: "Para los días de la semana usa siempre 'on'; para las partes del día usa 'in'.",
        },
        examples: [
          {
            english: "The session starts at nine sharp.",
            spanish: "La sesión empieza a las nueve en punto.",
            pronunciationHint: "de séshon starts at náin sharp",
          },
          {
            english: "We meet on Tuesdays in the morning.",
            spanish: "Nos reunimos los martes por la mañana.",
            pronunciationHint: "ui mít on tiúsdeis in de mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Nos reunimos el lunes a las nueve",
          targetTokens: ["We", "meet", "on", "Monday", "at", "nine"],
          distractorTokens: ["in"],
          successTipSpanish: "¡Pirámide dominada! 'On Monday' para el día y 'at nine' para la hora.",
          mistakeHintSpanish: "Usa 'on' antes del día de la semana y 'at' antes de la hora.",
        },
        voicePractice: {
          sentenceEnglish: "We meet on Monday at nine.",
          spanishMeaning: "Nos reunimos el lunes a las nueve.",
          pronunciationHint: "ui mít on mándei at náin",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Coordina horarios de entrevistas diciendo 'I am available on Thursday at 3 PM'.",
        },
      },
    },

    // BASE 23: ADVERBIOS DE FRECUENCIA
    {
      title: "Adverbios de Frecuencia: Posición Exacta",
      focus: "Always, Usually, Sometimes, Never y su colocación en la oración",
      payload: {
        ruleTaglineSpanish:
          "La posición cambia según el verbo: ANTES de una acción normal, pero DESPUÉS de To Be.",
        formulaSegments: [
          { label: "PERSONA", token: "I", tone: "violet" },
          { label: "FRECUENCIA", token: "always / usually", tone: "emerald" },
          { label: "ACCIÓN", token: "arrive on time", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Antes de Acción",
            segments: [
              { label: "PERSONA", token: "I / We", tone: "violet" },
              { label: "FRECUENCIA", token: "always / usually", tone: "emerald" },
              { label: "VERBO ACCIÓN", token: "arrive / work", tone: "sky" },
            ],
            explanationSpanish:
              "Con verbos de acción (work, arrive, study), pon el adverbio ANTES del verbo.",
            exampleEnglish: "I always arrive on time.",
          },
          {
            label: "02 · Después de To Be",
            segments: [
              { label: "SUJETO + TO BE", token: "He is / I am", tone: "violet" },
              { label: "FRECUENCIA", token: "never / always", tone: "emerald" },
              { label: "ESTADO", token: "late / ready", tone: "sky" },
            ],
            explanationSpanish:
              "Con 'am, is, are', el verbo To Be manda y el adverbio va justo DESPUÉS ('is never late').",
            exampleEnglish: "He is never late for meetings.",
          },
        ],
        commonMistake: {
          wrong: "I am late always.",
          wrongToken: "late always",
          correct: "I am always late.",
          correctToken: "always late",
          whySpanish: "El adverbio nunca va al final flotando: ponlo justo después de 'am/is/are'.",
        },
        examples: [
          {
            english: "I always arrive on time.",
            spanish: "Siempre llego a tiempo.",
            pronunciationHint: "ai ólueis arráiv on táim",
          },
          {
            english: "He is never late for meetings.",
            spanish: "Él nunca llega tarde a las reuniones.",
            pronunciationHint: "ji is néver léit for mítings",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Siempre llego a tiempo",
          targetTokens: ["I", "always", "arrive", "on", "time"],
          distractorTokens: ["arrive always"],
          successTipSpanish: "¡Exacto! Pusiste 'always' antes de la acción 'arrive'.",
          mistakeHintSpanish: "Coloca 'always' entre el sujeto 'I' y la acción 'arrive'.",
        },
        voicePractice: {
          sentenceEnglish: "I always arrive on time.",
          spanishMeaning: "Siempre llego a tiempo.",
          pronunciationHint: "ai ólueis arráiv on táim",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Describe la regularidad de tus proyectos con 'usually' y 'sometimes'.",
        },
      },
    },
  ];
}
