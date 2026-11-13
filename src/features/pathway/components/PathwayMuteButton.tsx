import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { MobileAudioUnlocker, SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";

export interface PathwayMuteButtonProps {
  compact?: boolean | undefined;
}

/**
 * Obsidian glass micro-control inside Liam's 3D stage corner.
 * Mutes or unmutes speech in-place without interrupting live lesson cadence.
 */
export const PathwayMuteButton: React.FC<PathwayMuteButtonProps> = React.memo(({ compact = false }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => SpeechSynthesisService.isMuted());

  useEffect(() => {
    return SpeechSynthesisService.subscribeMuteState(setIsMuted);
  }, []);

  const iconSize = compact ? 13 : 14;

  const handleToggle = () => {
    MobileAudioUnlocker.unlock();
    SpeechSynthesisService.toggleMute();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isMuted}
      aria-label={isMuted ? "Activar voz de Liam" : "Silenciar voz de Liam"}
      title={isMuted ? "Voz silenciada (la clase sigue en curso)" : "Silenciar voz de Liam"}
      className={`group inline-flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-2xl transition-all duration-200 cursor-pointer shrink-0 active:scale-95 ${
        isMuted
          ? "bg-[#0D0B14]/85 border border-[#A27FF3]/35 hover:border-[#A27FF3]/60 text-[#C4B5FD] hover:text-white shadow-[0_12px_32px_rgba(0,0,0,0.9),0_0_18px_rgba(162,127,243,0.16),inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-black/55 border border-white/[0.09] hover:border-white/[0.22] hover:bg-white/[0.05] text-white/65 hover:text-white shadow-[0_12px_32px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,255,255,0.06)]"
      }`}
    >
      {isMuted ? (
        <VolumeX size={iconSize} strokeWidth={1.75} className="shrink-0 transition-transform duration-200" />
      ) : (
        <Volume2 size={iconSize} strokeWidth={1.75} className="shrink-0 group-hover:scale-105 transition-transform duration-200" />
      )}
    </button>
  );
});

