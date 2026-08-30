import React from "react";

/**
 * AI Avatar Icon Component
 * - 48px x 48px outer dark circle with glowing purple border (identical to UserAvatarIcon)
 * - Slightly larger inner glowing purple face ring containing ONLY two white dot eyes (no mouth)
 */
export const AiAvatarIcon: React.FC<{ className?: string | undefined }> = ({ className = "" }) => (
  <div
    className={`w-[48px] h-[48px] rounded-full shrink-0 flex items-center justify-center bg-[#0B091B] border border-[#2B2154] shadow-[0_0_14px_rgba(112,72,232,0.3)] ${className}`}
  >
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="aiAvatarFill" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="rgba(124, 58, 237, 0.45)" />
          <stop offset="100%" stopColor="rgba(11, 9, 27, 0)" />
        </radialGradient>
      </defs>

      {/* Outer Glowing Face Ring — Slightly Larger */}
      <circle
        cx="12"
        cy="12"
        r="9.2"
        stroke="#E2D9FF"
        strokeWidth="1.6"
        fill="url(#aiAvatarFill)"
      />

      {/* Left Eye — Bright White Dot */}
      <circle cx="8.8" cy="12" r="1.5" fill="#FFFFFF" />

      {/* Right Eye — Bright White Dot */}
      <circle cx="15.2" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  </div>
);
