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
        commonMistake: {
          wrong: "That proposal, we never accepted it (calco redundante del español).",
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
        commonMistake: {
          wrong: "Encadenar cláusulas planas con 'because', 'so' y 'and' en un discurso solemne.",
          wrongToken: "estilo plano",
          correct: "Alternar fronting adjetival con inversiones para crear dinamismo rítmico.",
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
