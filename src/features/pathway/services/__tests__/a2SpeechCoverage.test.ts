import { describe, expect, it } from "vitest";
import a2Manifest from "../../data/a2AudioManifest.json";
import { speechProfiles } from "../../speech/profiles";

/**
 * Cobertura de voz A2.
 *
 * Toda línea de los 32 perfiles A2 debe tener MP3 propio en el manifiesto A2.
 * A1 y A2 comparten `orderIndex`, por eso el filtro es por `baseId` (`base_a2_*`).
 */

const M = a2Manifest as Record<string, string>;

function sanitize(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u00ab\u00bb\u201c\u201d\u2018\u2019"'`]/g, " ")
    .replace(/[\[\]\(\)\{\}\*\#\_\~\<\>]/g, " ")
    .replace(/[\u2014\u2013;]/g, ", ")
    .replace(/\s*[\/\\]\s*/g, " o ")
    .replace(/&/g, " y ")
    .replace(/:\s*/g, ", ")
    .replace(/^\s*\d+\.\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAudio(text: string): boolean {
  return Boolean(M[sanitize(text)] || M[text.trim()]);
}

const CLOSED_A2_BASES = Array.from({ length: 32 }, (_, i) => `base_a2_${String(i + 1).padStart(2, "0")}`);

describe("Cobertura de voz A2", () => {
  const a2Profiles = speechProfiles.filter((p) => p.baseId.startsWith("base_a2_"));

  it("los 32 perfiles A2 están registrados", () => {
    expect(a2Profiles.map((p) => p.baseId).sort()).toEqual([...CLOSED_A2_BASES].sort());
  });

  it("cada momento de los perfiles A2 cerrados tiene MP3 propio", () => {
    const missing: string[] = [];
    for (const profile of a2Profiles) {
      if (!CLOSED_A2_BASES.includes(profile.baseId)) continue;
      for (const moment of profile.moments) {
        if (!hasAudio(moment.text)) missing.push(`${profile.baseId}/${moment.id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("cada perfil A2 cubre los ids que leen los hooks", () => {
    const hookIds = [
      "build.transition", "build.success", "build.error",
      "speak.lead", "speak.model", "speak.instruction",
      "voice.victory", "voice.retry", "voice.not_heard",
      "trapcheck.error", "trapcheck.success", "mic.error",
    ];
    const missing: string[] = [];
    for (const profile of a2Profiles) {
      for (const id of hookIds) {
        if (!profile.moments.some((m) => m.id === id)) missing.push(`${profile.baseId}:${id}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
