import { describe, it, expect } from "vitest";
import {
  normalizeCardCategory,
  normalizeCardText,
  areCardsDuplicate,
  deduplicateMemoryCards,
} from "../memoryDeduplication";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

describe("memoryDeduplication", () => {
  describe("normalizeCardCategory", () => {
    it("maps conversation and interview aliases to SPEAKING", () => {
      expect(normalizeCardCategory("interview")).toBe("SPEAKING");
      expect(normalizeCardCategory("INTERVIEW")).toBe("SPEAKING");
      expect(normalizeCardCategory("conversation")).toBe("SPEAKING");
      expect(normalizeCardCategory("speaking")).toBe("SPEAKING");
    });

    it("normalizes reading and writing", () => {
      expect(normalizeCardCategory("reading")).toBe("READING");
      expect(normalizeCardCategory("writing")).toBe("WRITING");
    });
  });

  describe("normalizeCardText", () => {
    it("strips outer quotes, smart quotes, backticks and trailing punctuation", () => {
      expect(normalizeCardText('"it seems responsible"')).toBe("it seems responsible");
      expect(normalizeCardText('“it seems responsible.”')).toBe("it seems responsible");
      expect(normalizeCardText("'it seems appropriate'")).toBe("it seems appropriate");
      expect(normalizeCardText("`appropriate`!")).toBe("appropriate");
      expect(normalizeCardText("  responsible  \n")).toBe("responsible");
    });
  });

  describe("areCardsDuplicate", () => {
    it("detects exact duplicate speaking cards with quotes and punctuation variation", () => {
      const cardA: Partial<MemoryCard> = {
        category: "SPEAKING",
        userSaid: '"it seems responsible"',
        betterWay: '"it seems appropriate"',
        errorWord: "responsible",
        correctWord: "appropriate",
      };
      const cardB: Partial<MemoryCard> = {
        category: "SPEAKING",
        userSaid: "it seems responsible",
        betterWay: "it seems appropriate",
        errorWord: "responsible",
        correctWord: "appropriate",
      };

      expect(areCardsDuplicate(cardA, cardB)).toBe(true);
    });

    it("does NOT duplicate reading cards that share the same sentence but test different words", () => {
      const sentence = "Collaborative leadership drives mutual success in modern enterprises.";
      const cardA: Partial<MemoryCard> = {
        category: "READING",
        userSaid: sentence,
        betterWay: "collaborative",
        errorWord: "collaborative",
      };
      const cardB: Partial<MemoryCard> = {
        category: "READING",
        userSaid: sentence,
        betterWay: "mutual",
        errorWord: "mutual",
      };

      expect(areCardsDuplicate(cardA, cardB)).toBe(false);
    });

    it("detects reading cards with same word as duplicates even with casing/punctuation", () => {
      const cardA: Partial<MemoryCard> = {
        category: "READING",
        betterWay: "Breakthrough",
        errorWord: "Breakthrough",
      };
      const cardB: Partial<MemoryCard> = {
        category: "READING",
        betterWay: '"breakthrough."',
        errorWord: "breakthrough",
      };

      expect(areCardsDuplicate(cardA, cardB)).toBe(true);
    });

    it("does not mix cards across different categories", () => {
      const cardA: Partial<MemoryCard> = {
        category: "SPEAKING",
        betterWay: "appropriate",
      };
      const cardB: Partial<MemoryCard> = {
        category: "READING",
        betterWay: "appropriate",
      };

      expect(areCardsDuplicate(cardA, cardB)).toBe(false);
    });
  });

  describe("deduplicateMemoryCards", () => {
    it("deduplicates identical cards, merges repetitions, and prefers real server UUID", () => {
      const cards: MemoryCard[] = [
        {
          id: "card_local_123",
          category: "SPEAKING",
          userSaid: '"it seems responsible"',
          betterWay: '"it seems appropriate"',
          translationSpanish: "Parece apropiado",
          errorWord: "responsible",
          correctWord: "appropriate",
          grammarExplanation: "Contextual usage",
          cefrLevel: "B2",
          bookmarked: false,
          intervalDays: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReviewAt: "2026-10-01T00:00:00Z",
          createdAt: "2026-10-01T00:00:00Z",
        },
        {
          id: "1635e607-b379-4d69-8f0a-6e54ad19e8cf",
          category: "SPEAKING",
          userSaid: "it seems responsible",
          betterWay: "it seems appropriate",
          translationSpanish: "Parece adecuado",
          errorWord: "responsible",
          correctWord: "appropriate",
          grammarExplanation: "Contextual usage",
          cefrLevel: "B2",
          bookmarked: true,
          intervalDays: 6,
          repetitions: 2,
          easeFactor: 2.6,
          nextReviewAt: "2026-10-07T00:00:00Z",
          createdAt: "2026-09-30T00:00:00Z",
        },
      ];

      const deduped = deduplicateMemoryCards(cards);
      expect(deduped).toHaveLength(1);
      expect(deduped[0].id).toBe("1635e607-b379-4d69-8f0a-6e54ad19e8cf");
      expect(deduped[0].repetitions).toBe(2);
      expect(deduped[0].bookmarked).toBe(true);
    });
  });
});
