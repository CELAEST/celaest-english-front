import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6DiscourseHedging(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: MARCADORES DE CONCESIÓN FORMAL (WHEREAS / NONETHELESS)
    {
      title: "Marcadores de Concesión Formal: Whereas / Nonetheless",
      focus: "Contrastar posturas opuestas con elegancia analítica (Some preferred X, whereas others...)",
      payload: {
        ruleTaglineSpanish:
          "Para comparar dos realidades contrastantes en una sola frase con rigor analítico, usa 'whereas' (mientras que) o 'nonetheless' (no obstante). Superas el repetitivo 'but' y le das a tu argumento la solidez de un editorial de prensa internacional.",
        formulaSegments: [
          { label: "POSTURA A", token: "Some participants favored the traditional approach,", tone: "violet" },
          { label: "CONTRASTE ANALÍTICO", token: "whereas others embraced modern innovation.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Dos posturas en una frase (whereas)",
            segments: [
              { label: "POSTURA A", token: "Some reviewers welcomed the change,", tone: "violet" },
              { label: "CONECTOR WHEREAS", token: ", whereas", tone: "emerald" },
              { label: "POSTURA B", token: "others found it unnecessary.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando pones las dos realidades en la misma frase y quieres que el lector las compare, usa 'whereas' entre las cláusulas con coma. Se diferencia de 'but': 'but' solo marca oposición, mientras que 'whereas' compara dos grupos distintos.",
            exampleEnglish: "Some prefer remote work, whereas others miss the office.",
          },
          {
            label: "02 · Conceder y mantener la tesis (nonetheless)",
            segments: [
              { label: "DATO ADVERSO", token: "The launch was delayed;", tone: "violet" },
              { label: "NONETHELESS", token: "nonetheless,", tone: "emerald" },
              { label: "TESIS QUE SE MANTIENE", token: "the product remains profitable.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando primero aceptas un dato negativo y después defiendes tu conclusión, abre la segunda parte con 'nonetheless'. Va detrás de punto o de punto y coma, nunca después de 'and'. Si solo dices 'but', cedes terreno y suena coloquial.",
            exampleEnglish: "The venue was small; nonetheless, the event was a success.",
          },
        ],
        commonMistake: {
          wrong: "Some like this, in the other side others like that",
          wrongToken: "in the other side",
          correct: "Some favor this approach, whereas others prefer that alternative.",
          correctToken: "whereas others prefer",
          whySpanish: "El conector 'whereas' vincula directamente dos alternativas contrastantes sin rodeos.",
        },
        examples: [
          {
            english: "Some participants favored the traditional approach, whereas others embraced innovation.",
            spanish: "Algunos participantes favorecieron el enfoque tradicional, mientras que otros acogieron la innovación.",
            pronunciationHint: "sam partísipants féivord de tradíshonal apróuch, uér-az áders embréist inovéishon",
          },
          {
            english: "The initial results were modest; nonetheless, the overarching trend remains highly encouraging.",
            spanish: "Los resultados iniciales fueron modestos; no obstante, la tendencia general sigue siendo muy alentadora.",
            pronunciationHint: "di iníshal rizólts uér módest; nándeless, di óuverárching trend riméins jáili enkóridying",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Algunos prefirieron el método tradicional, mientras que otros acogieron la innovación",
          targetTokens: ["Some", "preferred", "the", "traditional", "method,", "whereas", "others", "embraced", "innovation"],
          distractorTokens: ["but", "while", "preferring", "innovating"],
          successTipSpanish: "¡Contraste editorial impecable! 'whereas' vincula ambas perspectivas con rigor.",
          mistakeHintSpanish: "Une las cláusulas con 'whereas others embraced innovation'.",
        },
        voicePractice: {
          sentenceEnglish: "The challenges were significant; nonetheless, the team delivered excellence.",
          spanishMeaning: "Los desafíos fueron significativos; no obstante, el equipo entregó excelencia.",
          pronunciationHint: "de chálinyis uér signífikant; nándeless, de tim delíverd ékselens",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Lee ensayos analíticos y artículos de opinión en The Economist con conectores de concesión.",
        },
      },
    },

    // BASE 28: MARCADORES DE REFORMULACIÓN Y PRECISIÓN
    {
      title: "Reformulación y Precisión: To put it another way / That is to say",
      focus: "Aclarar ideas complejas sin sonar condescendiente (To put it another way...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando explicas un concepto denso y quieres sintetizarlo para tu interlocutor, no digas 'I mean' (muy informal). Usa marcadores de precisión ejecutiva: 'To put it another way' (dicho de otra manera) o 'That is to say' (es decir).",
        formulaSegments: [
          { label: "IDEA COMPLEJA PREVIA", token: "We need to optimize resource allocation.", tone: "violet" },
          { label: "CONECTOR DE PRECISIÓN", token: "To put it another way,", tone: "emerald" },
          { label: "SÍNTESIS CLARA", token: "we must prioritize long-term quality over speed.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Simplificar una idea densa (to put it another way)",
            segments: [
              { label: "IDEA TÉCNICA", token: "The protocol requires sequential validation.", tone: "violet" },
              { label: "TO PUT IT ANOTHER WAY", token: "To put it another way,", tone: "emerald" },
              { label: "VERSIÓN LLANA", token: "we check every step in order.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la frase anterior fue técnica y temes que el oyente se pierda, abre una oración nueva con 'To put it another way' y repite la idea con palabras simples. No digas 'I mean': suena coloquial y poco preparado en una reunión.",
            exampleEnglish: "To put it another way, the plan costs less.",
          },
          {
            label: "02 · Precisar el alcance (that is to say)",
            segments: [
              { label: "DATO PREVIO", token: "The invitation is optional;", tone: "violet" },
              { label: "THAT IS TO SAY", token: "that is to say,", tone: "emerald" },
              { label: "PRECISIÓN EXACTA", token: "nobody is obliged to attend.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando quieres ajustar el alcance de un término, usa 'that is to say': la segunda parte explica exactamente lo mismo, sin añadir datos nuevos. Se diferencia de 'for example', que presenta un caso concreto y deja el resto abierto.",
            exampleEnglish: "The budget is fixed; that is to say, no extras.",
          },
        ],
        commonMistake: {
          wrong: "I mean, what I want to say is that we must focus",
          wrongToken: "I mean, what I want to say",
          correct: "To put it another way, we must prioritize core quality.",
          correctToken: "To put it another way",
          whySpanish: "'To put it another way' proyecta claridad de pensamiento y respeto por la inteligencia del oyente.",
        },
        examples: [
          {
            english: "To put it another way, we must prioritize durability over immediate convenience.",
            spanish: "Dicho de otra manera, debemos priorizar la durabilidad sobre la conveniencia inmediata.",
            pronunciationHint: "tu put it anáder uéi, ui mast praióritáiz diúrabilíti óuver imídiet konvíniens",
          },
          {
            english: "Every contributor retains complete autonomy; that is to say, participation is entirely voluntary.",
            spanish: "Cada colaborador conserva total autonomía; es decir, la participación es enteramente voluntaria.",
            pronunciationHint: "évri kontríbiutor ritéins komplít otónomi; dat is tu séi, partísipéishon is entáierli vólantari",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Dicho de otra manera, debemos priorizar la calidad sobre la velocidad",
          targetTokens: ["To", "put", "it", "another", "way,", "we", "must", "prioritize", "quality"],
          distractorTokens: ["I", "mean", "putting", "prioritizing"],
          successTipSpanish: "¡Reformulación ejecutiva! 'To put it another way,' sintetiza con tacto.",
          mistakeHintSpanish: "Abre con 'To put it another way, we must prioritize quality'.",
        },
        voicePractice: {
          sentenceEnglish: "To put it another way, clarity must precede speed in every initiative.",
          spanishMeaning: "Dicho de otra manera, la claridad debe preceder a la velocidad en cada iniciativa.",
          pronunciationHint: "tu put it anáder uéi, kláriti mast prisíd spid in évri iníshietiv",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos argumentativos reformulando tesis complejas con elegancia en Writing Studio.",
        },
      },
    },

    // BASE 29: EL ARTE DEL HEDGING (DIPLOMACIA Y CAUTELA PROFESIONAL)
    {
      title: "El Arte del Hedging: Arguably / It would appear that...",
      focus: "Elegancia diplomática evitando afirmaciones tajantes (It would seem that...)",
      payload: {
        ruleTaglineSpanish:
          "En el mundo profesional anglosajón, afirmar cosas de manera dogmática ('This is wrong' / 'This is the best') se percibe como tosco. El 'hedging' modera tu afirmación con diplomacia científica: 'It would appear that this assumption is inaccurate' o 'Arguably, this is the most balanced solution'.",
        formulaSegments: [
          { label: "MODIFICADOR DIPLOMÁTICO", token: "Arguably / It would appear that", tone: "violet" },
          { label: "PROPUESTA O EVALUACIÓN", token: "this is the most sustainable approach we have evaluated.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Evaluar sin imponer (arguably)",
            segments: [
              { label: "ARGUABLY", token: "Arguably,", tone: "violet" },
              { label: "EVALUACIÓN MODERADA", token: "this option carries the lowest risk.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando defiendes una evaluación sin imponerla, abre con 'Arguably' y coma: presentas tu juicio como defendible, no como verdad. Si dices 'This is definitely the best', cierras el debate y en el mundo anglosajón suena tosco y dogmático.",
            exampleEnglish: "Arguably, the first design solves more problems.",
          },
          {
            label: "02 · Leer indicios (it would appear that)",
            segments: [
              { label: "IT WOULD APPEAR THAT", token: "It would appear that", tone: "violet" },
              { label: "CONCLUSIÓN PROVISIONAL", token: "the supplier is behind schedule.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando los datos apuntan a algo pero aún no lo confirmas, di 'It would appear that' más la oración completa. Se diferencia de 'It is clear that', que afirma sin pruebas: esta fórmula deja espacio para corregir si aparece nueva información.",
            exampleEnglish: "It would appear that demand is slowing down.",
          },
        ],
        commonMistake: {
          wrong: "This is completely wrong and unacceptable",
          wrongToken: "is completely wrong",
          correct: "It would appear that this conclusion requires further verification.",
          correctToken: "It would appear that",
          whySpanish: "El 'hedging' no es debilidad: es el sello de los profesionales que debaten con madurez e inteligencia emocional.",
        },
        examples: [
          {
            english: "Arguably, this is the most sustainable approach we have evaluated so far.",
            spanish: "Podría decirse que este es el enfoque más sostenible que hemos evaluado hasta ahora.",
            pronunciationHint: "árgiuabli, dis is de móust sostéinabl apróuch ui jav iváliueited sou far",
          },
          {
            english: "The preliminary findings tend to suggest that gradual adaptation yields stronger resilience.",
            spanish: "Los hallazgos preliminares tienden a sugerir que la adaptación gradual genera mayor resiliencia.",
            pronunciationHint: "de prilíminari fáindings tend tu sadyést dat grádyual adaptéishon yilds strónger rizíliens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Podría decirse que este es el enfoque más sostenible considerado",
          targetTokens: ["Arguably,", "this", "is", "the", "most", "sustainable", "approach", "considered"],
          distractorTokens: ["Sure", "absolute", "approaching", "is"],
          successTipSpanish: "¡Diplomacia científica! 'Arguably, this is the most sustainable...' aporta matiz reflexivo.",
          mistakeHintSpanish: "Inicia con el adverbio de matiz 'Arguably, this is...'.",
        },
        voicePractice: {
          sentenceEnglish: "It would appear that our initial estimates were slightly conservative.",
          spanishMeaning: "Parecería que nuestras estimaciones iniciales fueron ligeramente conservadoras.",
          pronunciationHint: "it uud apíer dat áuer iníshal éstimáits uér sláitli konsérvativ",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Defiende posturas en debates internacionales aplicando hedging para moderar opiniones.",
        },
      },
    },

    // BASE 30: COLOCACIONES AVANZADAS Y BINOMIOS IDIOMÁTICOS
    {
      title: "Binomios Idiomáticos Naturales: Give and take / Safe and sound",
      focus: "Frases emparejadas fijas de orden inmutable (pros and cons, give and take)",
      payload: {
        ruleTaglineSpanish:
          "El inglés tiene parejas de palabras unidas por 'and' cuyo orden es sagrado e inmutable: 'give and take' (concesiones mutuas), 'pros and cons' (ventajas y desventajas), 'safe and sound' (sano y salvo), 'ups and downs' (altibajos). Cambiar el orden ('cons and pros') delata inmediatamente a un principiante.",
        formulaSegments: [
          { label: "SUJETO O CONTEXTO", token: "Any successful partnership requires", tone: "violet" },
          { label: "BINOMIO INMUTABLE", token: "a healthy degree of give and take.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Orden fijo del binomio (pros and cons)",
            segments: [
              { label: "VERBO DE ANÁLISIS", token: "The report lists", tone: "violet" },
              { label: "PAR EN SU ORDEN", token: "the pros and cons", tone: "emerald" },
              { label: "CONTEXTO", token: "of the merger", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando nombras un binomio, respeta el orden en que se escucha: 'pros and cons', nunca 'cons and pros'. El orden es fijo por convención, igual que 'give and take' o 'safe and sound'; invertirlo delata traducción y obliga al oyente a reconstruir la frase.",
            exampleEnglish: "The report lists the pros and cons clearly.",
          },
          {
            label: "02 · Elegir el binomio natural (ups and downs)",
            segments: [
              { label: "CONTEXTO DE CAMBIO", token: "Any long partnership has its", tone: "violet" },
              { label: "BINOMIO IDIOMÁTICO", token: "ups and downs", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando hablas de etapas buenas y malas, el inglés prefiere el binomio fijo antes que una lista traducida. 'Ups and downs' suena natural; 'good moments and bad moments' suena a diccionario. El par se usa en plural y no necesita artículo delante.",
            exampleEnglish: "Their friendship survived many ups and downs.",
          },
        ],
        commonMistake: {
          wrong: "We weighed the cons and pros of the proposal.",
          wrongToken: "cons and pros",
          correct: "We weighed the pros and cons of the proposal.",
          correctToken: "pros and cons",
          whySpanish: "El orden de los binomios es fijo por convención fonética y rítmica.",
        },
        examples: [
          {
            english: "Any genuine collaboration requires a healthy dose of give and take.",
            spanish: "Cualquier colaboración genuina requiere una dosis saludable de concesiones mutuas.",
            pronunciationHint: "éni yéniuin koláboreishon rikuáiers a jélzi dous ov giv and téik",
          },
          {
            english: "Despite the turbulent journey, all team members arrived safe and sound.",
            spanish: "A pesar del viaje turbulento, todos los miembros del equipo llegaron sanos y salvos.",
            pronunciationHint: "dispáit de térbiulent yérni, ol tim mémbers arráivd séif and sáund",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Toda negociación requiere una buena dosis de concesiones mutuas",
          targetTokens: ["Any", "negotiation", "requires", "a", "healthy", "dose", "of", "give", "and", "take"],
          distractorTokens: ["take", "and", "give", "giving"],
          successTipSpanish: "¡Naturalidad idiomática! 'give and take' con su orden inmutable.",
          mistakeHintSpanish: "El orden correcto es siempre 'give and take'.",
        },
        voicePractice: {
          sentenceEnglish: "We carefully evaluated all the pros and cons before committing.",
          spanishMeaning: "Evaluamos minuciosamente todos los pros y contras antes de comprometernos.",
          pronunciationHint: "ui kérfuli iváliueited ol de pros and kons bifór komíting",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Identifica binomios y colocaciones idiomáticas en crónicas y literatura contemporánea.",
        },
      },
    },

    // BASE 31: PREGUNTAS RETÓRICAS Y ÉNFASIS ORATORIO
    {
      title: "Preguntas Retóricas y Énfasis Rítmico: Is it really worth...?",
      focus: "Guiar la conclusión del oyente y generar impacto reflexivo (Is it really worth the risk?)",
      payload: {
        ruleTaglineSpanish:
          "Una pregunta retórica no busca una respuesta, sino plantar una certeza irrefutable en la mente del interlocutor: 'Is it really worth compromising our integrity for short-term gain?'. Combina auxiliar inicial con modulación rítmica para inspirar convicción.",
        formulaSegments: [
          { label: "PREGUNTA RETÓRICA", token: "Is it really worth compromising", tone: "violet" },
          { label: "CONTRASTE ÉTICO/ESTRATÉGICO", token: "our core values for a temporary gain?", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Cuestionar el costo (is it really worth...)",
            segments: [
              { label: "PREGUNTA INVERTIDA", token: "Is it really worth", tone: "violet" },
              { label: "ACCIÓN EN -ING", token: "delaying the launch", tone: "emerald" },
              { label: "PRECIO", token: "to protect one opinion?", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el oyente ya aceptó una decisión costosa, pregúntale por el precio con 'Is it really worth' más verbo en -ing. El auxiliar va delante y 'really' marca la duda; una afirmación como 'It is worth it' informa, pero no lo obliga a reflexionar.",
            exampleEnglish: "Is it really worth losing the whole team?",
          },
          {
            label: "02 · Rebatir lo evidente (why would anyone...)",
            segments: [
              { label: "WHY WOULD", token: "Why would anyone", tone: "violet" },
              { label: "VERBO BASE", token: "trust", tone: "emerald" },
              { label: "EVIDENCIA", token: "that vague promise?", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando la contradicción es tan visible que el público puede concluirla solo, usa 'Why would anyone' más verbo base. Mantienes el orden interrogativo sin 'do' y dejas que la evidencia hable; con 'Nobody would accept that' das la conclusión y pierdes la fuerza.",
            exampleEnglish: "Why would anyone trust that vague promise?",
          },
        ],
        commonMistake: {
          wrong: "It is worth compromising?",
          wrongToken: "It is worth",
          correct: "Is it really worth compromising our standards?",
          correctToken: "Is it really worth",
          whySpanish: "Las preguntas retóricas exigen el orden interrogativo estricto con el adverbio 'really' para máxima fuerza.",
        },
        examples: [
          {
            english: "Is it really worth compromising our foundational values for a temporary advantage?",
            spanish: "¿Acaso vale la pena comprometer nuestros valores fundamentales por una ventaja temporal?",
            pronunciationHint: "is it ríeli uérz kómpramáising áuer faundéishonal válius for a témporari advántidzh",
          },
          {
            english: "Why on earth would anyone overlook such a transparent inconsistency?",
            spanish: "¿Por qué demonios pasaría alguien por alto una inconsistencia tan evidente?",
            pronunciationHint: "uái on érz uud éniuan óuverluk sach a transpérent ínkonsístensi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: ¿Acaso vale la pena comprometer nuestros valores por un beneficio breve?",
          targetTokens: ["Is", "it", "really", "worth", "compromising", "our", "values", "for", "short-term", "gain?"],
          distractorTokens: ["It", "worth", "compromise", "to"],
          successTipSpanish: "¡Fuerza oratoria! 'Is it really worth compromising...' planta la reflexión.",
          mistakeHintSpanish: "Ordena: 'Is it really worth compromising our values for short-term gain?'.",
        },
        voicePractice: {
          sentenceEnglish: "Is it really worth sacrificing quality for immediate convenience?",
          spanishMeaning: "¿Acaso vale la pena sacrificar la calidad por conveniencia inmediata?",
          pronunciationHint: "is it ríeli uérz sákrifáising kuóliti for imídiet konvíniens",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Cierra tus ensayos y artículos de opinión con preguntas retóricas de alto impacto.",
        },
      },
    },

    // BASE 32: GRAN CERTIFICACIÓN B2 / PUENTE DEFINITIVO A C1
    {
      title: "Gran Certificación B2: El Salto Definitivo a C1",
      focus: "Integración de oratoria, inversión, condicional contrafáctico y diplomacia ejecutiva",
      payload: {
        ruleTaglineSpanish:
          "Esta es la cúspide de B2. Has dominado las inversiones retóricas ('Rarely have we...'), las oraciones hendidas ('What we need...'), los condicionales mixtos ('Had we known...') y el arte diplomático del hedging. Ya no traduces: formulas argumentos con elegancia, precisión y autoridad.",
        formulaSegments: [
          { label: "INVERSIÓN INICIAL", token: "Rarely have we encountered such complexity.", tone: "violet" },
          { label: "CLEFT FOCUS", token: "What matters now is that we proceed with absolute clarity.", tone: "emerald" },
          { label: "HIPÓTESIS AVANZADA", token: "Had we acted earlier, our position would be even stronger.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Abrir con inversión (rarely have we...)",
            segments: [
              { label: "ADVERBIO NEGATIVO", token: "Seldom", tone: "violet" },
              { label: "AUXILIAR + SUJETO", token: "have we", tone: "emerald" },
              { label: "RESTO DE LA IDEA", token: "seen a market this volatile.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando abres con un adverbio negativo o limitante ('seldom', 'rarely', 'never'), invierte auxiliar y sujeto: 'Seldom have we seen'. Si mantienes el orden normal ('We seldom have seen'), la frase es correcta pero pierde el énfasis de apertura que espera un registro C1.",
            exampleEnglish: "Never have we faced so many delays.",
          },
          {
            label: "02 · Enfocar el núcleo (what we need is...)",
            segments: [
              { label: "WHAT + SUJETO", token: "What the board needs", tone: "violet" },
              { label: "IS + FOCO", token: "is a realistic deadline.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando una sola idea debe quedar en el centro, ábrela con 'What + sujeto + verbo' y remata con 'is': la atención cae en el final. Se diferencia de la oración plana ('We need a deadline'), que reparte el peso y no destaca nada.",
            exampleEnglish: "What the client wants is a shorter report.",
          },
          {
            label: "03 · Reproche hipotético (had we known...)",
            segments: [
              { label: "CONDICIÓN SIN IF", token: "Had we checked the data,", tone: "violet" },
              { label: "RESULTADO PASADO", token: "we would have avoided the loss.", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando lamentas una decisión pasada en registro formal, quita 'if' e invierte: 'Had we checked...' en lugar de 'If we had checked'. Con el resultado en 'would have + participio' la frase queda cerrada; si dejas 'if', sigues siendo correcto pero menos elegante.",
            exampleEnglish: "Had we known the cost, we would have waited.",
          },
        ],
        commonMistake: {
          wrong: "Seldom we have seen such commitment.",
          wrongToken: "recaer en básico",
          correct: "Seldom have we seen such commitment.",
          correctToken: "espontaneidad C1",
          whySpanish: "El estudiante C1 se distingue por su variedad sintáctica y su naturalidad reflexiva sin vacilaciones.",
        },
        examples: [
          {
            english: "Rarely have we faced such an intricate challenge. What we must do now is proceed with measured caution.",
            spanish: "Raramente hemos enfrentado un desafío tan intrincado. Lo que debemos hacer ahora es avanzar con cautela medida.",
            pronunciationHint: "rérli jav ui féist sach an íntriket cháliny. uot ui mast du náu is prosíd uid méshurd kóshon",
          },
          {
            english: "Had we foreseen this global shift, our community would be in an even stronger position today.",
            spanish: "Si hubiéramos previsto este cambio global, nuestra comunidad estaría hoy en una posición aún más sólida.",
            pronunciationHint: "jad ui forsín dis glóubal shift, áuer komiúniti uud bi in an íven strónger pozíshon tudéi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Raramente hemos enfrentado tal desafío. Lo que debemos hacer ahora es avanzar con cautela",
          targetTokens: ["Rarely", "have", "we", "faced", "such", "a", "challenge.", "What", "we", "must", "do", "is", "proceed", "with", "caution"],
          distractorTokens: ["we", "have", "that", "proceeding"],
          successTipSpanish: "¡Maestría B2 certificada! Inversión retórica y cleft sentence combinadas a la perfección.",
          mistakeHintSpanish: "Combina: 'Rarely have we faced such a challenge. What we must do is proceed with caution'.",
        },
        voicePractice: {
          sentenceEnglish: "Rarely have we seen such dedication. What matters now is maintaining our momentum.",
          spanishMeaning: "Raramente hemos visto tanta dedicación. Lo que importa ahora es mantener nuestro impulso.",
          pronunciationHint: "rérli jav ui sin sach dedikéishon. uot máters náu is méintéining áuer moméntam",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Demuestra tu fluidez avanzada en una conversación de graduación B2 con el mentor Gonzalo.",
        },
      },
    },
  ];
}

