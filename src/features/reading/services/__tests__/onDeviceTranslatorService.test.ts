import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OnDeviceTranslatorService } from "../onDeviceTranslatorService";

describe("OnDeviceTranslatorService - Progressive Enhancement & Fallback", () => {
  let service: OnDeviceTranslatorService;

  beforeEach(() => {
    service = new OnDeviceTranslatorService();
    service.reset();
  });

  afterEach(() => {
    // Clean up mock globals on window
    const win = globalThis.window as unknown as Record<string, unknown>;
    delete win.Translator;
    delete win.translation;
    delete win.ai;
  });

  it("safely reports unsupported when browser has no built-in translation API", async () => {
    const win = globalThis.window as unknown as Record<string, unknown>;
    delete win.Translator;
    delete win.translation;
    delete win.ai;

    expect(service.isSupported()).toBe(false);
    expect(await service.canTranslate("en", "es")).toBe(false);
    const result = await service.translate("unprecedented");
    expect(result).toBeNull();
  });

  it("handles window.Translator (Midudev / Chrome 138+ API)", async () => {
    const mockTranslate = vi.fn().mockResolvedValue("Establecer / fijar");
    const mockCreate = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });
    const mockCanTranslate = vi.fn().mockResolvedValue("readily");

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.Translator = {
      canTranslate: mockCanTranslate,
      create: mockCreate,
    };

    expect(service.isSupported()).toBe(true);
    expect(await service.canTranslate("en", "es")).toBe(true);

    const result = await service.translate("lay down");
    expect(result).toBe("establecer / fijar");
    expect(mockCreate).toHaveBeenCalledWith({
      sourceLanguage: "en",
      targetLanguage: "es",
    });
    expect(mockTranslate).toHaveBeenCalledWith("lay down");
  });

  it("handles window.translation (WICG standard API)", async () => {
    const mockTranslate = vi.fn().mockResolvedValue('"hace / crea"');
    const mockCreateTranslator = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });
    const mockCanTranslate = vi.fn().mockResolvedValue("after-download");

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.translation = {
      canTranslate: mockCanTranslate,
      createTranslator: mockCreateTranslator,
    };

    expect(service.isSupported()).toBe(true);
    expect(await service.canTranslate("en", "es")).toBe(true);

    const result = await service.translate("makes");
    expect(result).toBe("hace / crea");
    expect(mockCreateTranslator).toHaveBeenCalledWith({
      sourceLanguage: "en",
      targetLanguage: "es",
    });
  });

  it("handles window.ai.translator (early Built-in AI Origin Trial)", async () => {
    const mockTranslate = vi.fn().mockResolvedValue("desglosar");
    const mockCreate = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });
    const mockCapabilities = vi.fn().mockResolvedValue({ available: "readily" });

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.ai = {
      translator: {
        capabilities: mockCapabilities,
        create: mockCreate,
      },
    };

    expect(service.isSupported()).toBe(true);
    expect(await service.canTranslate("en", "es")).toBe(true);

    const result = await service.translate("break down");
    expect(result).toBe("desglosar");
  });

  it("reuses cached translator instance across multiple translation calls", async () => {
    const mockTranslate = vi.fn().mockResolvedValue("resultado");
    const mockCreate = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.Translator = {
      create: mockCreate,
    };

    await service.translate("word1");
    await service.translate("word2");

    // create should have been called only once for the language pair
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockTranslate).toHaveBeenCalledTimes(2);
  });

  it("rejects degenerate echo translations (where translator just repeats input word)", async () => {
    const mockTranslate = vi.fn().mockResolvedValue("quantum");
    const mockCreate = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.Translator = {
      create: mockCreate,
    };

    const result = await service.translate("quantum");
    // Should return null so application falls back to backend dictionary or LLM
    expect(result).toBeNull();
  });

  it("gracefully catches and returns null on translation error without throwing", async () => {
    const mockTranslate = vi.fn().mockRejectedValue(new Error("Model crashed"));
    const mockCreate = vi.fn().mockResolvedValue({
      translate: mockTranslate,
    });

    const win = globalThis.window as unknown as Record<string, unknown>;
    win.Translator = {
      create: mockCreate,
    };

    const result = await service.translate("error-prone-word");
    expect(result).toBeNull();
  });
});
