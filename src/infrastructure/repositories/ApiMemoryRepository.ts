import { IMemoryRepository } from "../../domain/repositories/IMemoryRepository";
import { MemoryCard } from "../../domain/entities/MemoryCard";
import { HttpClient } from "../http/HttpClient";
import { logger } from "../../shared/utils/logger";
import {
  areCardsDuplicate,
  deduplicateMemoryCards,
} from "../../features/memory/services/memoryDeduplication";

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
    const currentUserId = getActiveUserId();
    const raw = localStorage.getItem(getStorageKey());
    let cards: MemoryCard[] = raw ? JSON.parse(raw) : [];

    // If user is now authenticated, auto-migrate cards created during anonymous onboarding
    if (currentUserId !== "anon") {
      const anonRaw = localStorage.getItem("lingua_memory_cards_cache_anon");
      if (anonRaw) {
        try {
          const anonCards: MemoryCard[] = JSON.parse(anonRaw);
          if (Array.isArray(anonCards) && anonCards.length > 0) {
            const newOrphans = anonCards.filter(
              (anon) => !cards.some((existing) => areCardsDuplicate(existing, anon)),
            );
            if (newOrphans.length > 0) {
              cards = deduplicateMemoryCards([...cards, ...newOrphans]);
              localStorage.setItem(getStorageKey(), JSON.stringify(cards));
            }
            localStorage.removeItem("lingua_memory_cards_cache_anon");
          }
        } catch {
          // ignore parse error
        }
      }
    }

    const deduped = deduplicateMemoryCards(Array.isArray(cards) ? cards : []);
    if (deduped.length !== cards.length) {
      // Self-heal corrupted localStorage automatically
      saveLocalCards(deduped);
    }
    return deduped;
  } catch {
    return [];
  }
}

function saveLocalCards(cards: MemoryCard[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const sanitized = deduplicateMemoryCards(Array.isArray(cards) ? cards : []);
    localStorage.setItem(getStorageKey(), JSON.stringify(sanitized));
  } catch {
    // quota exceeded or private mode
  }
}

export class ApiMemoryRepository implements IMemoryRepository {
  async getDueCards(category?: string): Promise<MemoryCard[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    try {
      const res = await HttpClient.get<MemoryCard[]>(`/memory/cards${query}`);
      const serverCards = deduplicateMemoryCards(Array.isArray(res) ? res : []);

      // Merge only local cards that do NOT already exist on the server (semantic check)
      const localCards = getLocalCards();
      const unSyncedLocal = localCards.filter(
        (local) => !serverCards.some((srv) => areCardsDuplicate(srv, local)),
      );

      // Sync any un-synced local cards to server in background if authenticated
      if (unSyncedLocal.length > 0 && getActiveUserId() !== "anon") {
        for (const card of unSyncedLocal) {
          HttpClient.post("/memory/cards", card).catch(() => {});
        }
      }

      const merged = deduplicateMemoryCards([...serverCards, ...unSyncedLocal]);
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

    // If an identical card already exists in local storage with a server UUID, reuse it
    const localCards = getLocalCards();
    const existing = localCards.find((c) => areCardsDuplicate(c, localCard));
    if (existing && existing.id && !existing.id.startsWith("card_")) {
      return existing;
    }

    try {
      const serverCard = await HttpClient.post<MemoryCard>("/memory/cards", card);
      const currentLocal = getLocalCards();
      const filtered = currentLocal.filter(
        (c) => c.id !== serverCard.id && c.id !== fallbackId && !areCardsDuplicate(c, serverCard),
      );
      saveLocalCards(deduplicateMemoryCards([serverCard, ...filtered]));
      return serverCard;
    } catch (err) {
      logger.warn("ApiMemoryRepository.createCard failed on server, persisting locally to prevent data loss", err);
      const currentLocal = getLocalCards();
      const filtered = currentLocal.filter(
        (c) => c.id !== fallbackId && !areCardsDuplicate(c, localCard),
      );
      saveLocalCards(deduplicateMemoryCards([localCard, ...filtered]));
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

