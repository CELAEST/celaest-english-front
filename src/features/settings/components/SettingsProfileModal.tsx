import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface SettingsProfileModalProps {
  isOpen: boolean;
  currentName?: string | undefined;
  currentEmail?: string | undefined;
  onSave: (payload: { name: string; email?: string }) => Promise<void> | void;
  onClose: () => void;
}

export const SettingsProfileModal: React.FC<SettingsProfileModalProps> = ({ isOpen, currentName, currentEmail, onSave, onClose }) => {
  const [name, setName] = useState(currentName ?? "");
  const [email, setEmail] = useState(currentEmail ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName ?? "");
      setEmail(currentEmail ?? "");
      setError(null);
    }
  }, [isOpen, currentName, currentEmail]);

  if (!isOpen) return null;

  const canSave = name.trim().length >= 2;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c0c14]/90 p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl flex flex-col animate-[scaleUp_0.22s_cubic-bezier(0.16,1,0.3,1)_both]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-500">Profile</span>
            <h2 id="profile-modal-title" className="mt-1 text-[22px] font-medium tracking-[-0.02em] text-white leading-none">Edit profile</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">Your display name is shown across the app.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 h-px bg-white/5" />
        <div className="flex flex-col gap-4 pt-5">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-400">Display name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10 transition" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-400">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@celaest.com" autoComplete="email" inputMode="email" className="h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10 transition" />
          </label>
          {error ? <p className="text-xs text-red-400" role="alert">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-10 rounded-full border border-white/10 px-5 text-sm font-medium text-zinc-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition">Cancel</button>
            <button
              type="button"
              disabled={!canSave || saving}
              onClick={async () => {
                if (!canSave) {
                  setError("Name must be at least 2 characters.");
                  return;
                }
                setSaving(true);
                setError(null);
                try {
                  const payload: { name: string; email?: string } = { name: name.trim() };
                  const trimmedEmail = email.trim();
                  if (trimmedEmail) payload.email = trimmedEmail;
                  await onSave(payload);
                  onClose();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Could not save profile.");
                } finally {
                  setSaving(false);
                }
              }}
              className="h-10 rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
