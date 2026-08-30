import { describe, it, expect } from "vitest";
import { QUERY_KEYS } from "../constants/queryKeys";

describe("QUERY_KEYS", () => {
  it("builds hierarchical keys that share a root for easy invalidation", () => {
    expect(QUERY_KEYS.reading.articles("B1")).toEqual(["reading", "articles", "B1"]);
    expect(QUERY_KEYS.reading.all).toEqual(["reading"]);
    // Root prefix enables invalidateQueries({ queryKey: QUERY_KEYS.reading.all })
    expect(QUERY_KEYS.reading.articles("B1")[0]).toBe(QUERY_KEYS.reading.all[0]);
  });

  it('normalizes empty categories to "all"', () => {
    expect(QUERY_KEYS.memory.cards()).toEqual(["memory", "cards", "all"]);
    expect(QUERY_KEYS.memory.cards("GRAMMAR")).toEqual(["memory", "cards", "GRAMMAR"]);
  });

  it("produces distinct keys per level for reading articles", () => {
    expect(QUERY_KEYS.reading.articles("B1")).not.toEqual(QUERY_KEYS.reading.articles("C1"));
  });
});
