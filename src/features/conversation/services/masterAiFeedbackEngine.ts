/**
 * Comprehensive Multi-Layer AI Interview Feedback Engine
 * Analyzes:
 * 1. Strategic Content & Behavioral Intent (Blaming team, STAR method, conflict handling)
 * 2. Grammatical Accuracy (Tenses, say vs tell, comparative adverbs, pronoun agreement, word order)
 * 3. Lexical Precision & Spanglish Interference (Literal translations, noun-as-verb, awkward collocations)
 * 4. Bespoke Professional Model Answer synthesis tailored to every question
 */

import {
  SpecificErrorItem,
  TurnEvaluationFeedback,
  InterviewQuestionItem,
} from "./interviewEngineService";

export interface StrategicFeedbackItem {
  type: "STRATEGIC_WARNING" | "CONTENT_TIP" | "STAR_ALIGNMENT";
  title: string;
  explanation: string;
  recommendation: string;
}

export interface ComprehensiveTurnFeedback extends TurnEvaluationFeedback {
  strategicFeedback?: StrategicFeedbackItem | null;
}

export class MasterAiFeedbackEngine {
  /**
   * Evaluates user spoken answer with deep linguistic, grammatical, and strategic analysis.
   */
  public static evaluateTurn(
    rawSpokenText: string,
    currentQuestion: InterviewQuestionItem,
  ): ComprehensiveTurnFeedback {
    const text = rawSpokenText.trim();

    if (!text || text.length < 3) {
      return {
        overallScore: 30,
        clarityScore: 25,
        grammarScore: 30,
        vocabularyScore: 35,
        userSpokenText: "(No clear speech detected)",
        improvedFullAnswer:
          "When answering this question, introduce a specific situation, explain the task, describe your action, and share the measurable result.",
        unclearOrErrorWords: [
          {
            id: `err-empty-${Date.now()}`,
            errorType: "UNCLEAR_WORD",
            errorWord: "(Microphone mute or low volume)",
            correctWord: "Speak clearly into the microphone",
            userSaidContext: "No audio captured",
            betterWay: "Speak in a clear, audible voice close to your mic.",
            explanation:
              "The microphone did not detect clear vocal audio. Ensure your microphone permissions are active.",
            translationSpanish: "El micrófono no captó tu voz. Verifica que esté habilitado.",
            cefrLevel: "A1",
            savedToMemory: false,
          },
        ],
        keyStrengths: ["Session active"],
        tipsForNextTurn:
          "Speak directly into your microphone at a steady pace and use the STAR method.",
      };
    }

    const detectedErrors: SpecificErrorItem[] = [];
    const lower = text.toLowerCase();

    // =========================================================================
    // PILLAR 1: STRATEGIC & BEHAVIORAL CONTENT ANALYSIS
    // =========================================================================
    let strategicFeedback: StrategicFeedbackItem | null = null;

    // A. Blaming the Engineering Team (Failed Launch / Blameless Culture)
    const isLaunchFailureQuestion = /didn't go as planned|failed launch|launch failure|delay/i.test(
      currentQuestion.question,
    );
    const blamesTeamOrDevelopers =
      /developers didn't|developers did not|they didn't do|their fault|need to work more fast|told them to work faster|didn't do his job/i.test(
        lower,
      );

    if (isLaunchFailureQuestion && blamesTeamOrDevelopers) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Liderazgo: Responsabilidad Compartida",
        explanation:
          "Identificamos que buscaste explicar un momento difícil del proyecto. En entrevistas de liderazgo de producto, transmitir propiedad compartida ('shared ownership') y explicar cómo gestionaste el alcance técnico transmite gran madurez ejecutiva.",
        recommendation:
          "Paso a paso: Para tu próxima respuesta, describe el retraso como un reto de complejidad técnica y explica cómo re-priorizaste funciones secundarias para proteger la calidad del lanzamiento.",
      };
      detectedErrors.push({
        id: `err-strat-blame-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Blaming developers ('developers didn't do their job on time / work faster')",
        correctWord:
          "Take shared ownership and run a blameless post-mortem ('We encountered unforeseen technical debt during QA...')",
        userSaidContext: "because the developers didn't do his job on time",
        betterWay:
          "We encountered unexpected technical complexity during QA, so I worked with engineering leads to de-scope secondary features rather than rushing an unstable release.",
        explanation:
          "Frame delays as technical complexity managed through collaborative scope adjustment rather than personal fault.",
        translationSpanish:
          "Consejo de liderazgo: Describe el retraso como complejidad técnica gestionada con ajuste de alcance.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // B. Disagreement / Conflict Question Check
    const isConflictQuestion =
      /disagreement|conflict|difficult stakeholder|disagree|disputed/i.test(
        currentQuestion.question,
      );
    const deniesConflict =
      /no I don't have problem|no, I don't have problem|never had a problem|never have problem|don't have problems with anyone|no problem with anyone/i.test(
        lower,
      );

    if (isConflictQuestion && deniesConflict) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad Estratégica: El Desacuerdo como Colaboración",
        explanation:
          "Tu intención de transmitir un ambiente positivo es muy valiosa. Los entrevistadores preguntan sobre desacuerdos para conocer tu capacidad de escuchar, negociar y encontrar soluciones basadas en datos.",
        recommendation:
          "Paso a paso: Comparte un ejemplo real donde tuviste diferentes puntos de vista técnicos y cómo colaboraste con el equipo para llegar a un consenso constructivo.",
      };
      detectedErrors.push({
        id: `err-strat-conflict-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Denying professional disagreements ('No, I don't have problems')",
        correctWord:
          "Acknowledge disagreements as healthy collaboration ('While I avoid toxic conflict, I embrace constructive technical debate...')",
        userSaidContext: text.slice(0, 50),
        betterWay:
          "While I maintain collaborative relationships, healthy technical disagreements happen. My approach is always to sit down with the engineer, align on user goals, and use data to find consensus.",
        explanation:
          "In leadership and Product Manager interviews, reframe conflict as constructive collaboration.",
        translationSpanish:
          "Consejo estratégico: Aborda los desacuerdos técnicos como debates constructivos orientados a datos.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // C. Prioritization Question Check
    const isPrioritizationQuestion = /prioritize|prioritizing|competing feature/i.test(
      currentQuestion.question,
    );
    const mentionsPrioritizationFramework =
      /rice|moscow|matrix|framework|impact|effort|trade-off|tradeoff|roi|business value|customer value/i.test(
        lower,
      );

    if (
      isPrioritizationQuestion &&
      !mentionsPrioritizationFramework &&
      !isConflictQuestion &&
      !isLaunchFailureQuestion
    ) {
      strategicFeedback = {
        type: "CONTENT_TIP",
        title: "Impulso de Seniority: Marcos de Priorización",
        explanation:
          "Identificamos buenas ideas sobre cómo equilibras peticiones. Integrar un marco estructurado te ayudará a proyectar mayor solidez y metodología.",
        recommendation:
          "Paso a paso: Menciona marcos reconocidos como el modelo RICE (Reach, Impact, Confidence, Effort) o la matriz de Valor vs. Esfuerzo para respaldar tus decisiones.",
      };
      detectedErrors.push({
        id: `err-strat-prio-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Vague prioritization without metrics or frameworks",
        correctWord: "Use structured frameworks (RICE model, Value vs. Effort matrix)",
        userSaidContext: text.slice(0, 60),
        betterWay:
          "I prioritize competing requests using the RICE framework (Reach, Impact, Confidence, Effort) to balance urgent sales requests with technical debt and executive goals.",
        explanation:
          "Product Managers demonstrate structured decision-making rather than vague intuition.",
        translationSpanish:
          "Tip de metodología: Apóyate en marcos como RICE para estructurar tu proceso de decisión.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 2: SPANGLISH LITERALISMS, GRAMMAR, SYNTAX & PHONETIC PARSING
    // =========================================================================

    // 1. "lost man of the app" (Mic misinterpretation for "launch of the app")
    if (/\b(the\s+)?lost\s+man(\s+of\s+the\s+app)?\b/i.test(text)) {
      detectedErrors.push({
        id: `err-lost-man-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "lost man of the app",
        correctWord: "launch of the app / release of the app",
        userSaidContext: "the lost man of the app",
        betterWay: "when the launch of the app didn't go as planned",
        explanation:
          "Microphone misinterpretation. The speech recognizer heard 'lost man' instead of 'launch'. Make sure to articulate the final /t/ sound in 'launch'.",
        translationSpanish:
          "Error de captación del micrófono: entendió 'lost man' en lugar de 'launch' (lanzamiento).",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 2. "didn't go as planning" (Gerund instead of past participle)
    if (/\b(didn't|did\s+not)\s+go\s+as\s+planning\b/i.test(text)) {
      detectedErrors.push({
        id: `err-as-planning-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "didn't go as planning",
        correctWord: "didn't go as planned",
        userSaidContext: "didn't go as planning",
        betterWay: "didn't go as planned",
        explanation:
          "The fixed English idiom is 'didn't go as planned' (using the past participle 'planned', not the gerund 'planning').",
        translationSpanish:
          "La expresión fija en inglés es 'didn't go as planned' (planeado), no 'planning'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 3. "do his job" (Plural subject agreement with developers)
    if (
      /\b(developers|engineers|they|team\s+members)\s+(didn't|did\s+not)\s+(do\s+it\s+)?do\s+his\s+job\b/i.test(
        text,
      ) ||
      /\bdevelopers\s+didn't\s+do\s+his\s+job\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-his-job-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "developers didn't do his job",
        correctWord: "developers didn't finish their tasks on schedule",
        userSaidContext: "developers didn't do it do his job",
        betterWay: "the engineering team encountered delays with their deliverables",
        explanation:
          "Two errors: 1) 'Developers' is plural, so the possessive pronoun must be 'their', not 'his'. 2) In professional English, refer to 'meeting their deadlines' or 'completing deliverables'.",
        translationSpanish:
          "Discordancia de pronombre: 'developers' es plural y lleva 'their', no 'his'.",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 4. "I say them" (Say vs. Tell error)
    if (/\bi\s+(say|said|saying)\s+(them|him|her|us|me)\b/i.test(text)) {
      const match = text.match(/\bi\s+(say|said|saying)\s+(them|him|her|us|me)\b/i);
      const pr = match ? match[2] : "them";
      detectedErrors.push({
        id: `err-say-them-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `I say ${pr}`,
        correctWord: `I told ${pr} / I explained to ${pr}`,
        userSaidContext: `I say ${pr} that they need`,
        betterWay: `I told ${pr} that we needed to realign our timeline`,
        explanation:
          "In English, 'tell' takes a direct personal object ('I told them'), while 'say' requires 'to' ('I said to them'). In the past tense, use 'I told them'.",
        translationSpanish:
          "Uso incorrecto de 'say': se dice 'I told them' (les dije), no 'I say them'.",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 5. "work more fast" (Comparative adverb error)
    if (
      /\b(work|run|build|move|deliver)\s+more\s+fast\b/i.test(text) ||
      /\bmore\s+fast\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-more-fast-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "work more fast",
        correctWord: "work faster / accelerate velocity",
        userSaidContext: "they need to work more fast",
        betterWay: "they needed to increase sprint velocity",
        explanation:
          "'Fast' is a short one-syllable word whose comparative form is 'faster'. 'More fast' is grammatically incorrect.",
        translationSpanish:
          "Error comparativo: no existe 'more fast', se dice 'work faster' o 'accelerate velocity'.",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 6. "for me is very important the quality" (Spanish syntax & missing dummy subject)
    if (
      /\bfor\s+me\s+is\s+very\s+important\s+the\s+[a-z]+/i.test(text) ||
      /\bis\s+very\s+important\s+the\s+quality\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-important-quality-spanglish-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "for me is very important the quality",
        correctWord: "for me, product quality is paramount / product quality is essential",
        userSaidContext: "for me is very important the quality",
        betterWay: "for me, maintaining high product quality is non-negotiable",
        explanation:
          "Literal Spanish word order ('para mí es muy importante la calidad'). In English, place the subject before the predicate: 'For me, quality is very important' or 'Quality is essential'.",
        translationSpanish:
          "Orden de palabras literal del español. En inglés el sujeto va primero: 'For me, product quality is essential'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 7. "so is necessary a person" / "is necessary a person"
    if (
      /\b(so\s+is|is|it's|it\s+is)\s+necessary\s+a\s+person\b/i.test(text) ||
      /\bnecessary\s+a\s+person\s+with\s+experience\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-so-is-necessary-person-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "so is necessary a person with experience like me",
        correctWord:
          "so you need someone with my experience / so it is essential to have someone with my background",
        userSaidContext: "so is necessary a person with experience like me",
        betterWay: "which is why you need someone with my background and experience",
        explanation:
          "Two combined errors: 1) Missing dummy subject 'it' ('so it is'). 2) Literal translation from Spanish ('es necesaria una persona'). In English, say 'so you need someone with my experience' or 'so it is essential to have someone with my background'.",
        translationSpanish:
          "Traducción literal de 'así que es necesaria una persona'. En inglés se dice 'so you need someone with my experience' o 'so it is essential to have someone with my background'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 8. "have work" (Missing past participle -ed)
    if (
      /\b(i\s+)?have\s+work\s+(during|for|in|as)\b/i.test(text) ||
      /\bhave\s+work\s+\d+\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-have-work-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "have work",
        correctWord: "have worked",
        userSaidContext: "I have work during",
        betterWay: "I have worked in this field",
        explanation:
          "The present perfect tense requires the auxiliary 'have' plus the past participle form of the verb ('have worked', not 'have work').",
        translationSpanish:
          "Falta el participio pasado (-ed): debe ser 'I have worked', no 'I have work'.",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 9. "during 40 years" / "during 4 years" (for duration of time)
    if (/\bduring\s+(\d+)\s*(?:years?|months?|dr)?\b/i.test(text)) {
      const match = text.match(/\bduring\s+(\d+)\s*(?:years?|months?|dr)?\b/i);
      const num = match ? match[1] : "4";
      detectedErrors.push({
        id: `err-during-time-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `during ${num} years`,
        correctWord: `for ${num} years`,
        userSaidContext: `during ${num} years`,
        betterWay: text.replace(
          new RegExp(`\\bduring\\s+${num}\\s*(?:years?|months?|dr)?\\b`, "gi"),
          `for ${num} years`,
        ),
        explanation:
          "To describe the duration of an activity over time, English uses 'for' ('for 4 years'), never 'during'.",
        translationSpanish: "Para duración de tiempo se usa 'for' ('for 4 years'), nunca 'during'.",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 10. "I get experience" (verb choice & tense)
    if (/\b(and\s+)?i\s+get\s+experience\b/i.test(text)) {
      detectedErrors.push({
        id: `err-get-experience-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "I get experience",
        correctWord: "I gained valuable experience / I acquired experience",
        userSaidContext: "and I get experience",
        betterWay: text.replace(/\bi\s+get\s+experience\b/gi, "I gained extensive experience"),
        explanation:
          "'Get experience' sounds informal. In a professional interview, use precise verbs: 'I gained experience' or 'I acquired domain expertise'.",
        translationSpanish:
          "En lugar del verbo informal 'get', en entrevistas se dice 'I gained experience' o 'I acquired expertise'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 11. "disembly" / "disembaldwin" (Spanish interference: desenvolverse)
    if (/\b(disembly|disembaldwin)\b/i.test(text)) {
      const match = text.match(/\b(disembly|disembaldwin)\b/i);
      const word = match ? match[1] : "disembly";
      detectedErrors.push({
        id: `err-disembly-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: word,
        correctWord: "perform effectively / handle responsibilities / navigate challenges",
        userSaidContext: `let me ${word}`,
        betterWay: text.replace(new RegExp(`\\b${word}\\b`, "gi"), "perform effectively"),
        explanation: `'${word}' is not an English word. It comes from the Spanish concept 'desenvolverme'. In English, express this as 'has allowed me to perform effectively' or 'navigate complex challenges'.`,
        translationSpanish: `Falso amigo / interferencia de 'desenvolverme'. En inglés se dice 'perform effectively' o 'navigate challenges'.`,
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 12. "we naturally" / "with naturally" (literal translation of 'con naturalidad')
    if (/\b(we|with)\s+naturally\b/i.test(text)) {
      const match = text.match(/\b(we|with)\s+naturally\b/i);
      const matched = match ? match[0] : "with naturally";
      detectedErrors.push({
        id: `err-with-naturally-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: matched,
        correctWord: "naturally (adverb alone) / perform with confidence",
        userSaidContext: matched,
        betterWay: text.replace(new RegExp(`\\b${matched}\\b`, "gi"), "naturally"),
        explanation:
          "Literal translation of 'con naturalidad'. In English, simply use the adverb 'naturally' without 'with' or misplaced pronouns.",
        translationSpanish:
          "Traducción literal de 'con naturalidad'. En inglés se usa directamente el adverbio 'naturally'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 13. "the request fast" (Misplaced post-nominal adjective)
    if (/\b(the\s+)?request(s)?\s+(fast|quick|easy)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-request-fast-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "the request fast",
        correctWord: "processing requests efficiently / handling requests quickly",
        userSaidContext: "the request fast",
        betterWay: "handling incoming requests quickly and efficiently",
        explanation:
          "In English, placing an adjective ('fast') directly after the noun ('request') sounds incomplete and ungrammatical. In professional contexts, use an active gerund and adverb ('handling requests quickly').",
        translationSpanish:
          "En inglés no se coloca el adjetivo después del sustantivo ('the request fast'). Usa un verbo activo con adverbio: 'handling requests quickly'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 14. "and good practice" / "good practice" without active verb / plural
    if (/\band\s+good\s+practice(s)?\b/i.test(text) || /\bgood\s+practice\s+so\b/i.test(text)) {
      detectedErrors.push({
        id: `err-good-practice-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "and good practice",
        correctWord: "and applying good practices / following best practices",
        userSaidContext: "and good practice",
        betterWay: "and applying industry best practices",
        explanation:
          "The phrase is disconnected. It needs an action verb indicating what you do with those practices, and is typically used in the plural ('practices').",
        translationSpanish:
          "Conecta tus ideas con un verbo de acción: 'applying good practices' o 'following best practices'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 15. "can have this organization" / "have organization" (Literal translation of "tener organización")
    if (
      /\b(can\s+)?(have|has)\s+(this\s+)?organization\b/i.test(text) ||
      /\bhave\s+organization\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-have-org-spanglish-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "can have this organization",
        correctWord: "stays organized / has a structured approach",
        userSaidContext: "that my team can have this organization",
        betterWay: "so that my team stays highly organized and aligned",
        explanation:
          "Literal translation from Spanish ('tener organización'). Native speakers do not say 'have organization'; they say 'stay organized', 'maintain a structured workflow', or 'keep things organized'.",
        translationSpanish:
          "Traducción literal del español ('tener organización'). Los nativos dicen 'stay organized' o 'have a structured approach'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 16. "for me is in this principle" / "for me is" (Missing dummy subject "it")
    if (/\b(so\s+)?for\s+me\s+is\b/i.test(text)) {
      detectedErrors.push({
        id: `err-for-me-is-spanglish-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "for me is",
        correctWord: "for me, it is / my guiding principle is",
        userSaidContext: "for me is in this principle",
        betterWay: "For me, it is a core principle to maintain team organization.",
        explanation:
          "In English, every clause must have an explicit subject. You cannot omit 'it' after 'for me' ('for me, it is...'). In a professional interview, say 'My guiding principle is...'.",
        translationSpanish:
          "Traducción literal de 'para mí es'. En inglés siempre necesitas el pronombre sujeto 'it' ('for me, it is').",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 17. "anyone's" / "someone's" used as simple object pronoun
    if (
      /\b(anyone|someone|no one|everyone)'s\s+(because|and|to|in|at|so|with|that)\b/i.test(text)
    ) {
      const match = text.match(/\b(anyone|someone|no one|everyone)'s\b/i);
      const pr = match ? match[1] : "anyone";
      detectedErrors.push({
        id: `err-possessive-pr-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${pr}'s (possessive apostrophe)`,
        correctWord: `${pr} (without apostrophe)`,
        userSaidContext: `${pr}'s`,
        betterWay: text.replace(new RegExp(`\\b${pr}'s\\b`, "gi"), pr),
        explanation: `Do not add a possessive apostrophe ('s) when using '${pr}' as a direct or prepositional object. Say '${pr}', not '${pr}'s'.`,
        translationSpanish: `No uses apóstrofe de posesión: debe ser '${pr}' (nadie / alguien), no '${pr}'s'.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 18. Redundant conjunctions "because and" / "so and"
    if (/\bbecause\s+and\b/i.test(text)) {
      detectedErrors.push({
        id: `err-because-and-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "because and",
        correctWord: "because (remove 'and')",
        userSaidContext: "because and my",
        betterWay: text.replace(/\bbecause\s+and\b/gi, "because"),
        explanation:
          "Using 'because' and 'and' together is redundant. Use only 'because' to introduce the reason.",
        translationSpanish:
          "Conectores redundantes: 'because and' es incorrecto; usa solo 'because'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 19. "after work" used instead of "previous job / past role"
    if (/\b(in\s+my|my)\s+after\s+work\b/i.test(text) || /\bafter\s+work\s+was\b/i.test(text)) {
      detectedErrors.push({
        id: `err-after-work-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "after work",
        correctWord: "previous job / last role / previous company",
        userSaidContext: "my after work was",
        betterWay: text.replace(/\bafter\s+work\b/gi, "previous job"),
        explanation:
          "'After work' means free time after the working day ends (e.g., 'going to the gym after work'). To refer to your past employment, say 'my previous job' or 'my past role'.",
        translationSpanish:
          "'After work' significa 'después del trabajo' (tiempo libre). Para referirte a tu trabajo anterior, usa 'my previous job' o 'my past company'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 20. "was on environment a very fluently"
    if (
      /\bwas\s+(on\s+)?environment\s+(a\s+)?very\s+fluently\b/i.test(text) ||
      /\benvironment\s+a\s+very\s+fluently\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-env-fluent-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "environment a very fluently",
        correctWord: "had a very collaborative / fluid environment",
        userSaidContext: "was on environment a very fluently",
        betterWay: "we had a very collaborative and fluid work environment",
        explanation:
          "'Fluently' is an adverb (used for speaking: 'he speaks fluently'). To describe an atmosphere or workplace, use the adjectives 'collaborative', 'fluid', or 'open'.",
        translationSpanish:
          "'Fluently' es un adverbio (fluidamente). Para describir un entorno de trabajo usa 'a collaborative environment' o 'a fluid environment'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 21. "for me be able" (missing infinitive particle "to")
    if (/\bfor\s+me\s+be\s+able\b/i.test(text)) {
      detectedErrors.push({
        id: `err-for-me-be-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "for me be able",
        correctWord: "for me to be able",
        userSaidContext: "for me be able to speak",
        betterWay: text.replace(/\bfor\s+me\s+be\s+able\b/gi, "for me to be able"),
        explanation:
          "The construction requires the infinitive marker 'to': 'for [pronoun] + TO + verb' ('for me to be able to speak').",
        translationSpanish: "Falta el 'to' de infinitivo: 'for me to be able' (para mí poder...).",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 22. "an older people" / "an other people"
    if (/\ban\s+(older|other)\s+people\b/i.test(text)) {
      const match = text.match(/\ban\s+(older|other)\s+people\b/i);
      const adj = match ? match[1] : "other";
      detectedErrors.push({
        id: `err-an-people-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `an ${adj} people`,
        correctWord: `${adj} people (remove 'an')`,
        userSaidContext: `an ${adj} people`,
        betterWay: text.replace(new RegExp(`\\ban\\s+${adj}\\s+people\\b`, "gi"), `${adj} people`),
        explanation:
          "'An' is a singular indefinite article and can NEVER be used with the plural noun 'people'. Say 'other people' or 'older people'.",
        translationSpanish:
          "Contradicción singular/plural: 'an' es singular y 'people' es plural. Debe ser 'other people' (sin 'an').",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 23. "I think is better solution"
    if (/\bi\s+think\s+is\s+(better|a\s+better|the\s+best)\s+solution\b/i.test(text)) {
      detectedErrors.push({
        id: `err-think-is-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "I think is better solution",
        correctWord: "I think it is a better solution",
        userSaidContext: "I think is better solution",
        betterWay: text.replace(
          /\bi\s+think\s+is\s+better\s+solution\b/gi,
          "I think it is a better solution",
        ),
        explanation:
          "Clauses in English require an explicit subject 'it' and the indefinite article 'a': 'I think IT IS A better solution'.",
        translationSpanish:
          "Falta el sujeto 'it' y el artículo 'a': 'I think it is a better solution'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 24. "with other person is speaking"
    if (/\bwith\s+(other|the\s+other)\s+person\s+is\s+speaking\b/i.test(text)) {
      detectedErrors.push({
        id: `err-person-speaking-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "with other person is speaking",
        correctWord: "speaking directly with the other person",
        userSaidContext: "with other person is speaking",
        betterWay: "sitting down and speaking directly with the other person",
        explanation:
          "Unnatural sentence structure. The natural English phrasing is 'speaking directly with the other person' or 'having an open dialogue'.",
        translationSpanish:
          "Estructura confusa: lo natural es decir 'speaking directly with the other person'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 25. "don't solution nothing"
    if (
      /\bdon't\s+solution\s+nothing\b/i.test(text) ||
      /\bdoesn't\s+solution\s+nothing\b/i.test(text) ||
      /\bnot\s+solution\s+nothing\b/i.test(text)
    ) {
      detectedErrors.push({
        id: `err-solution-nothing-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "don't solution nothing",
        correctWord: "doesn't solve anything",
        userSaidContext: "the problems don't solution nothing",
        betterWay: text.replace(/\bdon't\s+solution\s+nothing\b/gi, "doesn't solve anything"),
        explanation:
          "Two major errors: 1) 'Solution' is a noun; the verb is 'solve'. 2) English does not allow double negatives ('don't + nothing'). Say 'doesn't solve anything'.",
        translationSpanish:
          "Doble error: 'solution' es sustantivo (el verbo es 'solve') y no se puede hacer doble negación ('don't + nothing'). Se dice 'doesn't solve anything'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 3: UNIVERSAL ESL GRAMMAR DETECTION (catches common errors
    // not covered by Spanglish-specific patterns above)
    // =========================================================================

    // U1. Missing past tense in past-narrative context
    // Detects: "we have a big problem" when context implies past ("one time", "last year", "previous", "past job")
    const hasPastContext =
      /\b(one time|last (year|month|week|time)|in my (past|previous|last)|previously|ago|back then|when i was)\b/i.test(
        lower,
      );
    if (hasPastContext) {
      // "we have" → "we had" in past context
      if (/\bwe\s+have\s+(?:a|an|the|some|many|big|serious|major)\b/i.test(lower)) {
        detectedErrors.push({
          id: `err-u1-have-had-${Date.now()}`,
          errorType: "GRAMMAR",
          errorWord: "we have",
          correctWord: "we had",
          userSaidContext: text.match(/we\s+have\s+\w+\s+\w+/i)?.[0] ?? "we have a problem",
          betterWay: "we had a significant challenge",
          explanation:
            "When narrating a past event, use the past simple tense ('we had'), not the present ('we have').",
          translationSpanish:
            "Al narrar eventos pasados usa el pasado simple: 'we had' en vez de 'we have'.",
          cefrLevel: "A2",
          savedToMemory: false,
        });
      }

      // "I learn much" → "I learned a lot"
      if (/\bi\s+learn\s+(much|a\s+lot|many\s+things)\b/i.test(lower)) {
        detectedErrors.push({
          id: `err-u1-learn-${Date.now()}`,
          errorType: "GRAMMAR",
          errorWord: "I learn",
          correctWord: "I learned",
          userSaidContext: text.match(/I\s+learn\s+\w+/i)?.[0] ?? "I learn much",
          betterWay: "I learned a great deal from that experience",
          explanation:
            "Use past tense 'learned' when describing what you gained from a past experience, not present tense 'learn'.",
          translationSpanish:
            "Usa el pasado 'I learned' al hablar de lo que aprendiste, no el presente 'I learn'.",
          cefrLevel: "A2",
          savedToMemory: false,
        });
      }
    }

    // U2. Subject-verb disagreement: plural noun + "was"
    // "connections was" → "connections were", "users was" → "users were", "systems was", etc.
    if (
      /\b(connections|users|systems|servers|requests|developers|engineers|teams|problems|issues|bugs|errors|services|features|members|customers|employees)\s+was\b/i.test(
        lower,
      )
    ) {
      const svMatch = lower.match(
        /\b(connections|users|systems|servers|requests|developers|engineers|teams|problems|issues|bugs|errors|services|features|members|customers|employees)\s+was\b/i,
      );
      const subject = svMatch ? svMatch[1] : "connections";
      detectedErrors.push({
        id: `err-u2-sv-agreement-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${subject} was`,
        correctWord: `${subject} were`,
        userSaidContext: text.match(new RegExp(`${subject}\\s+was\\s+\\w+`, "i"))?.[0] ?? `${subject} was full`,
        betterWay: `the ${subject} were fully utilized`,
        explanation: `'${subject}' is plural and requires the plural past tense verb 'were', not 'was'.`,
        translationSpanish: `'${subject}' es plural y requiere 'were' (eran/estaban), no 'was'.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // Also: "the system go down" → "the system went down"
    if (/\b(the\s+)?(system|server|app|application|database|service)\s+go\s+(down|up|off|out)\b/i.test(lower)) {
      const goMatch = lower.match(
        /\b(?:the\s+)?(system|server|app|application|database|service)\s+go\s+(down|up|off|out)\b/i,
      );
      const subj = goMatch ? goMatch[1] : "system";
      const dir = goMatch ? goMatch[2] : "down";
      detectedErrors.push({
        id: `err-u2-go-went-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${subj} go ${dir}`,
        correctWord: `${subj} went ${dir}`,
        userSaidContext: `the ${subj} go ${dir}`,
        betterWay: `the ${subj} went ${dir} for approximately two hours`,
        explanation: `When narrating a past event, use past simple 'went' instead of present 'go'.`,
        translationSpanish: `Usa el pasado 'went ${dir}' en vez del presente 'go ${dir}' al narrar eventos pasados.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // U3. "for + verb" instead of "to + verb" (Spanish interference: "para mitigar" → "for mitigate")
    if (
      /\bfor\s+(mitigate|solve|fix|prevent|reduce|improve|manage|handle|resolve|avoid|implement|deploy|complete|create|build|develop|maintain|investigate)\b/i.test(
        lower,
      )
    ) {
      const forMatch = lower.match(
        /\bfor\s+(mitigate|solve|fix|prevent|reduce|improve|manage|handle|resolve|avoid|implement|deploy|complete|create|build|develop|maintain|investigate)\b/i,
      );
      const verb = forMatch ? forMatch[1] : "mitigate";
      detectedErrors.push({
        id: `err-u3-for-to-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `for ${verb}`,
        correctWord: `to ${verb}`,
        userSaidContext: `for ${verb} this`,
        betterWay: `to ${verb} this issue effectively`,
        explanation:
          "In English, use 'to' (not 'for') before an infinitive verb to express purpose: 'to mitigate', 'to solve', 'to prevent'.",
        translationSpanish:
          "Interferencia del español 'para + verbo'. En inglés se usa 'to + verbo': 'to mitigate', 'to solve'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U4. "we decide implement" / "we decide put" → "we decided to implement"
    // Missing past tense AND missing "to" before second verb
    if (
      /\bwe\s+(decide|start|want|need|try|plan|choose|agree|hope)\s+(implement|put|build|create|use|deploy|install|add|remove|change|move|make|send)\b/i.test(
        lower,
      )
    ) {
      const chainMatch = lower.match(
        /\bwe\s+(decide|start|want|need|try|plan|choose|agree|hope)\s+(implement|put|build|create|use|deploy|install|add|remove|change|move|make|send)\b/i,
      );
      const v1 = chainMatch ? chainMatch[1] : "decide";
      const v2 = chainMatch ? chainMatch[2] : "implement";
      detectedErrors.push({
        id: `err-u4-chain-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `we ${v1} ${v2}`,
        correctWord: `we ${v1}d to ${v2}`,
        userSaidContext: `we ${v1} ${v2}`,
        betterWay: `we ${v1}d to ${v2} the solution`,
        explanation: `Two errors: 1) Past tense needed ('${v1}d'). 2) The verb '${v1}' requires 'to' before the next verb ('${v1}d to ${v2}').`,
        translationSpanish: `Doble error: falta el pasado ('${v1}d') y el 'to' infinitivo ('${v1}d to ${v2}').`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U5. "very stressing" → "very stressful" (adjective/participle confusion)
    if (/\b(very|really|so|quite|extremely)\s+(stressing|boring|confusing|interesting|exciting|tiring|annoying)\b/i.test(lower)) {
      // Only flag "stressing" → "stressful" since others might be valid
      if (/\b(very|really|so|quite|extremely)\s+stressing\b/i.test(lower)) {
        detectedErrors.push({
          id: `err-u5-stressing-${Date.now()}`,
          errorType: "VOCABULARY",
          errorWord: "stressing",
          correctWord: "stressful",
          userSaidContext: "it was very stressing",
          betterWay: "it was an incredibly stressful situation, but I learned a great deal",
          explanation:
            "'Stressing' is not a standard adjective in English. The correct adjective is 'stressful' (meaning 'causing stress').",
          translationSpanish:
            "'Stressing' no es adjetivo estándar. El adjetivo correcto es 'stressful' (estresante).",
          cefrLevel: "B1",
          savedToMemory: false,
        });
      }
    }

    // U6. "learn much" → "learned a lot" (unnatural quantifier)
    if (/\blearn(ed)?\s+much\b/i.test(lower) && !/\bhow\s+much\b/i.test(lower)) {
      detectedErrors.push({
        id: `err-u6-learn-much-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "learn much",
        correctWord: "learned a lot / learned a great deal",
        userSaidContext: "I learn much",
        betterWay: "I learned a great deal from that experience",
        explanation:
          "'Learn much' is unnatural in affirmative sentences. Native speakers say 'learned a lot' or 'learned a great deal'.",
        translationSpanish:
          "'Learn much' es antinatural en afirmativas. Se dice 'I learned a lot' o 'I learned a great deal'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U7. "many users try to login at same time" → "many users tried to log in at the same time"
    if (/\b(users|people|customers|clients)\s+(try|start|begin|want)\s+to\b/i.test(lower) && hasPastContext) {
      const tryMatch = lower.match(/\b(users|people|customers|clients)\s+(try|start|begin|want)\s+to\b/i);
      const subj2 = tryMatch ? tryMatch[1] : "users";
      const verb2 = tryMatch ? tryMatch[2] : "try";
      // Only flag if it's clearly present tense in a past context
      if (!/\b(tried|started|began|wanted)\b/i.test(lower)) {
        detectedErrors.push({
          id: `err-u7-past-tense-${Date.now()}`,
          errorType: "GRAMMAR",
          errorWord: `${subj2} ${verb2} to`,
          correctWord: `${subj2} ${verb2 === "try" ? "tried" : verb2 + "ed"} to`,
          userSaidContext: `${subj2} ${verb2} to login`,
          betterWay: `many ${subj2} tried to log in simultaneously`,
          explanation: `When narrating past events, use past tense '${verb2 === "try" ? "tried" : verb2 + "ed"}' instead of present '${verb2}'.`,
          translationSpanish: `Usa el pasado '${verb2 === "try" ? "tried" : verb2 + "ed"}' al narrar eventos pasados, no el presente '${verb2}'.`,
          cefrLevel: "A2",
          savedToMemory: false,
        });
      }
    }

    // U8. "I diagnose the bug looking" → "I diagnosed the bug by looking" (missing past + missing "by")
    if (/\bi\s+(diagnose|investigate|analyze|check|monitor|review|examine)\s+(the|a|this|that)\b/i.test(lower) && hasPastContext) {
      const diagMatch = lower.match(
        /\bi\s+(diagnose|investigate|analyze|check|monitor|review|examine)\s+(?:the|a|this|that)\b/i,
      );
      const diagVerb = diagMatch ? diagMatch[1] : "diagnose";
      detectedErrors.push({
        id: `err-u8-past-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `I ${diagVerb}`,
        correctWord: `I ${diagVerb}d`,
        userSaidContext: `I ${diagVerb} the issue`,
        betterWay: `I ${diagVerb}d the root cause by analyzing the logs`,
        explanation: `Use past tense '${diagVerb}d' when describing a completed action in a past narrative.`,
        translationSpanish: `Usa el pasado '${diagVerb}d' al describir acciones completadas.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // 3. ACCURATE SCORING & QUESTION-SPECIFIC MODEL ANSWER
    // =========================================================================
    const errorCount = detectedErrors.length;
    let grammarScore = 90;
    let clarityScore = 88;
    let vocabularyScore = 85;

    if (errorCount > 0) {
      grammarScore = Math.max(30, 90 - errorCount * 10);
      clarityScore = Math.max(35, 88 - errorCount * 9);
      vocabularyScore = Math.max(40, 85 - errorCount * 8);
    }

    const overallScore = Math.round((grammarScore + clarityScore + vocabularyScore) / 3);

    // Dynamic Context-Specific Model Answers for all Question Categories
    let modelAnswer =
      "In my previous experience, I focused on structured execution, clear stakeholder alignment, and data-driven prioritization to overcome complex delivery challenges.";

    if (isLaunchFailureQuestion || currentQuestion.id === 3) {
      modelAnswer =
        "In a previous product launch, we faced an unexpected delay when critical edge-case bugs were discovered during staging QA. Rather than pushing an unstable release to hit an arbitrary deadline, I took immediate ownership, conducted a rapid triaging session with the engineering leads to de-scope non-critical features, and proactively updated executive stakeholders with a revised two-week rollout plan. The launch succeeded with a 99.8% crash-free session rate.";
    } else if (isConflictQuestion || currentQuestion.id === 5) {
      modelAnswer =
        "While I haven't had severe interpersonal conflicts, I frequently engage in constructive technical debates. In my previous role, a lead engineer and I disagreed on whether to build a custom auth microservice or integrate Auth0. I scheduled a 1-on-1 alignment meeting, anchored our discussion on our core quarterly goals and maintenance cost, and we mutually agreed to use the third-party solution to save two months of engineering bandwidth.";
    } else if (isPrioritizationQuestion || currentQuestion.id === 2) {
      modelAnswer =
        "My priority is to apply structured product frameworks when handling competing requests. For me, it is a core principle that my team uses a transparent model like RICE (Reach, Impact, Confidence, Effort) to objectively balance urgent sales demands with long-term engineering scalability and executive goals.";
    } else if (currentQuestion.id === 1) {
      modelAnswer =
        "I am deeply interested in this position because I have worked in product management for four years. My experience allows me to lead cross-functional teams and build user-centric roadmaps that drive measurable business outcomes.";
    } else if (currentQuestion.id === 4) {
      modelAnswer =
        "I define feature success by establishing clear leading and lagging indicators before development begins. For our onboarding redesign, our North Star metric was Day-7 user retention, while leading metrics included step completion rates and time-to-first-value. We validated these via A/B cohorts before full rollout.";
    } else if (currentQuestion.id === 6) {
      modelAnswer =
        "Before writing code, I conduct continuous discovery: running 5-8 qualitative customer interviews per sprint, building clickable Figma prototypes, and testing assumption riskiest-first to ensure strong problem-solution fit.";
    } else if (currentQuestion.id === 7) {
      modelAnswer =
        "I allocate 20% of every sprint's engineering bandwidth to technical debt and infrastructure reliability. This prevents critical system degradation and keeps our team velocity high over the long term.";
    }

    const keyStrengths: string[] = [];
    if (errorCount === 0) {
      keyStrengths.push(
        "Excellent grammatical precision",
        "Clear executive delivery",
        "Addressed the prompt directly",
      );
    } else {
      keyStrengths.push("Good communicative willingness", "Addressed the core interview topic");
    }

    const tipsForNextTurn =
      errorCount > 0
        ? `You have ${errorCount} linguistic and strategic points to polish. Review the feedback and save them to your Memory Cards!`
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
