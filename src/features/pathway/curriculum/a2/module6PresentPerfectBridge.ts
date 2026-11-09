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
        formulaCases: [
          {
            label: "01 · Contar lo que sí has hecho",
            segments: [
              { label: "AUXILIAR", token: "I have · She has · We have", tone: "violet" },
              { label: "PARTICIPIO", token: "worked · visited · managed", tone: "emerald" },
              { label: "SIN FECHA", token: "in my life / so far", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando cuentas algo hecho en algún momento de tu vida y la fecha no importa, usas 'have/has + participio'. La señal es que no hay hora cerrada; en cambio, con 'yesterday' o 'in 2023' iría pasado simple.",
            exampleEnglish: "We have managed three global projects.",
          },
          {
            label: "02 · Decir lo que no ha pasado",
            segments: [
              { label: "AUXILIAR NEGADO", token: "haven't · hasn't", tone: "violet" },
              { label: "PARTICIPIO", token: "called · finished · answered", tone: "emerald" },
            ],
            explanationSpanish:
              "Para decir que algo no ha ocurrido todavía, niegas solo el auxiliar: 'haven't' o 'hasn't' más el participio. El verbo no cambia; el error típico es negar el verbo y decir 'I have not went'.",
            exampleEnglish: "She has not called the client back.",
          },
          {
            label: "03 · Preguntar por la experiencia",
            segments: [
              { label: "AUXILIAR INVERTIDO", token: "Have you · Has she", tone: "violet" },
              { label: "PARTICIPIO", token: "finished · seen · tried", tone: "emerald" },
            ],
            explanationSpanish:
              "Para preguntar si alguien ha tenido esa experiencia, el auxiliar pasa delante del sujeto: 'Have you + participio?'. No abras con 'Did': 'Did you finished it?' mezcla dos tiempos y suena mal.",
            exampleEnglish: "Have you finished the monthly report?",
          },
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
        formulaCases: [
          {
            label: "01 · Preguntar 'Have you ever...?'",
            segments: [
              { label: "AUXILIAR INVERTIDO", token: "Have you ever", tone: "violet" },
              { label: "PARTICIPIO", token: "led · been · tried", tone: "emerald" },
            ],
            explanationSpanish:
              "Para preguntar por cualquier experiencia de vida, la fórmula es fija: 'Have you ever + participio?'. 'ever' va entre el sujeto y el verbo; si preguntas con 'Did', ya estás hablando de una fecha concreta, no de la vida entera.",
            exampleEnglish: "Have you ever led a team abroad?",
          },
          {
            label: "02 · Responder 'I have never...'",
            segments: [
              { label: "AUXILIAR + NEVER", token: "I have never · She has never", tone: "violet" },
              { label: "PARTICIPIO", token: "negotiated · worked · travelled", tone: "emerald" },
            ],
            explanationSpanish:
              "'never' se coloca entre el auxiliar y el participio y significa que la experiencia es cero hasta hoy. No va al inicio ni después del verbo: 'I have never negotiated' sí, 'I never have negotiated' no.",
            exampleEnglish: "I have never negotiated a contract.",
          },
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
        formulaCases: [
          {
            label: "01 · Algo que acaba de pasar ('just')",
            segments: [
              { label: "AUXILIAR + JUST", token: "I have just · She has just", tone: "violet" },
              { label: "PARTICIPIO", token: "arrived · sent · finished", tone: "emerald" },
            ],
            explanationSpanish:
              "Usas 'just' cuando la acción terminó hace segundos o minutos. Va entre el auxiliar y el participio: 'I have just arrived'. Con solo 'I arrived' cortas el lazo con el ahora y suena a otro dato del pasado.",
            exampleEnglish: "He has just left the office.",
          },
          {
            label: "02 · Algo hecho antes de lo esperado ('already')",
            segments: [
              { label: "AUXILIAR + ALREADY", token: "I have already · We have already", tone: "violet" },
              { label: "PARTICIPIO", token: "sent · updated · booked", tone: "emerald" },
            ],
            explanationSpanish:
              "'already' indica que algo se completó antes del momento previsto y sorprende un poco. También va entre el auxiliar y el participio. En preguntas y negaciones, en cambio, lo normal es oír 'yet', no 'already'.",
            exampleEnglish: "We have already sent the proposal.",
          },
          {
            label: "03 · Algo pendiente ('yet')",
            segments: [
              { label: "NEGACIÓN", token: "haven't · hasn't", tone: "violet" },
              { label: "YET AL FINAL", token: "... approved it yet", tone: "sky" },
            ],
            explanationSpanish:
              "'yet' va al final de la frase y trabaja con negativos y preguntas: 'Haven't you finished yet?'. Señala que algo sigue pendiente; si ya ocurrió, corresponde 'already' y usar 'yet' sería el error de esta base.",
            exampleEnglish: "They haven't approved the budget yet.",
          },
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
        formulaCases: [
          {
            label: "01 · Fecha cerrada → Past Simple",
            segments: [
              { label: "MARCADOR CERRADO", token: "yesterday · in 2023 · two hours ago", tone: "violet" },
              { label: "FORMA", token: "verbo en pasado (signed · saw)", tone: "emerald" },
            ],
            explanationSpanish:
              "Si la frase trae un momento cerrado como 'yesterday', 'last Monday' o 'in 2023', el verbo va en pasado simple: 'we signed'. El marcador decide la forma; si agregas 'have signed', la frase se rompe.",
            exampleEnglish: "We signed the contract last Monday.",
          },
          {
            label: "02 · Experiencia abierta → Present Perfect",
            segments: [
              { label: "SIN FECHA", token: "twice / ever / so far", tone: "violet" },
              { label: "FORMA", token: "have/has + participio", tone: "emerald" },
              { label: "PERIODO ABIERTO", token: "hasta hoy", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando no das fecha sino cuántas veces o hasta hoy, usas 'have/has + participio': 'I have met her twice'. La señal es un periodo que sigue abierto; en cambio, con 'in 2022' iría pasado simple.",
            exampleEnglish: "I have met the new manager twice.",
          },
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
        formulaCases: [
          {
            label: "01 · Obstáculo y resultado ('although')",
            segments: [
              { label: "AUNQUE + OBSTÁCULO", token: "Although the budget was small", tone: "violet" },
              { label: "RESULTADO", token: "we delivered", tone: "emerald" },
            ],
            explanationSpanish:
              "'although' abre la frase con el obstáculo y la otra mitad trae el resultado: 'Although it rained, we went'. Une las dos ideas en una sola oración, así que no lleva 'but' después; 'Although... but' es el error clásico.",
            exampleEnglish: "Although the budget was small, we delivered.",
          },
          {
            label: "02 · Dos oraciones en contraste ('however')",
            segments: [
              { label: "ORACIÓN 1", token: "The plan was risky.", tone: "violet" },
              { label: "HOWEVER, + CONTRASTE", token: "However, we approved it", tone: "sky" },
            ],
            explanationSpanish:
              "'however' une dos oraciones completas y va al inicio de la segunda, seguido de coma: 'It was late. However, we continued'. A diferencia de 'although', necesita punto antes y no puede ir dentro de la misma frase.",
            exampleEnglish: "The plan was risky. However, we approved it.",
          },
          {
            label: "03 · Explicar el propósito ('so that')",
            segments: [
              { label: "ACCIÓN", token: "I take notes", tone: "violet" },
              { label: "SO THAT + PROPÓSITO", token: "so that I remember names", tone: "emerald" },
            ],
            explanationSpanish:
              "'so that' explica para qué haces algo y va seguido de sujeto y verbo: 'I practice so that I improve'. La señal es que responde 'para qué'. No lo confundas con 'because', que responde 'por qué' y da la causa.",
            exampleEnglish: "I take notes so that I remember names.",
          },
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
        formulaCases: [
          {
            label: "01 · Medir la duración ('for')",
            segments: [
              { label: "FOR + DURACIÓN", token: "for six months · for two years", tone: "violet" },
              { label: "PERIODO CONTABLE", token: "la cantidad de tiempo", tone: "emerald" },
            ],
            explanationSpanish:
              "Con 'for' mides cuánto tiempo lleva algo: 'for three years', 'for six months'. Es una cantidad que puedes contar en el calendario. En cambio 'since' señala el punto de arranque y nunca una cantidad.",
            exampleEnglish: "We have used this tool for six months.",
          },
          {
            label: "02 · Marcar el inicio ('since')",
            segments: [
              { label: "SINCE + INICIO", token: "since 2023 · since Monday", tone: "violet" },
              { label: "HECHO DE ARRANQUE", token: "since I moved here", tone: "sky" },
            ],
            explanationSpanish:
              "Con 'since' marcas el momento exacto en que empezó algo: una fecha, un día o un hecho como 'since I moved'. Solo acepta puntos de inicio; si lo que dices es la duración, la palabra correcta es 'for'.",
            exampleEnglish: "She has worked here since January.",
          },
          {
            label: "03 · Hablar de un hábito que ya no tienes ('used to')",
            segments: [
              { label: "USED TO + VERBO BASE", token: "I used to travel", tone: "violet" },
              { label: "HÁBITO QUE YA NO", token: "every day, antes", tone: "emerald" },
            ],
            explanationSpanish:
              "'used to + verbo base' describe un hábito o estado del pasado que ya no es cierto: 'I used to wake up late'. No lleva fecha obligatoria porque el 'ya no' está incluido. No sirve para una acción suelta de una sola vez.",
            exampleEnglish: "I used to travel by bus every day.",
          },
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

