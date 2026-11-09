import React from "react";
import { PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { KnowledgeTab } from "../knowledge/KnowledgeTabSelector";
import { LiveBoardState } from "../professor-board/LessonBoardBody";
import { LiveClassBeatBar } from "../professor-board/live-scenes/LiveClassBeatBar";
import { LiveBoardFormulaScene } from "../professor-board/live-scenes/LiveBoardFormulaScene";
import { LiveBoardTrapScene } from "../professor-board/live-scenes/LiveBoardTrapScene";
import { LiveBoardTrapCheckScene } from "../professor-board/live-scenes/LiveBoardTrapCheckScene";
import { LiveBoardExamplesScene } from "../professor-board/live-scenes/LiveBoardExamplesScene";
import { DesktopLiveRuleFooter } from "./DesktopLiveRuleFooter";

export interface DesktopLiveRuleStageProps {
  title: string; focus: string; lesson: PathwayLessonPayload; nodeOrderIndex: number;
  liveBoard?: LiveBoardState | undefined; speakingText: string | null;
  onPlayAudio: (text: string) => void; onContinueToBuild: () => void;
  onOpenAnatomy?: () => void; onOpenKnowledge?: (tab: KnowledgeTab) => void;
}

export const DesktopLiveRuleStage: React.FC<DesktopLiveRuleStageProps> = ({
  title, focus, lesson, nodeOrderIndex, liveBoard, speakingText,
  onPlayAudio, onContinueToBuild, onOpenAnatomy, onOpenKnowledge,
}) => {
  const activeBeat = liveBoard?.activeBeat ?? "FORMULA";

  return (
    <div className="flex flex-col justify-center gap-3.5 w-full max-w-2xl my-auto animate-[fadeIn_0.35s_ease-out_both]" data-testid="desktop-live-rule-stage">
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#C4B2F7]/80">{focus}</span>
        <h1 className="text-2xl lg:text-[28px] font-light text-white tracking-[-0.03em] leading-tight">{title}</h1>
        <p className="text-[12.5px] text-[#94A3B8] font-light leading-relaxed">{lesson.ruleTaglineSpanish}</p>
      </div>

      <div className="rounded-2xl bg-black/45 backdrop-blur-xl border border-white/[0.08] p-4 sm:p-5 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-3">
        {liveBoard && (
          <LiveClassBeatBar
            activeBeat={liveBoard.activeBeat}
            trapCheckPassed={liveBoard.trapCheckPassed}
            isWaitingTrapCheck={liveBoard.isWaitingTrapCheck}
            onSelectBeat={liveBoard.onSelectBeat}
          />
        )}

        <div className="min-h-[140px] flex flex-col justify-center">
          {activeBeat === "TRAP" && (
            <LiveBoardTrapScene
              lesson={lesson} subtitleSpanish={liveBoard?.subtitleSpanish} isDictating={liveBoard?.isDictating}
              trapPhase={liveBoard?.trapPhase} onJumpToTrapCheck={() => liveBoard?.onSelectBeat("TRAP_CHECK")}
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
          {(activeBeat === "FORMULA" || activeBeat === "ORIENTATION") && (
            <LiveBoardFormulaScene
              lesson={lesson} activeCaseIndex={liveBoard ? liveBoard.activeFormulaCaseIndex : 0}
              revealedCountOverride={liveBoard?.formulaRevealCount} subtitleSpanish={liveBoard?.subtitleSpanish}
              isDictating={Boolean(liveBoard?.isDictating)} onSelectCase={(idx) => liveBoard?.onSelectFormulaCase(idx)}
              onPlaySample={onPlayAudio}
            />
          )}
        </div>
      </div>

      <DesktopLiveRuleFooter
        onContinueToBuild={onContinueToBuild}
        onOpenAnatomy={onOpenAnatomy}
        onOpenKnowledge={onOpenKnowledge}
      />
    </div>
  );
};
