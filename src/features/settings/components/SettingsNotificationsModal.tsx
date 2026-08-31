import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export type NotificationPref = "Smart" | "Mentions only" | "Muted";

export interface SettingsNotificationsModalProps {
  isOpen: boolean;
  currentPref?: string | undefined;
  onSave: (pref: NotificationPref) => Promise<void> | void;
  onClose: () => void;
}

const OPTIONS: Array<{ id: NotificationPref; title: string; desc: string }> = [
  { id: "Smart", title: "Smart", desc: "Relevant nudges, daily focus and streak reminders." },
  { id: "Mentions only", title: "Mentions only", desc: "Only direct mentions and critical updates." },
  { id: "Muted", title: "Muted", desc: "No push notifications. Check manually." },
];

export const SettingsNotificationsModal: React.FC<SettingsNotificationsModalProps> = ({ isOpen, currentPref, onSave, onClose }) => {
  const [selected, setSelected] = useState<NotificationPref>((currentPref as NotificationPref) ?? "Smart");
  useEffect(() => { if (isOpen) setSelected((currentPref as NotificationPref) ?? "Smart"); }, [isOpen, currentPref]);
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="notif-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c0c14]/90 p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl flex flex-col animate-[scaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">Notifications</span>
            <h2 id="notif-modal-title" className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-white leading-none">Notification preference</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">Stored locally; syncs when online.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 h-px bg-white/5" />
        <div className="flex flex-col gap-2 pt-5">
          {OPTIONS.map((o) => {
            const isSelected = selected === o.id;
            return (
              <button key={o.id} type="button" aria-pressed={isSelected} onClick={() => setSelected(o.id)} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${isSelected ? "border-white/15 bg-white text-zinc-900" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10 text-white"}`}>
                <span className="flex flex-col">
                  <span className={`text-sm font-medium ${isSelected ? "text-zinc-900" : "text-white"}`}>{o.title}</span>
                  <span className={`text-xs ${isSelected ? "text-zinc-600" : "text-zinc-400"}`}>{o.desc}</span>
                </span>
                <span className={`h-5 w-9 rounded-full p-0.5 flex items-center transition ${isSelected ? "bg-zinc-900 justify-end" : "bg-white/10 justify-start"}`}>
                  <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-5">
          <button type="button" onClick={onClose} className="h-10 rounded-full border border-white/10 px-5 text-sm font-medium text-zinc-300 hover:bg-white/[0.04]">Cancel</button>
          <button type="button" onClick={async () => { await onSave(selected); onClose(); }} className="h-10 rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-100">Save</button>
        </div>
      </div>
    </div>
  );
};
