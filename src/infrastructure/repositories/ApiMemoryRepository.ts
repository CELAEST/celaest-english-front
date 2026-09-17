import { IMemoryRepository } from "../../domain/repositories/IMemoryRepository";
import { MemoryCard } from "../../domain/entities/MemoryCard";
import { HttpClient } from "../http/HttpClient";
import { logger } from "../../shared/utils/logger";

function getActiveUserId(): string {
  try {
    const token = HttpClient.getAuthToken();
    if (!token) return "anon";
    const parts = token.split(".");
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonStr =
        typeof atob === "function"
          ? atob(base64)
          : Buffer.from(base64, "base64").toString("utf-8");
      const payload = JSON.parse(jsonStr);
      return payload.sub || payload.id || payload.user_id || "anon";
    }
  } catch {
    // fallback
  }
  return "anon";
}

function getStorageKey(): string {
  return `lingua_memory_cards_cache_${getActiveUserId()}`;
}

function getLocalCards(): MemoryCard[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCards(cards: MemoryCard[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(cards));
  } catch {
    // quota exceeded or private mode
  }
}

export class ApiMemoryRepository implements IMemoryRepository {
  async getDueCards(category?: string): Promise<MemoryCard[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    try {
      const res = await HttpClient.get<MemoryCard[]>(`/memory/cards${query}`);
      const serverCards = Array.isArray(res) ? res : [];

      // Merge with any un-synced local cards
      const localCards = getLocalCards();
      const serverIds = new Set(serverCards.map((c) => c.id));
      const unSyncedLocal = localCards.filter((c) => !serverIds.has(c.id));

      const merged = [...serverCards, ...unSyncedLocal];
      saveLocalCards(merged);

      if (category) {
        return merged.filter(
          (c) => (c.category || "").toUpperCase() === category.toUpperCase(),
        );
      }
      return merged;
    } catch (err) {
      logger.warn("ApiMemoryRepository.getDueCards fallback to local cache", err);
      const localCards = getLocalCards();
      if (category) {
        return localCards.filter(
          (c) => (c.category || "").toUpperCase() === category.toUpperCase(),
        );
      }
      return localCards;
    }
  }

  async reviewCard(cardId: string, score: number): Promise<MemoryCard> {
    try {
      const card = await HttpClient.post<MemoryCard>("/memory/review", { cardId, score });
      const localCards = getLocalCards();
      const idx = localCards.findIndex((c) => c.id === cardId);
      if (idx !== -1) {
        localCards[idx] = card;
        saveLocalCards(localCards);
      }
      return card;
    } catch (err) {
      logger.warn("ApiMemoryRepository.reviewCard fallback to local cache", err);
      const localCards = getLocalCards();
      const existing = localCards.find((c) => c.id === cardId);
      if (existing) {
        const repetitions = (existing.repetitions || 0) + 1;
        const intervalDays =
          repetitions === 1
            ? 1
            : repetitions === 2
              ? 6
              : Math.round((existing.intervalDays || 1) * (existing.easeFactor || 2.5));
        const updated: MemoryCard = {
          ...existing,
          repetitions,
          intervalDays,
          nextReviewAt: new Date(Date.now() + intervalDays * 86400000).toISOString(),
        };
        saveLocalCards(localCards.map((c) => (c.id === cardId ? updated : c)));
        return updated;
      }
      throw err;
    }
  }

  async createCard(card: Partial<MemoryCard>): Promise<MemoryCard> {
    const fallbackId =
      card.id ||
      (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);

    const localCard: MemoryCard = {
      id: fallbackId,
      category: card.category || "READING",
      userSaid: card.userSaid || "",
      betterWay: card.betterWay || "",
      translationSpanish: card.translationSpanish || "",
      errorWord: card.errorWord || card.betterWay || "",
      correctWord: card.correctWord || card.betterWay || "",
      grammarExplanation: card.grammarExplanation || "",
      cefrLevel: card.cefrLevel || "B1",
      audioUrl: card.audioUrl,
      bookmarked: false,
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      const serverCard = await HttpClient.post<MemoryCard>("/memory/cards", card);
      const localCards = getLocalCards();
      const filtered = localCards.filter((c) => c.id !== serverCard.id && c.id !== fallbackId);
      saveLocalCards([serverCard, ...filtered]);
      return serverCard;
    } catch (err) {
      logger.warn("ApiMemoryRepository.createCard failed on server, persisting locally to prevent data loss", err);
      const localCards = getLocalCards();
      saveLocalCards([localCard, ...localCards.filter((c) => c.id !== fallbackId)]);
      return localCard;
    }
  }

  async toggleBookmark(cardId: string): Promise<{ cardId: string; bookmarked: boolean }> {
    try {
      const res = await HttpClient.post<{ cardId: string; bookmarked: boolean }>(
        `/memory/cards/${cardId}/bookmark`,
      );
      const localCards = getLocalCards();
      const existing = localCards.find((c) => c.id === cardId);
      if (existing) {
        existing.bookmarked = res.bookmarked;
        saveLocalCards(localCards);
      }
      return res;
    } catch (err) {
      const localCards = getLocalCards();
      const existing = localCards.find((c) => c.id === cardId);
      const nextBookmark = existing ? !existing.bookmarked : true;
      if (existing) {
        saveLocalCards(
          localCards.map((c) => (c.id === cardId ? { ...c, bookmarked: nextBookmark } : c)),
        );
      }
      return { cardId, bookmarked: nextBookmark };
    }
  }

  async deleteCard(cardId: string): Promise<{ cardId: string; deleted: boolean }> {
    try {
      await HttpClient.delete<{ cardId: string; deleted: boolean }>(
        `/memory/cards/${cardId}`,
      );
    } catch {
      // ignore
    }
    const localCards = getLocalCards();
    saveLocalCards(localCards.filter((c) => c.id !== cardId));
    return { cardId, deleted: true };
  }
}

export const apiMemoryRepository = new ApiMemoryRepository();

