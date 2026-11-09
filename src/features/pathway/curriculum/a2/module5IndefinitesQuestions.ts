import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5IndefinitesQuestions(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: PRONOMBRES INDEFINIDOS (Someone, Something, Somewhere)
    {
      title: "Pronombres Indefinidos: Someone, Something y Somewhere",
      focus: "Referirse a personas, objetos o lugares no específicos en oraciones positivas",
      payload: {
        ruleTaglineSpanish:
          "Cuando no necesitas nombrar a alguien con exactitud, usa la familia 'some-': someone / somebody (alguien), something (algo), y somewhere (en algún lugar).",
        formulaSegments: [
          { label: "PERSONA INDEFINIDA", token: "Someone is calling / Somebody knows", tone: "violet" },
          { label: "OBJETO INDEFINIDO", token: "There is something important", tone: "emerald" },
          { label: "LUGAR INDEFINIDO", token: "It is somewhere in the office", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Persona no identificada",
            segments: [
              { label: "PERSONA INDEFINIDA", token: "someone · somebody", tone: "violet" },
              { label: "CÓMO ACTÚA", token: "is calling · left a message", tone: "emerald" },
            ],
            explanationSpanish:
              "Usá 'someone' cuando sabés que existe una persona pero no necesitás nombrarla. Ocupa el lugar del sujeto y lleva verbo en singular, como 'someone is'. En preguntas o en negativo cambia a 'anyone': 'Is anyone there?'.",
            exampleEnglish: "Someone from support called you earlier.",
          },
          {
            label: "02 · Objeto no específico",
            segments: [
              { label: "COSA INDEFINIDA", token: "something", tone: "violet" },
              { label: "QUÉ HACER CON ELLA", token: "to review · important", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hablás de una cosa que no querés especificar, usás 'something'. Es singular y nunca lleva artículo: decís 'something important', no 'a something'. La pareja 'anything' aparece en preguntas y en frases negativas.",
            exampleEnglish: "I have something to tell you.",
          },
          {
            label: "03 · Lugar sin precisar",
            segments: [
              { label: "LUGAR INDEFINIDO", token: "somewhere", tone: "violet" },
              { label: "DÓNDE VA EN LA FRASE", token: "después del verbo · is somewhere", tone: "sky" },
            ],
            explanationSpanish:
              "Para un lugar que no querés precisar, usás 'somewhere': no importa cuál, solo que existe uno. Va detrás del verbo: 'it is somewhere here'. Si das la ubicación exacta, volvés a un lugar concreto como 'the office'.",
            exampleEnglish: "We need to meet somewhere quiet.",
          },
        ],
        commonMistake: {
          wrong: "Anyone is calling you.",
          wrongToken: "Anyone",
          correct: "Someone is calling you.",
          correctToken: "Someone",
          whySpanish: "En oraciones afirmativas para decir 'alguien', usa 'someone', no 'anyone'.",
        },
        examples: [
          {
            english: "Someone left a message for you.",
            spanish: "Alguien dejó un mensaje para ti.",
            pronunciationHint: "sámuan left a mésech for yu",
          },
          {
            english: "There is something we need to review.",
            spanish: "Hay algo que necesitamos revisar.",
            pronunciationHint: "der is sámzing ui níd tu riviú",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Alguien llamó esta mañana",
          targetTokens: ["Someone", "called", "this", "morning"],
          distractorTokens: ["Anyone"],
          successTipSpanish: "¡Muy bien! Usaste 'Someone' para la afirmación.",
          mistakeHintSpanish: "Abre con 'Someone' para decir 'alguien' en afirmativo.",
        },
        voicePractice: {
          sentenceEnglish: "There is something to review today.",
          spanishMeaning: "Hay algo que revisar hoy.",
          pronunciationHint: "der is sámzing tu riviú tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Redacta reportes de incidencias usando 'Something happened' con precisión.",
        },
      },
    },

    // BASE 23: LA REGLA DE 'ANY' Y 'NO' (Cero Doble Negación)
    {
      title: "Cero Doble Negación: La Regla de Any y No",
      focus: "Diferenciar 'I don't know anything' de 'I know nothing' sin duplicar la negación",
      payload: {
        ruleTaglineSpanish:
          "En español decimos 'No sé nada' (doble negación). En inglés es prohibido: si el verbo ya es negativo, usa 'anything/anyone' (I don't know anything). Si el verbo es positivo, usa 'nothing/nobody' (I know nothing).",
        formulaSegments: [
          { label: "CON VERBO NEGATIVO", token: "I don't know anything / anyone", tone: "violet" },
          { label: "CON VERBO POSITIVO", token: "I know nothing / There is nobody", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Verbo negativo + any",
            segments: [
              { label: "VERBO NEGATIVO", token: "don't · didn't · isn't", tone: "violet" },
              { label: "PRONOMBRE EN POSITIVO", token: "anything · anyone", tone: "emerald" },
            ],
            explanationSpanish:
              "Si el verbo ya está en negativo con 'don't', 'didn't' o 'isn't', el pronombre va en positivo con 'any': 'I didn't see anyone'. Un solo negativo por frase. Si decís 'I didn't see no one', los dos negativos se anulan y dices lo contrario.",
            exampleEnglish: "I don't need anything else.",
          },
          {
            label: "02 · Verbo positivo + no",
            segments: [
              { label: "VERBO POSITIVO", token: "know · called · is", tone: "violet" },
              { label: "PRONOMBRE NEGATIVO", token: "nothing · nobody", tone: "emerald" },
            ],
            explanationSpanish:
              "Si el verbo es positivo, la negación viaja al pronombre con 'no': 'I know nothing', 'Nobody called'. El verbo queda intacto y en singular. Elegís 'nothing' cuando el negativo está solo en el pronombre, nunca en los dos lados.",
            exampleEnglish: "Nobody told me about the change.",
          },
        ],
        commonMistake: {
          wrong: "I don't know nothing.",
          wrongToken: "don't know nothing",
          correct: "I don't know anything.",
          correctToken: "don't know anything",
          whySpanish: "Dos negativos se anulan en inglés: usa 'don't know anything'.",
        },
        examples: [
          {
            english: "I didn't see anyone in the room.",
            spanish: "No vi a nadie en la sala.",
            pronunciationHint: "ai dídent sí éniuan in de rum",
          },
          {
            english: "There is nobody available right now.",
            spanish: "No hay nadie disponible en este momento.",
            pronunciationHint: "der is nóubadi avéilabol ráit náu",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No vi a nadie hoy",
          targetTokens: ["I", "didn't", "see", "anyone", "today"],
          distractorTokens: ["no one", "saw"],
          successTipSpanish: "¡Cero doble negación! Con 'didn't see' la pareja correcta es 'anyone'.",
          mistakeHintSpanish: "Como ya tienes 'didn't', usa 'anyone', no 'no one'.",
        },
        voicePractice: {
          sentenceEnglish: "I don't have anything to add.",
          spanishMeaning: "No tengo nada que agregar.",
          pronunciationHint: "ai dóunt jav énizing tu ad",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde al final de entrevistas diciendo 'I don't have any further questions'.",
        },
      },
    },

    // BASE 24: 'EVERYONE' Y 'EVERYTHING' (Sujeto en Singular)
    {
      title: "Everyone y Everything: La Trampa del Verbo en Singular",
      focus: "Concordancia con 'is', 'has' y verbos con '-s' para pronombres colectivos",
      payload: {
        ruleTaglineSpanish:
          "En español pensamos en 'todos' como un grupo plural. Pero en inglés 'Everyone' significa 'cada uno en particular', así que SIEMPRE lleva verbo en singular: Everyone IS ready, Everyone HAS a role.",
        formulaSegments: [
          { label: "SUJETO SINGULAR", token: "Everyone / Everybody / Everything", tone: "violet" },
          { label: "VERBO EN SINGULAR", token: "is ready · has time · works well", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Everyone con verbo singular",
            segments: [
              { label: "SUJETO COLECTIVO", token: "everyone · everybody", tone: "violet" },
              { label: "VERBO EN SINGULAR", token: "is · has · works", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando 'everyone' es el sujeto, el verbo va en singular, igual que con 'he': 'Everyone is', 'Everyone has', 'Everyone works'. Aunque en español pensemos en 'todos' y en plural, en inglés nunca va 'are' ni 'have' detrás de 'everyone'.",
            exampleEnglish: "Everyone has a copy of the file.",
          },
          {
            label: "02 · Everything con verbo singular",
            segments: [
              { label: "SUJETO COLECTIVO", token: "everything", tone: "violet" },
              { label: "VERBO EN SINGULAR", token: "is · looks · has", tone: "emerald" },
            ],
            explanationSpanish:
              "'Everything' también es singular: junta todas las cosas en un solo bloque, por eso pide 'is', 'has' o un verbo con -s. Contrasta con 'all the things', que sí es plural y pide 'are'. La señal es la terminación '-thing': siempre singular.",
            exampleEnglish: "Everything looks fine on the report.",
          },
        ],
        commonMistake: {
          wrong: "Everyone are here today.",
          wrongToken: "Everyone are",
          correct: "Everyone is here today.",
          correctToken: "Everyone is",
          whySpanish: "A pesar de significar 'todos', 'Everyone' exige gramaticalmente 'is', no 'are'.",
        },
        examples: [
          {
            english: "Everyone agrees with the proposal.",
            spanish: "Todos están de acuerdo con la propuesta.",
            pronunciationHint: "évriuan agrís uiz de propóusal",
          },
          {
            english: "Everything is under control.",
            spanish: "Todo está bajo control.",
            pronunciationHint: "évrizing is ánder kontról",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Todos están listos hoy",
          targetTokens: ["Everyone", "is", "ready", "today"],
          distractorTokens: ["are"],
          successTipSpanish: "¡Excelente! No caíste en la trampa: 'Everyone is' en singular.",
          mistakeHintSpanish: "Recuerda que 'Everyone' se empareja con 'is', no con 'are'.",
        },
        voicePractice: {
          sentenceEnglish: "Everyone is ready to start.",
          spanishMeaning: "Todos están listos para empezar.",
          pronunciationHint: "évriuan is rédi tu start",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Observa en comunicados de empresa cómo 'everyone' siempre activa verbos con -s.",
        },
      },
    },

    // BASE 25: PREPOSICIONES AL FINAL DE LA PREGUNTA
    {
      title: "Preposiciones al Final: Who to? y What for?",
      focus: "La estructura natural donde la preposición viaja al final de la pregunta",
      payload: {
        ruleTaglineSpanish:
          "En español decimos '¿Con quién hablas?' o '¿Para qué sirve?'. En inglés la preposición se va al puro final: 'Who are you talking TO?', 'What is this FOR?'. Suena moderno y totalmente fluido.",
        formulaSegments: [
          { label: "PALABRA WH-", token: "Who / What / Where", tone: "violet" },
          { label: "PREGUNTA", token: "are you talking / does it come", tone: "emerald" },
          { label: "PREPOSICIÓN FINAL", token: "to? / for? / from?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Preguntar con quién (who ... to)",
            segments: [
              { label: "WH- DE PERSONA", token: "who", tone: "violet" },
              { label: "PREGUNTA", token: "are you talking · did you speak", tone: "emerald" },
              { label: "PREPOSICIÓN FINAL", token: "to?", tone: "sky" },
            ],
            explanationSpanish:
              "Preguntás por una persona y dejás la preposición al final: 'Who did you talk to?'. Si la movés al inicio ('To whom did you talk?'), suena muy formal y poco natural en conversación. La señal es que la preposición cierra la pregunta.",
            exampleEnglish: "Who did you speak to yesterday?",
          },
          {
            label: "02 · Preguntar para qué (what ... for)",
            segments: [
              { label: "WH- DE COSA", token: "what", tone: "violet" },
              { label: "PREGUNTA", token: "is this · is it", tone: "emerald" },
              { label: "PREPOSICIÓN FINAL", token: "for?", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando preguntás el propósito de una cosa, usás 'what' y mandás 'for' al final: 'What is this button for?'. El 'for' no se puede omitir: sin él la pregunta queda incompleta. Con 'who' la preposición típica es 'to'; con 'what', 'for'.",
            exampleEnglish: "What is this cable for?",
          },
        ],
        commonMistake: {
          wrong: "With who are you talking?.",
          wrongToken: "With who",
          correct: "Who are you talking to?",
          correctToken: "Who... to?",
          whySpanish: "El inglés conversacional moderno envía siempre la preposición al final.",
        },
        examples: [
          {
            english: "What are you looking for?",
            spanish: "¿Qué estás buscando?",
            pronunciationHint: "uát ar yu lúking for?",
          },
          {
            english: "Where is this parcel from?",
            spanish: "¿De dónde es este paquete?",
            pronunciationHint: "uér is dis pársel from?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Qué estás buscando tú?",
          targetTokens: ["What", "are", "you", "looking", "for?"],
          distractorTokens: ["For what"],
          successTipSpanish: "¡Súper nativo! Mandaste 'for' al final de la pregunta sin titubear.",
          mistakeHintSpanish: "Abre con 'What are you looking' y cierra con la preposición 'for?'.",
        },
        voicePractice: {
          sentenceEnglish: "What are you looking for?",
          spanishMeaning: "¿Qué estás buscando?",
          pronunciationHint: "uát ar yu lúking for?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Entiende preguntas casuales como 'Who did you report to?' sin desconcertarte.",
        },
      },
    },

    // BASE 26: PREGUNTAS INDIRECTAS DE CORTESÍA
    {
      title: "Preguntas Indirectas de Cortesía: Could you tell me where...?",
      focus: "Formular preguntas formales sin doble inversión en la segunda parte",
      payload: {
        ruleTaglineSpanish:
          "Para preguntar en un hotel o en el trabajo sin sonar rudo, abre con 'Could you tell me...?' o 'Do you know...?'. Ojo: en la segunda mitad el orden vuelve a ser Sujeto + Verbo: where the station IS (no 'where is the station').",
        formulaSegments: [
          { label: "APERTURA AMABLE", token: "Could you tell me / Do you know", tone: "violet" },
          { label: "CONECTOR", token: "where / what time / if", tone: "emerald" },
          { label: "ORDEN SUJETO + VERBO", token: "the office is? / the meeting starts?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Sí/no con if",
            segments: [
              { label: "APERTURA AMABLE", token: "Could you tell me · Do you know", tone: "violet" },
              { label: "CONECTOR IF", token: "if", tone: "emerald" },
              { label: "ORDEN SUJETO + VERBO", token: "the office is open?", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la respuesta que esperás es sí o no, la pregunta indirecta lleva 'if' en el centro: 'Do you know if the office is open?'. No usás 'if' con preguntas wh-. Después de 'if' el orden vuelve a sujeto + verbo, sin auxiliar.",
            exampleEnglish: "Could you tell me if the shop opens today?",
          },
          {
            label: "02 · Wh- indirecta",
            segments: [
              { label: "APERTURA AMABLE", token: "Could you tell me · Can you tell me", tone: "violet" },
              { label: "CONECTOR WH-", token: "where · when · what time", tone: "emerald" },
              { label: "ORDEN SUJETO + VERBO", token: "the lift is?", tone: "sky" },
            ],
            explanationSpanish:
              "Si la pregunta original empieza con 'where', 'when' o 'what time', esa palabra pasa al centro y el resto toma orden de oración: 'Can you tell me where the lift is?'. No hay segunda inversión: nunca 'where is the lift?'.",
            exampleEnglish: "Do you know where the invoices are?",
          },
        ],
        commonMistake: {
          wrong: "Could you tell me where is the station?",
          wrongToken: "where is the station",
          correct: "Could you tell me where the station is?",
          correctToken: "where the station is",
          whySpanish: "En preguntas indirectas no hagas doble inversión: pon el sujeto antes del verbo al final.",
        },
        examples: [
          {
            english: "Could you tell me where the meeting room is?",
            spanish: "¿Podrías decirme dónde está la sala de reuniones?",
            pronunciationHint: "kúd yu tel mi uér de míting rum is?",
          },
          {
            english: "Do you know what time the session starts?",
            spanish: "¿Sabes a qué hora empieza la sesión?",
            pronunciationHint: "du yu nóu uát táim de séshon starts?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta cordial: ¿Podrías decirme dónde está la oficina?",
          targetTokens: ["Could", "you", "tell", "me", "where", "the", "office", "is?"],
          distractorTokens: ["is the office"],
          successTipSpanish: "¡Nivel diplomático! Mantuviste 'the office is' sin invertir al final.",
          mistakeHintSpanish: "Después de 'where', pon primero 'the office' y al final 'is?'.",
        },
        voicePractice: {
          sentenceEnglish: "Could you tell me where the room is?",
          spanishMeaning: "¿Podrías decirme dónde está la sala?",
          pronunciationHint: "kúd yu tel mi uér de rum is?",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe consultas de alto nivel corporativo usando 'Please let me know when the file is ready'.",
        },
      },
    },
  ];
}

