import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnboardingFlow } from "../useOnboardingFlow";
import { SupabaseAuthAdapter } from "../../../../infrastructure/adapters/auth/SupabaseAuthAdapter";

describe("useOnboardingFlow - Track Selection & Question Reusability", () => {
  it("transitions from welcome to api-key upon nextStep()", () => {
    const { result } = renderHook(() => useOnboardingFlow());
    act(() => {
      result.current.openWelcome();
    });
    expect(result.current.step).toBe("welcome");

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("api-key");
  });

  it("beginner track: selects beginner, goes to questions, and upon completing questions skips tests directly to ready", () => {
    const { result } = renderHook(() => useOnboardingFlow());
    act(() => {
      result.current.openWelcome();
    });
    act(() => {
      result.current.nextStep(); // to api-key
    });
    act(() => {
      result.current.nextStep(); // to beginner-check
    });
    expect(result.current.step).toBe("beginner-check");

    act(() => {
      result.current.selectBeginnerTrack();
    });
    expect(result.current.step).toBe("questions");
    expect(result.current.learnerProfile.cefrLevel).toBe("A1 — Beginner");
    expect(result.current.isBeginnerTrack).toBe(true);

    // After answering questions (including profession), advances directly to ready
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("ready");

    // Going back from ready returns to questions
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.step).toBe("questions");
  });

  it("experienced track: goes through questions, dna-analysis, placement-quiz, first-conversation to ready", () => {
    const { result } = renderHook(() => useOnboardingFlow());
    act(() => {
      result.current.openWelcome();
    });
    act(() => {
      result.current.nextStep(); // to api-key
    });
    act(() => {
      result.current.nextStep(); // to beginner-check
    });

    act(() => {
      result.current.selectExperiencedTrack();
    });
    expect(result.current.step).toBe("questions");
    expect(result.current.isBeginnerTrack).toBe(false);

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("dna-analysis");

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("placement-quiz");

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("first-conversation");

    act(() => {
      result.current.nextStep();
    });
    expect(result.current.step).toBe("ready");
  });

  it("never loops an authenticated user back to auth login screen on prevStep from beginner-check", () => {
    const authSpy = vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    const { result } = renderHook(() => useOnboardingFlow());
    act(() => {
      result.current.goToStep("beginner-check");
    });
    expect(result.current.step).toBe("beginner-check");

    act(() => {
      result.current.prevStep();
    });
    expect(result.current.step).not.toBe("auth");
    authSpy.mockRestore();
  });
});
