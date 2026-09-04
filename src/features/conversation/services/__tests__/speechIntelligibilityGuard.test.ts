import { describe, it, expect } from "vitest";
import {
  validateSpeechIntelligibility,
  detectLiveSpanishOrFiller,
} from "../speechIntelligibilityGuard";

describe("validateSpeechIntelligibility", () => {
  it("rejects null, undefined, or empty string", () => {
    expect(validateSpeechIntelligibility(null).isValid).toBe(false);
    expect(validateSpeechIntelligibility(undefined).isValid).toBe(false);
    expect(validateSpeechIntelligibility("").isValid).toBe(false);
    expect(validateSpeechIntelligibility("   \n\t  ").isValid).toBe(false);
  });

  it("rejects common Whisper silence hallucinations including 'okay, thank you'", () => {
    expect(validateSpeechIntelligibility("Thank you.").isValid).toBe(false);
    expect(validateSpeechIntelligibility("thank you").isValid).toBe(false);
    expect(validateSpeechIntelligibility("okay, thank you").isValid).toBe(false);
    expect(validateSpeechIntelligibility("okay thank you").isValid).toBe(false);
    expect(validateSpeechIntelligibility("ok thank you").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Thanks for watching.").isValid).toBe(false);
    expect(validateSpeechIntelligibility("You.").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Bye.").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Subtitles by the Amara.org community").isValid).toBe(false);
    expect(validateSpeechIntelligibility("[silence]").isValid).toBe(false);
    expect(validateSpeechIntelligibility(".").isValid).toBe(false);
  });

  it("rejects non-interview filler patterns like 'if you could help me please'", () => {
    expect(validateSpeechIntelligibility("if you could help me please").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Hey, I need to do that, please").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Let's go for all.").isValid).toBe(false);
  });

  it("rejects single word responses as insufficient", () => {
    expect(validateSpeechIntelligibility("Hello").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Yes").isValid).toBe(false);
    expect(validateSpeechIntelligibility("Okay").isValid).toBe(false);
  });

  it("rejects repetitive spam noise and babble", () => {
    expect(validateSpeechIntelligibility("aaaaaaaaaaaaaaaaa").isValid).toBe(false);
    expect(validateSpeechIntelligibility("..................").isValid).toBe(false);
    expect(validateSpeechIntelligibility("bla bla bla bla bla").isValid).toBe(false);
    expect(validateSpeechIntelligibility("test test test test").isValid).toBe(false);
  });

  it("shields against Spanish spoken text (0 token waste)", () => {
    const spanish1 = validateSpeechIntelligibility("hola cómo estás yo quiero hablar de mi trabajo");
    expect(spanish1.isValid).toBe(false);
    expect(spanish1.reason).toBe("SPANISH_DETECTED");

    const spanish2 = validateSpeechIntelligibility("yo estaba diciendo una mano de cosas bobas");
    expect(spanish2.isValid).toBe(false);
    expect(spanish2.reason).toBe("SPANISH_DETECTED");

    const spanish3 = validateSpeechIntelligibility("no sé qué decir en esta pregunta");
    expect(spanish3.isValid).toBe(false);
    expect(spanish3.reason).toBe("SPANISH_DETECTED");

    const spanish4 = validateSpeechIntelligibility("estoy hablando en español");
    expect(spanish4.isValid).toBe(false);
    expect(spanish4.reason).toBe("SPANISH_DETECTED");

    // Rejects when Whisper detects Spanish acoustic language on actual Spanish content
    const whisperSpanish = validateSpeechIntelligibility("si claro yo entiendo perfectamente", 3, "spanish");
    expect(whisperSpanish.isValid).toBe(false);
    expect(whisperSpanish.reason).toBe("SPANISH_DETECTED");

    const whisperEs = validateSpeechIntelligibility("amigo esto es una prueba", 3, "es");
    expect(whisperEs.isValid).toBe(false);
    expect(whisperEs.reason).toBe("SPANISH_DETECTED");
  });

  it("rejects gibberish and keyboard mash strings", () => {
    const res1 = validateSpeechIntelligibility("gfrqwegewgerge");
    expect(res1.isValid).toBe(false);

    const res2 = validateSpeechIntelligibility("gfrqwegewgerge asdfghjkl zxcvbnm");
    expect(res2.isValid).toBe(false);
    expect(res2.reason).toBe("NONSENSE_OR_GIBBERISH");
  });

  it("accepts genuine spoken English answers", () => {
    const res = validateSpeechIntelligibility(
      "I have four years of experience designing scalable microservices with Go and TypeScript.",
      4,
      "english"
    );
    expect(res.isValid).toBe(true);
    expect(res.cleanTranscript).toBe(
      "I have four years of experience designing scalable microservices with Go and TypeScript.",
    );

    const advancedC2 = validateSpeechIntelligibility(
      "In my previous role as tech lead, I architected a distributed event-driven microservices platform using Kafka and Go. We faced severe network partitions between multi-region clusters, so I implemented an idempotent outbox pattern and distributed saga orchestration to guarantee eventual consistency.",
      15,
      "english"
    );
    expect(advancedC2.isValid).toBe(true);

    const userEsl = validateSpeechIntelligibility(
      "Also, is very important use Redis for cache the responses so the database don't crash. If the spike are sudden, we must to scale auto the pods in kubernetes. I always doing this in my past jobs and it work good for keep latency less of 100ms.",
      10,
      "english"
    );
    expect(userEsl.isValid).toBe(true);

    const beginnerDentalWriting = validateSpeechIntelligibility(
      "Hello Smith, yesterday I take your tooth. You must no eat hot food and drink salt water fast. See you Tuesday 10 inside clinic."
    );
    expect(beginnerDentalWriting.isValid).toBe(true);
    expect(beginnerDentalWriting.reason).toBeUndefined();

    const beginnerCareFollowup = validateSpeechIntelligibility(
      "Dear patient, please rinse gently with warm salt water and take one pill if you feel pain. Call our dental clinic if bleeding."
    );
    expect(beginnerCareFollowup.isValid).toBe(true);
  });
});

describe("detectLiveSpanishOrFiller", () => {
  it("detects live Spanish words immediately", () => {
    expect(detectLiveSpanishOrFiller("hola").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("bueno entonces").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("yo quiero decir").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("estoy hablando español").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("necesito hacer esto").isSpanishOrFiller).toBe(true);
  });

  it("detects non-interview filler patterns live", () => {
    expect(detectLiveSpanishOrFiller("if you could help me please").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("Hey, I need to do that, please").isSpanishOrFiller).toBe(true);
    expect(detectLiveSpanishOrFiller("Let's go for all.").isSpanishOrFiller).toBe(true);
  });

  it("allows live English interview speech", () => {
    expect(detectLiveSpanishOrFiller("To handle sudden traffic spikes").isSpanishOrFiller).toBe(false);
    expect(detectLiveSpanishOrFiller("I would deploy an Envoy proxy").isSpanishOrFiller).toBe(false);
    expect(
      detectLiveSpanishOrFiller(
        "Also, is very important use Redis for cache the responses so the database don't crash. If the spike are sudden, we must to scale auto the pods in kubernetes. I always doing this in my past jobs and it work good for keep latency less of 100ms."
      ).isSpanishOrFiller
    ).toBe(false);
  });
});
