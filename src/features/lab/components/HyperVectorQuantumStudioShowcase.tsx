import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Sparkles,
  Globe,
  Compass,
  Cpu,
} from "lucide-react";

type QuantumTab = "all" | "formant" | "vault" | "compass" | "dialect";

interface VowelNode {
  symbol: string;
  keyword: string;
  x: number;
  y: number;
  f1: number;
  f2: number;
  f3: number;
  articulation: string;
  sentence: string;
}

const VOWELS: Record<string, VowelNode> = {
  "i:": { symbol: "/i:/", keyword: "Fleece", x: 40, y: 25, f1: 280, f2: 2250, f3: 3100, articulation: "High Front Vowel • Unrounded", sentence: "We achieve extreme concurrency via event-driven workers." },
  "ɪ": { symbol: "/ɪ/", keyword: "Kit", x: 80, y: 55, f1: 400, f2: 1920, f3: 2600, articulation: "Near-Close Front Vowel • Relaxed", sentence: "Mitigate system risk through automated integration tests." },
  "e": { symbol: "/e/", keyword: "Dress", x: 60, y: 85, f1: 550, f2: 1750, f3: 2500, articulation: "Mid Front Vowel • Spread", sentence: "Deploy scalable message queues across European clusters." },
  "æ": { symbol: "/æ/", keyword: "Trap", x: 100, y: 130, f1: 690, f2: 1660, f3: 2450, articulation: "Near-Open Front Vowel • Open Jaw", sentence: "Analyze packet traffic patterns to identify bottlenecks." },
  "u:": { symbol: "/u:/", keyword: "Goose", x: 260, y: 25, f1: 310, f2: 870, f3: 2250, articulation: "High Back Vowel • Fully Rounded", sentence: "Produce immutable telemetry logs for auditing protocols." },
  "ʊ": { symbol: "/ʊ/", keyword: "Foot", x: 220, y: 55, f1: 440, f2: 1020, f3: 2300, articulation: "Near-Close Back Vowel • Rounded", sentence: "Look into cached database queries to lower disk latency." },
  "ɔ:": { symbol: "/ɔ:/", keyword: "Thought", x: 235, y: 90, f1: 570, f2: 840, f3: 2400, articulation: "Mid Back Vowel • Open-Mid Rounded", sentence: "Automate all infrastructure provisioning without downtime." },
  "ɑ:": { symbol: "/ɑ:/", keyword: "Palm", x: 185, y: 130, f1: 730, f2: 1090, f3: 2450, articulation: "Open Back Vowel • Unrounded", sentence: "Architect robust cross-region database replication groups." },
};

/**
 * Section 12: Hyper-Vector Quantum Studio (Ultra-High-End Bespoke Vector Masterworks).
 * 100% Code-Driven • Multi-Layered Bespoke SVGs • Linear & Apple VisionOS Aesthetics.
 */
export const HyperVectorQuantumStudioShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuantumTab>("all");

  // =========================================================================
  // MASTERWORK 1: ACOUSTIC FORMANT RESONATOR & IPA QUADRILATERAL
  // =========================================================================
  const [selectedVowelKey, setSelectedVowelKey] = useState<string>("i:");
  const [isVowelAudioPlaying, setIsVowelAudioPlaying] = useState<boolean>(false);
  const currentVowel = VOWELS[selectedVowelKey] || VOWELS["i:"];

  // 3D Tilt for Card 1
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
  // MASTERWORK 2: NEURAL SYNAPSE CONSOLIDATION VAULT
  // =========================================================================
  const [vaultDay, setVaultDay] = useState<number>(8);
  const retentionCurve = [
    { day: 1, val: 100, stability: "2.60x" },
    { day: 3, val: 93, stability: "3.12x" },
    { day: 8, val: 88, stability: "4.20x" },
    { day: 16, val: 84, stability: "5.50x" },
    { day: 30, val: 81, stability: "7.10x" },
  ];

  // =========================================================================
  // MASTERWORK 3: EXECUTIVE RHETORICAL BALANCE & C2 DISCOURSE COMPASS
  // =========================================================================
  const [activeQuadrant, setActiveQuadrant] = useState<"logos" | "ethos" | "pathos" | "kairos">("logos");
  const rhetoricData = {
    logos: { title: "Logos (Technical Rigor)", angle: 45, needleX: 95, needleY: 45, metric: "98.4% Structural Validity", draft: "\"We ran into bugs last month so we want caching.\"", polish: "\"Adopting distributed caching mitigates Q3 latency bottlenecks and guarantees sub-second SLA compliance.\"" },
    ethos: { title: "Ethos (Executive Authority)", angle: 135, needleX: 95, needleY: 95, metric: "99.1% Leadership Tone", draft: "\"I think we maybe should change the database schema.\"", polish: "\"I recommend migrating the relational schema to an event-sourced ledger to enforce strict audit invariants.\"" },
    pathos: { title: "Pathos (Stakeholder Alignment)", angle: 225, needleX: 45, needleY: 95, metric: "96.5% Consensus Driver", draft: "\"The team is stressed out by manual deployments.\"", polish: "\"Automating CI/CD pipelines eliminates deployment toil, preserving engineering velocity and morale.\"" },
    kairos: { title: "Kairos (Strategic Timing & ROI)", angle: 315, needleX: 45, needleY: 45, metric: "97.8% Business Urgency", draft: "\"We should do this whenever we have time.\"", polish: "\"Executing this migration before Q4 high-traffic spikes captures a 28% infrastructure cost reduction immediately.\"" },
  };

  // =========================================================================
  // MASTERWORK 4: GLOBAL DIALECT & ACCENT VECTOR CALIBRATOR
  // =========================================================================
  const [activeDialect, setActiveDialect] = useState<"GA" | "RP" | "AU" | "CA">("GA");
  const dialectData = {
    GA: { name: "General American (GA)", rhoticity: "Fully Rhotic [ɹ]", bathTrap: "Fused Trap-Bath /æ/", flapT: "Active Intervocalic Flap [ɾ]", quote: "\"The writer started sorting critical data in the morning.\"" },
    RP: { name: "Received Pronunciation (RP / UK)", rhoticity: "Non-Rhotic (Vocalic Schwa /ə/)", bathTrap: "Split Broad Bath /ɑː/", flapT: "Crisp Alveolar Plosive [t]", quote: "\"The writer started sorting critical data in the morning.\"" },
    AU: { name: "Australian English (AU)", rhoticity: "Non-Rhotic (Open Vowels)", bathTrap: "Broad A /aː/", flapT: "Variable Flap [ɾ]", quote: "\"The writer started sorting critical data in the morning.\"" },
    CA: { name: "Canadian English (CA)", rhoticity: "Rhotic with Canadian Raising (/aʊ/ → [ʌʊ])", bathTrap: "Fused Trap-Bath /æ/", flapT: "Active Flap [ɾ]", quote: "\"The writer started sorting critical data in the morning.\"" },
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Bar (Monochromatic & Minimalist) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Quantum Masterworks (4)" },
            { id: "formant", label: "🎙️ IPA Vowel Matrix" },
            { id: "vault", label: "🧠 Synaptic Vault Core" },
            { id: "compass", label: "🧭 Rhetoric Compass" },
            { id: "dialect", label: "🌐 Dialect Vector Radar" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as QuantumTab)}
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
          Bespoke SVG Vector Engineering
        </span>
      </div>

      {/* Grid of 4 Masterworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            MASTERWORK 1: ACOUSTIC FORMANT RESONATOR & IPA QUADRILATERAL
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "formant") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. IPA Vowel Quadrilateral & Formant Resonator
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click Vowel Nodes
              </span>
            </div>

            <div
              ref={card1Ref}
              onMouseMove={handleMouseMove1}
              onMouseLeave={handleMouseLeave1}
              className="w-full min-h-[480px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden [perspective:1400px] select-none"
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
                <span className="tracking-widest uppercase">Phonetic Acoustic Geometry</span>
                <span className="text-white/60">F1/F2 Formant Matrix</span>
              </div>

              {/* Master Bespoke IPA Trapezoid SVG */}
              <div className="my-auto space-y-4 py-2">
                <div className="relative h-44 w-full flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160">
                    <defs>
                      <linearGradient id="vowelTrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A27FF3" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#34D399" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="formantSplineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A27FF3" />
                        <stop offset="50%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>

                    {/* Background Coordinate Quadrilateral */}
                    <polygon
                      points="30,20 270,20 200,140 90,140"
                      fill="url(#vowelTrapGrad)"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1.5"
                    />

                    {/* Interior Articulation Grid Axes */}
                    <line x1="60" y1="80" x2="235" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <line x1="150" y1="20" x2="145" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                    {/* Quadrilateral Axis Labels */}
                    <text x="30" y="12" className="text-[8px] font-mono fill-white/30">FRONT</text>
                    <text x="250" y="12" className="text-[8px] font-mono fill-white/30">BACK</text>
                    <text x="5" y="24" className="text-[8px] font-mono fill-white/30">CLOSE</text>
                    <text x="60" y="145" className="text-[8px] font-mono fill-white/30">OPEN</text>

                    {/* Active Formant Resonance Spline connecting Tongue Position to Resonator */}
                    <path
                      d={`M 150 155 Q ${currentVowel.x} ${currentVowel.y}, ${currentVowel.x} ${currentVowel.y}`}
                      stroke="url(#formantSplineGrad)"
                      strokeWidth="2"
                      fill="none"
                      className="transition-all duration-300"
                    />

                    {/* Interactive Vowel Nodes */}
                    {Object.entries(VOWELS).map(([key, v]) => {
                      const isSelected = selectedVowelKey === key;
                      return (
                        <g
                          key={key}
                          className="cursor-pointer"
                          onClick={() => setSelectedVowelKey(key)}
                        >
                          {/* Outer Pulsing Aura when selected */}
                          {isSelected && (
                            <circle
                              cx={v.x}
                              cy={v.y}
                              r={14}
                              stroke="#A27FF3"
                              strokeWidth="1"
                              fill="none"
                              className="animate-ping"
                            />
                          )}
                          <circle
                            cx={v.x}
                            cy={v.y}
                            r={isSelected ? 7 : 4}
                            fill={isSelected ? "#FFFFFF" : "rgba(255,255,255,0.3)"}
                            stroke={isSelected ? "#A27FF3" : "none"}
                            strokeWidth="2"
                            className="transition-all duration-200"
                          />
                          <text
                            x={v.x}
                            y={v.y - 10}
                            textAnchor="middle"
                            className={`text-[10px] font-mono font-semibold transition-colors duration-200 ${
                              isSelected ? "fill-white font-bold" : "fill-white/40"
                            }`}
                          >
                            {v.symbol}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Vowel Articulation Breakdown */}
                <div className="space-y-1.5 pl-3 border-l border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white font-mono">{currentVowel.symbol}</span>
                      <span className="text-xs text-white/50 font-medium">({currentVowel.keyword} Vowel)</span>
                    </div>
                    <span className="text-xs font-mono text-[#34D399] font-semibold">
                      F1: {currentVowel.f1}Hz • F2: {currentVowel.f2}Hz
                    </span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    "{currentVowel.sentence}"
                  </p>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-center">
                  <div>
                    <span className="text-white/40 block">Tongue Height</span>
                    <span className="text-white font-semibold">{currentVowel.f1 < 400 ? "Close (High)" : currentVowel.f1 < 600 ? "Mid" : "Open (Low)"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Backness</span>
                    <span className="text-white font-semibold">{currentVowel.f2 > 1600 ? "Front" : "Back"}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Concordance</span>
                    <span className="text-[#34D399] font-semibold">99.4% Native</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsVowelAudioPlaying(true);
                    setTimeout(() => setIsVowelAudioPlaying(false), 900);
                  }}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isVowelAudioPlaying ? "animate-pulse text-[#34D399]" : ""}`} />
                  {isVowelAudioPlaying ? "Synthesizing Formant..." : `Synthesize ${currentVowel.symbol}`}
                </button>
                <span>8 Quadrilateral Anchors</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 2: NEURAL SYNAPSE CONSOLIDATION VAULT
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "vault") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Synaptic Consolidation Vault & Quantum Core
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Ebbinghaus Integral Horizon
              </span>
            </div>

            <div className="w-full min-h-[480px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Quantum Memory Trace</span>
                <span className="text-white/60">SM-2 Stability: {retentionCurve.find((c) => c.day === vaultDay)?.stability}</span>
              </div>

              {/* Central Vector Quantum Core & Exponential Fill Spline */}
              <div className="my-auto space-y-4 py-2">
                <div className="relative h-44 w-full flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 160">
                    <defs>
                      <linearGradient id="decayAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A27FF3" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#7048E8" stopOpacity="0.0" />
                      </linearGradient>
                      <radialGradient id="vaultCoreGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                        <stop offset="40%" stopColor="#A27FF3" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#04040A" stopOpacity="0.0" />
                      </radialGradient>
                    </defs>

                    {/* Concentric Quantum Orbital Rings */}
                    <circle cx="80" cy="80" r="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="80" cy="80" r="42" stroke="rgba(162,127,243,0.3)" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin" style={{ animationDuration: "16s" }} />
                    <circle cx="80" cy="80" r="24" stroke="rgba(52,211,153,0.4)" strokeWidth="1.25" />

                    {/* 6 Axon Dendrite Converging Splines */}
                    <path d="M 10 30 Q 50 45, 80 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                    <path d="M 10 130 Q 50 115, 80 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                    <path d="M 150 20 Q 115 50, 80 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                    <path d="M 150 140 Q 115 110, 80 80" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />

                    {/* Central Quantum Vault Nucleus */}
                    <circle cx="80" cy="80" r="14" fill="url(#vaultCoreGlow)" />
                    <circle cx="80" cy="80" r="4" fill="#FFFFFF" />

                    {/* Decay Curve Grid & Spline Area Fill on the Right Side */}
                    <g transform="translate(170, 20)">
                      <line x1="0" y1="20" x2="120" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                      <line x1="0" y1="60" x2="120" y2="60" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 2" />
                      <line x1="0" y1="100" x2="120" y2="100" stroke="rgba(255,255,255,0.04)" />

                      {/* Area fill under curve */}
                      <path
                        d="M 10 10 Q 40 40, 80 60 T 115 72 L 115 100 L 10 100 Z"
                        fill="url(#decayAreaGrad)"
                      />
                      {/* Spline Path */}
                      <path
                        d="M 10 10 Q 40 40, 80 60 T 115 72"
                        stroke="#A27FF3"
                        strokeWidth="2"
                        fill="none"
                      />
                      {/* Active Day Point */}
                      <circle
                        cx={vaultDay === 1 ? 10 : vaultDay === 3 ? 35 : vaultDay === 8 ? 65 : vaultDay === 16 ? 90 : 115}
                        cy={vaultDay === 1 ? 10 : vaultDay === 3 ? 32 : vaultDay === 8 ? 52 : vaultDay === 16 ? 64 : 72}
                        r={4}
                        fill="#FFFFFF"
                      />
                    </g>
                  </svg>
                </div>

                {/* Day Interval Selectors */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/[0.04]">
                  {retentionCurve.map((c) => (
                    <button
                      key={c.day}
                      type="button"
                      onClick={() => setVaultDay(c.day)}
                      className={`py-1.5 rounded-xl text-center text-[10px] font-mono transition-all ${
                        vaultDay === c.day
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      D+{c.day} ({c.val}%)
                    </button>
                  ))}
                </div>

                {/* Insight */}
                <div className="space-y-0.5 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#34D399]">
                    Permanent Consolidation Projection:
                  </span>
                  <p className="text-xs text-white/70">
                    At D+{vaultDay}, recall probability is <strong>{retentionCurve.find((c) => c.day === vaultDay)?.val}%</strong>. Optimum review window triggers in 48 hours.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <Cpu className="w-3.5 h-3.5 text-[#A27FF3]" /> Quantum Vault Synchronized
                </span>
                <span>Recall Interval: Optimal</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 3: EXECUTIVE RHETORICAL BALANCE & C2 DISCOURSE COMPASS
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "compass") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Executive Rhetoric & C2 Discourse Compass
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Aristotelian Gyroscope
              </span>
            </div>

            <div className="w-full min-h-[480px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Rhetorical Balance Matrix</span>
                <span className="text-white font-semibold">{rhetoricData[activeQuadrant].metric}</span>
              </div>

              {/* Central Bespoke Gyroscopic Vector Compass SVG */}
              <div className="my-auto space-y-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Gyroscope Vector SVG */}
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <svg className="w-36 h-36 overflow-visible" viewBox="0 0 140 140">
                      {/* Outer Compass Bezel */}
                      <circle cx="70" cy="70" r="62" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                      <circle cx="70" cy="70" r="50" stroke="rgba(162,127,243,0.25)" strokeWidth="1" strokeDasharray="4 4" />

                      {/* 4 Cardinal Axis Dividers */}
                      <line x1="70" y1="12" x2="70" y2="128" stroke="rgba(255,255,255,0.06)" />
                      <line x1="12" y1="70" x2="128" y2="70" stroke="rgba(255,255,255,0.06)" />

                      {/* 4 Quadrant Interactive Labels */}
                      <text x="100" y="40" className="text-[9px] font-mono fill-white/50 cursor-pointer" onClick={() => setActiveQuadrant("logos")}>LOGOS</text>
                      <text x="100" y="105" className="text-[9px] font-mono fill-white/50 cursor-pointer" onClick={() => setActiveQuadrant("ethos")}>ETHOS</text>
                      <text x="18" y="105" className="text-[9px] font-mono fill-white/50 cursor-pointer" onClick={() => setActiveQuadrant("pathos")}>PATHOS</text>
                      <text x="18" y="40" className="text-[9px] font-mono fill-white/50 cursor-pointer" onClick={() => setActiveQuadrant("kairos")}>KAIROS</text>

                      {/* Active Vector Needle */}
                      <line
                        x1="70"
                        y1="70"
                        x2={rhetoricData[activeQuadrant].needleX}
                        y2={rhetoricData[activeQuadrant].needleY}
                        stroke="#A27FF3"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                      <circle cx="70" cy="70" r="5" fill="#FFFFFF" />
                      <circle
                        cx={rhetoricData[activeQuadrant].needleX}
                        cy={rhetoricData[activeQuadrant].needleY}
                        r={4}
                        fill="#34D399"
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>

                  {/* Quadrant Selector Buttons */}
                  <div className="space-y-1.5">
                    {(["logos", "ethos", "pathos", "kairos"] as const).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setActiveQuadrant(q)}
                        className={`w-full p-2 rounded-xl text-left transition-all ${
                          activeQuadrant === q
                            ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                            : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span className="block text-xs uppercase font-mono">{q}</span>
                        <span className="block text-[10px] opacity-60 truncate">{rhetoricData[q].title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Restructuring Diff */}
                <div className="space-y-1 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
                    Conversational Draft → C2 Executive Polish:
                  </span>
                  <p className="text-xs text-white/50 line-through">
                    {rhetoricData[activeQuadrant].draft}
                  </p>
                  <p className="text-xs font-medium text-white leading-relaxed">
                    {rhetoricData[activeQuadrant].polish}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <Compass className="w-3.5 h-3.5 text-[#34D399]" /> C2 Boardroom Restructuring
                </span>
                <span>Active Voice: 100%</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 4: GLOBAL DIALECT & ACCENT VECTOR CALIBRATOR
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "dialect") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Global Dialect & Accent Vector Calibrator
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Orthographic Projection
              </span>
            </div>

            <div className="w-full min-h-[480px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Multi-Dialect Resonance</span>
                <span className="text-white font-semibold">{dialectData[activeDialect].name}</span>
              </div>

              {/* Central Vector Orthographic Globe & Dialect Shift Markers */}
              <div className="my-auto space-y-4 py-2">
                <div className="relative h-36 w-full flex items-center justify-center">
                  <svg className="w-36 h-36 overflow-visible" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="rgba(112,72,232,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    {/* Elliptical Meridians & Latitudes */}
                    <ellipse cx="70" cy="70" rx="60" ry="24" fill="none" stroke="rgba(255,255,255,0.06)" />
                    <ellipse cx="70" cy="70" rx="60" ry="46" fill="none" stroke="rgba(255,255,255,0.06)" />
                    <ellipse cx="70" cy="70" rx="26" ry="60" fill="none" stroke="rgba(255,255,255,0.06)" />
                    <ellipse cx="70" cy="70" rx="48" ry="60" fill="none" stroke="rgba(255,255,255,0.06)" />

                    {/* Dialect Anchor Nodes on Globe */}
                    {[
                      { id: "GA", x: 42, y: 55, label: "GA" },
                      { id: "CA", x: 44, y: 38, label: "CA" },
                      { id: "RP", x: 74, y: 44, label: "RP" },
                      { id: "AU", x: 104, y: 95, label: "AU" },
                    ].map((d) => {
                      const isSelected = activeDialect === d.id;
                      return (
                        <g
                          key={d.id}
                          className="cursor-pointer"
                          onClick={() => setActiveDialect(d.id as "GA" | "RP" | "AU" | "CA")}
                        >
                          <circle
                            cx={d.x}
                            cy={d.y}
                            r={isSelected ? 6 : 3.5}
                            fill={isSelected ? "#FFFFFF" : "rgba(162,127,243,0.4)"}
                            stroke={isSelected ? "#34D399" : "none"}
                            strokeWidth="1.5"
                          />
                          <text
                            x={d.x}
                            y={d.y - 8}
                            textAnchor="middle"
                            className={`text-[8px] font-mono font-bold ${
                              isSelected ? "fill-white" : "fill-white/40"
                            }`}
                          >
                            {d.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Dialect Selection Tabs */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(["GA", "RP", "AU", "CA"] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setActiveDialect(d)}
                      className={`py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                        activeDialect === d
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Dialect Linguistic Rules */}
                <div className="space-y-1 pl-3 border-l border-white/20 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Rhoticity: <strong className="text-white">{dialectData[activeDialect].rhoticity}</strong></span>
                    <span>Flap T: <strong className="text-[#34D399]">{dialectData[activeDialect].flapT}</strong></span>
                  </div>
                  <p className="text-xs text-white/80 italic mt-1">
                    {dialectData[activeDialect].quote}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <Globe className="w-3.5 h-3.5 text-[#38BDF8]" /> Global Acoustic Calibrator
                </span>
                <span>ISO 639-1 Compliant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
