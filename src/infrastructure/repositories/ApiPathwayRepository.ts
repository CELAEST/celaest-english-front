import {
  CompletePathwayNodeResponse,
  LearningPathway,
  PathwayNode,
  PathwayNodeStatus,
} from "../../domain/entities/LearningPathway";
import {
  CompletePathwayNodeParams,
  GeneratePathwayParams,
  IPathwayRepository,
} from "../../domain/repositories/IPathwayRepository";
import { normalizeCefr } from "../../features/conversation/services/dynamicQuestionService";
import {
  AiPathwayCurriculumService,
  buildProceduralSeedNodes,
} from "../../features/pathway/services/aiPathwayCurriculumService";
import { providerKeyVault } from "../../features/settings/services/providerKeyVault";
import { HttpClient } from "../http/HttpClient";

const LOCAL_PATHWAY_PREFIX = "celaest:pathway:guide:v4";

function resolveUserNamespace(): string {
  if (typeof window === "undefined") return "anon";
  const token = localStorage.getItem("lingua_access_token") || "";
  if (!token) return "guest";
  try {
    const payloadPart = token.split(".")[1];
    if (payloadPart) {
      const decoded = JSON.parse(
        atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")),
      ) as { sub?: string; user_id?: string; userId?: string };
      const uid = decoded.sub || decoded.user_id || decoded.userId;
      if (uid) return uid;
    }
  } catch {
    // ignore malformed JWT
  }
  return token.slice(-12);
}

function getStorageKey(cefrLevel: string): string {
  const norm = normalizeCefr(cefrLevel);
  return `${LOCAL_PATHWAY_PREFIX}:${resolveUserNamespace()}:${norm}`;
}

function notifyPathwayUpdated(pathway: LearningPathway): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent("celaest:pathway-updated", { detail: pathway }),
    );
  } catch {
    // ignore
  }
}

async function buildProviderHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  try {
    const activeProvider = await providerKeyVault.getActiveProviderId();
    if (activeProvider) {
      headers["X-Provider-Id"] = activeProvider;
      const keys = await providerKeyVault.getKeys(activeProvider);
      if (keys[0]) headers["X-Provider-Key"] = keys[0];
    }
  } catch {
    // optional BYOK headers
  }
  return headers;
}

function ensureNodesCarryPayloads(
  pathway: LearningPathway,
  profession: string,
  cefrLevel: string,
): LearningPathway {
  const seeds = buildProceduralSeedNodes(profession, cefrLevel, pathway.learningGoal);
  const nodes = pathway.nodes.map((n, idx) => {
    const matchingSeed = seeds[idx];
    if (matchingSeed && n.title === matchingSeed.title) {
      return {
        ...n,
        lessonPayload: matchingSeed.lessonPayload,
      };
    }
    if (n.lessonPayload?.blockChallenge?.targetTokens?.length) return n;
    const fallbackSeed = matchingSeed || seeds[0]!;
    return {
      ...n,
      lessonPayload: fallbackSeed.lessonPayload,
    };
  });
  return { ...pathway, nodes };
}

export class ApiPathwayRepository implements IPathwayRepository {
  public getCachedPathway(cefrLevel: string): LearningPathway | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(getStorageKey(cefrLevel));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LearningPathway;
      if (
        parsed?.id &&
        Array.isArray(parsed.nodes) &&
        parsed.nodes.length > 0 &&
        parsed.nodes[0]?.lessonPayload?.blockChallenge
      ) {
        return parsed;
      }
    } catch {
      // ignore corrupted cache
    }
    return null;
  }

  public getOrSeedInitialPathway(
    cefrLevel: string,
    profession: string,
    learningGoal: string,
  ): LearningPathway {
    const normLevel = normalizeCefr(cefrLevel);
    const role = profession.trim() || "Professional";
    const goal = learningGoal.trim() || "Professional Communication & Fluency";
    const cached = this.getCachedPathway(normLevel);
    const seedNodes = buildProceduralSeedNodes(role, normLevel, goal);

    if (cached && cached.nodes.length >= seedNodes.length) {
      return cached;
    }

    const pathwayId = `guide-${normLevel.toLowerCase()}`;
    const masteredNodeIds = new Set(
      cached?.nodes.filter((n) => n.status === "MASTERED").map((n) => n.id) || [],
    );
    const activeNodeId = cached?.nodes.find((n) => n.status === "ACTIVE")?.id;

    const seeded: LearningPathway = {
      id: pathwayId,
      userId: resolveUserNamespace(),
      cefrLevel: normLevel,
      professionSnapshot: role,
      learningGoal: goal,
      focusSummary: `Las ${seedNodes.length} bases esenciales de ${normLevel} explicadas paso a paso.`,
      masteryIndex: cached?.masteryIndex ?? 0,
      updatedAt: new Date().toISOString(),
      nodes: seedNodes.map((sn, idx) => {
        const nodeId = `${pathwayId}-node-${idx + 1}`;
        let status: PathwayNodeStatus = "LOCKED";
        const prevStatus = cached?.nodes[idx]?.status;
        if (masteredNodeIds.has(nodeId) || prevStatus === "MASTERED") {
          status = "MASTERED";
        } else if (
          (!cached && idx === 0) ||
          activeNodeId === nodeId ||
          prevStatus === "ACTIVE" ||
          (idx === 0 && !masteredNodeIds.size)
        ) {
          status = "ACTIVE";
        }
        return {
          id: nodeId,
          pathwayId,
          orderIndex: idx,
          nodeType: "CORE_UNIT",
          status,
          title: sn.title,
          competencyFocus: sn.competencyFocus,
          ...(sn.sourceWeaknessTag ? { sourceWeaknessTag: sn.sourceWeaknessTag } : {}),
          blueprint: sn.blueprint,
          lessonPayload: sn.lessonPayload,
          masteryScore: cached?.nodes[idx]?.masteryScore ?? 0,
          attemptsCount: cached?.nodes[idx]?.attemptsCount ?? 0,
          retentionStage: cached?.nodes[idx]?.retentionStage ?? 0,
        };
      }),
    };
    this.saveLocalCache(seeded);
    return seeded;
  }

  private saveLocalCache(pathway: LearningPathway): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(getStorageKey(pathway.cefrLevel), JSON.stringify(pathway));
      notifyPathwayUpdated(pathway);
    } catch {
      // ignore storage quota errors
    }
  }

  public async getCurrentPathway(cefrLevel: string): Promise<LearningPathway | null> {
    const norm = normalizeCefr(cefrLevel);
    const minExpectedNodes = buildProceduralSeedNodes("Professional", norm, "").length;
    try {
      const remote = await HttpClient.get<LearningPathway | null>(
        `/pathway/current?cefrLevel=${encodeURIComponent(norm)}`,
        { timeoutMs: 8_000 },
      );
      if (
        remote &&
        Array.isArray(remote.nodes) &&
        remote.nodes.length >= minExpectedNodes
      ) {
        const enriched = ensureNodesCarryPayloads(
          remote,
          remote.professionSnapshot || "Professional",
          norm,
        );
        this.saveLocalCache(enriched);
        return enriched;
      }
      return null;
    } catch {
      const cached = this.getCachedPathway(norm);
      return cached && cached.nodes.length >= minExpectedNodes ? cached : null;
    }
  }

  public async generateOrSyncPathway(params: GeneratePathwayParams): Promise<LearningPathway> {
    const normLevel = normalizeCefr(params.cefrLevel);
    const role = params.profession.trim() || "Professional";
    const goal = params.learningGoal.trim() || "Professional Communication & Fluency";

    const seedNodes = await AiPathwayCurriculumService.synthesizeSeedCurriculum({
      profession: role,
      cefrLevel: normLevel,
      learningGoal: goal,
      ...(params.memoryErrors ? { memoryErrors: params.memoryErrors } : {}),
      useAiCustomization: Boolean(params.forceRegenerate),
    });

    const focusSummary = `Guía estructurada de bases (${normLevel}) para dominar las reglas y abordar cada módulo con confianza.`;

    try {
      const headers = await buildProviderHeaders();
      let synced = await HttpClient.post<LearningPathway>(
        "/pathway/generate",
        {
          cefrLevel: normLevel,
          profession: role,
          learningGoal: goal,
          focusSummary,
          forceRegenerate: Boolean(params.forceRegenerate),
          clientNodes: seedNodes,
        },
        { headers, timeoutMs: 12_000 },
      );
      if (
        synced?.id &&
        Array.isArray(synced.nodes) &&
        synced.nodes.length < seedNodes.length &&
        !params.forceRegenerate
      ) {
        synced = await HttpClient.post<LearningPathway>(
          "/pathway/generate",
          {
            cefrLevel: normLevel,
            profession: role,
            learningGoal: goal,
            focusSummary,
            forceRegenerate: true,
            clientNodes: seedNodes,
          },
          { headers, timeoutMs: 12_000 },
        );
      }
      if (synced?.id && Array.isArray(synced.nodes) && synced.nodes.length >= seedNodes.length) {
        const enriched = ensureNodesCarryPayloads(synced, role, normLevel);
        this.saveLocalCache(enriched);
        return enriched;
      }
    } catch {
      // resilient local persistence
    }

    const nowIso = new Date().toISOString();
    const pathwayId = `guide-${normLevel.toLowerCase()}-${Date.now()}`;
    const localPathway: LearningPathway = {
      id: pathwayId,
      userId: resolveUserNamespace(),
      cefrLevel: normLevel,
      professionSnapshot: role,
      learningGoal: goal,
      focusSummary,
      masteryIndex: 0,
      updatedAt: nowIso,
      nodes: seedNodes.map((sn, idx) => ({
        id: `${pathwayId}-node-${idx + 1}`,
        pathwayId,
        orderIndex: idx,
        nodeType: "CORE_UNIT",
        status: idx === 0 ? "ACTIVE" : "LOCKED",
        title: sn.title,
        competencyFocus: sn.competencyFocus,
        ...(sn.sourceWeaknessTag ? { sourceWeaknessTag: sn.sourceWeaknessTag } : {}),
        blueprint: sn.blueprint,
        lessonPayload: sn.lessonPayload,
        masteryScore: 0,
        attemptsCount: 0,
        retentionStage: 0,
      })),
    };
    this.saveLocalCache(localPathway);
    return localPathway;
  }

  public async hydrateNodeContent(
    node: PathwayNode,
    profession: string,
    cefrLevel: string,
  ): Promise<PathwayNode> {
    if (node.lessonPayload?.blockChallenge?.targetTokens?.length) {
      return node;
    }
    const lessonPayload = await AiPathwayCurriculumService.synthesizeLessonPayload(
      node,
      profession,
      cefrLevel,
    );
    return { ...node, lessonPayload };
  }

  public async completeNode(
    params: CompletePathwayNodeParams,
  ): Promise<CompletePathwayNodeResponse> {
    const nowIso = new Date().toISOString();

    // Sync completion to backend PostgreSQL asynchronously/cleanly when available
    try {
      const headers = await buildProviderHeaders();
      const clientEval = params.evaluation ?? {
        overallScore: 85,
        structureScore: 85,
        lexicalScore: 85,
        fluencyScore: 85,
        diagnostic: {
          summarySpanish: "Base completada y guardada con éxito.",
          primaryGap: "",
          coachingAction: "",
          modelUpgrade: params.spokenOrBuiltSentence,
          extractedErrors: [],
        },
      };

      const remoteRes = await HttpClient.post<{
        updatedNode?: PathwayNode;
        unlockedNextNode?: PathwayNode;
        pathway?: LearningPathway;
      }>(
        `/pathway/nodes/${encodeURIComponent(params.node.id)}/evaluate`,
        {
          stage: "MASTERY_GATE",
          oralTranscript: params.spokenOrBuiltSentence,
          writtenResponse: params.spokenOrBuiltSentence,
          targetPrompt: params.node.title,
          expectedCollocations: [],
          clientEvaluation: clientEval,
        },
        { headers, timeoutMs: 10_000 },
      );

      if (remoteRes?.pathway && Array.isArray(remoteRes.pathway.nodes)) {
        const enriched = ensureNodesCarryPayloads(
          remoteRes.pathway,
          params.pathway.professionSnapshot,
          params.pathway.cefrLevel,
        );
        this.saveLocalCache(enriched);
        return {
          ...(remoteRes.updatedNode ? { updatedNode: remoteRes.updatedNode } : {}),
          ...(remoteRes.unlockedNextNode ? { unlockedNextNode: remoteRes.unlockedNextNode } : {}),
          pathway: enriched,
        };
      }
    } catch {
      // Persist locally with 0 data loss if offline or dev server hasn't restarted yet
    }

    const nodes = params.pathway.nodes.map((n) => ({ ...n }));
    const idx = nodes.findIndex((n) => n.id === params.node.id);
    let unlockedNextNode: PathwayNode | undefined;
    let updatedNode: PathwayNode | undefined;

    if (idx >= 0) {
      const target = nodes[idx]!;
      target.status = "MASTERED";
      target.masteryScore = 100;
      target.attemptsCount += 1;
      target.masteredAt = nowIso;
      updatedNode = target;

      const nextLocked = nodes.find(
        (n) => n.orderIndex > target.orderIndex && n.status === "LOCKED",
      );
      if (nextLocked) {
        nextLocked.status = "ACTIVE";
        unlockedNextNode = nextLocked;
      }
    }

    const masteredCount = nodes.filter(
      (n) => n.status === "MASTERED" || n.status === "CONSOLIDATED",
    ).length;
    const masteryIndex =
      nodes.length > 0 ? Math.round((masteredCount * 100) / nodes.length) : 0;

    const updatedPathway: LearningPathway = {
      ...params.pathway,
      masteryIndex,
      nodes,
      updatedAt: nowIso,
    };
    this.saveLocalCache(updatedPathway);

    return {
      ...(updatedNode ? { updatedNode } : {}),
      ...(unlockedNextNode ? { unlockedNextNode } : {}),
      pathway: updatedPathway,
    };
  }
}

export const apiPathwayRepository = new ApiPathwayRepository();
