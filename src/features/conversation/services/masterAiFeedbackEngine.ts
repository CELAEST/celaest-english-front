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
    const words = text.split(/\s+/).filter(Boolean);

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
          "Identificamos que buscaste explicar un momento difícil del proyecto. En entrevistas profesionales, transmitir propiedad compartida ('shared ownership') y explicar cómo gestionaste los retos operativos proyecta gran madurez y liderazgo.",
        recommendation:
          "Paso a paso: Para tu próxima respuesta, describe el retraso como un reto de complejidad operativa y explica cómo priorizaste tareas esenciales en conjunto con tu equipo para proteger la calidad de la entrega.",
      };
      detectedErrors.push({
        id: `err-strat-blame-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Blaming team members ('they didn't do their job on time / work faster')",
        correctWord:
          "Take shared ownership and collaborate constructively ('We encountered unforeseen project complexities...')",
        userSaidContext: "because the developers didn't do his job on time",
        betterWay:
          "We encountered unexpected operational complexity during execution, so I worked with the team to prioritize essential deliverables rather than rushing an unverified outcome.",
        explanation:
          "Frame delays as operational complexity managed through collaborative prioritization rather than personal fault.",
        translationSpanish:
          "Consejo de liderazgo: Describe el retraso como complejidad operativa gestionada con priorización conjunta.",
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
          "While I maintain collaborative relationships, healthy professional disagreements happen. My approach is always to sit down with the colleague or stakeholder, align on shared goals, and use evidence to find consensus.",
        explanation:
          "In leadership and professional interviews, reframe conflict as constructive collaboration.",
        translationSpanish:
          "Consejo estratégico: Aborda los desacuerdos profesionales como debates constructivos orientados a evidencia.",
        cefrLevel: "C1",
        savedToMemory: false,
      });
    }

    // C. Prioritization Question Check
    const isPrioritizationQuestion = /prioritize|prioritizing|competing feature/i.test(
      currentQuestion.question,
    );
    const mentionsPrioritizationFramework =
      /rice|moscow|matrix|framework|impact|effort|trade-off|tradeoff|roi|business value|customer value|urgency|criteria/i.test(
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
        title: "Impulso de Seniority: Criterios y Marcos de Decisión",
        explanation:
          "Identificamos buenas ideas sobre cómo equilibras prioridades. Integrar criterios estructurados te ayudará a proyectar mayor solidez y metodología.",
        recommendation:
          "Paso a paso: Menciona criterios objetivos (impacto en clientes o pacientes, urgencia, matriz de valor vs. esfuerzo) para respaldar tus decisiones.",
      };
      detectedErrors.push({
        id: `err-strat-prio-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "Vague prioritization without metrics or frameworks",
        correctWord: "Use structured criteria or decision frameworks (Impact vs. Effort, Urgency matrix)",
        userSaidContext: text.slice(0, 60),
        betterWay:
          "I prioritize competing demands by assessing urgency versus stakeholder impact to balance immediate requests with strategic quality.",
        explanation:
          "Leaders and professionals demonstrate structured decision-making rather than vague intuition.",
        translationSpanish:
          "Tip de metodología: Apóyate en criterios claros de impacto y urgencia para estructurar tu proceso de decisión.",
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

    // 3b. Double verb / Auxiliary error: "I am help" / "I am work" / "I am agree"
    if (
      /\b(i\s+am|i'm)\s+(help|work|live|agree|need|want|think|make|do|play|stay|use|know|learn|check|clean|inspect|look|see|give|take|say|tell|ask|call|try|start|talk|write|read|speak)\b/i.test(
        text,
      )
    ) {
      const match = text.match(
        /\b(i\s+am|i'm)\s+(help|work|live|agree|need|want|think|make|do|play|stay|use|know|learn|check|clean|inspect|look|see|give|take|say|tell|ask|call|try|start|talk|write|read|speak)\b/i,
      );
      const verb = match ? match[2].toLowerCase() : "help";
      const userErr = match ? match[0] : "I am help";
      const correctVerb =
        verb === "agree"
          ? "I agree"
          : verb === "need"
            ? "I need"
            : verb === "want"
              ? "I want"
              : `I ${verb} / I am ${verb.replace(/e$/, "")}ing`;
      detectedErrors.push({
        id: `err-am-verb-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: userErr,
        correctWord: correctVerb,
        userSaidContext: text.slice(0, 60),
        betterWay: text.replace(
          new RegExp(`\\b${userErr}\\b`, "gi"),
          verb === "agree" ? "I agree" : `I ${verb}`,
        ),
        explanation:
          "En inglés no se combina el verbo auxiliar 'am' con la forma base de un verbo de acción ('" +
          verb +
          "'). Usa el Presente Simple ('I " +
          verb +
          "') para tus hábitos y labores cotidianas, o el Presente Continuo ('I am " +
          verb.replace(/e$/, "") +
          "ing') para acciones en progreso.",
        translationSpanish:
          verb === "help"
            ? "Ayudo a un cliente / Estoy ayudando a un cliente"
            : verb === "work"
              ? "Trabajo / Estoy trabajando"
              : `Uso correcto del verbo: '${correctVerb}'`,
        cefrLevel: "A1",
        savedToMemory: false,
      });
    }

    // 3c. Preposition error with tell / explaining: "to you how" / "tell to you"
    if (/\bto\s+you\s+how\b|\btell\s+to\s+you\b|\btelling\s+to\s+you\b/i.test(text)) {
      const isTellTo = /\btell(ing)?\s+to\s+you\b/i.test(text);
      detectedErrors.push({
        id: `err-tell-to-you-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: isTellTo ? "tell to you" : "to you how",
        correctWord: isTellTo ? "tell you" : "explaining to you how / to show you how",
        userSaidContext: text.slice(0, 60),
        betterWay: text
          .replace(/\bto\s+you\s+how\b/gi, "explaining to you how")
          .replace(/\btell\s+to\s+you\b/gi, "tell you"),
        explanation:
          "En inglés, el verbo 'tell' toma un objeto directo sin la preposición 'to' (se dice 'I tell you', no 'I tell to you'). Si deseas expresar el propósito de guiar a alguien, usa 'explaining to you how' o 'to show you how'.",
        translationSpanish:
          "Estructura natural: 'explicándote cómo' o 'para mostrarte cómo'.",
        cefrLevel: "A1",
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

    // 6b. "for me workspace" / "for me work" / "in me job" (Object pronoun 'me' used instead of possessive 'my')
    if (
      /\b(for|to|in|at|on|with)\s+me\s+([a-z]+)\b/i.test(text) ||
      /\bme\s+(workspace|work|job|computer|office|team|code|project)\b/i.test(text)
    ) {
      const match = text.match(/\b((?:for|to|in|at|on|with)\s+)?me\s+([a-z]+)\b/i);
      const prep = match && match[1] ? match[1].trim() : "";
      const noun = match && match[2] ? match[2].trim() : "workspace";
      const userPhrase = match ? match[0] : "me workspace";
      const correctPhrase = prep ? `${prep} my ${noun}` : `my ${noun}`;

      detectedErrors.push({
        id: `err-me-possessive-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: userPhrase,
        correctWord: correctPhrase,
        userSaidContext: text.slice(0, 60),
        betterWay: text.replace(new RegExp(`\\b${userPhrase}\\b`, "gi"), correctPhrase),
        explanation:
          "En inglés, delante de un sustantivo ('" +
          noun +
          "') se debe emplear el determinante posesivo 'my' ('my " +
          noun +
          "'), nunca el pronombre objeto 'me'. Se dice '" +
          correctPhrase +
          "'.",
        translationSpanish: `Uso de posesivo: '${correctPhrase}' en lugar de '${userPhrase}'.`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // 6c. "a computer brand Asus is" (Missing relative pronoun / run-on copula)
    if (/\b(a\s+)?(computer|laptop|phone|pc|device)\s+brand\s+([a-z0-9]+)\s+is\b/i.test(text)) {
      const match = text.match(
        /\b(a\s+)?(computer|laptop|phone|pc|device)\s+brand\s+([a-z0-9]+)\s+is\b/i,
      );
      const userPhrase = match ? match[0] : "computer brand Asus is";
      const brand = match ? match[3] : "Asus";
      const device = match ? match[2] : "computer";
      const correctPhrase = `an ${brand} ${device}, which is`;

      detectedErrors.push({
        id: `err-brand-relative-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: userPhrase,
        correctWord: correctPhrase,
        userSaidContext: text.slice(0, 60),
        betterWay: text.replace(new RegExp(`\\b${userPhrase}\\b`, "gi"), correctPhrase),
        explanation: `En inglés no se encadenan sustantivo y marca seguidos de 'is' sin un conector relativo o estructura atributiva. Lo natural es decir 'an ${brand} ${device}, which is' o 'a ${device} of the ${brand} brand, which is'.`,
        translationSpanish: `Estructura recomendada: 'un ${device} de marca ${brand}, el cual es...'`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 6d. Redundant subject pronoun: "my other PC it is" / "the computer it is"
    if (/\b(pc|computer|laptop|system|tool|device)\s+it\s+is\b/i.test(text)) {
      const match = text.match(
        /\b((?:[a-z]+\s+)?(?:pc|computer|laptop|system|tool|device))\s+it\s+is\b/i,
      );
      const userPhrase = match ? match[0] : "PC it is";
      const correctPhrase = userPhrase.replace(/\bit\s+is\b/i, "is");

      detectedErrors.push({
        id: `err-redundant-it-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: userPhrase,
        correctWord: correctPhrase,
        userSaidContext: text.slice(0, 60),
        betterWay: text.replace(new RegExp(`\\b${userPhrase}\\b`, "gi"), correctPhrase),
        explanation:
          "El pronombre 'it' es redundante cuando el sujeto ya está expresado explícitamente. Di directamente '" +
          correctPhrase +
          "'.",
        translationSpanish: `Elimina el pronombre redundante 'it': '${correctPhrase}'.`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // 6e. "wet computer" (Lexical confusion in hardware context)
    if (/\b(very\s+)?wet\s+(computer|laptop|pc|keyboard|screen|device)\b/i.test(text)) {
      const match = text.match(
        /\b((?:very\s+)?wet)\s+(computer|laptop|pc|keyboard|screen|device)\b/i,
      );
      const userPhrase = match ? match[0] : "wet computer";
      const dev = match ? match[2] : "computer";
      const correctPhrase = `reliable / high-performance ${dev}`;

      detectedErrors.push({
        id: `err-wet-computer-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: userPhrase,
        correctWord: correctPhrase,
        userSaidContext: text.slice(0, 60),
        betterWay: text.replace(new RegExp(`\\b${userPhrase}\\b`, "gi"), `reliable ${dev}`),
        explanation:
          "'Wet' significa literalmente 'mojado' o 'empapado' y no describe la calidad de hardware en inglés. Si querías decir confiable ('reliable'), rápido ('fast') o silencioso ('quiet'), usa el término técnico adecuado.",
        translationSpanish: `Término adecuado para tecnología: 'reliable ${dev}' (ordenador confiable).`,
        cefrLevel: "A2",
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
    // Detects: "we have a big problem" when context implies past ("yesterday", "one time", "last year", "previous", "past job")
    const hasPastContext =
      /\b(yesterday|the other day|last night|two days ago|in the past|one time|last (year|month|week|time)|in my (past|previous|last)|previously|ago|back then|when i was)\b/i.test(
        lower,
      );
    if (hasPastContext) {
      // "yesterday ... go" → "yesterday ... went"
      if (/\byesterday\b[^\.\?!]*\b(i|we|they|he|she)\s+go\b/i.test(lower) || /\byesterday\s*,\s*i\s+go\b/i.test(lower)) {
        detectedErrors.push({
          id: `err-u1-yesterday-go-${Date.now()}`,
          errorType: "GRAMMAR",
          errorWord: "go",
          correctWord: "went",
          userSaidContext: text.match(/yesterday[^\.\?!]*\bgo\b/i)?.[0] ?? "Yesterday, I go",
          betterWay: text.replace(/\bgo\b/i, "went"),
          explanation:
            "Al narrar una acción completada en el pasado introducida por 'yesterday', se debe utilizar el pasado simple del verbo irregular 'go', que es 'went'.",
          translationSpanish: "Ayer fui a la tienda",
          cefrLevel: "A2",
          savedToMemory: false,
        });
      }

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

    // U3. "for + verb" instead of "to + verb" (Spanish interference: "para comprar" → "for buy", "para mitigar" → "for mitigate", "for improve")
    if (
      /\bfor\s+(buy|get|see|find|sell|hire|take|bring|have|leave|start|finish|check|test|run|visit|meet|ask|eat|drink|watch|read|write|order|learn|mitigate|solve|fix|prevent|reduce|improve|manage|handle|resolve|avoid|implement|deploy|complete|create|build|develop|maintain|investigate|drive|optimize|achieve|ensure|protect|deliver|reach|help|make|do|support)\b/i.test(
        lower,
      )
    ) {
      const forMatch = lower.match(
        /\bfor\s+(buy|get|see|find|sell|hire|take|bring|have|leave|start|finish|check|test|run|visit|meet|ask|eat|drink|watch|read|write|order|learn|mitigate|solve|fix|prevent|reduce|improve|manage|handle|resolve|avoid|implement|deploy|complete|create|build|develop|maintain|investigate|drive|optimize|achieve|ensure|protect|deliver|reach|help|make|do|support)\b/i,
      );
      const verb = forMatch ? forMatch[1] : "buy";
      detectedErrors.push({
        id: `err-u3-for-to-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `for ${verb}`,
        correctWord: `to ${verb}`,
        userSaidContext: `for ${verb}`,
        betterWay: text.replace(new RegExp(`\\bfor\\s+${verb}\\b`, "gi"), `to ${verb}`),
        explanation:
          `En inglés, para expresar propósito ('para + verbo'), se utiliza el infinitivo con 'to' ('to ${verb}'), nunca 'for + infinitivo'. La estructura 'for' se reserva para preposiciones con sustantivos o gerundios ('for buying', pero para el propósito de la acción se dice 'to ${verb}').`,
        translationSpanish:
          `Interferencia del español 'para + verbo': se dice 'to ${verb}' (para ${verb === "buy" ? "comprar" : verb === "improve" ? "mejorar" : verb === "drive" ? "impulsar" : verb === "achieve" ? "alcanzar" : verb}).`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // U3b. Participle adjective for states/conditions: "was close" -> "was closed"
    if (
      /\b(?:was|were)\s+close\b/i.test(lower) ||
      (/\b(?:is|are)\s+close\b/i.test(lower) &&
        /\b(?:supermarket|store|shop|market|office|bank|door|doors|restaurant|pharmacy|building)\b/i.test(lower))
    ) {
      detectedErrors.push({
        id: `err-u3b-was-close-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "was close",
        correctWord: "was closed",
        userSaidContext: text.match(/\b\w+\s+was\s+close\b/i)?.[0] ?? "the supermarket was close",
        betterWay: text.replace(/\bwas\s+close\b/gi, "was closed"),
        explanation:
          "Para describir el estado de un establecimiento comercial o puerta ('estaba cerrado'), se utiliza el participio pasado como adjetivo ('closed'), no 'close' (que como adjetivo significa 'cerca').",
        translationSpanish: "el supermercado estaba cerrado",
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // U3c. Modal auxiliary tense & bare base form: "can't bought" / "couldn't bought" -> "couldn't buy"
    if (
      /\b(can't|cannot|couldn't|could\s+not)\s+(bought|went|saw|took|came|told|found|made|felt|broken|done)\b/i.test(
        lower,
      )
    ) {
      const match = lower.match(
        /\b(can't|cannot|couldn't|could\s+not)\s+(bought|went|saw|took|came|told|found|made|felt|broken|done)\b/i,
      );
      const badVerb = match ? match[2] : "bought";
      const baseMap: Record<string, string> = {
        bought: "buy",
        went: "go",
        saw: "see",
        took: "take",
        came: "come",
        told: "tell",
        found: "find",
        made: "make",
        felt: "feel",
        broken: "break",
        done: "do",
      };
      const baseVerb = baseMap[badVerb] || "buy";
      const userModal = match ? match[0] : "can't bought";
      const correctModal = "couldn't " + baseVerb;
      detectedErrors.push({
        id: `err-u3c-modal-past-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: userModal,
        correctWord: correctModal,
        userSaidContext: userModal,
        betterWay: text.replace(new RegExp(`\\b${userModal}\\b`, "gi"), correctModal),
        explanation:
          `Doble regla gramatical de modales: 1) Los verbos modales siempre van seguidos de la forma base del verbo ('${baseVerb}'), nunca del pasado ('${badVerb}'). 2) En una narración en pasado se usa 'couldn't', no 'can't'. Por tanto, se dice '${correctModal}'.`,
        translationSpanish: `no pude ${baseVerb === "buy" ? "comprar" : baseVerb}`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U3d. Double negative: "couldn't / can't ... nothing" -> "anything"
    if (
      /\b(can't|couldn't|could\s+not|didn't|did\s+not|don't|do\s+not|doesn't|does\s+not)\s+[^\.\?!]*\bnothing\b/i.test(
        lower,
      )
    ) {
      detectedErrors.push({
        id: `err-u3d-double-negative-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "nothing",
        correctWord: "anything",
        userSaidContext:
          text.match(/\b(?:can't|couldn't|didn't)[^\.\?!]*nothing\b/i)?.[0] ?? "couldn't buy nothing",
        betterWay: text.replace(/\bnothing\b/gi, "anything"),
        explanation:
          "En inglés estándar no se permite la doble negación ('couldn't ... nothing'). Dado que el verbo ya está negado ('couldn't'), debes emplear el pronombre indefinido 'anything' ('couldn't buy anything').",
        translationSpanish: "no pude comprar nada",
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

    // U9. Gerund after prepositions: "after make" → "after making", "without lose/loose" → "without losing"
    const prepGerundRegex =
      /\b(after|before|by|without|instead of)\s+(make|do|check|test|change|deploy|send|write|create|run|use|implement|fix|update|see|review|solve|build|optimize|deliver|loose|lose)\b/gi;
    const prepMatches = [...text.matchAll(prepGerundRegex)];
    const seenPreps = new Set<string>();

    for (const pMatch of prepMatches) {
      const prep = pMatch[1].toLowerCase();
      const rawVerb = pMatch[2].toLowerCase();
      const key = `${prep} ${rawVerb}`;
      if (seenPreps.has(key)) continue;
      seenPreps.add(key);

      const baseVerb = rawVerb === "loose" ? "lose" : rawVerb;
      const gerund =
        baseVerb === "make"
          ? "making"
          : baseVerb === "write"
            ? "writing"
            : baseVerb === "use"
              ? "using"
              : baseVerb === "lose"
                ? "losing"
                : baseVerb === "create"
                  ? "creating"
                  : baseVerb === "optimize"
                    ? "optimizing"
                    : `${baseVerb}ing`;

      detectedErrors.push({
        id: `err-u9-prep-gerund-${prep}-${rawVerb}-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${prep} ${rawVerb}`,
        correctWord: `${prep} ${gerund}`,
        userSaidContext: `${prep} ${rawVerb}`,
        betterWay: text.replace(new RegExp(`\\b${prep}\\s+${rawVerb}\\b`, "gi"), `${prep} ${gerund}`),
        explanation: `Después de una preposición en inglés ('${prep}'), el verbo que le sigue debe ir en su forma de gerundio con la terminación '-ing' ('${prep} ${gerund}'), no en su forma base.`,
        translationSpanish: `Regla de preposición: se dice '${prep} ${gerund}' (después de realizar cambios / sin perder calidad).`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U10. Missing preposition 'at' with look: "looking how" → "looking at how / observing how"
    if (/\b(look|looks|looking|looked)\s+(how|what|where|who|why)\b/i.test(lower)) {
      const lookMatch = lower.match(/\b(look|looks|looking|looked)\s+(how|what|where|who|why)\b/i);
      const lookForm = lookMatch ? lookMatch[1] : "looking";
      const whWord = lookMatch ? lookMatch[2] : "how";
      detectedErrors.push({
        id: `err-u10-look-at-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${lookForm} ${whWord}`,
        correctWord: `${lookForm} at ${whWord} / observing ${whWord}`,
        userSaidContext: `${lookForm} ${whWord} the users interact`,
        betterWay: text.replace(
          new RegExp(`\\b${lookForm}\\s+${whWord}\\b`, "gi"),
          `${lookForm} at ${whWord}`,
        ),
        explanation: `El verbo 'look' requiere la preposición 'at' para dirigirse hacia un objeto o comportamiento ('${lookForm} at ${whWord}'). En un contexto profesional de métricas, también puedes usar verbos de mayor precisión como 'observing ${whWord}' o 'monitoring ${whWord}'.`,
        translationSpanish: `Uso de preposiciones: se dice '${lookForm} at ${whWord}' (observando cómo los usuarios interactúan).`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U11. Modal + 'to': "we must to focus" → "we must focus", "can to do" → "can do"
    if (/\b(must|should|can|could|would|might|may)\s+to\s+([a-z]+)\b/i.test(lower)) {
      const modalMatch = lower.match(
        /\b(must|should|can|could|would|might|may)\s+to\s+([a-z]+)\b/i,
      );
      const modal = modalMatch ? modalMatch[1] : "must";
      const v = modalMatch ? modalMatch[2] : "focus";
      detectedErrors.push({
        id: `err-u11-modal-to-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `${modal} to ${v}`,
        correctWord: `${modal} ${v}`,
        userSaidContext: `${modal} to ${v}`,
        betterWay: text.replace(new RegExp(`\\b${modal}\\s+to\\s+${v}\\b`, "gi"), `${modal} ${v}`),
        explanation: `Los verbos modales en inglés ('${modal}') van seguidos directamente del infinitivo sin 'to' (bare infinitive). Se dice '${modal} ${v}', no '${modal} to ${v}'.`,
        translationSpanish: `Regla de verbos modales: se dice '${modal} ${v}' (debemos enfocarnos).`,
        cefrLevel: "A2",
        savedToMemory: false,
      });
    }

    // U12. Spanglish "focus in" (enfocarse en) → "focus on"
    if (/\bfocus\s+in\b/i.test(lower)) {
      detectedErrors.push({
        id: `err-u12-focus-in-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: "focus in",
        correctWord: "focus on",
        userSaidContext: "focus in",
        betterWay: text.replace(/\bfocus\s+in\b/gi, "focus on"),
        explanation:
          "Interferencia del español 'enfocarse en'. En inglés, el verbo 'focus' siempre rige la preposición 'on' ('focus on optimizing'), nunca 'in'.",
        translationSpanish:
          "Preposición correcta: se dice 'focus on' (enfocarse en), no 'focus in'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U13. "in optimize / in drive" → "on optimizing / on driving"
    if (/\bin\s+(optimize|optimizing|drive|driving|improve|improving|manage|managing)\b/i.test(lower)) {
      const inMatch = lower.match(
        /\bin\s+(optimize|optimizing|drive|driving|improve|improving|manage|managing)\b/i,
      );
      const inVerb = inMatch ? inMatch[1] : "optimize";
      const fixedGerund = inVerb.endsWith("ing") ? inVerb : `${inVerb.replace(/e$/, "")}ing`;
      detectedErrors.push({
        id: `err-u13-in-gerund-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: `in ${inVerb}`,
        correctWord: `on ${fixedGerund}`,
        userSaidContext: `in ${inVerb}`,
        betterWay: text.replace(new RegExp(`\\bin\\s+${inVerb}\\b`, "gi"), `on ${fixedGerund}`),
        explanation: `Para expresar el área de enfoque u objetivo, usa 'on ${fixedGerund}' ('focus on ${fixedGerund}').`,
        translationSpanish: `Estructura correcta: 'on ${fixedGerund}' (en optimizar / en liderar).`,
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U14. Pluralization of collective noun "personnels" → "personnel / staff / team members"
    if (/\b(more\s+)?personnels\b/i.test(lower)) {
      detectedErrors.push({
        id: `err-u14-personnels-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: "personnels",
        correctWord: "personnel / staff / team members",
        userSaidContext: "more personnels",
        betterWay: text.replace(/\bpersonnels\b/gi, "personnel"),
        explanation:
          "'Personnel' es un sustantivo colectivo incontable en inglés; no admite plural con 's'. Para hablar de más personas di 'more personnel', 'additional staff' o 'more team members'.",
        translationSpanish:
          "Sustantivo incontable: se dice 'personnel' o 'staff' (personal), nunca 'personnels'.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U15. Colloquial sentence fragment opening: "A lot of things." / "Many things."
    if (/^(a\s+lot\s+of\s+things|many\s+things|a\s+lot\s+of\s+tools|many\s+tools)[.!,]/i.test(lower)) {
      const fragMatch = text.match(/^(a\s+lot\s+of\s+things|many\s+things|a\s+lot\s+of\s+tools|many\s+tools)[.!,]/i);
      const frag = fragMatch ? fragMatch[0] : "A lot of things.";
      detectedErrors.push({
        id: `err-u15-opening-fragment-${Date.now()}`,
        errorType: "GRAMMAR",
        errorWord: frag,
        correctWord: "In my daily workflow, I rely on a diverse set of specialized tools...",
        userSaidContext: frag,
        betterWay: text.replace(
          new RegExp(`^${frag}\\s*`, "i"),
          "In my daily workflow, I rely on a diverse set of specialized tools: ",
        ),
        explanation:
          "Iniciar una respuesta con un fragmento aislado y coloquial ('A lot of things.') resta formalidad en una entrevista profesional. Abre directamente con una oración completa que establezca autoridad y contexto.",
        translationSpanish:
          "Estructura de entrevista: evita fragmentos informales de apertura y comienza con una oración completa y profesional.",
        cefrLevel: "B1",
        savedToMemory: false,
      });
    }

    // U16. Excessive repetition of the basic verb "use" (3+ times in a short response)
    const useMatches = lower.match(/\b(use|uses|used)\b/g);
    if (useMatches && useMatches.length >= 3 && words.length < 90) {
      detectedErrors.push({
        id: `err-u16-use-repetition-${Date.now()}`,
        errorType: "VOCABULARY",
        errorWord: `Overuse of 'use' (${useMatches.length} times)`,
        correctWord: "Diversify verbs: 'rely on', 'leverage', 'utilize', 'work with'",
        userSaidContext: text.slice(0, 80),
        betterWay: text
          .replace(/\buse\s+Slack\b/i, "rely on Slack")
          .replace(/\buse\s+Visual\s+Studio\s+Code\b/i, "leverage Visual Studio Code")
          .replace(/\buse\s+GitHub\b/i, "utilize GitHub"),
        explanation:
          "Repetiste el verbo básico 'use' varias veces en tu respuesta. En entrevistas de trabajo en inglés, demostrar variedad léxica usando sinónimos profesionales como 'rely on', 'leverage', 'utilize' o 'deploy' proyecta un nivel de inglés significativamente más avanzado y senior.",
        translationSpanish:
          "Variedad de vocabulario: alterna 'use' con sinónimos profesionales como 'rely on', 'leverage' y 'utilize'.",
        cefrLevel: "B2",
        savedToMemory: false,
      });
    }
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

    // Dynamic, Domain-Invariant Model Answer Synthesis
    const modelAnswer = MasterAiFeedbackEngine.synthesizeModelAnswer(
      text,
      currentQuestion,
      detectedErrors,
    );

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

  /**
   * Synthesizes an improved, domain-invariant model answer.
   * If candidate spoke enough text, polishes their actual response.
   * Otherwise, generates a professional STAR answer from the question prompt.
   */
  private static synthesizeModelAnswer(
    spokenText: string,
    currentQuestion: InterviewQuestionItem,
    errors: SpecificErrorItem[],
  ): string {
    const cleanSpoken = spokenText.trim();
    const words = cleanSpoken.split(/\s+/).filter(Boolean);

    if (words.length >= 8) {
      let polished = cleanSpoken;

      // 1. Replace specific errors with clean corrections
      const sortedErrors = [...errors].sort(
        (a, b) => (b.errorWord?.length || 0) - (a.errorWord?.length || 0),
      );

      for (const err of sortedErrors) {
        if (!err.errorWord || err.errorType === "UNCLEAR_WORD") continue;

        let cleanReplacement = err.correctWord.replace(/\s*\([^)]*\)/g, "").trim();
        if (cleanReplacement.includes("/")) {
          cleanReplacement = cleanReplacement.split("/")[0].trim();
        }

        if (/^overuse of/i.test(err.errorWord)) {
          continue;
        }

        if (err.userSaidContext && polished.includes(err.userSaidContext)) {
          if (err.betterWay && !err.betterWay.includes("\n") && err.betterWay.length <= 120) {
            polished = polished.replace(err.userSaidContext, err.betterWay);
            continue;
          }
        }

        try {
          const escaped = err.errorWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const reg = new RegExp(`\\b${escaped}\\b`, "i");
          if (reg.test(polished) && cleanReplacement) {
            polished = polished.replace(reg, cleanReplacement);
          }
        } catch {
          // ignore regex errors
        }
      }

      // 2. Polish fragment openings
      polished = polished.replace(
        /^(a\s+lot\s+of\s+things|many\s+things|a\s+lot\s+of\s+tools|many\s+tools)[.!,]\s*/i,
        "In my daily workflow, I rely on a diverse set of specialized tools: ",
      );

      // 3. Diversify basic repeated verbs like "use"
      let useCount = 0;
      polished = polished.replace(/\buse\b/gi, (match) => {
        useCount++;
        if (useCount === 1) return "work with";
        if (useCount === 2) return "utilize";
        if (useCount === 3) return "leverage";
        return match;
      });

      // 4. Normalize spacing and punctuation
      polished = polished
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([.,!?;:])/g, "$1")
        .trim();

      if (polished.length > 0) {
        polished = polished.charAt(0).toUpperCase() + polished.slice(1);
      }

      if (polished.split(/\s+/).length >= 10) {
        return polished;
      }
    }

    // Fallback: domain-invariant, professional STAR response based on question prompt
    const qLower = currentQuestion.question.toLowerCase();

    if (/didn't go as planned|failed launch|launch failure|delay|challenge|obstacle/i.test(qLower)) {
      return "When an important initiative encounters unexpected delays or complications, my approach is to take prompt ownership, analyze root causes with the team, and proactively communicate a realistic recovery plan to stakeholders to protect delivery quality.";
    }
    if (/disagree|conflict|stakeholder|dispute|different view/i.test(qLower)) {
      return "When professional disagreements arise regarding strategy or execution, I schedule a dedicated 1-on-1 meeting to listen to other perspectives, anchor our discussion on shared objectives and empirical evidence, and collaborate toward a consensus that ensures project success.";
    }
    if (/priorit|competing|trade-off|tradeoff/i.test(qLower)) {
      return "When managing competing demands, I evaluate each initiative using objective criteria such as urgency, stakeholder impact, and available capacity. This maintains transparent expectations and ensures that resources are allocated to the highest-value priorities.";
    }
    if (/kpi|metric|indicator|evaluate|measure|performance/i.test(qLower)) {
      return "To evaluate operational performance and key metrics effectively, I systematically monitor quantitative outcomes and qualitative feedback, identify key bottlenecks, and collaborate across teams to implement data-driven enhancements.";
    }
    if (/tool|technology|workflow|routine|daily/i.test(qLower)) {
      return "In my daily workflow, I rely on a combination of communication, planning, and specialized operational tools to maintain efficient execution and seamless collaboration across my team.";
    }

    return "In approaching this responsibility, I focus on structured execution, clear stakeholder alignment, and continuous improvement to achieve measurable, high-quality results.";
  }
}
