export type LiveBackdropId =
  | "pavilion"
  | "nordic_dawn"
  | "cozy_loft"
  | "celestial_sky"
  | "velvet_studio"
  | "golden_hour";

export interface LiveBackdropPreset {
  id: LiveBackdropId;
  label: string;
  swatch: string;
}

export const LIVE_STAGE_BACKDROPS: readonly LiveBackdropPreset[] = [
  {
    id: "pavilion",
    label: "Pabellón Atardecer",
    swatch: "linear-gradient(135deg, #1f3459 0%, #3d2a22 50%, #0d111d 100%)",
  },
  {
    id: "nordic_dawn",
    label: "Horizonte Nórdico",
    swatch: "linear-gradient(180deg, #162044 0%, #7d596b 65%, #0c0e18 100%)",
  },
  {
    id: "cozy_loft",
    label: "Estudio Cálido",
    swatch: "radial-gradient(circle at 30% 30%, #f59e0b 0%, #2a222b 58%, #0c0b10 100%)",
  },
  {
    id: "celestial_sky",
    label: "Cielo Nocturno",
    swatch: "linear-gradient(180deg, #060918 0%, #172554 68%, #05070e 100%)",
  },
  {
    id: "velvet_studio",
    label: "Estudio Suave",
    swatch: "linear-gradient(180deg, #4b5563 0%, #1f2430 48%, #07080c 100%)",
  },
  {
    id: "golden_hour",
    label: "Hora Dorada",
    swatch: "linear-gradient(180deg, #1b2848 0%, #c97a4b 58%, #100d14 100%)",
  },
];

const STORAGE_KEY = "celaest:live:backdrop";

export function getStoredLiveBackdrop(): LiveBackdropId {
  if (typeof window === "undefined") return "pavilion";
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as LiveBackdropId | null;
    if (raw && LIVE_STAGE_BACKDROPS.some((b) => b.id === raw)) {
      return raw;
    }
  } catch {
    // ignore storage errors
  }
  return "pavilion";
}

export function setStoredLiveBackdrop(id: LiveBackdropId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore storage errors
  }
}
