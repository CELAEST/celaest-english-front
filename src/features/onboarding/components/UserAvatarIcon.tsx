import React from "react";

/**
 * User Avatar Icon Component
 * - 48px x 48px outer dark circle with glowing purple border (identical to AiAvatarIcon)
 * - Slightly larger inner user outline icon in lavender
 */
export const UserAvatarIcon: React.FC<{ className?: string | undefined }> = ({
  className = "",
}) => (
  <div
    className={`w-[48px] h-[48px] rounded-full shrink-0 flex items-center justify-center bg-[#0B091B] border border-[#2B2154] shadow-[0_0_14px_rgba(112,72,232,0.3)] ${className}`}
  >
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E2D9FF"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head — Slightly Larger */}
      <circle cx="12" cy="8.2" r="4.2" />
      {/* Shoulders */}
      <path d="M4.8 19.8c0-3.2 2.8-4.8 7.2-4.8s7.2 1.6 7.2 4.8" />
    </svg>
  </div>
);
