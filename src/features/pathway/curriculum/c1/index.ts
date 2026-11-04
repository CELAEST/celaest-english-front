import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1FrontingInversion } from "./module1FrontingInversion";
import { buildModule2FormulaicSubjunctive } from "./module2FormulaicSubjunctive";
import { buildModule3NominalizationEllipsis } from "./module3NominalizationEllipsis";
import { buildModule4EpistemicStance } from "./module4EpistemicStance";
import { buildModule5PragmaticIdioms } from "./module5PragmaticIdioms";
import { buildModule6PhilosophicalSynthesis } from "./module6PhilosophicalSynthesis";

export function buildC1Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1FrontingInversion(roleExampleNoun, roleExampleEsp),
    ...buildModule2FormulaicSubjunctive(roleExampleNoun, roleExampleEsp),
    ...buildModule3NominalizationEllipsis(roleExampleNoun, roleExampleEsp),
    ...buildModule4EpistemicStance(roleExampleNoun, roleExampleEsp),
    ...buildModule5PragmaticIdioms(roleExampleNoun, roleExampleEsp),
    ...buildModule6PhilosophicalSynthesis(roleExampleNoun, roleExampleEsp),
  ];
}

