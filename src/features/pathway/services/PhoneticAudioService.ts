import phoneticsManifest from "../data/phoneticsAudioManifest.json";
import { SpeechSynthesisService, SpeakOptions } from "../../conversation/services/speechSynthesisService";
import { resolveAudioUrl } from "../../../shared/utils/audioUrl";

const manifest = (phoneticsManifest || {}) as Record<string, string>;

export class PhoneticAudioService {
  private static currentAudio: HTMLAudioElement | null = null;
  private static finishActiveLocal: (() => void) | null = null;
  private static registeredWithSpeech = false;

  private static ensureMutexRegistration(): void {
    if (this.registeredWithSpeech) return;
    this.registeredWithSpeech = true;
    SpeechSynthesisService.registerExternalStop(() => {
      this.stopLocalOnly();
    });
  }

  public static stopLocalOnly(): void {
    const audio = this.currentAudio;
    const finish = this.finishActiveLocal;
    this.currentAudio = null;
    this.finishActiveLocal = null;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    }
    if (finish) finish();
  }

  public static stop(): void {
    this.ensureMutexRegistration();
    this.stopLocalOnly();
    SpeechSynthesisService.stop();
  }

  public static async playPhoneme(
    soundId: string,
    fallbackText: string,
    onEnd?: () => void,
  ): Promise<void> {
    if (SpeechSynthesisService.isMuted()) {
      if (onEnd) onEnd();
      return;
    }
    this.stop();
    const localSrc = manifest[soundId];
    if (localSrc) {
      return this.playLocal(localSrc, onEnd);
    }
    const options: SpeakOptions = {
      lang: "en",
      voice: "liam",
      preventSyntheticFallback: true,
    };
    if (onEnd) {
      options.onEnd = onEnd;
      options.onError = onEnd;
    }
    return SpeechSynthesisService.speak(fallbackText, options);
  }

  public static async playWord(word: string, onEnd?: () => void): Promise<void> {
    if (SpeechSynthesisService.isMuted()) {
      if (onEnd) onEnd();
      return;
    }
    this.stop();
    const localSrc = manifest[`word:${word.toLowerCase().trim()}`];
    if (localSrc) {
      return this.playLocal(localSrc, onEnd);
    }
    const options: SpeakOptions = {
      lang: "en",
      voice: "liam",
      preventSyntheticFallback: true,
    };
    if (onEnd) {
      options.onEnd = onEnd;
      options.onError = onEnd;
    }
    return SpeechSynthesisService.speak(word, options);
  }

  private static playLocal(src: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;
      const audio = new Audio(resolveAudioUrl(src));
      this.currentAudio = audio;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (this.currentAudio === audio) this.currentAudio = null;
        if (this.finishActiveLocal === finish) this.finishActiveLocal = null;
        if (onEnd) onEnd();
        resolve();
      };
      this.finishActiveLocal = finish;
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });
  }
}
