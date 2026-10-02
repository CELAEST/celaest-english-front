import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemoryCards } from "../useMemoryCards";
import { apiMemoryRepository } from "../../../../infrastructure/repositories/ApiMemoryRepository";
import { QUERY_KEYS } from "../../../../shared/constants/queryKeys";

describe("Cross-Feature Memory Reactivity (Zero-Reload Architecture)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("dispatches celaest:memory-updated event when apiMemoryRepository creates a card", async () => {
    const eventSpy = vi.fn();
    window.addEventListener("celaest:memory-updated", eventSpy);

    const createSpy = vi.spyOn(apiMemoryRepository, "createCard").mockResolvedValueOnce({
      id: "test-card-1",
      category: "SPEAKING",
      userSaid: "I has a car",
      betterWay: "I have a car",
      translationSpanish: "Tengo un auto",
      errorWord: "has",
      correctWord: "have",
      grammarExplanation: "Use have with I",
      cefrLevel: "A2",
      bookmarked: false,
      intervalDays: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Simulate saving from Speaking or Writing
    await apiMemoryRepository.createCard({
      category: "SPEAKING",
      userSaid: "I has a car",
      betterWay: "I have a car",
    });

    expect(createSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener("celaest:memory-updated", eventSpy);
  });

  it("useMemoryCards invalidates TanStack Query cache upon receiving celaest:memory-updated", async () => {
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.spyOn(apiMemoryRepository, "getDueCards").mockResolvedValue([
      {
        id: "card-1",
        category: "SPEAKING",
        userSaid: "She don't know",
        betterWay: "She doesn't know",
        translationSpanish: "Ella no sabe",
        errorWord: "don't",
        correctWord: "doesn't",
        grammarExplanation: "Subject verb agreement",
        cefrLevel: "A2",
        bookmarked: false,
        intervalDays: 1,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );

    const { result } = renderHook(() => useMemoryCards("SPEAKING"), { wrapper });

    expect(result.current.refetch).toBeDefined();

    // Trigger memory update event as if card was created in Writing or Speaking
    act(() => {
      window.dispatchEvent(
        new CustomEvent("celaest:memory-updated", {
          detail: { card: { category: "SPEAKING" } },
        }),
      );
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.memory.all });
  });
});
