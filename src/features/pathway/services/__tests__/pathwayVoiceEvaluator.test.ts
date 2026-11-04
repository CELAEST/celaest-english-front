import { describe, expect, it, vi, afterEach } from "vitest";
import { AudioCaptureService } from "../../../conversation/services/audioCaptureService";
import { buildA1Foundations } from "../../curriculum/a1Foundations";
import { stopAndEvaluatePathwayVoice } from "../pathwayVoiceEvaluator";

describe("pathwayVoiceEvaluator & A1 Sentence Continuity Gate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends recorded audioBlob to Whisper transcribeAudio, evaluates phonetics, and revokes audioUrl", async () => {
    const fakeBlob = new Blob([new Uint8Array(1024)], { type: "audio/webm" });
    const revokeMock = vi.fn();
    Object.defineProperty(URL, "revokeObjectURL", { writable: true, configurable: true, value: revokeMock });

    vi.spyOn(AudioCaptureService, "stopAndGetAudio").mockResolvedValue({
      audioBlob: fakeBlob,
      audioUrl: "blob:http://localhost/test-voice-1",
      durationSeconds: 2,
      hadVoicedSpeech: true,
    });

    const transcribeSpy = vi
      .spyOn(AudioCaptureService, "transcribeAudio")
      .mockResolvedValue({
        text: "I learn English today",
        language: "en",
        duration: 1.9,
        avgLogprob: -0.18,
        noSpeechProb: 0.02,
      });

    const out = await stopAndEvaluatePathwayVoice({
      targetSentence: "I learn English today.",
      liveTranscriptSnapshot: "",
      profession: "Pediatrician",
    });

    expect(transcribeSpy).toHaveBeenCalledWith(fakeBlob, {
      roleName: "Pediatrician",
      question: "I learn English today.",
    });
    expect(revokeMock).toHaveBeenCalledWith("blob:http://localhost/test-voice-1");
    expect(out.transcript).toBe("I learn English today");
    expect(out.evaluation?.passed).toBe(true);
    expect(out.evaluation?.overallScore).toBeGreaterThanOrEqual(95);
  });

  it("rejects Whisper silence hallucinations when noSpeechProb > 0.82 and hadVoicedSpeech is false", async () => {
    const fakeBlob = new Blob([new Uint8Array(800)], { type: "audio/webm" });
    Object.defineProperty(URL, "revokeObjectURL", { writable: true, configurable: true, value: vi.fn() });

    vi.spyOn(AudioCaptureService, "stopAndGetAudio").mockResolvedValue({
      audioBlob: fakeBlob,
      audioUrl: "blob:http://localhost/test-silence",
      durationSeconds: 1,
      hadVoicedSpeech: false,
    });

    vi.spyOn(AudioCaptureService, "transcribeAudio").mockResolvedValue({
      text: "Thank you.",
      language: "en",
      noSpeechProb: 0.94,
    });

    const out = await stopAndEvaluatePathwayVoice({
      targetSentence: "I learn English today.",
      liveTranscriptSnapshot: "",
      profession: "Architect",
    });

    expect(out.transcript).toBe("");
    expect(out.evaluation).toBeNull();
  });

  it("guarantees 100% sentence continuity between Step 2 (BUILD) and Step 3 (SPEAK) across all 32 A1 foundations", () => {
    const units = buildA1Foundations("at work", "en mi trabajo");
    expect(units).toHaveLength(32);

    for (const unit of units) {
      const built = unit.payload.blockChallenge.targetTokens.join(" ").replace(/[.!?]+$/, "").trim().toLowerCase();
      const spoken = unit.payload.voicePractice.sentenceEnglish.replace(/[.!?]+$/, "").trim().toLowerCase();
      expect(spoken).toBe(built);
    }
  });
});
