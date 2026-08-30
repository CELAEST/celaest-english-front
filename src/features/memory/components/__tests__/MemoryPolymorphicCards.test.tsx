import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryFlashcard } from "../MemoryFlashcard";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

describe("MemoryFlashcard Polymorphic Deck (Speaking, Writing, Reading)", () => {
  const baseCard: MemoryCard = {
    id: "test-card-1",
    category: "SPEAKING",
    userSaid: "I am agree with you",
    betterWay: "I agree with you",
    translationSpanish: "Estoy de acuerdo contigo",
    errorWord: "am agree",
    correctWord: "agree",
    grammarExplanation: "In English, 'agree' is a verb and does not use the auxiliary 'am'.",
    cefrLevel: "B1",
    bookmarked: false,
    intervalDays: 1,
    repetitions: 0,
    easeFactor: 2.5,
    nextReviewAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  it("renders Speaking card correctly on front and back faces", () => {
    const onFlip = vi.fn();
    const onBookmark = vi.fn();
    const onDelete = vi.fn();

    const { rerender } = render(
      <MemoryFlashcard
        card={{ ...baseCard, category: "SPEAKING" }}
        cardIndex={1}
        totalCards={3}
        isFlipped={false}
        onFlip={onFlip}
        onBookmark={onBookmark}
        onDelete={onDelete}
      />,
    );

    // Front Face assertions
    expect(screen.getByText("SPEAKING")).toBeDefined();
    expect(screen.getByText("YOU SAID")).toBeDefined();
    expect(screen.getByText("BETTER WAY")).toBeDefined();

    // Flip to Back Face
    rerender(
      <MemoryFlashcard
        card={{ ...baseCard, category: "SPEAKING" }}
        cardIndex={1}
        totalCards={3}
        isFlipped={true}
        onFlip={onFlip}
        onBookmark={onBookmark}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("DETAILS · SPEAKING")).toBeDefined();
    expect(screen.getByText("CORRECCIÓN ESPECÍFICA")).toBeDefined();
    expect(screen.getByText("TRADUCCIÓN")).toBeDefined();
    expect(screen.getByText("Estoy de acuerdo contigo")).toBeDefined();
    expect(screen.getByText("POR QUÉ / EXPLICACIÓN")).toBeDefined();
  });

  it("renders Writing card with editorial register and style rules", () => {
    const writingCard: MemoryCard = {
      ...baseCard,
      id: "writing-card-1",
      category: "WRITING",
      userSaid: "The results shows that we got big improvement.",
      betterWay: "The results demonstrate that substantial progress was achieved.",
      translationSpanish: "Los resultados demuestran que se logró un progreso sustancial.",
      errorWord: "shows",
      correctWord: "demonstrate",
      grammarExplanation: "Use academic verbs like 'demonstrate' and maintain plural subject-verb agreement.",
    };

    const { rerender } = render(
      <MemoryFlashcard
        card={writingCard}
        cardIndex={2}
        totalCards={3}
        isFlipped={false}
        onFlip={vi.fn()}
      />,
    );

    // Front Face for Writing
    expect(screen.getByText("WRITING")).toBeDefined();
    expect(screen.getByText("YOU WROTE")).toBeDefined();
    expect(screen.getByText("REFINED VERSION")).toBeDefined();

    // Back Face for Writing
    rerender(
      <MemoryFlashcard
        card={writingCard}
        cardIndex={2}
        totalCards={3}
        isFlipped={true}
        onFlip={vi.fn()}
      />,
    );

    expect(screen.getByText("DETAILS · WRITING")).toBeDefined();
    expect(screen.getByText("AJUSTE EDITORIAL Y REGISTRO")).toBeDefined();
    expect(screen.getByText("TRADUCCIÓN Y SENTIDO")).toBeDefined();
    expect(screen.getByText("REGLA DE ESTILO Y REDACCIÓN")).toBeDefined();
  });

  it("renders Reading card with vocabulary term, context, and definition", () => {
    const readingCard: MemoryCard = {
      ...baseCard,
      id: "reading-card-1",
      category: "READING",
      errorWord: "relentless",
      userSaid: "relentless",
      betterWay: "Their relentless focus on product execution led to massive success.",
      translationSpanish: "Implacable, incesante, constante.",
      grammarExplanation: "Adjective: unceasingly intense or persistent.",
    };

    const { rerender } = render(
      <MemoryFlashcard
        card={readingCard}
        cardIndex={3}
        totalCards={3}
        isFlipped={false}
        onFlip={vi.fn()}
      />,
    );

    // Front Face for Reading
    expect(screen.getByText("READING")).toBeDefined();
    expect(screen.getByText("VOCABULARY TERM")).toBeDefined();
    expect(screen.getAllByText("relentless").length).toBeGreaterThan(0);
    expect(screen.getByText("CONTEXT IN READING")).toBeDefined();

    // Back Face for Reading
    rerender(
      <MemoryFlashcard
        card={readingCard}
        cardIndex={3}
        totalCards={3}
        isFlipped={true}
        onFlip={vi.fn()}
      />,
    );

    expect(screen.getByText("DETAILS · READING")).toBeDefined();
    expect(screen.getByText("DEFINICIÓN Y SIGNIFICADO")).toBeDefined();
    expect(screen.getByText("Implacable, incesante, constante.")).toBeDefined();
    expect(screen.getByText("USO Y CATEGORÍA GRAMATICAL")).toBeDefined();
  });

  it("handles delete action trigger", () => {
    const onDelete = vi.fn();

    render(
      <MemoryFlashcard
        card={baseCard}
        cardIndex={1}
        totalCards={1}
        isFlipped={false}
        onFlip={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteButtons = screen.getAllByLabelText("Delete card");
    expect(deleteButtons.length).toBeGreaterThan(0);

    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith(baseCard.id);
  });
});
