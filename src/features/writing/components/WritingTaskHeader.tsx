import React from "react";
import { VideoOrb } from "../../../design-system/components/Orb/VideoOrb";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";

export interface WritingTaskHeaderProps {
  category?: string;
  title?: string;
  description?: string;
  currentLevel?: string;
  onSelectLevel?: (level: CefrLevelCode) => void;
}

export const WritingTaskHeader: React.FC<WritingTaskHeaderProps> = React.memo(
  function WritingTaskHeader({
    category = "WRITING TASK",
    title = "Write an email to a client",
    description = "Use a professional tone and explain a project update.",
    currentLevel,
    onSelectLevel,
  }) {
    return (
      <div className="relative w-full flex items-start justify-between gap-4 select-none mb-3 sm:mb-4 pt-1 shrink-0 overflow-hidden min-h-[80px] sm:min-h-[96px]">
        {/* Left: Task Meta & Typography */}
        <div className="flex flex-col space-y-1 relative z-10 min-w-0 flex-1">
          {/* Top Row: Category Label & Level Selector Pill */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase animate-[fadeSlideUp_0.45s_ease-out_both] shrink-0">
              {category}
            </span>
            {currentLevel && onSelectLevel && (
              <LevelSelectorPill
                currentLevel={currentLevel}
                onSelectLevel={onSelectLevel}
              />
            )}
          </div>

          {/* Main Task Title — clamped to 2 lines, clean responsive sizing */}
          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-sans text-[#f8f8f8] font-light tracking-wide leading-snug animate-[fadeSlideUp_0.5s_ease-out_0.08s_both] break-words line-clamp-2 max-w-2xl">
            {title}
          </h1>

          {/* Task Description — Concise, crisp & responsive */}
          <p className="text-xs sm:text-[13px] text-[#9595a8] font-light tracking-wide max-w-xl leading-relaxed animate-[fadeSlideUp_0.5s_ease-out_0.16s_both] break-words line-clamp-2">
            {description}
          </p>
        </div>

        {/* Video Orb — neatly sized and positioned, zero layout blowout */}
        <div className="pointer-events-none w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0 z-10 opacity-90 animate-[fadeIn_0.7s_ease-out_both] overflow-hidden">
          <VideoOrb className="w-full h-full object-contain pointer-events-none" />
        </div>
      </div>
    );
  },
);

