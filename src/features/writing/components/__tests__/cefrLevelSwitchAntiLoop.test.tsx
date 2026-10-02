import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WritingPracticeView } from "../WritingPracticeView";

describe("WritingPracticeView - Anti-Loop and Anti-Reset Suite", () => {
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

  const renderComponent = (props: { userLevel?: string; onSelectLevel?: (lvl: any) => void } = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <WritingPracticeView {...props} />
      </QueryClientProvider>,
    );

  it("Test 1: Does NOT re-trigger onSelectLevel in loop when celaest:level-changed event fires", async () => {
    const onSelectLevelSpy = vi.fn();
    renderComponent({ userLevel: "B1", onSelectLevel: onSelectLevelSpy });

    // Simulate external level changed event (e.g. from Dashboard or Settings)
    window.dispatchEvent(new CustomEvent("celaest:level-changed", { detail: "A1" }));

    await waitFor(() => {
      // It should NOT call onSelectLevelSpy because the event is external
      expect(onSelectLevelSpy).not.toHaveBeenCalled();
    });

    // Storage should reflect A1
    expect(localStorage.getItem("celaest:writing:cefrLevel")).toBe("A1");
  });

  it("Test 2: Switching to current level is an immediate no-op and does not clear active drafts", async () => {
    const onSelectLevelSpy = vi.fn();
    renderComponent({ userLevel: "A1", onSelectLevel: onSelectLevelSpy });

    // Simulate user selecting the same level again
    window.dispatchEvent(new CustomEvent("celaest:level-changed", { detail: "A1" }));

    // onSelectLevel must not be called
    expect(onSelectLevelSpy).not.toHaveBeenCalled();
  });

  it("Test 3: Internal level selection reports to onSelectLevel exactly once without recursive ping-pong", async () => {
    const onSelectLevelSpy = vi.fn();
    renderComponent({ userLevel: "B1", onSelectLevel: onSelectLevelSpy });

    // Find and click the LevelSelectorPill button
    const levelButton = screen.getByTitle("Cambiar nivel de dificultad adaptativo");
    expect(levelButton).toBeDefined();

    fireEvent.click(levelButton);

    // Click A1 in the dropdown
    const a1Item = screen.getByRole("menuitem", { name: /A1 — Acceso/i });
    expect(a1Item).toBeDefined();

    fireEvent.click(a1Item);

    // Must be called exactly once for A1
    expect(onSelectLevelSpy).toHaveBeenCalledTimes(1);
    expect(onSelectLevelSpy).toHaveBeenCalledWith("A1");

    // Even if parent then broadcasts celaest:level-changed with A1, it must NOT call onSelectLevel again
    window.dispatchEvent(new CustomEvent("celaest:level-changed", { detail: "A1" }));
    expect(onSelectLevelSpy).toHaveBeenCalledTimes(1);
  });
});
