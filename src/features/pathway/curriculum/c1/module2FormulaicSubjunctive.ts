import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule2FormulaicSubjunctive(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 7: FÓRMULAS SUBJUNTIVAS INVARIABLES
    {
      title: "Subjuntivo Fosilizado Invariable: Be that as it may / Come what may",
      focus: "Concesión absoluta y determinación inquebrantable mediante locuciones fijas de prestigio",
      payload: {
        ruleTaglineSpanish:
          "El inglés retiene fórmulas subjuntivas arcaicas de inmenso prestigio: 'Be that as it may' (sea como fuere / no obstante) y 'Come what may' (pase lo que pase). Su estructura es fija e inmutable; jamás se conjugan con 'is' o 'was'.",
        formulaSegments: [
          { label: "SUBJUNTIVO FIJO", token: "Be that as it may,", tone: "violet" },
          { label: "COMPROMISO ÉTICO", token: "we must uphold our standard", tone: "emerald" },
          { label: "VALOR CENTRAL", token: "of absolute transparency.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "Be how it was, we must proceed (traducción literal de 'sea como fuere').",
          wrongToken: "Be how it was",
          correct: "Be that as it may, we must proceed.",
          correctToken: "Be that as it may",
          whySpanish: "La fórmula fosilizada culta en inglés es estrictamente 'Be that as it may'.",
        },
        examples: [
          {
            english: "Be that as it may, we must uphold our commitment to rigorous integrity.",
            spanish: "Sea como fuere, debemos mantener nuestro compromiso con una integridad rigurosa.",
            pronunciationHint: "bi dat as it mei, ui mast ap-jóuld áuer komítment tu rígorus intégriti",
          },
          {
            english: "Come what may, our team will stand by its foundational principles.",
            spanish: "Pase lo que pase, nuestro equipo defenderá sus principios fundamentales.",
            pronunciationHint: "kam uot mei, áuer tim uil stand bai its faundéishonal prínsipols",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Sea como fuere, debemos mantener nuestro compromiso con la integridad",
          targetTokens: ["Be", "that", "as", "it", "may,", "we", "must", "uphold", "our", "integrity"],
          distractorTokens: ["How", "was", "being", "upholding"],
          successTipSpanish: "¡Locución fosilizada dominada! 'Be that as it may,' aporta distinción inmediata.",
          mistakeHintSpanish: "La fórmula invariable es 'Be that as it may,'.",
        },
        voicePractice: {
          sentenceEnglish: "Be that as it may, our fundamental objectives remain unchanged.",
          spanishMeaning: "Sea como fuere, nuestros objetivos fundamentales permanecen inalterados.",
          pronunciationHint: "bi dat as it mei, áuer fándaméntal obdyéktivs riméin anchéinygd",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza tratados diplomáticos y dictámenes judiciales redactados con subjuntivo invariable.",
        },
      },
    },

    // BASE 8: SUBJUNTIVO DE CORTESÍA Y EXCLUSIÓN - CHECKPOINT 1 ANCHOR
    {
      title: "Subjuntivo de Cortesía y Resumen: Suffice it to say / Far be it from me",
      focus: "Resumir con sobriedad y discrepar con extrema delicadeza institucional",
      payload: {
        ruleTaglineSpanish:
          "Usa 'Suffice it to say that...' (baste decir que) para sintetizar un desenlace sin aburrir con detalles menores. Y cuando quieras formular una crítica respetuosa sin sonar arrogante, abre con 'Far be it from me to criticize, but...'.",
        formulaSegments: [
          { label: "SÍNTESIS SOBRIA", token: "Suffice it to say that", tone: "violet" },
          { label: "RESULTADO TRASCENDENTAL", token: "the outcomes surpassed", tone: "emerald" },
          { label: "MARCO DE REFERENCIA", token: "all initial expectations.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "It is enough to say that (correcto pero plano y básico).",
          wrongToken: "It is enough to say",
          correct: "Suffice it to say that the outcome was favorable.",
          correctToken: "Suffice it to say that",
          whySpanish: "'Suffice it to say' es la fórmula canónica de síntesis en la oratoria culta británica y estadounidense.",
        },
        examples: [
          {
            english: "Suffice it to say that the outcomes surpassed all our initial expectations.",
            spanish: "Baste decir que los resultados superaron todas nuestras expectativas iniciales.",
            pronunciationHint: "safáis it tu séi dat di áutkams serpást ol áuer iníshal ékspektéishons",
          },
          {
            english: "Far be it from me to question your judgment, but perhaps a second review is advisable.",
            spanish: "Lejos esté de mí cuestionar su criterio, pero tal vez una segunda revisión sea aconsejable.",
            pronunciationHint: "far bi it from mi tu kuéschion yor dyádyment, bat perjáps a sékond riviú is adváisabl",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Baste decir que los resultados superaron todas nuestras expectativas",
          targetTokens: ["Suffice", "it", "to", "say", "that", "the", "outcomes", "surpassed", "expectations"],
          distractorTokens: ["Enough", "is", "saying", "surpass"],
          successTipSpanish: "¡Elegancia institucional! 'Suffice it to say that...' condensa con sobriedad.",
          mistakeHintSpanish: "Usa la fórmula: 'Suffice it to say that the outcomes surpassed expectations'.",
        },
        voicePractice: {
          sentenceEnglish: "Suffice it to say that our persistent efforts yielded remarkable breakthroughs.",
          spanishMeaning: "Baste decir que nuestros persistentes esfuerzos produjeron avances notables.",
          pronunciationHint: "safáis it tu séi dat áuer persístent éforts yílded rimárkabl bréiktruz",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe conclusiones ejecutivas breves y contundentes con 'Suffice it to say' en Writing Studio.",
        },
      },
    },

    // BASE 9: CONDICIONALES CONTRAFÁCTICOS CON WERE IT NOT FOR
    {
      title: "Contrafácticos de Máxima Abstracción: Were it not for / Had it not been for",
      focus: "Reconocer el factor decisivo que evitó el fracaso o posibilitó el éxito sin usar 'if'",
      payload: {
        ruleTaglineSpanish:
          "Para identificar la causa única y decisiva de una situación sin decir 'if it wasn't for', usa en presente 'Were it not for [Sustantivo], [Sujeto] would [Base]' y en pasado 'Had it not been for [Sustantivo], [Sujeto] would have [Participio]'. Es la cumbre de los condicionales diplomáticos.",
        formulaSegments: [
          { label: "FACTOR DECISIVO (PASADO)", token: "Had it not been for their timely guidance,", tone: "violet" },
          { label: "RESULTADO ALTERNATIVO", token: "the entire initiative would have faltered.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "If it wouldn't be for your help, we failed.",
          wrongToken: "If it wouldn't be",
          correct: "Had it not been for your help, we would have failed.",
          correctToken: "Had it not been for",
          whySpanish: "Las fórmulas canónicas de élite son 'Were it not for...' y 'Had it not been for...'.",
        },
        examples: [
          {
            english: "Had it not been for our mentor's timely intervention, we would have failed.",
            spanish: "De no haber sido por la oportuna intervención de nuestro mentor, habríamos fracasado.",
            pronunciationHint: "jad it not bin for áuer méntors táimli íntarvénshon, ui uud jav féild",
          },
          {
            english: "Were it not for their unwavering support, this project would not be viable today.",
            spanish: "De no ser por su apoyo inquebrantable, este proyecto no sería viable hoy.",
            pronunciationHint: "uér it not for der anuéivering sapórt, dis próyekt uud not bi váiabl tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: De no haber sido por la oportuna intervención de nuestro mentor, habríamos fracasado",
          targetTokens: ["Had", "it", "not", "been", "for", "our", "mentor's", "intervention,", "we", "would", "have", "failed"],
          distractorTokens: ["If", "was", "be", "failing"],
          successTipSpanish: "¡Condicional diplomático supremo! 'Had it not been for...' reconoce el mérito clave.",
          mistakeHintSpanish: "Abre con 'Had it not been for our mentor's intervention,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Had it not been for rigorous testing, critical errors would have gone unnoticed.",
          spanishMeaning: "De no haber sido por las pruebas rigurosas, errores críticos habrían pasado desapercibidos.",
          pronunciationHint: "jad it not bin for rígorus tésting, krítikal érrors uud jav gon annóutist",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Atribuye reconocimientos a tu equipo y mentores usando 'Had it not been for' en entrevistas.",
        },
      },
    },

    // BASE 10: CONECTORES ARCAICOS Y JURÍDICO-INSTITUCIONALES
    {
      title: "Conectores Institucionales de Precisión: Inasmuch as / Insofar as / Albeit",
      focus: "Delimitar el alcance exacto de una afirmación o introducir concesiones breves (albeit demanding)",
      payload: {
        ruleTaglineSpanish:
          "'Albeit' (si bien / aunque) permite conectar un adjetivo contrastante sin abrir una nueva oración subordinada: 'a successful, albeit demanding, endeavor'. Usa 'insofar as' para delimitar: 'insofar as the regulations allow' (en la medida en que las normas lo permitan).",
        formulaSegments: [
          { label: "LOGRO PRINCIPAL", token: "They achieved a significant,", tone: "violet" },
          { label: "CONCESIÓN COMPACTA", token: "albeit demanding,", tone: "emerald" },
          { label: "ÁMBITO DEL LOGRO", token: "breakthrough in community health.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "a successful although it was demanding project (pesado y redundante).",
          wrongToken: "although it was demanding",
          correct: "a successful, albeit demanding, project.",
          correctToken: "albeit demanding",
          whySpanish: "'Albeit' reemplaza limpiamente a 'although it was' antes de adjetivos o frases breves.",
        },
        examples: [
          {
            english: "They achieved a significant, albeit demanding, breakthrough in community health.",
            spanish: "Lograron un avance significativo, si bien exigente, en la salud comunitaria.",
            pronunciationHint: "dei achívd a signífikant, ol-bí-it dimánding, bréiktru in komiúniti jelz",
          },
          {
            english: "We endorse the policy insofar as it protects the fundamental rights of every member.",
            spanish: "Respaldamos la política en la medida en que proteja los derechos fundamentales de cada miembro.",
            pronunciationHint: "ui endórs de pólisi ín-sou-far as it protékts de fándaméntal ráits",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Lograron un avance significativo, si bien exigente, en salud",
          targetTokens: ["They", "achieved", "a", "significant,", "albeit", "demanding,", "breakthrough", "in", "health"],
          distractorTokens: ["although", "was", "achieve", "demanded"],
          successTipSpanish: "¡Concisión C1 de alto vuelo! 'albeit demanding' evita subordinadas pesadas.",
          mistakeHintSpanish: "Inserta 'albeit demanding,' entre comas como modificador directo.",
        },
        voicePractice: {
          sentenceEnglish: "It was a modest, albeit meaningful, contribution to the global dialogue.",
          spanishMeaning: "Fue una contribución modesta, si bien significativa, al diálogo global.",
          pronunciationHint: "it uos a módest, ol-bí-it míningful, kóntribiúshon tu de glóubal dáiolog",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica 'albeit' e 'insofar as' en acuerdos internacionales y marcos éticos de gobernanza.",
        },
      },
    },

    // BASE 11: INVERSIÓN EN COMPARACIONES FORMALES CON AS Y THAN
    {
      title: "Inversión Comparativa Formal: As do all our members / Than did previous generations",
      focus: "Invertir auxiliar y sujeto tras comparaciones en prosa discursiva y académica",
      payload: {
        ruleTaglineSpanish:
          "En prosa académica y discursos formales, al comparar acciones con 'as' (como) o 'than' (que), se invierte el sujeto y el auxiliar para un balance rítmico majestuoso: 'Our university values integrity, as DO all its distinguished scholars'.",
        formulaSegments: [
          { label: "CLÁUSULA BASE", token: "The institution values perseverance,", tone: "violet" },
          { label: "AUXILIAR INVERTIDO", token: "as do", tone: "emerald" },
          { label: "SUJETO COMPARADO", token: "all its founding members.", tone: "sky" },
        ],
        commonMistake: {
          wrong: "The institution values integrity, as all its members do it (coloquial y redundante).",
          wrongToken: "as all its members do it",
          correct: "The institution values integrity, as do all its members.",
          correctToken: "as do all its members",
          whySpanish: "La inversión 'as do [sujeto]' prescinde de 'it' y otorga un ritmo armónico al enunciado.",
        },
        examples: [
          {
            english: "The institution values perseverance, as do all its founding members.",
            spanish: "La institución valora la perseverancia, al igual que todos sus miembros fundadores.",
            pronunciationHint: "di ínstitiúshon válius pérsevírans, as du ol its fáunding mémbers",
          },
          {
            english: "They adapted more swiftly to cultural changes than did previous generations.",
            spanish: "Se adaptaron con mayor rapidez a los cambios culturales que las generaciones anteriores.",
            pronunciationHint: "dei adápted mor suíftli tu káltchural chéinyis dan did prívias yéneréishons",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: La institución valora la perseverancia, al igual que sus miembros",
          targetTokens: ["The", "institution", "values", "perseverance,", "as", "do", "all", "its", "members"],
          distractorTokens: ["like", "does", "valuing", "doing"],
          successTipSpanish: "¡Elegancia comparativa! 'as do all its members' con inversión simétrica.",
          mistakeHintSpanish: "Usa 'as do' antes del sujeto plural 'all its members'.",
        },
        voicePractice: {
          sentenceEnglish: "Our department strives for excellence, as do our international partners.",
          spanishMeaning: "Nuestro departamento aspira a la excelencia, al igual que nuestros socios internacionales.",
          pronunciationHint: "áuer dipártment stráivs for ékselens, as du áuer íntarnáshonal pártners",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos comparativos con inversiones estilísticas de 'as do' y 'than did' en Writing Studio.",
        },
      },
    },
  ];
}

