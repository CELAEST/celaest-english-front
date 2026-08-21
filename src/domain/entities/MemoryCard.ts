/**
 * Memory Card Domain Entity
 * Pure business model representing flashcards and SuperMemo SM-2 Spaced Repetition parameters
 */

export interface MemoryCard {
  id: string;
  category: string; // 'SPEAKING' | 'WRITING' | 'READING' | 'GRAMMAR' | 'VOCABULARY'
  userSaid: string;
  betterWay: string;
  translationSpanish?: string;
  errorWord: string;
  correctWord: string;
  grammarExplanation: string;
  cefrLevel: string;
  audioUrl?: string;
  bookmarked?: boolean;
  intervalDays?: number;
  repetitions?: number;
  easeFactor?: number;
  nextReviewAt?: string;
  createdAt?: string;
}
