import { ComprehensiveTurnFeedback } from "./masterAiFeedbackEngine";

const STORAGE_KEY = "celaest:interview-progress:v1";

/**
 * Durable snapshot of the *current* interview turn. Persisted to localStorage
 * so a page reload or an SPA route change never loses the user's last answer or
 * the AI feedback. Synced to the backend (per-user) for cross-device durability.
 */
export interface PersistedInterviewState {
  version: 1;
  roleName: string;
  speechRate: number;
  currentQuestionIndex: number;
  userTranscript: string;
  turnFeedback: ComprehensiveTurnFeedback | null;
  showAnalysisModal: boolean;
  savedErrorIds: string[];
  updatedAt: number;
}

export function loadPersistedInterview(): PersistedInterviewState | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedInterviewState;
    if (!parsed || parsed.version !== 1) return null;
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
