import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConversationMicControl } from "../ConversationMicControl";
import { MobileAudioUnlocker } from "../../services/speechSynthesisService";

vi.mock("../../services/speechSynthesisService", () => ({
  MobileAudioUnlocker: {
    unlock: vi.fn(),
  },
}));

describe("ConversationMicControl - Green Submit OK Button", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render the green submit button when neither listening nor text exists", () => {
    render(
      <ConversationMicControl
        isListening={false}
        hasText={false}
        isThinking={false}
        onSubmitText={vi.fn()}
      />,
    );

    const submitBtn = screen.queryByTestId("interview-submit-ok-button");
    expect(submitBtn).toBeNull();
  });

  it("renders the green submit button when microphone is actively listening", () => {
    render(
      <ConversationMicControl
        isListening={true}
        hasText={false}
        isThinking={false}
        onSubmitText={vi.fn()}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
    expect(submitBtn).toHaveAttribute("aria-label", "Submit response for AI evaluation (OK)");
  });

  it("renders the green submit button when user has text in the transcript", () => {
    render(
      <ConversationMicControl
        isListening={false}
        hasText={true}
        isThinking={false}
        onSubmitText={vi.fn()}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  it("triggers onSubmitText and unlocks mobile audio on click", () => {
    const onSubmitText = vi.fn();
    render(
      <ConversationMicControl
        isListening={false}
        hasText={true}
        isThinking={false}
        onSubmitText={onSubmitText}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    fireEvent.click(submitBtn);

    expect(MobileAudioUnlocker.unlock).toHaveBeenCalledTimes(1);
    expect(onSubmitText).toHaveBeenCalledTimes(1);
  });

  it("falls back to onFinishTurn if onSubmitText is not explicitly provided", () => {
    const onFinishTurn = vi.fn();
    render(
      <ConversationMicControl
        isListening={true}
        hasText={false}
        isThinking={false}
        onFinishTurn={onFinishTurn}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    fireEvent.click(submitBtn);

    expect(MobileAudioUnlocker.unlock).toHaveBeenCalledTimes(1);
    expect(onFinishTurn).toHaveBeenCalledTimes(1);
  });

  it("disables the submit button and prevents submission when isThinking is true", () => {
    const onSubmitText = vi.fn();
    render(
      <ConversationMicControl
        isListening={false}
        hasText={true}
        isThinking={true}
        onSubmitText={onSubmitText}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    expect(submitBtn).toBeDisabled();

    fireEvent.click(submitBtn);
    expect(onSubmitText).not.toHaveBeenCalled();
    expect(MobileAudioUnlocker.unlock).not.toHaveBeenCalled();
  });

  it("debounces rapid double taps to protect against mobile double-submit", () => {
    const onSubmitText = vi.fn();
    render(
      <ConversationMicControl
        isListening={false}
        hasText={true}
        isThinking={false}
        onSubmitText={onSubmitText}
      />,
    );

    const submitBtn = screen.getByTestId("interview-submit-ok-button");
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    // Only 1 execution within 800ms debounce
    expect(onSubmitText).toHaveBeenCalledTimes(1);
  });
});
