import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WritingTaskHeader } from "../WritingTaskHeader";

describe("WritingTaskHeader - Bilingual Pedagogical Scaffolding Rules", () => {
  it("renders Spanish translation for A1 learners when spanishDescription is provided", () => {
    render(
      <WritingTaskHeader
        title="Introduce Yourself"
        description="Write 2 short sentences: your name and your job."
        spanishDescription="Escribe dos oraciones sencillas presentándote con tu nombre y tu trabajo."
        currentLevel="A1"
      />,
    );

    expect(screen.getByText("Write 2 short sentences: your name and your job.")).toBeInTheDocument();
    expect(
      screen.getByText("Escribe dos oraciones sencillas presentándote con tu nombre y tu trabajo."),
    ).toBeInTheDocument();
  });

  it("renders Spanish translation for A2 learners when spanishDescription is provided", () => {
    render(
      <WritingTaskHeader
        title="Schedule a Team Check-in"
        description="Write a short email proposing a meeting time."
        spanishDescription="Escribe un correo breve proponiendo una hora para reunirse."
        currentLevel="A2"
      />,
    );

    expect(screen.getByText("Write a short email proposing a meeting time.")).toBeInTheDocument();
    expect(
      screen.getByText("Escribe un correo breve proponiendo una hora para reunirse."),
    ).toBeInTheDocument();
  });

  it("NEVER renders Spanish translation for B2 learners even if spanishDescription is provided", () => {
    render(
      <WritingTaskHeader
        title="Mediation Availability"
        description="Inform the appointed expert witness of the upcoming mediation date and ask for their availability."
        spanishDescription="Informe al testigo pericial designado sobre la fecha de la próxima mediación y solicite su disponibilidad."
        currentLevel="B2"
      />,
    );

    expect(
      screen.getByText(
        "Inform the appointed expert witness of the upcoming mediation date and ask for their availability.",
      ),
    ).toBeInTheDocument();
    // Strict pedagogical shield: zero Spanish in B2
    expect(
      screen.queryByText(
        "Informe al testigo pericial designado sobre la fecha de la próxima mediación y solicite su disponibilidad.",
      ),
    ).toBeNull();
  });

  it("NEVER renders Spanish translation for B1 learners even if spanishDescription is provided", () => {
    render(
      <WritingTaskHeader
        title="Project Status Update"
        description="Write a brief project update to your manager."
        spanishDescription="Escribe una actualización breve del proyecto para tu gerente."
        currentLevel="B1"
      />,
    );

    expect(screen.getByText("Write a brief project update to your manager.")).toBeInTheDocument();
    expect(
      screen.queryByText("Escribe una actualización breve del proyecto para tu gerente."),
    ).toBeNull();
  });

  it("NEVER renders Spanish translation for C1 or C2 learners", () => {
    render(
      <WritingTaskHeader
        title="Executive Strategy Brief"
        description="Synthesize key organizational trade-offs for the quarterly stakeholder committee."
        spanishDescription="Sintetiza las compensaciones clave para el comité trimestral."
        currentLevel="C1"
      />,
    );

    expect(
      screen.getByText(
        "Synthesize key organizational trade-offs for the quarterly stakeholder committee.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Sintetiza las compensaciones clave para el comité trimestral.")).toBeNull();
  });
});
