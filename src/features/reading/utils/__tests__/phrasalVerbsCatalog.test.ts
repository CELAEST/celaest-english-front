import { describe, it, expect } from "vitest";
import { isVerifiedPhrasalVerb, VERIFIED_PHRASAL_VERBS_SET } from "../phrasalVerbsCatalog";

describe("phrasalVerbsCatalog", () => {
  it("recognizes genuine 2-word phrasal verbs across all conjugations", () => {
    expect(isVerifiedPhrasalVerb("break down")).toBe(true);
    expect(isVerifiedPhrasalVerb("broke down")).toBe(true);
    expect(isVerifiedPhrasalVerb("breaking down")).toBe(true);
    expect(isVerifiedPhrasalVerb("breaks down")).toBe(true);

    expect(isVerifiedPhrasalVerb("broke out")).toBe(true);
    expect(isVerifiedPhrasalVerb("carry out")).toBe(true);
    expect(isVerifiedPhrasalVerb("carried out")).toBe(true);
    expect(isVerifiedPhrasalVerb("figure out")).toBe(true);
    expect(isVerifiedPhrasalVerb("ramp up")).toBe(true);
    expect(isVerifiedPhrasalVerb("drill down")).toBe(true);
    expect(isVerifiedPhrasalVerb("touch base")).toBe(true);
    expect(isVerifiedPhrasalVerb("wrap up")).toBe(true);
    expect(isVerifiedPhrasalVerb("roll out")).toBe(true);
  });

  it("recognizes genuine 3-word phrasal verbs across conjugations", () => {
    expect(isVerifiedPhrasalVerb("look forward to")).toBe(true);
    expect(isVerifiedPhrasalVerb("looking forward to")).toBe(true);
    expect(isVerifiedPhrasalVerb("looked forward to")).toBe(true);
    expect(isVerifiedPhrasalVerb("come up with")).toBe(true);
    expect(isVerifiedPhrasalVerb("run out of")).toBe(true);
    expect(isVerifiedPhrasalVerb("get along with")).toBe(true);
    expect(isVerifiedPhrasalVerb("cut back on")).toBe(true);
    expect(isVerifiedPhrasalVerb("press down on")).toBe(true);
    expect(isVerifiedPhrasalVerb("pressing down on")).toBe(true);
    expect(isVerifiedPhrasalVerb("pressed down on")).toBe(true);
    expect(isVerifiedPhrasalVerb("weigh down on")).toBe(true);
    expect(isVerifiedPhrasalVerb("flesh out")).toBe(true);
    expect(isVerifiedPhrasalVerb("hammer out")).toBe(true);
  });

  it("recognizes high-frequency professional idioms and multi-word collocations", () => {
    expect(isVerifiedPhrasalVerb("on the same page")).toBe(true);
    expect(isVerifiedPhrasalVerb("hit the ground running")).toBe(true);
    expect(isVerifiedPhrasalVerb("in the long run")).toBe(true);
    expect(isVerifiedPhrasalVerb("at the end of the day")).toBe(true);
    expect(isVerifiedPhrasalVerb("think outside the box")).toBe(true);
    expect(isVerifiedPhrasalVerb("state of the art")).toBe(true);
    expect(isVerifiedPhrasalVerb("best practices")).toBe(true);
    expect(isVerifiedPhrasalVerb("trade off")).toBe(true);
  });

  it("strictly rejects non-phrasal collocations and literal adverb phrases (0 false positives)", () => {
    expect(isVerifiedPhrasalVerb("works together")).toBe(false);
    expect(isVerifiedPhrasalVerb("working together")).toBe(false);
    expect(isVerifiedPhrasalVerb("is clear")).toBe(false);
    expect(isVerifiedPhrasalVerb("updates the")).toBe(false);
    expect(isVerifiedPhrasalVerb("two days")).toBe(false);
    expect(isVerifiedPhrasalVerb("the team")).toBe(false);
    expect(isVerifiedPhrasalVerb("very quickly")).toBe(false);
  });

  it("contains more than 500 verified phrasal verb forms", () => {
    expect(VERIFIED_PHRASAL_VERBS_SET.size).toBeGreaterThan(500);
  });
});
