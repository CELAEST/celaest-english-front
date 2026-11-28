import { ENV } from "../../../shared/constants/env";
import { sanitizeSpeechForVoice } from "../../conversation/services/speechSynthesisService";

export const BILINGUAL_MENTOR_VOICE = "en-US-AndrewMultilingualNeural";

export function splitConversationalSentences(raw: string): string[] {
  const cleaned = sanitizeSpeechForVoice(raw);
  if (!cleaned) return [];
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.length > 0 ? parts : [cleaned];
}

function buildBackendStreamUrl(sentence: string, voice = BILINGUAL_MENTOR_VOICE): string {
  return `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(sentence)}&voice=${encodeURIComponent(
    voice,
  )}&rate=%2B2%25&volume=%2B100%25`;
}

async function fetchEdgeWorkerAudio(sentence: string, signal: AbortSignal): Promise<Blob | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/edge-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: sentence }),
      signal,
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("audio") && !contentType.includes("octet-stream")) {
      return null;
    }
    const blob = await res.blob();
    return blob && blob.size > 0 && !signal.aborted ? blob : null;
  } catch {
    return null;
  }
}

async function prefetchSentenceBlobUrl(
  sentence: string,
  signal: AbortSignal,
): Promise<string | null> {
  try {
    // Tier 1: Ultra-low-latency Cloudflare Edge Workers AI Male Voice (orion/javier)
    const edgeBlob = await fetchEdgeWorkerAudio(sentence, signal);
    if (edgeBlob && !signal.aborted) {
      return URL.createObjectURL(edgeBlob);
    }

    // Tier 2: Pure-Go Neural Male Bilingual stream (AndrewMultilingualNeural)
    const res = await fetch(buildBackendStreamUrl(sentence), { signal });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob || blob.size === 0 || signal.aborted) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

/**
 * Tier-3 HTTP fallback speech pipeline:
 * - Strictly single active HTMLAudioElement (never invokes robotic window.speechSynthesis)
 * - Parallel sentence prefetch across Edge Worker Aura-2 Male & Go Neural Male
 */
export class BilingualVoicePipeline {
  private static abortCtrl: AbortController | null = null;
  private static activeUrls = new Set<string>();
  private static currentAudio: HTMLAudioElement | null = null;

  public static stop(): void {
    if (this.abortCtrl) {
      this.abortCtrl.abort();
      this.abortCtrl = null;
    }
    if (this.currentAudio) {
      try {
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.removeAttribute("src");
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    for (const url of Array.from(this.activeUrls)) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }
    this.activeUrls.clear();
  }

  public static async speakFluid(
    text: string,
    onSentenceStart?: (sentence: string) => void,
  ): Promise<void> {
    this.stop();
    const sentences = splitConversationalSentences(text);
    if (sentences.length === 0) return;

    const ctrl = new AbortController();
    this.abortCtrl = ctrl;

    const prefetches = sentences.map((s) => prefetchSentenceBlobUrl(s, ctrl.signal));

    for (let i = 0; i < sentences.length; i++) {
      if (ctrl.signal.aborted) break;
      const sentence = sentences[i]!;
      onSentenceStart?.(sentence);
      const blobUrl = await prefetches[i];
      if (ctrl.signal.aborted) {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        break;
      }

      if (blobUrl) {
        this.activeUrls.add(blobUrl);
        await this.playBlobUrl(blobUrl, ctrl.signal);
        this.activeUrls.delete(blobUrl);
        URL.revokeObjectURL(blobUrl);
      }
    }
  }

  private static playBlobUrl(blobUrl: string, signal: AbortSignal): Promise<boolean> {
    return new Promise((resolve) => {
      if (signal.aborted) {
        resolve(false);
        return;
      }
      const audio = new Audio(blobUrl);
      this.currentAudio = audio;
      const done = (ok: boolean) => {
        audio.onended = null;
        audio.onerror = null;
        if (this.currentAudio === audio) this.currentAudio = null;
        resolve(ok);
      };
      audio.onended = () => done(true);
      audio.onerror = () => done(false);
      void audio.play().catch(() => done(false));
    });
  }
}
