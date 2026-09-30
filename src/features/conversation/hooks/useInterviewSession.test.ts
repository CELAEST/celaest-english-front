import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { __resetInterviewHydrationForTest } from "./useInterviewSession";

beforeEach(() => {
  __resetInterviewHydrationForTest();
});

// Isolate the hook from browser-only media/audio APIs so we can assert on the
// pure memoization guarantee without jsdom limitations.
vi.mock("../services/audioCaptureService", () => ({
  isMobileDevice: vi.fn(() => false),
  mergePhrasesCleanly: vi.fn((a: string, b: string) => (a ? `${a} ${b}` : b)),
  AudioCaptureService: {
    initMicrophone: vi.fn(() => Promise.resolve(true)),
    hasActiveMic: vi.fn(() => true),
    isSpeechRecognitionSupported: vi.fn(() => true),
    getMicVolume: vi.fn(() => 0),
    startRecognition: vi.fn(),
    stop: vi.fn(),
    releaseMicStream: vi.fn(),
    stopAndGetAudio: vi.fn(() =>
      Promise.resolve({ audioBlob: null, audioUrl: null, durationSeconds: 0 }),
    ),
    transcribeAudio: vi.fn(() => Promise.resolve(null)),
    cleanup: vi.fn(),
  },
}));

vi.mock("../services/speechSynthesisService", () => ({
  SpeechSynthesisService: {
    stop: vi.fn(),
    speak: vi.fn(() => Promise.resolve()),
    prefetch: vi.fn(),
    cleanup: vi.fn(),
  },
}));

// Mock the interview repository so persistence calls are observable and offline-safe.
vi.mock("../../../infrastructure/repositories/ApiInterviewRepository", () => ({
  apiInterviewRepository: {
    getProgress: vi.fn(() => Promise.resolve(null)),
    saveProgress: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock("../../../infrastructure/repositories/ApiMemoryRepository", () => ({
  apiMemoryRepository: {
    createCard: vi.fn(() => Promise.resolve({ id: "card-1" })),
  },
}));

vi.mock("../services/coreAiEvaluatorService", () => ({
  CoreAiEvaluatorService: {
    evaluate: vi.fn(),
  },
}));

vi.mock("../../settings/services/providerKeyVault", () => ({
  providerKeyVault: {
    isCentralCoreEnabled: vi.fn(() => Promise.resolve(true)),
    getActiveProviderId: vi.fn(() => Promise.resolve("groq")),
    hasKey: vi.fn(() => Promise.resolve(true)),
  },
}));

// jsdom may not implement rAF; stub it so the speak-on-mount effect is harmless.
globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) =>
  setTimeout(() => cb(0), 0)) as unknown as typeof requestAnimationFrame;
globalThis.cancelAnimationFrame = ((id: number) =>
  clearTimeout(id)) as unknown as typeof cancelAnimationFrame;

import { useInterviewSession } from "./useInterviewSession";
import { apiInterviewRepository } from "../../../infrastructure/repositories/ApiInterviewRepository";
import { AudioCaptureService } from "../services/audioCaptureService";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { CoreAiEvaluatorService } from "../services/coreAiEvaluatorService";
import type { SpecificErrorItem } from "../services/interviewEngineService";
import type { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";

const STORAGE_KEY = "celaest:interview-progress:v1";

const seededSnapshot = {
  version: 1,
  roleName: "Professional",
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
  updatedAt: Date.now() - 3600000,
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
  updatedAt: new Date().toISOString(),
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

describe("useInterviewSession edge cases & hardware resilience", () => {
  it("releases microphone tracks when view becomes inactive", () => {
    const { rerender } = renderHook(
      ({ active }: { active: boolean }) => useInterviewSession("Product Manager", "B1", active),
      { initialProps: { active: true } },
    );

    act(() => {
      rerender({ active: false });
    });

    expect(AudioCaptureService.releaseMicStream).toHaveBeenCalled();
  });

  it("deduplicates card creation in saveSpecificErrorToMemory when called concurrently", async () => {
    vi.mocked(apiMemoryRepository.createCard).mockClear();

    const { result } = renderHook(() => useInterviewSession("Product Manager"));

    const fakeError: SpecificErrorItem = {
      id: "err-101",
      errorType: "GRAMMAR",
      userSaidContext: "I did go yesterday",
      betterWay: "I went yesterday",
      translationSpanish: "Fui ayer",
      errorWord: "did go",
      correctWord: "went",
      explanation: "Use simple past directly",
      cefrLevel: "B1",
      savedToMemory: false,
    };

    let p1: Promise<boolean>;
    let p2: Promise<boolean>;

    act(() => {
      p1 = result.current.saveSpecificErrorToMemory(fakeError);
      p2 = result.current.saveSpecificErrorToMemory(fakeError);
    });

    const [r1, r2] = await Promise.all([p1!, p2!]);

    expect(r1).toBe(true);
    expect(r2).toBe(true);
    // Even if called twice in the same tick, only 1 HTTP request should be sent
    expect(apiMemoryRepository.createCard).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(result.current.savedErrorIds.has("err-101")).toBe(true);
    });
  });

  it("resets current question index and stops active audio when CEFR level is changed", () => {
    const { result } = renderHook(() => useInterviewSession("Product Manager", "B1"));

    // Advance to question 3
    act(() => {
      result.current.skipQuestion();
      result.current.skipQuestion();
    });

    expect(result.current.currentQuestionIndex).toBeGreaterThan(1);

    // Switch CEFR level to B2
    act(() => {
      result.current.setActiveCefrLevel("B2");
    });

    expect(result.current.activeCefrLevel).toBe("B2");
    expect(result.current.currentQuestionIndex).toBe(1); // 1-based questionInRound
    expect(result.current.overallQuestionIndex).toBe(1);
  });
});

describe("useInterviewSession turn submission & AI evaluation (Zero Deadlock)", () => {
  const fakeFeedback: ComprehensiveTurnFeedback = {
    overallScore: 88,
    grammarScore: 92,
    clarityScore: 85,
    vocabularyScore: 87,
    userSpokenText: "I usually start my day by checking project tasks and team updates.",
    improvedFullAnswer: "I typically begin each day by reviewing high-priority tasks and aligning with team updates.",
    unclearOrErrorWords: [],
    keyStrengths: ["Clear structure"],
    tipsForNextTurn: "Add specific business outcomes.",
    strategicFeedback: {
      type: "CONTENT_TIP",
      title: "Respuesta sólida",
      explanation: "Demostraste orden y claridad en tu rutina.",
      recommendation: "Menciona herramientas específicas que utilizas.",
    },
  };

  beforeEach(() => {
    vi.mocked(CoreAiEvaluatorService.evaluate).mockReset();
  });

  it("submits answer cleanly, calls CoreAiEvaluatorService, and opens analysis modal without deadlock", async () => {
    vi.mocked(CoreAiEvaluatorService.evaluate).mockResolvedValueOnce(fakeFeedback);

    const { result } = renderHook(() => useInterviewSession("Product Manager", "B1"));

    await act(async () => {
      await result.current.finishTurnManual("I usually start my day by checking project tasks and team updates.");
    });

    expect(CoreAiEvaluatorService.evaluate).toHaveBeenCalledTimes(1);
    expect(result.current.showAnalysisModal).toBe(true);
    expect(result.current.turnFeedback?.overallScore).toBe(88);
    expect(result.current.isThinking).toBe(false);

    // After evaluation finishes, user should be able to skip/advance question without being locked
    act(() => {
      result.current.skipQuestion();
    });

    expect(result.current.currentQuestionIndex).toBe(2);
  });

  it("stops active microphone and uses captured transcript when finishTurnManual is called during recording", async () => {
    vi.mocked(CoreAiEvaluatorService.evaluate).mockResolvedValueOnce(fakeFeedback);
    vi.mocked(AudioCaptureService.stopAndGetAudio).mockResolvedValueOnce({
      audioBlob: new Blob(["test"], { type: "audio/webm" }),
      audioUrl: "blob:http://localhost/test-audio",
      durationSeconds: 8,
    });

    const { result } = renderHook(() => useInterviewSession("Product Manager", "B1"));

    // Simulate active recording with transcript
    act(() => {
      result.current.toggleListening();
      result.current.setUserTranscript("I lead a team of senior software engineers on critical projects.");
    });

    await act(async () => {
      await result.current.finishTurnManual();
    });

    expect(AudioCaptureService.stopAndGetAudio).toHaveBeenCalled();
    expect(CoreAiEvaluatorService.evaluate).toHaveBeenCalledTimes(1);
    expect(result.current.showAnalysisModal).toBe(true);
    expect(result.current.turnFeedback?.userAudioUrl).toBe("blob:http://localhost/test-audio");
  });

  it("transcribes audio with Whisper and passes verbatim text to AI evaluation", async () => {
    vi.mocked(CoreAiEvaluatorService.evaluate).mockResolvedValueOnce(fakeFeedback);
    vi.mocked(AudioCaptureService.stopAndGetAudio).mockResolvedValueOnce({
      audioBlob: new Blob(["speech-bytes"], { type: "audio/webm" }),
      audioUrl: "blob:http://localhost/speech-audio",
      durationSeconds: 10,
    });
    vi.mocked(AudioCaptureService.transcribeAudio).mockResolvedValueOnce({
      text: "I consider that for drive organizational transformation, we must to focus in optimize our operative processes.",
      language: "en",
      avgLogprob: -0.15,
      noSpeechProb: 0.01,
    });

    const { result } = renderHook(() => useInterviewSession("Product Manager", "B1"));

    // User was speaking (Web Speech had interim mangled words)
    act(() => {
      result.current.toggleListening();
      result.current.setUserTranscript("for dry organizational transformation we must to focus in Optimus side");
    });

    await act(async () => {
      await result.current.finishTurnManual();
    });

    expect(AudioCaptureService.transcribeAudio).toHaveBeenCalled();
    expect(CoreAiEvaluatorService.evaluate).toHaveBeenCalledWith(
      "I consider that for drive organizational transformation, we must to focus in optimize our operative processes.",
      expect.anything(),
      "Product Manager",
      "B1",
    );
    expect(result.current.userTranscript).toBe("I consider that for drive organizational transformation, we must to focus in optimize our operative processes.");
  });

  it("recovers gracefully on evaluation error without permanently locking isEvaluatingRef or remaining stuck in THINKING", async () => {
    vi.mocked(CoreAiEvaluatorService.evaluate).mockRejectedValueOnce(new Error("Network timeout"));

    const { result } = renderHook(() => useInterviewSession("Product Manager", "B1"));

    await act(async () => {
      await result.current.finishTurnManual("I work with agile methodologies and sprint planning.");
    });

    // Should open recovery modal and reset isThinking
    expect(result.current.isRecoveryModalOpen).toBe(true);
    expect(result.current.isThinking).toBe(false);

    // Ensure state is unblocked for subsequent operations
    act(() => {
      result.current.skipQuestion();
    });
    expect(result.current.currentQuestionIndex).toBe(2);
  });
});

