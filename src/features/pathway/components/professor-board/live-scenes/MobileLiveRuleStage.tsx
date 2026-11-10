import React from "react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";
import { LiveClassBeatId } from "../../../services/PathwayLectureEngine";
import { LiveBoardExamplesScene } from "./LiveBoardExamplesScene";
import { LiveBoardFormulaScene } from "./LiveBoardFormulaScene";
import { LiveBoardTrapCheckScene } from "./LiveBoardTrapCheckScene";
import { LiveBoardTrapScene } from "./LiveBoardTrapScene";
import { LiveBoardOrientationScene } from "./LiveBoardOrientationScene";

export interface MobileLiveRuleStageProps {
  lesson: PathwayLessonPayload;
  nodeOrderIndex: number;
  activeBeat: LiveClassBeatId;
  activeFormulaCaseIndex: number;
  activeExampleIndex: number;
  formulaRevealCount?: number | undefined;
  trapPhase?: 0 | 1 | 2 | undefined;
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
  lesson, nodeOrderIndex, activeBeat, activeFormulaCaseIndex, activeExampleIndex,
  formulaRevealCount, trapPhase, isDictating,
  isSpeakingEnglish, speakingSampleText, trapCheckPassed, subtitleSpanish,
  onSelectBeat, onSelectFormulaCase, onAnswerTrapCheck, onPlaySample,
}) => {
  if (activeBeat === "ORIENTATION") {
    return (
      <LiveBoardOrientationScene
        subtitleSpanish={subtitleSpanish}
        onContinueToFormula={() => onSelectBeat("FORMULA")}
      />
    );
  }

  if (activeBeat === "TRAP") {
    return (
      <LiveBoardTrapScene
        lesson={lesson}
        subtitleSpanish={subtitleSpanish}
        isDictating={isDictating}
        trapPhase={trapPhase}
        onJumpToTrapCheck={() => onSelectBeat("TRAP_CHECK")}
      />
    );
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
      revealedCountOverride={formulaRevealCount}
      subtitleSpanish={subtitleSpanish} isDictating={isDictating}
      onSelectCase={onSelectFormulaCase} onPlaySample={onPlaySample}
    />
  );
};
