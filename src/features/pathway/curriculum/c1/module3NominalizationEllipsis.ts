import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule3NominalizationEllipsis(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 12: NOMINALIZACIÓN CONCEPTUAL Y DENSIDAD LÉXICA
    {
      title: "Nominalización Conceptual: Empaquetar Procesos en Sustantivos",
      focus: "Elevar la densidad informativa sustituyendo oraciones verbales por frases nominales abstractas",
      payload: {
        ruleTaglineSpanish:
          "La marca distintiva del inglés académico y ejecutivo es la 'nominalización': en vez de decir 'Because the organization expanded rapidly, it needed more leaders', transforma el verbo en sustantivo abstracto: 'The rapid expansion of the organization necessitated stronger leadership'. Condensas la causa y aumentas el impacto.",
        formulaSegments: [
          { label: "SUSTANTIVO ABSTRACTO + ADJETIVO", token: "The rapid adoption of new methodologies", tone: "violet" },
          { label: "VERBO DE IMPACTO", token: "markedly improved", tone: "emerald" },
          { label: "EFECTO CONCISO", token: "team coherence.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Because the team adopted new methods quickly, they improved a lot.",
          wrongToken: "Because the team adopted... quickly",
          correct: "The rapid adoption of new methods markedly improved performance.",
          correctToken: "The rapid adoption",
          whySpanish: "La nominalización elimina cláusulas subordinadas infantiles con 'because' o 'so'.",
        },
        examples: [
          {
            english: "The rapid adoption of new methodologies markedly improved team coherence.",
            spanish: "La rápida adopción de nuevas metodologías mejoró notablemente la coherencia del equipo.",
            pronunciationHint: "de rápid adópshon ov niú mezodólodzis márkidli imprúvd tim kojírens",
          },
          {
            english: "The steady accumulation of empirical evidence reinforced our original hypothesis.",
            spanish: "La acumulación constante de evidencia empírica reforzó nuestra hipótesis original.",
            pronunciationHint: "de stédi akiúmiuléishon ov empírikal évidens ríinfórst áuer oríyinal jaipózesis",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La rápida adopción de nuevas metodologías mejoró notablemente la coherencia",
          targetTokens: ["The", "rapid", "adoption", "of", "new", "methodologies", "markedly", "improved", "team", "coherence"],
          distractorTokens: ["Because", "adopting", "quick", "improve"],
          successTipSpanish: "¡Densidad conceptual magistral! 'The rapid adoption' sustituye oraciones subordinadas pesadas.",
          mistakeHintSpanish: "Abre con la frase nominal: 'The rapid adoption of new methodologies...'.",
        },
        voicePractice: {
          sentenceEnglish: "The systematic evaluation of outcomes facilitated more informed decision-making.",
          spanishMeaning: "La evaluación sistemática de resultados facilitó una toma de decisiones más informada.",
          pronunciationHint: "de sístemátik iváliuéishon ov áutkams fasílitáited mor infórmd desíshon-méiking",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Lee ensayos de Nature, Harvard Business Review y Oxford Academic analizando su densidad nominal.",
        },
      },
    },

    // BASE 13: ELIPSIS ELEGANTE EN FÓRMULAS CONDICIONALES
    {
      title: "Elipsis Elegante en Fórmulas Condicionales: If any / If so / If ever",
      focus: "Eliminar la redundancia omitiendo sujeto y verbo cuando el contexto es inequívoco",
      payload: {
        ruleTaglineSpanish:
          "En lugar de repetir proposiciones completas ('If that is true' / 'If there were any problems'), la prosa C1 utiliza elipsis magistral: 'few errors, if any, occurred' (pocos errores, si es que hubo alguno), 'if so' (de ser así), 'if ever' (rara vez o nunca). Brevedad y precisión extrema.",
        formulaSegments: [
          { label: "AFIRMACIÓN PRINCIPAL", token: "Few difficulties,", tone: "violet" },
          { label: "ELIPSIS CONDICIONAL", token: "if any,", tone: "emerald" },
          { label: "VERBO + MARCO", token: "arose during the implementation phase.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Few difficulties, if there were any difficulties, appeared.",
          wrongToken: "if there were any difficulties",
          correct: "Few difficulties, if any, arose.",
          correctToken: "if any",
          whySpanish: "La fórmula 'if any' condensa la condición eliminando pronombres y verbos redundantes.",
        },
        examples: [
          {
            english: "Few difficulties, if any, arose during the initial implementation phase.",
            spanish: "Pocas dificultades, si es que hubo alguna, surgieron durante la fase inicial de implementación.",
            pronunciationHint: "fiu dífikaltis, if éni, aróus diúring di iníshal ímplementéishon féiz",
          },
          {
            english: "Are there substantial disagreements? If so, we should address them immediately.",
            spanish: "¿Existen desacuerdos sustanciales? De ser así, deberíamos atenderlos de inmediato.",
            pronunciationHint: "ar der sabstánshal dísagríments? if sou, ui shud adrés dem imídietli",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Pocas dificultades, si es que hubo alguna, surgieron durante la fase",
          targetTokens: ["Few", "difficulties,", "if", "any,", "arose", "during", "the", "phase"],
          distractorTokens: ["were", "there", "some", "arising"],
          successTipSpanish: "¡Elipsis quirúrgica! 'if any,' entre comas añade rigor y economía lingüística.",
          mistakeHintSpanish: "Inserta 'if any,' inmediatamente después del sustantivo 'difficulties,'.",
        },
        voicePractice: {
          sentenceEnglish: "Little change, if any, was detected after the preliminary observations.",
          spanishMeaning: "Poco cambio, si es que hubo alguno, fue detectado tras las observaciones preliminares.",
          pronunciationHint: "lítl chéiny, if éni, uos ditékted áfter de prilíminari óbservéishons",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe síntesis ejecutivas incorporando fórmulas de elipsis como 'if any' e 'if so' en Writing Studio.",
        },
      },
    },

    // BASE 14: SUSTITUCIÓN AVANZADA CON SO Y NEITHER
    {
      title: "Sustitución Avanzada: Should that be so / To do so would compromise...",
      focus: "Reemplazar cláusulas enteras mediante partículas de sustitución para evitar repeticiones",
      payload: {
        ruleTaglineSpanish:
          "Para referirte a una acción o condición previamente mencionada sin repetirla, utiliza 'to do so' (hacerlo) o 'should that be so' (si eso resultara ser así): 'Accepting such terms compromises our values; to do so would be unacceptable'.",
        formulaSegments: [
          { label: "PREMISA INICIAL", token: "Accepting such conditions compromises integrity;", tone: "violet" },
          { label: "SUSTITUCIÓN DE ACCIÓN", token: "to do so", tone: "emerald" },
          { label: "CONSECUENCIA ÉTICA", token: "would be utterly unacceptable.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Accepting terms is bad; to accept terms would be unacceptable (repetición tosca).",
          wrongToken: "to accept terms",
          correct: "To do so would be unacceptable.",
          correctToken: "To do so",
          whySpanish: "'To do so' reemplaza la frase verbal entera con elegancia y economía.",
        },
        examples: [
          {
            english: "Accepting such terms compromises our values; to do so would be unacceptable.",
            spanish: "Aceptar tales condiciones comprometería nuestros principios; hacerlo sería inadmisible.",
            pronunciationHint: "aksépting sach terms kómpramáizes áuer válius; tu du sou uud bi anakséptabl",
          },
          {
            english: "Should that be so, our primary strategy will require prompt recalibration.",
            spanish: "De ser eso así, nuestra estrategia principal requerirá una pronta recalibración.",
            pronunciationHint: "shud dat bi sou, áuer práimari strátedyi uil rikuáier prompt ríkalibréishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Aceptar tales condiciones compromete valores; hacerlo sería inadmisible",
          targetTokens: ["Accepting", "such", "terms", "compromises", "values;", "to", "do", "so", "would", "be", "unacceptable"],
          distractorTokens: ["doing", "that", "it", "compromise"],
          successTipSpanish: "¡Sustitución impecable! 'to do so' sustituye la acción completa sin redundancia.",
          mistakeHintSpanish: "Usa 'to do so would be unacceptable' en la segunda cláusula.",
        },
        voicePractice: {
          sentenceEnglish: "We must proceed with utmost care, and to do so requires unified collaboration.",
          spanishMeaning: "Debemos proceder con el máximo cuidado, y hacerlo exige una colaboración unificada.",
          pronunciationHint: "ui mast prosíd uid átmoust ker, and tu du sou rikuáiers yúnifaid koláboreishon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Sustituye argumentos previos con 'to do so' para argumentar con solidez en entrevistas ejecutivas.",
        },
      },
    },

    // BASE 15: CLÁUSULAS REDUCIDAS CON ADJETIVOS
    {
      title: "Cláusulas Reducidas con Adjetivos: Aware of the complexity, they paused",
      focus: "Iniciar oraciones directamente con adjetivos descriptivos prescindiendo de 'Being' o 'Because'",
      payload: {
        ruleTaglineSpanish:
          "En lugar del pesado 'Because he was aware of the risks, he paused...', inicia la frase directamente con el adjetivo descriptivo y su complemento: 'Aware of the complexity of the matter, the director sought a second opinion'. El sujeto de la frase principal debe coincidir con quien posee la cualidad.",
        formulaSegments: [
          { label: "ADJETIVO DIRECTO + COMPLEMENTO", token: "Aware of the complexity of the matter,", tone: "violet" },
          { label: "SUJETO PRINCIPAL", token: "the director", tone: "emerald" },
          { label: "ACCIÓN PRUDENTE", token: "sought a comprehensive second opinion.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Being aware of the complexity, the director sought advice (Being es innecesario).",
          wrongToken: "Being aware",
          correct: "Aware of the complexity, the director sought advice.",
          correctToken: "Aware of the complexity",
          whySpanish: "En el registro culto se omite 'Being'; el adjetivo califica directamente al sujeto.",
        },
        examples: [
          {
            english: "Aware of the complexity of the matter, the director sought a second opinion.",
            spanish: "Consciente de la complejidad del asunto, el director solicitó una segunda opinión.",
            pronunciationHint: "auér ov de kompléksiti ov de máter, de dairéktor sot a sékond opínion",
          },
          {
            english: "Unable to verify the source independently, the editorial team withheld publication.",
            spanish: "Incapaz de verificar la fuente de forma independiente, el equipo editorial retuvo la publicación.",
            pronunciationHint: "anéibl tu vérifai de sors índipéndentli, di éditoriál tim uidjeld páblikéishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Consciente de la complejidad del asunto, el director solicitó una segunda opinión",
          targetTokens: ["Aware", "of", "the", "complexity", "of", "the", "matter,", "the", "director", "sought", "an", "opinion"],
          distractorTokens: ["Being", "was", "seeking", "awarely"],
          successTipSpanish: "¡Reducción adjetival directa! 'Aware of the complexity...' sin 'Being'.",
          mistakeHintSpanish: "Abre directamente con el adjetivo: 'Aware of the complexity of the matter,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Confident in their preparation, the scholars presented their groundbreaking treatise.",
          spanishMeaning: "Seguros de su preparación, los académicos presentaron su innovador tratado.",
          pronunciationHint: "kónfident in der préparéishon, de skólars prezénted der gráundbréiking trítis",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce cláusulas reducidas con adjetivos en ensayos biográficos y literatura contemporánea.",
        },
      },
    },

    // BASE 16: RESUMEN EJECUTIVO DE MÁXIMA DENSIDAD (CHECKPOINT 2 ANCHOR)
    {
      title: "Resumen Ejecutivo de Máxima Densidad: Síntesis C1 Integrada",
      focus: "Condensar párrafos extensos en enunciados densos y precisos mediante nominalización y elipsis",
      payload: {
        ruleTaglineSpanish:
          "Esta base consolida el Módulo 3: combina una cláusula reducida con adjetivo ('Aware of the risks,'), una elipsis condicional ('few errors, if any, escaped review.') y una frase nominalizada ('The prompt resolution of discrepancies ensured success.'). Densidad pura sin una sola palabra de relleno.",
        formulaSegments: [
          { label: "CLÁUSULA REDUCIDA", token: "Aware of the persistent challenges,", tone: "violet" },
          { label: "ELIPSIS PRECISA", token: "few obstacles, if any, slowed progress.", tone: "emerald" },
          { label: "NOMINALIZACIÓN FINAL", token: "The prompt calibration of priorities ensured excellence.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Escribir textos extensos llenos de oraciones simples coordinadas por 'and' y 'because'.",
          wrongToken: "sobreexplicación",
          correct: "Condensar causas en frases nominales abstractas con elipsis precisas.",
          correctToken: "concisión ejecutiva C1",
          whySpanish: "El nivel C1 no mide cuántas palabras dices, sino cuánta sustancia comunicas por segundo.",
        },
        examples: [
          {
            english: "Aware of the risks, few errors, if any, escaped review. The prompt resolution of discrepancies ensured success.",
            spanish: "Conscientes de los riesgos, pocos errores, si es que hubo alguno, escaparon a la revisión. La pronta resolución de discrepancias aseguró el éxito.",
            pronunciationHint: "auér ov de risks, fiu érrors, if éni, eskéipt riviú. de prompt rézolúshon ov diskrépansis enshúrd saksés",
          },
          {
            english: "Mindful of our constraints, few setbacks, if any, compromised delivery. The seamless coordination of teams guaranteed excellence.",
            spanish: "Conscientes de nuestras limitaciones, pocos contratiempos, si es que hubo alguno, comprometieron la entrega. La coordinación fluida de los equipos garantizó la excelencia.",
            pronunciationHint: "máindful ov áuer konstréints, fiu sétbaks, if éni, kómpramáizd delíveri. de símlis koórdinéishon ov tims gárantíd ékselens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Conscientes de los riesgos, pocos errores, si hubo alguno, escaparon a la revisión",
          targetTokens: ["Aware", "of", "the", "risks,", "few", "errors,", "if", "any,", "escaped", "review"],
          distractorTokens: ["Being", "there", "was", "some"],
          successTipSpanish: "¡Densidad ejecutiva certificada! Reducción adjetival y elipsis combinadas a la perfección.",
          mistakeHintSpanish: "Ordena: 'Aware of the risks, few errors, if any, escaped review'.",
        },
        voicePractice: {
          sentenceEnglish: "Mindful of our constraints, few setbacks, if any, undermined our enduring commitment.",
          spanishMeaning: "Conscientes de nuestras limitaciones, pocos tropiezos, si hubo alguno, socavaron nuestro compromiso duradero.",
          pronunciationHint: "máindful ov áuer konstréints, fiu sétbaks, if éni, ándarmáind áuer endiúring komítment",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe resúmenes ejecutivos de máxima densidad léxica para juntas directivas en Writing Studio.",
        },
      },
    },
  ];
}

