const isDev = (import.meta as any).env?.DEV ?? true;

export const logger = {
  debug: (...args: unknown[]) => isDev && console.debug("[Lingua]", ...args),
  info: (...args: unknown[]) => console.info("[Lingua]", ...args),
  warn: (...args: unknown[]) => console.warn("[Lingua]", ...args),
  error: (...args: unknown[]) => console.error("[Lingua]", ...args),
};
