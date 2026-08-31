import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Sparkles,
  Play,
  Pause,
  RotateCw,
  Shield,
} from "lucide-react";

type MasterpieceTab = "all" | "memory" | "writing" | "conversation" | "reading";

/**
 * Section 11: Hyper-Evolved Production Masterpieces (1000x Re-Engineered Architecture).
 * Apple VisionOS & Linear Standard • 100% Code-Driven • Bespoke SVGs • Zero Box Clutter.
 */
export const HyperEvolvedMasterpiecesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MasterpieceTab>("all");

  // =========================================================================
  // MASTERWORK 1: SPATIAL 3D DAILY SRS MASTERY NEXUS (MEMORY RE-ENGINEERED)
  // =========================================================================
  const [retentionHorizon, setRetentionHorizon] = useState<"7d" | "30d" | "90d">("30d");
  const [isSyncingVault, setIsSyncingVault] = useState(false);
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
  // MASTERWORK 2: EXECUTIVE WRITING VELOCITY & LEXICAL RADAR (WRITING RE-ENGINEERED)
  // =========================================================================
  const [activeRadarDimension, setActiveRadarDimension] = useState<string>("Sophistication");
  const radarDimensions = [
    { name: "Sophistication", score: 94, desc: "C2 advanced technical terminology density" },
    { name: "Cohesion", score: 92, desc: "Smooth discourse markers and transitional flow" },
    { name: "Power Verbs", score: 96, desc: "Direct active voice without auxiliary padding" },
    { name: "Brevity", score: 90, desc: "High semantic information per syllable ratio" },
    { name: "Readability", score: 95, desc: "Flesch-Kincaid Grade 12 Executive Tier" },
  ];

  // =========================================================================
  // MASTERWORK 3: AI NEURAL RESONANCE ORB & HOLOGRAM HUD (CONVERSATION RE-ENGINEERED)
  // =========================================================================
  const [orbPhase, setOrbPhase] = useState<"speaking" | "listening" | "analyzing">("listening");
  const [noiseFilterEnabled, setNoiseFilterEnabled] = useState(true);

  // =========================================================================
  // MASTERWORK 4: TACHISTOSCOPIC RSVP SPEED READING HORIZON (READING RE-ENGINEERED)
  // =========================================================================
  const readingWords = [
    "To", "guarantee", "operational", "resilience,", "distributed", "systems", "leverage",
    "consensus", "protocols", "to", "mitigate", "cascading", "latency", "bottlenecks",
    "under", "peak", "concurrent", "workloads."
  ];
  const [rsvpIndex, setRsvpIndex] = useState<number>(0);
  const [isRsvpPlaying, setIsRsvpPlaying] = useState<boolean>(false);
  const [rsvpWpm, setRsvpWpm] = useState<number>(360);

  useEffect(() => {
    if (!isRsvpPlaying) return;
    const intervalMs = (60 / rsvpWpm) * 1000;
    const timer = setInterval(() => {
      setRsvpIndex((prev) => (prev + 1) % readingWords.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isRsvpPlaying, rsvpWpm, readingWords.length]);

  const currentWord = readingWords[rsvpIndex];
  // Calculate Optimal Recognition Point (ORP) - usually at ~35% of word length
  const orpIndex = Math.max(0, Math.floor(currentWord.length * 0.35));
  const beforeOrp = currentWord.slice(0, orpIndex);
  const orpLetter = currentWord[orpIndex] || "";
  const afterOrp = currentWord.slice(orpIndex + 1);

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Masterpieces (4)" },
            { id: "memory", label: "🏆 Memory Vault Nexus" },
            { id: "writing", label: "✍️ Lexical Radar" },
            { id: "conversation", label: "🎙️ Neural Resonance Orb" },
            { id: "reading", label: "📖 RSVP Speed Reader" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as MasterpieceTab)}
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
          <Sparkles className="w-3 h-3 text-[#34D399]" />
          1000x Production Architecture
        </span>
      </div>

      {/* Grid of 4 Masterworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            MASTERWORK 1: SPATIAL 3D DAILY SRS MASTERY NEXUS (MEMORY)
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "memory") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. Memory Vault SRS Mastery Nexus
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Spaced Repetition Synthesis
              </span>
            </div>

            <div
              ref={card1Ref}
              onMouseMove={handleMouseMove1}
              onMouseLeave={handleMouseLeave1}
              className="w-full min-h-[460px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden [perspective:1400px] select-none"
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
                <span className="tracking-widest uppercase">Memory Synapse • Daily Session Complete</span>
                <span className="text-white/60">SM-2 Algorithm Calibrated</span>
              </div>

              {/* Central Bespoke Quantum Seal SVG Nexus */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-4 space-y-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 80 80" fill="none">
                    {/* Outer Rotating Energy Ring */}
                    <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="40" cy="40" r="30" stroke="#A27FF3" strokeWidth="1.75" strokeDasharray="188.4" strokeDashoffset="40" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="22" stroke="rgba(52,211,153,0.4)" strokeWidth="1.25" strokeDasharray="3 3" />
                    {/* Bespoke Center Quantum Node Pins */}
                    <circle cx="40" cy="40" r="6" fill="#FFFFFF" />
                    <circle cx="40" cy="40" r="12" stroke="#FFFFFF" strokeWidth="0.75" strokeOpacity="0.4" />
                    {/* Cardinal Pulse Ticks */}
                    <line x1="40" y1="2" x2="40" y2="8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="40" y1="72" x2="40" y2="78" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="2" y1="40" x2="8" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="72" y1="40" x2="78" y2="40" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                    12 Synapses Consolidated
                  </h3>
                  <p className="text-xs text-white/50 max-w-xs mx-auto mt-1 leading-relaxed">
                    Spaced repetition decay curves updated. Memory stability index boosted by <strong>+2.60x</strong>.
                  </p>
                </div>

                {/* Horizon Stability Projection Tabs */}
                <div className="flex items-center gap-2 pt-1">
                  {(["7d", "30d", "90d"] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setRetentionHorizon(h)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono transition-all ${
                        retentionHorizon === h
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      {h === "7d" ? "7 Days (96%)" : h === "30d" ? "30 Days (88%)" : "90 Days (81%)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncingVault(true);
                    setTimeout(() => setIsSyncingVault(false), 1200);
                  }}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSyncingVault ? "animate-spin text-[#34D399]" : ""}`} />
                  {isSyncingVault ? "Syncing to Encrypted Vault..." : "Sync Synapse State"}
                </button>
                <span>Next Recall: In 48 Hours</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 2: EXECUTIVE WRITING VELOCITY & LEXICAL RADAR (WRITING)
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "writing") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Executive Writing Velocity & Radar
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Multi-Dimensional Lexical Grid
              </span>
            </div>

            <div className="w-full min-h-[460px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Lexical Density & Flow</span>
                <span className="text-white font-semibold">Flesch-Kincaid: Grade 12</span>
              </div>

              {/* Central Pentagonal Radar Visualization */}
              <div className="my-auto space-y-5 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Mathematical SVG Radar Polygon */}
                  <div className="relative h-36 w-full flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 160 140">
                      {/* Concentric Reference Webs */}
                      <polygon points="80,10 145,55 120,125 40,125 15,55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      <polygon points="80,35 122,65 107,110 53,110 38,65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                      {/* Active Harmonic Shape */}
                      <polygon
                        points="80,15 140,58 116,120 44,122 20,58"
                        fill="rgba(162,127,243,0.15)"
                        stroke="#A27FF3"
                        strokeWidth="1.75"
                        className="transition-all duration-300"
                      />
                      {/* Node Points */}
                      <circle cx="80" cy="15" r="3.5" fill="#FFFFFF" />
                      <circle cx="140" cy="58" r="3.5" fill="#FFFFFF" />
                      <circle cx="116" cy="120" r="3.5" fill="#FFFFFF" />
                      <circle cx="44" cy="122" r="3.5" fill="#FFFFFF" />
                      <circle cx="20" cy="58" r="3.5" fill="#FFFFFF" />
                    </svg>
                  </div>

                  {/* Dimension Metrics List */}
                  <div className="space-y-1.5">
                    {radarDimensions.map((dim) => (
                      <div
                        key={dim.name}
                        onClick={() => setActiveRadarDimension(dim.name)}
                        className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                          activeRadarDimension === dim.name ? "bg-white/10" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className={activeRadarDimension === dim.name ? "text-white font-medium" : "text-white/60"}>
                            {dim.name}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#34D399]">{dim.score}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-gradient-to-r from-[#A27FF3] to-[#34D399]" style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Dimension Detail */}
                <div className="space-y-0.5 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
                    Focus Dimension Insight:
                  </span>
                  <p className="text-xs text-white/70">
                    {radarDimensions.find((d) => d.name === activeRadarDimension)?.desc}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>Burst Velocity: 64 WPM</span>
                <span className="text-white/60">Executive Alignment: C2</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 3: AI NEURAL RESONANCE ORB & HOLOGRAM HUD (CONVERSATION)
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "conversation") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Neural Resonance Orb & HUD
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Spherical Harmonics 48kHz
              </span>
            </div>

            <div className="w-full min-h-[460px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Acoustic Neural Interface</span>
                <span className="text-white font-semibold">Latency: &lt;11.4 ms</span>
              </div>

              {/* Central 3D Trigonometric Resonance Orb */}
              <div className="my-auto space-y-6 py-2">
                <div className="flex items-center justify-center relative h-32">
                  {/* SVG Spherical Harmonics Orbit */}
                  <svg className="w-32 h-32 overflow-visible" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="50" cy="50" r="35" stroke="rgba(162,127,243,0.3)" strokeWidth="1.5" className="animate-spin" style={{ animationDuration: "12s" }} />
                    <circle cx="50" cy="50" r="24" stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" strokeDasharray="6 3" className="animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
                    {/* Core Pulse Sphere */}
                    <circle cx="50" cy="50" r="16" fill="rgba(162,127,243,0.2)" className="animate-pulse" />
                    <circle cx="50" cy="50" r="6" fill="#FFFFFF" />
                  </svg>
                </div>

                {/* Orb State Selector (Monochromatic tabs) */}
                <div className="grid grid-cols-3 gap-1.5">
                  {(["listening", "speaking", "analyzing"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setOrbPhase(p)}
                      className={`py-1.5 rounded-xl text-center text-[10px] font-mono uppercase tracking-wider transition-all ${
                        orbPhase === p
                          ? "bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Real-Time Formant Telemetry */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-center">
                  <div>
                    <span className="text-white/40 block">Formant F1</span>
                    <span className="text-white font-semibold">520 Hz</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Formant F2</span>
                    <span className="text-white font-semibold">1,940 Hz</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Formant F3</span>
                    <span className="text-[#34D399] font-semibold">2,800 Hz</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => setNoiseFilterEnabled(!noiseFilterEnabled)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Noise Cancellation: {noiseFilterEnabled ? "Active" : "Off"}
                </button>
                <span>Zero Audio Dropouts</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MASTERWORK 4: TACHISTOSCOPIC RSVP SPEED READING HORIZON (READING)
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "reading") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Tachistoscopic RSVP Speed Reader
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Optimal Recognition Point (ORP)
              </span>
            </div>

            <div className="w-full min-h-[460px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Rapid Serial Visual Engine</span>
                <span className="text-white font-semibold">Pacing: {rsvpWpm} WPM</span>
              </div>

              {/* RSVP Fixation Visual Box */}
              <div className="my-auto space-y-6 py-2">
                <div className="relative min-h-[100px] flex items-center justify-center text-center">
                  {/* Top & Bottom Optical Guide Hairlines */}
                  <div className="absolute top-0 w-8 h-[2px] bg-[#A27FF3] -translate-x-1/2 left-1/2" />
                  <div className="absolute bottom-0 w-8 h-[2px] bg-[#A27FF3] -translate-x-1/2 left-1/2" />

                  {/* Word with ORP (Red/White Focal Accent) */}
                  <div className="text-3xl sm:text-4xl font-mono tracking-wider">
                    <span className="text-white/40">{beforeOrp}</span>
                    <span className="text-[#34D399] font-bold underline decoration-[#34D399] underline-offset-8">
                      {orpLetter}
                    </span>
                    <span className="text-white/40">{afterOrp}</span>
                  </div>
                </div>

                {/* Speed Slider Controller */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Reading Velocity: {rsvpWpm} WPM</span>
                    <span className="text-white/60">Executive Target: 350-500 WPM</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={600}
                    step={20}
                    value={rsvpWpm}
                    onChange={(e) => setRsvpWpm(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Progress Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span>Word {rsvpIndex + 1} of {readingWords.length}</span>
                  <span>{Math.round(((rsvpIndex + 1) / readingWords.length) * 100)}% Complete</span>
                </div>
              </div>

              {/* Footer Play/Pause Button */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRsvpPlaying(!isRsvpPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                    isRsvpPlaying
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                      : "bg-[#7048E8] text-white hover:bg-[#8058F8] shadow-[0_0_20px_rgba(112,72,232,0.4)]"
                  }`}
                >
                  {isRsvpPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {isRsvpPlaying ? "Pause RSVP Stream" : "Start Tachistoscopic Flow"}
                </button>
                <span className="text-[11px] font-mono text-white/40">Eye-Fixation Optimized</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
