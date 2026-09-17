import React from "react";

export interface AuthOrbitalLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AuthOrbitalLoader: React.FC<AuthOrbitalLoaderProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14",
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`relative ${currentSize} flex items-center justify-center shrink-0 ${className}`}
      aria-label="Loading indicator"
    >
      {/* Outer Delicate Orbit Arc */}
      <div className="absolute inset-0 rounded-full border border-violet-500/20 border-t-[#8B5CF6] border-r-[#6366F1]/70 animate-spin" />

      {/* Inner Fast Counter-Rotating Arc */}
      <div className="absolute inset-1 rounded-full border border-indigo-400/20 border-b-[#A78BFA] animate-[spin_1.8s_linear_infinite_reverse]" />

      {/* Central Ethereal Pearl Core */}
      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#A78BFA] shadow-[0_0_12px_#8B5CF6] animate-pulse" />
    </div>
  );
};
