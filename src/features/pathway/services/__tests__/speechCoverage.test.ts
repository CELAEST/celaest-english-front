import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import manifest from "../../data/a1AudioManifest.json";
import a2Manifest from "../../data/a2AudioManifest.json";
import b1Manifest from "../../data/b1AudioManifest.json";
import b2Manifest from "../../data/b2AudioManifest.json";
import c1Manifest from "../../data/c1AudioManifest.json";
import c2Manifest from "../../data/c2AudioManifest.json";
import { speechProfiles } from "../../speech/profiles";
import { UNIVERSAL_PHRASES } from "../../speech/universalPhrases";
import { buildProceduralSeedNodes } from "../aiPathwayCurriculumService";
import { PathwayLectureEngine } from "../PathwayLectureEngine";

/**
 * Invariante de cobertura de voz.
 *
 * Toda línea que el motor de clase puede pronunciar DEBE tener audio propio.
 * Si no lo tiene, `SpeechSynthesisService` cae al TTS en vivo y suena otra voz.
 * Este test es la red que evita descubrirlo en clase.
 */

// Copia exacta de sanitizeSpeechForVoice (speechSynthesisService.ts:20-40).
// La clave del manifiesto es el texto sanitizado, no el texto crudo.
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

const M = {
  ...manifest,
  ...a2Manifest,
  ...b1Manifest,
  ...b2Manifest,
  ...c1Manifest,
  ...c2Manifest,
} as Record<string, string>;

/**
 * Bases declaradas CERRADAS. Solo estas bloquean el build.
 * Cerrar una base = agregarla acá después de darle audio a todas sus líneas.
 * Así el avance es nivel por nivel y nunca se rompe lo ya cerrado.
 */
const CLOSED_BASES: string[] = ["base_01", "base_02", "base_03", "base_04", "base_05", "base_06", "base_07", "base_08", "base_09", "base_12", "base_10", "base_11", "base_13", "base_14", "base_15", "base_16", "base_17", "base_23", "base_30", "base_18", "base_19", "base_20", "base_21", "base_22", "base_24", "base_25", "base_26", "base_27", "base_28", "base_29", "base_31", "base_32"];

function hasAudio(text: string): string | null {
  return M[sanitize(text)] || M[text.trim()] || null;
}

describe("Cobertura de voz del Pathway", () => {
  const seeds = buildProceduralSeedNodes("Cardiologist", "A1", "Clinical communication");

  beforeEach(() => {
    localStorage.clear();
  });

  it("todas las líneas del motor de clase tienen audio propio (bases 01-05)", () => {
    PathwayLectureEngine.markSoftwareIntroSeen();
    const missing: { base: string; beat: string; text: string }[] = [];

    for (let orderIndex = 0; orderIndex <= 4; orderIndex += 1) {
      const seed = seeds[orderIndex]!;
      const node = {
        id: "coverage-" + orderIndex,
        pathwayId: "p",
        orderIndex,
        nodeType: "CORE_UNIT" as const,
        status: "ACTIVE" as const,
        title: seed.title,
        competencyFocus: seed.competencyFocus,
        blueprint: seed.blueprint,
        lessonPayload: seed.lessonPayload,
        masteryScore: 0,
        attemptsCount: 0,
        retentionStage: 0,
      };
      const script = PathwayLectureEngine.buildLectureScript(node);
      const base = "base_0" + (orderIndex + 1);
      for (const seg of script.segments) {
        if (!hasAudio(seg.text)) {
          missing.push({ base, beat: seg.beat ?? "-", text: seg.text });
        }
      }
    }

    if (missing.length > 0) {
      const summary = missing
        .map((m) => `  [${m.base}][${m.beat}] ${m.text.slice(0, 110)}`)
        .join("\n");
      // eslint-disable-next-line no-console
      console.error(`\nLíneas del motor SIN audio: ${missing.length}\n${summary}\n`);
    }

    // Solo las bases cerradas bloquean. Las demás se reportan como pendientes.
    const blocking = missing.filter((m) => CLOSED_BASES.includes(m.base));
    const pendientes = [...new Set(missing.map((m) => m.base))].filter((b) => !CLOSED_BASES.includes(b));
    if (pendientes.length) {
      // eslint-disable-next-line no-console
      console.info(`[cobertura] pendientes (no bloquean): ${pendientes.join(", ")}`);
    }
    expect(blocking).toEqual([]);
  });

  /**
   * Ids que los hooks leen del perfil (no del motor de clase): activación de BUILD,
   * cadena de SPEAK, feedback de voz y caza de la trampa. Si un perfil no los tiene,
   * el hook cae al literal viejo y suena otra voz.
   */
  const HOOK_MOMENT_IDS = [
    "build.transition",
    "build.success",
    "build.error",
    "speak.lead",
    "speak.model",
    "speak.instruction",
    "voice.victory",
    "voice.retry",
    "voice.not_heard",
    "trapcheck.error",
    "trapcheck.success",
    "mic.error",
  ];

  it("los perfiles registrados cubren los ids que leen los hooks", () => {
    const missing: string[] = [];
    for (const profile of speechProfiles) {
      for (const id of HOOK_MOMENT_IDS) {
        if (!profile.moments.some((m) => m.id === id)) missing.push(`${profile.baseId}:${id}`);
      }
    }
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.error("\nPerfiles sin pistas de hook:\n  " + missing.join("\n  "));
    }
    expect(missing).toEqual([]);
  });

  it("cada momento de los perfiles registrados tiene audio propio", () => {
    const missing: string[] = [];
    for (const profile of speechProfiles) {
      for (const moment of profile.moments) {
        if (!hasAudio(moment.text)) {
          missing.push(`${profile.baseId}/${moment.id} [${moment.language}]`);
        }
      }
    }
    if (missing.length) {
      // eslint-disable-next-line no-console
      console.error(`\nPerfiles con pistas sin audio: ${missing.length}\n  ` + missing.join("\n  "));
    }
    expect(missing).toEqual([]);
  });

  it("no hay entradas del manifiesto apuntando a archivos inexistentes", () => {
    const root = process.cwd();
    const broken: string[] = [];
    for (const [, rel] of Object.entries(M)) {
      if (typeof rel !== "string" || !rel.startsWith("/audio/")) continue;
      const abs = path.join(root, "public", rel.replace(/^\//, ""));
      if (!fs.existsSync(abs)) broken.push(rel);
    }
    const unique = [...new Set(broken)];
    if (unique.length) {
      // eslint-disable-next-line no-console
      console.error(`\nManifiesto apunta a ${unique.length} archivos inexistentes:\n  ` + unique.slice(0, 20).join("\n  "));
    }
    expect(unique).toEqual([]);
  });

  it("todas las 14 frases universales apuntan exactamente al audio correcto y existen en disco", () => {
    const root = process.cwd();
    const phrases = Object.values(UNIVERSAL_PHRASES);
    expect(phrases.length).toBe(14);
    for (const phrase of phrases) {
      const mapped = hasAudio(phrase.text);
      expect(mapped, `Sin entrada en manifiesto para "${phrase.id}": ${phrase.text}`).toBe(phrase.audioUrl);
      const abs = path.join(root, "public", phrase.audioUrl.replace(/^\//, ""));
      expect(fs.existsSync(abs), `Falta archivo de audio en disco: ${abs}`).toBe(true);
    }
  });
});
