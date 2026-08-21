import { MemoryCard } from "../entities/MemoryCard";

export interface IMemoryRepository {
  getDueCards(): Promise<MemoryCard[]>;
  reviewCard(cardId: string, score: number): Promise<MemoryCard>;
  createCard(card: Partial<MemoryCard>): Promise<MemoryCard>;
  toggleBookmark(cardId: string): Promise<{ cardId: string; bookmarked: boolean }>;
}
