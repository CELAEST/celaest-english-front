import { KokoroTTS } from "kokoro-js";
import { logger } from "../../../shared/utils/logger";

export interface KokoroVoiceProfile {
  id: string;
  name: string;
  displayName: string;
  gender: "Female" | "Male";
  locale: "en-US" | "en-GB";
  accent: "American" | "British";
  tag: string;
  description: string;
  sampleText: string;
}

export const KOKORO_VOICES: KokoroVoiceProfile[] = [
  {
    id: "af_heart",
    name: "Heart",
    displayName: "Heart · Warm & Human (#1 Rated)",
    gender: "Female",
    locale: "en-US",
    accent: "American",
    tag: "Studio Grade",
    description: "The most praised open-source neural voice in the world. Organic breathing, lifelike warmth, and zero robotic artifacts.",
    sampleText: "Welcome to CELAEST English. This is the Kokoro neural voice engine running entirely inside your browser.",
  },
  {
    id: "am_adam",
    name: "Adam",
    displayName: "Adam · Executive Tech Lead",
    gender: "Male",
    locale: "en-US",
    accent: "American",
    tag: "Executive",
    description: "Deep, authoritative, and articulate American male voice. Ideal for senior engineering interview simulations.",
    sampleText: "Could you walk me through your distributed architecture and how you handle partition tolerance?",
  },
  {
    id: "af_bella",
    name: "Bella",
    displayName: "Bella · Conversational & Bright",
    gender: "Female",
    locale: "en-US",
    accent: "American",
    tag: "Conversational",
    description: "Vibrant, friendly, and natural conversational cadence. Excellent for interactive reading and ESL tutoring.",
    sampleText: "Notice how active listening and concise articulation build immediate trust in cross-functional squads.",
  },
  {
    id: "am_michael",
    name: "Michael",
    displayName: "Michael · Dynamic Podcaster",
    gender: "Male",
    locale: "en-US",
    accent: "American",
    tag: "Storyteller",
    description: "Modern, engaging male voice with natural pacing. Perfect for case studies, stories, and articles.",
    sampleText: "Today's case study explores how high-performing teams reduce cognitive load through clean documentation.",
  },
  {
    id: "af_sarah",
    name: "Sarah",
    displayName: "Sarah · Crisp Professional",
    gender: "Female",
    locale: "en-US",
    accent: "American",
    tag: "Professional",
    description: "Crystal clear enunciation and steady cadence. Suited for formal business reviews and presentations.",
    sampleText: "Our primary objective is aligning technical milestones with core product value deliverables.",
  },
  {
    id: "bf_emma",
    name: "Emma",
    displayName: "Emma · British Oxford Elegant",
    gender: "Female",
    locale: "en-GB",
    accent: "British",
    tag: "Academic",
    description: "Refined, authentic British Received Pronunciation. Superb for academic comprehension and international English.",
    sampleText: "I should like to direct your attention to the strategic implications of our upcoming platform release.",
  },
  {
    id: "bm_george",
    name: "George",
    displayName: "George · British Contemporary",
    gender: "Male",
    locale: "en-GB",
    accent: "British",
    tag: "Natural",
    description: "Natural, grounded modern British male cadence for realistic international interview practice.",
    sampleText: "Right then, let's take a closer look at the telemetry data from our automated deployment pipeline.",
  },
  {
    id: "bf_isabella",
    name: "Isabella",
    displayName: "Isabella · British Storyteller",
    gender: "Female",
    locale: "en-GB",
    accent: "British",
    tag: "Storyteller",
    description: "Melodic and expressive British female voice for immersive narrative reading.",
    sampleText: "As the system expanded across distributed nodes, asynchronous event streaming ensured high availability.",
  },
  {
    id: "bm_lewis",
    name: "Lewis",
    displayName: "Lewis · British Composed",
    gender: "Male",
    locale: "en-GB",
    accent: "British",
    tag: "Composed",
    description: "Clear and calm British male cadence with steady intonation.",
    sampleText: "Consistent practice in natural conversation is the fastest route to professional language mastery.",
  },
];

class KokoroVoiceService {
  private ttsInstance: KokoroTTS | null = null;
  private isLoading = false;
  private loadPromise: Promise<KokoroTTS> | null = null;
  private audioBlobCache = new Map<string, string>();

  /**
   * Initializes the Kokoro-82M ONNX model using WebGPU (with WASM fallback).
   * Caches model weights in IndexedDB/CacheStorage after initial download.
   */
  public async getTTS(
    onProgress?: (progress: number, text: string) => void,
  ): Promise<KokoroTTS> {
    if (this.ttsInstance) {
      return this.ttsInstance;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;
    this.loadPromise = (async () => {
      try {
        logger.info("[KokoroTTS] Loading Kokoro-82M ONNX model into browser...");
        if (onProgress) onProgress(10, "Initializing WebAssembly / WebGPU Runtime...");

        // Use WASM with Q8 quantization for universal compatibility across all browsers
        const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
          dtype: "q8",
          device: "wasm",
          progress_callback: (item: any) => {
            if (onProgress && item && typeof item.progress === "number") {
              const pct = Math.round(item.progress);
              onProgress(pct, `Cargando Pesos Neuronales Kokoro-82M: ${pct}%`);
            }
          },
        });

        this.ttsInstance = tts;
        this.isLoading = false;
        logger.info("[KokoroTTS] Kokoro-82M ready for zero-latency local synthesis.");
        if (onProgress) onProgress(100, "Motor Neuronal Kokoro-82M Listo");
        return tts;
      } catch (err) {
        this.isLoading = false;
        this.loadPromise = null;
        logger.error("[KokoroTTS] Failed to load Kokoro-82M:", err);
        throw err;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Generates real human-quality neural speech in 24kHz WAV format locally.
   */
  public async generateSpeech(
    text: string,
    voiceId = "af_heart",
    speed = 1.0,
    onProgress?: (progress: number, text: string) => void,
  ): Promise<{ audioUrl: string; durationSec: number }> {
    const trimmed = text.trim();
    if (!trimmed) {
      throw new Error("Cannot synthesize empty text");
    }

    const cacheKey = `${voiceId}_${speed}_${trimmed}`;
    if (this.audioBlobCache.has(cacheKey)) {
      const cachedUrl = this.audioBlobCache.get(cacheKey)!;
      return { audioUrl: cachedUrl, durationSec: 0 };
    }

    const tts = await this.getTTS(onProgress);

    if (onProgress) onProgress(90, "Synthesizing Neural Audio...");
    const audioResult = await (tts as any).generate(trimmed, {
      voice: voiceId,
      speed,
    });

    const blob = audioResult.toBlob();
    const audioUrl = URL.createObjectURL(blob);
    this.audioBlobCache.set(cacheKey, audioUrl);

    if (onProgress) onProgress(100, "Ready");
    return {
      audioUrl,
      durationSec: audioResult.sampling_rate ? (audioResult.audio?.length || 0) / audioResult.sampling_rate : 0,
    };
  }

  public isModelLoaded(): boolean {
    return this.ttsInstance !== null;
  }

  public isModelLoading(): boolean {
    return this.isLoading;
  }
}

export const kokoroVoiceService = new KokoroVoiceService();
