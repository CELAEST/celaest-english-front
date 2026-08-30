import React from "react";
import { logger } from "../utils/logger";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Global render-error safety net.
 * Prevents a single rendering exception from blanking the entire app and
 * gives users an actionable recovery path.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error("Unhandled UI error:", error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#000006] px-6 text-center text-white"
        >
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            An unexpected error interrupted the experience. Reloading usually resolves it — your
            local progress is safe.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-full bg-accent-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-violet-400"
          >
            Reload app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
