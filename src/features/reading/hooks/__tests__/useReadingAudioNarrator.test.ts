import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useReadingAudioNarrator } from "../useReadingAudioNarrator";

describe("useReadingAudioNarrator", () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockPause = vi.fn();
  const mockResume = vi.fn();
  const mockGetVoices = vi.fn().mockReturnValue([]);

  beforeEach(() => {
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

  it("triggers speak when toggled", () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Elena resolved the bug"));

    act(() => {
      result.current.togglePlay();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
  });

  it("cancels speech and resets state on stop", () => {
    const { result } = renderHook(() => useReadingAudioNarrator("Elena resolved the bug"));

    act(() => {
      result.current.togglePlay();
      result.current.stop();
    });

    expect(mockCancel).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentWordIndex).toBe(null);
  });
});
