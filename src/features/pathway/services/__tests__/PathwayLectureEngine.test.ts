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
    const orientationSegs = script1.segments.filter((s) => s.beat === "ORIENTATION");
    expect(orientationSegs.length).toBe(3);
    expect(orientationSegs[0]?.text).toContain("Liam");
    expect(orientationSegs[1]?.text).toContain("patrones estructurales");
    expect(orientationSegs[2]?.text).toContain("primera lección");
    expect(orientationSegs[2]?.subtitleSpanish).toContain("Guía de Estudio");
    expect(orientationSegs[2]?.subtitleSpanish).toContain("14 bloques");
    expect(orientationSegs[2]?.subtitleSpanish).toContain("Preguntar");

    const script2 = PathwayLectureEngine.buildLectureScript(dummyNode);
    expect(script2.segments.some((s) => s.beat === "ORIENTATION")).toBe(false);
    expect(script2.segments[0]?.beat).toBe("FORMULA");
  });

  it("orchestrates FORMULA -> TRAP -> TRAP_CHECK (pause checkpoint) -> EXAMPLES -> BUILD", () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    const script = PathwayLectureEngine.buildLectureScript(dummyNode);

    // La fórmula ahora son 3 pistas (regla, revelado, modelo nativo): se asertа por estructura.
    expect(script.segments[0]?.beat).toBe("FORMULA");
    expect(script.segments[0]?.text).toContain("El reto de esta base es");

    const trapSegs = script.segments.filter((s) => s.beat === "TRAP");
    expect(trapSegs.length).toBeGreaterThanOrEqual(2);
    const trapText = trapSegs.map((s) => s.text.toLowerCase()).join(" ");
    expect(trapText).toContain("alerta en rojo");
    expect(trapText).toContain("ancla mental");

    const checkIndex = script.segments.findIndex((s) => s.beat === "TRAP_CHECK");
    expect(checkIndex).toBeGreaterThan(0);
    expect(script.segments[checkIndex]?.pauseAfterForCheck).toBe(true);

    const exampleEnSegments = script.segments.filter((s) => s.beat === "EXAMPLES" && s.language === "en");
    expect(exampleEnSegments.length).toBeGreaterThanOrEqual(1);

    const phoneticEs = script.segments.find((s) => s.beat === "EXAMPLES" && s.language === "es");
    expect(phoneticEs?.text.toLowerCase()).toContain("cómo se unen las palabras");

    const buildSegs = script.segments.filter((s) => s.targetStep === "BUILD");
    expect(buildSegs.length).toBeGreaterThan(0);
    const buildText = buildSegs.map((s) => s.text.toLowerCase()).join(" ");
    expect(buildText).toContain("preguntar");
    expect(buildText).toContain("fichas");
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

  it("stays active across segments when SpeechSynthesisService.speak calls stop() internally, and stops immediately on external stop()", async () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    let finishFirstSegment: (() => void) | null = null;
    let callCount = 0;

    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((_text, opts) => {
      SpeechSynthesisService.stop();
      callCount++;
      if (callCount === 1) {
        finishFirstSegment = () => opts?.onEnd?.();
      }
      return Promise.resolve();
    });

    const onProgress = vi.fn();
    const onEnd = vi.fn();

    const stop = await PathwayLectureEngine.playLecture(dummyNode, onProgress, onEnd, "liam");

    expect(callCount).toBe(1);
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(onEnd).not.toHaveBeenCalled();

    // Advancing segment 1 must trigger segment 2 (still not finished prematurely)
    finishFirstSegment!();
    await new Promise((res) => setTimeout(res, 450));
    expect(callCount).toBeGreaterThanOrEqual(2);
    expect(onEnd).not.toHaveBeenCalled();

    // External stop() must cancel immediately and notify onEnd()
    SpeechSynthesisService.stop();
    expect(onEnd).toHaveBeenCalledTimes(1);
    stop();
  });
});
