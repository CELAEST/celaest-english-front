import { MemoryCard } from "../entities/MemoryCard";

export interface IMemoryRepository {
  getDueCards(category?: string): Promise<MemoryCard[]>;
  reviewCard(cardId: string, score: number): Promise<MemoryCard>;
  createCard(card: Partial<MemoryCard>): Promise<MemoryCard>;
  toggleBookmark(cardId: string): Promise<{ cardId: string; bookmarked: boolean }>;
  deleteCard(cardId: string): Promise<{ cardId: string; deleted: boolean }>;
}
