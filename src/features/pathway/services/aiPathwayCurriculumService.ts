/**
 * Foundational English Guide & AI Curriculum Service
 * Teaches the core building blocks of English step-by-step (A1 from absolute zero up to C2)
 * using visual LEGO formulas, natural phonetic hints, magnetic word blocks, and module bridges.
 */

import {
  BridgeModuleTarget,
  PathwayBlueprint,
  PathwayLessonPayload,
  PathwayNode,
} from "../../../domain/entities/LearningPathway";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { CefrLevelCode, normalizeCefr } from "../../conversation/services/dynamicQuestionService";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { buildA1Foundations, FoundationUnitSpec } from "../curriculum/a1Foundations";
import { buildA2Foundations } from "../curriculum/a2Foundations";
import { buildB1Foundations } from "../curriculum/b1Foundations";
import { buildB2Foundations } from "../curriculum/b2Foundations";
import { buildC1Foundations } from "../curriculum/c1Foundations";
import { buildC2Foundations } from "../curriculum/c2Foundations";

export interface GeneratedSeedNode {
  title: string;
  competencyFocus: string;
  sourceWeaknessTag?: string;
  blueprint: PathwayBlueprint;
  lessonPayload: PathwayLessonPayload;
}

function stripFence(raw: string): string {
  return raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function buildLevelFoundations(level: CefrLevelCode, profession: string): FoundationUnitSpec[] {
  const cleanRole =
    profession.trim() && profession.trim().toLowerCase() !== "professional"
      ? profession.trim()
      : "";
  const roleExampleNoun = cleanRole ? `as a ${cleanRole}` : "at work";
  const roleExampleEsp = cleanRole ? `como ${cleanRole}` : "en mi trabajo";

  if (level === "A1") {
    return buildA1Foundations(roleExampleNoun, roleExampleEsp);
  }

  if (level === "A2") {
    return buildA2Foundations(roleExampleNoun, roleExampleEsp);
  }

  if (level === "B1") {
    return buildB1Foundations(roleExampleNoun, roleExampleEsp);
  }

  if (level === "B2") {
    return buildB2Foundations(roleExampleNoun, roleExampleEsp);
  }

  if (level === "C1") {
    return buildC1Foundations(roleExampleNoun, roleExampleEsp);
  }

  // C2 progressive foundations (32 bases of Native Mastery & Sovereign Speaker)
  return buildC2Foundations(roleExampleNoun, roleExampleEsp);
}

export function buildProceduralSeedNodes(
  profession: string,
  cefrLevel: string,
  _learningGoal: string,
  _memoryErrors: MemoryCard[] = [],
): GeneratedSeedNode[] {
  const level = normalizeCefr(cefrLevel);
  const role = profession.trim() || "Professional";
  const units = buildLevelFoundations(level, role);

  return units.map((unit) => ({
    title: unit.title,
    competencyFocus: unit.focus,
    sourceWeaknessTag: unit.focus,
    blueprint: {
      objectiveSpanish: unit.payload.ruleTaglineSpanish,
      l1InterferenceTrap: unit.payload.commonMistake.whySpanish,
      nativeIntuitionRule: unit.focus,
      targetCollocations: unit.payload.formulaSegments.map((s) => s.token),
      masterySuccessMetric: "Comprender la fÃ³rmula, armar el bloque y pronunciarlo.",
    },
    lessonPayload: unit.payload,
  }));
}

export function buildProceduralLessonPayload(
  title: string,
  competencyFocus: string,
  _blueprint: PathwayBlueprint,
  profession: string,
  cefrLevel: string,
): PathwayLessonPayload {
  const seeds = buildProceduralSeedNodes(profession, cefrLevel, "");
  const matched =
    seeds.find((s) => s.title.toLowerCase() === title.toLowerCase()) ||
    seeds.find((s) => s.competencyFocus.toLowerCase() === competencyFocus.toLowerCase()) ||
    seeds[0]!;
  return matched.lessonPayload;
}

export class AiPathwayCurriculumService {
  public static async synthesizeSeedCurriculum(params: {
    profession: string;
    cefrLevel: string;
    learningGoal: string;
    memoryErrors?: MemoryCard[];
    useAiCustomization?: boolean;
  }): Promise<GeneratedSeedNode[]> {
    const role = params.profession.trim() || "Professional";
    const level = normalizeCefr(params.cefrLevel);
    const goal = params.learningGoal.trim() || "Professional Communication & Fluency";
    const baseSeeds = buildProceduralSeedNodes(role, level, goal, params.memoryErrors || []);

    if (!params.useAiCustomization) {
      return baseSeeds;
    }

    try {
      const raw = await directClientAiService.chatCompletion({
        systemPrompt:
          "You are a warm, crystal-clear English foundations teacher for Spanish speakers. Teach fundamental English grammar rules step-by-step in simple, friendly Spanish with ultra-clear everyday English examples. Return ONLY valid raw JSON.",
        userPrompt: `Create 6 beginner-friendly foundational English lessons for CEFR level ${level} (learner profile: ${role}, goal: ${goal}).
Focus strictly on fundamental grammar rules in logical order so the learner understands how English works before practicing Reading, Writing, and Speaking.
Return ONLY a JSON array of 6 objects matching this exact schema:
[
  {
    "title": "Short Spanish lesson title",
    "competencyFocus": "Short rule focus",
    "lessonPayload": {
      "ruleTaglineSpanish": "1 super clear friendly sentence in Spanish",
      "formulaSegments": [
        { "label": "1. QUIÃ‰N", "token": "I / You", "tone": "violet" },
        { "label": "2. VERBO", "token": "work", "tone": "emerald" }
      ],
      "commonMistake": {
        "wrong": "Short typical mistake",
        "wrongToken": "word",
        "correct": "Short correct sentence",
        "correctToken": "word",
        "whySpanish": "1 short explanation in Spanish"
      },
      "examples": [
        { "english": "...", "spanish": "...", "pronunciationHint": "easy Spanish-style phonetic reading" }
      ],
      "blockChallenge": {
        "promptSpanish": "Arma en inglÃ©s: Â«...Â»",
        "targetTokens": ["Word1", "word2", "word3"],
        "distractorTokens": ["wrongWord"],
        "successTipSpanish": "1 celebratory line in Spanish",
        "mistakeHintSpanish": "1 gentle hint in Spanish"
      },
      "voicePractice": {
        "sentenceEnglish": "Exact same English sentence assembled in blockChallenge.targetTokens",
        "spanishMeaning": "Natural Spanish meaning of that exact sentence",
        "pronunciationHint": "..."
      },
      "bridgeModule": {
        "target": "reading",
        "moduleLabel": "Reading",
        "reasonSpanish": "1 short sentence connecting this rule to that module"
      }
    }
  }
]`,
        maxTokens: 3200,
      });

      const parsed = JSON.parse(stripFence(raw)) as Array<{
        title: string;
        competencyFocus: string;
        lessonPayload: PathwayLessonPayload;
      }>;
      if (
        Array.isArray(parsed) &&
        parsed.length >= 5 &&
        parsed[0]?.lessonPayload?.blockChallenge?.targetTokens?.length
      ) {
        return parsed.slice(0, 6).map((item, i) => {
          const validTarget: BridgeModuleTarget = ["reading", "writing", "interview", "memory"].includes(
            item.lessonPayload.bridgeModule?.target,
          )
            ? item.lessonPayload.bridgeModule.target
            : baseSeeds[i]?.lessonPayload.bridgeModule.target || "reading";
          return {
            title: item.title,
            competencyFocus: item.competencyFocus,
            sourceWeaknessTag: item.competencyFocus,
            blueprint: {
              objectiveSpanish: item.lessonPayload.ruleTaglineSpanish,
              l1InterferenceTrap: item.lessonPayload.commonMistake.whySpanish,
              nativeIntuitionRule: item.competencyFocus,
              targetCollocations: item.lessonPayload.formulaSegments.map((f) => f.token),
              masterySuccessMetric: "Regla + Bloques + Voz",
            },
            lessonPayload: {
              ...item.lessonPayload,
              bridgeModule: {
                ...item.lessonPayload.bridgeModule,
                target: validTarget,
              },
            },
          };
        });
      }
    } catch {
      // Fallback seamlessly to curated step-by-step foundations
    }

    return baseSeeds;
  }

  public static async synthesizeLessonPayload(
    node: PathwayNode,
    profession: string,
    cefrLevel: string,
  ): Promise<PathwayLessonPayload> {
    if (node.lessonPayload?.blockChallenge?.targetTokens?.length) {
      return node.lessonPayload;
    }
    return buildProceduralLessonPayload(
      node.title,
      node.competencyFocus,
      node.blueprint,
      profession,
      cefrLevel,
    );
  }
}

