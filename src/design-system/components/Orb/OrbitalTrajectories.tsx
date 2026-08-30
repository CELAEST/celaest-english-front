import React from "react";

export interface OrbitalNode {
  id: string;
  label: string;
  sublabel?: string;
}

export interface OrbitalTrajectoriesProps {
  size?: number;
  className?: string;
}

export const OrbitalTrajectories: React.FC<OrbitalTrajectoriesProps> = ({
  size = 420,
  className = "",
}) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 460 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
            <stop offset="35%" stopColor="#A78BFA" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#C084FC" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
          </linearGradient>

          <filter id="nodeDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Sweeping Orbital Trajectory Spline Curve (Matching mockup) */}
        <path
          d="M 370 75 C 290 50, 160 120, 85 240 C 35 320, 130 420, 270 410 C 350 400, 420 320, 365 325"
          stroke="url(#orbitLineGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Secondary Orbit Ring */}
        <path
          d="M 370 75 C 410 120, 420 220, 365 325"
          stroke="url(#orbitLineGrad)"
          strokeWidth="0.8"
          strokeDasharray="2 3"
          className="opacity-40"
        />

        {/* Node 1: Left Point ("Remembers every conversation") */}
        <g transform="translate(85, 240)">
          <circle
            r="5"
            fill="#A78BFA"
            filter="url(#nodeDotGlow)"
            className="animate-ping opacity-60"
          />
          <circle r="3.5" fill="#DDD6FE" />
        </g>

        {/* Node 2: Top Right Point ("Learns how you learn") */}
        <g transform="translate(370, 75)">
          <circle
            r="5"
            fill="#A78BFA"
            filter="url(#nodeDotGlow)"
            className="animate-ping opacity-60"
          />
          <circle r="3.5" fill="#DDD6FE" />
        </g>

        {/* Node 3: Bottom Right Point ("Adapts every day") */}
        <g transform="translate(365, 325)">
          <circle
            r="5"
            fill="#A78BFA"
            filter="url(#nodeDotGlow)"
            className="animate-ping opacity-60"
          />
          <circle r="3.5" fill="#DDD6FE" />
        </g>
      </svg>

      {/* Text Callouts centered relative to orb */}
      <div className="absolute inset-0 pointer-events-auto">
        {/* Left Node Text */}
        <div className="absolute top-[225px] left-[-70px] text-right max-w-[130px]">
          <span className="block text-[13px] font-normal text-slate-300 tracking-normal">
            Remembers
          </span>
          <span className="block text-[12px] text-slate-500 font-light leading-tight">
            every conversation
          </span>
        </div>

        {/* Top Right Node Text */}
        <div className="absolute top-[60px] right-[5px] text-left max-w-[130px]">
          <span className="block text-[13px] font-normal text-slate-300 tracking-normal">
            Learns
          </span>
          <span className="block text-[12px] text-slate-500 font-light leading-tight">
            how you learn
          </span>
        </div>

        {/* Bottom Right Node Text */}
        <div className="absolute top-[310px] right-[10px] text-left max-w-[130px]">
          <span className="block text-[13px] font-normal text-slate-300 tracking-normal">
            Adapts
          </span>
          <span className="block text-[12px] text-slate-500 font-light leading-tight">
            every day
          </span>
        </div>
      </div>
    </div>
  );
};
