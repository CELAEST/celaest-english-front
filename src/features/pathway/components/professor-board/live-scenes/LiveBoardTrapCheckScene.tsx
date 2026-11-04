import React, { useEffect, useMemo, useState } from "react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";

export interface LiveBoardTrapCheckSceneProps {
  lesson: PathwayLessonPayload;
  nodeOrderIndex: number;
  passed: boolean;
  onSelectOption: (isCorrect: boolean) => void;
}

export const LiveBoardTrapCheckScene: React.FC<LiveBoardTrapCheckSceneProps> = ({
  lesson, nodeOrderIndex, passed, onSelectOption,
}) => {
  const [wrongPicked, setWrongPicked] = useState(false);
  const { wrong, correct, whySpanish } = lesson.commonMistake;

  useEffect(() => {
    setWrongPicked(false);
  }, [wrong, correct]);

  const options = useMemo(() => {
    const firstCorrect = nodeOrderIndex % 2 === 1;
    return firstCorrect
      ? [
          { id: "correct", code: "A", text: correct, isCorrect: true },
          { id: "wrong", code: "B", text: wrong, isCorrect: false },
        ]
      : [
          { id: "wrong", code: "A", text: wrong, isCorrect: false },
          { id: "correct", code: "B", text: correct, isCorrect: true },
        ];
  }, [wrong, correct, nodeOrderIndex]);

  const handleTap = (isCorrect: boolean) => {
    if (passed) return;
    if (!isCorrect) setWrongPicked(true);
    onSelectOption(isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-trap-check-scene">
      <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[#22D3EE]">
        Reto rápido · ¿Cuál suena natural en inglés?
      </p>

      <div className="flex flex-col divide-y divide-white/[0.07] border-y border-white/[0.08]">
        {options.map((opt) => {
          const isRevealedCorrect = passed && opt.isCorrect;
          const isRevealedWrong = wrongPicked && !opt.isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleTap(opt.isCorrect)}
              className={`w-full py-2 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                isRevealedCorrect ? "text-[#4ade80]" : isRevealedWrong ? "text-[#fb7185]/80" : "text-white hover:text-[#DDD6FE]"
              }`}
            >
              <span className="flex items-baseline gap-2.5 min-w-0">
                <span className="text-[10px] font-mono text-white/40 shrink-0">{opt.code}.</span>
                <span className={`text-sm sm:text-[15px] truncate ${isRevealedWrong ? "line-through" : "font-normal"}`}>
                  “{opt.text}”
                </span>
              </span>
              <span className="text-[10px] font-mono shrink-0">
                {isRevealedCorrect ? "✓ ¡Exacto!" : isRevealedWrong ? "✗ Trampa" : "Elegir →"}
              </span>
            </button>
          );
        })}
      </div>

      {passed ? (
        <p className="text-[11.5px] font-mono text-[#4ade80]">✓ Radar activado. Seguimos con los ejemplos reales...</p>
      ) : wrongPicked ? (
        <p className="text-[11.5px] text-amber-300/90 font-light leading-relaxed">Ojo: {whySpanish}</p>
      ) : null}
    </div>
  );
};

