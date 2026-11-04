import React from "react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";
import { LiveClassBeatId } from "../../../services/PathwayLectureEngine";
import { LiveBoardExamplesScene } from "./LiveBoardExamplesScene";
import { LiveBoardFormulaScene } from "./LiveBoardFormulaScene";
import { LiveBoardTrapCheckScene } from "./LiveBoardTrapCheckScene";
import { LiveBoardTrapScene } from "./LiveBoardTrapScene";

export interface MobileLiveRuleStageProps {
  lesson: PathwayLessonPayload;
  nodeOrderIndex: number;
  activeBeat: LiveClassBeatId;
  activeFormulaCaseIndex: number;
  activeExampleIndex: number;
  isDictating: boolean;
  isSpeakingEnglish: boolean;
  speakingSampleText: string | null;
  trapCheckPassed: boolean;
  subtitleSpanish?: string | undefined;
  onSelectBeat: (beat: LiveClassBeatId) => void;
  onSelectFormulaCase: (index: number) => void;
  onAnswerTrapCheck: (isCorrect: boolean) => void;
  onPlaySample: (text: string) => void;
}

export const MobileLiveRuleStage: React.FC<MobileLiveRuleStageProps> = ({
  lesson, nodeOrderIndex, activeBeat, activeFormulaCaseIndex, activeExampleIndex, isDictating,
  isSpeakingEnglish, speakingSampleText, trapCheckPassed, subtitleSpanish,
  onSelectBeat, onSelectFormulaCase, onAnswerTrapCheck, onPlaySample,
}) => {
  if (activeBeat === "ORIENTATION") {
    return (
      <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-orientation-scene">
        <div className="flex items-center gap-3 text-[11px] font-mono text-white/85 py-0.5">
          <span className="text-[#C4B2F7]">1 · Pizarra Viva</span>
          <span className="text-white/25">→</span>
          <span className="text-[#22D3EE]">2 · Retos en Vivo</span>
          <span className="text-white/25">→</span>
          <span className="text-[#4ade80]">3 · Tu Voz</span>
        </div>
        <div className="flex items-end justify-between gap-2">
          <p className="text-[11.5px] text-white/70 font-light leading-snug">
            {subtitleSpanish || "Todo lo que Liam explique cobrará vida aquí abajo con retos dinámicos."}
          </p>
          <button type="button" onClick={() => onSelectBeat("FORMULA")} className="shrink-0 text-[10.5px] font-mono text-[#A27FF3] hover:text-white cursor-pointer whitespace-nowrap">
            Ir a Fórmula →
          </button>
        </div>
      </div>
    );
  }

  if (activeBeat === "TRAP") {
    return <LiveBoardTrapScene lesson={lesson} subtitleSpanish={subtitleSpanish} onJumpToTrapCheck={() => onSelectBeat("TRAP_CHECK")} />;
  }

  if (activeBeat === "TRAP_CHECK") {
    return <LiveBoardTrapCheckScene lesson={lesson} nodeOrderIndex={nodeOrderIndex} passed={trapCheckPassed} onSelectOption={onAnswerTrapCheck} />;
  }

  if (activeBeat === "EXAMPLES") {
    return (
      <LiveBoardExamplesScene
        lesson={lesson} activeExampleIndex={activeExampleIndex}
        isSpeakingEnglish={isSpeakingEnglish} speakingSampleText={speakingSampleText}
        subtitleSpanish={subtitleSpanish} onPlaySample={onPlaySample}
      />
    );
  }

  return (
    <LiveBoardFormulaScene
      lesson={lesson} activeCaseIndex={activeFormulaCaseIndex}
      subtitleSpanish={subtitleSpanish} isDictating={isDictating}
      onSelectCase={onSelectFormulaCase} onPlaySample={onPlaySample}
    />
  );
};
