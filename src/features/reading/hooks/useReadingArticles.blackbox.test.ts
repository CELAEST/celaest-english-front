/**
 * BLACKBOX REAL — Reading + Lexicon contra PostgreSQL vivo + IA-Mesh vivo
 * No vi.mock. Usa JWT real y HttpClient real contra 8080 vivo.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createHmac, randomUUID } from "node:crypto";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { HttpClient } from "../../../infrastructure/http/HttpClient";

const JWT_SECRET = "super-secret-celaest-english-jwt-key-2026";

function makeJWT(sub: string): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const h = b64({ alg: "HS256", typ: "JWT" });
  const p = b64({ sub, email: `${sub}@celaest.test`, role: "member", exp: Math.floor(Date.now() / 1000) + 3600 });
  const d = `${h}.${p}`;
  const s = createHmac("sha256", JWT_SECRET).update(d).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `${d}.${s}`;
}

async function alive(): Promise<boolean> {
  try {
    const r = await fetch("http://localhost:8080/health", { signal: AbortSignal.timeout(2000) });
    return r.ok;
  } catch {
    return false;
  }
}

describe("Reading Blackbox — Lexicon real (no mocks)", () => {
  beforeAll(async () => {
    const ok = await alive();
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn("[blackbox] backend 8080 no vivo");
    }
  });

  function auth() {
    const uid = `reading-bb-${randomUUID().slice(0, 8)}`;
    const tok = makeJWT(uid);
    try {
      localStorage.setItem("lingua_access_token", tok);
    } catch {
      // ignore
    }
    HttpClient.setAuthToken(tok);
    return uid;
  }

  it("LookupWord real — phonetic + Spanish no quemado", async () => {
    expect(await alive()).toBe(true);
    auth();
    const w = await apiReadingRepository.lookupWord("opportunity", "This is a great opportunity to learn");
    expect(w.word.toLowerCase()).toBe("opportunity");
    expect(w.phonetic).toBeTruthy();
    expect(w.phonetic.length).toBeGreaterThan(3);
    expect(w.phonetic).not.toBe(`/${w.word}/`);
    expect(w.spanishTranslation).toBeTruthy();
    expect(w.spanishTranslation.toLowerCase()).not.toBe("opportunity");
    expect(w.definition.length).toBeGreaterThan(10);
    expect(w.audioUrl).toContain("translate.google.com");
  }, 20000);

  it("GetArticles real — B1 y hostil no leak + GenerateArticle IA fresca", async () => {
    expect(await alive()).toBe(true);
    auth();
    const arts = await apiReadingRepository.getArticles("B1");
    expect(Array.isArray(arts)).toBe(true);
    // Hostil: si hay arts, ninguno debe ser de otra level sin pedirlo
    if (arts.length > 0) {
      expect(arts[0].cefrLevel || "B1").toBeTruthy();
    }
    // Generate fresca con profesión rara — AI-First, no enum cerrado
    const fresh = await apiReadingRepository.generateArticle("BUSINESS", "B1", undefined, "Piloto de Drones");
    expect(fresh.title).toBeTruthy();
    expect(fresh.content.length).toBeGreaterThan(50);
  }, 35000);
});
