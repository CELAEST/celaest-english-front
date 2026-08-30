import { IInterviewRepository } from "../../domain/repositories/IInterviewRepository";
import { InterviewSession } from "../../domain/entities/InterviewSession";
import {
  InterviewProgressDTO,
  SaveProgressPayload,
} from "../../domain/repositories/IInterviewRepository";
import { HttpClient } from "../http/HttpClient";

export class ApiInterviewRepository implements IInterviewRepository {
  async createSession(roleName: string = "Product Manager"): Promise<InterviewSession> {
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

  async getProgress(): Promise<InterviewProgressDTO | null> {
    try {
      return await HttpClient.get<InterviewProgressDTO | null>("/interview/progress");
    } catch {
      return null;
    }
  }

  async saveProgress(payload: SaveProgressPayload): Promise<void> {
    await HttpClient.post<void>("/interview/progress", payload);
  }
}

export const apiInterviewRepository = new ApiInterviewRepository();
