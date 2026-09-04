import React, { useState, useEffect, useRef } from "react";
import { X, Volume2 } from "lucide-react";

interface SilenceShieldLuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
}

export const SilenceShieldLuxuryModal: React.FC<SilenceShieldLuxuryModalProps> = ({
  isOpen,
  onClose,
  onResume,
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(15);
  const animFrameRef = useRef<number | null>(null);

  // Quick mic test or natural simulation
  const handleTestVoice = async () => {
    setIsVoiceActive(true);
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((acc, val) => acc + val, 0);
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round(avg * 1.8)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      } else {
        // Smooth simulation
        let count = 0;
        const interval = setInterval(() => {
          count++;
          setAudioLevel(Math.floor(Math.random() * 45) + 40);
          if (count > 12) {
            clearInterval(interval);
            setIsVoiceActive(false);
            setAudioLevel(20);
          }
        }, 200);
      }
    } catch {
      setIsVoiceActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-3xl animate-[fadeIn_0.2s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none p-7 sm:p-8 flex flex-col space-y-6 text-left animate-[scaleUp_0.25s_ease-out]"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* ── HEADER: BRAND-GRADE EMBLEM + ACCESSIBLE TITLE ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Tier-1 Acoustic Shield Emblem (Continuous Vector Geometry) */}
            <div className="w-11 h-11 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-lg">
              <svg className="w-5 h-5 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.5L4 6.2V11.8C4 16.8 7.4 20.3 12 21.5C16.6 20.3 20 16.8 20 11.8V6.2L12 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 12H15.5M10 9H14M10 15H14"
                  stroke="currentColor"
                  strokeOpacity="0.75"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
                0-TOKEN SHIELD
              </span>
              <h3 className="text-lg sm:text-xl font-light text-white tracking-tight leading-snug">
                Detectamos ruido o silencio
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── HIGH-ACCESSIBILITY REASSURANCE (Clean, direct, zero jargon) ── */}
        <p className="text-sm text-[#C5C6D0] font-light leading-relaxed">
          El micrófono captó estática o pausa prolongada sin voz inteligible. <strong className="text-white font-normal">Tu puntaje está 100% protegido</strong> y no se consumieron créditos.
        </p>

        {/* ── LIVE AUDIO SENSITIVITY STRIP (Direct feedback with zero box-in-box) ── */}
        <div className="py-3 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Volume2 className={`w-4 h-4 ${isVoiceActive ? "text-emerald-400" : "text-[#C4B5FD]"}`} />
            <span className="text-xs text-white/80 font-light">
              {isVoiceActive ? "Voz detectada:" : "Prueba de sonido:"}
            </span>
            <span className="text-[11px] font-mono text-white/40">
              {isVoiceActive ? `${audioLevel}%` : "Listo"}
            </span>
          </div>

          {/* Harmonic frequency bars */}
          <div
            onClick={handleTestVoice}
            className="flex items-center gap-1 h-5 cursor-pointer"
            title="Haz clic para probar tu voz"
          >
            {[15, 35, 75, 95, 60, 85, 40, 20].map((baseH, idx) => {
              const activeH = isVoiceActive ? Math.max(12, (baseH * audioLevel) / 100) : 8;
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isVoiceActive ? "bg-gradient-to-t from-[#7048E8] to-[#C4B5FD]" : "bg-white/15"
                  }`}
                  style={{ height: `${activeH * 0.18 + 4}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* ── SINGLE ACTION FOOTER (Completely clear & fast) ── */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            0% Penalización
          </span>

          <button
            onClick={onResume}
            className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
          >
            Continuar Entrevista →
          </button>
        </div>
      </div>
    </div>
  );
};

