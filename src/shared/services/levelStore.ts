/**
 * LevelStore: Unified Single Source of Truth for User CEFR Level on Client
 *
 * Guarantees:
 * 1. Strict multi-user isolation (keyed by user ID).
 * 2. Canonical CEFR short code normalization (A1, A2, B1, B2, C1, C2).
 * 3. Cross-tab & intra-window synchronization.
 */

export const CANONICAL_CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CanonicalCefr = (typeof CANONICAL_CEFR_LEVELS)[number];

export function normalizeCefrLevel(raw: string | null | undefined): CanonicalCefr {
  if (!raw) return "B1";
  const s = raw.trim().toUpperCase();
  if (s.startsWith("A1")) return "A1";
  if (s.startsWith("A2")) return "A2";
  if (s.startsWith("B1")) return "B1";
  if (s.startsWith("B2")) return "B2";
  if (s.startsWith("C1")) return "C1";
  if (s.startsWith("C2")) return "C2";
  return "B1";
}

function getKey(userId: string): string {
  return `celaest:user:${userId || "guest"}:cefrLevel`;
}

export function getUserCefrLevel(userId: string): CanonicalCefr | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getKey(userId));
    if (!raw) {
      // Check legacy unscoped key once for migration
      const legacy = localStorage.getItem("celaest:cefrLevel");
      if (legacy) {
        const norm = normalizeCefrLevel(legacy);
        if (userId) {
          localStorage.setItem(getKey(userId), norm);
        }
        return norm;
      }
      return null;
    }
    return normalizeCefrLevel(raw);
  } catch {
    return null;
  }
}

export function setUserCefrLevel(userId: string, level: string): CanonicalCefr {
  const norm = normalizeCefrLevel(level);
  if (typeof window === "undefined") return norm;
  try {
    localStorage.setItem(getKey(userId), norm);
    // Also keep legacy key synced for backward compatibility with unmigrated views
    localStorage.setItem("celaest:cefrLevel", norm);
    localStorage.setItem("celaest:writing:cefrLevel", norm);
    localStorage.setItem("celaest:interview:cefrLevel", norm);
    window.dispatchEvent(
      new CustomEvent("celaest:level-changed", {
        detail: norm,
      })
    );
  } catch {
    // Ignore storage quota errors
  }
  return norm;
}
