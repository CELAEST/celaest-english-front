import React, { useState, useCallback, useRef } from "react";
import {
  Volume2,
  Bookmark,
  RotateCw,
  Sparkles,
  Play,
  CheckCircle2,
} from "lucide-react";

type InnovationTab = "all" | "speaking" | "scrubber" | "morph" | "decay";

/**
 * Ultra-Premium Spatial 3D Suite (Apple VisionOS & Linear Standard).
 * 100% Code-Driven • Zero Clunky Colored Pills • Zero Box-in-a-Box Nesting • Pure Mathematical Physics.
 */
export const Spatial3DStudioShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InnovationTab>("all");

  // =========================================================================
  // CARD 1: Canonical Speaking Flashcard (Cleaned of all loud colored badges)
  // =========================================================================
  const [card1Flipped, setCard1Flipped] = useState(false);
  const [card1Bookmarked, setCard1Bookmarked] = useState(false);
  const [card1Grade, setCard1Grade] = useState<number | null>(null);
  const [card1AudioPlaying, setCard1AudioPlaying] = useState(false);
  const [card1Tilt, setCard1Tilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const card1Ref = useRef<HTMLDivElement>(null);

  const handleCard1MouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!card1Ref.current) return;
    const rect = card1Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setCard1Tilt({
      x: ((x - centerX) / centerX) * 5,
      y: ((y - centerY) / centerY) * -5,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.12,
    });
  }, []);

  const handleCard1MouseLeave = useCallback(() => {
    setCard1Tilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  // =========================================================================
  // CARD 2: Interactive Phoneme Acoustic Scrubber
  // =========================================================================
  const [scrubPosition, setScrubPosition] = useState<number>(45); // 0 to 100%
  const [isScrubAudioPlaying, setIsScrubAudioPlaying] = useState(false);
  const [hoveredPhoneme, setHoveredPhoneme] = useState<string>("zɪl");
  const scrubberContainerRef = useRef<HTMLDivElement>(null);

  const handleScrubberMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberContainerRef.current) return;
    const rect = scrubberContainerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setScrubPosition(pos);
    if (pos < 25) setHoveredPhoneme("rɪ");
    else if (pos < 55) setHoveredPhoneme("zɪl");
    else if (pos < 80) setHoveredPhoneme("jəns");
    else setHoveredPhoneme("s");
  };

  // =========================================================================
  // CARD 3: Fluid Executive Sentence Morph Slider
  // =========================================================================
  const [morphSplit, setMorphSplit] = useState<number>(50); // 0 (100% draft) to 100 (100% polish)
  const morphContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingMorph, setIsDraggingMorph] = useState(false);

  const handleMorphMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMorph || !morphContainerRef.current) return;
    const rect = morphContainerRef.current.getBoundingClientRect();
    const pos = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    setMorphSplit(pos);
  };

  // =========================================================================
  // CARD 4: Mathematical Memory Decay Horizon (Ebbinghaus Retention)
  // =========================================================================
  const [hoveredDay, setHoveredDay] = useState<number>(4);
  const decayPoints = [
    { day: 1, ret: 100, label: "Day 1 (Initial Drill)" },
    { day: 2, ret: 92, label: "Day 2 (Synapse Reinforcement)" },
    { day: 4, ret: 88, label: "Day 4 (First Review)" },
    { day: 8, ret: 84, label: "Day 8 (Deep Consolidation)" },
    { day: 16, ret: 81, label: "Day 16 (Permanent Recall)" },
    { day: 30, ret: 79, label: "Day 30 (Mastered)" },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Top Filter Tabs (Monochromatic & Clean) */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "all", label: "All Innovations (4)" },
            { id: "speaking", label: "Spoken Flashcard" },
            { id: "scrubber", label: "Phonetic Scrubber" },
            { id: "morph", label: "Executive Morph Slider" },
            { id: "decay", label: "Memory Decay Horizon" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as InnovationTab)}
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
          Zero-Nesting Spatial Standards
        </span>
      </div>

      {/* Grid of 4 Radically Innovative Masterpieces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* =========================================================================
            INNOVATION 1: CLEAN SPATIAL 3D SPEAKING FLASHCARD
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "speaking") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                01. Spatial 3D Speaking Flashcard
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Click or Space to Flip
              </span>
            </div>

            <div
              ref={card1Ref}
              onMouseMove={handleCard1MouseMove}
              onMouseLeave={handleCard1MouseLeave}
              className="w-full min-h-[420px] [perspective:1400px] cursor-pointer select-none"
              onClick={() => setCard1Flipped(!card1Flipped)}
            >
              <div
                className="relative w-full h-full min-h-[420px] rounded-3xl transition-transform duration-500 ease-out [transform-style:preserve-3d]"
                style={{
                  transform: `rotateY(${card1Tilt.x + (card1Flipped ? 180 : 0)}deg) rotateX(${card1Tilt.y}deg)`,
                }}
              >
                {/* Dynamic Specular Sheen */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(450px circle at ${card1Tilt.glareX}% ${card1Tilt.glareY}%, rgba(255,255,255,${card1Tilt.glareOpacity}), transparent 70%)`,
                  }}
                />

                {/* FRONT FACE */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden">
                  {/* Top Specular Hairline */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Header: Pure Monochromatic Typography */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span className="tracking-widest uppercase">Speaking • Modal Syntax</span>
                    <div className="flex items-center gap-3">
                      <span>Card 04/12</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCard1Bookmarked(!card1Bookmarked);
                        }}
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${card1Bookmarked ? "fill-white text-white" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Main Content (Breathable, zero nested boxes) */}
                  <div className="my-auto space-y-6 py-2">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-[#F87171]/80">
                        You Said
                      </span>
                      <p className="text-xl sm:text-2xl font-normal text-white/70 leading-relaxed pl-3 border-l border-[#F87171]/40">
                        "If we will deploy now, the server <span className="text-[#F87171] font-medium">might crashes</span>."
                      </p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-[#34D399]/80">
                          Better Way
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCard1AudioPlaying(!card1AudioPlaying);
                          }}
                          className="p-1 text-white/40 hover:text-white transition-colors"
                        >
                          <Volume2 className={`w-4 h-4 ${card1AudioPlaying ? "text-[#34D399] animate-pulse" : ""}`} />
                        </button>
                      </div>

                      <p className="text-xl sm:text-2xl font-medium text-white leading-relaxed pl-3 border-l border-[#34D399]/60">
                        "If we deploy now, the server <span className="text-[#34D399] font-semibold">might crash</span>."
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span className="flex items-center gap-1.5 text-white/60">
                      <RotateCw className="w-3 h-3" /> Click to inspect grammar rule
                    </span>
                    <span>SM-2 Interval</span>
                  </div>
                </div>

                {/* BACK FACE */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 bg-[#070612] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.95)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span className="tracking-widest uppercase">Grammar Rule & Context</span>
                    <span className="text-white/60">C1 Mastery</span>
                  </div>

                  <div className="my-auto space-y-4 py-2">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Correction Diff
                      </span>
                      <p className="text-sm font-mono text-white/80 pl-3 border-l border-white/20">
                        <span className="line-through text-white/40">will deploy / might crashes</span>{" "}
                        <span className="text-white/40">→</span>{" "}
                        <span className="text-[#34D399] font-semibold">deploy / might crash</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Spanish Translation
                      </span>
                      <p className="text-sm text-white/80 pl-3 border-l border-white/20">
                        "Si desplegamos ahora, el servidor podría fallar."
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
                        Rule
                      </span>
                      <p className="text-xs text-white/60 leading-relaxed pl-3 border-l border-white/20">
                        First conditional uses present simple after 'if'. Verbs following modal 'might' take bare infinitive without 'to'.
                      </p>
                    </div>
                  </div>

                  {/* 4 Minimalist Rating Chips */}
                  <div className="pt-3 border-t border-white/[0.04] grid grid-cols-4 gap-2">
                    {[
                      { id: 1, label: "Again", time: "<1m" },
                      { id: 2, label: "Hard", time: "12h" },
                      { id: 3, label: "Good", time: "1d" },
                      { id: 4, label: "Easy", time: "4d" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCard1Grade(btn.id);
                        }}
                        className={`py-1.5 px-2 rounded-xl text-center transition-all ${
                          card1Grade === btn.id
                            ? "bg-white text-black font-semibold"
                            : "bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        <span className="block text-xs font-medium">{btn.label}</span>
                        <span className="block text-[9px] font-mono opacity-50">{btn.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            INNOVATION 2: PHONETIC RESONANCE WAVEFORM SCRUBBER
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "scrubber") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                02. Phonetic Waveform Scrubber
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Drag Cursor Across Wave
              </span>
            </div>

            <div className="w-full min-h-[420px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Phonetic Formant • 48kHz</span>
                <span className="text-white/60">IPA: /rɪˈzɪl.jəns/</span>
              </div>

              {/* Word Display with Live Phoneme Highlight */}
              <div className="my-auto space-y-6 py-2">
                <div>
                  <div className="flex items-baseline gap-1 text-3xl sm:text-4xl font-light text-white tracking-wide">
                    <span className={hoveredPhoneme === "rɪ" ? "text-[#A27FF3] font-normal" : "text-white/40"}>re</span>
                    <span className={hoveredPhoneme === "zɪl" ? "text-[#34D399] font-normal" : "text-white/40"}>sil</span>
                    <span className={hoveredPhoneme === "jəns" || hoveredPhoneme === "s" ? "text-[#38BDF8] font-normal" : "text-white/40"}>ience</span>
                  </div>
                  <span className="text-xs text-white/40 mt-1 block">
                    Target Word: <strong>Resilience</strong> (Stress on 2nd syllable /'zɪl/)
                  </span>
                </div>

                {/* Interactive Waveform Scrubber Surface */}
                <div
                  ref={scrubberContainerRef}
                  onMouseMove={handleScrubberMove}
                  className="relative h-20 w-full flex items-center justify-between gap-1 cursor-ew-resize select-none"
                >
                  {/* Background Frequency Bars */}
                  {[25, 40, 65, 85, 45, 95, 70, 30, 80, 100, 60, 40, 75, 90, 50, 65, 35, 70, 85, 40, 55, 30].map(
                    (h, idx) => {
                      const barPercent = (idx / 22) * 100;
                      const isNearCursor = Math.abs(barPercent - scrubPosition) < 12;
                      return (
                        <div
                          key={idx}
                          className="w-full rounded-full transition-all duration-150"
                          style={{
                            height: `${h}%`,
                            backgroundColor: isNearCursor ? "#A27FF3" : "rgba(255, 255, 255, 0.12)",
                            opacity: isNearCursor ? 1 : 0.4,
                          }}
                        />
                      );
                    },
                  )}

                  {/* Scrubber Needle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none transition-all duration-75"
                    style={{ left: `${scrubPosition}%` }}
                  >
                    <div className="absolute -top-2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-mono font-bold">
                      {scrubPosition < 25 ? "rɪ" : scrubPosition < 55 ? "ˈzɪl" : "jəns"}
                    </div>
                  </div>
                </div>

                {/* Telemetry (Zero box clutter) */}
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/[0.04]">
                  <span>Formant F1: <strong className="text-white">480 Hz</strong></span>
                  <span>Formant F2: <strong className="text-white">1,920 Hz</strong></span>
                  <span>Clarity: <strong className="text-[#34D399]">98.6%</strong></span>
                </div>
              </div>

              {/* Footer Trigger */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsScrubAudioPlaying(!isScrubAudioPlaying)}
                  className="flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isScrubAudioPlaying ? "Playing Segment..." : "Play Native Audio"}
                </button>
                <span className="text-[11px] font-mono text-white/30">Scrubbed: {Math.round(scrubPosition)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            INNOVATION 3: FLUID EXECUTIVE SENTENCE MORPH SLIDER
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "morph") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                03. Executive Sentence Morph Slider
              </span>
              <span className="text-[11px] font-mono text-white/30">
                Drag Center Divider
              </span>
            </div>

            <div
              ref={morphContainerRef}
              onMouseMove={handleMorphMove}
              onMouseDown={() => setIsDraggingMorph(true)}
              onMouseUp={() => setIsDraggingMorph(false)}
              onMouseLeave={() => setIsDraggingMorph(false)}
              className="w-full min-h-[420px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden select-none"
            >
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Proposal Refactor • RFC</span>
                <span className="text-white/60">Brevity: +34% Gain</span>
              </div>

              {/* Interactive Morphing Canvas */}
              <div className="my-auto space-y-6 py-2">
                <div className="relative min-h-[140px] flex items-center">
                  {/* Left Layer: Verbose Draft */}
                  <div
                    className="absolute inset-0 flex flex-col justify-center overflow-hidden transition-opacity duration-150"
                    style={{ opacity: (100 - morphSplit) / 100 }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">
                      Original Conversational Draft
                    </span>
                    <p className="text-lg sm:text-xl font-normal text-white/50 leading-relaxed">
                      "We are thinking about making use of cache layers because we ran into a lot of latency problems last week."
                    </p>
                  </div>

                  {/* Right Layer: C2 Executive Polish */}
                  <div
                    className="absolute inset-0 flex flex-col justify-center overflow-hidden transition-opacity duration-150"
                    style={{ opacity: morphSplit / 100 }}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#34D399] mb-2">
                      C2 Executive Refinement
                    </span>
                    <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                      "We will <span className="text-[#34D399] font-semibold">leverage distributed caching</span> to <span className="text-[#34D399] font-semibold">mitigate latency bottlenecks</span>."
                    </p>
                  </div>
                </div>

                {/* Interactive Slider Track */}
                <div className="space-y-2 pt-4 border-t border-white/[0.04]">
                  <div className="relative w-full h-2 rounded-full bg-white/[0.06] cursor-ew-resize">
                    <div
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-white/20"
                      style={{ width: `${morphSplit}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)] cursor-grab active:cursor-grabbing -translate-x-1/2"
                      style={{ left: `${morphSplit}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>Draft (Conversational)</span>
                    <span className="text-white font-semibold">{Math.round(morphSplit)}% Polished</span>
                    <span>Executive (Decisive)</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>Active Voice: 100%</span>
                <span className="text-white/60">Drag slider to compare</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            INNOVATION 4: MATHEMATICAL MEMORY DECAY HORIZON (Ebbinghaus Curve)
           ========================================================================= */}
        {(activeTab === "all" || activeTab === "decay") && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase text-white/40 tracking-widest">
                04. Mathematical Memory Decay Horizon
              </span>
              <span className="text-[11px] font-mono text-white/30">
                SuperMemo-2 Ebbinghaus
              </span>
            </div>

            <div className="w-full min-h-[420px] rounded-3xl p-8 bg-[#04040A] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="tracking-widest uppercase">Memory Synapse Stability</span>
                <span className="text-white/60">SM-2 Algorithm</span>
              </div>

              {/* Mathematical Decay Graph */}
              <div className="my-auto space-y-4 py-2">
                <div>
                  <span className="text-2xl sm:text-3xl font-light text-white">
                    {decayPoints.find((p) => p.day === hoveredDay)?.ret || 88}% Retention
                  </span>
                  <span className="text-xs text-white/40 block mt-0.5">
                    {decayPoints.find((p) => p.day === hoveredDay)?.label || "Day 4 Review"}
                  </span>
                </div>

                {/* SVG Exponential Decay Curve */}
                <div className="relative h-24 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" fill="none">
                    {/* Background Grid Lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

                    {/* Smooth Decay Spline */}
                    <path
                      d="M 10 10 Q 60 25, 120 40 T 220 52 T 290 56"
                      stroke="#A27FF3"
                      strokeWidth="2"
                      fill="none"
                    />

                    {/* Interactive Synapse Nodes */}
                    {decayPoints.map((pt, idx) => {
                      const cx = 10 + idx * 56;
                      const cy = 80 - (pt.ret / 100) * 70;
                      const isSelected = pt.day === hoveredDay;
                      return (
                        <g
                          key={pt.day}
                          className="cursor-pointer"
                          onClick={() => setHoveredDay(pt.day)}
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isSelected ? 5 : 3}
                            fill={isSelected ? "#FFFFFF" : "#A27FF3"}
                            className="transition-all duration-200"
                          />
                          {isSelected && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={10}
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

                {/* Day Selector Pills (Minimal, zero loud colors) */}
                <div className="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/[0.04]">
                  {decayPoints.map((pt) => (
                    <button
                      key={pt.day}
                      type="button"
                      onClick={() => setHoveredDay(pt.day)}
                      className={`py-1 rounded-lg text-[10px] font-mono transition-all ${
                        hoveredDay === pt.day
                          ? "bg-white text-black font-semibold"
                          : "bg-white/[0.02] text-white/40 hover:text-white"
                      }`}
                    >
                      D+{pt.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/40">
                <span className="flex items-center gap-1.5 text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-[#34D399]" /> Optimal Recall Cadence
                </span>
                <span>Ease: 2.60x</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
