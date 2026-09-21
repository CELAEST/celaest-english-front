/**
 * AI Dynamic Writing Task Generator Service
 * Generates 100% authentic, career-tailored writing tasks for ANY profession
 * (e.g. Odontóloga, Arquitecto, Abogado, Chef, Veterinario, Pilot, Marine Biologist)
 * and CEFR level (A1 to C2).
 *
 * Implements the user's architectural mandate:
 * 1. Zero static or hardcoded tasks for the active learning session.
 * 2. High-quality pedagogical calibration by CEFR level.
 * 3. Authentic starter phrases native to the specific profession.
 * 4. Resilient caching and instant procedural fallback.
 */

import { WritingTaskItem } from "./dynamicWritingTaskService";
import { normalizeCefr, classifyProfession, CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { directClientAiService, AiInfrastructureError } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface GenerateWritingTaskParams {
  profession: string;
  cefrLevel: string;
  forceFresh?: boolean | undefined;
  previousTitle?: string | undefined;
}

export interface GenerateBatchTasksParams {
  profession: string;
  cefrLevel: string;
  count?: number | undefined;
  forceFresh?: boolean | undefined;
  throwOnAuthError?: boolean | undefined;
}

const BATCH_STORAGE_PREFIX = "celaest:writing:ai_batch_tasks:v2";

function getBatchCacheKey(profession: string, cefrLevel: string): string {
  const normProf = (profession || "Professional").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_");
  const normLevel = (cefrLevel || "B1").toUpperCase().trim();
  return `${BATCH_STORAGE_PREFIX}:${normProf}:${normLevel}`;
}

export class AiWritingTaskGenerator {
  private static inFlightBatchPromises = new Map<string, Promise<WritingTaskItem[]>>();

  /**
   * Returns cached task batch for the given profession and level if available,
   * otherwise returns a procedural vocation-aware seed batch so rendering is instantaneous.
   */
  public static getCachedOrSeedBatch(
    profession: string,
    cefrLevel: string,
    count = 6,
  ): WritingTaskItem[] {
    const level = normalizeCefr(cefrLevel);
    const role = profession?.trim() || "Professional";

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(getBatchCacheKey(role, level));
        if (cached) {
          const parsed = JSON.parse(cached) as WritingTaskItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore cache read error
      }
    }

    return this.createProceduralSeedBatch(role, level, count);
  }

  /**
   * Returns cached task for the given profession and level if available,
   * otherwise returns a procedural vocation-aware seed so rendering is instantaneous.
   */
  public static getCachedOrSeedTask(
    profession: string,
    cefrLevel: string,
  ): WritingTaskItem {
    const batch = this.getCachedOrSeedBatch(profession, cefrLevel);
    return batch[0] || this.createProceduralSeed(profession, normalizeCefr(cefrLevel));
  }

  /**
   * Generates a batch of diverse AI writing tasks in a single LLM call.
   * Drastically reduces token usage and enables 0ms rotation on user clicks.
   * Guarantees ZERO duplicate network calls via an in-flight singleton promise lock.
   */
  public static async generateBatchTasks(
    params: GenerateBatchTasksParams,
  ): Promise<WritingTaskItem[]> {
    const { profession, cefrLevel, count = 6, forceFresh = false } = params;
    const level = normalizeCefr(cefrLevel);
    const role = profession?.trim() || "Professional";
    const cacheKey = getBatchCacheKey(role, level);

    if (!forceFresh && typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as WritingTaskItem[];
          if (Array.isArray(parsed) && parsed.length >= 3) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }

    // In-flight singleton promise lock: If a request for this exact (role, level) is already in progress,
    // immediately return the existing promise so zero concurrent duplicate requests occur!
    if (this.inFlightBatchPromises.has(cacheKey)) {
      return this.inFlightBatchPromises.get(cacheKey)!;
    }

    const { minWords, maxWords, timeLimit, levelDirectives } = this.getLevelParams(level);

    const systemPrompt = `You are a world-class Cambridge and Oxford ESL examiner specializing in career-specific English language writing assessments.
Generate an authentic, realistic batch of ${count} professional writing tasks for an individual working as a: "${role}".
Target CEFR Level: ${level}.

Pedagogical Calibration (${level}):
${levelDirectives}

Strict Quality Mandates:
1. The scenario MUST be authentic, credible, and specific to the daily realities, procedures, clients, patients, or challenges of a "${role}".
2. Category Diversity: Across the batch of ${count} tasks, distribute categories across distinct types: "EMAIL", "REPORT", "PROPOSAL", "MESSAGE", "REVIEW", "LETTER".
3. Provide 3 to 4 realistic starter phrases in natural English that an authentic "${role}" at CEFR ${level} would use in each specific scenario.
4. ABSOLUTELY DO NOT use generic software engineering jargon (such as 'sprint review', 'PR', 'hotfix', 'tech debt', 'API') unless the role is explicitly Software/IT.
5. All instructions must be in clear English.
6. Ultra-Concise Description Mandate: The "description" field for EACH task MUST be exactly ONE short, natural sentence (maximum 15 to 20 words). Absolutely NEVER write multiple sentences, lengthy paragraphs, bloated checklists, or overwhelming requirements. Keep it light, inspiring, and concise.

Output format: Return ONLY valid raw JSON with this exact structure:
{
  "tasks": [
    {
      "category": "EMAIL",
      "title": "Clear and realistic scenario title",
      "description": "Short, crisp 1-sentence prompt (max 15-20 words).",
      "toneHint": "e.g. Professional, empathetic, clear",
      "timeLimit": "${timeLimit}",
      "minWords": ${minWords},
      "maxWords": ${maxWords},
      "starterPhrases": [
        "Authentic starter phrase 1...",
        "Authentic starter phrase 2...",
        "Authentic starter phrase 3..."
      ]
    }
  ]
}`;

    const nonce = Math.floor(Math.random() * 100000);
    const userPrompt = `Generate a diverse batch of ${count} realistic professional writing tasks across varied categories for a ${role} at CEFR ${level} level (Entropy: ${Date.now()}-${nonce}). Ensure distinct scenarios across emails, reports, proposals, messages, reviews, and letters.`;

    const executeBatchRequest = (async (): Promise<WritingTaskItem[]> => {
      try {
        const isCore = await providerKeyVault.isCentralCoreEnabled();
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);

        let rawResponse = "";

        if (!isCore) {
          if (!hasKey) {
            throw new AiInfrastructureError(
              "AI_KEYS_EXHAUSTED",
              `El Clúster Central está desactivado y no hay clave configurada para ${activeProvider.toUpperCase()}.`,
              401,
              activeProvider,
            );
          }
          rawResponse = await directClientAiService.chatCompletion({
            systemPrompt,
            userPrompt,
            maxTokens: 2000,
          });
        } else {
          try {
            const CORE_AI_URL = `${ENV.coreAiUrl}/ai/chat/simple`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);
            const response = await fetch(CORE_AI_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system: systemPrompt,
                message: userPrompt,
                provider: activeProvider,
                max_tokens: 2000,
              }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (response.ok) {
              const data = (await response.json()) as { response?: string; content?: string };
              rawResponse = data.response || data.content || "";
            }
          } catch {
            if (hasKey) {
              rawResponse = await directClientAiService.chatCompletion({
                systemPrompt,
                userPrompt,
                maxTokens: 2000,
              });
            }
          }
        }

        const parsedBatch = this.parseAiBatchResponse(
          rawResponse,
          role,
          level,
          minWords,
          maxWords,
          timeLimit,
          count,
        );

        if (parsedBatch && parsedBatch.length > 0 && typeof window !== "undefined") {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(parsedBatch));
          } catch {
            // ignore storage quota
          }
        }

        return parsedBatch;
      } catch (err) {
        if (params.throwOnAuthError && err instanceof AiInfrastructureError) {
          throw err;
        }
        logger.warn("[AiWritingTaskGenerator] AI batch generation failed, using procedural seed batch", err);
        return this.createProceduralSeedBatch(role, level, count);
      }
    })();

    this.inFlightBatchPromises.set(cacheKey, executeBatchRequest);

    try {
      return await executeBatchRequest;
    } finally {
      this.inFlightBatchPromises.delete(cacheKey);
    }
  }

  /**
   * Generates a single AI writing task (backward-compatible wrapper around batch generator).
   */
  public static async generateWritingTask(
    params: GenerateWritingTaskParams,
  ): Promise<WritingTaskItem> {
    const batch = await this.generateBatchTasks({
      profession: params.profession,
      cefrLevel: params.cefrLevel,
      forceFresh: params.forceFresh ?? false,
    });
    return batch[0] || this.createProceduralSeed(params.profession, normalizeCefr(params.cefrLevel));
  }

  private static getLevelParams(level: CefrLevelCode): {
    minWords: number;
    maxWords: number;
    timeLimit: string;
    levelDirectives: string;
  } {
    switch (level) {
      case "A1":
        return {
          minWords: 8,
          maxWords: 25,
          timeLimit: "5 min",
          levelDirectives: "- Ultra-short elementary message or introduction (8-25 words). Strictly Simple Present (verb to be, do/does, like, work, use). Zero past tense, zero subordinate clauses. Simple, friendly scenarios (introduce yourself, state your role/tools, simple 2-sentence greeting).",
        };
      case "A2":
        return {
          minWords: 20,
          maxWords: 45,
          timeLimit: "8 min",
          levelDirectives: "- Short routine message or note (20-45 words). Simple present/past, straightforward vocabulary, brief client or team update.",
        };
      case "B1":
        return {
          minWords: 45,
          maxWords: 90,
          timeLimit: "12 min",
          levelDirectives: "- Professional email, case update, or client follow-up explaining a situation and proposing next steps (45-90 words).",
        };
      case "B2":
        return {
          minWords: 70,
          maxWords: 130,
          timeLimit: "15 min",
          levelDirectives: "- Formal consultation summary, treatment/project proposal, or detailed recommendation email (70-130 words). Clear narrative structure and professional collocations.",
        };
      case "C1":
      case "C2":
        return {
          minWords: 100,
          maxWords: 180,
          timeLimit: "18 min",
          levelDirectives: "- In-depth clinical or technical case report, executive briefing, or high-stakes consultation letter (100-180 words). Sophisticated discourse markers and authoritative tone.",
        };
      default:
        return {
          minWords: 45,
          maxWords: 90,
          timeLimit: "12 min",
          levelDirectives: "- Intermediate professional email or update.",
        };
    }
  }

  private static parseAiBatchResponse(
    raw: string,
    role: string,
    level: CefrLevelCode,
    minWords: number,
    maxWords: number,
    timeLimit: string,
    expectedCount: number = 6,
  ): WritingTaskItem[] {
    if (!raw || !raw.trim()) {
      return this.createProceduralSeedBatch(role, level, expectedCount);
    }

    try {
      const clean = raw.replace(/```json/gi, "").replace(/```/gi, "").trim();
      let rawList: any[] = [];

      if (clean.startsWith("[")) {
        const match = clean.match(/\[[\s\S]*\]/);
        if (match) {
          rawList = JSON.parse(match[0]);
        }
      } else {
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
          const parsedObj = JSON.parse(match[0]);
          if (Array.isArray(parsedObj.tasks)) {
            rawList = parsedObj.tasks;
          } else if (Array.isArray(parsedObj.items)) {
            rawList = parsedObj.items;
          } else if (Array.isArray(parsedObj.data)) {
            rawList = parsedObj.data;
          }
        }
      }

      const allowedCategories: Array<WritingTaskItem["category"]> = [
        "EMAIL",
        "MESSAGE",
        "REPORT",
        "PROPOSAL",
        "LETTER",
        "REVIEW",
      ];

      const validTasks: WritingTaskItem[] = [];

      if (Array.isArray(rawList)) {
        for (let idx = 0; idx < rawList.length; idx++) {
          const item = rawList[idx];
          if (!item || !item.title || !item.description) continue;

          const rawCat = String(item.category || "EMAIL").toUpperCase();
          const category = allowedCategories.includes(rawCat as any)
            ? (rawCat as WritingTaskItem["category"])
            : allowedCategories[idx % allowedCategories.length];

          const starterPhrases =
            Array.isArray(item.starterPhrases) && item.starterPhrases.length > 0
              ? item.starterPhrases.map(String)
              : [
                  `Regarding the recent consultation about...`,
                  `I would like to follow up on the recommended steps for...`,
                  `Please find the detailed summary below...`,
                ];

          validTasks.push({
            id: `ai-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
            category,
            title: String(item.title).trim(),
            description: String(item.description).trim(),
            toneHint: String(item.toneHint || "Professional, concise, clear"),
            timeLimit: String(item.timeLimit || timeLimit),
            minWords: Number(item.minWords) || minWords,
            maxWords: Number(item.maxWords) || maxWords,
            level,
            roleCategory: classifyProfession(role),
            starterPhrases,
          });
        }
      }

      if (validTasks.length >= 3) {
        return validTasks;
      }
    } catch (e) {
      logger.warn("[AiWritingTaskGenerator] Failed to parse AI batch JSON response", e);
    }

    return this.createProceduralSeedBatch(role, level, expectedCount);
  }

  public static createProceduralSeed(role: string, level: CefrLevelCode): WritingTaskItem {
    return this.createProceduralSeedBatch(role, level, 1)[0];
  }

  public static createProceduralSeedBatch(
    role: string,
    level: CefrLevelCode,
    count = 6,
  ): WritingTaskItem[] {
    const { minWords, maxWords, timeLimit } = this.getLevelParams(level);
    const category = classifyProfession(role);

    const healthcareTemplates = [
      {
        category: "EMAIL" as const,
        title: `${role}: Post-Procedure Clinical Guidance`,
        description: `Write a clear email to a patient with post-procedure care instructions and follow-up guidance.`,
        starterPhrases: [
          `Following your clinical procedure today, please review these care guidelines.`,
          `Some mild tenderness is expected as the tissue heals, but should subside.`,
          `Please contact our clinic immediately if you experience sharp or throbbing pain.`,
        ],
      },
      {
        category: "REPORT" as const,
        title: `${role}: Clinical Case Assessment & Findings`,
        description: `Document patient examination findings, clinical diagnosis, and immediate treatment steps.`,
        starterPhrases: [
          `The patient presented today for examination and evaluation.`,
          `Diagnostic assessment reveals stable conditions with targeted follow-up indicated.`,
          `The recommended clinical course of action involves...`,
        ],
      },
      {
        category: "LETTER" as const,
        title: `${role}: Clinical Specialist Referral Letter`,
        description: `Draft a concise referral letter to a medical specialist summarizing diagnosis and next steps.`,
        starterPhrases: [
          `I am writing to refer this patient for specialist evaluation regarding...`,
          `Clinical examination and diagnostic imaging indicate...`,
          `Thank you for your collaborative assessment and care.`,
        ],
      },
      {
        category: "PROPOSAL" as const,
        title: `${role}: Comprehensive Care & Treatment Plan`,
        description: `Outline two treatment alternatives for a patient, comparing restorative options.`,
        starterPhrases: [
          `Thank you for discussing your treatment options with us today.`,
          `Based on our clinical findings, the most conservative approach involves...`,
          `Please let us know how you would like to proceed with the scheduled phases.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Patient Schedule & Urgent Pre-op Note`,
        description: `Send a concise message confirming appointment timing and required pre-procedure preparation.`,
        starterPhrases: [
          `This is a confirmation message regarding your upcoming appointment.`,
          `Please remember to avoid food or beverages for two hours prior.`,
          `Reach out to our front desk if you need to reschedule.`,
        ],
      },
      {
        category: "REVIEW" as const,
        title: `${role}: Post-Treatment Outcome Evaluation`,
        description: `Review post-treatment recovery milestones and provide recommendations for long-term maintenance.`,
        starterPhrases: [
          `Upon evaluating the post-treatment healing progress, outcomes appear favorable.`,
          `Consistent daily care and hygiene will ensure optimal long-term results.`,
          `A routine check-in is scheduled for next month to verify stability.`,
        ],
      },
    ];

    const generalTemplates = [
      {
        category: "EMAIL" as const,
        title: `${role}: Professional Consultation & Follow-up`,
        description: `Write a clear email to a client or colleague summarizing case status and next steps.`,
        starterPhrases: [
          `I am writing to provide an update regarding our recent discussion about...`,
          `Based on our evaluation, the recommended course of action is...`,
          `Please let me know if you have any questions or need further clarification.`,
        ],
      },
      {
        category: "REPORT" as const,
        title: `${role}: Progress & Milestone Status Report`,
        description: `Draft a brief update outlining key accomplishments and upcoming priorities for your team.`,
        starterPhrases: [
          `Please find the detailed status report for the recent phase below.`,
          `Key achievements accomplished during this period include...`,
          `Our primary focus for the upcoming cycle will be...`,
        ],
      },
      {
        category: "PROPOSAL" as const,
        title: `${role}: Strategic Plan & Project Proposal`,
        description: `Submit a structured proposal outlining recommended improvements and expected outcomes.`,
        starterPhrases: [
          `I am pleased to present this proposal outlining our recommended strategy for...`,
          `This initiative is designed to increase efficiency and mitigate potential risks.`,
          `We look forward to discussing how these recommendations align with your goals.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Client Priority Sync & Next Actions`,
        description: `Send a concise message confirming agreed priorities, key deliverables, and deadlines.`,
        starterPhrases: [
          `Following up on our sync, here are the key action items agreed upon.`,
          `I will handle the initial phase by tomorrow afternoon.`,
          `Please confirm if this timeline aligns with your expectations.`,
        ],
      },
      {
        category: "REVIEW" as const,
        title: `${role}: Deliverable Evaluation & Constructive Review`,
        description: `Provide an objective review of a recent milestone, project phase, or work deliverable.`,
        starterPhrases: [
          `Having reviewed the recent phase, I would like to highlight key strengths.`,
          `There are a few key areas where minor adjustments will improve final quality.`,
          `Overall, the outcome meets expectations, and we are ready for next steps.`,
        ],
      },
      {
        category: "LETTER" as const,
        title: `${role}: Formal Advisory & Recommendation Letter`,
        description: `Draft a formal letter providing clear professional guidance or consultation recommendations.`,
        starterPhrases: [
          `I am writing to formally communicate our recommendations regarding...`,
          `Our detailed assessment confirms that proceeding with this course is optimal.`,
          `Thank you for your ongoing collaboration on this engagement.`,
        ],
      },
    ];

    const healthcareA1Templates = [
      {
        category: "MESSAGE" as const,
        title: `${role}: Introduce Yourself to Clinic`,
        description: `Write 2 short sentences introducing your name and your role at the clinic.`,
        starterPhrases: [
          `Hello! My name is...`,
          `I am a ${role} at this clinic.`,
          `I am happy to work here with you.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Daily Work Routine Note`,
        description: `Write 2 simple sentences about what you do every day at work.`,
        starterPhrases: [
          `Every day, I help patients at the clinic.`,
          `I check appointments and prepare instruments.`,
          `I like my daily work.`,
        ],
      },
      {
        category: "EMAIL" as const,
        title: `${role}: Clinic Equipment Note`,
        description: `Write 2 short sentences mentioning a computer or tool you use at work.`,
        starterPhrases: [
          `In my work, I use a computer and basic tools.`,
          `Everything is clean and ready for patients.`,
          `Please let me know if you need help.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Friendly Greeting to Patients`,
        description: `Write a short 2-sentence greeting welcoming a patient to the clinic.`,
        starterPhrases: [
          `Welcome to our clinic!`,
          `Please take a seat and relax.`,
          `The doctor will see you in a moment.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Note to Your Team`,
        description: `Write 2 simple sentences telling your team you are ready to work.`,
        starterPhrases: [
          `Good morning, team!`,
          `I am at the office and ready to work today.`,
          `Have a great day.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Favorite Part of Your Job`,
        description: `Write 2 short sentences about what you enjoy in your work.`,
        starterPhrases: [
          `I like helping people feel better.`,
          `My team is very friendly and kind.`,
          `I enjoy my job every day.`,
        ],
      },
    ];

    const generalA1Templates = [
      {
        category: "MESSAGE" as const,
        title: `${role}: Introduce Yourself to the Team`,
        description: `Write 2 short sentences introducing your name and your job.`,
        starterPhrases: [
          `Hello everyone! My name is...`,
          `I work as a ${role}.`,
          `I am happy to collaborate with this team.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Daily Work Tools`,
        description: `Write 2 simple sentences about one tool or computer you use at work.`,
        starterPhrases: [
          `Every day, I use my laptop and email.`,
          `I also use simple software tools for my work.`,
          `They help me complete my tasks.`,
        ],
      },
      {
        category: "EMAIL" as const,
        title: `${role}: Short Status Greeting`,
        description: `Write a short 2-sentence update saying you started your tasks today.`,
        starterPhrases: [
          `Good morning!`,
          `I am working on my daily tasks today.`,
          `Everything is going well.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: Quick Question to a Teammate`,
        description: `Write 2 short sentences asking a coworker for quick help.`,
        starterPhrases: [
          `Hi! Do you have two minutes?`,
          `I have a quick question about this task.`,
          `Thank you for your help!`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: What I Like About My Job`,
        description: `Write 2 simple sentences about what you enjoy in your work.`,
        starterPhrases: [
          `I like learning new things every day.`,
          `I enjoy working with my colleagues.`,
          `My job is interesting and fun.`,
        ],
      },
      {
        category: "MESSAGE" as const,
        title: `${role}: End of Day Note`,
        description: `Write 2 short sentences saying you finished your work for the day.`,
        starterPhrases: [
          `I finished my work for today.`,
          `See you tomorrow morning!`,
          `Have a wonderful evening.`,
        ],
      },
    ];

    let templates = category === "HEALTHCARE" ? healthcareTemplates : generalTemplates;
    if (level === "A1") {
      templates = category === "HEALTHCARE" ? healthcareA1Templates : generalA1Templates;
    }
    const result: WritingTaskItem[] = [];

    for (let i = 0; i < count; i++) {
      const t = templates[i % templates.length];
      result.push({
        id: `seed-${level.toLowerCase()}-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        category: t.category,
        title: t.title,
        description: t.description,
        toneHint: "Polite, authoritative, empathetic",
        timeLimit,
        minWords,
        maxWords,
        level,
        roleCategory: category,
        starterPhrases: t.starterPhrases,
      });
    }

    return result;
  }
}
