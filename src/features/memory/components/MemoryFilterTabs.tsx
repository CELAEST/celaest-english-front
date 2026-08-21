import React from "react";

export interface MemoryFilterTabsProps {
  activeTab?: number | undefined;
  speakingCount?: number | undefined;
  readingCount?: number | undefined;
  writingCount?: number | undefined;
  onTabChange?: ((index: number) => void) | undefined;
}

export const MemoryFilterTabs: React.FC<MemoryFilterTabsProps> = ({
  activeTab = 0,
  speakingCount = 0,
  readingCount = 0,
  writingCount = 0,
  onTabChange,
}) => {
  const tabs = [
    { id: "SPEAKING", label: "Speaking", count: speakingCount },
    { id: "READING", label: "Reading", count: readingCount },
    { id: "WRITING", label: "Writing", count: writingCount },
  ];

  return (
    <div
      className="mt-2 sm:mt-3 flex items-center gap-x-7 sm:gap-x-8 gap-y-2 pb-0 select-none shrink-0 w-full animate-[fadeSlideUp_0.5s_ease-out_both]"
      style={{ animationDelay: "300ms" }}
    >
      {/* Category Tabs */}
      <div
        className="flex items-center gap-7 sm:gap-8"
        role="tablist"
        aria-label="Category domain filters"
      >
        {tabs.map((t, i) => {
          const active = i === activeTab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange?.(i)}
              className={`relative flex items-center gap-2.5 pb-2.5 text-[15px] font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                active ? "text-white" : "text-[#999a9b] hover:text-white/80"
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#231956] text-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.4)]"
                    : "bg-white/[0.06] text-[#999a9b]"
                }`}
              >
                {t.count}
              </span>
              {/* Animated underline */}
              <span
                className={`absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-[#A27FF3] transition-all duration-400 ease-out ${
                  active
                    ? "opacity-100 scale-x-100 shadow-[0_0_10px_rgba(162,127,243,0.8)]"
                    : "opacity-0 scale-x-0"
                }`}
                style={{ transformOrigin: "center" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
