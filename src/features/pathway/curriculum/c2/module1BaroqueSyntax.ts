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
        commonMistake: {
          wrong: "When the deliberations concluded, the delegates left (correcto pero básico).",
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
        commonMistake: {
          wrong: "They really prevailed against all odds (coloquial y plano).",
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
        commonMistake: {
          wrong: "Their contribution was decisive and maybe completely transformative (redundante y vacilante).",
          wrongToken: "and maybe completely",
          correct: "decisive, if not outright transformative,",
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
        commonMistake: {
          wrong: "That vision was which guided us (calco roto del español).",
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
        commonMistake: {
          wrong: "Escribir con sintaxis predecible de oraciones coordinadas simples.",
          wrongToken: "sintaxis plana",
          correct: "Entrelazar hipérbaton, cláusulas absolutas y ecos para lograr relieve escultural.",
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

