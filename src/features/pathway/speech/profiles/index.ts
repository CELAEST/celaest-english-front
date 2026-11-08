import { BaseSpeechProfile } from "../types";
import { base01SpeechProfile } from "./base_01";
import { base02SpeechProfile } from "./base_02";
import { base03SpeechProfile } from "./base_03";
import { base04SpeechProfile } from "./base_04";
import { base05SpeechProfile } from "./base_05";
import { base06SpeechProfile } from "./base_06";
import { base07SpeechProfile } from "./base_07";
import { base08SpeechProfile } from "./base_08";
import { base09SpeechProfile } from "./base_09";
import { base12SpeechProfile } from "./base_12";
import { base10SpeechProfile } from "./base_10";

/**
 * Registro de guiones hablados aprobados.
 *
 * Una base entra acá cuando su perfil ya tiene audio propio en el manifiesto:
 * así el motor de clase y los hooks dejan de tener literales por base y solo
 * leen `moments`. Las bases que todavía no están acá conservan su rama legacy.
 */
export const speechProfiles: BaseSpeechProfile[] = [
  base01SpeechProfile,
  base02SpeechProfile,
  base03SpeechProfile,
  base04SpeechProfile,
  base05SpeechProfile,
  base06SpeechProfile,
  base07SpeechProfile,
  base08SpeechProfile,
  base09SpeechProfile,
  base12SpeechProfile,
  base10SpeechProfile,
];

/**
 * Pistas de título para currículos importados cuyo `orderIndex` no coincide con
 * el del seed (mismo respaldo que ya usaba la rama de Base 01).
 */
const TITLE_HINTS: Record<string, string[]> = {
  base_01: ["orden mágico"],
  base_02: ["it fantasma", "frases sin persona humana"],
  base_03: ["ser o estar sin enredos", "am · is · are"],
  base_04: ["trampa de tener", "estados y edad"],
  base_05: ["negativo & pregunta", "negativo y pregunta"],
};

function normalizeTitle(title?: string): string {
  return (title ?? "").toLowerCase().replace(/[«»"'`´]/g, "");
}

/** Perfil de una base por `orderIndex`, con respaldo por título. */
export function resolveSpeechProfile(
  orderIndex: number | undefined,
  title?: string,
): BaseSpeechProfile | undefined {
  const byIndex = speechProfiles.find((p) => p.orderIndex === orderIndex);
  if (byIndex) return byIndex;
  const normalized = normalizeTitle(title);
  if (!normalized) return undefined;
  return speechProfiles.find((p) =>
    (TITLE_HINTS[p.baseId] ?? []).some((hint) => normalized.includes(hint)),
  );
}

/** Texto de una pista del perfil, o `undefined` si no existe. */
export function speechMomentText(
  profile: BaseSpeechProfile | undefined,
  id: string,
): string | undefined {
  return profile?.moments.find((m) => m.id === id)?.text;
}
