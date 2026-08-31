import React from "react";
import { X, Check } from "lucide-react";
import { GoalBusinessIcon, GoalCareerIcon, GoalConversationIcon, GoalTravelIcon, GoalAcademicIcon } from "./SettingsModalIcons";

export interface SettingsGoalsModalProps {
  isOpen: boolean;
  currentGoal?: string | undefined;
  onSelectGoal: (goal: string) => Promise<void> | void;
  onClose: () => void;
}

const GOALS = [
  { id: "Business Communication", title: "Business Communication", desc: "Meetings, emails, negotiations and executive presence.", Icon: GoalBusinessIcon },
  { id: "Career Growth & AI", title: "Career Growth & AI", desc: "Tech career, interviews and AI-era fluency.", Icon: GoalCareerIcon },
  { id: "Daily Conversation", title: "Daily Conversation", desc: "Natural, confident everyday English.", Icon: GoalConversationIcon },
  { id: "Travel & Culture", title: "Travel & Culture", desc: "Travel, small talk and cultural nuance.", Icon: GoalTravelIcon },
  { id: "Academic English", title: "Academic English", desc: "Study, research and academic writing.", Icon: GoalAcademicIcon },
];

export const SettingsGoalsModal: React.FC<SettingsGoalsModalProps> = ({ isOpen, currentGoal, onSelectGoal, onClose }) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="goals-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c0c14]/90 p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl flex flex-col animate-[scaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">Learning goal</span>
            <h2 id="goals-modal-title" className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-white leading-none">Select your goal</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">What do you want Lingua to optimise for?</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 h-px bg-white/5" />
        <div className="flex flex-col gap-2 pt-5 max-h-[60vh] overflow-y-auto pr-1 -mr-1">
          {GOALS.map((g) => {
            const isSelected = currentGoal === g.id;
            return (
              <button key={g.id} type="button" aria-pressed={isSelected} onClick={async () => { await onSelectGoal(g.id); onClose(); }} className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${isSelected ? "border-white/15 bg-white text-zinc-900 shadow-sm" : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"}`}>
                <g.Icon className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-colors ${isSelected ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                <span className="flex flex-col min-w-0 flex-1">
                  <span className={`text-[14px] font-medium tracking-[-0.01em] leading-none ${isSelected ? "text-zinc-900" : "text-white"}`}>{g.title}</span>
                  <span className={`mt-1 text-xs leading-relaxed line-clamp-2 ${isSelected ? "text-zinc-600" : "text-zinc-400"}`}>{g.desc}</span>
                </span>
                <span className={`grid h-7 w-7 place-items-center rounded-full border shrink-0 transition ${isSelected ? "bg-zinc-900 border-zinc-900 text-white" : "border-white/10 bg-transparent text-transparent group-hover:border-white/20"}`}>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
