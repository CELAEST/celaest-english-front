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
  updatedAt: number;
}

export function getInterviewStorageKey(userId?: string): string {
  if (userId && userId !== "anon") {
    return `celaest:user:${userId}:interview-progress:v2`;
  }
  return STORAGE_KEY;
}

export function loadPersistedInterview(userId?: string): PersistedInterviewState | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const userKey = getInterviewStorageKey(userId);
    let raw = localStorage.getItem(userKey);
    if (!raw && (!userId || userId === "anon")) {
      raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedInterviewState;
    if (!parsed || (parsed.version !== 1 && parsed.version !== 2)) return null;

    // Automatic TTL Invalidation (24 hours) to prevent stale/ghost interview sessions
    const isExpired = !parsed.updatedAt || Date.now() - parsed.updatedAt > 24 * 60 * 60 * 1000;
    const isFinished =
      typeof parsed.currentQuestionIndex === "number" &&
      parsed.sessionQuestions &&
      parsed.currentQuestionIndex >= parsed.sessionQuestions.length;

    if (isExpired || isFinished) {
      clearPersistedInterview(userId);
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
    const key = getInterviewStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage unavailable: persistence is best-effort.
  }
}

export function clearPersistedInterview(userId?: string): void {
  try {
    if (typeof localStorage === "undefined") return;
    const key = getInterviewStorageKey(userId);
    localStorage.removeItem(key);
    if (key !== STORAGE_KEY) {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
