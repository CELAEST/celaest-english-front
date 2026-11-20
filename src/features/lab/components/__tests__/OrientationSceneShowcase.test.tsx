import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrientationSceneShowcase } from "../OrientationSceneShowcase";

describe("OrientationSceneShowcase (Design Lab)", () => {
  it("renders clean Zero-Box Orientation showcase and toggles stages and viewport width", () => {
    render(<OrientationSceneShowcase />);

    expect(screen.getByText(/Bienvenida & Dinámica de Clase/i)).toBeInTheDocument();
    expect(screen.getByTestId("live-board-orientation-scene")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /03 · Guía Dinámica/i }));
    expect(screen.getByText(/14 bloques estructurales y Alfabeto Fonético/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Mobile \(390px\)/i }));
    fireEvent.click(screen.getByRole("button", { name: /Ir a la regla/i }));
    expect(screen.getByText(/Transición silenciosa a 1 Fórmula/i)).toBeInTheDocument();
  });
});
