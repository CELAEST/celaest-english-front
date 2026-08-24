import React from 'react';

export interface WritingTaskHeaderProps {
  category?: string;
  title?: string;
  description?: string;
  timeLimit?: string;
}

export const WritingTaskHeader: React.FC<WritingTaskHeaderProps> = React.memo(function WritingTaskHeader({
  category = 'WRITING TASK',
  title = 'Write an email to a client',
  description = 'Use a professional tone and explain a project update.',
  timeLimit = '18 min',
}) {
  return (
    <div className="w-full flex items-start justify-between select-none mb-3 sm:mb-4 pt-1 shrink-0">
      <div className="flex flex-col space-y-1">
        {/* Category Label in user's exact color code #7750a7 */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase animate-[fadeSlideUp_0.45s_ease-out_both]">
          {category}
        </span>

        {/* Main Task Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-sans text-[#f8f8f8] font-light tracking-wide animate-[fadeSlideUp_0.5s_ease-out_0.08s_both]">
          {title}
        </h1>

        {/* Task Description */}
        <p className="text-xs sm:text-sm text-[#8a8a9e] font-light tracking-wide pt-0.5 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both]">
          {description}
        </p>
      </div>

      {/* Time Limit Pill */}
      <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#05060c] border border-[#111220] text-xs text-[#8a8a9e] font-light shadow-md shrink-0 mt-1 animate-[fadeSlideUp_0.45s_ease-out_0.24s_both]">
        <svg className="w-4 h-4 text-[#8a8a9e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{timeLimit}</span>
      </div>
    </div>
  );
});
