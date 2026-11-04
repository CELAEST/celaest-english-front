import { FoundationUnitSpec } from "../a1Foundations";
import { buildModule1Conditionals } from "./module1Conditionals";
import { buildModule2TemporalDepth } from "./module2TemporalDepth";
import { buildModule3PassiveVoice } from "./module3PassiveVoice";
import { buildModule4ModalsPatterns } from "./module4ModalsPatterns";
import { buildModule5ReportedRelative } from "./module5ReportedRelative";
import { buildModule6AdvancedBridge } from "./module6AdvancedBridge";

export function buildB1Foundations(
  roleExampleNoun: string,
  roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    ...buildModule1Conditionals(roleExampleNoun, roleExampleEsp),
    ...buildModule2TemporalDepth(roleExampleNoun, roleExampleEsp),
    ...buildModule3PassiveVoice(roleExampleNoun, roleExampleEsp),
    ...buildModule4ModalsPatterns(roleExampleNoun, roleExampleEsp),
    ...buildModule5ReportedRelative(roleExampleNoun, roleExampleEsp),
    ...buildModule6AdvancedBridge(roleExampleNoun, roleExampleEsp),
  ];
}

