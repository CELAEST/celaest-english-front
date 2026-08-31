import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { __resetInterviewHydrationForTest } from "./useInterviewSession";

beforeEach(() => {
  __resetInterviewHydrationForTest();
});

// Isolate the hook from browser-only media/audio APIs so we can assert on the
// pure memoization guarantee without jsdom limitations.
vi.mock("../services/audioCaptureService", () => ({
  AudioCaptureService: {
    initMicrophone: vi.fn(() => Promise.resolve()),
    getMicVolume: vi.fn(() => 0),
    startRecognition: vi.fn(),
    stop: vi.fn(),
    stopAndGetAudio: vi.fn(() =>
      Promise.resolve({ audioBlob: null, audioUrl: null, durationSeconds: 0 }),
    ),
    transcribeAudio: vi.fn(() => Promise.resolve("")),
    cleanup: vi.fn(),
  },
}));

vi.mock("../services/speechSynthesisService", () => ({
  SpeechSynthesisService: {
    stop: vi.fn(),
    speak: vi.fn(() => Promise.resolve()),
  },
}));

// Mock the interview repository so persistence calls are observable and offline-safe.
vi.mock("../../../infrastructure/repositories/ApiInterviewRepository", () => ({
  apiInterviewRepository: {
    getProgress: vi.fn(() => Promise.resolve(null)),
    saveProgress: vi.fn(() => Promise.resolve()),
  },
}));

// jsdom may not implement rAF; stub it so the speak-on-mount effect is harmless.
globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
  setTimeout(() => cb(0), 0)) as unknown as typeof requestAnimationFrame;
globalThis.cancelAnimationFrame = ((id: number) =>
  clearTimeout(id)) as unknown as typeof cancelAnimationFrame;

import { useInterviewSession } from "./useInterviewSession";
import { apiInterviewRepository } from "../../../infrastructure/repositories/ApiInterviewRepository";

const STORAGE_KEY = "celaest:interview-progress:v1";

const seededSnapshot = {
  version: 1,
  roleName: "Product Manager",
  speechRate: 0.95,
  currentQuestionIndex: 4,
  userTranscript: "I have worked on many projects",
  turnFeedback: {
    overallScore: 87,
    grammarScore: 90,
    clarityScore: 85,
    vocabularyScore: 88,
    userSpokenText: "I have worked on many projects",
    improvedFullAnswer: "I have led multiple projects",
    unclearOrErrorWords: [],
    keyStrengths: ["Clarity"],
    tipsForNextTurn: "Keep it up",
    strategicFeedback: null,
  },
  showAnalysisModal: true,
  savedErrorIds: ["err-1"],
  updatedAt: 123456789,
};

const cloudSnapshot = {
  userId: "user-1",
  roleName: "Product Manager",
  speechRate: 1.0,
  currentQuestionIndex: 7,
  userTranscript: "Cloud answer",
  savedErrorIds: ["err-cloud"],
  showAnalysisModal: false,
  latestTurn: {
    question: "Q?",
    transcript: "Cloud answer",
    feedback: {
      overallScore: 70,
      grammarScore: 72,
      clarityScore: 71,
      vocabularyScore: 73,
      userSpokenText: "Cloud answer",
      improvedFullAnswer: "Better",
      unclearOrErrorWords: [],
      keyStrengths: ["X"],
      tipsForNextTurn: "Y",
      strategicFeedback: null,
    },
  },
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("useInterviewSession memoization", () => {
  it("keeps currentQuestion reference stable across re-renders (no question change)", () => {
    const { result, rerender } = renderHook(() => useInterviewSession("Product Manager"));

    const first = result.current.currentQuestion;
    expect(first).toBeDefined();

    act(() => {
      rerender();
    });

    const second = result.current.currentQuestion;
    // Without useMemo, DynamicQuestionService returns a new object every render,
    // so this would be a different reference and the memoized panel would re-render.
    expect(second).toBe(first);
  });

  it("produces a new currentQuestion only when the question index advances", () => {
    const { result, rerender } = renderHook(() => useInterviewSession("Product Manager"));
    const first = result.current.currentQuestion;

    // Advance the question index via the exposed action, then re-render.
    act(() => {
      result.current.skipQuestion();
    });
    act(() => {
      rerender();
    });

    const second = result.current.currentQuestion;
    expect(second).not.toBe(first);
  });
});

describe("useInterviewSession persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    __resetInterviewHydrationForTest();
    vi.mocked(apiInterviewRepository.getProgress).mockReturnValue(
      Promise.resolve(null),
    );
    vi.mocked(apiInterviewRepository.saveProgress).mockReturnValue(
      Promise.resolve(),
    );
  });

  it("rehydrates the session from a persisted localStorage snapshot", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededSnapshot));

    const { result } = renderHook(() => useInterviewSession("Product Manager"));

    // seededSnapshot.currentQuestionIndex = 4 → overallQuestionIndex = 5.
    expect(result.current.overallQuestionIndex).toBe(5);
    expect(result.current.showAnalysisModal).toBe(true);
    expect(result.current.savedErrorIds.has("err-1")).toBe(true);
    expect(result.current.turnFeedback?.overallScore).toBe(87);
  });

  it("persists the current turn to the backend after a change (debounced)", async () => {
    const { result } = renderHook(() => useInterviewSession("Product Manager"));

    act(() => {
      result.current.skipQuestion();
    });

    await waitFor(
      () => expect(apiInterviewRepository.saveProgress).toHaveBeenCalled(),
      { timeout: 1500 },
    );
    const mockFn = apiInterviewRepository.saveProgress as unknown as {
      mock: { calls: Array<[Record<string, unknown>]>; };
    };
    const payload = mockFn.mock.calls[0][0] as { currentQuestionIndex: number };
    expect(payload.currentQuestionIndex).toBeGreaterThan(0);
  });

  it("does NOT persist to the backend on entry when nothing changed", async () => {
    renderHook(() => useInterviewSession("Product Manager"));

    // Let the debounce window elapse with no user action. Mounting alone must
    // not trigger a /interview/progress POST (the restored state is already
    // local, and a needless round-trip on every entry is wasteful).
    await new Promise((r) => setTimeout(r, 700));
    expect(apiInterviewRepository.saveProgress).not.toHaveBeenCalled();
  });

  it("hydrates from the backend when the cloud copy is newer than localStorage", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededSnapshot));
    vi.mocked(apiInterviewRepository.getProgress).mockReturnValue(
      Promise.resolve(cloudSnapshot),
    );

    const { result } = renderHook(() => useInterviewSession("Product Manager"));

    await waitFor(() => expect(result.current.overallQuestionIndex).toBe(8), {
      timeout: 1500,
    });
    expect(result.current.userTranscript).toBe("Cloud answer");
    expect(result.current.turnFeedback?.overallScore).toBe(70);
  });

  it("does NOT post a redundant save when adopting a newer cloud copy", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededSnapshot));
    vi.mocked(apiInterviewRepository.getProgress).mockReturnValue(
      Promise.resolve(cloudSnapshot),
    );

    renderHook(() => useInterviewSession("Product Manager"));

    // The restore must not trigger a /interview/progress POST: the cloud state
    // was just adopted, so re-uploading it is a wasted round-trip.
    await new Promise((r) => setTimeout(r, 700));
    expect(apiInterviewRepository.saveProgress).not.toHaveBeenCalled();
  });

  it("ignores an older backend copy and keeps the newer localStorage snapshot", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seededSnapshot));
    // Cloud copy is genuinely older: localStorage updatedAt=123456789 (1973),
    // so a 1970 timestamp must NOT override the local snapshot.
    vi.mocked(apiInterviewRepository.getProgress).mockReturnValue(
      Promise.resolve({ ...cloudSnapshot, updatedAt: "1970-01-02T00:00:00Z" }),
    );

    const { result } = renderHook(() => useInterviewSession("Product Manager"));

    // Give the async hydration a chance to (wrongly) override; it must NOT.
    await new Promise((r) => setTimeout(r, 50));
    expect(result.current.overallQuestionIndex).toBe(5);
  });
});
