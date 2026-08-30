import React from "react";

export interface ConversationOrbSphereProps {
  size?: number;
  isAnimated?: boolean;
}

export const ConversationOrbSphere: React.FC<ConversationOrbSphereProps> = ({
  size = 280,
  isAnimated = true,
}) => {
  // Generate curved particle latitude lines matching Image 1 100%
  const particlePaths = [
    { d: "M 20 140 Q 140 20, 260 140", dash: "3 8", speed: "12s" },
    { d: "M 25 110 Q 140 50, 255 110", dash: "2.5 7", speed: "10s" },
    { d: "M 30 80 Q 140 70, 250 80", dash: "3 9", speed: "14s" },
    { d: "M 35 170 Q 140 100, 245 170", dash: "2 8", speed: "11s" },
    { d: "M 45 200 Q 140 130, 235 200", dash: "3 7", speed: "15s" },
    { d: "M 60 230 Q 140 160, 220 230", dash: "2.5 9", speed: "9s" },
    { d: "M 80 250 Q 140 190, 200 250", dash: "2 6", speed: "13s" },
  ];

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative flex items-center justify-center select-none"
    >
      {/* 1. Outer Deep Ambient Aura Glow */}
      <div className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(157,96,255,0.45)_0%,rgba(110,50,232,0.25)_45%,transparent_75%)] blur-2xl animate-pulse pointer-events-none" />

      {/* 2. Main 3D Particle Sphere SVG Vectorial Engine */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 280 280"
        fill="none"
        className={`relative z-10 ${isAnimated ? "animate-[pulse_3s_ease-in-out_infinite]" : ""}`}
      >
        <defs>
          {/* Radial Gradient for 3D Sphere Volume Shading */}
          <radialGradient id="sphereVolume" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#C8A2FF" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#9D60FF" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#5D26D6" stopOpacity="0.4" />
            <stop offset="85%" stopColor="#250B6E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#08031A" stopOpacity="0" />
          </radialGradient>

          {/* Glowing Particle Stroke Gradient */}
          <linearGradient id="particleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#E4C8FF" />
            <stop offset="70%" stopColor="#A865FF" />
            <stop offset="100%" stopColor="#6E28E0" />
          </linearGradient>

          {/* Outer Boundary Rim Glow Gradient */}
          <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EAD8FF" />
            <stop offset="50%" stopColor="#9D60FF" />
            <stop offset="100%" stopColor="#5215C6" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="sphereGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Boundary Rim with Neon Glow */}
        <circle
          cx="140"
          cy="140"
          r="125"
          stroke="url(#rimGlow)"
          strokeWidth="1.5"
          opacity="0.85"
          filter="url(#sphereGlowFilter)"
        />

        {/* 3D Sphere Volume Shading Fill */}
        <circle cx="140" cy="140" r="124" fill="url(#sphereVolume)" />

        {/* Curved Wave Particle Latitude Lines (Exact Match of Image 1) */}
        {particlePaths.map((item, idx) => (
          <path
            key={idx}
            d={item.d}
            stroke="url(#particleGlow)"
            strokeWidth="2"
            strokeDasharray={item.dash}
            strokeLinecap="round"
            opacity={0.75 + (idx % 3) * 0.1}
            filter="url(#sphereGlowFilter)"
            className={isAnimated ? "transition-all duration-1000" : ""}
          />
        ))}

        {/* Additional Floating Ambient Stars / Sparkle Particles inside Sphere */}
        <circle cx="100" cy="90" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="180" cy="110" r="1.2" fill="#E4C8FF" opacity="0.8" />
        <circle cx="120" cy="160" r="1.5" fill="#FFFFFF" opacity="0.95" />
        <circle cx="160" cy="190" r="1.2" fill="#D2A8FF" opacity="0.7" />
        <circle cx="85" cy="170" r="1" fill="#FFFFFF" opacity="0.6" />
        <circle cx="205" cy="150" r="1.3" fill="#E4C8FF" opacity="0.85" />
      </svg>
    </div>
  );
};
