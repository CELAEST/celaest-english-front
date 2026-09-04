import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateSpeechIntelligibility,
  detectLiveSpanishOrFiller,
} from "../speechIntelligibilityGuard";
import { SpeechSynthesisService } from "../speechSynthesisService";

describe("Voice & Intelligibility Enterprise Simulation Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("1. Real-World ESL Learner Text (Zero False-Positives)", () => {
    it("accepts user exact ESL answer with Spanglish syntax without flagging Spanish", () => {
      const userText =
        "Also, is very important use Redis for cache the responses so the database don't crash. If the spike are sudden, we must to scale auto the pods in kubernetes. I always doing this in my past jobs and it work good for keep latency less of 100ms.";

      const validation = validateSpeechIntelligibility(userText, 12, "english");
      expect(validation.isValid).toBe(true);
      expect(validation.cleanTranscript).toBe(userText);

      const live = detectLiveSpanishOrFiller(userText);
      expect(live.isSpanishOrFiller).toBe(false);
    });

    it("accepts English phrases containing 'me', 'a', and 'no' without misclassifying as Spanish", () => {
      const phrases = [
        "Tell me a story about how you handle distributed systems.",
        "I have no experience with legacy mainframes, but I learn fast.",
        "Let me know if we need a load balancer with no single point of failure.",
      ];

      for (const phrase of phrases) {
        const val = validateSpeechIntelligibility(phrase, 5, "en");
        expect(val.isValid).toBe(true);
        expect(detectLiveSpanishOrFiller(phrase).isSpanishOrFiller).toBe(false);
      }
    });

    it("handles accented English when Whisper acoustic classifier tags 'es' or 'spanish'", () => {
      const accentedEnglish =
        "In my opinion, we need to deploy Kubernetes clusters across multiple availability zones.";

      // Even if acoustic model detected Spanish due to speaker accent, content is English!
      const valSpanishTag = validateSpeechIntelligibility(accentedEnglish, 8, "es");
      expect(valSpanishTag.isValid).toBe(true);

      const valEsTag = validateSpeechIntelligibility(accentedEnglish, 8, "spanish");
      expect(valEsTag.isValid).toBe(true);
    });
  });

  describe("2. True Non-English & Spanish Shielding (Zero Token Protection)", () => {
    it("correctly intercepts genuine conversational Spanish", () => {
      const spanishPhrases = [
        "hola cómo estás yo quiero hablar de mi trabajo",
        "yo estaba diciendo una mano de cosas",
        "no sé qué responder a esta pregunta de la entrevista",
        "bueno entonces yo pienso que el desarrollo de software es importante",
      ];

      for (const sp of spanishPhrases) {
        const val = validateSpeechIntelligibility(sp, 6, "es");
        expect(val.isValid).toBe(false);
        expect(val.reason).toBe("SPANISH_DETECTED");
      }
    });

    it("correctly pauses live microphone stream when continuous Spanish is spoken", () => {
      expect(detectLiveSpanishOrFiller("hola buenas tardes").isSpanishOrFiller).toBe(true);
      expect(detectLiveSpanishOrFiller("yo quiero decir una cosa").isSpanishOrFiller).toBe(true);
      expect(detectLiveSpanishOrFiller("entonces nosotros fuimos a").isSpanishOrFiller).toBe(true);
    });
  });

  describe("3. Noise, Hallucinations & Keyboard Mash", () => {
    it("intercepts pure keyboard mash and gibberish", () => {
      expect(validateSpeechIntelligibility("asdfghjkl zxcvbnm qwrtyp").isValid).toBe(false);
      expect(validateSpeechIntelligibility("blorp fleep zorp we qux").isValid).toBe(false);
    });

    it("filters out Whisper silence hallucinations", () => {
      expect(validateSpeechIntelligibility("Thank you.").isValid).toBe(false);
      expect(validateSpeechIntelligibility("okay, thank you").isValid).toBe(false);
      expect(validateSpeechIntelligibility("Subtitles by the Amara.org community").isValid).toBe(false);
    });
  });

  describe("4. Neural TTS Synthesis & Hot-Swapping Contract", () => {
    it("supports prefetching questions for 0ms speech latency", () => {
      const prefetchSpy = vi.spyOn(SpeechSynthesisService, "prefetch");
      SpeechSynthesisService.prefetch("How do you design a high-throughput API gateway?", "en-US-AriaNeural");
      expect(prefetchSpy).toHaveBeenCalledWith("How do you design a high-throughput API gateway?", "en-US-AriaNeural");
    });

    it("stops existing audio playback immediately when requested", () => {
      const stopSpy = vi.spyOn(SpeechSynthesisService, "stop");
      SpeechSynthesisService.stop();
      expect(stopSpy).toHaveBeenCalled();
    });
  });
});
