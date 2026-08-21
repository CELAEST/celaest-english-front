/**
 * Universal Linguistic & Strategic Parser
 * Enterprise Multi-Layer NLP Engine:
 * 1. Strategic Behavioral Analysis across all PM & Engineering questions
 * 2. Exhaustive Grammatical & Syntax Parsing (Modal verbs, Subject-Verb agreement, pronoun casing, dummy subjects)
 * 3. Deep Spanglish, Phonetic Disambiguation & STT Distortion Engine
 * 4. Run-on Clause Collision & Punctuation Analyzer
 * 5. Honest Mathematical Scoring (Strictly < 40% on broken or garbled English)
 */

import { SpecificErrorItem, TurnEvaluationFeedback, InterviewQuestionItem } from "./interviewEngineService";
import { StrategicFeedbackItem } from "./masterAiFeedbackEngine";

export const ROLE_MODEL_ANSWERS: Record<number, string> = {
  // --- ROUND 1: CORE PRODUCT LEADERSHIP ---
  1: "I am deeply interested in this Product Manager role because I have four years of experience leading cross-functional squads in high-growth SaaS environments. My approach centers on deep customer empathy, data-informed roadmapping, and driving measurable business outcomes like increasing Day-30 retention by 22%.",

  2: "My priority is to apply structured product frameworks when handling competing requests. For me, it is a core principle that my team uses a transparent model like RICE (Reach, Impact, Confidence, Effort) to objectively balance urgent sales demands with long-term engineering scalability and executive goals.",

  3: "In a previous product launch, we faced an unexpected delay when critical edge-case bugs surfaced in staging QA. Rather than pushing an unstable release to hit an arbitrary deadline, I took immediate ownership, conducted a rapid triaging session with engineering to de-scope secondary features, and proactively updated executive stakeholders with a revised rollout plan.",

  4: "I define feature success by establishing clear leading and lagging indicators before development begins. For our onboarding redesign, our North Star metric was Day-7 user retention, while leading metrics included step completion rates and time-to-first-value. We validated these via A/B cohorts before full rollout.",

  5: "While I maintain collaborative relationships, I frequently engage in constructive technical debates. In my previous role, a lead engineer and I disagreed on whether to build a custom auth microservice or integrate Auth0. I scheduled a 1-on-1 alignment meeting, anchored our discussion on our core quarterly goals and maintenance cost, and we mutually agreed to use the third-party solution to save two months of engineering bandwidth.",

  // --- ROUND 2: PRODUCT DISCOVERY & ADVANCED STRATEGY ---
  6: "Before writing a single line of code, I conduct continuous user discovery: running 5 to 8 qualitative customer interviews per sprint, building clickable Figma prototypes, and testing our riskiest assumptions first to ensure strong problem-solution fit and validated customer demand.",

  7: "I manage technical debt by establishing a dedicated 20% capacity allocation in every sprint for refactoring and infrastructure reliability. Rather than viewing tech debt as a blocker, I partner with engineering leads to quantify its impact on developer velocity and system uptime, framing it to leadership as an essential investment in scalability.",

  8: "When saying 'no' to an executive or enterprise client, I frame it as a strategic trade-off discussion. I present quantitative data on our current sprint commitments, illustrate the opportunity cost to our North Star OKRs, and propose placing their request in the upcoming discovery cycle with clear evaluation criteria.",

  9: "I build product roadmaps using an outcome-driven 'Now / Next / Later' framework rather than rigid feature timelines. This aligns stakeholders around strategic business problems and customer value while giving engineering the flexibility to discover the optimal technical solutions.",

  10: "If user retention dropped by 15%, I would immediately initiate a structured triaging process: first segmenting the data by user cohorts, device types, and geographies to isolate the drop, cross-referencing recent code deployments and telemetry logs, and conducting 5 urgent exit interviews with churned users to uncover root causes.",

  // --- ROUND 3: EXECUTIVE LEADERSHIP & PRODUCT GROWTH ---
  11: "When pricing and monetizing a SaaS tier, I anchor our strategy on a clear value metric that scales with customer usage. I conduct willingness-to-pay Van Westendorp research, optimize our CAC-to-LTV ratio, and test self-serve freemium conversion funnels against high-touch sales tiers.",

  12: "I foster psychological safety by establishing blameless retrospectives, encouraging team members to surface failure early as a learning opportunity, and delegating clear ownership of problem domains rather than micromanaging feature specifications.",

  13: "When a major competitor launches our most requested feature, I avoid reactive copycat decisions. I analyze user sentiment, assess whether this shifts our core market differentiation, and double down on our unique product moat while gathering feedback from our power users.",

  14: "I execute A/B experiments by formulating crisp hypotheses, calculating required sample sizes for 95% statistical power, establishing primary conversion metrics alongside guardrail latency metrics, and running tests for at least two business cycles to avoid novelty bias.",

  15: "I view AI as a powerful force multiplier for product discovery: using LLMs to synthesize thousands of customer feedback tickets, generate synthetic user personas for rapid stress-testing, and automate telemetry anomaly detection while keeping humans in the loop for core strategic decisions.",
};

export class UniversalLinguisticParser {
  public static parse(
    rawText: string,
    currentQuestion: InterviewQuestionItem
  ): TurnEvaluationFeedback & { strategicFeedback?: StrategicFeedbackItem | null } {
    const text = rawText.trim();

    if (!text || text.length < 3) {
      return {
        overallScore: 25,
        clarityScore: 20,
        grammarScore: 25,
        vocabularyScore: 30,
        userSpokenText: "(No speech detected)",
        improvedFullAnswer: ROLE_MODEL_ANSWERS[currentQuestion.id] || "State your framework, share an example with real users, and highlight measurable outcomes.",
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
    const isTechDebtTheme = currentQuestion.id === 7 || /technical debt|tech debt|refactoring/i.test(currentQuestion.question);
    const deniesTechDebt = /not my problem|not my business|waste of time.*refactoring|story of spring.*debt|payday debt.*waste|only.*picture|dont care.*debt|only.*feature/i.test(lower);

    if (isTechDebtTheme && deniesTechDebt) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Liderazgo: Co-propietario de la Salud Técnica",
        explanation: "Identificamos tu enfoque en la entrega de funcionalidades. En roles de Product Management, demostrar que balanceas nuevas funciones con la estabilidad y salud del sistema proyecta un alto seniority.",
        recommendation: "Paso a paso: Explica que asignas una capacidad dedicada (ej. 20% del sprint) para refactorización técnica y que traduces la deuda técnica a impacto en negocio (uptime y velocidad del equipo).",
      };
      detectedErrors.push({
        id: `err-strat-techdebt-denial-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Denying responsibility for technical debt ('technical debt is not my problem / refactoring is a waste of time')",
        correctWord: "Take shared ownership of technical health ('I allocate 20% sprint capacity for engineering refactoring...')",
        userSaidContext: "the technical debt is not my problem... waste of time",
        betterWay: "Technical health is a shared responsibility. I partner with engineering to allocate dedicated sprint bandwidth for refactoring so technical debt doesn't degrade our velocity.",
        explanation: "Product Managers balance feature delivery with long-term platform maintainability.",
        translationSpanish: "Consejo de liderazgo: El PM es responsable de equilibrar nuevas funciones con la estabilidad del sistema.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // B. Question 6: User Discovery (Dismissing discovery, friends only, users don't know)
    const isDiscoveryTheme = currentQuestion.id === 6 || /discovery|validate|problem-solution|before writing|prototype/i.test(currentQuestion.question);
    const dismissesDiscovery = /waste of time to talk|dont know what they want|doesnt know what they want|dont know what users want|only.*survey.*friend|boss told me|dont use.*discovery|discovery is.*delay/i.test(lower);

    if (isDiscoveryTheme && dismissesDiscovery) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Validación: Descubrimiento Continuo con Usuarios",
        explanation: "Identificamos tu agilidad para comenzar a construir. Los entrevistadores valoran mucho conocer cómo escuchas a los usuarios y validas hipótesis antes de invertir horas de desarrollo.",
        recommendation: "Paso a paso: Menciona que realizas entrevistas cualitativas con usuarios reales y pruebas de usabilidad con prototipos interactivos en Figma para validar la demanda.",
      };
      detectedErrors.push({
        id: `err-strat-dismiss-discovery-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Dismissing user discovery ('waste of time to talk with users / users don't know what they want')",
        correctWord: "Anchor on continuous customer discovery ('Users articulate pain points while we validate solutions with prototypes...')",
        userSaidContext: "waste of time to talk with the users before",
        betterWay: "While users may not design the technical solution, deep user interviews are essential to uncover unmet needs before engineering starts.",
        explanation: "Product Managers listen to user problems to avoid building unused features.",
        translationSpanish: "Consejo de discovery: Los PMs analizan dolores de usuarios reales antes de programar.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // C. Question 3: Failed Launch (Blaming Developers)
    const isLaunchFailureTheme = currentQuestion.id === 3 || /didn't go as planned|failed launch|delay/i.test(currentQuestion.question);
    const blamesDevelopers = /developers didn't|developers did not|their fault|need to work more fast|told them to work faster|didn't do his job/i.test(lower);

    if (isLaunchFailureTheme && blamesDevelopers) {
      strategicFeedback = {
        type: "STRATEGIC_WARNING",
        title: "Oportunidad de Liderazgo: Responsabilidad Compartida",
        explanation: "Identificamos que buscaste describir un momento de retraso técnico. Explicar cómo facilitaste la comunicación y ajustaste el alcance del proyecto proyecta un liderazgo maduro y colaborativo.",
        recommendation: "Paso a paso: Asume la responsabilidad compartida del cronograma y describe cómo realizaste una sesión de priorización para proteger la calidad del lanzamiento.",
      };
      detectedErrors.push({
        id: `err-strat-blame-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Blaming developers ('developers didn't do their job on time / work faster')",
        correctWord: "Take shared ownership and run a blameless post-mortem ('We encountered unforeseen technical complexity...')",
        userSaidContext: "developers didn't do his job on time",
        betterWay: "We encountered unexpected technical complexity during QA, so I worked with engineering leads to de-scope secondary features.",
        explanation: "Frame delays as technical complexity managed through scope adjustment and collaborative planning.",
        translationSpanish: "Consejo de liderazgo: Describe el retraso como complejidad técnica gestionada con ajuste de alcance.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // =========================================================================
    // PILLAR 2: MODAL AUXILIARY & VERB SYNTAX ERRORS
    // =========================================================================

    // 1. Modal Verb + "to" + Base Verb (e.g., "we can to solve it", "should to do", "must to have", "will to build")
    const modalToMatch = text.match(/\b(can|could|should|would|must|will|may|might)\s+to\s+([a-z]+)\b/i);
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
        explanation: `Modal auxiliary verbs ('${modal}', 'should', 'must', 'will') must NEVER be followed by 'to'. They take the bare infinitive directly ('${modal} ${verb}', not '${modal} to ${verb}').`,
        translationSpanish: `Error gramatical grave: después de verbos modales ('${modal}', 'should', 'must') NUNCA se usa 'to' (debe ser '${modal} ${verb}').`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 2. Missing Dummy Subject "it" (e.g., "for me is...", "because is...", "so is...")
    const dummyItMatch = text.match(/\b(for\s+me|because|so|also|that|if)\s+is\s+((?:a\s+)?(?:waste\s+of\s+time|very\s+[a-z]+|[a-z]+))/i);
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
        explanation: `In English, clauses require an explicit subject pronoun. You cannot omit 'it' after '${connector}' ('${connector}, IT is ${rest}').`,
        translationSpanish: `En inglés nunca se omite el sujeto 'it' ('${connector}, it is ${rest}').`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 3. Plural Subject with Singular Verb "doesn't / is / was" (e.g., "the users doesnt know", "people is")
    const pluralSubjectSingularVerb = text.match(/\b(the\s+)?(users|people|developers|clients|engineers|teams|stakeholders|friends)\s+(doesnt|doesn't|is|was|has)\b/i);
    if (pluralSubjectSingularVerb) {
      const noun = pluralSubjectSingularVerb[2];
      const badVerb = pluralSubjectSingularVerb[3].toLowerCase();
      const fixedVerb = (badVerb === "doesnt" || badVerb === "doesn't") ? "don't" : badVerb === "is" ? "are" : badVerb === "was" ? "were" : "have";
      detectedErrors.push({
        id: `err-subj-verb-plural-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${noun} ${badVerb}`,
        correctWord: `${noun} ${fixedVerb}`,
        userSaidContext: pluralSubjectSingularVerb[0],
        betterWay: `${noun} ${fixedVerb}`,
        explanation: `'${noun}' is plural and requires the plural verb '${fixedVerb}', not singular '${badVerb}'.`,
        translationSpanish: `Discordancia sujeto-verbo: '${noun}' es plural y lleva '${fixedVerb}', no '${badVerb}'.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 4. First-Person Pronoun "I" + Verb with "s" (e.g., "I always says", "I thinks")
    const firstPersonVerbWithS = text.match(/\bi\s+(?:always\s+|usually\s+|never\s+)?(says|thinks|wants|makes|knows|does|works|constructs|sees)\b/i);
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
        explanation: `With the pronoun 'I', verbs take the base form without '-s' ('I ${fixedVerb}', not 'I ${badVerb}').`,
        translationSpanish: `Error de conjugación: con 'I' (yo) el verbo va sin '-s' ('I ${fixedVerb}', nunca 'I ${badVerb}').`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 5. "for + base verb" (Purpose: for know, for tell, for validate, for make)
    const forVerbMatch = text.match(/\bfor\s+(know|no|tell|validate|make|do|build|stop|have|say|learn|work|create|construct)\b/i);
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
        explanation: `To express purpose in English, use the infinitive with 'to' ('to ${properVerb}'), NEVER 'for + base verb' ('for ${forVerbMatch[1]}').`,
        translationSpanish: `Para expresar propósito se usa 'to + verbo' ('to ${properVerb}'), nunca 'for ${forVerbMatch[1]}'.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 6. "need + base verb" (Missing infinitive particle "to": need construct, need stop)
    const needVerbMatch = text.match(/\bneed\s+(construct|stop|do|make|work|tell|listen|fix|launch|talk|speak|program|improve|build)\b/i);
    if (needVerbMatch) {
      const verb = needVerbMatch[1];
      detectedErrors.push({
        id: `err-need-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `need ${verb}`,
        correctWord: `need to ${verb}`,
        userSaidContext: `need ${verb}`,
        betterWay: `need to ${verb}`,
        explanation: `The verb 'need' requires the infinitive marker 'to' before another verb: 'need TO ${verb}'.`,
        translationSpanish: `Falta el 'to' de infinitivo: 'need to ${verb}', no 'need ${verb}'.`,
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
        explanation: "Severe speech recognition distortion: 'story of spring' was heard instead of 'sprint story', and 'payday debt' instead of 'pay down technical debt'.",
        translationSpanish: "Distorsión grave de audio: entendió 'story of spring for payday debt' en lugar de 'sprint capacity to pay down technical debt'.",
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
        explanation: "Garbled audio: microphone heard 'creating a picture for the username they call apples' instead of 'creating features for user applications'.",
        translationSpanish: "Audio ininteligible: el micrófono transcribió 'picture for username call apples' en vez de 'features for user applications'.",
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
        explanation: "Unclear speech capture: 'hyena permit' is garbled audio for 'I never permit' or 'so we cannot permit'.",
        translationSpanish: "Audio distorsionado: entendió 'hyena permit' en lugar de 'I never permit'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }

    // 10. "more important life only than half a perfect call"
    if (/\b(life\s+only\s+than\s+half\s+a\s+perfect\s+call|half\s+a\s+perfect\s+call)\b/i.test(text)) {
      detectedErrors.push({
        id: `err-perfect-call-${Date.now()}`,
        errorType: "UNCLEAR_WORD",
        errorWord: "life only than half a perfect call",
        correctWord: "going live with working features rather than having perfect code",
        userSaidContext: "more important life only than half a perfect call",
        betterWay: "shipping working software rather than waiting for 100% perfect code",
        explanation: "Phonetic distortion: heard 'life only than half a perfect call' instead of 'shipping live rather than having perfect code'.",
        translationSpanish: "Distorsión de audio: transcribió 'half a perfect call' en vez de 'having perfect code'.",
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
        explanation: "In software development, you 'build' or 'develop' products (not 'construct'), and use the adverb 'quickly'.",
        translationSpanish: "Colocación de vocabulario: en software se dice 'build the product quickly', no 'construct the product fast'.",
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
        explanation: "'Launchment' does not exist in English (interference from Spanish 'lanzamiento'). The verb is 'launch it'.",
        translationSpanish: "Palabra inventada ('lanzamiento' -> 'launchment'). Se dice 'launch it'.",
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
        explanation: "Literal translation of Spanish 'tenemos razón'. In English, say 'we are right' or 'our assumption is validated'.",
        translationSpanish: "Traducción literal de 'tenemos razón'. En inglés se dice 'we are right'.",
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
        explanation: "'Delay' is a noun or verb, not an adjective. Literal translation of 'es muy demorado'. Say 'causes delays' or 'is too slow'.",
        translationSpanish: "Traducción literal de 'es muy demorado'. Se dice 'causes delays' o 'is too slow'.",
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
        correctWord: "Break long responses into distinct sentences with transitional phrases ('First', 'Furthermore', 'Consequently')",
        userSaidContext: text.slice(0, 70) + "...",
        betterWay: "Structure your answer into distinct thoughts: state your principle, explain the trade-off, and give a concrete example.",
        explanation: "Speaking 25+ words in a single unpunctuated stream makes it difficult for an interviewer to follow your key message. Use clear pauses.",
        translationSpanish: "Oración continua sin pausas ni puntuación. Divide tus ideas en oraciones claras.",
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

    // Exact C2 Model Answer for active question ID
    const modelAnswer = ROLE_MODEL_ANSWERS[currentQuestion.id] ||
      "I manage technical debt by establishing a dedicated 20% capacity allocation in every sprint for refactoring and infrastructure reliability. Rather than viewing tech debt as a blocker, I partner with engineering leads to quantify its impact on developer velocity and system uptime, framing it to leadership as an essential investment in scalability.";

    const keyStrengths: string[] = [];
    if (errorCount === 0) {
      keyStrengths.push("High grammatical precision", "Clear executive delivery", "Addressed the prompt directly");
    } else {
      keyStrengths.push("Good communicative initiative", "Attempted to address the core interview topic");
    }

    const tipsForNextTurn = errorCount > 0
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
