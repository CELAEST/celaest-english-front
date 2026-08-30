import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../infrastructure/http/HttpClient", () => ({
  HttpClient: {
    post: vi.fn(),
  },
}));

import { HttpClient } from "../../../infrastructure/http/HttpClient";
import { CoreAiEvaluatorService } from "./coreAiEvaluatorService";
import { InterviewQuestionItem } from "./interviewEngineService";

const baseQuestion: InterviewQuestionItem = {
  id: 1,
  question: "Tell me about your experience leading cross-functional teams.",
  category: "WARMUP",
  starHint: "Use STAR",
  expectedKeywords: ["team", "impact"],
};

describe("CoreAiEvaluatorService enrichment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("network disabled in test"))),
    );
  });

  it("merges deterministic local errors with the LLM result (more than the LLM alone)", async () => {
    const llmPayload = {
      overallScore: 80,
      grammarScore: 78,
      clarityScore: 82,
      vocabularyScore: 80,
      improvedFullAnswer: "C2 model answer from LLM.",
      strategicFeedback: undefined,
      unclearOrErrorWords: [
        {
          id: "llm1",
          errorType: "GRAMMAR",
          errorWord: "I says",
          correctWord: "I said",
          userSaidContext: "I says",
          betterWay: "I said",
          explanation: "Concordancia",
          translationSpanish: "Dije",
          cefrLevel: "B1",
        },
        {
          id: "llm2",
          errorType: "VOCABULARY",
          errorWord: "fastly",
          correctWord: "quickly",
          userSaidContext: "fastly",
          betterWay: "quickly",
          explanation: "Adverbio",
          translationSpanish: "Rápidamente",
          cefrLevel: "B1",
        },
      ],
      keyStrengths: ["Good effort"],
      tipsForNextTurn: "Keep going",
    };

    vi.mocked(HttpClient.post).mockResolvedValue(llmPayload as never);

    // Text triggers the local "have work" + "during N years" patterns.
    const feedback = await CoreAiEvaluatorService.evaluate(
      "I have work during 4 years and I says things fastly",
      baseQuestion,
    );

    // LLM gave 2; local engine adds at least "have work" + "during 4 years".
    // The result is capped at the 5 most relevant corrections.
    expect(feedback.unclearOrErrorWords.length).toBeGreaterThan(2);
    expect(feedback.unclearOrErrorWords.length).toBeLessThanOrEqual(5);
    // LLM's own model answer is preserved (not overwritten by the local engine).
    expect(feedback.improvedFullAnswer).toBe("C2 model answer from LLM.");
  });

  it("falls back to the local engine's strategic feedback when the LLM omits it", async () => {
    const prioritizationQuestion: InterviewQuestionItem = {
      ...baseQuestion,
      id: 2,
      question: "How do you prioritize competing feature requests?",
    };

    const llmPayload = {
      overallScore: 75,
      grammarScore: 70,
      clarityScore: 80,
      vocabularyScore: 72,
      improvedFullAnswer: "LLM answer.",
      strategicFeedback: undefined,
      unclearOrErrorWords: [],
      keyStrengths: ["Direct"],
      tipsForNextTurn: "",
    };

    vi.mocked(HttpClient.post).mockResolvedValue(llmPayload as never);

    // Text has no prioritization framework → local engine should synthesize one.
    const feedback = await CoreAiEvaluatorService.evaluate(
      "I just decide based on what the sales team asks",
      prioritizationQuestion,
    );

    expect(feedback.strategicFeedback).not.toBeNull();
    expect(feedback.strategicFeedback?.recommendation.length ?? 0).toBeGreaterThan(10);
  });

  it("falls back to the comprehensive local engine when the backend is unreachable", async () => {
    vi.mocked(HttpClient.post).mockRejectedValue(new Error("backend down"));

    const feedback = await CoreAiEvaluatorService.evaluate(
      "I have work during 4 years",
      baseQuestion,
    );

    expect(feedback).toBeDefined();
    expect(typeof feedback.improvedFullAnswer).toBe("string");
    expect(Array.isArray(feedback.unclearOrErrorWords)).toBe(true);
  });
});
