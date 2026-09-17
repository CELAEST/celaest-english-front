/**
 * Hook: useFocusTrap
 *
 * Traps keyboard focus inside a container element (typically a modal dialog).
 * When active, pressing Tab or Shift+Tab cycles through focusable elements
 * within the container, and pressing Escape invokes the onClose callback.
 *
 * Usage:
 *   const ref = useFocusTrap<HTMLDivElement>({ isActive: isOpen, onClose });
 *   return <div ref={ref} role="dialog" aria-modal="true">...</div>;
 */

import { useRef, useEffect, useCallback } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "[contenteditable]",
].join(", ");

interface UseFocusTrapOptions {
  /** Whether the focus trap is currently active (e.g. modal is open). */
  isActive: boolean;
  /** Callback invoked when the user presses Escape. */
  onClose?: () => void;
  /** If true, auto-focuses the first focusable element on activation. Default: true. */
  autoFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions,
): React.RefObject<T> {
  const { isActive, onClose, autoFocus = true } = options;
  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Remember what was focused before the trap activated
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Auto-focus the first focusable element inside the container
    if (autoFocus) {
      // Use requestAnimationFrame to ensure the DOM has rendered
      const raf = requestAnimationFrame(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          // If no focusable children, focus the container itself
          containerRef.current?.focus();
        }
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [isActive, autoFocus, getFocusableElements]);

  // Restore focus when trap deactivates
  useEffect(() => {
    if (!isActive) {
      return;
    }

    return () => {
      // Restore focus to the element that was focused before trap activation
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === "function") {
        try {
          previouslyFocusedRef.current.focus();
        } catch {
          // Element may have been removed from DOM
        }
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key → close
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose?.();
        return;
      }

      // Tab key → trap focus
      if (event.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: if focus is on first element, wrap to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if focus is on last element, wrap to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isActive, onClose, getFocusableElements]);

  return containerRef;
}
