import { PathwayStepId } from "../../../../domain/entities/LearningPathway";

export type InnovationModelId =
  | "axis-columns-aligned"
  | "axis-pills-aligned"
  | "axis-compact-gap"
  | "axis-single-row"
  | "axis-notch-bridge"
  | "axis-pill-segmented"
  | "axis-topic-aligned";

export type ViewportDevice = "mobile" | "desktop";

export interface MockPathwayHeaderProps {
  nodeIndex: number;
  totalNodes: number;
  masteredCount: number;
  activeStep: PathwayStepId;
  onSelectStep: (step: PathwayStepId) => void;
  onOpenCurriculum: () => void;
  onOpenTutor: () => void;
}
