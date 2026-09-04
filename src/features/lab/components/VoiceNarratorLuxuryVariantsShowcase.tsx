import React, { useState, useRef, useEffect } from "react";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export const VoiceNarratorLuxuryVariantsShowcase: React.FC = () => {
  const [activeVoice, setActiveVoice] = useState<"en-US-AriaNeural" | "en-US-ChristopherNeural">("en-US-AriaNeural");
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);
  const [playingConceptId, setPlayingConceptId] = useState<string | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string>("concept-a");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sampleText = "Welcome to CELAEST English. Clear articulation and steady cadence build immediate confidence in technical and executive discussions.";

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlay = (conceptId: string) => {
    if (playingConceptId === conceptId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingConceptId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setPlayingConceptId(conceptId);

    try {
      const rateParam = playbackRate >= 1 ? `+${Math.round((playbackRate - 1) * 100)}%` : `-${Math.round((1 - playbackRate) * 100)}%`;
      const streamUrl = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(sampleText)}&voice=${encodeURIComponent(activeVoice)}&rate=${encodeURIComponent(rateParam)}`;

      const audio = new Audio(streamUrl);
      audio.playbackRate = playbackRate;
      audioRef.current = audio;

      audio.onended = () => setPlayingConceptId(null);
      audio.onerror = () => {
        logger.warn("[TTS Showcase] Stream error, using fallback speech synthesis");
        playFallback(sampleText, activeVoice, () => setPlayingConceptId(null));
      };

      audio.play().catch(() => {
        playFallback(sampleText, activeVoice, () => setPlayingConceptId(null));
      });
    } catch {
      playFallback(sampleText, activeVoice, () => setPlayingConceptId(null));
    }
  };

  const playFallback = (text: string, voiceId: string, onEnd: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackRate;
    utterance.lang = voiceId.includes("GB") ? "en-GB" : voiceId.includes("AU") ? "en-AU" : "en-US";
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
    window.speechSynthesis.speak(utterance);
  };

  const cycleRate = () => {
    setPlaybackRate((prev) => {
      if (prev <= 0.75) return 0.85;
      if (prev <= 0.85) return 1.0;
      if (prev <= 1.0) return 1.2;
      return 0.75;
    });
  };

  const isAria = activeVoice === "en-US-AriaNeural";

  return (
    <div className="w-full flex flex-col space-y-6 rounded-3xl bg-[#04040A] border border-white/[0.07] p-6 lg:p-9 text-white shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden select-none">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-5">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.22em] text-white/40 uppercase">
              UI/UX Architectural Exploration
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10.5px] font-mono text-[#C4B5FD]">
              Voice & Narrator Control Standards
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-sans font-light tracking-tight text-[#F8F8F8]">
            6 Variantes Ultra-Luxury para el Selector de Mentor y Narrador
          </h3>
          <p className="text-xs text-[#8A8A9E] font-light">
            Explora y compara 6 enfoques de diseño e interacción para integrar la selección de mentor (Aria / Christopher), reproducción con audio real y control de velocidad.
          </p>
        </div>

        {/* Global Quick State Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/60 bg-white/[0.02] border border-white/[0.06] px-3.5 py-1.5 rounded-full self-start sm:self-auto shrink-0">
          <span>Voz Activa:</span>
          <span className="text-[#C4B5FD] font-medium">{isAria ? "Aria ♀" : "Christopher ♂"}</span>
          <span className="text-white/20">|</span>
          <span>{playbackRate}x</span>
        </div>
      </div>

      {/* CONCEPT GRID (6 CONCEPTS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* =========================================================================
            CONCEPT A: Apple Dynamic Capsule (Morphing Island)
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-a")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-a"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept A</span>
              <span className="text-[10px] font-mono text-white/40">Apple Dynamic Island</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Capsule Island Morfeable</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Cápsula obsidiana de una sola pieza con micro-separadores y halo especular.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              {/* Mentor Switcher with Avatar Silhouette */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                title="Cambiar mentor"
              >
                <span className="w-2 h-2 rounded-full bg-[#C4B5FD] animate-pulse" />
                <span className="font-medium text-[11.5px] text-[#C4B5FD]">{isAria ? "Aria" : "Christopher"}</span>
              </button>

              <span className="w-[1px] h-3 bg-white/15 mx-0.5" />

              {/* Play / Pause with Equalizer Wave */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay("concept-a");
                }}
                className="inline-flex items-center gap-1.5 text-xs font-sans text-[#F8F8F8] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none active:scale-95"
              >
                {playingConceptId === "concept-a" ? (
                  <div className="flex items-center gap-[2px] h-3 shrink-0">
                    <span className="w-[2px] h-2 bg-[#C4B5FD] rounded-full animate-[pulse_0.6s_infinite]" />
                    <span className="w-[2px] h-3 bg-[#C4B5FD] rounded-full animate-[pulse_0.8s_0.2s_infinite]" />
                    <span className="w-[2px] h-1.5 bg-[#C4B5FD] rounded-full animate-[pulse_0.7s_0.1s_infinite]" />
                  </div>
                ) : (
                  <svg className="w-3 h-3 fill-current text-[#A27FF3]" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                <span className="text-[11.5px] font-medium">{playingConceptId === "concept-a" ? "Pause" : "Listen"}</span>
              </button>

              <span className="w-[1px] h-3 bg-white/15 mx-0.5" />

              {/* Speed Chip */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cycleRate();
                }}
                className="text-[10px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
              >
                {playbackRate}x
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONCEPT B: Linear / Cosmos Naked Typography (Zero Container)
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-b")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-b"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept B</span>
              <span className="text-[10px] font-mono text-white/40">Linear Editorial</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Tipografía Pura & Sin Cajas</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Cero cajas ni bordes pesados. Jerarquía pura con puntos separadores y micro-enlaces.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="inline-flex items-center gap-2 select-none leading-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                }}
                className="inline-flex items-center gap-1 text-[11.5px] font-sans text-[#8A8A9E] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none group"
              >
                <span className="text-white/30 group-hover:text-white/50">Voice:</span>
                <span className="text-[#C4B5FD] group-hover:text-white font-medium underline decoration-white/20 underline-offset-2">
                  {isAria ? "Aria" : "Christopher"}
                </span>
              </button>

              <span className="text-white/20 text-xs font-light">·</span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay("concept-b");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#A27FF3] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
              >
                {playingConceptId === "concept-b" ? (
                  <div className="flex items-center gap-[2px] h-3">
                    <span className="w-[2px] h-2 bg-[#C4B5FD] rounded-full animate-[pulse_0.6s_infinite]" />
                    <span className="w-[2px] h-3 bg-[#C4B5FD] rounded-full animate-[pulse_0.8s_0.2s_infinite]" />
                  </div>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
                <span className={`text-[11.5px] font-sans ${playingConceptId === "concept-b" ? "text-[#C4B5FD] font-semibold" : "font-medium"}`}>
                  {playingConceptId === "concept-b" ? "Pause" : "Listen"}
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cycleRate();
                }}
                className="text-[10px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none ml-1"
              >
                ({playbackRate}x)
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONCEPT C: Teenage Engineering Hi-Fi Tactile Switch
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-c")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-c"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept C</span>
              <span className="text-[10px] font-mono text-white/40">Teenage Engineering</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Conmutador Hardware Hi-Fi</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Selector físico conmutador estilo sintetizador de audio de alta gama con grabado metálico.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="inline-flex items-center gap-2 bg-[#09090E] border border-white/[0.1] rounded-lg p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
              {/* Dual Switch Tabs */}
              <div className="flex items-center bg-black/60 rounded-md p-0.5 border border-white/[0.04]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVoice("en-US-AriaNeural");
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                    isAria ? "bg-white/[0.12] text-white font-semibold shadow-sm" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  ARIA
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVoice("en-US-ChristopherNeural");
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                    !isAria ? "bg-white/[0.12] text-white font-semibold shadow-sm" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  CHRIS
                </button>
              </div>

              {/* Hardware Play Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay("concept-c");
                }}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                  playingConceptId === "concept-c"
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    : "bg-[#A27FF3]/20 border-[#A27FF3]/40 text-[#C4B5FD] hover:bg-[#A27FF3]/30"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${playingConceptId === "concept-c" ? "bg-rose-400 animate-ping" : "bg-[#C4B5FD]"}`} />
                <span>{playingConceptId === "concept-c" ? "STOP" : "PLAY"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONCEPT D: Cosmic Duo Badges (Side-by-Side Instant Switch)
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-d")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-d"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept D</span>
              <span className="text-[10px] font-mono text-white/40">Cosmic Duo Badges</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Dúo de Mentores en 1 Clic</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Muestra a ambos mentores en simultáneo para cambiar de voz instantáneamente sin desplegables.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="inline-flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVoice("en-US-AriaNeural");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer flex items-center gap-1 ${
                    isAria ? "bg-[#A27FF3]/25 text-[#C4B5FD] font-semibold shadow-sm" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <span>Aria</span>
                  <span className="text-[9px] opacity-70">♀</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVoice("en-US-ChristopherNeural");
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-sans transition-all cursor-pointer flex items-center gap-1 ${
                    !isAria ? "bg-[#38BDF8]/25 text-[#7DD3FC] font-semibold shadow-sm" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <span>Chris</span>
                  <span className="text-[9px] opacity-70">♂</span>
                </button>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTogglePlay("concept-d");
                }}
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
                title="Reproducir narración"
              >
                {playingConceptId === "concept-d" ? (
                  <span className="w-2 h-2 bg-rose-400 rounded-sm" />
                ) : (
                  <svg className="w-3 h-3 fill-current text-[#C4B5FD] ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONCEPT E: Stripe Contextual Breadcrumb (Seamless Header Integration)
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-e")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-e"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept E</span>
              <span className="text-[10px] font-mono text-white/40">Stripe Contextual</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Integración en Breadcrumb</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Totalmente integrado en la línea de metadatos del artículo como un atributo natural.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="w-full flex items-center justify-between text-[10.5px] font-mono tracking-wider">
              <span className="text-white/40">8 MIN READ</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                  }}
                  className="text-[#C4B5FD] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none font-medium flex items-center gap-1"
                >
                  <span>NARRATOR:</span>
                  <span className="underline decoration-white/20 underline-offset-2">{isAria ? "ARIA ♀" : "CHRIS ♂"}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay("concept-e");
                  }}
                  className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white transition-all cursor-pointer"
                >
                  {playingConceptId === "concept-e" ? "PAUSE" : "LISTEN"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONCEPT F: Floating Glass HUD (Orbital Audio Controller)
           ========================================================================= */}
        <div
          onClick={() => setSelectedConcept("concept-f")}
          className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
            selectedConcept === "concept-f"
              ? "bg-white/[0.035] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C4B5FD] uppercase tracking-wider">Concept F</span>
              <span className="text-[10px] font-mono text-white/40">Floating Glass HUD</span>
            </div>
            <h4 className="text-sm font-sans font-medium text-white mt-1">Controlador Orbital Flotante</h4>
            <p className="text-[11.5px] text-[#8A8A9E] font-light mt-1 leading-relaxed">
              Botón flotante con retroalimentación háptica visual y selector popup flotante con preview.
            </p>
          </div>

          {/* Interactive Component Preview Box */}
          <div className="bg-black/50 border border-white/[0.05] rounded-xl p-4 flex items-center justify-center min-h-[72px]">
            <div className="relative inline-flex items-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0D18]/90 border border-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(dropdownOpen === "f" ? null : "f");
                  }}
                  className="flex items-center gap-1 text-[11px] font-sans text-white/70 hover:text-white cursor-pointer bg-transparent border-0 p-0 outline-none"
                >
                  <span className="text-[#C4B5FD] font-medium">{isAria ? "Aria" : "Christopher"}</span>
                  <svg className="w-2.5 h-2.5 fill-current opacity-50" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>

                <span className="w-[1px] h-2.5 bg-white/10" />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay("concept-f");
                  }}
                  className="text-xs text-[#C4B5FD] hover:text-white font-medium flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 outline-none"
                >
                  {playingConceptId === "concept-f" ? (
                    <span className="text-rose-400">Pause</span>
                  ) : (
                    <span>Play Audio</span>
                  )}
                </button>
              </div>

              {/* Micro Dropdown Popup */}
              {dropdownOpen === "f" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full mb-2 left-0 w-36 bg-[#04040A] border border-white/[0.1] rounded-xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.9)] z-30 animate-[fadeIn_0.15s_ease-out]"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVoice("en-US-AriaNeural");
                      setDropdownOpen(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      isAria ? "bg-white/[0.08] text-[#C4B5FD] font-medium" : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <span>Aria</span>
                    <span className="text-[10px] text-white/40">♀ Warm</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVoice("en-US-ChristopherNeural");
                      setDropdownOpen(null);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                      !isAria ? "bg-white/[0.08] text-[#7DD3FC] font-medium" : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <span>Christopher</span>
                    <span className="text-[10px] text-white/40">♂ Tech Lead</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
