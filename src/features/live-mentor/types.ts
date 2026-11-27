export type LiveCallPhase =
  | "idle"
  | "connecting"
  | "robot_speaking"
  | "user_listening"
  | "thinking"
  | "summarizing";

export interface ConversationTurn {
  id: string;
  role: "coach" | "user";
  text: string;
  timestamp: number;
}

export interface TakeawayUpgrade {
  said: string;
  better: string;
  tip: string;
}

export interface LiveSessionSummary {
  strength: string;
  upgrades: TakeawayUpgrade[];
}
