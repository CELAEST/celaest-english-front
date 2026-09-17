import { PlacementQuizAnswer, PlacementQuizResult } from "../types";

export interface PlacementQuestion {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  prompt: string;
  contextHint: string;
  options: string[];
  correctIndex: number;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "q1_a1",
    level: "A1",
    prompt: "In my daily routine, I usually _______ with my team to review upcoming tasks.",
    contextHint: "Daily routine / Present simple",
    options: ["meet", "meets", "meeting", "have meet"],
    correctIndex: 0,
  },
  {
    id: "q2_a2",
    level: "A2",
    prompt: "Yesterday, we _______ an unexpected issue and solved it before the end of the day.",
    contextHint: "Past action / Simple past",
    options: ["solve", "identified", "identifying", "have identify"],
    correctIndex: 1,
  },
  {
    id: "q3_b1",
    level: "B1",
    prompt: "If the client _______ additional details by tomorrow, we will schedule the review.",
    contextHint: "Professional condition / First conditional",
    options: ["requests", "will request", "requested", "would request"],
    correctIndex: 0,
  },
  {
    id: "q4_b2",
    level: "B2",
    prompt: "The team completed the assignment successfully _______ several technical limitations.",
    contextHint: "Complex connector / Concession preposition",
    options: ["although", "despite", "even though", "whereas"],
    correctIndex: 1,
  },
];

export class OnboardingPlacementQuizService {
  public static getQuestions(): PlacementQuestion[] {
    return PLACEMENT_QUESTIONS;
  }

  public static evaluateQuiz(
    selectedAnswers: { questionId: string; selectedOptionIndex: number }[]
  ): PlacementQuizResult {
    let score = 0;
    const evaluatedAnswers: PlacementQuizAnswer[] = [];

    for (const q of PLACEMENT_QUESTIONS) {
      const userSel = selectedAnswers.find((a) => a.questionId === q.id);
      const selIdx = userSel ? userSel.selectedOptionIndex : -1;
      const isCorrect = selIdx === q.correctIndex;
      if (isCorrect) score += 1;

      evaluatedAnswers.push({
        questionId: q.id,
        selectedOptionIndex: selIdx,
        isCorrect,
      });
    }

    let estimatedLevel: "A1" | "A2" | "B1" | "B2" = "A1";
    let levelTitle = "A1 — Beginner (Foundation)";

    if (score === 4) {
      estimatedLevel = "B2";
      levelTitle = "B2 — Upper Intermediate";
    } else if (score === 3) {
      estimatedLevel = "B1";
      levelTitle = "B1 — Intermediate";
    } else if (score === 2) {
      estimatedLevel = "A2";
      levelTitle = "A2 — Elementary";
    } else {
      estimatedLevel = "A1";
      levelTitle = "A1 — Beginner (Foundation)";
    }

    return {
      score,
      totalQuestions: PLACEMENT_QUESTIONS.length,
      estimatedLevel,
      levelTitle,
      answers: evaluatedAnswers,
    };
  }
}
