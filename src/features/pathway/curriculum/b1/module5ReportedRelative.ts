import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule5ReportedRelative(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 22: REPORTED SPEECH: SAY VS TELL
    {
      title: "Estilo Indirecto: La Diferencia Clave entre Say y Tell",
      focus: "Transmitir lo que otra persona dijo respetando el receptor obligatorio de 'tell'",
      payload: {
        ruleTaglineSpanish:
          "Para reportar palabras de otros: 'Say' no necesita a quién se lo dijiste (He said that he was ready). Pero 'Tell' EXIGE nombrar a la persona de inmediato: He told ME that he was ready (nunca 'he said me').",
        formulaSegments: [
          { label: "SAY (SOLO)", token: "He said that he was ready", tone: "violet" },
          { label: "TELL + PERSONA", token: "He told me / told us / told the client", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "He said me that he was busy.",
          wrongToken: "said me",
          correct: "He told me that he was busy.",
          correctToken: "told me",
          whySpanish: "'Say' nunca va pegado a 'me'; si nombras a la persona que escucha, usa 'told me'.",
        },
        examples: [
          {
            english: "She told me that the meeting was postponed.",
            spanish: "Ella me dijo que la reunión fue pospuesta.",
            pronunciationHint: "shi tóuld mi dat de míting uás postpóund",
          },
          {
            english: "The manager said that results were positive.",
            spanish: "El gerente dijo que los resultados fueron positivos.",
            pronunciationHint: "de mánacher sed dat risólts uér pósitiv",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ella me dijo que estaba lista",
          targetTokens: ["She", "told", "me", "that", "she", "was", "ready"],
          distractorTokens: ["said me"],
          successTipSpanish: "¡Elegancia total! 'She told me that' es la combinación correcta.",
          mistakeHintSpanish: "Usa 'told me' en lugar de 'said me' al nombrar al receptor.",
        },
        voicePractice: {
          sentenceEnglish: "She told me that she was ready.",
          spanishMeaning: "Ella me dijo que estaba lista.",
          pronunciationHint: "shi tóuld mi dat shi uás rédi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe resúmenes de llamadas usando 'The client told us that...' con total precisión.",
        },
      },
    },

    // BASE 23: EL RETROCESO TEMPORAL (Backshift en Tiempos)
    {
      title: "El Retroceso Temporal: Backshift en Tiempos Verbales",
      focus: "Dar un paso atrás en el tiempo al reportar (Presente -> Pasado, Will -> Would, Can -> Could)",
      payload: {
        ruleTaglineSpanish:
          "Al reportar lo que alguien dijo en el pasado, toda su frase da un paso hacia atrás en el tiempo: 'I am happy' se vuelve 'He said he was happy'. 'I will call' se vuelve 'He said he would call'. Y 'I can' se vuelve 'could'.",
        formulaSegments: [
          { label: "DIJO EN VIVO", token: "\"I will do it\" · \"I can help\"", tone: "violet" },
          { label: "REPORTADO (PASO ATRÁS)", token: "He said he would do it · he could help", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "He said that he will call tomorrow (en pasado narrativo).",
          wrongToken: "said that he will",
          correct: "He said that he would call tomorrow.",
          correctToken: "said that he would",
          whySpanish: "Al reportar con 'said', el futuro 'will' retrocede a su forma pasada 'would'.",
        },
        examples: [
          {
            english: "He said he would send the proposal today.",
            spanish: "Él dijo que enviaría la propuesta hoy.",
            pronunciationHint: "ji sed ji uúd send de propóusal tudéi",
          },
          {
            english: "She explained that she couldn't attend the call.",
            spanish: "Ella explicó que no podía asistir a la llamada.",
            pronunciationHint: "shi ekspléind dat shi kúdnt aténd de kol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Él dijo que enviaría el archivo",
          targetTokens: ["He", "said", "he", "would", "send", "the", "file"],
          distractorTokens: ["will"],
          successTipSpanish: "¡Retroceso perfecto! 'Will' se transformó en 'would' al ser reportado.",
          mistakeHintSpanish: "Como la acción fue dicha en el pasado ('He said'), usa 'would send'.",
        },
        voicePractice: {
          sentenceEnglish: "He said he would join later.",
          spanishMeaning: "Él dijo que se uniría más tarde.",
          pronunciationHint: "ji sed ji uúd yóin léiter",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Parafrasea retroalimentación de líderes diciendo 'My mentor said that I had strong initiative'.",
        },
      },
    },

    // BASE 24: PREGUNTAS Y ÓRDENES REPORTADAS (Asked if, Told to)
    {
      title: "Preguntas y Órdenes Reportadas: Asked If y Told To",
      focus: "Reportar interrogaciones sin invertir el verbo y transmitir instrucciones",
      payload: {
        ruleTaglineSpanish:
          "Si alguien te hizo una pregunta de sí o no, repórtala con 'asked if' y pon la frase normal (She asked if I was ready, no 'was I'). Para órdenes o consejos, usa 'told me to' (He told me to wait).",
        formulaSegments: [
          { label: "PREGUNTA REPORTADA", token: "She asked if I had experience", tone: "violet" },
          { label: "INSTRUCCIÓN REPORTADA", token: "He told us to review the figures", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "She asked me if was I ready.",
          wrongToken: "if was I",
          correct: "She asked me if I was ready.",
          correctToken: "if I was",
          whySpanish: "En preguntas reportadas no se invierte el sujeto y el verbo: di 'if I was'.",
        },
        examples: [
          {
            english: "The interviewer asked if I spoke other languages.",
            spanish: "El entrevistador me preguntó si hablaba otros idiomas.",
            pronunciationHint: "di intérviu-er askt if ai spóuk óder lánguachis",
          },
          {
            english: "The director told us to prioritize this deliverable.",
            spanish: "El director nos dijo que priorizáramos este entregable.",
            pronunciationHint: "de diréktor tóuld as tu praióritais dis delíverabol",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Ella me preguntó si estaba listo",
          targetTokens: ["She", "asked", "me", "if", "I", "was", "ready"],
          distractorTokens: ["was I", "said"],
          successTipSpanish: "¡Magistral! 'She asked me if I was ready' sin inversión innecesaria.",
          mistakeHintSpanish: "Abre con 'She asked me if', coloca 'I was' y finaliza con 'ready'.",
        },
        voicePractice: {
          sentenceEnglish: "She asked if we were ready.",
          spanishMeaning: "Ella preguntó si estábamos listos.",
          pronunciationHint: "shi askt if ui uér rédi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe minutas de reuniones resumiendo acuerdos con 'The client asked if we could deliver...'.",
        },
      },
    },

    // BASE 25: CLÁUSULAS DE RELATIVO (Who, Which, That, Whose, Where)
    {
      title: "Cláusulas de Relativo: Who, Which, That, Where y Whose",
      focus: "Conectar dos ideas en una sola oración fluida sin repetir sujetos",
      payload: {
        ruleTaglineSpanish:
          "Usa 'who' para personas, 'which' para cosas, 'that' como comodín para ambos, 'where' para lugares, y 'whose' para posesión (The specialist whose idea won). Convierte dos frases cortadas en una sola idea ejecutiva.",
        formulaSegments: [
          { label: "PERSONA", token: "The professional who led the team", tone: "violet" },
          { label: "COSA / LUGAR", token: "The plan that worked · The city where I live", tone: "emerald" },
          { label: "POSESIÓN", token: "The client whose contract was signed", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The person which called me.",
          wrongToken: "person which",
          correct: "The person who called me.",
          correctToken: "person who",
          whySpanish: "Para seres humanos usa siempre 'who' o 'that', nunca 'which'.",
        },
        examples: [
          {
            english: "The colleague who presented the idea did a fantastic job.",
            spanish: "El colega que presentó la idea hizo un trabajo fantástico.",
            pronunciationHint: "de kólig ju preséntid di aidía did a fantástik yob",
          },
          {
            english: "This is the workspace where we collaborate daily.",
            spanish: "Este es el espacio de trabajo donde colaboramos a diario.",
            pronunciationHint: "dis is de uórkspeis uér ui koláboreit déili",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La persona que llamó está aquí",
          targetTokens: ["The", "person", "who", "called", "is", "here"],
          distractorTokens: ["which"],
          successTipSpanish: "¡Exacto! Usaste 'who' para referirte a una persona.",
          mistakeHintSpanish: "Para personas utiliza 'who' en lugar de 'which'.",
        },
        voicePractice: {
          sentenceEnglish: "The person who called is waiting.",
          spanishMeaning: "La persona que llamó está esperando.",
          pronunciationHint: "de pérson ju kold is uéiting",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza oraciones compuestas en lecturas identificando las cláusulas con 'who' y 'which'.",
        },
      },
    },

    // BASE 26: OMISIÓN DEL PRONOMBRE RELATIVO
    {
      title: "La Omisión del Pronombre Relativo: Hablar con Fluidez",
      focus: "Cuándo retirar 'that' o 'which' para sonar 100% natural y conciso",
      payload: {
        ruleTaglineSpanish:
          "El secreto de los hablantes fluidos: si después de 'that' o 'which' entra otra persona haciendo una acción, ¡borra el pronombre!: The project that we started -> The project we started. Suena más rápido, limpio y nativo.",
        formulaSegments: [
          { label: "CON PRONOMBRE (CORRECTO)", token: "The book that I read yesterday", tone: "violet" },
          { label: "FLUIDEZ NATIVA (OMISIÓN)", token: "The book I read yesterday", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "The person that is here (¡aquí no se puede borrar porque 'that' es el sujeto!).",
          wrongToken: "The person is here",
          correct: "The person who is here.",
          correctToken: "The person who is here",
          whySpanish: "Solo puedes omitir el pronombre cuando hay otro sujeto después haciendo la acción.",
        },
        examples: [
          {
            english: "The advice you gave me was invaluable.",
            spanish: "El consejo que me diste fue invaluable.",
            pronunciationHint: "di adváis yu géiv mi uás inváliubol",
          },
          {
            english: "This is the document we reviewed yesterday.",
            spanish: "Este es el documento que revisamos ayer.",
            pronunciationHint: "dis is de dókyument ui riviúd yésterdei",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El consejo que me diste fue muy útil",
          targetTokens: ["The", "advice", "you", "gave", "me", "was", "very", "helpful"],
          distractorTokens: ["which that"],
          successTipSpanish: "¡Inglés de máxima fluidez! Omitiste 'that' de forma impecable.",
          mistakeHintSpanish: "Usa 'The advice you gave me was very helpful' sin necesidad de 'that'.",
        },
        voicePractice: {
          sentenceEnglish: "The advice you gave was very helpful.",
          spanishMeaning: "El consejo que diste fue muy útil.",
          pronunciationHint: "di adváis yu géiv uás véri jélpful",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Haz tus correos más concisos y dinámicos eliminando los 'that' innecesarios.",
        },
      },
    },
  ];
}

