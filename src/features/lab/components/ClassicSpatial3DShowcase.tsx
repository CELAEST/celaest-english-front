import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Bookmark,
  RotateCw,
  Sparkles,
  Mic,
  Activity,
} from "lucide-react";

/**
 * Section 8: Classic Spatial 3D Master Cards Suite.
 * Preserves the full 3D tilt Speaking Flashcard with $180^\circ$ flip and the 28-bar Acoustic Spectrum.
 */
export const ClassicSpatial3DShowcase: React.FC = () => {
  // Card 1 State
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<"0.8x" | "1.0x" | "1.2x">("1.0x");
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setCardTilt({
      x: ((x - centerX) / centerX) * 6,
      y: ((y - centerY) / centerY) * -6,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.15,
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setCardTilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  // Card 2 State
  const [isRecording, setIsRecording] = useState(false);
  const [activePitch, setActivePitch] = useState<"standard" | "slow">("standard");

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8a8a9e]">
          Classic 3D spatial interactive deck: Physical perspective tilt, real-time specular glare, 180° flip animation, and 28-band speech formant spectrum.
        </p>
        <span className="text-[10px] font-mono text-[#C4B5FD] bg-[#7048E8]/10 border border-[#7048E8]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#C4B5FD]" />
          Classic 3D Spatial Deck
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* CARD 1: 3D SPEAKING FLASHCARD */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase text-[#C4B5FD] tracking-wider font-medium">
              01. 3D Spatial Speaking Flashcard
            </span>
            <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded-full">
              Click or Space to Flip
            </span>
          </div>

          <div
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="w-full min-h-[440px] [perspective:1400px] cursor-pointer select-none"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative w-full h-full min-h-[440px] rounded-3xl transition-transform duration-500 ease-out [transform-style:preserve-3d]"
              style={{
                transform: `rotateY(${cardTilt.x + (isFlipped ? 180 : 0)}deg) rotateX(${cardTilt.y}deg)`,
              }}
            >
              {/* Dynamic Glare Specular Sheen */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(450px circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,${cardTilt.glareOpacity}), transparent 70%)`,
                }}
              />

              {/* FRONT FACE */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-7 sm:p-8 bg-[#060512] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(112,72,232,0.08)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#A27FF3]/60 to-transparent" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#7048E8]/15 border border-[#7048E8]/30 text-[#C4B5FD]">
                      Speaking • Modal Verbs
                    </span>
                    <span className="text-[11px] font-mono text-[#8a8a9e]">Card 4 of 12</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAudioSpeed((s) => (s === "0.8x" ? "1.0x" : s === "1.0x" ? "1.2x" : "0.8x"));
                      }}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8a8a9e] hover:text-white transition-colors"
                    >
                      {audioSpeed}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                      }}
                      className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8a8a9e] hover:text-[#F59E0B] transition-colors"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-[#F59E0B] text-[#F59E0B]" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="my-auto space-y-6 py-2">
                  <div className="space-y-1.5">
                    <span className="block text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[#F87171]">
                      YOU SAID (Hesitation Detected)
                    </span>
                    <p className="text-xl sm:text-2xl font-medium text-white/80 leading-relaxed pl-4 border-l-2 border-[#F87171]/40">
                      "If we will deploy now, the server <span className="text-[#F87171] underline decoration-[#F87171]/50 underline-offset-4 font-semibold">might crashes</span>."
                    </p>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="block text-[10.5px] font-mono font-semibold uppercase tracking-[0.16em] text-[#34D399]">
                        BETTER WAY (Idiomatic Master)
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingAudio(!isPlayingAudio);
                        }}
                        className={`p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#C4B5FD] hover:text-white hover:bg-[#7048E8]/40 hover:border-[#A27FF3] transition-all cursor-pointer ${
                          isPlayingAudio ? "bg-[#7048E8] text-white border-[#A27FF3] shadow-[0_0_16px_rgba(112,72,232,0.6)]" : ""
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xl sm:text-2xl font-semibold text-white leading-relaxed pl-4 border-l-2 border-[#34D399]/60">
                      "If we deploy now, the server <span className="text-[#34D399] font-bold">might crash</span>."
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-[#8a8a9e]">
                  <span className="flex items-center gap-1.5 text-[#C4B5FD]">
                    <RotateCw className="w-3.5 h-3.5" /> Click card to reveal grammar breakdown
                  </span>
                  <span className="font-mono text-white/40">SuperMemo-2 SRS</span>
                </div>
              </div>

              {/* BACK FACE */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-7 sm:p-8 bg-[#090818] border border-[#7048E8]/40 shadow-[0_32px_80px_rgba(0,0,0,0.95)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#34D399]/60 to-transparent" />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399]">
                    ✓ Grammar Rule & Translation
                  </span>
                  <span className="text-[10px] font-mono text-[#A27FF3] bg-[#7048E8]/15 px-2 py-0.5 rounded">
                    CEFR C1 Mastery
                  </span>
                </div>

                <div className="my-auto space-y-4 py-2">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#8a8a9e]">
                      Specific Syntax Correction
                    </span>
                    <div className="flex items-center gap-3 text-sm font-mono pl-3 border-l-2 border-white/[0.15]">
                      <span className="line-through text-[#F87171]">will deploy / might crashes</span>
                      <span className="text-white/40">→</span>
                      <span className="font-bold text-[#34D399]">deploy / might crash</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#A27FF3]">
                      Traducción al Español
                    </span>
                    <p className="text-base text-white/90 pl-3 border-l-2 border-[#A27FF3]/40">
                      "Si desplegamos ahora, el servidor podría fallar."
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#34D399]">
                      Regla Pedagógica
                    </span>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed pl-3 border-l-2 border-[#34D399]/40">
                      1. En oraciones condicionales tipo 1, la cláusula con <strong>if</strong> utiliza presente simple (<em>if we deploy</em>), nunca futuro con <em>will</em>.<br />
                      2. El verbo modal <strong>might</strong> siempre va seguido del infinitivo sin 'to' (<em>crash</em>).
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8a9e]">
                    <span>Rate Recall Difficulty:</span>
                    <span>Interval Multiplier</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 1, label: "Again", time: "<1 min", color: "hover:border-[#EF4444] text-[#EF4444]" },
                      { id: 2, label: "Hard", time: "12 hrs", color: "hover:border-[#F59E0B] text-[#F59E0B]" },
                      { id: 3, label: "Good", time: "1 day", color: "hover:border-[#A27FF3] text-[#C4B5FD]" },
                      { id: 4, label: "Easy", time: "4 days", color: "hover:border-[#34D399] text-[#34D399]" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGrade(btn.id);
                        }}
                        className={`p-2 rounded-xl bg-white/[0.03] border transition-all text-center ${btn.color} ${
                          selectedGrade === btn.id ? "ring-2 ring-white border-transparent" : "border-white/[0.08]"
                        }`}
                      >
                        <span className="block text-xs font-bold">{btn.label}</span>
                        <span className="block text-[9px] font-mono text-white/50">{btn.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: ACOUSTIC FLUENCY RADAR */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase text-[#38BDF8] tracking-wider font-medium">
              02. Real-Time Acoustic Fluency Radar
            </span>
            <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full">
              48kHz Speech Engine
            </span>
          </div>

          <div className="w-full min-h-[440px] rounded-3xl p-7 sm:p-8 bg-[#060512] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(56,189,248,0.08)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Formant Resonance & Prosody</h3>
                  <span className="text-[10px] text-[#8a8a9e]">Active Neural Speech Diagnostic</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActivePitch((p) => (p === "standard" ? "slow" : "standard"))}
                  className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#8a8a9e] hover:text-white transition-colors"
                >
                  {activePitch === "standard" ? "1.0x Pitch" : "0.75x Slow"}
                </button>
              </div>
            </div>

            <div className="my-auto space-y-5 py-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#8a8a9e] tracking-wider">
                  Target Pronunciation:
                </span>
                <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                  "Our{" "}
                  <span className="text-[#34D399] font-semibold underline decoration-[#34D399]/40 underline-offset-4">
                    architectural
                  </span>{" "}
                  <span className="text-[#34D399] font-semibold underline decoration-[#34D399]/40 underline-offset-4">
                    resilience
                  </span>{" "}
                  guarantees{" "}
                  <span className="text-[#F59E0B] font-semibold underline decoration-[#F59E0B]/40 underline-offset-4">
                    scalability
                  </span>
                  ."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.05] space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8a8a9e]">
                  <span>F1/F2 Formant Resonance:</span>
                  <span className="text-[#34D399] font-bold">98.4% Native Match</span>
                </div>

                <div className="h-16 w-full flex items-end justify-between gap-1 px-1">
                  {[35, 55, 80, 45, 90, 70, 40, 100, 65, 85, 30, 75, 95, 50, 60, 35, 80, 45, 90, 65, 85, 40, 70, 95, 55, 40, 60, 30].map(
                    (height, i) => (
                      <div
                        key={i}
                        className="w-full rounded-full bg-gradient-to-t from-[#7048E8] via-[#38BDF8] to-[#34D399] transition-all duration-200"
                        style={{
                          height: isRecording
                            ? `${Math.max(15, (height * (Math.sin(i + Date.now() / 200) + 1.2)) / 2)}%`
                            : `${height * 0.5}%`,
                          opacity: isRecording ? 0.95 : 0.45,
                        }}
                      />
                    ),
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-center text-[10px] font-mono">
                  <div>
                    <span className="text-[#8a8a9e] block">Pace</span>
                    <span className="text-white font-bold">142 WPM</span>
                  </div>
                  <div>
                    <span className="text-[#8a8a9e] block">Vowel Clarity</span>
                    <span className="text-[#34D399] font-bold">99.1%</span>
                  </div>
                  <div>
                    <span className="text-[#8a8a9e] block">Latency</span>
                    <span className="text-[#38BDF8] font-bold">&lt;18 ms</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold transition-all ${
                  isRecording
                    ? "bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse"
                    : "bg-[#7048E8] hover:bg-[#6038E0] text-white shadow-[0_0_20px_rgba(112,72,232,0.4)]"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                {isRecording ? "Listening... (Click to Stop)" : "Practice Speech (Hold to Talk)"}
              </button>

              <span className="text-[11px] font-mono text-[#8a8a9e]">
                AI Formant Analyzer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
