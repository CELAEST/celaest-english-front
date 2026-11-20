import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PathwayNode } from "../../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { buildProceduralSeedNodes } from "../../services/aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../../services/PathwayLectureEngine";
import { useLiveClassChoreography } from "../useLiveClassChoreography";
import { usePathwayStageSession } from "../usePathwayStageSession";

describe("useLiveClassChoreography — First-time Orientation & Hydration Resilience", () => {
  const seedB1 = buildProceduralSeedNodes("Software Engineer", "B1", "Fluency");
  const seedA1 = buildProceduralSeedNodes("Software Engineer", "A1", "Fluency");

  const b1SeedNode: PathwayNode = {
    id: "guide-b1-node-1",
    pathwayId: "guide-b1",
    orderIndex: 0,
    nodeType: "CORE_UNIT",
    status: "ACTIVE",
    title: seedB1[0]!.title,
    competencyFocus: seedB1[0]!.competencyFocus,
    blueprint: seedB1[0]!.blueprint,
    lessonPayload: seedB1[0]!.lessonPayload,
    masteryScore: 0,
    attemptsCount: 0,
    retentionStage: 0,
  };

  const a1SeedNode: PathwayNode = {
    id: "guide-a1-node-1",
    pathwayId: "guide-a1",
    orderIndex: 0,
    nodeType: "CORE_UNIT",
    status: "ACTIVE",
    title: seedA1[0]!.title,
    competencyFocus: seedA1[0]!.competencyFocus,
    blueprint: seedA1[0]!.blueprint,
    lessonPayload: seedA1[0]!.lessonPayload,
    masteryScore: 0,
    attemptsCount: 0,
    retentionStage: 0,
  };

  const a1BackendNode: PathwayNode = {
    ...a1SeedNode,
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    pathwayId: "11111111-2222-3333-4444-555555555555",
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  it("keeps ORIENTATION uninterrupted when seed node hydrates into resolved CEFR + DB UUID, then marks seen and runs FORMULA", async () => {
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    const stopSpy = vi.spyOn(SpeechSynthesisService, "stop").mockImplementation(() => {});

    const spokenQueue: Array<{ text: string; resolve: () => void }> = [];
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((text, opts) => {
      spokenQueue.push({ text, resolve: () => opts?.onEnd?.() });
      return Promise.resolve();
    });

    const autoGuideCalls: Array<"structure" | "phonetics" | null> = [];
    const { result, rerender, unmount } = renderHook(
      ({ node, cefrLevel }: { node: PathwayNode; cefrLevel: string }) => {
        const stage = usePathwayStageSession(node, "Software Engineer", async () => {}, cefrLevel);
        const choreography = useLiveClassChoreography({
          node,
          step: stage.step,
          cefrLevel,
          isActive: true,
          onAutoGuideSectionChange: (sec) => autoGuideCalls.push(sec),
          onBeforeLectureStart: () => {},
        });
        return { stage, choreography };
      },
      { initialProps: { node: b1SeedNode, cefrLevel: "B1" } },
    );

    // Must start on ORIENTATION visually with zero FORMULA flash
    expect(result.current.choreography.activeBeat).toBe("ORIENTATION");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    // Start 120ms lecture auto-trigger -> Segment 0 (intro_welcome)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    expect(spokenQueue.length).toBe(1);
    expect(spokenQueue[0]!.text).toContain("Liam");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);
    stopSpy.mockClear();

    // Async hydration #1: user level resolves B1 -> A1 while intro segment 0 is still speaking
    rerender({ node: a1SeedNode, cefrLevel: "A1" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    // Async hydration #2: backend /pathway/current returns DB UUID node while intro is still speaking
    rerender({ node: a1BackendNode, cefrLevel: "A1" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });

    // CRITICAL: Neither usePathwayStageSession nor useLiveClassChoreography may abort ORIENTATION on hydration
    expect(stopSpy).not.toHaveBeenCalled();
    expect(result.current.choreography.activeBeat).toBe("ORIENTATION");
    expect(spokenQueue.length).toBe(1);
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    // Finish Segment 0 -> Segment 1 -> Segment 2 (intro_guide) -> Segment 3 (intro_method)
    await act(async () => {
      spokenQueue[0]!.resolve();
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(spokenQueue.length).toBe(2);
    expect(spokenQueue[1]!.text).toContain("patrones estructurales");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    // Segment 2: intro_guide dynamically opens Structure -> switches at ~5.5s to Phonetics -> closes on segment end
    await act(async () => {
      spokenQueue[1]!.resolve();
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(spokenQueue.length).toBe(3);
    expect(spokenQueue[2]!.text).toContain("guía de estudio");
    expect(autoGuideCalls).toEqual(["structure"]);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5500);
    });
    expect(autoGuideCalls).toEqual(["structure", "phonetics"]);

    await act(async () => {
      spokenQueue[2]!.resolve();
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(autoGuideCalls).toEqual(["structure", "phonetics", null]);
    expect(spokenQueue.length).toBe(4);
    expect(spokenQueue[3]!.text).toContain("primera lección");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    // Completing final ORIENTATION segment marks flag, flips board to FORMULA, AND seamlessly starts hydrated A1 class!
    await act(async () => {
      spokenQueue[3]!.resolve();
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);
    expect(result.current.choreography.activeBeat).toBe("FORMULA");
    expect(result.current.choreography.isDictating).toBe(true);
    expect(spokenQueue.length).toBe(5);
    expect(spokenQueue[4]!.text).not.toContain("Qué gusto verte de nuevo");
    expect(spokenQueue[4]!.text).toContain("El reto de esta base es");

    unmount();
    vi.useRealTimers();
  });

  it("stays silent on FORMULA when intro was already seen and only speaks on Comenzar Clase click", async () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    const speakSpy = vi.spyOn(SpeechSynthesisService, "speak").mockImplementation(() => Promise.resolve());

    const { result, unmount } = renderHook(() =>
      useLiveClassChoreography({
        node: a1BackendNode,
        step: "RULE",
        cefrLevel: "A1",
        isActive: true,
        onBeforeLectureStart: () => {},
      }),
    );

    expect(result.current.activeBeat).toBe("FORMULA");
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    // Must remain completely silent before clicking "Comenzar Clase"
    expect(speakSpy).not.toHaveBeenCalled();
    expect(result.current.isDictating).toBe(false);

    // Clicking "Comenzar Clase" starts speaking immediately
    await act(async () => {
      result.current.handleToggleLecture();
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.isDictating).toBe(true);
    expect(speakSpy).toHaveBeenCalledTimes(1);

    unmount();
    vi.useRealTimers();
  });

  it("marks intro seen if user explicitly clicks 'Ir a la regla' to skip ORIENTATION", async () => {
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation(() => Promise.resolve());

    const { result, unmount } = renderHook(() =>
      useLiveClassChoreography({
        node: a1SeedNode,
        step: "RULE",
        cefrLevel: "A1",
        isActive: true,
        onBeforeLectureStart: () => {},
      }),
    );

    expect(result.current.activeBeat).toBe("ORIENTATION");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(false);

    await act(async () => {
      result.current.handleSelectBeat("FORMULA");
      await vi.advanceTimersByTimeAsync(50);
    });

    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);
    expect(result.current.activeBeat).toBe("FORMULA");

    unmount();
    vi.useRealTimers();
  });

  it("preserves ORIENTATION across double hydration race (b1Seed -> b1Backend -> a1Seed -> a1Backend) without stopping speech", async () => {
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    const stopSpy = vi.spyOn(SpeechSynthesisService, "stop").mockImplementation(() => {});

    const spokenQueue: Array<{ text: string; resolve: () => void }> = [];
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((text, opts) => {
      spokenQueue.push({ text, resolve: () => opts?.onEnd?.() });
      return Promise.resolve();
    });

    const b1BackendNode: PathwayNode = {
      ...b1SeedNode,
      id: "b1-backend-uuid-0001",
      pathwayId: "b1-pathway-uuid-0001",
    };

    const autoGuideCalls: Array<"structure" | "phonetics" | null> = [];
    const { result, rerender, unmount } = renderHook(
      ({ node, cefrLevel }: { node: PathwayNode; cefrLevel: string }) => {
        const stage = usePathwayStageSession(node, "Software Engineer", async () => {}, cefrLevel);
        const choreography = useLiveClassChoreography({
          node,
          step: stage.step,
          cefrLevel,
          isActive: true,
          onAutoGuideSectionChange: (sec) => autoGuideCalls.push(sec),
          onBeforeLectureStart: () => {},
        });
        return { stage, choreography };
      },
      { initialProps: { node: b1SeedNode, cefrLevel: "B1" } },
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    expect(spokenQueue.length).toBe(1);
    stopSpy.mockClear();

    // Race sequence: B1 seed -> B1 backend UUID -> A1 seed (after profile loads) -> A1 backend UUID
    rerender({ node: b1BackendNode, cefrLevel: "B1" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    rerender({ node: a1SeedNode, cefrLevel: "A1" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(80);
    });
    rerender({ node: a1BackendNode, cefrLevel: "A1" });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });

    expect(stopSpy).not.toHaveBeenCalled();
    expect(result.current.choreography.activeBeat).toBe("ORIENTATION");
    expect(spokenQueue.length).toBe(1);

    unmount();
    vi.useRealTimers();
  });

  it("never prepends 'welcome_returning' before FORMULA when returning user clicks Comenzar Clase (prevents 2 voices back-to-back)", async () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    sessionStorage.clear();
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    const spokenTexts: string[] = [];
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((text) => {
      spokenTexts.push(text);
      return Promise.resolve();
    });

    const { result, unmount } = renderHook(() =>
      useLiveClassChoreography({
        node: a1BackendNode,
        step: "RULE",
        cefrLevel: "A1",
        isActive: true,
        onBeforeLectureStart: () => {},
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(spokenTexts).toHaveLength(0);

    await act(async () => {
      result.current.handleToggleLecture();
      await vi.advanceTimersByTimeAsync(50);
    });

    expect(spokenTexts).toHaveLength(1);
    expect(spokenTexts[0]).toContain("El reto de esta base es");
    expect(spokenTexts[0]).not.toContain("Qué gusto verte de nuevo");

    unmount();
    vi.useRealTimers();
  });

  it("stops ORIENTATION silently when user skips via handleSelectBeat('FORMULA') and waits for Comenzar Clase", async () => {
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    const spokenTexts: string[] = [];
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation((text) => {
      spokenTexts.push(text);
      return Promise.resolve();
    });

    const { result, unmount } = renderHook(() =>
      useLiveClassChoreography({
        node: a1SeedNode,
        step: "RULE",
        cefrLevel: "A1",
        isActive: true,
        onBeforeLectureStart: () => {},
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    expect(spokenTexts).toHaveLength(1); // ORIENTATION started

    await act(async () => {
      result.current.handleSelectBeat("FORMULA");
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);
    expect(result.current.activeBeat).toBe("FORMULA");
    expect(result.current.isDictating).toBe(false);
    // Must stay silent on FORMULA until user explicitly clicks Comenzar Clase
    expect(spokenTexts).toHaveLength(1);

    await act(async () => {
      result.current.handleToggleLecture();
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.isDictating).toBe(true);
    expect(spokenTexts).toHaveLength(2);
    expect(spokenTexts[1]).toContain("El reto de esta base es");

    unmount();
    vi.useRealTimers();
  });

  it("pauses active speech without wiping beat progress when switching workspace tabs (isActive false -> true)", async () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    vi.spyOn(SpeechSynthesisService, "prefetch").mockImplementation(() => Promise.resolve({} as any));
    vi.spyOn(SpeechSynthesisService, "speak").mockImplementation(() => Promise.resolve());

    const { result, rerender, unmount } = renderHook(
      ({ isActive }: { isActive: boolean }) =>
        useLiveClassChoreography({
          node: a1BackendNode,
          step: "RULE",
          cefrLevel: "A1",
          isActive,
          onBeforeLectureStart: () => {},
        }),
      { initialProps: { isActive: true } },
    );

    await act(async () => {
      result.current.handleSelectBeat("EXAMPLES");
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.activeBeat).toBe("EXAMPLES");

    rerender({ isActive: false });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.isDictating).toBe(false);

    rerender({ isActive: true });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200);
    });
    // Preserves selected beat and stays silent until user resumes
    expect(result.current.activeBeat).toBe("EXAMPLES");
    expect(result.current.isDictating).toBe(false);

    unmount();
    vi.useRealTimers();
  });
});
