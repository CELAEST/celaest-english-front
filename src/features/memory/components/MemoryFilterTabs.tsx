import React from "react";

export interface MemoryFilterTabsProps {
  activeTab?: number | undefined;
  speakingCount?: number | undefined;
  readingCount?: number | undefined;
  writingCount?: number | undefined;
  onTabChange?: ((index: number) => void) | undefined;
}

export const MemoryFilterTabs: React.FC<MemoryFilterTabsProps> = React.memo(
  ({ activeTab = 0, speakingCount = 0, readingCount = 0, writingCount = 0, onTabChange }) => {
    const tabs = [
      { id: "SPEAKING", label: "Speaking", count: speakingCount },
      { id: "READING", label: "Reading", count: readingCount },
      { id: "WRITING", label: "Writing", count: writingCount },
    ];

    return (
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none shrink-0">
        {tabs.map((t, i) => {
          const active = i === activeTab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange?.(i)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                active
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  active ? "bg-black/15 text-black font-bold" : "bg-white/10 text-white/60"
                }`}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);
