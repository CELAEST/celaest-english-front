import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { useMemoryCards } from "./useMemoryCards";

const { getDueCards, reviewCard, deleteCard } = vi.hoisted(() => ({
	getDueCards: vi.fn(),
	reviewCard: vi.fn(),
	deleteCard: vi.fn(),
}));

vi.mock("../../../infrastructure/repositories/ApiMemoryRepository", () => ({
	apiMemoryRepository: { getDueCards, reviewCard, deleteCard },
}));

const cardA = { id: "a", userSaid: "say A", betterWay: "B", category: "work" } as any;
const cardB = { id: "b", userSaid: "say B", betterWay: "C", category: "work" } as any;

function wrapper({ children }: { children: ReactNode }) {
	const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("useMemoryCards query-key consistency (F-A3)", () => {
	beforeEach(() => {
		getDueCards.mockReset();
		reviewCard.mockReset();
		deleteCard.mockReset();
	});

	it("reflects a review in the active cache without triggering a refetch", async () => {
		getDueCards.mockResolvedValue([cardA, cardB]);
		reviewCard.mockResolvedValue({ ...cardA, score: 5 });

		const { result } = renderHook(() => useMemoryCards("work"), { wrapper });
		await waitFor(() => expect(result.current.cards.length).toBe(2));

		// Count refetches after the mutation; a mis-keyed cache would force one.
		getDueCards.mockClear();
		await act(async () => {
			await result.current.reviewCard("a", 5);
		});

		await waitFor(() =>
			expect((result.current.cards.find((c) => c.id === "a") as any)?.score).toBe(5),
		);
		expect(getDueCards).not.toHaveBeenCalled();
	});

	it("reflects a delete in the active cache", async () => {
		getDueCards.mockResolvedValue([cardA, cardB]);
		deleteCard.mockResolvedValue(undefined);

		const { result } = renderHook(() => useMemoryCards("work"), { wrapper });
		await waitFor(() => expect(result.current.cards.length).toBe(2));

		await act(async () => {
			await result.current.deleteCard("a");
		});

		await waitFor(() => expect(result.current.cards.find((c) => c.id === "a")).toBeUndefined());
		expect(result.current.cards.length).toBe(1);
	});
});
