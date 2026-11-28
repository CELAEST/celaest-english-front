import { callBackendAiChatGateway } from "../../../infrastructure/http/coreAiGatewayClient";
import { ConversationTurn, LiveSessionSummary } from "../types";

export interface CoachProfileContext {
  userName: string;
  cefrLevel: string;
  profession: string;
  learningGoal: string;
}

function buildLiveCoachSystemPrompt(ctx: CoachProfileContext): string {
  return [
    "You are Liam, a warm, sharp, human-like bilingual English speaking coach in a live voice call with Spanish speakers.",
    `Learner: ${ctx.userName} | Level: ${ctx.cefrLevel} | Context: ${ctx.profession} | Goal: ${ctx.learningGoal}.`,
    "STRICT VOICE CALL RULES:",
    "1. Reply in at most 2 short conversational sentences (14 to 30 words total). Start with a 2-to-4 word reaction followed by punctuation.",
    "2. ADAPTIVE SPANISH-TO-ENGLISH: By default (or for A1-B2 / when the learner speaks Spanish or makes slips), explain briefly in natural neutral Spanish and model the exact American English phrase. If the learner is advanced (C1/C2) or speaks fluently in English, stay in full conversational English.",
    "3. If they made a grammar slip, recast it naturally without lecturing.",
    "4. Always end with ONE concrete, easy-to-answer follow-up question to keep the conversation flowing.",
    "5. Output plain spoken text only (no markdown, no emojis, no quotes around the whole message).",
  ].join("\n");
}

export async function generateOpeningTurn(
  ctx: CoachProfileContext,
  signal?: AbortSignal,
): Promise<string> {
  const reply = await callBackendAiChatGateway({
    systemPrompt: buildLiveCoachSystemPrompt(ctx),
    userPrompt:
      "Start the live voice call now. Greet the learner warmly by first name in natural Spanish in 1 short sentence, say we will practice English step by step, and ask one low-pressure opening question.",
    maxTokens: 90,
    temperature: 0.75,
    signal,
  });
  return reply.trim();
}

export async function generateCoachReply(
  ctx: CoachProfileContext,
  turns: ConversationTurn[],
  latestUserText: string,
  signal?: AbortSignal,
): Promise<string> {
  const recentHistory = turns
    .slice(-8)
    .map((t) => `${t.role === "coach" ? "Liam" : "Learner"}: ${t.text}`)
    .join("\n");

  const userPrompt = recentHistory
    ? `Conversation so far:\n${recentHistory}\nLearner: ${latestUserText}\nLiam:`
    : `Learner: ${latestUserText}\nLiam:`;

  const reply = await callBackendAiChatGateway({
    systemPrompt: buildLiveCoachSystemPrompt(ctx),
    userPrompt,
    maxTokens: 110,
    temperature: 0.7,
    signal,
  });
  return reply.trim();
}

export async function generateSessionTakeaways(
  ctx: CoachProfileContext,
  turns: ConversationTurn[],
): Promise<LiveSessionSummary | null> {
  const userTurns = turns.filter((t) => t.role === "user" && t.text.trim().length > 0);
  if (userTurns.length === 0) return null;

  const transcript = turns
    .map((t) => `${t.role === "coach" ? "Liam" : "Learner"}: ${t.text}`)
    .join("\n");

  const raw = await callBackendAiChatGateway({
    systemPrompt:
      "You are a concise bilingual English coach. Analyze the learner's spoken turns and return ONLY valid JSON matching: " +
      '{"strength":"1 short encouraging sentence in Spanish about what they did well","upgrades":[{"said":"what learner said","better":"natural native English upgrade","tip":"5-10 word explanation in Spanish"}]} ' +
      "Include 2 to 3 upgrades maximum. Output raw JSON only, no markdown fences.",
    userPrompt: `Level: ${ctx.cefrLevel}\nTranscript:\n${transcript}`,
    maxTokens: 320,
    temperature: 0.3,
  });

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]) as Partial<LiveSessionSummary>;
    if (!parsed.strength || !Array.isArray(parsed.upgrades)) return null;
    return {
      strength: String(parsed.strength),
      upgrades: parsed.upgrades.slice(0, 3).map((u) => ({
        said: String(u.said || ""),
        better: String(u.better || ""),
        tip: String(u.tip || ""),
      })),
    };
  } catch {
    return null;
  }
}
