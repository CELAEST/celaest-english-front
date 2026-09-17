import { PlacementQuizResult } from "../types";
import { SPANISH_MARKERS } from "../../conversation/services/speechIntelligibilityGuard";

export interface DiagnosticResult {
  cefrCode: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  cefrLabel: string;
  compositeScore: number;
  vocabularyScore: number;
  grammarScore: number;
  clarityScore: number;
  speakingConfidence: "Low" | "Medium" | "High";
  conversationStyle: string;
  keyStrengths: string[];
  aiDossierSummary: string;
  isSpanishDetected?: boolean;
}

const CEFR_LABELS: Record<string, string> = {
  A1: "A1 — Beginner",
  A2: "A2 — Elementary",
  B1: "B1 — Intermediate",
  B2: "B2 — Upper Intermediate",
  C1: "C1 — Advanced",
  C2: "C2 — Mastery",
};

const CEFR_STYLES: Record<string, string> = {
  A1: "Emerging & Building",
  A2: "Foundational & Concise",
  B1: "Structured & Clear",
  B2: "Confident & Articulate",
  C1: "Fluent & Expressive",
  C2: "Native-Like & Nuanced",
};

const CEFR_NUM_MAP: Record<string, number> = {
  A1: 1,
  A2: 2,
  B1: 3,
  B2: 4,
  C1: 5,
  C2: 6,
};

const NUM_TO_CEFR: Record<number, "A1" | "A2" | "B1" | "B2" | "C1" | "C2"> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
  5: "C1",
  6: "C2",
};

const B1_CONNECTORS = ["however", "although", "while", "because", "therefore", "in order to", "especially", "usually", "prefer", "believe"];
const B2_CONNECTORS = ["furthermore", "consequently", "despite", "regarding", "whereas", "nevertheless", "in terms of", "specifically", "strategy", "collaborate", "resolve"];
const C1_CONNECTORS = ["inevitably", "arguably", "fundamentally", "sustainability", "perspective", "comprehensive", "synthesize", "paradigm", "leverage", "trade-off"];

const ENGLISH_CORE_TOKENS = new Set([
  "the", "i", "my", "me", "am", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should",
  "can", "could", "may", "might", "must", "in", "at", "on", "to", "for", "from",
  "with", "of", "about", "into", "through", "after", "over", "between", "out",
  "and", "but", "or", "so", "because", "as", "until", "while", "although", "if",
  "when", "where", "why", "how", "that", "this", "these", "those", "what", "which",
  "who", "whom", "whose", "not", "no", "only", "just", "also", "very", "too", "well",
  "here", "there", "now", "then", "work", "job", "like", "use", "make", "help",
]);

export const OnboardingDiagnosticEvaluator = {
  evaluate(userAnswers: string[], placementResult?: PlacementQuizResult): DiagnosticResult {
    const combined = userAnswers.join(" ");
    const cleaned = combined.toLowerCase();
    const words = cleaned.match(/\b[a-záéíóúüñ']+\b/g) || [];
    const totalWords = words.length;
    const uniqueWords = new Set(words).size;
    const ttr = totalWords > 0 ? uniqueWords / totalWords : 0;

    // Beginner surrender / Spanish screening
    const hasSurrender = userAnswers.some((ans) =>
      /\bno\s+(se|sé|hablo|entiendo|comprendo|puedo|domino|manejo|ingles|inglés|english)\b/i.test(ans) ||
      /\b(cero|nada|poco)\s+de\s+(ingles|inglés|english)\b/i.test(ans) ||
      /\bi\s+(don't|do\s+not|can't|cannot)\s+(know|speak|understand)\b/i.test(ans) ||
      /^(no|nada|cero|nope|ninguno)\.?$/i.test(ans.trim())
    );

    const hasSpanishDiacritics = /[áéíóúüñ¿¡]/i.test(combined);
    let spanishHits = 0;
    let englishHits = 0;

    for (const w of words) {
      if (SPANISH_MARKERS.has(w)) spanishHits++;
      if (ENGLISH_CORE_TOKENS.has(w)) englishHits++;
    }

    const isSpanishDetected =
      hasSurrender ||
      hasSpanishDiacritics ||
      (totalWords >= 3 && spanishHits >= 2 && spanishHits >= englishHits) ||
      (totalWords >= 4 && spanishHits >= 2 && englishHits === 0);

    // If candidate explicitly states they don't know English or responds in Spanish
    if (hasSurrender || isSpanishDetected) {
      return {
        cefrCode: "A1",
        cefrLabel: "A1 — Beginner",
        compositeScore: 20,
        grammarScore: 20,
        vocabularyScore: 20,
        clarityScore: 30,
        speakingConfidence: "Low",
        conversationStyle: "Foundational & Step-by-Step",
        keyStrengths: [
          "Honest baseline self-assessment",
          "Ready to build foundational English from scratch",
        ],
        aiDossierSummary: hasSurrender
          ? `The candidate explicitly stated they don't know English ('no se ingles'). Calibrated at A1 Beginner. Welcome them with warmth and encouragement, reassuring them that Lingua builds English step-by-step from zero.`
          : `The candidate answered the conversation in Spanish. Productive English was not demonstrated (Calibrated at A1 Beginner). Warmly acknowledge that their answers were in Spanish, reassure them that Lingua is built specifically to guide Spanish speakers from zero to fluency, and welcome them in simple, encouraging English.`,
        isSpanishDetected: true,
      };
    }

    let b1Hits = 0;
    let b2Hits = 0;
    let c1Hits = 0;

    for (const w of words) {
      if (B1_CONNECTORS.includes(w)) b1Hits++;
      if (B2_CONNECTORS.includes(w)) b2Hits++;
      if (C1_CONNECTORS.includes(w)) c1Hits++;
    }

    const sentences = combined.split(/[.!?]+/).filter((s) => s.trim().length > 3);
    const avgSentenceLength = sentences.length > 0 ? totalWords / sentences.length : 0;
    const hasConditionals = /\b(if|would|could|might|should)\b/i.test(combined);

    // Heuristic productive scoring for English
    let productiveCode: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" = "A1";
    let grammarScore = 45;
    let vocabularyScore = 45;
    let clarityScore = 50;

    if (totalWords >= 70 && (c1Hits >= 2 || b2Hits >= 3) && ttr > 0.55 && hasConditionals) {
      productiveCode = totalWords >= 110 && c1Hits >= 4 ? "C2" : "C1";
      grammarScore = 88;
      vocabularyScore = 90;
      clarityScore = 92;
    } else if (totalWords >= 40 && (b2Hits >= 1 || b1Hits >= 2) && ttr > 0.5) {
      productiveCode = "B2";
      grammarScore = 78;
      vocabularyScore = 80;
      clarityScore = 82;
    } else if (totalWords >= 22 && (b1Hits >= 1 || avgSentenceLength >= 7)) {
      productiveCode = "B1";
      grammarScore = 65;
      vocabularyScore = 68;
      clarityScore = 72;
    } else if (totalWords >= 10 && englishHits >= 3) {
      productiveCode = "A2";
      grammarScore = 52;
      vocabularyScore = 54;
      clarityScore = 60;
    }

    // Combine with receptive Placement Quiz if present (Weighted 35% Receptive, 65% Productive)
    let finalCode: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" = productiveCode;
    if (placementResult) {
      const recLevelNum = CEFR_NUM_MAP[placementResult.estimatedLevel] || 2;
      const prodLevelNum = CEFR_NUM_MAP[productiveCode] || 1;
      const weightedNum = Math.round(recLevelNum * 0.35 + prodLevelNum * 0.65);
      const clamped = Math.max(1, Math.min(6, weightedNum));
      finalCode = NUM_TO_CEFR[clamped] || productiveCode;
    }

    const compositeScore = Math.round(grammarScore * 0.35 + vocabularyScore * 0.35 + clarityScore * 0.3);
    const keyStrengths: string[] = [];
    if (ttr > 0.55) keyStrengths.push("Good lexical diversity");
    if (hasConditionals) keyStrengths.push("Nuanced conditional reasoning");
    if (b1Hits + b2Hits + c1Hits > 0) keyStrengths.push("Clear transitional discourse markers");
    if (placementResult && placementResult.score >= 3) keyStrengths.push("Solid grammatical comprehension");
    if (keyStrengths.length === 0) keyStrengths.push("Clear direct communication");

    const confidence: "Low" | "Medium" | "High" =
      finalCode === "C1" || finalCode === "C2" || finalCode === "B2" ? "High" : finalCode === "B1" ? "Medium" : "Low";

    const aiDossierSummary = placementResult
      ? `Receptive Placement Quiz: ${placementResult.score}/${placementResult.totalQuestions} (${placementResult.estimatedLevel}). Productive Chat: ${totalWords} words, TTR ${ttr.toFixed(2)}, connectors [B1:${b1Hits}, B2:${b2Hits}, C1:${c1Hits}]. Calibrated CEFR: ${CEFR_LABELS[finalCode]}.`
      : `Productive Chat: ${totalWords} words, TTR ${ttr.toFixed(2)}. Calibrated CEFR: ${CEFR_LABELS[finalCode]}.`;

    return {
      cefrCode: finalCode,
      cefrLabel: CEFR_LABELS[finalCode] || "B1 — Intermediate",
      compositeScore,
      grammarScore,
      vocabularyScore,
      clarityScore,
      speakingConfidence: confidence,
      conversationStyle: CEFR_STYLES[finalCode] || "Structured & Clear",
      keyStrengths,
      aiDossierSummary,
      isSpanishDetected: false,
    };
  },
};
