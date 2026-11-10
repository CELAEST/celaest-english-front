import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight, Volume2, VolumeX, CheckCircle2 } from "lucide-react";
import { UNIVERSAL_PHRASES } from "../../speech/universalPhrases";

interface PathwayCourseIntroModalProps {
  isOpen: boolean;
  userId?: string | undefined;
  onFinish: (triggerTour?: boolean) => void;
}

const INTRO_STEPS = [
  {
    key: "intro_welcome",
    title: "Bienvenido a CELAEST",
    badge: "PASO 1 DE 3 · PRESENTACIÓN",
  },
  {
    key: "intro_philosophy",
    title: "El Método Neurocognitivo",
    badge: "PASO 2 DE 3 · FILOSOFÍA",
  },
  {
    key: "intro_method",
    title: "Tu Dinámica de Clase",
    badge: "PASO 3 DE 3 · ACCIÓN",
  },
];

export const PathwayCourseIntroModal: React.FC<PathwayCourseIntroModalProps> = ({
  isOpen,
  userId = "default",
  onFinish,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stepMeta = INTRO_STEPS[stepIndex] ?? INTRO_STEPS[0];
  const phrase = UNIVERSAL_PHRASES[stepMeta.key];
  const isLast = stepIndex === INTRO_STEPS.length - 1;

  const playCurrentAudio = () => {
    if (!phrase?.audioUrl) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(phrase.audioUrl);
    audioRef.current = audio;
    audio.onplay = () => setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);
    setIsMuted(false);
    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlayingAudio(false));
      }
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // Attempt audio playback when step changes if not muted
  useEffect(() => {
    if (!isOpen || isMuted || !phrase?.audioUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(phrase.audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlayingAudio(true);
    audio.onended = () => setIsPlayingAudio(false);
    audio.onerror = () => setIsPlayingAudio(false);

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setIsPlayingAudio(false);
        });
      }
    } catch {
      setIsPlayingAudio(false);
    }

    return () => {
      audio.pause();
    };
  }, [stepIndex, isOpen, isMuted, phrase]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      handleComplete(false);
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleComplete = (withTour: boolean) => {
    try {
      localStorage.setItem(`lingua_intro_seen_${userId}`, "true");
      localStorage.setItem("lingua_intro_seen_global", "true");
    } catch {
      // safe fallback
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onFinish(withTour);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-[fadeIn_0.25s_ease-out_both] select-none"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-black/90 border border-white/[0.12] p-6 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col gap-5 overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-[#A27FF3]/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#A27FF3]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">
              MENTOR LIAM · INTRODUCCIÓN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isPlayingAudio ? () => { audioRef.current?.pause(); setIsPlayingAudio(false); } : playCurrentAudio}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono text-[#DDD6FE] bg-[#A27FF3]/15 hover:bg-[#A27FF3]/25 border border-[#A27FF3]/35 transition-all cursor-pointer"
              title="Escuchar audio de Liam"
            >
              <Volume2 size={12} className={isPlayingAudio ? "text-[#A27FF3] animate-pulse" : "text-white/60"} />
              <span>{isPlayingAudio ? "Hablando..." : "Escuchar a Liam"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isMuted && audioRef.current) {
                  audioRef.current.pause();
                  setIsPlayingAudio(false);
                }
                setIsMuted((prev) => !prev);
              }}
              className="text-white/40 hover:text-white transition-colors cursor-pointer p-1"
              title={isMuted ? "Activar voz de Liam" : "Silenciar voz"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className={isPlayingAudio ? "text-[#A27FF3]" : ""} />}
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-3 py-1">
          <span className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-white/40">
            {stepMeta.badge}
          </span>

          <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight">
            {stepMeta.title}
          </h2>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[13px] sm:text-sm text-white/85 leading-relaxed font-light">
            {phrase?.text}
          </div>
        </div>

        {/* Segmented Indicator */}
        <div className="flex items-center gap-1.5 py-1">
          {INTRO_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                idx <= stepIndex ? "bg-[#A27FF3]" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#A27FF3] hover:bg-[#8B5CF6] text-white text-xs sm:text-[13px] font-medium shadow-[0_0_20px_rgba(162,127,243,0.35)] transition-all cursor-pointer"
          >
            <span>{isLast ? "Comenzar mi primera clase" : "Continuar"}</span>
            <ArrowRight size={14} />
          </button>

          {isLast && (
            <button
              type="button"
              onClick={() => handleComplete(true)}
              className="text-center text-[11px] text-white/50 hover:text-[#DDD6FE] transition-colors py-1 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={12} className="text-[#A27FF3]" />
              <span>Ver tour guiado por las 6 funciones del software</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
