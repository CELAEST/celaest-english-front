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

    const cached = readingAudioPrefetcher.get(trimmed, voiceId);
    const audioSource = cached
      ? cached.blobUrl
      : `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(trimmed)}&voice=${encodeURIComponent(
          voiceId,
        )}&rate=%2B0%25&volume=%2B100%25`;

    try {
      const audio = MobileAudioUnlocker.getSharedAudio() || new Audio();
      audio.src = audioSource;
      audio.preload = "auto";
      audio.volume = 1.0;
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
        logger.warn("[SpeechSynthesisService] Direct audio stream error, attempting Web Audio buffer playback:", e);
        try {
          const played = await MobileAudioUnlocker.playNeuralBuffer(
            cached ? cached.blob : audioSource,
            options,
            playbackId,
            () => {
              if (this.activePlaybackId === playbackId && options.onStart) options.onStart();
            },
            () => {
              if (this.activePlaybackId === playbackId && options.onEnd) options.onEnd();
            },
          );
          if (played) return;
        } catch {}
        this.currentAudio = null;
        if (options.onError) options.onError(e);
        if (options.onEnd) options.onEnd();
      };

      await audio.play();
    } catch (err: any) {
      if (this.activePlaybackId !== playbackId) return;
      if (err?.name === "AbortError") {
        return;
      }
      if (err?.name === "NotAllowedError") {
        logger.warn("[SpeechSynthesisService] HTMLAudioElement blocked by autoplay policy, attempting speech synthesis fallback:", err);
        this.currentAudio = null;
        await this.speakFallback(trimmed, options, playbackId);
        return;
      }
      logger.warn("[SpeechSynthesisService] HTMLAudioElement play failed or blocked, attempting Web Audio buffer playback:", err);
      this.currentAudio = null;

      try {
        const played = await MobileAudioUnlocker.playNeuralBuffer(
          cached ? cached.blob : audioSource,
          options,
          playbackId,
          () => {
            if (this.activePlaybackId === playbackId && options.onStart) options.onStart();
          },
          () => {
            if (this.activePlaybackId === playbackId && options.onEnd) options.onEnd();
          },
        );
        if (played) return;
      } catch (webAudioErr) {
        logger.warn("[SpeechSynthesisService] Web Audio buffer playback failed:", webAudioErr);
      }

      if (options.onError) options.onError(err);
      if (options.onEnd) options.onEnd();
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

      let settled = false;
      const finish = (v: SpeechSynthesisVoice[]) => {
        if (!settled) {
          settled = true;
          try {
            window.speechSynthesis.onvoiceschanged = null;
          } catch {}
          resolve(v);
        }
      };

      // Safeguard against mobile iOS Safari where onvoiceschanged may never trigger
      const timer = setTimeout(() => {
        finish(window.speechSynthesis.getVoices());
      }, 400);

      window.speechSynthesis.onvoiceschanged = () => {
        clearTimeout(timer);
        finish(window.speechSynthesis.getVoices());
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
  public static async speakFallback(
    text: string,
    options: SpeakOptions = {},
    playbackId: number = this.activePlaybackId,
  ): Promise<void> {
    if (this.activePlaybackId !== playbackId) return;
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof SpeechSynthesisUtterance === "undefined"
    ) {
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
    utterance.volume = 1.0;

    const estimatedWords = text.split(/\s+/).filter(Boolean).length;
    const maxFallbackDurationMs = Math.max(3000, Math.ceil((estimatedWords / 1.8) * 1000) + 2500);

    let hasEnded = false;
    let watchdogTimer: ReturnType<typeof setTimeout> | null = null;
    const safeEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (watchdogTimer) {
        clearTimeout(watchdogTimer);
        watchdogTimer = null;
      }
      if (this.activePlaybackId !== playbackId) return;
      if (options.onEnd) options.onEnd();
    };

    watchdogTimer = setTimeout(() => {
      safeEnd();
    }, maxFallbackDurationMs);

    utterance.onstart = () => {
      if (this.activePlaybackId !== playbackId) {
        window.speechSynthesis.cancel();
        return;
      }
      if (options.onStart) options.onStart();
    };

    utterance.onend = safeEnd;

    utterance.onerror = (e) => {
      if (this.activePlaybackId !== playbackId) return;
      logger.warn("Speech synthesis notice:", e);
      safeEnd();
      if (options.onError) options.onError(e);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (speakErr) {
      logger.warn("speechSynthesis.speak threw:", speakErr);
      safeEnd();
    }
  }

  public static getActivePlaybackId(): number {
    return this.activePlaybackId;
  }

  /**
   * Stops any ongoing speech immediately across both Neural Audio and browser synthesis
   */
  public static stop(): void {
    this.activePlaybackId++;
    MobileAudioUnlocker.stopSourceNode();
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

/**
 * MobileAudioUnlocker — Solves iOS Safari & Android Chrome Media Autoplay Quarantine.
 * Maintains a persistent, unlocked HTMLAudioElement instance across the user session.
 * Captures user touch/pointer gestures and permanently grants audio playback permissions.
 */
export class MobileAudioUnlocker {
  private static isUnlocked = false;
  private static isAudioCtxUnlocked = false;
  private static sharedAudio: HTMLAudioElement | null = null;
  private static audioCtx: AudioContext | null = null;
  private static activeSourceNode: AudioBufferSourceNode | null = null;
  private static bufferCache = new Map<string, AudioBuffer>();

  public static getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    return this.audioCtx;
  }

  public static getSharedAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.sharedAudio) {
      this.sharedAudio = new Audio();
      this.sharedAudio.preload = "auto";
      // @ts-ignore
      this.sharedAudio.playsInline = true;
      try {
        this.sharedAudio.setAttribute("playsinline", "true");
        this.sharedAudio.setAttribute("webkit-playsinline", "true");
      } catch {}
    }
    this.sharedAudio.volume = 1.0;
    return this.sharedAudio;
  }

  public static unlock(): void {
    if (typeof window === "undefined") return;

    // 1. Prime Web Audio API AudioContext on user gesture (iOS Safari Gold Standard)
    try {
      const ctx = this.getAudioContext();
      if (ctx) {
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
        if (!this.isAudioCtxUnlocked) {
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
          this.isAudioCtxUnlocked = true;
        }
      }
    } catch {}

    const audio = this.getSharedAudio();
    if (audio) {
      try {
        if (!audio.src || audio.src === "" || audio.src.startsWith("data:")) {
          audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
          audio.volume = 1.0;
          const p = audio.play();
          if (p && typeof p.then === "function") {
            p.then(() => {
              if (audio.src.startsWith("data:")) {
                try {
                  audio.pause();
                  audio.currentTime = 0;
                } catch {}
              }
            }).catch(() => {});
          }
        }
      } catch {}
    }

    this.isUnlocked = true;

    try {
      localStorage.setItem("celaest:interview:hasInteracted", "1");
    } catch {}
  }

  /**
   * Decodes and plays a neural audio stream or blob via Web Audio API.
   * Completely bypasses iOS Safari and Android media element autoplay quarantine.
   */
  public static async playNeuralBuffer(
    audioUrlOrBlob: string | Blob,
    options: SpeakOptions = {},
    playbackId: number,
    onStart?: () => void,
    onEnd?: () => void,
  ): Promise<boolean> {
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {}
    }

    let audioBuffer: AudioBuffer | undefined;
    const cacheKey = typeof audioUrlOrBlob === "string" ? audioUrlOrBlob : null;

    if (cacheKey && this.bufferCache.has(cacheKey)) {
      audioBuffer = this.bufferCache.get(cacheKey);
    } else {
      let arrayBuffer: ArrayBuffer;
      if (typeof audioUrlOrBlob === "string") {
        const resp = await fetch(audioUrlOrBlob, { headers: { Accept: "audio/mpeg" } });
        if (!resp.ok) return false;
        const contentType = resp.headers.get("content-type") || "";
        if (contentType.includes("text/html") || contentType.includes("application/json")) {
          logger.warn("[MobileAudioUnlocker] Expected audio stream, received:", contentType);
          return false;
        }
        arrayBuffer = await resp.arrayBuffer();
      } else {
        arrayBuffer = await audioUrlOrBlob.arrayBuffer();
      }

      if (SpeechSynthesisService.getActivePlaybackId() !== playbackId) {
        return false;
      }

      audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      if (cacheKey && audioBuffer) {
        if (this.bufferCache.size > 50) {
          const firstKey = this.bufferCache.keys().next().value;
          if (firstKey) this.bufferCache.delete(firstKey);
        }
        this.bufferCache.set(cacheKey, audioBuffer);
      }
    }

    if (!audioBuffer || SpeechSynthesisService.getActivePlaybackId() !== playbackId) {
      return false;
    }

    this.stopSourceNode();

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    if (options.rate) {
      source.playbackRate.value = options.rate;
    }

    // Dynamic boost & limiter: boost gain by 80% with compressor so mobile phone speakers deliver loud, crisp, and clear speech
    let lastNode: AudioNode = source;
    if (typeof ctx.createGain === "function") {
      const gainNode = ctx.createGain();
      gainNode.gain.value = 1.8;
      source.connect(gainNode);
      lastNode = gainNode;

      if (typeof ctx.createDynamicsCompressor === "function") {
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.knee.value = 30;
        compressor.ratio.value = 4;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        gainNode.connect(compressor);
        lastNode = compressor;
      }
    }
    lastNode.connect(ctx.destination);
    this.activeSourceNode = source;

    let hasEnded = false;
    source.onended = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (this.activeSourceNode === source) {
        this.activeSourceNode = null;
      }
      if (SpeechSynthesisService.getActivePlaybackId() === playbackId && onEnd) {
        onEnd();
      }
    };

    source.start(0);
    if (onStart) onStart();

    return true;
  }

  public static stopSourceNode(): void {
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch {}
      this.activeSourceNode = null;
    }
  }

  public static init(): void {
    if (typeof window === "undefined") return;

    const unlockHandler = () => {
      this.unlock();
      if (this.isUnlocked) {
        window.removeEventListener("pointerdown", unlockHandler, true);
        window.removeEventListener("touchstart", unlockHandler, true);
        window.removeEventListener("keydown", unlockHandler, true);
      }
    };

    window.addEventListener("pointerdown", unlockHandler, { passive: true, capture: true });
    window.addEventListener("touchstart", unlockHandler, { passive: true, capture: true });
    window.addEventListener("keydown", unlockHandler, { passive: true, capture: true });
  }
}


