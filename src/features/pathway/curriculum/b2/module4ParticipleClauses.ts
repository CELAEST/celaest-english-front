import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4ParticipleClauses(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: CLÃUSULAS DE PARTICIPIO PRESENTE (-ING)
    {
      title: "ClÃ¡usulas de Participio Presente: SÃ­ntesis Activa en -ing",
      focus: "Comprimir oraciones subordinadas pesadas (Realizing the misunderstanding, he clarified...)",
      payload: {
        ruleTaglineSpanish:
          "En lugar de decir oraciones largas con conectores infantiles como 'Because he realized that...', condensa tu idea usando una clÃ¡usula de participio: 'Realizing the error, he called immediately'. Hace que tu discurso suene fluido, maduro y directo.",
        formulaSegments: [
          { label: "PARTICIPIO PRESENTE (-ING)", token: "Realizing the misunderstanding,", tone: "violet" },
          { label: "ACCIÃ“N PRINCIPAL", token: "she clarified her position immediately.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Because she realized the issue, she called (correcto pero bÃ¡sico).",
          wrongToken: "Because she realized",
          correct: "Realizing the issue, she called immediately.",
          correctToken: "Realizing the issue",
          whySpanish: "Las clÃ¡usulas de participio elevan el registro estilÃ­stico al prescindir de 'because' y pronombres redundantes.",
        },
        examples: [
          {
            english: "Realizing the misunderstanding, she clarified her position immediately.",
            spanish: "Al darse cuenta del malentendido, aclarÃ³ su postura de inmediato.",
            pronunciationHint: "rÃ­alaising de mÃ¡isanderstÃ¡nding, shi klÃ¡rifaid jer pozÃ­shon imÃ­dietli",
          },
          {
            english: "Entering the conference hall, we immediately noticed the energetic atmosphere.",
            spanish: "Al entrar en la sala de conferencias, notamos de inmediato la atmÃ³sfera enÃ©rgica.",
            pronunciationHint: "Ã©ntering de kÃ³nferens jol, ui imÃ­dietli nÃ³utist di Ã©neryÃ©tik Ã¡tmosfier",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Al darse cuenta del malentendido, se disculpÃ³ de inmediato",
          targetTokens: ["Realizing", "the", "misunderstanding,", "he", "apologized", "immediately"],
          distractorTokens: ["Because", "realized", "to", "apologize"],
          successTipSpanish: "Â¡SÃ­ntesis elegante! 'Realizing the misunderstanding' condensa la causa.",
          mistakeHintSpanish: "Comienza directamente con el participio en -ing: 'Realizing...'.",
        },
        voicePractice: {
          sentenceEnglish: "Realizing the urgency, our team coordinated the immediate response.",
          spanishMeaning: "Al darse cuenta de la urgencia, nuestro equipo coordinÃ³ la respuesta inmediata.",
          pronunciationHint: "rÃ­alaising di Ã©ryensi, Ã¡uer tim koÃ³rdinÃ©ited di imÃ­diet rispÃ³ns",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Observa clÃ¡usulas de participio en crÃ³nicas y reportajes editoriales de prestigio.",
        },
      },
    },

    // BASE 18: CLÃUSULAS DE PARTICIPIO PASADO (-ED) CON VALOR PASIVO
    {
      title: "ClÃ¡usulas de Participio Pasado: ReducciÃ³n Pasiva Refinada",
      focus: "Reemplazar relativas pasivas pesadas (Seen from this angle, the project works)",
      payload: {
        ruleTaglineSpanish:
          "En vez de escribir 'The initiative, which is viewed from this angle...', utiliza el participio pasado directamente al inicio: 'Viewed from this angle, the initiative works well'. Eliminas la pesadez de 'which is' y transmites elegancia editorial.",
        formulaSegments: [
          { label: "PARTICIPIO PASIVO (-ED / IRREGULAR)", token: "Seen from a neutral perspective,", tone: "violet" },
          { label: "CLÃUSULA INDEPENDIENTE", token: "the agreement benefits both communities.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "The agreement, which was viewed from this side, is positive.",
          wrongToken: "which was viewed",
          correct: "Viewed from this angle, the agreement is positive.",
          correctToken: "Viewed from this angle",
          whySpanish: "El participio inicial simplifica la estructura eliminando pronombres relativos innecesarios.",
        },
        examples: [
          {
            english: "Seen from a neutral perspective, the agreement benefits both communities.",
            spanish: "Visto desde una perspectiva neutral, el acuerdo beneficia a ambas comunidades.",
            pronunciationHint: "sin from a niÃºtral perspÃ©ktiv, di agrÃ­ment bÃ©nefits bÃ³z komiÃºnitis",
          },
          {
            english: "Surrounded by calm nature, the retreat offered complete mental clarity.",
            spanish: "Rodeado de naturaleza tranquila, el retiro ofreciÃ³ completa claridad mental.",
            pronunciationHint: "serÃ¡unded bai kam nÃ©ichur, de ritrÃ­t Ã³ferd komplÃ­t mÃ©ntal klÃ¡riti",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Visto desde una perspectiva neutral, el acuerdo beneficia a ambos",
          targetTokens: ["Seen", "from", "a", "neutral", "perspective,", "the", "agreement", "benefits", "both"],
          distractorTokens: ["Seeing", "which", "was", "benefit"],
          successTipSpanish: "Â¡Elegancia editorial! 'Seen from a neutral perspective' abre con solidez.",
          mistakeHintSpanish: "Abre con el participio pasado pasivo 'Seen from...'.",
        },
        voicePractice: {
          sentenceEnglish: "Guided by shared values, our community achieved lasting harmony.",
          spanishMeaning: "Guiada por valores compartidos, nuestra comunidad logrÃ³ una armonÃ­a duradera.",
          pronunciationHint: "gÃ¡ided bai sherd vÃ¡lius, Ã¡uer komiÃºniti achÃ­vd lÃ¡sting jÃ¡rmoni",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Aplica participios pasivos en resÃºmenes ejecutivos y crÃ­ticas literarias.",
        },
      },
    },

    // BASE 19: PARTICIPIO PERFECTO COMPUESTO (HAVING DONE)
    {
      title: "Participio Perfecto Compuesto: Having done... Secuencia Concluida",
      focus: "Aclarar que una acciÃ³n previa terminÃ³ completamente antes de la siguiente (Having examined...)",
      payload: {
        ruleTaglineSpanish:
          "Si necesitas dejar cristalino que la primera acciÃ³n concluyÃ³ al 100% antes de que ocurriera la segunda, usa 'Having + participio': 'Having completed the review, the board published their recommendations'. Evita la ambigÃ¼edad temporal del simple '-ing'.",
        formulaSegments: [
          { label: "ACCIÃ“N PREVIA CONCLUIDA", token: "Having examined all alternatives,", tone: "violet" },
          { label: "ACCIÃ“N CONSECUTIVA", token: "the committee made a unanimous decision.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Finishing the investigation, the committee published the results (ambigÃ¼edad temporal).",
          wrongToken: "Finishing the investigation",
          correct: "Having finished the investigation, the committee published the results.",
          correctToken: "Having finished",
          whySpanish: "'Having finished' explicita que la investigaciÃ³n terminÃ³ antes de la publicaciÃ³n.",
        },
        examples: [
          {
            english: "Having examined all available alternatives, the committee made a unanimous decision.",
            spanish: "Habiendo examinado todas las alternativas disponibles, el comitÃ© tomÃ³ una decisiÃ³n unÃ¡nime.",
            pronunciationHint: "jÃ¡ving egzÃ¡mind ol avÃ©ilabl oltÃ©rnativs, de komÃ­ti mÃ©id a yunÃ¡nimes desÃ­shon",
          },
          {
            english: "Having spent several years abroad, she adapted effortlessly to the multinational team.",
            spanish: "Habiendo pasado varios aÃ±os en el extranjero, se adaptÃ³ sin esfuerzo al equipo multinacional.",
            pronunciationHint: "jÃ¡ving spent sÃ©veral yiers abrÃ³d, shi adÃ¡pted Ã©fortlesli tu de mÃ¡ltinÃ¡shonal tim",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Habiendo examinado las alternativas, el comitÃ© tomÃ³ una decisiÃ³n",
          targetTokens: ["Having", "examined", "the", "alternatives,", "the", "committee", "made", "a", "decision"],
          distractorTokens: ["Have", "examining", "has", "make"],
          successTipSpanish: "Â¡Secuencia temporal perfecta! 'Having examined' demuestra conclusiÃ³n previa.",
          mistakeHintSpanish: "Inicia con 'Having examined the alternatives,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Having reviewed all feedback, we refined our methodology.",
          spanishMeaning: "Habiendo revisado toda la retroalimentaciÃ³n, refinamos nuestra metodologÃ­a.",
          pronunciationHint: "jÃ¡ving riviÃºd ol fÃ­dback, ui rifÃ¡ind Ã¡uer mezodÃ³lodzhi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Narra antecedentes y logros previos con fluidez y concisiÃ³n en entrevistas ejecutivas.",
        },
      },
    },

    // BASE 20: PREPOSICIONES CON ESTRUCTURA DE PARTICIPIO
    {
      title: "Preposiciones Seguidas de Participio: Despite knowing / Upon arriving",
      focus: "Conectar relaciones lÃ³gicas sin oraciones subordinadas pesadas (Despite knowing the risks...)",
      payload: {
        ruleTaglineSpanish:
          "Toda preposiciÃ³n en inglÃ©s (Despite, In spite of, Upon, Without, By, After) exige directamente la forma '-ing' si le sigue un verbo. JamÃ¡s coloques un verbo conjugado ni 'that' despuÃ©s de una preposiciÃ³n simple: 'Despite knowing the risks' (a pesar de conocer los riesgos).",
        formulaSegments: [
          { label: "PREPOSICIÃ“N + VERBO -ING", token: "Despite knowing the risks / Upon arriving", tone: "violet" },
          { label: "COMPLEMENTO + ACCIÃ“N", token: "the team decided to proceed with caution.", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "Despite that he knew the risks, he continued (calco del espaÃ±ol 'a pesar de que').",
          wrongToken: "Despite that he knew",
          correct: "Despite knowing the risks, he continued.",
          correctToken: "Despite knowing the risks",
          whySpanish: "En inglÃ©s moderno se dice 'Despite knowing', sin 'that' ni verbo en pasado.",
        },
        examples: [
          {
            english: "Despite knowing the challenges involved, the team decided to continue the mission.",
            spanish: "A pesar de conocer los desafÃ­os involucrados, el equipo decidiÃ³ continuar la misiÃ³n.",
            pronunciationHint: "dispÃ¡it nÃ³uing de chÃ¡linyis invÃ³lvd, de tim desÃ¡ided tu kontÃ­niu de mÃ­shon",
          },
          {
            english: "Upon arriving at the venue, all delegates completed their credential verification.",
            spanish: "Al llegar al recinto, todos los delegados completaron la verificaciÃ³n de sus credenciales.",
            pronunciationHint: "apÃ³n arrÃ¡iving at de vÃ©niu, ol dÃ©legÃ¡its komplÃ­ted der kredÃ©nshal vÃ©rifikÃ©ishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: A pesar de conocer los riesgos, el equipo decidiÃ³ continuar",
          targetTokens: ["Despite", "knowing", "the", "risks,", "the", "team", "decided", "to", "continue"],
          distractorTokens: ["that", "knew", "in", "spite"],
          successTipSpanish: "Â¡Estructura preposicional limpia! 'Despite knowing' sin 'that'.",
          mistakeHintSpanish: "Usa 'Despite' directamente con el verbo en -ing: 'Despite knowing...'.",
        },
        voicePractice: {
          sentenceEnglish: "Upon completing the module, participants receive official certification.",
          spanishMeaning: "Al completar el mÃ³dulo, los participantes reciben certificaciÃ³n oficial.",
          pronunciationHint: "apÃ³n komplÃ­ting de mÃ³diul, partÃ­sipants risÃ­v ofÃ­shal sÃ©rtifikÃ©ishon",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica preposiciones seguidas de participio en tratados internacionales y reglamentos.",
        },
      },
    },

    // BASE 21: ESTRUCTURAS CAUSATIVAS AVANZADAS
    {
      title: "Causativas Avanzadas: Have something done vs Get someone to do",
      focus: "Servicios contratados a terceros vs persuasiÃ³n activa (Have it repaired / Get him to review)",
      payload: {
        ruleTaglineSpanish:
          "Usa 'Have + objeto + participio' cuando encargas un servicio profesional ('We had our office renovated'). Pero si persuades o convences a alguien para que realice una tarea, usa 'Get + persona + to + infinitivo': 'We got the specialist to review the data'.",
        formulaSegments: [
          { label: "SERVICIO PROFESIONAL", token: "We had the documents certified by an official notary", tone: "violet" },
          { label: "PERSUASIÃ“N ACTIVA", token: "We got the specialist to review the preliminary data", tone: "emerald" },
        ],
        commonMistake: {
          wrong: "I repaired my car yesterday (cuando lo llevÃ³ al taller mecÃ¡nico).",
          wrongToken: "I repaired my car",
          correct: "I had my car repaired yesterday.",
          correctToken: "I had my car repaired",
          whySpanish: "En inglÃ©s, decir 'I repaired my car' significa que tÃº mismo te ensuciaste las manos con la llave inglesa.",
        },
        examples: [
          {
            english: "We managed to get the architect to review the blueprints without extra charge.",
            spanish: "Logramos convencer al arquitecto para que revisara los planos sin cargo adicional.",
            pronunciationHint: "ui mÃ¡nidzd tu get di Ã¡rkitekt tu riviÃº de blÃºprints uidÃ¡ut Ã©kstra chardy",
          },
          {
            english: "They are having their main gallery renovated before the international exhibition.",
            spanish: "EstÃ¡n haciendo renovar su galerÃ­a principal antes de la exposiciÃ³n internacional.",
            pronunciationHint: "dei ar jÃ¡ving der mÃ©in gÃ¡leri rÃ©novÃ©ited bifÃ³r di Ã­ntarnÃ¡shonal Ã©ksibÃ­shon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglÃ©s: Logramos convencer al arquitecto para que revisara los planos",
          targetTokens: ["We", "managed", "to", "get", "the", "architect", "to", "review", "the", "plans"],
          distractorTokens: ["have", "reviewed", "reviewing", "gotten"],
          successTipSpanish: "Â¡Causativa de persuasiÃ³n lograda! 'get [alguien] to review'.",
          mistakeHintSpanish: "Con 'get' se usa infinitivo con 'to': 'get the architect to review'.",
        },
        voicePractice: {
          sentenceEnglish: "We had the contract inspected by an independent legal counsel.",
          spanishMeaning: "Hicimos inspeccionar el contrato por un asesor legal independiente.",
          pronunciationHint: "ui jad de kÃ¡ntrakt inspÃ©kted bai an Ã­ndipÃ©ndent lÃ­gal kÃ¡unsel",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe informes de gestiÃ³n delegada y contrataciÃ³n de servicios especializados en Writing Studio.",
        },
      },
    },
  ];
}

