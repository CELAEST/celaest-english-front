import { AiProviderId } from "../../domain/entities/AiProvider";
import {
  AiInfrastructureError,
  directClientAiService,
  parseProviderError,
} from "../../features/settings/services/directClientAiService";
import {
  providerKeyVault,
  ResolvedProviderContext,
} from "../../features/settings/services/providerKeyVault";
import {
  SupabaseAuthAdapter,
  isJwtExpired,
} from "../adapters/auth/SupabaseAuthAdapter";
import { ENV } from "../../shared/constants/env";
import { ApiError } from "./ApiError";
import { HttpClient } from "./HttpClient";

export interface ProviderContextWithCloud extends ResolvedProviderContext {
  isCore: boolean;
}

export function getAuthTokenSafe(): string | null {
  return typeof HttpClient.getAuthToken === "function" ? HttpClient.getAuthToken() : null;
}

export interface BackendAiChatRequest {
  systemPrompt?: string | undefined;
  userPrompt: string;
  providerId?: AiProviderId | undefined;
  maxTokens?: number | undefined;
  temperature?: number | undefined;
  timeoutMs?: number | undefined;
  signal?: AbortSignal | undefined;
}

export async function resolveProviderContextSafe(): Promise<ProviderContextWithCloud> {
  const isCore =
    (await Promise.resolve(providerKeyVault.isCentralCoreEnabled?.()).catch(() => false)) ?? false;

  if (typeof providerKeyVault.resolveConfiguredProvider === "function") {
    const ctx = await Promise.resolve(providerKeyVault.resolveConfiguredProvider()).catch(() => null);
    if (ctx) {
      return { ...ctx, isCore };
    }
  }

  const activeId: AiProviderId =
    (await Promise.resolve(providerKeyVault.getActiveProviderId?.()).catch(() => null)) || "groq";
  const hasKey =
    (await Promise.resolve(providerKeyVault.hasKey?.(activeId)).catch(() => false)) ?? false;
  const keys =
    typeof providerKeyVault.getKeys === "function"
      ? (await Promise.resolve(providerKeyVault.getKeys(activeId)).catch(() => [])) ?? []
      : [];
  const config =
    typeof providerKeyVault.getConfig === "function"
      ? (await Promise.resolve(providerKeyVault.getConfig(activeId)).catch(() => null)) ?? null
      : null;

  return {
    providerId: activeId,
    apiKey: keys[0] ?? null,
    keys,
    config,
    hasAnyKey: hasKey || keys.length > 0,
    isCore,
  };
}

export async function buildByokHeadersSafe(options?: {
  includeKey?: boolean;
}): Promise<Record<string, string>> {
  const ctx = await resolveProviderContextSafe();
  const shouldIncludeKey = options?.includeKey ?? !ctx.isCore;
  const headers: Record<string, string> = {
    "X-Active-Provider": ctx.providerId,
    "X-Provider-Id": ctx.providerId,
    "X-Provider-Has-Key": ctx.hasAnyKey ? "1" : "0",
  };
  if (shouldIncludeKey && ctx.apiKey) {
    headers["X-Provider-Key"] = ctx.apiKey;
  }
  if (ctx.config?.defaultModel) {
    headers["X-Provider-Model"] = ctx.config.defaultModel;
  }
  if (ctx.config?.endpoint) {
    headers["X-Provider-Endpoint"] = ctx.config.endpoint;
  }
  return headers;
}

function parseGatewayErrorMeta(rawBody: string): {
  code?: string | undefined;
  message: string;
  details: Record<string, unknown>;
} {
  let parsed: Record<string, any> = {};
  try {
    parsed = rawBody ? (JSON.parse(rawBody) as Record<string, any>) : {};
  } catch {
    parsed = {};
  }

  const errObj =
    typeof parsed.error === "object" && parsed.error !== null
      ? (parsed.error as Record<string, any>)
      : null;
  const code =
    (typeof errObj?.code === "string" ? errObj.code : undefined) ||
    (typeof parsed.code === "string" ? parsed.code : undefined);
  const message =
    (typeof parsed.details === "string" && parsed.details) ||
    (typeof errObj?.message === "string" && errObj.message) ||
    (typeof parsed.error === "string" && parsed.error) ||
    (typeof parsed.message === "string" && parsed.message) ||
    "Authentication required";

  const details: Record<string, unknown> = {
    ...(errObj || {}),
    ...(typeof parsed.data === "object" && parsed.data !== null
      ? (parsed.data as Record<string, unknown>)
      : {}),
    ...(code ? { code } : {}),
  };

  return { code, message, details };
}

function handleJwtUnauthorized(status: number, code: string | undefined, message: string, details: Record<string, unknown>): never {
  if (typeof window !== "undefined") {
    const isDevLocal =
      import.meta.env.DEV && localStorage.getItem("lingua_auth_user")?.includes("dev-user-local");
    const onAuthCallbackRoute = window.location.pathname.startsWith("/auth/callback");
    const storedToken = localStorage.getItem("lingua_access_token");
    const hasActiveJwt = Boolean(storedToken && !isJwtExpired(storedToken));
    if (!isDevLocal && !onAuthCallbackRoute && (code === "JWT_EXPIRED" || !hasActiveJwt)) {
      SupabaseAuthAdapter.getInstance().clearDeadToken();
      window.dispatchEvent(new CustomEvent("celaest:unauthorized"));
    }
  }
  throw new ApiError(message, status, code || "AUTHENTICATION_REQUIRED", details);
}

function mapFailedGatewayResponse(
  status: number,
  rawBody: string,
  providerId: AiProviderId,
): never {
  let parsed: Record<string, any> = {};
  try {
    parsed = rawBody ? (JSON.parse(rawBody) as Record<string, any>) : {};
  } catch {
    parsed = {};
  }

  const errObj =
    typeof parsed.error === "object" && parsed.error !== null
      ? (parsed.error as Record<string, any>)
      : null;
  const code =
    (typeof errObj?.code === "string" ? errObj.code : undefined) ||
    (typeof parsed.code === "string" ? parsed.code : undefined);
  const message =
    (typeof parsed.details === "string" && parsed.details) ||
    (typeof errObj?.message === "string" && errObj.message) ||
    (typeof parsed.error === "string" && parsed.error) ||
    (typeof parsed.message === "string" && parsed.message) ||
    `HTTP error ${status}`;

  const mergedDetails: Record<string, unknown> = {
    ...(errObj || {}),
    ...(typeof parsed.data === "object" && parsed.data !== null
      ? (parsed.data as Record<string, unknown>)
      : {}),
    ...(code ? { code } : {}),
  };

  if (status === 401 && code !== "AUTH_DECLINED_KEY") {
    handleJwtUnauthorized(status, code, message, mergedDetails);
  }

  if (status === 403 || code?.startsWith("ENTITLEMENT_")) {
    throw new ApiError(message, status || 403, code || "ENTITLEMENT_REQUIRED", mergedDetails);
  }

  if (code === "AI_TRIAL_ACCESS_REQUIRED" || code === "AI_BYOK_REQUIRED") {
    throw new ApiError(message, status || 402, code, mergedDetails);
  }

  if (code === "AUTH_DECLINED_KEY" || status === 422 || status === 401) {
    throw new AiInfrastructureError(
      "AUTH_DECLINED_KEY",
      message,
      status || 422,
      providerId,
      rawBody,
    );
  }

  if (status === 504 || code === "GATEWAY_TIMEOUT") {
    throw new AiInfrastructureError("GATEWAY_TIMEOUT", message, 504, providerId, rawBody);
  }

  const lowerFull = `${code || ""} ${message} ${rawBody}`.toLowerCase();
  if (
    status === 402 ||
    code === "AI_KEYS_EXHAUSTED" ||
    code === "AI_QUOTA_EXHAUSTED" ||
    lowerFull.includes("exhausted") ||
    lowerFull.includes("all keys")
  ) {
    throw new AiInfrastructureError(
      "AI_KEYS_EXHAUSTED",
      message,
      status || 429,
      providerId,
      rawBody,
    );
  }

  if (status === 429 || code === "RATE_LIMIT_COOLDOWN" || lowerFull.includes("cooldown")) {
    throw new AiInfrastructureError(
      "RATE_LIMIT_COOLDOWN",
      message,
      429,
      providerId,
      rawBody,
    );
  }

  if (status >= 500 || status === 405) {
    throw new AiInfrastructureError(
      "CLUSTER_OUTAGE",
      message,
      status || 503,
      providerId,
      rawBody,
    );
  }

  throw parseProviderError(status, rawBody, providerId);
}

export async function callBackendAiChatGateway(
  params: BackendAiChatRequest,
): Promise<string> {
  const ctx = await resolveProviderContextSafe();
  const providerId: AiProviderId = params.providerId || ctx.providerId || "groq";

  const executeAttempt = async (
    includeKey: boolean,
    authRetryUsed = false,
    tokenOverride?: string | null,
  ): Promise<string> => {
    const controller = new AbortController();
    const timeoutMs = params.timeoutMs ?? 35_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const onAbort = () => controller.abort();
    params.signal?.addEventListener("abort", onAbort, { once: true });

    try {
      let token = tokenOverride ?? getAuthTokenSafe();
      const isDevLocal =
        typeof window !== "undefined" &&
        import.meta.env.DEV &&
        Boolean(localStorage.getItem("lingua_auth_user")?.includes("dev-user-local"));
      const onAuthCallbackRoute =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/auth/callback");

      if (
        !authRetryUsed &&
        !tokenOverride &&
        typeof window !== "undefined" &&
        !isDevLocal &&
        !onAuthCallbackRoute &&
        (!token || isJwtExpired(token))
      ) {
        const authAdapter = SupabaseAuthAdapter.getInstance();
        if (authAdapter.hasRecoverableRefreshSource()) {
          const preflight = await authAdapter.refresh(token ?? undefined);
          if (preflight.success && preflight.accessToken) {
            token = preflight.accessToken;
          }
        }
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(await buildByokHeadersSafe({ includeKey })),
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const payload: Record<string, unknown> = {
        message: params.userPrompt,
        provider: providerId,
        max_tokens: params.maxTokens ?? 2000,
      };
      if (params.systemPrompt) {
        payload.system = params.systemPrompt;
      }
      if (includeKey && ctx.apiKey) {
        payload.api_key = ctx.apiKey;
      }
      if (ctx.config?.defaultModel) {
        payload.model = ctx.config.defaultModel;
      }
      if (params.temperature !== undefined) {
        payload.temperature = params.temperature;
      }

      const res = await fetch(ENV.aiGatewayChatUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const rawText = await res.text();
      if (!res.ok) {
        if (res.status === 401 && !authRetryUsed) {
          const { code, message, details } = parseGatewayErrorMeta(rawText);
          const storedToken =
            typeof window !== "undefined"
              ? localStorage.getItem("lingua_access_token")
              : null;
          const hasActiveJwt = Boolean(storedToken && !isJwtExpired(storedToken));
          if (
            code !== "AUTH_DECLINED_KEY" &&
            !isDevLocal &&
            !onAuthCallbackRoute &&
            (code === "JWT_EXPIRED" || !hasActiveJwt)
          ) {
            const refreshRes = await SupabaseAuthAdapter.getInstance().refresh(
              token ?? undefined,
            );
            if (refreshRes.success && refreshRes.accessToken) {
              return await executeAttempt(includeKey, true, refreshRes.accessToken);
            }
            if (
              refreshRes.error === "Network error" ||
              refreshRes.error === "Server error"
            ) {
              throw new ApiError(
                message,
                401,
                code || "AUTHENTICATION_REQUIRED",
                details,
              );
            }
          }
        }
        mapFailedGatewayResponse(res.status, rawText, providerId);
      }

      let data: Record<string, any> = {};
      try {
        data = rawText ? (JSON.parse(rawText) as Record<string, any>) : {};
      } catch {
        throw new AiInfrastructureError(
          "CLUSTER_OUTAGE",
          "El motor de IA devolvió una respuesta inválida.",
          502,
          providerId,
          rawText,
        );
      }

      const content =
        data?.response ||
        data?.content ||
        data?.data?.response ||
        data?.data?.content ||
        "";

      if (typeof content === "string" && content.trim()) {
        return content.trim();
      }

      throw new AiInfrastructureError(
        "CLUSTER_OUTAGE",
        "El motor de IA devolvió una respuesta vacía.",
        502,
        providerId,
      );
    } catch (err: any) {
      if (err instanceof ApiError || err instanceof AiInfrastructureError) {
        throw err;
      }
      if (err?.name === "AbortError") {
        throw new AiInfrastructureError(
          "GATEWAY_TIMEOUT",
          "Tiempo de espera agotado al conectar con el motor de IA.",
          504,
          providerId,
        );
      }
      throw new AiInfrastructureError(
        "CLUSTER_OUTAGE",
        err?.message || "No se pudo conectar con el servidor de IA.",
        503,
        providerId,
      );
    } finally {
      clearTimeout(timeoutId);
      params.signal?.removeEventListener("abort", onAbort);
    }
  };

  const directCallParams = {
    systemPrompt: params.systemPrompt || "You are a helpful AI English mentor.",
    userPrompt: params.userPrompt,
    providerId,
    ...(params.maxTokens !== undefined ? { maxTokens: params.maxTokens } : {}),
  };

  // When BYOK Direct Mode is active (user connected their own API key and Cloud AI is off),
  // execute directly against the user's configured provider first (zero shared-pool rate limits
  // and full multi-key / multi-model resilience), falling back to backend proxy only on browser CORS/network blocks.
  if (!ctx.isCore && ctx.hasAnyKey && ctx.apiKey) {
    try {
      return await directClientAiService.chatCompletion(directCallParams);
    } catch (directErr) {
      const isBrowserNetworkOrCors =
        directErr instanceof AiInfrastructureError &&
        directErr.code === "GATEWAY_TIMEOUT" &&
        directErr.status === 500 &&
        !directErr.rawErrorDetails;
      if (!isBrowserNetworkOrCors) {
        throw directErr;
      }
    }
  }

  try {
    return await executeAttempt(!ctx.isCore);
  } catch (err) {
    // If client optimistically thought Central Core was enabled, sync false and auto-retry with stored BYOK key if one exists
    if (
      err instanceof ApiError &&
      (err.code === "AI_BYOK_REQUIRED" || err.code === "AI_TRIAL_ACCESS_REQUIRED")
    ) {
      await providerKeyVault.setCentralCoreEnabled?.(false).catch(() => {});
      if (ctx.isCore && ctx.hasAnyKey && ctx.apiKey) {
        try {
          return await directClientAiService.chatCompletion(directCallParams);
        } catch {
          return await executeAttempt(true);
        }
      }
    }
    throw err;
  }
}
