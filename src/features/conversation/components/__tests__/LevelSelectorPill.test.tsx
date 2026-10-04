import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { LevelSelectorPill } from "../LevelSelectorPill";

describe("LevelSelectorPill - Mobile Bottom Sheet & Accessibility Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulate mobile viewport < 640px
    window.innerWidth = 390;
  });

  it("renders pill button with current level", () => {
    render(<LevelSelectorPill currentLevel="B2" onSelectLevel={vi.fn()} />);
    expect(screen.getByText("B2")).toBeInTheDocument();
  });

  it("opens mobile bottom sheet on click with accessible attributes", () => {
    render(<LevelSelectorPill currentLevel="B2" onSelectLevel={vi.fn()} />);

    const button = screen.getByTitle("Cambiar nivel de dificultad adaptativo");
    fireEvent.click(button);

    const sheet = screen.getByRole("menu", { name: "Selección de nivel adaptativo CEFR" });
    expect(sheet).toBeInTheDocument();
    expect(sheet).toHaveAttribute("aria-modal", "true");

    const dragHandle = screen.getByLabelText("Deslizar hacia abajo para cerrar");
    expect(dragHandle).toBeInTheDocument();
  });

  it("closes mobile bottom sheet when Escape key is pressed", () => {
    render(<LevelSelectorPill currentLevel="B2" onSelectLevel={vi.fn()} />);

    const button = screen.getByTitle("Cambiar nivel de dificultad adaptativo");
    fireEvent.click(button);

    expect(screen.getByRole("menu", { name: "Selección de nivel adaptativo CEFR" })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("menu", { name: "Selección de nivel adaptativo CEFR" })).toBeNull();
  });

  it("selects a level and closes the sheet when a level item is clicked", () => {
    const onSelectLevelSpy = vi.fn();
    render(<LevelSelectorPill currentLevel="B2" onSelectLevel={onSelectLevelSpy} />);

    fireEvent.click(screen.getByTitle("Cambiar nivel de dificultad adaptativo"));

    const c1Item = screen.getByRole("menuitem", { name: /C1 — Dominio/i });
    fireEvent.click(c1Item);

    expect(onSelectLevelSpy).toHaveBeenCalledWith("C1");
    expect(screen.queryByRole("menu", { name: "Selección de nivel adaptativo CEFR" })).toBeNull();
  });

  it("dismisses bottom sheet via swipe-down gesture on the drag handle", () => {
    vi.useFakeTimers();
    render(<LevelSelectorPill currentLevel="B2" onSelectLevel={vi.fn()} />);

    fireEvent.click(screen.getByTitle("Cambiar nivel de dificultad adaptativo"));

    const dragHandle = screen.getByLabelText("Deslizar hacia abajo para cerrar");
    expect(dragHandle).toBeInTheDocument();

    // Simulate touch swipe down (> 65px)
    fireEvent.touchStart(dragHandle, { touches: [{ clientY: 200 }] });
    fireEvent.touchMove(dragHandle, { touches: [{ clientY: 310 }] }); // delta = 110px
    fireEvent.touchEnd(dragHandle);

    // Fast-forward exit animation (200ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(screen.queryByRole("menu", { name: "Selección de nivel adaptativo CEFR" })).toBeNull();
    vi.useRealTimers();
  });
});
