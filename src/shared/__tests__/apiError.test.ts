import { describe, it, expect } from "vitest";
import { ApiError } from "../../infrastructure/http/ApiError";
import { handleApiError } from "../../infrastructure/http/errorHandler";

describe("ApiError", () => {
  it("exposes status, code and details", () => {
    const error = new ApiError("Not found", 404, "NOT_FOUND", { resource: "article" });

    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.details).toEqual({ resource: "article" });
    expect(error.name).toBe("ApiError");
  });

  it("is an instance of Error", () => {
    expect(new ApiError("boom", 500)).toBeInstanceOf(Error);
  });
});

describe("handleApiError", () => {
  it("maps NETWORK_ERROR to a friendly message", () => {
    expect(handleApiError(new ApiError("x", 500, "NETWORK_ERROR"))).toContain(
      "Network connection issue",
    );
  });

  it("maps UNAUTHORIZED to a session message", () => {
    expect(handleApiError(new ApiError("x", 401, "UNAUTHORIZED"))).toContain("session has expired");
  });

  it("maps RATE_LIMITED to a throttling message", () => {
    expect(handleApiError(new ApiError("x", 429, "RATE_LIMITED"))).toContain("Too many requests");
  });

  it("maps REQUEST_TIMEOUT to a timeout message", () => {
    expect(handleApiError(new ApiError("x", 408, "REQUEST_TIMEOUT"))).toContain("timed out");
  });

  it("falls back to the ApiError message for unknown codes", () => {
    expect(handleApiError(new ApiError("Custom backend message", 400, "WEIRD_CODE"))).toBe(
      "Custom backend message",
    );
  });

  it("uses the message of generic Errors", () => {
    expect(handleApiError(new Error("plain failure"))).toBe("plain failure");
  });

  it("handles non-Error values", () => {
    expect(handleApiError(undefined)).toBe("An unknown error occurred.");
    expect(handleApiError(42)).toBe("An unknown error occurred.");
  });
});
