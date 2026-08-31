import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Sparkles,
  Play,
  CheckCircle2,
  Activity,
} from "lucide-react";

type NextGenTab = "all" | "constellation" | "turntaking" | "pitch" | "phonemes";

interface SynapticNode {
  id: string;
  word: string;
  x: number;
  y: number;
  tier: "C1" | "C2" | "B2";
  retention: number;
  connections: string[];
  context: string;
}

const NODES: SynapticNode[] = [
  { id: "concurrency", word: "Concurrency", x: 60, y: 70, tier: "C1", retention: 96, connections: ["deadlock", "mutex", "thread_safety"], context: "Executing multiple computational threads during overlapping time intervals." },
  { id: "deadlock", word: "Deadlock", x: 190, y: 40, tier: "B2", retention: 88, connections: ["concurrency", "mutex"], context: "A state in which each member of a group waits for another to release a lock." },
  { id: "mutex", word: "Mutual Exclusion", x: 260, y: 110, tier: "C1", retention: 94, connections: ["concurrency", "deadlock", "race_condition"], context: "Locking mechanism synchronizing shared memory access across threads." },
  { id: "race_condition", word: "Race Condition", x: 140, y: 150, tier: "C1", retention: 91, connections: ["mutex", "thread_safety"], context: "Software bug where the output is dependent on the sequence of uncontrollable events." },
  { id: "thread_safety", word: "Thread Safety", x: 30, y: 140, tier: "C2", retention: 98, connections: ["concurrency", "race_condition"], context: "Guaranteed invariant execution when invoked concurrently from multiple threads." },
];

/**
 * Section 9: Next-Gen Spatial Studio Showcase (Apple Spatial & Linear Standard).
 * 100% Code-Driven • Zero AI Bitmaps • Zero Box-in-a-Box Clutter • Spatial Computing UI.
 */
export const NextGenSpatialStudioShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NextGenTab>("all");

  // 01. Synaptic Constellation State
  const [selectedNodeId, setSelectedNodeId] = useState<string>("concurrency");
  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  // 02. Turn-Taking Telemetry State
  const [isSimulatingStream, setIsSimulatingStream] = useState(false);

  // 03. Executive Pitch State
  const [activeTone, setActiveTone] = useState<"assertive" | "strategic" | "negotiating">("strategic");

  // 04. Orthographic Phoneme Matrix State
  const [activePhonemeBlock, setActivePhonemeBlock] = useState<number>(1);
  const [isPlayingPhonemeAudio, setIsPlayingPhonemeAudio] = useState(false);

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

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Bar (Monochromatic & Clean) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Next-Gen Concepts (4)" },
            { id: "constellation", label: "🌌 Synaptic Constellation" },
            { id: "turntaking", label: "🎙️ Turn-Taking Telemetry" },
            { id: "pitch", label: "📈 Executive Pitch" },
            { id: "phonemes", label: "🧩 IPA Phoneme Matrix" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as NextGenTab)}
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
          Next-Gen Spatial Matrix
        </span>
      </div>

      {/* Grid of 4 Next-Gen Concepts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            CONCEPT 1: SPATIAL 3D SYNAPTIC BRAIN CONSTELLATION
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "constellation") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. Synaptic Vocabulary Constellation
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click Nodes to Explore Synapses
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
                <span className="tracking-widest uppercase">Linguistic Matrix • 5 Connected Synapses</span>
                <span className="text-white/60">Tier: {selectedNode.tier}</span>
              </div>

              {/* Interactive 3D SVG Constellation Graph */}
              <div className="my-auto space-y-4 py-2">
                <div className="relative h-44 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 320 200">
                    {/* Background Galaxy Dust */}
                    <circle cx="160" cy="100" r="80" fill="rgba(112,72,232,0.06)" />

                    {/* Connecting Synaptic Splines */}
                    {NODES.map((node) =>
                      node.connections.map((targetId) => {
                        const target = NODES.find((n) => n.id === targetId);
                        if (!target) return null;
                        const isHighlighted =
                          node.id === selectedNodeId || target.id === selectedNodeId;
                        return (
                          <line
                            key={`${node.id}-${targetId}`}
                            x1={node.x}
                            y1={node.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={isHighlighted ? "#A27FF3" : "rgba(255,255,255,0.08)"}
                            strokeWidth={isHighlighted ? 2 : 1}
                            strokeDasharray={isHighlighted ? "none" : "3 3"}
                            className="transition-all duration-300"
                          />
                        );
                      }),
                    )}

                    {/* Interactive Synapse Nodes */}
                    {NODES.map((node) => {
                      const isSelected = node.id === selectedNodeId;
                      return (
                        <g
                          key={node.id}
                          className="cursor-pointer"
                          onClick={() => setSelectedNodeId(node.id)}
                        >
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r={isSelected ? 9 : 5}
                            fill={isSelected ? "#FFFFFF" : "#A27FF3"}
                            className="transition-all duration-300"
                          />
                          {isSelected && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={16}
                              stroke="#A27FF3"
                              strokeWidth="1"
                              fill="none"
                              className="animate-ping"
                            />
                          )}
                          <text
                            x={node.x}
                            y={node.y + 18}
                            textAnchor="middle"
                            className={`text-[10px] font-mono transition-colors duration-200 ${
                              isSelected ? "fill-white font-bold" : "fill-white/40"
                            }`}
                          >
                            {node.word}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Selected Node Details (Clean, zero nested boxes) */}
                <div className="space-y-1 pt-2 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{selectedNode.word}</span>
                    <span className="text-xs font-mono text-[#34D399] font-bold">
                      {selectedNode.retention}% Stability
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-3 border-l border-white/20">
                    "{selectedNode.context}"
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <Activity className="w-3 h-3 text-[#A27FF3]" /> Synapse Active
                </span>
                <span>SuperMemo-2 Network</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONCEPT 2: CONVERSATIONAL TURN-TAKING TELEMETRY
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "turntaking") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Turn-Taking Cadence Telemetry
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Real-Time Dual Audio Stream
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Live Conversational Rhythm</span>
                <span className="text-white/60">Latency: &lt;12 ms</span>
              </div>

              {/* Dual Symmetrical Audio Stream Spectrum */}
              <div className="my-auto space-y-6 py-2">
                {/* 1. AI Mentor Audio Stream */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="uppercase tracking-wider text-[#A27FF3]">AI Mentor Prompt Stream</span>
                    <span>48kHz / 138 WPM</span>
                  </div>
                  <div className="h-10 w-full flex items-center justify-between gap-1 px-1">
                    {[40, 60, 85, 30, 95, 70, 50, 80, 100, 65, 45, 90, 75, 40, 60, 85, 30, 70, 90, 55, 40, 20].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full rounded-full bg-white/20 transition-all duration-300"
                          style={{
                            height: isSimulatingStream
                              ? `${Math.max(15, (h * (Math.sin(i + Date.now() / 250) + 1.2)) / 2)}%`
                              : `${h * 0.4}%`,
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {/* Symmetrical Divider Line */}
                <div className="flex items-center justify-between text-[10px] font-mono text-white/30 py-1">
                  <span>Turn Switch: 0.18s</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span>Cognitive Load: Low (Optimal)</span>
                </div>

                {/* 2. Candidate Speech Stream */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span className="uppercase tracking-wider text-[#34D399]">Candidate Response Stream</span>
                    <span>142 WPM / 0 Filler Words</span>
                  </div>
                  <div className="h-10 w-full flex items-center justify-between gap-1 px-1">
                    {[30, 50, 70, 90, 45, 80, 100, 60, 40, 85, 95, 50, 75, 35, 60, 80, 90, 65, 40, 30, 20, 10].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full rounded-full bg-[#34D399]/40 transition-all duration-300"
                          style={{
                            height: isSimulatingStream
                              ? `${Math.max(15, (h * (Math.sin(i + Date.now() / 200) + 1.2)) / 2)}%`
                              : `${h * 0.4}%`,
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSimulatingStream(!isSimulatingStream)}
                  className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isSimulatingStream ? "Simulating Live Cadence..." : "Simulate Turn Rhythm"}
                </button>
                <span className="text-[11px] font-mono text-white/30">Zero Overlaps</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONCEPT 3: EXECUTIVE PITCH & LEADERSHIP CADENCE
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "pitch") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Executive Pitch & Leadership Cadence
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Leadership RFC Standard
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Executive Presence Diagnostic</span>
                <span className="text-white font-semibold">Confidence: 98.7%</span>
              </div>

              {/* Pitch Content & Tone Switcher */}
              <div className="my-auto space-y-5 py-2">
                {/* Tone Switcher (Monochromatic pills) */}
                <div className="flex items-center gap-1.5">
                  {(["assertive", "strategic", "negotiating"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTone(t)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                        activeTone === t
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.03] text-white/40 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Spoken Pitch Sentence */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Spoken Executive Framing
                  </span>
                  <p className="text-base sm:text-lg font-normal text-white/90 leading-relaxed pl-3 border-l border-white/20">
                    {activeTone === "strategic" &&
                      "\"We will consolidate our data pipelines into an event-driven mesh, reducing infrastructure spend by 28% while unlocking sub-second analytics.\""}
                    {activeTone === "assertive" &&
                      "\"Our architectural decision eliminates technical debt immediately and guarantees 99.999% uptime across all European clusters.\""}
                    {activeTone === "negotiating" &&
                      "\"By phasing the rollout across three milestones, we protect core reliability while aligning with Q4 budgetary constraints.\""}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-center">
                  <div>
                    <span className="text-white/40 block">Decisiveness</span>
                    <span className="text-white font-semibold">99.2%</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Brevity Gain</span>
                    <span className="text-[#34D399] font-semibold">+42%</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Pace</span>
                    <span className="text-white font-semibold">144 WPM</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Boardroom Calibrated
                </span>
                <span>C2 Executive Level</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONCEPT 4: ORTHOGRAPHIC IPA PHONEME MATRIX
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "phonemes") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Orthographic IPA Phoneme Matrix
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Tactile Sound Blocks
              </span>
            </div>

            <div className="w-full min-h-[440px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Phonetic Articulation Units</span>
                <span className="text-white/60">Word: Asynchronous</span>
              </div>

              {/* Phoneme Block Matrix */}
              <div className="my-auto space-y-6 py-2">
                <div>
                  <span className="text-xs font-mono text-white/40 block mb-1">
                    Full IPA: /eɪˈsɪŋ.krə.nəs/
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { id: 1, ortho: "A", ipa: "eɪ", type: "Vowel Diphthong", desc: "Long open sound" },
                      { id: 2, ortho: "syn", ipa: "ˈsɪŋ", type: "Stressed Syllable", desc: "Primary stress / Velar nasal" },
                      { id: 3, ortho: "chro", ipa: "krə", type: "Weak Schwa", desc: "Neutral reduced vowel" },
                      { id: 4, ortho: "nous", ipa: "nəs", type: "Terminal Consonant", desc: "Alveolar nasal + sibilant" },
                    ].map((block) => (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => setActivePhonemeBlock(block.id)}
                        className={`p-3 rounded-2xl border transition-all text-left flex-1 min-w-[70px] ${
                          activePhonemeBlock === block.id
                            ? "bg-white text-black border-white shadow-[0_0_16px_rgba(255,255,255,0.4)]"
                            : "bg-white/[0.02] border-white/[0.06] text-white/70 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{block.ortho}</span>
                        <span className="block text-xs font-mono opacity-60">/{block.ipa}/</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Phoneme Block Detail */}
                <div className="space-y-1 pl-3 border-l border-white/20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Acoustic Articulation Guide
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {activePhonemeBlock === 1 && "Start with a relaxed jaw and glide smoothly from [e] to [ɪ] with zero tongue tension."}
                    {activePhonemeBlock === 2 && "Apply acoustic primary stress: raise pitch by 20Hz and articulate the velar nasal [ŋ] at the soft palate."}
                    {activePhonemeBlock === 3 && "Reduce the vowel completely to neutral schwa [ə]; keep duration under 45 milliseconds."}
                    {activePhonemeBlock === 4 && "End with a crisp, voiceless alveolar fricative [s] without dropping vocal air support."}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <button
                  type="button"
                  onClick={() => setIsPlayingPhonemeAudio(!isPlayingPhonemeAudio)}
                  className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {isPlayingPhonemeAudio ? "Playing Formant..." : "Listen to Syllable Formant"}
                </button>
                <span>4 Articulation Units</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
