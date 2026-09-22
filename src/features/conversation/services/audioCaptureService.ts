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
  private static accumulatedTranscript: string = "";
  private static latestTranscript: string = "";
  private static restartTimeout: ReturnType<typeof setTimeout> | null = null;
  private static rollingTranscribeInterval: ReturnType<typeof setInterval> | null = null;
  private static isTranscribingRolling: boolean = false;
  private static lastWebSpeechTime: number = 0;

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
    if (!this.analyser) return 0;
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
   * Dual-Stream Architecture:
   * 1. Web Speech API (interim preview on desktop, non-continuous with instant restart on mobile)
   * 2. Rolling Whisper Transcriber (~2.2s ticker on mobile or when Web Speech is silent/unsupported)
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

    const isMobile =
      typeof window !== "undefined" &&
      typeof navigator !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 && !("MSStream" in (window as unknown as Record<string, unknown>))));

    // 1. Prepare MediaRecorder capture
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
    this.lastWebSpeechTime = 0;
    this.isTranscribingRolling = false;

    if (this.rollingTranscribeInterval) {
      clearInterval(this.rollingTranscribeInterval);
      this.rollingTranscribeInterval = null;
    }

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
        // Slice chunks every 250ms for low-latency live buffer access
        recorder.start(250);
      } catch (recErr) {
        logger.warn("MediaRecorder start notice:", recErr);
      }
    }

    this.isListening = true;
    this.accumulatedTranscript = (options.initialTranscript || "").trim();

    // 2. Rolling Live Whisper Transcriber (Zero-failure mobile & fallback engine)
    const startRollingTranscriber = () => {
      if (this.rollingTranscribeInterval) {
        clearInterval(this.rollingTranscribeInterval);
      }

      this.rollingTranscribeInterval = setInterval(async () => {
        if (!this.isListening) return;

        // If Web Speech API has actively emitted a transcript within the last 2.2 seconds,
        // do not duplicate with Whisper (desktop Chrome Web Speech is already streaming real-time)
        if (this.lastWebSpeechTime > 0 && Date.now() - this.lastWebSpeechTime < 2200) {
          return;
        }

        if (this.isTranscribingRolling) return;
        if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") return;

        // Flush latest audio chunk into recordedChunks
        try {
          if (this.mediaRecorder.state === "recording") {
            this.mediaRecorder.requestData();
          }
        } catch {
          // ignore
        }

        if (this.recordedChunks.length === 0) return;

        const mime = this.mediaRecorder?.mimeType || getBestAudioMimeType() || "audio/webm";
        const currentBlob = new Blob(this.recordedChunks, { type: mime });

        // Skip if buffer is under 1200 bytes (too small to contain actual speech)
        if (currentBlob.size < 1200) return;

        this.isTranscribingRolling = true;
        try {
          const whisperResult = await AudioCaptureService.transcribeAudio(currentBlob, {
            ...(options.roleName ? { roleName: options.roleName } : {}),
            ...(options.question ? { question: options.question } : {}),
          });

          if (!this.isListening || !whisperResult) return;

          const rawText = whisperResult.text.trim();
          if (rawText.length > 0) {
            // If Web Speech produced text in the meantime, preserve Web Speech
            if (this.lastWebSpeechTime > 0 && Date.now() - this.lastWebSpeechTime < 1500) {
              return;
            }

            const prefix = this.accumulatedTranscript ? this.accumulatedTranscript + " " : "";
            const combined = (prefix + rawText).replace(/\s+/g, " ").trim();
            this.latestTranscript = combined;

            const liveCheck = detectLiveSpanishOrFiller(combined);
            if (liveCheck.isSpanishOrFiller) {
              logger.info("[AudioCaptureService] Rolling transcript detected Spanish/filler:", combined);
              this.isListening = false;
              AudioCaptureService.stop();
              if (options.onSpanishDetected) {
                options.onSpanishDetected(
                  liveCheck.message ||
                    "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista."
                );
              }
              return;
            }

            options.onTranscript(combined, false);
          }
        } catch (err) {
          logger.warn("[AudioCaptureService] Rolling live transcribe notice:", err);
        } finally {
          this.isTranscribingRolling = false;
        }
      }, 2200);
    };

    startRollingTranscriber();

    // 3. Prepare Web Speech Recognition (for instant streaming preview when supported)
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      logger.info("[AudioCaptureService] Web Speech API not present; relying on rolling Whisper transcriber.");
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
        // Crucial for mobile (iOS Safari / Android Chrome):
        // continuous: true causes WebKit / Safari to abort immediately with 0 results.
        // On mobile, continuous: false with automatic restart on onend ensures continuous recognition.
        recognizer.continuous = !isMobile;
        recognizer.interimResults = true;
        recognizer.lang = options.lang || "en-US";

        let currentSessionFinal = "";

        recognizer.onresult = (event: SpeechRecognitionEventLike) => {
          this.lastWebSpeechTime = Date.now();
          let sessionFinal = "";
          let sessionInterim = "";

          // Web Speech API: Reconstruct session results fresh from 0 to length - 1.
          // Never accumulate with += across events, as event.results already contains prior finalized results.
          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              const text = item[0].transcript;
              if (item.isFinal) {
                sessionFinal += " " + text;
              } else {
                sessionInterim += " " + text;
              }
            }
          }

          currentSessionFinal = sessionFinal.trim();

          const prefix = this.accumulatedTranscript ? this.accumulatedTranscript + " " : "";
          const combined = (
            prefix +
            currentSessionFinal +
            " " +
            sessionInterim
          )
            .replace(/\s+/g, " ")
            .trim();

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

          // Suppress non-fatal errors on mobile or when hardware mic is actively capturing
          if (isMobile || AudioCaptureService.hasActiveMic()) {
            if (
              errCode === "audio-capture" ||
              errCode === "not-allowed" ||
              errCode === "service-not-allowed"
            ) {
              logger.info("[AudioCaptureService] Web Speech error suppressed on mobile; rolling transcriber active:", errCode);
              return;
            }
          }

          if (options.onError) options.onError(e);
        };

        recognizer.onend = () => {
          if (this.latestTranscript) {
            this.accumulatedTranscript = this.latestTranscript;
          } else if (currentSessionFinal) {
            this.accumulatedTranscript = (
              (this.accumulatedTranscript ? this.accumulatedTranscript + " " : "") +
              currentSessionFinal
            )
              .replace(/\s+/g, " ")
              .trim();
          }
          currentSessionFinal = "";

          // Auto-restart: on mobile, each utterance triggers onend naturally when continuous: false.
          // Debounced auto-restart maintains uninterrupted live dictation without crashing WebKit/Android.
          if (this.isListening) {
            if (this.restartTimeout) {
              clearTimeout(this.restartTimeout);
            }
            this.restartTimeout = setTimeout(() => {
              if (this.isListening) {
                createAndStartRecognizer();
              }
            }, isMobile ? 150 : 350);
            return;
          }
          if (options.onEnd) options.onEnd();
        };

        recognizer.start();
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
    if (this.rollingTranscribeInterval) {
      clearInterval(this.rollingTranscribeInterval);
      this.rollingTranscribeInterval = null;
    }
    this.isTranscribingRolling = false;
    this.lastWebSpeechTime = 0;
    this.latestTranscript = "";
    this.accumulatedTranscript = "";
    if (this.recognizer) {
      try {
        this.recognizer.abort();
      } catch {
        // ignore
      }
      this.recognizer = null;
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
      return { audioBlob: null, audioUrl: null, durationSeconds: 0 };
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
    if (this.rollingTranscribeInterval) {
      clearInterval(this.rollingTranscribeInterval);
      this.rollingTranscribeInterval = null;
    }
    this.isTranscribingRolling = false;
    this.lastWebSpeechTime = 0;
    this.latestTranscript = "";
    this.accumulatedTranscript = "";
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
