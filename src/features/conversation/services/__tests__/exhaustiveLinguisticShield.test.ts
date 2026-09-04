import { describe, it, expect } from "vitest";
import {
  validateSpeechIntelligibility,
  detectLiveSpanishOrFiller,
} from "../speechIntelligibilityGuard";

describe("Exhaustive Linguistic & 0-Token Error Shield Test Suite", () => {
  describe("Category 1: Multi-word Gibberish with Spaces & Keyboard Mash", () => {
    it("rejects user exact multi-word gibberish with spaces (gergewg r we erg wer er we ewg wer weewr)", () => {
      const result = validateSpeechIntelligibility("gergewg r we erg wer er we ewg wer weewr");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NONSENSE_OR_GIBBERISH");
    });

    it("rejects continuous keyboard mash without natural English phonemes", () => {
      const result = validateSpeechIntelligibility("gfrqwegewgerge asdfghjkl qweqwe");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NONSENSE_OR_GIBBERISH");
    });

    it("rejects single severe keyboard mash word", () => {
      const result = validateSpeechIntelligibility("xzcvbnmqwerty");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NONSENSE_OR_GIBBERISH");
    });

    it("rejects multi-word strings where English ratio < 50%", () => {
      const result = validateSpeechIntelligibility("blorp fleep zorp we qux");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NONSENSE_OR_GIBBERISH");
    });
  });

  describe("Category 2: Spanish Phrases, Diacritics & Idioms", () => {
    it("rejects Spanish input with accents (hola cómo estás)", () => {
      const result = validateSpeechIntelligibility("hola cómo estás hoy");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SPANISH_DETECTED");
      expect(result.message).toContain("español");
    });

    it("rejects Spanish input without accents (necesito ayuda por favor)", () => {
      const result = validateSpeechIntelligibility("necesito ayuda por favor con este proyecto");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SPANISH_DETECTED");
    });

    it("rejects conversational Spanish slang (vamos por todo)", () => {
      const result = validateSpeechIntelligibility("vamos por todo en la entrevista");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SPANISH_DETECTED");
    });

    it("rejects colloquial Spanish sentences (yo estaba diciendo una mano de cosas)", () => {
      const result = validateSpeechIntelligibility("yo estaba diciendo una mano de cosas para probar");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SPANISH_DETECTED");
    });

    it("rejects Spanish detected in live stream via detectLiveSpanishOrFiller", () => {
      const live = detectLiveSpanishOrFiller("estoy hablando en español");
      expect(live.isSpanishOrFiller).toBe(true);
      expect(live.reason).toBe("SPANISH_DETECTED");
    });
  });

  describe("Category 3: Whisper AI Hallucinations & Ambient Noise", () => {
    it("rejects 'Thank you.' static hallucination", () => {
      const result = validateSpeechIntelligibility("Thank you.");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("WHISPER_HALLUCINATION");
    });

    it("rejects 'okay, thank you' static hallucination", () => {
      const result = validateSpeechIntelligibility("okay, thank you");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("WHISPER_HALLUCINATION");
    });

    it("rejects video subtitle crawlers from training data (Subtitles by...)", () => {
      const result = validateSpeechIntelligibility("Subtitles by the Amara.org community");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("WHISPER_HALLUCINATION");
    });

    it("rejects empty or whitespace-only inputs", () => {
      const result = validateSpeechIntelligibility("   \n\t  ");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SILENCE_OR_EMPTY");
    });

    it("rejects lone punctuation hallucination (.)", () => {
      const result = validateSpeechIntelligibility(".");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SILENCE_OR_EMPTY");
    });
  });

  describe("Category 4: Non-Interview Conversational Fillers & Help Requests", () => {
    it("rejects 'if you could help me please'", () => {
      const result = validateSpeechIntelligibility("if you could help me please");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NON_INTERVIEW_FILLER");
    });

    it("rejects 'hey, i need to do that, please'", () => {
      const result = validateSpeechIntelligibility("hey, i need to do that, please");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NON_INTERVIEW_FILLER");
    });

    it("rejects 'let's go for all'", () => {
      const result = validateSpeechIntelligibility("let's go for all");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("NON_INTERVIEW_FILLER");
    });

    it("detects filler in live speech stream", () => {
      const live = detectLiveSpanishOrFiller("can you help me please");
      expect(live.isSpanishOrFiller).toBe(true);
      expect(live.reason).toBe("NON_INTERVIEW_FILLER");
    });
  });

  describe("Category 5: Insufficient Words & Repetitive Noise", () => {
    it("rejects short answer with less than 3 words (two words)", () => {
      const result = validateSpeechIntelligibility("two words");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("INSUFFICIENT_WORDS");
    });

    it("rejects short 2-word answer (yes okay)", () => {
      const result = validateSpeechIntelligibility("yes okay");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("INSUFFICIENT_WORDS");
    });

    it("rejects repetitive vowel spam (aaaaaaaaaaaaaaaaaaaaa)", () => {
      const result = validateSpeechIntelligibility("aaaaaaaaaaaaaaaaaaaaa");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("REPETITIVE_NOISE");
    });
  });

  describe("Category 6: Mixed Spanglish & Code Switching", () => {
    it("rejects mixed Spanglish with high density of Spanish grammatical markers", () => {
      const result = validateSpeechIntelligibility("I want to hablar sobre mi proyecto de software");
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe("SPANISH_DETECTED");
    });
  });

  describe("Category 7: Valid Complex Technical English (Zero False Positives)", () => {
    it("accepts valid mid engineer architectural answer", () => {
      const answer =
        "In our microservices architecture, we implemented Redis caching and Envoy proxies to handle 10x traffic spikes with sub-50ms latency.";
      const result = validateSpeechIntelligibility(answer);
      expect(result.isValid).toBe(true);
      expect(result.cleanTranscript).toBe(answer);
    });

    it("accepts valid staff engineer leadership answer", () => {
      const answer =
        "I led a cross-functional team of twelve engineers to migrate our monolithic PostgreSQL database to an event-driven Kafka architecture.";
      const result = validateSpeechIntelligibility(answer);
      expect(result.isValid).toBe(true);
      expect(result.cleanTranscript).toBe(answer);
    });

    it("accepts valid product management answer", () => {
      const answer =
        "We prioritized user onboarding improvements based on quantitative cohort retention data and qualitative user interviews.";
      const result = validateSpeechIntelligibility(answer);
      expect(result.isValid).toBe(true);
      expect(result.cleanTranscript).toBe(answer);
    });

    it("accepts answer with common software abbreviations (API, CI/CD, AWS, DB)", () => {
      const answer =
        "We configured our CI/CD pipeline on AWS to automatically deploy Docker containers and run end-to-end integration tests.";
      const result = validateSpeechIntelligibility(answer);
      expect(result.isValid).toBe(true);
    });
  });
});
