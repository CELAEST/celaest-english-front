import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingAuthStep } from "../OnboardingAuthStep";

describe("OnboardingAuthStep", () => {
  it("renders the borderless login step by default", () => {
    const onSuccess = vi.fn();
    const onBack = vi.fn();

    render(<OnboardingAuthStep onSuccess={onSuccess} onBackToWelcome={onBack} />);

    expect(screen.getByText("Sign In to Your Mentor")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("switches to create account mode seamlessly", () => {
    const onSuccess = vi.fn();
    const onBack = vi.fn();

    render(<OnboardingAuthStep onSuccess={onSuccess} onBackToWelcome={onBack} />);

    const switchBtn = screen.getByRole("button", { name: /Sign up/i });
    fireEvent.click(switchBtn);

    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  it("navigates back to welcome overview", () => {
    const onSuccess = vi.fn();
    const onBack = vi.fn();

    render(<OnboardingAuthStep onSuccess={onSuccess} onBackToWelcome={onBack} />);

    const backBtn = screen.getByRole("button", { name: /Back to Overview/i });
    fireEvent.click(backBtn);

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
