/**
 * AiReadingArticleGenerator
 *
 * Dedicated domain service for robust AI Reading Story synthesis.
 * Handles:
 * - Direct Client BYOK (Bring Your Own Key) via Groq, Gemini, OpenAI, Claude
 * - Resilient fallback from CELAEST Central Clúster to Client BYOK
 * - Strict 15s client-side timeout to eradicate hanging loading states
 * - Zero Silent Masking: Explicitly raises AiInfrastructureError when keys are missing/exhausted
 */

import { ReadingArticle } from "../../../domain/entities/ReadingArticle";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { directClientAiService, AiInfrastructureError, extractFirstJsonObject } from "../../settings/services/directClientAiService";
import { logger } from "../../../shared/utils/logger";

export interface GenerateReadingOptions {
  category?: string | undefined;
  level?: string | undefined;
  profession?: string | undefined;
  topic?: string | undefined;
}

interface AiStoryRawResponse {
  title: string;
  category: string;
  readTimeMin: number;
  excerpt: string;
  pages: string[];
  phrasalVerbs?: string[];
  keywords?: string[];
  keywordTranslations?: Record<string, string>;
}

export class AiReadingArticleGenerator {
  private static readonly CLIENT_TIMEOUT_MS = 15000;

  private static buildPrompt(level: string, category: string, profession: string, topic?: string): { systemPrompt: string; userPrompt: string } {
    const normLevel = (level || "B1").toUpperCase().trim();
    const normCategory = (category || "BUSINESS").toUpperCase().trim();
    const roleContext = profession && profession.toLowerCase() !== "professional" && profession.toLowerCase() !== "general"
      ? `the field/profession of '${profession}'`
      : "the professional workplace domain";

    let phrasalVerbInstruction = "";
    let keywordGuidance = "";

    switch (normLevel) {
      case "A1":
      case "A2":
        phrasalVerbInstruction = `- Naturally weave in 2 to 3 foundational everyday phrasal verbs in simple context (e.g. "wake up", "turn on", "look for", "set up", "find out").`;
        keywordGuidance = `array of 5 key vocabulary words or phrasal verbs (e.g. ["look for", "set up", "schedule", "routine", "goal"])`;
        break;
      case "B1":
        phrasalVerbInstruction = `- Mandatorily weave in 4 to 5 common intermediate phrasal verbs in context (e.g. "figure out", "carry out", "break down", "look forward to", "run out of", "check in", "set up", "give up").`;
        keywordGuidance = `array of 5 key vocabulary words and phrasal verbs from the story (e.g. ["figure out", "carry out", "break down", "alignment", "milestone"])`;
        break;
      case "B2":
        phrasalVerbInstruction = `- Mandatorily weave in 5 to 7 upper-intermediate professional phrasal verbs in context (e.g. "ramp up", "drill down", "roll out", "scale up", "touch base", "phase out", "narrow down", "iron out", "stand out", "point out").`;
        keywordGuidance = `array of 5 to 6 core phrasal verbs and executive terms (e.g. ["ramp up", "drill down", "roll out", "scale up", "touch base", "trade-off"])`;
        break;
      case "C1":
      case "C2":
        phrasalVerbInstruction = `- Mandatorily weave in 6 to 9 advanced phrasal verbs, split phrasal verbs with pronouns, and idiomatic collocations in context (e.g. "double down on", "zero in on", "weigh in on", "brush up on", "flesh out", "hammer out", "stem from", "turn it around", "bring about").`;
        keywordGuidance = `array of 6 to 7 advanced phrasal verbs and idiomatic expressions (e.g. ["double down on", "zero in on", "flesh out", "hammer out", "trade-off"])`;
        break;
      default:
        phrasalVerbInstruction = `- Mandatorily weave in 4 to 6 natural phrasal verbs in context (e.g. "figure out", "carry out", "break down", "ramp up", "drill down", "set up").`;
        keywordGuidance = `array of 5 important vocabulary words or phrasal verbs`;
    }

    const entropySeed = Date.now() + Math.floor(Math.random() * 10000);
    const systemPrompt = "You are an expert Cambridge/Oxford ESL author and executive language mentor. Respond ONLY with valid raw JSON.";

    const userPrompt = `Generate an inspiring, immersive, and completely UNIQUE ESL reading story for CEFR level ${normLevel} in ${roleContext}.
Category: ${normCategory}.
${topic ? `Topic/Theme: ${topic}.` : `Topic/Theme: A pivotal professional decision, operational breakthrough, or cross-functional achievement in ${roleContext}.`}
Entropy Seed: ${entropySeed}.

Strict Pedagogical Rules:
- Original protagonist, realistic industry setting in ${roleContext}, engaging hurdle, inspiring resolution.
- Linguistic Purity: Regardless of user's native language, the story must be 100% natural, idiomatic English. Zero non-English occupational nouns.
- Domain Invariance: Never leak unrelated software engineering jargon into non-tech professions (e.g. medicine, law, dentistry, education).
${phrasalVerbInstruction}
- Sentence structures calibrated precisely for CEFR ${normLevel}.
- Return raw JSON with keys:
"title": string (creative, inspiring title),
"category": "${normCategory}",
"readTimeMin": integer (3 to 5),
"excerpt": string (1 concise summary sentence),
"pages": array of 3 to 4 short paragraph strings (each paragraph ~40-60 words),
"phrasalVerbs": array of strings (phrasal verbs/idioms woven into the text),
"keywords": ${keywordGuidance},
"keywordTranslations": object mapping each keyword/phrasal verb to its natural Spanish translation (e.g. {"figure out": "descifrar / solucionar", "ramp up": "acelerar / escalar"})
Do not wrap in markdown quotes. Respond ONLY with valid JSON.`;

    return { systemPrompt, userPrompt };
  }

  private static parseAiResponse(raw: string, options: GenerateReadingOptions): ReadingArticle {
    let clean = raw.trim();
    if (clean.startsWith("```json")) clean = clean.slice(7);
    if (clean.startsWith("```")) clean = clean.slice(3);
    if (clean.endsWith("```")) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      let toParse = clean;
      try {
        JSON.parse(toParse);
      } catch {
        const salvaged = extractFirstJsonObject(clean);
        if (salvaged) toParse = salvaged;
      }

      const parsed = JSON.parse(toParse) as AiStoryRawResponse;
      if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
        const fullContent = parsed.pages.join(" ");
        return {
          id: `ai-reading-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: parsed.title || "Professional Excellence in Practice",
          category: (parsed.category || options.category || "BUSINESS").toUpperCase(),
          cefrLevel: (options.level || "B1").toUpperCase(),
          readTimeMin: parsed.readTimeMin || 3,
          excerpt: parsed.excerpt || "Strategic insights and practical mastery in everyday professional scenarios.",
          content: fullContent,
          pages: parsed.pages,
          totalPages: parsed.pages.length,
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
          phrasalVerbs: Array.isArray(parsed.phrasalVerbs) ? parsed.phrasalVerbs : [],
        };
      }
    } catch (e) {
      logger.warn("[AiReadingArticleGenerator] JSON parse failure on raw response:", e);
    }

    throw new Error("El modelo de IA no devolvió un formato de lectura válido.");
  }

  /**
   * Main Generation Pipeline
   */
  public static async generateArticle(options: GenerateReadingOptions): Promise<ReadingArticle> {
    const isCore = await providerKeyVault.isCentralCoreEnabled();
    const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
    const hasKey = await providerKeyVault.hasKey(activeProvider);

    // 1. If Central Core is disabled and user has NO private key configured:
    if (!isCore && !hasKey) {
      throw new AiInfrastructureError(
        "AI_KEYS_EXHAUSTED",
        `El Clúster Central está desactivado y no hay clave configurada para ${activeProvider.toUpperCase()}.`,
        401,
        activeProvider,
      );
    }

    // 2. BYOK Direct Mode: If Central Core is disabled OR user has private key and requests direct inference
    if (!isCore && hasKey) {
      const { systemPrompt, userPrompt } = this.buildPrompt(
        options.level || "B1",
        options.category || "BUSINESS",
        options.profession || "Professional",
        options.topic,
      );

      const rawResponse = await directClientAiService.chatCompletion({
        systemPrompt,
        userPrompt,
        providerId: activeProvider,
        maxTokens: 2500,
      });

      return this.parseAiResponse(rawResponse, options);
    }

    // 3. Central Core Mode: Attempt backend /reading/generate with strict timeout
    const backendPromise = apiReadingRepository.generateArticle(
      options.category || "BUSINESS",
      options.level || "B1",
      options.topic,
      options.profession,
    );

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Tiempo de espera agotado al conectar con el clúster de IA (15s).")), this.CLIENT_TIMEOUT_MS),
    );

    try {
      const result = await Promise.race([backendPromise, timeoutPromise]);
      if (result && result.content) {
        return result;
      }
      throw new Error("El clúster no generó contenido para esta lectura.");
    } catch (backendErr: any) {
      logger.warn("[AiReadingArticleGenerator] Backend clúster failed or timed out:", backendErr);

      // If user has a configured fallback key (e.g. Groq/Gemini), seamlessly fulfill using BYOK
      if (hasKey) {
        try {
          const { systemPrompt, userPrompt } = this.buildPrompt(
            options.level || "B1",
            options.category || "BUSINESS",
            options.profession || "Professional",
            options.topic,
          );

          const directRaw = await directClientAiService.chatCompletion({
            systemPrompt,
            userPrompt,
            providerId: activeProvider,
            maxTokens: 2500,
          });

          return this.parseAiResponse(directRaw, options);
        } catch (directErr) {
          logger.error("[AiReadingArticleGenerator] Direct BYOK fallback also failed:", directErr);
        }
      }

      // No working fallback available: propagate clear infrastructure error to trigger modal
      const isTimeout = String(backendErr?.message || "").includes("Tiempo de espera") || String(backendErr?.message || "").includes("timeout");
      throw new AiInfrastructureError(
        isTimeout ? "GATEWAY_TIMEOUT" : "AI_KEYS_EXHAUSTED",
        backendErr?.message || "El clúster central de IA no está disponible y no hay clave de respaldo.",
        isTimeout ? 504 : 503,
        activeProvider,
      );
    }
  }
}
