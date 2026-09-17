import React, { useState, useEffect } from "react";
import { AuthStatusDock } from "../../auth/components/AuthStatusDock";
import { AuthErrorCard } from "../../auth/components/AuthErrorCard";
import { AuthStageIndex } from "../../auth/components/AuthProgressStage";
import { AuthOrbitalLoader } from "../../auth/components/AuthOrbitalLoader";

type AuthShowcaseState =
  | "phase-1-handshake"
  | "phase-2-tokens"
  | "phase-3-calibration"
  | "phase-4-success"
  | "error-cancelled"
  | "error-expired"
  | "error-failed";

type PositionPreset = "optimal-lower" | "floating-dock" | "minimal-capsule" | "legacy-center";

type AuthStateData =
  | {
      isError: false;
      stage: AuthStageIndex;
      title: string;
      message: string;
      isSuccess: boolean;
    }
  | {
      isError: true;
      errorDetails: {
        title: string;
        description: string;
      };
    };

export const AuthCallbackLuxuryShowcase: React.FC = () => {
  const [activeState, setActiveState] = useState<AuthShowcaseState>("phase-1-handshake");
  const [positionPreset, setPositionPreset] = useState<PositionPreset>("optimal-lower");
  const [verticalOffsetPercent, setVerticalOffsetPercent] = useState<number>(50);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile" | "fullscreen">("desktop");

  // Auto Simulation Player
  useEffect(() => {
    if (!isPlayingSimulation) return;

    setActiveState("phase-1-handshake");

    const timer1 = setTimeout(() => {
      setActiveState("phase-2-tokens");
    }, 1500);

    const timer2 = setTimeout(() => {
      setActiveState("phase-3-calibration");
    }, 3200);

    const timer3 = setTimeout(() => {
      setActiveState("phase-4-success");
      setIsPlayingSimulation(false);
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isPlayingSimulation]);

  const handlePositionPresetChange = (preset: PositionPreset) => {
    setPositionPreset(preset);
    if (preset === "optimal-lower") setVerticalOffsetPercent(50);
    else if (preset === "floating-dock") setVerticalOffsetPercent(54);
    else if (preset === "minimal-capsule") setVerticalOffsetPercent(48);
    else if (preset === "legacy-center") setVerticalOffsetPercent(42);
  };

  // State configurations
  const getStateProps = (): AuthStateData => {
    switch (activeState) {
      case "phase-1-handshake":
        return {
          isError: false,
          stage: 1 as AuthStageIndex,
          title: "Authenticating with Google",
          message: "Connecting your AI Mentor...",
          isSuccess: false,
        };
      case "phase-2-tokens":
        return {
          isError: false,
          stage: 2 as AuthStageIndex,
          title: "Securing Token Handshake",
          message: "Exchanging cryptographic session keys...",
          isSuccess: false,
        };
      case "phase-3-calibration":
        return {
          isError: false,
          stage: 3 as AuthStageIndex,
          title: "Calibrating Neural Profile",
          message: "Preparing custom pedagogical matrix...",
          isSuccess: false,
        };
      case "phase-4-success":
        return {
          isError: false,
          stage: 3 as AuthStageIndex,
          title: "Identity Verified",
          message: "Launching personalized workspace...",
          isSuccess: true,
        };
      case "error-cancelled":
        return {
          isError: true,
          errorDetails: {
            title: "Google Sign-In Cancelled",
            description:
              "You closed the Google authentication window or declined permission. You can try again or use your email address.",
          },
        };
      case "error-expired":
        return {
          isError: true,
          errorDetails: {
            title: "Authorization Expired",
            description: "The authentication session timed out. Please sign in again to continue.",
          },
        };
      case "error-failed":
        return {
          isError: true,
          errorDetails: {
            title: "Authentication Failed",
            description: "Unable to complete sign-in. Please verify your connection and try again.",
          },
        };
    }
  };

  const stateData = getStateProps();

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a0a18]/90 border border-violet-500/20 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#A78BFA]">
              LABS 00.AUTH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#C4B5FD]">
              Cosmic Clearance UX Standard
            </span>
          </div>
          <h3 className="text-lg font-medium text-white tracking-tight">
            Google OAuth Handshake & Spatial Clearance Studio
          </h3>
          <p className="text-xs text-[#8a8a9e] max-w-2xl leading-relaxed">
            Calibra la posición vertical, telemetría de 3 fases y holgura visual respecto a la
            esfera brillante, anillos orbitales y nodos de constelación del arte cósmico de Lingua.
          </p>
        </div>

        {/* Action Trigger Button */}
        <button
          onClick={() => setIsPlayingSimulation(true)}
          disabled={isPlayingSimulation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 transition-all cursor-pointer"
        >
          <AuthOrbitalLoader size="sm" className="w-4 h-4" />
          <span>{isPlayingSimulation ? "Simulando Flujo..." : "Simular Flujo OAuth"}</span>
        </button>
      </div>

      {/* Control Studio Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel 1: State Trigger Matrix */}
        <div className="p-4 rounded-2xl bg-[#090915]/80 border border-white/10 flex flex-col space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BFA]">
            1. Estados de Autenticación
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "phase-1-handshake", label: "01. Handshake" },
              { id: "phase-2-tokens", label: "02. Tokens" },
              { id: "phase-3-calibration", label: "03. Calibración" },
              { id: "phase-4-success", label: "04. Éxito" },
              { id: "error-cancelled", label: "Err: Cancelado" },
              { id: "error-expired", label: "Err: Expirado" },
              { id: "error-failed", label: "Err: Red/Fallo" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setIsPlayingSimulation(false);
                  setActiveState(btn.id as AuthShowcaseState);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-light transition-all text-left truncate cursor-pointer ${
                  activeState === btn.id
                    ? "bg-violet-600/30 border border-violet-500/60 text-white font-normal shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                    : "bg-white/[0.03] border border-white/5 text-[#9d9db9] hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel 2: Spatial Position Presets */}
        <div className="p-4 rounded-2xl bg-[#090915]/80 border border-white/10 flex flex-col space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BFA]">
            2. Presets de Posición & Holgura
          </span>
          <div className="flex flex-col space-y-1.5">
            {[
              {
                id: "optimal-lower",
                name: "Órbita Equilibrada (Recomendado)",
                desc: "top-[50%] · Justo bajo la apertura cósmica",
              },
              {
                id: "floating-dock",
                name: "Zona Media-Baja",
                desc: "top-[54%] · Mayor holgura",
              },
              {
                id: "minimal-capsule",
                name: "Zona Compacta",
                desc: "top-[48%] · Espaciado ceñido",
              },
              {
                id: "legacy-center",
                name: "Centro Antiguo (Colisión)",
                desc: "top-[42%] · Sobre la esfera y apertura",
              },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePositionPresetChange(p.id as PositionPreset)}
                className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                  positionPreset === p.id
                    ? "bg-indigo-600/25 border border-indigo-500/50 text-white shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                    : "bg-white/[0.03] border border-white/5 text-[#8a8a9e] hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <div className="text-xs font-medium">{p.name}</div>
                <div className="text-[10px] text-[#6d6d88]">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 3: Interactive Y-Axis Calibrator */}
        <div className="p-4 rounded-2xl bg-[#090915]/80 border border-white/10 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A78BFA]">
                3. Calibrador Eje Y
              </span>
              <span className="text-xs font-mono text-violet-300 font-bold">
                {verticalOffsetPercent}%
              </span>
            </div>
            <p className="text-[11px] text-[#8a8a9e] mt-1 leading-relaxed">
              Ajusta la altura vertical en vivo para verificar que no colisione con el arte.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="40"
              max="75"
              value={verticalOffsetPercent}
              onChange={(e) => {
                setPositionPreset("optimal-lower");
                setVerticalOffsetPercent(Number(e.target.value));
              }}
              className="w-full accent-[#8B5CF6] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-[#666680]">
              <span className="text-rose-400">40% (Sobre esfera)</span>
              <span className="text-emerald-400">50% (Equilibrado)</span>
              <span className="text-indigo-400">75% (Muy abajo)</span>
            </div>
          </div>

          {/* Viewport Frame Mode */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-[10px] text-[#8a8a9e]">Vista de Previsualización:</span>
            <div className="flex items-center gap-1">
              {(["desktop", "mobile"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewportMode(mode)}
                  className={`px-2 py-1 rounded text-[10px] font-mono uppercase cursor-pointer ${
                    viewportMode === mode
                      ? "bg-violet-500/30 text-white border border-violet-500/40"
                      : "text-[#666680] hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Stage Viewport Simulator */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#03030E] shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        {/* Frame Topbar */}
        <div className="h-9 px-4 bg-[#0a0a18] border-b border-white/10 flex items-center justify-between text-xs text-[#70708b]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
            <span className="ml-2 font-mono text-[10px] text-[#9090a8]">
              lingua.app/auth/callback (Simulator)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Clear Orbit
            </span>
            <span>Y: {verticalOffsetPercent}%</span>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div
          className={`relative w-full transition-all duration-300 mx-auto ${
            viewportMode === "mobile" ? "max-w-sm my-4 rounded-2xl border border-white/15" : ""
          } h-[580px] sm:h-[660px] overflow-hidden flex flex-col items-center justify-start bg-[#03030E]`}
        >
          {/* Ambient Cosmic Hero Orb Background Asset */}
          <div
            className="absolute inset-0 w-full h-full bg-center bg-contain bg-no-repeat pointer-events-none z-0 opacity-95 blend-graphic-edges"
            style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
          />

          {/* Micro Bottom Softener */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

          {/* Dynamic Calibrated Position Container */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20 transition-all duration-300"
            style={{ top: `${verticalOffsetPercent}%` }}
          >
            {stateData.isError ? (
              <AuthErrorCard
                errorDetails={stateData.errorDetails}
                onRetryGoogle={() => setActiveState("phase-1-handshake")}
                onContinueEmail={() => setActiveState("phase-1-handshake")}
              />
            ) : (
              <AuthStatusDock
                statusTitle={stateData.title}
                statusMessage={stateData.message}
                stage={stateData.stage}
                isSuccess={stateData.isSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
