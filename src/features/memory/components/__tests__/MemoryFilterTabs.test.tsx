import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryFilterTabs } from "../MemoryFilterTabs";

describe("MemoryFilterTabs", () => {
  it("renders all 3 tabs: Speaking, Reading, Writing", () => {
    const onTabChange = vi.fn();
    render(
      <MemoryFilterTabs
        activeTab={0}
        speakingCount={2}
        readingCount={5}
        writingCount={1}
        onTabChange={onTabChange}
      />
    );

    expect(screen.getByText("Speaking")).toBeDefined();
    expect(screen.getByText("Reading")).toBeDefined();
    expect(screen.getByText("Writing")).toBeDefined();

    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(3);

    fireEvent.click(tabs[1]);
    expect(onTabChange).toHaveBeenCalledWith(1);

    fireEvent.click(tabs[2]);
    expect(onTabChange).toHaveBeenCalledWith(2);
  });
});
