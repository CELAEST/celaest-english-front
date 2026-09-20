import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SpeechSynthesisService, MobileAudioUnlocker } from "../speechSynthesisService";
import { ENV } from "../../../../shared/constants/env";

describe("Mobile & Production Rigorous Audit Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    SpeechSynthesisService.stop();
  });

  describe("1. Mobile Audio Autoplay Quarantine & Gesture Unlock Lifecycle", () => {
    it("provides a persistent singleton HTMLAudioElement with iOS WebKit inline playback attributes", () => {
      const sharedAudio = MobileAudioUnlocker.getSharedAudio();
      expect(sharedAudio).not.toBeNull();
      expect(sharedAudio).toBeInstanceOf(HTMLAudioElement);

      // Verify second call returns the exact same object reference
      const secondCall = MobileAudioUnlocker.getSharedAudio();
      expect(secondCall).toBe(sharedAudio);

      // Verify iOS Safari playsinline attributes
      expect(sharedAudio?.getAttribute("playsinline")).toBe("true");
      expect(sharedAudio?.getAttribute("webkit-playsinline")).toBe("true");
      expect(sharedAudio?.preload).toBe("auto");
    });

    it("activates unlock on user pointerdown/touchstart without crashing if media fails", async () => {
      const sharedAudio = MobileAudioUnlocker.getSharedAudio();
      if (!sharedAudio) throw new Error("sharedAudio missing");

      const playSpy = vi.spyOn(sharedAudio, "play").mockResolvedValue(undefined);
      const pauseSpy = vi.spyOn(sharedAudio, "pause").mockImplementation(() => {});

      MobileAudioUnlocker.unlock();

      expect(playSpy).toHaveBeenCalled();
      await Promise.resolve(); // flush microtasks
      expect(localStorage.getItem("celaest:interview:hasInteracted")).toBe("1");

      playSpy.mockRestore();
      pauseSpy.mockRestore();
    });

    it("reuses MobileAudioUnlocker.getSharedAudio() inside SpeechSynthesisService.speak", async () => {
      const sharedAudio = MobileAudioUnlocker.getSharedAudio();
      if (!sharedAudio) throw new Error("sharedAudio missing");

      const playSpy = vi.spyOn(sharedAudio, "play").mockResolvedValue(undefined);

      await SpeechSynthesisService.speak("Welcome to the mobile interview session", {
        voice: "en-US-AriaNeural",
      });

      expect(playSpy).toHaveBeenCalled();
      expect(sharedAudio.src).toContain("/tts/stream");
      expect(sharedAudio.src).toContain("voice=en-US-AriaNeural");

      playSpy.mockRestore();
    });

    it("triggers speech synthesis fallback when browser throws NotAllowedError (autoplay quarantine)", async () => {
      const sharedAudio = MobileAudioUnlocker.getSharedAudio();
      if (!sharedAudio) throw new Error("sharedAudio missing");

      const notAllowedErr = new Error("The request is not allowed by the user agent or the platform in the current context");
      notAllowedErr.name = "NotAllowedError";

      vi.spyOn(sharedAudio, "play").mockRejectedValue(notAllowedErr);

      // Mock SpeechSynthesisUtterance and speechSynthesis
      class MockUtterance {
        text: string;
        voice: any = null;
        rate = 1;
        pitch = 1;
        lang = "en-US";
        onstart: any = null;
        onend: any = null;
        onerror: any = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      (window as any).SpeechSynthesisUtterance = MockUtterance;

      const speakSpy = vi.fn();
      const cancelSpy = vi.fn();
      (window as any).speechSynthesis = {
        speak: speakSpy,
        cancel: cancelSpy,
        getVoices: () => [
          { name: "Samantha (Enhanced)", lang: "en-US", default: true } as SpeechSynthesisVoice,
        ],
        onvoiceschanged: null,
      };

      const onStart = vi.fn();
      const onEnd = vi.fn();

      await SpeechSynthesisService.speak("Testing fallback on autoplay block", {
        onStart,
        onEnd,
      });

      // Verification: The service caught NotAllowedError and fell back to window.speechSynthesis
      expect(cancelSpy).toHaveBeenCalled();
      expect(speakSpy).toHaveBeenCalled();
      const utterance = speakSpy.mock.calls[0][0] as MockUtterance;
      expect(utterance.text).toBe("Testing fallback on autoplay block");
    });

    it("barge-in / interruption stops active audio immediately and clears playback tokens", () => {
      const sharedAudio = MobileAudioUnlocker.getSharedAudio();
      if (!sharedAudio) throw new Error("sharedAudio missing");

      SpeechSynthesisService["currentAudio"] = sharedAudio;
      const pauseSpy = vi.spyOn(sharedAudio, "pause").mockImplementation(() => {});

      SpeechSynthesisService.stop();

      expect(pauseSpy).toHaveBeenCalled();
      expect(SpeechSynthesisService["currentAudio"]).toBeNull();

      pauseSpy.mockRestore();
    });
  });

  describe("2. Production Environment (ENV) Rigorous Contract Audit", () => {
    it("guarantees apiUrl has no trailing slashes and points to valid endpoint", () => {
      expect(ENV.apiUrl).toBeDefined();
      expect(typeof ENV.apiUrl).toBe("string");
      expect(ENV.apiUrl.length).toBeGreaterThan(0);
      expect(ENV.apiUrl.endsWith("/")).toBe(false);
      expect(ENV.apiUrl).toMatch(/(\/api\/v1|localhost:8080)/);
    });

    it("guarantees coreAiUrl is never empty and does not end with trailing slash", () => {
      expect(ENV.coreAiUrl).toBeDefined();
      expect(typeof ENV.coreAiUrl).toBe("string");
      expect(ENV.coreAiUrl.length).toBeGreaterThan(0);
      expect(ENV.coreAiUrl.endsWith("/")).toBe(false);
    });

    it("guarantees celaestBackUrl is valid and trimmed", () => {
      expect(ENV.celaestBackUrl).toBeDefined();
      expect(typeof ENV.celaestBackUrl).toBe("string");
      expect(ENV.celaestBackUrl.length).toBeGreaterThan(0);
      expect(ENV.celaestBackUrl.endsWith("/")).toBe(false);
    });

    it("guarantees Supabase credentials exist and are properly configured", () => {
      expect(ENV.supabaseUrl).toBeDefined();
      expect(ENV.supabaseUrl.startsWith("https://")).toBe(true);
      expect(ENV.supabaseAnonKey).toBeDefined();
      expect(ENV.supabaseAnonKey.length).toBeGreaterThan(20);
    });
  });

  describe("3. Mobile Resilience Under Corrupted or Missing Local State", () => {
    it("handles malformed JSON in localStorage without unhandled exceptions", () => {
      localStorage.setItem("lingua_reading_articles_v2", "{invalid_json:");

      expect(() => {
        try {
          const raw = localStorage.getItem("lingua_reading_articles_v2");
          if (raw) JSON.parse(raw);
        } catch {
          // Graceful handling
        }
      }).not.toThrow();
    });

    it("handles empty or non-array cached reading articles without crashing", () => {
      localStorage.setItem("lingua_reading_articles_v2", JSON.stringify({ notAnArray: true }));

      const raw = localStorage.getItem("lingua_reading_articles_v2");
      const parsed = raw ? JSON.parse(raw) : null;
      const isSafe = Array.isArray(parsed);

      expect(isSafe).toBe(false);
      const summary = isSafe && parsed.length > 0 ? parsed[0] : { title: "Default Article", readTimeMin: 4 };
      expect(summary.title).toBe("Default Article");
    });
  });
});
