import { HttpClient } from "../../../infrastructure/http/HttpClient";

export interface InterviewSession {
  id: string;
  roleName: string;
  totalQuestions: number;
  currentQuestion: number;
  remainingSeconds: number;
  status: string;
}

export const conversationApi = {
  createSession: (roleName: string = "Product Manager"): Promise<InterviewSession> => {
    return HttpClient.post<InterviewSession>("/interview/session", {
      roleName,
      totalQuestions: 8,
    });
  },

  getSession: (sessionId: string): Promise<InterviewSession> => {
    return HttpClient.get<InterviewSession>(`/interview/session/${sessionId}`);
  },

  connectAudioStream: (sessionId: string, onSpectrumFrame: (bars: number[]) => void): WebSocket => {
    return HttpClient.connectWebSocket(`/ws/interview/${sessionId}/audio`, (data: unknown) => {
      const payload = data as { type?: string; bars?: number[] };
      if (payload?.type === "spectrum_data" && Array.isArray(payload.bars)) {
        onSpectrumFrame(payload.bars);
      }
    });
  },
};
