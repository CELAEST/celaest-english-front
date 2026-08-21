import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  CircleCheck,
  X,
  Bookmark,
  CircleX,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { WritingSubmission, ExtractedWritingError } from '../../../domain/entities/WritingSubmission';

export interface WritingAnalysisModalProps {
  submission: WritingSubmission;
  onClose: () => void;
  onNavigateToMemory?: () => void;
}

interface ScoreRingProps {
  value: number;
  from: string;
  to: string;
  id: string;
  trackColor?: string;
}

export function ScoreRing({ value, from, to, id, trackColor = "rgba(255,255,255,0.07)" }: ScoreRingProps) {
  const size = 74;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-sm font-semibold tracking-tight text-white">{value}%</span>
      </div>
    </div>
  );
}

export const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
  submission,
  onClose,
  onNavigateToMemory,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [bookmarkedCards, setBookmarkedCards] = useState<{ [key: number]: boolean }>({});

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const feedbackData = (submission?.feedback || {}) as any;
  const extractedErrors: ExtractedWritingError[] = feedbackData.extractedErrors || [
    {
      userSaid: "I have receive your email yesterday.",
      errorWord: "receive",
      correctWord: "received",
      betterWay: "I received your email yesterday.",
      translationSpanish: "Recibí tu correo electrónico ayer.",
      grammarExplanation: "The verb 'receive' should be in the past simple tense 'received' to match the time expression 'yesterday'.",
      cefrLevel: "Past Simple Tense",
    },
  ];

  const improvements: string[] = feedbackData.improvements || [
    "Use more precise vocabulary",
    "Improve sentence structure",
    "Practice using verb tenses correctly",
  ];

  const currentError = extractedErrors[index] || extractedErrors[0];

  const goNav = (dir: number) => {
    setIndex((prev) => (prev + dir + extractedErrors.length) % extractedErrors.length);
  };

  const toggleBookmark = (idx: number) => {
    setBookmarkedCards((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="AI Writing Analysis"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.3s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0f0f16] shadow-2xl shadow-black/60 relative animate-[scaleUp_0.35s_ease-out]"
      >
        
        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/30 to-violet-600/10 shadow-inner shadow-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-300" strokeWidth={2} fill="currentColor" />
              </span>
              <div className="min-w-0">
                <h2 className="text-balance text-base font-semibold text-white sm:text-lg">
                  AI Writing Analysis Complete
                </h2>
                <p className="text-[13px] text-neutral-500">
                  {submission.wordCount} words evaluated · CEFR Level {submission.evaluatedLevel || "B1"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 shrink-0 rounded-lg p-1 text-neutral-500 transition-colors hover:bg-white/[0.05] hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Score cards */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <ScoreRing value={submission.scoreClarity || 80} id="clarity" from="#c084fc" to="#7c3aed" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">Clarity &amp; Style</h3>
                <p className="mt-1 text-pretty text-[13px] leading-relaxed text-neutral-400">
                  {submission.scoreClarity >= 75
                    ? "Great job! Your writing is clear and easy to understand."
                    : "Good effort! Review style suggestions to enhance clarity."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <ScoreRing value={submission.scoreGrammar || 60} id="grammar" from="#34d399" to="#059669" />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">Grammar Accuracy</h3>
                <p className="mt-1 text-pretty text-[13px] leading-relaxed text-neutral-400">
                  {submission.scoreGrammar >= 75
                    ? "Strong grammar! Minor tweaks will make it 100% native."
                    : "Good effort! Review the grammar suggestions to keep improving."}
                </p>
              </div>
            </div>
          </div>

          {/* Mentor Feedback */}
          <div className="mb-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-violet-600/10 ring-1 ring-inset ring-violet-400/20">
                <MessageSquareText className="h-[18px] w-[18px] text-violet-300" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h3 className="mb-1.5 text-sm font-semibold text-white">Mentor Feedback</h3>
                <p className="text-pretty text-[13px] leading-relaxed text-neutral-400">
                  {feedbackData.summary ||
                    "The email is clear and concise, and the writer has made an effort to use proper business email etiquette. However, there are some grammar and vocabulary errors that need to be addressed to achieve native fluency."}
                </p>
              </div>
            </div>
          </div>

          {/* Improvements + Memory cards */}
          <div className="mb-4 grid grid-cols-1 gap-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 sm:grid-cols-2 sm:gap-8">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15">
                  <TrendingUp className="h-4 w-4 text-violet-300" strokeWidth={2.25} />
                </span>
                <h3 className="text-sm font-semibold text-white">Native Fluency Improvements</h3>
              </div>
              <ul className="space-y-2.5">
                {improvements.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[13px] text-neutral-300">
                    <CircleCheck className="h-4 w-4 shrink-0 text-violet-400" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15">
                  <BookOpen className="h-4 w-4 text-violet-300" strokeWidth={2.25} />
                </span>
                <h3 className="text-sm font-semibold text-white">Extracted Memory Cards</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500/20 px-1.5 text-xs font-medium text-violet-300">
                  {extractedErrors.length}
                </span>
              </div>
              <p className="mb-3 text-pretty text-[13px] leading-relaxed text-neutral-400">
                We created memory cards from your mistakes to help you remember and improve faster.
              </p>
              {onNavigateToMemory && (
                <button
                  onClick={onNavigateToMemory}
                  className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3.5 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/20 cursor-pointer"
                >
                  View Memory Cards
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Correction cards carousel */}
          {currentError && (
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
              {/* Top row */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-neutral-300">
                  {index + 1} of {extractedErrors.length}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                    <CircleCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Saved to Memory Bank
                  </span>
                  <button
                    aria-label="Bookmark"
                    onClick={() => toggleBookmark(index)}
                    className={`transition-colors cursor-pointer ${
                      bookmarkedCards[index] ? 'text-violet-400' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" fill={bookmarkedCards[index] ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Original / Better */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
                <div>
                  <p className="mb-2 text-xs text-neutral-500">Original</p>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                      <CircleX className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                    </span>
                    <p className="text-sm font-medium text-red-400 line-through decoration-red-400/70">
                      {currentError.userSaid}
                    </p>
                  </div>
                </div>

                <div className="hidden items-center pt-7 md:flex">
                  <ArrowRight className="h-4 w-4 text-neutral-600" />
                </div>

                <div>
                  <p className="mb-2 text-xs text-neutral-500">Better</p>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                      <CircleCheck className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{currentError.betterWay}</p>
                      {currentError.translationSpanish && (
                        <p className="text-xs text-neutral-400 italic mt-0.5">
                          "{currentError.translationSpanish}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-white/[0.06]" />

              {/* Why */}
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 shrink-0 text-amber-400" fill="currentColor" fillOpacity={0.15} />
                    <span className="text-sm font-semibold text-white">Why?</span>
                  </div>
                  <p className="max-w-md text-pretty text-[13px] leading-relaxed text-neutral-400">
                    {currentError.grammarExplanation ||
                      "The verb 'receive' should be in the past simple tense 'received' to match the time expression 'yesterday'."}
                  </p>
                </div>
                <span className="shrink-0 self-start rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300">
                  {currentError.cefrLevel || "Grammar Rule"}
                </span>
              </div>

              {/* Nav */}
              {extractedErrors.length > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    onClick={() => goNav(-1)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1.5">
                    {extractedErrors.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to card ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === index ? "w-5 bg-violet-500" : "w-1.5 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => goNav(1)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/[0.05] hover:text-white cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA (sticky, always visible) */}
        <div className="shrink-0 border-t border-white/[0.06] bg-[#0f0f16] p-4 sm:px-6 sm:py-5">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-opacity hover:opacity-90 cursor-pointer"
          >
            Continue Practicing
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
