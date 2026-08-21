/**
 * Writing Submission Domain Entity
 * Pure business model representing writing evaluation results
 */

export interface ExtractedWritingError {
  userSaid: string;
  errorWord: string;
  correctWord: string;
  betterWay: string;
  translationSpanish: string;
  grammarExplanation: string;
  cefrLevel: string;
}

export interface WritingSubmission {
  id: string;
  taskCategory: string;
  title: string;
  content: string;
  wordCount: number;
  scoreClarity: number;
  scoreGrammar: number;
  evaluatedLevel?: string;
  extractedCardsCount?: number;
  feedback: {
    summary: string;
    improvements: string[];
    extractedErrors?: ExtractedWritingError[];
    createdCardIDs?: string[];
  };
  createdAt?: string;
}
