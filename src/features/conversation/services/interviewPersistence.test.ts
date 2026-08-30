import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadPersistedInterview,
  savePersistedInterview,
  clearPersistedInterview,
  PersistedInterviewState,
} from "./interviewPersistence";

const sample: PersistedInterviewState = {
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
  } as unknown as PersistedInterviewState["turnFeedback"],
  showAnalysisModal: true,
  savedErrorIds: ["err-1"],
  updatedAt: 123456789,
};

describe("interviewPersistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips a full snapshot through localStorage", () => {
    savePersistedInterview(sample);
    const loaded = loadPersistedInterview();
    expect(loaded).not.toBeNull();
    expect(loaded?.currentQuestionIndex).toBe(4);
    expect(loaded?.turnFeedback?.overallScore).toBe(87);
    expect(loaded?.savedErrorIds).toEqual(["err-1"]);
    expect(loaded?.showAnalysisModal).toBe(true);
  });

  it("returns null when nothing is stored", () => {
    expect(loadPersistedInterview()).toBeNull();
  });

  it("returns null for malformed JSON without throwing", () => {
    localStorage.setItem("celaest:interview-progress:v1", "{not-json");
    expect(loadPersistedInterview()).toBeNull();
  });

  it("clearPersistedInterview removes the snapshot", () => {
    savePersistedInterview(sample);
    clearPersistedInterview();
    expect(loadPersistedInterview()).toBeNull();
  });

  it("does not throw when localStorage is unavailable (quota)", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => savePersistedInterview(sample)).not.toThrow();
    spy.mockRestore();
  });
});
