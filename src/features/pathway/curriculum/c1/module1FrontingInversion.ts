import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1FrontingInversion(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: FRONTING CON ADJETIVOS Y ADVERBIOS
    {
      title: "Fronting con Adjetivos y Adverbios: Difficult though it was...",
      focus: "Mover el atributo al inicio absoluto para enfatizar el grado de concesión (Strange as it may seem...)",
      payload: {
        ruleTaglineSpanish:
          "En lugar del plano 'Although it was difficult...', adelanta el adjetivo o adverbio al inicio seguido de 'though' o 'as': 'Difficult though the endeavor was, we persisted'. Esto coloca el foco en la cualidad antes de presentar la resolución con elegancia literaria.",
        formulaSegments: [
          { label: "ADJETIVO AL FRENTE", token: "Difficult though the challenge was,", tone: "violet" },
          { label: "SUJETO PRINCIPAL", token: "the team", tone: "emerald" },
          { label: "RESOLUCIÓN FIRME", token: "maintained its composure.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Adjetivo + though: hecho difícil que igual ocurrió",
            segments: [
              { label: "ADJETIVO AL FRENTE", token: "Difficult", tone: "violet" },
              { label: "THOUGH + SUJETO + WAS", token: "though the decision was", tone: "emerald" },
              { label: "RESULTADO", token: "we moved forward", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el dato es un hecho duro que ya ocurrió, adelantas el adjetivo y lo unes con though: Difficult though the decision was. La señal es la constatación, no la hipótesis; con 'Although it was difficult' el mismo contenido pierde el golpe inicial.",
            exampleEnglish: "Difficult though the decision was, we moved forward.",
          },
          {
            label: "02 · As + may: lo que suena increíble pero es cierto",
            segments: [
              { label: "ADJETIVO AL FRENTE", token: "Unlikely", tone: "violet" },
              { label: "AS + SUJETO + MAY", token: "as it may seem", tone: "emerald" },
              { label: "LO QUE OCURRIÓ", token: "the two teams agreed", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando presentas algo que suena improbable y quieres marcar que es cierto, usas as + sujeto + may: Unlikely as it may seem. La señal es la concesión ante la sorpresa del oyente; con though no cabe ese matiz de 'por mucho que parezca', porque though afirma el hecho sin más.",
            exampleEnglish: "Unlikely as it may seem, the two teams agreed.",
          },
          {
            label: "03 · Adverbio + as: esfuerzo o valoración concedidos",
            segments: [
              { label: "ADVERBIO AL FRENTE", token: "Much", tone: "violet" },
              { label: "AS + SUJETO", token: "as we value tradition", tone: "emerald" },
              { label: "GIRO NECESARIO", token: "we must adapt", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando concedes una valoración o un esfuerzo antes de contrastar, el elemento al frente es un adverbio como much o hard, seguido de as: Much as we value tradition. La señal es el verbo de aprecio o intento; si usas 'Although we value tradition much', el énfasis se diluye y suena a traducción.",
            exampleEnglish: "Much as we value tradition, we must adapt.",
          },
        ],
        commonMistake: {
          wrong: "Although difficult it was, we succeeded.",
          wrongToken: "Although difficult it was",
          correct: "Difficult though it was, we succeeded.",
          correctToken: "Difficult though it was",
          whySpanish: "Con fronting adjetival se utiliza 'though' o 'as', jamás 'although'.",
        },
        examples: [
          {
            english: "Difficult though the challenge was, the team maintained its composure.",
            spanish: "Por difícil que fuera el desafío, el equipo mantuvo su compostura.",
            pronunciationHint: "dífikalt dou de cháliny uos, de tim méintéind its kompóusher",
          },
          {
            english: "Strange as it may seem, the simplest explanation proved to be the most accurate.",
            spanish: "Por extraño que parezca, la explicación más sencilla resultó ser la más acertada.",
            pronunciationHint: "stréiny as it mei sim, de símplest éksplanéishon pruvd tu bi de móust ákiuret",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Por difícil que fuera el desafío, el equipo mantuvo su compostura",
          targetTokens: ["Difficult", "though", "the", "challenge", "was,", "the", "team", "maintained", "its", "composure"],
          distractorTokens: ["Although", "was", "maintaining", "difficultly"],
          successTipSpanish: "¡Fronting magistral! 'Difficult though the challenge was' abre con distinción.",
          mistakeHintSpanish: "Abre con el adjetivo seguido de 'though': 'Difficult though...'.",
        },
        voicePractice: {
          sentenceEnglish: "Demanding though the research was, our findings justified every effort.",
          spanishMeaning: "Por exigente que fuera la investigación, nuestros hallazgos justificaron cada esfuerzo.",
          pronunciationHint: "dimánding dou de risérch uos, áuer fáindings yástifaid évri éfort",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Analiza editoriales de alta prosa en The Atlantic y The New Yorker con fronting adjetival.",
        },
      },
    },

    // BASE 2: INVERSIÓN TEMPORAL RESTRICTIVA
    {
      title: "Inversión Temporal Restrictiva: Not until... did we realize",
      focus: "Crear suspenso dramático y rigor cronológico invirtiendo la cláusula principal (Not until...)",
      payload: {
        ruleTaglineSpanish:
          "Cuando abres con 'Not until...' o 'Only after...', la primera cláusula mantiene orden normal, pero la CLÁUSULA PRINCIPAL que sigue invierte obligatoriamente auxiliar y sujeto: 'Not until the meeting concluded DID we grasp the true scope'.",
        formulaSegments: [
          { label: "CLÁUSULA TEMPORAL", token: "Not until the review was complete", tone: "violet" },
          { label: "INVERSIÓN OBLIGATORIA", token: "did the committee announce", tone: "emerald" },
          { label: "COMPLEMENTO", token: "the official findings.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Not until: el resultado llega al cerrar el plazo",
            segments: [
              { label: "LÍMITE TEMPORAL", token: "Not until midnight", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the results", tone: "emerald" },
              { label: "LO ESPERADO", token: "finally arrive", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el hecho solo ocurre al cerrarse un plazo, abres con Not until + el momento y después inviertes: did the results arrive. La señal es el límite exacto, no la secuencia; con 'The results arrived until midnight' cambias el significado, y sin inversión la frase suena plana.",
            exampleEnglish: "Not until midnight did the results arrive.",
          },
          {
            label: "02 · Only after: el logro llega tras un proceso",
            segments: [
              { label: "PROCESO PREVIO", token: "Only after the vote", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the board", tone: "emerald" },
              { label: "REACCIÓN", token: "make its statement", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando quieres mostrar que un paso previo era la condición y la reacción vino después, abres con Only after + ese paso: Only after the vote did the board speak. La señal es la cadena de dos momentos; el contraste es 'After the vote, the board spoke', que informa pero no subraya la dependencia.",
            exampleEnglish: "Only after the vote did the board speak.",
          },
          {
            label: "03 · Only when: la condición que se cumple por fin",
            segments: [
              { label: "CONDICIÓN", token: "Only when the storm passed", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did we leave", tone: "emerald" },
              { label: "LUGAR", token: "the shelter", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el hecho depende de que una condición se cumpla, abres con Only when + condición y luego inviertes: did we leave. La señal es la condición, no el plazo ni la secuencia; con 'We left only when the storm passed' el foco queda al final y se pierde la tensión del inicio.",
            exampleEnglish: "Only when the storm passed did we leave the shelter.",
          },
        ],
        commonMistake: {
          wrong: "Not until the review concluded we realized the impact.",
          wrongToken: "we realized",
          correct: "Not until the review concluded did we realize the impact.",
          correctToken: "did we realize",
          whySpanish: "Tras 'Not until' o 'Only after', la cláusula de resultado exige inversión 'did + sujeto + base'.",
        },
        examples: [
          {
            english: "Not until the meeting concluded did we grasp the true scope of the project.",
            spanish: "No fue sino hasta que concluyó la reunión cuando comprendimos el alcance del proyecto.",
            pronunciationHint: "not antíl de míting konklúded did ui grasp de tru skóup ov de próyekt",
          },
          {
            english: "Only after extensive deliberation was a sustainable agreement reached.",
            spanish: "Solo tras una amplia deliberación se alcanzó un acuerdo sostenible.",
            pronunciationHint: "óunli áfter eksténsiv delíberéishon uos a sostéinabl agríment richt",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: No fue sino hasta que concluyó la reunión cuando comprendimos el alcance",
          targetTokens: ["Not", "until", "the", "meeting", "concluded", "did", "we", "grasp", "the", "scope"],
          distractorTokens: ["we", "grasped", "when", "that"],
          successTipSpanish: "¡Inversión restrictiva perfecta! 'did we grasp' tras 'Not until...'.",
          mistakeHintSpanish: "Invierte en la cláusula principal: 'did we grasp the scope'.",
        },
        voicePractice: {
          sentenceEnglish: "Not until all evidence was examined did the panel issue its conclusion.",
          spanishMeaning: "No fue sino hasta examinar toda la evidencia cuando el panel emitió su conclusión.",
          pronunciationHint: "not antíl ol évidens uos egzámind did de pánel íshu its konklúshon",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe ensayos narrativos con inversiones temporales restrictivas en Writing Studio.",
        },
      },
    },

    // BASE 3: INVERSIÓN LOCATIVA Y DIRECCIONAL
    {
      title: "Inversión Locativa y Direccional: Beneath the archway stood...",
      focus: "Estilo descriptivo y literario donde el verbo precede directamente al sujeto sin auxiliar",
      payload: {
        ruleTaglineSpanish:
          "En descripciones solemnes o crónicas visuales, al iniciar con una frase de lugar o movimiento, el verbo completo precede al sujeto sin auxiliar 'did': 'Into the room walked the keynote speaker' o 'Beneath the archway stood the ancient pillars'.",
        formulaSegments: [
          { label: "FRASE LOCATIVA INICIAL", token: "Beneath the ancient archway", tone: "violet" },
          { label: "VERBO DE MOVIMIENTO/ESTADO", token: "stood", tone: "emerald" },
          { label: "SUJETO COMPLETO", token: "the historic stone monument.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Frase de lugar: describir una escena detenida",
            segments: [
              { label: "DÓNDE", token: "Beneath the old bridge", tone: "violet" },
              { label: "VERBO DE ESTADO", token: "stood", tone: "emerald" },
              { label: "SUJETO AL FINAL", token: "a single lantern", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando describes una escena quieta, abres con el lugar y colocas el verbo de estado antes del sujeto: Beneath the bridge stood a lantern. La señal es un verbo como stand, lie o hang; con 'A lantern stood beneath the bridge' la escena se informa, pero no se pinta.",
            exampleEnglish: "Beneath the old bridge stood a single lantern.",
          },
          {
            label: "02 · Frase direccional: alguien entra en escena",
            segments: [
              { label: "HACIA DÓNDE", token: "Into the silent hall", tone: "violet" },
              { label: "VERBO DE MOVIMIENTO", token: "walked", tone: "emerald" },
              { label: "SUJETO AL FINAL", token: "the new director", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando narras una entrada y el sujeto es la noticia, abres con la dirección y el verbo de movimiento: Into the hall walked the new director. La señal es el desplazamiento hacia un lugar; se diferencia del caso de lugar en que aquí hay movimiento, y el foco cae en quién llega.",
            exampleEnglish: "Into the silent hall walked the new director.",
          },
          {
            label: "03 · Sujeto pronombre: la inversión se detiene",
            segments: [
              { label: "ADVERBIO DE MOVIMIENTO", token: "Away", tone: "violet" },
              { label: "SUJETO PRONOMBRE", token: "they", tone: "emerald" },
              { label: "VERBO AL FINAL", token: "went", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el sujeto es un pronombre como they o she, la inversión se detiene y el orden vuelve a sujeto + verbo: Away they went. La señal es el pronombre, que no puede cargar el foco; si escribes 'Away went they', la frase suena forzada y rompe el ritmo de la crónica.",
            exampleEnglish: "Away they went before anyone could answer.",
          },
        ],
        commonMistake: {
          wrong: "Beneath the archway did stand the monument.",
          wrongToken: "did stand",
          correct: "Beneath the archway stood the monument.",
          correctToken: "stood the monument",
          whySpanish: "La inversión locativa no usa auxiliares; mueve el verbo principal directamente antes del sujeto.",
        },
        examples: [
          {
            english: "Beneath the ancient archway stood the historic stone monument.",
            spanish: "Bajo la antigua arcada se encontraba el monumento histórico de piedra.",
            pronunciationHint: "biníz di éinshent árchuei stud de jistórik stóun móniument",
          },
          {
            english: "Into the quiet hall walked the distinguished guest of honor.",
            spanish: "Hacia el tranquilo salón entró el distinguido invitado de honor.",
            pronunciationHint: "íntu de kuáiet jol uokt de distínguisht gest ov ónor",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Bajo la antigua arcada se encontraba el monumento histórico",
          targetTokens: ["Beneath", "the", "ancient", "archway", "stood", "the", "historic", "monument"],
          distractorTokens: ["was", "standing", "did", "stoods"],
          successTipSpanish: "¡Inversión locativa clásica! El verbo 'stood' precede al sujeto 'the historic monument'.",
          mistakeHintSpanish: "Coloca el verbo 'stood' inmediatamente tras la frase locativa.",
        },
        voicePractice: {
          sentenceEnglish: "Along the coastal path walked generations of local scholars.",
          spanishMeaning: "A lo largo del sendero costero caminaron generaciones de académicos locales.",
          pronunciationHint: "alóng de kóustal paz uokt yéneréishons ov lóukal skólars",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Reconoce inversiones locativas en relatos históricos y literatura de viajes de alto nivel.",
        },
      },
    },

    // BASE 4: TOPICALIZACIÓN Y DISLOCACIÓN SINTÁCTICA
    {
      title: "Topicalización y Énfasis de Objeto: That proposal, we never accepted",
      focus: "Elevar el objeto al inicio de la frase para sentar una postura innegociable con fuerza oratoria",
      payload: {
        ruleTaglineSpanish:
          "Para convertir el objeto de una oración en el tema central indiscutible, colócalo al principio sin añadir pronombres redundantes: 'That particular perspective, we had never considered'. No agregues 'it' al final porque el objeto ya está al frente.",
        formulaSegments: [
          { label: "OBJETO TOPICALIZADO", token: "That particular perspective,", tone: "violet" },
          { label: "SUJETO + VERBO", token: "we had never seriously considered.", tone: "emerald" },
        ],
        formulaCases: [
          {
            label: "01 · Objeto directo al frente: postura innegociable",
            segments: [
              { label: "OBJETO AL FRENTE", token: "That argument,", tone: "violet" },
              { label: "SUJETO + VERBO", token: "nobody in the room defended", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando quieres cerrar la puerta a un tema, pones el objeto al inicio y después sujeto + verbo, sin repetir el pronombre: That argument, nobody defended. La señal es la postura ante una propuesta concreta; con 'Nobody defended that argument' informas, pero el rechazo no queda fijado como tema.",
            exampleEnglish: "That argument, nobody in the room defended.",
          },
          {
            label: "02 · Such + sustantivo: valorar lo que se nombra",
            segments: [
              { label: "VALORACIÓN AL FRENTE", token: "Such dedication,", tone: "violet" },
              { label: "SUJETO INDEFINIDO", token: "one rarely sees", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando elogias o censuras una cualidad y la quieres como tema, abres con Such + sustantivo: Such dedication, one rarely sees. La señal es la valoración, no el objeto concreto; el contraste es 'One rarely sees such dedication', donde el elogio aparece tarde y sin peso.",
            exampleEnglish: "Such dedication, one rarely sees in this office.",
          },
          {
            label: "03 · Complemento con preposición: tema que se retoma",
            segments: [
              { label: "PREPOSICIÓN + OBJETO", token: "Of that risk,", tone: "violet" },
              { label: "SUJETO + VERBO", token: "the committee was aware", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando el tema lleva preposición, la mueves junto con su objeto y mantienes el resto en orden normal: Of that risk, the committee was aware. La señal es el complemento con of, to o with; sin la preposición al frente ('That risk, the committee was aware') la frase queda coja.",
            exampleEnglish: "Of that risk, the committee was fully aware.",
          },
        ],
        commonMistake: {
          wrong: "That proposal, we never accepted it.",
          wrongToken: "accepted it",
          correct: "That proposal, we never accepted.",
          correctToken: "we never accepted",
          whySpanish: "En inglés la topicalización no repite el pronombre objeto 'it' al final.",
        },
        examples: [
          {
            english: "That particular perspective, we had never seriously considered.",
            spanish: "Esa perspectiva en particular, jamás la habíamos contemplado con seriedad.",
            pronunciationHint: "dat partíkiular perspéktiv, ui jad néver síriasli konsíderd",
          },
          {
            english: "Such remarkable dedication, one rarely encounters in modern commerce.",
            spanish: "Una dedicación tan notable, uno raramente la encuentra en el comercio moderno.",
            pronunciationHint: "sach rimárkabl dédikéishon, uan rérli enkáunters in módern kómers",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Esa perspectiva en particular, jamás la habíamos contemplado",
          targetTokens: ["That", "particular", "perspective,", "we", "had", "never", "seriously", "considered"],
          distractorTokens: ["it", "considering", "we'd", "have"],
          successTipSpanish: "¡Topicalización limpia! Sin pronombre 'it' redundante al final.",
          mistakeHintSpanish: "Abre con 'That particular perspective,' seguido de 'we had never seriously considered'.",
        },
        voicePractice: {
          sentenceEnglish: "Such foundational principles, we must never compromise.",
          spanishMeaning: "Principios tan fundamentales, jamás debemos comprometerlos.",
          pronunciationHint: "sach faundéishonal prínsipols, ui mast néver kómpramáiz",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Defiende convicciones éticas y líneas rojas profesionales mediante topicalización en entrevistas.",
        },
      },
    },

    // BASE 5: INVERSIÓN CON LITTLE Y AT NO TIME
    {
      title: "Ironía Dramática con Inversión: Little did they suspect...",
      focus: "Contrastar ignorancia previa con revelaciones posteriores (At no point did anyone doubt...)",
      payload: {
        ruleTaglineSpanish:
          "Para narrar con la elegancia de una biografía histórica o una crónica de investigación, usa 'Little did [Sujeto] suspect / know that...'. Significa que la persona no tenía la más mínima idea del impacto futuro que tendrían sus actos.",
        formulaSegments: [
          { label: "ADVERBIO RESTRICTIVO", token: "Little did they suspect", tone: "violet" },
          { label: "PROPOSICIÓN SECUNDARIA", token: "that their research would revolutionize", tone: "emerald" },
          { label: "OBJETO DEL IMPACTO", token: "the entire discipline.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Little did: nadie sospechaba lo que venía",
            segments: [
              { label: "ADVERBIO AL FRENTE", token: "Little", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the founders know", tone: "emerald" },
              { label: "LO QUE VINO", token: "what awaited them", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando narras un pasado y quieres marcar que nadie veía venir el desenlace, abres con Little + did + sujeto + verbo base: Little did the founders know. La señal es la ignorancia previa con revelación posterior; con 'The founders didn't know' el dato es correcto, pero pierde la ironía.",
            exampleEnglish: "Little did the founders know what awaited them.",
          },
          {
            label: "02 · At no point: negar un periodo entero",
            segments: [
              { label: "FRASE RESTRICTIVA", token: "At no point", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the witness", tone: "emerald" },
              { label: "LO NEGADO", token: "change her story", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando niegas algo durante todo un periodo, abres con At no point y inviertes: did the witness change her story. La señal es la cobertura temporal completa, típica de informes y declaraciones; con 'The witness did not change her story' solo niegas el hecho, sin cubrir el periodo.",
            exampleEnglish: "At no point did the witness change her story.",
          },
          {
            label: "03 · Not once: contar cero veces",
            segments: [
              { label: "NEGACIÓN AL FRENTE", token: "Not once", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the team", tone: "emerald" },
              { label: "LO NO OCURRIDO", token: "lose its focus", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando cuentas ocurrencias y el número es cero, usas Not once con inversión: Not once did the team lose focus. La señal es el conteo de veces, no el periodo; se distingue de At no point en que allí se cubre un lapso y aquí se cuenta cuántas veces pasó.",
            exampleEnglish: "Not once did the team lose its focus.",
          },
        ],
        commonMistake: {
          wrong: "Little they knew about the consequences.",
          wrongToken: "Little they knew",
          correct: "Little did they know about the consequences.",
          correctToken: "Little did they know",
          whySpanish: "'Little' al inicio de una oración exige inversión auxiliar 'did + sujeto + verbo base'.",
        },
        examples: [
          {
            english: "Little did they suspect that their research would transform the entire discipline.",
            spanish: "Poco sospechaban que su investigación transformaría la disciplina entera.",
            pronunciationHint: "lítl did dei sospékt dat der risérch uud transfórm di entáier dísaplin",
          },
          {
            english: "At no point did anyone question the integrity of the founding members.",
            spanish: "En ningún momento nadie cuestionó la integridad de los miembros fundadores.",
            pronunciationHint: "at nóu póint did éniuan kuéschion di intégriti ov de fáunding mémbers",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Poco sospechaban que su investigación transformaría la disciplina",
          targetTokens: ["Little", "did", "they", "suspect", "that", "their", "research", "would", "transform", "the", "discipline"],
          distractorTokens: ["they", "suspected", "had", "transforming"],
          successTipSpanish: "¡Ironía histórica impecable! 'Little did they suspect' aporta dramatismo reflexivo.",
          mistakeHintSpanish: "Usa la inversión obligatoria: 'Little did they suspect...'.",
        },
        voicePractice: {
          sentenceEnglish: "Little did we realize how far-reaching our initial work would become.",
          spanishMeaning: "Poco nos imaginábamos qué tan trascendental se volvería nuestro trabajo inicial.",
          pronunciationHint: "lítl did ui ríalais jáu far-ríching áuer iníshal uórk uud bikóm",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Aplica ironía dramática en perfiles biográficos y análisis retrospectivos en Writing Studio.",
        },
      },
    },

    // BASE 6: ORATORIA PERSUASIVA INTEGRADA
    {
      title: "Oratoria Persuasiva Integrada: Fronting + Inversión + Foco",
      focus: "Fusionar recursos estilísticos en un discurso formal ininterrumpido",
      payload: {
        ruleTaglineSpanish:
          "La verdadera oratoria C1 no usa un solo truco aislado: entrelaza un fronting adjetival ('Complex though it was...'), una inversión restrictiva ('not until today did we witness...') y una topicalización de convicción para crear un crescendo elocuente.",
        formulaSegments: [
          { label: "FRONTING INICIAL", token: "Complex though the process was,", tone: "violet" },
          { label: "INVERSIÓN TEMPORAL", token: "not until today did we witness the results.", tone: "emerald" },
          { label: "TOPICALIZACIÓN FINAL", token: "That shared conviction, we shall never abandon.", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Apertura: fronting que admite la dificultad",
            segments: [
              { label: "ADJETIVO AL FRENTE", token: "Demanding", tone: "violet" },
              { label: "THOUGH + SUJETO", token: "though the process was,", tone: "emerald" },
              { label: "RESOLUCIÓN", token: "the team held its nerve", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando abres un discurso y quieres reconocer la dificultad sin ceder fuerza, empiezas con el adjetivo al frente y though: Demanding though the process was. La señal es el primer movimiento del discurso; cerrando con 'It was demanding' el reconocimiento llega tarde y suena defensivo.",
            exampleEnglish: "Demanding though the process was, the team held its nerve.",
          },
          {
            label: "02 · Giro: inversión que revela lo decisivo",
            segments: [
              { label: "LÍMITE TEMPORAL", token: "Not until the final vote", tone: "violet" },
              { label: "INVERSIÓN CON DID", token: "did the truth", tone: "emerald" },
              { label: "REVELACIÓN", token: "emerge", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando el discurso necesita un giro que revele el dato clave, colocas la inversión justo en ese punto: Not until the final vote did the truth emerge. La señal es el momento de máxima tensión; si la pones al inicio y no en el giro, gastas el efecto antes de que la audiencia escuche el argumento.",
            exampleEnglish: "Not until the final vote did the truth emerge.",
          },
          {
            label: "03 · Cierre: topicalización de la convicción",
            segments: [
              { label: "CONVICCIÓN AL FRENTE", token: "That commitment,", tone: "violet" },
              { label: "SUJETO + VERBO", token: "this institution will never abandon", tone: "emerald" },
            ],
            explanationSpanish:
              "Cuando cierras y quieres que una convicción quede como tema final, adelantas el objeto: That commitment, this institution will never abandon. La señal es la última frase del discurso; con 'We will never abandon that commitment' el cierre funciona, pero la idea no queda instalada al frente.",
            exampleEnglish: "That commitment, this institution will never abandon.",
          },
        ],
        commonMistake: {
          wrong: "We will never abandon that commitment.",
          wrongToken: "estilo plano",
          correct: "That commitment, we will never abandon.",
          correctToken: "ritmo C1",
          whySpanish: "La alternancia de estructuras sintácticas es el distintivo de un orador cultivado.",
        },
        examples: [
          {
            english: "Complex though the process was, not until today did we witness the results. That conviction, we shall never abandon.",
            spanish: "Complejo aunque resultara el proceso, no fue sino hasta hoy cuando vimos los resultados. Esa convicción, nunca la abandonaremos.",
            pronunciationHint: "kómpleks dou de próses uos, not antíl tudéi did ui uítnest de rizólts. dat konvíkshon, ui shal néver abándon",
          },
          {
            english: "Arduous though the journey proved, only through persistent resolve did the team prevail. Such determination, history will long remember.",
            spanish: "Por ardua que resultara la travesía, solo mediante una determinación constante prevaleció el equipo. Tal determinación, la historia la recordará por mucho tiempo.",
            pronunciationHint: "árdiuus dou de yérni pruvd, óunli zru persístent rizólv did de tim privéil. sach ditérminéishon, jístori uil long rimémber",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Complejo aunque fuera el proceso, no fue sino hasta hoy cuando vimos los resultados",
          targetTokens: ["Complex", "though", "the", "process", "was,", "not", "until", "today", "did", "we", "witness", "results"],
          distractorTokens: ["although", "when", "witnessed", "we"],
          successTipSpanish: "¡Cúspide de oratoria! Fronting e inversión combinadas sin titubeos.",
          mistakeHintSpanish: "Ordena: 'Complex though the process was, not until today did we witness results'.",
        },
        voicePractice: {
          sentenceEnglish: "Challenging though the journey proved, only together did we achieve enduring excellence.",
          spanishMeaning: "Por desafiante que resultara la travesía, solo juntos logramos una excelencia duradera.",
          pronunciationHint: "chálinying dou de yérni pruvd, óunli tuguéder did ui achív endiúring ékselens",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Diserta discursos de apertura y exposiciones solemnes con ritmo oratorio en Interview.",
        },
      },
    },
  ];
}
