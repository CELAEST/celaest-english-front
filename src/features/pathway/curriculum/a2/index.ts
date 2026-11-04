import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1PastNarrative } from "./module1PastNarrative";
import { buildModule2FutureDecisions } from "./module2FutureDecisions";
import { buildModule3Comparatives } from "./module3Comparatives";
import { buildModule4ModalsPurpose } from "./module4ModalsPurpose";
import { buildModule5IndefinitesQuestions } from "./module5IndefinitesQuestions";
import { buildModule6PresentPerfectBridge } from "./module6PresentPerfectBridge";

export function buildA2Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1PastNarrative(roleExampleNoun, roleExampleEsp),
    ...buildModule2FutureDecisions(roleExampleNoun, roleExampleEsp),
    ...buildModule3Comparatives(roleExampleNoun, roleExampleEsp),
    ...buildModule4ModalsPurpose(roleExampleNoun, roleExampleEsp),
    ...buildModule5IndefinitesQuestions(roleExampleNoun, roleExampleEsp),
    ...buildModule6PresentPerfectBridge(roleExampleNoun, roleExampleEsp),
  ];
}

