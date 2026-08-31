import React from "react";
import { X } from "lucide-react";
import { SettingsQuickActionsCard } from "./SettingsQuickActionsCard";

export interface SettingsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPrivacyModal: React.FC<SettingsPrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="privacy-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0c0c14]/90 p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl flex flex-col animate-[scaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)_both] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">Privacy & Data</span>
            <h2 id="privacy-modal-title" className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-white leading-none">Your data, your device</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">AES-GCM encrypted vault stored only on this device. Export or purge anytime.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 h-px bg-white/5" />
        <div className="pt-5">
          <SettingsQuickActionsCard />
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">Export creates an encrypted JSON backup. Purge removes all local vault entries (keys, preferences, streak) and cannot be undone.</p>
        </div>
      </div>
    </div>
  );
};
