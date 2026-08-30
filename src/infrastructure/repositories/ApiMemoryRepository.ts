import { IMemoryRepository } from "../../domain/repositories/IMemoryRepository";
import { MemoryCard } from "../../domain/entities/MemoryCard";
import { HttpClient } from "../http/HttpClient";

export class ApiMemoryRepository implements IMemoryRepository {
  async getDueCards(category?: string): Promise<MemoryCard[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await HttpClient.get<MemoryCard[]>(`/memory/cards${query}`);
    return Array.isArray(res) ? res : [];
  }

  async reviewCard(cardId: string, score: number): Promise<MemoryCard> {
    return HttpClient.post<MemoryCard>("/memory/review", { cardId, score });
  }

  async createCard(card: Partial<MemoryCard>): Promise<MemoryCard> {
    return HttpClient.post<MemoryCard>("/memory/cards", card);
  }

  async toggleBookmark(cardId: string): Promise<{ cardId: string; bookmarked: boolean }> {
    return HttpClient.post<{ cardId: string; bookmarked: boolean }>(
      `/memory/cards/${cardId}/bookmark`,
    );
  }

  async deleteCard(cardId: string): Promise<{ cardId: string; deleted: boolean }> {
    return HttpClient.delete<{ cardId: string; deleted: boolean }>(
      `/memory/cards/${cardId}`,
    );
  }
}

export const apiMemoryRepository = new ApiMemoryRepository();
