import { ComprehensiveTurnFeedback } from "./masterAiFeedbackEngine";
import { InterviewQuestionItem } from "./interviewEngineService";

const STORAGE_KEY = "celaest:interview-progress:v2";
const LEGACY_STORAGE_KEY = "celaest:interview-progress:v1";

/**
 * Durable snapshot of the *current* interview turn and question batch. Persisted to localStorage
 * so a page reload or an SPA route change never loses the user's last answer, the AI feedback,
 * or switches to a completely different random question.
 */
export interface PersistedInterviewState {
  version: 1 | 2;
  roleName: string;
  speechRate: number;
  currentQuestionIndex: number;
  userTranscript: string;
  turnFeedback: ComprehensiveTurnFeedback | null;
  showAnalysisModal: boolean;
  savedErrorIds: string[];
  sessionQuestions?: InterviewQuestionItem[] | undefined;
  cefrLevel?: string | undefined;
  askedQuestions?: string[] | undefined;
  updatedAt: number;
}

export function getInterviewStorageKey(userId?: string, cefrLevel?: string): string {
  const normLevel = cefrLevel ? cefrLevel.toUpperCase().trim() : "";
  if (userId && userId !== "anon") {
    return normLevel
      ? `celaest:user:${userId}:level:${normLevel}:interview-progress:v2`
      : `celaest:user:${userId}:interview-progress:v2`;
  }
  return normLevel ? `${STORAGE_KEY}:${normLevel}` : STORAGE_KEY;
}

export function loadPersistedInterview(
  userId?: string,
  cefrLevel?: string,
): PersistedInterviewState | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const normLevel = cefrLevel ? cefrLevel.toUpperCase().trim() : "";

    // 1. Try level-specific key first
    let raw: string | null = null;
    if (normLevel) {
      const levelKey = getInterviewStorageKey(userId, normLevel);
      raw = localStorage.getItem(levelKey);
    }

    // 2. If not found or level not provided, try general key
    if (!raw) {
      const userKey = getInterviewStorageKey(userId);
      raw = localStorage.getItem(userKey);
    }
    if (!raw && (!userId || userId === "anon")) {
      raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedInterviewState;
    if (!parsed || (parsed.version !== 1 && parsed.version !== 2)) return null;

    // If level requested, verify level matches
    if (normLevel && parsed.cefrLevel && parsed.cefrLevel.toUpperCase().trim() !== normLevel) {
      return null;
    }

    // Automatic TTL Invalidation (24 hours) to prevent stale/ghost interview sessions
    const isExpired = !parsed.updatedAt || Date.now() - parsed.updatedAt > 24 * 60 * 60 * 1000;
    const isFinished =
      typeof parsed.currentQuestionIndex === "number" &&
      parsed.sessionQuestions &&
      parsed.currentQuestionIndex >= parsed.sessionQuestions.length;

    if (isExpired || isFinished) {
      clearPersistedInterview(userId, cefrLevel);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedInterview(state: PersistedInterviewState, userId?: string): void {
  try {
    if (typeof localStorage === "undefined") return;
    const jsonStr = JSON.stringify(state);

    // Save to general key (latest state)
    const generalKey = getInterviewStorageKey(userId);
    localStorage.setItem(generalKey, jsonStr);

    // Save to level-specific key
    if (state.cefrLevel) {
      const levelKey = getInterviewStorageKey(userId, state.cefrLevel);
      localStorage.setItem(levelKey, jsonStr);
    }
  } catch {
    // Quota exceeded or storage unavailable: persistence is best-effort.
  }
}

export function clearPersistedInterview(userId?: string, cefrLevel?: string): void {
  try {
    if (typeof localStorage === "undefined") return;
    const generalKey = getInterviewStorageKey(userId);
    localStorage.removeItem(generalKey);
    if (cefrLevel) {
      const levelKey = getInterviewStorageKey(userId, cefrLevel);
      localStorage.removeItem(levelKey);
    }
    if (generalKey !== STORAGE_KEY) {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
