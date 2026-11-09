/**
 * Centralized environment configuration.
 *
 * Every external service URL used by the app must be declared here and
 * provided through VITE_* variables (.env.local). Never hardcode URLs in
 * feature code — import ENV instead.
 */

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

const metaEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;
const apiUrl = metaEnv?.VITE_API_URL ?? "";
const celaestBackUrl = metaEnv?.VITE_CELAEST_BACK_URL ?? "";
const coreAiUrl = metaEnv?.VITE_CORE_AI_URL ?? "";
const supabaseUrl = metaEnv?.VITE_SUPABASE_URL ?? "https://wcfrqjulnbtmmakirdic.supabase.co";
const supabaseAnonKey =
  metaEnv?.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZnJxanVsbmJ0bW1ha2lyZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTU5MTgsImV4cCI6MjA4NDQzMTkxOH0.TkGfRo3MwJZDdDZa88UscX3q7QYPMBYw9GdOgj2AMTg";

const isProd = Boolean(metaEnv?.PROD);
const isTest = metaEnv?.MODE === "test";
const isBrowser = typeof window !== "undefined";

const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".localhost") ||
    window.location.hostname.startsWith("192.168."));

const defaultProdApiUrl = "https://celaest-english-back.onrender.com/api/v1";
const defaultProdCoreAiUrl = "https://celaest-core.onrender.com/api/v1";
const defaultProdCelaestBackUrl = "https://celaest-back.onrender.com/api/v1";
const defaultProdMarketplaceUrl = "https://celaest-dashboard.vercel.app/?tab=marketplace";
const defaultProdAudioBaseUrl = "https://pub-f37d8afe3d964d7d8910cb7514c4b7a5.r2.dev";

const resolvedAudioBaseUrl = trimTrailingSlash(
  metaEnv?.VITE_AUDIO_BASE_URL || (isProd ? defaultProdAudioBaseUrl : ""),
);

const marketplaceDashboardUrl =
  metaEnv?.VITE_MARKETPLACE_URL ||
  (isLocalhost
    ? "http://localhost:3000/?tab=marketplace"
    : defaultProdMarketplaceUrl);

const resolvedApiUrl = trimTrailingSlash(
  apiUrl ||
    (isTest
      ? "http://localhost:8080/api/v1"
      : isLocalhost
        ? `${window.location.origin}/api/v1`
        : isBrowser
          ? `${window.location.origin}/api/v1`
          : defaultProdApiUrl),
);

const resolvedCelaestBackUrl = trimTrailingSlash(
  celaestBackUrl ||
    (isTest
      ? "http://localhost:3101/api/v1"
      : isLocalhost
        ? `${window.location.origin}/celaest-back`
        : isBrowser
          ? `${window.location.origin}/celaest-back`
          : defaultProdCelaestBackUrl),
);

const resolvedCoreAiUrl = trimTrailingSlash(
  coreAiUrl ||
    (isTest
      ? "http://127.0.0.1:8085/api/v1"
      : isLocalhost
        ? `${window.location.origin}/core-ai`
        : isBrowser
          ? `${window.location.origin}/core-ai`
          : defaultProdCoreAiUrl),
);

export const ENV = {
  /** Backend REST API base URL (no trailing slash). */
  apiUrl: resolvedApiUrl,
  /** CELAEST Core Auth & Billing Backend (no trailing slash). */
  celaestBackUrl: resolvedCelaestBackUrl,
  /** CELAEST-CORE IA-Mesh base URL for AI chat/transcription (no trailing slash). */
  coreAiUrl: resolvedCoreAiUrl,
  /** Supabase Project URL for Direct OAuth & Storage */
  supabaseUrl: trimTrailingSlash(supabaseUrl),
  /** Supabase Public Anon Key */
  supabaseAnonKey,
  /** CELAEST Marketplace Dashboard URL */
  marketplaceDashboardUrl: trimTrailingSlash(marketplaceDashboardUrl),
  /** Base URL for static CDN assets (R2 audio storage). Empty string in local dev. */
  audioBaseUrl: resolvedAudioBaseUrl,
  isProd,
} as const;
