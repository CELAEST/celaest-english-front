/**
 * Centralized environment configuration.
 *
 * Every external service URL used by the app must be declared here and
 * provided through VITE_* variables (.env.local). Never hardcode URLs in
 * feature code — import ENV instead.
 */

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, "");

const apiUrl = import.meta.env.VITE_API_URL ?? "";
const celaestBackUrl = import.meta.env.VITE_CELAEST_BACK_URL ?? "";
const coreAiUrl = import.meta.env.VITE_CORE_AI_URL ?? "";

export const ENV = {
  /** Backend REST API base URL (no trailing slash). */
  apiUrl: trimTrailingSlash(apiUrl || "http://localhost:8080/api/v1"),
  /** CELAEST Core Auth & Billing Backend (no trailing slash). */
  celaestBackUrl: trimTrailingSlash(celaestBackUrl || "http://localhost:3101/api/v1"),
  /** CELAEST-CORE IA-Mesh base URL for AI chat/transcription (no trailing slash). */
  coreAiUrl: trimTrailingSlash(coreAiUrl || "http://127.0.0.1:8085/api/v1"),
} as const;
