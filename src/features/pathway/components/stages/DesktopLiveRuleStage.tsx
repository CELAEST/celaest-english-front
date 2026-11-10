import React from "react";
import { PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { KnowledgeTab } from "../knowledge/KnowledgeTabSelector";
import { LiveBoardState } from "../professor-board/LessonBoardBody";
import { LiveClassBeatBar } from "../professor-board/live-scenes/LiveClassBeatBar";
import { LiveBoardFormulaScene } from "../professor-board/live-scenes/LiveBoardFormulaScene";
import { LiveBoardTrapScene } from "../professor-board/live-scenes/LiveBoardTrapScene";
import { LiveBoardTrapCheckScene } from "../professor-board/live-scenes/LiveBoardTrapCheckScene";
import { LiveBoardExamplesScene } from "../professor-board/live-scenes/LiveBoardExamplesScene";
import { LiveBoardOrientationScene } from "../professor-board/live-scenes/LiveBoardOrientationScene";
import { DesktopLiveRuleFooter } from "./DesktopLiveRuleFooter";

export interface DesktopLiveRuleStageProps {
  title: string; focus: string; lesson: PathwayLessonPayload; nodeOrderIndex: number;
  liveBoard?: LiveBoardState | undefined; speakingText: string | null;
  onPlayAudio: (text: string) => void; onContinueToBuild: () => void;
  onOpenAnatomy?: (() => void) | undefined; onOpenKnowledge?: ((tab: KnowledgeTab) => void) | undefined;
}

export const DesktopLiveRuleStage: React.FC<DesktopLiveRuleStageProps> = ({
  title, focus, lesson, nodeOrderIndex, liveBoard, speakingText,
  onPlayAudio, onContinueToBuild, onOpenAnatomy, onOpenKnowledge,
}) => {
  const handleOpenGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));
  const activeBeat = liveBoard?.activeBeat ?? "FORMULA";

  return (
    <div className="flex flex-col justify-center gap-3 sm:gap-4 w-full max-w-2xl my-auto animate-[fadeIn_0.35s_ease-out_both] select-none" data-testid="desktop-live-rule-stage">
      <div className="space-y-0.5">
        <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">{focus}</span>
        <h1 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-light text-white tracking-[-0.03em] leading-tight">{title}</h1>
        <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed">{lesson.ruleTaglineSpanish}</p>
      </div>

      {liveBoard && (
        <LiveClassBeatBar
          activeBeat={liveBoard.activeBeat} trapCheckPassed={liveBoard.trapCheckPassed}
          isWaitingTrapCheck={liveBoard.isWaitingTrapCheck} onSelectBeat={liveBoard.onSelectBeat}
        />
      )}

      <div className="min-h-[170px] py-1 flex flex-col justify-center">
        {activeBeat === "TRAP" && (
          <LiveBoardTrapScene
            lesson={lesson} subtitleSpanish={liveBoard?.subtitleSpanish}
            isDictating={Boolean(liveBoard?.isDictating)} trapPhase={liveBoard?.trapPhase}
            onJumpToTrapCheck={() => liveBoard?.onSelectBeat("TRAP_CHECK")}
          />
        )}
        {activeBeat === "TRAP_CHECK" && (
          <LiveBoardTrapCheckScene
            lesson={lesson} nodeOrderIndex={nodeOrderIndex} passed={Boolean(liveBoard?.trapCheckPassed)}
            onSelectOption={(isCorrect) => liveBoard?.onAnswerTrapCheck(isCorrect)}
          />
        )}
        {activeBeat === "EXAMPLES" && (
          <LiveBoardExamplesScene
            lesson={lesson} activeExampleIndex={liveBoard ? liveBoard.activeExampleIndex : 0}
            isSpeakingEnglish={Boolean(liveBoard?.isSpeakingEnglish)} speakingSampleText={speakingText}
            subtitleSpanish={liveBoard?.subtitleSpanish} onPlaySample={onPlayAudio}
          />
        )}
        {activeBeat === "ORIENTATION" && (
          <LiveBoardOrientationScene
            subtitleSpanish={liveBoard?.subtitleSpanish}
            onContinueToFormula={() => liveBoard?.onSelectBeat("FORMULA")}
          />
        )}
        {activeBeat === "FORMULA" && (
          <LiveBoardFormulaScene
            lesson={lesson} activeCaseIndex={liveBoard ? liveBoard.activeFormulaCaseIndex : 0}
            revealedCountOverride={liveBoard?.formulaRevealCount} subtitleSpanish={liveBoard?.subtitleSpanish}
            isDictating={Boolean(liveBoard?.isDictating)} onSelectCase={(idx) => liveBoard?.onSelectFormulaCase(idx)}
            onPlaySample={onPlayAudio}
          />
        )}
      </div>

      <DesktopLiveRuleFooter onContinueToBuild={onContinueToBuild} onOpenGuide={handleOpenGuide} />
    </div>
  );
};
