import { InterviewSession } from "../entities/InterviewSession";

export interface IInterviewRepository {
  createSession(roleName?: string): Promise<InterviewSession>;
  getSession(sessionId: string): Promise<InterviewSession>;
  connectAudioStream(sessionId: string, onSpectrumFrame: (bars: number[]) => void): WebSocket;
}
