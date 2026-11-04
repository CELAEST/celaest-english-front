/**
 * CELAEST Chibi Robot Binary DMA Loader with CacheStorage Support
 * Delivers single-request DMA batch loading with 0ms repeat-visit persistence.
 */

const CACHE_NAME = "celaest-chibi-assets-v2";

export type ChibiBinaryMagic = "CHED";

export async function loadRobotBinaryBundle(
  url: string,
  expectedMagic: ChibiBinaryMagic,
): Promise<Blob[]> {
  let res: Response | undefined;

  // 1. Try serving directly from local browser CacheStorage (0ms local retrieval)
  if (typeof window !== "undefined" && "caches" in window) {
    try {
      const cache = await window.caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        res = cached;
      } else {
        const networkRes = await fetch(url);
        if (networkRes.ok) {
          cache.put(url, networkRes.clone()).catch(() => {});
          res = networkRes;
        }
      }
    } catch {
      // Fallback to direct network fetch
    }
  }

  if (!res) {
    res = await fetch(url);
  }

  let arrayBuffer: ArrayBuffer;
  try {
    if (!res.ok) {
      res = await fetch(url);
    }
    arrayBuffer = await res.arrayBuffer();
  } catch {
    res = await fetch(url);
    arrayBuffer = await res.arrayBuffer();
  }

  let dataView = new DataView(arrayBuffer);

  let magic = String.fromCharCode(
    dataView.getUint8(0),
    dataView.getUint8(1),
    dataView.getUint8(2),
    dataView.getUint8(3),
  );

  if (magic !== expectedMagic) {
    // Auto-heal: If cached response was corrupted, delete from CacheStorage and re-fetch from network
    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const cache = await window.caches.open(CACHE_NAME);
        await cache.delete(url);
      } catch {}
    }
    const freshRes = await fetch(url, { cache: "reload" });
    arrayBuffer = await freshRes.arrayBuffer();
    dataView = new DataView(arrayBuffer);
    magic = String.fromCharCode(
      dataView.getUint8(0),
      dataView.getUint8(1),
      dataView.getUint8(2),
      dataView.getUint8(3),
    );
    if (magic !== expectedMagic) {
      throw new Error(`Invalid robot bundle magic: expected ${expectedMagic}, got ${magic}`);
    }
  }

  const frameCount = dataView.getUint16(6, true);
  const HEADER_SIZE = 8;
  const INDEX_ENTRY_SIZE = 8;

  const blobs: Blob[] = new Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    const entryOffset = HEADER_SIZE + i * INDEX_ENTRY_SIZE;
    const fileOffset = dataView.getUint32(entryOffset, true);
    const fileLength = dataView.getUint32(entryOffset + 4, true);

    blobs[i] = new Blob([arrayBuffer.slice(fileOffset, fileOffset + fileLength)], {
      type: "image/webp",
    });
  }

  return blobs;
}

