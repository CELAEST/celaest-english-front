import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1InversionEmphasis } from "./module1InversionEmphasis";
import { buildModule2MixedConditionals } from "./module2MixedConditionals";
import { buildModule3PastDeduction } from "./module3PastDeduction";
import { buildModule4ParticipleClauses } from "./module4ParticipleClauses";
import { buildModule5SubjunctivePassive } from "./module5SubjunctivePassive";
import { buildModule6DiscourseHedging } from "./module6DiscourseHedging";

export function buildB2Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1InversionEmphasis(roleExampleNoun, roleExampleEsp),
    ...buildModule2MixedConditionals(roleExampleNoun, roleExampleEsp),
    ...buildModule3PastDeduction(roleExampleNoun, roleExampleEsp),
    ...buildModule4ParticipleClauses(roleExampleNoun, roleExampleEsp),
    ...buildModule5SubjunctivePassive(roleExampleNoun, roleExampleEsp),
    ...buildModule6DiscourseHedging(roleExampleNoun, roleExampleEsp),
  ];
}

