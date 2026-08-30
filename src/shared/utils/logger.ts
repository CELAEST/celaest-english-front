/**
 * Application logger.
 *
 * - debug/info are silenced outside development to avoid leaking
 *   infrastructure details in production consoles.
 * - warn/error always emit so production issues remain diagnosable.
 *
 * Always use this logger instead of raw console.* calls.
 */

type LogMethod = (...args: unknown[]) => void;

const noop: LogMethod = () => undefined;

const isDev = import.meta.env.DEV;

export const logger = {
  log: isDev ? (...args: unknown[]) => console.log("[Lingua]", ...args) : noop,
  debug: isDev ? (...args: unknown[]) => console.debug("[Lingua]", ...args) : noop,
  info: isDev ? (...args: unknown[]) => console.info("[Lingua]", ...args) : noop,
  warn: (...args: unknown[]) => console.warn("[Lingua]", ...args),
  error: (...args: unknown[]) => console.error("[Lingua]", ...args),
};
