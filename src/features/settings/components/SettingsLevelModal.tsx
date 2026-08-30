import React from "react";

export interface SettingsLevelModalProps {
  isOpen: boolean;
  currentLevel: string;
  onSelectLevel: (level: string) => Promise<void> | void;
  onClose: () => void;
}

const CEFR_LEVELS = [
  {
    code: "A2",
    title: "A2 — Elementary",
    desc: "Everyday expressions, basic questions, and routine workplace phrases.",
  },
  {
    code: "B1",
    title: "B1 — Intermediate",
    desc: "Clear communication on familiar matters, standard phrasal verbs, and daily flow.",
  },
  {
    code: "B2",
    title: "B2 — Upper Intermediate",
    desc: "Complex technical discussions, business idioms, and professional agility.",
  },
  {
    code: "C1",
    title: "C1 — Advanced",
    desc: "Nuanced expression, executive phrasal verbs, split idioms, and deep flow.",
  },
  {
    code: "C2",
    title: "C2 — Mastery",
    desc: "Effortless precision, idiomatic mastery, and spontaneous international leadership.",
  },
];

export const SettingsLevelModal: React.FC<SettingsLevelModalProps> = ({
  isOpen,
  currentLevel,
  onSelectLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-[#1d1f36] bg-[#070814]/95 p-6 shadow-2xl backdrop-blur-2xl flex flex-col space-y-4 animate-[scaleUp_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-0.5">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#A27FF3] uppercase">
              PROFICIENCY LEVEL
            </span>
            <h2 id="level-modal-title" className="text-xl font-light text-white tracking-tight">
              Select your CEFR Target
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Level List */}
        <div className="flex flex-col space-y-2 pt-2">
          {CEFR_LEVELS.map((lvl) => {
            const isSelected =
              currentLevel.toLowerCase().includes(lvl.code.toLowerCase()) ||
              currentLevel === lvl.title;

            return (
              <button
                key={lvl.code}
                type="button"
                onClick={async () => {
                  await onSelectLevel(lvl.title);
                  onClose();
                }}
                className={`w-full flex items-start space-x-3.5 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#A27FF3]/60 bg-[#A27FF3]/15 shadow-[0_0_20px_rgba(162,127,243,0.15)]"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-semibold ${
                    isSelected ? "bg-[#A27FF3] text-black" : "bg-white/10 text-white/70"
                  }`}
                >
                  {lvl.code}
                </div>
                <div className="flex flex-col space-y-0.5 min-w-0 flex-1">
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-white" : "text-white/80"
                    }`}
                  >
                    {lvl.title}
                  </span>
                  <p className="text-[11px] text-white/40 leading-relaxed font-light line-clamp-2">
                    {lvl.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
