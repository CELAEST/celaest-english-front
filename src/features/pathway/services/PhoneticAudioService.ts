import phoneticsManifest from "../data/phoneticsAudioManifest.json";
import { SpeechSynthesisService, SpeakOptions } from "../../conversation/services/speechSynthesisService";

const manifest = (phoneticsManifest || {}) as Record<string, string>;

export class PhoneticAudioService {
  private static currentAudio: HTMLAudioElement | null = null;

  public static stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    SpeechSynthesisService.stop();
  }

  public static async playPhoneme(
    soundId: string,
    fallbackText: string,
    onEnd?: () => void,
  ): Promise<void> {
    this.stop();
    const localSrc = manifest[soundId];
    if (localSrc) {
      return this.playLocal(localSrc, onEnd);
    }
    const options: SpeakOptions = {};
    if (onEnd) {
      options.onEnd = onEnd;
      options.onError = onEnd;
    }
    return SpeechSynthesisService.speak(fallbackText, options);
  }

  public static async playWord(word: string, onEnd?: () => void): Promise<void> {
    this.stop();
    const localSrc = manifest[`word:${word.toLowerCase().trim()}`];
    if (localSrc) {
      return this.playLocal(localSrc, onEnd);
    }
    const options: SpeakOptions = {};
    if (onEnd) {
      options.onEnd = onEnd;
      options.onError = onEnd;
    }
    return SpeechSynthesisService.speak(word, options);
  }

  private static playLocal(src: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(src);
      this.currentAudio = audio;
      const finish = () => {
        if (this.currentAudio === audio) this.currentAudio = null;
        if (onEnd) onEnd();
        resolve();
      };
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });
  }
}
