import * as Sentry from "@sentry/react";

/**
 * Enterprise Sentry Monitoring Driver
 * Initializes browser telemetry, tracing, and unhandled exception capture.
 */
export const initSentry = (): void => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (dsn) {
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
};

export const captureAppException = (error: unknown, context?: Record<string, unknown>): void => {
  const captureContext = context ? { extra: context } : undefined;
  if (error instanceof Error) {
    if (captureContext) {
      Sentry.captureException(error, captureContext);
    } else {
      Sentry.captureException(error);
    }
  } else {
    if (captureContext) {
      Sentry.captureMessage(String(error), { ...captureContext, level: "error" });
    } else {
      Sentry.captureMessage(String(error), "error");
    }
  }
};

export const setSentryUser = (user: { id: string; email?: string; name?: string } | null): void => {
  if (user) {
    const userPayload: Sentry.User = { id: user.id };
    if (user.email) userPayload.email = user.email;
    if (user.name) userPayload.username = user.name;
    Sentry.setUser(userPayload);
  } else {
    Sentry.setUser(null);
  }
};
