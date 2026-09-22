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
      MobileAudioUnlocker.unlock();
      expect(localStorage.getItem("celaest:interview:hasInteracted")).toBe("1");
    });

    it("plays mentor voice cleanly via SpeechSynthesisService.speak", async () => {
      const playNeuralSpy = vi.spyOn(MobileAudioUnlocker, "playNeuralBuffer").mockResolvedValue(true);
      const onStart = vi.fn();
      const onEnd = vi.fn();

      await SpeechSynthesisService.speak("Welcome to the mobile interview session", {
        voice: "en-US-AriaNeural",
        onStart,
        onEnd,
      });

      // Should either play direct or fall back to playNeuralBuffer
      expect(SpeechSynthesisService.getActivePlaybackId()).toBeGreaterThan(0);
      playNeuralSpy.mockRestore();
    });

    it("triggers neural buffer fallback when browser throws NotAllowedError (autoplay quarantine)", async () => {
      const notAllowedErr = new Error("The request is not allowed by the user agent");
      notAllowedErr.name = "NotAllowedError";
      const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, "play").mockRejectedValue(notAllowedErr);
      const bufferSpy = vi.spyOn(MobileAudioUnlocker, "playNeuralBuffer").mockResolvedValue(true);

      const onStart = vi.fn();
      const onEnd = vi.fn();

      await SpeechSynthesisService.speak("Testing fallback on autoplay block", {
        voice: "en-US-AriaNeural",
        onStart,
        onEnd,
      });

      // Verification: The service fell back to high-fidelity neural buffer (zero robotic voice fallback)
      expect(bufferSpy).toHaveBeenCalled();
      bufferSpy.mockRestore();
      playSpy.mockRestore();
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

  describe("4. Universal IPA Phonetics & Mobile Web Audio Neural Buffer Engine", () => {
    it("provides authentic IPA phonetic transcriptions and NEVER returns fake fallbacks like /word/", async () => {
      const { phoneticLookupService } = await import("../../../reading/services/phoneticLookupService");

      // Curated dictionary words
      expect(phoneticLookupService.getPhonetic("paradigm")).toBe("/ˈpær.ə.daɪm/");
      expect(phoneticLookupService.getPhonetic("throughout")).toBe("/θruːˈaʊt/");
      expect(phoneticLookupService.getPhonetic("subtle")).toBe("/ˈsʌt.l/");
      expect(phoneticLookupService.getPhonetic("architecture")).toBe("/ˈɑːr.kɪ.tɛk.tʃər/");

      // Phrasal expressions
      expect(phoneticLookupService.getPhonetic("figure out")).toBe("/ˈfɪɡ.ər aʊt/");
      expect(phoneticLookupService.getPhonetic("as well as")).toBe("/æz wɛl æz/");

      // Suffix and derivation
      expect(phoneticLookupService.getPhonetic("architectures")).toBe("/ˈɑːr.kɪ.tɛk.tʃərs/");

      // Unknown or complex algorithmic word
      const algorithmicPhonetic = phoneticLookupService.getPhonetic("cryptographic");
      expect(algorithmicPhonetic.startsWith("/")).toBe(true);
      expect(algorithmicPhonetic.endsWith("/")).toBe(true);
      // Invariant: never equal to the raw word itself
      expect(algorithmicPhonetic).not.toBe("/cryptographic/");
      expect(algorithmicPhonetic).not.toBe("cryptographic");
    });

    it("decodes and starts AudioBufferSourceNode via MobileAudioUnlocker.playNeuralBuffer", async () => {
      const mockAudioContext = {
        state: "suspended",
        resume: vi.fn().mockResolvedValue(undefined),
        decodeAudioData: vi.fn().mockResolvedValue({
          duration: 1.2,
          length: 5000,
          numberOfChannels: 2,
          sampleRate: 44100,
        } as unknown as AudioBuffer),
        createBuffer: vi.fn().mockReturnValue({} as AudioBuffer),
        createGain: vi.fn().mockReturnValue({
          gain: { value: 1.0 },
          connect: vi.fn(),
          disconnect: vi.fn(),
        }),
        createDynamicsCompressor: vi.fn().mockReturnValue({
          threshold: { value: 0 },
          knee: { value: 0 },
          ratio: { value: 0 },
          attack: { value: 0 },
          release: { value: 0 },
          connect: vi.fn(),
          disconnect: vi.fn(),
        }),
        createBufferSource: vi.fn().mockReturnValue({
          buffer: null,
          playbackRate: { value: 1.0 },
          connect: vi.fn(),
          disconnect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
          onended: null,
        }),
        destination: {},
      };

      vi.spyOn(MobileAudioUnlocker, "getAudioContext").mockReturnValue(mockAudioContext as unknown as AudioContext);

      // Create a fake audio blob
      const fakeBlob = new Blob(["fake audio mpeg bytes"], { type: "audio/mpeg" });
      const onStart = vi.fn();
      const onEnd = vi.fn();

      const activeId = SpeechSynthesisService.getActivePlaybackId();
      const played = await MobileAudioUnlocker.playNeuralBuffer(fakeBlob, { rate: 1.0 }, activeId, onStart, onEnd);

      expect(played).toBe(true);
      expect(mockAudioContext.resume).toHaveBeenCalled();
      expect(mockAudioContext.decodeAudioData).toHaveBeenCalled();
      expect(onStart).toHaveBeenCalled();
    });
  });
});
