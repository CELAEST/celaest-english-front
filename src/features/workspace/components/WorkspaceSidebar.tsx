import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";

export interface WorkspaceSidebarProps {
  userName?: string;
  userLevel?: string;
  activeItem?: string;
  onSelectNav?: (route: string) => void;
}

// ============================================================================
// CYBER MINIMALIST SUITE (Bespoke Feature-Referent Vector Primitives)
// Pure Vector Architecture, 1.5px Balanced Stroke, Uncrowded Negative Space
// ============================================================================

export const CyberWorkspaceIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect
      x="2.5"
      y="2.5"
      width="4.8"
      height="11"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.35 : 0}
    />
    <rect
      x="8.7"
      y="2.5"
      width="4.8"
      height="4.8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
      opacity={isActive ? 1 : 0.75}
    />
    <rect
      x="8.7"
      y="8.7"
      width="4.8"
      height="4.8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
  </svg>
);

export const CyberMemoryIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M5.5 2.5h6a1.5 1.5 0 0 1 1.5 1.5v6"
      opacity={isActive ? 0.7 : 0.45}
    />
    <rect
      x="3"
      y="5.5"
      width="8"
      height="8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
  </svg>
);

export const CyberInterviewIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
  >
    <line x1="2.8" y1="7" x2="2.8" y2="9" opacity={isActive ? 1 : 0.6} />
    <line x1="5.4" y1="4.5" x2="5.4" y2="11.5" strokeWidth={strokeWidth + 0.15} />
    <line x1="8" y1="2" x2="8" y2="14" strokeWidth={strokeWidth + 0.35} />
    <line x1="10.6" y1="4.5" x2="10.6" y2="11.5" strokeWidth={strokeWidth + 0.15} />
    <line x1="13.2" y1="7" x2="13.2" y2="9" opacity={isActive ? 1 : 0.6} />
  </svg>
);

export const CyberReadingIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M6.8 2.2v4l1.2-.9 1.2.9v-4"
      fill={isActive ? "currentColor" : "none"}
      opacity={isActive ? 1 : 0.8}
    />
    <path
      d="M2.5 4.8A2 2 0 0 1 8 5.4v7.1A2 2 0 0 0 2.5 11.5V4.8z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    <path
      d="M13.5 4.8A2 2 0 0 0 8 5.4v7.1a2 2 0 0 1 5.5-1V4.8z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
  </svg>
);

export const CyberWritingIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M11.8 2.5l1.7 1.7-7.2 7.2L3 13l1.6-3.3 7.2-7.2z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    <line x1="9.8" y1="4.5" x2="11.5" y2="6.2" opacity={0.7} />
  </svg>
);

export const CyberLabIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M6.5 2.5h3 M7.5 2.5v3L3.5 12a1.2 1.2 0 0 0 1 1.8h7a1.2 1.2 0 0 0 1-1.8L8.5 5.5v-3"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    <line x1="5.2" y1="9.8" x2="10.8" y2="9.8" opacity={0.8} />
    <circle cx="12.5" cy="3.5" r="0.8" fill="currentColor" />
  </svg>
);

export const CyberSettingsIcon = ({
  isActive,
  className = "w-5 h-5 shrink-0",
  size = 20,
  strokeWidth = 1.75,
}: {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="2.5" y1="5.5" x2="13.5" y2="5.5" opacity={0.5} />
    <rect
      x="4.5"
      y="3.8"
      width="3.2"
      height="3.4"
      rx="1.2"
      fill={isActive ? "currentColor" : "#06060e"}
    />
    <line
      x1="6.1"
      y1="4.5"
      x2="6.1"
      y2="6.5"
      stroke={isActive ? "#06060e" : "currentColor"}
      opacity={0.8}
    />
    <line x1="2.5" y1="10.5" x2="13.5" y2="10.5" opacity={0.5} />
    <rect
      x="8.3"
      y="8.8"
      width="3.2"
      height="3.4"
      rx="1.2"
      fill={isActive ? "currentColor" : "#06060e"}
    />
    <line
      x1="9.9"
      y1="9.5"
      x2="9.9"
      y2="11.5"
      stroke={isActive ? "#06060e" : "currentColor"}
      opacity={0.8}
    />
  </svg>
);

// Bespoke CELAEST Emblem Vector Mark
const CelaestLogoMark: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 380 503" fill="none" className={className}>
    <path
      d="M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z"
      fill="currentColor"
    />
  </svg>
);

// Mobile Floating Glass Bottom Dock (Visible only on viewports < lg)
const prefetchTabRoute = (id: string) => {
  if (id === "interview") void import("../../conversation");
  else if (id === "writing") void import("../../writing");
  else if (id === "reading") void import("../../reading");
  else if (id === "memory") void import("../../memory");
  else if (id === "settings") void import("../../settings");
};

const MobileBottomDock: React.FC<{
  navItems: Array<{ id: string; label: string; renderIcon: (active: boolean) => React.ReactNode }>;
  activeItem: string;
  onSelectNav?: ((route: string) => void) | undefined;
  accentVariant?: string | undefined;
}> = ({ navItems, activeItem, onSelectNav, accentVariant = "bauhaus_geometry" }) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-3 left-3 right-3 z-50 h-14 max-w-lg mx-auto bg-[#06060e]/92 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex items-center justify-around px-2 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(112,72,232,0.12)] select-none"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      {navItems.map((item) => {
        const isActive = activeItem === item.id;
        const activeBgClass =
          accentVariant === "architectural_monolith"
            ? "bg-gradient-to-r from-amber-600 to-amber-700 shadow-[0_0_16px_rgba(217,119,6,0.4)]"
            : accentVariant === "swiss_editorial"
              ? "bg-white/20 border border-white/40 shadow-[0_0_16px_rgba(255,255,255,0.25)]"
              : "bg-gradient-to-r from-[#7048e8] to-[#6038e0] shadow-[0_0_16px_rgba(112,72,232,0.4)]";

        return (
          <button
            key={item.id}
            aria-label={item.label}
            onClick={() => {
              MobileAudioUnlocker.unlock();
              if (onSelectNav) onSelectNav(item.id);
            }}
            onMouseEnter={() => prefetchTabRoute(item.id)}
            onTouchStart={() => {
              MobileAudioUnlocker.unlock();
              prefetchTabRoute(item.id);
            }}
            onFocus={() => prefetchTabRoute(item.id)}
            className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
              isActive ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeMobileNavBlock"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={`absolute inset-0 rounded-xl z-0 ${activeBgClass}`}
              />
            )}
            <div className="relative z-10 flex items-center justify-center">
              {item.renderIcon(isActive)}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  userName: _userName = "Esteban Perez",
  userLevel: _userLevel = "A1 Elementary",
  activeItem = "workspace",
  onSelectNav,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("celaest_sidenav_variant");
      if (stored === "architectural_monolith" || stored === "swiss_editorial") {
        return stored;
      }
      return "bauhaus_geometry";
    }
    return "bauhaus_geometry";
  });

  useEffect(() => {
    const handleVariantChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        if (
          customEvent.detail === "architectural_monolith" ||
          customEvent.detail === "swiss_editorial"
        ) {
          setActiveVariant(customEvent.detail);
        } else {
          setActiveVariant("bauhaus_geometry");
        }
      }
    };
    window.addEventListener("celaest:sidenav_variant_changed", handleVariantChange);
    return () => {
      window.removeEventListener("celaest:sidenav_variant_changed", handleVariantChange);
    };
  }, []);

  const navItems = [
    {
      id: "workspace",
      label: "WORKSPACE",
      renderIcon: (active: boolean) => <CyberWorkspaceIcon isActive={active} />,
    },
    {
      id: "memory",
      label: "MEMORY VAULT",
      renderIcon: (active: boolean) => <CyberMemoryIcon isActive={active} />,
    },
    {
      id: "interview",
      label: "INTERVIEW",
      renderIcon: (active: boolean) => <CyberInterviewIcon isActive={active} />,
    },
    {
      id: "reading",
      label: "READING",
      renderIcon: (active: boolean) => <CyberReadingIcon isActive={active} />,
    },
    {
      id: "writing",
      label: "WRITING STUDIO",
      renderIcon: (active: boolean) => <CyberWritingIcon isActive={active} />,
    },
    ...(import.meta.env.DEV
      ? [
          {
            id: "lab",
            label: "DESIGN LAB",
            renderIcon: (active: boolean) => <CyberLabIcon isActive={active} />,
          },
        ]
      : []),
    {
      id: "settings",
      label: "SETTINGS",
      renderIcon: (active: boolean) => <CyberSettingsIcon isActive={active} />,
    },
  ];

  const handleLogout = async () => {
    try {
      const { SupabaseAuthAdapter } = await import("../../../infrastructure/adapters/auth/SupabaseAuthAdapter");
      await SupabaseAuthAdapter.getInstance().logout();
      localStorage.removeItem("lingua_onboarding_completed");
      localStorage.removeItem("lingua_user_settings");
    } catch (e) {
      console.error("Logout error", e);
    }
    if (onSelectNav) onSelectNav("onboarding");
  };

  // =========================================================================
  // PARADIGM 2: PETER ZUMTHOR THERME MONOLITH (IMAGE 2 INSPIRATION)
  // =========================================================================
  if (activeVariant === "architectural_monolith") {
    return (
      <>
        <div className="hidden lg:flex relative shrink-0 my-auto ml-6 sm:ml-10 lg:ml-12 z-50 w-[72px] h-auto min-h-[540px] max-h-[calc(100vh-48px)] items-center">
        <motion.aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ width: isHovered ? 256 : 72 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative flex flex-col justify-between bg-[#050608] border border-stone-800/90 rounded-2xl py-5 px-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.95)] shrink-0 z-50 select-none overflow-hidden"
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full min-h-[44px] overflow-hidden">
              <div className="w-11 h-11 border border-stone-800 rounded-xl flex items-center justify-center text-[10px] font-mono text-amber-500/90 font-bold shrink-0">
                MZ
              </div>
              <div
                className={`flex flex-col text-left ml-3.5 transition-all duration-200 overflow-hidden ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                <span className="text-[8.5px] font-mono text-amber-500/80 uppercase tracking-[0.25em] whitespace-nowrap">
                  MONOLITH // THERME
                </span>
                <span className="text-xs font-light text-white tracking-[0.2em] uppercase font-sans mt-1.5 whitespace-nowrap">
                  CELAEST
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-stone-800 w-full mt-4 mb-3.5" />

            <nav className="flex flex-col space-y-1.5 relative w-full">
              {[
                { id: "workspace", num: "01", label: "BRIEF" },
                { id: "memory", num: "02", label: "VAULT" },
                { id: "interview", num: "03", label: "VOICE" },
                { id: "reading", num: "04", label: "PAGES" },
                { id: "writing", num: "05", label: "QUILL" },
                ...(import.meta.env.DEV ? [{ id: "lab", num: "06", label: "FORGE" }] : []),
                { id: "settings", num: "07", label: "SYSTEM" },
              ].map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav && onSelectNav(item.id)}
                    onMouseEnter={() => prefetchTabRoute(item.id)}
                    onTouchStart={() => prefetchTabRoute(item.id)}
                    onFocus={() => prefetchTabRoute(item.id)}
                    className={`relative flex items-center w-full h-11 rounded-xl transition-colors cursor-pointer group ${
                      isActive ? "text-amber-300 font-medium" : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <div className="w-11 h-11 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono opacity-50">{item.num}</span>
                    </div>
                    <div
                      className={`flex items-center justify-between flex-1 ml-3.5 transition-all duration-200 overflow-hidden ${
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                      }`}
                    >
                      <span className="text-xs font-light tracking-[0.18em] uppercase whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="activeMonolithDash"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="text-amber-400 text-sm font-light leading-none ml-2"
                        >
                          —
                        </motion.span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col w-full mt-auto pt-2">
            <div className="h-[1px] bg-stone-800 w-full mb-4" />
            {isHovered ? (
              <div className="flex items-center justify-between w-full px-1.5 py-1">
                <div className="flex flex-col text-left overflow-hidden pr-2">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider truncate">{_userName}</span>
                  <span className="text-[10px] font-mono text-amber-400/80 mt-1.5">{_userLevel}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 rounded text-[10px] font-mono text-stone-400 hover:text-amber-300 uppercase tracking-wider cursor-pointer"
                >
                  [SALIR]
                </button>
              </div>
            ) : (
              <div className="w-11 h-11 flex items-center justify-center">
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-400 hover:text-amber-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
                    <path d="M10 11l3-3-3-3" />
                    <path d="M13 8H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.aside>
      </div>
      <MobileBottomDock
        navItems={navItems}
        activeItem={activeItem}
        onSelectNav={onSelectNav}
        accentVariant="architectural_monolith"
      />
    </>
    );
  }

  // =========================================================================
  // PARADIGM 3: SWISS EDITORIAL GRID 01 (IMAGE 3 INSPIRATION)
  // =========================================================================
  if (activeVariant === "swiss_editorial") {
    return (
      <>
        <div className="hidden lg:flex relative shrink-0 my-auto ml-6 sm:ml-10 lg:ml-12 z-50 w-[72px] h-auto min-h-[540px] max-h-[calc(100vh-48px)] items-center">
        <motion.aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ width: isHovered ? 256 : 72 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative flex flex-col justify-between bg-[#030305] border border-white/[0.12] rounded-2xl py-5 px-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.95)] shrink-0 z-50 select-none overflow-hidden"
        >
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full min-h-[44px] overflow-hidden">
              <div className="w-11 h-11 border border-white/[0.15] rounded-xl flex items-center justify-center text-[10px] font-mono text-white/80 font-bold shrink-0">
                01
              </div>
              <div
                className={`flex flex-col text-left ml-3.5 transition-all duration-200 overflow-hidden ${
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                <span className="text-[8.5px] font-mono tracking-[0.3em] text-white/50 uppercase whitespace-nowrap">
                  ARCHITECTURAL GRID / 01
                </span>
                <span className="text-sm font-normal tracking-[0.2em] text-white uppercase font-sans mt-1.5 whitespace-nowrap">
                  CELAEST
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-white/[0.15] w-full mt-4 mb-3.5" />

            <nav className="flex flex-col space-y-1.5 relative w-full">
              {[
                { id: "workspace", num: "01", label: "WORKSPACE" },
                { id: "memory", num: "02", label: "MEMORY VAULT" },
                { id: "interview", num: "03", label: "INTERVIEW" },
                { id: "reading", num: "04", label: "READING" },
                { id: "writing", num: "05", label: "WRITING STUDIO" },
                ...(import.meta.env.DEV ? [{ id: "lab", num: "06", label: "DESIGN LAB" }] : []),
                { id: "settings", num: "07", label: "SETTINGS" },
              ].map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectNav && onSelectNav(item.id)}
                    onMouseEnter={() => prefetchTabRoute(item.id)}
                    onTouchStart={() => prefetchTabRoute(item.id)}
                    onFocus={() => prefetchTabRoute(item.id)}
                    className={`relative flex items-center w-full h-11 rounded-xl transition-colors cursor-pointer group ${
                      isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="w-11 h-11 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono text-zinc-500">{item.num}</span>
                    </div>
                    <div
                      className={`flex items-center justify-between flex-1 ml-3.5 transition-all duration-200 overflow-hidden ${
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                      }`}
                    >
                      <span
                        className={`text-xs tracking-wider uppercase font-light whitespace-nowrap relative ${
                          isActive ? "font-normal" : ""
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeSwissUnderline"
                            transition={{ type: "spring", stiffness: 420, damping: 32 }}
                            className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white"
                          />
                        )}
                      </span>
                      {isActive && <span className="text-xs font-mono text-white/70 ml-2">+</span>}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col w-full mt-auto pt-2">
            <div className="h-[1px] bg-white/[0.15] w-full mb-4" />
            {isHovered ? (
              <div className="flex items-center justify-between w-full px-1.5 py-1">
                <div className="flex flex-col text-left overflow-hidden pr-2">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider truncate">{_userName}</span>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1.5">{_userLevel}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 rounded text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-wider cursor-pointer"
                >
                  [SALIR]
                </button>
              </div>
            ) : (
              <div className="w-11 h-11 flex items-center justify-center">
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
                    <path d="M10 11l3-3-3-3" />
                    <path d="M13 8H6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.aside>
      </div>
      <MobileBottomDock
        navItems={navItems}
        activeItem={activeItem}
        onSelectNav={onSelectNav}
        accentVariant="swiss_editorial"
      />
    </>
    );
  }

  // =========================================================================
  // PRIMARY ARCHITECTURAL STANDARD: CELAEST CONSTRUCTIVIST GEOMETRY
  // Calibrated 72px -> 256px silky spring reveal.
  // 100% Fixed Optical Icon Axis (x=36px dead-centered in collapsed state).
  // Zero X-axis jitter. Zero vertical squashing (fixed 44px item row).
  // Generous spatial rhythm (space-y-1.5, py-5 padding, mt-1.5 text spacing).
  // Active State: Icons fill with solid white (fill="currentColor" text-white).
  // Software Native Colors: Electric Violet #7048e8, Deep Space Glass #06060e,
  // 1px architectural hairlines (bg-white/[0.08]).
  // Editorial Minimalist Footer: Uncrowded, noble proportions, solid design.
  // =========================================================================
  return (
    <>
      <div className="hidden lg:flex relative shrink-0 my-auto ml-6 sm:ml-10 lg:ml-12 z-50 w-[72px] h-auto min-h-[540px] max-h-[calc(100vh-48px)] items-center">
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 256 : 72 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative flex flex-col justify-between bg-[#06060e] border border-white/[0.08] rounded-2xl py-5 px-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.92),0_0_40px_rgba(112,72,232,0.08)] shrink-0 z-50 select-none overflow-hidden"
      >
        {/* Top Brand Header */}
        <div className="flex flex-col w-full">
          <div className="flex items-center w-full min-h-[44px] overflow-hidden">
            {/* The CELAEST Emblem Badge: 44px x 44px - Mathematically centered at x=36px */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7850e8] to-[#6038e0] flex items-center justify-center shadow-[0_0_18px_rgba(112,72,232,0.4)] shrink-0 text-white">
              <CelaestLogoMark className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            {/* CELAEST Brand Typography: Enhanced vertical spacing, PRO tag removed */}
            <div
              className={`flex items-center justify-between flex-1 ml-3.5 transition-all duration-200 overflow-hidden ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
              }`}
            >
              <div className="flex flex-col text-left whitespace-nowrap justify-center py-1">
                <span className="text-[8.5px] font-mono tracking-[0.28em] text-violet-300/75 uppercase leading-none">
                  ENGLISH ENGINE
                </span>
                <span className="text-sm font-bold tracking-[0.22em] text-white uppercase font-sans mt-2 leading-tight">
                  CELAEST
                </span>
              </div>
            </div>
          </div>

          {/* Clean 1px Hairline Divider matching software theme */}
          <div className="h-[1px] bg-white/[0.08] w-full mt-4 mb-3.5" />

          {/* Navigation Item Stack: 100% Fixed Optical Icon Axis & Centered */}
          <nav className="flex flex-col w-full space-y-1.5 relative">
            {navItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  aria-label={item.label}
                  onClick={() => onSelectNav && onSelectNav(item.id)}
                  onMouseEnter={() => prefetchTabRoute(item.id)}
                  onTouchStart={() => prefetchTabRoute(item.id)}
                  onFocus={() => prefetchTabRoute(item.id)}
                  className={`relative flex items-center w-full h-11 rounded-xl transition-colors duration-150 cursor-pointer group ${
                    isActive ? "text-white font-medium" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Sliding Active Indicator Block in CELAEST Electric Violet */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCelaestNavBlock"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-gradient-to-r from-[#7048e8] to-[#6038e0] shadow-[0_0_20px_rgba(112,72,232,0.35)] rounded-xl z-0"
                    />
                  )}

                  {/* Icon Container: 44px x 44px - Icons fill with solid white when active */}
                  <div className="w-11 h-11 flex items-center justify-center shrink-0 relative z-10 transition-transform duration-150 group-hover:scale-105">
                    {item.renderIcon(isActive)}
                  </div>

                  {/* Clean Label: No tags, pure typographic clarity */}
                  <div
                    className={`flex items-center justify-between flex-1 -ml-0.5 relative z-10 transition-all duration-200 overflow-hidden ${
                      isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.14em] font-light whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Section: Pure Editorial Design (Generous Spacing, Un-cramped) */}
        <div className="flex flex-col w-full mt-auto pt-2">
          {/* Subtle 1px Hairline */}
          <div className="h-[1px] bg-white/[0.08] w-full mb-4" />

          {/* User Section / Exit Action */}
          {isHovered ? (
            <div className="flex items-center justify-between w-full px-1.5 py-1 transition-opacity duration-200">
              <div className="flex flex-col text-left overflow-hidden pr-2">
                <span className="text-xs font-semibold tracking-wider text-zinc-100 uppercase truncate">
                  {_userName}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider mt-1.5 truncate">
                  {_userLevel}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded text-[10px] font-mono tracking-widest text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer uppercase shrink-0"
                title="Cerrar Sesión"
              >
                [SALIR]
              </button>
            </div>
          ) : (
            /* Collapsed: Perfectly Centered Disconnect Icon (44px row, x=36px) */
            <div className="w-11 h-11 flex items-center justify-center">
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                title="Cerrar Sesión"
              >
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
                  <path d="M10 11l3-3-3-3" />
                  <path d="M13 8H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </div>
    <MobileBottomDock
      navItems={navItems}
      activeItem={activeItem}
      onSelectNav={onSelectNav}
      accentVariant="bauhaus_geometry"
    />
  </>
  );
};
