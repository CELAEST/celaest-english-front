import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("renders its label and forwards clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save progress</Button>);
    const button = screen.getByRole("button", { name: "Save progress" });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables interaction while loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button isLoading onClick={handleClick}>
        Uploading
      </Button>,
    );
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies the danger variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("text-status-danger");
  });
});
