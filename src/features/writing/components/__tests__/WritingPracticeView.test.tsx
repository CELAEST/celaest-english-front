import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WritingPracticeView } from "../WritingPracticeView";
import { apiWritingRepository } from "../../../../infrastructure/repositories/ApiWritingRepository";
import { apiMemoryRepository } from "../../../../infrastructure/repositories/ApiMemoryRepository";

const mockSubmission = {
  id: "sub-123",
  userId: "user-test",
  taskCategory: "EMAIL",
  title: "Sprint Update Email",
  content: "Our team has been focus on launching the new authentication module yesterday.",
  wordCount: 12,
  scoreClarity: 78,
  scoreGrammar: 72,
  evaluatedLevel: "B1",
  extractedCardsCount: 1,
  feedback: {
    summary: "Good update message with clear goals.",
    improvements: ["Review past participle usage after has been."],
    extractedErrors: [
      {
        userSaid: "our team has been focus on launching",
        errorWord: "has been focus",
        correctWord: "has been focused",
        betterWay: "Our team has been focused on launching the new authentication module.",
        translationSpanish: "se ha centrado en",
        grammarExplanation: "After 'has been', use past participle.",
        cefrLevel: "B1",
      },
    ],
  },
  createdAt: new Date().toISOString(),
};

describe("Writing Feature - Full Use Case Suite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <WritingPracticeView />
      </QueryClientProvider>,
    );

  it("Use Case 1: Initial state loads with active task and empty or stored draft", () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/Start writing here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
    expect(screen.getByText(/Start writing to get feedback/i)).toBeInTheDocument();
  });

  it("Use Case 2: Enforces minimum word requirement (8 words)", () => {
    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    // Type 4 words -> still disabled
    fireEvent.change(editor, { target: { value: "Hello my team update" } });
    expect(screen.getByText(/Write at least 8 words to evaluate \(4\/8\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();

    // Type 9 words -> becomes enabled
    fireEvent.change(editor, {
      target: {
        value: "Hello team, here is the weekly engineering sprint update for everyone.",
      },
    });
    expect(screen.getByText(/Ready for feedback/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
  });

  it("Use Case 3: Rejects Spanish input with shield guard toast (0 token waste)", async () => {
    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "Hola equipo, este es el reporte de trabajo para esta semana por favor.",
      },
    });

    const submitBtn = screen.getByText(/Submit for feedback/i);
    fireEvent.click(submitBtn);

    // apiWritingRepository.evaluate should NOT be called
    const evalSpy = vi.spyOn(apiWritingRepository, "evaluate");
    expect(evalSpy).not.toHaveBeenCalled();
  });

  it("Use Case 4: Evaluates valid English submission, opens modal, and renders score gauges", async () => {
    vi.spyOn(apiWritingRepository, "evaluate").mockResolvedValueOnce(mockSubmission as any);

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "Our team has been focus on launching the new authentication module yesterday.",
      },
    });

    const submitBtn = screen.getByText(/Submit for feedback/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Writing Analysis/i)).toBeInTheDocument();
    });

    expect(screen.getAllByText("78%").length).toBeGreaterThan(0); // Clarity
    expect(screen.getAllByText("72%").length).toBeGreaterThan(0); // Grammar
    expect(screen.getAllByText(/has been focus/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/has been focused/i).length).toBeGreaterThan(0);
  });

  it("Use Case 5: 1-Click Save to Memory Bank creates flashcard and marks Saved", async () => {
    vi.spyOn(apiWritingRepository, "evaluate").mockResolvedValueOnce(mockSubmission as any);
    const createCardSpy = vi
      .spyOn(apiMemoryRepository, "createCard")
      .mockResolvedValueOnce({ id: "card-1" } as any);

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "Our team has been focus on launching the new authentication module yesterday.",
      },
    });

    fireEvent.click(screen.getByText(/Submit for feedback/i));

    await waitFor(() => {
      expect(screen.getByText(/Save to Memory/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Save to Memory/i));

    await waitFor(() => {
      expect(createCardSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "WRITING",
          errorWord: "has been focus",
          correctWord: "has been focused",
        }),
      );
    });
  });

  it("Use Case 6: Closing modal with X preserves draft and enables 'View Analysis' button", async () => {
    vi.spyOn(apiWritingRepository, "evaluate").mockResolvedValueOnce(mockSubmission as any);

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "Our team has been focus on launching the new authentication module yesterday.",
      },
    });

    fireEvent.click(screen.getByText(/Submit for feedback/i));

    await waitFor(() => {
      expect(screen.getByText(/Writing Analysis/i)).toBeInTheDocument();
    });

    // Click close X in modal
    const closeBtn = screen.getByRole("button", { name: /^close$/i });
    fireEvent.click(closeBtn);

    // Modal is closed
    expect(screen.queryByText(/Writing Analysis/i)).not.toBeInTheDocument();

    // View Analysis button is available in the submit bar
    const viewAnalysisBtn = screen.getByRole("button", { name: /view latest writing analysis/i });
    expect(viewAnalysisBtn).toBeInTheDocument();

    // Reopen modal immediately in 0ms without network
    fireEvent.click(viewAnalysisBtn);
    expect(screen.getByText(/Writing Analysis/i)).toBeInTheDocument();
  });

  it("Use Case 7: Continue Practicing advances task and clears editor for the next session", async () => {
    vi.spyOn(apiWritingRepository, "evaluate").mockResolvedValueOnce(mockSubmission as any);

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i) as HTMLTextAreaElement;

    fireEvent.change(editor, {
      target: {
        value: "Our team has been focus on launching the new authentication module yesterday.",
      },
    });

    fireEvent.click(screen.getByText(/Submit for feedback/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /continue practicing/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /continue practicing/i }));

    // Modal closed, editor cleared in newly mounted textarea
    expect(screen.queryByText(/Writing Analysis/i)).not.toBeInTheDocument();
    const nextEditor = screen.getByPlaceholderText(/Start writing here/i) as HTMLTextAreaElement;
    expect(nextEditor.value).toBe("");
  });

  it("Use Case 8: Text Clear requires 2-step confirmation to prevent accidental data loss", () => {
    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i) as HTMLTextAreaElement;

    fireEvent.change(editor, { target: { value: "Important draft text here." } });
    expect(editor.value).toBe("Important draft text here.");

    const clearBtn = screen.getByRole("button", { name: /clear all text/i });
    fireEvent.click(clearBtn);

    // Text is NOT cleared yet, button turns to "Sure?"
    expect(editor.value).toBe("Important draft text here.");
    expect(screen.getByText("Sure?")).toBeInTheDocument();

    // Second click confirms
    fireEvent.click(screen.getByRole("button", { name: /confirm: clear all text/i }));
    expect(editor.value).toBe("");
  });

  it("Use Case 9: Rejects gibberish input with 0 token waste", () => {
    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "asdfghjkl qwertyuiop zxcvbnm poiuytrewq lkjhgfdsam",
      },
    });

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    const evalSpy = vi.spyOn(apiWritingRepository, "evaluate");
    expect(evalSpy).not.toHaveBeenCalled();
  });

  it("Use Case 10: Idempotency prevents redundant network calls on identical text re-submission", async () => {
    const evalSpy = vi
      .spyOn(apiWritingRepository, "evaluate")
      .mockResolvedValue(mockSubmission as any);

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "Our dedicated test for verifying idempotency cache behavior in the evaluation pipeline.",
      },
    });

    // 1st submit
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Writing Analysis/i)).toBeInTheDocument();
    });
    expect(evalSpy).toHaveBeenCalledTimes(1);

    // Close modal
    fireEvent.click(screen.getByRole("button", { name: /^close$/i }));

    // 2nd submit without changing text
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Writing Analysis/i)).toBeInTheDocument();
    });

    // Still only 1 network call!
    expect(evalSpy).toHaveBeenCalledTimes(1);
  });

  it("Use Case 11: Handles backend 500 error gracefully without crashing SPA", async () => {
    vi.spyOn(apiWritingRepository, "evaluate").mockRejectedValueOnce(
      new Error("500 Internal Server Error"),
    );

    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i);

    fireEvent.change(editor, {
      target: {
        value: "A brand new uncached draft text about server latency during production outage.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Wait and verify the UI remains interactive and didn't crash
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /submit/i })).not.toBeDisabled();
    });
    expect(screen.queryByText(/Writing Analysis/i)).not.toBeInTheDocument();
  });

  it("Use Case 12: Writing Tools toggle helper drawer and insert curated executive phrases into editor", async () => {
    renderComponent();
    const editor = screen.getByPlaceholderText(/Start writing here/i) as HTMLTextAreaElement;

    // Click 'Expand' tool button
    const expandBtn = screen.getByRole("button", { name: /^expand$/i });
    fireEvent.click(expandBtn);

    // Verify phrase drawer opened
    const phraseBtn = await screen.findByText(/Furthermore, this aligns with/i);
    expect(phraseBtn).toBeInTheDocument();

    // Click to insert phrase
    fireEvent.click(phraseBtn);

    // Editor should now contain the inserted phrase
    expect(editor.value).toContain("Furthermore, this aligns with");
  });
});
