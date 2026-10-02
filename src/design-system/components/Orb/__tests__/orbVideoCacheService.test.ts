import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { orbVideoCacheService, useOrbVideoSrc } from "../orbVideoCacheService";

describe("OrbVideoCacheService — Instant Media Pre-caching Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    if (typeof URL.createObjectURL !== "function") {
      URL.createObjectURL = vi.fn();
    }
    // Clear in-memory Map for isolation
    (orbVideoCacheService as any).memoryCache.clear();
    (orbVideoCacheService as any).inFlightPromises.clear();
  });

  it("fetches, converts to Blob URL, and caches the orb video in memory", async () => {
    const mockBlob = new Blob(["fake-video-bytes"], { type: "video/mp4" });
    const mockBlobUrl = "blob:http://localhost/mock-orb-blob-123";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      clone: () => ({ blob: async () => mockBlob }),
    } as any);

    const createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue(mockBlobUrl);

    const result = await orbVideoCacheService.preload("/assets/orve.mp4");

    expect(result).toBe(mockBlobUrl);
    expect(orbVideoCacheService.getCachedUrl("/assets/orve.mp4")).toBe(mockBlobUrl);
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining("/assets/orve.mp4"), { cache: "force-cache" });
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
  });

  it("deduplicates concurrent in-flight preloads for the same asset", async () => {
    const mockBlob = new Blob(["fake-video-bytes"], { type: "video/mp4" });
    const mockBlobUrl = "blob:http://localhost/mock-orb-blob-dedup";

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                blob: async () => mockBlob,
                clone: () => ({ blob: async () => mockBlob }),
              } as any),
            10,
          );
        }),
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue(mockBlobUrl);

    // Call preload multiple times concurrently
    const [p1, p2, p3] = await Promise.all([
      orbVideoCacheService.preload("/assets/orve.mp4"),
      orbVideoCacheService.preload("/assets/orve.mp4"),
      orbVideoCacheService.preload("/assets/orve.mp4"),
    ]);

    expect(p1).toBe(mockBlobUrl);
    expect(p2).toBe(mockBlobUrl);
    expect(p3).toBe(mockBlobUrl);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("gracefully falls back to static path if network/fetch throws without crashing consumer", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network offline"));

    const result = await orbVideoCacheService.preload("/assets/orve.mp4");
    expect(result).toBe("/assets/orve.mp4");
    expect(orbVideoCacheService.getCachedUrl("/assets/orve.mp4")).toBeNull();
  });

  it("useOrbVideoSrc hook reacts seamlessly when cache completes", async () => {
    const mockBlob = new Blob(["video-data"], { type: "video/mp4" });
    const mockBlobUrl = "blob:http://localhost/mock-orb-reactive";
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      clone: () => ({ blob: async () => mockBlob }),
    } as any);
    vi.spyOn(URL, "createObjectURL").mockReturnValue(mockBlobUrl);

    const { result } = renderHook(() => useOrbVideoSrc("/assets/orve.mp4"));

    // Initially static or cached
    expect(result.current.videoSrc).toBeDefined();

    // Trigger preload and check reactive update
    await act(async () => {
      await orbVideoCacheService.preload("/assets/orve.mp4");
    });

    expect(result.current.videoSrc).toBe(mockBlobUrl);
    expect(result.current.isCached).toBe(true);
  });
});
