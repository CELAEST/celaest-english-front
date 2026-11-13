import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveFormulaCases } from "../../../../domain/entities/LearningPathway";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { AiInfrastructureError, directClientAiService } from "../../../settings/services/directClientAiService";
import { resolveSpeechProfile } from "../../speech/profiles";
import { buildProceduralSeedNodes } from "../aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../PathwayLectureEngine";
import { PathwayQAService } from "../PathwayQAService";
import { PhoneticAudioService } from "../PhoneticAudioService";

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
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("builds a 3-step universal orientation on first visit, then enters lesson directly on subsequent visits", () => {
    // 1. First visit: 3-step universal intro (intro_welcome, intro_philosophy, intro_method) + live choreography
    const firstLecture = PathwayLectureEngine.buildLectureScript(node);
    expect(firstLecture.headline).toContain("Mentoría");
    const orientationBeats = firstLecture.segments.filter((s) => s.beat === "ORIENTATION");
    expect(orientationBeats.length).toBe(3);
    expect(firstLecture.segments[0]?.badgeLabel).toContain("1. BIENVENIDA");
    expect(PathwayLectureEngine.isSoftwareIntroSeen()).toBe(true);

    // 2. Segunda visita: sin orientación, entra directo a la clase
    const secondLecture = PathwayLectureEngine.buildLectureScript(node);
    expect(secondLecture.segments.some((s) => s.beat === "ORIENTATION")).toBe(false);

    // 2b. Visita de retorno con bienvenida corta cuando aplica
    const returningLecture = PathwayLectureEngine.buildLectureScript(node, { includeReturningWelcome: true });
    expect(returningLecture.segments[0]?.text).toContain("Qué gusto verte de nuevo");

    // 3. Estructura del guion: fórmula (3) -> trampa (5) -> check -> ejemplos (4) -> build (2)
    const beats = secondLecture.segments.map((s) => s.beat);
    expect(beats.slice(0, 3)).toEqual(["FORMULA", "FORMULA", "FORMULA"]);
    expect(beats.filter((b) => b === "TRAP").length).toBe(7);
    expect(beats.filter((b) => b === "TRAP_CHECK").length).toBe(1);
    expect(beats.filter((b) => b === "EXAMPLES").length).toBe(3);
    expect(secondLecture.segments.filter((s) => s.targetStep === "BUILD").length).toBe(2);
    expect(secondLecture.segments.find((s) => s.beat === "TRAP_CHECK")?.pauseAfterForCheck).toBe(true);

    // 4. Una pista = un idioma. Los modelos nativos son pistas propias.
    const enTexts = secondLecture.segments.filter((s) => s.language === "en").map((s) => s.text);
    expect(enTexts).toEqual([
      "I work every day.",
      "I, you, we, they.",
      "Work every day.",
      "I work every day.",
      "I learn English step by step.",
      "I work with my team every morning.",
    ]);

    // 5. Cero contaminación bilingüe en las pistas en español
    const esSegs = secondLecture.segments.filter((s) => s.language === "es");
    for (const s of esSegs) {
      const t = s.text.toLowerCase();
      expect(t).not.toContain("i work every day");
      expect(t).not.toContain("i learn english");
      expect(t).not.toContain("work every morning");
    }
  });

  it("addresses multi-case A1 formulas 1 by 1 (e.g. Base 09 Do vs Does, Base 03 Am/Is/Are) without mashing incompatible usages", () => {
    expect(seedNodes.length).toBe(32);
    PathwayLectureEngine.markSoftwareIntroSeen();

    // Base 09 (index 8): Do vs Does -> 2 sequential FORMULA cases
    const base09 = { ...node, id: "node-9", orderIndex: 8, title: seedNodes[8]!.title, competencyFocus: seedNodes[8]!.competencyFocus, blueprint: seedNodes[8]!.blueprint, lessonPayload: seedNodes[8]!.lessonPayload };
    const script09 = PathwayLectureEngine.buildLectureScript(base09);
    const formulaSegs09 = script09.segments.filter(
      (s) => s.beat === "FORMULA" && s.activeFormulaCaseIndex !== undefined,
    );
    expect(formulaSegs09.length).toBe(4);
    expect(formulaSegs09.map((s) => s.activeFormulaCaseIndex)).toEqual([0, 0, 1, 1]);
    expect(formulaSegs09[0]?.badgeLabel).toContain("CASO 1 DE 2");
    expect(formulaSegs09[2]?.badgeLabel).toContain("CASO 2 DE 2");

    // Base 03 (index 2): perfil declarativo con 3 casos (VÍA A) + la regla que los anuncia.
    // 4 pistas en español (regla + 3 intros) + 3 modelos nativos en inglés.
    const base03 = { ...node, id: "node-3", orderIndex: 2, title: seedNodes[2]!.title, competencyFocus: seedNodes[2]!.competencyFocus, blueprint: seedNodes[2]!.blueprint, lessonPayload: seedNodes[2]!.lessonPayload };
    const script03 = PathwayLectureEngine.buildLectureScript(base03);
    const formulaSegs03 = script03.segments.filter((s) => s.beat === "FORMULA");
    expect(formulaSegs03.length).toBe(7);
    expect(
      new Set(
        formulaSegs03
          .filter((s) => s.activeFormulaCaseIndex !== undefined)
          .map((s) => s.activeFormulaCaseIndex),
      ).size,
    ).toBe(3);
    expect(formulaSegs03.filter((s) => s.language === "en").length).toBe(3);
    expect(formulaSegs03.filter((s) => s.language === "es").length).toBe(4);
    expect(formulaSegs03.some((s) => s.text.includes("tres parejas fijas"))).toBe(true);

    // Base 04 (index 3): perfil declarativo con 2 casos + la regla que los anuncia.
    // 3 pistas en español (regla + 2 intros) + 2 modelos nativos en inglés.
    const base04 = { ...node, id: "node-4", orderIndex: 3, title: seedNodes[3]!.title, competencyFocus: seedNodes[3]!.competencyFocus, blueprint: seedNodes[3]!.blueprint, lessonPayload: seedNodes[3]!.lessonPayload };
    const script04 = PathwayLectureEngine.buildLectureScript(base04);
    const formulaSegs04 = script04.segments.filter((s) => s.beat === "FORMULA");
    expect(formulaSegs04.length).toBe(5);
    expect(
      new Set(
        formulaSegs04
          .filter((s) => s.activeFormulaCaseIndex !== undefined)
          .map((s) => s.activeFormulaCaseIndex),
      ).size,
    ).toBe(2);
    expect(formulaSegs04.filter((s) => s.language === "en").length).toBe(2);
    expect(formulaSegs04.filter((s) => s.language === "es").length).toBe(3);
    expect(formulaSegs04.some((s) => s.text.includes("dos usos"))).toBe(true);

    // Base 05 (index 4): perfil declarativo con 2 casos + la regla que los anuncia.
    // 3 pistas en español (regla + 2 intros) + 2 modelos nativos en inglés.
    const base05 = { ...node, id: "node-5", orderIndex: 4, title: seedNodes[4]!.title, competencyFocus: seedNodes[4]!.competencyFocus, blueprint: seedNodes[4]!.blueprint, lessonPayload: seedNodes[4]!.lessonPayload };
    const script05 = PathwayLectureEngine.buildLectureScript(base05);
    const formulaSegs05 = script05.segments.filter((s) => s.beat === "FORMULA");
    expect(formulaSegs05.length).toBe(5);
    expect(
      new Set(
        formulaSegs05
          .filter((s) => s.activeFormulaCaseIndex !== undefined)
          .map((s) => s.activeFormulaCaseIndex),
      ).size,
    ).toBe(2);
    expect(formulaSegs05.filter((s) => s.language === "en").length).toBe(2);
    expect(formulaSegs05.filter((s) => s.language === "es").length).toBe(3);
    expect(formulaSegs05.some((s) => s.text.includes("dos usos"))).toBe(true);
    expect(formulaSegs05.some((s) => s.text.includes("Are you ready today?"))).toBe(true);
    // Cero contaminación bilingüe: ningún segmento en español puede contener la frase nativa
    formulaSegs05
      .filter((s) => s.language === "es")
      .forEach((s) => {
        expect(s.text.toLowerCase()).not.toContain("are you ready today");
        expect(s.text.toLowerCase()).not.toContain("isn't busy");
      });

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

  it("answers student questions in 3 distinct pedagogical layers from live AI without canned fallbacks", async () => {
    const aiSpy = vi.spyOn(directClientAiService, "chatCompletion").mockResolvedValueOnce(
      JSON.stringify({
        isOffTopic: false,
        directAnswer: "En inglés todo verbo conjugado exige sujeto explícito; para clima o tiempo usamos 'It'.",
        mentalModel: "Piensa que en español el sujeto viaja escondido en el verbo, mientras en inglés el primer cajón siempre debe llevar nombre.",
        exampleEnglish: "It is raining heavily today.",
        exampleSpanish: "Está lloviendo fuerte hoy.",
        pronunciationTip: "Enlaza 'It is' suavemente en un solo golpe de voz.",
      }),
    );

    const answer = await PathwayQAService.askProfessor({
      question: "¿Por qué no puedo decir 'Is raining' como en español decimos 'Está lloviendo'?",
      node,
      profession: "Cardiologist",
      cefrLevel: "A1",
    });

    expect(aiSpy).toHaveBeenCalledTimes(1);
    expect(answer.directAnswer).toContain("sujeto explícito");
    expect(answer.mentalModel.length).toBeGreaterThan(10);
    expect(answer.exampleEnglish).toBe("It is raining heavily today.");
    expect(answer.speechSegments.length).toBeGreaterThanOrEqual(2);

    const hasEnglishSegment = answer.speechSegments.some((s) => s.language === "en");
    const hasSpanishSegment = answer.speechSegments.some((s) => s.language === "es");
    expect(hasEnglishSegment).toBe(true);
    expect(hasSpanishSegment).toBe(true);
    expect(answer.isOffTopic).toBe(false);
  });

  it("throws BYOK_REQUIRED instead of returning hardcoded answers when no AI key or cluster is active", async () => {
    await expect(
      PathwayQAService.askProfessor({
        question: "¿Cuál es la diferencia entre 'make' y 'do'?",
        node,
        cefrLevel: "A1",
      }),
    ).rejects.toMatchObject({ code: "BYOK_REQUIRED" });
  });

  it("propagates live AI provider errors instead of masking them with hardcoded answers", async () => {
    vi.spyOn(directClientAiService, "chatCompletion").mockRejectedValueOnce(
      new AiInfrastructureError("AUTH_DECLINED_KEY", "Invalid API key (401)", 401, "groq"),
    );

    await expect(
      PathwayQAService.askProfessor({
        question: "¿Cómo uso el auxiliar 'do' en preguntas?",
        node,
        cefrLevel: "A1",
      }),
    ).rejects.toMatchObject({ code: "AUTH_DECLINED_KEY" });
  });

  it("politely declines off-topic questions and guides student back to English (procedural fallback)", async () => {
    const answer = await PathwayQAService.askProfessor({
      question: "¿Cómo hacer una receta de pizza casera?",
      node,
    });

    expect(answer.isOffTopic).toBe(true);
    expect(answer.directAnswer).toContain("idioma inglés");
    expect(answer.mentalModel).toContain(node.title);
    expect(answer.exampleEnglish).toBe("");
  });

  it("handles AI-provided off-topic boundary response correctly", async () => {
    const aiSpy = vi.spyOn(directClientAiService, "chatCompletion").mockResolvedValueOnce(
      JSON.stringify({
        isOffTopic: true,
        directAnswer: "Como mentor de CELAEST, mi rol es exclusivamente ayudarte a dominar el idioma inglés.",
        mentalModel: "Por favor formula tu duda sobre esta regla o sobre cualquier tema del inglés.",
        exampleEnglish: "",
        exampleSpanish: "",
        pronunciationTip: "",
      }),
    );

    const answer = await PathwayQAService.askProfessor({
      question: "¿Quién ganó la carrera de Fórmula 1 ayer?",
      node,
    });

    expect(aiSpy).toHaveBeenCalledTimes(1);
    expect(answer.isOffTopic).toBe(true);
    expect(answer.directAnswer).toContain("idioma inglés");
    expect(answer.exampleEnglish).toBe("");
  });

  it("throws clear error on empty question", async () => {
    await expect(
      PathwayQAService.askProfessor({
        question: "   ",
        node,
      }),
    ).rejects.toThrow("Question cannot be empty");
  });

  it("isolates CEFR speech profile resolution and enforces single-voice audio stop mutex", () => {
    expect(resolveSpeechProfile(0, undefined, "A1")?.baseId).toBe("base_01");
    expect(resolveSpeechProfile(0, undefined, "A2")?.baseId).toBe("base_a2_01");

    const stopHook = vi.fn();
    const unsub = SpeechSynthesisService.registerExternalStop(stopHook);
    PhoneticAudioService.stop();
    expect(stopHook).toHaveBeenCalledTimes(1);
    unsub();
  });
});
