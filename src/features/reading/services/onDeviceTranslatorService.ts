/**
 * On-Device Translation Service (Chrome Built-in AI / WICG Translation API)
 *
 * Provides ultra-fast, zero-token, zero-network English -> Spanish translations
 * running locally on the user's browser (Gemini Nano / Chromium On-Device AI).
 *
 * Supported environments:
 * - Chrome 138+ (window.Translator / window.translation)
 * - Chromium Built-in AI Origin Trials (window.ai.translator)
 *
 * Graceful Degradation:
 * If the browser does not support the API (Safari, Firefox, older Chrome, mobile WebKit),
 * or if the language pack is not yet downloaded, this service safely returns null
 * allowing the application to seamlessly fall back to backend or remote services.
 */

export interface OnDeviceTranslationOptions {
  from?: string | undefined;
  to?: string | undefined;
  context?: string | undefined;
}

interface GenericTranslatorInstance {
  translate(text: string): Promise<string>;
  destroy?(): void;
}

export class OnDeviceTranslatorService {
  private static instance: OnDeviceTranslatorService;
  private translatorCache = new Map<string, Promise<GenericTranslatorInstance | null>>();

  public static getInstance(): OnDeviceTranslatorService {
    if (!OnDeviceTranslatorService.instance) {
      OnDeviceTranslatorService.instance = new OnDeviceTranslatorService();
    }
    return OnDeviceTranslatorService.instance;
  }

  /**
   * Checks whether the current browser environment exposes any standard
   * or experimental on-device translation API.
   */
  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    const win = window as unknown as Record<string, unknown>;
    return Boolean(
      win.Translator ||
        win.translation ||
        (win.ai && typeof (win.ai as Record<string, unknown>).translator === "object"),
    );
  }

  /**
   * Probes whether the language pair can be translated locally.
   */
  public async canTranslate(from = "en", to = "es"): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const win = window as unknown as Record<string, unknown>;

      // 1. WICG translation spec
      if (win.translation && typeof (win.translation as Record<string, unknown>).canTranslate === "function") {
        const status = await (win.translation as { canTranslate(opts: { sourceLanguage: string; targetLanguage: string }): Promise<string> }).canTranslate({
          sourceLanguage: from,
          targetLanguage: to,
        });
        return status === "readily" || status === "after-download";
      }

      // 2. window.Translator spec (Chrome 138+)
      if (win.Translator && typeof (win.Translator as Record<string, unknown>).canTranslate === "function") {
        const status = await (win.Translator as { canTranslate(opts: { sourceLanguage: string; targetLanguage: string }): Promise<string> }).canTranslate({
          sourceLanguage: from,
          targetLanguage: to,
        });
        return status === "readily" || status === "after-download" || status === "yes";
      }

      // 3. window.ai.translator spec
      if (win.ai && typeof (win.ai as Record<string, unknown>).translator === "object") {
        const aiTr = (win.ai as { translator: { capabilities?: () => Promise<{ available: string }> } }).translator;
        if (typeof aiTr.capabilities === "function") {
          const caps = await aiTr.capabilities();
          return caps.available === "readily" || caps.available === "after-download";
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets or creates a reusable translator instance for the given language pair.
   */
  private getOrCreateTranslator(from: string, to: string): Promise<GenericTranslatorInstance | null> {
    const cacheKey = `${from}:${to}`;
    const existing = this.translatorCache.get(cacheKey);
    if (existing) return existing;

    const promise = (async (): Promise<GenericTranslatorInstance | null> => {
      try {
        const win = window as unknown as Record<string, unknown>;

        // 1. window.Translator.create (Chrome 138+)
        if (win.Translator && typeof (win.Translator as Record<string, unknown>).create === "function") {
          const tr = await (win.Translator as { create(opts: { sourceLanguage: string; targetLanguage: string }): Promise<GenericTranslatorInstance> }).create({
            sourceLanguage: from,
            targetLanguage: to,
          });
          return tr;
        }

        // 2. window.translation.createTranslator (WICG standard)
        if (win.translation && typeof (win.translation as Record<string, unknown>).createTranslator === "function") {
          const tr = await (win.translation as { createTranslator(opts: { sourceLanguage: string; targetLanguage: string }): Promise<GenericTranslatorInstance> }).createTranslator({
            sourceLanguage: from,
            targetLanguage: to,
          });
          return tr;
        }

        // 3. window.ai.translator.create (Early Built-in AI)
        if (win.ai && typeof (win.ai as Record<string, unknown>).translator === "object") {
          const aiTr = (win.ai as { translator: { create(opts: { sourceLanguage: string; targetLanguage: string }): Promise<GenericTranslatorInstance> } }).translator;
          if (typeof aiTr.create === "function") {
            const tr = await aiTr.create({
              sourceLanguage: from,
              targetLanguage: to,
            });
            return tr;
          }
        }

        return null;
      } catch {
        return null;
      }
    })();

    this.translatorCache.set(cacheKey, promise);
    return promise;
  }

  /**
   * Translates a word or short phrase using the local on-device translation model.
   *
   * @param text The English text or phrase to translate
   * @param options Optional source/target languages and surrounding context
   * @returns Cleaned lowercase Spanish translation, or null if unavailable
   */
  public async translate(text: string, options?: OnDeviceTranslationOptions): Promise<string | null> {
    const raw = text?.trim();
    if (!raw || !this.isSupported()) return null;

    const from = options?.from || "en";
    const to = options?.to || "es";

    try {
      const translator = await this.getOrCreateTranslator(from, to);
      if (!translator || typeof translator.translate !== "function") return null;

      const rawResult = await translator.translate(raw);
      if (!rawResult || typeof rawResult !== "string") return null;

      const cleaned = rawResult
        .replace(/^["'`]|["'`]$/g, "")
        .replace(/[.,!?;:]/g, "")
        .trim()
        .toLowerCase();

      // Guard against degenerate echo returns where translator echoes back the input word
      if (!cleaned || cleaned === raw.toLowerCase()) {
        return null;
      }

      return cleaned;
    } catch {
      // Invalidate failed cache entry so future attempts can re-probe
      this.translatorCache.delete(`${from}:${to}`);
      return null;
    }
  }

  /**
   * Clears cached translator instances.
   */
  public reset(): void {
    this.translatorCache.clear();
  }
}

export const onDeviceTranslatorService = OnDeviceTranslatorService.getInstance();
