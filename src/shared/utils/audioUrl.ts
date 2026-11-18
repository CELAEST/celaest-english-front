import { ENV } from "../constants/env";

/** Shared narration cues shipped directly with the app bundle (Cloudflare Workers static assets). */
const ORIGIN_BUNDLED_AUDIO_PREFIX = "/audio/pathway/common/";

/**
 * Resolves a static audio asset path against the configured CDN/R2 base URL.
 * Shared `/audio/pathway/common/` cues stay on app origin (not hosted on CDN R2).
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
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  if (cleanPath.startsWith(ORIGIN_BUNDLED_AUDIO_PREFIX)) {
    return cleanPath;
  }
  const base = ENV.audioBaseUrl;
  if (!base) return cleanPath;
  const cleanBase = base.replace(/\/+$/, "");
  return `${cleanBase}${cleanPath}`;
}

/**
 * Returns the same-origin asset path when `resolvedUrl` points to a remote CDN origin,
 * allowing automatic fallback if an audio object is missing from R2 CDN.
 */
export function resolveSameOriginAudioFallback(
  rawUrl?: string | null,
  resolvedUrl?: string | null,
): string | null {
  if (!rawUrl || !resolvedUrl) return null;
  if (
    rawUrl.startsWith("http://") ||
    rawUrl.startsWith("https://") ||
    rawUrl.startsWith("blob:") ||
    rawUrl.startsWith("data:")
  ) {
    return null;
  }
  const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return resolvedUrl !== cleanPath ? cleanPath : null;
}

