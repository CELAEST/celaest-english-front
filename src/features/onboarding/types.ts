export type OnboardingStep = 'welcome' | 'questions' | 'dna-analysis' | 'first-conversation' | 'ready';

export interface UserAnswer {
  questionId: string;
  answer: string;
}

export interface LearningDnaSummary {
  careerGoal: string;
  preferredTopics: string[];
  speakingConfidence: 'Low' | 'Medium' | 'High';
  dailyPracticeMinutes: number;
  learningStyle: string;
  proficiencyLevel: string;
}
