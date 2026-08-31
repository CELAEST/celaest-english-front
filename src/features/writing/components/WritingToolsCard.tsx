import React from "react";

export interface WritingToolsCardProps {
  onImprove?: () => void;
  onSimplify?: () => void;
  onShorten?: () => void;
  onExpand?: () => void;
}

export const WritingToolsCard: React.FC<WritingToolsCardProps> = React.memo(
  function WritingToolsCard({ onImprove, onSimplify, onShorten, onExpand }) {
    const tools = [
      {
        id: "improve",
        label: "Improve",
        onClick: onImprove,
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.91 5.89H20l-4.85 3.53 1.85 5.88L12 14.77l-5 3.53 1.85-5.88L4 8.89h6.09z" />
          </svg>
        ),
      },
      {
        id: "simplify",
        label: "Simplify",
        onClick: onSimplify,
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: "shorten",
        label: "Shorten",
        onClick: onShorten,
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <polyline points="9 15 15 9" />
          </svg>
        ),
      },
      {
        id: "expand",
        label: "Expand",
        onClick: onExpand,
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <polyline points="15 9 9 15" />
            <polyline points="9 9 15 15" />
          </svg>
        ),
      },
    ];

    return (
      <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3.5 shrink-0 overflow-hidden animate-[slideInRight_0.45s_ease-out_0.3s_both]">
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Title */}
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 z-10">
          Writing Tools
        </span>

        {/* 4 Tool Action Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 z-10">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={tool.onClick}
              disabled={!tool.onClick}
              aria-label={tool.label}
              className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-2xl group cursor-pointer disabled:cursor-default"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/[0.02] border flex items-center justify-center transition-all duration-200 ${
                  tool.onClick
                    ? "border-white/[0.06] text-white/50 group-hover:border-white/20 group-hover:text-white group-hover:bg-white/[0.05] group-hover:scale-110 active:scale-90"
                    : "border-white/[0.04] text-white/20"
                }`}
              >
                {tool.icon}
              </div>
              <span
                className={`text-[10px] font-mono transition-colors ${
                  tool.onClick ? "text-white/30 group-hover:text-white" : "text-white/15"
                }`}
              >
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);
