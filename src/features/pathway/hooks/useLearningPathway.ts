import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CompletePathwayNodeResponse,
  LearningPathway,
  PathwayNode,
} from "../../../domain/entities/LearningPathway";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { apiPathwayRepository } from "../../../infrastructure/repositories/ApiPathwayRepository";
import { normalizeCefr } from "../../conversation/services/dynamicQuestionService";

export interface UseLearningPathwayOptions {
  profession: string;
  cefrLevel: string;
  learningGoal: string;
}

function pickDefaultNodeId(pw: LearningPathway | null): string {
  if (!pw || pw.nodes.length === 0) return "";
  const activeNode = pw.nodes.find((n) => n.status === "ACTIVE");
  if (activeNode) return activeNode.id;
  return pw.nodes[pw.nodes.length - 1]?.id || pw.nodes[0]?.id || "";
}

export function useLearningPathway({
  profession,
  cefrLevel,
  learningGoal,
}: UseLearningPathwayOptions) {
  const normLevel = normalizeCefr(cefrLevel);
  const resolvedRole = profession.trim() || "Professional";
  const resolvedGoal = learningGoal.trim() || "Professional Communication & Fluency";

  const [pathway, setPathway] = useState<LearningPathway>(() =>
    apiPathwayRepository.getOrSeedInitialPathway(normLevel, resolvedRole, resolvedGoal),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() =>
    pickDefaultNodeId(
      apiPathwayRepository.getOrSeedInitialPathway(normLevel, resolvedRole, resolvedGoal),
    ),
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const syncedContextRef = useRef<string>("");

  useEffect(() => {
    const contextKey = `${normLevel}:${resolvedRole}`;
    const immediate = apiPathwayRepository.getOrSeedInitialPathway(
      normLevel,
      resolvedRole,
      resolvedGoal,
    );
    setPathway((prev) => (prev.cefrLevel === normLevel ? prev : immediate));
    setSelectedNodeId((prev) =>
      immediate.nodes.some((n) => n.id === prev && n.status !== "LOCKED")
        ? prev
        : pickDefaultNodeId(immediate),
    );

    if (syncedContextRef.current === contextKey) return;
    let cancelled = false;

    void (async () => {
      const current = await apiPathwayRepository.getCurrentPathway(normLevel);
      if (cancelled) return;
      if (current && current.nodes.length > 0) {
        syncedContextRef.current = contextKey;
        setPathway(current);
        setSelectedNodeId((prev) =>
          current.nodes.some((n) => n.id === prev && n.status !== "LOCKED")
            ? prev
            : pickDefaultNodeId(current),
        );
        return;
      }

      const synced = await apiPathwayRepository.generateOrSyncPathway({
        cefrLevel: normLevel,
        profession: resolvedRole,
        learningGoal: resolvedGoal,
      });
      if (!cancelled) {
        syncedContextRef.current = contextKey;
        setPathway(synced);
        setSelectedNodeId(pickDefaultNodeId(synced));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [normLevel, resolvedRole, resolvedGoal]);

  const activeNode: PathwayNode | null = useMemo(() => {
    if (!pathway.nodes.length) return null;
    return (
      pathway.nodes.find((n) => n.id === selectedNodeId) ||
      pathway.nodes.find((n) => n.status === "ACTIVE") ||
      pathway.nodes[0] ||
      null
    );
  }, [pathway.nodes, selectedNodeId]);

  const activeNodeIndex = useMemo(() => {
    if (!activeNode) return 0;
    const idx = pathway.nodes.findIndex((n) => n.id === activeNode.id);
    return idx >= 0 ? idx : 0;
  }, [pathway.nodes, activeNode]);

  const selectNode = useCallback(
    (nodeId: string) => {
      const target = pathway.nodes.find((n) => n.id === nodeId);
      if (!target) return;
      setSelectedNodeId(nodeId);
    },
    [pathway.nodes],
  );

  const personalizeWithAi = useCallback(async () => {
    setIsGeneratingAi(true);
    try {
      const memoryErrors = await apiMemoryRepository.getDueCards().catch(() => []);
      const fresh = await apiPathwayRepository.generateOrSyncPathway({
        cefrLevel: normLevel,
        profession: resolvedRole,
        learningGoal: resolvedGoal,
        memoryErrors,
        forceRegenerate: true,
      });
      syncedContextRef.current = `${normLevel}:${resolvedRole}`;
      setPathway(fresh);
      setSelectedNodeId(pickDefaultNodeId(fresh));
    } finally {
      setIsGeneratingAi(false);
    }
  }, [normLevel, resolvedRole, resolvedGoal]);

  const completeActiveNode = useCallback(
    async (
      sentence: string,
      evaluation?: import("../../../domain/repositories/IPathwayRepository").CompletePathwayNodeParams["evaluation"],
    ): Promise<CompletePathwayNodeResponse | null> => {
      if (!activeNode) return null;
      const res = await apiPathwayRepository.completeNode({
        node: activeNode,
        pathway,
        spokenOrBuiltSentence: sentence,
        ...(evaluation ? { evaluation } : {}),
      });
      setPathway(res.pathway);
      return res;
    },
    [activeNode, pathway],
  );

  return {
    pathway,
    activeNode,
    activeNodeIndex,
    isGeneratingAi,
    selectNode,
    personalizeWithAi,
    completeActiveNode,
  };
}
