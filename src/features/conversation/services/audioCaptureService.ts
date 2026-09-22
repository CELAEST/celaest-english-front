/**
 * Audio Capture & Real-Time Speech Recognition Service
 * Handles microphone hardware access, live frequency analysis,
 * and robust SpeechRecognition for English & Spanish with continuous streaming.
 */

import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { detectLiveSpanishOrFiller } from "./speechIntelligibilityGuard";

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
}

export interface AudioTranscriptionResult {
  text: string;
  language?: string | undefined;
  duration?: number | undefined;
  avgLogprob?: number | undefined;
  noSpeechProb?: number | undefined;
}

/**
 * Detects whether the current device is a mobile phone or tablet
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && !("MSStream" in (window as unknown as Record<string, unknown>)))
  );
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

  // 2. If history already ends with or includes the new phrase, preserve history
  if (hClean.endsWith(nClean) || hClean.includes(nClean) || hLower.endsWith(nLower) || hLower.includes(nLower)) {
    return h;
  }

  const hWords = h.split(/\s+/);
  const nWords = n.split(/\s+/);

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
   * Requests microphone permission and initializes live audio analyser
   */
  public static async initMicrophone(): Promise<boolean> {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          channelCount: 1,
        },
      });
      this.micStream = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.72;
        source.connect(this.analyser);
      }

      return true;
    } catch (err) {
      logger.warn("Microphone access permission notice:", err);
      return false;
    }
  }

  /**
   * Returns whether a live, active microphone stream track is available
   */
  public static hasActiveMic(): boolean {
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
        if (this.audioContext.state === "suspended") {
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

    const isMobile = isMobileDevice();
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

    // 1. Mobile Exclusive Microphone Access Protocol:
    // On Android (Chrome) and iOS (Safari), hardware microphone access is strictly exclusive.
    // If getUserMedia or MediaRecorder holds an active audio track, SpeechRecognition fails
    // immediately with 'audio-capture' or silent death.
    // When SpeechRecognition is supported on mobile, release any getUserMedia tracks and
    // do NOT run MediaRecorder in parallel so native SpeechRecognition has 100% exclusive mic access.
    if (isMobile && SpeechRecognitionAPI) {
      if (this.micStream) {
        try {
          this.micStream.getTracks().forEach((track) => track.stop());
        } catch {
          // ignore
        }
        this.micStream = null;
      }
      this.mediaRecorder = null;
    } else {
      // On desktop (or mobile browsers without Web Speech API), capture audio via MediaRecorder
      if (this.micStream) {
        try {
          const mimeType = getBestAudioMimeType();
          let recorder: MediaRecorder;
          try {
            recorder = mimeType
              ? new MediaRecorder(this.micStream, { mimeType })
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
    }

    this.isListening = true;
    this.confirmedHistory = (options.initialTranscript || "").trim();
    this.latestTranscript = this.confirmedHistory;

    // 2. Prepare Web Speech Recognition (Instant 60fps streaming preview)
    if (!SpeechRecognitionAPI) {
      logger.info("[AudioCaptureService] Web Speech API not present; audio will transcribe on turn finish via Whisper.");
      return null;
    }

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
        try {
          // On mobile, continuous: false prevents Android Chrome from accumulating multi-item arrays in event.results
          recognizer.continuous = !isMobile;
        } catch {
          recognizer.continuous = false;
        }
        recognizer.interimResults = true;
        recognizer.lang = options.lang || "en-US";

        let currentSessionFinal = "";

        recognizer.onresult = (event: SpeechRecognitionEventLike) => {
          let sessionFinal = "";
          let sessionInterim = "";

          // Web Speech API: Reconstruct session results fresh using deduplication.
          // On Android Chrome, event.results may contain multiple cumulative or repeated items.
          // Merging with mergePhrasesCleanly guarantees zero-multiplication across items.
          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              const text = (item[0].transcript || "").trim();
              if (!text) continue;

              if (item.isFinal) {
                sessionFinal = sessionFinal ? mergePhrasesCleanly(sessionFinal, text) : text;
              } else {
                sessionInterim = sessionInterim ? mergePhrasesCleanly(sessionInterim, text) : text;
              }
            }
          }

          currentSessionFinal = sessionFinal.trim();
          const interimTrim = sessionInterim.trim();

          // Merge confirmed history with current session final and interim results cleanly
          const withFinal = mergePhrasesCleanly(this.confirmedHistory, currentSessionFinal);
          const combined = interimTrim ? mergePhrasesCleanly(withFinal, interimTrim) : withFinal;

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

          // If user explicitly revoked or denied microphone permission
          if (errCode === "not-allowed" || errCode === "service-not-allowed") {
            if (!isMobile && AudioCaptureService.hasActiveMic()) {
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
                createAndStartRecognizer();
              }
            }, 300);
            return;
          }

          if (options.onError) options.onError(e);
        };

        recognizer.onend = () => {
          // Commit current session final cleanly into confirmedHistory without repetition
          if (currentSessionFinal) {
            this.confirmedHistory = mergePhrasesCleanly(this.confirmedHistory, currentSessionFinal);
            currentSessionFinal = "";
          }

          // Auto-restart: maintain uninterrupted live dictation across natural pauses
          if (this.isListening) {
            if (this.restartTimeout) {
              clearTimeout(this.restartTimeout);
            }
            this.restartTimeout = setTimeout(() => {
              if (this.isListening) {
                createAndStartRecognizer();
              }
            }, isMobile ? 100 : 200);
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
        if (!AudioCaptureService.hasActiveMic() && options.onError) {
          options.onError(err);
        }
        return null;
      }
    };

    return createAndStartRecognizer();
  }

  /**
   * Stops recognition and MediaRecorder, returning clean audio Blob and Object URL for playback
   */
  public static async stopAndGetAudio(): Promise<AudioCaptureResult> {
    this.isListening = false;
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
        return { audioBlob: blob, audioUrl: url, durationSeconds };
      }
      return { audioBlob: null, audioUrl: null, durationSeconds };
    }

    return new Promise<AudioCaptureResult>((resolve) => {
      if (!this.mediaRecorder) {
        resolve({ audioBlob: null, audioUrl: null, durationSeconds });
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          const mime = this.mediaRecorder?.mimeType || getBestAudioMimeType() || "audio/webm";
          const blob = new Blob(this.recordedChunks, { type: mime });
          const url = URL.createObjectURL(blob);
          this.lastAudioUrl = url;
          this.mediaRecorder = null;
          resolve({ audioBlob: blob, audioUrl: url, durationSeconds });
        } catch (err) {
          logger.warn("Error creating audio blob:", err);
          resolve({ audioBlob: null, audioUrl: null, durationSeconds });
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch {
        resolve({ audioBlob: null, audioUrl: null, durationSeconds });
      }
    });
  }

  /**
   * Transcribes recorded audio via Whisper Large V3 Turbo.
   * Multi-Tier Architecture:
   * 1. Direct Edge Groq Whisper (client-to-cloud, ~150ms, zero server proxy bottleneck)
   * 2. Direct Edge OpenAI Whisper (fallback if user configured OpenAI key)
   * 3. Backend Proxies (ENV.apiUrl / CELAEST-CORE) with multi-provider failover
   */
  public static async transcribeAudio(
    audioBlob: Blob,
    context?: { roleName?: string | undefined; question?: string | undefined },
  ): Promise<AudioTranscriptionResult | null> {
    if (!audioBlob || audioBlob.size < 200) return null;

    const extension = audioBlob.type.includes("mp4")
      ? "mp4"
      : audioBlob.type.includes("ogg")
        ? "ogg"
        : audioBlob.type.includes("wav")
          ? "wav"
          : "webm";

    const roleName = context?.roleName || "";
    const question = context?.question || "";
    const prompt = question
      ? `ESL non-native English learner practice${roleName ? ` for ${roleName}` : ""}. Question: "${question}". Transcribe VERBATIM exactly as spoken, preserving all broken grammar, tense mistakes, and ungrammatical phrases without correcting them (e.g. it use, for to, most challenge, I design, we has):`
      : `ESL non-native English learner practice${roleName ? ` for ${roleName}` : ""}. Transcribe VERBATIM exactly as spoken, preserving all broken grammar, tense mistakes, and ungrammatical phrases without correcting them (e.g. it use, for to, most challenge, I design, we has):`;

    // 1. Direct Edge/Browser Groq Whisper (Ultra-fast, ~150ms, zero backend dependence)
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
          directFormData.append("prompt", prompt);

          const groqResp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key.trim()}`,
            },
            body: directFormData,
          });

          if (groqResp.ok) {
            const data = (await groqResp.json()) as {
              text?: string;
              language?: string;
              duration?: number;
              avg_logprob?: number;
              no_speech_prob?: number;
            };
            const text = (data.text || "").trim();
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
          directFormData.append("prompt", prompt);

          const openAiResp = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key.trim()}`,
            },
            body: directFormData,
          });

          if (openAiResp.ok) {
            const data = (await openAiResp.json()) as {
              text?: string;
              language?: string;
              duration?: number;
              avg_logprob?: number;
              no_speech_prob?: number;
            };
            const text = (data.text || "").trim();
            if (text) {
              return {
                text,
                language: (data.language || "en").toLowerCase().trim(),
                duration: data.duration,
                avgLogprob: data.avg_logprob,
                noSpeechProb: data.no_speech_prob,
              };
            }
          }
        } catch (openAiErr) {
          logger.warn("[AudioCaptureService] Direct OpenAI key error:", openAiErr);
        }
      }
    } catch (edgeOpenAiErr) {
      logger.warn("[AudioCaptureService] Edge OpenAI Whisper attempt failed:", edgeOpenAiErr);
    }

    // 3. Backend Proxies: Try apiUrl first (celaest-english-back on Render), then coreAiUrl
    const candidateEndpoints: string[] = [];
    if (ENV.apiUrl) {
      candidateEndpoints.push(`${ENV.apiUrl}/interview/transcribe`);
      candidateEndpoints.push(`${ENV.apiUrl}/ai/audio/transcribe`);
    }

    const isLocalhostInProd =
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      ENV.coreAiUrl.includes("127.0.0.1");

    if (ENV.coreAiUrl && !isLocalhostInProd && !candidateEndpoints.includes(`${ENV.coreAiUrl}/ai/audio/transcribe`)) {
      candidateEndpoints.push(`${ENV.coreAiUrl}/ai/audio/transcribe`);
    }

    for (const endpoint of candidateEndpoints) {
      try {
        const formData = new FormData();
        formData.append("file", audioBlob, `recording.${extension}`);
        if (context?.roleName) formData.append("role", context.roleName);
        if (context?.question) formData.append("question", context.question);

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const raw = (await response.json()) as any;
          const data =
            raw && typeof raw === "object" && "data" in raw && raw.data
              ? raw.data
              : raw;
          const text = (data.transcript || data.text || "").trim();
          if (text) {
            return {
              text,
              language: (data.language || "").toLowerCase().trim(),
              duration: data.duration,
              avgLogprob: data.avg_logprob ?? data.avgLogprob,
              noSpeechProb: data.no_speech_prob ?? data.noSpeechProb,
            };
          }
        }
      } catch (proxyErr) {
        logger.warn(`[AudioCaptureService] Proxy transcription failed for ${endpoint}:`, proxyErr);
      }
    }

    return null;
  }

  /**
   * Stops recognition
   */
  public static stop(): void {
    this.isListening = false;
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
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }
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
