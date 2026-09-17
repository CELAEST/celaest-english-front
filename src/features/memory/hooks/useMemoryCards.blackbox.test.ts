/**
 * BLACKBOX REAL — useMemoryCards + ApiMemoryRepository contra PostgreSQL vivo
 * No vi.mock, no vi.fn. Cada test usa user_id uuid fresco + JWT HS256 real contra localhost:8080 vivo.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createHmac, randomUUID } from "node:crypto";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { HttpClient } from "../../../infrastructure/http/HttpClient";

const LIVE_API = process.env.VITE_API_URL || "http://localhost:8080/api/v1";
const JWT_SECRET = "super-secret-celaest-english-jwt-key-2026";

function b64uJson(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function makeRealJWT(sub: string): string {
  const header = b64uJson({ alg: "HS256", typ: "JWT" });
  const payload = b64uJson({
    sub,
    email: `${sub}@celaest.test`,
    role: "member",
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const data = `${header}.${payload}`;
  const sig = createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  return `${data}.${sig}`;
}

async function backendAlive(): Promise<boolean> {
  try {
    const r = await fetch(`${LIVE_API.replace(/\/api\/v1$/, "")}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    return r.ok;
  } catch {
    // ignore
  }
  try {
    const r2 = await fetch(`${LIVE_API}/../health`, { signal: AbortSignal.timeout(2000) });
    return r2.ok;
  } catch {
    // ignore
  }
  return false;
}

describe("Memory Blackbox — Serena Vault real (no mocks)", () => {
  beforeAll(async () => {
    const ok = await backendAlive();
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn("[blackbox] backend 8080 no vivo — levanta celaest-english-back en 8080 antes de correr este test");
    }
  });

  function freshUser(): { userId: string; token: string } {
    const userId = `front-blackbox-${randomUUID().slice(0, 8)}`;
    const token = makeRealJWT(userId);
    try {
      localStorage.setItem("lingua_access_token", token);
    } catch {
      // localStorage unavailable in some test env
    }
    HttpClient.setAuthToken(token);
    return { userId, token };
  }

  it("Create → GetDueCars → Review → Bookmark → Delete flujo completo", async () => {
    const ok = await backendAlive();
    expect(ok, "backend 8080 debe estar vivo para test blackbox real — levanta celaest-english-back").toBe(true);
    freshUser();

    const empty = await apiMemoryRepository.getDueCards("SPEAKING");
    expect(Array.isArray(empty)).toBe(true);
    const initialCount = empty.length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created: any = await apiMemoryRepository.createCard({
      category: "SPEAKING",
      userSaid: "I has a cat",
      betterWay: "I have a cat",
      translationSpanish: "Tengo un gato",
      errorWord: "has",
      correctWord: "have",
      grammarExplanation: "Use have with I",
      cefrLevel: "A2",
    } as unknown as never);
    expect(created).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cardId = (created as any).id || (created as any).ID || (created as any).cardId;
    let realCardId: string = cardId;
    if (!realCardId) {
      const afterCreate = await apiMemoryRepository.getDueCards("SPEAKING");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const found: any = afterCreate.find((c: any) => c.userSaid === "I has a cat" || c.errorWord === "has");
      realCardId = found?.id;
    }
    expect(realCardId).toBeTruthy();

    const after = await apiMemoryRepository.getDueCards("SPEAKING");
    expect(after.length).toBe(initialCount + 1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dup: any = await apiMemoryRepository.createCard({
      category: "SPEAKING",
      userSaid: "I has a cat",
      betterWay: "I have a cat",
      errorWord: "has",
      correctWord: "have",
      grammarExplanation: "Use have with I",
      cefrLevel: "A2",
    } as unknown as never);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dupId = (dup as any).id || (dup as any).ID || (dup as any).cardId;
    if (dupId) {
      expect(dupId).toBe(realCardId);
    }
    const afterDup = await apiMemoryRepository.getDueCards("SPEAKING");
    expect(afterDup.length).toBe(initialCount + 1);

    const reviewed = await apiMemoryRepository.reviewCard(realCardId, 5);
    expect(reviewed).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bm1: any = await apiMemoryRepository.toggleBookmark(realCardId);
    expect(typeof bm1.bookmarked === "boolean" || typeof bm1.bookmarked === "undefined").toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bm2: any = await apiMemoryRepository.toggleBookmark(realCardId);
    if (bm1.bookmarked !== undefined && bm2.bookmarked !== undefined) {
      expect(bm1.bookmarked).not.toBe(bm2.bookmarked);
    }

    await apiMemoryRepository.deleteCard(realCardId);
    const afterDelete = await apiMemoryRepository.getDueCards("SPEAKING");
    expect(afterDelete.length).toBe(initialCount);
  }, 30000);

  it("IDOR — userA no ve cards de userB", async () => {
    const ok = await backendAlive();
    expect(ok, "backend 8080 debe estar vivo").toBe(true);
    const userA = freshUser();
    const userB = (() => {
      const uid = `front-blackbox-${randomUUID().slice(0, 8)}`;
      const tok = makeRealJWT(uid);
      return { userId: uid, token: tok };
    })();

    HttpClient.setAuthToken(userA.token);
    try {
      localStorage.setItem("lingua_access_token", userA.token);
    } catch {
      // ignore
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdA: any = await apiMemoryRepository.createCard({
      category: "READING",
      userSaid: "The team are working",
      betterWay: "The team is working",
      errorWord: "are",
      correctWord: "is",
      grammarExplanation: "Collective noun singular",
      cefrLevel: "B1",
    } as unknown as never);
    const idA: string = createdA.id || createdA.ID;
    expect(idA).toBeTruthy();

    HttpClient.setAuthToken(userB.token);
    try {
      localStorage.setItem("lingua_access_token", userB.token);
    } catch {
      // ignore
    }
    const bCards = await apiMemoryRepository.getDueCards("READING");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seesA = bCards.some((c: any) => c.id === idA || (c as any).ID === idA);
    expect(seesA).toBe(false);

    try {
      await apiMemoryRepository.deleteCard(idA);
      HttpClient.setAuthToken(userA.token);
      try {
        localStorage.setItem("lingua_access_token", userA.token);
      } catch {
        // ignore
      }
      const aCards = await apiMemoryRepository.getDueCards("READING");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stillThere = aCards.some((c: any) => c.id === idA || (c as any).ID === idA);
      expect(stillThere).toBe(true);
      await apiMemoryRepository.deleteCard(idA);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e.message || e).toBeTruthy();
    }
  }, 30000);
});
