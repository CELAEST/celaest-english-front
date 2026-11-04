import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6PresentPerfectBridge(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: EXPERIENCIAS DE VIDA (Present Perfect)
    {
      title: "Experiencias de Vida: Present Perfect (Have / Has + Participio)",
      focus: "Conectar vivencias pasadas con el presente cuando no importa la fecha exacta",
      payload: {
        ruleTaglineSpanish:
          "Usa 'have' (o 'has' con He/She) más el participio (worked, seen, visited) para hablar de lo que has hecho a lo largo de tu vida sin amarrarlo a una fecha específica.",
        formulaSegments: [
          { label: "HABER", token: "I have ('ve) · She has ('s) · We have", tone: "violet" },
          { label: "PARTICIPIO", token: "worked · visited · seen · completed", tone: "emerald" },
          { label: "EXPERIENCIA", token: "many projects / that movie", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I have visit that city before.",
          wrongToken: "have visit",
          correct: "I have visited that city before.",
          correctToken: "have visited",
          whySpanish: "Después de 'have' el verbo debe ir en participio pasado ('visited', 'seen').",
        },
        examples: [
          {
            english: "I have worked with international teams.",
            spanish: "He trabajado con equipos internacionales.",
            pronunciationHint: "ai jav uórkt uiz internáshonal tíms",
          },
          {
            english: "She has completed the training.",
            spanish: "Ella ha completado la capacitación.",
            pronunciationHint: "shi jas komplítid de tréining",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: He completado la tarea hoy",
          targetTokens: ["I", "have", "completed", "the", "task", "today"],
          distractorTokens: ["complete"],
          successTipSpanish: "¡Bienvenido a Present Perfect! 'Have completed' une tu pasado con hoy.",
          mistakeHintSpanish: "Usa 'have' seguido del participio 'completed'.",
        },
        voicePractice: {
          sentenceEnglish: "I have completed the first phase.",
          spanishMeaning: "He completado la primera fase.",
          pronunciationHint: "ai jav komplítid de férst féis",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Resume tu trayectoria en entrevistas diciendo 'I have managed diverse challenges'.",
        },
      },
    },

    // BASE 28: HUELLAS EN EL TIEMPO (Ever vs Never)
    {
      title: "Huellas en el Tiempo: Ever vs Never",
      focus: "Preguntar vivencias abiertas con 'Have you ever...?' y responder con 'I have never...'",
      payload: {
        ruleTaglineSpanish:
          "Para preguntar '¿Alguna vez has hecho X?' la fórmula fija mundial es 'Have you ever + participio?'. Para responder que nunca lo has hecho di 'I have never + participio'.",
        formulaSegments: [
          { label: "¿ALGUNA VEZ HAS...?", token: "Have you ever + participio?", tone: "violet" },
          { label: "NUNCA HE...", token: "I have never + participio", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Did you ever been to London?",
          wrongToken: "Did you ever been",
          correct: "Have you ever been to London?",
          correctToken: "Have you ever been",
          whySpanish: "Las preguntas de experiencia de vida se abren con 'Have you ever', no con 'Did'.",
        },
        examples: [
          {
            english: "Have you ever worked abroad?",
            spanish: "¿Alguna vez has trabajado en el extranjero?",
            pronunciationHint: "jav yu éver uórkt abród?",
          },
          {
            english: "I have never seen such great teamwork.",
            spanish: "Nunca he visto tan buen trabajo en equipo.",
            pronunciationHint: "ai jav néver sin sach gréit tím-uork",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Alguna vez has trabajado con clientes?",
          targetTokens: ["Have", "you", "ever", "worked", "with", "clients?"],
          distractorTokens: ["Did", "work"],
          successTipSpanish: "¡Estructura de oro de entrevistas! 'Have you ever worked' es insuperable.",
          mistakeHintSpanish: "Abre con 'Have you ever', pon el participio 'worked' y termina la pregunta.",
        },
        voicePractice: {
          sentenceEnglish: "Have you ever been to that city?",
          spanishMeaning: "¿Alguna vez has estado en esa ciudad?",
          pronunciationHint: "jav yu éver bin tu dat síti?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "La pregunta más clásica de selección laboral: 'Have you ever led a team?'.",
        },
      },
    },

    // BASE 29: SEÑALES RECIENTES (Already, Yet, Just)
    {
      title: "Señales Recientes: Already, Yet y Just",
      focus: "Ubicar acciones recién concluidas (just), adelantadas (already) o pendientes (yet)",
      payload: {
        ruleTaglineSpanish:
          "Tres llaves maestras con Present Perfect: 'just' para lo que acabas de hacer (I have just finished), 'already' para lo que ya hiciste antes de lo previsto, y 'yet' al puro final para lo que aún no has hecho.",
        formulaSegments: [
          { label: "ACABO DE", token: "I have just arrived / finished", tone: "violet" },
          { label: "YA LO HICE", token: "I have already sent it", tone: "emerald" },
          { label: "AÚN NO (AL FINAL)", token: "I haven't called yet", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I haven't called already.",
          wrongToken: "already",
          correct: "I haven't called yet.",
          correctToken: "yet",
          whySpanish: "En negaciones y preguntas sobre lo pendiente se usa 'yet' al final, nunca 'already'.",
        },
        examples: [
          {
            english: "I have just sent the final file.",
            spanish: "Acabo de enviar el archivo final.",
            pronunciationHint: "ai jav jast sent de fáinal fáil",
          },
          {
            english: "We haven't received the response yet.",
            spanish: "Aún no hemos recibido la respuesta.",
            pronunciationHint: "ui jávent risívd de rispóns yet",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Acabo de enviar el correo",
          targetTokens: ["I", "have", "just", "sent", "the", "email"],
          distractorTokens: ["yet", "send"],
          successTipSpanish: "¡Perfecto! 'Have just sent' es la forma exacta de decir 'acabo de enviar'.",
          mistakeHintSpanish: "Usa 'I have just' y el participio 'sent the email'.",
        },
        voicePractice: {
          sentenceEnglish: "I have just finished my work.",
          spanishMeaning: "Acabo de terminar mi trabajo.",
          pronunciationHint: "ai jav jast fínisht mai uórk",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Envía actualizaciones inmediatas diciendo 'I have already updated the team'.",
        },
      },
    },

    // BASE 30: EL GRAN CONTRASTE (Present Perfect vs Past Simple)
    {
      title: "El Gran Contraste: Present Perfect vs Past Simple",
      focus: "La regla de oro: si mencionas fecha o momento exacto, usa Past Simple obligatorio",
      payload: {
        ruleTaglineSpanish:
          "La diferencia que separa el inglés infantil del inglés maduro: si dices CUÁNDO (yesterday, in 2021, two hours ago), USA PAST SIMPLE obligatorio (I went yesterday). Si solo cuentas tu experiencia abierta sin fecha, USA PRESENT PERFECT (I have been there).",
        formulaSegments: [
          { label: "FECHA CERRADA (PAST SIMPLE)", token: "I visited London in 2023 / yesterday", tone: "violet" },
          { label: "EXPERIENCIA ABIERTA (PRESENT PERFECT)", token: "I have visited London three times", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I have seen him yesterday.",
          wrongToken: "have seen him yesterday",
          correct: "I saw him yesterday.",
          correctToken: "saw him yesterday",
          whySpanish: "Si la frase tiene una fecha o tiempo cerrado como 'yesterday', está prohibido usar 'have seen': usa 'saw'.",
        },
        examples: [
          {
            english: "I have lived in many cities, but last year I moved here.",
            spanish: "He vivido en muchas ciudades, pero el año pasado me mudé aquí.",
            pronunciationHint: "ai jav livd in méni sítis, bat last yíar ai muvd jíar",
          },
          {
            english: "Have you seen the news? Yes, I saw it this morning.",
            spanish: "¿Has visto las noticias? Sí, las vi esta mañana.",
            pronunciationHint: "jav yu sin de niús? yes, ai so it dis mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Vi el reporte ayer",
          targetTokens: ["I", "saw", "the", "report", "yesterday"],
          distractorTokens: ["have seen"],
          successTipSpanish: "¡Regla de oro dominada! Con 'yesterday' elegiste 'saw' en Past Simple.",
          mistakeHintSpanish: "Como la acción ocurrió 'yesterday', usa 'saw', no 'have seen'.",
        },
        voicePractice: {
          sentenceEnglish: "I saw that report yesterday.",
          spanishMeaning: "Vi ese reporte ayer.",
          pronunciationHint: "ai so dat ripórt yésterdei",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Abre con Present Perfect para el logro ('I have built X') y detalla con Past Simple ('In 2024, I did Y').",
        },
      },
    },

    // BASE 31: CONECTORES DE ARGUMENTACIÓN (Although, However, So that)
    {
      title: "Conectores de Argumentación: Although, However y So That",
      focus: "Elevar la sofisticación de tus frases con contraste y propósito formal",
      payload: {
        ruleTaglineSpanish:
          "Para dejar de sonar como principiante, usa conectores de nivel intermedio: 'although' (aunque) al inicio o medio de una frase, 'however' (sin embargo) para contrastar entre dos oraciones, y 'so that' (para que / de modo que).",
        formulaSegments: [
          { label: "AUNQUE", token: "Although it was difficult, we finished", tone: "violet" },
          { label: "SIN EMBARGO", token: "It was late. However, we continued", tone: "emerald" },
          { label: "DE MODO QUE", token: "I practice daily so that I can grow", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Although it was raining, but we went out.",
          wrongToken: "Although... but",
          correct: "Although it was raining, we went out.",
          correctToken: "Although",
          whySpanish: "Si ya usas 'Although' al inicio, no pongas 'but' en la segunda parte.",
        },
        examples: [
          {
            english: "Although the schedule was tight, we delivered quality.",
            spanish: "Aunque el cronograma era apretado, entregamos calidad.",
            pronunciationHint: "oldóu de skédyul uás táit, ui delíverd kuáliti",
          },
          {
            english: "I practice every day so that I can speak fluently.",
            spanish: "Practico todos los días de modo que pueda hablar con fluidez.",
            pronunciationHint: "ai práktis évri déi so dat ai kan spik flúentli",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Aunque fue difícil, terminamos a tiempo",
          targetTokens: ["Although", "it", "was", "difficult,", "we", "finished", "on", "time"],
          distractorTokens: ["but"],
          successTipSpanish: "¡Estructura de alto nivel! Argumentaste con 'Although' como un profesional.",
          mistakeHintSpanish: "Abre con 'Although it was difficult,' y sigue con 'we finished on time'.",
        },
        voicePractice: {
          sentenceEnglish: "Although it was hard, we succeeded.",
          spanishMeaning: "Aunque fue difícil, tuvimos éxito.",
          pronunciationHint: "oldóu it uás jard, ui saksídid",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos y propuestas convincentes usando 'Although' y 'However'.",
        },
      },
    },

    // BASE 32: EL SALTO CUÁNTICO A B1: FOR, SINCE Y 'USED TO'
    {
      title: "El Salto Cuántico a B1: For, Since y 'Used to'",
      focus: "Duración en el tiempo (for / since) y hábitos extintos con 'used to'",
      payload: {
        ruleTaglineSpanish:
          "¡Tu graduación hacia B1! Usa 'for' para duraciones acumuladas (for three years) y 'since' para el punto de partida (since 2022). Y para hábitos pasados que ya dejaste atrás, usa 'used to + verbo base': I used to live in another city.",
        formulaSegments: [
          { label: "DURACIÓN", token: "I have worked here for two years", tone: "violet" },
          { label: "INICIO", token: "I have lived here since 2023", tone: "emerald" },
          { label: "HÁBITO EXTINTO", token: "I used to wake up late (ya no)", tone: "sky" },
        ],
        commonMistake: {
          wrong: "I have worked here since three years.",
          wrongToken: "since three years",
          correct: "I have worked here for three years.",
          correctToken: "for three years",
          whySpanish: "Para lapsos o periodos de tiempo se usa 'for', no 'since'. 'Since' es solo para fechas de inicio.",
        },
        examples: [
          {
            english: "I have lived in this country for five years.",
            spanish: "He vivido en este país durante cinco años.",
            pronunciationHint: "ai jav livd in dis kántri for fáiv yíars",
          },
          {
            english: "I used to commute two hours every day.",
            spanish: "Solía viajar dos horas todos los días.",
            pronunciationHint: "ai yúst tu komyút tu áuars évri déi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: He trabajado aquí durante dos años",
          targetTokens: ["I", "have", "worked", "here", "for", "two", "years"],
          distractorTokens: ["since"],
          successTipSpanish: "¡Felicidades! Conquistaste las 32 bases de A2 y cruzas formalmente el umbral a B1.",
          mistakeHintSpanish: "Para indicar la duración de dos años, usa 'for', no 'since'.",
        },
        voicePractice: {
          sentenceEnglish: "I have worked here for two years.",
          spanishMeaning: "He trabajado aquí durante dos años.",
          pronunciationHint: "ai jav uórkt jíar for tu yíars",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "¡Nivel A2 completado al 100%! Habla de tu evolución usando 'used to' y entra a B1 con total maestría.",
        },
      },
    },
  ];
}

