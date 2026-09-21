import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioCaptureService } from "../audioCaptureService";
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
});
