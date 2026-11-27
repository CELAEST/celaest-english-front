import { ENV } from "../../../shared/constants/env";
import { sanitizeSpeechForVoice, SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";

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

function buildStreamUrl(sentence: string, voice = BILINGUAL_MENTOR_VOICE): string {
  return `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(sentence)}&voice=${encodeURIComponent(
    voice,
  )}&rate=%2B2%25&volume=%2B100%25`;
}

async function prefetchSentenceBlobUrl(
  sentence: string,
  signal: AbortSignal,
): Promise<string | null> {
  try {
    const res = await fetch(buildStreamUrl(sentence), { signal });
    if (!res.ok) return null;
    const blob = await res.blob();
    if (!blob || blob.size === 0 || signal.aborted) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

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
    SpeechSynthesisService.stop();
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

    // Prefetch all sentences in parallel so sentence 2+ play with 0ms gap
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
        const played = await this.playBlobUrl(blobUrl, ctrl.signal);
        this.activeUrls.delete(blobUrl);
        URL.revokeObjectURL(blobUrl);
        if (played) continue;
      }

      // Fallback through SpeechSynthesisService if fetch failed
      await new Promise<void>((resolve) => {
        void SpeechSynthesisService.speak(sentence, {
          voice: BILINGUAL_MENTOR_VOICE,
          onEnd: () => resolve(),
          onError: () => resolve(),
        });
      });
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
