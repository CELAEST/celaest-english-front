import { HttpClient } from "../../../infrastructure/http/HttpClient";

export interface MemoryCard {
  id: string;
  category: string;
  userSaid: string;
  betterWay: string;
  errorWord: string;
  correctWord: string;
  grammarExplanation: string;
  cefrLevel: string;
  audioUrl: string;
  bookmarked: boolean;
  intervalDays: number;
  repetitions: number;
  easeFactor: number;
}

export const memoryApi = {
  getDueCards: (): Promise<MemoryCard[]> => {
    return HttpClient.get<MemoryCard[]>("/memory/cards");
  },

  reviewCard: (cardId: string, score: number): Promise<MemoryCard> => {
    return HttpClient.post<MemoryCard>("/memory/review", { cardId, score });
  },

  createCard: (cardData: Partial<MemoryCard>): Promise<MemoryCard> => {
    return HttpClient.post<MemoryCard>("/memory/cards", cardData);
  },

  toggleBookmark: (cardId: string): Promise<{ cardId: string; bookmarked: boolean }> => {
    return HttpClient.post<{ cardId: string; bookmarked: boolean }>(
      `/memory/cards/${cardId}/bookmark`,
    );
  },
};
