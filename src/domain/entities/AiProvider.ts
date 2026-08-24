/**
 * AI Provider Domain Entity
 * Pure business model for BYOK multi-provider configuration (RFC-004)
 */

export type AiProviderId = "openai" | "anthropic" | "gemini" | "deepseek" | "ollama";

export type AiProviderType = "cloud" | "local";

export type AiProviderStatus =
  | "active"
  | "configured"
  | "available"
  | "unreachable";

export interface AiProviderModel {
  id: string;
  label: string;
  bestFor?: string;
}

export interface AiProvider {
  id: AiProviderId;
  name: string;
  type: AiProviderType;
  status: AiProviderStatus;
  latencyMs: number | null;
  models: AiProviderModel[];
  defaultEndpoint?: string;
}

export interface ConfigureAiProviderPayload {
  providerId: AiProviderId;
  endpoint?: string;
  defaultModel?: string;
}

export interface ProviderTestResult {
  ok: boolean;
  latencyMs: number | null;
  message: string;
}
