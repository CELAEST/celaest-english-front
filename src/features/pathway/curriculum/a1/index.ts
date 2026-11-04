import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1Identity } from "./module1Identity";
import { buildModule2Routines } from "./module2Routines";
import { buildModule3ObjectsPossession } from "./module3ObjectsPossession";
import { buildModule4SpaceTimeQuantity } from "./module4SpaceTimeQuantity";
import { buildModule5Communication } from "./module5Communication";
import { buildModule6FluencyAndBridge } from "./module6FluencyAndBridge";

export function buildA1Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1Identity(roleExampleNoun, roleExampleEsp),
    ...buildModule2Routines(roleExampleNoun, roleExampleEsp),
    ...buildModule3ObjectsPossession(roleExampleNoun, roleExampleEsp),
    ...buildModule4SpaceTimeQuantity(roleExampleNoun, roleExampleEsp),
    ...buildModule5Communication(roleExampleNoun, roleExampleEsp),
    ...buildModule6FluencyAndBridge(roleExampleNoun, roleExampleEsp),
  ];
}

