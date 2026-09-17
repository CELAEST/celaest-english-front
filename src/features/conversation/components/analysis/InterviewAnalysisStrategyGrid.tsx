import React from "react";
import { Lightbulb, Target, Volume2, Play, Pause } from "lucide-react";
import { ComprehensiveTurnFeedback } from "../../services/masterAiFeedbackEngine";
import {
  getDynamicInsight,
  getDynamicRecommendation,
  parseRecommendation,
  renderHighlightedTokens,
} from "./analysisHelpers";

export interface InterviewAnalysisStrategyGridProps {
  feedback: ComprehensiveTurnFeedback;
  isPlayingRecommendationAudio: boolean;
  onPlayRecommendationExample: (exampleText: string) => void;
}

export const InterviewAnalysisStrategyGrid: React.FC<InterviewAnalysisStrategyGridProps> = ({
  feedback,
  isPlayingRecommendationAudio,
  onPlayRecommendationExample,
}) => {
  const recText = getDynamicRecommendation(feedback);
  const parsed = parseRecommendation(recText);
  const hasStructuredContent = parsed.steps.length > 0 || Boolean(parsed.spokenExample);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Key Insights */}
      <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-center justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#A27FF3] shrink-0" />
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Key Insights</h3>
            </div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">ANÁLISIS</span>
          </div>

          <div className="flex items-start gap-3.5 pl-1 pr-2">
            <svg className="w-[18px] h-[15px] shrink-0 mt-1 text-[#674ee6]" viewBox="0 0 28 22" fill="currentColor">
              <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
            </svg>
            <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">
              "{getDynamicInsight(feedback)}"
            </p>
          </div>
        </div>
      </article>

      {/* Card 2: Strategy Recommendation */}
      <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#A27FF3] shrink-0" />
              <h3 className="text-[15px] font-semibold text-white tracking-tight">Strategy Recommendation</h3>
            </div>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">RECOMENDACIÓN</span>
          </div>

          {!hasStructuredContent ? (
            <div className="flex items-start gap-3.5 pl-1 pr-2">
              <svg className="w-[18px] h-[15px] shrink-0 mt-1 text-[#674ee6]" viewBox="0 0 28 22" fill="currentColor">
                <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
              </svg>
              <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">"{recText}"</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {parsed.intro && <p className="text-[13px] sm:text-[13.5px] text-white/70 leading-relaxed font-normal">{parsed.intro}</p>}
              {parsed.steps.length > 0 && (
                <div className="flex flex-col gap-2">
                  {parsed.steps.map((step) => (
                    <div key={step.num} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                      <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono font-medium text-white/80">
                        {String(step.num).padStart(2, "0")}
                      </span>
                      <div className="flex-1 text-[13px] sm:text-[13.5px] text-white/90 leading-relaxed font-normal pt-0.5">
                        {renderHighlightedTokens(step.text)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {parsed.spokenExample && (
                <div className="rounded-xl bg-white/[0.025] border border-white/[0.08] p-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-white/40" />
                      Ejemplo en voz alta
                    </span>
                    <button
                      type="button"
                      onClick={() => onPlayRecommendationExample(parsed.spokenExample)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-white/80 hover:text-white px-2 py-0.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all cursor-pointer"
                    >
                      {isPlayingRecommendationAudio ? (
                        <>
                          <Pause className="w-2.5 h-2.5 fill-current" />
                          <span>Detener</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          <span>Escuchar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[13px] sm:text-[13.5px] italic text-white/85 leading-relaxed">"{parsed.spokenExample}"</p>
                </div>
              )}
              {parsed.practiceTip && (
                <div className="flex items-center gap-2 pt-0.5 text-xs text-white/45 font-normal">
                  <Lightbulb className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span>{parsed.practiceTip}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
