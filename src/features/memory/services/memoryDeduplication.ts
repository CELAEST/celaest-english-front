import { MemoryCard } from "../../../domain/entities/MemoryCard";

/**
 * Normalizes a category identifier across the entire application.
 * Maps synonyms like "INTERVIEW" and "CONVERSATION" to canonical "SPEAKING".
 */
export function normalizeCardCategory(category?: string | null): string {
  const upper = (category || "").toUpperCase().trim();
  if (upper === "SPEAKING" || upper === "INTERVIEW" || upper === "CONVERSATION") {
    return "SPEAKING";
  }
  if (upper === "READING") return "READING";
  if (upper === "WRITING") return "WRITING";
  return upper || "SPEAKING";
}

/**
 * Normalizes text content for deterministic semantic comparison.
 * - Converts to lowercase and trims
 * - Strips surrounding quotes (", ', “, ”, `, «, »)
 * - Strips trailing punctuation (. , ! ? ; :)
 * - Collapses repeated internal whitespace
 */
export function normalizeCardText(str?: string | null): string {
  if (!str) return "";
  let clean = str.toLowerCase().trim();
  // Strip surrounding quotes, brackets, and punctuation iteratively
  clean = clean
    .replace(/^["'“”`«»\s]+/, "")
    .replace(/["'“”`«».,!?;:\s]+$/, "")
    .replace(/^["'“”`«».,!?;:\s]+/, "")
    .replace(/["'“”`«».,!?;:\s]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean;
}

/**
 * Evaluates whether two memory cards represent the same learned mistake or vocabulary item.
 * Strictly adheres to pedagogical distinction:
 * - In READING: Evaluates the vocabulary target word (betterWay / errorWord).
 * - In SPEAKING / WRITING: Evaluates the correction (betterWay, errorWord/correctWord, or userSaid context).
 */
export function areCardsDuplicate(
  a: Partial<MemoryCard> | null | undefined,
  b: Partial<MemoryCard> | null | undefined,
): boolean {
  if (!a || !b) return false;

  // Exact ID match
  if (a.id && b.id && a.id === b.id) return true;

  // Cross-category cards are never duplicates (e.g. speaking error vs reading word)
  const catA = normalizeCardCategory(a.category);
  const catB = normalizeCardCategory(b.category);
  if (catA !== catB) return false;

  const betterA = normalizeCardText(a.betterWay);
  const betterB = normalizeCardText(b.betterWay);
  const userA = normalizeCardText(a.userSaid);
  const userB = normalizeCardText(b.userSaid);
  const errA = normalizeCardText(a.errorWord);
  const errB = normalizeCardText(b.errorWord);
  const corrA = normalizeCardText(a.correctWord);
  const corrB = normalizeCardText(b.correctWord);

  // READING Category: Target word is in betterWay or errorWord
  if (catA === "READING") {
    if (betterA && betterB && betterA === betterB) return true;
    if (errA && errB && errA === errB) return true;
    return false;
  }

  // SPEAKING & WRITING Categories:
  // 1. Exact match on both user context and better way
  if (betterA && betterB && betterA === betterB && userA && userB && userA === userB) {
    return true;
  }

  // 2. Exact match on errorWord and correctWord pair
  if (errA && errB && errA === errB && corrA && corrB && corrA === corrB) {
    return true;
  }

  // 3. Exact match on betterWay with errorWord or sub-sentence alignment
  if (betterA && betterB && betterA === betterB) {
    if (!userA || !userB || userA === userB || userA.includes(userB) || userB.includes(userA)) {
      return true;
    }
    if (errA && errB && errA === errB) {
      return true;
    }
    // Identical suggested correction in the same category is the same flashcard
    return true;
  }

  return false;
}

/**
 * Deduplicates an array of MemoryCards, preserving the best version of each card:
 * - Prefers canonical UUIDs over temporary client fallback IDs (`card_...`)
 * - Preserves highest SRS repetitions and intervals
 * - Preserves bookmark status (if either is bookmarked)
 * - Preserves audioUrl and full metadata
 */
export function deduplicateMemoryCards(cards: MemoryCard[]): MemoryCard[] {
  if (!Array.isArray(cards) || cards.length === 0) return [];

  const unique: MemoryCard[] = [];

  for (const card of cards) {
    if (!card || (!card.id && !card.betterWay && !card.userSaid && !card.errorWord)) {
      continue;
    }

    const existingIdx = unique.findIndex((u) => areCardsDuplicate(u, card));

    if (existingIdx === -1) {
      unique.push(card);
    } else {
      const existing = unique[existingIdx];

      // Merge and prefer superior attributes
      const isCardUUID =
        card.id &&
        !card.id.startsWith("card_") &&
        card.id.length >= 32;
      const isExistingUUID =
        existing.id &&
        !existing.id.startsWith("card_") &&
        existing.id.length >= 32;

      const chosenId = isCardUUID ? card.id : isExistingUUID ? existing.id : card.id || existing.id;
      const higherRepetitions = Math.max(existing.repetitions || 0, card.repetitions || 0);
      const higherInterval = Math.max(existing.intervalDays || 1, card.intervalDays || 1);
      const higherEase = Math.max(existing.easeFactor || 2.5, card.easeFactor || 2.5);
      const bookmarked = Boolean(existing.bookmarked || card.bookmarked);
      const audioUrl = card.audioUrl || existing.audioUrl;

      unique[existingIdx] = {
        ...existing,
        ...card,
        id: chosenId,
        repetitions: higherRepetitions,
        intervalDays: higherInterval,
        easeFactor: higherEase,
        bookmarked,
        audioUrl,
      };
    }
  }

  return unique;
}
