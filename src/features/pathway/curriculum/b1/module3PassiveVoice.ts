import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3PassiveVoice(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: VOZ PASIVA EN PRESENTE (Am / Is / Are + Participio)
    {
      title: "La Voz Pasiva en Presente: El Foco en el Hecho",
      focus: "Presentar procesos y hábitos cotidianos donde importa el hecho y no quién lo hace",
      payload: {
        ruleTaglineSpanish:
          "Cuando lo importante no es quién hace la acción sino qué ocurre con el producto o resultado, usa 'is / are' más el participio pasado: English is spoken worldwide (El inglés es hablado en todo el mundo).",
        formulaSegments: [
          { label: "OBJETO RECEPTOR", token: "The report / These files", tone: "violet" },
          { label: "SER / ESTAR (PRESENTE)", token: "is / are", tone: "emerald" },
          { label: "PARTICIPIO PASADO", token: "generated · updated · reviewed daily", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Hecho en singular: is",
            segments: [
              { label: "OBJETO SINGULAR", token: "The report / This file", tone: "violet" },
              { label: "HECHO O ESTADO", token: "is + participio", tone: "emerald" },
              { label: "SEÑAL", token: "is checked · is locked", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el sujeto es un objeto en singular (the report, this file) y lo que importa es el hecho o el estado, usa 'is' más participio. Si el sujeto es plural, cambia a 'are'. Contraste: en activo dirías 'the team checks it', con autor.",
            exampleEnglish: "The report is checked every Friday.",
          },
          {
            label: "02 · Hecho plural: are",
            segments: [
              { label: "OBJETO PLURAL", token: "These files / All transactions", tone: "violet" },
              { label: "HECHO HABITUAL", token: "are + participio", tone: "emerald" },
              { label: "SEÑAL", token: "are approved · are secured", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el objeto receptor es plural (these files, all transactions), el auxiliar cambia a 'are' y el participio no cambia. Señal rápida: mira el sustantivo, no el verbo. Contraste: con singular sería 'is', nunca 'are'.",
            exampleEnglish: "These invoices are approved online.",
          },
        ],
        commonMistake: {
          wrong: "The data update every morning.",
          wrongToken: "data update",
          correct: "The data is updated every morning.",
          correctToken: "is updated",
          whySpanish: "Los datos no se actualizan solos; 'son actualizados' exige 'is updated'.",
        },
        examples: [
          {
            english: "All transactions are secured with encryption.",
            spanish: "Todas las transacciones están aseguradas con encriptación.",
            pronunciationHint: "ol transákshons ar sekiúrd uiz enkrípshon",
          },
          {
            english: "English is spoken in international business.",
            spanish: "El inglés se habla en los negocios internacionales.",
            pronunciationHint: "ínglish is spóuken in internáshonal bísnes",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El reporte es revisado cada mañana",
          targetTokens: ["The", "report", "is", "reviewed", "every", "morning"],
          distractorTokens: ["reviews"],
          successTipSpanish: "¡Elegancia corporativa! 'The report is reviewed' pone el foco en la tarea.",
          mistakeHintSpanish: "Usa 'The report is' y el participio 'reviewed every morning'.",
        },
        voicePractice: {
          sentenceEnglish: "The data is verified every morning.",
          spanishMeaning: "La información es verificada cada mañana.",
          pronunciationHint: "de déita is vérifaid évri mórning",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Comprende la estructura de artículos de noticias y comunicados corporativos redactados en pasiva.",
        },
      },
    },

    // BASE 13: VOZ PASIVA EN PASADO (Was / Were + Participio)
    {
      title: "La Voz Pasiva en Pasado: Hechos Concluidos",
      focus: "Describir eventos históricos, hitos concluidos y decisiones tomadas (Was / Were + Participio)",
      payload: {
        ruleTaglineSpanish:
          "Para reportar un resultado concluido en el pasado sin señalar con el dedo a quién lo hizo, usa 'was' (singular) o 'were' (plural) seguido del participio: The contract was signed yesterday.",
        formulaSegments: [
          { label: "OBJETO", token: "The platform / The proposals", tone: "violet" },
          { label: "FUE / FUERON", token: "was / were", tone: "emerald" },
          { label: "PARTICIPIO PASADO", token: "launched · approved · completed", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Resultado singular: was",
            segments: [
              { label: "OBJETO SINGULAR", token: "The contract / The project", tone: "violet" },
              { label: "FUE", token: "was + participio", tone: "emerald" },
              { label: "SEÑAL", token: "was signed · was approved", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando reportas un resultado ya cerrado con un sujeto singular (the contract, the project), usa 'was' más participio. La señal es el hecho concluido, no la persona. Contraste: en presente dirías 'is signed'; aquí ya terminó.",
            exampleEnglish: "The contract was signed last week.",
          },
          {
            label: "02 · Resultado plural: were",
            segments: [
              { label: "OBJETO PLURAL", token: "The proposals / These guidelines", tone: "violet" },
              { label: "FUERON", token: "were + participio", tone: "emerald" },
              { label: "SEÑAL", token: "were approved · were delivered", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el sujeto es plural (the proposals, these guidelines), el pasado pasivo usa 'were', nunca 'was'. El participio tampoco cambia. Contraste: un solo documento lleva 'was'; varios llevan 'were'.",
            exampleEnglish: "The proposals were approved on Monday.",
          },
        ],
        commonMistake: {
          wrong: "The decision made yesterday.",
          wrongToken: "made",
          correct: "The decision was made yesterday.",
          correctToken: "was made",
          whySpanish: "Nunca olvides 'was': la decisión 'fue tomada' ('was made').",
        },
        examples: [
          {
            english: "The project was completed ahead of schedule.",
            spanish: "El proyecto fue completado antes de lo previsto.",
            pronunciationHint: "de próyekt uás komplítid ajéd of skédyul",
          },
          {
            english: "These guidelines were established last year.",
            spanish: "Estas directrices fueron establecidas el año pasado.",
            pronunciationHint: "dís gáidláins uér estáblisht last yíar",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El acuerdo fue firmado ayer",
          targetTokens: ["The", "agreement", "was", "signed", "yesterday"],
          distractorTokens: ["were", "sign"],
          successTipSpanish: "¡Directo a Wall Street! 'The agreement was signed' es conciso e indiscutible.",
          mistakeHintSpanish: "Para el acuerdo en singular, usa 'was signed yesterday'.",
        },
        voicePractice: {
          sentenceEnglish: "The plan was approved yesterday.",
          spanishMeaning: "El plan fue aprobado ayer.",
          pronunciationHint: "de plan uás aprúvd yésterdei",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe reportes de progreso destacando los entregables con 'The feature was deployed'.",
        },
      },
    },

    // BASE 14: EL AGENTE CON 'BY' (Cuándo usarlo y cuándo omitirlo)
    {
      title: "El Agente con 'By': ¿Quién Hizo la Acción?",
      focus: "Añadir el autor de la acción solo cuando añade valor real al mensaje",
      payload: {
        ruleTaglineSpanish:
          "En voz pasiva omitimos el autor el 80% de las veces. Solo lo mencionamos usando 'by' si es información realmente valiosa o sorprendente: The book was written by Orwell, The design was created by our team.",
        formulaSegments: [
          { label: "ACCIÓN PASIVA", token: "The solution was developed", tone: "violet" },
          { label: "POR (AGENTE)", token: "by", tone: "emerald" },
          { label: "AUTOR RELEVANTE", token: "our local team / experts", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Agente relevante: by",
            segments: [
              { label: "ACCIÓN PASIVA", token: "was designed / was written", tone: "violet" },
              { label: "AGENTE", token: "by + autor concreto", tone: "emerald" },
              { label: "SEÑAL", token: "firma · experto · equipo", tone: "sky" },
            ],
            explanationSpanish:
              "Menciona el agente con 'by' solo cuando aporta valor: una firma, un experto, un equipo concreto. Si el lector ya sabe quién fue, 'by' sobra. Contraste: 'The email was sent' funciona sin agente; 'was sent by somebody' no informa nada.",
            exampleEnglish: "The survey was designed by an expert.",
          },
          {
            label: "02 · Agente omitido: sin by",
            segments: [
              { label: "ACCIÓN PASIVA", token: "was sent / was restored", tone: "violet" },
              { label: "SIN AGENTE", token: "sin 'by' al final", tone: "emerald" },
            ],
            explanationSpanish:
              "Omite el agente cuando es obvio, desconocido o irrelevante (somebody, people, the system). La frase queda más corta y más profesional. Contraste: añadir 'by somebody' solo alarga y resta credibilidad al mensaje.",
            exampleEnglish: "The package was delivered this morning.",
          },
        ],
        commonMistake: {
          wrong: "The email was sent by somebody.",
          wrongToken: "by somebody",
          correct: "The email was sent this morning.",
          correctToken: "was sent",
          whySpanish: "Si el autor es obvio o desconocido ('alguien'), omítelo por completo.",
        },
        examples: [
          {
            english: "The strategy was proposed by the executive committee.",
            spanish: "La estrategia fue propuesta por el comité ejecutivo.",
            pronunciationHint: "de strátedyi uás propóusd bai di egsékyutiv komíti",
          },
          {
            english: "This model was designed by certified specialists.",
            spanish: "Este modelo fue diseñado por especialistas certificados.",
            pronunciationHint: "dis módel uás disáind bai sértifaid speshialists",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El plan fue diseñado por nuestro equipo",
          targetTokens: ["The", "plan", "was", "designed", "by", "our", "team"],
          distractorTokens: ["for"],
          successTipSpanish: "¡Estructura impecable! Usaste 'by' para atribuir el logro a tu equipo.",
          mistakeHintSpanish: "Para indicar el autor de la acción en voz pasiva, usa 'by our team'.",
        },
        voicePractice: {
          sentenceEnglish: "This was designed by our team.",
          spanishMeaning: "Esto fue diseñado por nuestro equipo.",
          pronunciationHint: "dis uás disáind bai áuar tím",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Atribuye proyectos exitosos diciendo 'This initiative was led by my department'.",
        },
      },
    },

    // BASE 15: VOZ PASIVA CON MODALES (Can be done, Should be reviewed)
    {
      title: "Voz Pasiva con Modales: Can be done y Should be reviewed",
      focus: "Formular requerimientos y posibilidades diplomáticas con Modales + Be + Participio",
      payload: {
        ruleTaglineSpanish:
          "Para sonar ultra educado y profesional en peticiones complejas, combina el modal con 'be' y el participio: It can be done (se puede hacer), It should be reviewed (debería revisarse), It must be finished (debe terminarse).",
        formulaSegments: [
          { label: "MODAL", token: "can / should / must", tone: "violet" },
          { label: "SER (INVARIABLE)", token: "be", tone: "emerald" },
          { label: "PARTICIPIO", token: "completed · delivered · reviewed", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Posibilidad: can be",
            segments: [
              { label: "POSIBILIDAD", token: "can", tone: "violet" },
              { label: "BE INVARIABLE", token: "be", tone: "emerald" },
              { label: "PARTICIPIO", token: "shared · accessed · done", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'can be' cuando algo es posible o está disponible sin decir quién lo hará. La señal es la pregunta '¿se puede?'. Contraste: 'can do' nombra al ejecutor; 'can be done' pone el foco en el resultado.",
            exampleEnglish: "The report can be shared online.",
          },
          {
            label: "02 · Recomendación: should be",
            segments: [
              { label: "RECOMENDACIÓN", token: "should", tone: "violet" },
              { label: "BE INVARIABLE", token: "be", tone: "emerald" },
              { label: "PARTICIPIO", token: "reviewed · adjusted", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'should be' para recomendar o pedir un cambio sin culpar a nadie. Suena diplomático en correos y reuniones. Contraste: 'you should review' señala a una persona; 'it should be reviewed' habla del proceso.",
            exampleEnglish: "The settings should be adjusted today.",
          },
          {
            label: "03 · Obligación: must be",
            segments: [
              { label: "OBLIGACIÓN", token: "must", tone: "violet" },
              { label: "BE INVARIABLE", token: "be", tone: "emerald" },
              { label: "PARTICIPIO", token: "finished · signed", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'must be' cuando el requisito es obligatorio y no admite demora: una norma, una fecha límite. Es más fuerte que 'should be'. Contraste: 'should be' recomienda; 'must be' exige cumplimiento.",
            exampleEnglish: "The form must be signed by hand.",
          },
        ],
        commonMistake: {
          wrong: "This should be review by tomorrow.",
          wrongToken: "be review",
          correct: "This should be reviewed by tomorrow.",
          correctToken: "be reviewed",
          whySpanish: "Después de 'be' en voz pasiva modal, el verbo debe ser participio ('reviewed').",
        },
        examples: [
          {
            english: "This file can be accessed from any device.",
            spanish: "Se puede acceder a este archivo desde cualquier dispositivo.",
            pronunciationHint: "dis fáil kan bi áksest from éni diváis",
          },
          {
            english: "The contract must be reviewed before Friday.",
            spanish: "El contrato debe ser revisado antes del viernes.",
            pronunciationHint: "de kóntrakt mast bi riviúd bifór fráidei",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esto se puede hacer hoy",
          targetTokens: ["This", "can", "be", "done", "today"],
          distractorTokens: ["do", "did"],
          successTipSpanish: "¡Frase reina del entorno laboral! 'Can be done' transmite total seguridad.",
          mistakeHintSpanish: "Usa 'This can be' seguido del participio irregular 'done today'.",
        },
        voicePractice: {
          sentenceEnglish: "This can be done very quickly.",
          spanishMeaning: "Esto se puede hacer muy rápidamente.",
          pronunciationHint: "dis kan bi dan véri kuíkli",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe recomendaciones sin culpar a nadie: 'The settings should be adjusted'.",
        },
      },
    },

    // BASE 16: ESTILO CORPORATIVO IMPECABLE (Activa -> Pasiva)
    {
      title: "Estilo Corporativo Impecable: De Voz Activa a Pasiva",
      focus: "Transformar textos informales en comunicaciones ejecutivas de nivel internacional",
      payload: {
        ruleTaglineSpanish:
          "En vez de escribir en un correo 'We made a mistake' o 'Somebody broke the link', un profesional escribe 'A mistake was identified' o 'The link was restored'. La voz pasiva genera diplomacia y objetividad.",
        formulaSegments: [
          { label: "ENFOQUE INFORMAL (ACTIVA)", token: "We found an error", tone: "violet" },
          { label: "TRANSFORMACIÓN (PASIVA)", token: "An error was detected", tone: "emerald" },
          { label: "RESOLUCIÓN", token: "and the issue was resolved", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Diplomacia: sin culpables",
            segments: [
              { label: "ACTIVA INFORMAL", token: "We made a mistake", tone: "violet" },
              { label: "PASIVA OBJETIVA", token: "A mistake was made", tone: "emerald" },
              { label: "SEÑAL", token: "error · retraso · cambio", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando informas un error sin acusar a nadie, pasa la activa a pasiva: 'we made a mistake' se vuelve 'a mistake was made'. La señal es que no conviene nombrar al responsable. Contraste: la activa suena a culpa directa.",
            exampleEnglish: "A mistake was found in the report.",
          },
          {
            label: "02 · Aviso plural: were",
            segments: [
              { label: "SUJETO PLURAL", token: "All participants / The results", tone: "violet" },
              { label: "PASIVA", token: "were + participio", tone: "emerald" },
              { label: "SEÑAL", token: "plural exige 'were'", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el sujeto plural recibe la acción, el pasado pasivo lleva 'were', nunca 'was'. Es la forma que da tono ejecutivo a un aviso. Contraste: con 'we' también va 'were'; solo el singular toma 'was'.",
            exampleEnglish: "The results were shared with the board.",
          },
        ],
        commonMistake: {
          wrong: "We was informed about the change.",
          wrongToken: "We was",
          correct: "We were informed about the change.",
          correctToken: "We were",
          whySpanish: "Con 'We' el pasado del verbo To Be es 'were', nunca 'was'.",
        },
        examples: [
          {
            english: "All participants were informed well in advance.",
            spanish: "Todos los participantes fueron informados con bastante antelación.",
            pronunciationHint: "ol partísipants uér infórmd uél in adváns",
          },
          {
            english: "The adjustments were implemented successfully.",
            spanish: "Los ajustes fueron implementados con éxito.",
            pronunciationHint: "di adyástments uér ímplementid saksésfuli",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Los cambios fueron implementados con éxito",
          targetTokens: ["The", "changes", "were", "implemented", "successfully"],
          distractorTokens: ["was"],
          successTipSpanish: "¡Nivel C-Suite! 'The changes were implemented' denota absoluta maestría.",
          mistakeHintSpanish: "Como hablamos de 'changes' (plural), usa 'were implemented'.",
        },
        voicePractice: {
          sentenceEnglish: "The changes were implemented on time.",
          spanishMeaning: "Los cambios fueron implementados a tiempo.",
          pronunciationHint: "de chéinyis uér ímplementid on táim",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Eleva tus minutas y resúmenes ejecutivos usando construcciones pasivas limpias.",
        },
      },
    },
  ];
}

