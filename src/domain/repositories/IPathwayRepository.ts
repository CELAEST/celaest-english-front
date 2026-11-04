import {
  CompletePathwayNodeResponse,
  LearningPathway,
  PathwayNode,
} from "../entities/LearningPathway";
import { MemoryCard } from "../entities/MemoryCard";

export interface GeneratePathwayParams {
  cefrLevel: string;
  profession: string;
  learningGoal: string;
  memoryErrors?: MemoryCard[];
  forceRegenerate?: boolean;
}

export interface CompletePathwayNodeParams {
  node: PathwayNode;
  pathway: LearningPathway;
  spokenOrBuiltSentence: string;
  evaluation?: {
    overallScore: number;
    structureScore: number;
    lexicalScore: number;
    fluencyScore: number;
    diagnostic?: {
      summarySpanish: string;
      primaryGap: string;
      coachingAction: string;
      modelUpgrade: string;
      extractedErrors?: any[];
    };
  };
}

export interface IPathwayRepository {
  getCachedPathway(cefrLevel: string): LearningPathway | null;
  getOrSeedInitialPathway(
    cefrLevel: string,
    profession: string,
    learningGoal: string,
  ): LearningPathway;
  getCurrentPathway(cefrLevel: string): Promise<LearningPathway | null>;
  generateOrSyncPathway(params: GeneratePathwayParams): Promise<LearningPathway>;
  hydrateNodeContent(
    node: PathwayNode,
    profession: string,
    cefrLevel: string,
  ): Promise<PathwayNode>;
  completeNode(
    params: CompletePathwayNodeParams,
  ): Promise<CompletePathwayNodeResponse>;
}
