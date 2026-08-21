import React, { useState, useEffect } from "react";
import { QuizQuestion, GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";

export interface ReadingCompletionQuizProps {
  articleId?: string | undefined;
  articleTitle: string;
  articleContent: string;
  keywords?: string[] | undefined;
  cefrLevel?: string | undefined;
  cachedQuiz?: GenerateQuizResponse | undefined;
  onGetQuiz?:
    | ((
        articleId: string,
        title: string,
        content: string,
        keywords?: string[],
        level?: string
      ) => Promise<GenerateQuizResponse>)
    | undefined;
  onFinishQuiz: (score: number) => void;
  onSkip?: (() => void) | undefined;
}

export const ReadingCompletionQuiz: React.FC<ReadingCompletionQuizProps> = ({
  articleId = "",
  articleTitle,
  articleContent,
  keywords = [],
  cefrLevel = "B1",
  cachedQuiz,
  onGetQuiz,
  onFinishQuiz,
  onSkip,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return cachedQuiz?.questions && cachedQuiz.questions.length > 0 ? cachedQuiz.questions : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    return !(cachedQuiz?.questions && cachedQuiz.questions.length > 0);
  });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // If questions are already cached in memory, zero network calls!
    if (cachedQuiz?.questions && cachedQuiz.questions.length > 0) {
      setQuestions(cachedQuiz.questions);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const fetcher = onGetQuiz
      ? onGetQuiz(articleId, articleTitle, articleContent, keywords, cefrLevel)
      : apiReadingRepository.generateQuiz(articleId, articleTitle, articleContent, keywords, cefrLevel);

    fetcher
      .then((res) => {
        if (active) {
          const qs = res?.questions || [];
          setQuestions(qs);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Quiz fetch fallback trigger", err);
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [articleId, articleTitle, cachedQuiz]);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: idx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const calculatedScore = questions.reduce((acc, q, idx) => {
    return acc + (userAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  if (loading) {
    return (
      <div className="w-full max-w-[560px] min-h-[300px] flex flex-col items-center justify-center space-y-4 text-center animate-[fadeIn_0.3s_ease-out_both]">
        <div className="w-9 h-9 rounded-full border-2 border-[#7048E8] border-t-transparent animate-spin shadow-[0_0_20px_rgba(112,72,232,0.4)]" />
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-white font-light">Checking comprehension...</p>
          <p className="text-xs text-[#8a8a9e]">Formulating 3 contextual questions</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const isPerfect = calculatedScore === questions.length;
    return (
      <div className="w-full max-w-[560px] flex flex-col items-center justify-center space-y-6 text-center animate-[fadeSlideUp_0.4s_ease-out_both] py-6">
        <div className="w-16 h-16 rounded-full bg-[#1b1540] border border-[#7048E8] flex items-center justify-center text-[#A27FF3] text-2xl font-bold shadow-[0_0_30px_rgba(112,72,232,0.5)]">
          {calculatedScore}/{questions.length}
        </div>

        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide">
            {isPerfect ? "Outstanding Comprehension!" : "Good effort!"}
          </h2>
          <p className="text-xs sm:text-sm text-[#8e90a6] font-light max-w-sm">
            {isPerfect
              ? "You understood all key ideas and context nuances in this article."
              : `You answered ${calculatedScore} out of ${questions.length} questions correctly.`}
          </p>
        </div>

        <button
          onClick={() => onFinishQuiz(calculatedScore)}
          className="px-8 py-3 rounded-2xl bg-[#7048E8] hover:bg-[#8264C3] text-white text-sm font-medium transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(112,72,232,0.4)] hover:scale-105 active:scale-95"
        >
          Complete Reading & Continue →
        </button>
      </div>
    );
  }

  if (!currentQ || questions.length === 0) {
    return (
      <div className="w-full max-w-[560px] flex flex-col items-center justify-center space-y-4 text-center py-6">
        <p className="text-sm text-white font-light">Comprehension check is complete.</p>
        <button
          onClick={() => onFinishQuiz(3)}
          className="px-6 py-2.5 bg-[#7048E8] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] flex flex-col justify-between select-none animate-[fadeSlideUp_0.4s_ease-out_both]">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2.5">
          <span className="text-[11px] font-bold tracking-[0.22em] text-[#A27FF3] uppercase">
            QUESTION {currentIdx + 1} OF {questions.length}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#8a8a9e] font-medium border border-white/[0.08]">
            {cefrLevel || "B1"}
          </span>
        </div>

        {onSkip && !isAnswered && (
          <button
            onClick={onSkip}
            className="text-xs text-[#8a8a9e] hover:text-white transition-colors cursor-pointer"
          >
            Skip check
          </button>
        )}
      </div>

      {/* Question Headline */}
      <h3 className="text-base sm:text-lg font-normal text-white leading-relaxed mt-4 mb-4">
        {currentQ.question}
      </h3>

      {/* Options List */}
      <div className="flex flex-col space-y-2.5">
        {currentQ.options.map((opt, optIdx) => {
          let stateStyle =
            "bg-white/[0.02] border-white/[0.08] text-white/90 hover:border-[#7048E8]/70 hover:bg-white/[0.04]";

          if (isAnswered) {
            if (optIdx === currentQ.correctIndex) {
              stateStyle =
                "bg-[#062417] border-[#22c55e] text-[#4ade80] shadow-[0_0_18px_rgba(34,197,94,0.25)]";
            } else if (optIdx === selectedOption) {
              stateStyle = "bg-[#240a10] border-[#ef4444] text-[#f87171]";
            } else {
              stateStyle = "bg-transparent border-white/[0.04] text-white/30 opacity-40";
            }
          }

          return (
            <button
              key={optIdx}
              onClick={() => handleSelectOption(optIdx)}
              disabled={isAnswered}
              className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center space-x-3.5 ${stateStyle}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  isAnswered && optIdx === currentQ.correctIndex
                    ? "bg-[#22c55e] text-black"
                    : isAnswered && optIdx === selectedOption
                    ? "bg-[#ef4444] text-white"
                    : "bg-white/[0.08] text-white/80"
                }`}
              >
                {String.fromCharCode(65 + optIdx)}
              </span>
              <span className="flex-1 leading-normal font-light">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation Callout */}
      {isAnswered && (
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-xs text-[#a5a6c2] leading-relaxed animate-[fadeIn_0.3s_ease-out_both] flex items-start space-x-3">
          <span className="text-[#A27FF3] text-sm shrink-0 mt-0.5">✦</span>
          <div className="flex flex-col space-y-0.5">
            <span className="font-semibold text-white">
              {selectedOption === currentQ.correctIndex ? "Correct Answer" : "Explanation"}
            </span>
            <span className="font-light text-[#8e90ab]">{currentQ.explanation}</span>
          </div>
        </div>
      )}

      {/* Next Step CTA */}
      {isAnswered && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#7048E8] hover:bg-[#8264C3] text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(112,72,232,0.45)] hover:scale-105 active:scale-95"
          >
            {currentIdx < questions.length - 1 ? "Next Question →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
};
