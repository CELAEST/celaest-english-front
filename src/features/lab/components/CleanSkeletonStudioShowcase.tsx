import React, { useState } from "react";

type SkeletonVariant = "linear-clean" | "apple-minimal" | "radix-refined";
type FeatureTab = "interview" | "writing" | "reading" | "memory" | "settings";
type ViewportMode = "desktop" | "mobile";

export const CleanSkeletonStudioShowcase: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<SkeletonVariant>("linear-clean");
  const [selectedFeature, setSelectedFeature] = useState<FeatureTab>("interview");
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");

  // Variant styling helpers
  const getBaseFill = () => {
    switch (selectedVariant) {
      case "linear-clean":
        return "bg-white/[0.04]";
      case "apple-minimal":
        return "bg-white/[0.035] backdrop-blur-sm";
      case "radix-refined":
        return "bg-[#14141d]";
    }
  };

  const getAccentFill = () => {
    switch (selectedVariant) {
      case "linear-clean":
        return "bg-white/[0.07]";
      case "apple-minimal":
        return "bg-[#7048e8]/15";
      case "radix-refined":
        return "bg-[#1e1e2d]";
    }
  };

  const getSubtleFill = () => {
    switch (selectedVariant) {
      case "linear-clean":
        return "bg-white/[0.025]";
      case "apple-minimal":
        return "bg-white/[0.02]";
      case "radix-refined":
        return "bg-[#0e0e15]";
    }
  };

  const getPulseEffect = () => {
    switch (selectedVariant) {
      case "linear-clean":
        return "animate-pulse duration-1000";
      case "apple-minimal":
        return "animate-pulse duration-1500";
      case "radix-refined":
        return "animate-pulse duration-800";
    }
  };

  // Render feature skeleton based on selected variant
  const renderInterviewSkeleton = () => (
    <div className={`w-full h-full flex flex-col justify-between p-4 sm:p-6 ${getPulseEffect()}`}>
      {/* Top HUD: Simple clean silhouettes without hard borders */}
      <div className="flex items-center justify-between w-full shrink-0">
        <div className={`w-28 h-8 rounded-full ${getBaseFill()}`} />
        <div className={`w-36 h-8 rounded-full ${getAccentFill()}`} />
        <div className={`w-16 h-8 rounded-full ${getBaseFill()}`} />
      </div>

      {/* Main Center Area: Monolithic clean shapes */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto max-w-xl mx-auto w-full gap-5">
        {/* Clean central orb silhouette (zero rings, zero noisy borders) */}
        <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full ${selectedVariant === "apple-minimal" ? "bg-[#7048e8]/12 shadow-[0_0_40px_rgba(112,72,232,0.12)]" : getBaseFill()}`} />
        
        {/* Soft prompt question block */}
        <div className={`w-full h-24 sm:h-28 rounded-2xl ${getBaseFill()} p-5 flex flex-col justify-center gap-2.5`}>
          <div className={`w-1/3 h-3 rounded-full ${getAccentFill()}`} />
          <div className={`w-full h-4 rounded-full ${getAccentFill()}`} />
          <div className={`w-4/5 h-4 rounded-full ${getAccentFill()}`} />
        </div>

        {/* Clean mic pill */}
        <div className={`w-44 h-12 rounded-full ${getAccentFill()}`} />
      </div>

      {/* Bottom spacer / status */}
      <div className="w-full flex justify-center shrink-0">
        <div className={`w-48 h-2 rounded-full ${getSubtleFill()}`} />
      </div>
    </div>
  );

  const renderWritingSkeleton = () => (
    <div className={`w-full h-full flex flex-col justify-between p-4 sm:p-6 gap-4 ${getPulseEffect()}`}>
      {/* Task Header */}
      <div className={`w-full h-20 rounded-2xl ${getBaseFill()} p-4 flex flex-col justify-center gap-2 shrink-0`}>
        <div className={`w-32 h-3 rounded-full ${getAccentFill()}`} />
        <div className={`w-2/3 h-5 rounded-full ${getAccentFill()}`} />
      </div>

      {/* Clean Editor Canvas */}
      <div className={`flex-1 rounded-3xl ${getSubtleFill()} p-5 flex flex-col justify-between`}>
        <div className="space-y-3 pt-2">
          <div className={`w-3/4 h-3.5 rounded-full ${getBaseFill()}`} />
          <div className={`w-full h-3.5 rounded-full ${getBaseFill()}`} />
          <div className={`w-5/6 h-3.5 rounded-full ${getBaseFill()}`} />
          <div className={`w-1/2 h-3.5 rounded-full ${getBaseFill()}`} />
        </div>
        <div className="flex gap-2">
          <div className={`w-24 h-6 rounded-lg ${getBaseFill()}`} />
          <div className={`w-32 h-6 rounded-lg ${getBaseFill()}`} />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`w-full h-14 rounded-2xl ${getBaseFill()} px-4 flex items-center justify-between shrink-0`}>
        <div className={`w-28 h-4 rounded-full ${getAccentFill()}`} />
        <div className={`w-36 h-9 rounded-full ${getAccentFill()}`} />
      </div>
    </div>
  );

  const renderReadingSkeleton = () => (
    <div className={`w-full h-full flex flex-col justify-between p-4 sm:p-6 max-w-2xl mx-auto gap-4 ${getPulseEffect()}`}>
      {/* Top audio bar & title */}
      <div className="flex items-center justify-between shrink-0">
        <div className={`w-28 h-7 rounded-full ${getBaseFill()}`} />
        <div className={`w-12 h-12 rounded-full ${getAccentFill()}`} />
      </div>

      {/* Article Header */}
      <div className="space-y-2.5 shrink-0">
        <div className={`w-20 h-4 rounded-full ${getAccentFill()}`} />
        <div className={`w-3/4 h-6 rounded-lg ${getBaseFill()}`} />
        <div className={`w-1/2 h-6 rounded-lg ${getBaseFill()}`} />
      </div>

      {/* Article Paragraphs */}
      <div className="flex-1 space-y-4 py-2">
        <div className="space-y-2">
          <div className={`w-full h-3 rounded-full ${getBaseFill()}`} />
          <div className={`w-[95%] h-3 rounded-full ${getBaseFill()}`} />
          <div className={`w-[88%] h-3 rounded-full ${getBaseFill()}`} />
        </div>
        <div className="space-y-2">
          <div className={`w-full h-3 rounded-full ${getBaseFill()}`} />
          <div className={`w-[92%] h-3 rounded-full ${getBaseFill()}`} />
          <div className={`w-[85%] h-3 rounded-full ${getBaseFill()}`} />
        </div>
      </div>

      {/* Bottom Paginator */}
      <div className={`w-full h-12 rounded-xl ${getBaseFill()} px-4 flex items-center justify-between shrink-0`}>
        <div className={`w-16 h-6 rounded-lg ${getAccentFill()}`} />
        <div className={`w-24 h-2 rounded-full ${getAccentFill()}`} />
        <div className={`w-16 h-6 rounded-lg ${getAccentFill()}`} />
      </div>
    </div>
  );

  const renderMemorySkeleton = () => (
    <div className={`w-full h-full flex flex-col justify-between p-4 sm:p-6 items-center ${getPulseEffect()}`}>
      {/* Filter Tabs */}
      <div className={`w-72 h-10 rounded-full ${getBaseFill()} p-1 flex items-center justify-between shrink-0`}>
        <div className={`w-20 h-8 rounded-full ${getAccentFill()}`} />
        <div className={`w-20 h-8 rounded-full ${getSubtleFill()}`} />
        <div className={`w-20 h-8 rounded-full ${getSubtleFill()}`} />
      </div>

      {/* Central 3D Card Silhouette */}
      <div className={`w-full max-w-md h-[380px] rounded-3xl ${selectedVariant === "apple-minimal" ? "bg-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.6)]" : getBaseFill()} p-6 flex flex-col justify-between my-auto`}>
        <div className="flex justify-between items-center">
          <div className={`w-20 h-4 rounded-full ${getAccentFill()}`} />
          <div className={`w-6 h-6 rounded-full ${getAccentFill()}`} />
        </div>
        <div className="space-y-4 my-auto">
          <div className="space-y-2">
            <div className={`w-16 h-3 rounded-full ${getAccentFill()}`} />
            <div className={`w-4/5 h-5 rounded-full ${getAccentFill()}`} />
          </div>
          <div className="space-y-2 pt-2">
            <div className={`w-20 h-3 rounded-full ${getAccentFill()}`} />
            <div className={`w-full h-6 rounded-full ${getAccentFill()}`} />
          </div>
        </div>
        <div className={`w-28 h-6 rounded-full ${getAccentFill()} mx-auto`} />
      </div>

      {/* Pagination hint */}
      <div className={`w-32 h-4 rounded-full ${getSubtleFill()} shrink-0`} />
    </div>
  );

  const renderSettingsSkeleton = () => (
    <div className={`w-full h-full flex flex-col justify-start p-4 sm:p-6 gap-4 ${getPulseEffect()}`}>
      {/* Title */}
      <div className="space-y-2 shrink-0">
        <div className={`w-24 h-3 rounded-full ${getAccentFill()}`} />
        <div className={`w-52 h-7 rounded-lg ${getBaseFill()}`} />
      </div>

      {/* Settings Rows */}
      <div className="flex-1 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-full h-16 rounded-2xl ${getBaseFill()} px-4 flex items-center justify-between`}>
            <div className="space-y-1.5">
              <div className={`w-32 h-4 rounded-full ${getAccentFill()}`} />
              <div className={`w-48 h-3 rounded-full ${getSubtleFill()}`} />
            </div>
            <div className={`w-8 h-8 rounded-full ${getAccentFill()}`} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full flex flex-col space-y-6 bg-[#07060e] border border-white/[0.08] rounded-3xl p-5 sm:p-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 w-96 h-96 rounded-full bg-[#7048e8]/10 blur-[90px]"
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#7048e8]/20 text-[#c4b5fd] border border-[#7048e8]/30">
              00.SKELETON_STUDIO
            </span>
            <span className="text-xs text-white/50">· Clean Component-Library Standard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-medium text-white tracking-tight mt-1">
            Studio de Skeletons Inteligentes y Limpios (Zero Wireframes)
          </h2>
          <p className="text-xs text-white/60 max-w-2xl mt-1">
            Reemplazo del diseño con bordes toscos por siluetas tonales puras de alta gama (inspiradas en Vercel, Linear y Apple).
            Elige una variante visual, selecciona la feature y previsualiza cómo se siente en vivo.
          </p>
        </div>

        {/* Viewport switch: Desktop vs Mobile */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewportMode === "desktop"
                ? "bg-[#7048e8] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Desktop (Full)
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewportMode === "mobile"
                ? "bg-[#7048e8] text-white shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Mobile (iPhone 390px)
          </button>
        </div>
      </div>

      {/* Controls Bar: Variant Selector + Feature Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        {/* Variants */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-white/40 uppercase tracking-wider mr-1">Estilo:</span>
          <button
            type="button"
            onClick={() => setSelectedVariant("linear-clean")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedVariant === "linear-clean"
                ? "bg-white/15 text-white border border-white/20 shadow-sm"
                : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            ✨ Vercel / Linear (Sin Bordes · Siluetas Puras)
          </button>
          <button
            type="button"
            onClick={() => setSelectedVariant("apple-minimal")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedVariant === "apple-minimal"
                ? "bg-[#7048e8]/25 text-[#c4b5fd] border border-[#7048e8]/40 shadow-sm"
                : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            🍎 Apple Minimalist (Tinte Violeta · Calma)
          </button>
          <button
            type="button"
            onClick={() => setSelectedVariant("radix-refined")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedVariant === "radix-refined"
                ? "bg-white/15 text-white border border-white/20 shadow-sm"
                : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            📐 Radix Modern (Neutro Pizarra)
          </button>
        </div>

        {/* Feature Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-x-auto max-w-full">
          {(["interview", "writing", "reading", "memory", "settings"] as FeatureTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedFeature(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                selectedFeature === tab
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab === "interview" ? "🎙️ Interview" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Live Interactive Canvas */}
      <div className="w-full flex justify-center items-center py-4 relative z-10">
        <div
          className={`bg-[#000001] rounded-3xl border border-white/[0.06] shadow-2xl overflow-hidden transition-all duration-300 ${
            viewportMode === "mobile"
              ? "w-[390px] h-[640px] max-w-full"
              : "w-full h-[520px]"
          }`}
        >
          {selectedFeature === "interview" && renderInterviewSkeleton()}
          {selectedFeature === "writing" && renderWritingSkeleton()}
          {selectedFeature === "reading" && renderReadingSkeleton()}
          {selectedFeature === "memory" && renderMemorySkeleton()}
          {selectedFeature === "settings" && renderSettingsSkeleton()}
        </div>
      </div>

      {/* Explanation & Approval Note */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/[0.08] relative z-10">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="text-xs font-semibold text-white mb-1">1. Cero Bordes Duros</h4>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Eliminamos todos los contornos wireframe (`border-white/[0.08]`) que creaban ruido visual excesivo en Interview.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="text-xs font-semibold text-white mb-1">2. Siluetas Monolíticas</h4>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Masas de color suave (`bg-white/[0.04]`) que simulan fielmente la presencia del componente sin dibujar cables ni falsos botones.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <h4 className="text-xs font-semibold text-white mb-1">3. Cero Layout Shifts</h4>
          <p className="text-[11px] text-white/60 leading-relaxed">
            Al reemplazar el spinner circular que saltaba al cargar, la pantalla mantiene exactamente el mismo peso visual antes y después de hidratar.
          </p>
        </div>
      </div>
    </section>
  );
};
