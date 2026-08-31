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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://wcfrqjulnbtmmakirdic.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZnJxanVsbmJ0bW1ha2lyZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTU5MTgsImV4cCI6MjA4NDQzMTkxOH0.TkGfRo3MwJZDdDZa88UscX3q7QYPMBYw9GdOgj2AMTg";

export const ENV = {
  /** Backend REST API base URL (no trailing slash). */
  apiUrl: trimTrailingSlash(apiUrl || "http://localhost:8080/api/v1"),
  /** CELAEST Core Auth & Billing Backend (no trailing slash). */
  celaestBackUrl: trimTrailingSlash(celaestBackUrl || "http://localhost:3101/api/v1"),
  /** CELAEST-CORE IA-Mesh base URL for AI chat/transcription (no trailing slash). */
  coreAiUrl: trimTrailingSlash(coreAiUrl || "http://127.0.0.1:8085/api/v1"),
  /** Supabase Project URL for Direct OAuth & Storage */
  supabaseUrl: trimTrailingSlash(supabaseUrl),
  /** Supabase Public Anon Key */
  supabaseAnonKey,
} as const;
