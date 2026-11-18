import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { resolveAudioUrl, resolveSameOriginAudioFallback } from "../../../shared/utils/audioUrl";
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
  private static externalStopListeners = new Set<() => void>();
  private static isRunningExternalStops = false;
  private static muteListeners = new Set<(isMuted: boolean) => void>();
  private static memoryMuted = false;

  private static readonly MUTE_STORAGE_KEY = "celaest:audio:muted";

  public static isMuted(): boolean {
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        const stored = localStorage.getItem(this.MUTE_STORAGE_KEY);
        if (stored !== null) return stored === "1";
        return false;
      }
    } catch {
      // fallback to memory flag
    }
    return this.memoryMuted;
  }

  public static setMuted(next: boolean): void {
    this.memoryMuted = next;
    try {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        if (next) {
          localStorage.setItem(this.MUTE_STORAGE_KEY, "1");
        } else {
          localStorage.removeItem(this.MUTE_STORAGE_KEY);
        }
      }
    } catch {
      // ignore storage errors
    }
    if (this.currentAudio) {
      this.currentAudio.muted = next;
      this.currentAudio.volume = next ? 0 : 1.0;
    }
    MobileAudioUnlocker.setMuted(next);
    for (const listener of Array.from(this.muteListeners)) {
      try {
        listener(next);
      } catch {
        // ignore listener error
      }
    }
  }

  public static toggleMute(): boolean {
    const next = !this.isMuted();
    this.setMuted(next);
    return next;
  }

  public static subscribeMuteState(listener: (isMuted: boolean) => void): () => void {
    this.muteListeners.add(listener);
    try {
      listener(this.isMuted());
    } catch {
      // ignore
    }
    return () => {
      this.muteListeners.delete(listener);
    };
  }

  public static subscribePlaybackState(listener: (isPlaying: boolean) => void): () => void {
    this.playbackListeners.add(listener);
    try {
      listener(this.isAiPlaying());
    } catch {}
    return () => {
      this.playbackListeners.delete(listener);
    };
  }

  /**
   * Registers an external audio player (e.g. phonetics or lecture loop) so any global
   * stop or new speech playback halts it immediately, preventing overlapping voices.
   */
  public static registerExternalStop(listener: () => void): () => void {
    this.externalStopListeners.add(listener);
    return () => {
      this.externalStopListeners.delete(listener);
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
    if (!raw) return Promise.resolve(null);

    const v = voice || "en-US-AriaNeural";
    const isPathwayMode = v === "liam" || v.startsWith("es");

    if (isPathwayMode) {
      const sanitized = sanitizeSpeechForVoice(raw);
      if (!sanitized) return Promise.resolve(null);
      const manifest = { ...a1AudioManifest, ...a2AudioManifest, ...b1AudioManifest, ...b2AudioManifest, ...c1AudioManifest, ...c2AudioManifest } as Record<string, string>;
      const staticUrl = manifest[sanitized] || manifest[raw];
      if (staticUrl) {
        // El siguiente segmento se deja 100% en memoria antes de que termine el actual.
        this.prefetchStatic(staticUrl);
        return Promise.resolve(null);
      }
      return readingAudioPrefetcher.prefetchText(sanitized, v);
    }

    return readingAudioPrefetcher.prefetchText(raw, v);
  }

  /** Descarga completa del mp3 del manifiesto y la guarda como blob URL. */
  public static prefetchStatic(url?: string): void {
    if (!url || this.staticBlobCache.has(url) || this.staticBlobPending.has(url)) return;
    const targetUrl = resolveAudioUrl(url);
    const sameOriginFallback = resolveSameOriginAudioFallback(url, targetUrl);
    const fetchBlob = async (candidate: string): Promise<Blob | null> => {
      try {
        const res = await fetch(candidate, { cache: "force-cache" });
        return res.ok ? await res.blob() : null;
      } catch {
        return null;
      }
    };
    const pending = fetchBlob(targetUrl)
      .then((blob) => (blob || !sameOriginFallback ? blob : fetchBlob(sameOriginFallback)))
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

  /** Fuente lista para reproducir sin bloquear el gesto táctil del usuario. */
  private static resolveStaticSourceSyncOrBackground(url: string): string {
    const cached = this.staticBlobCache.get(url);
    if (cached) return cached;
    this.prefetchStatic(url);
    return resolveAudioUrl(url);
  }

  /**
   * Speaks given text with human-like pace and pitch.
   * Prioritizes high-definition Microsoft Edge / Azure Neural TTS (Gonzalo / Aria / Christopher / Alonso),
   * with seamless fallback to browser speech synthesis if offline.
   */
  public static async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    const raw = text ? text.trim() : "";
    if (!raw) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const isSpanish = options.lang === "es" || (typeof options.voice === "string" && options.voice.startsWith("es"));
    const voiceId = options.voice
      ? options.voice
      : isSpanish
      ? "liam"
      : "en-US-AriaNeural";
    const isPathwayMode = voiceId === "liam" || isSpanish;
    const textToSpeak = isPathwayMode ? sanitizeSpeechForVoice(raw) : raw;
    if (!textToSpeak) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Stop any ongoing speech immediately & record unique playback token
    this.stop();
    const playbackId = this.activePlaybackId;

    // Strictly enforce neural Liam: never allow browser synthetic SAPI voices for Liam
    if (voiceId === "liam") {
      options.preventSyntheticFallback = true;
    }

    // 0. Check pre-baked static local asset only for Pathway (Liam / Spanish)
    let staticLocalAudio: string | undefined;
    if (isPathwayMode) {
      const manifest = { ...a1AudioManifest, ...a2AudioManifest, ...b1AudioManifest, ...b2AudioManifest, ...c1AudioManifest, ...c2AudioManifest } as Record<string, string>;
      staticLocalAudio = manifest[textToSpeak] || manifest[raw];

      // Trazabilidad: una línea sin audio propio cae al TTS en vivo y suena otra voz.
      // Esto tiene que quedar registrado, no silenciado.
      if (staticLocalAudio) {
        pathwayAudioLog.record({ kind: "HIT", text: textToSpeak, audio: staticLocalAudio });
      } else {
        pathwayAudioLog.record({
          kind: "MISS",
          text: textToSpeak,
          extra: `voz=${voiceId} mismaClave=${manifest[raw] ? "raw" : "no"}`,
        });
      }
    }

    let cached = staticLocalAudio ? null : readingAudioPrefetcher.get(textToSpeak, voiceId);
    if (!staticLocalAudio && !cached) {
      const pendingPrefetch = readingAudioPrefetcher.getInFlight(textToSpeak, voiceId);
      if (pendingPrefetch) {
        cached = await pendingPrefetch;
        if (this.activePlaybackId !== playbackId) return;
      }
    }
    const audioSource = staticLocalAudio
      ? this.resolveStaticSourceSyncOrBackground(staticLocalAudio)
      : cached
      ? cached.blobUrl
      : `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(textToSpeak)}&voice=${encodeURIComponent(
          voiceId,
        )}&rate=%2B0%25&volume=%2B100%25`;

    const originFallback = staticLocalAudio
      ? resolveSameOriginAudioFallback(staticLocalAudio, audioSource)
      : null;
    let triedOriginFallback = false;
    let hasEnded = false;
    let recoveryPromise: Promise<void> | null = null;

    const isStale = () => this.activePlaybackId !== playbackId || hasEnded;

    const handleEnd = () => {
      if (isStale()) return;
      hasEnded = true;
      this.currentAudio = null;
      SpeechSynthesisService.notifyPlayback(false);
      if (options.onEnd) options.onEnd();
    };

    const finishWithError = (err: unknown) => {
      if (isStale()) return;
      hasEnded = true;
      this.currentAudio = null;
      SpeechSynthesisService.notifyPlayback(false);
      logger.warn("[SpeechSynthesisService] Direct & buffer audio play failed. Skipping synthetic browser TTS.");
      if (options.onError) options.onError(err);
      else if (options.onEnd) options.onEnd();
    };

    const tryNeuralBuffer = async (source: string | Blob): Promise<boolean> => {
      if (isStale()) return false;
      try {
        return await MobileAudioUnlocker.playNeuralBuffer(
          source,
          options,
          () => !isStale(),
          () => {
            if (!isStale()) {
              SpeechSynthesisService.notifyPlayback(true);
              if (options.onStart) options.onStart();
            }
          },
          handleEnd,
        );
      } catch (webAudioErr) {
        logger.warn("[SpeechSynthesisService] Web Audio buffer playback failed:", webAudioErr);
        return false;
      }
    };

    let mediaEl: HTMLAudioElement | null = null;
    const detachAudioListeners = (el: HTMLAudioElement | null) => {
      if (!el) return;
      el.onplay = null;
      el.onended = null;
      el.onerror = null;
      el.onpause = null;
    };

    const tryOriginRecovery = async (): Promise<boolean> => {
      if (isStale() || !originFallback || triedOriginFallback || !mediaEl) return false;
      triedOriginFallback = true;
      try {
        mediaEl.src = originFallback;
        if (isStale()) return false;
        this.currentAudio = mediaEl;
        await mediaEl.play();
        if (isStale()) {
          try {
            mediaEl.pause();
            mediaEl.currentTime = 0;
          } catch {}
          if (this.currentAudio === mediaEl) this.currentAudio = null;
          return false;
        }
        return true;
      } catch {
        return false;
      }
    };

    const recoverFromFailure = (err: unknown, allowOriginRetry: boolean): Promise<void> => {
      if (recoveryPromise) return recoveryPromise;
      recoveryPromise = (async () => {
        if (isStale()) return;
        if (allowOriginRetry && (await tryOriginRecovery())) return;
        if (isStale()) return;
        detachAudioListeners(mediaEl);
        if (mediaEl) {
          try {
            mediaEl.pause();
            mediaEl.currentTime = 0;
          } catch {}
          if (this.currentAudio === mediaEl) {
            this.currentAudio = null;
          }
        }
        SpeechSynthesisService.notifyPlayback(false);
        let resolvedBlob: Blob | null = cached ? cached.blob : null;
        if (!resolvedBlob && !staticLocalAudio && allowOriginRetry) {
          try {
            const fetchedItem = await readingAudioPrefetcher.prefetchText(textToSpeak, voiceId);
            if (isStale()) return;
            if (fetchedItem?.blob) {
              resolvedBlob = fetchedItem.blob;
            }
          } catch {
            // ignore prefetch recovery error
          }
        }
        const fallbackSource = resolvedBlob
          ? resolvedBlob
          : triedOriginFallback && originFallback
          ? originFallback
          : audioSource;
        if (await tryNeuralBuffer(fallbackSource)) return;
        if (
          allowOriginRetry &&
          !options.preventSyntheticFallback &&
          voiceId !== "liam" &&
          typeof window !== "undefined" &&
          "speechSynthesis" in window
        ) {
          await this.speakFallback(textToSpeak, options, playbackId);
          return;
        }
        finishWithError(err);
      })();
      return recoveryPromise;
    };

    try {
      const audio = new Audio();
      mediaEl = audio;
      // @ts-ignore
      audio.playsInline = true;
      try {
        audio.setAttribute("playsinline", "true");
        audio.setAttribute("webkit-playsinline", "true");
      } catch {}
      audio.src = audioSource;
      audio.preload = "auto";
      const muted = this.isMuted();
      audio.muted = muted;
      audio.volume = muted ? 0 : 1.0;
      if (options.rate) {
        audio.playbackRate = options.rate;
      }
      this.currentAudio = audio;

      audio.onplay = () => {
        if (isStale()) return;
        SpeechSynthesisService.notifyPlayback(true);
        if (options.onStart) options.onStart();
      };

      audio.onended = handleEnd;

      audio.onerror = (e) => {
        if (isStale()) return;
        logger.warn("[SpeechSynthesisService] Direct audio stream error, falling back safely:", e);
        void recoverFromFailure(e, true);
      };

      await audio.play();
      if (isStale() && this.currentAudio === audio) {
        detachAudioListeners(audio);
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {}
        this.currentAudio = null;
      }
    } catch (err: any) {
      if (isStale()) return;
      logger.warn("[SpeechSynthesisService] HTMLAudioElement play interrupted or blocked, falling back safely:", err);
      await recoverFromFailure(err, err?.name !== "NotAllowedError");
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
    utterance.volume = this.isMuted() ? 0 : 1.0;

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
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
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
    if (!this.isRunningExternalStops) {
      this.isRunningExternalStops = true;
      try {
        for (const listener of Array.from(this.externalStopListeners)) {
          try {
            listener();
          } catch {
            // ignore external stop cleanup failure
          }
        }
      } finally {
        this.isRunningExternalStops = false;
      }
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
  private static activeGainNode: GainNode | null = null;
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
      // Real Chrome leaves ctx.resume() pending forever when no user gesture occurred;
      // race against a short timeout so autoplay blocks propagate instead of freezing UI on PAUSA.
      let resumeSettledInTime = false;
      try {
        resumeSettledInTime = await Promise.race([
          ctx.resume().then(() => true),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 120)),
        ]);
      } catch {
        resumeSettledInTime = true;
      }
      const AudioCtxCtor =
        typeof window !== "undefined"
          ? window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
          : undefined;
      if (
        !resumeSettledInTime ||
        (ctx.state === "suspended" && AudioCtxCtor && ctx instanceof AudioCtxCtor)
      ) {
        return false;
      }
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
      gainNode.gain.value = SpeechSynthesisService.isMuted() ? 0 : 1.8;
      this.activeGainNode = gainNode;
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
        this.activeGainNode = null;
      }
      if (!isCancelled() && onEnd) {
        onEnd();
      }
    };

    source.start(0);
    if (onStart) onStart();

    return true;
  }

  public static setMuted(muted: boolean): void {
    if (this.activeGainNode) {
      try {
        this.activeGainNode.gain.value = muted ? 0 : 1.8;
      } catch {}
    }
  }

  public static stopSourceNode(): void {
    if (this.activeSourceNode) {
      try {
        this.activeSourceNode.stop();
        this.activeSourceNode.disconnect();
      } catch {}
      this.activeSourceNode = null;
    }
    this.activeGainNode = null;
  }

  public static isBufferPlaying(): boolean {
    return Boolean(this.activeSourceNode);
  }

  public static init(): void {
    if (typeof window === "undefined") return;

    const unlockHandler = () => {
      if (!this.isUnlocked) {
        this.unlock();
        return;
      }
      // On macOS & iOS Safari, getUserMedia / tab switches can transition AudioContext back to "suspended" or "interrupted".
      // Re-awaken synchronously inside subsequent user clicks/taps so voice playback never drops.
      const state = this.audioCtx?.state as string | undefined;
      if (this.audioCtx && (state === "suspended" || state === "interrupted")) {
        void this.audioCtx.resume().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", unlockHandler, { passive: true, capture: true });
    window.addEventListener("touchstart", unlockHandler, { passive: true, capture: true });
    window.addEventListener("touchend", unlockHandler, { passive: true, capture: true });
    window.addEventListener("click", unlockHandler, { passive: true, capture: true });
    window.addEventListener("keydown", unlockHandler, { passive: true, capture: true });
  }
}

if (typeof window !== "undefined") {
  MobileAudioUnlocker.init();
}


