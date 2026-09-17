import React, { useState, useMemo } from "react";
import {
  StudioProfile,
  PureAmbientBorderlessVariant,
  PureMinimalistTypographyVariant,
  CuratedEditorialGlassVariant,
  CuratedCameoJewelsVariant,
  StimulerSpeakingStudioVariant,
  AppleVisionSpatialVariant,
  LinearCleanPrecisionVariant,
  VisionSpatialGlassVariant,
  LinearObsidianVariant,
  AtelierEditorialVariant,
  NordicTactileVariant,
  SpatialLuxuryVariant,
  WorkspaceContextImagePicker,
} from "./workspace-studio";
import { WorkspacePromptBar } from "../../workspace/components/WorkspacePromptBar";

export type AllVariantId =
  | "pure_ambient"
  | "pure_minimal"
  | "curated_editorial"
  | "curated_cameo"
  | "stimuler_speaking"
  | "apple_vision"
  | "linear_precision"
  | "vision_spatial"
  | "linear_obsidian"
  | "atelier_editorial"
  | "nordic_tactile"
  | "spatial";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<AllVariantId>("pure_ambient");
  const [activeTrack, setActiveTrack] = useState<"tech" | "executive" | "product" | "medicine">("tech");
  const [cardsCount, setCardsCount] = useState<number>(6);
  const [cefrLevel, setCefrLevel] = useState<string>("B1");
  const [approvedNotification, setApprovedNotification] = useState<string | null>(null);

  // Context-Aware Image Candidates State for Pure Ambient Variant
  const [activeSlot, setActiveSlot] = useState<"memory" | "reading" | "speaking">("memory");
  const [selectedMemorySrc, setSelectedMemorySrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("celaest_slot1_memory_img") || "/assets/vocab_headphones_focus.jpg";
    }
    return "/assets/vocab_headphones_focus.jpg";
  });
  const [selectedReadingSrc, setSelectedReadingSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("celaest_slot2_reading_img") || "/assets/reading_modern_architecture.jpg";
    }
    return "/assets/reading_modern_architecture.jpg";
  });
  const [selectedSpeakingSrc, setSelectedSpeakingSrc] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("celaest_slot3_speaking_img") || "/assets/speaking_studio_mic.jpg";
    }
    return "/assets/speaking_studio_mic.jpg";
  });

  const handleApproveCombination = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("celaest_slot1_memory_img", selectedMemorySrc);
      localStorage.setItem("celaest_slot2_reading_img", selectedReadingSrc);
      localStorage.setItem("celaest_slot3_speaking_img", selectedSpeakingSrc);
    }
    setApprovedNotification("✓ ¡COMBINACIÓN DE IMÁGENES GUARDADA Y APROBADA CON ÉXITO!");
    setTimeout(() => setApprovedNotification(null), 4000);
  };

  // Dynamic Multi-Domain Profiles
  const trackData = useMemo(() => {
    return {
      tech: {
        profession: "Software Engineer",
        learningGoal: "Distributed Systems & Latency Review",
        memoryWord: "bottleneck",
        readingArticle: "Architectural Paradigm Shifts in Business",
        readingTimeMin: 4,
        readingCefr: "C1",
        wordCount: 179,
        interviewTitle: "Tech Career & AI Simulation",
        interviewRound: "Round 01",
      },
      executive: {
        profession: "Executive Director",
        learningGoal: "Boardroom Risk Framing & Concision",
        memoryWord: "leverage",
        readingArticle: "The Decisive Executive: Leading Consensus",
        readingTimeMin: 5,
        readingCefr: "C2",
        wordCount: 220,
        interviewTitle: "Boardroom Executive Simulation",
        interviewRound: "Round 02",
      },
      product: {
        profession: "Product Director",
        learningGoal: "Framing ROI Before Engineering Velocity",
        memoryWord: "stakeholder buy-in",
        readingArticle: "Framing Value Before Engineering Velocity",
        readingTimeMin: 3,
        readingCefr: "C1",
        wordCount: 165,
        interviewTitle: "Product Strategy & ROI Simulation",
        interviewRound: "Round 01",
      },
      medicine: {
        profession: "Cardiology Fellow",
        learningGoal: "Diagnostic Case Presentation & Consultations",
        memoryWord: "differential diagnosis",
        readingArticle: "Hemodynamic Monitoring in Critical Care",
        readingTimeMin: 4,
        readingCefr: "C1",
        wordCount: 195,
        interviewTitle: "Clinical Case Presentation Simulation",
        interviewRound: "Round 01",
      },
    };
  }, []);

  const currentTrack = trackData[activeTrack];

  const studioProfile: StudioProfile = useMemo(() => {
    return {
      userName: "Esteban Perez",
      profession: currentTrack.profession,
      learningGoal: currentTrack.learningGoal,
      cefrLevel: `${cefrLevel} Level`,
      cardsDue: cardsCount,
      wordCount: currentTrack.wordCount,
      audioKhz: "48kHz Live Audio",
      retentionRate: 94,
      memoryWord: currentTrack.memoryWord,
      readingArticle: currentTrack.readingArticle,
      readingTimeMin: currentTrack.readingTimeMin,
      readingCefr: currentTrack.readingCefr,
      interviewTitle: currentTrack.interviewTitle,
      interviewRound: currentTrack.interviewRound,
    };
  }, [currentTrack, cefrLevel, cardsCount]);

  const handleAction = (actionId: string) => {
    setApprovedNotification(`✓ Acción activada: ${actionId.toUpperCase()}`);
    setTimeout(() => setApprovedNotification(null), 2500);
  };

  const topBenchmarkVariants = [
    {
      id: "pure_ambient" as const,
      label: "1. Pure Ambient (Sin Bordes · Fotos Reales)",
      badge: "Cero Bolitas · Cero Bordes · Fotos Reales",
      desc: "Cero marcos salidos, cero colores chillones y cero bolitas verdes. Fotografía documental real humana (estudio, biblioteca, reunión) completamente integrada.",
      tag: "TOP RECOMENDADO",
    },
    {
      id: "pure_minimal" as const,
      label: "2. Pure Minimalist Typography",
      badge: "Tipografía Desnuda · Zero Clutter",
      desc: "Sin imágenes, sin cajas, sin bordes. Jerarquía tipográfica pura en blanco #FFFFFF sobre la habitación 3D con respiración máxima.",
      tag: "MINIMALISMO PURO",
    },
    {
      id: "curated_editorial" as const,
      label: "3. Curated Glass Window",
      badge: "Arte & Cristal Ahumado",
      desc: "Contenedores de cristal ahumado transparente con obras de arte arquitectónicas en miniatura.",
      tag: "CRISTAL EDITORIAL",
    },
    {
      id: "stimuler_speaking" as const,
      label: "4. Stimuler Speaking Studio",
      badge: "Stimuler.tech Style",
      desc: "Enfoque oral conversacional sin imágenes, micro-telemetría de fluidez y ornamentos flotantes.",
      tag: "BENCHMARK ORAL",
    },
  ];



  const secondaryVariants = [
    {
      id: "vision_spatial" as const,
      label: "Vision Glass",
      badge: "Apple Smoked",
    },
    {
      id: "linear_obsidian" as const,
      label: "Linear Obsidian",
      badge: "Dark Engine",
    },
    {
      id: "atelier_editorial" as const,
      label: "Atelier Swiss",
      badge: "Stripe Press",
    },
    {
      id: "nordic_tactile" as const,
      label: "Nordic Studio",
      badge: "Teenage Eng",
    },
    {
      id: "spatial" as const,
      label: "Spatial Pure",
      badge: "B&O Minimal",
    },
  ];



  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Header Control Ribbon */}
      <div className="w-full flex flex-col space-y-4 p-4 sm:p-5 rounded-3xl bg-[#04040A] border border-[#A27FF3]/30 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A78BFA]">
                STUDIO DE ALTA GAMA · ARTE CINEMATOGRÁFICO & SPATIAL CLEAN
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#DDD6FE] animate-pulse">
                ✦ 4 Benchmarks de Máxima Categoría
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-white mt-1">
              Workspace Top Architecture: Arte Visual, Letras & Cristal Espacial
            </h2>
            <p className="text-xs text-[#8a8a9e] mt-0.5">
              Fotografía editorial y prisma de cristal en armonía con la orbe viva y la habitación 3D (<code className="text-[#A27FF3]">home.mp4</code>). Cero cajas pesadas.
            </p>
          </div>

          {/* Action to approve */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setApprovedNotification(`✓ [${activeVariant.toUpperCase()}] APROBADO COMO DISEÑO DEFINITIVO!`);
                setTimeout(() => setApprovedNotification(null), 4000);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#C084FC] hover:from-[#6D28D9] hover:to-[#A855F7] text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all cursor-pointer hover:scale-[1.03]"
            >
              Aprobar Este Diseño
            </button>
          </div>
        </div>

        {/* 4 TOP WORLD-CLASS BENCHMARK CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {topBenchmarkVariants.map((v) => {
            const isSelected = activeVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVariant(v.id)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-300 cursor-pointer border flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-b from-[#1c123d] to-[#0d0722] border-[#C4B5FD] shadow-[0_0_30px_rgba(162,127,243,0.35)] scale-[1.01]"
                    : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/20 blur-2xl pointer-events-none" />
                )}
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#A27FF3]/20 border border-[#A27FF3]/40 text-[#DDD6FE] font-bold">
                      {v.tag}
                    </span>
                    <span className="text-[9px] font-mono text-white/40">
                      {v.badge}
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold mt-1 ${isSelected ? "text-white" : "text-white/80"}`}>
                    {v.label}
                  </h3>
                  <p className="text-[11px] text-[#8e90a5] mt-1 line-clamp-2 leading-[1.4]">
                    {v.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Secondary Variants Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-[10px] font-mono uppercase text-white/40 mr-1">
              Otras Exploraciones de Lujo:
            </span>
            {secondaryVariants.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveVariant(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                  activeVariant === c.id
                    ? "bg-white/20 text-white border border-white/40"
                    : "bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Role & Level calibrators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1">Rol:</span>
              {[
                { id: "tech" as const, label: "Engineer" },
                { id: "executive" as const, label: "Executive" },
                { id: "product" as const, label: "Product" },
                { id: "medicine" as const, label: "Physician" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveTrack(d.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    activeTrack === d.id
                      ? "bg-[#6344E6]/40 border border-[#8B5CF6] text-white font-medium"
                      : "bg-white/[0.02] text-white/40 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1">Nivel:</span>
              {["B1", "B2", "C1", "C2"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setCefrLevel(lvl)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    cefrLevel === lvl
                      ? "bg-white/25 text-white font-bold"
                      : "bg-white/[0.02] text-white/40 hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase text-white/40 mr-1">Cards:</span>
              {[0, 6, 18].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCardsCount(c)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                    cardsCount === c
                      ? "bg-white/25 text-white font-bold"
                      : "bg-white/[0.02] text-white/40 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Feedback Notification Toast */}
      {approvedNotification && (
        <div className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-[#7C3AED]/20 to-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-semibold text-center shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-fadeSlideUp">
          {approvedNotification}
        </div>
      )}

      {/* 2.5 Contextual Image Studio Picker (Active when Pure Ambient is selected) */}
      {activeVariant === "pure_ambient" && (
        <WorkspaceContextImagePicker
          activeSlot={activeSlot}
          onChangeSlot={setActiveSlot}
          selectedMemorySrc={selectedMemorySrc}
          selectedReadingSrc={selectedReadingSrc}
          selectedSpeakingSrc={selectedSpeakingSrc}
          onSelectMemorySrc={setSelectedMemorySrc}
          onSelectReadingSrc={setSelectedReadingSrc}
          onSelectSpeakingSrc={setSelectedSpeakingSrc}
          onApproveCombination={handleApproveCombination}
        />
      )}

      {/* 3. Hero Stage Container with Real 3D Ambient Video (home.mp4) */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.95)] min-h-[660px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between select-none">
        {/* Real 3D Ambient Background Video with Master Seamless Loop */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030208]">
          <video
            src="/assets/home.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/workspace_room_bg.png"
            className="w-full h-full object-cover object-[55%_88%] sm:object-[56%_92%] lg:object-[58%_97%] pointer-events-none select-none opacity-100 transition-all duration-300"
            style={{
              willChange: "transform",
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
            }}
          />
          {/* Subtle Vignettes for Pure Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/30 to-[#030208]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/35 via-transparent to-[#030208]/85 pointer-events-none" />
        </div>

        {/* TOP ROW: Dynamic Active Variant */}
        <div className="relative z-20 w-full max-w-[1380px] mx-auto pt-2">
          {activeVariant === "pure_ambient" && (
            <PureAmbientBorderlessVariant
              profile={studioProfile}
              onSelectAction={handleAction}
              memoryImage={selectedMemorySrc}
              readingImage={selectedReadingSrc}
              speakingImage={selectedSpeakingSrc}
            />
          )}
          {activeVariant === "pure_minimal" && (
            <PureMinimalistTypographyVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "curated_editorial" && (
            <CuratedEditorialGlassVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "curated_cameo" && (
            <CuratedCameoJewelsVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "stimuler_speaking" && (
            <StimulerSpeakingStudioVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "apple_vision" && (
            <AppleVisionSpatialVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "linear_precision" && (
            <LinearCleanPrecisionVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "vision_spatial" && (
            <VisionSpatialGlassVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "linear_obsidian" && (
            <LinearObsidianVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "atelier_editorial" && (
            <AtelierEditorialVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "nordic_tactile" && (
            <NordicTactileVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
          {activeVariant === "spatial" && (
            <SpatialLuxuryVariant profile={studioProfile} onSelectAction={handleAction} />
          )}
        </div>

        {/* BOTTOM ROW: Exact Clean Prompt Bar (Confirmed Perfect by User) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto pt-8 pb-1">
          <WorkspacePromptBar onSubmitPrompt={(p) => handleAction(`Prompt: ${p}`)} />
        </div>
      </div>
    </div>
  );
};
