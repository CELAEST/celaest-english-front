import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Sliders,
  Eye,
  MessageSquare,
  Headphones,
  Copy,
  Check,
  Zap,
  Mic,
  Activity,
  Smile,
  Brain,
  Moon,
} from "lucide-react";
import {
  CyberVisorFaceEngine,
  VISOR_THEMES,
  VisorFaceEmotion,
  AstroSpeakingVariant,
  AstroListeningVariant,
  ProfessorCameraPreset,
  ProfessorStageCanvas,
} from "../../../design-system/components/Professor3D";

interface VariantCard<T> {
  id: T;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  visualTrait: string;
}

const SPEAKING_VARIANTS: VariantCard<AstroSpeakingVariant>[] = [
  {
    id: "vocal_capsule",
    name: "1. Cápsula Vocal Orgánica",
    tagline: "Estilo Manga / Astro Bot Canónico",
    badge: "CANÓNICA",
    description: "Boquita cibernética redondeada a Y=685 que modula en cadencia fonética continua. Incluye cavidad oscura, resonador interior y diente/labio superior blanco nítido.",
    visualTrait: "Cápsula OLED · Modulación 12-50px · Vector Ultra-Limpio",
  },
  {
    id: "neon_waveform",
    name: "2. Onda Vocal Espectral",
    tagline: "Cuerdas Vocales Digitales",
    badge: "FUTURISTA",
    description: "Línea de sonrisa neón limpia a Y=685. Al hablar, vibra en tiempo real como un osciloscopio vocal suave multi-armónico con acento de diamante blanco central.",
    visualTrait: "Sonrisa Reactiva · Armónicos Multi-Frecuencia · Cero Ruido",
  },
  {
    id: "segmented_aperture",
    name: "3. Apertura Segmentada de Precisión",
    tagline: "Diafragma Mecatrónico Cyber",
    badge: "CYBER ROBOT",
    description: "Dos paletas horizontales OLED a Y=685 que se separan verticalmente al vocalizar, revelando una cavidad acústica con brillo interior suave.",
    visualTrait: "2 Paletas OLED · Separación Vertical · Núcleo Blanco",
  },
  {
    id: "phoneme_hologram",
    name: "4. Apertura Fonética Expresiva",
    tagline: "Modulación Vocálica O-A-E",
    badge: "EXPRESIVO",
    description: "Modula dinámicamente entre fonemas puros a Y=685: 'O' circular con punto focal, 'Ah' cápsula abierta con diente blanco, y 'Ee' ranura sonriente.",
    visualTrait: "Ciclo O-A-E · Geometría Pura · Cero Brackets Recargados",
  },
];

const LISTENING_VARIANTS: VariantCard<AstroListeningVariant>[] = [
  {
    id: "ear_radar",
    name: "1. Ondas de Auriculares (Ear Waves)",
    tagline: "Telemetría Direccional Lateral",
    badge: "MINIMALISTA",
    description: "2 sutiles ondas acústicas translúcidas que fluyen desde los auriculares del casco hacia el centro. En el mentón (Y=685), una fina onda de audio reactiva.",
    visualTrait: "Ondas desde Casco · Fina Onda en Mentón · Cero Textos",
  },
  {
    id: "spherical_sonar",
    name: "2. Pulso Sonar Suave",
    tagline: "Ondas Circulares Concéntricas",
    badge: "ALTA SENSIBILIDAD",
    description: "2 suaves ondas circulares de sonar emanando del mentón con opacidad controlada (35%) y un delicado destello blanco central en reposo atento.",
    visualTrait: "Pulsos Concéntricos · Nodo Central · Transparencia Suave",
  },
  {
    id: "vu_spectrum",
    name: "3. Ecualizador Minimalista",
    tagline: "Micro-Vúmetro Estilo Siri / Apple",
    badge: "PRO AUDIO",
    description: "5 micro-barras OLED en el centro del mentón (Y=685) que oscilan armoniosamente con el sonido ambiental. Barra central con acento blanco.",
    visualTrait: "5 Micro-Barras · Dinámica de Voz · Diseño Ultra-Ligero",
  },
  {
    id: "acoustic_lock",
    name: "4. Foco Curioso (Attentive Tilt)",
    tagline: "Inclinación Curiosa + Micro-Esquinas",
    badge: "MÁXIMO CARISMA",
    description: "Inclinación atenta de cabeza (+3.5°), cejas curiosas levantadas y 4 sutiles esquinas de visor que enmarcan la atención sin recargar el diseño.",
    visualTrait: "Head-Tilt Curioso · 4 Micro-Esquinas · Retícula Fina",
  },
];

const SAVED_EMOTIONS: { id: VisorFaceEmotion; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "idle", label: "Reposo", icon: <Moon size={13} />, desc: "Respiración sutil y parpadeo OLED relajado" },
  { id: "speaking", label: "Hablando", icon: <MessageSquare size={13} />, desc: "Boquita cyber modulando en vivo (4 variantes)" },
  { id: "listening", label: "Escuchando", icon: <Headphones size={13} />, desc: "Atención acústica y radar limpio (4 variantes)" },
  { id: "happy", label: "Feliz", icon: <Smile size={13} />, desc: "Ojos en arco radiante (^ ^), rubor y sonrisa tierna" },
  { id: "thinking", label: "Pensando", icon: <Brain size={13} />, desc: "Mirada analítica y barrido cognitivo suave" },
];

export const CyberVisorFaceStudioShowcase: React.FC = () => {
  const [activeEmotion, setActiveEmotion] = useState<VisorFaceEmotion>("speaking");
  const [focusMode, setFocusMode] = useState<"speaking" | "listening">("speaking");
  const [speakingVariant, setSpeakingVariant] = useState<AstroSpeakingVariant>("vocal_capsule");
  const [listeningVariant, setListeningVariant] = useState<AstroListeningVariant>("ear_radar");
  const [activeThemeId, setActiveThemeId] = useState<string>("cyan");
  const [cameraPreset, setCameraPreset] = useState<ProfessorCameraPreset>("bust-guide");
  const [intensity, setIntensity] = useState<number>(1.8);
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize CyberVisorFaceEngine with Astro baseline
  const [faceEngine] = useState(() => new CyberVisorFaceEngine({
    archetype: "astro_chibi",
    themeId: "cyan",
    emotion: "speaking",
    speakingVariant: "vocal_capsule",
    listeningVariant: "ear_radar",
    emissiveIntensity: 1.8,
    scanlines: true,
  }));

  // Sync Engine Config on any state change
  useEffect(() => {
    faceEngine.setConfig({
      archetype: "astro_chibi",
      themeId: activeThemeId,
      emotion: activeEmotion,
      speakingVariant,
      listeningVariant,
      emissiveIntensity: intensity,
      scanlines: scanlines,
    });
  }, [faceEngine, activeThemeId, activeEmotion, speakingVariant, listeningVariant, intensity, scanlines]);

  const handleSelectEmotion = (emo: VisorFaceEmotion) => {
    setActiveEmotion(emo);
    if (emo === "speaking" || emo === "listening") {
      setFocusMode(emo);
    }
  };

  const handleSelectFocusMode = (mode: "speaking" | "listening") => {
    setFocusMode(mode);
    setActiveEmotion(mode);
  };

  const handleCopySpec = () => {
    const spec = JSON.stringify(
      {
        archetype: "astro_chibi",
        theme: activeThemeId,
        activeEmotion,
        speakingVariant,
        listeningVariant,
        mouthPosition: { Y: 685, status: "LOWERED_CLEAN" },
        eyebrows: { style: "SWEET_CURVED_ARCH", status: "NON_ANGRY" },
        emissiveIntensity: intensity,
        scanlines,
        cameraPreset,
        status: "APPROVED_FOR_LINGUA",
      },
      null,
      2,
    );
    navigator.clipboard.writeText(spec).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="w-full flex flex-col space-y-6 rounded-2xl border border-white/[0.08] bg-[#070b14]/90 backdrop-blur-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#38bdf8] px-2 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center gap-1.5">
              <Zap size={10} className="animate-pulse" />
              LABS 00.ASTRO · ESTUDIO DE EXPRESIONES LIMPIAS
            </span>
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              CELAEST ASTRO BOT ENGINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white mt-1.5">
            Estudio de Habla & Escucha Cybernética
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-2xl font-light leading-relaxed">
            Diseño minimalista ultra-limpio: boca en posición baja (Y=685), cejas tiernas y relajadas (cero enojo) y cero textos/ruido visual. 
            Todas las expresiones guardadas listas para visualización en 1 clic.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopySpec}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-xs font-mono text-white/90 hover:text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
            <span>{copied ? "COPIADO" : "COPIAR ESPECIFICACIÓN"}</span>
          </button>
        </div>
      </div>

      {/* SAVED EXPRESSIONS QUICK-BAR: 5 Animations Guardadas y Disponibles */}
      <div className="flex flex-col space-y-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#38bdf8]" />
            EXPRESIONES GUARDADAS (ACCESO RÁPIDO 1-CLIC)
          </span>
          <span className="text-[10px] font-mono text-white/40">
            Haz clic en cualquiera para probar la animación completa en el avatar
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SAVED_EMOTIONS.map((emo) => {
            const isActive = activeEmotion === emo.id;
            return (
              <button
                key={emo.id}
                type="button"
                onClick={() => handleSelectEmotion(emo.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white shadow-[0_0_15px_rgba(56,189,248,0.25)] font-semibold"
                    : "bg-white/[0.02] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
                title={emo.desc}
              >
                <span className={isActive ? "text-[#38bdf8]" : "text-white/40"}>{emo.icon}</span>
                <span className="truncate">{emo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Col Grid: 3D Stage (7 Cols) + Control Panel (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left: 3D Live Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.10] bg-[#03060c] shadow-2xl flex items-center justify-center">
            {/* 3D Canvas */}
            <ProfessorStageCanvas
              preset={cameraPreset}
              state={
                activeEmotion === "speaking"
                  ? "explaining"
                  : activeEmotion === "listening"
                  ? "listening"
                  : activeEmotion === "happy"
                  ? "celebrating"
                  : "idle"
              }
              faceEngine={faceEngine}
            />

            {/* Overlaid Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-white/70 backdrop-blur-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                OLED 60FPS // 1024x1024 LIMPIO
              </span>
            </div>

            {/* Camera Switcher */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setCameraPreset("face-focus")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  cameraPreset === "face-focus"
                    ? "bg-[#38bdf8] text-black font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                VISOR ZOOM
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset("bust-guide")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  cameraPreset === "bust-guide"
                    ? "bg-[#38bdf8] text-black font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                BUSTO
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset("tutor-stage")}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  cameraPreset === "tutor-stage"
                    ? "bg-[#38bdf8] text-black font-semibold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                COMPLETO
              </button>
            </div>

            {/* Active Spec Telemetry Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white/70 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white/40">ESTADO:</span>
                <span className="text-[#38bdf8] font-bold uppercase">{activeEmotion}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40">VARIANTE:</span>
                <span className="text-white font-medium">
                  {focusMode === "speaking" ? speakingVariant : listeningVariant}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-white/40">BOCA:</span>
                <span className="text-[#10b981]">Y=685 (BAJA)</span>
              </div>
              <button
                type="button"
                onClick={() => faceEngine.triggerBlink()}
                className="flex items-center gap-1 text-[10px] text-[#38bdf8] hover:text-white transition-colors cursor-pointer"
              >
                <Eye size={12} />
                <span>PARPADEAR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Interactive Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* 1. Primary Focus Mode: HABLANDO vs ESCUCHANDO */}
          <div className="flex flex-col space-y-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
              FOCO PRINCIPAL DE CALIBRACIÓN
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectFocusMode("speaking")}
                className={`flex items-center justify-center py-3 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer gap-2 ${
                  focusMode === "speaking" && activeEmotion === "speaking"
                    ? "bg-[#38bdf8]/15 border-[#38bdf8] text-white shadow-[0_0_20px_rgba(56,189,248,0.25)] font-semibold scale-102"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <MessageSquare size={16} className={focusMode === "speaking" ? "text-[#38bdf8]" : "text-white/40"} />
                <span>HABLANDO</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/80">4 VAR</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectFocusMode("listening")}
                className={`flex items-center justify-center py-3 px-3 rounded-xl border text-xs font-mono transition-all cursor-pointer gap-2 ${
                  focusMode === "listening" && activeEmotion === "listening"
                    ? "bg-[#a855f7]/15 border-[#a855f7] text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] font-semibold scale-102"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Headphones size={16} className={focusMode === "listening" ? "text-[#a855f7]" : "text-white/40"} />
                <span>ESCUCHANDO</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/80">4 VAR</span>
              </button>
            </div>
          </div>

          {/* 2. Palette Switcher */}
          <div className="flex flex-col space-y-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center justify-between">
              <span>COLOR DE LUMINISCENCIA (OLED)</span>
              <span className="text-[#38bdf8]">{VISOR_THEMES[activeThemeId]?.name}</span>
            </span>
            <div className="grid grid-cols-6 gap-2">
              {Object.values(VISOR_THEMES).map((theme) => {
                const isSelected = activeThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setActiveThemeId(theme.id)}
                    className={`h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected ? "ring-2 ring-white scale-105" : "opacity-70 hover:opacity-100 hover:scale-102"
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    title={theme.name}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Visor Optics Controls */}
          <div className="flex flex-col space-y-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex items-center justify-between">
              <span>CALIBRACIÓN ÓPTICA DEL VISOR</span>
              <Sliders size={12} className="text-white/40" />
            </span>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span>Intensidad de Brillo Emisivo</span>
                <span className="font-mono text-[#38bdf8]">{intensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="3.0"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <div className="flex flex-col">
                <span className="text-xs text-white/80">Líneas de Escaneo CRT/OLED</span>
                <span className="text-[10px] text-white/40">Micro-textura de fósforo</span>
              </div>
              <button
                type="button"
                onClick={() => setScanlines(!scanlines)}
                className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                  scanlines ? "bg-[#38bdf8]" : "bg-white/20"
                }`}
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    scanlines ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 4 Interactive High-Detail Variant Cards for Selected Mode */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.08] relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#38bdf8] flex items-center gap-1.5">
            <Sparkles size={12} />
            {focusMode === "speaking"
              ? "CATÁLOGO DE VARIANTES LIMPIAS: ESTADO HABLANDO (BOQUITAS CYBER A Y=685)"
              : "CATÁLOGO DE VARIANTES LIMPIAS: ESTADO ESCUCHANDO (RADAR & AUDIO IN A Y=685)"}
          </span>
          <span className="text-[10px] font-mono text-white/40">
            Haz clic en cualquier tarjeta para proyectarla en vivo sobre el casco 3D
          </span>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {focusMode === "speaking"
            ? SPEAKING_VARIANTS.map((variant) => {
                const isSelected = speakingVariant === variant.id && activeEmotion === "speaking";
                return (
                  <div
                    key={variant.id}
                    onClick={() => {
                      setSpeakingVariant(variant.id);
                      setActiveEmotion("speaking");
                    }}
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative group ${
                      isSelected
                        ? "bg-[#38bdf8]/[0.09] border-[#38bdf8] shadow-[0_0_30px_-5px_rgba(56,189,248,0.30)] scale-[1.01]"
                        : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.22] hover:bg-white/[0.04]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[9px] font-mono text-[#38bdf8] bg-[#38bdf8]/20 px-2 py-0.5 rounded-full border border-[#38bdf8]/40">
                        <Check size={10} />
                        EN PANTALLA
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                          {variant.tagline}
                        </span>
                        <span className="text-[8px] font-mono px-1 rounded bg-white/10 text-white/60">
                          {variant.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                        {variant.name}
                      </h3>
                      <p className="text-[11px] text-white/70 font-light leading-relaxed">
                        {variant.description}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[9px] font-mono text-[#38bdf8]/80">
                      <Mic size={10} />
                      <span className="truncate">{variant.visualTrait}</span>
                    </div>
                  </div>
                );
              })
            : LISTENING_VARIANTS.map((variant) => {
                const isSelected = listeningVariant === variant.id && activeEmotion === "listening";
                return (
                  <div
                    key={variant.id}
                    onClick={() => {
                      setListeningVariant(variant.id);
                      setActiveEmotion("listening");
                    }}
                    className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative group ${
                      isSelected
                        ? "bg-[#a855f7]/[0.09] border-[#a855f7] shadow-[0_0_30px_-5px_rgba(168,85,247,0.30)] scale-[1.01]"
                        : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.22] hover:bg-white/[0.04]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[9px] font-mono text-[#a855f7] bg-[#a855f7]/20 px-2 py-0.5 rounded-full border border-[#a855f7]/40">
                        <Check size={10} />
                        EN PANTALLA
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                          {variant.tagline}
                        </span>
                        <span className="text-[8px] font-mono px-1 rounded bg-white/10 text-white/60">
                          {variant.badge}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight leading-snug">
                        {variant.name}
                      </h3>
                      <p className="text-[11px] text-white/70 font-light leading-relaxed">
                        {variant.description}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[9px] font-mono text-[#a855f7]/80">
                      <Activity size={10} />
                      <span className="truncate">{variant.visualTrait}</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};
