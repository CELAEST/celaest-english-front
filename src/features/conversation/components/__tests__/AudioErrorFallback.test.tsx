import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ReactElement } from "react";
import { ErrorBoundary } from "../../../../shared/components/ErrorBoundary";

// Faulty component simulating microphone permission denial or WebAudio initialization crash
function FaultyAudioRecorder(): ReactElement {
  throw new Error("DOMException: Permission denied by user to access audio capture");
}

describe("Conversation Audio & Media Error Resilience", () => {
  it("isolates audio hardware failure and presents a resilient fallback UI without crashing SPA", () => {
    // Suppress expected console.error during intentional boundary catch
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <FaultyAudioRecorder />
      </ErrorBoundary>,
    );

    // Verify Error Boundary caught the error gracefully
    expect(screen.getByText(/Something went wrong/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Reload app/i })).toBeDefined();

    consoleSpy.mockRestore();
  });
});
