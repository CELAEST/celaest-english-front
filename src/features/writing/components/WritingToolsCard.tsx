import React from 'react';

export interface WritingToolsCardProps {
  onImprove?: () => void;
  onSimplify?: () => void;
  onShorten?: () => void;
  onExpand?: () => void;
}

export const WritingToolsCard: React.FC<WritingToolsCardProps> = React.memo(function WritingToolsCard({
  onImprove,
  onSimplify,
  onShorten,
  onExpand,
}) {
  const tools = [
    {
      id: 'improve',
      label: 'Improve',
      onClick: onImprove,
      icon: (
        <svg className="w-5 h-5 text-[#f8f8f8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.91 5.89H20l-4.85 3.53 1.85 5.88L12 14.77l-5 3.53 1.85-5.88L4 8.89h6.09z" />
        </svg>
      ),
    },
    {
      id: 'simplify',
      label: 'Simplify',
      onClick: onSimplify,
      icon: (
        <svg className="w-5 h-5 text-[#f8f8f8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 'shorten',
      label: 'Shorten',
      onClick: onShorten,
      icon: (
        <svg className="w-5 h-5 text-[#f8f8f8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <polyline points="9 15 15 9" />
        </svg>
      ),
    },
    {
      id: 'expand',
      label: 'Expand',
      onClick: onExpand,
      icon: (
        <svg className="w-5 h-5 text-[#f8f8f8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <polyline points="15 9 9 15" />
          <polyline points="9 9 15 15" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-3.5 shrink-0 animate-[slideInRight_0.45s_ease-out_0.3s_both]">
      {/* Title */}
      <span className="text-[#f8f8f8] font-medium text-sm sm:text-base tracking-wide">Writing tools</span>

      {/* 4 Tool Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={tool.onClick}
            disabled={!tool.onClick}
            aria-label={tool.label}
            className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-2xl group cursor-pointer disabled:cursor-default"
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#080914] border flex items-center justify-center text-[#f8f8f8] shadow-md transition-all duration-200 ${
              tool.onClick
                ? 'border-[#111220] group-hover:border-[#A27FF3] group-hover:bg-[#111220] group-hover:scale-110 active:scale-90'
                : 'border-[#111220] opacity-40'
            }`}>
              {tool.icon}
            </div>
            <span className={`text-[11px] font-light transition-colors ${
              tool.onClick ? 'text-[#8a8a9e] group-hover:text-[#f8f8f8]' : 'text-[#8a8a9e]/50'
            }`}>
              {tool.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
