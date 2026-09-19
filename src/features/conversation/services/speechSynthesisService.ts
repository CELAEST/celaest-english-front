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
  private static activePlaybackId: number = 0;

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

    // Stop any ongoing speech immediately & record unique playback token
    this.stop();
    const playbackId = this.activePlaybackId;

    const voiceId: FlagshipVoiceId =
      options.voice === "en-US-ChristopherNeural" ? "en-US-ChristopherNeural" : "en-US-AriaNeural";

    try {
      const cached = readingAudioPrefetcher.get(trimmed, voiceId);
      const audioSource = cached
        ? cached.blobUrl
        : `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(trimmed)}&voice=${encodeURIComponent(
            voiceId,
          )}&rate=%2B0%25`;

      const audio = new Audio(audioSource);
      audio.preload = "auto";
      if (options.rate) {
        audio.playbackRate = options.rate;
      }
      this.currentAudio = audio;

      let hasEnded = false;
      const handleEnd = () => {
        if (this.activePlaybackId !== playbackId) return;
        if (hasEnded) return;
        hasEnded = true;
        this.currentAudio = null;
        if (options.onEnd) options.onEnd();
      };

      audio.onplay = () => {
        if (this.activePlaybackId !== playbackId) return;
        if (options.onStart) options.onStart();
      };

      audio.onended = handleEnd;

      audio.onerror = async (e) => {
        if (this.activePlaybackId !== playbackId) return;
        logger.warn("[SpeechSynthesisService] Direct audio stream error, attempting Blob retry:", e);
        try {
          const resp = await fetch(audioSource, { headers: { Accept: "audio/mpeg" } });
          if (resp.ok) {
            const blob = await resp.blob();
            const blobUrl = URL.createObjectURL(blob);
            const retryAudio = new Audio(blobUrl);
            if (options.rate) retryAudio.playbackRate = options.rate;
            this.currentAudio = retryAudio;
            retryAudio.onplay = () => {
              if (this.activePlaybackId !== playbackId) return;
              if (options.onStart) options.onStart();
            };
            retryAudio.onended = () => {
              URL.revokeObjectURL(blobUrl);
              handleEnd();
            };
            retryAudio.onerror = () => {
              URL.revokeObjectURL(blobUrl);
              this.speakFallback(trimmed, options, playbackId);
            };
            await retryAudio.play();
            return;
          }
        } catch {
          // Continue to speakFallback below
        }
        this.currentAudio = null;
        this.speakFallback(trimmed, options, playbackId);
      };

      await audio.play();
    } catch (err: any) {
      if (this.activePlaybackId !== playbackId) return;
      if (err?.name === "AbortError") {
        // Deliberate user navigation or audio interruption — do not trigger fallback voice
        return;
      }
      logger.warn("[SpeechSynthesisService] Error initiating audio, attempting Blob retry before fallback:", err);
      try {
        const audioSource = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(trimmed)}&voice=${encodeURIComponent(
          voiceId,
        )}&rate=%2B0%25`;
        const resp = await fetch(audioSource, { headers: { Accept: "audio/mpeg" } });
        if (resp.ok) {
          const blob = await resp.blob();
          const blobUrl = URL.createObjectURL(blob);
          const retryAudio = new Audio(blobUrl);
          if (options.rate) retryAudio.playbackRate = options.rate;
          this.currentAudio = retryAudio;
          retryAudio.onplay = () => {
            if (this.activePlaybackId !== playbackId) return;
            if (options.onStart) options.onStart();
          };
          retryAudio.onended = () => {
            URL.revokeObjectURL(blobUrl);
            if (this.activePlaybackId === playbackId && options.onEnd) options.onEnd();
          };
          retryAudio.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            this.speakFallback(trimmed, options, playbackId);
          };
          await retryAudio.play();
          return;
        }
      } catch {
        // Continue to speakFallback below
      }
      this.currentAudio = null;
      this.speakFallback(trimmed, options, playbackId);
    }
  }

  /**
   * Populates targetArray with live frequency bin bytes (0..255) from the AI speech playback.
   * Returns true if analyser was active, false otherwise.
   */
  public static getAiByteFrequencyData(_targetArray: Uint8Array): boolean {
    return false;
  }

  /**
   * Returns whether AI audio is actively playing.
   */
  public static isAiPlaying(): boolean {
    return Boolean(this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended);
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
  public static async getBestVoice(preferredGender?: "male" | "female"): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    if (!voices || voices.length === 0) return null;

    const englishVoices = voices.filter(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en_US") || v.lang.startsWith("en"),
    );

    if (englishVoices.length === 0) return voices[0] || null;

    // 1. Gender-specific high-fidelity system voices
    if (preferredGender === "male") {
      const maleKeywords = ["christopher", "guy", "daniel", "david", "george", "male", "mark", "steven", "oliver", "tom"];
      for (const kw of maleKeywords) {
        const match = englishVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (match) return match;
      }
    } else if (preferredGender === "female") {
      const femaleKeywords = ["aria", "jenny", "samantha", "zira", "karen", "female", "victoria", "catherine", "ava", "allison"];
      for (const kw of femaleKeywords) {
        const match = englishVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (match) return match;
      }
    }

    // 2. High-fidelity neural keywords (NEVER prefer robotic "google")
    const priorityKeywords = [
      "natural",
      "neural",
      "online",
      "multilingual",
      "microsoft",
      "enhanced",
      "premium",
      "samantha",
      "daniel",
    ];

    for (const keyword of priorityKeywords) {
      const match = englishVoices.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }

    // 3. Fallback to any non-Google en-US voice first
    const nonGoogleUsMatch = englishVoices.find(
      (v) => (v.lang === "en-US" || v.lang === "en_US") && !v.name.toLowerCase().includes("google"),
    );
    if (nonGoogleUsMatch) return nonGoogleUsMatch;

    const usMatch = englishVoices.find((v) => v.lang === "en-US" || v.lang === "en_US");
    return usMatch || englishVoices[0];
  }

  /**
   * Browser Speech Synthesis Fallback if backend TTS is unreachable
   */
  private static async speakFallback(
    text: string,
    options: SpeakOptions,
    playbackId: number,
  ): Promise<void> {
    if (this.activePlaybackId !== playbackId) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const voiceId = String(options.voice || "en-US-AriaNeural");
    const isMale = voiceId.toLowerCase().includes("christopher") || voiceId.toLowerCase().includes("male") || voiceId.toLowerCase().includes("chris");
    const voice = await this.getBestVoice(isMale ? "male" : "female");
    if (this.activePlaybackId !== playbackId) return;
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
      if (this.activePlaybackId !== playbackId) {
        window.speechSynthesis.cancel();
        return;
      }
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      if (this.activePlaybackId !== playbackId) return;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      if (this.activePlaybackId !== playbackId) return;
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
    this.activePlaybackId++;
    if (this.currentAudio) {
      const audio = this.currentAudio;
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Completely cleans up speech synthesis resources
   */
  public static cleanup(): void {
    this.stop();
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
