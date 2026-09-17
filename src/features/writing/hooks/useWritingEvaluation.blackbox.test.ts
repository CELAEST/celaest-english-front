/**
 * BLACKBOX REAL — Writing evaluate contra PostgreSQL vivo + IA-Mesh vivo
 * No vi.mock. JWT real + HttpClient real contra 8080 vivo.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createHmac, randomUUID } from "node:crypto";
import { apiWritingRepository } from "../../../infrastructure/repositories/ApiWritingRepository";
import { HttpClient } from "../../../infrastructure/http/HttpClient";

const JWT_SECRET = "super-secret-celaest-english-jwt-key-2026";

function makeJWT(sub: string): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const header = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({ sub, email: `${sub}@celaest.test`, role: "member", exp: Math.floor(Date.now() / 1000) + 3600 });
  const data = `${header}.${payload}`;
  const sig = createHmac("sha256", JWT_SECRET).update(data).digest("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return `${data}.${sig}`;
}

async function alive(): Promise<boolean> {
  try {
    const r = await fetch("http://localhost:8080/health", { signal: AbortSignal.timeout(2000) });
    return r.ok;
  } catch {
    return false;
  }
}

describe("Writing Blackbox — Evaluate real (no mocks)", () => {
  beforeAll(async () => {
    if (!(await alive())) {
      // eslint-disable-next-line no-console
      console.warn("[blackbox] backend 8080 no vivo");
    }
  });

  it("Evaluate B2 — Piloto de Drones (profesión rara, no enum cerrado) + hostile Spanglish", async () => {
    expect(await alive()).toBe(true);
    const uid = `writing-bb-${randomUUID().slice(0, 8)}`;
    const tok = makeJWT(uid);
    try {
      localStorage.setItem("lingua_access_token", tok);
    } catch {
      // ignore
    }
    HttpClient.setAuthToken(tok);

    const sub = await apiWritingRepository.evaluate(
      "EMAIL",
      "Flight safety report",
      "I have completed the drone inspection yesterday. The battery are fully charged and the propellers was checked. We is ready for the mission.",
      "Write a short flight safety report for your team",
      "Piloto de Drones",
      "B2",
    );
    expect(sub.scoreGrammar).toBeGreaterThan(0);
    expect(sub.scoreClarity).toBeGreaterThan(0);
    expect((sub as unknown as { feedback: { extractedErrors: unknown[] } }).feedback).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(((sub as any).feedback as { extractedErrors: unknown[] }).extractedErrors.length).toBeGreaterThan(0);
    // Hostil: debe detectar al menos un error real sin filtrar profesión rara
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasAnyErrorWord = ((sub as any).feedback as { extractedErrors: { errorWord: string }[] }).extractedErrors.some(
      (e) => typeof e.errorWord === "string" && e.errorWord.trim().length > 0,
    );
    expect(hasAnyErrorWord).toBe(true);
  }, 30000);
});
