import { describe, expect, it } from "vitest";
import b1Manifest from "../../data/b1AudioManifest.json";
import b2Manifest from "../../data/b2AudioManifest.json";
import c1Manifest from "../../data/c1AudioManifest.json";
import c2Manifest from "../../data/c2AudioManifest.json";
import { speechProfiles } from "../../speech/profiles";

/**
 * Cobertura de audio de los niveles B1, B2, C1 y C2.
 * Cada momento de cada perfil debe tener su MP3 en el manifiesto del nivel.
 */

const MANIFESTS: Record<string, Record<string, string>> = {
  b1: b1Manifest as Record<string, string>,
  b2: b2Manifest as Record<string, string>,
  c1: c1Manifest as Record<string, string>,
  c2: c2Manifest as Record<string, string>,
};

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

const HOOK_IDS = [
  "build.transition", "build.success", "build.error",
  "speak.lead", "speak.model", "speak.instruction",
  "voice.victory", "voice.retry", "voice.not_heard",
  "trapcheck.error", "trapcheck.success", "mic.error",
];

describe("Cobertura de voz B1/B2/C1/C2", () => {
  for (const [level, manifest] of Object.entries(MANIFESTS)) {
    const profiles = speechProfiles.filter((p) => p.baseId.startsWith(`base_${level}_`));

    it(`${level}: 32 perfiles registrados`, () => {
      expect(profiles).toHaveLength(32);
    });

    it(`${level}: cada momento tiene MP3`, () => {
      const missing: string[] = [];
      for (const profile of profiles) {
        for (const moment of profile.moments) {
          const key = sanitize(moment.text);
          if (!manifest[key] && !manifest[moment.text.trim()]) {
            missing.push(`${profile.baseId}/${moment.id}`);
          }
        }
      }
      expect(missing).toEqual([]);
    });

    it(`${level}: cada perfil cubre los hooks`, () => {
      const missing: string[] = [];
      for (const profile of profiles) {
        for (const id of HOOK_IDS) {
          if (!profile.moments.some((m) => m.id === id)) missing.push(`${profile.baseId}:${id}`);
        }
      }
      expect(missing).toEqual([]);
    });
  }
});
