/**
 * Interview Session Domain Entity
 * Pure business model representing roleplay simulation sessions
 */

export interface InterviewSession {
  id: string;
  roleName: string;
  totalQuestions: number;
  currentQuestion: number;
  remainingSeconds: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt?: string;
}
