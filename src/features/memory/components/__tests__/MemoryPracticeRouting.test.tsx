import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryView } from "../MemoryView";
import { MemoryEmptyState } from "../MemoryEmptyState";

vi.mock("../../hooks/useMemoryCards", () => ({
  useMemoryCards: () => ({
    cards: [],
    isLoading: false,
    reviewCard: vi.fn(),
    deleteCard: vi.fn(),
  }),
}));

describe("Memory Practice Routing Standard", () => {
  it("triggers onStartPractice in MemoryEmptyState", () => {
    const onStartPractice = vi.fn();
    render(
      <MemoryEmptyState
        category="SPEAKING"
        onStartPractice={onStartPractice}
      />
    );

    const button = screen.getByText("Start Practice Session");
    expect(button).toBeDefined();
    fireEvent.click(button);
    expect(onStartPractice).toHaveBeenCalledTimes(1);
  });

  it("routes Speaking empty state to 'interview'", () => {
    const onNavigate = vi.fn();
    render(
      <MemoryView
        initialCategory="speaking"
        onNavigate={onNavigate}
      />
    );

    const button = screen.getByText("Start Practice Session");
    fireEvent.click(button);
    expect(onNavigate).toHaveBeenCalledWith("interview");
  });

  it("routes Reading empty state to 'reading'", () => {
    const onNavigate = vi.fn();
    render(
      <MemoryView
        initialCategory="reading"
        onNavigate={onNavigate}
      />
    );

    const button = screen.getByText("Start Practice Session");
    fireEvent.click(button);
    expect(onNavigate).toHaveBeenCalledWith("reading");
  });

  it("routes Writing empty state to 'writing'", () => {
    const onNavigate = vi.fn();
    render(
      <MemoryView
        initialCategory="writing"
        onNavigate={onNavigate}
      />
    );

    const button = screen.getByText("Start Practice Session");
    fireEvent.click(button);
    expect(onNavigate).toHaveBeenCalledWith("writing");
  });
});
