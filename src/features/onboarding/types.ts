export type OnboardingStep =
  | "welcome"
  | "auth"
  | "api-key"
  | "beginner-check"
  | "questions"
  | "dna-analysis"
  | "placement-quiz"
  | "first-conversation"
  | "ready";

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface PlacementQuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface PlacementQuizResult {
  score: number;
  totalQuestions: number;
  estimatedLevel: "A1" | "A2" | "B1" | "B2";
  levelTitle: string;
  answers: PlacementQuizAnswer[];
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
  placementQuiz?: PlacementQuizResult;
}

export interface LearningDnaSummary {
  careerGoal: string;
  preferredTopics: string[];
  speakingConfidence: "Low" | "Medium" | "High";
  dailyPracticeMinutes: number;
  learningStyle: string;
  proficiencyLevel: string;
}
