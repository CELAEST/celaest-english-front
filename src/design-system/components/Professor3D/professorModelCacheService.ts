/**
 * Chibi Robot Single-Container DMA Binary Cache Service
 * Stores the 61 clean blank-visor head rotation frames (/data/chibi-head.bin)
 * in RAM + CacheStorage so mounting across /workspace and /pathway is 0ms.
 */

import { loadRobotBinaryBundle } from "./robotBinaryLoader";

let headBitmapsCache: ImageBitmap[] | null = null;
let inflightHeadPromise: Promise<ImageBitmap[]> | null = null;

export async function loadProfessorHeadBitmaps(): Promise<ImageBitmap[]> {
  if (headBitmapsCache) return headBitmapsCache;
  if (inflightHeadPromise) return inflightHeadPromise;

  inflightHeadPromise = (async () => {
    if (typeof window === "undefined" || typeof createImageBitmap === "undefined") return [];
    const blobs = await loadRobotBinaryBundle("/data/chibi-head.bin", "CHED");
    const bitmaps = await Promise.all(blobs.map((blob) => createImageBitmap(blob)));
    headBitmapsCache = bitmaps;
    return bitmaps;
  })();

  try {
    return await inflightHeadPromise;
  } finally {
    inflightHeadPromise = null;
  }
}

export function warmProfessorModelCache(): void {
  if (typeof window === "undefined") return;
  void loadProfessorHeadBitmaps().catch(() => {});
}

// Offline 3D GLB loader retained strictly for baking utilities
const GLB_CACHE_NAME = "celaest-professor-3d-v4";
const GLB_MODEL_PATH = "/assets/professor_mentor.glb";

let memoryBuffer: ArrayBuffer | null = null;
let inflightGlbPromise: Promise<ArrayBuffer> | null = null;

export async function loadProfessorGlbBuffer(): Promise<ArrayBuffer> {
  if (memoryBuffer) return memoryBuffer;
  if (inflightGlbPromise) return inflightGlbPromise;

  inflightGlbPromise = (async () => {
    try {
      if (typeof caches !== "undefined") {
        const cache = await caches.open(GLB_CACHE_NAME);
        const hit = await cache.match(GLB_MODEL_PATH);
        if (hit) {
          memoryBuffer = await hit.arrayBuffer();
          return memoryBuffer;
        }
        const response = await fetch(GLB_MODEL_PATH, { cache: "force-cache" });
        if (response.ok) {
          await cache.put(GLB_MODEL_PATH, response.clone()).catch(() => {});
          memoryBuffer = await response.arrayBuffer();
          return memoryBuffer;
        }
      }
    } catch {
      // Fallback to direct fetch
    }
    const res = await fetch(GLB_MODEL_PATH);
    if (!res.ok) return new ArrayBuffer(0);
    memoryBuffer = await res.arrayBuffer();
    return memoryBuffer;
  })();

  try {
    return await inflightGlbPromise;
  } finally {
    inflightGlbPromise = null;
  }
}
