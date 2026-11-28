import React, { useEffect, useRef, useState } from "react";
import { Loader2, Play, Square, Volume2, Zap } from "lucide-react";
import { ENV } from "../../../shared/constants/env";

interface LabVoiceOption {
  id: string;
  name: string;
  badge: string;
  engine: "go-stream" | "edge-worker" | "openai" | "elevenlabs" | "gemini";
  description: string;
}

const LAB_BILINGUAL_VOICES: readonly LabVoiceOption[] = [
  {
    id: "Charon",
    name: "Gemini 2.5 Flash TTS (Charon)",
    badge: "Activo · Code-Switching",
    engine: "gemini",
    description: "Voz masculina nativa de Google Gemini. Cambia entre español e inglés con pronunciación real.",
  },
  {
    id: "Puck",
    name: "Gemini 2.5 Flash TTS (Puck)",
    badge: "Activo · Dinámico",
    engine: "gemini",
    description: "Voz masculina juvenil de Gemini, más enérgica y conversacional para clases dinámicas.",
  },
  {
    id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "ElevenLabs Flash v2.5 (Roger)",
    badge: "Top Bilingüe · Streaming",
    engine: "elevenlabs",
    description: "Modelo multilingüe ultrarrápido (~75ms TTFB). Cambia entre español e inglés con acento nativo.",
  },
  {
    id: "JBFqnCBsd6RMkjVDRZzb",
    name: "ElevenLabs Flash v2.5 (George)",
    badge: "Top Bilingüe · Cálido",
    engine: "elevenlabs",
    description: "Voz masculina cálida y clara en ElevenLabs Flash v2.5, ideal para explicar conceptos.",
  },
  {
    id: "ash",
    name: "OpenAI gpt-4o-mini-tts (Ash)",
    badge: "Top Bilingüe · Nativo",
    engine: "openai",
    description: "Voz masculina expresiva guiada para alternar español neutro e inglés americano sin leer literal.",
  },
  {
    id: "verse",
    name: "OpenAI gpt-4o-mini-tts (Verse)",
    badge: "Top Bilingüe · Dinámico",
    engine: "openai",
    description: "Voz masculina conversacional muy natural y ágil en ambos idiomas.",
  },
  {
    id: "en-US-AndrewMultilingualNeural",
    name: "EdgeNeural (Andrew / Liam)",
    badge: "Gratis · Referencia",
    engine: "go-stream",
    description: "Referencia gratuita actual: en frases mixtas suele leer el inglés con acento español.",
  },
  {
    id: "edge-aura-2",
    name: "Cloudflare Aura-2 (Orion / Javier)",
    badge: "2 Voces Monolingües",
    engine: "edge-worker",
    description: "Comparativa Edge Workers AI: alterna entre orion (EN) y javier (ES).",
  },
];

const PHRASE_PRESETS = [
  {
    label: "Explicación Bilingüe",
    text: "Good catch! En inglés no decimos 'I have 25 years', sino 'I am 25 years old', porque la edad es un estado, no algo que posees. Try saying it with me: I am twenty-five.",
  },
  {
    label: "Explicación Inglés",
    text: "Think of 'make' as creating something new, like making a plan or making coffee, while 'do' is for tasks and actions like doing your homework. Can you give me one example with make?",
  },
  {
    label: "Explicación Español",
    text: "Cuando quieras sonar más natural en una reunión, en lugar de decir 'I think is good', prueba con 'That sounds like a solid plan'. Fíjate cómo cambia el ritmo de la frase.",
  },
];

export const LiveVoiceLabShowcase: React.FC = () => {
  const [text, setText] = useState(PHRASE_PRESETS[0]!.text);
  const [customApiKey, setCustomApiKey] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    void fetch(`${ENV.apiUrl}/health`, { mode: "cors" }).catch(() => {});
    return () => {
      audioRef.current?.pause();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setActiveId(null);
    setLoadingId(null);
  };

  const auditionVoice = async (voice: LabVoiceOption) => {
    if (activeId === voice.id || loadingId === voice.id) {
      stopPlayback();
      return;
    }
    stopPlayback();
    setErrorMsg(null);
    setLoadingId(voice.id);
    const t0 = performance.now();

    try {
      let srcUrl: string;
      if (voice.engine === "edge-worker") {
        const res = await fetch("/api/edge-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim() }),
        });
        if (!res.ok) throw new Error(`Edge TTS HTTP ${res.status}`);
        const blob = await res.blob();
        srcUrl = URL.createObjectURL(blob);
        blobUrlRef.current = srcUrl;
      } else if (voice.engine === "openai" || voice.engine === "elevenlabs" || voice.engine === "gemini") {
        const res = await fetch(`${ENV.apiUrl}/tts/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text.trim(),
            voice: voice.id,
            provider: voice.engine,
            apiKey: customApiKey.trim() || undefined,
          }),
        });
        if (!res.ok) {
          const errJson = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(errJson?.error || `${voice.name} HTTP ${res.status}`);
        }
        const blob = await res.blob();
        srcUrl = URL.createObjectURL(blob);
        blobUrlRef.current = srcUrl;
      } else {
        srcUrl = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(text.trim())}&voice=${encodeURIComponent(
          voice.id,
        )}&rate=%2B2%25&volume=%2B100%25`;
      }

      const audio = new Audio(srcUrl);
      audioRef.current = audio;
      audio.onplaying = () => {
        const ttfa = Math.round(performance.now() - t0);
        setLatencies((prev) => ({ ...prev, [voice.id]: ttfa }));
        setLoadingId(null);
        setActiveId(voice.id);
      };
      audio.onended = () => stopPlayback();
      audio.onerror = () => {
        setErrorMsg(`No se pudo reproducir ${voice.name} (verifica que el backend esté activo).`);
        stopPlayback();
      };
      await audio.play();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error reproduciendo voz");
      stopPlayback();
    }
  };

  return (
    <section
      className="rounded-3xl p-5 sm:p-6 space-y-4"
      style={{
        background: "var(--surface-1, #0c0d14)",
        border: "1px solid var(--border-subtle, rgba(255,255,255,0.08))",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-violet-400" />
          <div>
            <h2 className="text-base font-semibold text-white">
              Audición Rápida de Voces Bilingües (Streaming + TTFA)
            </h2>
            <p className="text-xs text-white/60">
              Compara naturalidad EN/ES y tiempo real hasta el primer audio (TTFA).
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PHRASE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setText(p.text)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una frase en inglés, español o Spanglish..."
          className="md:col-span-2 w-full rounded-xl px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 text-white outline-none focus:border-violet-500"
        />
        <input
          type="password"
          value={customApiKey}
          onChange={(e) => setCustomApiKey(e.target.value)}
          placeholder="API Key opcional (ElevenLabs / OpenAI)"
          className="w-full rounded-xl px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 text-white outline-none focus:border-violet-500"
        />
      </div>

      {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {LAB_BILINGUAL_VOICES.map((voice) => {
          const isPlaying = activeId === voice.id;
          const isLoading = loadingId === voice.id;
          const ttfa = latencies[voice.id];
          return (
            <div
              key={voice.id}
              className="rounded-2xl p-4 flex flex-col justify-between gap-3 bg-white/[0.03] border border-white/[0.07]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{voice.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">
                    {voice.badge}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{voice.description}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => void auditionVoice(voice)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-white/90 transition"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isPlaying ? (
                    <Square className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  {isLoading ? "Cargando" : isPlaying ? "Parar" : "Probar"}
                </button>
                {typeof ttfa === "number" && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                    <Zap className="w-3 h-3" />
                    {ttfa} ms
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
