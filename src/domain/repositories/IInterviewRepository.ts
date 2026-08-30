import { InterviewSession } from "../entities/InterviewSession";

/** Mirrors the backend InterviewProgress DTO returned by GET /interview/progress. */
export interface InterviewProgressDTO {
  userId: string;
  roleName: string;
  speechRate: number;
  currentQuestionIndex: number;
  userTranscript: string;
  savedErrorIds: string[];
  showAnalysisModal: boolean;
  latestTurn: Record<string, unknown> | null;
  updatedAt: string;
}

/** Payload sent to POST /interview/progress. */
export interface SaveProgressPayload {
  roleName: string;
  speechRate: number;
  currentQuestionIndex: number;
  userTranscript: string;
  savedErrorIds: string[];
  showAnalysisModal: boolean;
  latestTurn: Record<string, unknown>;
}

export interface IInterviewRepository {
  createSession(roleName?: string): Promise<InterviewSession>;
  getSession(sessionId: string): Promise<InterviewSession>;
  connectAudioStream(sessionId: string, onSpectrumFrame: (bars: number[]) => void): WebSocket;
  getProgress(): Promise<InterviewProgressDTO | null>;
  saveProgress(payload: SaveProgressPayload): Promise<void>;
}
