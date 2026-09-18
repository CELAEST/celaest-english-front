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
    title = "Write an email to a client",
    description = "Use a professional tone and explain a project update.",
    currentLevel,
    onSelectLevel,
  }) {
    return (
      <div className="relative w-full flex items-start justify-between gap-4 select-none pt-1 sm:pt-2 pb-3 sm:pb-4.5 shrink-0">
        {/* Typography & Level Selector */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Main Task Title — Distinct, crisp & balanced */}
          <div className="w-full flex items-start justify-between gap-3">
            <h1 className="text-[17px] sm:text-2xl lg:text-[28px] font-sans text-white font-medium sm:font-light tracking-tight leading-snug break-words [text-wrap:balance] flex-1">
              {title}
            </h1>

            {currentLevel && onSelectLevel && (
              <div className="shrink-0 pt-0.5 hidden sm:block">
                <LevelSelectorPill
                  currentLevel={currentLevel}
                  onSelectLevel={onSelectLevel}
                  align="right"
                />
              </div>
            )}
          </div>

          {/* Task Description — Clearly separated, readable & elegant */}
          <p className="mt-2 sm:mt-2.5 text-[12px] sm:text-[13px] text-white/55 font-light tracking-wide leading-relaxed line-clamp-2 [text-wrap:pretty] max-w-2xl">
            {description}
          </p>
        </div>

        {/* Video Orb — hidden on mobile for clean editorial breathing room, visible on desktop */}
        <div className="pointer-events-none hidden sm:flex sm:w-20 sm:h-20 md:w-28 md:h-28 items-center justify-center shrink-0 z-10 opacity-95 animate-[fadeIn_0.7s_ease-out_both] overflow-hidden self-center">
          <VideoOrb className="w-full h-full object-contain pointer-events-none" />
        </div>
      </div>
    );
  },
);

