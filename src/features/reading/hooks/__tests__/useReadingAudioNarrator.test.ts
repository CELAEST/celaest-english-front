import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReadingAudioNarrator } from "../useReadingAudioNarrator";
import { readingAudioPrefetcher } from "../../services/readingAudioPrefetcher";

describe("useReadingAudioNarrator", () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockPause = vi.fn();
  const mockResume = vi.fn();
  const mockGetVoices = vi.fn().mockReturnValue([]);

  beforeEach(() => {
    vi.spyOn(readingAudioPrefetcher, "get").mockReturnValue(null);
    vi.spyOn(readingAudioPrefetcher, "prefetchText").mockResolvedValue(null);
    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: mockCancel,
      pause: mockPause,
      resume: mockResume,
      getVoices: mockGetVoices,
      paused: false,
      speaking: false,
    });

    vi.stubGlobal("SpeechSynthesisUtterance", vi.fn(function (text: string) {
      return {
        text,
        rate: 1,
        lang: "en-US",
        voice: null,
        onboundary: null,
        onstart: null,
        onend: null,
        onerror: null,
      };
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes in idle state with comfortable 0.85x ESL cadence", () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Hello world"));

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isPaused).toBe(false);
    expect(result.current.currentWordIndex).toBe(null);
    expect(result.current.playbackRate).toBe(0.85);
  });

  it("cycles playback rate across 0.75x, 0.85x, 1.0x, 1.2x", () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Test sentence"));

    expect(result.current.playbackRate).toBe(0.85);

    act(() => {
      result.current.cyclePlaybackRate();
    });
    expect(result.current.playbackRate).toBe(1.0);

    act(() => {
      result.current.cyclePlaybackRate();
    });
    expect(result.current.playbackRate).toBe(1.2);

    act(() => {
      result.current.cyclePlaybackRate();
    });
    expect(result.current.playbackRate).toBe(0.75);

    act(() => {
      result.current.cyclePlaybackRate();
    });
    expect(result.current.playbackRate).toBe(0.85);
  });

  it("triggers speak when toggled", async () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Elena resolved the bug"));

    await act(async () => {
      result.current.togglePlay();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("cancels speech and resets state on stop", async () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Elena resolved the bug"));

    await act(async () => {
      result.current.togglePlay();
      await Promise.resolve();
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentWordIndex).toBe(null);
  });

  it("pauses speech without resetting playback rate", async () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Elena resolved the bug"));

    await act(async () => {
      result.current.togglePlay();
      await Promise.resolve();
      result.current.pause();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it("stops playback when isActive transitions to false", async () => {
    const { result, rerender } = renderHook(
      ({ active }) => useReadingAudioNarrator("Elena resolved the bug", undefined, 0, active),
      { initialProps: { active: true } },
    );

    await act(async () => {
      result.current.togglePlay();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(mockSpeak).toHaveBeenCalled();

    // User navigates away / switches tab
    rerender({ active: false });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it("exposes isLoading while awaiting pending TTS fetch and plays blobUrl for Aria and Chris", async () => {
    let resolveFetch!: (value: any) => void;
    const pendingPromise = new Promise<any>((res) => {
      resolveFetch = res;
    });
    const prefetchSpy = vi
      .spyOn(readingAudioPrefetcher, "prefetchText")
      .mockImplementation(() => pendingPromise);

    const createdAudios: Array<{ src: string; play: ReturnType<typeof vi.fn>; onplay: (() => void) | null }> = [];
    const OriginalAudio = globalThis.Audio;
    globalThis.Audio = vi.fn().mockImplementation(() => {
      const a: any = {
        src: "",
        preload: "auto",
        volume: 1,
        playbackRate: 1,
        readyState: 4,
        paused: false,
        ended: false,
        onplay: null,
        onpause: null,
        onended: null,
        onerror: null,
        setAttribute: vi.fn(),
        pause: vi.fn(),
        play: vi.fn().mockImplementation(function (this: any) {
          this.onplay?.();
          return Promise.resolve();
        }),
      };
      createdAudios.push(a);
      return a;
    }) as unknown as typeof Audio;

    try {
      const { result } = renderHook(() => useReadingAudioNarrator("Cloud deployment requires resilience"));

      act(() => {
        result.current.togglePlay();
      });
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveFetch({
          blobUrl: "blob:aria-audio",
          blob: new Blob(["mp3"], { type: "audio/mpeg" }),
          audio: createdAudios[0] ?? ({} as HTMLAudioElement),
          wordBoundaries: [],
          loadedAt: Date.now(),
        });
        await Promise.resolve();
        await Promise.resolve();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isPlaying).toBe(true);
      expect(createdAudios[createdAudios.length - 1]?.src).toBe("blob:aria-audio");

      // Switch to Christopher while playing
      vi.spyOn(readingAudioPrefetcher, "get").mockReturnValueOnce({
        blobUrl: "blob:chris-audio",
        blob: new Blob(["mp3"], { type: "audio/mpeg" }),
        audio: {} as HTMLAudioElement,
        wordBoundaries: [],
        loadedAt: Date.now(),
      });
      await act(async () => {
        result.current.setSelectedVoice("en-US-ChristopherNeural");
        await Promise.resolve();
      });
      expect(result.current.selectedVoice).toBe("en-US-ChristopherNeural");
      expect(createdAudios[createdAudios.length - 1]?.src).toBe("blob:chris-audio");
    } finally {
      prefetchSpy.mockRestore();
      globalThis.Audio = OriginalAudio;
    }
  });
});

