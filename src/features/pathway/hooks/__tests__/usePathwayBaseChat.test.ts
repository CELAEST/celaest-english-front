import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePathwayBaseChat } from "../usePathwayBaseChat";
import { PathwayNode } from "../../../../domain/entities/LearningPathway";
import { PathwayQAService } from "../../services/PathwayQAService";

const mockNode: PathwayNode = {
  id: "node_base_01_test",
  orderIndex: 0,
  title: "El Orden Mágico: Quién + Acción",
  competencyFocus: "SUJETO OBLIGATORIO + VERBO",
  status: "ACTIVE",
  difficulty: "FUNDAMENTAL",
  estimatedMinutes: 5,
  blueprint: {
    nativeIntuitionRule: "En inglés el verbo nunca va solo.",
    l1InterferenceTrap: "En español omitimos el sujeto.",
    synthesisAnchor: "I work",
    masteryProof: "I learn every day",
    transferChallenge: "We speak English",
  },
  lessonPayload: {
    nodeId: "node_base_01_test",
    ruleTaglineSpanish: "En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.",
    formulaEquation: "1. QUIÉN + 2. ACCIÓN + 3. CUÁNDO",
    commonMistake: {
      wrong: "Work every day.",
      wrongToken: "Work",
      correct: "I work every day.",
      correctToken: "I work",
      whySpanish: "En español el verbo ya indica quién lo hace.",
    },
    examples: [
      {
        english: "I learn English today.",
        spanish: "Aprendo inglés hoy.",
        pronunciationHint: "Une 'learn English' con sonido fluido.",
      },
    ],
    blockChallenge: {
      promptSpanish: "Yo trabajo todos los días",
      targetSentence: "I work every day",
      initialTokens: ["I", "work", "every day"],
      distractorTokens: ["works"],
    },
    voicePractice: {
      sentenceEnglish: "I learn English today",
      pronunciationHint: "Pronuncia claro cada bloque.",
      spanishMeaning: "Aprendo inglés hoy",
    },
  },
} as unknown as PathwayNode;

describe("usePathwayBaseChat", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("initializes empty when no previous chat exists in localStorage", () => {
    const { result } = renderHook(() => usePathwayBaseChat(mockNode));
    expect(result.current.messages).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("loads existing messages from localStorage for that specific base", () => {
    const stored = [
      { id: "u_1", sender: "user", timestamp: 100, text: "¿Por qué decimos I work?" },
    ];
    localStorage.setItem("celaest_pathway_chat_node_base_01_test", JSON.stringify(stored));

    const { result } = renderHook(() => usePathwayBaseChat(mockNode));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]?.text).toBe("¿Por qué decimos I work?");
  });

  it("submits question, gets structured answer, and persists silently to localStorage without audio", async () => {
    const askSpy = vi.spyOn(PathwayQAService, "askProfessor").mockResolvedValueOnce({
      question: "¿Puedo decir solo work?",
      directAnswer: "No, en inglés el sujeto siempre debe estar presente.",
      mentalModel: "El verbo no tiene terminación única para cada persona.",
      exampleEnglish: "I work every day.",
      exampleSpanish: "Trabajo todos los días.",
      pronunciationTip: "Marca bien la 'k' al final de work.",
      fullSpeechText: "No, en inglés el sujeto siempre debe estar presente.",
      speechSegments: [],
    });

    const { result } = renderHook(() => usePathwayBaseChat(mockNode));

    await act(async () => {
      await result.current.askQuestion("¿Puedo decir solo work?");
    });

    expect(askSpy).toHaveBeenCalledTimes(1);
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]?.sender).toBe("user");
    expect(result.current.messages[1]?.sender).toBe("liam");
    expect(result.current.messages[1]?.answer?.directAnswer).toBe(
      "No, en inglés el sujeto siempre debe estar presente.",
    );

    // Verify localStorage persistence
    const saved = JSON.parse(
      localStorage.getItem("celaest_pathway_chat_node_base_01_test") || "[]",
    );
    expect(saved).toHaveLength(2);
  });

  it("clears chat history and removes from localStorage", async () => {
    const stored = [
      { id: "u_1", sender: "user", timestamp: 100, text: "Duda guardada" },
    ];
    localStorage.setItem("celaest_pathway_chat_node_base_01_test", JSON.stringify(stored));

    const { result } = renderHook(() => usePathwayBaseChat(mockNode));
    expect(result.current.messages).toHaveLength(1);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(localStorage.getItem("celaest_pathway_chat_node_base_01_test")).toBeNull();
  });

  it("removes orphan unanswered question on modal dismiss and preserves single message on retry", async () => {
    let capturedRetry: (() => void) | undefined;
    let capturedDismiss: (() => void) | undefined;

    const askSpy = vi
      .spyOn(PathwayQAService, "askProfessor")
      .mockRejectedValueOnce(new Error("AI_TRIAL_ACCESS_REQUIRED"))
      .mockResolvedValueOnce({
        question: "¿Cómo hablo con mi mamá?",
        directAnswer: "Usa el pasado o would dependiendo del contexto.",
        mentalModel: "Orden Quién + Acción",
        exampleEnglish: "I talked to my mom.",
        exampleSpanish: "Hablé con mi mamá.",
        pronunciationTip: "Marca talked /tókt/",
        fullSpeechText: "Usa el pasado.",
        speechSegments: [],
      });

    const onAiError = vi.fn((_err, retry, _preview, onDismiss) => {
      capturedRetry = retry;
      capturedDismiss = onDismiss;
    });

    const { result } = renderHook(() =>
      usePathwayBaseChat(mockNode, { cefrLevel: "A1", onAiError }),
    );

    await act(async () => {
      await result.current.askQuestion("¿Cómo hablo con mi mamá?");
    });

    expect(onAiError).toHaveBeenCalledTimes(1);
    expect(result.current.messages).toHaveLength(1);

    // Retry succeeds without duplicating user message
    await act(async () => {
      capturedRetry?.();
    });
    expect(askSpy).toHaveBeenCalledTimes(2);
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1]?.sender).toBe("liam");

    // Second failure followed by modal dismiss removes orphan question cleanly
    askSpy.mockRejectedValueOnce(new Error("NETWORK_ERROR"));
    await act(async () => {
      await result.current.askQuestion("Pregunta fallida");
    });
    expect(result.current.messages).toHaveLength(3);

    act(() => {
      capturedDismiss?.();
    });
    expect(result.current.messages).toHaveLength(2);
  });
});
