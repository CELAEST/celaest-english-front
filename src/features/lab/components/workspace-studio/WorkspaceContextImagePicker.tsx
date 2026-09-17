import React from "react";

export interface ContextImageCandidate {
  id: string;
  name: string;
  context: string;
  actionExplanation: string;
  src: string;
  tag: string;
  isHuman: boolean;
}

export interface WorkspaceContextImagePickerProps {
  activeSlot: "memory" | "reading" | "speaking";
  onChangeSlot: (slot: "memory" | "reading" | "speaking") => void;
  selectedMemorySrc: string;
  selectedReadingSrc: string;
  selectedSpeakingSrc: string;
  onSelectMemorySrc: (src: string) => void;
  onSelectReadingSrc: (src: string) => void;
  onSelectSpeakingSrc: (src: string) => void;
  onApproveCombination: () => void;
}

export const MEMORY_CANDIDATES: ContextImageCandidate[] = [
  {
    id: "memory_3d_cards_stack",
    name: "Stack de Cards de Memoria 3D",
    context: "Flashcards de Active Recall & Leitner SRS",
    actionExplanation:
      "Mazo interactivo de tarjetas oscuras de memoria flotando en 3D con fonética, audio y botones de repetición espaciada.",
    src: "/assets/memory_3d_cards_stack.jpg",
    tag: "Cards de Memoria · 3D",
    isHuman: false,
  },
  {
    id: "memory_purple_neural_brain",
    name: "Cerebro 3D & Neuro-Aprendizaje",
    context: "Consolidación de Memoria y Conexiones",
    actionExplanation:
      "Visualización tridimensional de un cerebro humano con filamentos y sinapsis violetas luminosas de alta retención.",
    src: "/assets/memory_purple_neural_brain.jpg",
    tag: "Cerebro 3D · Neuro-Ciencia",
    isHuman: false,
  },
  {
    id: "memory_glowing_brain_3d",
    name: "Cerebro Iridiscente en Espacio Oscuro",
    context: "Plasticidad Sináptica y Memoria Activa",
    actionExplanation:
      "Cerebro tridimensional iridiscente sobre fondo oscuro, simbolizando la absorción y fijación del conocimiento.",
    src: "/assets/memory_glowing_brain_3d.jpg",
    tag: "Cerebro · Cognición",
    isHuman: false,
  },
  {
    id: "memory_flashcards_study",
    name: "Fichas Mnemotécnicas de Estudio",
    context: "Active Recall & Tarjetas de Repaso",
    actionExplanation:
      "Fichas reales de memorización activa sobre el escritorio para fijar vocabulario mediante repetición sistemática.",
    src: "/assets/memory_flashcards_study.jpg",
    tag: "Flashcards Reales · Estudio",
    isHuman: false,
  },
  {
    id: "vocab_headphones_focus",
    name: "Enfoque & Auriculares en Móvil",
    context: "Repaso Activo de Vocabulario",
    actionExplanation:
      "Profesional en su estudio nocturno con audífonos over-ear, repasando tarjetas léxicas en el móvil con concentración serena.",
    src: "/assets/vocab_headphones_focus.jpg",
    tag: "Humano Real · Estudio",
    isHuman: true,
  },
  {
    id: "memory_hourglass_spaced",
    name: "Reloj de Arena & Curva de Ebbinghaus",
    context: "Repetición Espaciada en el Tiempo",
    actionExplanation:
      "Reloj de arena minimalista de cristal y arena negra, simbolizando el cálculo temporal de la retención contra el olvido.",
    src: "/assets/memory_hourglass_spaced.jpg",
    tag: "Tiempo · Intervalo SRS",
    isHuman: false,
  },
  {
    id: "memory_synapse_plasticity",
    name: "Plasticidad Sináptica Biológica",
    context: "Fijación de Memoria a Largo Plazo",
    actionExplanation:
      "Red biológica de conexiones neuronales consolidando estructuras léxicas en la memoria permanente.",
    src: "/assets/memory_synapse_plasticity.jpg",
    tag: "Biología · Sinapsis",
    isHuman: false,
  },
];

export const READING_CANDIDATES: ContextImageCandidate[] = [
  {
    id: "reading_modern_architecture",
    name: "Rascacielos de Cristal & Acero",
    context: "Paradigma Estructural de Negocios",
    actionExplanation:
      "Fachada icónica de rascacielos de vidrio y acero hacia el cielo, simbolizando el cambio de paradigmas arquitectónicos en organizaciones.",
    src: "/assets/reading_modern_architecture.jpg",
    tag: "Elegido por Ti · Arquitectura",
    isHuman: false,
  },
  {
    id: "reading_glass_headquarters",
    name: "Sede Corporativa de Cristal Nocturna",
    context: "Arquitectura Contemporánea",
    actionExplanation:
      "Sede corporativa contemporánea con iluminación interior cálida y arquitectura de cristal reflectante de gran escala.",
    src: "/assets/reading_glass_headquarters.jpg",
    tag: "Nocturno · Arquitectura",
    isHuman: false,
  },
  {
    id: "reading_brutalist_geometry",
    name: "Geometría Brutalista & Luz Cenital",
    context: "Diseño Estructural de Vanguardia",
    actionExplanation:
      "Diseño estructural minimalista con juegos de luz y sombras arquitectónicas de gran escala en espacio corporativo.",
    src: "/assets/reading_brutalist_geometry.jpg",
    tag: "Minimalismo · Estructura",
    isHuman: false,
  },
  {
    id: "reading_executive_lounge",
    name: "Lounge Minimalista de Estrategia",
    context: "Espacio de Lectura Profunda",
    actionExplanation:
      "Salón corporativo con ventanales serenos diseñado para lectura de análisis estratégico y concentración sin distracciones.",
    src: "/assets/reading_executive_lounge.jpg",
    tag: "Espacio · Sin Distracciones",
    isHuman: false,
  },
  {
    id: "reading_executive_tablet",
    name: "Lectura Ejecutiva en Tablet",
    context: "Revisión de Informe Arquitectónico",
    actionExplanation:
      "Directora de estrategia en oficina contemporánea analizando documento arquitectónico en tablet con luz natural.",
    src: "/assets/reading_executive_tablet.jpg",
    tag: "Ejecutivo · Humano Real",
    isHuman: true,
  },
];

export const SPEAKING_CANDIDATES: ContextImageCandidate[] = [
  {
    id: "speaking_studio_mic",
    name: "Micrófono Broadcast de Estudio",
    context: "Audio en Tiempo Real & Sparring",
    actionExplanation:
      "Micrófono profesional Shure para duplex audio sparring en estudio con paneles de madera acústica de alta gama.",
    src: "/assets/speaking_studio_mic.jpg",
    tag: "Elegido por Ti · Audio Pro",
    isHuman: false,
  },
  {
    id: "speaking_studio_headphones_mic",
    name: "Estación de Broadcast & Monitor",
    context: "Audio Duplex & Monitorización",
    actionExplanation:
      "Estación de audio profesional con micrófono de condensador y auriculares de monitorización para conversación en vivo.",
    src: "/assets/speaking_studio_headphones_mic.jpg",
    tag: "Estudio · Audio Pro",
    isHuman: false,
  },
  {
    id: "speaking_acoustic_booth",
    name: "Cabina Acústica & Micrófono Vocal",
    context: "Entrenamiento Vocal Insonorizado",
    actionExplanation:
      "Entorno insonorizado de grabación vocal y entrenamiento de fluidez oral en tiempo real con aislamiento acústico.",
    src: "/assets/speaking_acoustic_booth.jpg",
    tag: "Cabina · Voz",
    isHuman: false,
  },
  {
    id: "speaking_boardroom_pitch",
    name: "Sparring & Presentación en Boardroom",
    context: "Simulación de Reunión Ejecutiva",
    actionExplanation:
      "Profesional interviniendo en sala de juntas con naturalidad, aplomo y gestos elocuentes en simulación oral en vivo.",
    src: "/assets/speaking_boardroom_pitch.jpg",
    tag: "Reunión · Humano Real",
    isHuman: true,
  },
  {
    id: "speaking_tech_sparring",
    name: "Entrevista Técnica One-on-One",
    context: "Simulación de System Design & AI",
    actionExplanation:
      "Discusión técnica en profundidad sobre arquitectura de software y carrera tecnológica con gestualidad auténtica.",
    src: "/assets/speaking_tech_sparring.jpg",
    tag: "Tech · Diálogo Real",
    isHuman: true,
  },
];

export const WorkspaceContextImagePicker: React.FC<WorkspaceContextImagePickerProps> = ({
  activeSlot,
  onChangeSlot,
  selectedMemorySrc,
  selectedReadingSrc,
  selectedSpeakingSrc,
  onSelectMemorySrc,
  onSelectReadingSrc,
  onSelectSpeakingSrc,
  onApproveCombination,
}) => {
  const currentCandidates =
    activeSlot === "memory"
      ? MEMORY_CANDIDATES
      : activeSlot === "reading"
        ? READING_CANDIDATES
        : SPEAKING_CANDIDATES;

  const currentSelectedSrc =
    activeSlot === "memory"
      ? selectedMemorySrc
      : activeSlot === "reading"
        ? selectedReadingSrc
        : selectedSpeakingSrc;

  const handleSelect = (src: string) => {
    if (activeSlot === "memory") onSelectMemorySrc(src);
    else if (activeSlot === "reading") onSelectReadingSrc(src);
    else onSelectSpeakingSrc(src);
  };

  const slotLabels = [
    {
      id: "memory" as const,
      label: "01. Vocabulario // Memoria",
      currentSrc: selectedMemorySrc,
      desc: "“bottleneck” · Spaced Repetition",
    },
    {
      id: "reading" as const,
      label: "02. Artículos // Lectura",
      currentSrc: selectedReadingSrc,
      desc: "Architectural Paradigm Shifts",
    },
    {
      id: "speaking" as const,
      label: "03. Simulación // Speaking",
      currentSrc: selectedSpeakingSrc,
      desc: "Tech Career & AI Simulation",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4 p-5 rounded-3xl bg-[#070512]/95 border border-[#8B5CF6]/30 shadow-[0_12px_45px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Top Banner: Context and Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C4B5FD]">
              SELECTOR DE IMÁGENES CONTEXTUALES DE ALTA GAMA
            </span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              100% Contexto Real · Cero IA Genérica
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-white mt-1">
            Imágenes con Sentido y Coherencia para Cada Módulo
          </h3>
          <p className="text-xs text-[#94A3B8] mt-0.5 max-w-2xl">
            Cada imagen refleja exactamente lo que la persona hace o lo que el contenido trata: vocabulario activo, lectura estratégica y simulación oral duplex.
          </p>
        </div>

        {/* Quick Presets & Approve */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onSelectMemorySrc("/assets/vocab_headphones_focus.jpg");
              onSelectReadingSrc("/assets/reading_executive_tablet.jpg");
              onSelectSpeakingSrc("/assets/speaking_boardroom_pitch.jpg");
            }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono text-[#DDD6FE] transition-colors cursor-pointer"
          >
            ✦ Preset: Humanos con Sentido
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectMemorySrc("/assets/vocab_minimal_device.jpg");
              onSelectReadingSrc("/assets/reading_modern_architecture.jpg");
              onSelectSpeakingSrc("/assets/speaking_studio_mic.jpg");
            }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
          >
            ✦ Preset: Dispositivos & Arquitectura
          </button>
          <button
            type="button"
            onClick={onApproveCombination}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white text-xs font-mono font-bold tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer hover:scale-[1.02]"
          >
            Aprobar Esta Combinación
          </button>
        </div>
      </div>

      {/* Slot Selector Tabs (3 Primary Rows) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {slotLabels.map((slot) => {
          const isActive = activeSlot === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onChangeSlot(slot.id)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 ${
                isActive
                  ? "bg-[#1E143B] border-[#A78BFA] shadow-[0_0_25px_rgba(139,92,246,0.3)]"
                  : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-black/50">
                  <img
                    src={slot.currentSrc}
                    alt={slot.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono font-semibold text-white truncate">
                    {slot.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                    {slot.desc}
                  </span>
                </div>
              </div>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded-md shrink-0 ${
                  isActive
                    ? "bg-[#8B5CF6]/30 text-[#DDD6FE] font-bold"
                    : "text-white/30"
                }`}
              >
                {isActive ? "Activo" : "Elegir"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Candidate Gallery for Active Slot */}
      <div className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
            Opciones disponibles para{" "}
            <span className="text-[#C4B5FD] font-semibold">
              {slotLabels.find((s) => s.id === activeSlot)?.label}
            </span>{" "}
            (Haz clic para ver el cambio instantáneo abajo):
          </span>
          <span className="text-[10px] font-mono text-[#94A3B8]">
            {currentCandidates.length} opciones curadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentCandidates.map((candidate) => {
            const isSelected = currentSelectedSrc === candidate.src;
            return (
              <div
                key={candidate.id}
                onClick={() => handleSelect(candidate.src)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-gradient-to-b from-[#241747] to-[#120B24] border-[#C4B5FD] shadow-[0_0_25px_rgba(196,181,253,0.3)] scale-[1.02]"
                    : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/25"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                    ✓
                  </span>
                )}

                <div>
                  {/* Thumbnail */}
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-black/60 relative mb-2.5">
                    <img
                      src={candidate.src}
                      alt={candidate.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#E2E8F0] border border-white/10">
                      {candidate.tag}
                    </span>
                  </div>

                  {/* Title & Context */}
                  <h4
                    className={`text-xs font-semibold leading-tight ${
                      isSelected ? "text-white" : "text-[#E2E8F0]"
                    }`}
                  >
                    {candidate.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#A78BFA] mt-0.5">
                    {candidate.context}
                  </p>
                </div>

                {/* Meaning / What the person is doing */}
                <p className="text-[10.5px] text-[#94A3B8] leading-[1.4] mt-2 pt-2 border-t border-white/[0.06] line-clamp-3">
                  {candidate.actionExplanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
