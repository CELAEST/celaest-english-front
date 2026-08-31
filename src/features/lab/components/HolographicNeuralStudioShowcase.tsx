import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Sparkles,
  CheckCircle2,
  Radio,
} from "lucide-react";

type HolographicTab = "all" | "pitch" | "morphology" | "debate" | "shadowing";

/**
 * Section 10: Holographic Neural Architecture Studio (Apple VisionOS & Linear Standard).
 * 100% Code-Driven • Zero AI Bitmaps • Zero Box-in-a-Box Clutter • Pure Mathematical Spatial Physics.
 */
export const HolographicNeuralStudioShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HolographicTab>("all");

  // =========================================================================
  // CARD 1: DYNAMIC PITCH CONTOUR & INTONATION MAESTRO
  // =========================================================================
  const [selectedPitchWord, setSelectedPitchWord] = useState<"I" | "say" | "cancel" | "release">("cancel");
  const [isPitchAudioPlaying, setIsPitchAudioPlaying] = useState(false);
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

  const pitchMeanings = {
    I: "Emphasizes that someone else may have proposed it, not me.",
    say: "Implies I might have thought or written it, but never said it explicitly.",
    cancel: "I suggested postponing or modifying the timeline, never cancelling.",
    release: "I suggested cancelling something else, not this core release.",
  };

  // =========================================================================
  // CARD 2: MENTAL LEXICON MORPHOLOGICAL WORD-FAMILY MATRIX
  // =========================================================================
  const [activeMorphIndex, setActiveMorphIndex] = useState<number>(0);
  const [isMorphAudioPlaying, setIsMorphAudioPlaying] = useState(false);
  const morphFamily = [
    {
      pos: "Verb",
      form: "Synchronize",
      ipa: "/ˈsɪŋ.krə.naɪz/",
      cefr: "B2",
      sentence: "We synchronize distributed cluster state via Raft consensus.",
      collocations: ["synchronize nodes", "periodically synchronize", "bidirectionally synchronize"],
    },
    {
      pos: "Noun",
      form: "Synchronization",
      ipa: "/ˌsɪŋ.krə.naɪˈzeɪ.ʃən/",
      cefr: "C1",
      sentence: "Zero-copy synchronization avoids lock contention across CPU cores.",
      collocations: ["barrier synchronization", "event-driven synchronization", "state synchronization"],
    },
    {
      pos: "Adjective",
      form: "Synchronous",
      ipa: "/ˈsɪŋ.krə.nəs/",
      cefr: "C1",
      sentence: "Synchronous network RPCs introduce unacceptable latency under heavy load.",
      collocations: ["synchronous blocking call", "synchronous replication", "synchronous protocol"],
    },
    {
      pos: "Adverb",
      form: "Synchronously",
      ipa: "/ˈsɪŋ.krə.nəs.li/",
      cefr: "C2",
      sentence: "All audit logs are persisted synchronously to immutable storage.",
      collocations: ["execute synchronously", "commit synchronously", "process synchronously"],
    },
  ];

  // =========================================================================
  // CARD 3: EXECUTIVE RHETORICAL DEBATE & DIPLOMATIC HEDGING ARENA
  // =========================================================================
  const [debateLevel, setDebateLevel] = useState<1 | 2 | 3>(3);
  const debateTiers = {
    1: {
      name: "Direct Assertion (High Friction)",
      quote: "\"This architecture will fail under load and wastes company budget.\"",
      critique: "Abrasive tone, triggers defensive responses in engineering leadership.",
      politeness: "32%",
      authority: "65%",
      friction: "High",
    },
    2: {
      name: "Diplomatic Hedging (Balanced)",
      quote: "\"While the current proposal shows promise, we might observe throughput bottlenecks at peak scale.\"",
      critique: "Softens friction with 'might observe' and validates the colleague's intent.",
      politeness: "84%",
      authority: "88%",
      friction: "Low",
    },
    3: {
      name: "Concessive Power Reframe (Boardroom Master)",
      quote: "\"While I fully recognize the speed of this rollout, allocating initial budget to caching mitigates cascading outages in Q4.\"",
      critique: "Uses concessive 'While I recognize' + strategic ROI pivot to lead the consensus.",
      politeness: "99%",
      authority: "98%",
      friction: "Zero",
    },
  };

  // =========================================================================
  // CARD 4: AUDITORY SHADOWING & PHONETIC PHASE ALIGNMENT
  // =========================================================================
  const [shadowDelayMs, setShadowDelayMs] = useState<number>(320);
  const [isShadowingActive, setIsShadowingActive] = useState(false);

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Bar (Monochromatic & Clean) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Masterworks (4)" },
            { id: "pitch", label: "🎼 Pitch Contour Maestro" },
            { id: "morphology", label: "🧬 Morphological Family" },
            { id: "debate", label: "🏛️ Executive Debate Arena" },
            { id: "shadowing", label: "⏱️ Shadowing Phase Worklet" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as HolographicTab)}
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
          Holographic Neural Architecture
        </span>
      </div>

      {/* Grid of 4 Masterworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            MASTERWORK 1: DYNAMIC PITCH CONTOUR & INTONATION MAESTRO
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "pitch") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. Dynamic Pitch Contour & Intonation
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click Word to Shift Nuclear Peak
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
                <span className="tracking-widest uppercase">Prosody Physics • Fundamental F0</span>
                <span className="text-white/60">Pitch Range: 120Hz – 220Hz</span>
              </div>

              {/* Interactive Sentence with Pitch Accent Triggers */}
              <div className="my-auto space-y-4 py-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                    Sentence Focus Shift
                  </span>
                  <div className="text-lg sm:text-xl font-normal text-white/90 leading-relaxed flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setSelectedPitchWord("I")}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        selectedPitchWord === "I"
                          ? "text-white font-bold bg-white/15 underline underline-offset-4 decoration-[#A27FF3]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      "I
                    </button>
                    <span>didn't</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPitchWord("say")}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        selectedPitchWord === "say"
                          ? "text-white font-bold bg-white/15 underline underline-offset-4 decoration-[#A27FF3]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      say
                    </button>
                    <span>we should</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPitchWord("cancel")}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        selectedPitchWord === "cancel"
                          ? "text-white font-bold bg-white/15 underline underline-offset-4 decoration-[#A27FF3]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      cancel
                    </button>
                    <span>the</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPitchWord("release")}
                      className={`px-1.5 py-0.5 rounded transition-all ${
                        selectedPitchWord === "release"
                          ? "text-white font-bold bg-white/15 underline underline-offset-4 decoration-[#A27FF3]"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      release."
                    </button>
                  </div>
                </div>

                {/* SVG 3D Dynamic Pitch Contour Curve */}
                <div className="relative h-20 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70">
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />

                    {/* Dynamic Spline Path based on Selected Word */}
                    <path
                      d={
                        selectedPitchWord === "I"
                          ? "M 15 15 Q 40 45, 100 55 T 200 58 T 285 60"
                          : selectedPitchWord === "say"
                          ? "M 15 55 Q 75 15, 120 50 T 220 55 T 285 60"
                          : selectedPitchWord === "cancel"
                          ? "M 15 58 Q 100 55, 180 15 T 240 50 T 285 58"
                          : "M 15 58 Q 100 55, 180 52 T 255 15 T 285 55"
                      }
                      stroke="#A27FF3"
                      strokeWidth="2.5"
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Pitch Peak Marker */}
                    <circle
                      cx={
                        selectedPitchWord === "I"
                          ? 20
                          : selectedPitchWord === "say"
                          ? 80
                          : selectedPitchWord === "cancel"
                          ? 195
                          : 265
                      }
                      cy={16}
                      r={4}
                      fill="#FFFFFF"
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>

                {/* Semantic Pragmatic Meaning (Clean left hairline) */}
                <div className="space-y-1 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
                    Pragmatic Semantic Meaning:
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {pitchMeanings[selectedPitchWord]}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => setIsPitchAudioPlaying(!isPitchAudioPlaying)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isPitchAudioPlaying ? "Auditory Contour..." : "Listen to Inflection"}
                </button>
                <span>Prosody: 99.1%</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 2: MENTAL LEXICON MORPHOLOGICAL WORD-FAMILY MATRIX
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "morphology") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Mental Lexicon Morphological Matrix
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Root: Synchron- (4 Forms)
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Morphological Paradigm</span>
                <span className="text-white/60">CEFR: {morphFamily[activeMorphIndex].cefr}</span>
              </div>

              {/* 4 Interactive Morphological Blocks */}
              <div className="my-auto space-y-4 py-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {morphFamily.map((item, idx) => (
                    <button
                      key={item.form}
                      type="button"
                      onClick={() => setActiveMorphIndex(idx)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        activeMorphIndex === idx
                          ? "bg-white text-black border-white shadow-[0_0_16px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="block text-[9px] font-mono uppercase opacity-50">{item.pos}</span>
                      <span className="block text-xs font-semibold truncate">{item.form}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Form Context Sentence */}
                <div className="space-y-1.5 pl-3 border-l border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{morphFamily[activeMorphIndex].form}</span>
                    <span className="text-xs font-mono text-white/40">{morphFamily[activeMorphIndex].ipa}</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    "{morphFamily[activeMorphIndex].sentence}"
                  </p>
                </div>

                {/* Collocation Affinity Chips */}
                <div className="space-y-1 pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                    High-Frequency Engineering Collocations:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {morphFamily[activeMorphIndex].collocations.map((col) => (
                      <span
                        key={col}
                        className="text-[10px] font-mono text-white/70 bg-white/[0.04] px-2 py-0.5 rounded-md"
                      >
                        › {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => setIsMorphAudioPlaying(!isMorphAudioPlaying)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isMorphAudioPlaying ? "Pronouncing Form..." : "Pronounce Form"}
                </button>
                <span>Full Paradigm Mastered</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 3: EXECUTIVE RHETORICAL DEBATE & DIPLOMATIC HEDGING ARENA
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "debate") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Executive Rhetorical Debate Arena
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Diplomatic Leverage Calibration
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Executive Framing Tier</span>
                <span className="text-white font-semibold">Tier {debateLevel}/3</span>
              </div>

              {/* Level Selector Tabs */}
              <div className="my-auto space-y-4 py-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {([1, 2, 3] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDebateLevel(lvl)}
                      className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                        debateLevel === lvl
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      <span className="block text-[10px] font-mono uppercase">Level {lvl}</span>
                    </button>
                  ))}
                </div>

                {/* Current Quote Framing */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    {debateTiers[debateLevel].name}
                  </span>
                  <p className="text-sm sm:text-base font-normal text-white leading-relaxed pl-3 border-l border-white/20">
                    {debateTiers[debateLevel].quote}
                  </p>
                </div>

                {/* Rhetorical Feedback */}
                <p className="text-xs text-white/60 italic pl-3 border-l border-white/10">
                  {debateTiers[debateLevel].critique}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-center">
                  <div>
                    <span className="text-white/40 block">Diplomacy</span>
                    <span className="text-white font-semibold">{debateTiers[debateLevel].politeness}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Authority</span>
                    <span className="text-white font-semibold">{debateTiers[debateLevel].authority}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Team Friction</span>
                    <span className={debateLevel === 3 ? "text-[#34D399] font-bold" : "text-white/60"}>
                      {debateTiers[debateLevel].friction}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Consensus Driver
                </span>
                <span>Boardroom Calibrated</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 4: AUDITORY SHADOWING & PHONETIC PHASE ALIGNMENT WORKLET
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "shadowing") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Auditory Shadowing Phase Worklet
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Neural Echo Calibration
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Phonetic Delay Calibration</span>
                <span className="text-white font-semibold">Lag: {shadowDelayMs} ms</span>
              </div>

              {/* Dual Phase Waveform Track */}
              <div className="my-auto space-y-5 py-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="text-[#A27FF3]">1. Mentor Voice Stream (Primary)</span>
                    <span>144 WPM</span>
                  </div>
                  <div className="h-7 w-full flex items-center justify-between gap-1">
                    {[50, 75, 100, 60, 85, 40, 95, 70, 50, 80, 65, 90, 45, 60, 85, 30, 75, 90, 55, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full rounded-full bg-white/25 transition-all duration-200"
                          style={{ height: `${h}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="text-[#34D399]">2. Learner Echo Shadow (Delayed)</span>
                    <span>Phase Alignment: 99.2%</span>
                  </div>
                  <div className="h-7 w-full flex items-center justify-between gap-1 pl-6">
                    {[50, 75, 100, 60, 85, 40, 95, 70, 50, 80, 65, 90, 45, 60, 85, 30, 75, 90, 55, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full rounded-full bg-[#34D399]/40 transition-all duration-200"
                          style={{ height: `${h * 0.9}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Delay Slider Controller */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Shadow Delay: {shadowDelayMs}ms</span>
                    <span className="text-white/60">Optimal: 300ms – 400ms</span>
                  </div>
                  <input
                    type="range"
                    min={150}
                    max={600}
                    step={10}
                    value={shadowDelayMs}
                    onChange={(e) => setShadowDelayMs(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => setIsShadowingActive(!isShadowingActive)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isShadowingActive
                      ? "bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                      : "bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isShadowingActive ? "animate-pulse" : ""}`} />
                  {isShadowingActive ? "Shadowing Active (Listening...)" : "Start Shadowing Session"}
                </button>
                <span>Dual Worklet Synced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
