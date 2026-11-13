import {
  IReadingRepository,
  WordLookup,
  GenerateQuizResponse,
} from "../../domain/repositories/IReadingRepository";
import { ReadingArticle } from "../../domain/entities/ReadingArticle";
import { HttpClient } from "../http/HttpClient";
import { buildByokHeadersSafe } from "../http/coreAiGatewayClient";

export class ApiReadingRepository implements IReadingRepository {
  async getArticles(level: string = "B1", profession?: string): Promise<ReadingArticle[]> {
    const params = new URLSearchParams({ level });
    if (profession && profession.trim() !== "") {
      params.set("profession", profession.trim());
    }
    return HttpClient.get<ReadingArticle[]>(`/reading/articles?${params.toString()}`);
  }

  async generateArticle(
    category: string = "BUSINESS",
    level: string = "B1",
    topic?: string,
    profession?: string,
  ): Promise<ReadingArticle> {
    const headers = await buildByokHeadersSafe();
    return HttpClient.post<ReadingArticle>(
      "/reading/generate",
      {
        category,
        cefrLevel: level,
        topic,
        profession,
      },
      { headers },
    );
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
    const headers = await buildByokHeadersSafe();
    return HttpClient.post<GenerateQuizResponse>(
      "/reading/quiz",
      {
        articleId,
        title,
        content,
        keywords,
        cefrLevel: level,
      },
      { headers },
    );
  }
}

export const apiReadingRepository = new ApiReadingRepository();
