import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InterviewAnalysisModal } from "../InterviewAnalysisModal";
import { ComprehensiveTurnFeedback } from "../../services/masterAiFeedbackEngine";

vi.mock("../../services/speechSynthesisService", () => ({
  SpeechSynthesisService: {
    stop: vi.fn(),
    speak: vi.fn(),
  },
}));

describe("InterviewAnalysisModal", () => {
  const mockFeedback: ComprehensiveTurnFeedback = {
    overallScore: 88,
    grammarScore: 85,
    clarityScore: 90,
    vocabularyScore: 89,
    userSpokenText: "I worked on leading the distributed systems migration.",
    reconciledTranscript: "I worked on leading the distributed systems migration.",
    improvedFullAnswer: "I led the migration of our distributed microservices platform.",
    unclearOrErrorWords: [],
    keyStrengths: ["Strong technical vocabulary", "Clear context"],
    tipsForNextTurn: "Focus on articulating measurable business impact.",
    strategicFeedback: {
      type: "STAR_ALIGNMENT",
      title: "Solidez Técnica y Liderazgo",
      explanation: "Gran fluidez técnica.",
      recommendation: "Menciona métricas cuantitativas.",
    },
    recordingDurationSeconds: 14,
    userAudioUrl: "blob:http://localhost:3000/mock-audio-uuid",
  };

  it("calls onContinue when the learner clicks 'Continuar con la siguiente pregunta'", () => {
    const handleClose = vi.fn();
    const handleContinue = vi.fn();

    render(
      <InterviewAnalysisModal
        feedback={mockFeedback}
        savedErrorIds={new Set()}
        onClose={handleClose}
        onContinue={handleContinue}
        onSaveSpecificError={vi.fn(() => Promise.resolve(true))}
        onSaveAllErrors={vi.fn(() => Promise.resolve(0))}
      />,
    );

    const continueBtn = screen.getByRole("button", {
      name: /continuar con la siguiente pregunta/i,
    });
    expect(continueBtn).toBeDefined();

    fireEvent.click(continueBtn);

    expect(handleContinue).toHaveBeenCalledTimes(1);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("falls back to onClose when onContinue is not provided", () => {
    const handleClose = vi.fn();

    render(
      <InterviewAnalysisModal
        feedback={mockFeedback}
        savedErrorIds={new Set()}
        onClose={handleClose}
        onSaveSpecificError={vi.fn(() => Promise.resolve(true))}
        onSaveAllErrors={vi.fn(() => Promise.resolve(0))}
      />,
    );

    const continueBtn = screen.getByRole("button", {
      name: /continuar con la siguiente pregunta/i,
    });
    fireEvent.click(continueBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("handles audio load failure gracefully without collapsing the modal layout", () => {
    const handleClose = vi.fn();

    render(
      <InterviewAnalysisModal
        feedback={mockFeedback}
        savedErrorIds={new Set()}
        onClose={handleClose}
        onSaveSpecificError={vi.fn(() => Promise.resolve(true))}
        onSaveAllErrors={vi.fn(() => Promise.resolve(0))}
      />,
    );

    const audioElement = document.body.querySelector("audio");
    expect(audioElement).toBeDefined();
    if (audioElement) {
      fireEvent.error(audioElement);
    }

    // Header button transitions to disabled "Audio no disponible" without crashing
    const disabledAudioBtn = screen.getByRole("button", {
      name: /audio no disponible/i,
    });
    expect(disabledAudioBtn).toBeDefined();
    expect(disabledAudioBtn.hasAttribute("disabled")).toBe(true);

    // Transcript text remains fully visible
    expect(
      screen.getByText(/"I worked on leading the distributed systems migration."/i),
    ).toBeDefined();
  });

  it("renders gracefully when turn was text-only without user audio", () => {
    const handleClose = vi.fn();
    const textOnlyFeedback = { ...mockFeedback, userAudioUrl: undefined };

    render(
      <InterviewAnalysisModal
        feedback={textOnlyFeedback}
        savedErrorIds={new Set()}
        onClose={handleClose}
        onSaveSpecificError={vi.fn(() => Promise.resolve(true))}
        onSaveAllErrors={vi.fn(() => Promise.resolve(0))}
      />,
    );

    expect(screen.getByText(/respuesta ingresada por texto/i)).toBeDefined();
  });
});
