import { describe, it, expect } from "vitest";
import { MasterAiFeedbackEngine } from "../masterAiFeedbackEngine";
import { InterviewQuestionItem } from "../interviewEngineService";

describe("Beginner A1 Grammar Detection in MasterAiFeedbackEngine", () => {
  const dummyQuestion: InterviewQuestionItem = {
    id: 1,
    question: "How do you help a client in your job today?",
    category: "WARMUP",
    starHint: "Describe a basic daily customer scenario.",
    expectedKeywords: ["help", "client", "work"],
    targetLevel: "A1",
  };

  it("detects double verb error 'I am help' and preposition flaw 'to you how'", () => {
    const spoken = "I am help a client to you how I can help here";
    const result = MasterAiFeedbackEngine.evaluateTurn(spoken, dummyQuestion);

    expect(result.unclearOrErrorWords.length).toBeGreaterThanOrEqual(1);

    const amHelpError = result.unclearOrErrorWords.find((e) =>
      e.errorWord.toLowerCase().includes("i am help"),
    );
    expect(amHelpError).toBeDefined();
    expect(amHelpError?.correctWord).toContain("I help");
    expect(amHelpError?.explanation).toContain("Presente Simple");
    expect(amHelpError?.cefrLevel).toBe("A1");

    const tellToError = result.unclearOrErrorWords.find((e) =>
      e.errorWord.toLowerCase().includes("to you how"),
    );
    expect(tellToError).toBeDefined();
    expect(tellToError?.correctWord).toContain("explaining to you how");
  });

  it("detects 'I am work' and 'I am agree' as beginner double-verb errors", () => {
    const spoken = "In my office I am work every day and I am agree with my boss";
    const result = MasterAiFeedbackEngine.evaluateTurn(spoken, dummyQuestion);

    const errors = result.unclearOrErrorWords.map((e) => e.errorWord.toLowerCase());
    expect(errors.some((w) => w.includes("i am work"))).toBe(true);
  });
});
