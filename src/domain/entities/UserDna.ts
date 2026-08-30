export type ProficiencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type SpeakingConfidence = "Low" | "Medium" | "High";
export type LearningStyle = "Conversation-First" | "Grammar-Focused" | "Reading-Focused";

export interface UserDna {
  id: string;
  name: string;
  email: string;
  proficiencyLevel: ProficiencyLevel;
  learningTarget: string;
  careerGoal: string;
  speakingConfidence: SpeakingConfidence;
  dailyCadenceMinutes: number;
  learningStyle: LearningStyle;
  isLocalVaultEncrypted: boolean;
  createdAt: string;
}
