import React, { useState, useEffect } from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  hasHalo?: boolean;
  eyeColor?: "cyan" | "white";
}

export const ChibiMicroCapsule: React.FC<Props> = ({
  onClick, className = "", hasHalo = false, eyeColor = "cyan",
}) => {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const eyeBg = eyeColor === "cyan" ? "bg-[#38bdf8] shadow-[0_0_6px_rgba(56,189,248,0.75)]" : "bg-white/90";

  return (
    <button
      type="button" onClick={onClick}
      className={`relative group flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
      title="Tutor Liam IA"
    >
      {hasHalo && (
        <span className="absolute -inset-1.5 rounded-full bg-[#A27FF3]/20 blur-sm pointer-events-none group-hover:bg-[#A27FF3]/35 transition-colors" />
      )}
      <div className="relative h-[22px] px-3 rounded-full bg-[#030206] border border-white/15 group-hover:border-[#A27FF3]/70 flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-all">
        <span
          className={`w-[4.5px] h-[4.5px] rounded-full transition-all duration-100 ${
            blinking ? "scale-y-[0.15] bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.8)]" : `scale-y-100 ${eyeBg}`
          }`}
        />
        <span
          className={`w-[4.5px] h-[4.5px] rounded-full transition-all duration-100 ${
            blinking ? "scale-y-[0.15] bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.8)]" : `scale-y-100 ${eyeBg}`
          }`}
        />
      </div>
    </button>
  );
};
