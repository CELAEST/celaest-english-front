/**
 * Domain Entities for Foundational English Guide & Personalized Pathway
 * Clean, beginner-friendly rule mastery + interactive word blocks + cross-module bridge
 */

export type PathwayNodeType = "CORE_UNIT" | "REMEDIAL_FOCUS" | "RETENTION_CHECK";

export type PathwayNodeStatus =
  | "LOCKED"
  | "ACTIVE"
  | "REMEDIAL_REQUIRED"
  | "MASTERED"
  | "RETENTION_DUE"
  | "CONSOLIDATED";

export type PathwayStepId = "RULE" | "BUILD" | "SPEAK";

export type BridgeModuleTarget = "reading" | "writing" | "interview" | "memory";

export interface PathwayBlueprint {
  objectiveSpanish: string;
  l1InterferenceTrap: string;
  nativeIntuitionRule: string;
  targetCollocations: string[];
  masterySuccessMetric: string;
}

export interface FormulaSegment {
  label: string;
  token: string;
  tone: "violet" | "emerald" | "sky";
}

export interface FormulaCase {
  label: string;
  segments: FormulaSegment[];
  explanationSpanish: string;
  exampleEnglish?: string;
}

export interface SpokenExampleItem {
  english: string;
  spanish: string;
  pronunciationHint: string;
}

export interface WordBlockChallenge {
  promptSpanish: string;
  targetTokens: string[];
  distractorTokens: string[];
  successTipSpanish: string;
  mistakeHintSpanish: string;
}

export interface PathwayLessonPayload {
  ruleTaglineSpanish: string;
  formulaSegments: FormulaSegment[];
  formulaCases?: FormulaCase[];
  commonMistake: {
    wrong: string;
    wrongToken: string;
    correct: string;
    correctToken: string;
    whySpanish: string;
  };
  examples: SpokenExampleItem[];
  blockChallenge: WordBlockChallenge;
  voicePractice: {
    sentenceEnglish: string;
    spanishMeaning: string;
    pronunciationHint: string;
  };
  bridgeModule: {
    target: BridgeModuleTarget;
    moduleLabel: string;
    reasonSpanish: string;
  };
}

export interface PathwayNode {
  id: string;
  pathwayId: string;
  parentNodeId?: string;
  orderIndex: number;
  nodeType: PathwayNodeType;
  status: PathwayNodeStatus;
  title: string;
  competencyFocus: string;
  sourceWeaknessTag?: string;
  blueprint: PathwayBlueprint;
  lessonPayload?: PathwayLessonPayload;
  masteryScore: number;
  attemptsCount: number;
  retentionStage: number;
  nextRetentionAt?: string;
  masteredAt?: string;
}

export interface LearningPathway {
  id: string;
  userId: string;
  cefrLevel: string;
  professionSnapshot: string;
  learningGoal: string;
  focusSummary: string;
  masteryIndex: number;
  nodes: PathwayNode[];
  updatedAt: string;
}

export interface CompletePathwayNodeResponse {
  updatedNode?: PathwayNode;
  unlockedNextNode?: PathwayNode;
  pathway: LearningPathway;
}

export function resolveFormulaCases(lesson: PathwayLessonPayload): FormulaCase[] {
  if (lesson.formulaCases && lesson.formulaCases.length > 0) {
    return lesson.formulaCases;
  }
  return [
    {
      label: "Estructura",
      segments: lesson.formulaSegments,
      explanationSpanish: lesson.ruleTaglineSpanish,
    },
  ];
}
