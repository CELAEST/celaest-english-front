import { ENV } from "../constants/env";

/**
 * Resolves a static audio asset path against the configured CDN/R2 base URL.
 * If in development or if path is already absolute, returns the path as-is.
 */
export function resolveAudioUrl(url?: string | null): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const base = ENV.audioBaseUrl;
  if (!base) return url;
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}

