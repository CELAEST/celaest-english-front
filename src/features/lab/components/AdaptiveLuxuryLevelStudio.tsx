import React, { useState } from "react";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface CefrMetadata {
  code: CefrLevel;
  title: string;
  subtext: string;
  rolePersona: string;
  colorHex: string;
  glowRgba: string;
  badgeAccent: string;
}

const CEFR_SPECTRUM: Record<CefrLevel, CefrMetadata> = {
  A1: {
    code: "A1",
    title: "Breakthrough Origin",
    subtext: "Vocabulario esencial y oraciones simples de trabajo",
    rolePersona: "Junior Developer / Entry Apprentice",
    colorHex: "#38BDF8",
    glowRgba: "rgba(56, 189, 248, 0.35)",
    badgeAccent: "text-[#7DD3FC] border-[#38BDF8]/30 bg-[#38BDF8]/10",
  },
  A2: {
    code: "A2",
    title: "Foundation Bridge",
    subtext: "Rutinas diarias, solicitudes sencillas y bugs menores",
    rolePersona: "Associate Engineer / Support Specialist",
    colorHex: "#34D399",
    glowRgba: "rgba(52, 211, 153, 0.35)",
    badgeAccent: "text-[#6EE7B7] border-[#34D399]/30 bg-[#34D399]/10",
  },
  B1: {
    code: "B1",
    title: "Autonomous Dialogue",
    subtext: "Actualizaciones de sprint, standups y resolución de problemas",
    rolePersona: "Mid-Level Professional / Product Owner",
    colorHex: "#A78BFA",
    glowRgba: "rgba(167, 139, 250, 0.35)",
    badgeAccent: "text-[#C4B5FD] border-[#A78BFA]/30 bg-[#A78BFA]/10",
  },
  B2: {
    code: "B2",
    title: "Professional Vantage",
    subtext: "Metodología STAR, code reviews técnicos y negociación de plazos",
    rolePersona: "Senior Engineer / Tech Lead / Product Manager",
    colorHex: "#C084FC",
    glowRgba: "rgba(192, 132, 252, 0.35)",
    badgeAccent: "text-[#DDD6FE] border-[#C084FC]/30 bg-[#C084FC]/10",
  },
  C1: {
    code: "C1",
    title: "Architectural Mastery",
    subtext: "Sistemas distribuidos, compensaciones de diseño y post-mortems",
    rolePersona: "Staff Engineer / Engineering Director / Principal PM",
    colorHex: "#F59E0B",
    glowRgba: "rgba(245, 158, 11, 0.35)",
    badgeAccent: "text-[#FCD34D] border-[#F59E0B]/30 bg-[#F59E0B]/10",
  },
  C2: {
    code: "C2",
    title: "Executive Sovereign",
    subtext: "Retórica de alto impacto, estrategia de junta directiva y persuasión",
    rolePersona: "VP of Engineering / CTO / Founder & CEO",
    colorHex: "#E5C07B",
    glowRgba: "rgba(229, 192, 123, 0.45)",
    badgeAccent: "text-[#FDE68A] border-[#E5C07B]/40 bg-[#E5C07B]/15",
  },
};

interface AdaptivePedagogicalScenario {
  level: CefrLevel;
  headline: string;
  pedagogicalRole: string;
  empatheticDiagnosis: string;
  pocketPhraseEn: string;
  pocketPhrasePhonetic: string;
  pocketPhraseEs: string;
  readyTemplate: string;
  starFocus: string;
  sampleQuestion: string;
}

const PEDAGOGICAL_DATA: Record<CefrLevel, AdaptivePedagogicalScenario> = {
  A1: {
    level: "A1",
    headline: "Tutor Empático de Aprendizaje (Paso a Paso)",
    pedagogicalRole: "Personal Language Tutor · Guía Amable",
    empatheticDiagnosis:
      "¡Gran esfuerzo al responder! Notamos tu iniciativa de comunicación. Para que tus ideas fluyan con total confianza sin dudar, enfócate en oraciones con un solo verbo activo.",
    pocketPhraseEn: "I prioritize my daily tasks every morning.",
    pocketPhrasePhonetic: "ai prai-OR-i-taiz mai DEY-li tasks EV-ri MOR-ning",
    pocketPhraseEs: "Organizo mis tareas diarias cada mañana.",
    readyTemplate: "I usually use [Herramienta] because [Razón simple].",
    starFocus: "Estructura Base: Sujeto + Verbo + Complemento directo.",
    sampleQuestion: "What tools do you use in your daily routine?",
  },
  A2: {
    level: "A2",
    headline: "Tutor de Consolidación y Rutinas de Trabajo",
    pedagogicalRole: "Applied Skills Tutor · Scaffolding Didáctico",
    empatheticDiagnosis:
      "Comunicaste la idea central. Para conectar mejor tus frases, usaremos conectores simples de tiempo como 'first', 'then' y 'because'.",
    pocketPhraseEn: "First I check high-priority bugs, then I update the team.",
    pocketPhrasePhonetic: "ferst ai chek hai-prai-OR-i-ti bags, dhen ai ap-DEYT dha teem",
    pocketPhraseEs: "Primero reviso los errores urgentes, luego actualizo al equipo.",
    readyTemplate: "When I have a blocker, I immediately tell my team.",
    starFocus: "Conectores de Secuencia: First -> Then -> Finally.",
    sampleQuestion: "How do you handle an unexpected bug before a release?",
  },
  B1: {
    level: "B1",
    headline: "Coach de Diálogo y Fluidez Profesional",
    pedagogicalRole: "Career Speech Coach · Fluidez Continua",
    empatheticDiagnosis:
      "Fluidez clara y buen vocabulario de trabajo. Recuerda evitar el falso amigo 'actual' (actual = real; usa 'current' para referirte al presente).",
    pocketPhraseEn: "In my current workflow, I balance delivery speed with code quality.",
    pocketPhrasePhonetic: "in mai KER-ent WORK-floh, ai BAL-ens de-LIV-ri speed widh kohd KWOL-i-ti",
    pocketPhraseEs: "En mi flujo de trabajo actual, equilibro velocidad de entrega con calidad de código.",
    readyTemplate: "When priorities shift, I evaluate the impact on [Sprint Goal].",
    starFocus: "Método STAR inicial: Contexto de situación y acción tomada.",
    sampleQuestion: "How do you handle conflicting priorities from different stakeholders?",
  },
  B2: {
    level: "B2",
    headline: "Coach STAR y Negociación Técnica",
    pedagogicalRole: "Senior Interview Strategist · Metodología STAR",
    empatheticDiagnosis:
      "Excelente desarrollo argumentativo. Para elevar tu impacto al nivel senior, articula las alternativas que descartaste antes de tomar la decisión.",
    pocketPhraseEn: "To mitigate timeline risk, I renegotiated scope early with the PM.",
    pocketPhrasePhonetic: "tu MIT-i-geyt TAIM-lain risk, ai ree-ne-GOH-shee-ey-tid skohp ER-li",
    pocketPhraseEs: "Para mitigar el riesgo de tiempo, renegocié el alcance tempranamente con el PM.",
    readyTemplate: "To address [Problem], I proposed [Alternative A] over [Alternative B] because [Trade-off].",
    starFocus: "STAR Completo: Situación, Tarea, Acción y Resultado Cuantificado.",
    sampleQuestion: "Describe a project where you had to push back on unrealistic deadlines.",
  },
  C1: {
    level: "C1",
    headline: "Asesor de Arquitectura y Liderazgo Técnico",
    pedagogicalRole: "Principal Systems Advisor · Pensamiento Sistémico",
    empatheticDiagnosis:
      "Articulación sofisticada de trade-offs de arquitectura. Para afilar tu síntesis ejecutiva, cuantifica el impacto en costos de infraestructura o latencia.",
    pocketPhraseEn: "We decoupled ingestion from processing, reducing peak latency by [X]%.",
    pocketPhrasePhonetic: "wee dee-KAP-eld in-JES-chen frem PRO-ses-ing, re-DYOO-sing peek LAY-ten-si",
    pocketPhraseEs: "Desacoplamos la ingesta del procesamiento, reduciendo la latencia pico en [X]%.",
    readyTemplate: "By architecting for [System Attribute], we safeguarded [Business Metric] during [High-Load Event].",
    starFocus: "Trade-offs Sistémicos: Latencia vs Consistencia vs Costo Operativo.",
    sampleQuestion: "How do you architect resilient services under unpredictable peak loads?",
  },
  C2: {
    level: "C2",
    headline: "Asesor Ejecutivo y Retórica de Alto Impacto",
    pedagogicalRole: "Executive Board Advisor · Retórica y Persuasión",
    empatheticDiagnosis:
      "Presencia y cadencia nativa sobresalientes. Recomendación: lidera con el resultado macro de negocio (Bottom-line upfront) antes de desglosar la estrategia técnica.",
    pocketPhraseEn: "I aligned cross-functional leadership to sunset legacy debt, accelerating roadmap velocity by [X]%.",
    pocketPhrasePhonetic: "ai e-LAIND kros-FANGK-shen-el LEE-der-ship tu SAN-set LEG-e-si det",
    pocketPhraseEs: "Alineé al liderazgo multidisciplinario para retirar deuda heredada, acelerando el roadmap en [X]%.",
    readyTemplate: "At an organizational level, I drove [Strategic Shift], yielding [Business ROI].",
    starFocus: "Bottom-Line Upfront (BLUF): Resultado macro -> Estrategia -> Gobernanza.",
    sampleQuestion: "How do you align competing engineering and executive priorities across teams?",
  },
};

/* ─── BESPOKE LEVEL SF-STYLE ICONS ─────────────────────────────────── */

function LevelCompassIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.25" stroke={color} strokeWidth="1.3" strokeOpacity="0.4" />
      <polygon points="12,4.5 15,12 12,10 9,12" fill={color} />
      <polygon points="12,19.5 15,12 12,14 9,12" fill={color} fillOpacity="0.3" />
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

function LevelBridgeIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M3 18C7.5 10 16.5 10 21 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14" x2="8" y2="18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
      <line x1="12" y1="12" x2="12" y2="18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
      <line x1="16" y1="14" x2="16" y2="18" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
    </svg>
  );
}

function LevelDialogueIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C10.5 20 9.1 19.58 7.9 18.86L4 20L5.14 16.1C4.42 14.9 4 13.5 4 12Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="15" cy="12" r="1" fill={color} />
    </svg>
  );
}

function LevelStarApexIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        stroke={color}
        strokeWidth="1.4"
        fill={color}
        fillOpacity="0.25"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

function LevelPillarIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="4" x2="20" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="7" x2="18" y2="7" stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="8" y1="7" x2="8" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="7" x2="12" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="7" x2="16" y2="17" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="6" y1="17" x2="18" y2="17" stroke={color} strokeWidth="1.2" strokeOpacity="0.7" />
      <line x1="4" y1="20" x2="20" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LevelCrownIcon({ color }: { color: string }) {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 17L5 7L9.5 12L12 5L14.5 12L19 7L21 17H3Z"
        stroke={color}
        strokeWidth="1.4"
        fill={color}
        fillOpacity="0.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="5" cy="6" r="1.1" fill={color} />
      <circle cx="12" cy="4" r="1.1" fill={color} />
      <circle cx="19" cy="6" r="1.1" fill={color} />
      <line x1="3" y1="19" x2="21" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getLevelIcon(level: CefrLevel, color: string) {
  switch (level) {
    case "A1":
      return <LevelCompassIcon color={color} />;
    case "A2":
      return <LevelBridgeIcon color={color} />;
    case "B1":
      return <LevelDialogueIcon color={color} />;
    case "B2":
      return <LevelStarApexIcon color={color} />;
    case "C1":
      return <LevelPillarIcon color={color} />;
    case "C2":
      return <LevelCrownIcon color={color} />;
  }
}

interface WritingSuggestionCategory {
  category: string;
  description: string;
  phrases: string[];
}

const WRITING_SUGGESTIONS_DATA: Record<CefrLevel, WritingSuggestionCategory> = {
  A1: {
    category: "Pistas Iniciales para Romper el Bloqueo",
    description: "Oraciones cortas y de cortesía directa para que un principiante empiece a escribir sin dudar.",
    phrases: [
      "I am writing to update you about...",
      "Could you please help me with...",
      "Today I finished working on...",
      "Please let me know if this works.",
    ],
  },
  A2: {
    category: "Conectores de Rutina y Estado",
    description: "Estructuras para reportar avance, notificar un bug o coordinar un cambio de horario.",
    phrases: [
      "Regarding the issue we discussed earlier, ...",
      "I have updated the status of the task to...",
      "We resolved the problem after testing...",
      "Feel free to reach out if you have questions.",
    ],
  },
  B1: {
    category: "Desarrollo Profesional y Justificación",
    description: "Frases con conectores para argumentar decisiones de sprint y balances de trabajo.",
    phrases: [
      "Following up on our sprint review sync, ...",
      "In order to avoid release delays, I suggest...",
      "We observed that the main bottleneck was...",
      "I will keep you posted as soon as we deploy.",
    ],
  },
  B2: {
    category: "Negociación y Gestión de Riesgos",
    description: "Formulaciones para renegociar plazos, clarificar requerimientos complejos y liderar.",
    phrases: [
      "To mitigate the delivery risk, we propose decoupling...",
      "From a scalability perspective, the trade-off implies...",
      "We prioritized this hotfix over new feature requests because...",
      "I recommend scheduling a brief alignment call to...",
    ],
  },
  C1: {
    category: "Comunicación Ejecutiva y Arquitectura",
    description: "Registro de alta dirección, RFCs técnicos y análisis de impacto en sistemas.",
    phrases: [
      "Balancing technical debt against throughput velocity, ...",
      "We re-architected the ingestion layer to guarantee...",
      "Our post-mortem analysis revealed an edge condition in...",
      "This proposal aligns directly with our quarterly SLA target.",
    ],
  },
  C2: {
    category: "Persuasión y Liderazgo de Junta Directiva",
    description: "Retórica impecable de alto impacto, síntesis ejecutiva y gobernanza.",
    phrases: [
      "At an organizational level, this strategic shift optimizes...",
      "I drove cross-functional consensus to deprecate the legacy pipeline...",
      "This architecture safeguards business continuity while yielding [X]% efficiency.",
      "The bottom line is that our preventative strategy averted downtime.",
    ],
  },
};

export const AdaptiveLuxuryLevelStudio: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>("A1");
  const [activeTab, setActiveTab] = useState<"pedagogy" | "writing_suggestions" | "showcase" | "hud_preview">("pedagogy");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [simulatedDraft, setSimulatedDraft] = useState<string>("");

  const meta = CEFR_SPECTRUM[selectedLevel];
  const scenario = PEDAGOGICAL_DATA[selectedLevel];

  const handlePlayPocketPhrase = () => {
    if (isPlayingAudio) {
      SpeechSynthesisService.stop();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    // Beginner levels get slightly slower speech rate (0.85x) for perfect comprehension
    const rate = selectedLevel === "A1" || selectedLevel === "A2" ? 0.85 : 0.95;
    SpeechSynthesisService.speak(scenario.pocketPhraseEn, {
      rate,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(scenario.pocketPhraseEn);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2200);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#04040A] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden p-6 sm:p-8 flex flex-col space-y-8 animate-[fadeIn_0.5s_ease-out_both]">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* 1. Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#A78BFA] shadow-[0_0_8px_#A78BFA]" />
            <span className="text-[11px] font-mono tracking-[0.25em] text-white/50 uppercase">
              ANTI-AI ULTRA-LUXURY STUDIO · LABS 00.E
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-tight">
            Adaptive CEFR Intelligence & Pedagogical Engine
          </h2>
          <p className="text-xs text-[#8a8a9e] max-w-2xl">
            Arquitectura de calibración multidimensional por Nivel CEFR y Profesión. Garantiza que
            el alumno nunca se frustre en niveles iniciales (A1/A2) recibiendo lecciones claras,
            mientras los líderes ejecutivos (C1/C2) reciben retórica y concisión de alto calibre.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex p-1 rounded-2xl bg-white/[0.03] border border-white/[0.07] shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("pedagogy")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "pedagogy"
                ? "bg-[#A78BFA]/20 text-white border border-[#A78BFA]/40 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            🎓 Motor Pedagógico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("writing_suggestions")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "writing_suggestions"
                ? "bg-[#A78BFA]/20 text-white border border-[#A78BFA]/40 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            ✍️ Sugerencias Writing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("showcase")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "showcase"
                ? "bg-[#A78BFA]/20 text-white border border-[#A78BFA]/40 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            ⌚ Relojería & Diseños
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hud_preview")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === "hud_preview"
                ? "bg-[#A78BFA]/20 text-white border border-[#A78BFA]/40 shadow-sm"
                : "text-white/50 hover:text-white"
            }`}
          >
            📐 HUD Production Spec
          </button>
        </div>
      </div>

      {/* 2. Interactive CEFR Level Selector Strip (Naked Horological Buttons) */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between text-xs text-white/50 px-1">
          <span className="font-mono text-[11px] tracking-wider uppercase">
            SELECCIONA NIVEL OBJETIVO CEFR
          </span>
          <span className="font-mono text-[11px] text-[#A78BFA]">
            {meta.rolePersona}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {(["A1", "A2", "B1", "B2", "C1", "C2"] as CefrLevel[]).map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const itemMeta = CEFR_SPECTRUM[lvl];
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => {
                  setSelectedLevel(lvl);
                  SpeechSynthesisService.stop();
                  setIsPlayingAudio(false);
                }}
                className={`group relative flex flex-col items-start p-3.5 rounded-2xl transition-all duration-300 text-left cursor-pointer overflow-hidden ${
                  isSelected
                    ? "bg-white/[0.07] border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.8)] scale-[1.02]"
                    : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10"
                }`}
              >
                {/* Specular indicator when active */}
                {isSelected && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: itemMeta.colorHex }}
                  />
                )}

                <div className="w-full flex items-center justify-between mb-2">
                  <span
                    className="font-mono text-base font-bold tracking-tight"
                    style={{ color: isSelected ? itemMeta.colorHex : "rgba(255,255,255,0.7)" }}
                  >
                    {lvl}
                  </span>
                  <div
                    className={`transition-transform duration-300 ${
                      isSelected ? "scale-110" : "opacity-40 group-hover:opacity-80"
                    }`}
                  >
                    {getLevelIcon(lvl, itemMeta.colorHex)}
                  </div>
                </div>

                <span className="text-[12px] font-medium text-white tracking-tight truncate w-full">
                  {itemMeta.title}
                </span>
                <span className="text-[10px] text-white/40 line-clamp-1 mt-0.5">
                  {itemMeta.subtext}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. TAB CONTENT: Pedagogical Feedback Studio */}
      {activeTab === "pedagogy" && (
        <div className="flex flex-col space-y-6 animate-[fadeIn_0.35s_ease-out_both]">
          {/* Main Simulation Banner */}
          <div className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-5 sm:p-7 overflow-hidden shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold border"
                    style={{
                      color: meta.colorHex,
                      borderColor: `${meta.colorHex}40`,
                      backgroundColor: `${meta.colorHex}15`,
                    }}
                  >
                    NIVEL {selectedLevel} · {meta.title}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-xs text-[#8a8a9e]">{scenario.pedagogicalRole}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light text-white tracking-tight">
                  {scenario.headline}
                </h3>
              </div>

              {/* Sample Question Context */}
              <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/70 max-w-md">
                <span className="text-white/40 block text-[10px] uppercase font-mono mb-0.5">
                  Pregunta de Práctica de Entrevista:
                </span>
                "{scenario.sampleQuestion}"
              </div>
            </div>

            {/* Grid with 3 Guided Learning Layers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-6">
              {/* Card 1: Empathetic Diagnosis in Spanish */}
              <div className="flex flex-col justify-between space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono uppercase text-white/50 tracking-wider">
                      Diagnóstico Didáctico (Español "tú")
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
                    "{scenario.empatheticDiagnosis}"
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-white/40">
                  {scenario.starFocus}
                </div>
              </div>

              {/* Card 2: Pocket Phrase with Phonetics & Audio TTS */}
              <div className="flex flex-col justify-between space-y-3 p-4 rounded-2xl bg-[#7048E8]/10 border border-[#7048E8]/25 shadow-[0_8px_24px_rgba(112,72,232,0.15)]">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-[#C4B5FD] tracking-wider flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      </svg>
                      Frase de Bolsillo para Practicar
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhrase}
                      className="text-[10px] text-white/50 hover:text-white cursor-pointer transition-colors"
                      title="Copiar frase en inglés"
                    >
                      {copiedNotification ? "✓ Copiado" : "Copiar"}
                    </button>
                  </div>

                  {/* The English Phrase */}
                  <p className="text-sm sm:text-[15px] font-medium text-white leading-snug">
                    "{scenario.pocketPhraseEn}"
                  </p>

                  {/* Friendly Phonetic Scaffolding */}
                  <div className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-[11px] font-mono text-[#DDD6FE]">
                    <span className="text-white/30 text-[9px] uppercase block">Pronunciación Guiada:</span>
                    {scenario.pocketPhrasePhonetic}
                  </div>

                  <p className="text-[11px] text-white/50 italic">
                    {scenario.pocketPhraseEs}
                  </p>
                </div>

                {/* Audio Listen Button */}
                <button
                  type="button"
                  onClick={handlePlayPocketPhrase}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10 active:scale-95"
                >
                  <svg className="w-3.5 h-3.5 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                  </svg>
                  <span>{isPlayingAudio ? "Pausar pronunciación" : "Escuchar pronunciación (Voz nativa)"}</span>
                </button>
              </div>

              {/* Card 3: Ready-to-Use Sentence Template */}
              <div className="flex flex-col justify-between space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-mono uppercase text-white/50 tracking-wider">
                      Plantilla Modelo para Memorizar
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] font-mono text-xs text-white/90 leading-relaxed">
                    {scenario.readyTemplate}
                  </div>
                  <p className="text-[11px] text-[#8a8a9e] leading-normal pt-1">
                    Úsala en la siguiente pregunta para estructurar tu respuesta sin quedarte en blanco.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-[10px] font-mono text-white/40">CALIBRACIÓN IA</span>
                  <span className="text-[10px] font-mono text-emerald-400">100% PERSONALIZADA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.B. TAB CONTENT: Writing Level-Based Suggestions (Anti-AI Minimalist Standard) */}
      {activeTab === "writing_suggestions" && (
        <div className="flex flex-col space-y-6 animate-[fadeIn_0.35s_ease-out_both]">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#A78BFA] tracking-widest">
                  ESPECIFICACIÓN DE REDACCIÓN SEGÚN NIVEL
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase">
                  {selectedLevel} · {meta.title}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                {WRITING_SUGGESTIONS_DATA[selectedLevel].category}
              </h3>
              <p className="text-xs text-white/60 max-w-xl">
                {WRITING_SUGGESTIONS_DATA[selectedLevel].description}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase text-white/40 block">Regla Estética:</span>
              <span className="text-xs font-mono text-white/80">Tipografía Desnuda · Cero Cajas</span>
            </div>
          </div>

          {/* Interactive Split Grid: Left = Naked Suggestions List, Right = Simulated Editor Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Naked Typography Suggestions */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
                  Frases de Apoyo Disponibles ({selectedLevel})
                </span>
                <span className="text-[10px] text-white/40">Haz clic en una frase para probar</span>
              </div>

              <div className="flex flex-col divide-y divide-white/[0.04]">
                {WRITING_SUGGESTIONS_DATA[selectedLevel].phrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSimulatedDraft((prev) => (prev ? `${prev} ${phrase}` : phrase));
                      setCopiedNotification(true);
                      setTimeout(() => setCopiedNotification(false), 2000);
                    }}
                    className="group py-3 px-2 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      {/* Delicate subtle dot marker (never saturated box) */}
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#A78BFA] transition-colors shrink-0" />
                      <span className="text-xs sm:text-[13px] font-sans text-white/70 group-hover:text-white transition-colors leading-relaxed">
                        "{phrase}"
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-white/30 group-hover:text-[#A78BFA] transition-all shrink-0">
                      <span className="hidden sm:inline text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Insertar
                      </span>
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-white/40 italic flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-white/30 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>En el editor real, estas sugerencias se integran de forma sutil en `WritingToolsCard` en la columna derecha, protegiendo el lienzo.</span>
              </div>
            </div>

            {/* Right Column: Simulated Live Editor Area */}
            <div className="flex flex-col space-y-3 p-5 rounded-2xl bg-black/50 border border-white/[0.08]">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono uppercase text-white/60">
                    Lienzo de Redacción Simulado (Writing Editor)
                  </span>
                </div>
                {simulatedDraft && (
                  <button
                    type="button"
                    onClick={() => setSimulatedDraft("")}
                    className="text-[10px] font-mono text-rose-400/80 hover:text-rose-300 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <textarea
                value={simulatedDraft}
                onChange={(e) => setSimulatedDraft(e.target.value)}
                placeholder="Haz clic en cualquier frase de la izquierda para verla insertada aquí..."
                rows={5}
                className="w-full bg-transparent resize-none border-none outline-none font-sans text-xs sm:text-[13px] text-white/90 placeholder-white/20 leading-relaxed"
              />

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-[10px] font-mono text-white/40">
                <span>Palabras: {simulatedDraft.trim().split(/\s+/).filter(Boolean).length}</span>
                <span className="text-[#A78BFA]">Calibrado para nivel {selectedLevel}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: Swiss Horological & UI Variants */}
      {activeTab === "showcase" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.35s_ease-out_both]">
          {/* Variant A: Swiss Horological Crown Dial */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#090A14] border border-white/[0.08] space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#E5C07B] uppercase tracking-widest">
                VARIANTE ALFA · RELOJERÍA SUIZA
              </span>
              <h3 className="text-base font-medium text-white tracking-tight">
                Horological Precision Bezel & Crown
              </h3>
              <p className="text-xs text-white/50">
                Inspirado en los biseles de alta relojería. Cero cajas invasivas. Micro-graduaciones
                radiales con iluminación de zafiro.
              </p>
            </div>

            {/* Interactive Bezel Rendering */}
            <div className="flex items-center justify-center py-6">
              <div className="relative w-48 h-48 rounded-full border border-white/[0.08] flex items-center justify-center p-3 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
                {/* 12 tick marks around perimeter */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[1.5px] h-2 bg-white/20"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-88px)`,
                    }}
                  />
                ))}

                {/* Central Crown Core */}
                <div
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-center p-4 border border-white/[0.15] shadow-xl"
                  style={{
                    background: "radial-gradient(circle, #0F0E17 0%, #04040A 100%)",
                  }}
                >
                  <div className="mb-1">{getLevelIcon(selectedLevel, meta.colorHex)}</div>
                  <span
                    className="text-2xl font-mono font-bold tracking-tight"
                    style={{ color: meta.colorHex }}
                  >
                    {selectedLevel}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                    CEFR TIER
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/[0.04]">
              <span>Tolerancia Óptica: 0.5px</span>
              <span className="font-mono text-white/60">OBSIDIAN GLASS</span>
            </div>
          </div>

          {/* Variant B: Seamless Telemetry Inline Capsule */}
          <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#090A14] border border-white/[0.08] space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-widest">
                VARIANTE BETA · HUD INLINE ZERO-CLUTTER
              </span>
              <h3 className="text-base font-medium text-white tracking-tight">
                Cosmic Floating Telemetry Capsule
              </h3>
              <p className="text-xs text-white/50">
                Se fusiona directamente con la línea de telemetría superior del HUD (`ROUND 01 · Q01/05`).
                No agrega filas adicionales ni desplaza el orbe central.
              </p>
            </div>

            {/* Simulated Clean HUD Header */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono text-[11px] text-white/50 font-semibold">ROUND 01</span>
                <span className="text-white/20">·</span>
                <span className="font-mono text-[11px] text-[#A78BFA] font-bold">01/05</span>
                <span className="text-white/20">·</span>
                <span className="text-white/70 text-xs font-medium truncate max-w-[120px]">
                  Software Engineer
                </span>
              </div>

              {/* The Seamless Level Capsule */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
                {getLevelIcon(selectedLevel, meta.colorHex)}
                <span className="text-xs font-mono font-bold" style={{ color: meta.colorHex }}>
                  {selectedLevel}
                </span>
                <span className="text-[10px] text-white/40 font-mono">TARGET</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] text-xs text-white/60 leading-relaxed">
              💡 <strong>Ventaja Clave:</strong> No crea un bloque secundario encima del orbe. El viewport se mantiene 100% verticalmente equilibrado sin barras invasivas.
            </div>

            <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/[0.04]">
              <span>Cero Cajas Agregadas</span>
              <span className="font-mono text-emerald-400">100% RESPONSIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: HUD Production Spec & Integration Blueprint */}
      {activeTab === "hud_preview" && (
        <div className="flex flex-col space-y-4 p-6 rounded-3xl bg-[#090A14] border border-white/[0.08] animate-[fadeIn_0.35s_ease-out_both]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#C4B5FD] uppercase tracking-widest">
              ARQUITECTURA DE INTEGRACIÓN EN PRODUCCIÓN
            </span>
            <h3 className="text-base font-medium text-white tracking-tight">
              Blueprint de Despliegue en Interview y Writing
            </h3>
            <p className="text-xs text-white/50">
              Ubicación anatómica de cada control para respetar el espacio visual del usuario y
              garantizar feedback pedagógico contextual.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🎙️</span> Vista de Interview (Oral)
              </h4>
              <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
                <li>
                  <strong>Móviles y Tablets (&lt; xl)</strong>: Integrado en `ResponsiveInterviewHUD` en el extremo superior derecho junto al control de velocidad de voz.
                </li>
                <li>
                  <strong>Escritorio (xl+)</strong>: Ubicado en `ConversationRightPanel` dentro de la tarjeta de perfil/rol como un selector táctil.
                </li>
                <li>
                  <strong>Arena Central</strong>: 100% libre de barras de herramientas adicionales. El orbe cósmico conserva su respiración y centrado espacial nativo.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span>✍️</span> Vista de Writing (Redacción)
              </h4>
              <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
                <li>
                  <strong>Encabezado de Tarea</strong>: Conserva su tipografía pura y el orbe cósmico flotante derecho sin botones incrustados en los títulos.
                </li>
                <li>
                  <strong>Panel Lateral Derecho</strong>: Integrado en las tarjetas de apoyo (`WritingAIMentorCard` / `WritingToolsCard`) para cambio de nivel con 1 click.
                </li>
                <li>
                  <strong>Niveles A1/A2</strong>: Límites de palabras adaptados (desde 20 palabras) para eliminar barreras iniciales de bloqueo.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
