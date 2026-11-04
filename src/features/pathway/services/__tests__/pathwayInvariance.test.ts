import { describe, expect, it, beforeEach } from "vitest";
import { ApiPathwayRepository } from "../../../../infrastructure/repositories/ApiPathwayRepository";
import {
  buildProceduralLessonPayload,
  buildProceduralSeedNodes,
} from "../aiPathwayCurriculumService";

const FORBIDDEN_TECH_TERMS = [
  "kubernetes",
  "microservice",
  "pull request",
  "sprint",
  "backlog",
  "frontend",
  "backend",
  "javascript",
  "api endpoint",
  "product manager",
];

describe("Foundational Guide & Pathway — Multi-Domain Invariance & Progress Persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("generates progressive step-by-step foundations across A1 (32 foundations), A2 (32 foundations), B1 (32 foundations), B2 (32 foundations), C1 (32 foundations), C2 (32 foundations) with zero IT/software leakage", () => {
    const professions = [
      "Professional",
      "Master Pastry Chef",
      "Pediatric Neurologist",
      "Civil Litigation Attorney",
    ];
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

    for (const profession of professions) {
      for (const level of levels) {
        const seeds = buildProceduralSeedNodes(
          profession,
          level,
          "Step-by-step English Foundations",
        );
        expect(seeds).toHaveLength(32);

        for (const seed of seeds) {
          expect(seed.lessonPayload.formulaSegments.length).toBeGreaterThanOrEqual(2);
          expect(seed.lessonPayload.examples.length).toBeGreaterThanOrEqual(2);
          expect(seed.lessonPayload.blockChallenge.targetTokens.length).toBeGreaterThanOrEqual(3);
          expect(seed.lessonPayload.blockChallenge.distractorTokens.length).toBeGreaterThanOrEqual(1);
          expect(["reading", "writing", "interview", "memory"]).toContain(
            seed.lessonPayload.bridgeModule.target,
          );
        }

        const first = seeds[0]!;
        const fallbackPayload = buildProceduralLessonPayload(
          first.title,
          first.competencyFocus,
          first.blueprint,
          profession,
          level,
        );
        const corpus = JSON.stringify({ seeds, fallbackPayload }).toLowerCase();
        for (const term of FORBIDDEN_TECH_TERMS) {
          expect(corpus).not.toContain(term);
        }
      }
    }
  });

  it("persists completed foundations locally in 0ms and unlocks the next sequential foundation", async () => {
    const repo = new ApiPathwayRepository();
    const initial = repo.getOrSeedInitialPathway("A1", "Pastry Chef", "Speak clearly");

    expect(initial.nodes).toHaveLength(32);
    expect(initial.nodes[0]?.status).toBe("ACTIVE");
    expect(initial.nodes[1]?.status).toBe("LOCKED");
    expect(initial.masteryIndex).toBe(0);

    const firstNode = initial.nodes[0]!;
    const completed = await repo.completeNode({
      node: firstNode,
      pathway: initial,
      spokenOrBuiltSentence: firstNode.lessonPayload!.voicePractice.sentenceEnglish,
    });

    expect(completed.pathway.nodes[0]?.status).toBe("MASTERED");
    expect(completed.pathway.nodes[1]?.status).toBe("ACTIVE");
    expect(completed.pathway.masteryIndex).toBeGreaterThan(0);

    const reloaded = repo.getOrSeedInitialPathway("A1", "Pastry Chef", "Speak clearly");
    expect(reloaded.nodes[0]?.status).toBe("MASTERED");
    expect(reloaded.nodes[1]?.status).toBe("ACTIVE");

    const initialA2 = repo.getOrSeedInitialPathway("A2", "Litigation Attorney", "Complex arguments");
    expect(initialA2.nodes).toHaveLength(32);
    expect(initialA2.focusSummary).toContain("32 bases esenciales de A2");

    const initialB1 = repo.getOrSeedInitialPathway("B1", "Pediatric Neurologist", "Clinical discussions");
    expect(initialB1.nodes).toHaveLength(32);
    expect(initialB1.focusSummary).toContain("32 bases esenciales de B1");

    const initialB2 = repo.getOrSeedInitialPathway("B2", "Civil Litigation Attorney", "Executive diplomacy");
    expect(initialB2.nodes).toHaveLength(32);
    expect(initialB2.focusSummary).toContain("32 bases esenciales de B2");

    const initialC1 = repo.getOrSeedInitialPathway("C1", "Civil Litigation Attorney", "Mastery and rhetoric");
    expect(initialC1.nodes).toHaveLength(32);
    expect(initialC1.focusSummary).toContain("32 bases esenciales de C1");

    const initialC2 = repo.getOrSeedInitialPathway("C2", "Civil Litigation Attorney", "Sovereign speaker");
    expect(initialC2.nodes).toHaveLength(32);
    expect(initialC2.focusSummary).toContain("32 bases esenciales de C2");
  });
});
