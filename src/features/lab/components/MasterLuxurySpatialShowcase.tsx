import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

type LuxuryTab = "all" | "prosody" | "restructure" | "phonemes" | "stability";

/**
 * Section 13: Master Luxury Spatial Suite (Section 7 Exact Standard).
 * Apple VisionOS & Linear Standard • 100% Code-Driven • Zero Box Clutter • Breathable Typography.
 */
export const MasterLuxurySpatialShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LuxuryTab>("all");

  // =========================================================================
  // CARD 1: EXECUTIVE SPEECH PROSODY & NUCLEAR STRESS SCOPE
  // =========================================================================
  const [activeStressSyllable, setActiveStressSyllable] = useState<"prioritize" | "resilience">("resilience");
  const [isProsodyPlaying, setIsProsodyPlaying] = useState(false);
  const [tilt1, setTilt1] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const card1Ref = useRef<HTMLDivElement>(null);

  const handleMouseMove1 = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!card1Ref.current) return;
    const rect = card1Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt1({
      x: ((x - centerX) / centerX) * 5,
      y: ((y - centerY) / centerY) * -5,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.12,
    });
  }, []);

  const handleMouseLeave1 = useCallback(() => {
    setTilt1({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  // =========================================================================
  // CARD 2: FLUID SEMANTIC PARAGRAPH RESTRUCTURING CANVAS
  // =========================================================================
  const [restructureMode, setRestructureMode] = useState<"decisive" | "diplomatic" | "roi">("decisive");
  const restructureModes = {
    decisive: {
      tag: "C2 Decisive Action",
      sentence: "We will consolidate distributed database clusters into an event-sourced ledger, enforcing zero-loss invariants under high concurrency.",
      gain: "+44% Brevity",
      authority: "99% Executive Authority",
      rule: "Replaces passive hedging with decisive active verbs (consolidate, enforce).",
    },
    diplomatic: {
      tag: "Diplomatic Risk Framing",
      sentence: "While the initial migration incurs transitional overhead, establishing distributed caching mitigates cascading latency outages in Q4.",
      gain: "+36% Brevity",
      authority: "96% Consensus Driver",
      rule: "Employs concessive framing ('While the initial migration') to lead stakeholder consensus.",
    },
    roi: {
      tag: "Boardroom ROI & Velocity",
      sentence: "Automating zero-downtime deployment pipelines captures an immediate 28% infrastructure savings while preserving engineering velocity.",
      gain: "+48% Brevity",
      authority: "98% Boardroom ROI",
      rule: "Directly quantifies business metrics (28% savings) before technical implementation details.",
    },
  };

  // =========================================================================
  // CARD 3: TACTILE ORTHOGRAPHIC PHONEME SYNTHESIZER
  // =========================================================================
  const [activePhonemeIndex, setActivePhonemeIndex] = useState<number>(1);
  const [isPhonemeAudioPlaying, setIsPhonemeAudioPlaying] = useState(false);
  const phonemes = [
    { block: "re-", ipa: "/rɪ/", desc: "Relaxed alveolar approximant [ɹ] with unrounded near-close front vowel [ɪ]." },
    { block: "-zil-", ipa: "/ˈzɪl/", desc: "Voiced alveolar fricative [z] with primary stress peak and velarized lateral [l]." },
    { block: "-ience", ipa: "/jəns/", desc: "Palatal glide [j] with reduced neutral schwa [ə] and voiceless sibilant coda [s]." },
  ];

  // =========================================================================
  // CARD 4: SPACED REPETITION SYNAPTIC STABILITY HORIZON
  // =========================================================================
  const [selectedHorizonDay, setSelectedHorizonDay] = useState<number>(4);
  const horizonPoints = [
    { day: 1, ret: 100, label: "Day 1 (Initial Consolidation)" },
    { day: 4, ret: 92, label: "Day 4 (Synaptic Reinforcement)" },
    { day: 16, ret: 88, label: "Day 16 (Permanent Neural Trace)" },
    { day: 30, ret: 84, label: "Day 30 (Mastered Retentive Recall)" },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Tabs (Monochromatic & Clean) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Masterworks (4)" },
            { id: "prosody", label: "Speech Prosody Scope" },
            { id: "restructure", label: "Semantic Restructuring" },
            { id: "phonemes", label: "Phoneme Synthesizer" },
            { id: "stability", label: "Synaptic Stability Horizon" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as LuxuryTab)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-white/40 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#A27FF3]" />
          Minimalist Luxury Standard
        </span>
      </div>

      {/* Grid of 4 Masterworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            CARD 1: EXECUTIVE SPEECH PROSODY & NUCLEAR STRESS SCOPE
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "prosody") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. Executive Speech Prosody Scope
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click Syllables to Shift Energy
              </span>
            </div>

            <div
              ref={card1Ref}
              onMouseMove={handleMouseMove1}
              onMouseLeave={handleMouseLeave1}
              className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden [perspective:1400px] select-none"
              style={{
                transform: `rotateY(${tilt1.x}deg) rotateX(${tilt1.y}deg)`,
                transition: "transform 0.4s ease-out",
              }}
            >
              {/* Dynamic Specular Sheen */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(450px circle at ${tilt1.glareX}% ${tilt1.glareY}%, rgba(255,255,255,${tilt1.glareOpacity}), transparent 70%)`,
                }}
              />
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Prosody Physics • 48kHz</span>
                <span className="text-white/60">Pitch Contour F0: 185 Hz</span>
              </div>

              {/* Spoken Leadership Sentence with Interactive Stress Accents */}
              <div className="my-auto space-y-6 py-2">
                <div className="space-y-1">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Spoken Leadership Cadence
                  </span>
                  <p className="text-xl sm:text-2xl font-normal text-white/90 leading-relaxed pl-3 border-l border-[#A27FF3]/60">
                    "We must{" "}
                    <button
                      type="button"
                      onClick={() => setActiveStressSyllable("prioritize")}
                      className={`font-semibold cursor-pointer transition-all px-1 rounded ${
                        activeStressSyllable === "prioritize"
                          ? "text-[#A27FF3] bg-[#A27FF3]/15 underline underline-offset-4 decoration-[#A27FF3]"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      prioritize
                    </button>{" "}
                    architectural{" "}
                    <button
                      type="button"
                      onClick={() => setActiveStressSyllable("resilience")}
                      className={`font-semibold cursor-pointer transition-all px-1 rounded ${
                        activeStressSyllable === "resilience"
                          ? "text-[#34D399] bg-[#34D399]/15 underline underline-offset-4 decoration-[#34D399]"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      resilience
                    </button>
                    ."
                  </p>
                </div>

                {/* Laser Trajectory Energy Waveform */}
                <div className="relative h-16 w-full flex items-center justify-between gap-1">
                  {[20, 35, 60, 85, 45, 95, 70, 30, 80, 100, 60, 40, 75, 90, 50, 65, 35, 70, 85, 40, 55, 30].map(
                    (h, idx) => {
                      const isHighEnergy =
                        activeStressSyllable === "prioritize" ? idx >= 4 && idx <= 8 : idx >= 12 && idx <= 18;
                      return (
                        <div
                          key={idx}
                          className="w-full rounded-full transition-all duration-300"
                          style={{
                            height: isHighEnergy ? `${h}%` : `${h * 0.35}%`,
                            backgroundColor: isHighEnergy ? (activeStressSyllable === "prioritize" ? "#A27FF3" : "#34D399") : "rgba(255, 255, 255, 0.12)",
                            opacity: isHighEnergy ? 1 : 0.4,
                          }}
                        />
                      );
                    },
                  )}
                </div>

                {/* Telemetry Bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.04]">
                  <span>Pacing: <strong className="text-white">142 WPM</strong></span>
                  <span>Intonation Accent: <strong className="text-[#34D399]">Nuclear Peak</strong></span>
                  <span>Clarity: <strong className="text-white">99.1%</strong></span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsProsodyPlaying(true);
                    setTimeout(() => setIsProsodyPlaying(false), 1000);
                  }}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isProsodyPlaying ? "animate-pulse text-[#34D399]" : ""}`} />
                  {isProsodyPlaying ? "Synthesizing Vocal Accent..." : "Play Stress Inflection"}
                </button>
                <span className="text-[11px] font-mono text-white/30">Stress on Syllable 2</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CARD 2: FLUID SEMANTIC PARAGRAPH RESTRUCTURING CANVAS
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "restructure") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Semantic Paragraph Restructuring
              </span>
              <span className="text-[11px] font-mono text-white/30">
                C2 Executive Polish
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Executive Discourse Refactor</span>
                <span className="text-white font-semibold">{restructureModes[restructureMode].gain}</span>
              </div>

              {/* 3 Executive Mode Switchers */}
              <div className="my-auto space-y-5 py-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {(["decisive", "diplomatic", "roi"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRestructureMode(m)}
                      className={`py-1.5 rounded-xl text-center text-[10px] font-mono uppercase tracking-wider transition-all ${
                        restructureMode === m
                          ? "bg-white text-black font-semibold shadow-[0_0_16px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Restructured Paragraph */}
                <div className="space-y-1 pl-3 border-l border-[#34D399]/60">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#34D399]">
                    {restructureModes[restructureMode].tag}
                  </span>
                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    "{restructureModes[restructureMode].sentence}"
                  </p>
                </div>

                {/* Rhetorical Rule Note */}
                <p className="text-xs text-white/60 leading-relaxed pl-3 border-l border-white/15">
                  {restructureModes[restructureMode].rule}
                </p>

                {/* Telemetry */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-center">
                  <div>
                    <span className="text-white/40 block">Authority</span>
                    <span className="text-white font-semibold">99%</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Active Verbs</span>
                    <span className="text-[#34D399] font-semibold">100%</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Filler Words</span>
                    <span className="text-white font-semibold">0% (Zero)</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" /> Boardroom Calibrated
                </span>
                <span>Tier: Executive C2</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CARD 3: TACTILE ORTHOGRAPHIC PHONEME SYNTHESIZER
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "phonemes") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Tactile Phoneme Synthesizer
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click Blocks to Calibrate
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Phonetic Articulation</span>
                <span className="text-white/60">Target: /rɪˈzɪl.jəns/</span>
              </div>

              {/* 3 Large Tactile Phoneme Blocks */}
              <div className="my-auto space-y-6 py-2">
                <div className="grid grid-cols-3 gap-2">
                  {phonemes.map((p, idx) => (
                    <button
                      key={p.block}
                      type="button"
                      onClick={() => setActivePhonemeIndex(idx)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        activePhonemeIndex === idx
                          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                          : "bg-white/[0.02] border-white/[0.06] text-white/70 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      <span className="block text-lg sm:text-xl font-bold">{p.block}</span>
                      <span className="block text-xs font-mono opacity-60 mt-0.5">{p.ipa}</span>
                    </button>
                  ))}
                </div>

                {/* Articulation Guidance Text */}
                <div className="space-y-1 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Acoustic Articulation Mechanics:
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {phonemes[activePhonemeIndex].desc}
                  </p>
                </div>

                {/* Formant Resonance Metrics */}
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.04]">
                  <span>Syllable: <strong className="text-white">{phonemes[activePhonemeIndex].block}</strong></span>
                  <span>Formant F1/F2: <strong className="text-[#34D399]">98.6% Native</strong></span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsPhonemeAudioPlaying(true);
                    setTimeout(() => setIsPhonemeAudioPlaying(false), 900);
                  }}
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isPhonemeAudioPlaying ? "animate-pulse text-[#34D399]" : ""}`} />
                  {isPhonemeAudioPlaying ? "Playing Syllable Formant..." : `Synthesize ${phonemes[activePhonemeIndex].ipa}`}
                </button>
                <span className="text-[11px] font-mono text-white/30">IPA Aligned</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CARD 4: SPACED REPETITION SYNAPTIC STABILITY HORIZON
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "stability") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Synaptic Stability Horizon
              </span>
              <span className="text-[11px] font-mono text-white/30">
                SuperMemo-2 SM-2
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Memory Retention Curve</span>
                <span className="text-white font-semibold">Stability Index: 2.60x</span>
              </div>

              {/* Mathematical Decay Horizon Graph */}
              <div className="my-auto space-y-4 py-2">
                <div>
                  <span className="text-2xl sm:text-3xl font-light text-white">
                    {horizonPoints.find((p) => p.day === selectedHorizonDay)?.ret || 92}% Retention
                  </span>
                  <span className="text-xs text-white/40 block mt-0.5">
                    {horizonPoints.find((p) => p.day === selectedHorizonDay)?.label}
                  </span>
                </div>

                {/* SVG Mathematical Curve */}
                <div className="relative h-20 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

                    {/* Smooth Spline */}
                    <path
                      d="M 10 10 Q 70 25, 140 40 T 240 52 T 290 56"
                      stroke="#A27FF3"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Day Nodes */}
                    {horizonPoints.map((pt, idx) => {
                      const cx = 10 + idx * 90;
                      const cy = 70 - (pt.ret / 100) * 60;
                      const isSelected = pt.day === selectedHorizonDay;
                      return (
                        <g
                          key={pt.day}
                          className="cursor-pointer"
                          onClick={() => setSelectedHorizonDay(pt.day)}
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSelected ? 5 : 3}
                            fill={isSelected ? "#FFFFFF" : "#A27FF3"}
                          />
                          {isSelected && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={11}
                              stroke="#A27FF3"
                              strokeWidth="1"
                              fill="none"
                              className="animate-ping"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Day Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/[0.04]">
                  {horizonPoints.map((pt) => (
                    <button
                      key={pt.day}
                      type="button"
                      onClick={() => setSelectedHorizonDay(pt.day)}
                      className={`py-1.5 rounded-xl text-center text-[10px] font-mono transition-all ${
                        selectedHorizonDay === pt.day
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      Day {pt.day} ({pt.ret}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Memory Vault Consolidated
                </span>
                <span>Next Recall: In 48h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
