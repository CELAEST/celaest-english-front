import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  normalizeCefrLevel,
  getUserCefrLevel,
  setUserCefrLevel,
  CANONICAL_CEFR_LEVELS,
} from "../levelStore";

describe("levelStore Single Source of Truth Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("normalizeCefrLevel", () => {
    it("exposes the 6 canonical CEFR levels", () => {
      expect(CANONICAL_CEFR_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    });
    it("normalizes short codes and full descriptive labels to canonical uppercase tokens", () => {
      expect(normalizeCefrLevel("a1")).toBe("A1");
      expect(normalizeCefrLevel("A1 - Beginner")).toBe("A1");
      expect(normalizeCefrLevel("A2 — Elementary")).toBe("A2");
      expect(normalizeCefrLevel("b1")).toBe("B1");
      expect(normalizeCefrLevel("B1 — Intermediate")).toBe("B1");
      expect(normalizeCefrLevel("B2 — Upper Intermediate")).toBe("B2");
      expect(normalizeCefrLevel("c1")).toBe("C1");
      expect(normalizeCefrLevel("C1 — Advanced")).toBe("C1");
      expect(normalizeCefrLevel("c2")).toBe("C2");
      expect(normalizeCefrLevel("C2 — Mastery")).toBe("C2");
    });

    it("defaults unknown or null/empty inputs to B1 safely", () => {
      expect(normalizeCefrLevel("")).toBe("B1");
      expect(normalizeCefrLevel(null)).toBe("B1");
      expect(normalizeCefrLevel(undefined)).toBe("B1");
      expect(normalizeCefrLevel("XYZ")).toBe("B1");
    });
  });

  describe("User-Scoped Persistence & Multi-Tenant Isolation", () => {
    it("isolates levels between user A and user B", () => {
      setUserCefrLevel("user-1", "A2");
      setUserCefrLevel("user-2", "C1");

      expect(getUserCefrLevel("user-1")).toBe("A2");
      expect(getUserCefrLevel("user-2")).toBe("C1");
      expect(localStorage.getItem("celaest:user:user-1:cefrLevel")).toBe("A2");
      expect(localStorage.getItem("celaest:user:user-2:cefrLevel")).toBe("C1");
    });

    it("dispatches celaest:level-changed with string payload on update", () => {
      const listener = vi.fn();
      window.addEventListener("celaest:level-changed", listener);

      const saved = setUserCefrLevel("user-1", "B2 — Upper Intermediate");
      expect(saved).toBe("B2");

      expect(listener).toHaveBeenCalledTimes(1);
      const customEvent = listener.mock.calls[0][0] as CustomEvent<string>;
      expect(customEvent.detail).toBe("B2");

      window.removeEventListener("celaest:level-changed", listener);
    });

    it("migrates legacy unscoped celaest:cefrLevel key if user key is empty", () => {
      localStorage.setItem("celaest:cefrLevel", "C1 — Advanced");

      const level = getUserCefrLevel("migrated-user");
      expect(level).toBe("C1");
      // Migrated into user-scoped key
      expect(localStorage.getItem("celaest:user:migrated-user:cefrLevel")).toBe("C1");
    });
  });
});
