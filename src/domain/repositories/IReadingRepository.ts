import { ReadingArticle } from "../entities/ReadingArticle";

export interface ResolutionMetadata {
  lexicalSource: string;
  translationSource: string;
  cacheHit: boolean;
  resolutionTimeMs: number;
}

export interface WordLookup {
  word: string;
  lemma?: string | undefined;
  lemmaTranslation?: string | undefined;
  phonetic: string;
  partOfSpeech: string;
  spanishTranslation: string;
  definition: string;
  exampleSentence: string;
  cefrLevel: string;
  audioUrl?: string | undefined;
  metadata?: ResolutionMetadata | undefined;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GenerateQuizResponse {
  articleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface IReadingRepository {
  getArticles(level?: string): Promise<ReadingArticle[]>;
  generateArticle(category?: string, level?: string, topic?: string): Promise<ReadingArticle>;
  lookupWord(word: string, context?: string): Promise<WordLookup>;
  generateQuiz(articleId: string, title: string, content: string, keywords: string[], level?: string): Promise<GenerateQuizResponse>;
}
