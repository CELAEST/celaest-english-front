import React, { useState, useEffect } from "react";
import { KineticLuxuryText } from "./KineticLuxuryText";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
  TechnicalWritingQuillIcon,
  QuantumNeuralGaugeIcon,
} from "./WorkspaceBespokeIcons";

export interface WorkspaceSidebarProps {
  userName?: string;
  userLevel?: string;
  activeItem?: string;
  onSelectNav?: (route: string) => void;
}

// Official CELAEST logo path extracted directly from landing-celaest
const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D =
  "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  userName: _userName = "Learner",
  userLevel: _userLevel = "B1 Level",
  activeItem = "workspace",
  onSelectNav,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("celaest_sidenav_variant") || "quantum_island";
    }
    return "quantum_island";
  });

  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveVariant(customEvent.detail);
      }
    };
    window.addEventListener("celaest:sidenav_variant_changed", handleVariantChange);
    return () => {
      window.removeEventListener("celaest:sidenav_variant_changed", handleVariantChange);
    };
  }, []);

  const navItems = [
    { id: "workspace", icon: <DashboardGridIcon />, label: "Workspace" },
    { id: "memory", icon: <CognitiveMemoryBrainIcon className="w-5 h-5" />, label: "Memory", hasDot: true },
    { id: "interview", icon: <StudioVoiceMicIcon className="w-5 h-5" />, label: "Interview" },
    { id: "reading", icon: <PrecisionOpenBookIcon className="w-5 h-5" />, label: "Reading" },
    { id: "writing", icon: <TechnicalWritingQuillIcon className="w-5 h-5" />, label: "Writing" },
    ...(import.meta.env.DEV
      ? [{ id: "lab", icon: <QuantumNeuralGaugeIcon className="w-5 h-5" />, label: "Design Lab" }]
      : []),
    { id: "settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  return (
    <div className="relative shrink-0 my-auto ml-8 sm:ml-12 lg:ml-16 z-50 w-16 h-auto min-h-[520px] max-h-[calc(100vh-48px)] flex items-center">
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex flex-col justify-between bg-[#06070d]/90 border border-white/[0.08] rounded-[28px] py-4 px-2 shadow-[0_24px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-3xl shrink-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none group ${
          isHovered ? "w-60 px-3.5" : "w-16"
        }`}
      >
        {/* Top Brand / Active Pill Header */}
        <div className="flex flex-col items-center w-full space-y-3">
          {/* Top Active Dashboard Button with Official CELAEST Logo SVG */}
          <div className="w-full flex items-center justify-center">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/[0.12] text-white shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center shrink-0 cursor-pointer hover:border-white/25 transition-all p-2 group/logo">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#A27FF3]/20 via-transparent to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity pointer-events-none" />
              <svg
                viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
              </svg>
            </div>
            {isHovered && (
              <span className="ml-3 text-[13px] font-semibold text-white tracking-[0.24em] whitespace-nowrap opacity-100 transition-opacity duration-300 delay-75 uppercase font-sans">
                CELAEST
              </span>
            )}
          </div>

          {/* Precision Hairline Separator */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-0.5" />

          {/* Navigation Item Stack */}
          <nav className="flex flex-col w-full space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  aria-label={item.label}
                  onClick={() => onSelectNav && onSelectNav(item.id)}
                  className={`relative flex items-center w-full py-2 rounded-xl transition-all duration-200 group/btn cursor-pointer ${
                    isHovered ? "px-3 justify-start" : "justify-center"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent text-white border border-white/[0.12] shadow-[0_2px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  {/* Integrated Luminous Accent Bar on Active */}
                  {isActive && (
                    <div className="absolute left-1.5 w-[2.5px] h-4 rounded-full bg-gradient-to-b from-[#C4B5FD] to-white shadow-[0_0_8px_#A27FF3]" />
                  )}

                  {/* Icon */}
                  <div className={`flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover/btn:scale-105 ${
                    isActive ? "text-white filter drop-shadow-[0_0_6px_rgba(162,127,243,0.5)]" : "text-inherit"
                  }`}>
                    {React.cloneElement(item.icon as React.ReactElement, {
                      className: "w-[19px] h-[19px]",
                    })}
                  </div>

                  {/* Label Revealed on Hover */}
                  {isHovered && (
                    <span
                      className={`ml-3 text-[13px] tracking-wide whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-white font-medium"
                          : "text-zinc-400 group-hover/btn:text-white font-normal"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Notification Dot (Memory) */}
                  {"hasDot" in item && (item as { hasDot?: boolean }).hasDot && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_8px_#A27FF3] ${
                        isHovered ? "ml-auto mr-1" : "absolute top-2 right-2"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Dynamic Luxury Sidenav Architecture */}
        <div className="flex flex-col items-center w-full space-y-2 mt-auto pt-2">
          {/* Precision Hairline Separator */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-0.5" />

          {/* ZERO-BOX 1: ATELIER MINIMALIST (Swiss Precision, Pure Floating Typography - Default) */}
          {(activeVariant === "atelier_minimalist" || activeVariant === "quantum_island") && (
            <div
              onClick={() => onSelectNav && onSelectNav("settings")}
              className={`relative w-full transition-all duration-300 cursor-pointer group/atelier bg-transparent border-0 select-none ${
                isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
              }`}
            >
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center overflow-hidden">
                  {/* Luxury Portrait Avatar with 0.5px Specular Halo */}
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                    <img
                      src="/assets/avatar_executive_luxury.jpg"
                      alt={_userName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#A27FF3]/25 to-transparent pointer-events-none mix-blend-overlay" />
                  </div>
                  {isHovered && (
                    <div className="flex flex-col items-start ml-3 overflow-hidden text-left">
                      <KineticLuxuryText
                        text={_userName}
                        trigger={isHovered}
                        className="text-[13px] font-medium text-white tracking-tight truncate leading-tight group-hover/atelier:text-zinc-100"
                      />
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                        <span className="text-[10.5px] text-zinc-400 font-sans tracking-wide truncate">
                          {_userLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ZERO-BOX 2: ACOUSTIC RESONANCE (Voice-AI Luxury Whisper Filaments) */}
          {(activeVariant === "acoustic_resonance" || activeVariant === "harmonic_frequency") && (
            <div
              onClick={() => onSelectNav && onSelectNav("settings")}
              className={`relative w-full transition-all duration-300 cursor-pointer group/acoustic bg-transparent border-0 select-none ${
                isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#A27FF3]/30 shadow-[0_0_12px_rgba(162,127,243,0.25)]">
                    <img
                      src="/assets/avatar_executive_luxury.jpg"
                      alt={_userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Acoustic Equalizer Micro-Filaments (Zero box, pure sound floating) */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                    <span className="w-[1.5px] h-2 bg-[#A27FF3] rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                    <span className="w-[1.5px] h-3.5 bg-white rounded-full animate-[pulse_1.1s_ease-in-out_0.2s_infinite]" />
                    <span className="w-[1.5px] h-1.5 bg-[#38BDF8] rounded-full animate-[pulse_0.9s_ease-in-out_0.4s_infinite]" />
                  </div>
                </div>
                {isHovered && (
                  <div className="flex flex-col items-start ml-4 overflow-hidden text-left">
                    <KineticLuxuryText
                      text={_userName}
                      trigger={isHovered}
                      className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                    />
                    <span className="text-[10.5px] text-[#A27FF3] font-sans tracking-wide truncate mt-0.5">
                      {_userLevel} · Voice Ready
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ZERO-BOX 3: SPECULAR GLASS RING (Apple Vision Pro Caustic Halo) */}
          {activeVariant === "specular_glass" && (
            <div
              onClick={() => onSelectNav && onSelectNav("settings")}
              className={`relative w-full transition-all duration-300 cursor-pointer group/specular bg-transparent border-0 select-none ${
                isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                  <div className="absolute -inset-1 rounded-full border border-white/25 shadow-[0_0_12px_rgba(255,255,255,0.2)] animate-[spin_10s_linear_infinite]" />
                  <div className="w-8 h-8 rounded-full overflow-hidden relative z-10">
                    <img
                      src="/assets/avatar_executive_luxury.jpg"
                      alt={_userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {isHovered && (
                  <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left">
                    <KineticLuxuryText
                      text={_userName}
                      trigger={isHovered}
                      className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                    />
                    <span className="text-[10.5px] text-zinc-400 font-sans tracking-wide truncate mt-0.5">
                      {_userLevel} · Spatial Sync
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ZERO-BOX 4: PRECISION CHRONO ORBIT (Linear / Haute Horlogerie Arc) */}
          {(activeVariant === "precision_chrono" || activeVariant === "kinetic_decoder" || activeVariant === "kinetic_laser" || activeVariant === "velvet_aurora" || activeVariant === "laser_horizon" || activeVariant === "quantum_particles" || activeVariant === "mercury_fluid") && (
            <div
              onClick={() => onSelectNav && onSelectNav("settings")}
              className={`relative w-full transition-all duration-300 cursor-pointer group/chrono bg-transparent border-0 select-none ${
                isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
              }`}
            >
              <div className="flex items-center w-full">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <svg className="w-9 h-9 -rotate-90 absolute pointer-events-none" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-white/10"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-[#A27FF3]"
                      strokeWidth="1.5"
                      strokeDasharray="100"
                      strokeDashoffset="35"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="w-7 h-7 rounded-full overflow-hidden relative z-10 ring-1 ring-white/20">
                    <img
                      src="/assets/avatar_executive_luxury.jpg"
                      alt={_userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {isHovered && (
                  <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left">
                    <KineticLuxuryText
                      text={_userName}
                      trigger={isHovered}
                      className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                    />
                    <span className="text-[10.5px] text-[#A27FF3] font-sans tracking-wide truncate mt-0.5">
                      {_userLevel} · 65% Momentum
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Logout Action Button (Present across all styles) */}
          <button
            onClick={async () => {
              try {
                const { SupabaseAuthAdapter } = await import("../../../infrastructure/adapters/auth/SupabaseAuthAdapter");
                await SupabaseAuthAdapter.getInstance().logout();
                localStorage.removeItem("lingua_onboarding_completed");
                localStorage.removeItem("lingua_user_settings");
              } catch (e) {
                console.error("Logout error", e);
              }
              if (onSelectNav) onSelectNav("onboarding");
            }}
            className={`flex items-center w-full py-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer group/logout ${
              isHovered ? "px-3 justify-start" : "justify-center"
            }`}
            aria-label="Log out"
          >
            <div className="flex items-center justify-center w-6 h-6 shrink-0 text-inherit">
              <LogoutIcon className="w-4 h-4 group-hover/logout:scale-110 transition-all" />
            </div>
            {isHovered && (
              <span className="ml-3 text-xs font-normal tracking-wide whitespace-nowrap text-inherit transition-colors">
                Cerrar Sesión
              </span>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
};

// SVG Icons matching reference image
const DashboardGridIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
  </svg>
);

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
