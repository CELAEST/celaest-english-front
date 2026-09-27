import React from "react";
import { Trophy, BookOpenCheck, AudioLines } from "lucide-react";
import { ComprehensiveTurnFeedback } from "../../services/masterAiFeedbackEngine";
import { ScoreGauge, getTierLabel } from "./analysisHelpers";

export interface InterviewAnalysisScorecardProps {
  feedback: ComprehensiveTurnFeedback;
}

const InterviewAnalysisScorecardInner: React.FC<InterviewAnalysisScorecardProps> = ({ feedback }) => {
  return (
    <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
        {/* Left Column: Overall Score Hero */}
        <div className="lg:col-span-5 flex items-center gap-4 sm:gap-5 lg:pr-7 lg:border-r lg:border-white/[0.06]">
          <ScoreGauge
            value={feedback.overallScore}
            id="gauge_overall_hero"
            from="#7048E8"
            to="#A27FF3"
            size={80}
            stroke={6}
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#A27FF3] shrink-0" />
              <h3 className="text-[15.5px] sm:text-[16.5px] font-semibold text-white tracking-tight leading-none">
                Puntaje Global
              </h3>
            </div>
            <p className="text-[11.5px] sm:text-[12px] font-medium text-[#c4b5fd] leading-none">
              {getTierLabel(feedback.overallScore)}
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-[#8a8a9e] leading-relaxed">
              Rendimiento general de fluidez, vocabulario y gramática.
            </p>
          </div>
        </div>

        {/* Right Column: 3 Detailed Competency Progress Bars */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-4">
          {/* Grammar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12.5px] sm:text-[13px]">
              <span className="flex items-center gap-2 font-medium text-[#d4d4e0]">
                <BookOpenCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#A27FF3]" />
                <span>Estructura Gramatical</span>
              </span>
              <span className="font-semibold text-white">
                {Math.round(feedback.grammarScore)}
                <span className="text-[#8a8a9e] font-normal text-[11px]"> / 100</span>
              </span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(162,127,243,0.4)]"
                style={{
                  width: `${Math.min(100, Math.max(0, feedback.grammarScore))}%`,
                  background: "linear-gradient(90deg, #7048E8, #A27FF3)",
                }}
              />
            </div>
          </div>

          {/* Vocabulary */}
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                style={{
                  width: `${Math.min(100, Math.max(0, feedback.vocabularyScore))}%`,
                  background: "linear-gradient(90deg, #8f71ee, #c084fc)",
                }}
              />
            </div>
          </div>

          {/* Clarity and Voice */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2">
                <AudioLines className="h-4 w-4 text-[#A27FF3] shrink-0" />
                <span className="font-medium text-white">Claridad y Voz</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#8a8a9e]">{getTierLabel(feedback.clarityScore)}</span>
                <span className="font-semibold text-white tabular-nums">{Math.round(feedback.clarityScore)}%</span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(162,127,243,0.4)]"
                style={{
                  width: `${Math.min(100, Math.max(0, feedback.clarityScore))}%`,
                  background: "linear-gradient(90deg, #7048E8, #A27FF3)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const InterviewAnalysisScorecard = React.memo(InterviewAnalysisScorecardInner);
