import React, { useEffect, useId } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "../../../shared/hooks/useFocusTrap";

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

const SIZE_HEIGHTS: Record<AppModalSize, string> = {
  sm: "max-h-[85dvh]",
  md: "max-h-[90dvh] sm:max-h-[calc(100dvh-2rem)]",
  lg: "h-[94dvh] sm:h-auto max-h-[94dvh] sm:max-h-[calc(100dvh-2rem)]",
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
  const titleId = useId();
  const trapRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onClose,
  });

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

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
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.25s_ease-out]"
    >
      <div
        ref={trapRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative flex w-full ${SIZE_WIDTHS[size]} ${SIZE_HEIGHTS[size]} flex-col overflow-hidden outline-none rounded-t-[26px] sm:rounded-3xl border-t border-white/[0.12] sm:border sm:border-white/[0.08] border-x-0 border-b-0 animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[scaleUp_0.3s_ease-out]`}
        style={{
          background: "linear-gradient(180deg, #0a0917 0%, #05060c 100%)",
          boxShadow:
            "0 32px 90px rgba(0,0,0,0.9), 0 0 60px rgba(112,72,232,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Mobile grab handle */}
        <div className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-0.5 shrink-0 select-none">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        {(title || icon || subtitle) && (
          <div className="flex items-center justify-between gap-3 shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {icon && (
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#141028] border border-[#251d48] text-[#A27FF3]">
                  {icon}
                </span>
              )}
              <div className="flex flex-col min-w-0">
                <h2
                  id={titleId}
                  className="text-[15px] sm:text-[16px] font-medium text-[#f8f8f8] tracking-tight leading-tight truncate"
                >
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-[11px] sm:text-xs font-light text-[#8a8a9e] truncate mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center text-white/40 hover:text-white transition-colors duration-200 cursor-pointer rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </div>
        )}

        {/* Body */}
        <div
          className={`flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar p-3.5 sm:p-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] sm:pb-6 ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-white/[0.06] bg-[#070611]/90 px-4 py-3 sm:px-6 sm:py-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:pb-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
