import React, { useState, useRef, useEffect, useCallback } from "react";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface LuxuryVoiceVariant {
  id: string;
  number: string;
  name: string;
  sparkColor: string;
  sparkGlow: string;
  textColor: string;
  description: string;
  spaceEconomy: string;
}

const LUXURY_VARIANTS: LuxuryVoiceVariant[] = [
  {
    id: "variant-golden-spark",
    number: "01",
    name: "Golden Spark Minimalist (Estilo ✦ Feedback)",
    sparkColor: "#F59E0B",
    sparkGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    textColor: "#F59E0B",
    description: "Inspirado 1:1 en el ícono de estrella dorada ✦ Feedback: ultra-compacto para espacios reducidos, tipografía sutil sin cajas ni bordes pesados.",
    spaceEconomy: "Ultra Reducido (16px altura)",
  },
  {
    id: "variant-lavender-spark",
    number: "02",
    name: "Astral Lavender Spark & Morphing Wave",
    sparkColor: "#C4B5FD",
    sparkGlow: "drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]",
    textColor: "#C4B5FD",
    description: "Estrella lavanda de 4 puntas que se transforma suavemente en un ecualizador de 3 barras pulsantes al reproducir el audio.",
    spaceEconomy: "Compacto & Fluido",
  },
  {
    id: "variant-champagne-ray",
    number: "03",
    name: "Champagne Gold Hairline Ray",
    sparkColor: "#E6D5B8",
    sparkGlow: "drop-shadow-[0_0_6px_rgba(230,213,184,0.4)]",
    textColor: "#E6D5B8",
    description: "Línea de rayo horizontal ultrafina de 1px en oro champán ahumado que conecta el mentor con el botón de escucha.",
    spaceEconomy: "Micro-Estructural",
  },
  {
    id: "variant-subtle-dropdown",
    number: "04",
    name: "Subtle Popover Spark Selector",
    sparkColor: "#A27FF3",
    sparkGlow: "drop-shadow-[0_0_8px_rgba(162,127,243,0.5)]",
    textColor: "#A27FF3",
    description: "Al hacer clic en el nombre del mentor, despliega suavemente un micro-menú flotante de cristal sin alterar el flujo visual.",
    spaceEconomy: "Espacio Cero con Despliegue Suave",
  },
  {
    id: "variant-dual-spark",
    number: "05",
    name: "Dual Spark Side-by-Side",
    sparkColor: "#38BDF8",
    sparkGlow: "drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]",
    textColor: "#7DD3FC",
    description: "Muestra a Aria y Christopher como dos micro-estrellas sutiles continuas para alternancia instantánea en 1 clic.",
    spaceEconomy: "Compacto Dual",
  },
  {
    id: "variant-moonlight-pure",
    number: "06",
    name: "Moonlight Titanium Pure Typography",
    sparkColor: "#E2E8F0",
    sparkGlow: "drop-shadow-[0_0_6px_rgba(226,232,240,0.5)]",
    textColor: "#E2E8F0",
    description: "Tipografía en blanco luna con separadores slash '/' y micro-indicador de velocidad.",
    spaceEconomy: "Máxima Legibilidad",
  },
];

export const MasterCleanVoiceNarratorStudioShowcase: React.FC = () => {
  const [activeVoice, setActiveVoice] = useState<"en-US-AriaNeural" | "en-US-ChristopherNeural">("en-US-AriaNeural");
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("variant-golden-spark");
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [testSentence, setTestSentence] = useState<string>(
    "Consistent daily practice with authentic neural mentors builds natural fluency and executive confidence.",
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggleAudio = useCallback(
    (variantId: string) => {
      if (playingId === variantId) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setPlayingId(null);
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setPlayingId(variantId);

      try {
        const rateParam =
          playbackRate >= 1
            ? `+${Math.round((playbackRate - 1) * 100)}%`
            : `-${Math.round((1 - playbackRate) * 100)}%`;
        const streamUrl = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(
          testSentence,
        )}&voice=${encodeURIComponent(activeVoice)}&rate=${encodeURIComponent(rateParam)}`;

        const audio = new Audio(streamUrl);
        audio.playbackRate = playbackRate;
        audioRef.current = audio;

        audio.onended = () => setPlayingId(null);
        audio.onerror = () => {
          logger.warn("[TTS] Stream error, using speech fallback");
          playFallback(testSentence, activeVoice, () => setPlayingId(null));
        };

        audio.play().catch(() => {
          playFallback(testSentence, activeVoice, () => setPlayingId(null));
        });
      } catch {
        playFallback(testSentence, activeVoice, () => setPlayingId(null));
      }
    },
    [playingId, playbackRate, activeVoice, testSentence],
  );

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

  const cyclePlaybackRate = () => {
    setPlaybackRate((prev) => {
      if (prev <= 0.75) return 0.85;
      if (prev <= 0.85) return 1.0;
      if (prev <= 1.0) return 1.2;
      return 0.75;
    });
  };

  const isAria = activeVoice === "en-US-AriaNeural";

  // Four-Point Diamond Star SVG Glyph (Standard Apple SF / Cosmos standard)
  const FourPointStar: React.FC<{ className?: string; color?: string; size?: number }> = ({
    className = "",
    color = "currentColor",
    size = 13,
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );

  return (
    <div className="w-full flex flex-col space-y-7 rounded-3xl bg-[#030208] border border-white/[0.08] p-6 lg:p-10 text-white shadow-[0_32px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden select-none">
      {/* Top Banner & Philosophy HUD */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex flex-col space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#F59E0B] uppercase font-semibold flex items-center gap-1.5">
              <FourPointStar color="#F59E0B" size={10} className="animate-pulse" />
              Ultra-Subtle & Space-Reduced Luxury Studio
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10.5px] font-mono text-white/50">
              Estilo ✦ Feedback & Cero Cajas Pesadas
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-light tracking-tight text-[#F8F8F8]">
            Selector de Mentor & Audio Narrador — Variantes Super Premium
          </h2>
          <p className="text-xs text-[#9E9EBD] font-light leading-relaxed">
            Diseños ultra-sutiles optimizados para espacios reducidos (como la barra superior de lectura o cabeceras). Cero cajas gruesas, cero bordes saturados. Tipografía de alta costura con micro-estrellas luminosas.
          </p>
        </div>

        {/* Global Controls HUD */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white/[0.02] border border-white/[0.06] p-2 rounded-2xl shrink-0 self-start lg:self-auto">
          {/* Active Voice Switcher */}
          <button
            type="button"
            onClick={() => setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural")}
            className="px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 cursor-pointer text-[#F59E0B]"
            title="Alternar mentor activo"
          >
            <FourPointStar color="#F59E0B" size={10} />
            <span>{isAria ? "Aria ♀ (Warm)" : "Christopher ♂ (Lead)"}</span>
          </button>

          {/* Speed Button */}
          <button
            type="button"
            onClick={cyclePlaybackRate}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 cursor-pointer"
            title="Cambiar velocidad"
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      {/* Interactive Sentence Input */}
      <div className="flex flex-col space-y-2 bg-white/[0.015] border border-white/[0.05] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase flex items-center gap-1.5">
            <FourPointStar color="#F59E0B" size={9} />
            Frase de Prueba Activa para Todas las Variantes:
          </span>
          <span className="text-[11px] font-mono text-white/30">Streaming Neural MP3 (&lt;150ms)</span>
        </div>
        <input
          type="text"
          value={testSentence}
          onChange={(e) => setTestSentence(e.target.value)}
          className="w-full bg-black/40 border border-white/[0.08] focus:border-[#F59E0B]/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-white/20 outline-none font-light"
          placeholder="Escribe cualquier texto para probar en las variantes..."
        />
      </div>

      {/* 6 BESPOKE ULTRA-SUBTLE LUXURY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LUXURY_VARIANTS.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          const isPlayingThis = playingId === variant.id;

          return (
            <div
              key={variant.id}
              onClick={() => setSelectedVariantId(variant.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer relative group ${
                isSelected
                  ? "bg-white/[0.03] border-white/[0.18] shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "bg-white/[0.01] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.02]"
              }`}
            >
              {/* Header Meta */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-white/40">
                    VARIANTE {variant.number}
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1"
                    style={{
                      borderColor: `${variant.sparkColor}30`,
                      backgroundColor: `${variant.sparkColor}10`,
                      color: variant.sparkColor,
                    }}
                  >
                    <FourPointStar color={variant.sparkColor} size={8} />
                    <span>{variant.spaceEconomy}</span>
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-sans font-medium text-white tracking-tight">
                  {variant.name}
                </h4>
                <p className="text-xs text-[#8A8A9E] font-light leading-relaxed">
                  {variant.description}
                </p>
              </div>

              {/* LIVE COMPONENT PREVIEW (SUPER SUBTLE, ZERO-BOX) */}
              <div className="bg-black/80 border border-white/[0.04] rounded-2xl p-5 flex items-center justify-center min-h-[80px] relative overflow-visible">
                {/* 01: GOLDEN SPARK MINIMALIST (EXACT STYLE OF ✦ FEEDBACK) */}
                {variant.id === "variant-golden-spark" && (
                  <div className="inline-flex items-center gap-2 select-none leading-none">
                    {/* Mentor Selector with Golden ✦ Star */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-sans transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none group"
                    >
                      <FourPointStar color="#F59E0B" size={12} className="drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] group-hover:rotate-45 transition-transform duration-300" />
                      <span className="font-semibold tracking-wide text-[#F59E0B] group-hover:text-[#FBBF24] transition-colors">
                        {isAria ? "Aria" : "Christopher"}
                      </span>
                    </button>

                    <span className="text-white/20 text-xs select-none">·</span>

                    {/* Listen Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#F59E0B] hover:text-[#FBBF24] transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      {isPlayingThis ? (
                        <div className="flex items-center gap-[2px] h-3">
                          <span className="w-[2px] h-2 bg-[#F59E0B] rounded-full animate-[pulse_0.6s_infinite]" />
                          <span className="w-[2px] h-3 bg-[#F59E0B] rounded-full animate-[pulse_0.8s_0.2s_infinite]" />
                          <span className="w-[2px] h-1.5 bg-[#F59E0B] rounded-full animate-[pulse_0.7s_0.1s_infinite]" />
                        </div>
                      ) : (
                        <svg className="w-3.5 h-3.5 fill-none stroke-[#F59E0B] stroke-2" viewBox="0 0 24 24">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                      <span className="font-medium text-[11.5px]">{isPlayingThis ? "Pause" : "Listen"}</span>
                    </button>

                    {/* Speed Badge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cyclePlaybackRate();
                      }}
                      className="text-[10px] font-mono text-[#F59E0B]/60 hover:text-[#F59E0B] cursor-pointer bg-transparent border-0 p-0 outline-none ml-0.5"
                    >
                      ({playbackRate}x)
                    </button>
                  </div>
                )}

                {/* 02: ASTRAL LAVENDER SPARK & MORPHING WAVE */}
                {variant.id === "variant-lavender-spark" && (
                  <div className="inline-flex items-center gap-2 select-none leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-sans text-[#C4B5FD] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none group"
                    >
                      <FourPointStar color="#C4B5FD" size={11} className="drop-shadow-[0_0_6px_rgba(196,181,253,0.5)] group-hover:scale-125 transition-transform" />
                      <span className="font-medium text-[11.5px]">{isAria ? "Aria ♀" : "Christopher ♂"}</span>
                    </button>

                    <span className="text-white/20 text-xs">·</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#A27FF3] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      <span className={`text-[11.5px] font-sans ${isPlayingThis ? "text-[#C4B5FD] font-semibold" : "font-medium text-[#A27FF3]"}`}>
                        {isPlayingThis ? "Pause audio" : "Listen audio"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cyclePlaybackRate();
                      }}
                      className="text-[10px] font-mono text-white/35 hover:text-white cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      {playbackRate}x
                    </button>
                  </div>
                )}

                {/* 03: CHAMPAGNE GOLD HAIRLINE RAY */}
                {variant.id === "variant-champagne-ray" && (
                  <div className="w-full flex items-center justify-between text-xs select-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                      }}
                      className="flex items-center gap-1.5 text-[#E6D5B8] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      <FourPointStar color="#E6D5B8" size={11} className="drop-shadow-[0_0_6px_rgba(230,213,184,0.4)]" />
                      <span className="font-serif italic text-sm">{isAria ? "Aria" : "Christopher"}</span>
                    </button>

                    <div className="flex-1 mx-3 h-px bg-gradient-to-r from-[#E6D5B8]/40 via-white/10 to-[#E6D5B8]/40" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="font-mono text-[11px] text-[#E6D5B8] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none uppercase font-semibold"
                    >
                      {isPlayingThis ? "PAUSE" : "LISTEN"}
                    </button>
                  </div>
                )}

                {/* 04: SUBTLE POPOVER SPARK SELECTOR */}
                {variant.id === "variant-subtle-dropdown" && (
                  <div className="relative inline-flex items-center gap-2 select-none leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePopover(activePopover === "popover-4" ? null : "popover-4");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-[#A27FF3] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      <FourPointStar color="#A27FF3" size={11} className="drop-shadow-[0_0_8px_rgba(162,127,243,0.5)]" />
                      <span className="font-medium text-[11.5px] text-[#C4B5FD]">{isAria ? "Aria" : "Christopher"}</span>
                      <svg className="w-2.5 h-2.5 fill-current opacity-60" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>

                    <span className="text-white/20 text-xs">·</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="text-xs text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none font-medium"
                    >
                      {isPlayingThis ? "Pause" : "Listen"}
                    </button>

                    {/* Micro Popover Menu */}
                    {activePopover === "popover-4" && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full mt-2 left-0 w-36 bg-[#04040A] border border-white/[0.1] rounded-xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.9)] z-30 animate-[fadeIn_0.15s_ease-out]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setActiveVoice("en-US-AriaNeural");
                            setActivePopover(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                            isAria ? "bg-white/[0.08] text-[#C4B5FD] font-medium" : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <FourPointStar color="#C4B5FD" size={9} />
                            Aria
                          </span>
                          <span className="text-[9.5px] text-white/40">♀ Warm</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveVoice("en-US-ChristopherNeural");
                            setActivePopover(null);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between cursor-pointer ${
                            !isAria ? "bg-white/[0.08] text-[#7DD3FC] font-medium" : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <FourPointStar color="#7DD3FC" size={9} />
                            Christopher
                          </span>
                          <span className="text-[9.5px] text-white/40">♂ Lead</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 05: DUAL SPARK SIDE-BY-SIDE */}
                {variant.id === "variant-dual-spark" && (
                  <div className="inline-flex items-center gap-2 select-none leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice("en-US-AriaNeural");
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-sans transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none ${
                        isAria ? "text-[#C4B5FD] font-semibold drop-shadow-[0_0_6px_rgba(196,181,253,0.5)]" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <FourPointStar color={isAria ? "#C4B5FD" : "#555"} size={10} />
                      <span>Aria</span>
                    </button>

                    <span className="text-white/15 text-[10px]">|</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice("en-US-ChristopherNeural");
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-sans transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none ${
                        !isAria ? "text-[#7DD3FC] font-semibold drop-shadow-[0_0_6px_rgba(125,211,252,0.5)]" : "text-white/40 hover:text-white"
                      }`}
                    >
                      <FourPointStar color={!isAria ? "#7DD3FC" : "#555"} size={10} />
                      <span>Chris</span>
                    </button>

                    <span className="text-white/20 text-xs ml-1">·</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="text-xs text-white/80 hover:text-white font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      {isPlayingThis ? "Pause" : "Listen"}
                    </button>
                  </div>
                )}

                {/* 06: MOONLIGHT TITANIUM PURE */}
                {variant.id === "variant-moonlight-pure" && (
                  <div className="inline-flex items-center gap-2 text-xs font-mono select-none text-[#E2E8F0] leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveVoice(isAria ? "en-US-ChristopherNeural" : "en-US-AriaNeural");
                      }}
                      className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none flex items-center gap-1.5"
                    >
                      <FourPointStar color="#E2E8F0" size={10} />
                      <span className="tracking-wider">{isAria ? "VOICE: ARIA" : "VOICE: CHRIS"}</span>
                    </button>

                    <span className="text-white/20">/</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio(variant.id);
                      }}
                      className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none font-bold"
                    >
                      {isPlayingThis ? "PAUSE" : "LISTEN"}
                    </button>

                    <span className="text-white/20">/</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cyclePlaybackRate();
                      }}
                      className="text-white/40 hover:text-white cursor-pointer bg-transparent border-0 p-0 outline-none"
                    >
                      {playbackRate}X
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-white/[0.04] text-[10.5px] font-mono text-white/30 flex items-center justify-between">
                <span>Espacio:</span>
                <span className="text-white/50">{variant.spaceEconomy}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
