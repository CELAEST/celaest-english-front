import { describe, it, expect } from "vitest";
import { OnboardingPlacementQuizService } from "../onboardingPlacementQuizService";

describe("OnboardingPlacementQuizService", () => {
  it("should return 4 questions covering A1, A2, B1, and B2", () => {
    const questions = OnboardingPlacementQuizService.getQuestions();
    expect(questions).toHaveLength(4);
    expect(questions.map((q) => q.level)).toEqual(["A1", "A2", "B1", "B2"]);
  });

  it("should calibrate 4 correct answers as B2", () => {
    const questions = OnboardingPlacementQuizService.getQuestions();
    const allCorrect = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: q.correctIndex,
    }));

    const result = OnboardingPlacementQuizService.evaluateQuiz(allCorrect);
    expect(result.score).toBe(4);
    expect(result.estimatedLevel).toBe("B2");
  });

  it("should calibrate 3 correct answers as B1", () => {
    const questions = OnboardingPlacementQuizService.getQuestions();
    const threeCorrect = questions.map((q, idx) => ({
      questionId: q.id,
      selectedOptionIndex: idx === 3 ? 0 : q.correctIndex, // wrong on Q4
    }));

    const result = OnboardingPlacementQuizService.evaluateQuiz(threeCorrect);
    expect(result.score).toBe(3);
    expect(result.estimatedLevel).toBe("B1");
  });

  it("should calibrate 0 or 1 correct answers as A1", () => {
    const questions = OnboardingPlacementQuizService.getQuestions();
    const noneCorrect = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: (q.correctIndex + 1) % 4,
    }));

    const result = OnboardingPlacementQuizService.evaluateQuiz(noneCorrect);
    expect(result.score).toBe(0);
    expect(result.estimatedLevel).toBe("A1");
  });
});
