/**
 * Audio Capture & Real-Time Speech Recognition Service
 * Handles microphone hardware access, live frequency analysis,
 * and robust SpeechRecognition for English & Spanish with continuous streaming.
 */

import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

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
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/wav",
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export interface AudioCaptureResult {
  audioBlob: Blob | null;
  audioUrl: string | null;
  durationSeconds: number;
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
          autoGainControl: true,
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
        this.analyser.fftSize = 64;
        source.connect(this.analyser);
      }

      return true;
    } catch (err) {
      logger.warn("Microphone access permission notice:", err);
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
   * Starts Speech Recognition with continuous live interim results AND records raw audio via MediaRecorder
   */
  public static startRecognition(options: {
    lang?: string;
    onTranscript: (transcript: string, isFinal: boolean) => void;
    onError?: (err: unknown) => void;
    onEnd?: () => void;
  }): SpeechRecognitionInstance | null {
    if (typeof window === "undefined") return null;

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

    if (this.micStream) {
      try {
        const mimeType = getBestAudioMimeType();
        const recorder = mimeType
          ? new MediaRecorder(this.micStream, { mimeType })
          : new MediaRecorder(this.micStream);
        this.mediaRecorder = recorder;
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        recorder.start(100);
      } catch (recErr) {
        logger.warn("MediaRecorder start notice:", recErr);
      }
    }

    // 2. Prepare Web Speech Recognition (for instant streaming preview)
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
        .webkitSpeechRecognition;

    this.isListening = true;
    this.accumulatedTranscript = "";

    if (!SpeechRecognitionAPI) {
      logger.warn("Speech Recognition API not supported on this browser.");
      return null;
    }

    const createAndStartRecognizer = (): SpeechRecognitionInstance | null => {
      try {
        if (this.recognizer) {
          try {
            this.recognizer.abort();
          } catch {
            // ignore
          }
        }

        const recognizer = new SpeechRecognitionAPI();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = options.lang || "en-US";

        let sessionFinalTranscript = "";

        recognizer.onresult = (event: SpeechRecognitionEventLike) => {
          let currentInterim = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              const text = item[0].transcript;
              if (item.isFinal) {
                sessionFinalTranscript += " " + text;
              } else {
                currentInterim += " " + text;
              }
            }
          }

          const combined = (
            this.accumulatedTranscript +
            " " +
            sessionFinalTranscript +
            " " +
            currentInterim
          )
            .replace(/\s+/g, " ")
            .trim();

          options.onTranscript(combined, false);
        };

        recognizer.onerror = (e) => {
          const errCode = e?.error;
          if (errCode === "no-speech") {
            return;
          }
          logger.warn("Speech recognition notice:", errCode || e);
          if (options.onError) options.onError(e);
        };

        recognizer.onend = () => {
          this.accumulatedTranscript = (this.accumulatedTranscript + " " + sessionFinalTranscript)
            .replace(/\s+/g, " ")
            .trim();
          sessionFinalTranscript = "";

          // If the user hasn't explicitly stopped, auto-restart to prevent silence disconnects
          if (this.isListening) {
            try {
              recognizer.start();
              return;
            } catch {
              setTimeout(() => {
                if (this.isListening) {
                  createAndStartRecognizer();
                }
              }, 120);
              return;
            }
          }
          if (options.onEnd) options.onEnd();
        };

        recognizer.start();
        this.recognizer = recognizer;
        return recognizer;
      } catch (err) {
        logger.warn("Failed to start SpeechRecognition:", err);
        if (options.onError) options.onError(err);
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
    this.accumulatedTranscript = "";
    if (this.recognizer) {
      try {
        this.recognizer.stop();
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
   * Transcribes recorded audio via Groq Whisper large-v3-turbo (running on CELAEST-CORE IA-Mesh)
   */
  public static async transcribeAudio(audioBlob: Blob): Promise<string | null> {
    if (!audioBlob || audioBlob.size < 200) return null;

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes("mp4")
        ? "mp4"
        : audioBlob.type.includes("ogg")
          ? "ogg"
          : audioBlob.type.includes("wav")
            ? "wav"
            : "webm";

      formData.append("file", audioBlob, `recording.${extension}`);

      const response = await fetch(`${ENV.coreAiUrl}/ai/audio/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as { text?: string; transcript?: string };
        const text = (data.transcript || data.text || "").trim();
        if (text) {
          return text;
        }
      }
    } catch (err) {
      logger.warn("Whisper transcription via core error:", err);
    }

    return null;
  }

  /**
   * Stops recognition
   */
  public static stop(): void {
    this.isListening = false;
    this.accumulatedTranscript = "";
    if (this.recognizer) {
      try {
        this.recognizer.stop();
      } catch {
        // ignore
      }
      this.recognizer = null;
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
