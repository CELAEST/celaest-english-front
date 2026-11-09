import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1BaroqueSyntax(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: CLÁUSULAS ABSOLUTAS NOMINATIVAS
    {
      title: "Cláusulas Absolutas Nominativas: The deliberations concluded...",
      focus: "Comprimir acontecimientos eliminando conjunciones temporales con sustantivo y participio independientes",
      payload: {
        ruleTaglineSpanish:
          "En lugar de decir 'When the deliberations were concluded...', la prosa de élite utiliza la cláusula absoluta nominativa: 'The deliberations concluded, the delegates departed the chamber in silence'. Un sustantivo independiente seguido de su participio que flota con solemnidad clásica.",
        formulaSegments: [
          { label: "SUSTANTIVO INDEPENDIENTE + PARTICIPIO", token: "The deliberations concluded,", tone: "violet" },
          { label: "SUJETO PRINCIPAL", token: "the delegates", tone: "emerald" },
          { label: "ACCIÓN SOLEMNE", token: "departed the chamber in silence.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Hecho previo ya cerrado",
            segments: [
              { label: "SUSTANTIVO + PARTICIPIO", token: "The vote recorded,", tone: "violet" },
              { label: "ACTO QUE SIGUE", token: "the chair closed the session.", tone: "sky" },
            ],
            explanationSpanish:
              "Abre con la cláusula absoluta cuando el hecho previo ya está cerrado y querés que la frase arranque con él. Sin 'when' ni 'was': el sustantivo y su participio quedan suspendidos y el acto siguiente entra como consecuencia. Con 'When the vote was recorded' vuelve el relato básico.",
            exampleEnglish: "The vote recorded, the chair closed the session.",
          },
          {
            label: "02 · Anterioridad ya cumplida",
            segments: [
              { label: "HECHO PREVIO CONCLUIDO", token: "The last witness having been heard,", tone: "emerald" },
              { label: "DECISIÓN QUE RECAE", token: "the tribunal withdrew.", tone: "sky" },
            ],
            explanationSpanish:
              "Si el hecho previo es pasivo y necesitás marcar que terminó antes del acto principal, la cláusula lleva 'having been + participio'. 'The last witness heard,' sugeriría simultaneidad; 'having been heard' sella la anterioridad y deja el peso ceremonial en el cierre.",
            exampleEnglish: "The last witness having been heard, the tribunal withdrew.",
          },
          {
            label: "03 · Escena que acompaña",
            segments: [
              { label: "CIRCUNSTANCIA SIMULTÁNEA", token: "The lights dimming,", tone: "violet" },
              { label: "ACTO QUE NO SE DETIENE", token: "the audience fell silent.", tone: "sky" },
            ],
            explanationSpanish:
              "Para una circunstancia que acompaña al acto principal en el mismo instante, la cláusula toma participio presente. No causa nada: encuadra la escena. Cambiarla por 'Because the lights were dimming' inventaría una causa que la frase no afirma.",
            exampleEnglish: "The lights dimming, the audience fell silent.",
          },
        ],
        commonMistake: {
          wrong: "When the deliberations concluded, the delegates left.",
          wrongToken: "When the deliberations concluded",
          correct: "The deliberations concluded, the delegates departed.",
          correctToken: "The deliberations concluded",
          whySpanish: "La cláusula absoluta prescinde de 'when' o 'after', otorgando gravedad ceremonial a la narración.",
        },
        examples: [
          {
            english: "The deliberations concluded, the delegates departed the chamber in silence.",
            spanish: "Concluidas las deliberaciones, los delegados abandonaron el recinto en silencio.",
            pronunciationHint: "de delíberéishons konklúded, de délegáits dipárted de chéimber in sáilens",
          },
          {
            english: "All reservations having been addressed, the assembly ratified the historic accord.",
            spanish: "Habiéndose resuelto todas las reservas, la asamblea ratificó el histórico acuerdo.",
            pronunciationHint: "ol rézervéishons jáving bin adrést, di asémbli rátifaid de jistórik akórd",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Concluidas las deliberaciones, los delegados abandonaron el recinto en silencio",
          targetTokens: ["The", "deliberations", "concluded,", "the", "delegates", "departed", "the", "chamber", "in", "silence"],
          distractorTokens: ["When", "were", "concluding", "delegated"],
          successTipSpanish: "¡Cláusula absoluta soberana! 'The deliberations concluded,' sin 'when' ni verbos copulativos.",
          mistakeHintSpanish: "Abre directamente con el sustantivo y el participio: 'The deliberations concluded,...'.",
        },
        voicePractice: {
          sentenceEnglish: "The mandate fulfilled, the commission presented its final recommendations.",
          spanishMeaning: "Cumplido el mandato, la comisión presentó sus recomendaciones finales.",
          pronunciationHint: "de mándeit fulfíld, de komíshon prezénted its fáinal rékomendéishons",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza crónicas históricas y tratados solemnes redactados con cláusulas absolutas nominativas.",
        },
      },
    },

    // BASE 2: INVERSIÓN DE ECO ENFÁTICA CON DO
    {
      title: "Inversión de Eco Enfática: Prevail they did, against all odds",
      focus: "Retomar el verbo o adjetivo al inicio para enfatizar el triunfo de la realidad sobre la duda",
      payload: {
        ruleTaglineSpanish:
          "Para reafirmar con dramatismo heroico que un suceso incierto se convirtió en realidad tangible, adelanta la forma base o adjetivo seguido de sujeto y auxiliar: 'Prevail they did, against all conceivable odds'. Es el recurso predilecto de la narrativa histórica británica.",
        formulaSegments: [
          { label: "VERBO DE ECO INICIAL", token: "Prevail they did,", tone: "violet" },
          { label: "MARCO HEROICO", token: "against all", tone: "emerald" },
          { label: "CONTRAPESO", token: "conceivable odds.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Triunfo que nadie creía",
            segments: [
              { label: "VERBO DE ECO", token: "Survive it did,", tone: "violet" },
              { label: "PRUEBA QUE LO CONFIRMA", token: "against every prediction of collapse.", tone: "sky" },
            ],
            explanationSpanish:
              "Úsalo cuando el resultado contradice una duda ya expresada y querés confirmarlo con fuerza. El verbo en forma base va delante y 'did' cierra el eco: la frase responde a un 'no va a resistir' que quedó en el aire. 'It survived after all' informa; 'Survive it did' sentencia.",
            exampleEnglish: "Survive it did, against every prediction of collapse.",
          },
          {
            label: "02 · Cualidad puesta en duda",
            segments: [
              { label: "ADJETIVO AL FRENTE", token: "Formidable the task was,", tone: "violet" },
              { label: "RESOLUCIÓN QUE LO IGUALA", token: "and formidable the resolve.", tone: "sky" },
            ],
            explanationSpanish:
              "Si la duda recae sobre una cualidad y no sobre una acción, el eco adelanta el adjetivo y deja el verbo copulativo detrás del sujeto. 'The task was indeed formidable' describe; esta inversión iguala el obstáculo con la respuesta y cierra la objeción.",
            exampleEnglish: "Formidable the task was, and formidable the resolve.",
          },
        ],
        commonMistake: {
          wrong: "They really prevailed against all odds.",
          wrongToken: "They really prevailed",
          correct: "Prevail they did, against all conceivable odds.",
          correctToken: "Prevail they did",
          whySpanish: "La inversión de eco coloca el triunfo verbal en primer plano antes del auxiliar 'did'.",
        },
        examples: [
          {
            english: "Prevail they did, against all conceivable odds.",
            spanish: "Prevalecer, prevalecieron, contra todo pronóstico imaginable.",
            pronunciationHint: "privéil dei did, agéinst ol konsívabl ods",
          },
          {
            english: "Endure it did, through centuries of turbulent upheaval.",
            spanish: "Perdurar, perduró, a través de siglos de turbulenta agitación.",
            pronunciationHint: "endiúr it did, zru séntchuris ov térbiulent ap-jíval",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Prevalecer, prevalecieron, contra todo pronóstico imaginable",
          targetTokens: ["Prevail", "they", "did,", "against", "all", "conceivable", "odds"],
          distractorTokens: ["prevailed", "doing", "did", "really"],
          successTipSpanish: "¡Inversión de eco majestuosa! 'Prevail they did,' antepone el verbo con autoridad épica.",
          mistakeHintSpanish: "Inicia con el verbo en forma base: 'Prevail they did,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Succeed they did, demonstrating what disciplined unity can accomplish.",
          spanishMeaning: "Triunfar, triunfaron, demostrando lo que una unidad disciplinada puede lograr.",
          pronunciationHint: "saksíd dei did, démonstréiting uot dísaplind yúniti kan akómplish",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos conmemorativos y perfiles épicos con inversión de eco en Writing Studio.",
        },
      },
    },

    // BASE 3: CLÁUSULAS PARENTÉTICAS ESCINDIDAS CON IF NOT
    {
      title: "Cláusulas Parentéticas Escindidas: Decisive, if not outright transformative",
      focus: "Matizar e intensificar cualidades sin interrumpir el ritmo poético de la frase",
      payload: {
        ruleTaglineSpanish:
          "Para graduar un elogio o una advertencia con precisión milimétrica, introduce una cláusula parentética con 'if not': 'Their contribution was decisive, if not outright transformative'. Permite afirmar un estándar alto mientras se sugiere respetuosamente uno aún mayor.",
        formulaSegments: [
          { label: "CUALIDAD BASE", token: "Their contribution was decisive,", tone: "violet" },
          { label: "INTENSIFICADOR ESCINDIDO", token: "if not outright transformative,", tone: "emerald" },
          { label: "IMPACTO INSTITUCIONAL", token: "for the entire community.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Elogio que roza el máximo",
            segments: [
              { label: "CUALIDAD SÓLIDA", token: "The reform was substantial,", tone: "violet" },
              { label: "TECHO SUGERIDO", token: "if not historically decisive.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando querés elogiar sin gastar el superlativo, el 'if not' sube el techo a una categoría mayor sin afirmarla del todo. 'Substantial, if not historically decisive' deja la puerta abierta; decir 'and decisive' obligaría a sostenerlo. La señal es la coma antes del 'if'.",
            exampleEnglish: "The reform was substantial, if not historically decisive.",
          },
          {
            label: "02 · Pareja de logros",
            segments: [
              { label: "LOGRO MENOR", token: "a success,", tone: "violet" },
              { label: "LOGRO MAYOR NO AFIRMADO", token: "if not a triumph.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el contraste es entre dos logros y no entre dos cualidades, la escisión conserva el artículo en cada polo: 'a success, if not a triumph'. Sin el segundo artículo la frase se rompe; con él, el segundo logro queda sugerido como techo inalcanzable por ahora.",
            exampleEnglish: "The exhibition was a success, if not a triumph.",
          },
          {
            label: "03 · Mínimo asegurado",
            segments: [
              { label: "LECTURA POSIBLE", token: "if not decisive,", tone: "emerald" },
              { label: "PISO QUE IGUAL VALE", token: "at least instructive.", tone: "sky" },
            ],
            explanationSpanish:
              "Si no querés sugerir un techo sino garantizar un piso, el 'if not' cambia de dirección: 'if not decisive, at least instructive' concede el límite y rescata lo conseguido. Va al final, tras el verbo, y evita el tono de disculpa de un 'it was not decisive'.",
            exampleEnglish: "The summit was, if not decisive, at least instructive.",
          },
        ],
        commonMistake: {
          wrong: "Their contribution was decisive and maybe completely transformative.",
          wrongToken: "and maybe completely",
          correct: "Their contribution was decisive, if not outright transformative.",
          correctToken: "if not outright transformative",
          whySpanish: "La fórmula 'if not outright' condensa la alternativa máxima con elegancia aristocrática.",
        },
        examples: [
          {
            english: "Their contribution was decisive, if not outright transformative, for the institution.",
            spanish: "Su contribución fue decisiva, si no totalmente transformadora, para la institución.",
            pronunciationHint: "der kóntribiúshon uos desáisiv, if not áutrait transfórmativ, for di ínstitiúshon",
          },
          {
            english: "The proposal is ambitious, if not entirely unprecedented in modern governance.",
            spanish: "La propuesta es ambiciosa, si no enteramente sin precedentes en la gobernanza moderna.",
            pronunciationHint: "de propóusal is ambíshus, if not entáierli anprésidented in módern gáverns",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Su contribución fue decisiva, si no totalmente transformadora",
          targetTokens: ["Their", "contribution", "was", "decisive,", "if", "not", "outright", "transformative"],
          distractorTokens: ["maybe", "completely", "being", "transformed"],
          successTipSpanish: "¡Matiz aristocrático! 'if not outright transformative' gradúa el elogio con sobriedad.",
          mistakeHintSpanish: "Inserta 'if not outright transformative' tras la cualidad base.",
        },
        voicePractice: {
          sentenceEnglish: "The outcome was highly favorable, if not entirely miraculous under such constraints.",
          spanishMeaning: "El resultado fue sumamente favorable, si no enteramente milagroso bajo tales limitaciones.",
          pronunciationHint: "di áutkam uos jáili féivorabl, if not entáierli mirákiulus ánder sach konstréints",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Gradúa evaluaciones de proyectos y méritos de equipo con 'if not outright' en entrevistas de alto nivel.",
        },
      },
    },

    // BASE 4: HENDIDURAS INVERTIDAS DE OBJETO
    {
      title: "Hendiduras Invertidas de Objeto: That vision it was that guided us",
      focus: "Elevar la causa o cualidad antes de 'it was' para conferir solemnidad monumental",
      payload: {
        ruleTaglineSpanish:
          "Si una Cleft Sentence de B2 decía 'It was that vision that guided us', la inversión C2 eleva el objeto directamente al frente: 'That unyielding vision it was that guided our forebears'. Invierte la hendidura para convertir la cualidad en el monumento inicial de la frase.",
        formulaSegments: [
          { label: "OBJETO / CUALIDAD MONUMENTAL", token: "That unyielding perseverance it was", tone: "violet" },
          { label: "RELATIVO ENLACE", token: "that secured", tone: "emerald" },
          { label: "LOGRO HISTÓRICO", token: "the ultimate triumph.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Atribuir el logro a una causa",
            segments: [
              { label: "CAUSA MONUMENTAL", token: "That quiet resolve it was", tone: "violet" },
              { label: "QUE SOSTUVO EL PLAN", token: "that carried the plan.", tone: "sky" },
            ],
            explanationSpanish:
              "Elegís esta hendidura invertida cuando un logro colectivo necesita una causa nombrada y querés que esa causa abra la frase. La hendidura plana, 'It was that quiet resolve that...', informa; la inversión convierte la cualidad en monumento antes de nombrar el efecto.",
            exampleEnglish: "That quiet resolve it was that carried the plan.",
          },
          {
            label: "02 · Negar la causa que otros atribuyen",
            segments: [
              { label: "CAUSA RECHAZADA", token: "Not ambition it was", tone: "violet" },
              { label: "CAUSA VERDADERA", token: "that moved them, but duty.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien atribuyó el hecho a un motivo y querés negarlo sin discutir, la hendidura invertida empieza negando: 'Not ambition it was'. El 'but' final instala la causa verdadera. Con 'It was not ambition that moved them' el foco sigue en la negación, no en el deber.",
            exampleEnglish: "Not ambition it was that moved them, but duty.",
          },
        ],
        commonMistake: {
          wrong: "That vision was which guided us.",
          wrongToken: "was which guided",
          correct: "That vision it was that guided our efforts.",
          correctToken: "That vision it was that",
          whySpanish: "La fórmula de hendidura invertida exige '[Sustantivo] it was that [Verbo]'.",
        },
        examples: [
          {
            english: "That unyielding perseverance it was that secured the ultimate triumph.",
            spanish: "Esa inquebrantable perseverancia fue la que aseguró el triunfo final.",
            pronunciationHint: "dat an-yílding pérsevírans it uos dat sikyúrd di áltimet tráiomf",
          },
          {
            english: "Her quiet moral courage it was that inspired an entire generation.",
            spanish: "Su sereno coraje moral fue el que inspiró a una generación entera.",
            pronunciationHint: "jer kuáiet móral káridzh it uos dat inspáierd an entáier yéneréishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esa inquebrantable perseverancia fue la que aseguró el triunfo final",
          targetTokens: ["That", "unyielding", "perseverance", "it", "was", "that", "secured", "the", "triumph"],
          distractorTokens: ["which", "was", "securing", "been"],
          successTipSpanish: "¡Hendidura invertida monumental! 'That perseverance it was that...' crea un relieve épico.",
          mistakeHintSpanish: "Ordena: 'That unyielding perseverance it was that secured the triumph'.",
        },
        voicePractice: {
          sentenceEnglish: "Their selfless dedication it was that preserved the integrity of our institution.",
          spanishMeaning: "Su abnegada dedicación fue la que preservó la integridad de nuestra institución.",
          pronunciationHint: "der sélflis dédikéishon it uos dat prizérvd di intégriti ov áuer ínstitiúshon",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe discursos de conmemoración y textos solemnes aplicando hendiduras invertidas.",
        },
      },
    },

    // BASE 5: INVERSIÓN RESTRICTIVA MÚLTIPLE ACUMULATIVA
    {
      title: "Inversión Acumulativa Doble: Not only did they fail to..., but nor did they...",
      focus: "Encadenar dos inversiones negativas consecutivas para construir una crítica demoledora e incontestable",
      payload: {
        ruleTaglineSpanish:
          "Para formular un juicio forense o parlamentario sin fisuras, mantén la inversión en ambos polos del argumento: 'Not only did they fail to consult the council, but nor did they acknowledge the discrepancy'. Suprime conjunciones débiles y proyecta una autoridad implacable.",
        formulaSegments: [
          { label: "PRIMERA INVERSIÓN NEGATIVA", token: "Not only did they fail to consult the council,", tone: "violet" },
          { label: "SEGUNDA INVERSIÓN NEGATIVA", token: "but nor did they acknowledge", tone: "emerald" },
          { label: "OBJETO DE LA FALTA", token: "the fundamental discrepancy.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Dos omisiones en el mismo dictamen",
            segments: [
              { label: "PRIMERA FALTA", token: "Not only did they omit the results,", tone: "violet" },
              { label: "SEGUNDA FALTA", token: "but nor did they explain.", tone: "sky" },
            ],
            explanationSpanish:
              "Encadená dos faltas cuando querés una crítica sin fisuras: cada polo se invierte con 'did' y 'nor' niega el segundo sin abrir una nueva oración. Si la segunda parte va con 'and they didn't', la condena se enfría y el oyente siente que el argumento afloja.",
            exampleEnglish: "Not only did they omit the results, but nor did they explain.",
          },
          {
            label: "02 · Cuando ningún polo tiene agente",
            segments: [
              { label: "PRIMER HECHO ELUDIDO", token: "Not only was the warning ignored,", tone: "violet" },
              { label: "SEGUNDO HECHO ELUDIDO", token: "but neither were the minutes kept.", tone: "sky" },
            ],
            explanationSpanish:
              "Si ninguno de los dos hechos tiene agente, ambos polos van en pasiva y el segundo usa 'neither were'. La señal es la ausencia de sujeto que actúa: importa la negligencia, no quién la cometió. 'And the minutes weren't kept' rompería la simetría de la acusación.",
            exampleEnglish: "Not only was the warning ignored, but neither were the minutes kept.",
          },
        ],
        commonMistake: {
          wrong: "Not only they didn't consult, but also they didn't acknowledge.",
          wrongToken: "Not only they didn't... but also they didn't",
          correct: "Not only did they fail to consult, but nor did they acknowledge.",
          correctToken: "Not only did they fail... but nor did they acknowledge",
          whySpanish: "En el registro C2 ambas cláusulas se invierten formalmente usando 'nor did they'.",
        },
        examples: [
          {
            english: "Not only did they fail to consult the council, but nor did they acknowledge the discrepancy.",
            spanish: "No solo omitieron consultar al consejo, sino que tampoco reconocieron la discrepancia.",
            pronunciationHint: "not óunli did dei féil tu konsólt de káunsil, bat nor did dei aknóledzh de diskrépansi",
          },
          {
            english: "Not only was the timeline disregarded, but neither were the safety protocols observed.",
            spanish: "No solo se ignoró el cronograma, sino que tampoco se observaron los protocolos de seguridad.",
            pronunciationHint: "not óunli uos de táimlain dísrigárded, bat níder uér de séifti prótokols obzérvd",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No solo omitieron consultar al consejo, sino que tampoco reconocieron la falta",
          targetTokens: ["Not", "only", "did", "they", "fail", "to", "consult,", "but", "nor", "did", "they", "acknowledge"],
          distractorTokens: ["also", "didn't", "consulting", "acknowledged"],
          successTipSpanish: "¡Inversión doble demoledora! 'Not only did they... but nor did they...' sin concesiones.",
          mistakeHintSpanish: "Aplica inversión con 'did' en ambas partes: 'Not only did... but nor did...'.",
        },
        voicePractice: {
          sentenceEnglish: "Not only did they overlook early warnings, but nor did they institute timely safeguards.",
          spanishMeaning: "No solo pasaron por alto las advertencias tempranas, sino que tampoco instituyeron salvaguardas oportunas.",
          pronunciationHint: "not óunli did dei óuverluk érli uórnings, bat nor did dei ínstitiút táimli séifgards",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza dictámenes judiciales y alegatos de apelación formulados con inversión acumulativa doble.",
        },
      },
    },

    // BASE 6: PROSA CATEDRÁTICA DE REGISTRO SUPREMO
    {
      title: "Prosa Catedrática de Registro Supremo: Síntesis Barroca Integrada",
      focus: "Integrar cláusula absoluta, inversión de eco y hendidura invertida en un párrafo magistral",
      payload: {
        ruleTaglineSpanish:
          "Esta base culmina el Módulo 1. Fusiona la cláusula absoluta nominativa ('The deliberations concluded,'), la inversión de eco heroica ('prevail they did against all odds.') y la hendidura invertida ('That unyielding perseverance it was that secured victory.'). Arquitectura oracional de cátedra viva.",
        formulaSegments: [
          { label: "CLÁUSULA ABSOLUTA", token: "The deliberations concluded,", tone: "violet" },
          { label: "INVERSIÓN DE ECO", token: "prevail they did against all odds.", tone: "emerald" },
          { label: "HENDIDURA MONUMENTAL", token: "That unyielding perseverance it was that secured victory.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Apertura que fija la escena",
            segments: [
              { label: "CLÁUSULA ABSOLUTA DE APERTURA", token: "The accord signed,", tone: "violet" },
              { label: "ECO DEL VEREDICTO", token: "prevail they did.", tone: "emerald" },
            ],
            explanationSpanish:
              "En un párrafo de cátedra, la cláusula absoluta abre: fija el hecho previo sin conjunciones y deja la escena lista. Después ya podés echar mano del eco. Si empezás por el eco, el lector no sabe qué se firmó ni por qué el triunfo importa.",
            exampleEnglish: "The accord signed, prevail they did against every skeptic.",
          },
          {
            label: "02 · Veredicto tras la duda",
            segments: [
              { label: "DUDA EN EL AIRE", token: "Few expected endurance,", tone: "emerald" },
              { label: "ECO QUE SENTENCIA", token: "endure it did.", tone: "sky" },
            ],
            explanationSpanish:
              "El eco entra justo después de una expectativa negativa: la frase ya dijo que se dudaba y la inversión responde. Ese es su lugar en la arquitectura barroca, no el arranque. Colocado antes de la duda, el énfasis se gasta sin nada que lo justifique.",
            exampleEnglish: "Few expected endurance; endure it did.",
          },
          {
            label: "03 · Cierre monumental",
            segments: [
              { label: "CAUSA QUE QUEDA", token: "That patient diplomacy it was", tone: "violet" },
              { label: "QUE SELLA EL PÁRRAFO", token: "that preserved the union.", tone: "sky" },
            ],
            explanationSpanish:
              "La hendidura invertida cierra el párrafo: nombra la causa que merece recordarse y deja el efecto al final. Puesta al medio, corta el relato; al cierre, funciona como inscripción. Es el último movimiento, después de la escena y del eco.",
            exampleEnglish: "That patient diplomacy it was that preserved the union.",
          },
        ],
        commonMistake: {
          wrong: "The debate ended, and they reached consensus, and their strength was evident.",
          wrongToken: "sintaxis plana",
          correct: "The debate concluded, achieve consensus they did.",
          correctToken: "relieve catedrático C2",
          whySpanish: "El hablante C2 esculpe las frases dotándolas de relieve tridimensional y peso específico.",
        },
        examples: [
          {
            english: "The deliberations concluded, prevail they did against all odds. That unyielding perseverance it was that secured victory.",
            spanish: "Concluidas las deliberaciones, prevalecer prevalecieron contra todo pronóstico. Esa inquebrantable perseverancia fue la que aseguró el triunfo.",
            pronunciationHint: "de delíberéishons konklúded, privéil dei did agéinst ol ods. dat an-yílding pérsevírans it uos dat sikyúrd víktori",
          },
          {
            english: "The charter established, endure it did through generations. Such shared fidelity it was that anchored the state.",
            spanish: "Establecida la carta magna, perdurar perduró a través de generaciones. Semejante fidelidad compartida fue la que afianzó el Estado.",
            pronunciationHint: "de chárter estáblisht, endiúr it did zru yéneréishons. sach sherd fidéliti it uos dat ánkord de stéit",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Concluidas las deliberaciones, prevalecer prevalecieron. Esa perseverancia aseguró el triunfo",
          targetTokens: ["The", "deliberations", "concluded,", "prevail", "they", "did.", "That", "perseverance", "secured", "victory"],
          distractorTokens: ["When", "were", "prevailing", "it"],
          successTipSpanish: "¡Cúspide de la sintaxis barroca! Has fusionado cláusula absoluta e inversión de eco.",
          mistakeHintSpanish: "Ordena: 'The deliberations concluded, prevail they did. That perseverance secured victory'.",
        },
        voicePractice: {
          sentenceEnglish: "The debate concluded, achieve consensus they did through principled and patient dialogue.",
          spanishMeaning: "Concluido el debate, alcanzar el consenso lo alcanzaron mediante un diálogo razonado y paciente.",
          pronunciationHint: "de dibéit konklúded, achív konsénsus dei did zru prínsipold and péishent dáiolog",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Diserta exposiciones de cátedra magistral integrando sintaxis barroca en simulaciones de Interview.",
        },
      },
    },
  ];
}

