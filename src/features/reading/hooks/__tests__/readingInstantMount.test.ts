import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReadingArticles } from "../useReadingArticles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock API reading repository so it doesn't hit external servers in this test
vi.mock("../../../infrastructure/repositories/ApiReadingRepository", () => ({
  apiReadingRepository: {
    getArticles: vi.fn().mockImplementation(() => new Promise(() => {})), // simulate hanging network
    generateArticle: vi.fn(),
    lookupWord: vi.fn(),
    generateQuiz: vi.fn(),
  },
}));

describe("Reading Instant Mount Guarantee (0ms Frame 0)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it("mounts in 0ms with high-fidelity universal seed article even when localStorage is clean and network hangs", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );

    const { result } = renderHook(() => useReadingArticles("B1", "Professional"), { wrapper });

    // Frame 0 assertions: Must NEVER be null, must NEVER be loading skeleton
    expect(result.current.currentArticle).not.toBeNull();
    expect(result.current.currentArticle?.title).toBeDefined();
    expect(result.current.currentArticle?.content.length).toBeGreaterThan(50);
    expect(result.current.currentArticle?.cefrLevel).toBe("B1");

    // Zero skeleton loading state on mount
    expect(result.current.isLoading).toBe(false);

    // Pagination ready immediately
    expect(result.current.allPages.length).toBeGreaterThanOrEqual(1);
    expect(result.current.currentPageContent.length).toBeGreaterThan(0);
    expect(result.current.totalWords).toBeGreaterThan(0);
  });

  it("dynamically sets CEFR level on the seed article when opening at A1 or B2", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );

    const { result: a1Result } = renderHook(() => useReadingArticles("A1", "Dentist"), { wrapper });
    expect(a1Result.current.currentArticle?.cefrLevel).toBe("A1");
    expect(a1Result.current.currentArticle?.title).toContain("Daily Workplace Communication");

    const { result: b2Result } = renderHook(() => useReadingArticles("B2", "Comptroller"), { wrapper });
    expect(b2Result.current.currentArticle?.cefrLevel).toBe("B2");
    expect(b2Result.current.currentArticle?.title).toContain("Strategic Alignment");
  });
});
