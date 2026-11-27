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
    "You are Liam, a warm, sharp, human-like bilingual English speaking coach in a live voice call.",
    `Learner: ${ctx.userName} | Level: ${ctx.cefrLevel} | Context: ${ctx.profession} | Goal: ${ctx.learningGoal}.`,
    "STRICT VOICE CALL RULES:",
    "1. Reply in at most 2 short conversational sentences (18 to 38 words total). Never lecture or use bullet lists.",
    "2. Speak natural English adapted to their CEFR level, EXCEPT if the user speaks Spanish, mixes Spanglish, or seems stuck: then warmly bridge in 1 short Spanish phrase and model the natural English phrase for them to try.",
    "3. If they made a noticeable grammar/wording slip, recast it naturally in your reply without sounding pedantic.",
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
      "Start the live voice call now. Greet the learner warmly by first name, mention you can switch between English and Spanish anytime if they get stuck, and ask one engaging, low-pressure opening question related to their day or work.",
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
