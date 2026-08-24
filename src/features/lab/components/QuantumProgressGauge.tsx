import React, { useState } from 'react';

export interface QuantumProgressGaugeProps {
  value?: number; // 0 to 100
  size?: number;
  interactive?: boolean;
  label?: string;
  sublabel?: string;
}

export const QuantumProgressGauge: React.FC<QuantumProgressGaugeProps> = ({
  value: initialValue = 72,
  size = 240,
  interactive = true,
  label = "Neural Proficiency",
  sublabel = "Adaptive AI Linguistic Alignment"
}) => {
  const [val, setVal] = useState<number>(initialValue);

  const strokeWidth = 8;
  const center = size / 2;
  const radius = (size - strokeWidth * 2 - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedVal = Math.min(100, Math.max(0, val));
  const strokeDashoffset = circumference - (clampedVal / 100) * circumference;

  // Outer dotted/tick ring radius
  const tickRadius = radius + 14;
  const totalTicks = 36;
  const tickAngles = Array.from({ length: totalTicks }, (_, i) => (i * 360) / totalTicks);

  return (
    <div className="flex flex-col items-center justify-center select-none p-6 rounded-3xl bg-[#070714]/80 border border-white/[0.06] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all">
      {/* Gauge Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            {/* Violet-to-Purple Neon Gradient */}
            <linearGradient id="quantumGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="50%" stopColor="#A27FF3" />
              <stop offset="100%" stopColor="#7048E8" />
            </linearGradient>

            {/* Glowing Drop Filter for Neon Arc */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#A27FF3" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* 1. Outer Orbit Dotted / Tick Ring */}
          <g className="opacity-40">
            {tickAngles.map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              const x = center + tickRadius * Math.cos(rad);
              const y = center + tickRadius * Math.sin(rad);
              const isActive = (idx / totalTicks) * 100 <= clampedVal;

              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r={isActive ? 1.5 : 1}
                  fill={isActive ? "#A27FF3" : "#3b3c54"}
                  className="transition-colors duration-300"
                />
              );
            })}
          </g>

          {/* 2. Base Dark Track Ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* 3. Active Glowing Gradient Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#quantumGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${center} ${center})`}
            filter="url(#gaugeGlow)"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* 4. Center Bespoke Linguistic / Neural Node Emblem */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Exact Neural / Formant Matrix Icon matching user's design */}
          <div className="relative w-16 h-16 flex items-center justify-center text-[#C4B5FD] animate-[pulse_4s_ease-in-out_infinite]">
            <svg
              viewBox="0 0 64 64"
              className="w-full h-full text-[#C4B5FD]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Vertical Connection Stems */}
              <line x1="26" y1="14" x2="26" y2="50" strokeWidth="1.5" stroke="#7048E8" strokeOpacity="0.8" />
              <line x1="32" y1="10" x2="32" y2="54" strokeWidth="1.75" stroke="#A27FF3" />
              <line x1="38" y1="14" x2="38" y2="50" strokeWidth="1.5" stroke="#7048E8" strokeOpacity="0.8" />

              {/* Diagonal Cross Matrix Bonds */}
              <line x1="20" y1="20" x2="44" y2="44" strokeWidth="1.5" stroke="#8b5cf6" strokeOpacity="0.6" />
              <line x1="20" y1="44" x2="44" y2="20" strokeWidth="1.5" stroke="#8b5cf6" strokeOpacity="0.6" />
              <line x1="26" y1="14" x2="38" y2="50" strokeWidth="1.2" stroke="#A27FF3" strokeOpacity="0.4" />
              <line x1="26" y1="50" x2="38" y2="14" strokeWidth="1.2" stroke="#A27FF3" strokeOpacity="0.4" />

              {/* Horizontal Center Axis */}
              <line x1="16" y1="32" x2="48" y2="32" strokeWidth="1.5" stroke="#A27FF3" strokeOpacity="0.7" />

              {/* Top Satellite Nodes */}
              <circle cx="20" cy="20" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="26" cy="14" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="32" cy="10" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="38" cy="14" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="44" cy="20" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />

              {/* Bottom Satellite Nodes */}
              <circle cx="20" cy="44" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="26" cy="50" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="32" cy="54" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="38" cy="50" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />
              <circle cx="44" cy="44" r="3.5" fill="#181336" stroke="#C4B5FD" strokeWidth="1.75" />

              {/* Central Quantum Node Ring + Core Dot */}
              <circle cx="32" cy="32" r="5.5" fill="#0c0a24" stroke="#ffffff" strokeWidth="2" />
              <circle cx="32" cy="32" r="2" fill="#A27FF3" />
            </svg>
          </div>

          {/* Large Clean Percentage Indicator */}
          <span className="text-xl font-sans font-bold text-white tracking-tight mt-1">
            {Math.round(clampedVal)}%
          </span>
        </div>
      </div>

      {/* Label and Subtitle */}
      <div className="mt-4 text-center">
        <h4 className="text-sm font-medium text-white tracking-wide">{label}</h4>
        <p className="text-xs text-[#8a8a9e] mt-0.5">{sublabel}</p>
      </div>

      {/* Interactive Range Slider to Live-Test Value */}
      {interactive && (
        <div className="w-full max-w-[200px] mt-4 flex flex-col items-center space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={clampedVal}
            onChange={(e) => setVal(Number(e.target.value))}
            className="w-full h-1.5 bg-[#141528] rounded-lg appearance-none cursor-pointer accent-[#A27FF3]"
          />
          <div className="flex justify-between w-full text-[10px] text-[#6b6c82] font-mono">
            <span>0%</span>
            <span>Live Preview</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};
