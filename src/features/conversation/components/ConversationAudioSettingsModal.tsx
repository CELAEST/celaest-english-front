import React from "react";
import { Volume2, Mic, SlidersHorizontal } from "lucide-react";
import { AppModal } from "../../../design-system/components/Modal/AppModal";

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
  const speedOptions = [
    { label: "0.75x Slow", value: 0.75, desc: "Easy to follow, high clarity" },
    { label: "0.90x Relaxed", value: 0.9, desc: "Slightly relaxed, natural" },
    { label: "1.00x Normal", value: 1.0, desc: "Standard native speaking pace" },
    { label: "1.20x Fast", value: 1.2, desc: "Fast-paced interview challenge" },
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Audio & Mic Settings"
      subtitle="Configure interviewer voice and microphone"
      ariaLabel="Audio & Mic Settings"
      icon={<SlidersHorizontal className="w-5 h-5" />}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7048E8] to-[#A27FF3] text-white text-xs font-semibold transition-all shadow-lg shadow-[#7048E8]/30 hover:opacity-90 active:scale-[0.99] cursor-pointer"
        >
          Save &amp; Done
        </button>
      }
    >
      <div className="space-y-5">
        {/* Section 1: AI Speech Rate */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#999a9b]">
            <Volume2 className="w-3.5 h-3.5 text-[#A27FF3]" />
            <span>AI Voice Speed</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {speedOptions.map((opt) => {
              const isSelected = Math.abs(speechRate - opt.value) < 0.05;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSetSpeechRate(opt.value)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-violet-600/20 border-violet-500/70 text-white shadow-lg shadow-violet-500/10"
                      : "bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block ${
                      isSelected ? "text-violet-300" : "text-white"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Live Mic Volume Indicator */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-[#999a9b]">
              <Mic className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Microphone Input Level</span>
            </span>
            <span className="text-[10px] text-[#4ade80] font-mono">
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
      </div>
    </AppModal>
  );
};
