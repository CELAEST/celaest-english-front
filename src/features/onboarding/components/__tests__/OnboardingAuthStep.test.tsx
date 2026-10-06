import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingAuthStep } from "../OnboardingAuthStep";

describe("OnboardingAuthStep", () => {
  it("renders the borderless login step by default", () => {
    const onSuccess = vi.fn();

    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    expect(screen.getByText("Sign In to Your Mentor")).toBeInTheDocument();
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("switches to create account mode seamlessly", () => {
    const onSuccess = vi.fn();

    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    const switchBtn = screen.getByRole("button", { name: /Sign up/i });
    fireEvent.click(switchBtn);

    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  it("exposes full WCAG accessibility attributes (labels, roles, aria-pressed)", () => {
    const onSuccess = vi.fn();
    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Show password")).toHaveAttribute("aria-pressed", "false");

    const togglePasswordBtn = screen.getByLabelText("Show password");
    fireEvent.click(togglePasswordBtn);
    expect(screen.getByLabelText("Hide password")).toHaveAttribute("aria-pressed", "true");
  });

  it("validates minimum password length on registration without submitting", async () => {
    const onSuccess = vi.fn();
    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "john@celaest.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Password must be at least 6 characters long.");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("validates password confirmation mismatch on registration", async () => {
    const onSuccess = vi.fn();
    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "john@celaest.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "different123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Passwords do not match.");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("renders back button when onBackToWelcome is provided and calls it on click", () => {
    const onSuccess = vi.fn();
    const onBackToWelcome = vi.fn();
    render(<OnboardingAuthStep onSuccess={onSuccess} onBackToWelcome={onBackToWelcome} />);

    const backBtn = screen.getByRole("button", { name: /Return to welcome screen/i });
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(onBackToWelcome).toHaveBeenCalledTimes(1);
  });

  it("clears error message when user starts typing", async () => {
    const onSuccess = vi.fn();
    render(<OnboardingAuthStep onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));
    fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "john@celaest.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /Create Account/i }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();

    // Type new password -> error should immediately clear
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
