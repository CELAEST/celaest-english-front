import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1InversionEmphasis(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: INVERSIÓN NEGATIVA FORMAL
    {
      title: "Inversión Negativa Formal: Rarely / Under no circumstances",
      focus: "Elegancia y oratoria ejecutiva invirtiendo sujeto y auxiliar (Rarely have I seen...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando abres una frase con un adverbio negativo o restrictivo (Rarely, Seldom, Never, Under no circumstances), la oración invierte el sujeto y el auxiliar como si fuera una pregunta. No dices 'Rarely I have seen', sino 'Rarely have I seen'.",
        formulaSegments: [
          { label: "ADVERBIO NEGATIVO", token: "Rarely / Seldom / Under no circumstances", tone: "violet" },
          { label: "AUXILIAR + SUJETO", token: "have we / should you / did they", tone: "emerald" },
          { label: "VERBO + COMPLEMENTO", token: "witnessed such dedication", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Rarely y Seldom: frecuencia que sorprende",
            segments: [
              { label: "ADVERBIO INICIAL", token: "Rarely / Seldom", tone: "violet" },
              { label: "AUXILIAR + SUJETO", token: "do we / have they", tone: "emerald" },
              { label: "VERBO + RESTO", token: "see such planning", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando dices que algo casi nunca pasa y abres con Rarely o Seldom, el auxiliar salta delante del sujeto, igual que en una pregunta. La señal es la frecuencia negativa al inicio; con el orden normal ('Rarely we see') el registro formal se pierde.",
            exampleEnglish: "Rarely do we see such careful planning.",
          },
          {
            label: "02 · Never: experiencia que no ha ocurrido",
            segments: [
              { label: "ADVERBIO INICIAL", token: "Never", tone: "violet" },
              { label: "AUXILIAR + SUJETO", token: "have I / has she", tone: "emerald" },
              { label: "PARTICIPIO", token: "received such feedback", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando hablas de una experiencia que no ha ocurrido hasta hoy, abres con Never y usas el present perfect invertido: Never have I received... El contraste es con 'I have never received', que es correcto pero neutro y no golpea al inicio.",
            exampleEnglish: "Never have I received such clear feedback.",
          },
          {
            label: "03 · Under no circumstances: límite tajante",
            segments: [
              { label: "FRASE RESTRICTIVA", token: "Under no circumstances", tone: "violet" },
              { label: "MODAL + SUJETO", token: "should you / may visitors", tone: "emerald" },
              { label: "VERBO BASE", token: "sign that contract", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando fijas un límite absoluto en un aviso o un correo, abres con Under no circumstances y pones el modal antes del sujeto: should you. La señal es la prohibición sin excepción; si escribes 'you should', el aviso suena a consejo suave.",
            exampleEnglish: "Under no circumstances may visitors enter this area.",
          },
        ],
        commonMistake: {
          wrong: "Under no circumstances you should share this information.",
          wrongToken: "you should share",
          correct: "Under no circumstances should you share this information.",
          correctToken: "should you share",
          whySpanish: "Tras un adverbio restrictivo inicial, el auxiliar precede obligatoriamente al sujeto.",
        },
        examples: [
          {
            english: "Rarely have we witnessed such genuine dedication to quality.",
            spanish: "Raramente hemos presenciado una dedicación tan genuina a la calidad.",
            pronunciationHint: "rérli jav ui uítnest sach yéniuin dedikéishon",
          },
          {
            english: "Under no circumstances should you compromise on safety.",
            spanish: "Bajo ninguna circunstancia debes comprometer la seguridad.",
            pronunciationHint: "ánder nóu sérkemstánses shud yu kómpramáiz on séifti",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Bajo ninguna circunstancia debemos compartir información confidencial",
          targetTokens: ["Under", "no", "circumstances", "should", "we", "share", "confidential", "details"],
          distractorTokens: ["we", "should", "sharing", "rarely"],
          successTipSpanish: "¡Estructura impecable! Auxiliar 'should' antes del sujeto 'we'.",
          mistakeHintSpanish: "Recuerda invertir: 'Under no circumstances should we share...'.",
        },
        voicePractice: {
          sentenceEnglish: "Rarely have we seen such outstanding commitment.",
          spanishMeaning: "Raramente hemos visto un compromiso tan sobresaliente.",
          pronunciationHint: "rérli jav ui sin sach autstánding komítment",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza discursos históricos y ensayos formales que utilizan inversión estilística.",
        },
      },
    },

    // BASE 2: CLEFT SENTENCES CON WHAT
    {
      title: "Cleft Sentences con What: Focalizar la Idea Central",
      focus: "Poner el reflector sobre el punto crítico (What I really need is...)",
      payload: {
        ruleTaglineSpanish:
          "En lugar de una frase plana como 'I need more clarity', usa una 'cleft sentence': 'What I really need is more clarity'. El pronombre 'What' actúa como un foco de atención que prepara a la audiencia para el dato clave.",
        formulaSegments: [
          { label: "FOCO WHAT", token: "What + Sujeto + Verbo", tone: "violet" },
          { label: "CÓPULA", token: "is / was", tone: "emerald" },
          { label: "NÚCLEO ENFATIZADO", token: "the clarity of the proposal", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Focalizar una idea o una cosa",
            segments: [
              { label: "FOCO WHAT", token: "What we need", tone: "violet" },
              { label: "CÓPULA", token: "is", tone: "emerald" },
              { label: "NÚCLEO ENFATIZADO", token: "a clear timeline", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el dato clave es una cosa o una idea, abres con What + sujeto + verbo y cierras con is + ese núcleo. La señal es que quieres anunciar el foco antes de darlo; el contraste es 'We need a clear timeline', que informa pero no subraya.",
            exampleEnglish: "What we need is a clear timeline.",
          },
          {
            label: "02 · Focalizar una acción con to",
            segments: [
              { label: "FOCO WHAT", token: "What I want", tone: "violet" },
              { label: "CÓPULA", token: "is", tone: "emerald" },
              { label: "ACCIÓN EN INFINITIVO", token: "to finish this today", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el foco es una acción y no un objeto, después de is va el infinitivo con to: What I want is to finish. La señal es que el núcleo empieza por un verbo; si dices 'What I want is finish', la fórmula queda sin marca y suena rota.",
            exampleEnglish: "What I want is to finish this today.",
          },
          {
            label: "03 · Contar qué pasó con was",
            segments: [
              { label: "FOCO WHAT", token: "What happened", tone: "violet" },
              { label: "CÓPULA EN PASADO", token: "was", tone: "emerald" },
              { label: "HECHO COMPLETO", token: "that the client changed the brief", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando explicas un hecho pasado y quieres que el oyente espere el dato, usas What happened was that + el hecho. La señal es narrativa y en pasado; el contraste es con 'The thing that happened was', correcto pero pesado, y con el error 'The that'.",
            exampleEnglish: "What happened was that the client changed the brief.",
          },
        ],
        commonMistake: {
          wrong: "The that I need is more time",
          wrongToken: "The that I need",
          correct: "What I need is more time.",
          correctToken: "What I need",
          whySpanish: "En inglés 'lo que...' se introduce limpiamente con 'What', jamás con 'The that'.",
        },
        examples: [
          {
            english: "What really caught my attention was the clarity of the proposal.",
            spanish: "Lo que realmente me llamó la atención fue la claridad de la propuesta.",
            pronunciationHint: "uot ríeli kot mai aténshon uos de kláriti ov de propóusal",
          },
          {
            english: "What we truly value is consistency over rapid shortcuts.",
            spanish: "Lo que verdaderamente valoramos es la consistencia sobre los atajos rápidos.",
            pronunciationHint: "uot ui trúli váliu is konsístensi óuver rápid shórtkats",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Lo que realmente me llamó la atención fue la propuesta",
          targetTokens: ["What", "really", "caught", "my", "attention", "was", "the", "proposal"],
          distractorTokens: ["The", "that", "is", "catching"],
          successTipSpanish: "¡Perfecto! 'What really caught my attention' enfoca la idea.",
          mistakeHintSpanish: "Abre con 'What really caught my attention was the proposal'.",
        },
        voicePractice: {
          sentenceEnglish: "What we truly value is steady consistency.",
          spanishMeaning: "Lo que verdaderamente valoramos es la consistencia constante.",
          pronunciationHint: "uot ui trúli váliu is stédi konsístensi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Emplea oraciones hendidas en Writing Studio para destacar tus argumentos clave.",
        },
      },
    },

    // BASE 3: CLEFT SENTENCES CON IT
    {
      title: "Cleft Sentences con It: Atribución de Causa y Autoría",
      focus: "Destacar al responsable o la causa decisiva (It was that decision that changed...)",
      payload: {
        ruleTaglineSpanish:
          "Para atribuir con precisión quién o qué causó un acontecimiento, usa 'It was [Elemento] that / who...'. No digas 'My mentor was who helped me', di con elegancia: 'It was my mentor who helped me'.",
        formulaSegments: [
          { label: "INTRODUCCIÓN IT", token: "It is / It was", tone: "violet" },
          { label: "ELEMENTO DESTACADO", token: "that strategic decision", tone: "emerald" },
          { label: "CONECTOR + RESTO", token: "that changed our trajectory", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Atribuir a una persona con who",
            segments: [
              { label: "INTRODUCCIÓN IT", token: "It was", tone: "violet" },
              { label: "PERSONA DESTACADA", token: "the client", tone: "emerald" },
              { label: "WHO + RESTO", token: "who asked for a delay", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el foco es la persona que actuó, usas It was + persona + who + resto. La señal es que respondes a '¿quién lo hizo?'; el contraste es 'The client asked for a delay', que informa sin marcar que esa persona es la clave.",
            exampleEnglish: "It was the client who asked for a delay.",
          },
          {
            label: "02 · Señalar la causa con that",
            segments: [
              { label: "INTRODUCCIÓN IT", token: "It was", tone: "violet" },
              { label: "CAUSA DESTACADA", token: "that delay", tone: "emerald" },
              { label: "THAT + RESTO", token: "that cost us the contract", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el foco es una cosa o un hecho que provocó un cambio, cambias who por that: It was that delay that... La señal es que respondes a '¿qué lo causó?'; con 'That delay cost us the contract' la causa se disuelve entre el resto de la frase.",
            exampleEnglish: "It was that delay that cost us the contract.",
          },
          {
            label: "03 · Destacar un factor que sigue vigente",
            segments: [
              { label: "INTRODUCCIÓN IT", token: "It is", tone: "violet" },
              { label: "FACTOR DESTACADO", token: "trust", tone: "emerald" },
              { label: "THAT + RESTO", token: "that holds this team together", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el factor sigue siendo cierto hoy, mantienes It is en presente y no It was. La señal es una costumbre o un valor que continúa; si dices 'It was trust', lo presentas como algo ya terminado, aunque el equipo siga unido.",
            exampleEnglish: "It is trust that holds this team together.",
          },
        ],
        commonMistake: {
          wrong: "That decision was that changed everything.",
          wrongToken: "That decision was that",
          correct: "It was that decision that changed everything.",
          correctToken: "It was that decision that",
          whySpanish: "La fórmula de hendidura requiere 'It was [X] that/who...'.",
        },
        examples: [
          {
            english: "It was my mentor who pointed out the alternative path.",
            spanish: "Fue mi mentor quien señaló el camino alternativo.",
            pronunciationHint: "it uos mai méntor ju póinted áut di oltérnativ paz",
          },
          {
            english: "It is this commitment that drives long-term success.",
            spanish: "Es este compromiso el que impulsa el éxito a largo plazo.",
            pronunciationHint: "it is dis komítment dat dráivs long-term saksés",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Fue esa decisión la que cambió la dirección del proyecto",
          targetTokens: ["It", "was", "that", "decision", "that", "changed", "the", "direction"],
          distractorTokens: ["Was", "which", "decision", "changing"],
          successTipSpanish: "¡Impecable! 'It was [X] that changed...' destaca la causa raíz.",
          mistakeHintSpanish: "Inicia con 'It was that decision that changed...'.",
        },
        voicePractice: {
          sentenceEnglish: "It was that decision that changed our entire direction.",
          spanishMeaning: "Fue esa decisión la que cambió toda nuestra dirección.",
          pronunciationHint: "it uos dat desíshon dat chéinygd áuer entáier dirékshon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Resalta tus logros y decisiones cruciales usando cleft sentences con 'It was'.",
        },
      },
    },

    // BASE 4: AUXILIAR ENFATIZADOR EN AFIRMATIVO
    {
      title: "Énfasis Afirmativo con Auxiliar: I DO understand",
      focus: "Reafirmar convicción o defenderse de una duda (I do value your perspective)",
      payload: {
        ruleTaglineSpanish:
          "Para expresar una certeza profunda o aclarar un malentendido sin sonar defensivo, inserta 'do / does / did' antes del verbo afirmativo con entonación marcada: 'I DO understand your point'. Suena mucho más natural y maduro que repetir 'really' continuamente.",
        formulaSegments: [
          { label: "SUJETO", token: "I / We / She", tone: "violet" },
          { label: "AUXILIAR ENFÁTICO", token: "do / does / did (tónico)", tone: "emerald" },
          { label: "VERBO FORMA BASE", token: "appreciate / agree / finish", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Aclarar una duda sobre tu postura",
            segments: [
              { label: "SUJETO", token: "I", tone: "violet" },
              { label: "DO TÓNICO", token: "do", tone: "emerald" },
              { label: "VERBO BASE", token: "take your point", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien pone en duda tu postura, insertas do antes del verbo base y lo pronuncias tónico: I do take. La señal es una objeción previa; el contraste es con 'I really take', donde really suena a excusa y no desmiente nada.",
            exampleEnglish: "I do take your point seriously.",
          },
          {
            label: "02 · Confirmar que algo sí ocurrió",
            segments: [
              { label: "SUJETO", token: "We", tone: "violet" },
              { label: "DID TÓNICO", token: "did", tone: "emerald" },
              { label: "VERBO EN BASE", token: "send the figures", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando alguien cree que algo no se hizo y quieres confirmarlo en pasado, usas did + verbo en base: We did send. El error es 'We did sent', porque el auxiliar ya carga el pasado; el contraste es 'We sent', correcto pero sin la aclaración.",
            exampleEnglish: "We did send the figures on Monday.",
          },
          {
            label: "03 · Reforzar en tercera persona",
            segments: [
              { label: "SUJETO", token: "She", tone: "violet" },
              { label: "DOES TÓNICO", token: "does", tone: "emerald" },
              { label: "VERBO EN BASE", token: "check every number", tone: "sky" },
            ],
            explanationSpanish:
              "Con he, she o it el auxiliar es does y el verbo vuelve a la forma base: She does check. La señal es que corriges una suposición equivocada sobre otra persona; sin el auxiliar, 'She checks' informa, pero no desmiente lo que acaban de decir.",
            exampleEnglish: "She does check every number twice.",
          },
        ],
        commonMistake: {
          wrong: "I really really understand",
          wrongToken: "really really",
          correct: "I do understand your perspective.",
          correctToken: "do understand",
          whySpanish: "El auxiliar enfático 'do/did' aporta firmeza elegante sin infantilizar el discurso.",
        },
        examples: [
          {
            english: "I do understand your concern, and we are addressing it right now.",
            spanish: "Sí entiendo tu preocupación, y la estamos atendiendo justo ahora.",
            pronunciationHint: "ai dú anderstánd yor konsérn, and ui ar adrésing it",
          },
          {
            english: "We did complete the review before the final deadline.",
            spanish: "Sí completamos la revisión antes del plazo final.",
            pronunciationHint: "ui díd komplít de riviú bifór de fáinal dédlain",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo sí valoro tu perspectiva honesta",
          targetTokens: ["I", "do", "value", "your", "honest", "perspective"],
          distractorTokens: ["really", "valued", "am", "valuing"],
          successTipSpanish: "¡Exacto! El auxiliar 'do' aporta convicción madura.",
          mistakeHintSpanish: "Construye: 'I do value your honest perspective'.",
        },
        voicePractice: {
          sentenceEnglish: "I do understand your concern, and we are acting on it.",
          spanishMeaning: "Sí entiendo tu preocupación, y estamos actuando al respecto.",
          pronunciationHint: "ai dú anderstánd yor konsérn, and ui ar ákting on it",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Practica respuestas con auxiliares enfáticos para responder objeciones con seguridad.",
        },
      },
    },

    // BASE 5: COMPARATIVAS DOBLES CORRELATIVAS
    {
      title: "Comparativas Dobles Proporcionales: The more... the more...",
      focus: "Expresar evolución simultánea de variables (The more we practice, the clearer it gets)",
      payload: {
        ruleTaglineSpanish:
          "Para indicar que el aumento de una variable produce un cambio directo en otra, usa la estructura correlativa: 'The [comparativo]..., the [comparativo]...'. Es la fórmula más compacta y potente para explicar relaciones causa-efecto complejas.",
        formulaSegments: [
          { label: "VARIABLE 1", token: "The more we analyze the findings,", tone: "violet" },
          { label: "VARIABLE 2", token: "the clearer the pattern becomes.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Dos cantidades que crecen juntas",
            segments: [
              { label: "VARIABLE QUE SUBE", token: "The more data we collect,", tone: "violet" },
              { label: "SEGUNDA VARIABLE", token: "the more we learn", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando dos cantidades aumentan al mismo tiempo, repites the + comparativo en los dos bloques: the more... the more... La señal es que ambas variables crecen; si quitas el the inicial, como en 'More we collect', el paralelismo se rompe y suena a traducción.",
            exampleEnglish: "The more data we collect, the more we learn.",
          },
          {
            label: "02 · Una cualidad que mejora",
            segments: [
              { label: "ADJETIVO COMPARATIVO", token: "The clearer the goal,", tone: "violet" },
              { label: "RESULTADO", token: "the faster we decide", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el cambio es de cualidad y no de cantidad, el comparativo es un adjetivo: the clearer, the faster, the earlier. La señal es que describes cómo algo se vuelve; el contraste es con 'the more clear', forma que el inglés evita en adjetivos cortos.",
            exampleEnglish: "The clearer the goal, the faster we decide.",
          },
          {
            label: "03 · Una sube y la otra baja",
            segments: [
              { label: "VARIABLE QUE SUBE", token: "The more we automate,", tone: "violet" },
              { label: "VARIABLE QUE BAJA", token: "the less time we waste", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando una variable sube y la otra baja, el segundo bloque lleva the less o un comparativo inverso: the less time we waste. La señal es que mides lo que se reduce; el contraste es con usar 'the more' por inercia y decir justo lo contrario.",
            exampleEnglish: "The more we automate, the less time we waste.",
          },
        ],
        commonMistake: {
          wrong: "More we practice, more we improve.",
          wrongToken: "More we practice",
          correct: "The more we practice, the more we improve.",
          correctToken: "The more we practice",
          whySpanish: "Ambos miembros requieren obligatoriamente el artículo 'The' antes del adjetivo comparativo.",
        },
        examples: [
          {
            english: "The more we analyze the findings, the clearer the pattern becomes.",
            spanish: "Cuanto más analizamos los hallazgos, más claro se vuelve el patrón.",
            pronunciationHint: "de mor ui ánaláiz de fáindings, de klíerer de pátern bikóms",
          },
          {
            english: "The earlier we establish the guidelines, the smoother the process will be.",
            spanish: "Cuanto antes establezcamos las pautas, más fluido será el proceso.",
            pronunciationHint: "di érlyer ui estáblish de gáidláins, de smúder de próses uil bi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Cuanto más analizamos los datos, más claro es el resultado",
          targetTokens: ["The", "more", "we", "analyze", "the", "data,", "the", "clearer", "the", "result"],
          distractorTokens: ["More", "most", "analyzing", "clear"],
          successTipSpanish: "¡Estructura paralela impecable! 'The more... the clearer...'.",
          mistakeHintSpanish: "Comienza ambos bloques con 'The': 'The more..., the clearer...'.",
        },
        voicePractice: {
          sentenceEnglish: "The more we collaborate, the stronger our outcomes become.",
          spanishMeaning: "Cuanto más colaboramos, más sólidos se vuelven nuestros resultados.",
          pronunciationHint: "de mor ui koláboreit, de strónger áuer áutkams bikóm",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce correlaciones proporcionales en informes de investigación y análisis de tendencias.",
        },
      },
    },

    // BASE 6: INVERSIÓN NARRATIVA DRAMÁTICA
    {
      title: "Inversión Narrativa Inmediata: Hardly had we... when...",
      focus: "Acciones consecutivas inmediatas y dramatismo (Hardly had we arrived when...)",
      payload: {
        ruleTaglineSpanish:
          "Para narrar que una acción ocurrió inmediatamente después de otra, usa 'Hardly had [Sujeto] [Participio] when...'. Es una inversión del Past Perfect que crea suspenso y dinamismo narrativo en relatos y anécdotas de alto nivel.",
        formulaSegments: [
          { label: "INVERSIÓN PASADO PERFECTO", token: "Hardly had we signed the contract", tone: "violet" },
          { label: "CONEXIÓN INMEDIATA", token: "when a new opportunity arose", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Hardly ... when: inmediatez total",
            segments: [
              { label: "INVERSIÓN PASADO PERFECTO", token: "Hardly had I sat down", tone: "violet" },
              { label: "CONEXIÓN INMEDIATA", token: "when the phone rang", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando dos acciones se suceden casi sin pausa, abres con Hardly had + sujeto + participio y cierras con when. La señal es que la primera acción ya había terminado; el contraste es 'Hardly I had sat down', que deja el auxiliar en su sitio y rompe la inversión.",
            exampleEnglish: "Hardly had I sat down when the phone rang.",
          },
          {
            label: "02 · No sooner ... than: la pareja fija",
            segments: [
              { label: "INVERSIÓN PASADO PERFECTO", token: "No sooner had we left", tone: "violet" },
              { label: "CONEXIÓN CON THAN", token: "than the storm hit", tone: "emerald" },
            ],
            explanationSpanish:
              "No sooner dice lo mismo que Hardly, pero exige than en el segundo bloque, nunca when: No sooner had we left than... La señal es la pareja fija no sooner... than; si pones when, la fórmula queda a medias y el oyente espera otra cosa.",
            exampleEnglish: "No sooner had we left than the storm hit.",
          },
          {
            label: "03 · Scarcely ... when: margen mínimo",
            segments: [
              { label: "INVERSIÓN PASADO PERFECTO", token: "Scarcely had she spoken", tone: "violet" },
              { label: "CONEXIÓN INMEDIATA", token: "when the room went silent", tone: "emerald" },
            ],
            explanationSpanish:
              "Scarcely had añade la idea de que la primera acción apenas alcanzó a ocurrir. La señal es un margen mínimo entre las dos acciones; el contraste con Hardly es solo de matiz, porque la estructura y el when final no cambian.",
            exampleEnglish: "Scarcely had she spoken when the room went silent.",
          },
        ],
        commonMistake: {
          wrong: "Hardly we had arrived when it started raining.",
          wrongToken: "Hardly we had arrived",
          correct: "Hardly had we arrived when it started raining.",
          correctToken: "Hardly had we arrived",
          whySpanish: "Tras 'Hardly' o 'Scarcely', el auxiliar 'had' debe colocarse antes del sujeto.",
        },
        examples: [
          {
            english: "Hardly had we finalized the agreement when an unexpected opportunity arose.",
            spanish: "Apenas habíamos finalizado el acuerdo cuando surgió una oportunidad inesperada.",
            pronunciationHint: "járdli jad ui fáinaláizd di agríment uén an ánekspékted óportúniti aróus",
          },
          {
            english: "No sooner had the presentation ended than the questions began.",
            spanish: "Apenas había terminado la presentación cuando comenzaron las preguntas.",
            pronunciationHint: "nóu súner jad de prezantéishon énded dan de kuéstions bigán",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Apenas habíamos firmado el acuerdo cuando surgió una oportunidad",
          targetTokens: ["Hardly", "had", "we", "signed", "the", "agreement", "when", "an", "opportunity", "arose"],
          distractorTokens: ["we", "had", "than", "signing"],
          successTipSpanish: "¡Inversión narrativa exacta! 'Hardly had we signed... when...'.",
          mistakeHintSpanish: "Ordena: 'Hardly had we signed the agreement when...'.",
        },
        voicePractice: {
          sentenceEnglish: "Hardly had the meeting started when a resolution was reached.",
          spanishMeaning: "Apenas había comenzado la reunión cuando se alcanzó una resolución.",
          pronunciationHint: "járdli jad de míting stárted uén a rezolúshon uos richt",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe narraciones dinámicas con inversiones temporales en Writing Studio.",
        },
      },
    },
  ];
}

