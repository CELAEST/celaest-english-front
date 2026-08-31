import React, { useState } from "react";
import { Card } from "../../../design-system/components/Card/Card";
import {
  Trophy,
  Sparkles,
  Volume2,
  RotateCw,
  Activity,
  Flame,
  CheckCircle2,
  Mic,
  ArrowUpRight,
  Lock,
  Sliders,
  CheckSquare,
  Radio,
  Clock,
  Layers,
} from "lucide-react";

type CardFilter =
  | "all"
  | "surface"
  | "voice"
  | "srs"
  | "enterprise";

/**
 * Lab showcase: Complete Ultra-Premium Card Architecture Studio.
 * Features 14 bespoke industry-leading card archetypes (Linear & Apple Enterprise standard).
 */
export const CardShowcase: React.FC = () => {
  const [filter, setFilter] = useState<CardFilter>("all");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeSegment, setActiveSegment] = useState<"speaking" | "reading" | "writing">("speaking");
  const [activeDecibels, setActiveDecibels] = useState(42);

  return (
    <div className="flex flex-col space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: "all", label: "All 14 Archetypes" },
          { id: "surface", label: "💎 Surface & Prisms (4)" },
          { id: "voice", label: "🎙️ Voice, Audio & DNA (3)" },
          { id: "srs", label: "📊 SRS Mastery & Heatmaps (3)" },
          { id: "enterprise", label: "⚡ Enterprise & Telemetry (4)" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as CardFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap border ${
              filter === tab.id
                ? "bg-[#7048E8] text-white border-[#8B5CF6] shadow-[0_0_20px_rgba(112,72,232,0.45)]"
                : "bg-white/[0.03] text-[#8a8a9e] border-white/[0.06] hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of 14 Archetypes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* =========================================================================
            GROUP A: FOUNDATIONAL & SURFACE (01 to 04)
           ========================================================================= */}

        {/* 01. Default Surface (Canonical) */}
        {(filter === "all" || filter === "surface") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#8a8a9e] tracking-widest mb-2 flex items-center justify-between">
              <span>01. Canonical Glass</span>
              <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
                Default
              </span>
            </span>
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-[#A27FF3]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#8a8a9e] bg-white/[0.04] px-2 py-0.5 rounded-md">
                    1px Top Sheen
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Layered Glass Surface</h3>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Canonical depth surface with multi-layer shadow, faint ambient bloom and 1px top edge sheen.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#6b6c82]">
                <span>Base Primitive</span>
                <span className="font-mono text-white/50">24px blur</span>
              </div>
            </Card>
          </div>
        )}

        {/* 02. Linear Reactive Spotlight Card */}
        {(filter === "all" || filter === "surface") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between font-semibold">
              <span>02. Cursor Spotlight Beam</span>
              <span className="text-[9px] text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                Hover Me
              </span>
            </span>
            <Card
              variant="spotlight"
              interactive
              className="h-full flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#7048E8]/10 border border-[#7048E8]/30 flex items-center justify-center group-hover:bg-[#7048E8]/20 transition-colors">
                    <Sparkles className="h-4 w-4 text-[#A27FF3] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-ping" />
                    Linear Follower
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-1.5">
                  Reactive Spotlight Glow
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8a8a9e] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h3>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Calculates mouse coordinates in real-time to cast a dynamic radial specular beam across the glass.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Mousemove tracking</span>
                <span className="font-mono text-[#A27FF3]">400px circle</span>
              </div>
            </Card>
          </div>
        )}

        {/* 03. Accent Hairline Card */}
        {(filter === "all" || filter === "surface") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between">
              <span>03. Accent Hairline Edge</span>
              <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
                Accent
              </span>
            </span>
            <Card variant="accent" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-[#7048E8]/10 border border-[#7048E8]/20 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-[#A27FF3]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#A27FF3] bg-[#7048E8]/10 px-2 py-0.5 rounded-md">
                    Gradient Rim
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Violet Hairline Edge</h3>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Gradient hairline border for active states, highlighted focus cards, and recommended paths.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Active Highlight</span>
                <span className="font-mono text-[#A27FF3]">1px Gradient</span>
              </div>
            </Card>
          </div>
        )}

        {/* 04. Holographic Prism Edge (Apple Vision Pro) */}
        {(filter === "all" || filter === "surface") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#F472B6] tracking-widest mb-2 flex items-center justify-between">
              <span>04. Holographic Prism</span>
              <span className="text-[9px] text-[#F472B6] bg-[#F472B6]/10 px-1.5 py-0.5 rounded">
                Prismatic
              </span>
            </span>
            <Card variant="holographic" interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A27FF3]/20 via-[#38BDF8]/20 to-[#F472B6]/20 border border-white/[0.1] flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-[#F472B6]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-md">
                    Multi-Hue Rim
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">Prismatic Iridescent Rim</h3>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Subtle shifting violet-cyan-pink chromatic hairline border with deep midnight crystalline substrate.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>VisionOS Sheen</span>
                <span className="font-mono text-[#F472B6]">1px Prismatic</span>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            GROUP B: VOICE, AUDIO & DNA (05 to 07)
           ========================================================================= */}

        {/* 05. Live Voice Pulse Card (CELAEST Audio Mentor) */}
        {(filter === "all" || filter === "voice") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-widest mb-2 flex items-center justify-between">
              <span>05. Live Audio Waveform</span>
              <span className="text-[9px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">
                Speech AI
              </span>
            </span>
            <Card variant="accent" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center">
                      <Mic className="h-4 w-4 text-[#38BDF8]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">AI Voice Formant</span>
                      <span className="text-[10px] text-[#8a8a9e]">Active 48kHz Stream</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white transition-colors"
                    aria-label="Toggle waveform simulation"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "text-[#34D399]" : "text-[#8a8a9e]"}`} />
                  </button>
                </div>

                {/* Animated Frequency Bars */}
                <div className="h-12 w-full rounded-2xl bg-black/40 border border-white/[0.04] px-3 flex items-center justify-between gap-1 mb-2">
                  {[24, 45, 80, 55, 90, 40, 70, 100, 65, 85, 30, 75, 95, 50, 60, 35, 80, 45].map((height, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-[#7048E8] to-[#38BDF8] transition-all duration-300"
                      style={{
                        height: isPlayingAudio ? `${Math.max(15, (height * (Math.sin(i + Date.now() / 300) + 1.2)) / 2)}%` : `${height * 0.4}%`,
                        opacity: isPlayingAudio ? 0.9 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isPlayingAudio ? "bg-[#34D399] animate-pulse" : "bg-[#8a8a9e]"}`} />
                  {isPlayingAudio ? "Speaking / 142 WPM" : "Click speaker to test"}
                </span>
                <span className="font-mono text-[#38BDF8]">Formant: 98.4%</span>
              </div>
            </Card>
          </div>
        )}

        {/* 06. Acoustic Spectrogram & Decibel HUD */}
        {(filter === "all" || filter === "voice") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-widest mb-2 flex items-center justify-between">
              <span>06. Acoustic Spectrogram</span>
              <span className="text-[9px] text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                Telemetry
              </span>
            </span>
            <Card variant="spotlight" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center">
                      <Radio className="h-4 w-4 text-[#34D399]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Acoustic Gain & dB</span>
                      <span className="text-[10px] text-[#8a8a9e]">Intonation Pitch Analyzer</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-md">
                    -{activeDecibels} dB
                  </span>
                </div>

                {/* 3-Band Frequency Channel Meter */}
                <div className="space-y-2 my-2">
                  {[
                    { band: "Low Frequencies (Bass)", val: 65, color: "from-[#7048E8] to-[#8B5CF6]" },
                    { band: "Formant Consonants (Mid)", val: 88, color: "from-[#38BDF8] to-[#34D399]" },
                    { band: "Vocal Clarity (High)", val: 92, color: "from-[#F59E0B] to-[#F472B6]" },
                  ].map((ch) => (
                    <div key={ch.band} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#8a8a9e]">
                        <span>{ch.band}</span>
                        <span className="font-mono text-white/70">{ch.val}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${ch.color}`} style={{ width: `${ch.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <button
                  type="button"
                  onClick={() => setActiveDecibels((prev) => (prev === 42 ? 28 : 42))}
                  className="hover:text-white transition-colors"
                >
                  Calibrate gain
                </button>
                <span className="font-mono text-white/50">48kHz / 24-bit</span>
              </div>
            </Card>
          </div>
        )}

        {/* 07. Linguistic DNA Synapse Map */}
        {(filter === "all" || filter === "voice") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#C4B5FD] tracking-widest mb-2 flex items-center justify-between">
              <span>07. Linguistic DNA Map</span>
              <span className="text-[9px] text-[#C4B5FD] bg-[#C4B5FD]/10 px-1.5 py-0.5 rounded">
                Synapse
              </span>
            </span>
            <Card variant="mesh" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#7048E8]/20 border border-[#7048E8]/30 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-[#C4B5FD]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Neural Synapse Node</span>
                      <span className="text-[10px] text-[#8a8a9e]">Personalized Linguistic Vector</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-full border border-[#34D399]/20">
                    94.8% Synced
                  </span>
                </div>

                {/* Bespoke DNA Double Helix SVG */}
                <div className="py-2 flex items-center justify-center">
                  <svg className="w-full h-10" viewBox="0 0 240 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0 20C30 5 60 35 90 20C120 5 150 35 180 20C210 5 240 35 270 20"
                      stroke="#7048E8"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d="M0 20C30 35 60 5 90 20C120 35 150 5 180 20C210 35 240 5 270 20"
                      stroke="#38BDF8"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    {[30, 60, 90, 120, 150, 180, 210].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={i % 2 === 0 ? 12 : 28}
                        r="3"
                        fill={i % 2 === 0 ? "#C4B5FD" : "#38BDF8"}
                        className="animate-pulse"
                      />
                    ))}
                  </svg>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>2,410 Active Synapses</span>
                <span className="font-mono text-[#A27FF3]">B2 $\rightarrow$ C1</span>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            GROUP C: SRS MASTERY & REPETITION (08 to 10)
           ========================================================================= */}

        {/* 08. Interactive 3D Perspective Flip Card */}
        {(filter === "all" || filter === "srs") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between font-semibold">
              <span>08. 3D Perspective Flip</span>
              <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
                Click to Flip
              </span>
            </span>
            <div
              className="h-full min-h-[170px] cursor-pointer [perspective:1000px]"
              onClick={() => setIsCardFlipped(!isCardFlipped)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  isCardFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Front Face */}
                <Card
                  variant="spotlight"
                  className="absolute inset-0 w-full h-full flex flex-col justify-between [backface-visibility:hidden]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                        Front: Context
                      </span>
                      <RotateCw className="w-3.5 h-3.5 text-[#8a8a9e]" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">"We needs to deploy immediately."</h4>
                    <p className="text-xs text-[#8a8a9e] mt-1">What is the idiomatic grammatical fix?</p>
                  </div>
                  <span className="text-[11px] text-[#A27FF3] font-medium">Click card to reveal answer →</span>
                </Card>

                {/* Back Face */}
                <Card
                  variant="accent"
                  className="absolute inset-0 w-full h-full flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#120F2E]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                        Back: Master Way
                      </span>
                      <RotateCw className="w-3.5 h-3.5 text-[#8a8a9e]" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#34D399]">"We need to deploy immediately."</h4>
                    <p className="text-xs text-[#8a8a9e] mt-1">Subject-verb agreement: 'We' takes base plural verb.</p>
                  </div>
                  <span className="text-[11px] text-[#34D399] font-medium">✓ Click to flip back</span>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* 09. SRS Retention Mastery Card */}
        {(filter === "all" || filter === "srs") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-widest mb-2 flex items-center justify-between">
              <span>09. SuperMemo-2 Matrix</span>
              <span className="text-[9px] text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                Algorithm
              </span>
            </span>
            <Card variant="mesh" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Vocabulary Synapse</span>
                      <span className="text-[10px] text-[#8a8a9e]">Next review in 4 days</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#7048E8]/20 border border-[#7048E8]/40 text-[#C4B5FD]">
                    C1 Mastered
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3">
                  <div className="p-2.5 rounded-2xl bg-black/30 border border-white/[0.04] text-center">
                    <span className="text-[10px] text-[#8a8a9e] block">Retention</span>
                    <span className="text-sm font-bold text-[#34D399]">96.2%</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-black/30 border border-white/[0.04] text-center">
                    <span className="text-[10px] text-[#8a8a9e] block">Ease Factor</span>
                    <span className="text-sm font-bold text-white">2.60x</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-black/30 border border-white/[0.04] text-center">
                    <span className="text-[10px] text-[#8a8a9e] block">Reps</span>
                    <span className="text-sm font-bold text-[#A27FF3]">8 turns</span>
                  </div>
                </div>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-[#8a8a9e] pt-2 border-t border-white/[0.04]">
                <span className="flex items-center gap-1 text-[#34D399]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Memory Stability
                </span>
                <span className="font-mono text-white/50">SM-2 Algorithm</span>
              </div>
            </Card>
          </div>
        )}

        {/* 10. Mastery Activity Heatmap Matrix (GitHub / Linear Style) */}
        {(filter === "all" || filter === "srs") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#F59E0B] tracking-widest mb-2 flex items-center justify-between">
              <span>10. Activity Heatmap Matrix</span>
              <span className="text-[9px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
                Streak
              </span>
            </span>
            <Card variant="spotlight" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                      <Flame className="h-4 w-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">24-Day Active Streak</span>
                      <span className="text-[10px] text-[#8a8a9e]">Consistent Daily Immersion</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F59E0B]">420 words/wk</span>
                </div>

                {/* 28-Day Mini Heatmap Grid */}
                <div className="grid grid-cols-7 gap-1.5 py-2">
                  {[3, 2, 4, 1, 3, 4, 4, 2, 3, 4, 1, 0, 2, 4, 4, 3, 2, 4, 3, 4, 4, 1, 2, 4, 4, 3, 4, 4].map((lvl, idx) => (
                    <div
                      key={idx}
                      className={`h-4 rounded-md transition-all duration-200 border ${
                        lvl === 4
                          ? "bg-[#7048E8] border-[#8B5CF6] shadow-[0_0_8px_rgba(112,72,232,0.4)]"
                          : lvl === 3
                          ? "bg-[#7048E8]/70 border-[#7048E8]/50"
                          : lvl === 2
                          ? "bg-[#7048E8]/40 border-white/[0.08]"
                          : lvl === 1
                          ? "bg-[#7048E8]/20 border-white/[0.04]"
                          : "bg-white/[0.03] border-white/[0.04]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Last 4 Weeks</span>
                <span className="font-mono text-[#34D399]">100% Goal Met</span>
              </div>
            </Card>
          </div>
        )}

        {/* =========================================================================
            GROUP D: ENTERPRISE, PRODUCTIVITY & TELEMETRY (11 to 14)
           ========================================================================= */}

        {/* 11. Linear Task State & Priority Triage */}
        {(filter === "all" || filter === "enterprise") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-widest mb-2 flex items-center justify-between">
              <span>11. Linear Priority Triage</span>
              <span className="text-[9px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">
                Linear UI
              </span>
            </span>
            <Card variant="default" interactive className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-[#F59E0B]/40" />
                    <span className="text-xs font-mono font-semibold text-white">ENG-342</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    High Priority
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Architectural Trade-Offs Drill</h4>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Practice explaining distributed consensus & CAP theorem during executive meetings.
                </p>

                {/* Subtask Mini Checklist */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <CheckSquare className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Active Idiomatic Phrasing (5/5)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5 text-[#8a8a9e]" />
                    <span>Real-Time Speech Speed Calibration</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Estimated: 8 mins</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] font-mono text-white/70">
                  ⌘↵ Start
                </kbd>
              </div>
            </Card>
          </div>
        )}

        {/* 12. Apple Glass Segmented Control Slider */}
        {(filter === "all" || filter === "enterprise") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between">
              <span>12. Apple Segmented Slider</span>
              <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
                VisionOS
              </span>
            </span>
            <Card variant="spotlight" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#7048E8]/10 border border-[#7048E8]/20 flex items-center justify-center">
                      <Sliders className="h-4 w-4 text-[#A27FF3]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Mode Calibration</span>
                      <span className="text-[10px] text-[#8a8a9e]">Tactile Segmented Pill</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#A27FF3]">Instant Mode</span>
                </div>

                {/* Apple Glass Segmented Toggle Pill */}
                <div className="p-1 rounded-2xl bg-black/50 border border-white/[0.06] grid grid-cols-3 gap-1 my-2">
                  {(["speaking", "reading", "writing"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setActiveSegment(mode)}
                      className={`py-1.5 rounded-xl text-xs font-medium capitalize transition-all duration-200 ${
                        activeSegment === mode
                          ? "bg-white/[0.12] text-white border border-white/[0.15] shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                          : "text-[#8a8a9e] hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Active: <strong className="text-white capitalize">{activeSegment}</strong></span>
                <span className="font-mono text-white/50">Haptic Feedback</span>
              </div>
            </Card>
          </div>
        )}

        {/* 13. Cryptographic AES-256 Vault Token */}
        {(filter === "all" || filter === "enterprise") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-widest mb-2 flex items-center justify-between">
              <span>13. AES-256 Memory Vault</span>
              <span className="text-[9px] text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                Zero-Trust
              </span>
            </span>
            <Card variant="velvet-inset" className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-[#34D399]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white block">Encrypted Personal Vault</span>
                      <span className="text-[10px] text-[#8a8a9e]">Client-Side AES-GCM 256-bit</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-md">
                    Locked
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-black/60 border border-white/[0.04] font-mono text-[10px] text-white/70 space-y-1 my-2">
                  <div className="flex items-center justify-between text-[#8a8a9e]">
                    <span>SHA-256 Hash:</span>
                    <span className="text-[#34D399]">Verified</span>
                  </div>
                  <p className="truncate text-[#C4B5FD]">0x8f2a91e4b830d1c79401ab38e12</p>
                </div>
              </div>

              <div className="mt-1 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
                <span>Zero-Trust Storage</span>
                <span className="font-mono text-[#34D399]">100% Private</span>
              </div>
            </Card>
          </div>
        )}

        {/* 14. Raycast Bento Telemetry & Keys */}
        {(filter === "all" || filter === "enterprise") && (
          <div className="flex flex-col">
            <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between">
              <span>14. Bento Telemetry HUD</span>
              <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
                Raycast
              </span>
            </span>
            <Card
              variant="default"
              interactive
              className="h-full flex flex-col justify-between"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#34D399]" />
                    <span className="text-xs font-semibold text-white">Live System Mesh</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] text-[#34D399] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    0 ms cache
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Interactive Telemetry HUD</h4>
                <p className="text-xs text-[#8a8a9e] leading-relaxed">
                  Clean monospace shortcuts, tactile micro-badges, and zero-latency status indicators.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] text-[#8a8a9e]">
                  {bookmarked ? "★ Starred in Deck" : "Click to star card"}
                </span>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-[10px] font-mono text-white/70">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.12] text-[10px] font-mono text-white/70">
                    K
                  </kbd>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
