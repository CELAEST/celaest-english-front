import React, { useEffect } from "react";
import { X, Volume2, Mic, SlidersHorizontal } from "lucide-react";

export interface ConversationAudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  speechRate: number;
  onSetSpeechRate: (rate: number) => void;
  micVolume?: number;
}

export const ConversationAudioSettingsModal: React.FC<ConversationAudioSettingsModalProps> = ({
  isOpen,
  onClose,
  speechRate,
  onSetSpeechRate,
  micVolume = 0,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const speedOptions = [
    { label: "0.75x Slow", value: 0.75, desc: "Easy to follow, high clarity" },
    { label: "0.90x Relaxed", value: 0.9, desc: "Slightly relaxed, natural" },
    { label: "1.00x Normal", value: 1.0, desc: "Standard native speaking pace" },
    { label: "1.20x Fast", value: 1.2, desc: "Fast-paced interview challenge" },
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Audio & Mic Settings"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.25s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#070814] p-6 shadow-2xl space-y-5 animate-[scaleUp_0.3s_ease-out] relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Audio & Mic Settings</h3>
              <p className="text-xs text-neutral-400">Configure interviewer voice and microphone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl text-neutral-400 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: AI Speech Rate */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Voice Speed</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {speedOptions.map((opt) => {
              const isSelected = Math.abs(speechRate - opt.value) < 0.05;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSetSpeechRate(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-500/10"
                      : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className={`text-xs font-semibold block ${isSelected ? "text-violet-300" : "text-white"}`}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">{opt.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Live Mic Volume Indicator */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Microphone Input Level</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {micVolume > 5 ? "Receiving audio" : "Ready"}
            </span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/[0.05]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-violet-500 to-indigo-500 transition-all duration-100 rounded-full"
              style={{ width: `${Math.min(100, micVolume * 100)}%` }}
            />
          </div>
        </div>

        {/* Footer Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-lg cursor-pointer"
        >
          Save & Done
        </button>
      </div>
    </div>
  );
};
