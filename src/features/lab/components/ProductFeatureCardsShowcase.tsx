import React, { useState, useId } from "react";
import { Card } from "../../../design-system/components/Card/Card";
import {
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Bookmark,
  Play,
  RotateCw,
  Lock,
} from "lucide-react";

/**
 * Bespoke Master Vector Icon Suite (CELAEST / Apple / Linear Standard).
 * Built with unique SVG gradients, multi-layer depth, and precision geometry.
 */
export const MasterBespokeIcons = {
  MemoryVault: ({ className = "w-6 h-6" }: { className?: string }) => {
    const baseId = useId();
    const gradId = `memVaultGrad-${baseId}`;
    const glowId = `memVaultGlow-${baseId}`;

    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#A27FF3" />
            <stop offset="100%" stopColor="#7048E8" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#7048E8" floodOpacity="0.5" />
          </filter>
        </defs>
        {/* Outer Synaptic Shield */}
        <path
          d="M16 3L28 8V16C28 23 22.8 28.5 16 30C9.2 28.5 4 23 4 16V8L16 3Z"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
        {/* Inner Brain Cortex Loop */}
        <path
          d="M16 9V23M11 13C9.5 13 8.5 14 8.5 15.5C8.5 17 9.5 18 11 18H16M21 13C22.5 13 23.5 14 23.5 15.5C23.5 17 22.5 18 21 18H16"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="2" fill="#34D399" />
      </svg>
    );
  },

  ReadingCodex: ({ className = "w-6 h-6" }: { className?: string }) => {
    const baseId = useId();
    const gradId = `readCodexGrad-${baseId}`;

    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#7048E8" />
          </linearGradient>
        </defs>
        {/* 3D Open Codex Spine */}
        <path
          d="M4 8C8.5 6 13 7.5 16 9C19 7.5 23.5 6 28 8V24C23.5 22 19 23.5 16 25C13 23.5 8.5 22 4 24V8Z"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 9V25" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" />
        {/* Paragraph Etchings */}
        <path d="M8 12C10.5 11.2 13 12 13 12M8 16C10.5 15.2 13 16 13 16" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        <path d="M19 12C21.5 11.2 24 12 24 12M19 16C21.5 15.2 24 16 24 16" stroke="#A27FF3" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        {/* Specular Bookmark Ribbon */}
        <path d="M16 6V13L14 11.5L12 13V6" fill="#F472B6" opacity="0.9" />
      </svg>
    );
  },

  WritingQuill: ({ className = "w-6 h-6" }: { className?: string }) => {
    const baseId = useId();
    const gradId = `writQuillGrad-${baseId}`;

    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <path
          d="M26 6L14 18L10 22L11 18L22 7L26 6Z"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 26H14" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="24" cy="8" r="1.5" fill="#34D399" />
        <path d="M18 10L22 14" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  },

  InterviewAcoustics: ({ className = "w-6 h-6" }: { className?: string }) => {
    const baseId = useId();
    const gradId = `intAcoustGrad-${baseId}`;

    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        {/* Dynamic Studio Mic Capsule */}
        <rect x="12" y="5" width="8" height="13" rx="4" stroke={`url(#${gradId})`} strokeWidth="1.75" />
        <path d="M7 14C7 18.97 11.03 23 16 23C20.97 23 25 18.97 25 14" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M16 23V28M11 28H21" stroke="#FFFFFF" strokeWidth="1.75" strokeLinecap="round" />
        {/* Acoustic Wave Emission Rings */}
        <path d="M4 11C3 13 3 15 4 17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M28 11C29 13 29 15 28 17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <circle cx="16" cy="11.5" r="1.5" fill="#F59E0B" />
      </svg>
    );
  },

  MentorNexus: ({ className = "w-6 h-6" }: { className?: string }) => {
    const baseId = useId();
    const gradId = `mentNexGrad-${baseId}`;

    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#7048E8" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        {/* 4-Point Nexus Core */}
        <path
          d="M16 2L19.5 12.5L30 16L19.5 19.5L16 30L12.5 19.5L2 16L12.5 12.5L16 2Z"
          stroke={`url(#${gradId})`}
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="16" r="3" fill="#C4B5FD" fillOpacity="0.4" stroke="#FFFFFF" strokeWidth="1" />
      </svg>
    );
  },
};

export const ProductFeatureCardsShowcase: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<"ambitious" | "resilience" | "scalability">("ambitious");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isMemoryFlipped, setIsMemoryFlipped] = useState(false);
  const [activeInterviewRole, setActiveInterviewRole] = useState<string>("Staff Engineer");

  const wordData = {
    ambitious: {
      ipa: "/æmˈbɪʃəs/",
      pos: "adjective",
      cefr: "B2",
      spanish: "ambicioso / ambiciosa",
      def: "Having or showing a strong desire and determination to succeed.",
      ex: "Understanding how to use 'ambitious' enriches your professional communication.",
    },
    resilience: {
      ipa: "/rɪˈzɪl.jəns/",
      pos: "noun",
      cefr: "C1",
      spanish: "resiliencia / capacidad de recuperación",
      def: "The capacity to withstand or to recover quickly from difficulties; toughness.",
      ex: "Architecting for resilience guarantees zero downtime in mission-critical services.",
    },
    scalability: {
      ipa: "/ˌskeɪ.ləˈbɪl.ə.ti/",
      pos: "noun",
      cefr: "B2",
      spanish: "escalabilidad",
      def: "The capacity to be changed in size or scale.",
      ex: "Horizontal scalability allows distributed nodes to handle increased network traffic.",
    },
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Introduction Subhead */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8a8a9e]">
          Real production feature cards mapped to CELAEST Lingua modules with bespoke vector iconography (SF Symbols & Linear standard).
        </p>
        <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          5 Live Interactive Modules
        </span>
      </div>

      {/* Grid of 5 Real Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* =========================================================================
            FEATURE 1: MEMORY VAULT (Spaced Repetition SM-2 Deck)
           ========================================================================= */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-[#A27FF3] tracking-widest mb-2 flex items-center justify-between">
            <span>Memory • Flashcards Deck</span>
            <span className="text-[9px] text-[#A27FF3] bg-[#A27FF3]/10 px-1.5 py-0.5 rounded">
              SM-2 Algorithm
            </span>
          </span>

          <Card variant="spotlight" interactive className="h-full flex flex-col justify-between group">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#7048E8]/15 border border-[#7048E8]/30 flex items-center justify-center text-[#A27FF3] group-hover:scale-105 transition-transform shadow-[0_4px_16px_rgba(112,72,232,0.2)]">
                    <MasterBespokeIcons.MemoryVault />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">SRS Memory Vault</h3>
                    <span className="text-[10px] text-[#8a8a9e]">Active Vocabulary Retention</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMemoryFlipped(!isMemoryFlipped);
                  }}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#8a8a9e] hover:text-white transition-colors"
                  title="Flip card preview"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive Card Surface */}
              <div
                onClick={() => setIsMemoryFlipped(!isMemoryFlipped)}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] cursor-pointer hover:border-[#7048E8]/40 transition-colors my-2 relative overflow-hidden"
              >
                {!isMemoryFlipped ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">
                        Spoken Hesitation
                      </span>
                      <span className="text-[10px] font-mono text-[#8a8a9e]">Front Face</span>
                    </div>
                    <p className="text-xs font-semibold text-white">"We will implements the solution."</p>
                    <span className="text-[10px] text-[#8a8a9e] block mt-1">Click to reveal better way →</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
                        ✓ Master Form
                      </span>
                      <span className="text-[10px] font-mono text-[#34D399]">Back Face</span>
                    </div>
                    <p className="text-xs font-semibold text-[#34D399]">"We will implement the solution."</p>
                    <span className="text-[10px] text-[#8a8a9e] block mt-1">Modal 'will' requires bare infinitive.</span>
                  </div>
                )}
              </div>

              {/* Retention Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/[0.04] text-center">
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[9px] text-[#8a8a9e] block">Due Today</span>
                  <span className="text-xs font-bold text-[#F59E0B]">12 cards</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[9px] text-[#8a8a9e] block">Stability</span>
                  <span className="text-xs font-bold text-[#34D399]">94.8%</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[9px] text-[#8a8a9e] block">Interval</span>
                  <span className="text-xs font-bold text-white">x2.60</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-[#8a8a9e]">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-[#34D399]" /> AES-256</span>
              <span className="text-[#A27FF3] font-medium flex items-center gap-1">
                Start Practice <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            FEATURE 2: READING & LEXICON CODEX (16.3k Clean PostgreSQL Dictionary)
           ========================================================================= */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-[#38BDF8] tracking-widest mb-2 flex items-center justify-between">
            <span>Reading • Lexicon Codex</span>
            <span className="text-[9px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">
              16.3k Master Words
            </span>
          </span>

          <Card variant="holographic" interactive className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shadow-[0_4px_16px_rgba(56,189,248,0.2)]">
                    <MasterBespokeIcons.ReadingCodex />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Interactive Codex</h3>
                    <span className="text-[10px] text-[#8a8a9e]">Tap any word to inspect</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  {wordData[selectedWord].cefr} Level
                </span>
              </div>

              {/* Interactive Word Selectors */}
              <div className="flex items-center gap-1.5 mb-2.5">
                {(["ambitious", "resilience", "scalability"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWord(w)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                      selectedWord === w
                        ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                        : "bg-white/[0.03] text-[#8a8a9e] border border-white/[0.05] hover:text-white"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Live Mini-Lexicon Popup Preview */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white capitalize">{selectedWord}</span>
                    <span className="text-[11px] font-mono text-[#C4B5FD]">{wordData[selectedWord].ipa}</span>
                    <span className="text-[9px] text-[#8a8a9e]">• {wordData[selectedWord].pos}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="p-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-[#38BDF8] transition-colors"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse text-[#34D399]" : ""}`} />
                  </button>
                </div>
                <p className="text-[11px] text-[#34D399] font-medium">🇪🇸 {wordData[selectedWord].spanish}</p>
                <p className="text-[10px] text-[#8a8a9e] leading-snug line-clamp-2">{wordData[selectedWord].def}</p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className="text-[#38BDF8] hover:text-white transition-colors flex items-center gap-1"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-[#38BDF8]" : ""}`} />
                {isSaved ? "Saved to Memory" : "Add to Memory"}
              </button>
              <span className="font-mono text-white/40">0 ms latency</span>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            FEATURE 3: WRITING & TECHNICAL PROPOSAL EVALUATION
           ========================================================================= */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-widest mb-2 flex items-center justify-between">
            <span>Writing • Rubric Evaluator</span>
            <span className="text-[9px] text-[#34D399] bg-[#34D399]/10 px-1.5 py-0.5 rounded">
              Realtime Feedback
            </span>
          </span>

          <Card variant="spotlight" interactive className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shadow-[0_4px_16px_rgba(52,211,153,0.2)]">
                    <MasterBespokeIcons.WritingQuill />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Writing Evaluator</h3>
                    <span className="text-[10px] text-[#8a8a9e]">Proposal & Essay Diagnostic</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded-md">
                  92/100
                </span>
              </div>

              {/* Rubric Score Progress Bars */}
              <div className="space-y-2 my-2">
                {[
                  { label: "Clarity & Tone", score: 94, color: "from-[#34D399] to-[#38BDF8]" },
                  { label: "Grammar & Syntax", score: 88, color: "from-[#7048E8] to-[#A27FF3]" },
                  { label: "Vocabulary Richness", score: 96, color: "from-[#F59E0B] to-[#F472B6]" },
                ].map((item) => (
                  <div key={item.label} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-[#8a8a9e]">
                      <span>{item.label}</span>
                      <span className="font-mono text-white/80">{item.score}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Corrective Feedback Callout */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] mt-2">
                <span className="text-[10px] text-[#34D399] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Strong executive brevity
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
              <span>320 words analyzed</span>
              <span className="font-mono text-white/50">SHA-256 Cached</span>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            FEATURE 4: AI MOCK INTERVIEW & SPEECH FORMANT
           ========================================================================= */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-[#F59E0B] tracking-widest mb-2 flex items-center justify-between">
            <span>Interview • Live Practice</span>
            <span className="text-[9px] text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">
              Voice AI
            </span>
          </span>

          <Card variant="accent" interactive className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] shadow-[0_4px_16px_rgba(245,158,11,0.2)]">
                    <MasterBespokeIcons.InterviewAcoustics />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Mock Interviewer</h3>
                    <span className="text-[10px] text-[#8a8a9e]">System Design & Leadership</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-ping" />
                  Live Turn
                </span>
              </div>

              {/* Role Selector Pill */}
              <div className="p-1 rounded-xl bg-black/40 border border-white/[0.05] flex items-center justify-between gap-1 mb-2.5">
                {(["Staff Engineer", "Product Lead", "CTO"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setActiveInterviewRole(r)}
                    className={`py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                      activeInterviewRole === r
                        ? "bg-[#7048E8] text-white border border-[#8B5CF6]"
                        : "text-[#8a8a9e] hover:text-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Active Prompt Preview */}
              <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.05] space-y-1">
                <span className="text-[10px] font-mono text-[#A27FF3]">Question 3 of 5</span>
                <p className="text-xs text-white leading-relaxed">
                  "How do you resolve latency bottlenecks in event-driven microservices architectures?"
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
              <span>Pace: 138 WPM</span>
              <span className="text-[#34D399] font-medium flex items-center gap-1">
                <Play className="w-3 h-3 fill-[#34D399]" /> Resume Turn
              </span>
            </div>
          </Card>
        </div>

        {/* =========================================================================
            FEATURE 5: ADAPTIVE AI MENTOR COPILOT
           ========================================================================= */}
        <div className="flex flex-col">
          <span className="text-[11px] font-mono uppercase text-[#C4B5FD] tracking-widest mb-2 flex items-center justify-between">
            <span>Mentor • Adaptive Copilot</span>
            <span className="text-[9px] text-[#C4B5FD] bg-[#C4B5FD]/10 px-1.5 py-0.5 rounded">
              Linguistic AI
            </span>
          </span>

          <Card variant="mesh" interactive className="h-full flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#7048E8]/20 border border-[#7048E8]/30 flex items-center justify-center text-[#C4B5FD] shadow-[0_4px_16px_rgba(196,181,253,0.2)]">
                    <MasterBespokeIcons.MentorNexus />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Mentor Guidance</h3>
                    <span className="text-[10px] text-[#8a8a9e]">Personalized Roadmap</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#F59E0B] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" /> 24d
                </span>
              </div>

              {/* Personalized Insight Pill */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.05] space-y-1.5 my-1">
                <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider">
                  Target Goal: Tech Career & AI
                </span>
                <p className="text-xs text-white/90 leading-relaxed">
                  "Your active technical vocabulary grew by 18% this week. Focus next on conditional clauses for negotiation."
                </p>
              </div>

              {/* Tagged Focus Topics */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {["Consensus Protocols", "Subjunctive Mood", "Idiomatic Fluency"].map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] font-mono text-[#A27FF3] bg-[#7048E8]/10 border border-[#7048E8]/20 px-2 py-0.5 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#8a8a9e]">
              <span>Next Check-In: Today</span>
              <span className="text-[#C4B5FD] font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> View Insights
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
