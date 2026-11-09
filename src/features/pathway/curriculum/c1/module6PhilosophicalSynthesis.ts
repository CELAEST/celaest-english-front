import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule6PhilosophicalSynthesis(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 27: MARCADORES DE SÍNTESIS FILOSÓFICA
    {
      title: "Marcadores de Síntesis Trascendental: In the final analysis / Notwithstanding",
      focus: "Cerrar disertaciones complejas con visión panorámica, madurez y profundidad filosófica",
      payload: {
        ruleTaglineSpanish:
          "Para sintetizar un dilema complejo pesando todas sus aristas, abre con 'In the final analysis' (en última instancia / en el análisis final). Y para reconocer obstáculos superados sin restar mérito al logro: 'Notwithstanding these early hurdles, the outcome was exemplary'.",
        formulaSegments: [
          { label: "SÍNTESIS FILOSÓFICA", token: "In the final analysis,", tone: "violet" },
          { label: "TESIS TRASCENDENTAL", token: "authenticity and intellectual rigor", tone: "emerald" },
          { label: "CONCLUSIÓN INVARIABLE", token: "remain our most enduring assets.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Cierre de disertación",
            segments: [
              { label: "APERTURA DE SÍNTESIS", token: "In the final analysis,", tone: "violet" },
              { label: "JUICIO PANORÁMICO", token: "every costly decision proved justified.", tone: "sky" },
            ],
            explanationSpanish:
              "Cierra cuando ya pesaste todas las aristas y necesitás una visión de conjunto. 'Finally' solo ordena el discurso; 'In the final analysis' anuncia un juicio que resume el debate entero y da autoridad al cierre.",
            exampleEnglish: "In the final analysis, patience outlasted every clever strategy.",
          },
          {
            label: "02 · Obstáculo ya superado",
            segments: [
              { label: "CONCESIÓN PREVIA", token: "Notwithstanding the early delays,", tone: "emerald" },
              { label: "LOGRO INTACTO", token: "the outcome remained exemplary.", tone: "sky" },
            ],
            explanationSpanish:
              "Úsalo para reconocer un obstáculo superado sin restarle mérito al logro: entra delante de una frase nominal. Con 'although' necesitarías sujeto y verbo; 'notwithstanding' se engancha directo al sustantivo.",
            exampleEnglish: "Notwithstanding the early setbacks, the expedition reached its summit.",
          },
        ],
        commonMistake: {
          wrong: "At the end of all, authenticity remains paramount.",
          wrongToken: "At the end of all",
          correct: "In the final analysis, authenticity remains paramount.",
          correctToken: "In the final analysis",
          whySpanish: "'In the final analysis' es el conector canónico de cierre en la filosofía analítica y el ensayo culto.",
        },
        examples: [
          {
            english: "In the final analysis, authenticity remains our most valuable asset.",
            spanish: "En última instancia, la autenticidad sigue siendo nuestro activo más valioso.",
            pronunciationHint: "in de fáinal análisis, ózentísiti riméins áuer móust váliuabl áset",
          },
          {
            english: "Notwithstanding significant logistical friction, the conference achieved historic attendance.",
            spanish: "No obstante la notable fricción logística, la conferencia logró una asistencia histórica.",
            pronunciationHint: "nót-uidstánding signífikant lodyístikal fríkshon, de kónferens achívd jistórik aténdans",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: En última instancia, la autenticidad sigue siendo nuestro activo más valioso",
          targetTokens: ["In", "the", "final", "analysis,", "authenticity", "remains", "our", "most", "valuable", "asset"],
          distractorTokens: ["At", "end", "being", "valued"],
          successTipSpanish: "¡Cierre filosófico impecable! 'In the final analysis,' sintetiza con autoridad moral e intelectual.",
          mistakeHintSpanish: "Abre con 'In the final analysis, authenticity remains...'.",
        },
        voicePractice: {
          sentenceEnglish: "In the final analysis, genuine progress is measured by human dignity and shared purpose.",
          spanishMeaning: "En última instancia, el progreso genuino se mide por la dignidad humana y el propósito compartido.",
          pronunciationHint: "in de fáinal análisis, yéniuin prógres is méshurd bai jiúman dígniti and sherd pérpos",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Lee conclusiones de monografías filosóficas y ensayos de cierre en Oxford University Press.",
        },
      },
    },

    // BASE 28: CONECTORES DISCURSIVOS DE GIRO ESTRATÉGICO
    {
      title: "Giro Dialéctico: Having said that / By the same token",
      focus: "Pivotar entre tesis y antítesis reconociendo la validez simultánea de ambas dimensiones",
      payload: {
        ruleTaglineSpanish:
          "'Having said that' (dicho esto / habiendo establecido esto) es el conector predilecto de los líderes reflexivos para matizar su propia afirmación previa: 'The proposal is remarkably ambitious; having said that, we must not overlook the logistical complexities'. Y 'by the same token' significa 'de igual manera / por esa misma razón'.",
        formulaSegments: [
          { label: "POSTURA AFIRMATIVA", token: "The ambitious plan holds extraordinary potential;", tone: "violet" },
          { label: "GIRO REFLEXIVO", token: "having said that,", tone: "emerald" },
          { label: "MATIZ PRUDENTE", token: "we must not underestimate implementation hurdles.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Matizar tu propia tesis",
            segments: [
              { label: "POSTURA PREVIA", token: "The strategy is bold;", tone: "violet" },
              { label: "GIRO QUE RECONOCE", token: "having said that,", tone: "emerald" },
              { label: "MATIZ PRUDENTE", token: "the risks deserve a hearing.", tone: "sky" },
            ],
            explanationSpanish:
              "Gira después de una afirmación fuerte que no querés abandonar. 'But' suena a refutación; 'having said that' conserva lo dicho y añade la objeción, y por eso es el giro del líder reflexivo.",
            exampleEnglish: "Having said that, we still lack a realistic timetable.",
          },
          {
            label: "02 · Extender la misma razón",
            segments: [
              { label: "RAZÓN YA ACEPTADA", token: "Autonomy raises commitment;", tone: "violet" },
              { label: "EXTENSIÓN DEL ARGUMENTO", token: "by the same token,", tone: "emerald" },
              { label: "SEGUNDO CASO", token: "clear goals raise focus.", tone: "sky" },
            ],
            explanationSpanish:
              "Úsalo cuando la misma razón que justifica lo anterior justifica lo siguiente: extiende el argumento, no lo contradice. Si querés conceder algo en contra, la opción es 'having said that'.",
            exampleEnglish: "By the same token, remote teams need written norms.",
          },
        ],
        commonMistake: {
          wrong: "Having said this, we must proceed with caution.",
          wrongToken: "Having said this",
          correct: "Having said that, we must proceed with caution.",
          correctToken: "Having said that",
          whySpanish: "La fórmula discursiva fija en inglés es siempre 'Having said that', con 'that' anafórico.",
        },
        examples: [
          {
            english: "The plan is ambitious; having said that, we must not underestimate the logistical challenges.",
            spanish: "El plan es ambicioso; dicho esto, no debemos subestimar los desafíos logísticos.",
            pronunciationHint: "de plan is ambíshus; jáving sed dat, ui mast not ánderéstimeit de lodyístikal chálinyis",
          },
          {
            english: "Autonomy is vital; by the same token, mutual accountability preserves coherence.",
            spanish: "La autonomía es vital; por la misma razón, la rendición de cuentas mutua preserva la coherencia.",
            pronunciationHint: "otónomi is váital; bai de séim tóuken, miúchual akaúntabíliti prizérvs kojírens",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: El plan es ambicioso; dicho esto, no debemos subestimar los desafíos",
          targetTokens: ["The", "plan", "is", "ambitious;", "having", "said", "that,", "we", "must", "not", "underestimate", "challenges"],
          distractorTokens: ["this", "saying", "have", "underestimated"],
          successTipSpanish: "¡Equilibrio dialéctico perfecto! 'having said that,' equilibra ambición con prudencia.",
          mistakeHintSpanish: "Inserta 'having said that,' tras el punto y coma.",
        },
        voicePractice: {
          sentenceEnglish: "Innovation is crucial; having said that, foundational reliability must never be compromised.",
          spanishMeaning: "La innovación es crucial; dicho esto, la confiabilidad fundamental jamás debe ser comprometida.",
          pronunciationHint: "ínovéishon is krúshal; jáving sed dat, faundéishonal rílaiabíliti mast néver bi kómpramáizd",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Matiza tus propias afirmaciones en entrevistas directivas aplicando giros con 'Having said that'.",
        },
      },
    },

    // BASE 29: ENTONACIÓN RÍTMICA, CADENCIA Y PAUSAS DRAMÁTICAS
    {
      title: "Cadencia y Pausas Estratégicas: El Arte del Pacing Oratorio",
      focus: "Modular el ritmo y el silencio deliberado en inglés oral para transmitir autoridad sin alzar la voz",
      payload: {
        ruleTaglineSpanish:
          "En el nivel C1, la voz no compite por volumen: compite por peso y gravedad. Aprende a hacer una pausa deliberada de un segundo justo antes de tu término clave: 'What we require today is not haste... [pausa] ...but clarity'. El silencio genera expectación y comunica dominio absoluto del espacio escénico.",
        formulaSegments: [
          { label: "APERTURA CON TONO DESCENDENTE", token: "What we require today is not haste,", tone: "violet" },
          { label: "PAUSA SILENCIOSA (1 SEG)", token: "[deliberate strategic pause]", tone: "emerald" },
          { label: "RESOLUCIÓN SOLEMNE", token: "but unwavering clarity of purpose.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Pausa antes del término clave",
            segments: [
              { label: "NEGACIÓN SIN CULMINAR", token: "What we need is not speed,", tone: "violet" },
              { label: "PAUSA DE UN SEGUNDO", token: "[silencio deliberado]", tone: "emerald" },
              { label: "TÉRMINO QUE CAE", token: "but judgment.", tone: "sky" },
            ],
            explanationSpanish:
              "Haz el silencio justo antes del término que quieres que quede sonando. Si aceleras y lo dices todo seguido, el oyente no distingue lo importante; la pausa le da un lugar exacto donde poner la atención.",
            exampleEnglish: "We asked not for applause, but for honest scrutiny.",
          },
          {
            label: "02 · Enumeración con remate",
            segments: [
              { label: "ANUNCIO DE LA LISTA", token: "Three things matter here:", tone: "violet" },
              { label: "MICRO-PAUSA ENTRE ÍTEMS", token: "resolve · restraint ·", tone: "emerald" },
              { label: "REMATEN CON PESO", token: "and quiet courage.", tone: "sky" },
            ],
            explanationSpanish:
              "En una enumeración, marca cada ítem con una micro-pausa y baja el tono en el último: así el cierre se oye como conclusión. Leer la lista de corrido la convierte en un dato más y pierde el peso oratorio.",
            exampleEnglish: "Three things matter here: resolve, restraint, and quiet courage.",
          },
        ],
        commonMistake: {
          wrong: "What we require today is not haste but clarity.",
          wrongToken: "rapidez atropellada",
          correct: "What we require today is not haste, but clarity.",
          correctToken: "pacing ejecutivo",
          whySpanish: "Los grandes oradores anglosajones dominan el silencio como un instrumento musical de persuasión.",
        },
        examples: [
          {
            english: "What we require today is not haste, but unwavering clarity of purpose.",
            spanish: "Lo que requerimos hoy no es prisa, sino una inquebrantable claridad de propósito.",
            pronunciationHint: "uot ui rikuáier tudéi is not jéist, bat anuéivering kláriti ov pérpos",
          },
          {
            english: "Success in this realm demands three things: patience, discipline, and above all, humility.",
            spanish: "El éxito en este ámbito exige tres cosas: paciencia, disciplina y, por encima de todo, humildad.",
            pronunciationHint: "saksés in dis relm dimánds zri zings: péishens, dísaplin, and abóv ol, jiumíliti",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Lo que requerimos no es prisa, sino inquebrantable claridad de propósito",
          targetTokens: ["What", "we", "require", "is", "not", "haste,", "but", "unwavering", "clarity", "of", "purpose"],
          distractorTokens: ["quickness", "requiring", "are", "hasty"],
          successTipSpanish: "¡Cadencia magistral! La antítesis rítmica 'not haste, but unwavering clarity' resuena en la mente.",
          mistakeHintSpanish: "Ordena: 'What we require is not haste, but unwavering clarity of purpose'.",
        },
        voicePractice: {
          sentenceEnglish: "True leadership is not proclaimed through volume, but demonstrated through consistent action.",
          spanishMeaning: "El verdadero liderazgo no se proclama con volumen, sino que se demuestra con acción coherente.",
          pronunciationHint: "tru lídership is not prokléimd zru vólium, bat démonstréited zru konsístent ákshon",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Graba tu voz aplicando pausas dramáticas y modulación descendente en las simulaciones de Interview.",
        },
      },
    },

    // BASE 30: PARES MÍNIMOS DE REGISTRO EXTREMO
    {
      title: "Pares Mínimos de Registro Extremo: Imply vs Infer / Comprise vs Compose",
      focus: "Erradicar las últimas confusiones semánticas sutiles que incluso confunden a nativos promedio",
      payload: {
        ruleTaglineSpanish:
          "En C1 la precisión semántica es sagrada: El orador insinúa ('The speaker implies that...'), mientras que el oyente deduce ('The listener infers that...'). 'The committee comprises twelve members' (el todo comprende las partes, sin 'of'), mientras que 'The committee is composed of twelve members'.",
        formulaSegments: [
          { label: "ACCIÓN DEL EMISOR", token: "Are you implying that our findings", tone: "violet" },
          { label: "CONTENIDO INFERIDO", token: "are fundamentally incomplete,", tone: "emerald" },
          { label: "ACCIÓN DEL RECEPTOR", token: "or should I infer a different concern?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Emisor que insinúa",
            segments: [
              { label: "RECEPTOR INTERPELA", token: "Are you implying that", tone: "violet" },
              { label: "CONTENIDO NO DICHO", token: "the review was rushed?", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'imply' cuando hablas del que emite: dice algo sin decirlo del todo. Si preguntas por lo que tú deduces del otro, el verbo cambia a 'infer'; ese cruce es el error que delata al que no domina el par.",
            exampleEnglish: "I was not implying that your report was careless.",
          },
          {
            label: "02 · Receptor que deduce",
            segments: [
              { label: "EVIDENCIA DISPONIBLE", token: "From the survey data,", tone: "violet" },
              { label: "DEDUCCIÓN DEL OYENTE", token: "we may infer", tone: "emerald" },
              { label: "CONCLUSIÓN PROVISIONAL", token: "a widening skills gap.", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'infer' cuando tú, como lector u oyente, sacas una conclusión a partir de evidencia. Va con 'from' más la fuente de la que deduces; 'imply' no lleva esa fuente porque no deduce: emite la señal.",
            exampleEnglish: "From these figures we infer a steady decline.",
          },
          {
            label: "03 · Todo que comprende sus partes",
            segments: [
              { label: "CONJUNTO", token: "The panel", tone: "violet" },
              { label: "VERBO DEL TODO", token: "comprises", tone: "emerald" },
              { label: "PARTES SIN 'OF'", token: "five independent reviewers.", tone: "sky" },
            ],
            explanationSpanish:
              "Usa 'comprise' cuando el conjunto va primero y las partes después, sin 'of'. El giro inverso cambia de verbo: 'is composed of'. Decir 'is comprised of' es el error más perseguido en los exámenes C1.",
            exampleEnglish: "The panel comprises five independent reviewers.",
          },
        ],
        commonMistake: {
          wrong: "What are you inferring?",
          wrongToken: "inferring",
          correct: "What are you implying?",
          correctToken: "implying",
          whySpanish: "'Imply' es emitir una insinuación; 'Infer' es extraer una deducción de lo que escuchas.",
        },
        examples: [
          {
            english: "Are you implying that our preliminary conclusions are inaccurate?",
            spanish: "¿Estás insinuando que nuestras conclusiones preliminares son inexactas?",
            pronunciationHint: "ar yu implái-ing dat áuer prilíminari konklúshons ar inákiuret?",
          },
          {
            english: "The coalition comprises eight independent civic organizations.",
            spanish: "La coalición comprende ocho organizaciones cívicas independientes.",
            pronunciationHint: "de kóalíshon kompráizes éit índipéndent sívik órganaiséishons",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: ¿Estás insinuando que nuestras conclusiones preliminares son inexactas?",
          targetTokens: ["Are", "you", "implying", "that", "our", "preliminary", "conclusions", "are", "inaccurate?"],
          distractorTokens: ["inferring", "imply", "is", "inaccurately"],
          successTipSpanish: "¡Diferenciación exacta! 'implying' es la acción del emisor al insinuar.",
          mistakeHintSpanish: "Usa 'implying' para referirte a la insinuación que hace tu interlocutor.",
        },
        voicePractice: {
          sentenceEnglish: "From these comprehensive findings, we may safely infer a steady positive trend.",
          spanishMeaning: "A partir de estos hallazgos integrales, podemos deducir con certeza una tendencia positiva constante.",
          pronunciationHint: "from diz kómprejénsiv fáindings, ui mei séifli infér a stédi pósitiv trend",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza el uso riguroso de 'imply', 'infer' y 'comprise' en artículos de The Economist.",
        },
      },
    },

    // BASE 31: ANTÍTESIS Y PARALELISMO RETÓRICO
    {
      title: "Antítesis y Paralelismo Retórico: Not because it was easy, but because...",
      focus: "Estructurar frases gemelas con ritmo poético y persuasivo que resuenen en la memoria del oyente",
      payload: {
        ruleTaglineSpanish:
          "El paralelismo retórico empareja dos estructuras sintácticamente idénticas para contrastar ideas opuestas: 'We chose this path not because it was easy, but because it was right'. La simetría gramatical hace que la idea sea inolvidable y digna de un discurso histórico.",
        formulaSegments: [
          { label: "CLÁUSULA PARALELA A", token: "We chose this demanding path not because it was convenient,", tone: "violet" },
          { label: "CONEXIÓN DE ANTÍTESIS", token: "but because it was", tone: "emerald" },
          { label: "CLÁUSULA PARALELA B", token: "fundamentally and morally right.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · El motivo verdadero",
            segments: [
              { label: "ACCIÓN ELEGIDA", token: "We stayed", tone: "violet" },
              { label: "MOTIVO DESCARTADO", token: "not because it was safe,", tone: "emerald" },
              { label: "MOTIVO REAL EN PARALELO", token: "but because it mattered.", tone: "sky" },
            ],
            explanationSpanish:
              "Descarta un motivo falso y declara el verdadero con dos cláusulas idénticas: sujeto y verbo en ambas. Si dices 'not because safe', rompes la simetría y el oyente pierde el paralelo que hace memorable la frase.",
            exampleEnglish: "We stayed not because it was safe, but because it mattered.",
          },
          {
            label: "02 · Dónde reside el valor",
            segments: [
              { label: "MEDIDA NEGADA", token: "Strength lies not in loud promises,", tone: "violet" },
              { label: "BISAGRA PARALELA", token: "but in", tone: "emerald" },
              { label: "MEDIDA AFIRMADA", token: "steady daily practice.", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando defines un valor, niega primero el criterio equivocado y afirma el tuyo con la misma preposición. Repetir 'in' en las dos mitades es lo que sostiene el paralelismo; cambiar de preposición lo desarma.",
            exampleEnglish: "Strength lies not in loud promises, but in steady practice.",
          },
        ],
        commonMistake: {
          wrong: "We chose it not because easy, but it was right.",
          wrongToken: "not because easy, but it was right",
          correct: "We chose it not because it was easy, but because it was right.",
          correctToken: "not because it was easy, but because it was right",
          whySpanish: "El paralelismo retórico exige que ambas cláusulas compartan la misma estructura gramatical exacta.",
        },
        examples: [
          {
            english: "We chose this path not because it was easy, but because it was right.",
            spanish: "Elegimos este camino no porque fuera sencillo, sino porque era el correcto.",
            pronunciationHint: "ui chous dis paz not bikós it uos ízi, bat bikós it uos ráit",
          },
          {
            english: "Our measure of success lies not in the praise we receive, but in the enduring value we create.",
            spanish: "Nuestra medida del éxito no radica en los elogios que recibimos, sino en el valor perdurable que creamos.",
            pronunciationHint: "áuer méshur ov saksés láis not in de préis ui risív, bat in di endiúring váliu ui kriéit",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Elegimos este camino no porque fuera fácil, sino porque era el correcto",
          targetTokens: ["We", "chose", "this", "path", "not", "because", "it", "was", "easy,", "but", "because", "right"],
          distractorTokens: ["although", "is", "for", "choosing"],
          successTipSpanish: "¡Paralelismo retórico legendario! La simetría sintáctica 'not because... but because...' conmueve y convence.",
          mistakeHintSpanish: "Mantén el paralelismo exacto: 'not because it was easy, but because it was right'.",
        },
        voicePractice: {
          sentenceEnglish: "True progress is defined not by the obstacles we encounter, but by the dignity with which we overcome them.",
          spanishMeaning: "El verdadero progreso se define no por los obstáculos que encontramos, sino por la dignidad con la que los superamos.",
          pronunciationHint: "tru prógres is difáind not bai di óbstakols ui enkáunter, bat bai de dígniti uid uích ui óuverkám dem",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe manifiestos y declaraciones de visión aplicando paralelismo retórico en Writing Studio.",
        },
      },
    },

    // BASE 32: GRAN CERTIFICACIÓN C1 / SALTO DEFINITIVO A C2 (MASTERY)
    {
      title: "Gran Certificación C1: El Salto Definitivo a C2 Mastery",
      focus: "Integración total de oratoria, fronting, subjuntivo invariable y síntesis filosófica",
      payload: {
        ruleTaglineSpanish:
          "Esta es la cumbre de C1. Has dominado el fronting adjetival ('Demanding though the journey was...'), el subjuntivo de síntesis ('suffice it to say...'), el contrafáctico de máxima abstracción ('Had it not been for our shared purpose...') y el cierre panorámico ('In the final analysis, the experience transformed us'). Piensas, sientes y debates con la distinción de un maestro.",
        formulaSegments: [
          { label: "FRONTING INICIAL", token: "Demanding though the journey was,", tone: "violet" },
          { label: "SÍNTESIS SUBJUNTIVA", token: "suffice it to say that our collective resolve persisted.", tone: "emerald" },
          { label: "CONTRAFÁCTICO SUPREMO", token: "Had it not been for our unwavering purpose,", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Apertura concesiva invertida",
            segments: [
              { label: "ADJETIVO AL FRENTE", token: "Demanding though the work was,", tone: "violet" },
              { label: "RESULTADO SOSTENIDO", token: "the team endured.", tone: "sky" },
            ],
            explanationSpanish:
              "Abre con el adjetivo para poner el peso en la dificultad antes que en el sujeto. Con 'although' el orden normal aplana el énfasis; el fronting con 'though' lo eleva y suena a disertación.",
            exampleEnglish: "Demanding though the work was, the team endured.",
          },
          {
            label: "02 · Síntesis sin detallar",
            segments: [
              { label: "SÍNTESIS SUBJUNTIVA", token: "Suffice it to say", tone: "violet" },
              { label: "CONTENIDO RESUMIDO", token: "that the debate changed us.", tone: "sky" },
            ],
            explanationSpanish:
              "Usa la fórmula cuando resumís sin entrar en detalles y das por sobreentendido el resto. 'It is enough to say' se entiende, pero no es la fórmula fija del registro culto; esta invierte el orden y lleva 'it' fijo.",
            exampleEnglish: "Suffice it to say that the debate changed us.",
          },
          {
            label: "03 · Contrafáctico sin 'if'",
            segments: [
              { label: "APERTURA SIN 'IF'", token: "Had it not been for our purpose,", tone: "violet" },
              { label: "RESULTADO EVITADO", token: "we would have faltered.", tone: "sky" },
            ],
            explanationSpanish:
              "Presenta un apoyo decisivo como causa de que el resultado no fuera peor: sin él, todo habría cambiado. La apertura con 'Had' sustituye a 'if' e invierte el orden; con 'if' la frase pierde solemnidad.",
            exampleEnglish: "Had it not been for her counsel, we would have failed.",
          },
        ],
        commonMistake: {
          wrong: "Well, demanding though the journey was, you know, the team endured.",
          wrongToken: "vacilación o muletillas",
          correct: "Demanding though the journey was, the team endured.",
          correctToken: "maestría C2",
          whySpanish: "El hablante C2 domina el idioma como un instrumento de pensamiento abstracto y belleza estética.",
        },
        examples: [
          {
            english: "Demanding though the journey was, suffice it to say that we persisted. Had it not been for our shared purpose, we would have faltered. In the final analysis, the experience transformed us.",
            spanish: "Exigente aunque fuera la travesía, baste decir que perseveramos. De no haber sido por nuestro propósito compartido, habríamos claudicado. En última instancia, la experiencia nos transformó.",
            pronunciationHint: "dimánding dou de yérni uos, safáis it tu séi dat ui persísted. jad it not bin for áuer sherd pérpos, ui uud jav fólterd. in de fáinal análisis, di ekspíriens transfórmd as",
          },
          {
            english: "Intricate though the debate proved, suffice it to say that ethical clarity guided our resolution. Had it not been for mutual respect, dialogue would have disintegrated. In the final analysis, principled unity carried the day.",
            spanish: "Intrincado aunque resultara el debate, baste decir que la claridad ética guió nuestra resolución. De no haber sido por el respeto mutuo, el diálogo se habría desintegrado. En última instancia, la unidad de principios salió victoriosa.",
            pronunciationHint: "íntriket dou de dibéit pruvd, safáis it tu séi dat ézikal kláriti gáided áuer rézolúshon. jad it not bin for miúchual rispékt, dáiolog uud jav disíntigréited",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Exigente aunque fuera la travesía, baste decir que perseveramos. De no ser por nuestro propósito, habríamos claudicado",
          targetTokens: ["Demanding", "though", "the", "journey", "was,", "suffice", "it", "to", "say", "persisted.", "Had", "it", "not", "been", "purpose,", "would", "faltered"],
          distractorTokens: ["although", "because", "faltering", "did"],
          successTipSpanish: "¡Maestría C1 absoluta y definitiva! Has integrado fronting, subjuntivo y contrafáctico a nivel C2.",
          mistakeHintSpanish: "Combina: 'Demanding though the journey was, suffice it to say that we persisted...'.",
        },
        voicePractice: {
          sentenceEnglish: "Demanding though the challenge proved, suffice it to say that our shared perseverance carried the day.",
          spanishMeaning: "Por exigente que resultara el desafío, baste decir que nuestra perseverancia compartida salió victoriosa.",
          pronunciationHint: "dimánding dou de cháliny pruvd, safáis it tu séi dat áuer sherd pérsevírans kérid de déi",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Defiende tu disertación de graduación C1 en un debate en vivo con el mentor Gonzalo.",
        },
      },
    },
  ];
}

