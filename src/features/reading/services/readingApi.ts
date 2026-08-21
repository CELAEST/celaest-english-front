import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { ReadingArticle } from "../../../domain/entities/ReadingArticle";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";

export type Article = ReadingArticle;
export type { WordLookup };

export const readingApi = {
  getArticles: (level: string = "B1"): Promise<ReadingArticle[]> => {
    return apiReadingRepository.getArticles(level);
  },
  generateArticle: (category: string = "BUSINESS", level: string = "B1", topic?: string): Promise<ReadingArticle> => {
    return apiReadingRepository.generateArticle(category, level, topic);
  },
  lookupWord: (word: string, context?: string): Promise<WordLookup> => {
    return apiReadingRepository.lookupWord(word, context);
  },
};
