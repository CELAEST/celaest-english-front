import { IInterviewRepository } from "../../domain/repositories/IInterviewRepository";
import { InterviewSession } from "../../domain/entities/InterviewSession";
import {
  InterviewProgressDTO,
  SaveProgressPayload,
} from "../../domain/repositories/IInterviewRepository";
import { HttpClient } from "../http/HttpClient";

export class ApiInterviewRepository implements IInterviewRepository {
  async createSession(roleName: string = "Professional"): Promise<InterviewSession> {
    return HttpClient.post<InterviewSession>("/interview/session", {
      roleName,
      totalQuestions: 8,
    });
  }

  async getSession(sessionId: string): Promise<InterviewSession> {
    return HttpClient.get<InterviewSession>(`/interview/session/${sessionId}`);
  }

  connectAudioStream(sessionId: string, onSpectrumFrame: (bars: number[]) => void): WebSocket {
    return HttpClient.connectWebSocket(`/ws/interview/${sessionId}/audio`, (data: unknown) => {
      const payload = data as { type?: string; bars?: number[] };
      if (payload?.type === "spectrum_data" && Array.isArray(payload.bars)) {
        onSpectrumFrame(payload.bars);
      }
    });
  }

  async getProgress(cefrLevel?: string): Promise<InterviewProgressDTO | null> {
    try {
      const url = cefrLevel
        ? `/interview/progress?cefrLevel=${encodeURIComponent(cefrLevel)}`
        : "/interview/progress";
      return await HttpClient.get<InterviewProgressDTO | null>(url);
    } catch {
      return null;
    }
  }

  async saveProgress(payload: SaveProgressPayload): Promise<InterviewProgressDTO | null> {
    try {
      return await HttpClient.post<InterviewProgressDTO>("/interview/progress", payload);
    } catch {
      return null;
    }
  }
}

export const apiInterviewRepository = new ApiInterviewRepository();
