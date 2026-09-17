import React from "react";

export interface ScoreGaugeProps {
  value: number;
  from: string;
  to: string;
  id: string;
  glowColor?: string;
  size?: number;
  stroke?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  value,
  from,
  to,
  id,
  glowColor = "rgba(162, 127, 243, 0.40)",
  size = 80,
  stroke = 5.5,
}) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#141528"
          strokeWidth={stroke}
        />
        {/* Animated Metric Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined,
          }}
        />
      </svg>
      {/* Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold tracking-tight text-white font-mono leading-none">
          {safeValue}
        </span>
        <span className="text-[9px] font-medium text-white/40 leading-none mt-0.5">%</span>
      </div>
    </div>
  );
};
