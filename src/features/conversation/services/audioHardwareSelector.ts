/**
 * Hardware Microphone Selection & Acoustic Voice Activity Detection (VAD) Utilities
 * Isolates physical microphone discovery (bypassing dead virtual OS audio wrappers on Desktop)
 * and pure Web Audio AnalyserNode speech-band energy measurement.
 */

import { logger } from "../../../shared/utils/logger";

/**
 * Matches virtual loopback or unrouted software audio wrappers that commonly hijack
 * the Windows/macOS OS Default Input Device while outputting 0.000 digital silence
 * (e.g., "AI Noise-cancelling Input (ASUS Utility)", "Stereo Mix", "VB-Audio").
 */
const VIRTUAL_LOOPBACK_MIC_REGEX =
  /(asus utility|ai noise[- ]?cancell?ing|intelligo|stereo mix|mezcla est[eé]reo|what u hear|virtual audio|vb-audio|voicemeeter|soundflower|blackhole|loopback audio|steam streaming|oculus virtual|zoomaudiodevice|teams audio|microsoft teams|krisp|obs virtual|mmhmm|camo|aggregate device|cadefaultdevice|ishowu|groundcontrol|background music|eqmac|rogue amoeba|existential audio)/i;

const CONTINUITY_PHONE_MIC_REGEX = /(\biphone\b|\bipad\b|continuity)/i;
const PREFERRED_MIC_STORAGE_KEY = "celaest:mic:preferredDeviceId";

/** Minimum normalized speech-band energy (0..1) on AnalyserNode indicating real human voice */
export const DESKTOP_SPEECH_ENERGY_THRESHOLD = 0.012;

export function isVirtualLoopbackMicLabel(label: string): boolean {
  if (!label) return false;
  return VIRTUAL_LOOPBACK_MIC_REGEX.test(label);
}

export function isContinuityPhoneMicLabel(label: string): boolean {
  if (!label) return false;
  return CONTINUITY_PHONE_MIC_REGEX.test(label);
}

export function getPreferredMicDeviceId(): string | null {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return null;
    return localStorage.getItem(PREFERRED_MIC_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setPreferredMicDeviceId(deviceId: string | null): void {
  try {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;
    if (deviceId && deviceId.trim()) {
      localStorage.setItem(PREFERRED_MIC_STORAGE_KEY, deviceId.trim());
    } else {
      localStorage.removeItem(PREFERRED_MIC_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export async function listAudioInputDevices(): Promise<MediaDeviceInfo[]> {
  if (typeof navigator === "undefined" || typeof navigator.mediaDevices?.enumerateDevices !== "function") {
    return [];
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "audioinput");
  } catch {
    return [];
  }
}

/**
 * Acquires the optimal microphone MediaStream for the current platform:
 * - Mobile: Preserves lightweight mono raw constraints required by Android HAL / iOS Safari.
 * - Desktop (Windows & macOS): Progressive constraint fallback (protects CoreAudio/USB interfaces from OverconstrainedError)
 *   and automatically switches away from silent virtual wrappers or sleeping Continuity iPhone mics to a physical Mac/PC mic.
 */
export async function acquireOptimalMicStream(
  isMobile: boolean,
  explicitDeviceId?: string | null,
): Promise<MediaStream> {
  if (isMobile) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
    } catch {
      return navigator.mediaDevices.getUserMedia({ audio: true });
    }
  }

  const targetDeviceId = explicitDeviceId ?? getPreferredMicDeviceId();
  let stream: MediaStream | null = null;

  if (targetDeviceId) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: targetDeviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return stream;
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: targetDeviceId } },
        });
        return stream;
      } catch {
        // Explicit/saved device disconnected or incompatible; fall back cleanly
      }
    }
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }

  const activeTrack = stream.getAudioTracks()[0];
  const activeLabel = activeTrack?.label || "";

  if (
    (activeTrack?.muted ||
      isVirtualLoopbackMicLabel(activeLabel) ||
      isContinuityPhoneMicLabel(activeLabel)) &&
    typeof navigator.mediaDevices.enumerateDevices === "function"
  ) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const candidateInputs = devices.filter(
        (d) =>
          d.kind === "audioinput" &&
          Boolean(d.deviceId) &&
          d.deviceId !== "default" &&
          d.deviceId !== "communications" &&
          Boolean(d.label) &&
          !isVirtualLoopbackMicLabel(d.label),
      );
      const physicalMic =
        candidateInputs.find((d) => !isContinuityPhoneMicLabel(d.label)) ?? candidateInputs[0];

      if (physicalMic && physicalMic.label !== activeLabel) {
        let physicalStream: MediaStream;
        try {
          physicalStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: { exact: physicalMic.deviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
        } catch {
          physicalStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: physicalMic.deviceId } },
          });
        }
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          // ignore track cleanup error
        }
        stream = physicalStream;
        logger.info(
          "[AudioHardwareSelector] Switched from virtual/muted/continuity input to physical microphone:",
          physicalMic.label,
        );
      }
    } catch (enumErr) {
      logger.warn("[AudioHardwareSelector] Device enumeration fallback notice:", enumErr);
    }
  }

  return stream;
}

/**
 * Measures real acoustic energy (0..1) across human speech fundamental & formant bins (~375Hz..7.5kHz).
 * Returns 0 when no hardware AnalyserNode is connected (never returns synthetic UI animation values).
 */
export function measureAnalyserVoiceEnergy(analyser: AnalyserNode | null): number {
  if (!analyser) return 0;
  const binCount = analyser.frequencyBinCount || 64;
  const dataArray = new Uint8Array(binCount);
  try {
    analyser.getByteFrequencyData(dataArray);
  } catch {
    return 0;
  }

  const startBin = binCount > 4 ? 1 : 0;
  const endBin = Math.min(binCount, 20);
  if (endBin <= startBin) return 0;

  let sum = 0;
  for (let i = startBin; i < endBin; i++) {
    sum += dataArray[i] ?? 0;
  }
  return Math.min(1, sum / (endBin - startBin) / 255);
}
