/**
 * AI Mentor Feedback Domain Entity
 * Pure business model representing adaptive AI mentor feedback
 */

export interface AiMentorFeedback {
  id: string;
  messageTitle: string;
  messageBody: string;
  active: boolean;
  updatedAt?: string;
}
