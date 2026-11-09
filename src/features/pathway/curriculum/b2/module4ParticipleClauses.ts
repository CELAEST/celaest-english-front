import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule4ParticipleClauses(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 17: CLÁUSULAS DE PARTICIPIO PRESENTE (-ING)
    {
      title: "Cláusulas de Participio Presente: Síntesis Activa en -ing",
      focus: "Comprimir oraciones subordinadas pesadas (Realizing the misunderstanding, he clarified...)",
      payload: {
        ruleTaglineSpanish:
          "En lugar de decir oraciones largas con conectores infantiles como 'Because he realized that...', condensa tu idea usando una cláusula de participio: 'Realizing the error, he called immediately'. Hace que tu discurso suene fluido, maduro y directo.",
        formulaSegments: [
          { label: "PARTICIPIO PRESENTE (-ING)", token: "Realizing the misunderstanding,", tone: "violet" },
          { label: "ACCIÓN PRINCIPAL", token: "she clarified her position immediately.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Causa que explica",
            segments: [
              { label: "CAUSA EN -ING", token: "Realizing the delay,", tone: "violet" },
              { label: "CONSECUENCIA", token: "she called the client at once.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la cláusula en -ing explica el motivo de la acción principal, la pones delante y omites 'because'. Si mantienes 'because she realized', la frase sigue siendo correcta, pero suena básica y lenta en una presentación.",
            exampleEnglish: "Realizing the delay, she called the client.",
          },
          {
            label: "02 · Acción simultánea",
            segments: [
              { label: "ACCIÓN SIMULTÁNEA", token: "Walking to the office,", tone: "violet" },
              { label: "ACCIÓN PRINCIPAL", token: "he reviewed the agenda.", tone: "emerald" },
            ],
            explanationSpanish:
              "Usas esta forma cuando las dos acciones ocurren al mismo tiempo y comparten sujeto. La señal es que puedes sustituir 'while he was walking' por la cláusula en -ing. Si la primera acción termina antes, en cambio, necesitas 'Having'.",
            exampleEnglish: "Walking to the office, he reviewed the agenda.",
          },
        ],
        commonMistake: {
          wrong: "Because she realized the issue, she called immediately.",
          wrongToken: "Because she realized",
          correct: "Realizing the issue, she called immediately.",
          correctToken: "Realizing the issue",
          whySpanish: "Las cláusulas de participio elevan el registro estilístico al prescindir de 'because' y pronombres redundantes.",
        },
        examples: [
          {
            english: "Realizing the misunderstanding, she clarified her position immediately.",
            spanish: "Al darse cuenta del malentendido, aclaró su postura de inmediato.",
            pronunciationHint: "ríalaising de máisanderstánding, shi klárifaid jer pozíshon imídietli",
          },
          {
            english: "Entering the conference hall, we immediately noticed the energetic atmosphere.",
            spanish: "Al entrar en la sala de conferencias, notamos de inmediato la atmósfera enérgica.",
            pronunciationHint: "éntering de kónferens jol, ui imídietli nóutist di éneryétik átmosfier",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Al darse cuenta del malentendido, se disculpó de inmediato",
          targetTokens: ["Realizing", "the", "misunderstanding,", "he", "apologized", "immediately"],
          distractorTokens: ["Because", "realized", "to", "apologize"],
          successTipSpanish: "¡Síntesis elegante! 'Realizing the misunderstanding' condensa la causa.",
          mistakeHintSpanish: "Comienza directamente con el participio en -ing: 'Realizing...'.",
        },
        voicePractice: {
          sentenceEnglish: "Realizing the urgency, our team coordinated the immediate response.",
          spanishMeaning: "Al darse cuenta de la urgencia, nuestro equipo coordinó la respuesta inmediata.",
          pronunciationHint: "ríalaising di éryensi, áuer tim koórdinéited di imídiet rispóns",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Observa cláusulas de participio en crónicas y reportajes editoriales de prestigio.",
        },
      },
    },

    // BASE 18: CLÁUSULAS DE PARTICIPIO PASADO (-ED) CON VALOR PASIVO
    {
      title: "Cláusulas de Participio Pasado: Reducción Pasiva Refinada",
      focus: "Reemplazar relativas pasivas pesadas (Seen from this angle, the project works)",
      payload: {
        ruleTaglineSpanish:
          "En vez de escribir 'The initiative, which is viewed from this angle...', utiliza el participio pasado directamente al inicio: 'Viewed from this angle, the initiative works well'. Eliminas la pesadez de 'which is' y transmites elegancia editorial.",
        formulaSegments: [
          { label: "PARTICIPIO PASIVO (-ED / IRREGULAR)", token: "Seen from a neutral perspective,", tone: "violet" },
          { label: "CLÁUSULA INDEPENDIENTE", token: "the agreement benefits both communities.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Punto de vista",
            segments: [
              { label: "ÁNGULO O PERSPECTIVA", token: "Seen from the street,", tone: "violet" },
              { label: "CONCLUSIÓN", token: "the building looks narrow.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la relativa pasiva 'which is seen from...' solo aporta un punto de vista, la reduces a participio pasado al inicio. La señal es que el sujeto de la principal recibe la acción. Con 'which is' la versión larga sigue siendo válida, pero pesa más.",
            exampleEnglish: "Seen from the street, the building looks narrow.",
          },
          {
            label: "02 · Reacción causada",
            segments: [
              { label: "CAUSA EN PARTICIPIO", token: "Surprised by the decision,", tone: "violet" },
              { label: "REACCIÓN", token: "the team asked for details.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el participio pasado describe la reacción del sujeto ante algo, va delante y comparte sujeto con la principal. La señal es un verbo de emoción como surprised o pleased. Si conservas 'because the team was surprised', la frase se alarga y suena a informe escolar.",
            exampleEnglish: "Surprised by the decision, the team asked questions.",
          },
          {
            label: "03 · Condición disponible",
            segments: [
              { label: "CONDICIÓN REDUCIDA", token: "Given more time,", tone: "violet" },
              { label: "RESULTADO POSIBLE", token: "we could refine the proposal.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la condición es un recurso disponible, 'given' + sustantivo sustituye a 'if we are given'. La señal es que hablas de tiempo, dinero o datos, no de una acción futura. Si la condición depende de una acción, en cambio, vuelves a 'if'.",
            exampleEnglish: "Given more time, we could refine the proposal.",
          },
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
            pronunciationHint: "sin from a niútral perspéktiv, di agríment bénefits bóz komiúnitis",
          },
          {
            english: "Surrounded by calm nature, the retreat offered complete mental clarity.",
            spanish: "Rodeado de naturaleza tranquila, el retiro ofreció completa claridad mental.",
            pronunciationHint: "seráunded bai kam néichur, de ritrít óferd komplít méntal kláriti",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Visto desde una perspectiva neutral, el acuerdo beneficia a ambos",
          targetTokens: ["Seen", "from", "a", "neutral", "perspective,", "the", "agreement", "benefits", "both"],
          distractorTokens: ["Seeing", "which", "was", "benefit"],
          successTipSpanish: "¡Elegancia editorial! 'Seen from a neutral perspective' abre con solidez.",
          mistakeHintSpanish: "Abre con el participio pasado pasivo 'Seen from...'.",
        },
        voicePractice: {
          sentenceEnglish: "Guided by shared values, our community achieved lasting harmony.",
          spanishMeaning: "Guiada por valores compartidos, nuestra comunidad logró una armonía duradera.",
          pronunciationHint: "gáided bai sherd válius, áuer komiúniti achívd lásting jármoni",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Aplica participios pasivos en resúmenes ejecutivos y críticas literarias.",
        },
      },
    },

    // BASE 19: PARTICIPIO PERFECTO COMPUESTO (HAVING DONE)
    {
      title: "Participio Perfecto Compuesto: Having done... Secuencia Concluida",
      focus: "Aclarar que una acción previa terminó completamente antes de la siguiente (Having examined...)",
      payload: {
        ruleTaglineSpanish:
          "Si necesitas dejar cristalino que la primera acción concluyó al 100% antes de que ocurriera la segunda, usa 'Having + participio': 'Having completed the review, the board published their recommendations'. Evita la ambigüedad temporal del simple '-ing'.",
        formulaSegments: [
          { label: "ACCIÓN PREVIA CONCLUIDA", token: "Having examined all alternatives,", tone: "violet" },
          { label: "ACCIÓN CONSECUTIVA", token: "the committee made a unanimous decision.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Secuencia ya cerrada",
            segments: [
              { label: "ACCIÓN PREVIA TERMINADA", token: "Having signed the contract,", tone: "violet" },
              { label: "SIGUIENTE PASO", token: "the partners announced the merger.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la primera acción terminó del todo antes de la segunda, 'Having + participio' marca el orden sin ambigüedad. La señal es que puedes añadir 'first... then...'. Si usas solo -ing ('Signing the contract'), en cambio, el oyente no sabe si firmaron antes o durante el anuncio.",
            exampleEnglish: "Having signed the contract, the partners announced the merger.",
          },
          {
            label: "02 · Causa previa",
            segments: [
              { label: "CAUSA YA OCURRIDA", token: "Having missed the deadline,", tone: "violet" },
              { label: "EFECTO", token: "the team lost the contract.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la causa ocurrió antes y sigue explicando el resultado, 'Having + participio' deja claro que el daño ya estaba hecho. La señal es un resultado negativo en la principal. Con 'Because they missed', en cambio, el orden temporal queda menos marcado.",
            exampleEnglish: "Having missed the deadline, the team lost the contract.",
          },
          {
            label: "03 · Pasiva previa",
            segments: [
              { label: "PASIVA PREVIA CON BEEN", token: "Having been warned twice,", tone: "violet" },
              { label: "DECISIÓN", token: "the board suspended the licence.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando la acción previa recae sobre el sujeto, necesitas 'Having been + participio'; sin 'been' dirías que él advirtió a otros. La señal es que el sujeto no ejecuta la acción, la recibe. Con voz activa previa, en cambio, basta 'Having + participio'.",
            exampleEnglish: "Having been warned twice, the board suspended the licence.",
          },
        ],
        commonMistake: {
          wrong: "Finishing the investigation, the committee published the results",
          wrongToken: "Finishing the investigation",
          correct: "Having finished the investigation, the committee published the results.",
          correctToken: "Having finished",
          whySpanish: "'Having finished' explicita que la investigación terminó antes de la publicación.",
        },
        examples: [
          {
            english: "Having examined all available alternatives, the committee made a unanimous decision.",
            spanish: "Habiendo examinado todas las alternativas disponibles, el comité tomó una decisión unánime.",
            pronunciationHint: "jáving egzámind ol avéilabl oltérnativs, de komíti méid a yunánimes desíshon",
          },
          {
            english: "Having spent several years abroad, she adapted effortlessly to the multinational team.",
            spanish: "Habiendo pasado varios años en el extranjero, se adaptó sin esfuerzo al equipo multinacional.",
            pronunciationHint: "jáving spent séveral yiers abród, shi adápted éfortlesli tu de máltináshonal tim",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Habiendo examinado las alternativas, el comité tomó una decisión",
          targetTokens: ["Having", "examined", "the", "alternatives,", "the", "committee", "made", "a", "decision"],
          distractorTokens: ["Have", "examining", "has", "make"],
          successTipSpanish: "¡Secuencia temporal perfecta! 'Having examined' demuestra conclusión previa.",
          mistakeHintSpanish: "Inicia con 'Having examined the alternatives,...'.",
        },
        voicePractice: {
          sentenceEnglish: "Having reviewed all feedback, we refined our methodology.",
          spanishMeaning: "Habiendo revisado toda la retroalimentación, refinamos nuestra metodología.",
          pronunciationHint: "jáving riviúd ol fídback, ui rifáind áuer mezodólodzhi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Narra antecedentes y logros previos con fluidez y concisión en entrevistas ejecutivas.",
        },
      },
    },

    // BASE 20: PREPOSICIONES CON ESTRUCTURA DE PARTICIPIO
    {
      title: "Preposiciones Seguidas de Participio: Despite knowing / Upon arriving",
      focus: "Conectar relaciones lógicas sin oraciones subordinadas pesadas (Despite knowing the risks...)",
      payload: {
        ruleTaglineSpanish:
          "Toda preposición en inglés (Despite, In spite of, Upon, Without, By, After) exige directamente la forma '-ing' si le sigue un verbo. Jamás coloques un verbo conjugado ni 'that' después de una preposición simple: 'Despite knowing the risks' (a pesar de conocer los riesgos).",
        formulaSegments: [
          { label: "PREPOSICIÓN + VERBO -ING", token: "Despite knowing the risks / Upon arriving", tone: "violet" },
          { label: "COMPLEMENTO + ACCIÓN", token: "the team decided to proceed with caution.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Concesión con despite",
            segments: [
              { label: "PREPOSICIÓN DE CONTRASTE", token: "Despite facing criticism,", tone: "violet" },
              { label: "ACCIÓN MANTENIDA", token: "the director kept the plan.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres decir 'a pesar de + verbo', usas 'despite' o 'in spite of' seguido de -ing, nunca de 'that'. La señal es que el verbo va justo después de la preposición. Si escribes 'despite that he knew', en cambio, calcas el español y suena incorrecto.",
            exampleEnglish: "Despite facing criticism, the director kept the plan.",
          },
          {
            label: "02 · Momento inmediato",
            segments: [
              { label: "INMEDIATEZ FORMAL", token: "Upon receiving the file,", tone: "violet" },
              { label: "PRIMERA REACCIÓN", token: "the lawyer requested a meeting.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando una acción ocurre justo después de otra y quieres marcar inmediatez formal, 'upon' u 'on' + -ing sustituye a 'as soon as'. La señal es un trámite o aviso que llega. Si la secuencia importa más que la velocidad, en cambio, 'after + -ing' es más neutro.",
            exampleEnglish: "Upon receiving the file, the lawyer requested a meeting.",
          },
          {
            label: "03 · Método con by",
            segments: [
              { label: "MEDIO O MÉTODO", token: "By reviewing the data,", tone: "violet" },
              { label: "RESULTADO", token: "the analyst found the error.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando explicas con qué medio se logra un resultado, 'by + -ing' responde a la pregunta 'how'. La señal es que la segunda parte es el efecto del método. Si no hubo método sino ausencia de algo, en cambio, la preposición correcta es 'without'.",
            exampleEnglish: "By reviewing the data, the analyst found the error.",
          },
        ],
        commonMistake: {
          wrong: "Despite that he knew the risks, he continued",
          wrongToken: "Despite that he knew",
          correct: "Despite knowing the risks, he continued.",
          correctToken: "Despite knowing the risks",
          whySpanish: "En inglés moderno se dice 'Despite knowing', sin 'that' ni verbo en pasado.",
        },
        examples: [
          {
            english: "Despite knowing the challenges involved, the team decided to continue the mission.",
            spanish: "A pesar de conocer los desafíos involucrados, el equipo decidió continuar la misión.",
            pronunciationHint: "dispáit nóuing de chálinyis invólvd, de tim desáided tu kontíniu de míshon",
          },
          {
            english: "Upon arriving at the venue, all delegates completed their credential verification.",
            spanish: "Al llegar al recinto, todos los delegados completaron la verificación de sus credenciales.",
            pronunciationHint: "apón arráiving at de véniu, ol délegáits komplíted der kredénshal vérifikéishon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: A pesar de conocer los riesgos, el equipo decidió continuar",
          targetTokens: ["Despite", "knowing", "the", "risks,", "the", "team", "decided", "to", "continue"],
          distractorTokens: ["that", "knew", "in", "spite"],
          successTipSpanish: "¡Estructura preposicional limpia! 'Despite knowing' sin 'that'.",
          mistakeHintSpanish: "Usa 'Despite' directamente con el verbo en -ing: 'Despite knowing...'.",
        },
        voicePractice: {
          sentenceEnglish: "Upon completing the module, participants receive official certification.",
          spanishMeaning: "Al completar el módulo, los participantes reciben certificación oficial.",
          pronunciationHint: "apón komplíting de módiul, partísipants risív ofíshal sértifikéishon",
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
      focus: "Servicios contratados a terceros vs persuasión activa (Have it repaired / Get him to review)",
      payload: {
        ruleTaglineSpanish:
          "Usa 'Have + objeto + participio' cuando encargas un servicio profesional ('We had our office renovated'). Pero si persuades o convences a alguien para que realice una tarea, usa 'Get + persona + to + infinitivo': 'We got the specialist to review the data'.",
        formulaSegments: [
          { label: "SERVICIO PROFESIONAL", token: "We had the documents certified by an official notary", tone: "violet" },
          { label: "PERSUASIÓN ACTIVA", token: "We got the specialist to review the preliminary data", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Servicio contratado",
            segments: [
              { label: "SERVICIO PROFESIONAL", token: "We had the office repainted", tone: "violet" },
              { label: "TERCERO IMPLÍCITO", token: "before the annual audit.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando pagas a un profesional para que haga algo, usas 'have + objeto + participio' y no dices quién lo hizo. La señal es que tú no ejecutas la acción. Si escribes 'I repainted the office', en cambio, afirmas que lo hiciste con tus manos.",
            exampleEnglish: "We had the office repainted before the audit.",
          },
          {
            label: "02 · Persuadir a alguien",
            segments: [
              { label: "PERSONA PERSUADIDA", token: "We got the supplier to lower", tone: "violet" },
              { label: "RESULTADO DE LA INSISTENCIA", token: "the price by ten percent.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando convences o presionas a alguien para que actúe, usas 'get + persona + to + infinitivo'; la persona sí aparece. La señal es que hubo negociación. Si solo contrataste el servicio, en cambio, 'have + objeto + participio' es la forma correcta.",
            exampleEnglish: "We got the supplier to lower the price.",
          },
          {
            label: "03 · Contratiempo sufrido",
            segments: [
              { label: "SUCESO NO DESEADO", token: "He had his laptop stolen", tone: "violet" },
              { label: "LUGAR DEL HECHO", token: "at the central station.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando algo malo le ocurre a alguien y no lo provocó, también usas 'have + objeto + participio'. La señal es que el sujeto sufre la acción. Si dices 'He stole his laptop', en cambio, lo acusas a él del robo y cambias por completo el sentido.",
            exampleEnglish: "He had his laptop stolen at the station.",
          },
        ],
        commonMistake: {
          wrong: "I repaired my car yesterday",
          wrongToken: "I repaired my car",
          correct: "I had my car repaired yesterday.",
          correctToken: "I had my car repaired",
          whySpanish: "En inglés, decir 'I repaired my car' significa que tú mismo te ensuciaste las manos con la llave inglesa.",
        },
        examples: [
          {
            english: "We managed to get the architect to review the blueprints without extra charge.",
            spanish: "Logramos convencer al arquitecto para que revisara los planos sin cargo adicional.",
            pronunciationHint: "ui mánidzd tu get di árkitekt tu riviú de blúprints uidáut ékstra chardy",
          },
          {
            english: "They are having their main gallery renovated before the international exhibition.",
            spanish: "Están haciendo renovar su galería principal antes de la exposición internacional.",
            pronunciationHint: "dei ar jáving der méin gáleri rénovéited bifór di íntarnáshonal éksibíshon",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Logramos convencer al arquitecto para que revisara los planos",
          targetTokens: ["We", "managed", "to", "get", "the", "architect", "to", "review", "the", "plans"],
          distractorTokens: ["have", "reviewed", "reviewing", "gotten"],
          successTipSpanish: "¡Causativa de persuasión lograda! 'get [alguien] to review'.",
          mistakeHintSpanish: "Con 'get' se usa infinitivo con 'to': 'get the architect to review'.",
        },
        voicePractice: {
          sentenceEnglish: "We had the contract inspected by an independent legal counsel.",
          spanishMeaning: "Hicimos inspeccionar el contrato por un asesor legal independiente.",
          pronunciationHint: "ui jad de kántrakt inspékted bai an índipéndent lígal káunsel",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe informes de gestión delegada y contratación de servicios especializados en Writing Studio.",
        },
      },
    },
  ];
}

