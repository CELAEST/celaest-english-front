/**
 * Audio Capture & Real-Time Speech Recognition Service
 * Handles microphone hardware access, live frequency analysis,
 * and robust SpeechRecognition for English & Spanish with continuous streaming.
 */

import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import {
  acquireOptimalMicStream,
  DESKTOP_SPEECH_ENERGY_THRESHOLD,
  isVirtualLoopbackMicLabel,
  measureAnalyserVoiceEnergy,
} from "./audioHardwareSelector";
import { transcribeWithGeminiEdge } from "./geminiAudioFallback";
import { MobileLiveStreamEngine } from "./mobileLiveStreamEngine";
import { detectLiveSpanishOrFiller } from "./speechIntelligibilityGuard";

export {
  acquireOptimalMicStream,
  DESKTOP_SPEECH_ENERGY_THRESHOLD,
  isVirtualLoopbackMicLabel,
  measureAnalyserVoiceEnergy,
};

export interface SpeechRecognitionResultItem {
  transcript: string;
}

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResultItem;
      isFinal: boolean;
    };
    length: number;
  };
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

function getBestAudioMimeType(): string {
  if (typeof window === "undefined" || typeof MediaRecorder === "undefined") return "";
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/aac",
    "audio/ogg;codecs=opus",
    "audio/wav",
  ];
  for (const t of types) {
    try {
      if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    } catch {
      // ignore
    }
  }
  return "";
}

export interface AudioCaptureResult {
  audioBlob: Blob | null;
  audioUrl: string | null;
  durationSeconds: number;
  hadVoicedSpeech?: boolean | undefined;
  confirmedMobileTranscript?: string | undefined;
  pendingTailBlob?: Blob | null | undefined;
}

export interface AudioTranscriptionResult {
  text: string;
  language?: string | undefined;
  duration?: number | undefined;
  avgLogprob?: number | undefined;
  noSpeechProb?: number | undefined;
}

/**
 * Detects whether the current device is a mobile phone or tablet.
 * Excludes Windows touchscreen laptops so desktop OSes always use native Web Speech live dictation,
 * while covering Android/iOS both in standard mobile UA and "Desktop site" mode (maxTouchPoints > 1).
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  const uaDataMobile = (navigator as unknown as { userAgentData?: { mobile?: boolean } })
    .userAgentData?.mobile;
  if (uaDataMobile === true) {
    return true;
  }
  if (/Windows NT/i.test(ua)) {
    return false;
  }
  // Covers iPadOS 13+ (MacIntel + multi-touch) AND Android Chrome "Desktop site" (Linux x86_64 + multi-touch)
  return (
    navigator.maxTouchPoints > 1 &&
    !("MSStream" in (window as unknown as Record<string, unknown>))
  );
}

/**
 * Determines whether live interim transcription should be powered by AI chunked streaming (Mobile / non-WebSpeech)
 * or exclusively by the browser's native SpeechRecognition engine (Desktop PC).
 */
export function shouldUseAiLiveTranscription(isMobile: boolean, hasWebSpeechApi: boolean): boolean {
  return isMobile || !hasWebSpeechApi;
}

/**
 * Merges history and a newly recognized phrase ensuring zero duplicate or overlapping boundary words
 */
export function mergePhrasesCleanly(history: string, newPhrase: string): string {
  const h = (history || "").trim();
  const n = (newPhrase || "").trim();
  if (!h) return n;
  if (!n) return h;

  const hLower = h.toLowerCase();
  const nLower = n.toLowerCase();

  // Strip punctuation and normalize whitespace for robust prefix/inclusion matching
  const hClean = hLower.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  const nClean = nLower.replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

  // 1. If new phrase already contains the complete history as prefix, return the fuller new phrase
  if (nClean.startsWith(hClean) || nLower.startsWith(hLower)) {
    return n;
  }

  const hWords = h.split(/\s+/);
  const nWords = n.split(/\s+/);

  // 2. If history already ends with the new phrase, or contains it as a multi-word subphrase (>= 3 words)
  if (
    hClean === nClean ||
    hClean.endsWith(nClean) ||
    hLower.endsWith(nLower) ||
    (nWords.length >= 3 && (hClean.includes(nClean) || hLower.includes(nLower)))
  ) {
    return h;
  }

  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 3. Check up to 12 overlapping boundary words
  const maxCheck = Math.min(12, hWords.length, nWords.length);
  for (let k = maxCheck; k >= 1; k--) {
    const hSlice = hWords.slice(-k).map(cleanWord).join(" ");
    const nSlice = nWords.slice(0, k).map(cleanWord).join(" ");
    if (hSlice && hSlice === nSlice) {
      const remaining = nWords.slice(k).join(" ");
      return remaining ? `${h} ${remaining}` : h;
    }
  }

  return `${h} ${n}`;
}

/**
 * Sanitizes transcribed speech ensuring pure verbatim fidelity without artificial prompt regurgitations
 */
export function cleanVerbatimTranscription(rawText: string): string {
  if (!rawText) return "";
  let text = rawText.trim();
  // Strip Whisper prompt regurgitations or hallucinated interview metadata across any dynamic role
  text = text.replace(/interview\s+(response|answer)\s+in\s+english\s*(answering\s*:?)?/gi, "");
  text = text.replace(/^(professional\s+)?english\s+interview\s+(response|answer)(\s+for\s+[^.?!]+)?[.?!]?$/gi, "");
  // Strip common Whisper silence/closing hallucinations
  text = text.replace(/^(thank you(\s+for watching)?\.?|subtitles? by.*|transcription by.*|watching\.?)$/gi, "");
  return text.replace(/\s+/g, " ").trim();
}

export class AudioCaptureService {
  private static audioContext: AudioContext | null = null;
  private static analyser: AnalyserNode | null = null;
  private static micStream: MediaStream | null = null;
  private static recognizer: SpeechRecognitionInstance | null = null;

  // MediaRecorder audio capture
  private static mediaRecorder: MediaRecorder | null = null;
  private static recordedChunks: Blob[] = [];
  private static recordingStartTime: number = 0;
  private static lastAudioUrl: string | null = null;
  private static isListening: boolean = false;
  private static confirmedHistory: string = "";
  private static latestTranscript: string = "";
  private static restartTimeout: ReturnType<typeof setTimeout> | null = null;

  // Enterprise Adaptive Phrase-Chunked Whisper streaming, Mobile Utterance Engine & Desktop VAD fields
  private static mobileStreamEngine: MobileLiveStreamEngine | null = null;
  private static lastTranscribeAllProvidersFailed: boolean = false;
  private static interimInterval: ReturnType<typeof setInterval> | null = null;
  private static vadInterval: ReturnType<typeof setInterval> | null = null;
  private static isTranscribingInterim: boolean = false;
  private static webSpeechEmittedInSession: boolean = false;
  private static voicedFramesDetected: number = 0;
  private static hadVoicedSpeechInSession: boolean = false;
  private static desktopMicVerifiedOptimal: boolean = false;

  /**
   * Returns whether the last real transcribeAudio() call failed across all configured providers/proxies
   */
  public static didLastTranscribeFailAllProviders(): boolean {
    return this.lastTranscribeAllProvidersFailed;
  }

  /**
   * Returns whether native Web Speech Recognition API is supported in current browser
   */
  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  /**
   * Returns the latest recognized live transcript
   */
  public static getLatestTranscript(): string {
    return this.latestTranscript;
  }

  /**
   * Requests microphone permission, selects optimal hardware input, and initializes live audio analyser
   */
  public static async initMicrophone(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const isMobile = isMobileDevice();
      const stream = await acquireOptimalMicStream(isMobile);
      this.desktopMicVerifiedOptimal = !isMobile;

      if (isMobile) {
        if (this.micStream && this.micStream !== stream) {
          try {
            this.micStream.getTracks().forEach((t) => t.stop());
          } catch {
            // ignore
          }
        }
        this.micStream = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          try {
            if (!this.audioContext || this.audioContext.state === "closed") {
              this.audioContext = new AudioCtx();
            }
            // Do NOT force audioContext.resume() on Mobile: prevents iOS WebKit / Android AudioFlinger session hijack
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 128;
            this.analyser.smoothingTimeConstant = 0.72;
            source.connect(this.analyser);
          } catch (ctxErr) {
            logger.warn("Passive mobile AudioContext notice:", ctxErr);
          }
        }
        return true;
      }

      this.setMicStream(stream);
      return true;
    } catch (err) {
      logger.warn("Microphone access permission notice:", err);
      return false;
    }
  }

  /**
   * Returns whether a physical live MediaStream track is actively connected (independent of recognizer flags)
   */
  public static hasLiveMicStream(): boolean {
    if (!this.micStream || !this.micStream.active) return false;
    const tracks = this.micStream.getAudioTracks();
    if (tracks.length === 0) return false;
    const hasLiveTrack = tracks.some((t) => t.readyState === "live" && t.enabled !== false);
    if (!hasLiveTrack) return false;
    if (
      !isMobileDevice() &&
      !this.desktopMicVerifiedOptimal &&
      tracks.some((t) => Boolean(t.label) && isVirtualLoopbackMicLabel(t.label))
    ) {
      return false;
    }
    return true;
  }

  /**
   * Returns whether a live, active microphone stream track or speech recognition is available
   */
  public static hasActiveMic(): boolean {
    if (this.isListening) return true;
    if (!!this.recognizer) return true;
    if (this.mobileStreamEngine) return true;
    if (this.mediaRecorder && this.mediaRecorder.state === "recording") return true;
    if (!this.micStream || !this.micStream.active) return false;
    const tracks = this.micStream.getAudioTracks();
    return tracks.length > 0 && tracks.some((t) => t.readyState === "live");
  }

  /**
   * Directly sets the active microphone MediaStream and hooks up the AnalyserNode
   */
  public static setMicStream(stream: MediaStream): void {
    if (this.micStream && this.micStream !== stream) {
      try {
        this.micStream.getTracks().forEach((t) => t.stop());
      } catch {
        // ignore
      }
    }
    this.micStream = stream;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      try {
        if (!this.audioContext || this.audioContext.state === "closed") {
          this.audioContext = new AudioCtx();
        }
        if (!isMobileDevice() && this.audioContext.state === "suspended") {
          void this.audioContext.resume();
        }
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.72;
        source.connect(this.analyser);
      } catch (err) {
        logger.warn("Error connecting external microphone stream to AudioContext:", err);
      }
    }
  }

  /**
   * Populates targetArray with live frequency bin bytes (0..255) from the active microphone.
   * Returns true if analyser was active, false otherwise.
   */
  public static getByteFrequencyData(targetArray: Uint8Array): boolean {
    if (!this.analyser) return false;
    try {
      this.analyser.getByteFrequencyData(targetArray as any);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns current live microphone amplitude (0 to 1)
   */
  public static getMicVolume(): number {
    if (!this.analyser) {
      if (this.isListening) {
        // Organic gentle pulse while listening on mobile
        const t = Date.now() / 300;
        return 0.18 + 0.10 * Math.sin(t);
      }
      return 0;
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    return Math.min(1, avg / 128);
  }

  /**
   * Starts Speech Recognition with continuous live interim results AND records raw audio via MediaRecorder.
   * Zero-lag, zero-overlap architecture with instant local streaming dictation.
   */
  public static startRecognition(options: {
    lang?: string | undefined;
    initialTranscript?: string | undefined;
    roleName?: string | undefined;
    question?: string | undefined;
    onTranscript: (transcript: string, isFinal: boolean) => void;
    onSpanishDetected?: (message: string) => void;
    onError?: (err: unknown) => void;
    onEnd?: () => void;
  }): SpeechRecognitionInstance | null {
    if (typeof window === "undefined") return null;

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
        .webkitSpeechRecognition;

    // Reset recording timer and object URLs
    if (this.lastAudioUrl) {
      try {
        URL.revokeObjectURL(this.lastAudioUrl);
      } catch {
        // ignore
      }
      this.lastAudioUrl = null;
    }
    this.recordedChunks = [];
    this.recordingStartTime = Date.now();
    const isMobile = isMobileDevice();

    if (this.mobileStreamEngine) {
      this.mobileStreamEngine.stopImmediate();
      this.mobileStreamEngine = null;
    }

    if (!isMobile && this.audioContext && this.audioContext.state === "suspended") {
      void this.audioContext.resume().catch(() => {});
    }

    // 1. Dual-Stream Audio Capture: Start MediaRecorder unconditionally across all devices (Desktop, iOS Safari, Android Chrome).
    // MediaRecorder runs continuously in the background collecting high-fidelity raw audio chunks for Whisper AI transcription.
    // This guarantees a 100% reliable safety net and produces the verídico audioBlob for final AI evaluation.
    const preferredMimeType = getBestAudioMimeType();
    if (this.micStream && typeof MediaRecorder !== "undefined") {
      try {
        let recorder: MediaRecorder;
        try {
          recorder = preferredMimeType
            ? new MediaRecorder(this.micStream, { mimeType: preferredMimeType })
            : new MediaRecorder(this.micStream);
        } catch {
          recorder = new MediaRecorder(this.micStream);
        }
        this.mediaRecorder = recorder;
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        // Collect chunks smoothly without hammering CPU
        recorder.start(100);
      } catch (recErr) {
        logger.warn("MediaRecorder start notice:", recErr);
      }
    }

    this.isListening = true;
    this.confirmedHistory = (options.initialTranscript || "").trim();
    this.latestTranscript = this.confirmedHistory;
    this.isTranscribingInterim = false;
    this.webSpeechEmittedInSession = false;
    this.voicedFramesDetected = 0;
    this.hadVoicedSpeechInSession = false;

    if (this.interimInterval) {
      clearInterval(this.interimInterval);
      this.interimInterval = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }

    let mobileEngineStarted = false;
    let triggerExclusiveMobileWebSpeech: (() => void) | null = null;

    // Platform-Isolated Live Transcription Engine:
    // - Mobile: Dedicated Utterance-Window Live Stream Engine (1.15s initial partial, 1.25s continuous stream,
    //   instant 420ms micro-pause commit + O(1) segment rotation) WITHOUT concurrent SpeechRecognition HAL contention.
    //   If all AI audio providers are unconfigured/unreachable on the phone, hands over cleanly to Exclusive Native Web Speech.
    // - Desktop PC: Native browser SpeechRecognition is primary (0 API calls during speech or silence).
    //   A lightweight 100ms acoustic VAD samples real hardware voice energy ONLY while Web Speech has emitted 0 words:
    //   * Silence / pauses -> 0 /transcribe calls (eliminates image.png spam).
    //   * Real human voice on physical mic + deaf Web Speech (e.g. virtual OS default mic like ASUS Utility, or Firefox/Brave)
    //     -> self-healing Whisper updates the live transcript ONLY during voiced speech windows.
    if (isMobile) {
      if (this.micStream && typeof MediaRecorder !== "undefined") {
        const engine = new MobileLiveStreamEngine({
          micStream: this.micStream,
          mimeType: preferredMimeType,
          initialTranscript: options.initialTranscript,
          roleName: options.roleName,
          question: options.question,
          getAnalyser: () => this.analyser,
          mergePhrases: mergePhrasesCleanly,
          transcribeFn: (blob, ctx) => AudioCaptureService.transcribeAudio(blob, ctx),
          didAllProvidersFail: () => AudioCaptureService.didLastTranscribeFailAllProviders(),
          onAllProvidersUnavailable: () => {
            if (triggerExclusiveMobileWebSpeech) {
              triggerExclusiveMobileWebSpeech();
            }
          },
          onTranscript: (text, isFinal) => {
            if (!this.isListening) return;
            this.hadVoicedSpeechInSession = true;
            this.latestTranscript = text;
            options.onTranscript(text, isFinal);
          },
          onSpanishDetected: (message) => {
            this.isListening = false;
            if (options.onSpanishDetected) {
              options.onSpanishDetected(message);
            }
          },
        });
        mobileEngineStarted = engine.start();
        if (mobileEngineStarted) {
          this.mobileStreamEngine = engine;
        }
      }
    } else {
      this.vadInterval = setInterval(() => {
        if (!this.isListening || this.webSpeechEmittedInSession) return;
        const energy = measureAnalyserVoiceEnergy(this.analyser);
        if (energy >= DESKTOP_SPEECH_ENERGY_THRESHOLD) {
          this.voicedFramesDetected += 1;
          if (this.voicedFramesDetected >= 2) {
            this.hadVoicedSpeechInSession = true;
          }
        }
      }, 100);

      const useDirectAiFallback = shouldUseAiLiveTranscription(false, Boolean(SpeechRecognitionAPI));
      this.interimInterval = setInterval(() => {
        if (!this.isListening || this.webSpeechEmittedInSession) return;
        const hasConfirmedVoice = useDirectAiFallback
          ? this.analyser
            ? this.voicedFramesDetected >= 2
            : true
          : this.voicedFramesDetected >= 2;
        if (!hasConfirmedVoice) return;

        if (this.recordedChunks.length > 0 && !this.isTranscribingInterim) {
          const mime = getBestAudioMimeType() || "audio/webm";
          const interimBlob = new Blob(this.recordedChunks, { type: mime });
          if (interimBlob.size > 800) {
            this.voicedFramesDetected = 0;
            this.isTranscribingInterim = true;
            const initialPrefix = (options.initialTranscript || "").trim();
            void AudioCaptureService.transcribeAudio(interimBlob, {
              roleName: options.roleName,
              question: options.question,
            })
              .then((res) => {
                if (!this.isListening || this.webSpeechEmittedInSession) return;
                if (res && res.text.trim()) {
                  const segmentText = res.text.trim();
                  const combined = initialPrefix
                    ? mergePhrasesCleanly(initialPrefix, segmentText)
                    : segmentText;
                  const liveCheck = detectLiveSpanishOrFiller(combined);
                  if (liveCheck.isSpanishOrFiller) {
                    this.isListening = false;
                    if (options.onSpanishDetected) {
                      options.onSpanishDetected(
                        liveCheck.message ||
                          "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista.",
                      );
                    }
                    return;
                  }
                  this.latestTranscript = combined;
                  options.onTranscript(combined, false);
                }
              })
              .catch(() => {
                // ignore interim error
              })
              .finally(() => {
                this.isTranscribingInterim = false;
              });
          }
        }
      }, 1800);
    }

    // 2. Prepare Web Speech Recognition (Instant 60fps streaming preview)
    if (!SpeechRecognitionAPI) {
      logger.info("[AudioCaptureService] Web Speech API not present; audio will transcribe via VAD-gated Whisper.");
      return null;
    }

    let consecutiveNetworkErrors = 0;

    const createAndStartRecognizer = (): SpeechRecognitionInstance | null => {
      try {
        if (this.recognizer) {
          const old = this.recognizer;
          this.recognizer = null;
          old.onresult = null;
          old.onerror = null;
          old.onend = null;
          try {
            old.abort();
          } catch {
            // ignore
          }
        }

        const recognizer = new SpeechRecognitionAPI();
        if (isMobile) {
          recognizer.continuous = false;
        } else {
          try {
            recognizer.continuous = true;
          } catch {
            recognizer.continuous = false;
          }
        }
        recognizer.interimResults = true;
        recognizer.lang = options.lang || "en-US";
        try {
          recognizer.maxAlternatives = 1;
        } catch {
          // ignore
        }

        let currentSessionFinal = "";

        recognizer.onresult = (event: SpeechRecognitionEventLike) => {
          consecutiveNetworkErrors = 0;
          let currentFinal = "";
          let currentInterim = "";

          // W3C Standard Web Speech API streaming accumulation with Android deduplication
          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (!item || !item[0]) continue;
            const text = (item[0].transcript || "").trim();
            if (!text) continue;

            if (item.isFinal) {
              currentFinal = currentFinal ? mergePhrasesCleanly(currentFinal, text) : text;
            } else {
              currentInterim = currentInterim ? mergePhrasesCleanly(currentInterim, text) : text;
            }
          }

          if (currentFinal || currentInterim) {
            this.webSpeechEmittedInSession = true;
            this.hadVoicedSpeechInSession = true;
            if (!isMobile) {
              if (this.vadInterval) {
                clearInterval(this.vadInterval);
                this.vadInterval = null;
              }
              if (this.interimInterval) {
                clearInterval(this.interimInterval);
                this.interimInterval = null;
              }
            }
          }

          currentSessionFinal = currentFinal.trim();
          const prefix = this.confirmedHistory.trim();
          let base = prefix;
          if (currentSessionFinal) {
            base = base ? mergePhrasesCleanly(base, currentSessionFinal) : currentSessionFinal;
          }

          const combined = currentInterim.trim()
            ? (base ? mergePhrasesCleanly(base, currentInterim.trim()) : currentInterim.trim())
            : base;

          this.latestTranscript = combined;

          const liveCheck = detectLiveSpanishOrFiller(combined);
          if (liveCheck.isSpanishOrFiller) {
            logger.info("[AudioCaptureService] Live Spanish or non-interview filler detected:", combined);
            this.isListening = false;
            try {
              recognizer.abort();
            } catch {
              // ignore
            }
            if (options.onSpanishDetected) {
              options.onSpanishDetected(
                liveCheck.message ||
                  "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista."
              );
            }
            return;
          }

          options.onTranscript(combined, false);
        };

        recognizer.onerror = (e) => {
          const errCode = (e as { error?: string })?.error;
          if (errCode === "no-speech" || errCode === "aborted") {
            return;
          }
          logger.warn("Speech recognition notice:", errCode || e);

          if (errCode === "network") {
            consecutiveNetworkErrors += 1;
            return;
          }

          // If user explicitly revoked or denied microphone permission
          if (errCode === "not-allowed" || errCode === "service-not-allowed") {
            if (AudioCaptureService.hasLiveMicStream()) {
              // If hardware mic is active and recording audio, Web Speech failure (e.g. in incognito/Safari/Brave)
              // must not crash or terminate the active recording session.
              return;
            }
            if (options.onError) options.onError(e);
            return;
          }

          // Mobile audio-capture collision recovery
          if (errCode === "audio-capture" && this.isListening) {
            if (this.restartTimeout) clearTimeout(this.restartTimeout);
            this.restartTimeout = setTimeout(() => {
              if (this.isListening) {
                try {
                  recognizer.start();
                } catch {
                  createAndStartRecognizer();
                }
              }
            }, 250);
            return;
          }

          if (options.onError) options.onError(e);
        };

        recognizer.onend = () => {
          // Commit current session final cleanly into confirmedHistory without dropping speech
          if (this.latestTranscript) {
            this.confirmedHistory = this.latestTranscript.trim();
          }

          // Auto-restart: maintain uninterrupted live dictation across natural pauses
          if (this.isListening && consecutiveNetworkErrors < 2) {
            if (this.restartTimeout) {
              clearTimeout(this.restartTimeout);
            }
            // Allow 120ms on mobile for Android Audio Server to cycle between utterances cleanly
            const restartDelay = isMobile ? 120 : 60;
            this.restartTimeout = setTimeout(() => {
              if (this.isListening && consecutiveNetworkErrors < 2) {
                try {
                  recognizer.start();
                } catch {
                  try {
                    createAndStartRecognizer();
                  } catch (restartErr) {
                    logger.warn("[AudioCaptureService] Auto-restart notice:", restartErr);
                  }
                }
              }
            }, restartDelay);
            return;
          }
          if (options.onEnd) options.onEnd();
        };

        try {
          recognizer.start();
        } catch (startErr) {
          if (recognizer.continuous) {
            try {
              recognizer.continuous = false;
              recognizer.start();
            } catch (retryErr) {
              throw retryErr;
            }
          } else {
            throw startErr;
          }
        }
        this.recognizer = recognizer;
        return recognizer;
      } catch (err) {
        logger.warn("Failed to start SpeechRecognition:", err);
        // Do not crash the recording session if mic hardware is actively capturing
        if (!AudioCaptureService.hasLiveMicStream() && options.onError) {
          options.onError(err);
        }
        return null;
      }
    };

    if (isMobile && mobileEngineStarted) {
      triggerExclusiveMobileWebSpeech = () => {
        if (!this.isListening || !SpeechRecognitionAPI) return;
        logger.info(
          "[AudioCaptureService] Mobile AI audio providers unreachable; releasing MediaStream for Exclusive Native SpeechRecognition",
        );
        if (this.mobileStreamEngine) {
          this.mobileStreamEngine.stopImmediate();
          this.mobileStreamEngine = null;
        }
        if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
          try {
            this.mediaRecorder.stop();
          } catch {
            // ignore
          }
          this.mediaRecorder = null;
        }
        this.recordedChunks = [];
        this.releaseMicStream();
        if (this.restartTimeout) clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          if (this.isListening) {
            createAndStartRecognizer();
          }
        }, 80);
      };
      // Do NOT start SpeechRecognition concurrently with MediaRecorder on Mobile (prevents Android/iOS HAL contention)
      return null;
    }

    return createAndStartRecognizer();
  }

  /**
   * Stops recognition and MediaRecorder, returning clean audio Blob and Object URL for playback
   */
  public static async stopAndGetAudio(): Promise<AudioCaptureResult> {
    this.isListening = false;
    let confirmedMobileTranscript: string | undefined;
    let pendingTailBlob: Blob | null | undefined;
    if (this.mobileStreamEngine) {
      const engine = this.mobileStreamEngine;
      this.mobileStreamEngine = null;
      try {
        const mobileStop = await engine.stopAndExtractTail();
        confirmedMobileTranscript = mobileStop.latestCombinedTranscript;
        pendingTailBlob = mobileStop.pendingTailBlob;
      } catch {
        // ignore
      }
    }
    if (this.interimInterval) {
      clearInterval(this.interimInterval);
      this.interimInterval = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    this.isTranscribingInterim = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    const hadVoicedSpeech = this.hadVoicedSpeechInSession || this.voicedFramesDetected >= 1;
    this.hadVoicedSpeechInSession = false;
    this.voicedFramesDetected = 0;
    this.webSpeechEmittedInSession = false;
    this.confirmedHistory = "";
    this.latestTranscript = "";
    if (this.recognizer) {
      const old = this.recognizer;
      this.recognizer = null;
      old.onresult = null;
      old.onerror = null;
      old.onend = null;
      try {
        old.abort();
      } catch {
        // ignore
      }
    }

    const durationSeconds =
      this.recordingStartTime > 0
        ? Math.max(1, Math.round((Date.now() - this.recordingStartTime) / 1000))
        : 0;
    this.recordingStartTime = 0;

    if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
      if (this.recordedChunks.length > 0) {
        const mime = getBestAudioMimeType() || "audio/webm";
        const blob = new Blob(this.recordedChunks, { type: mime });
        const url = URL.createObjectURL(blob);
        this.lastAudioUrl = url;
        return {
          audioBlob: blob,
          audioUrl: url,
          durationSeconds,
          hadVoicedSpeech,
          confirmedMobileTranscript,
          pendingTailBlob,
        };
      }
      return {
        audioBlob: null,
        audioUrl: null,
        durationSeconds,
        hadVoicedSpeech,
        confirmedMobileTranscript,
        pendingTailBlob,
      };
    }

    return new Promise<AudioCaptureResult>((resolve) => {
      if (!this.mediaRecorder) {
        resolve({
          audioBlob: null,
          audioUrl: null,
          durationSeconds,
          hadVoicedSpeech,
          confirmedMobileTranscript,
          pendingTailBlob,
        });
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const mime = this.mediaRecorder?.mimeType || getBestAudioMimeType() || "audio/webm";
          const blob = new Blob(this.recordedChunks, { type: mime });
          const url = URL.createObjectURL(blob);
          this.lastAudioUrl = url;
          this.mediaRecorder = null;
          resolve({
            audioBlob: blob,
            audioUrl: url,
            durationSeconds,
            hadVoicedSpeech,
            confirmedMobileTranscript,
            pendingTailBlob,
          });
        } catch (err) {
          logger.warn("Error creating audio blob:", err);
          resolve({
            audioBlob: null,
            audioUrl: null,
            durationSeconds,
            hadVoicedSpeech,
            confirmedMobileTranscript,
            pendingTailBlob,
          });
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch {
        resolve({
          audioBlob: null,
          audioUrl: null,
          durationSeconds,
          hadVoicedSpeech,
          confirmedMobileTranscript,
          pendingTailBlob,
        });
      }
    });
  }

  /**
   * Transcribes recorded audio via Whisper Large V3 Turbo / Edge Multimodal Audio.
   * Multi-Tier Architecture:
   * 1. Direct Edge Groq Whisper (client-to-cloud, ~150ms, zero server proxy bottleneck)
   * 2. Direct Edge OpenAI Whisper (fallback if user configured OpenAI key)
   * 3. Direct Edge Gemini Flash Audio (fallback if user configured Google Gemini key)
   * 4. Backend Proxies (ENV.apiUrl / CELAEST-CORE) with multi-provider failover
   */
  public static async transcribeAudio(
    audioBlob: Blob,
    _context?: { roleName?: string | undefined; question?: string | undefined },
  ): Promise<AudioTranscriptionResult | null> {
    this.lastTranscribeAllProvidersFailed = false;
    if (!audioBlob || audioBlob.size < 200) return null;

    const extension = audioBlob.type.includes("mp4")
      ? "mp4"
      : audioBlob.type.includes("aac")
        ? "m4a"
        : audioBlob.type.includes("ogg")
          ? "ogg"
          : audioBlob.type.includes("wav")
            ? "wav"
            : "webm";

    // 1. Direct Edge/Browser Groq Whisper (Ultra-fast, ~150ms, zero backend dependence)
    // NOTE: We deliberately do NOT pass a conditioning prompt to Whisper. Passing prompts causes Whisper
    // to auto-correct ESL grammatical errors or regurgitate prompt tokens ("Interview response in English answering").
    // Omitting prompt guarantees 100% literal, verbatim acoustic transcription of what the candidate actually spoke.
    try {
      const groqKeys = await providerKeyVault.getKeys("groq");
      for (const key of groqKeys) {
        if (!key || !key.trim()) continue;
        try {
          const directFormData = new FormData();
          directFormData.append("file", audioBlob, `speech.${extension}`);
          directFormData.append("model", "whisper-large-v3-turbo");
          directFormData.append("language", "en");
          directFormData.append("temperature", "0");
          directFormData.append("response_format", "verbose_json");

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          const groqResp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key.trim()}`,
            },
            body: directFormData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (groqResp.ok) {
            const data = (await groqResp.json()) as {
              text?: string;
              language?: string;
              duration?: number;
              avg_logprob?: number;
              no_speech_prob?: number;
            };
            const text = cleanVerbatimTranscription(data.text || "");
            if (text) {
              logger.info("[AudioCaptureService] Edge Whisper transcription successful via Groq:", {
                duration: data.duration,
                length: text.length,
                avgLogprob: data.avg_logprob,
                noSpeechProb: data.no_speech_prob,
              });
              return {
                text,
                language: (data.language || "en").toLowerCase().trim(),
                duration: data.duration,
                avgLogprob: data.avg_logprob,
                noSpeechProb: data.no_speech_prob,
              };
            }
            // Authoritative 200 OK silence/empty result: do not cascade silent audio across 5 backup endpoints
            if (data && typeof data === "object" && "text" in data) {
              return null;
            }
          } else {
            const errBody = await groqResp.text().catch(() => "");
            logger.warn(`[AudioCaptureService] Groq Whisper returned ${groqResp.status}:`, errBody);
          }
        } catch (keyErr) {
          logger.warn("[AudioCaptureService] Direct Groq key error:", keyErr);
        }
      }
    } catch (edgeErr) {
      logger.warn("[AudioCaptureService] Edge Groq Whisper attempt failed:", edgeErr);
    }

    // 2. Direct Edge OpenAI Whisper (if user configured an OpenAI key)
    try {
      const openaiKeys = await providerKeyVault.getKeys("openai");
      for (const key of openaiKeys) {
        if (!key || !key.trim()) continue;
        try {
          const directFormData = new FormData();
          directFormData.append("file", audioBlob, `speech.${extension}`);
          directFormData.append("model", "whisper-1");
          directFormData.append("language", "en");
          directFormData.append("temperature", "0");
          directFormData.append("response_format", "verbose_json");

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 7000);

          const openAiResp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key.trim()}`,
            },
            body: directFormData,
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (openAiResp.ok) {
            const data = (await openAiResp.json()) as {
              text?: string;
              language?: string;
              duration?: number;
              avg_logprob?: number;
              no_speech_prob?: number;
            };
            const text = cleanVerbatimTranscription(data.text || "");
            if (text) {
              return {
                text,
                language: (data.language || "en").toLowerCase().trim(),
                duration: data.duration,
                avgLogprob: data.avg_logprob,
                noSpeechProb: data.no_speech_prob,
              };
            }
            if (data && typeof data === "object" && "text" in data) {
              return null;
            }
          }
        } catch (openAiErr) {
          logger.warn("[AudioCaptureService] Direct OpenAI key error:", openAiErr);
        }
      }
    } catch (edgeOpenAiErr) {
      logger.warn("[AudioCaptureService] Edge OpenAI Whisper attempt failed:", edgeOpenAiErr);
    }

    // 3. Direct Edge Gemini Multimodal Audio (if user configured a Google Gemini key)
    const geminiResult = await transcribeWithGeminiEdge(audioBlob, cleanVerbatimTranscription);
    if (geminiResult.reachedProvider) {
      if (geminiResult.text) {
        return {
          text: geminiResult.text,
          language: "en",
        };
      }
      return null;
    }

    // 4. Backend Proxies: Try apiUrl first, then direct Render backend, then coreAiUrl
    const candidateEndpoints: string[] = [];
    if (ENV.apiUrl) {
      candidateEndpoints.push(`${ENV.apiUrl}/interview/transcribe`);
      candidateEndpoints.push(`${ENV.apiUrl}/ai/audio/transcribe`);
    }

    const defaultBackTranscribe = "https://celaest-english-back.onrender.com/api/v1/interview/transcribe";
    if (!candidateEndpoints.includes(defaultBackTranscribe)) {
      candidateEndpoints.push(defaultBackTranscribe);
    }

    const publicBackTranscribe = "https://celaest-english-back.onrender.com/ai/audio/transcribe";
    if (!candidateEndpoints.includes(publicBackTranscribe)) {
      candidateEndpoints.push(publicBackTranscribe);
    }

    const isLocalhostInProd =
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      ENV.coreAiUrl.includes("127.0.0.1");

    if (ENV.coreAiUrl && !isLocalhostInProd && !candidateEndpoints.includes(`${ENV.coreAiUrl}/ai/audio/transcribe`)) {
      candidateEndpoints.push(`${ENV.coreAiUrl}/ai/audio/transcribe`);
    }

    const defaultCoreTranscribe = "https://celaest-core.onrender.com/api/v1/ai/audio/transcribe";
    if (!candidateEndpoints.includes(defaultCoreTranscribe)) {
      candidateEndpoints.push(defaultCoreTranscribe);
    }

    const activeToken = typeof window !== "undefined" ? localStorage.getItem("lingua_access_token") : null;

    for (const endpoint of candidateEndpoints) {
      try {
        const formData = new FormData();
        formData.append("file", audioBlob, `recording.${extension}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500);

        const headers: Record<string, string> = {};
        if (activeToken) {
          headers["Authorization"] = `Bearer ${activeToken.trim()}`;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = (await response.json()) as any;
          const isExplicitFailure =
            raw && typeof raw === "object" && "success" in raw && raw.success === false;
          if (!isExplicitFailure) {
            const data =
              raw && typeof raw === "object" && "data" in raw && raw.data
                ? raw.data
                : raw;
            const hasTranscriptField =
              data && typeof data === "object" && ("transcript" in data || "text" in data);
            const text = cleanVerbatimTranscription(data?.transcript || data?.text || "");
            if (text) {
              return {
                text,
                language: (data.language || "").toLowerCase().trim(),
                duration: data.duration,
                avgLogprob: data.avg_logprob ?? data.avgLogprob,
                noSpeechProb: data.no_speech_prob ?? data.noSpeechProb,
              };
            }
            if (hasTranscriptField) {
              return null;
            }
          }
        }
      } catch (proxyErr) {
        logger.warn(`[AudioCaptureService] Proxy transcription failed for ${endpoint}:`, proxyErr);
      }
    }

    this.lastTranscribeAllProvidersFailed = true;
    return null;
  }

  /**
   * Stops recognition
   */
  public static stop(): void {
    this.isListening = false;
    if (this.mobileStreamEngine) {
      this.mobileStreamEngine.stopImmediate();
      this.mobileStreamEngine = null;
    }
    if (this.interimInterval) {
      clearInterval(this.interimInterval);
      this.interimInterval = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    this.isTranscribingInterim = false;
    this.voicedFramesDetected = 0;
    this.hadVoicedSpeechInSession = false;
    this.webSpeechEmittedInSession = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    this.confirmedHistory = "";
    this.latestTranscript = "";
    if (this.recognizer) {
      const old = this.recognizer;
      this.recognizer = null;
      old.onresult = null;
      old.onerror = null;
      old.onend = null;
      try {
        old.abort();
      } catch {
        // ignore
      }
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
      this.mediaRecorder = null;
    }
  }

  /**
   * Releases hardware microphone MediaStream tracks so browser/OS recording indicators turn off
   */
  public static releaseMicStream(): void {
    this.desktopMicVerifiedOptimal = false;
    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.micStream = null;
    }
  }

  /**
   * Completely cleans up audio stream and object URLs on unmount
   */
  public static cleanup(): void {
    this.stop();
    if (this.lastAudioUrl) {
      try {
        URL.revokeObjectURL(this.lastAudioUrl);
      } catch {
        // ignore
      }
      this.lastAudioUrl = null;
    }
    this.releaseMicStream();
    if (this.audioContext && this.audioContext.state !== "closed") {
      try {
        this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
      this.analyser = null;
    }
  }
}
