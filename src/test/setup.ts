import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { webcrypto } from "node:crypto";

// jsdom does not implement WebCrypto; Node's implementation is spec-compliant.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    writable: true,
  });
}
if (typeof window !== "undefined" && !window.crypto?.subtle) {
  Object.defineProperty(window, "crypto", {
    value: webcrypto,
    writable: true,
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
