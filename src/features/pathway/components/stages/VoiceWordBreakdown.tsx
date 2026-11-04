import React from "react";
import { PronunciationEvaluationResult } from "../../services/PathwayPronunciationEngine";

export interface VoiceWordBreakdownProps {
  result: PronunciationEvaluationResult;
}

export const VoiceWordBreakdown: React.FC<VoiceWordBreakdownProps> = ({ result }) => (
  <div className="w-full flex flex-col gap-1.5 py-1 select-none animate-[fadeIn_0.2s_ease-out]">
    <div className="flex items-center gap-2">
      <span
        className={`text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded-full border ${
          result.passed
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : "bg-rose-500/10 border-rose-500/30 text-rose-300"
        }`}
      >
        {result.passed ? `✓ ${result.overallScore}% Precisión` : `✗ ${result.overallScore}% Precisión`}
      </span>
      <span className="text-[11px] text-white/55 font-light truncate">
        {result.passed ? "Pronunciación legítima aprobada" : "Faltan palabras o precisión fonética"}
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-2 pt-0.5">
      {result.wordEvaluations.map((w, idx) => {
        let tone = "text-emerald-400 border-b border-emerald-400/50";
        if (w.status === "near_miss") tone = "text-amber-300 border-b border-amber-300/50";
        if (w.status === "mispronounced") tone = "text-rose-400 border-b-2 border-rose-400";
        if (w.status === "omitted") tone = "text-white/30 line-through border-b border-rose-500/40";
        return (
          <span key={`${w.token}-${idx}`} className={`text-sm sm:text-base font-medium px-0.5 ${tone}`} title={w.phoneticHint || w.token}>
            {w.token}
          </span>
        );
      })}
    </div>

    {!result.passed && result.feedbackSpanish && (
      <p className="text-xs text-rose-300/90 font-light pt-0.5 leading-relaxed">
        {result.feedbackSpanish}
      </p>
    )}
  </div>
);

