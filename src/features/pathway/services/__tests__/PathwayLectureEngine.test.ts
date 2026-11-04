import { describe, it, expect, beforeEach, vi } from "vitest";
import { PathwayLectureEngine } from "../PathwayLectureEngine";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { buildProceduralSeedNodes } from "../aiPathwayCurriculumService";
import { PathwayNode } from "../../../../domain/entities/LearningPathway";

describe("PathwayLectureEngine & Choreographed Live Classroom", () => {
  const seed = buildProceduralSeedNodes("Professional", "A1", "Communication");
  const dummyNode: PathwayNode = {
    id: "test-node-1",
    pathwayId: "pathway-1",
    orderIndex: 0,
    nodeType: "CORE_UNIT",
    status: "ACTIVE",
    title: seed[0]!.title,
    competencyFocus: seed[0]!.competencyFocus,
    blueprint: seed[0]!.blueprint,
    lessonPayload: seed[0]!.lessonPayload,
    masteryScore: 0,
    attemptsCount: 0,
    retentionStage: 0,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("includes software UI orientation exactly once, and suppresses it in subsequent lectures", () => {
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    const script1 = PathwayLectureEngine.buildLectureScript(dummyNode);
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);
    expect(script1.segments[0]?.beat).toBe("ORIENTATION");
    expect(script1.segments[0]?.text).toContain("Liam");
    expect(script1.segments[0]?.text).toContain("Guía de Estudio");
    expect(script1.segments[0]?.text).toContain("14 Bloques");
    expect(script1.segments[0]?.text).toContain("Alfabeto Fonético");

    const script2 = PathwayLectureEngine.buildLectureScript(dummyNode);
    expect(script2.segments.some((s) => s.beat === "ORIENTATION")).toBe(false);
    expect(script2.segments[0]?.beat).toBe("FORMULA");
  });

  it("orchestrates FORMULA -> TRAP -> TRAP_CHECK (pause checkpoint) -> EXAMPLES -> BUILD", () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    const script = PathwayLectureEngine.buildLectureScript(dummyNode);

    expect(script.segments[0]?.beat).toBe("FORMULA");
    expect(script.segments[0]?.text).toContain("El reto de esta base es");

    expect(script.segments[1]?.beat).toBe("TRAP");
    expect(script.segments[1]?.text).toContain("alerta en rojo");
    expect(script.segments[1]?.text).toContain("ancla mental");

    expect(script.segments[2]?.beat).toBe("TRAP_CHECK");
    expect(script.segments[2]?.pauseAfterForCheck).toBe(true);

    const exampleEnSegments = script.segments.filter((s) => s.beat === "EXAMPLES" && s.language === "en");
    expect(exampleEnSegments.length).toBeGreaterThanOrEqual(1);

    const phoneticEs = script.segments.find((s) => s.beat === "EXAMPLES" && s.language === "es");
    expect(phoneticEs?.text.toLowerCase()).toContain("cómo se unen las palabras");

    const lastSeg = script.segments[script.segments.length - 1]!;
    expect(lastSeg.text.toLowerCase()).toContain("preguntar");
    expect(lastSeg.text).toContain("fichas");
    expect(lastSeg.targetStep).toBe("BUILD");
  });

  it("pauses cleanly at TRAP_CHECK when onPauseForCheck is provided, and resumes into EXAMPLES -> BUILD", async () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    vi.useFakeTimers();
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((_text, opts) => {
      if (opts?.onEnd) opts.onEnd();
      return Promise.resolve();
    });

    const script = PathwayLectureEngine.buildLectureScript(dummyNode);
    const stepTriggers: string[] = [];
    let pausedBeat: string | null = null;
    let resumeIdx = -1;

    const stop1 = await PathwayLectureEngine.playLecture(
      dummyNode,
      () => {},
      () => {},
      "liam",
      (step) => stepTriggers.push(step),
      undefined,
      {
        script,
        onPauseForCheck: (beat, nextIdx) => {
          pausedBeat = beat;
          resumeIdx = nextIdx;
        },
      },
    );

    await vi.runAllTimersAsync();
    expect(pausedBeat).toBe("TRAP_CHECK");
    expect(resumeIdx).toBeGreaterThan(0);
    expect(stepTriggers).not.toContain("BUILD");
    stop1();

    // Resume after student solves TRAP_CHECK
    const stop2 = await PathwayLectureEngine.playLecture(
      dummyNode,
      () => {},
      () => {},
      "liam",
      (step) => stepTriggers.push(step),
      undefined,
      { script, startFromIndex: resumeIdx },
    );

    await vi.runAllTimersAsync();
    expect(stepTriggers).toContain("BUILD");
    stop2();
    vi.useRealTimers();
  });

  it("prioritizes immediate segments upon playLecture start with lookahead prefetch", async () => {
    const prefetchSpy = vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((_text, opts) => {
      if (opts?.onEnd) opts.onEnd();
      return Promise.resolve();
    });

    const stop = await PathwayLectureEngine.playLecture(dummyNode, () => {}, () => {}, "liam");
    expect(prefetchSpy).toHaveBeenCalled();
    stop();
  });
});
