import React from "react";
import {
  StudioVoiceMicIcon,
  PrecisionOpenBookIcon,
  TechnicalWritingQuillIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export interface MemoryFilterTabsProps {
  activeTab?: number | undefined;
  speakingCount?: number | undefined;
  readingCount?: number | undefined;
  writingCount?: number | undefined;
  onTabChange?: ((index: number) => void) | undefined;
}

/**
 * CELAEST Cyber-Kinetic Laser Rail Filter Tabs
 * Standardized across Memory Bank & Feature Views.
 */
export const MemoryFilterTabs: React.FC<MemoryFilterTabsProps> = React.memo(
  ({ activeTab = 0, speakingCount = 0, readingCount = 0, writingCount = 0, onTabChange }) => {
    const tabs = [
      { id: "SPEAKING", label: "Speaking", count: speakingCount, Icon: StudioVoiceMicIcon, color: "#A855F7" },
      { id: "READING", label: "Reading", count: readingCount, Icon: PrecisionOpenBookIcon, color: "#38BDF8" },
      { id: "WRITING", label: "Writing", count: writingCount, Icon: TechnicalWritingQuillIcon, color: "#10B981" },
    ];

    return (
      <div className="flex items-center gap-6 overflow-x-auto pb-1 no-scrollbar select-none shrink-0 py-1">
        {tabs.map((tab, i) => {
          const active = i === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange?.(i)}
              className="group relative flex flex-col items-center py-2 px-1 cursor-pointer transition-all duration-300 whitespace-nowrap"
            >
              <div className="flex items-center gap-2.5">
                <tab.Icon
                  className={`w-4 h-4 transition-all duration-300 ${
                    active
                      ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                <span
                  className={`text-[13px] font-medium tracking-wide transition-colors ${
                    active ? "text-white font-semibold" : "text-white/50 group-hover:text-white/90"
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all ${
                    active
                      ? "bg-white/[0.12] text-white font-bold border border-white/[0.15]"
                      : "bg-white/[0.04] text-white/40 group-hover:text-white/70"
                  }`}
                >
                  {tab.count}
                </span>
              </div>

              {/* Kinetic Laser Line Underneath Active Tab */}
              {active ? (
                <div
                  className="absolute -bottom-1 inset-x-0 h-[2px] rounded-full animate-[pulse_2s_infinite]"
                  style={{
                    background: `linear-gradient(90deg, ${tab.color} 0%, rgba(162,127,243,0.4) 70%, transparent 100%)`,
                  }}
                />
              ) : (
                <div className="absolute -bottom-1 inset-x-0 h-[1px] bg-transparent group-hover:bg-white/10 transition-colors" />
              )}
            </button>
          );
        })}
      </div>
    );
  },
);
