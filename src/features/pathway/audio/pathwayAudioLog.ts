/**
 * Registro de audio del Pathway.
 *
 * Un solo lugar para la trazabilidad de la voz: qué línea sonó, desde qué pista,
 * y sobre todo qué línea NO encontró audio y cayó al TTS en vivo (la otra voz).
 *
 * Persiste en localStorage (anillo de 500 eventos) y se puede descargar como JSONL.
 */

export type AudioEventKind = "HIT" | "MISS" | "PLAY_ERROR" | "NO_AUDIO";

export interface AudioEvent {
  /** ISO timestamp */
  t: string;
  kind: AudioEventKind;
  /** base detectada a partir de la ruta del audio, ej. "base_01" */
  base?: string | undefined;
  /** texto ya sanitizado, que es la clave real del manifiesto */
  text: string;
  /** pista reproducida, si hubo */
  audio?: string | undefined;
  /** detalle libre (error, motivo) */
  extra?: string | undefined;
}

const STORAGE_KEY = "celaest.pathway.audioLog";
const MAX_EVENTS = 500;

function detectBase(audioPath?: string): string | undefined {
  if (!audioPath) return undefined;
  const m = audioPath.match(/a1\/(base_\d+)\//);
  if (m) return m[1];
  if (audioPath.includes("/a1/")) return "a1_global";
  return undefined;
}

class PathwayAudioLog {
  private buffer: AudioEvent[] = [];
  private loaded = false;

  private hydrate(): void {
    if (this.loaded || typeof localStorage === "undefined") return;
    this.loaded = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AudioEvent[];
        if (Array.isArray(parsed)) this.buffer = parsed.slice(-MAX_EVENTS);
      }
    } catch {
      this.buffer = [];
    }
  }

  private persist(): void {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.buffer));
    } catch {
      // cuota llena: se descarta lo más viejo antes de rendirse
      try {
        this.buffer = this.buffer.slice(-Math.floor(MAX_EVENTS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.buffer));
      } catch {
        /* sin persistencia, seguimos en memoria */
      }
    }
  }

  record(event: Omit<AudioEvent, "t" | "base"> & { base?: string | undefined }): void {
    this.hydrate();
    const full: AudioEvent = {
      t: new Date().toISOString(),
      base: event.base ?? detectBase(event.audio),
      ...event,
    };
    this.buffer.push(full);
    if (this.buffer.length > MAX_EVENTS) this.buffer.splice(0, this.buffer.length - MAX_EVENTS);
    this.persist();

    if (event.kind !== "HIT" && typeof console !== "undefined") {
      // En desarrollo esto tiene que doler: una línea sin audio es un defecto, no un detalle.
      console.error(
        `[PathwayAudio][${event.kind}]${full.base ? " " + full.base : ""} ${event.text.slice(0, 140)}`,
        event.extra ?? "",
      );
    }
  }

  snapshot(): AudioEvent[] {
    this.hydrate();
    return [...this.buffer];
  }

  /** Líneas distintas que NO tienen audio, agrupadas. Esto es la lista de trabajo. */
  missing(): { text: string; count: number; base?: string | undefined }[] {
    this.hydrate();
    const map = new Map<string, { text: string; count: number; base?: string | undefined }>();
    for (const e of this.buffer) {
      if (e.kind !== "MISS" && e.kind !== "NO_AUDIO") continue;
      const prev = map.get(e.text);
      if (prev) prev.count += 1;
      else map.set(e.text, { text: e.text, count: 1, base: e.base });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }

  stats(): Record<string, { hit: number; miss: number; error: number }> {
    this.hydrate();
    const out: Record<string, { hit: number; miss: number; error: number }> = {};
    for (const e of this.buffer) {
      const key = e.base ?? "desconocida";
      out[key] ??= { hit: 0, miss: 0, error: 0 };
      if (e.kind === "HIT") out[key].hit += 1;
      else if (e.kind === "MISS" || e.kind === "NO_AUDIO") out[key].miss += 1;
      else out[key].error += 1;
    }
    return out;
  }

  toJsonl(): string {
    return this.snapshot()
      .map((e) => JSON.stringify(e))
      .join("\n");
  }

  download(): void {
    if (typeof document === "undefined") return;
    const blob = new Blob([this.toJsonl()], { type: "application/x-ndjson" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pathway-audio-${new Date().toISOString().replace(/[:.]/g, "-")}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  }

  clear(): void {
    this.buffer = [];
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
  }
}

export const pathwayAudioLog = new PathwayAudioLog();

// Acceso desde la consola del navegador y para el panel de desarrollo.
if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).__pathwayAudio = {
    snapshot: () => pathwayAudioLog.snapshot(),
    missing: () => pathwayAudioLog.missing(),
    stats: () => pathwayAudioLog.stats(),
    jsonl: () => pathwayAudioLog.toJsonl(),
    download: () => pathwayAudioLog.download(),
    clear: () => pathwayAudioLog.clear(),
  };
}
