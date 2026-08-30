import { describe, it, expect } from "vitest";
import { SanitizerService } from "../SanitizerService";

describe("SanitizerService", () => {
  it("removes script tags from rich content", () => {
    const dirty = '<p>Hello</p><script>alert("xss")</script>';
    const clean = SanitizerService.sanitize(dirty);

    expect(clean).toContain("<p>Hello</p>");
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("alert");
  });

  it("removes event handler attributes", () => {
    const dirty = '<p onclick="steal()">Click me</p>';
    const clean = SanitizerService.sanitize(dirty);

    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Click me");
  });

  it("neutralizes javascript: URIs", () => {
    const dirty = '<a href="javascript:alert(1)">link</a>';
    const clean = SanitizerService.sanitize(dirty);

    expect(clean).not.toContain("javascript:");
  });

  it("strips all tags in plain-text mode", () => {
    const dirty = '<div><b>Bold</b> and <img src="x">text</div>';
    const clean = SanitizerService.sanitizeToPlainText(dirty);

    expect(clean).toBe("Bold and text");
  });

  it("handles empty input gracefully", () => {
    expect(SanitizerService.sanitize("")).toBe("");
    expect(SanitizerService.sanitizeToPlainText("")).toBe("");
  });
});
