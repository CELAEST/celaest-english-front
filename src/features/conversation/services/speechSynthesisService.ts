import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import {
  readingAudioPrefetcher,
  FlagshipVoiceId,
} from "../../reading/services/readingAudioPrefetcher";

export interface SpeakOptions {
  rate?: number; // 0.75 to 1.25
  pitch?: number;
  voice?: FlagshipVoiceId | string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export class SpeechSynthesisService {
  private static currentAudio: HTMLAudioElement | null = null;

  /**
   * Proactively prefetch text with high-fidelity neural voice into memory.
   */
  public static prefetch(text: string, voice?: FlagshipVoiceId): void {
    const v: FlagshipVoiceId = voice === "en-US-ChristopherNeural" ? "en-US-ChristopherNeural" : "en-US-AriaNeural";
    readingAudioPrefetcher.prefetchText(text, v);
  }

  /**
   * Speaks given text with human-like pace and pitch.
   * Prioritizes high-definition Microsoft Edge / Azure Neural TTS (Aria / Christopher),
   * with seamless fallback to browser speech synthesis if offline.
   */
  public static async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const trimmed = text ? text.trim() : "";
    if (!trimmed) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Stop any ongoing speech immediately
    this.stop();

    const voiceId: FlagshipVoiceId =
      options.voice === "en-US-ChristopherNeural" ? "en-US-ChristopherNeural" : "en-US-AriaNeural";

    try {
      const cached = readingAudioPrefetcher.get(trimmed, voiceId);
      const audioSource = cached
        ? cached.blobUrl
        : `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(trimmed)}&voice=${encodeURIComponent(
            voiceId,
          )}&rate=0%`;

      const audio = new Audio(audioSource);
      if (options.rate) {
        audio.playbackRate = options.rate;
      }
      this.currentAudio = audio;

      let hasEnded = false;
      const handleEnd = () => {
        if (hasEnded) return;
        hasEnded = true;
        this.currentAudio = null;
        if (options.onEnd) options.onEnd();
      };

      audio.onplay = () => {
        if (options.onStart) options.onStart();
      };

      audio.onended = handleEnd;

      audio.onerror = (e) => {
        logger.warn("[SpeechSynthesisService] Neural stream failed, falling back to browser speech synthesis:", e);
        this.currentAudio = null;
        this.speakFallback(trimmed, options);
      };

      await audio.play();
    } catch (err) {
      logger.warn("[SpeechSynthesisService] Error initiating audio, falling back to browser speech synthesis:", err);
      this.currentAudio = null;
      this.speakFallback(trimmed, options);
    }
  }

  /**
   * Loads available browser speech synthesis voices for fallback
   */
  public static getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve([]);
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        const loaded = window.speechSynthesis.getVoices();
        resolve(loaded);
      };
    });
  }

  /**
   * Selects the most natural English voice available on device for fallback
   */
  public static async getBestVoice(): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    if (!voices || voices.length === 0) return null;

    const englishVoices = voices.filter(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en_US") || v.lang.startsWith("en"),
    );

    if (englishVoices.length === 0) return voices[0] || null;

    const priorityKeywords = [
      "natural",
      "neural",
      "online",
      "google",
      "samantha",
      "daniel",
      "enhanced",
      "premium",
    ];

    for (const keyword of priorityKeywords) {
      const match = englishVoices.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }

    const usMatch = englishVoices.find((v) => v.lang === "en-US" || v.lang === "en_US");
    return usMatch || englishVoices[0];
  }

  /**
   * Browser Speech Synthesis Fallback if backend TTS is unreachable
   */
  private static async speakFallback(text: string, options: SpeakOptions): Promise<void> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const voice = await this.getBestVoice();
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      logger.warn("Speech synthesis notice:", e);
      if (options.onEnd) options.onEnd();
      if (options.onError) options.onError(e);
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stops any ongoing speech immediately across both Neural Audio and browser synthesis
   */
  public static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Checks if browser supports Speech Recognition
   */
  public static isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition,
    );
  }
}
