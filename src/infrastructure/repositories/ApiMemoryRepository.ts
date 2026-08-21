import { IMemoryRepository } from "../../domain/repositories/IMemoryRepository";
import { MemoryCard } from "../../domain/entities/MemoryCard";
import { HttpClient } from "../http/HttpClient";

export class ApiMemoryRepository implements IMemoryRepository {
  async getDueCards(): Promise<MemoryCard[]> {
    return HttpClient.get<MemoryCard[]>("/memory/cards");
  }

  async reviewCard(cardId: string, score: number): Promise<MemoryCard> {
    return HttpClient.post<MemoryCard>("/memory/review", { cardId, score });
  }

  async createCard(card: Partial<MemoryCard>): Promise<MemoryCard> {
    return HttpClient.post<MemoryCard>("/memory/cards", card);
  }

  async toggleBookmark(cardId: string): Promise<{ cardId: string; bookmarked: boolean }> {
    return HttpClient.post<{ cardId: string; bookmarked: boolean }>(`/memory/cards/${cardId}/bookmark`);
  }
}

export const apiMemoryRepository = new ApiMemoryRepository();
