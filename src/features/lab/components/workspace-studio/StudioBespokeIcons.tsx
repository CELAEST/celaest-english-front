import React from "react";

export const StudioMemoryIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="4.2" pathLength={1} />
    <line x1="14" y1="2.5" x2="14" y2="7" pathLength={1} />
    <line x1="14" y1="21" x2="14" y2="25.5" pathLength={1} />
    <line x1="2.5" y1="14" x2="7" y2="14" pathLength={1} />
    <line x1="21" y1="14" x2="25.5" y2="14" pathLength={1} />
    <line x1="5.8" y1="5.8" x2="9" y2="9" pathLength={1} />
    <line x1="22.2" y1="5.8" x2="19" y2="9" pathLength={1} />
    <line x1="5.8" y1="22.2" x2="9" y2="19" pathLength={1} />
    <line x1="22.2" y1="22.2" x2="19" y2="19" pathLength={1} />
    <circle cx="14" cy="14" r="1.8" fill="#C4B5FD" stroke="none" />
  </svg>
);

export const StudioReadingIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      pathLength={1}
      d="M4.5 7.5 C8 5.8 11.5 5.8 14 7.5 C16.5 5.8 20 5.8 23.5 7.5 V20.5 C20 18.8 16.5 18.8 14 20.5 C11.5 18.8 8 18.8 4.5 20.5 Z"
    />
    <line x1="14" y1="7.5" x2="14" y2="20.5" pathLength={1} opacity={0.8} />
    <path d="M14 11.5 L15.6 14 L14 16.5 L12.4 14 Z" fill="#C4B5FD" stroke="none" />
  </svg>
);

export const StudioVoiceIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="14" cy="16" r="7.5" pathLength={1} />
    <circle cx="14" cy="16" r="3.2" pathLength={1} opacity={0.9} />
    <line x1="14" y1="8.5" x2="14" y2="3.5" pathLength={1} strokeWidth="1.4" />
    <circle cx="14" cy="3.5" r="1.5" fill="#C4B5FD" stroke="none" />
  </svg>
);

export const StudioSparkleIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);
