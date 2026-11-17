import React, { useEffect, useState, useCallback } from "react";
import { Mic, RefreshCw } from "lucide-react";
import {
  getPreferredMicDeviceId,
  isContinuityPhoneMicLabel,
  isVirtualLoopbackMicLabel,
  listAudioInputDevices,
  setPreferredMicDeviceId,
} from "../services/audioHardwareSelector";

export interface MicDeviceSelectorProps {
  selectedDeviceId?: string | null | undefined;
  onSelectDevice?: ((deviceId: string) => Promise<void> | void) | undefined;
  compact?: boolean | undefined;
}

/**
 * Reusable physical microphone selector allowing macOS / Windows users
 * to override OS virtual routers or Continuity iPhone defaults.
 */
export const MicDeviceSelector: React.FC<MicDeviceSelectorProps> = React.memo(({
  selectedDeviceId,
  onSelectDevice,
  compact = false,
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentId, setCurrentId] = useState<string>(
    () => selectedDeviceId ?? getPreferredMicDeviceId() ?? "",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDevices = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const list = await listAudioInputDevices();
      setDevices(list);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.addEventListener) return;
    const handleChange = () => {
      void loadDevices();
    };
    navigator.mediaDevices.addEventListener("devicechange", handleChange);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleChange);
    };
  }, [loadDevices]);

  if (devices.length === 0) return null;

  const handleChangeDevice = async (deviceId: string) => {
    setCurrentId(deviceId);
    setPreferredMicDeviceId(deviceId || null);
    if (onSelectDevice) {
      await onSelectDevice(deviceId);
    }
  };

  return (
    <div className={compact ? "space-y-1.5" : "p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2"}>
      <div className="flex items-center justify-between text-[11px]">
        <label htmlFor="celaest-mic-device-select" className="flex items-center gap-1.5 text-white/60 font-light">
          <Mic className="w-3.5 h-3.5 text-[#C4B5FD]" />
          <span>Micrófono de entrada:</span>
        </label>
        <button
          type="button"
          onClick={() => void loadDevices()}
          className="text-[10px] font-mono text-white/45 hover:text-white inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
          title="Actualizar lista de micrófonos"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>
      <select
        id="celaest-mic-device-select"
        value={currentId}
        onChange={(e) => void handleChangeDevice(e.target.value)}
        className="w-full rounded-xl bg-[#090914] border border-white/[0.1] px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#8B5CF6] cursor-pointer"
      >
        <option value="">Automático (Recomendado · Físico)</option>
        {devices.map((d, idx) => {
          const baseLabel = d.label?.trim() || `Micrófono ${idx + 1}`;
          const tag = isVirtualLoopbackMicLabel(baseLabel)
            ? " (Virtual)"
            : isContinuityPhoneMicLabel(baseLabel)
              ? " (iPhone / Continuity)"
              : "";
          return (
            <option key={d.deviceId || idx} value={d.deviceId}>
              {baseLabel}
              {tag}
            </option>
          );
        })}
      </select>
    </div>
  );
});
