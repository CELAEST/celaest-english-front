import React, { useState } from "react";
import {
  X,
  Check,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Bookmark,
  Copy,
  BookOpen,
  Trophy,
  BookOpenCheck,
  PenLine,
  MessageSquareText,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  WritingSubmission,
  ExtractedWritingError,
} from "../../../domain/entities/WritingSubmission";
import { AppModal } from "../../../design-system/components/Modal/AppModal";

export interface WritingErrorItem extends ExtractedWritingError {
  id: string;
}

export const getWritingErrorId = (submissionId: string, index: number): string =>
  `${submissionId}-err-${index}`;

export interface WritingAnalysisModalProps {
  submission: WritingSubmission;
  savedErrorIds: Set<string>;
  onClose: () => void;
  onContinuePracticing?: () => void;
  onSaveSpecificError: (errorItem: WritingErrorItem) => Promise<boolean>;
  onSaveAllErrors: () => Promise<number>;
  onNavigateToMemory?: () => void;
}

interface ScoreGaugeProps {
  value: number;
  from: string;
  to: string;
  id: string;
  glowColor?: string;
  size?: number;
  stroke?: number;
}

function ScoreGauge({
  value,
  from,
  to,
  id,
  glowColor = "rgba(162, 127, 243, 0.40)",
  size = 80,
  stroke = 5.5,
}: ScoreGaugeProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#141528"
          strokeWidth={stroke}
        />
        {/* Animated Metric Arc */}
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
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined,
          }}
        />
      </svg>
      {/* Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold tracking-tight text-white font-mono leading-none">
          {safeValue}
        </span>
        <span className="text-[9px] font-medium text-white/40 leading-none mt-0.5">%</span>
      </div>
    </div>
  );
}

const getTierLabel = (score: number): string => {
  if (score >= 90) return "Executive Level";
  if (score >= 80) return "Advanced Level";
  if (score >= 70) return "Competent Level";
  return "Developing Level";
};

function TopHighlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_18%)]"
    />
  );
}

function QuoteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 22" fill="currentColor" aria-hidden="true">
      <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
    </svg>
  );
}

function getFallbackStrengths(submission: WritingSubmission): string[] {
  const items: string[] = [];
  if ((submission.scoreClarity || 0) >= 75) {
    items.push("Clear, easy-to-follow writing style.");
  }
  if ((submission.scoreGrammar || 0) >= 75) {
    items.push("Strong grammar control throughout the text.");
  }
  if (items.length === 0) {
    items.push("You completed the task and communicated your core message.");
  }
  return items;
}

function getFallbackIssues(errors: WritingErrorItem[]): string[] {
  if (errors.length === 0) {
    return ["No critical issues detected in this submission."];
  }
  return errors.slice(0, 2).map((e) => `Recurring issue with "${e.errorWord || e.correctWord}".`);
}

export const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
  submission,
  savedErrorIds,
  onClose,
  onContinuePracticing,
  onSaveSpecificError,
  onSaveAllErrors,
  onNavigateToMemory,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const feedbackData = submission.feedback;
  const errors: WritingErrorItem[] = (feedbackData.extractedErrors || []).map((e, i) => ({
    ...e,
    id: getWritingErrorId(submission.id, i),
  }));

  // Performance report data: AI-provided with graceful score-based fallbacks
  const rawStrengths = feedbackData.strengths || [];
  const rawIssues = feedbackData.issues || [];
  const rawImprovements = feedbackData.improvements || [];

  const strengths: string[] =
    rawStrengths.length > 0 ? rawStrengths : getFallbackStrengths(submission);
  const issues: string[] = rawIssues.length > 0 ? rawIssues : getFallbackIssues(errors);
  const improvements: string[] =
    rawImprovements.length > 0
      ? rawImprovements
      : ["Review the correction cards below and practice the suggested structures."];

  const overallScore = Math.round(
    ((submission.scoreClarity || 0) + (submission.scoreGrammar || 0)) / 2,
  );
  const currentError = errors[index] || errors[0];

  const goNav = (dir: number) => {
    if (errors.length === 0) return;
    setIndex((prev) => (prev + dir + errors.length) % errors.length);
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    await onSaveAllErrors();
    setIsSavingAll(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(submission.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AppModal
      size="lg"
      title="AI Writing Analysis Complete"
      subtitle={`${submission.wordCount} words evaluated · CEFR Level ${submission.evaluatedLevel || "B1"}`}
      ariaLabel="AI Writing Analysis Complete"
      onClose={onClose}
      icon={
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L17.5 8.5L12 22L6.5 8.5L12 2Z"
            stroke="url(#wrt_hdr_grad)"
            strokeWidth="1.75"
            fill="url(#wrt_hdr_fill)"
            fillOpacity="0.2"
          />
          <circle cx="12" cy="10" r="2" stroke="#A27FF3" strokeWidth="1.5" />
          <path d="M12 12.5V17.5" stroke="#9d7cf0" strokeWidth="1.25" strokeLinecap="round" />
          <defs>
            <linearGradient
              id="wrt_hdr_grad"
              x1="6.5"
              y1="2"
              x2="17.5"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#674ee6" />
            </linearGradient>
            <linearGradient
              id="wrt_hdr_fill"
              x1="12"
              y1="2"
              x2="12"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#3b1d7d" />
            </linearGradient>
          </defs>
        </svg>
      }
      bodyClassName="p-5 lg:p-7"
      footer={
        <button
          type="button"
          onClick={onContinuePracticing || onClose}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7048E8] to-[#A27FF3] py-3 text-sm font-semibold text-white shadow-lg shadow-[#7048E8]/30 transition-opacity hover:opacity-90 cursor-pointer"
        >
          Continue Practicing
          <ArrowRight className="h-4 w-4" />
        </button>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5">
        {/* Master Scorecard & Competencies */}
        <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Overall Score Hero (lg:col-span-5) */}
            <div className="lg:col-span-5 flex items-center gap-5 lg:pr-7 lg:border-r lg:border-white/[0.06]">
              <ScoreGauge
                value={overallScore}
                id="wrt_gauge_overall_hero"
                from="#7048E8"
                to="#A27FF3"
                glowColor="rgba(162, 127, 243, 0.45)"
                size={84}
                stroke={6}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-[18px] w-[18px] text-[#A27FF3] shrink-0" />
                  <h3 className="text-[16.5px] font-semibold text-white tracking-tight leading-none">
                    Overall Score
                  </h3>
                </div>
                <p className="text-[12px] font-medium text-[#c4b5fd] leading-none">
                  {getTierLabel(overallScore)}
                </p>
                <p className="text-[12px] text-[#8a8a9e] leading-relaxed">
                  General performance across clarity, style and grammar.
                </p>
              </div>
            </div>

            {/* Right Column: Detailed Competency Progress Bars (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Clarity & Style */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-[#c084fc] shrink-0" />
                    <span className="font-medium text-white">Clarity &amp; Style</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#8a8a9e]">
                      {getTierLabel(submission.scoreClarity || 0)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {Math.round(submission.scoreClarity || 0)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, submission.scoreClarity || 0))}%`,
                      background: "linear-gradient(90deg, #8f71ee, #c084fc)",
                    }}
                  />
                </div>
              </div>

              {/* Grammar Accuracy */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-[#34d399] shrink-0" />
                    <span className="font-medium text-white">Grammar Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#8a8a9e]">
                      {getTierLabel(submission.scoreGrammar || 0)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {Math.round(submission.scoreGrammar || 0)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, submission.scoreGrammar || 0))}%`,
                      background: "linear-gradient(90deg, #059669, #34d399)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mentor Feedback */}
        {(feedbackData.summary || "").trim().length > 0 && (
          <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-[#A27FF3] shrink-0" />
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  Mentor Feedback
                </h3>
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
                AI MENTOR
              </span>
            </div>

            <div className="flex items-start gap-3.5 pl-1 pr-2">
              <QuoteGlyph className="w-[18px] h-[15px] shrink-0 mt-1 text-[#674ee6]" />
              <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">
                "{feedbackData.summary}"
              </p>
            </div>
          </article>
        )}

        {/* Performance Report: Strengths / Issues / Improvements */}
        <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#A27FF3] shrink-0" />
              <h3 className="text-[15px] font-semibold text-white tracking-tight">
                Performance Report
              </h3>
            </div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
              FULL REVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <CircleCheck className="h-4 w-4 text-[#55c9a4]" strokeWidth={2.5} />
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#55c9a4]">
                  What you did well
                </span>
              </div>
              <ul className="space-y-2.5">
                {strengths.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#55c9a4]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Issues */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <CircleX className="h-4 w-4 text-[#d8667a]" strokeWidth={2.5} />
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#d8667a]">
                  What to fix
                </span>
              </div>
              <ul className="space-y-2.5">
                {issues.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#d8667a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <TrendingUp className="h-4 w-4 text-[#9d7cf0]" />
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#9d7cf0]">
                  What to improve
                </span>
              </div>
              <ul className="space-y-2.5">
                {improvements.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#d4d4e0]"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#9d7cf0]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Extracted Memory Cards strip */}
        <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141028] border border-[#251d48]">
              <BookOpen className="h-[18px] w-[18px] text-[#A27FF3]" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-white tracking-tight">
                  Extracted Memory Cards
                </h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A27FF3]/15 px-1.5 text-[11px] font-semibold text-[#c4b5fd]">
                  {errors.length}
                </span>
              </div>
              <p className="text-[12px] text-[#8a8a9e] truncate">
                Created from your mistakes to help you remember and improve faster.
              </p>
            </div>
          </div>
          {onNavigateToMemory && (
            <button
              onClick={onNavigateToMemory}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#A27FF3]/30 bg-[#A27FF3]/10 px-4 py-2.5 text-[12.5px] font-medium text-[#c4b5fd] transition-colors hover:bg-[#A27FF3]/20 hover:text-white cursor-pointer"
            >
              View Memory Cards
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </article>

        {/* Your Writing (Original Submission) */}
        <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl transition-all">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#A27FF3] shrink-0" />
              <div className="flex items-center gap-2.5">
                <h3 className="text-[16px] font-semibold text-white tracking-tight">
                  What you wrote
                </h3>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
                  Original text
                </span>
              </div>
            </div>
          </div>

          {/* Body: Bespoke Purple SVG Quote Icon + Quoted Text */}
          <div className="flex items-start gap-4 pl-2 sm:pl-5 pr-6 sm:pr-28 mb-4">
            <QuoteGlyph className="w-[25px] h-[20px] shrink-0 mt-0.5 text-[#674ee6]" />
            <p className="text-[14.5px] leading-[1.75] text-[#d4d4e0] font-normal whitespace-pre-line">
              "{submission.content}"
            </p>
          </div>

          {/* Bottom Row: Copy Button right aligned */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleCopyText}
              title="Copy your text"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#8a8a9e] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer shadow-sm"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-[#55c9a4]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </article>

        {/* Errors & Improvement Analysis Flashcard Carousel */}
        {errors.length > 0 && currentError ? (
          <div className="mt-8">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[17px] font-semibold text-white tracking-tight">
                  Improvement Analysis
                </h3>
                <span className="text-[12.5px] font-medium text-[#8a8a9e]">
                  • {errors.length} {errors.length === 1 ? "correction" : "corrections"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {onNavigateToMemory && (
                  <button
                    onClick={onNavigateToMemory}
                    className="text-xs text-[#8a8a9e] hover:text-white underline transition-colors cursor-pointer hidden sm:inline-block mr-2"
                  >
                    View in Memory Bank
                  </button>
                )}
                {savedErrorIds.has(currentError.id) && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#6ce2a3]">
                    <CircleCheck className="h-4 w-4" strokeWidth={2.5} />
                    Saved
                  </span>
                )}
                <button
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#a7a8b5] hover:text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Bookmark className="h-4 w-4" fill={isSavingAll ? "currentColor" : "none"} />
                  {isSavingAll ? "Saving..." : "Save all"}
                </button>
              </div>
            </div>

            {/* 3-Piece Layout */}
            <div
              className="
                    relative grid items-start gap-x-4 gap-y-3
                    [grid-template-columns:1fr]
                    md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.05fr)]
                    md:[grid-template-rows:auto_auto_4.5rem]
                  "
            >
              {/* Error card — spans all rows on desktop */}
              <article
                className="edge relative overflow-hidden rounded-2xl p-6 sm:p-7 md:self-stretch md:[grid-area:1/1/4/2] flex flex-col justify-between"
                style={{
                  background:
                    "radial-gradient(110% 90% at 0% 0%, rgba(216,102,122,0.06), transparent 60%), radial-gradient(120% 80% at 30% 100%, rgba(216,102,122,0.03), transparent 65%), #090A14",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(216,102,122,0.55), rgba(216,102,122,0.14) 35%, rgba(216,102,122,0.05) 70%, rgba(255,255,255,0.04))",
                }}
              >
                <TopHighlight />
                <div>
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <X
                        className="h-4 w-4 shrink-0 text-[#d8667a]"
                        aria-hidden="true"
                        strokeWidth={2.5}
                      />
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#d8667a]">
                        INCORRECT
                      </span>
                    </div>
                    {currentError.cefrLevel && (
                      <span className="text-[11px] font-semibold tracking-wider text-[#8a8a9e] uppercase">
                        {currentError.cefrLevel}
                      </span>
                    )}
                  </div>
                  <p className="relative mt-4 text-xl font-medium text-[#b0b1c0] line-through decoration-[#d8667a]/60 decoration-1 leading-snug">
                    {currentError.errorWord}
                  </p>
                </div>

                {/* Bottom area: Save to Memory */}
                <div className="relative mt-6 flex items-center justify-end text-xs">
                  <button
                    onClick={() => onSaveSpecificError(currentError)}
                    disabled={savedErrorIds.has(currentError.id)}
                    className={`transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium ${
                      savedErrorIds.has(currentError.id)
                        ? "text-[#55c9a4] cursor-default"
                        : "text-[#8a8a9e] hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      fill={savedErrorIds.has(currentError.id) ? "currentColor" : "none"}
                    />
                    <span>{savedErrorIds.has(currentError.id) ? "Saved" : "Save to Memory"}</span>
                  </button>
                </div>
              </article>

              {/* Decorative arrow */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[4.75rem] z-20 hidden -translate-x-1/2 -translate-y-1/2 text-[#a27ff3]/55 md:block"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
              </span>

              {/* Success card — top row only */}
              <article
                className="edge relative z-10 overflow-hidden self-start rounded-2xl p-6 sm:p-7 md:[grid-area:1/2/2/3]"
                style={{
                  background:
                    "radial-gradient(110% 90% at 100% 0%, rgba(85,201,164,0.06), transparent 60%), #090A14",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(85,201,164,0.55), rgba(85,201,164,0.14) 35%, rgba(85,201,164,0.05) 70%, rgba(255,255,255,0.04))",
                }}
              >
                <TopHighlight />
                <div className="relative flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-[#55c9a4]"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#55c9a4]">
                    BETTER OPTION
                  </span>
                </div>
                <p className="relative mt-4 text-xl font-medium text-[#55c9a4] sm:text-[1.4rem] sm:leading-snug">
                  {currentError.correctWord}
                </p>
                {currentError.betterWay && (
                  <div className="relative mt-4">
                    <p className="text-xs font-semibold text-[#d4d4e0] uppercase tracking-wider">
                      Full sentence:
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-[#d4d4e0]">
                      "{currentError.betterWay}"
                    </p>
                  </div>
                )}
                {currentError.translationSpanish && (
                  <p className="relative mt-2.5 text-xs italic leading-relaxed text-[#a7a8b5]">
                    "{currentError.translationSpanish}"
                  </p>
                )}
              </article>

              {/* Grammar rule strip */}
              <div
                className="edge relative z-10 self-start rounded-xl px-4 py-3.5 md:ml-8 md:[grid-area:2/1/3/3] lg:ml-10"
                style={{
                  background: "#0B0C16",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(162,127,243,0.40), rgba(162,127,243,0.10) 45%, rgba(255,255,255,0.03))",
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#a27ff3]" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[#f4f4f7]">Grammar rule:</span>
                </div>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#a7a8b5]">
                  {currentError.grammarExplanation}
                </p>
              </div>
            </div>

            {/* Footer Navigation: Previous on Left, Dots/Counter in Center, Next on Right */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => goNav(-1)}
                disabled={errors.length <= 1}
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Go to previous correction"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Previous</span>
              </button>

              {errors.length > 1 && (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-[#6f7180]">
                    {index + 1} of {errors.length}
                  </span>
                  <nav aria-label="Correction progress" className="flex items-center gap-1.5">
                    {errors.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to correction ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`transition-all cursor-pointer ${
                          i === index
                            ? "h-1.5 w-6 rounded-full bg-[#9d7cf0]"
                            : "h-1.5 w-1.5 rounded-full bg-white/[0.12] hover:bg-[#8a8a9e]"
                        }`}
                      />
                    ))}
                  </nav>
                </div>
              )}

              <button
                onClick={() => goNav(1)}
                disabled={errors.length <= 1}
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Go to next correction"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-8 rounded-2xl border border-[#18152e] bg-[#070611] shadow-2xl flex items-center justify-center gap-4 mt-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#16122e] border border-[#271f4f]">
              <CircleCheck className="h-6 w-6 text-[#6ce2a3]" strokeWidth={2.5} />
            </span>
            <p className="text-[14px] sm:text-[15px] font-normal text-white/90 tracking-wide max-w-xl text-center sm:text-left leading-relaxed">
              {submission.wordCount < 25
                ? "Clean syntax with no immediate grammar errors detected. To reach advanced B2/C1 fluency, expand your paragraphs with transition connectors, structured reasoning, and supporting context."
                : "Excellent! Your writing is native-level and comprehensive. No errors detected."}
            </p>
          </div>
        )}
      </div>
    </AppModal>
  );
};
