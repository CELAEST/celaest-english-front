export interface ConversationMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  audioUrl?: string | null;
}

export interface ConversationSession {
  sessionId: string;
  topic: string;
  status: "Idle" | "Active" | "Ended";
  messages: ConversationMessage[];
  suggestedPills: string[];
}
