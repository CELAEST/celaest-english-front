import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MobileAudioUnlocker, SpeechSynthesisService } from "../speechSynthesisService";

describe("SpeechSynthesisService — Single-Playback & Error Recovery Mutex", () => {
  const OriginalAudio = globalThis.Audio;

  beforeEach(() => {
    SpeechSynthesisService.stop();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    SpeechSynthesisService.stop();
    globalThis.Audio = OriginalAudio;
  });

  it("never triggers overlapping origin retry + WebAudio fallback when onerror and play() reject simultaneously", async () => {
    const audioInstances: Array<{
      src: string;
      playCalls: number;
      onerror: ((e: unknown) => void) | null;
      onended: (() => void) | null;
      onplay: (() => void) | null;
      onpause: (() => void) | null;
      pause: ReturnType<typeof vi.fn>;
      setAttribute: ReturnType<typeof vi.fn>;
    }> = [];

    globalThis.Audio = vi.fn().mockImplementation(() => {
      const mockEl: any = {
        src: "",
        muted: false,
        volume: 1,
        playbackRate: 1,
        preload: "auto",
        currentTime: 0,
        playCalls: 0,
        onerror: null,
        onended: null,
        onplay: null,
        onpause: null,
        setAttribute: vi.fn(),
        pause: vi.fn(),
        play: vi.fn().mockImplementation(() => {
          mockEl.playCalls++;
          if (mockEl.playCalls === 1) {
            // Simulate Chromium firing HTMLMediaElement.onerror AND rejecting audio.play() concurrently
            queueMicrotask(() => mockEl.onerror?.(new Event("error")));
            return Promise.reject(new DOMException("Failed to load", "NotSupportedError"));
          }
          // Origin recovery succeeds once without needing WebAudio buffer fallback
          return Promise.resolve();
        }),
      };
      audioInstances.push(mockEl);
      return mockEl;
    }) as unknown as typeof Audio;

    const bufferSpy = vi.spyOn(MobileAudioUnlocker, "playNeuralBuffer").mockResolvedValue(true);

    // Trigger both Audio.onerror AND rejected audio.play() concurrently on same playbackId
    await SpeechSynthesisService.speak("I work every day.", { voice: "liam" });
    await new Promise((r) => setTimeout(r, 20));

    // Only one single-flight recovery execution occurred: never duplicate WebAudio + origin playback
    expect(audioInstances).toHaveLength(1);
    expect(bufferSpy).toHaveBeenCalledTimes(1);
  });
});
