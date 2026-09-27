import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { VideoOrb } from "../../../../design-system/components/Orb/VideoOrb";
import { OptimizedVideo } from "../../../../design-system/components/Media/OptimizedVideo";

describe("Workspace & Video Mobile Performance Audit", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders VideoOrb with preload=metadata, playsInline, and muted to prevent mobile jump and battery drain", () => {
    const { container } = render(<VideoOrb isActive={true} />);
    const video = container.querySelector("video");

    expect(video).not.toBeNull();
    expect(video?.getAttribute("preload")).toBe("metadata");
    expect(video?.hasAttribute("playsinline")).toBe(true);
    expect(video?.muted).toBe(true);
    expect(video?.hasAttribute("poster")).toBe(false);
  });

  it("VideoOrb does not render a poster attribute when poster prop is omitted", () => {
    const { container } = render(<VideoOrb />);
    const video = container.querySelector("video");

    expect(video?.getAttribute("poster")).toBeNull();
  });

  it("renders OptimizedVideo with dual WebM and MP4 sources, preload=metadata, and power-saving flags", () => {
    const { container } = render(
      <OptimizedVideo src="/assets/begin1" poster="/assets/workspace_room_bg.webp" isActive={true} />,
    );
    const video = container.querySelector("video");
    const sources = container.querySelectorAll("source");

    expect(video).not.toBeNull();
    expect(video?.getAttribute("preload")).toBe("metadata");
    expect(video?.hasAttribute("playsinline")).toBe(true);
    expect(video?.getAttribute("poster")).toBe("/assets/workspace_room_bg.webp");
    expect(sources.length).toBe(2);
    expect(sources[0].getAttribute("src")).toBe("/assets/begin1.webm");
    expect(sources[0].getAttribute("type")).toBe("video/webm");
    expect(sources[1].getAttribute("src")).toBe("/assets/begin1.mp4");
    expect(sources[1].getAttribute("type")).toBe("video/mp4");
  });
});
