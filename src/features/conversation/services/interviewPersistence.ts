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

export function loadPersistedInterview(): PersistedInterviewState | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedInterviewState;
    if (!parsed || (parsed.version !== 1 && parsed.version !== 2)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedInterview(state: PersistedInterviewState): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage unavailable: persistence is best-effort.
  }
}

export function clearPersistedInterview(): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
