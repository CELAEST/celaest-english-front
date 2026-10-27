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
  /(asus utility|ai noise[- ]?cancell?ing|intelligo|stereo mix|mezcla est[eé]reo|what u hear|virtual audio|vb-audio|voicemeeter|soundflower|blackhole|loopback audio|steam streaming|oculus virtual)/i;

/** Minimum normalized speech-band energy (0..1) on AnalyserNode indicating real human voice */
export const DESKTOP_SPEECH_ENERGY_THRESHOLD = 0.045;

export function isVirtualLoopbackMicLabel(label: string): boolean {
  if (!label) return false;
  return VIRTUAL_LOOPBACK_MIC_REGEX.test(label);
}

/**
 * Acquires the optimal microphone MediaStream for the current platform:
 * - Mobile: Preserves lightweight mono raw constraints required by Android HAL / iOS Safari.
 * - Desktop: Enables hardware/WebRTC Auto Gain Control (AGC) for laptop bezel arrays and automatically
 *   switches away from silent virtual wrappers (such as ASUS AI Noise-cancelling Input) to the physical mic.
 */
export async function acquireOptimalMicStream(isMobile: boolean): Promise<MediaStream> {
  if (isMobile) {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
        channelCount: 1,
      },
    });
  }

  let stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const activeTrack = stream.getAudioTracks()[0];
  const activeLabel = activeTrack?.label || "";

  if (
    (activeTrack?.muted || isVirtualLoopbackMicLabel(activeLabel)) &&
    typeof navigator.mediaDevices.enumerateDevices === "function"
  ) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const physicalMic = devices.find(
        (d) =>
          d.kind === "audioinput" &&
          Boolean(d.deviceId) &&
          d.deviceId !== "default" &&
          d.deviceId !== "communications" &&
          Boolean(d.label) &&
          !isVirtualLoopbackMicLabel(d.label),
      );

      if (physicalMic) {
        const physicalStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: physicalMic.deviceId },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          // ignore track cleanup error
        }
        stream = physicalStream;
        logger.info(
          "[AudioHardwareSelector] Switched from virtual/muted input to physical microphone:",
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
