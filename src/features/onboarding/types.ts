export type OnboardingStep =
  | "welcome"
  | "auth"
  | "questions"
  | "dna-analysis"
  | "first-conversation"
  | "ready";

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface LearnerProfileData {
  name: string;
  email: string;
  learningGoal: string;
  preferenceStyle: string;
  dailyFocus: string;
  profession: string;
  speakingConfidence: "Low" | "Medium" | "High";
  cefrLevel: string;
  conversationStyle: string;
  pronunciationScore: string;
  topics: string[];
}

export interface LearningDnaSummary {
  careerGoal: string;
  preferredTopics: string[];
  speakingConfidence: "Low" | "Medium" | "High";
  dailyPracticeMinutes: number;
  learningStyle: string;
  proficiencyLevel: string;
}
