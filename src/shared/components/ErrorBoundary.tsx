import React from "react";
import { logger } from "../utils/logger";
import { captureAppException } from "../../infrastructure/monitoring/sentry";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global render-error safety net.
 * Prevents a single rendering exception from blanking the entire app and
 * gives users an actionable recovery path.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error("Unhandled UI error:", error, info.componentStack);
    captureAppException(error, { componentStack: info.componentStack });
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleGoWorkspace = (): void => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.href = "/workspace";
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#000003] px-6 text-center text-white select-none animate-[fadeIn_0.3s_ease-out]"
        >
          <div className="w-12 h-12 rounded-full bg-accent-violet-500/10 border border-accent-violet-500/25 flex items-center justify-center text-accent-violet-400 mb-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
            <span className="sr-only">Something went wrong: </span>
            Algo no salió como se esperaba
          </h1>
          <p className="max-w-md text-xs sm:text-sm leading-relaxed text-white/60">
            Un error inesperado interrumpió la vista. Tu progreso está guardado de forma segura.
          </p>
          {import.meta.env.DEV && this.state.error && (
            <pre className="max-w-lg overflow-x-auto text-[11px] font-mono text-rose-300/80 bg-white/[0.04] p-3 rounded-lg border border-white/[0.08] text-left">
              {this.state.error.message || String(this.state.error)}
            </pre>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleGoWorkspace}
              className="rounded-full bg-accent-violet-500 px-6 py-2.5 text-xs sm:text-sm font-medium text-white transition-opacity hover:opacity-90 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Volver al Workspace
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              aria-label="Reload app"
              className="rounded-full bg-white/[0.06] border border-white/[0.12] px-5 py-2.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              Recargar app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
