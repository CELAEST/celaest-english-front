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
        formulaCases: [
          {
            label: "01 · Empaquetar la causa de un resultado",
            segments: [
              { label: "CAUSA NOMINALIZADA", token: "the sharp decline in demand", tone: "violet" },
              { label: "VERBO DE IMPACTO", token: "compelled", tone: "emerald" },
              { label: "EFECTO", token: "an immediate restructuring.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando expliques por qué ocurrió algo, convierte el verbo de la causa en sustantivo con adjetivo: 'demand declined sharply' pasa a 'the sharp decline in demand'. La señal es que la causa ya no necesita 'because'; el contraste es una sola frase densa frente a dos cláusulas.",
            exampleEnglish: "The sharp decline in demand compelled an immediate restructuring.",
          },
          {
            label: "02 · Empaquetar una decisión que se juzga",
            segments: [
              { label: "SUSTANTIVO DE ACCIÓN", token: "their refusal to disclose the figures", tone: "violet" },
              { label: "VERBO DE JUICIO", token: "prompted", tone: "emerald" },
              { label: "REACCIÓN", token: "immediate criticism.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando mencionas una decisión para después juzgarla, usa el sustantivo del verbo ('refusal', 'decision', 'approval') más 'to' o 'of'. La señal es un verbo de juicio detrás; el contraste con 'they refused and everyone criticized them' es un solo sujeto y sin repetición.",
            exampleEnglish: "Their refusal to publish the data drew sharp criticism.",
          },
          {
            label: "03 · Empaquetar un proceso como sujeto",
            segments: [
              { label: "PROCESO NOMINAL", token: "the continuous monitoring of emissions", tone: "violet" },
              { label: "VERBO DE EXIGENCIA", token: "requires", tone: "emerald" },
              { label: "CONDICIÓN", token: "trained personnel.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el proceso, y no la persona, es el tema de la frase, ponlo como sujeto nominal: 'the monitoring of emissions requires...'. La señal es que el agente desaparece porque no importa; el contraste con 'we monitor emissions and we need staff' elimina el 'we' repetido.",
            exampleEnglish: "The continuous monitoring of emissions requires trained personnel.",
          },
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
        formulaCases: [
          {
            label: "01 · Cantidad dudosa con if any",
            segments: [
              { label: "CANTIDAD MÍNIMA", token: "Little support,", tone: "violet" },
              { label: "ELIPSIS CONDICIONAL", token: "if any,", tone: "emerald" },
              { label: "VERBO PRINCIPAL", token: "came from the board.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando afirmas que una cantidad es mínima y quieres sugerir que quizá fue cero, inserta 'if any' entre comas después del sustantivo. La señal es una palabra como 'few' o 'little' delante; el contraste con 'if there were any' es que no repites el verbo.",
            exampleEnglish: "Little support, if any, came from the board.",
          },
          {
            label: "02 · Condición sobre toda la frase (if so)",
            segments: [
              { label: "PREMISA COMPLETA", token: "The figures may change.", tone: "violet" },
              { label: "ELIPSIS DE CONDICIÓN", token: "If so,", tone: "emerald" },
              { label: "CONSECUENCIA", token: "we revise the report.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la condición repite entera la frase anterior, no la repitas: cierra la premisa y abre con 'If so'. La señal es que acabas de afirmar algo sobre lo que el otro puede dudar; el contraste con 'If that is true' es economía total.",
            exampleEnglish: "The figures may change. If so, we revise the report.",
          },
          {
            label: "03 · Frecuencia negada con if ever",
            segments: [
              { label: "FRECUENCIA MÍNIMA", token: "seldom meets,", tone: "violet" },
              { label: "ELIPSIS DE FRECUENCIA", token: "if ever,", tone: "emerald" },
              { label: "MARCO TEMPORAL", token: "during the summer.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando un adverbio como 'seldom', 'rarely' o 'hardly' ya niega la frecuencia, añade 'if ever' entre comas para reforzar que casi nunca ocurre. La señal es el adverbio negativo previo; el contraste con 'if at all' es que ahí hablas de grado, no de veces.",
            exampleEnglish: "The committee seldom meets, if ever, during the summer.",
          },
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
        formulaCases: [
          {
            label: "01 · Sustituir una acción ya nombrada (to do so)",
            segments: [
              { label: "ACCIÓN PREVIA", token: "They may reject the offer;", tone: "violet" },
              { label: "SUSTITUCIÓN DE ACCIÓN", token: "to do so", tone: "emerald" },
              { label: "CONSECUENCIA", token: "would end the talks.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando evalúas una acción que acabas de mencionar, sustituye toda la frase verbal por 'to do so'. La señal es un verbo como 'would', 'must' o 'means' después; el contraste con repetir 'to reject the offer' es que no cargas otra vez la acción completa.",
            exampleEnglish: "The board may withdraw; to do so would end the project.",
          },
          {
            label: "02 · Condición formal sobre la premisa (should that be so)",
            segments: [
              { label: "PREMISA PREVIA", token: "The supplier has confirmed delivery.", tone: "violet" },
              { label: "INVERSIÓN CONDICIONAL", token: "Should that be so,", tone: "emerald" },
              { label: "CONSECUENCIA", token: "we can move the launch forward.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando retomas una afirmación ajena y quieres condicionarla con tono formal, usa 'Should that be so' en lugar de 'If that is true'. La señal es que la premisa ya está dicha; el contraste con 'if' es la inversión, que suena a informe y evita la repetición.",
            exampleEnglish: "Should that be so, we will accelerate the rollout.",
          },
        ],
        commonMistake: {
          wrong: "We could reject the offer, and to reject the offer would end the talks.",
          wrongToken: "to accept terms",
          correct: "We could reject the offer; to do so would end the talks.",
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
        formulaCases: [
          {
            label: "01 · Adjetivo + of (aware of)",
            segments: [
              { label: "ADJETIVO REDUCIDO", token: "Aware", tone: "violet" },
              { label: "COMPLEMENTO OF", token: "of the tight deadline,", tone: "emerald" },
              { label: "SUJETO + ACCIÓN", token: "the team cut the scope.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la causa de una acción es lo que alguien sabe, abre con el adjetivo y su complemento 'of': 'Aware of the deadline'. La señal es un adjetivo que pide 'of' (aware, conscious, mindful); el contraste con 'Because they were aware' es que no hay verbo ni 'because'.",
            exampleEnglish: "Aware of the tight deadline, the team cut the scope.",
          },
          {
            label: "02 · Adjetivo + to + verbo (reluctant to)",
            segments: [
              { label: "ADJETIVO REDUCIDO", token: "Reluctant", tone: "violet" },
              { label: "TO + VERBO", token: "to sign the report,", tone: "emerald" },
              { label: "SUJETO + ACCIÓN", token: "the auditor requested changes.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el motivo es una incapacidad o una disposición, el adjetivo va con 'to' más verbo: 'Reluctant to sign'. La señal es 'unable', 'ready' o 'reluctant'; el contraste con 'Because we could not verify it' es que la forma queda en dos palabras y el sujeto sigue igual.",
            exampleEnglish: "Reluctant to sign the report, the auditor requested changes.",
          },
          {
            label: "03 · Adjetivo + that + cláusula (mindful that)",
            segments: [
              { label: "ADJETIVO REDUCIDO", token: "Mindful", tone: "violet" },
              { label: "THAT + CLÁUSULA", token: "that time was short,", tone: "emerald" },
              { label: "SUJETO + ACCIÓN", token: "the organizers trimmed the agenda.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando lo que sigue no es un sustantivo sino una idea completa, el adjetivo pide 'that' más cláusula: 'Mindful that time was short'. La señal es un verbo conjugado después; el contraste con 'Mindful of' es que ahí solo puede ir un sustantivo.",
            exampleEnglish: "Mindful that time was short, the organizers trimmed the agenda.",
          },
        ],
        commonMistake: {
          wrong: "Being aware of the complexity, the director sought advice.",
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
        formulaCases: [
          {
            label: "01 · Abrir con la condición (cláusula reducida)",
            segments: [
              { label: "CONDICIÓN REDUCIDA", token: "Conscious of the reputational stakes,", tone: "violet" },
              { label: "HALLAZGO", token: "the board postponed the announcement.", tone: "emerald" },
            ],
            explanationSpanish:
              "En un resumen, la primera frase fija la condición de la que depende todo lo demás, y una cláusula reducida lo hace sin ocupar espacio. La señal es un adjetivo con 'of' y su sujeto compartido; el contraste con dos oraciones con 'because' es una sola línea.",
            exampleEnglish: "Conscious of the reputational stakes, the board postponed the announcement.",
          },
          {
            label: "02 · Cuantificar el riesgo con elipsis (if any)",
            segments: [
              { label: "CANTIDAD MÍNIMA", token: "few objections,", tone: "violet" },
              { label: "ELIPSIS CONDICIONAL", token: "if any,", tone: "emerald" },
              { label: "RESULTADO", token: "blocked the final vote.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el resumen cifra un riesgo sin comprometerse, la elipsis 'if any' marca que la cantidad pudo ser cero. La señal es 'few' o 'little' delante; el contraste con 'if there were any' es el verbo que ya no repetís.",
            exampleEnglish: "Few objections, if any, blocked the final vote.",
          },
          {
            label: "03 · Cerrar con el resultado nominalizado",
            segments: [
              { label: "NOMINALIZACIÓN", token: "The early resolution of the dispute", tone: "violet" },
              { label: "VERBO DE EFECTO", token: "secured", tone: "emerald" },
              { label: "CIERRE", token: "broad stakeholder support.", tone: "sky" },
            ],
            explanationSpanish:
              "La última frase del resumen nombra el resultado como sujeto, no como cláusula con 'we'. La señal es que el lector necesita saber qué se logró; el contraste con 'we resolved the dispute and everyone supported us' es un cierre sin sujeto humano.",
            exampleEnglish: "The early resolution of the dispute secured broad stakeholder support.",
          },
        ],
        commonMistake: {
          wrong: "Because they were aware of the risks, and there were few errors, the review was clean.",
          wrongToken: "sobreexplicación",
          correct: "Aware of the risks, few errors, if any, escaped review.",
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

