import {
  IReadingRepository,
  WordLookup,
  GenerateQuizResponse,
} from "../../domain/repositories/IReadingRepository";
import { ReadingArticle } from "../../domain/entities/ReadingArticle";
import { HttpClient } from "../http/HttpClient";

export class ApiReadingRepository implements IReadingRepository {
  async getArticles(level: string = "B1"): Promise<ReadingArticle[]> {
    return HttpClient.get<ReadingArticle[]>(`/reading/articles?level=${level}`);
  }

  async generateArticle(
    category: string = "BUSINESS",
    level: string = "B1",
    topic?: string,
    profession?: string,
  ): Promise<ReadingArticle> {
    return HttpClient.post<ReadingArticle>("/reading/generate", {
      category,
      cefrLevel: level,
      topic,
      profession,
    });
  }

  async lookupWord(word: string, context?: string): Promise<WordLookup> {
    return HttpClient.post<WordLookup>("/reading/word-lookup", {
      word,
      context,
    });
  }

  async generateQuiz(
    articleId: string,
    title: string,
    content: string,
    keywords: string[],
    level: string = "B1",
  ): Promise<GenerateQuizResponse> {
    return HttpClient.post<GenerateQuizResponse>("/reading/quiz", {
      articleId,
      title,
      content,
      keywords,
      cefrLevel: level,
    });
  }
}

export const apiReadingRepository = new ApiReadingRepository();
