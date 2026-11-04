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
        commonMistake: {
          wrong: "The data update every morning (activo sin sujeto).",
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
        commonMistake: {
          wrong: "The email was sent by somebody (relleno innecesario).",
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

