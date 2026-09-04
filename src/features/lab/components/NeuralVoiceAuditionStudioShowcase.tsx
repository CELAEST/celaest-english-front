import React, { useState, useRef, useEffect, useCallback } from "react";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";

export interface VoiceProfile {
  id: string;
  name: string;
  title: string;
  gender: "Female" | "Male";
  locale: string;
  accent: "American" | "British" | "Australian";
  role: "Flagship" | "Global";
  description: string;
  sampleText: string;
}

export interface DialogueTurn {
  id: string;
  speaker: "Christopher" | "Aria" | "Sonia" | "Natasha";
  voiceId: string;
  roleTitle: string;
  text: string;
}

export interface ScenarioDialogue {
  id: string;
  title: string;
  category: "INTERVIEW" | "INCIDENT" | "NEGOTIATION" | "ARCHITECTURE";
  description: string;
  turns: DialogueTurn[];
}

const FLAGSHIP_VOICES: VoiceProfile[] = [
  {
    id: "en-US-AriaNeural",
    name: "Aria",
    title: "Conversational & Interactive Mentor",
    gender: "Female",
    locale: "en-US · American",
    accent: "American",
    role: "Flagship",
    description: "Voz femenina estadounidense cálida, expresiva y fluida. Diseñada para tutoría pedagógica, fonética y comprensión lectora.",
    sampleText: "Welcome to CELAEST English. Clear articulation and steady cadence build immediate confidence in cross-functional squads.",
  },
  {
    id: "en-US-ChristopherNeural",
    name: "Christopher",
    title: "Executive Tech Lead Mentor",
    gender: "Male",
    locale: "en-US · American",
    accent: "American",
    role: "Flagship",
    description: "Voz masculina ejecutiva con tono pausado, sobrio y seguro. Diseñada para simulaciones de entrevistas de liderazgo y diseño de sistemas.",
    sampleText: "Could you walk me through your distributed system architecture and explain how you manage partition tolerance under high load?",
  },
];

const GLOBAL_VOICES: VoiceProfile[] = [
  {
    id: "en-GB-SoniaNeural",
    name: "Sonia",
    title: "British Oxford (RP)",
    gender: "Female",
    locale: "en-GB · British",
    accent: "British",
    role: "Global",
    description: "Auténtica pronunciación británica Received Pronunciation para entornos formales y académicos.",
    sampleText: "I should like to direct your attention to the strategic architectural implications of our upcoming platform release.",
  },
  {
    id: "en-GB-RyanNeural",
    name: "Ryan",
    title: "British Contemporary",
    gender: "Male",
    locale: "en-GB · British",
    accent: "British",
    role: "Global",
    description: "Cadencia británica contemporánea para debates técnicos y reuniones internacionales.",
    sampleText: "Right then, let's analyze the telemetry data from our automated deployment pipeline.",
  },
  {
    id: "en-AU-NatashaNeural",
    name: "Natasha",
    title: "Australian Bright",
    gender: "Female",
    locale: "en-AU · Australian",
    accent: "Australian",
    role: "Global",
    description: "Acento australiano nativo brillante y fluido para entrenar comprensión ante diversidad global.",
    sampleText: "G'day! Let's explore how active listening accelerates your professional English fluency.",
  },
  {
    id: "en-AU-WilliamNeural",
    name: "William",
    title: "Australian Composed",
    gender: "Male",
    locale: "en-AU · Australian",
    accent: "Australian",
    role: "Global",
    description: "Tono masculino australiano pausado y nítido para práctica conversacional inmersiva.",
    sampleText: "Consistent daily immersion is the most reliable way to achieve high-level language proficiency.",
  },
];

const SCENARIO_DIALOGUES: ScenarioDialogue[] = [
  {
    id: "system-design",
    title: "Senior System Design Interview",
    category: "INTERVIEW",
    description: "Simulación de entrevista técnica para Staff / Principal Engineer sobre tolerancia a fallos y concurrencia.",
    turns: [
      {
        id: "sd-1",
        speaker: "Christopher",
        voiceId: "en-US-ChristopherNeural",
        roleTitle: "Staff Interviewer (Christopher)",
        text: "Could you explain how your system handles partition tolerance when the message broker experiences network partition?",
      },
      {
        id: "sd-2",
        speaker: "Aria",
        voiceId: "en-US-AriaNeural",
        roleTitle: "Lead Candidate (Aria)",
        text: "We adopt an idempotent consumer model with exponential backoff and dead-letter queues to guarantee at-least-once delivery without state corruption.",
      },
      {
        id: "sd-3",
        speaker: "Christopher",
        voiceId: "en-US-ChristopherNeural",
        roleTitle: "Staff Interviewer (Christopher)",
        text: "Excellent strategy. And how do you mitigate the thundering herd problem during sudden cache invalidation?",
      },
      {
        id: "sd-4",
        speaker: "Aria",
        voiceId: "en-US-AriaNeural",
        roleTitle: "Lead Candidate (Aria)",
        text: "We implement probabilistic early expiration alongside distributed locks to ensure only a single worker refreshes the cache.",
      },
    ],
  },
  {
    id: "incident-postmortem",
    title: "Production Incident Post-Mortem",
    category: "INCIDENT",
    description: "Reunión de análisis de causa raíz tras un pico de latencia en microservicios.",
    turns: [
      {
        id: "ip-1",
        speaker: "Christopher",
        voiceId: "en-US-ChristopherNeural",
        roleTitle: "VP of Engineering (Christopher)",
        text: "Let's examine the timeline of yesterday's fourteen-minute latency spike during our peak transaction volume.",
      },
      {
        id: "ip-2",
        speaker: "Aria",
        voiceId: "en-US-AriaNeural",
        roleTitle: "Principal Reliability Engineer (Aria)",
        text: "The primary bottleneck was connection pool exhaustion caused by unindexed lookups on the audit ledger. We deployed an emergency hotfix with composite indexing.",
      },
      {
        id: "ip-3",
        speaker: "Christopher",
        voiceId: "en-US-ChristopherNeural",
        roleTitle: "VP of Engineering (Christopher)",
        text: "Good triage. What preventative guardrails are we putting in place for next week's global release?",
      },
      {
        id: "ip-4",
        speaker: "Aria",
        voiceId: "en-US-AriaNeural",
        roleTitle: "Principal Reliability Engineer (Aria)",
        text: "We're enabling automated query plan regression tests in CI and provisioning replica pools with adaptive timeout limits.",
      },
    ],
  },
  {
    id: "offer-negotiation",
    title: "Executive Compensation Negotiation",
    category: "NEGOTIATION",
    description: "Diálogo de negociación salarial y paquete de acciones para un rol de liderazgo internacional.",
    turns: [
      {
        id: "on-1",
        speaker: "Christopher",
        voiceId: "en-US-ChristopherNeural",
        roleTitle: "Hiring Executive (Christopher)",
        text: "We are truly excited to extend this Principal Architect offer with a base salary of one hundred and ninety thousand dollars.",
      },
      {
        id: "on-2",
        speaker: "Aria",
        voiceId: "en-US-AriaNeural",
        roleTitle: "Executive Candidate (Aria)",
        text: "Thank you for the generous offer. Given my track record in spearheading distributed platform transitions, I'd like to align on two hundred and ten thousand with accelerated equity vesting.",
      },
    ],
  },
];

const CATEGORIZED_SCRIPTS = [
  {
    category: "Engineering Standup",
    items: [
      {
        title: "Microservice Refactoring",
        text: "Yesterday, I refactored the ingestion pipeline and resolved a subtle race condition in our webhook listener.",
      },
      {
        title: "Idempotent Retry Policy",
        text: "We have configured idempotent retry policies across our distributed event brokers to prevent double billing.",
      },
    ],
  },
  {
    category: "Phonetics & Pronunciation Pairs",
    items: [
      {
        title: "Vowel Length (Ship vs Sheep)",
        text: "Observe how the short vowel in 'ship' contrasts with the prolonged vowel sound in 'sheep'. Keep your jaw relaxed.",
      },
      {
        title: "Tricky Consonants (Through vs Thorough)",
        text: "A thorough review ensured we navigated through the deployment without unexpected downtime.",
      },
    ],
  },
  {
    category: "Executive Leadership & Strategy",
    items: [
      {
        title: "Balancing Velocity & Quality",
        text: "Our primary objective is striking the right balance between rapid deployment velocity and long-term architectural resilience.",
      },
      {
        title: "Stakeholder Alignment",
        text: "Proactive communication and concise articulation build immediate trust across distributed executive stakeholders.",
      },
    ],
  },
];

export const NeuralVoiceAuditionStudioShowcase: React.FC = () => {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("en-US-AriaNeural");
  const [textInput, setTextInput] = useState<string>(CATEGORIZED_SCRIPTS[0].items[0].text);
  const [speedRate, setSpeedRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [activeAuditionId, setActiveAuditionId] = useState<string | null>(null);

  // Multi-Turn Dialogue State
  const [activeDialogueId, setActiveDialogueId] = useState<string>(SCENARIO_DIALOGUES[0].id);
  const [activeDialogueTurnIdx, setActiveDialogueTurnIdx] = useState<number | null>(null);
  const isDialoguePlayingRef = useRef<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const allVoices = [...FLAGSHIP_VOICES, ...GLOBAL_VOICES];
  const selectedVoice = allVoices.find((v) => v.id === selectedVoiceId) || FLAGSHIP_VOICES[0];
  const selectedDialogue = SCENARIO_DIALOGUES.find((d) => d.id === activeDialogueId) || SCENARIO_DIALOGUES[0];

  useEffect(() => {
    return () => {
      isDialoguePlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      if (isPlaying) {
        phase += 0.08;
        const numWaves = 2;
        for (let w = 0; w < numWaves; w++) {
          ctx.beginPath();
          const amp = (height * 0.35) / (w + 1);
          const freq = 0.02 + w * 0.012;

          ctx.strokeStyle = w === 0 ? "rgba(196, 181, 253, 0.85)" : "rgba(162, 127, 243, 0.4)";
          ctx.lineWidth = w === 0 ? 1.5 : 1.0;

          for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin(x * freq + phase + w * 1.5) * amp * Math.sin((x / width) * Math.PI);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (isBuffering) {
        phase += 0.05;
        ctx.strokeStyle = "rgba(162, 127, 243, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.035 + phase) * 6 * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.025) * 2.5 * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  }, [isPlaying, isBuffering]);

  useEffect(() => {
    drawWaveform();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawWaveform]);

  const handlePlaySingle = async (
    textToSpeak: string,
    voiceIdToUse: string,
    auditionKey?: string,
  ): Promise<void> => {
    const trimmed = textToSpeak.trim();
    if (!trimmed) return;

    if (isPlaying && activeAuditionId === auditionKey) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setActiveAuditionId(null);
      return;
    }

    setIsBuffering(true);
    if (auditionKey) setActiveAuditionId(auditionKey);

    const startTime = performance.now();

    return new Promise((resolve) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const streamUrl = `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(trimmed)}&voice=${encodeURIComponent(voiceIdToUse)}&rate=${encodeURIComponent(speedRate >= 1 ? `+${Math.round((speedRate - 1) * 100)}%` : `-${Math.round((1 - speedRate) * 100)}%`)}`;

      const audio = new Audio(streamUrl);
      audio.playbackRate = speedRate;
      audioRef.current = audio;

      audio.onplay = () => {
        const elapsed = Math.round(performance.now() - startTime);
        setLatencyMs(elapsed);
        setIsBuffering(false);
        setIsPlaying(true);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setActiveAuditionId(null);
        resolve();
      };

      audio.onerror = () => {
        logger.warn("[TTS] Stream unreachable, playing fallback");
        playFallback(trimmed, voiceIdToUse, startTime, resolve);
      };

      audio.play().catch(() => {
        playFallback(trimmed, voiceIdToUse, startTime, resolve);
      });
    });
  };

  const playFallback = (
    text: string,
    voiceId: string,
    startTime: number,
    onFinish?: () => void,
  ) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsPlaying(false);
      setIsBuffering(false);
      setActiveAuditionId(null);
      onFinish?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speedRate;
    utterance.lang = voiceId.includes("GB") ? "en-GB" : voiceId.includes("AU") ? "en-AU" : "en-US";

    utterance.onstart = () => {
      setLatencyMs(Math.round(performance.now() - startTime));
      setIsBuffering(false);
      setIsPlaying(true);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setActiveAuditionId(null);
      onFinish?.();
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsBuffering(false);
      setActiveAuditionId(null);
      onFinish?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Play Full Multi-Turn Dialogue
  const handlePlayFullDialogue = async (dialogue: ScenarioDialogue) => {
    if (isDialoguePlayingRef.current) {
      isDialoguePlayingRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setActiveDialogueTurnIdx(null);
      return;
    }

    isDialoguePlayingRef.current = true;

    for (let i = 0; i < dialogue.turns.length; i++) {
      if (!isDialoguePlayingRef.current) break;
      const turn = dialogue.turns[i];
      setActiveDialogueTurnIdx(i);
      await handlePlaySingle(turn.text, turn.voiceId, `dialogue-${turn.id}`);
      // Short conversational pause between turns
      if (isDialoguePlayingRef.current && i < dialogue.turns.length - 1) {
        await new Promise((r) => setTimeout(r, 450));
      }
    }

    isDialoguePlayingRef.current = false;
    setActiveDialogueTurnIdx(null);
    setIsPlaying(false);
  };

  return (
    <div className="w-full flex flex-col space-y-7 rounded-3xl bg-[#04040A] border border-white/[0.07] p-6 lg:p-9 text-white shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.22em] text-white/40 uppercase">
              CELAEST Neural Speech Pipeline
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10.5px] font-mono text-[#C4B5FD]">
              Instant Stream (&lt;150ms)
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-sans font-light tracking-tight text-[#F8F8F8]">
            Flagship Audio Mentors & Real-World Dialogue Studio
          </h3>
        </div>

        {/* Active Telemetry */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span>Active:</span>
          <span className="text-[#C4B5FD] font-medium">{selectedVoice.name}</span>
          {latencyMs !== null && (
            <span className="text-emerald-400 font-light">({latencyMs}ms)</span>
          )}
        </div>
      </div>

      {/* SECTION 1: THE FLAGSHIP DUO HERO CARDS (Aria & Christopher) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FLAGSHIP_VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          const isVoicePlaying = isPlaying && activeAuditionId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => setSelectedVoiceId(voice.id)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                isSelected
                  ? "bg-white/[0.03] border-[#A27FF3]/60 shadow-[0_8px_32px_rgba(162,127,243,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.025]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-sans font-medium text-white tracking-tight">
                      {voice.name}
                    </h4>
                    <span className="text-[10.5px] font-mono text-white/40 tracking-wider">
                      {voice.gender === "Female" ? "Mentor Femenina ♀" : "Mentor Masculino ♂"}
                    </span>
                  </div>
                  <span className="text-xs text-[#9E9EBD] font-light mt-0.5">
                    {voice.title}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaySingle(voice.sampleText, voice.id, voice.id);
                  }}
                  title="Audicionar voz"
                  disabled={isBuffering}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isVoicePlaying
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      : isSelected
                      ? "bg-[#A27FF3]/20 border-[#A27FF3]/40 text-[#C4B5FD] hover:bg-[#A27FF3]/30"
                      : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:text-white hover:border-white/20"
                  }`}
                >
                  {isVoicePlaying ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>Audition</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#8A8A9E] font-light leading-relaxed">
                {voice.description}
              </p>

              <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-white/30">
                <span>{voice.locale}</span>
                <span className={isSelected ? "text-[#C4B5FD] font-medium" : "text-white/40"}>
                  {isSelected ? "Active Mentor" : "Select"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: DUAL-MENTOR MULTI-TURN DIALOGUE SIMULATOR */}
      <div className="flex flex-col space-y-4 pt-3 border-t border-white/[0.06]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase block">
              Simulación de Diálogos en Vivo (Christopher & Aria)
            </span>
            <h4 className="text-sm sm:text-base font-sans font-normal text-white mt-0.5">
              Escucha a ambos mentores interactuando en escenarios reales de ingeniería
            </h4>
          </div>

          {/* Dialogue Scenario Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
            {SCENARIO_DIALOGUES.map((dialogue) => (
              <button
                key={dialogue.id}
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    isDialoguePlayingRef.current = false;
                    audioRef.current?.pause();
                    setIsPlaying(false);
                  }
                  setActiveDialogueId(dialogue.id);
                  setActiveDialogueTurnIdx(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeDialogueId === dialogue.id
                    ? "bg-white/[0.08] text-white font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {dialogue.title.split(" ")[0]} {dialogue.title.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Dialogue Stage */}
        <div className="bg-white/[0.015] border border-white/[0.06] rounded-2xl p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
            <div>
              <span className="text-xs font-medium text-[#F8F8F8] block">{selectedDialogue.title}</span>
              <p className="text-[11px] text-[#8A8A9E] font-light mt-0.5">{selectedDialogue.description}</p>
            </div>

            {/* Play Full Dialogue Button */}
            <button
              type="button"
              onClick={() => handlePlayFullDialogue(selectedDialogue)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                activeDialogueTurnIdx !== null
                  ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                  : "bg-[#A27FF3]/20 border-[#A27FF3]/40 text-[#C4B5FD] hover:bg-[#A27FF3]/30"
              }`}
            >
              {activeDialogueTurnIdx !== null ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                  <span>Detener Diálogo</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Reproducir Diálogo Completo</span>
                </>
              )}
            </button>
          </div>

          {/* Turns Chat Bubbles */}
          <div className="flex flex-col space-y-3">
            {selectedDialogue.turns.map((turn, idx) => {
              const isTurnActive = activeDialogueTurnIdx === idx;
              const isTurnPlaying = isPlaying && activeAuditionId === `dialogue-${turn.id}`;
              const isChristopher = turn.speaker === "Christopher";

              return (
                <div
                  key={turn.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                    isTurnActive
                      ? "bg-white/[0.05] border-[#A27FF3]/60 shadow-[0_0_20px_rgba(162,127,243,0.1)] ring-1 ring-[#A27FF3]/40"
                      : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isChristopher ? "text-[#7DD3FC]" : "text-[#F472B6]"
                        }`}
                      >
                        {turn.roleTitle}
                      </span>
                      {isTurnActive && (
                        <span className="text-[10px] font-mono text-[#A27FF3] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-pulse" />
                          Hablando...
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#C5C6D0] font-light leading-relaxed">
                      "{turn.text}"
                    </p>
                  </div>

                  {/* 1-Click Single Turn Audition Button */}
                  <button
                    type="button"
                    onClick={() => handlePlaySingle(turn.text, turn.voiceId, `dialogue-${turn.id}`)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer shrink-0 mt-0.5 ${
                      isTurnPlaying
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : "bg-white/[0.03] border-white/[0.06] text-white/60 hover:text-white hover:border-white/20"
                    }`}
                    title="Escuchar este turno"
                  >
                    {isTurnPlaying ? (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: CATEGORIZED SCRIPT LIBRARY & DRILLS */}
      <div className="flex flex-col space-y-3 pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
          Biblioteca de Guiones Técnicos & Ejercicios Fonéticos
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {CATEGORIZED_SCRIPTS.map((cat) => (
            <div
              key={cat.category}
              className="bg-white/[0.015] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between space-y-3"
            >
              <span className="text-xs font-medium text-[#C4B5FD] font-mono block">
                {cat.category}
              </span>

              <div className="flex flex-col space-y-2 flex-1">
                {cat.items.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setTextInput(item.text)}
                    className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex flex-col space-y-1 ${
                      textInput === item.text
                        ? "bg-white/[0.06] border-[#A27FF3]/50 text-white"
                        : "bg-transparent border-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="font-medium text-[11.5px] text-[#F8F8F8]">{item.title}</span>
                    <span className="text-[10.5px] text-[#8A8A9E] font-light line-clamp-2 leading-relaxed">
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: GLOBAL ACCENTS GRID */}
      <div className="flex flex-col space-y-2.5 pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
          Acentos Internacionales de Exposición
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {GLOBAL_VOICES.map((voice) => {
            const isSelected = voice.id === selectedVoiceId;
            const isVoicePlaying = isPlaying && activeAuditionId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => setSelectedVoiceId(voice.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "bg-white/[0.04] border-[#A27FF3]/50 text-white"
                    : "bg-white/[0.015] border-white/[0.05] hover:border-white/[0.1] text-white/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">{voice.name}</span>
                    <span className="text-[10px] font-mono text-white/40">{voice.accent}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySingle(voice.sampleText, voice.id, voice.id);
                    }}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isVoicePlaying
                        ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                        : "bg-white/[0.03] border-white/[0.06] text-[#C4B5FD] hover:text-white"
                    }`}
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <p className="text-[11px] text-[#8A8A9E] font-light line-clamp-1">
                  {voice.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: CUSTOM TEXT WORKBENCH & RESONANCE CANVAS */}
      <div className="flex flex-col space-y-3 pt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
            Workbench Personalizado
          </span>
          <span className="text-[11px] font-mono text-[#9E9EBD]">
            Sintetizando con: <strong className="text-white font-medium">{selectedVoice.name}</strong>
          </span>
        </div>

        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={3}
          className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#A27FF3]/60 focus:bg-white/[0.03] rounded-2xl p-3.5 text-xs sm:text-sm text-[#F8F8F8] placeholder-white/20 transition-all outline-none resize-none leading-relaxed font-light"
          placeholder="Escribe cualquier frase para escuchar la voz..."
        />

        {/* Playback Controls & Waveform Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/[0.06] p-3 rounded-2xl">
          {/* Waveform Canvas */}
          <div className="h-10 flex-1 bg-black/40 rounded-xl overflow-hidden border border-white/[0.04] flex items-center justify-center relative">
            <canvas ref={canvasRef} width={380} height={40} className="w-full h-full block" />
            {!isPlaying && !isBuffering && (
              <span className="absolute text-[9.5px] font-mono text-white/25 uppercase tracking-widest pointer-events-none">
                Idle Resonance Canvas
              </span>
            )}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 shrink-0 self-center sm:self-auto">
            {[0.75, 0.85, 1.0, 1.15].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setSpeedRate(rate)}
                className={`text-[11px] px-2 py-1 rounded-md font-mono transition-all cursor-pointer ${
                  speedRate === rate
                    ? "bg-white/[0.1] text-white font-medium"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Master Play Button */}
          <button
            type="button"
            onClick={() => handlePlaySingle(textInput, selectedVoiceId, "custom-workbench")}
            disabled={isBuffering}
            className={`px-5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
              isPlaying && activeAuditionId === "custom-workbench"
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                : isBuffering
                ? "bg-white/[0.05] border border-white/[0.1] text-white/50 cursor-wait"
                : "bg-white/[0.08] border border-white/20 hover:bg-white/[0.15] text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            }`}
          >
            {isPlaying && activeAuditionId === "custom-workbench" ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>Pause</span>
              </>
            ) : isBuffering ? (
              <span>Streaming...</span>
            ) : (
              <>
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Synthesize with {selectedVoice.name}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
