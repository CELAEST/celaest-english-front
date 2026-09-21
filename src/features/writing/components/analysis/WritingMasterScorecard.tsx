import React from "react";
import { Trophy, PenLine, BookOpenCheck } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";

export interface WritingMasterScorecardProps {
  overallScore: number;
  scoreClarity: number;
  scoreGrammar: number;
  getTierLabel: (score: number) => string;
}

export const WritingMasterScorecard: React.FC<WritingMasterScorecardProps> = ({
  overallScore,
  scoreClarity,
  scoreGrammar,
  getTierLabel,
}) => {
  return (
    <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center">
        {/* Left Column: Overall Score Hero (lg:col-span-5) */}
        <div className="lg:col-span-5 flex items-center gap-3.5 sm:gap-5 lg:pr-7 lg:border-r lg:border-white/[0.06]">
          <ScoreGauge
            value={overallScore}
            id="wrt_gauge_overall_hero"
            from="#7048E8"
            to="#A27FF3"
            glowColor="rgba(162, 127, 243, 0.45)"
            size={78}
            stroke={6}
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] text-[#A27FF3] shrink-0" />
              <h3 className="text-[15px] sm:text-[16.5px] font-semibold text-white tracking-tight leading-none">
                Overall Score
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-[12px] font-medium text-[#c4b5fd] leading-none">
              {getTierLabel(overallScore)}
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-[#8a8a9e] leading-relaxed">
              General performance across clarity, style and grammar.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Competency Progress Bars (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {/* Clarity & Style */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <PenLine className="h-4 w-4 text-[#c084fc] shrink-0" />
                <span className="font-medium text-white">Clarity &amp; Style</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#8a8a9e]">
                  {getTierLabel(scoreClarity)}
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round(scoreClarity)}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                style={{
                  width: `${Math.min(100, Math.max(0, scoreClarity))}%`,
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
                  {getTierLabel(scoreGrammar)}
                </span>
                <span className="font-semibold text-white tabular-nums">
                  {Math.round(scoreGrammar)}%
                </span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                style={{
                  width: `${Math.min(100, Math.max(0, scoreGrammar))}%`,
                  background: "linear-gradient(90deg, #059669, #34d399)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
