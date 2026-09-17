import React, { useState } from "react";
import { PlacementQuizHeader } from "./placement-quiz/PlacementQuizHeader";
import { PlacementQuestionCard } from "./placement-quiz/PlacementQuestionCard";
import {
  OnboardingPlacementQuizService,
  PlacementQuestion,
} from "../services/onboardingPlacementQuizService";
import { PlacementQuizResult } from "../types";

export interface OnboardingPlacementQuizStepProps {
  onComplete: (result: PlacementQuizResult) => void;
  onSkipAsBeginner?: () => void;
  onPrev: () => void;
}

export const OnboardingPlacementQuizStep: React.FC<OnboardingPlacementQuizStepProps> = ({
  onComplete,
  onSkipAsBeginner,
  onPrev,
}) => {
  const questions: PlacementQuestion[] = OnboardingPlacementQuizService.getQuestions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    { questionId: string; selectedOptionIndex: number }[]
  >([]);

  const currentQ = questions[currentIndex];
  const currentAnswer = selectedAnswers.find((a) => a.questionId === currentQ.id);
  const selectedIndex = currentAnswer ? currentAnswer.selectedOptionIndex : null;

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== currentQ.id),
      { questionId: currentQ.id, selectedOptionIndex: idx },
    ]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const result = OnboardingPlacementQuizService.evaluateQuiz(selectedAnswers);
      onComplete(result);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onPrev();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        <div className="shrink-0 h-5 sm:h-7" />

        <div className="flex-1 flex flex-col justify-center max-w-xl min-h-0 my-auto py-1">
          <PlacementQuizHeader
            currentQuestionIndex={currentIndex}
            totalQuestions={questions.length}
          />

          <PlacementQuestionCard
            question={currentQ}
            selectedIndex={selectedIndex}
            onSelectOption={handleSelectOption}
          />

          <div className="shrink-0 flex items-center gap-3 pt-2">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#13102B] border border-[#2A244D] text-[#A699CD] hover:text-white hover:border-[#4B3B82] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <button
              onClick={handleNext}
              disabled={selectedIndex === null}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? "Start Diagnostic Chat" : "Next Question"}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {onSkipAsBeginner && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSkipAsBeginner}
                className="text-[11px] text-[#A699CD]/70 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
              >
                ¿Prefieres no realizar el test? Empieza desde cero en Nivel A1
              </button>
            </div>
          )}
        </div>

        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
