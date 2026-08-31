import React from "react";
import { X } from "lucide-react";

export interface SettingsAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsAboutModal: React.FC<SettingsAboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="about-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c0c14]/90 p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl flex flex-col animate-[scaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">About Lingua</span>
            <h2 id="about-modal-title" className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-white leading-none">CELAEST Lingua</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">Version 1.0.0 · Built for Spanish-speaking professionals.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 h-px bg-white/5" />
        <div className="flex flex-col gap-3 pt-5 text-sm leading-relaxed text-zinc-300">
          <p>CELAEST English helps you master business communication with an AI mentor, spaced-repetition memory and curated reading.</p>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs">
            <div className="flex justify-between"><span className="text-zinc-500">Version</span><span className="text-white">1.0.0</span></div>
            <div className="mt-2 flex justify-between"><span className="text-zinc-500">Build</span><span className="text-white">2026.05</span></div>
            <div className="mt-2 flex justify-between"><span className="text-zinc-500">Vault</span><span className="text-white">AES-GCM 256-bit</span></div>
          </div>
          <div className="flex gap-2 pt-2">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-zinc-400 underline decoration-white/20 hover:text-white">Terms</a>
            <span className="text-zinc-600">·</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-zinc-400 underline decoration-white/20 hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  );
};
