import React from "react";
import { motion } from "framer-motion";

export interface MemoryFilterTabsProps {
  activeTab?: number | undefined;
  speakingCount?: number | undefined;
  readingCount?: number | undefined;
  writingCount?: number | undefined;
  onTabChange?: ((index: number) => void) | undefined;
}

const MicIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

const BookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const QuillIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

/**
 * CELAEST Cyber-Kinetic Laser Rail Filter Tabs
 * Guaranteed 3-tab layout: Speaking, Reading, Writing with dynamic counts.
 */
export const MemoryFilterTabs: React.FC<MemoryFilterTabsProps> = React.memo(
  ({ activeTab = 0, speakingCount = 0, readingCount = 0, writingCount = 0, onTabChange }) => {
    const tabs = [
      { id: "SPEAKING", label: "Speaking", count: speakingCount, Icon: MicIcon, color: "#A855F7" },
      { id: "READING", label: "Reading", count: readingCount, Icon: BookIcon, color: "#38BDF8" },
      { id: "WRITING", label: "Writing", count: writingCount, Icon: QuillIcon, color: "#10B981" },
    ];

    return (
      <div
        role="tablist"
        aria-label="Memory category filters"
        className="relative z-20 flex items-center gap-6 sm:gap-8 overflow-x-auto pb-1 no-scrollbar select-none shrink-0 py-1"
      >
        {tabs.map((tab, i) => {
          const active = i === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange?.(i)}
              className="group relative flex flex-col items-center py-2 px-1 cursor-pointer transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <tab.Icon
                  className={`w-4 h-4 transition-all duration-300 ${
                    active
                      ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                      : "text-white/40 group-hover:text-white/80"
                  }`}
                />
                <span
                  className={`text-[13px] sm:text-[14px] font-medium tracking-wide transition-colors ${
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

              {/* Kinetic Laser Line Underneath Active Tab with physical gliding spring */}
              {active && (
                <motion.div
                  layoutId="kineticTabUnderline"
                  className="absolute -bottom-1 inset-x-0 h-[2.5px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${tab.color} 50%, transparent 100%)`,
                    boxShadow: `0 0 14px ${tab.color}cc`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

