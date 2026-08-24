import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * AppModal — the single source of truth for dialog surfaces.
 * Enforces one visual grammar across every feature: deep-space gradient
 * panel, 24px radius, top hairline, unified header/close/footer, Escape
 * handling, background scroll lock and focus management (focus on open,
 * Tab trap, focus restore on close).
 */

export type AppModalSize = "sm" | "md" | "lg";

const SIZE_WIDTHS: Record<AppModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-4xl",
};

export interface AppModalProps {
  /** Controlled visibility. Defaults to true for conditionally-mounted usage. */
  isOpen?: boolean;
  onClose: () => void;
  /** Raw icon node — the shell wraps it in the standard violet badge tile. */
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  size?: AppModalSize;
  /** Accessible label when no visible title exists. */
  ariaLabel?: string;
  children: React.ReactNode;
  /** Optional pinned footer strip (CTA row). */
  footer?: React.ReactNode;
  /** Extra classes for the scrollable body (padding overrides, etc.). */
  bodyClassName?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  isOpen = true,
  onClose,
  icon,
  title,
  subtitle,
  size = "md",
  ariaLabel,
  children,
  footer,
  bodyClassName = "",
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Focus management: move focus into the dialog on open, restore on close
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  // Minimal focus trap: keep Tab cycling inside the dialog
  const handleTabTrap = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === panelRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-5 bg-black/80 backdrop-blur-xl animate-[fadeIn_0.25s_ease-out]"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onKeyDown={handleTabTrap}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex max-h-[calc(100dvh-2rem)] w-full ${SIZE_WIDTHS[size]} flex-col overflow-hidden rounded-3xl border border-white/[0.08] animate-[scaleUp_0.3s_ease-out] outline-none`}
        style={{
          background: "linear-gradient(180deg, #0a0917 0%, #05060c 100%)",
          boxShadow:
            "0 32px 90px rgba(0,0,0,0.9), 0 0 60px rgba(112,72,232,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        {(title || icon || subtitle) && (
          <div className="flex items-center justify-between gap-3 shrink-0 px-5 py-4 lg:px-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141028] border border-[#251d48] text-[#A27FF3]">
                  {icon}
                </span>
              )}
              <div className="flex flex-col min-w-0">
                <h2 id={titleId} className="text-[16px] font-medium text-[#f8f8f8] tracking-tight leading-tight truncate">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-xs font-light text-[#8a8a9e] truncate mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.07] text-[#8a8a9e] hover:bg-[#1f1a3a] hover:border-[#A27FF3]/40 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 ${bodyClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-white/[0.06] bg-[#070611]/70 px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
