/**
 * AI Interview Engine Service
 * Provides role-specific questions across dynamic rounds, STAR method hints, multi-layer error detection,
 * unclear words analysis, and direct Memory Bank card generation.
 */

export interface InterviewQuestionItem {
  id: number;
  question: string;
  category: "WARMUP" | "BEHAVIORAL" | "TECHNICAL" | "SITUATIONAL" | "STRATEGY" | "WRAPUP";
  starHint: string;
  expectedKeywords: string[];
  round?: number;
}

export interface SpecificErrorItem {
  id: string;
  errorType: "GRAMMAR" | "PRONUNCIATION" | "VOCABULARY" | "UNCLEAR_WORD";
  errorWord: string;
  correctWord: string;
  userSaidContext: string;
  betterWay: string;
  explanation: string;
  translationSpanish: string;
  cefrLevel: string;
  savedToMemory?: boolean;
}

export interface TurnEvaluationFeedback {
  overallScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  grammarScore: number; // 0 - 100
  vocabularyScore: number; // 0 - 100
  estimatedCefrLevel?: string | undefined;
  userSpokenText: string;
  improvedFullAnswer: string;
  unclearOrErrorWords: SpecificErrorItem[];
  keyStrengths: string[];
  tipsForNextTurn: string;
  userAudioUrl?: string | undefined;
  recordingDurationSeconds?: number | undefined;
}

export interface InterviewRoleData {
  roleName: string;
  companyContext: string;
  questions: InterviewQuestionItem[];
}

export const INTERVIEW_ROLES_BANK: Record<string, InterviewRoleData> = {
  "Product Manager": {
    roleName: "Product Manager",
    companyContext: "FinTech & SaaS Scale-up",
    questions: [
      // --- ROUND 1: CORE PRODUCT LEADERSHIP ---
      {
        id: 1,
        question:
          "Tell me about yourself and why you are interested in this Product Manager position.",
        category: "WARMUP",
        starHint: "Highlight your key accomplishments, product mindset, and what motivates you.",
        expectedKeywords: ["experience", "roadmap", "user-centric", "cross-functional", "impact"],
        round: 1,
      },
    ],
  },
};

export class InterviewEngineService {
  /**
   * Retrieves role data or falls back to Product Manager
   */
  public static getRoleData(roleName: string): InterviewRoleData {
    return INTERVIEW_ROLES_BANK[roleName] || INTERVIEW_ROLES_BANK["Product Manager"];
  }
}
