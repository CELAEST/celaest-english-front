import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingBeginnerCheckStep } from "../OnboardingBeginnerCheckStep";
import { LearnerProfileData } from "../../types";

describe("OnboardingBeginnerCheckStep", () => {
  const mockProfile: LearnerProfileData = {
    name: "Alex",
    email: "alex@example.com",
    learningGoal: "Professional Fluency",
    preferenceStyle: "Conversation First",
    dailyFocus: "20 min",
    profession: "Software Engineer",
    speakingConfidence: "Low",
    cefrLevel: "A1 — Beginner",
    conversationStyle: "Direct & Structured",
    pronunciationScore: "Good",
    topics: ["Technology"],
  };

  it("renders both tracks: zero-level escape hatch and diagnostic evaluation", () => {
    const onSelectBeginner = vi.fn();
    const onSelectExperienced = vi.fn();
    const onPrev = vi.fn();

    render(
      <OnboardingBeginnerCheckStep
        profile={mockProfile}
        onSelectBeginner={onSelectBeginner}
        onSelectExperienced={onSelectExperienced}
        onPrev={onPrev}
      />
    );

    expect(screen.getByText("¿Cuál es tu nivel de inglés?")).toBeInTheDocument();
    expect(screen.getByText("Empiezo desde cero")).toBeInTheDocument();
    expect(screen.getByText("Tengo conocimientos previos")).toBeInTheDocument();
    expect(screen.getByText("Sin test")).toBeInTheDocument();
    expect(screen.getByText("Test de nivel")).toBeInTheDocument();
  });

  it("defaults to beginner track and calls onSelectBeginner with profile profession", () => {
    const onSelectBeginner = vi.fn();
    const onSelectExperienced = vi.fn();
    const onPrev = vi.fn();

    render(
      <OnboardingBeginnerCheckStep
        profile={mockProfile}
        onSelectBeginner={onSelectBeginner}
        onSelectExperienced={onSelectExperienced}
        onPrev={onPrev}
      />
    );

    const continueBtn = screen.getByRole("button", { name: /Empezar en Nivel A1/i });
    fireEvent.click(continueBtn);

    expect(onSelectBeginner).toHaveBeenCalledWith("Software Engineer");
    expect(onSelectExperienced).not.toHaveBeenCalled();
  });

  it("allows selecting diagnostic track and calls onSelectExperienced", () => {
    const onSelectBeginner = vi.fn();
    const onSelectExperienced = vi.fn();
    const onPrev = vi.fn();

    render(
      <OnboardingBeginnerCheckStep
        profile={mockProfile}
        onSelectBeginner={onSelectBeginner}
        onSelectExperienced={onSelectExperienced}
        onPrev={onPrev}
      />
    );

    const diagnosticBtn = screen.getByText("Tengo conocimientos previos");
    fireEvent.click(diagnosticBtn);

    const continueBtn = screen.getByRole("button", { name: /Hacer Test de Nivel/i });
    fireEvent.click(continueBtn);

    expect(onSelectExperienced).toHaveBeenCalled();
    expect(onSelectBeginner).not.toHaveBeenCalled();
  });

  it("calls onPrev when clicking the back button", () => {
    const onSelectBeginner = vi.fn();
    const onSelectExperienced = vi.fn();
    const onPrev = vi.fn();

    render(
      <OnboardingBeginnerCheckStep
        profile={mockProfile}
        onSelectBeginner={onSelectBeginner}
        onSelectExperienced={onSelectExperienced}
        onPrev={onPrev}
      />
    );

    const backBtn = screen.getByRole("button", { name: /Volver/i });
    fireEvent.click(backBtn);

    expect(onPrev).toHaveBeenCalled();
  });
});
