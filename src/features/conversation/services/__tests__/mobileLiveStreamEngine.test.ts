import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MobileLiveStreamEngine } from "../mobileLiveStreamEngine";
import {
  AudioCaptureService,
  isMobileDevice,
  mergePhrasesCleanly,
} from "../audioCaptureService";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";

describe("MobileLiveStreamEngine & Mobile Platform Resilience", () => {
  const originalMediaRecorder = (globalThis as unknown as { MediaRecorder?: unknown }).MediaRecorder;
  const originalUserAgent = navigator.userAgent;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    (globalThis as unknown as { MediaRecorder?: unknown }).MediaRecorder = originalMediaRecorder;
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: originalMaxTouchPoints,
      configurable: true,
    });
    AudioCaptureService.cleanup();
  });

  it("streams continuous partial updates at ~1.15s and ~2.4s while speaking, commits on 420ms micro-pause, and makes 0 calls during 15s silence", async () => {
    vi.useFakeTimers();

    const recorderHolder: {
      current: {
        state: string;
        mimeType: string;
        ondataavailable: ((e: { data: Blob }) => void) | null;
        onstop: (() => void) | null;
        pushAudio: (bytes: number) => void;
      } | null;
    } = { current: null };

    class MockSegmentMediaRecorder {
      state = "inactive";
      mimeType = "audio/webm";
      ondataavailable: ((e: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      static isTypeSupported = () => true;

      start() {
        this.state = "recording";
        recorderHolder.current = this;
      }

      stop() {
        this.state = "inactive";
        if (this.onstop) this.onstop();
      }

      pushAudio(bytes: number) {
        if (this.state === "recording" && this.ondataavailable) {
          this.ondataavailable({
            data: new Blob([new Uint8Array(bytes)], { type: "audio/webm" }),
          });
        }
      }
    }

    (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = MockSegmentMediaRecorder;

    let currentEnergyByte = 0;
    const mockAnalyser = {
      frequencyBinCount: 64,
      getByteFrequencyData: (arr: Uint8Array) => {
        arr.fill(currentEnergyByte);
      },
    } as unknown as AnalyserNode;

    const transcribeResponses = [
      "I coordinate surgical",
      "I coordinate surgical schedules across three hospital",
      "I coordinate surgical schedules across three hospital wings.",
    ];
    let callIdx = 0;
    const uploadedSizes: number[] = [];
    const transcribeFn = vi.fn(async (blob: Blob) => {
      uploadedSizes.push(blob.size);
      const text = transcribeResponses[Math.min(callIdx, transcribeResponses.length - 1)] || "";
      callIdx += 1;
      return { text };
    });

    const onTranscript = vi.fn();
    const mockStream = {
      active: true,
      getAudioTracks: () => [{ readyState: "live", stop: vi.fn() }],
      getTracks: () => [{ readyState: "live", stop: vi.fn() }],
    } as unknown as MediaStream;

    const engine = new MobileLiveStreamEngine({
      micStream: mockStream,
      mimeType: "audio/webm",
      getAnalyser: () => mockAnalyser,
      mergePhrases: mergePhrasesCleanly,
      transcribeFn,
      onTranscript,
    });

    expect(engine.start()).toBe(true);

    // 1. User speaks continuously for 1.2s -> first live partial fires without waiting for any pause
    currentEnergyByte = 42; // voiced speech energy > 0.032
    for (let step = 0; step < 12; step++) {
      recorderHolder.current?.pushAudio(400);
      await vi.advanceTimersByTimeAsync(100);
    }

    expect(transcribeFn).toHaveBeenCalledTimes(1);
    expect(onTranscript).toHaveBeenLastCalledWith("I coordinate surgical", false);

    // 2. User continues speaking without pausing up to 2.5s -> second continuous partial updates fluidly
    for (let step = 0; step < 13; step++) {
      recorderHolder.current?.pushAudio(400);
      await vi.advanceTimersByTimeAsync(100);
    }

    expect(transcribeFn).toHaveBeenCalledTimes(2);
    expect(onTranscript).toHaveBeenLastCalledWith(
      "I coordinate surgical schedules across three hospital",
      false,
    );

    // 3. User takes a natural 480ms micro-pause -> commits utterance immediately & rotates segment recorder to 0 bytes
    recorderHolder.current?.pushAudio(400);
    currentEnergyByte = 0; // silence / breath
    await vi.advanceTimersByTimeAsync(480);

    expect(transcribeFn).toHaveBeenCalledTimes(3);
    expect(onTranscript).toHaveBeenLastCalledWith(
      "I coordinate surgical schedules across three hospital wings.",
      false,
    );

    // 4. User stays silent for 15 full seconds -> ZERO extra API calls!
    for (let s = 0; s < 30; s++) {
      recorderHolder.current?.pushAudio(120); // ambient silent container bytes
      await vi.advanceTimersByTimeAsync(500);
    }
    expect(transcribeFn).toHaveBeenCalledTimes(3);

    // 5. User presses ✓ Submit after pause -> pendingTailBlob is null (0ms extra transcription needed!)
    const stopRes = await engine.stopAndExtractTail();
    expect(stopRes.latestCombinedTranscript).toBe(
      "I coordinate surgical schedules across three hospital wings.",
    );
    expect(stopRes.pendingTailBlob).toBeNull();
  });

  it("extracts only the lightweight pendingTailBlob when user hits submit mid-utterance", async () => {
    vi.useFakeTimers();

    const tailHolder: {
      current: {
        state: string;
        mimeType: string;
        ondataavailable: ((e: { data: Blob }) => void) | null;
        onstop: (() => void) | null;
        pushAudio: (bytes: number) => void;
      } | null;
    } = { current: null };

    class MockSegmentMediaRecorder {
      state = "inactive";
      mimeType = "audio/webm";
      ondataavailable: ((e: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      static isTypeSupported = () => true;
      start() {
        this.state = "recording";
        tailHolder.current = this;
      }
      stop() {
        this.state = "inactive";
        if (this.onstop) this.onstop();
      }
      pushAudio(bytes: number) {
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob([new Uint8Array(bytes)], { type: "audio/webm" }) });
        }
      }
    }
    (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = MockSegmentMediaRecorder;

    const mockAnalyser = {
      frequencyBinCount: 64,
      getByteFrequencyData: (arr: Uint8Array) => arr.fill(45),
    } as unknown as AnalyserNode;

    const engine = new MobileLiveStreamEngine({
      micStream: { active: true } as unknown as MediaStream,
      mimeType: "audio/webm",
      initialTranscript: "First confirmed sentence.",
      getAnalyser: () => mockAnalyser,
      mergePhrases: mergePhrasesCleanly,
      transcribeFn: vi.fn().mockResolvedValue({ text: "Second phrase" }),
      onTranscript: vi.fn(),
    });

    engine.start();
    tailHolder.current?.pushAudio(1800);
    await vi.advanceTimersByTimeAsync(600); // stopped before 1.15s partial fired

    const result = await engine.stopAndExtractTail();
    expect(result.confirmedTranscript).toBe("First confirmed sentence.");
    expect(result.pendingTailBlob).not.toBeNull();
    expect(result.pendingTailBlob?.size).toBe(1800);
  });

  it("transcribes directly via Edge Gemini Flash when phone has a Gemini key and no Groq/OpenAI keys", async () => {
    vi.spyOn(providerKeyVault, "getKeys").mockImplementation(async (provider) => {
      if (provider === "gemini") return ["AIza_mock_mobile_gemini_key"];
      return [];
    });
    vi.spyOn(providerKeyVault, "getConfig").mockResolvedValue(null);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "I manage inventory logistics across regional warehouses." }],
            },
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const blob = new Blob([new Uint8Array(1500)], { type: "audio/mp4" });
    const res = await AudioCaptureService.transcribeAudio(blob);

    expect(res?.text).toBe("I manage inventory logistics across regional warehouses.");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(String(mockFetch.mock.calls[0]?.[0])).toContain("generativelanguage.googleapis.com");
  });

  it("automatically releases micStream and activates Exclusive Native SpeechRecognition on Mobile if all AI audio providers fail", async () => {
    vi.useFakeTimers();

    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/128.0.0.0 Mobile Safari/537.36",
      configurable: true,
    });

    const trackStopSpy = vi.fn();
    const mockStream = {
      active: true,
      getAudioTracks: () => [{ readyState: "live", enabled: true, stop: trackStopSpy }],
      getTracks: () => [{ readyState: "live", enabled: true, stop: trackStopSpy }],
    } as unknown as MediaStream;

    class MockMediaRecorder {
      state = "inactive";
      mimeType = "audio/webm";
      ondataavailable: ((e: { data: Blob }) => void) | null = null;
      onstop: (() => void) | null = null;
      static isTypeSupported = () => true;
      start() {
        this.state = "recording";
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob([new Uint8Array(2048)], { type: "audio/webm" }) });
        }
      }
      stop() {
        this.state = "inactive";
        if (this.onstop) this.onstop();
      }
    }
    (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = MockMediaRecorder;

    let nativeRecognizerStarted = false;
    const recognizerHolder: {
      current: {
        continuous: boolean;
        onresult: ((ev: unknown) => void) | null;
      } | null;
    } = { current: null };

    class MockSpeechRecognition {
      continuous = true;
      interimResults = true;
      lang = "en-US";
      onresult: ((ev: unknown) => void) | null = null;
      onerror = null;
      onend = null;
      start = vi.fn(() => {
        nativeRecognizerStarted = true;
        recognizerHolder.current = this;
      });
      stop = vi.fn();
      abort = vi.fn();
    }
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = MockSpeechRecognition;

    vi.spyOn(providerKeyVault, "getKeys").mockResolvedValue([]);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "all providers failed",
      }),
    );

    try {
      AudioCaptureService.setMicStream(mockStream);
      const onTranscript = vi.fn();
      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript,
      });

      // Initially SpeechRecognition is NOT started concurrently while MediaRecorder is active
      expect(nativeRecognizerStarted).toBe(false);

      // Advance past passive fallback step (1350ms) + 80ms HAL release delay
      await vi.advanceTimersByTimeAsync(1600);

      // Verify micStream was released FIRST and Exclusive Native SpeechRecognition took over cleanly
      expect(trackStopSpy).toHaveBeenCalled();
      expect(nativeRecognizerStarted).toBe(true);
      expect(recognizerHolder.current?.continuous).toBe(false);

      recognizerHolder.current?.onresult?.({
        resultIndex: 0,
        results: [{ isFinal: false, 0: { transcript: "Live fallback dictation on mobile" } }],
      });
      expect(onTranscript).toHaveBeenLastCalledWith("Live fallback dictation on mobile", false);
    } finally {
      delete (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    }
  });

  it("accurately distinguishes Android Desktop-mode & iPadOS from Windows touchscreen laptops", () => {
    // 1. Android Chrome in "Desktop site" mode (Linux x86_64 + 5 touch points) -> Mobile = true
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 5, configurable: true });
    expect(isMobileDevice()).toBe(true);

    // 2. Windows 11 touchscreen laptop (Windows NT 10.0 + 10 touch points) -> Mobile = false (Desktop PC!)
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", { value: 10, configurable: true });
    expect(isMobileDevice()).toBe(false);
  });
});
