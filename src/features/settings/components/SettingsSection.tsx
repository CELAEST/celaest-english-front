import React, { useState } from "react";

export interface SettingsSectionProps {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * Collapsible settings group — a quiet header row (label + chevron) that
 * reveals its content. Borderless, neutral, hairline-separated; matches the
 * quiet-row language used by the provider accordion.
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  label,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex items-center justify-between w-full px-1 py-1 cursor-pointer"
      >
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#8a8a9e]">
          {label}
        </span>
        <svg
          className={`w-4 h-4 text-[#6f6f82] group-hover:text-[#cfcfe6] transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && <div className="mt-1 animate-[fadeSlideUp_0.3s_ease-out_both]">{children}</div>}
    </div>
  );
};
