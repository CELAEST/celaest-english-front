import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2TemporalDepth(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: ACCIÓN ININTERRUMPIDA (Present Perfect Continuous)
    {
      title: "La Acción Ininterrumpida: Present Perfect Continuous",
      focus: "Acciones iniciadas en el pasado que continúan activas hasta este segundo (Have been doing)",
      payload: {
        ruleTaglineSpanish:
          "Para decir 'Llevo tres horas estudiando' o 'He estado trabajando sin parar', usa 'have / has been' más el verbo con '-ing': I have been working for three hours. Muestra la duración y el sudor de la acción.",
        formulaSegments: [
          { label: "LLEVAR TIEMPO", token: "I have been · She has been", tone: "violet" },
          { label: "HACIENDO", token: "working · waiting · preparing", tone: "emerald" },
          { label: "DURACIÓN", token: "for two hours / all morning / since 8 AM", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I am working here since two years.",
          wrongToken: "am working here since",
          correct: "I have been working here for two years.",
          correctToken: "have been working here for",
          whySpanish: "Para acciones que continúan desde el pasado hasta hoy, se usa 'have been working', nunca presente simple ni continuo.",
        },
        examples: [
          {
            english: "I have been studying English for six months.",
            spanish: "Llevo estudiando inglés seis meses.",
            pronunciationHint: "ai jav bin stádi-ing ínglish for siks manzs",
          },
          {
            english: "We have been waiting for the response all morning.",
            spanish: "Hemos estado esperando la respuesta toda la mañana.",
            pronunciationHint: "ui jav bin uéiting for de rispóns ol mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Llevo trabajando aquí durante dos horas",
          targetTokens: ["I", "have", "been", "working", "here", "for", "two", "hours"],
          distractorTokens: ["am working", "since"],
          successTipSpanish: "¡Estructura de fluidez nativa! 'Have been working' conecta tu esfuerzo.",
          mistakeHintSpanish: "Usa 'I have been working here' y 'for two hours' para la duración.",
        },
        voicePractice: {
          sentenceEnglish: "I have been learning English for six months.",
          spanishMeaning: "Llevo seis meses aprendiendo inglés.",
          pronunciationHint: "ai jav bin lérning ínglish for siks manzs",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a 'How long have you been in this field?' con 'I have been working in this field for...'.",
        },
      },
    },

    // BASE 8: DURACIÓN VS RESULTADO (Simple vs Continuous)
    {
      title: "Duración vs Resultado: Present Perfect Simple vs Continuous",
      focus: "Contraste: ¿Cuánto tiempo llevas? (Continuous) vs ¿Cuántos terminaste? (Simple)",
      payload: {
        ruleTaglineSpanish:
          "Si te importa el proceso y el tiempo transcurrido, usa Continuous: 'I have been reading for an hour'. Si te importa el resultado numérico concluido, usa Simple: 'I have read 3 chapters'.",
        formulaSegments: [
          { label: "PROCESO (DURACIÓN)", token: "I have been writing emails all morning", tone: "violet" },
          { label: "RESULTADO (LOGRO)", token: "I have written five emails", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I have been writing five emails this morning.",
          wrongToken: "have been writing five",
          correct: "I have written five emails this morning.",
          correctToken: "have written five",
          whySpanish: "Cuando dices cuántas unidades completas lograste (un número), usa la forma Simple ('have written').",
        },
        examples: [
          {
            english: "She has been coding all day, and she has solved three problems.",
            spanish: "Ella ha estado programando todo el día y ha resuelto tres problemas.",
            pronunciationHint: "shi jas bin kóuding ol déi, and shi jas solvd zri próblems",
          },
          {
            english: "How long have you been waiting? Have you seen the manager?",
            spanish: "¿Cuánto tiempo llevas esperando? ¿Has visto al gerente?",
            pronunciationHint: "jáu long jav yu bin uéiting? jav yu sin de mánacher?",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: He completado tres tareas hoy",
          targetTokens: ["I", "have", "completed", "three", "tasks", "today"],
          distractorTokens: ["been completing"],
          successTipSpanish: "¡Exacto! Al mencionar 'three tasks' (resultado numérico), usas Present Perfect Simple.",
          mistakeHintSpanish: "Para cantidades concluidas, usa 'have completed', no la forma continua.",
        },
        voicePractice: {
          sentenceEnglish: "I have completed three key tasks today.",
          spanishMeaning: "He completado tres tareas clave hoy.",
          pronunciationHint: "ai jav komplítid zri ki tasks tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Combina ambos en tus reportes de estado: qué estuviste haciendo y qué entregaste listo.",
        },
      },
    },

    // BASE 9: EL PASADO DEL PASADO (Past Perfect Simple)
    {
      title: "El Pasado del Pasado: Past Perfect Simple",
      focus: "La acción que ocurrió antes de otra acción pasada (Had + Participio Pasado)",
      payload: {
        ruleTaglineSpanish:
          "Si estás contando una historia en el pasado y necesitas retroceder aún más atrás en el tiempo para contar algo que ya había ocurrido antes, usa 'had' más el participio: When I arrived, the train had already left.",
        formulaSegments: [
          { label: "ACCIÓN ANTERIOR (HAD)", token: "The meeting had already started", tone: "violet" },
          { label: "ACCIÓN POSTERIOR (PAST)", token: "when I arrived at the office", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "When I arrived, the train already left.",
          wrongToken: "already left",
          correct: "When I arrived, the train had already left.",
          correctToken: "had already left",
          whySpanish: "Para lo que ocurrió antes del momento de tu llegada, debes usar 'had left'.",
        },
        examples: [
          {
            english: "By the time we joined, they had finished the discussion.",
            spanish: "Para cuando nos unimos, ellos ya habían terminado la discusión.",
            pronunciationHint: "bai de táim ui yóind, dei jad fínisht de diskáshon",
          },
          {
            english: "I realized I had forgotten my keys.",
            spanish: "Me di cuenta de que había olvidado mis llaves.",
            pronunciationHint: "ai ríalaisd ai jad forgóten mai kis",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La reunión ya había empezado",
          targetTokens: ["The", "meeting", "had", "already", "started"],
          distractorTokens: ["has"],
          successTipSpanish: "¡Nivel narrativo avanzado! 'Had already started' ubica la acción con precisión.",
          mistakeHintSpanish: "Para el pasado anterior usa 'had', no 'has'.",
        },
        voicePractice: {
          sentenceEnglish: "They had already approved the proposal.",
          spanishMeaning: "Ellos ya habían aprobado la propuesta.",
          pronunciationHint: "dei jad olrédi aprúvd de propóusal",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Comprende la cronología exacta en crónicas y estudios de caso con Past Perfect.",
        },
      },
    },

    // BASE 10: SEÑALES DE SECUENCIA PASADA (By the time, Before, Already)
    {
      title: "Señales de Secuencia Pasada: By the time, Before y Already",
      focus: "Articular líneas de tiempo complejas con conectores cronológicos precisos",
      payload: {
        ruleTaglineSpanish:
          "'By the time' significa 'para cuando'. Siempre va seguido de Pasado Simple y se empareja con un Past Perfect: By the time the manager arrived, we had solved the problem.",
        formulaSegments: [
          { label: "PARA CUANDO", token: "By the time + Past Simple", tone: "violet" },
          { label: "YA SE HABÍA HECHO", token: "we had resolved the issue", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "By the time the manager has arrived, we solved.",
          wrongToken: "has arrived",
          correct: "By the time the manager arrived, we had solved the problem.",
          correctToken: "arrived, we had solved",
          whySpanish: "Con 'By the time' en pasado, usa primero Past Simple y luego Past Perfect.",
        },
        examples: [
          {
            english: "By the time the call ended, we had agreed on every term.",
            spanish: "Para cuando terminó la llamada, nos habíamos puesto de acuerdo en cada término.",
            pronunciationHint: "bai de táim de kol éndid, ui jad agríd on évri term",
          },
          {
            english: "She had checked the document before she sent it.",
            spanish: "Ella había revisado el documento antes de enviarlo.",
            pronunciationHint: "shi jad chekt de dókyument bifór shi sent it",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Para cuando llegamos, ya habían terminado",
          targetTokens: ["By", "the", "time", "we", "arrived,", "they", "had", "finished"],
          distractorTokens: ["have"],
          successTipSpanish: "¡Magnífico! Conectaste 'By the time' con el pasado del pasado.",
          mistakeHintSpanish: "Abre con 'By the time we arrived,' y añade 'they had finished'.",
        },
        voicePractice: {
          sentenceEnglish: "By the time we arrived, they had finished.",
          spanishMeaning: "Para cuando llegamos, ellos ya habían terminado.",
          pronunciationHint: "bai de táim ui arráivd, dei jad fínisht",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Narra resolución de crisis diciendo 'By the time the client noticed, we had fixed it'.",
        },
      },
    },

    // BASE 11: HÁBITOS Y ADAPTACIÓN (Used to vs Be/Get used to)
    {
      title: "Hábitos y Adaptación: Used to vs Be Used to vs Get Used to",
      focus: "Distinguir 'solía hacer' de 'estar acostumbrado' y 'acostumbrarse'",
      payload: {
        ruleTaglineSpanish:
          "La trinidad de oro: 'used to + verbo base' = solía hacer antes (I used to travel). 'be used to + -ing' = estar acostumbrado (I am used to waking up early). Y 'get used to + -ing' = el proceso de acostumbrarse.",
        formulaSegments: [
          { label: "SOLÍA (PASADO)", token: "I used to commute (ya no)", tone: "violet" },
          { label: "ESTAR ACOSTUMBRADO", token: "I am used to working remotely", tone: "emerald" },
          { label: "ACOSTUMBRARSE", token: "I am getting used to this routine", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I am used to work late (queriendo decir estar acostumbrado).",
          wrongToken: "used to work",
          correct: "I am used to working late.",
          correctToken: "used to working",
          whySpanish: "Cuando pones el verbo To Be ('am used to'), la acción obligatoriamente termina en '-ing'.",
        },
        examples: [
          {
            english: "I used to work in an office, but now I work from home.",
            spanish: "Solía trabajar en una oficina, pero ahora trabajo desde casa.",
            pronunciationHint: "ai yúst tu uórk in an ófis, bat náu ai uórk from jóum",
          },
          {
            english: "It took me a few weeks to get used to the new schedule.",
            spanish: "Me tomó un par de semanas acostumbrarme al nuevo horario.",
            pronunciationHint: "it tuk mi a fiú uíks tu get yúst tu de niú skédyul",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Solía vivir en otra ciudad",
          targetTokens: ["I", "used", "to", "live", "in", "another", "city"],
          distractorTokens: ["living", "am used"],
          successTipSpanish: "¡Claridad total! 'Used to live' para un hábito que ya terminó.",
          mistakeHintSpanish: "Para decir 'solía vivir', usa 'I used to live'.",
        },
        voicePractice: {
          sentenceEnglish: "I used to live in another city.",
          spanishMeaning: "Solía vivir en otra ciudad.",
          pronunciationHint: "ai yúst tu liv in anóder síti",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Demuestra flexibilidad diciendo 'I am used to working in fast-paced environments'.",
        },
      },
    },
  ];
}

