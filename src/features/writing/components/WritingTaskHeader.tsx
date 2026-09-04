import React from "react";
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
      <div className="relative w-full flex items-center justify-between select-none mb-4 sm:mb-6 pt-1 shrink-0 overflow-visible min-h-[90px] sm:min-h-[110px]">
        {/* Left: Task Meta & Typography */}
        <div className="flex flex-col space-y-1.5 relative z-10 max-w-full sm:max-w-[70%]">
          {/* Top Row: Category Label & Level Selector Pill */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase animate-[fadeSlideUp_0.45s_ease-out_both]">
              {category}
            </span>
            {currentLevel && onSelectLevel && (
              <LevelSelectorPill
                currentLevel={currentLevel}
                onSelectLevel={onSelectLevel}
              />
            )}
          </div>

          {/* Main Task Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-sans text-[#f8f8f8] font-light tracking-wide animate-[fadeSlideUp_0.5s_ease-out_0.08s_both]">
            {title}
          </h1>

          {/* Task Description — Concise, crisp & never bloated */}
          <p className="text-xs sm:text-sm text-[#9595a8] font-light tracking-wide max-w-2xl leading-relaxed animate-[fadeSlideUp_0.5s_ease-out_0.16s_both]">
            {description}
          </p>
        </div>

        {/* Dynamic Cosmic Glowing Orb - 100% fully visible above the editor container */}
        <div className="pointer-events-none relative sm:absolute sm:right-2 sm:-top-3 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0 z-10 opacity-90 animate-[fadeIn_0.7s_ease-out_both]">
          <img
            src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      </div>
    );
  },
);

