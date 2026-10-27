import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  AudioCaptureService,
  mergePhrasesCleanly,
  isMobileDevice,
  shouldUseAiLiveTranscription,
  cleanVerbatimTranscription,
  isVirtualLoopbackMicLabel,
} from "../audioCaptureService";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";

describe("AudioCaptureService — Multi-Tier Whisper Transcription", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("successfully transcribes audio using direct Groq Whisper", async () => {
    vi.spyOn(providerKeyVault, "getKeys").mockImplementation(async (provider) => {
      if (provider === "groq") return ["gsk_test_key_abc"];
      return [];
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        text: "Hello. I am a surgeon. My job is very hard and I work many hours in the hospital.",
        language: "english",
        duration: 8.5,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const dummyBlob = new Blob([new Uint8Array(500)], { type: "audio/webm" });
    const result = await AudioCaptureService.transcribeAudio(dummyBlob, {
      roleName: "Surgeon",
      question: "Tell me about your job.",
    });

    expect(result).not.toBeNull();
    expect(result?.text).toBe("Hello. I am a surgeon. My job is very hard and I work many hours in the hospital.");
    expect(result?.language).toBe("english");
    expect(result?.duration).toBe(8.5);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer gsk_test_key_abc",
        },
      })
    );
  });

  it("falls back to backend proxy if direct Groq call fails", async () => {
    vi.spyOn(providerKeyVault, "getKeys").mockImplementation(async (provider) => {
      if (provider === "groq") return ["gsk_exhausted_key"];
      return [];
    });

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: async () => "Rate limit exceeded",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          text: "I go to the surgery room and I help people.",
          language: "en",
          duration: 4.2,
        }),
      });
    vi.stubGlobal("fetch", mockFetch);

    const dummyBlob = new Blob([new Uint8Array(500)], { type: "audio/webm" });
    const result = await AudioCaptureService.transcribeAudio(dummyBlob);

    expect(result).not.toBeNull();
    expect(result?.text).toBe("I go to the surgery room and I help people.");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("unwraps CELAEST backend API enveloped response correctly", async () => {
    vi.spyOn(providerKeyVault, "getKeys").mockImplementation(async () => []);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Audio transcribed successfully",
        data: {
          text: "I am going to talk about ensuring code quality and test coverage.",
          transcript: "I am going to talk about ensuring code quality and test coverage.",
          language: "en",
          duration: 5.2,
        },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const dummyBlob = new Blob([new Uint8Array(500)], { type: "audio/webm" });
    const result = await AudioCaptureService.transcribeAudio(dummyBlob, {
      roleName: "Software Engineer",
      question: "How do you ensure code quality?",
    });

    expect(result).not.toBeNull();
    expect(result?.text).toBe("I am going to talk about ensuring code quality and test coverage.");
    expect(result?.language).toBe("en");
    expect(result?.duration).toBe(5.2);
  });

  it("returns null safely if audio blob is too small", async () => {
    const tinyBlob = new Blob([new Uint8Array(10)], { type: "audio/webm" });
    const result = await AudioCaptureService.transcribeAudio(tinyBlob);
    expect(result).toBeNull();
  });

  it("configures continuous=true on desktop devices for uninterrupted dictation", () => {
    let capturedRecognizerInstance: any = null;
    class MockSpeechRecognition {
      continuous = false;
      interimResults = true;
      lang = "en-US";
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      onresult = null;
      onerror = null;
      onend = null;
      constructor() {
        capturedRecognizerInstance = this;
      }
    }

    (window as any).SpeechRecognition = MockSpeechRecognition;

    try {
      const onTranscript = vi.fn();
      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript,
      });

      expect(capturedRecognizerInstance).not.toBeNull();
      // On desktop devices, continuous is set to true for uninterrupted dictation
      expect(capturedRecognizerInstance.continuous).toBe(true);
      AudioCaptureService.stop();
    } finally {
      delete (window as any).SpeechRecognition;
    }
  });

  it("deduplicates Android cumulative result arrays in onresult to prevent 7-fold sentence repetition", () => {
    let capturedRecognizerInstance: any = null;
    class MockSpeechRecognition {
      continuous = false;
      interimResults = true;
      lang = "en-US";
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
      onresult: ((e: any) => void) | null = null;
      onerror = null;
      onend = null;
      constructor() {
        capturedRecognizerInstance = this;
      }
    }
    (window as any).SpeechRecognition = MockSpeechRecognition;

    try {
      const onTranscript = vi.fn();
      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript,
      });

      // Simulate Android Chrome cumulative results bug: 7 items each containing cumulative text
      capturedRecognizerInstance.onresult({
        resultIndex: 0,
        results: [
          { isFinal: true, 0: { transcript: "Hello" } },
          { isFinal: true, 0: { transcript: "Hello how" } },
          { isFinal: true, 0: { transcript: "Hello how are" } },
          { isFinal: true, 0: { transcript: "Hello how are you" } },
          { isFinal: true, 0: { transcript: "Hello how are you today" } },
          { isFinal: true, 0: { transcript: "Hello how are you today I" } },
          { isFinal: true, 0: { transcript: "Hello how are you today I am" } },
        ],
      });

      // Must NOT be repeated 7 times, but merged into the single clean sentence
      expect(onTranscript).toHaveBeenLastCalledWith("Hello how are you today I am", false);
      AudioCaptureService.stop();
    } finally {
      delete (window as any).SpeechRecognition;
    }
  });

  it("configures continuous=false on mobile to prevent Android Chrome SpeechRecognition abort crash", () => {
    const originalUserAgent = navigator.userAgent;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
        configurable: true,
      });

      let capturedRecognizerInstance: any = null;
      class MockSpeechRecognition {
        continuous = true;
        interimResults = true;
        lang = "en-US";
        start = vi.fn();
        stop = vi.fn();
        abort = vi.fn();
        onresult = null;
        onerror = null;
        onend = null;
        constructor() {
          capturedRecognizerInstance = this;
        }
      }
      (window as any).SpeechRecognition = MockSpeechRecognition;

      const mockStream = {
        active: true,
        getAudioTracks: () => [{ readyState: "live", stop: vi.fn() }],
        getTracks: () => [{ readyState: "live", stop: vi.fn() }],
      } as unknown as MediaStream;
      AudioCaptureService.setMicStream(mockStream);

      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript: vi.fn(),
      });

      // On mobile devices, continuous must be false so native Google Speech Services does not abort
      expect(capturedRecognizerInstance.continuous).toBe(false);
      expect(AudioCaptureService.hasActiveMic()).toBe(true);
      AudioCaptureService.stop();
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
      delete (window as any).SpeechRecognition;
    }
  });

  it("simulates full real-world multi-utterance mobile live transcription with onend auto-restart across pauses", () => {
    vi.useFakeTimers();
    const originalUserAgent = navigator.userAgent;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
        configurable: true,
      });

      let currentRecognizer: any = null;
      class MockSpeechRecognition {
        continuous = true;
        interimResults = true;
        lang = "en-US";
        start = vi.fn();
        stop = vi.fn();
        abort = vi.fn();
        onresult: ((e: any) => void) | null = null;
        onerror: ((e: any) => void) | null = null;
        onend: (() => void) | null = null;
        constructor() {
          currentRecognizer = this;
        }
      }
      (window as any).SpeechRecognition = MockSpeechRecognition;

      const transcripts: string[] = [];
      const onTranscript = vi.fn((t: string) => {
        transcripts.push(t);
      });

      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript,
      });

      // 1. First utterance on mobile
      expect(currentRecognizer).not.toBeNull();
      currentRecognizer.onresult({
        resultIndex: 0,
        results: [{ isFinal: false, 0: { transcript: "At my job I use" } }],
      });
      expect(onTranscript).toHaveBeenLastCalledWith("At my job I use", false);

      currentRecognizer.onresult({
        resultIndex: 0,
        results: [{ isFinal: true, 0: { transcript: "At my job I use many different tools" } }],
      });
      expect(onTranscript).toHaveBeenLastCalledWith("At my job I use many different tools", false);

      // 2. Natural pause: Android Chrome ends utterance 1 and triggers onend
      currentRecognizer.onend();

      // Fast-forward 180ms auto-restart timeout
      vi.advanceTimersByTime(200);

      // 3. New recognizer created for utterance 2
      expect(currentRecognizer).not.toBeNull();
      currentRecognizer.onresult({
        resultIndex: 0,
        results: [{ isFinal: false, 0: { transcript: "First of all I use Slack" } }],
      });
      expect(onTranscript).toHaveBeenLastCalledWith(
        "At my job I use many different tools First of all I use Slack",
        false
      );

      currentRecognizer.onresult({
        resultIndex: 0,
        results: [{ isFinal: true, 0: { transcript: "First of all I use Slack to communicate" } }],
      });
      expect(onTranscript).toHaveBeenLastCalledWith(
        "At my job I use many different tools First of all I use Slack to communicate",
        false
      );

      expect(AudioCaptureService.getLatestTranscript()).toBe(
        "At my job I use many different tools First of all I use Slack to communicate"
      );

      AudioCaptureService.stop();
    } finally {
      vi.useRealTimers();
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
      delete (window as any).SpeechRecognition;
    }
  });

  it("detects whether device is mobile accurately, excluding Windows touchscreen laptops", () => {
    const originalUserAgent = navigator.userAgent;
    const originalMaxTouchPoints = navigator.maxTouchPoints;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);

      // iPadOS 13+ desktop mode (Macintosh UA + multi-touch) -> Mobile (true)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 5,
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);

      // Windows 11 Touchscreen Laptop (Windows NT + maxTouchPoints = 10) -> Desktop PC (false)
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 10,
        configurable: true,
      });
      expect(isMobileDevice()).toBe(false);
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: originalMaxTouchPoints,
        configurable: true,
      });
    }
  });

  describe("Desktop vs. Mobile Live Transcript Isolation", () => {
    it("never fires interim Whisper /transcribe polling on Desktop PC when Web Speech API is supported", async () => {
      vi.useFakeTimers();
      const originalUserAgent = navigator.userAgent;
      const originalMaxTouchPoints = navigator.maxTouchPoints;
      const originalMediaRecorder = (globalThis as any).MediaRecorder;

      try {
        // Simulate Windows touchscreen PC with Chrome SpeechRecognition
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
          configurable: true,
        });
        Object.defineProperty(navigator, "maxTouchPoints", {
          value: 10,
          configurable: true,
        });

        let capturedRecognizer: any = null;
        class MockSpeechRecognition {
          continuous = false;
          interimResults = true;
          lang = "en-US";
          start = vi.fn();
          stop = vi.fn();
          abort = vi.fn();
          onresult: ((e: any) => void) | null = null;
          onerror = null;
          onend = null;
          constructor() {
            capturedRecognizer = this;
          }
        }
        (window as any).SpeechRecognition = MockSpeechRecognition;

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
        (globalThis as any).MediaRecorder = MockMediaRecorder;

        const mockStream = {
          active: true,
          getAudioTracks: () => [{ readyState: "live", stop: vi.fn() }],
          getTracks: () => [{ readyState: "live", stop: vi.fn() }],
        } as unknown as MediaStream;
        AudioCaptureService.setMicStream(mockStream);

        const transcribeSpy = vi.spyOn(AudioCaptureService, "transcribeAudio");
        const onTranscript = vi.fn();

        expect(shouldUseAiLiveTranscription(isMobileDevice(), true)).toBe(false);

        AudioCaptureService.startRecognition({
          lang: "en-US",
          onTranscript,
        });

        // Advance 10 full seconds of silence on PC — 0 Whisper /transcribe calls must occur!
        await vi.advanceTimersByTimeAsync(10000);
        expect(transcribeSpy).not.toHaveBeenCalled();

        // Browser native SpeechRecognition streams cleanly
        capturedRecognizer.onresult({
          resultIndex: 0,
          results: [{ isFinal: true, 0: { transcript: "Yes I use a computer every day" } }],
        });
        expect(onTranscript).toHaveBeenLastCalledWith("Yes I use a computer every day", false);

        // Advance another 5 seconds of pause on PC — still 0 Whisper /transcribe calls!
        await vi.advanceTimersByTimeAsync(5000);
        expect(transcribeSpy).not.toHaveBeenCalled();

        AudioCaptureService.stop();
      } finally {
        vi.useRealTimers();
        Object.defineProperty(navigator, "userAgent", {
          value: originalUserAgent,
          configurable: true,
        });
        Object.defineProperty(navigator, "maxTouchPoints", {
          value: originalMaxTouchPoints,
          configurable: true,
        });
        (globalThis as any).MediaRecorder = originalMediaRecorder;
        delete (window as any).SpeechRecognition;
      }
    });

    it("keeps AI rolling live transcription active every 2.5s on Mobile when Web Speech is blocked by HAL", async () => {
      vi.useFakeTimers();
      const originalUserAgent = navigator.userAgent;
      const originalMediaRecorder = (globalThis as any).MediaRecorder;

      try {
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/128.0.0.0 Mobile Safari/537.36",
          configurable: true,
        });

        class MockSpeechRecognition {
          continuous = false;
          interimResults = true;
          lang = "en-US";
          start = vi.fn();
          stop = vi.fn();
          abort = vi.fn();
          onresult = null;
          onerror = null;
          onend = null;
        }
        (window as any).SpeechRecognition = MockSpeechRecognition;

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
        (globalThis as any).MediaRecorder = MockMediaRecorder;

        const mockStream = {
          active: true,
          getAudioTracks: () => [{ readyState: "live", stop: vi.fn() }],
          getTracks: () => [{ readyState: "live", stop: vi.fn() }],
        } as unknown as MediaStream;
        AudioCaptureService.setMicStream(mockStream);

        const transcribeSpy = vi.spyOn(AudioCaptureService, "transcribeAudio").mockResolvedValue({
          text: "I use my laptop for daily clinical reports",
          language: "en",
        });
        const onTranscript = vi.fn();

        expect(shouldUseAiLiveTranscription(isMobileDevice(), true)).toBe(true);

        AudioCaptureService.startRecognition({
          lang: "en-US",
          onTranscript,
        });

        await vi.advanceTimersByTimeAsync(2600);

        expect(transcribeSpy).toHaveBeenCalledTimes(1);
        expect(onTranscript).toHaveBeenLastCalledWith("I use my laptop for daily clinical reports", false);

        AudioCaptureService.stop();
      } finally {
        vi.useRealTimers();
        Object.defineProperty(navigator, "userAgent", {
          value: originalUserAgent,
          configurable: true,
        });
        (globalThis as any).MediaRecorder = originalMediaRecorder;
        delete (window as any).SpeechRecognition;
      }
    });

    it("stops cascade immediately on 200 OK silence or hallucinated role prompt instead of hitting 5 fallback proxies", async () => {
      vi.spyOn(providerKeyVault, "getKeys").mockImplementation(async (provider) => {
        if (provider === "groq") return ["gsk_test_key_abc"];
        return [];
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          text: "Professional English interview response for Professional.",
          language: "en",
          duration: 2.5,
          no_speech_prob: 0.92,
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const silentBlob = new Blob([new Uint8Array(1000)], { type: "audio/webm" });
      const result = await AudioCaptureService.transcribeAudio(silentBlob, {
        roleName: "Professional",
      });

      expect(result).toBeNull();
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cleanVerbatimTranscription("Professional English interview response for Surgical Nurse.")).toBe("");
      expect(cleanVerbatimTranscription("My professional English improved at work.")).toBe(
        "My professional English improved at work."
      );
    });

    it("automatically switches Desktop microphone away from silent virtual wrappers (ASUS Utility) to physical Realtek mic", async () => {
      const originalUserAgent = navigator.userAgent;
      const originalMediaDevices = navigator.mediaDevices;

      try {
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
          configurable: true,
        });

        expect(isVirtualLoopbackMicLabel("Predeterminado - AI Noise-cancelling Input (ASUS Utility)")).toBe(true);
        expect(isVirtualLoopbackMicLabel("Varios micrófonos (Realtek(R) Audio)")).toBe(false);

        const virtualStopSpy = vi.fn();
        const virtualStream = {
          active: true,
          getAudioTracks: () => [
            {
              label: "Predeterminado - AI Noise-cancelling Input (ASUS Utility)",
              readyState: "live",
              muted: false,
              stop: virtualStopSpy,
            },
          ],
          getTracks: () => [{ stop: virtualStopSpy }],
        } as unknown as MediaStream;

        const physicalStream = {
          active: true,
          getAudioTracks: () => [
            {
              label: "Varios micrófonos (Realtek(R) Audio)",
              readyState: "live",
              muted: false,
              stop: vi.fn(),
            },
          ],
          getTracks: () => [{ stop: vi.fn() }],
        } as unknown as MediaStream;

        const getUserMediaMock = vi
          .fn()
          .mockResolvedValueOnce(virtualStream)
          .mockResolvedValueOnce(physicalStream);

        const enumerateDevicesMock = vi.fn().mockResolvedValue([
          {
            kind: "audioinput",
            deviceId: "default",
            label: "Predeterminado - AI Noise-cancelling Input (ASUS Utility)",
          },
          {
            kind: "audioinput",
            deviceId: "asus-virtual-id",
            label: "AI Noise-cancelling Input (ASUS Utility)",
          },
          {
            kind: "audioinput",
            deviceId: "realtek-physical-id",
            label: "Varios micrófonos (Realtek(R) Audio)",
          },
        ]);

        Object.defineProperty(navigator, "mediaDevices", {
          value: {
            getUserMedia: getUserMediaMock,
            enumerateDevices: enumerateDevicesMock,
          },
          configurable: true,
        });

        const initialized = await AudioCaptureService.initMicrophone();
        expect(initialized).toBe(true);
        expect(getUserMediaMock).toHaveBeenCalledTimes(2);
        expect(getUserMediaMock).toHaveBeenNthCalledWith(2, {
          audio: {
            deviceId: { exact: "realtek-physical-id" },
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        expect(virtualStopSpy).toHaveBeenCalledTimes(1);
        expect(AudioCaptureService.hasLiveMicStream()).toBe(true);

        AudioCaptureService.cleanup();
      } finally {
        Object.defineProperty(navigator, "userAgent", {
          value: originalUserAgent,
          configurable: true,
        });
        Object.defineProperty(navigator, "mediaDevices", {
          value: originalMediaDevices,
          configurable: true,
        });
      }
    });

    it("self-heals Desktop live transcript via acoustic VAD when Web Speech is deaf on virtual default mic, with 0 calls during silence", async () => {
      vi.useFakeTimers();
      const originalUserAgent = navigator.userAgent;
      const globalRecord = globalThis as unknown as Record<string, unknown>;
      const winRecord = window as unknown as Record<string, unknown>;
      const originalMediaRecorder = globalRecord.MediaRecorder;
      const originalAudioContext = winRecord.AudioContext;

      try {
        Object.defineProperty(navigator, "userAgent", {
          value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36",
          configurable: true,
        });

        let currentSpeechLevel = 0; // 0 = room silence, 120 = human speaking

        class MockAudioContext {
          state = "running";
          resume = vi.fn(() => Promise.resolve());
          close = vi.fn(() => Promise.resolve());
          createMediaStreamSource = vi.fn(() => ({ connect: vi.fn() }));
          createAnalyser = vi.fn(() => ({
            fftSize: 128,
            frequencyBinCount: 64,
            smoothingTimeConstant: 0.72,
            getByteFrequencyData: (arr: Uint8Array) => {
              arr.fill(currentSpeechLevel);
            },
          }));
        }
        winRecord.AudioContext = MockAudioContext;

        // Deaf SpeechRecognition (never emits onresult because OS default mic is stuck on ASUS Utility)
        class DeafSpeechRecognition {
          continuous = true;
          interimResults = true;
          lang = "en-US";
          start = vi.fn();
          stop = vi.fn();
          abort = vi.fn();
          onresult = null;
          onerror = null;
          onend = null;
        }
        winRecord.SpeechRecognition = DeafSpeechRecognition;

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
        globalRecord.MediaRecorder = MockMediaRecorder;

        const mockStream = {
          active: true,
          getAudioTracks: () => [{ label: "Varios micrófonos (Realtek(R) Audio)", readyState: "live", stop: vi.fn() }],
          getTracks: () => [{ readyState: "live", stop: vi.fn() }],
        } as unknown as MediaStream;
        AudioCaptureService.setMicStream(mockStream);

        const transcribeSpy = vi.spyOn(AudioCaptureService, "transcribeAudio").mockResolvedValue({
          text: "Yes I use my laptop every day to manage clinical schedules",
          language: "en",
        });
        const onTranscript = vi.fn();

        AudioCaptureService.startRecognition({
          lang: "en-US",
          onTranscript,
        });

        // 1. User stays silent for 6 seconds -> 0 /transcribe calls!
        currentSpeechLevel = 2; // ambient room floor
        await vi.advanceTimersByTimeAsync(6000);
        expect(transcribeSpy).not.toHaveBeenCalled();

        // 2. User speaks into physical Realtek mic (6.0s -> 8.0s):
        //    - Tick at 7.2s transcribes [0..7.2s]
        //    - Remaining spoken tail [7.2s..8.0s] flushes once at 9.0s after user stops speaking
        currentSpeechLevel = 120;
        await vi.advanceTimersByTimeAsync(2000);
        expect(transcribeSpy).toHaveBeenCalledTimes(1);
        expect(onTranscript).toHaveBeenLastCalledWith(
          "Yes I use my laptop every day to manage clinical schedules",
          false,
        );

        // 3. User stops speaking at 8.0s -> tail [7.2s..8.0s] flushes once at 9.0s, then 15s of silence makes 0 calls!
        currentSpeechLevel = 2;
        await vi.advanceTimersByTimeAsync(1500); // reaches 9.5s (flushes [7.2s..8.0s] tail once -> 2 total)
        expect(transcribeSpy).toHaveBeenCalledTimes(2);

        await vi.advanceTimersByTimeAsync(15000); // 15 full seconds of silence -> 0 extra calls!
        expect(transcribeSpy).toHaveBeenCalledTimes(2);

        AudioCaptureService.cleanup();
      } finally {
        vi.useRealTimers();
        Object.defineProperty(navigator, "userAgent", {
          value: originalUserAgent,
          configurable: true,
        });
        globalRecord.MediaRecorder = originalMediaRecorder;
        winRecord.AudioContext = originalAudioContext;
        delete winRecord.SpeechRecognition;
      }
    });
  });

  describe("mergePhrasesCleanly — Zero-Overlap Guarantee", () => {
    it("appends new phrase cleanly when there is no boundary overlap", () => {
      const result = mergePhrasesCleanly("Hello my name is Alex", "and I am an engineer");
      expect(result).toBe("Hello my name is Alex and I am an engineer");
    });

    it("eliminates 1-word boundary overlap when mobile speech engine repeats last word", () => {
      const result = mergePhrasesCleanly("I worked on many projects", "projects with distributed systems");
      expect(result).toBe("I worked on many projects with distributed systems");
    });

    it("eliminates multi-word boundary overlap seamlessly", () => {
      const result = mergePhrasesCleanly("We built a cloud platform", "cloud platform using Go");
      expect(result).toBe("We built a cloud platform using Go");
    });

    it("handles full-sentence expansion when new phrase begins with history as prefix", () => {
      const history = "I am a software engineer with ten years of experience";
      const expanded = "I am a software engineer with ten years of experience and specialized in distributed systems";
      const result = mergePhrasesCleanly(history, expanded);
      expect(result).toBe(expanded);
    });

    it("preserves history when history already contains the new phrase", () => {
      const history = "I am a software engineer with ten years of experience";
      const subPhrase = "ten years of experience";
      const result = mergePhrasesCleanly(history, subPhrase);
      expect(result).toBe(history);
    });

    it("handles punctuation and capitalization differences during overlap check", () => {
      const result = mergePhrasesCleanly("I led the frontend team.", "team and increased performance");
      expect(result).toBe("I led the frontend team. and increased performance");
    });

    it("handles empty or blank inputs gracefully", () => {
      expect(mergePhrasesCleanly("", "Hello world")).toBe("Hello world");
      expect(mergePhrasesCleanly("Hello world", "")).toBe("Hello world");
      expect(mergePhrasesCleanly("", "")).toBe("");
    });
  });
});

