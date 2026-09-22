import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioCaptureService, mergePhrasesCleanly, isMobileDevice } from "../audioCaptureService";
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

  it("configures continuous=false on mobile devices to prevent WebKit speech aborts", () => {
    const originalUserAgent = navigator.userAgent;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
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

      const onTranscript = vi.fn();
      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript,
      });

      expect(capturedRecognizerInstance).not.toBeNull();
      // Uninterrupted continuous recognition on all devices
      expect(capturedRecognizerInstance.continuous).toBe(true);
      AudioCaptureService.stop();
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
      delete (window as any).SpeechRecognition;
    }
  });

  it("releases micStream tracks on mobile when SpeechRecognition is supported to guarantee exclusive hardware access", () => {
    const originalUserAgent = navigator.userAgent;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
        configurable: true,
      });

      const stopTrackMock = vi.fn();
      const mockStream = {
        active: true,
        getAudioTracks: () => [{ readyState: "live", stop: stopTrackMock }],
        getTracks: () => [{ readyState: "live", stop: stopTrackMock }],
      } as unknown as MediaStream;

      (AudioCaptureService as any).micStream = mockStream;

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
      }
      (window as any).SpeechRecognition = MockSpeechRecognition;

      AudioCaptureService.startRecognition({
        lang: "en-US",
        onTranscript: vi.fn(),
      });

      expect(stopTrackMock).toHaveBeenCalled();
      expect(AudioCaptureService.hasActiveMic()).toBe(false);
      AudioCaptureService.stop();
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
      delete (window as any).SpeechRecognition;
    }
  });

  it("detects whether device is mobile accurately", () => {
    const originalUserAgent = navigator.userAgent;
    try {
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);

      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        configurable: true,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        value: 0,
        configurable: true,
      });
      expect(isMobileDevice()).toBe(false);
    } finally {
      Object.defineProperty(navigator, "userAgent", {
        value: originalUserAgent,
        configurable: true,
      });
    }
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

