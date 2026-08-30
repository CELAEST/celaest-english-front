import { WordLookup, GenerateQuizResponse } from "../repositories/IReadingRepository";

export interface ReadingArticle {
  id: string;
  title: string;
  category: string;
  cefrLevel: string;
  readTimeMin: number;
  excerpt: string;
  content: string;
  pages?: string[];
  totalPages?: number;
  vocabularyMap?: Record<string, WordLookup>;
  keywords: string[];
  phrasalVerbs?: string[];
  quiz?: GenerateQuizResponse;
}
