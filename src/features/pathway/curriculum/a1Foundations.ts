import { PathwayLessonPayload } from "../../../domain/entities/LearningPathway";

export interface FoundationUnitSpec {
  title: string;
  focus: string;
  payload: PathwayLessonPayload;
}

export { buildA1Foundations } from "./a1";
