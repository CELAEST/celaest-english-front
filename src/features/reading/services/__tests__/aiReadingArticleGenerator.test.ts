import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiReadingArticleGenerator } from "../aiReadingArticleGenerator";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";
import { directClientAiService, AiInfrastructureError } from "../../../settings/services/directClientAiService";
import { apiReadingRepository } from "../../../../infrastructure/repositories/ApiReadingRepository";

vi.mock("../../../settings/services/providerKeyVault", () => ({
  providerKeyVault: {
    isCentralCoreEnabled: vi.fn(),
    getActiveProviderId: vi.fn(),
    hasKey: vi.fn(),
  },
}));

vi.mock("../../../settings/services/directClientAiService", () => {
  class MockAiInfrastructureError extends Error {
    constructor(
      public code: string,
      message: string,
      public status: number = 500,
      public provider: string = "groq",
    ) {
      super(message);
      this.name = "AiInfrastructureError";
    }
  }

  return {
    AiInfrastructureError: MockAiInfrastructureError,
    directClientAiService: {
      chatCompletion: vi.fn(),
    },
  };
});

vi.mock("../../../../infrastructure/repositories/ApiReadingRepository", () => ({
  apiReadingRepository: {
    generateArticle: vi.fn(),
  },
}));

describe("AiReadingArticleGenerator - Resilient Pipeline & Zero Masking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws AiInfrastructureError immediately when central core is disabled and no key is configured", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(false);
    vi.mocked(providerKeyVault.getActiveProviderId).mockResolvedValue("groq");
    vi.mocked(providerKeyVault.hasKey).mockResolvedValue(false);

    await expect(
      AiReadingArticleGenerator.generateArticle({
        category: "BUSINESS",
        level: "B1",
        profession: "Dentist",
      }),
    ).rejects.toThrowError(AiInfrastructureError);
  });

  it("generates reading story via directClientAiService in BYOK mode when key is present", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(false);
    vi.mocked(providerKeyVault.getActiveProviderId).mockResolvedValue("groq");
    vi.mocked(providerKeyVault.hasKey).mockResolvedValue(true);

    const mockAiResponse = JSON.stringify({
      title: "Patient Trust in Modern Dentistry",
      category: "BUSINESS",
      readTimeMin: 4,
      excerpt: "Establishing transparent communication improves patient comfort and clinical outcomes.",
      pages: [
        "Dr. Elena Vance arrived early at her dental clinic to review the morning appointments.",
        "She decided to figure out a better way to explain complex procedures to anxious patients.",
        "By setting up visual models and taking time to listen, she built enduring trust with her team.",
      ],
      phrasalVerbs: ["figure out", "set up"],
      keywords: ["figure out", "set up", "consultation", "treatment", "protocol"],
      keywordTranslations: {
        "figure out": "descifrar / solucionar",
        "set up": "configurar / establecer",
      },
    });

    vi.mocked(directClientAiService.chatCompletion).mockResolvedValue(mockAiResponse);

    const article = await AiReadingArticleGenerator.generateArticle({
      category: "BUSINESS",
      level: "B1",
      profession: "Dentist",
    });

    expect(article).toBeDefined();
    expect(article.title).toBe("Patient Trust in Modern Dentistry");
    expect(article.pages?.length).toBe(3);
    expect(article.keywords).toContain("figure out");
    expect(directClientAiService.chatCompletion).toHaveBeenCalledTimes(1);
  });

  it("falls back to BYOK direct client if central core times out or fails", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(true);
    vi.mocked(providerKeyVault.getActiveProviderId).mockResolvedValue("groq");
    vi.mocked(providerKeyVault.hasKey).mockResolvedValue(true);

    // Backend call fails
    vi.mocked(apiReadingRepository.generateArticle).mockRejectedValue(new Error("Connection refused"));

    const mockFallbackResponse = JSON.stringify({
      title: "Navigating Legal Complexities",
      category: "BUSINESS",
      readTimeMin: 3,
      excerpt: "Clear contractual language avoids cross-border misunderstandings.",
      pages: [
        "A senior partner needed to hammer out new terms for an international client.",
        "The team had to drill down into the regulatory requirements before proceeding.",
      ],
      phrasalVerbs: ["hammer out", "drill down"],
      keywords: ["hammer out", "drill down", "contract", "compliance"],
    });

    vi.mocked(directClientAiService.chatCompletion).mockResolvedValue(mockFallbackResponse);

    const article = await AiReadingArticleGenerator.generateArticle({
      category: "BUSINESS",
      level: "B2",
      profession: "Lawyer",
    });

    expect(article).toBeDefined();
    expect(article.title).toBe("Navigating Legal Complexities");
    expect(directClientAiService.chatCompletion).toHaveBeenCalledTimes(1);
  });

  it("handles markdown code fences and whitespace from LLM output correctly", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(false);
    vi.mocked(providerKeyVault.getActiveProviderId).mockResolvedValue("groq");
    vi.mocked(providerKeyVault.hasKey).mockResolvedValue(true);

    const fencedMarkdownResponse = `\`\`\`json
{
  "title": "Sustainable Urban Architecture",
  "category": "CAREER",
  "readTimeMin": 4,
  "excerpt": "Designing energy-efficient structures for contemporary cities.",
  "pages": [
    "Carlos presented his blueprints for the new eco-friendly community center.",
    "He emphasized natural lighting and sustainable timber materials."
  ],
  "keywords": ["blueprints", "timber", "sustainable"]
}
\`\`\``;

    vi.mocked(directClientAiService.chatCompletion).mockResolvedValue(fencedMarkdownResponse);

    const article = await AiReadingArticleGenerator.generateArticle({
      category: "CAREER",
      level: "B2",
      profession: "Architect",
    });

    expect(article.title).toBe("Sustainable Urban Architecture");
    expect(article.totalPages).toBe(2);
    expect(article.keywords).toContain("sustainable");
  });

  it("throws clear error when LLM returns invalid JSON or empty pages", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(false);
    vi.mocked(providerKeyVault.getActiveProviderId).mockResolvedValue("groq");
    vi.mocked(providerKeyVault.hasKey).mockResolvedValue(true);

    vi.mocked(directClientAiService.chatCompletion).mockResolvedValue("Sorry, I cannot fulfill this request.");

    await expect(
      AiReadingArticleGenerator.generateArticle({
        category: "BUSINESS",
        level: "B1",
        profession: "Biologist",
      }),
    ).rejects.toThrow("El modelo de IA no devolvió un formato de lectura válido.");
  });

  it("uses central core API when enabled and healthy", async () => {
    vi.mocked(providerKeyVault.isCentralCoreEnabled).mockResolvedValue(true);

    const mockCoreArticle = {
      id: "core-art-1",
      title: "Marine Ecosystem Conservation",
      category: "CAREER",
      cefrLevel: "C1",
      readTimeMin: 5,
      excerpt: "Protecting deep-sea coral reefs from ocean acidification.",
      content: "Researchers documented resilient species thriving near volcanic vents.",
      pages: ["Researchers documented resilient species thriving near volcanic vents."],
      totalPages: 1,
      keywords: ["resilient", "acidification", "vents"],
    };

    vi.mocked(apiReadingRepository.generateArticle).mockResolvedValue(mockCoreArticle as any);

    const article = await AiReadingArticleGenerator.generateArticle({
      category: "CAREER",
      level: "C1",
      profession: "Marine Biologist",
    });

    expect(article.id).toBe("core-art-1");
    expect(article.title).toBe("Marine Ecosystem Conservation");
    expect(apiReadingRepository.generateArticle).toHaveBeenCalledWith(
      "CAREER",
      "C1",
      undefined,
      "Marine Biologist",
    );
  });
});
