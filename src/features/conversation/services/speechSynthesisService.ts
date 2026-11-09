import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { resolveAudioUrl } from "../../../shared/utils/audioUrl";
import {
  readingAudioPrefetcher,
  FlagshipVoiceId,
} from "../../reading/services/readingAudioPrefetcher";
import a1AudioManifest from "../../pathway/data/a1AudioManifest.json";
import a2AudioManifest from "../../pathway/data/a2AudioManifest.json";
import b1AudioManifest from "../../pathway/data/b1AudioManifest.json";
import b2AudioManifest from "../../pathway/data/b2AudioManifest.json";
import c1AudioManifest from "../../pathway/data/c1AudioManifest.json";
import c2AudioManifest from "../../pathway/data/c2AudioManifest.json";
import { pathwayAudioLog } from "../../pathway/audio/pathwayAudioLog";

export interface SpeakOptions {
  rate?: number; // 0.75 to 1.25
  pitch?: number;
  voice?: FlagshipVoiceId | string;
  lang?: "en" | "es" | string;
  preventSyntheticFallback?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export function sanitizeSpeechForVoice(text: string): string {
  if (!text) return "";
  return text
    // Remove all types of quotes that TTS engines verbalize as literal words
    .replace(/[\u00ab\u00bb\u201c\u201d\u2018\u2019"'\`]/g, " ")
    // Remove asterisks, brackets, braces, hashes, tildes, markdown markers
    .replace(/[\[\]\(\)\{\}\*\#\_\~\<\>]/g, " ")
    // Replace em dashes, en dashes and semicolons with natural breath pauses (commas)
    .replace(/[\u2014\u2013;]/g, ", ")
    // Replace forward/backward slashes with natural word "o" or space
    .replace(/\s*[\/\\]\s*/g, " o ")
    // Replace ampersand with "y"
    .replace(/&/g, " y ")
    // Replace colons with comma pauses
    .replace(/:\s*/g, ", ")
    // Remove numerical step badges like "1.", "2.", "Paso 1:"
    .replace(/^\s*\d+\.\s*/gm, "")
    // Collapse whitespace and trim
    .replace(/\s+/g, " ")
    .trim();
}

export class SpeechSynthesisService {
  private static currentAudio: HTMLAudioElement | null = null;
  private static activePlaybackId: number = 0;
  /** MP3 del manifiesto ya descargados como blob: el cambio de idioma no puede streamear. */
  private static staticBlobCache = new Map<string, string>();
  private static staticBlobPending = new Map<string, Promise<string | null>>();
  private static playbackListeners = new Set<(isPlaying: boolean) => void>();

  public static subscribePlaybackState(listener: (isPlaying: boolean) => void): () => void {
    this.playbackListeners.add(listener);
    try {
      listener(this.isAiPlaying());
    } catch {}
    return () => {
      this.playbackListeners.delete(listener);
    };
  }

  public static notifyPlayback(playing: boolean): void {
    this.playbackListeners.forEach((fn) => {
      try {
        fn(playing);
      } catch {}
    });
  }

  /**
   * Proactively prefetch text with high-fidelity neural voice into memory.
   */
  public static prefetch(text: string, voice?: FlagshipVoiceId | string): Promise<any> {
    const raw = text ? text.trim() : "";
    const sanitized = sanitizeSpeechForVoice(raw);
    if (!sanitized) return Promise.resolve(null);
    const manifest = { ...a1AudioManifest, ...a2AudioManifest, ...b1AudioManifest, ...b2AudioManifest, ...c1AudioManifest, ...c2AudioManifest } as Record<string, string>;
    const staticUrl = manifest[sanitized] || manifest[raw];
    if (staticUrl) {
      // El siguiente segmento se deja 100% en memoria antes de que termine el actual.
      this.prefetchStatic(staticUrl);
      return Promise.resolve(null);
    }
    const v = voice || "liam";
    return readingAudioPrefetcher.prefetchText(sanitized, v);
  }

  /** Descarga completa del mp3 del manifiesto y la guarda como blob URL. */
  public static prefetchStatic(url?: string): void {
    if (!url || this.staticBlobCache.has(url) || this.staticBlobPending.has(url)) return;
    const targetUrl = resolveAudioUrl(url);
    const pending = fetch(targetUrl, { cache: "force-cache" })
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (!blob) return null;
        if (this.staticBlobCache.size > 80) {
          const first = this.staticBlobCache.entries().next().value as [string, string] | undefined;
          if (first) {
            URL.revokeObjectURL(first[1]);
            this.staticBlobCache.delete(first[0]);
          }
        }
        const blobUrl = URL.createObjectURL(blob);
        this.staticBlobCache.set(url, blobUrl);
        return blobUrl;
      })
      .catch(() => null)
      .finally(() => {
        this.staticBlobPending.delete(url);
      });
    this.staticBlobPending.set(url, pending);
  }

  /** Fuente lista para reproducir: blob completo si ya está, o el mp3 con timeout corto. */
  private static async resolveStaticSource(url: string, timeoutMs = 1200): Promise<string> {
    const cached = this.staticBlobCache.get(url);
    if (cached) return cached;
    this.prefetchStatic(url);
    const targetUrl = resolveAudioUrl(url);
    const pending = this.staticBlobPending.get(url);
    if (!pending) return targetUrl;
    const blobUrl = await Promise.race([
      pending,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
    return blobUrl || targetUrl;
  }

  /**
   * Speaks given text with human-like pace and pitch.
   * Prioritizes high-definition Microsoft Edge / Azure Neural TTS (Gonzalo / Aria / Christopher / Alonso),
   * with seamless fallback to browser speech synthesis if offline.
   */
  public static async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const raw = text ? text.trim() : "";
    const sanitized = sanitizeSpeechForVoice(raw);
    if (!sanitized) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Stop any ongoing speech immediately & record unique playback token
    this.stop();
    const playbackId = this.activePlaybackId;

    const isSpanish = options.lang === "es" || (typeof options.voice === "string" && options.voice.startsWith("es"));
    const voiceId = options.voice
      ? options.voice
      : isSpanish
      ? "liam"
      : "liam";

    // Strictly enforce neural Liam: never allow browser synthetic SAPI voices for Liam
    const isLiam = voiceId === "liam" || options.voice === "liam";
    if (isLiam) {
      options.preventSyntheticFallback = true;
    }

    // 0. Check pre-baked static local asset (100% owned local disk asset, 0ms, 0 API spend)
    const manifest = { ...a1AudioManifest, ...a2AudioManifest, ...b1AudioManifest, ...b2AudioManifest, ...c1AudioManifest, ...c2AudioManifest } as Record<string, string>;
    const staticLocalAudio = manifest[sanitized] || manifest[raw];

    // Trazabilidad: una línea sin audio propio cae al TTS en vivo y suena otra voz.
    // Esto tiene que quedar registrado, no silenciado.
    if (staticLocalAudio) {
      pathwayAudioLog.record({ kind: "HIT", text: sanitized, audio: staticLocalAudio });
    } else {
      pathwayAudioLog.record({
        kind: "MISS",
        text: sanitized,
        extra: `voz=${voiceId} mismaClave=${manifest[raw] ? "raw" : "no"}`,
      });
    }

    const cached = staticLocalAudio ? null : readingAudioPrefetcher.get(sanitized, voiceId);
    const audioSource = staticLocalAudio
      ? await this.resolveStaticSource(staticLocalAudio)
      : cached
      ? cached.blobUrl
      : `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(sanitized)}&voice=${encodeURIComponent(
          voiceId,
        )}&rate=%2B0%25&volume=%2B100%25`;

    try {
      const audio = new Audio();
      // @ts-ignore
      audio.playsInline = true;
      try {
        audio.setAttribute("playsinline", "true");
        audio.setAttribute("webkit-playsinline", "true");
      } catch {}
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
        SpeechSynthesisService.notifyPlayback(false);
        if (options.onEnd) options.onEnd();
      };

      audio.onplay = () => {
        if (this.activePlaybackId !== playbackId) return;
        SpeechSynthesisService.notifyPlayback(true);
        if (options.onStart) options.onStart();
      };

      audio.onended = handleEnd;

      audio.onerror = async (e) => {
        if (this.activePlaybackId !== playbackId) return;
        SpeechSynthesisService.notifyPlayback(false);
        logger.warn("[SpeechSynthesisService] Direct audio stream error, falling back to Web Audio buffer playback:", e);
        try {
          const played = await MobileAudioUnlocker.playNeuralBuffer(
            cached ? cached.blob : audioSource,
            options,
            () => this.activePlaybackId === playbackId,
            () => {
              if (this.activePlaybackId === playbackId) {
                SpeechSynthesisService.notifyPlayback(true);
                if (options.onStart) options.onStart();
              }
            },
            () => {
              if (this.activePlaybackId === playbackId) {
                SpeechSynthesisService.notifyPlayback(false);
                if (options.onEnd) options.onEnd();
              }
            },
          );
          if (played) return;
        } catch {}
        this.currentAudio = null;
        if (options.preventSyntheticFallback) {
          logger.warn("[SpeechSynthesisService] Neural playback failed and synthetic fallback is disabled. Skipping browser TTS.");
          if (options.onError) options.onError(e);
          else if (options.onEnd) options.onEnd();
          return;
        }
        logger.warn("[SpeechSynthesisService] Neural playback failed, activating browser speech synthesis fallback");
        void this.speakFallback(sanitized, options, playbackId);
      };

      // Nunca arrancar a media carga: eso produce "dice un poquito, se detiene y sigue".
      if (audio.readyState < 3) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const done = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            audio.removeEventListener("canplaythrough", done);
            resolve();
          };
          const timer = setTimeout(done, 600);
          audio.addEventListener("canplaythrough", done, { once: true });
        });
      }
      await audio.play();
    } catch (err: any) {
      if (this.activePlaybackId !== playbackId) return;
      logger.warn("[SpeechSynthesisService] HTMLAudioElement play interrupted or blocked, falling back to Web Audio buffer playback:", err);
      this.currentAudio = null;

      try {
        const played = await MobileAudioUnlocker.playNeuralBuffer(
          cached ? cached.blob : audioSource,
          options,
          () => this.activePlaybackId === playbackId,
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

      if (options.preventSyntheticFallback) {
        logger.warn("[SpeechSynthesisService] Direct & buffer audio play failed and synthetic fallback is disabled. Skipping browser TTS.");
        if (options.onError) options.onError(err);
        else if (options.onEnd) options.onEnd();
        return;
      }
      logger.warn("[SpeechSynthesisService] Direct & buffer audio play failed, activating browser speech synthesis fallback");
      void this.speakFallback(sanitized, options, playbackId);
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
    const isDirect = Boolean(this.currentAudio && !this.currentAudio.paused && !this.currentAudio.ended);
    const isBuffer = MobileAudioUnlocker.isBufferPlaying();
    return isDirect || isBuffer;
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
   * Selects the most natural Spanish voice available on device for fallback
   */
  public static async getBestSpanishVoice(preferredGender?: "male" | "female"): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    if (!voices || voices.length === 0) return null;

    const spanishVoices = voices.filter(
      (v) => v.lang.startsWith("es-") || v.lang.startsWith("es_") || v.lang === "es",
    );

    if (spanishVoices.length === 0) return voices[0] || null;

    // 1. Gender-specific high-fidelity neural voices
    if (preferredGender === "male") {
      const maleKeywords = ["gonzalo", "alonso", "alvaro", "jorge", "antonio", "manuel", "enrique", "carlos", "miguel", "male"];
      for (const kw of maleKeywords) {
        const match = spanishVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (match) return match;
      }
    } else if (preferredGender === "female") {
      const femaleKeywords = ["dalia", "elvira", "paloma", "sabina", "paulina", "monica", "helena", "laura", "female"];
      for (const kw of femaleKeywords) {
        const match = spanishVoices.find((v) => v.name.toLowerCase().includes(kw));
        if (match) return match;
      }
    }

    // 2. High-fidelity neural keywords
    const priorityKeywords = [
      "gonzalo",
      "alonso",
      "alvaro",
      "dalia",
      "elvira",
      "paloma",
      "natural",
      "neural",
      "online",
      "multilingual",
      "microsoft",
      "enhanced",
      "premium",
      "paulina",
      "monica",
      "jorge",
    ];

    for (const keyword of priorityKeywords) {
      const match = spanishVoices.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }

    const nonGoogleEs = spanishVoices.find((v) => !v.name.toLowerCase().includes("google"));
    return nonGoogleEs || spanishVoices[0];
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

    const voiceId = String(options.voice || "").toLowerCase();
    if (options.preventSyntheticFallback || voiceId.includes("liam")) {
      logger.warn("[SpeechSynthesisService] Synthetic fallback strictly blocked for Liam.");
      if (options.onEnd) options.onEnd();
      return;
    }

    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window) ||
      typeof SpeechSynthesisUtterance === "undefined"
    ) {
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const isSpanish = options.lang === "es" || voiceId.startsWith("es");
    const isFemale =
      voiceId.toLowerCase().includes("female") ||
      voiceId.toLowerCase().includes("aria") ||
      voiceId.toLowerCase().includes("jenny") ||
      voiceId.toLowerCase().includes("samantha") ||
      voiceId.toLowerCase().includes("zira");
    const isMale = !isFemale;
    const voice = isSpanish
      ? await this.getBestSpanishVoice(isMale ? "male" : "female")
      : await this.getBestVoice(isMale ? "male" : "female");
    if (this.activePlaybackId !== playbackId) return;
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = isSpanish ? "es-MX" : "en-US";
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
    this.notifyPlayback(false);
    if (this.currentAudio) {
      const audio = this.currentAudio;
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onpause = null;
      try {
        audio.pause();
        audio.currentTime = 0;
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
    isStillActiveOrPlaybackId?: number | (() => boolean),
    onStart?: () => void,
    onEnd?: () => void,
  ): Promise<boolean> {
    const isCancelled = () => {
      if (typeof isStillActiveOrPlaybackId === "function") {
        return !isStillActiveOrPlaybackId();
      }
      if (typeof isStillActiveOrPlaybackId === "number" && isStillActiveOrPlaybackId > 0) {
        return SpeechSynthesisService.getActivePlaybackId() !== isStillActiveOrPlaybackId;
      }
      return false;
    };

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

      if (isCancelled()) {
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

    if (!audioBuffer || isCancelled()) {
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
      if (!isCancelled() && onEnd) {
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

  public static isBufferPlaying(): boolean {
    return Boolean(this.activeSourceNode);
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

if (typeof window !== "undefined") {
  MobileAudioUnlocker.init();
}


