/**
 * Speech Synthesis & Recognition Service
 * High-fidelity natural voice selection and speech recognition for Lingua AI Interviewer
 */

export interface SpeakOptions {
  rate?: number; // 0.75 to 1.25
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export class SpeechSynthesisService {
  /**
   * Loads available speech synthesis voices
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

      window.speechSynthesis.onvoiceschanged = () => {
        const loaded = window.speechSynthesis.getVoices();
        resolve(loaded);
      };
    });
  }

  /**
   * Selects the most natural, human-sounding English voice available on the device
   */
  public static async getBestVoice(): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    if (!voices || voices.length === 0) return null;

    // Filter for English voices
    const englishVoices = voices.filter(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en_US") || v.lang.startsWith("en")
    );

    if (englishVoices.length === 0) return voices[0] || null;

    // Prioritize natural neural voices: Microsoft Edge Online Natural, Google Natural, Apple Enhanced
    const priorityKeywords = ["natural", "neural", "online", "google", "samantha", "daniel", "enhanced", "premium"];

    for (const keyword of priorityKeywords) {
      const match = englishVoices.find((v) => v.name.toLowerCase().includes(keyword));
      if (match) return match;
    }

    // Default to en-US voice
    const usMatch = englishVoices.find((v) => v.lang === "en-US" || v.lang === "en_US");
    return usMatch || englishVoices[0];
  }

  /**
   * Speaks given text with human-like pace and pitch
   */
  public static async speak(text: string, options: SpeakOptions = {}): Promise<void> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const voice = await this.getBestVoice();
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = options.rate ?? 0.95; // Slightly relaxed, highly natural pace
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onstart = () => {
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      if (options.onEnd) options.onEnd();
      if (options.onError) options.onError(e);
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stops any ongoing speech immediately
   */
  public static stop(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Checks if browser supports Speech Recognition
   */
  public static isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }
}
