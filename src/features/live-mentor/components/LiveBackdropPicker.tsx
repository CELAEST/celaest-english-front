import React from "react";
import { LIVE_STAGE_BACKDROPS, LiveBackdropId } from "../data/liveStageBackdrops";

interface LiveBackdropPickerProps {
  selectedId: LiveBackdropId;
  onSelect: (id: LiveBackdropId) => void;
  isCallActive: boolean;
}

export const LiveBackdropPicker: React.FC<LiveBackdropPickerProps> = ({
  selectedId,
  onSelect,
  isCallActive,
}) => {
  return (
    <div
      role="group"
      aria-label="Selector de ambiente"
      className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-[#090910]/72 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-opacity duration-300 ${
        isCallActive ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {LIVE_STAGE_BACKDROPS.map((preset) => {
        const isActive = preset.id === selectedId;
        return (
          <button
            key={preset.id}
            type="button"
            title={preset.label}
            aria-label={preset.label}
            aria-pressed={isActive}
            onClick={() => onSelect(preset.id)}
            className={`w-4 h-4 rounded-full transition-transform duration-150 cursor-pointer ${
              isActive
                ? "scale-110 ring-2 ring-white/90 ring-offset-2 ring-offset-[#090910]"
                : "opacity-70 hover:opacity-100 hover:scale-105 border border-white/25"
            }`}
            style={{ background: preset.swatch }}
          />
        );
      })}
    </div>
  );
};
