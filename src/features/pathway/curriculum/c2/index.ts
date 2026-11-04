import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1BaroqueSyntax } from "./module1BaroqueSyntax";
import { buildModule2DiplomaticIrony } from "./module2DiplomaticIrony";
import { buildModule3CommonLawCollocations } from "./module3CommonLawCollocations";
import { buildModule4ImplicitCohesion } from "./module4ImplicitCohesion";
import { buildModule5SemanticTriads } from "./module5SemanticTriads";
import { buildModule6PresidentialRhetoric } from "./module6PresidentialRhetoric";

export function buildC2Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1BaroqueSyntax(roleExampleNoun, roleExampleEsp),
    ...buildModule2DiplomaticIrony(roleExampleNoun, roleExampleEsp),
    ...buildModule3CommonLawCollocations(roleExampleNoun, roleExampleEsp),
    ...buildModule4ImplicitCohesion(roleExampleNoun, roleExampleEsp),
    ...buildModule5SemanticTriads(roleExampleNoun, roleExampleEsp),
    ...buildModule6PresidentialRhetoric(roleExampleNoun, roleExampleEsp),
  ];
}

