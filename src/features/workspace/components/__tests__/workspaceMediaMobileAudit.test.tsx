import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { VideoOrb } from "../../../../design-system/components/Orb/VideoOrb";

describe("Workspace & Video Mobile Performance Audit", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders VideoOrb with preload=auto, playsInline, and muted to prevent mobile jump", () => {
    const { container } = render(<VideoOrb isActive={true} />);
    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video?.getAttribute("preload")).toBe("auto");
    expect(video?.hasAttribute("playsinline")).toBe(true);
    expect(video?.muted).toBe(true);
    expect(video?.hasAttribute("poster")).toBe(false);
  });

  it("VideoOrb does not render a poster attribute when poster prop is omitted", () => {
    const { container } = render(<VideoOrb />);
    const video = container.querySelector("video");

    expect(video?.getAttribute("poster")).toBeNull();
  });
});
