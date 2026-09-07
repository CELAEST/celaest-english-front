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
  targetLevel?: string;
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
  reconciledTranscript?: string | undefined;
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
 
import { DynamicQuestionService } from "./dynamicQuestionService";

export const INTERVIEW_ROLES_BANK: Record<string, InterviewRoleData> = {};

export class InterviewEngineService {
  /**
   * Dynamically generates role data for any profession and CEFR level.
   */
  public static getRoleData(roleName: string = "Professional", userCefr: string = "B1"): InterviewRoleData {
    const role = roleName?.trim() || "Professional";
    return {
      roleName: role,
      companyContext: `${role} Professional Practice`,
      questions: DynamicQuestionService.getRoundQuestions(1, role, userCefr, 5),
    };
  }
}

