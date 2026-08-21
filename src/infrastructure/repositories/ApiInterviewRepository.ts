import { IInterviewRepository } from "../../domain/repositories/IInterviewRepository";
import { InterviewSession } from "../../domain/entities/InterviewSession";
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
    return HttpClient.connectWebSocket(`/ws/interview/${sessionId}/audio`, (data) => {
      if (data.type === "spectrum_data" && data.bars) {
        onSpectrumFrame(data.bars);
      }
    });
  }
}

export const apiInterviewRepository = new ApiInterviewRepository();
