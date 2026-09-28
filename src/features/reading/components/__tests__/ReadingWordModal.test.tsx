import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ReadingWordModal } from "../ReadingWordModal";
import { WordLookup } from "../../../../domain/repositories/IReadingRepository";

describe("ReadingWordModal", () => {
  const mockWordData: WordLookup = {
    word: "paradigm",
    phonetic: "/ˈpær.ə.daɪm/",
    partOfSpeech: "noun",
    spanishTranslation: "paradigma",
    definition: "A typical example or pattern of something; a model.",
    exampleSentence: "This discovery constitutes a new paradigm in data engineering.",
    cefrLevel: "C1",
  };

  beforeEach(() => {
    vi.stubGlobal("SpeechSynthesisUtterance", vi.fn());
    vi.stubGlobal("speechSynthesis", {
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders word information accurately", () => {
    render(
      <ReadingWordModal
        wordData={mockWordData}
        isLoading={false}
        coords={{ top: 100, left: 100 }}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("paradigm")).toBeDefined();
    expect(screen.getByText("paradigma")).toBeDefined();
  });

  it("prevents duplicate card creation on concurrent double-tap", async () => {
    let resolvePromise: () => void = () => {};
    const mockAddToMemory = vi.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolvePromise = resolve;
        }),
    );

    render(
      <ReadingWordModal
        wordData={mockWordData}
        isLoading={false}
        coords={{ top: 100, left: 100 }}
        onClose={vi.fn()}
        onAddToMemory={mockAddToMemory}
      />,
    );

    const saveButton = screen.getByRole("button", { name: /add word to memory/i });

    // Simulate fast human double-tap before first promise resolves
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    expect(mockAddToMemory).toHaveBeenCalledTimes(1);

    // Resolve the first call
    resolvePromise();

    await waitFor(() => {
      expect(screen.getByText(/in memory/i)).toBeDefined();
    });
  });

  it("invokes onClose when backdrop is clicked", () => {
    const mockClose = vi.fn();
    render(
      <ReadingWordModal
        wordData={mockWordData}
        isLoading={false}
        coords={{ top: 100, left: 100 }}
        onClose={mockClose}
      />,
    );

    const backdrop = screen.getByLabelText("Cerrar modal");
    fireEvent.click(backdrop);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
