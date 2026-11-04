import { beforeEach, describe, expect, it } from "vitest";
import { resolveFormulaCases } from "../../../../domain/entities/LearningPathway";
import { buildProceduralSeedNodes } from "../aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../PathwayLectureEngine";
import { PathwayQAService } from "../PathwayQAService";

describe("Pathway Master Lecture & Super Tutor — Pedagogical Quality Gate", () => {
  const seedNodes = buildProceduralSeedNodes("Cardiologist", "A1", "Clinical communication");
  const node = {
    id: "node-test-1",
    pathwayId: "pathway-1",
    orderIndex: 0,
    nodeType: "CORE_UNIT" as const,
    status: "ACTIVE" as const,
    title: seedNodes[0]!.title,
    competencyFocus: seedNodes[0]!.competencyFocus,
    blueprint: seedNodes[0]!.blueprint,
    lessonPayload: seedNodes[0]!.lessonPayload,
    masteryScore: 0,
    attemptsCount: 0,
    retentionStage: 0,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it("builds an 8-stage introductory live lecture on first visit, then 7-stage choreographed linguistics on subsequent visits", () => {
    // 1. First visit: explains the software once + full 7-stage live choreography
    const firstLecture = PathwayLectureEngine.buildLectureScript(node);
    expect(firstLecture.headline).toContain("Mentoría");
    expect(firstLecture.segments.length).toBe(8);
    expect(firstLecture.segments[0]?.badgeLabel).toContain("1. BIENVENIDA & GUÍA DE ESTUDIO");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);

    // 2. Subsequent visit: zero software repetition, dives straight into Formula -> Trap -> Trap Check -> Examples -> Build
    const secondLecture = PathwayLectureEngine.buildLectureScript(node);
    expect(secondLecture.segments.length).toBe(7);
    expect(secondLecture.segments[0]?.badgeLabel).toContain("1. PROPÓSITO REAL");
    expect(secondLecture.segments[1]?.badgeLabel).toContain("2. LA TRAMPA DEL ESPAÑOL");
    expect(secondLecture.segments[2]?.badgeLabel).toContain("3. CAZA LA TRAMPA");
    expect(secondLecture.segments[3]?.badgeLabel).toContain("4. MODELO NATIVO");
    expect(secondLecture.segments[4]?.badgeLabel).toContain("5. SECRETO FONÉTICO");
    expect(secondLecture.segments[5]?.badgeLabel).toContain("6. EJEMPLO APLICADO");
    expect(secondLecture.segments[6]?.badgeLabel).toContain("ACTIVACIÓN EN PANTALLA");

    expect(secondLecture.segments[3]?.language).toBe("en");
    expect(secondLecture.segments[5]?.language).toBe("en");
    expect(secondLecture.segments[0]?.language).toBe("es");
  });

  it("addresses multi-case A1 formulas 1 by 1 (e.g. Base 09 Do vs Does, Base 03 Am/Is/Are) without mashing incompatible usages", () => {
    expect(seedNodes.length).toBe(32);
    PathwayLectureEngine.markSoftwareIntroSeen();

    // Base 09 (index 8): Do vs Does -> 2 sequential FORMULA cases
    const base09 = { ...node, id: "node-9", orderIndex: 8, title: seedNodes[8]!.title, competencyFocus: seedNodes[8]!.competencyFocus, blueprint: seedNodes[8]!.blueprint, lessonPayload: seedNodes[8]!.lessonPayload };
    const script09 = PathwayLectureEngine.buildLectureScript(base09);
    const formulaSegs09 = script09.segments.filter((s) => s.beat === "FORMULA");
    expect(formulaSegs09.length).toBe(2);
    expect(formulaSegs09[0]?.activeFormulaCaseIndex).toBe(0);
    expect(formulaSegs09[1]?.activeFormulaCaseIndex).toBe(1);
    expect(formulaSegs09[0]?.badgeLabel).toContain("USO 1 DE 2");
    expect(formulaSegs09[1]?.badgeLabel).toContain("USO 2 DE 2");

    // Base 03 (index 2): Am / Is / Are -> 3 sequential FORMULA cases
    const base03 = { ...node, id: "node-3", orderIndex: 2, title: seedNodes[2]!.title, competencyFocus: seedNodes[2]!.competencyFocus, blueprint: seedNodes[2]!.blueprint, lessonPayload: seedNodes[2]!.lessonPayload };
    const script03 = PathwayLectureEngine.buildLectureScript(base03);
    const formulaSegs03 = script03.segments.filter((s) => s.beat === "FORMULA");
    expect(formulaSegs03.length).toBe(3);

    // Invariance across all 32 A1 foundations: zero mashed Do/Does or Don't/Doesn't in a single token
    for (const seed of seedNodes) {
      const cases = resolveFormulaCases(seed.lessonPayload!);
      expect(cases.length).toBeGreaterThanOrEqual(1);
      for (const c of cases) {
        expect(c.segments.length).toBeGreaterThanOrEqual(2);
        expect(c.explanationSpanish.length).toBeGreaterThan(20);
        for (const seg of c.segments) {
          expect(seg.token).not.toMatch(/\bDo\s*\/\s*Does\b/i);
          expect(seg.token).not.toMatch(/\bdon't\s*\/\s*doesn't\b/i);
        }
      }
    }
  });

  it("answers student questions in 3 distinct pedagogical layers with immediate speech segments", async () => {
    const answer = await PathwayQAService.askProfessor({
      question: "¿Por qué no puedo decir 'Is raining' como en español decimos 'Está lloviendo'?",
      node,
      profession: "Cardiologist",
      cefrLevel: "A1",
    });

    expect(answer.directAnswer.length).toBeGreaterThan(10);
    expect(answer.mentalModel.length).toBeGreaterThan(10);
    expect(answer.exampleEnglish.length).toBeGreaterThan(3);
    expect(answer.speechSegments.length).toBeGreaterThanOrEqual(2);

    const hasEnglishSegment = answer.speechSegments.some((s) => s.language === "en");
    const hasSpanishSegment = answer.speechSegments.some((s) => s.language === "es");
    expect(hasEnglishSegment).toBe(true);
    expect(hasSpanishSegment).toBe(true);
  });

  it("throws clear error on empty question", async () => {
    await expect(
      PathwayQAService.askProfessor({
        question: "   ",
        node,
      }),
    ).rejects.toThrow("Question cannot be empty");
  });
});
