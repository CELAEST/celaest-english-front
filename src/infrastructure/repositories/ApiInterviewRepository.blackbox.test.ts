/**
 * BLACKBOX REAL — Interview progress contra PostgreSQL vivo
 * No vi.mock. JWT real + HttpClient real contra 8080 vivo.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { createHmac, randomUUID } from "node:crypto";
import { apiInterviewRepository } from "./ApiInterviewRepository";
import { HttpClient } from "../http/HttpClient";

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

describe("Interview Blackbox — Progress real (no mocks)", () => {
  beforeAll(async () => {
    if (!(await alive())) {
      // eslint-disable-next-line no-console
      console.warn("[blackbox] backend 8080 no vivo");
    }
  });

  it("Save → Get progress aislado por user_id + hostile profession rara", async () => {
    expect(await alive()).toBe(true);
    const uid = `interview-bb-${randomUUID().slice(0, 8)}`;
    const tok = makeJWT(uid);
    try {
      localStorage.setItem("lingua_access_token", tok);
    } catch {
      // ignore
    }
    HttpClient.setAuthToken(tok);

    const payload = {
      roleName: "Apicultor",
      speechRate: 0.95,
      currentQuestionIndex: 2,
      userTranscript: "I has been working as apicultor for three years",
      savedErrorIds: [],
      showAnalysisModal: false,
      latestTurn: { question: "Tell me about your work", transcript: "I has been working", feedback: {} },
    };

    await apiInterviewRepository.saveProgress(payload as never);
    const got = await apiInterviewRepository.getProgress();
    expect(got).toBeTruthy();
    expect(got?.roleName).toBe("Apicultor");
    expect(got?.currentQuestionIndex).toBe(2);
  }, 20000);
});
