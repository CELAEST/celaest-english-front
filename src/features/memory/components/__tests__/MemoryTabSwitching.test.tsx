import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryView } from "../MemoryView";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

const makeCard = (id: string, category: string, word: string, context: string): MemoryCard => ({
  id,
  category,
  userSaid: context,
  betterWay: word,
  translationSpanish: `Traducción de ${word}`,
  errorWord: word,
  correctWord: word,
  grammarExplanation: `Explicación para ${word}`,
  cefrLevel: "B2",
  bookmarked: false,
  intervalDays: 1,
  repetitions: 0,
  easeFactor: 2.5,
  nextReviewAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

const speakingCards = Array.from({ length: 13 }, (_, i) =>
  makeCard(`spk-${i + 1}`, "SPEAKING", `correct-speak-${i + 1}`, `User said error ${i + 1}`),
);

const readingCards = Array.from({ length: 9 }, (_, i) =>
  makeCard(`rdg-${i + 1}`, "READING", `vocabulary-term-${i + 1}`, `Sentence containing vocabulary-term-${i + 1} in context`),
);

const writingCards = Array.from({ length: 6 }, (_, i) =>
  makeCard(`wrt-${i + 1}`, "WRITING", `polished-phrase-${i + 1}`, `Rough draft ${i + 1}`),
);

const allMockCards = [...speakingCards, ...readingCards, ...writingCards];

vi.mock("../../hooks/useMemoryCards", () => ({
  useMemoryCards: () => ({
    cards: allMockCards,
    isLoading: false,
    reviewCard: vi.fn(),
    deleteCard: vi.fn(),
    refetch: vi.fn(),
  }),
}));

vi.mock("../../../../design-system/components/Orb/VideoOrb", () => ({
  VideoOrb: () => <div data-testid="mock-video-orb" />,
}));

describe("MemoryView — Category Tab Switching & Viewport Freeze Prevention", () => {
  it("renders Speaking cards initially and switches seamlessly to Reading cards without black screen", async () => {
    render(<MemoryView isActive={true} />);

    // 1. Initial render on Speaking tab (13 cards)
    expect(screen.getByText("Speaking")).toBeDefined();
    expect(screen.getByText("13")).toBeDefined();
    expect(screen.getByText("Reading")).toBeDefined();
    expect(screen.getByText("9")).toBeDefined();

    // Verify speaking card is in the DOM
    expect(screen.getAllByText(/correct-speak-1/i).length).toBeGreaterThan(0);

    // 2. Click the 'Reading' tab
    const readingTab = screen.getByRole("tab", { name: /Reading/i });
    fireEvent.click(readingTab);

    // 3. Reading card must immediately be rendered in the DOM with vocabulary term
    expect(screen.getAllByText(/VOCABULARY TERM/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vocabulary-term-1/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sentence containing/i).length).toBeGreaterThan(0);

    // 4. Click 'Writing' tab
    const writingTab = screen.getByRole("tab", { name: /Writing/i });
    fireEvent.click(writingTab);

    // 5. Writing card must immediately be rendered
    expect(screen.getAllByText(/polished-phrase-1/i).length).toBeGreaterThan(0);

    // 6. Switch back to Reading
    fireEvent.click(readingTab);
    expect(screen.getAllByText(/vocabulary-term-1/i).length).toBeGreaterThan(0);
  });
});
