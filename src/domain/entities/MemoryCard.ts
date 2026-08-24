/**
 * Memory Card Domain Entity
 * Pure business model representing flashcards and SuperMemo SM-2 Spaced Repetition parameters
 */

export interface MemoryCard {
  id: string;
  category: string; // 'SPEAKING' | 'WRITING' | 'READING' | 'GRAMMAR' | 'VOCABULARY'
  userSaid: string;
  betterWay: string;
  translationSpanish?: string | undefined;
  errorWord: string;
  correctWord: string;
  grammarExplanation: string;
  cefrLevel: string;
  audioUrl?: string | undefined;
  bookmarked?: boolean | undefined;
  intervalDays?: number | undefined;
  repetitions?: number | undefined;
  easeFactor?: number | undefined;
  nextReviewAt?: string | undefined;
  createdAt?: string | undefined;
}
