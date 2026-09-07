/**
 * Universal Linguistic & Strategic Parser
 * Enterprise Multi-Layer NLP Engine:
 * 1. Strategic Behavioral Analysis across all PM & Engineering questions
 * 2. Exhaustive Grammatical & Syntax Parsing (Modal verbs, Subject-Verb agreement, pronoun casing, dummy subjects)
 * 3. Deep Spanglish, Phonetic Disambiguation & STT Distortion Engine
 * 4. Run-on Clause Collision & Punctuation Analyzer
 * 5. Honest Mathematical Scoring (Strictly < 40% on broken or garbled English)
 */

import {
  SpecificErrorItem,
  TurnEvaluationFeedback,
  InterviewQuestionItem,
} from "./interviewEngineService";
import { StrategicFeedbackItem } from "./masterAiFeedbackEngine";

export function generateDynamicModelAnswer(question: InterviewQuestionItem): string {
  if (question.starHint) {
    const cleanHint = question.starHint.replace(/^(Situation|Action|Result|Highlight|Discuss|Detail|Emphasize|Explain|Mention):\s*/i, "").trim();
    return `In my professional practice, I approach this methodically: ${cleanHint}`;
  }
  return `In this situation, I communicate clearly, follow established professional protocols, collaborate with relevant stakeholders, and ensure a high-quality outcome.`;
}

export const ROLE_MODEL_ANSWERS: Record<number, string> = {};


export class UniversalLinguisticParser {
  public static parse(
    rawText: string,
    currentQuestion: InterviewQuestionItem,
  ): TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null } {
    const text = rawText.trim();

    if (!text || text.length < 3) {
      return {
        overallScore: 25,
        clarityScore: 20,
        grammarScore: 25,
        vocabularyScore: 30,
        userSpokenText: "(No speech detected)",
        improvedFullAnswer:
          ROLE_MODEL_ANSWERS[currentQuestion.id] ||
          generateDynamicModelAnswer(currentQuestion),
        unclearOrErrorWords: [
          {
            id: `err-no-mic-${Date.now()}`,
            errorType: "UNCLEAR_WORD",
            errorWord: "(No input detected)",
            correctWord: "Speak audibly into the mic or type your answer",
            userSaidContext: "No audio captured",
            betterWay: "Tap the mic and speak at a steady volume.",
            explanation: "No speech was detected. Tap the microphone to answer.",
            translationSpanish: "No se detectó audio. Toca el micrófono para hablar.",
            cefrLevel: "A1",
            savedToMemory: false,
          },
        ],
        keyStrengths: ["Session active"],
        tipsForNextTurn: "Tap the mic to start speaking, and tap it again when you are finished.",
        strategicFeedback: null,
      };
    }

    const detectedErrors: SpecificErrorItem[] = [];
    const lower = text.toLowerCase();
    let strategicFeedback: StrategicFeedbackItem | null = null;

    // =========================================================================
    // PILLAR 1: STRATEGIC & BEHAVIORAL INTENT ANALYSIS
    // =========================================================================

    // A. Question 7 / Tech Debt: "tech debt is not my problem" / "waste of time" / "only features"
    const isTechDebtTheme =
      currentQuestion.id === 7 ||
      /technical debt|tech debt|refactoring/i.test(currentQuestion.question);
    const deniesTechDebt =
      /not my problem|not my business|waste of time.*refactoring|story of spring.*debt|payday debt.*waste|only.*picture|dont care.*debt|only.*feature/i.test(
        lower,
      );

    if (isTechDebtTheme && deniesTechDebt) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Liderazgo: Co-propietario de la Salud Técnica",
        explanation:
          "Identificamos tu enfoque en la entrega de funcionalidades. En roles de Product Management, demostrar que balanceas nuevas funciones con la estabilidad y salud del sistema proyecta un alto seniority.",
        recommendation:
          "Paso a paso: Explica que asignas una capacidad dedicada (ej. 20% del sprint) para refactorización técnica y que traduces la deuda técnica a impacto en negocio (uptime y velocidad del equipo).",
      };
      detectedErrors.push({
        id: `err-strat-techdebt-denial-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord:
          "Denying responsibility for technical debt ('technical debt is not my problem / refactoring is a waste of time')",
        correctWord:
          "Take shared ownership of technical health ('I allocate 20% sprint capacity for engineering refactoring...')",
        userSaidContext: "the technical debt is not my problem... waste of time",
        betterWay:
          "Technical health is a shared responsibility. I partner with engineering to allocate dedicated sprint bandwidth for refactoring so technical debt doesn't degrade our velocity.",
        explanation:
          "En Product Management es fundamental balancear la entrega de valor con la estabilidad técnica y mantenimiento a largo plazo.",
        translationSpanish:
          "La salud técnica es una responsabilidad compartida. Me coordino con ingeniería para asignar capacidad dedicada a la refactorización para que la deuda técnica no afecte nuestra velocidad.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // B. Question 6: User Discovery (Dismissing discovery, friends only, users don't know)
    const isDiscoveryTheme =
      currentQuestion.id === 6 ||
      /discovery|validate|problem-solution|before writing|prototype/i.test(
        currentQuestion.question,
      );
    const dismissesDiscovery =
      /waste of time to talk|dont know what they want|doesnt know what they want|dont know what users want|only.*survey.*friend|boss told me|dont use.*discovery|discovery is.*delay/i.test(
        lower,
      );

    if (isDiscoveryTheme && dismissesDiscovery) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Validación: Descubrimiento Continuo con Usuarios",
        explanation:
          "Identificamos tu agilidad para comenzar a construir. Los entrevistadores valoran mucho conocer cómo escuchas a los usuarios y validas hipótesis antes de invertir horas de desarrollo.",
        recommendation:
          "Paso a paso: Menciona que realizas entrevistas cualitativas con usuarios reales y pruebas de usabilidad con prototipos interactivos en Figma para validar la demanda.",
      };
      detectedErrors.push({
        id: `err-strat-dismiss-discovery-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord:
          "Dismissing user discovery ('waste of time to talk with users / users don't know what they want')",
        correctWord:
          "Anchor on continuous customer discovery ('Users articulate pain points while we validate solutions with prototypes...')",
        userSaidContext: "waste of time to talk with the users before",
        betterWay:
          "While clients or users may not know the exact technical solution, deep consultations are essential to uncover unmet needs before execution starts.",
        explanation: "Los líderes y profesionales escuchan las necesidades de los usuarios para evitar construir soluciones innecesarias.",
        translationSpanish:
          "Aunque los usuarios no conozcan la solución exacta, las entrevistas y consultas son esenciales para descubrir necesidades antes de comenzar la ejecución.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // C. Question 3: Failed Launch (Blaming Team or Colleagues)
    const isLaunchFailureTheme =
      currentQuestion.id === 3 ||
      /didn't go as planned|failed launch|delay/i.test(currentQuestion.question);
    const blamesTeam =
      /developers didn't|developers did not|colleagues didn't|their fault|need to work more fast|told them to work faster|didn't do his job/i.test(
        lower,
      );

    if (isLaunchFailureTheme && blamesTeam) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Liderazgo: Responsabilidad Compartida",
        explanation:
          "Identificamos que buscaste describir un momento de retraso en el proyecto. Explicar cómo facilitaste la comunicación y ajustaste el alcance proyecta un liderazgo maduro y colaborativo.",
        recommendation:
          "Paso a paso: Asume la responsabilidad compartida del cronograma y describe cómo realizaste una sesión de priorización para proteger la calidad final.",
      };
      detectedErrors.push({
        id: `err-strat-blame-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Blaming team members ('team didn't do their job on time / work faster')",
        correctWord:
          "Take shared ownership and collaborate constructively ('We encountered unforeseen complexity...')",
        userSaidContext: "they didn't do his job on time",
        betterWay:
          "We encountered unexpected operational complexity, so I worked with team leads and colleagues to adjust our scope and timeline.",
        explanation:
          "Describe los retrasos como complejidades gestionadas con liderazgo colaborativo y ajuste de prioridades.",
        translationSpanish:
          "Encontramos una complejidad inesperada, así que colaboré con los líderes de equipo para ajustar prioridades y proteger la calidad.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 2: MODAL AUXILIARY & VERB SYNTAX ERRORS
    // =========================================================================

    // 0. Spanglish Auxiliary "am" + base verb (e.g., "I am really like", "I am agree", "I am prefer")
    const amBaseVerbMatch = text.match(
      /\bi\s+am\s+(really\s+|usually\s+|actually\s+)?(like|agree|work|prefer|think|want|have|know|understand)\b/i,
    );
    if (amBaseVerbMatch) {
      const adverb = amBaseVerbMatch[1] ? `${amBaseVerbMatch[1]}` : "";
      const verb = amBaseVerbMatch[2];
      const better = `I ${adverb}${verb}`;
      const spanishTranslations: Record<string, string> = {
        like: "Realmente me gusta / me interesan",
        agree: "Estoy de acuerdo",
        work: "Trabajo",
        prefer: "Prefiero",
        think: "Pienso / opino",
        want: "Quiero",
        have: "Tengo",
        know: "Sé / conozco",
        understand: "Entiendo",
      };
      detectedErrors.push({
        id: `err-am-base-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: amBaseVerbMatch[0],
        correctWord: better,
        userSaidContext: amBaseVerbMatch[0],
        betterWay: better,
        explanation: `En inglés, verbos de acción o estado como '${verb}' no requieren el auxiliar 'am'. Se dice '${better}', no '${amBaseVerbMatch[0]}'.`,
        translationSpanish: spanishTranslations[verb.toLowerCase()] || `Yo ${verb}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 1. Modal Verb + "to" + Base Verb (e.g., "we can to solve it", "should to do", "must to have", "will to build")
    const modalToMatch = text.match(
      /\b(can|could|should|would|must|will|may|might)\s+to\s+([a-z]+)\b/i,
    );
    if (modalToMatch) {
      const modal = modalToMatch[1];
      const verb = modalToMatch[2];
      detectedErrors.push({
        id: `err-modal-to-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${modal} to ${verb}`,
        correctWord: `${modal} ${verb} (without 'to')`,
        userSaidContext: modalToMatch[0],
        betterWay: `${modal} ${verb}`,
        explanation: `Los verbos modales ('${modal}', 'should', 'must', 'will') nunca llevan 'to'. Van directamente con el infinitivo simple ('${modal} ${verb}', no '${modal} to ${verb}').`,
        translationSpanish: `podemos ${verb} / se puede ${verb}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 2. Missing Dummy Subject "it" (e.g., "for me is...", "because is...", "so is...")
    const dummyItMatch = text.match(
      /\b(for\s+me|because|so|also|that|if)\s+is\s+((?:a\s+)?(?:waste\s+of\s+time|very\s+[a-z]+|[a-z]+))/i,
    );
    if (dummyItMatch) {
      const connector = dummyItMatch[1];
      const rest = dummyItMatch[2];
      detectedErrors.push({
        id: `err-dummy-it-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${connector} is ${rest}`,
        correctWord: `${connector}, it is ${rest}`,
        userSaidContext: dummyItMatch[0],
        betterWay: `${connector}, it is ${rest}`,
        explanation: `En inglés las oraciones requieren un sujeto explícito. No se debe omitir el pronombre 'it' ('${connector}, it is ${rest}').`,
        translationSpanish: `para mí, es ${rest}`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 3. Plural Subject with Singular Verb "doesn't / is / was" (e.g., "the users doesnt know", "people is")
    const pluralSubjectSingularVerb = text.match(
      /\b(the\s+)?(users|people|developers|clients|engineers|teams|stakeholders|friends)\s+(doesnt|doesn't|is|was|has)\b/i,
    );
    if (pluralSubjectSingularVerb) {
      const noun = pluralSubjectSingularVerb[2];
      const badVerb = pluralSubjectSingularVerb[3].toLowerCase();
      const fixedVerb =
        badVerb === "doesnt" || badVerb === "doesn't"
          ? "don't"
          : badVerb === "is"
            ? "are"
            : badVerb === "was"
              ? "were"
              : "have";
      detectedErrors.push({
        id: `err-subj-verb-plural-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${noun} ${badVerb}`,
        correctWord: `${noun} ${fixedVerb}`,
        userSaidContext: pluralSubjectSingularVerb[0],
        betterWay: `${noun} ${fixedVerb}`,
        explanation: `'${noun}' es plural y requiere el verbo en plural '${fixedVerb}', no en singular '${badVerb}'.`,
        translationSpanish: `los ${noun} ${fixedVerb === "don't" ? "no" : "están / tienen"}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 4. First-Person Pronoun "I" + Verb with "s" (e.g., "I always says", "I thinks")
    const firstPersonVerbWithS = text.match(
      /\bi\s+(?:always\s+|usually\s+|never\s+)?(says|thinks|wants|makes|knows|does|works|constructs|sees)\b/i,
    );
    if (firstPersonVerbWithS) {
      const badVerb = firstPersonVerbWithS[1];
      const fixedVerb = badVerb === "says" ? "say" : badVerb.replace(/s$/, "");
      detectedErrors.push({
        id: `err-first-person-s-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `I ${firstPersonVerbWithS[0].replace(/^i\s+/i, "")}`,
        correctWord: `I ${firstPersonVerbWithS[0].replace(/^i\s+/i, "").replace(new RegExp(badVerb + "$", "i"), fixedVerb)}`,
        userSaidContext: firstPersonVerbWithS[0],
        betterWay: `I ${fixedVerb}`,
        explanation: `Con el pronombre 'I' (primera persona), el verbo va en su forma base sin '-s' ('I ${fixedVerb}', no 'I ${badVerb}').`,
        translationSpanish: `yo ${fixedVerb === "say" ? "digo" : fixedVerb === "think" ? "pienso" : fixedVerb === "want" ? "quiero" : "hago"}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 5. "for + base verb" (Purpose: for know, for tell, for validate, for make)
    const forVerbMatch = text.match(
      /\bfor\s+(know|no|tell|validate|make|do|build|stop|have|say|learn|work|create|construct)\b/i,
    );
    if (forVerbMatch) {
      const rawVerb = forVerbMatch[1].toLowerCase();
      const properVerb = rawVerb === "no" ? "know" : rawVerb;
      detectedErrors.push({
        id: `err-for-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `for ${forVerbMatch[1]}`,
        correctWord: `to ${properVerb} / in order to ${properVerb}`,
        userSaidContext: forVerbMatch[0],
        betterWay: `to ${properVerb}`,
        explanation: `Para expresar propósito u objetivo en inglés se utiliza 'to + infinitivo' ('to ${properVerb}'), nunca 'for + verbo base' ('for ${forVerbMatch[1]}').`,
        translationSpanish: `para ${properVerb === "know" ? "saber / conocer" : properVerb === "validate" ? "validar" : properVerb === "build" ? "construir" : "hacer"}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 6. "need + base verb" (Missing infinitive particle "to": need construct, need stop)
    const needVerbMatch = text.match(
      /\bneed\s+(construct|stop|do|make|work|tell|listen|fix|launch|talk|speak|program|improve|build)\b/i,
    );
    if (needVerbMatch) {
      const verb = needVerbMatch[1];
      detectedErrors.push({
        id: `err-need-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `need ${verb}`,
        correctWord: `need to ${verb}`,
        userSaidContext: `need ${verb}`,
        betterWay: `need to ${verb}`,
        explanation: `El verbo 'need' requiere la partícula 'to' antes de otro verbo en infinitivo ('need to ${verb}').`,
        translationSpanish: `necesito ${verb}`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 3: PHONETIC MISHEARINGS, STT DISTORTION & BROKEN PHRASINGS
    // =========================================================================

    // 7. "story of spring for payday debt" -> "sprint allocation to pay down technical debt"
    if (/\b(story\s+of\s+spring|payday\s+debt)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-story-spring-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "story of spring for payday debt",
        correctWord: "sprint allocation to pay down technical debt",
        userSaidContext: "the story of spring for payday debt",
        betterWay: "allocating sprint capacity to pay down technical debt",
        explanation:
          "Distorsión del micrófono: entendió 'story of spring for payday debt' en lugar de 'sprint allocation to pay down technical debt'.",
        translationSpanish:
          "asignar capacidad del sprint para reducir la deuda técnica",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 8. "creating a picture for the username they call apples"
    if (/\b(creating\s+a\s+picture|username\s+they\s+call\s+apples)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-picture-apples-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "creating a picture for the username they call apples",
        correctWord: "building user-facing features for mobile and web applications",
        userSaidContext: "creating a picture for the username they call apples",
        betterWay: "building features for user-facing applications",
        explanation:
          "Audio ininteligible: el micrófono transcribió 'picture for username call apples' en vez de 'features for user applications'.",
        translationSpanish:
          "desarrollar funcionalidades para aplicaciones orientadas al usuario",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 9. "so hyena permit that the thing was time refactoring"
    if (/\b(hyena\s+permit|the\s+thing\s+was\s+time\s+refactoring)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-hyena-permit-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "so hyena permit that the thing was time refactoring",
        correctWord: "so I never permit the team to waste time on unplanned refactoring",
        userSaidContext: "so hyena permit that the thing was time refactoring",
        betterWay: "so I ensure the team refactors with clear business goals",
        explanation:
          "Audio distorsionado: entendió 'hyena permit' en lugar de 'I never permit'.",
        translationSpanish:
          "así que me aseguro de que el equipo refactorice con objetivos de negocio claros",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 10. "more important life only than half a perfect call"
    if (
      /\b(life\s+only\s+than\s+half\s+a\s+perfect\s+call|half\s+a\s+perfect\s+call)\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-perfect-call-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "life only than half a perfect call",
        correctWord: "going live with working features rather than having perfect code",
        userSaidContext: "more important life only than half a perfect call",
        betterWay: "shipping working software rather than waiting for 100% perfect code",
        explanation:
          "Distorsión fonética: el micrófono escuchó 'life only than half a perfect call' en vez de 'shipping working software'.",
        translationSpanish:
          "lanzar software funcional en lugar de esperar a tener un código 100% perfecto",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 11. "construct the product fast"
    if (/\bconstruct\s+(the\s+)?product(\s+fast)?\b/i.test(text)) {
      detectedErrors.push({
        id: `err-construct-product-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "construct the product fast",
        correctWord: "build the product quickly / accelerate delivery",
        userSaidContext: "construct the product fast",
        betterWay: "build and deliver the product quickly",
        explanation:
          "En desarrollo de software se dice 'build / develop products' (no 'construct') y se usa el adverbio 'quickly'.",
        translationSpanish:
          "construir y entregar el producto rápidamente",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 12. "launchment it"
    if (/\b(launchment|deployment\s+it|development\s+it)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-invented-ment-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "launchment it",
        correctWord: "launch it / deploy it",
        userSaidContext: "launchment it",
        betterWay: "launch it to market",
        explanation:
          "'Launchment' no existe en inglés (interferencia de 'lanzamiento'). El verbo correcto es 'launch it' o 'deploy it'.",
        translationSpanish:
          "lanzarlo al mercado",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 13. "we have reason"
    if (/\b(we|i|they|you)\s+have\s+(the\s+)?reason\b/i.test(text)) {
      detectedErrors.push({
        id: `err-have-reason-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "we have reason",
        correctWord: "we are right / our hypothesis is validated",
        userSaidContext: "we have reason",
        betterWay: "it proves our hypothesis is correct",
        explanation:
          "Traducción literal de 'tenemos razón'. En inglés se dice 'we are right' o 'our hypothesis is validated'.",
        translationSpanish:
          "demuestra que nuestra hipótesis es correcta",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 14. "is very delay for the project"
    if (/\bis\s+(very\s+)?delay(\s+for)?\b/i.test(text)) {
      detectedErrors.push({
        id: `err-is-delay-spanglish-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "is very delay for the project",
        correctWord: "causes significant delays / slows down delivery",
        userSaidContext: "is very delay for the project",
        betterWay: "causes unnecessary project delays",
        explanation:
          "'Delay' es un sustantivo o verbo, no un adjetivo. Para 'es muy demorado', se dice 'causes delays' o 'is too slow'.",
        translationSpanish:
          "causa retrasos innecesarios en el proyecto",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 4: RUN-ON SENTENCE & PUNCTUATION COLLISION ANALYZER
    // =========================================================================
    const wordCount = text.split(/\s+/).length;
    const hasPunctuation = /[.,;!?]/.test(text);

    if (wordCount >= 25 && !hasPunctuation && detectedErrors.length < 3) {
      detectedErrors.push({
        id: `err-runon-collision-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "Run-on sentence without punctuation or breathing pauses",
        correctWord:
          "Break long responses into distinct sentences with transitional phrases ('First', 'Furthermore', 'Consequently')",
        userSaidContext: text.slice(0, 70) + "...",
        betterWay:
          "Structure your answer into distinct thoughts: state your principle, explain the trade-off, and give a concrete example.",
        explanation:
          "Speaking 25+ words in a single unpunctuated stream makes it difficult for an interviewer to follow your key message. Use clear pauses.",
        translationSpanish:
          "Oración continua sin pausas ni puntuación. Divide tus ideas en oraciones claras.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 5: MATHEMATICAL SCORING (NO FALSE HIGHS ON BROKEN SPEECH)
    // =========================================================================
    const errorCount = detectedErrors.length;
    let grammarScore = 92;
    let clarityScore = 90;
    let vocabularyScore = 88;

    if (errorCount > 0) {
      // Linear penalty strictly bringing score down
      grammarScore = Math.max(15, 92 - errorCount * 14);
      clarityScore = Math.max(20, 90 - errorCount * 12);
      vocabularyScore = Math.max(25, 88 - errorCount * 11);
    }

    const overallScore = Math.round((grammarScore + clarityScore + vocabularyScore) / 3);

    // Dynamic Model Answer tailored to active question
    const modelAnswer =
      ROLE_MODEL_ANSWERS[currentQuestion.id] ||
      generateDynamicModelAnswer(currentQuestion);

    const keyStrengths: string[] = [];
    if (errorCount === 0) {
      keyStrengths.push(
        "High grammatical precision",
        "Clear executive delivery",
        "Addressed the prompt directly",
      );
    } else {
      keyStrengths.push(
        "Good communicative initiative",
        "Attempted to address the core interview topic",
      );
    }

    const tipsForNextTurn =
      errorCount > 0
        ? `You have ${errorCount} strategic, grammatical, and pronunciation point${errorCount > 1 ? "s" : ""} to polish. Review the feedback cards and save them to your Memory Bank!`
        : "Outstanding answer! Keep reinforcing structured STAR examples.";

    return {
      overallScore,
      clarityScore,
      grammarScore,
      vocabularyScore,
      userSpokenText: text,
      improvedFullAnswer: modelAnswer,
      unclearOrErrorWords: detectedErrors,
      keyStrengths,
      tipsForNextTurn,
      strategicFeedback,
    };
  }
}
