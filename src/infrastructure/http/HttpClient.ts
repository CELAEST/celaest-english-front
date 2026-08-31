/**
 * Core HTTP Client.
 *
 * Enterprise HTTP driver with request timeout, retry-with-backoff limited to
 * idempotent methods, and ApiError normalization. All external service URLs
 * come from the centralized ENV config (.env.local via VITE_* variables).
 */

import { ApiError } from "./ApiError";
import { ENV } from "../../shared/constants/env";
import { logger } from "../../shared/utils/logger";

const BASE_URL = ENV.apiUrl;

/** Hard cap for every request; prevents hung connections holding UI state. Set to 60s for heavy AI inference workloads. */
const DEFAULT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 0; // React Query owns retry with dedupe/backoff — HttpClient does not double-retry
const BASE_RETRY_DELAY_MS = 500;
/** Only automatically retry methods that are safe to repeat. */
const RETRYABLE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export interface HttpRequestOptions extends RequestInit {
  timeoutMs?: number;
}

interface EnvelopeResponse {
  data?: unknown;
  error?: unknown;
}

/** Aborts when either the per-request timeout or a caller-provided signal fires. */
function createTimeoutSignal(
  externalSignal?: AbortSignal | null,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): {
  signal: AbortSignal;
  cleanup: () => void;
  timedOut: () => boolean;
} {
  const controller = new AbortController();
  let didTimeOut = false;
  const timeoutId = setTimeout(() => {
    didTimeOut = true;
    controller.abort();
  }, timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onExternalAbort, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    },
    timedOut: () => didTimeOut,
  };
}

export class HttpClient {
  private static token: string | null = null;

  static setAuthToken(token: string) {
    this.token = token;
  }

  private static getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const activeToken =
      this.token ||
      (typeof window !== "undefined" ? localStorage.getItem("lingua_access_token") : null);
    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }
    return headers;
  }

  private static async request<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...options.headers,
    };
    const method = (options.method ?? "GET").toUpperCase();
    const maxAttempts = RETRYABLE_METHODS.has(method) ? MAX_RETRIES + 1 : 1;
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { signal, cleanup, timedOut } = createTimeoutSignal(options.signal, timeoutMs);

      try {
        const response = await fetch(url, { ...options, headers, signal });

        const text = await response.text();
        let json: EnvelopeResponse = {};
        try {
          json = text ? (JSON.parse(text) as EnvelopeResponse) : {};
        } catch {
          json = { error: { message: "Invalid JSON response from server" } };
        }

        if (!response.ok) {
          const errorPayload = (json.error ?? {}) as Record<string, unknown>;
          const rawMessage =
            typeof errorPayload === "string"
              ? errorPayload
              : typeof errorPayload.message === "string"
                ? errorPayload.message
                : undefined;
          const message = rawMessage || `HTTP error ${response.status}`;
          const code = typeof errorPayload.code === "string" ? errorPayload.code : undefined;

          if (response.status === 401 && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("celaest:unauthorized"));
          }

          throw new ApiError(
            message,
            response.status,
            code,
            typeof errorPayload === "object" && errorPayload !== null ? errorPayload : undefined,
          );
        }

        return (json.data !== undefined ? json.data : json) as T;
      } catch (error: unknown) {
        if (error instanceof ApiError) throw error;
        if (options.signal?.aborted && !timedOut()) {
          throw new ApiError("Request aborted by caller", 0, "ABORTED");
        }

        const isTimeout = timedOut();
        const message = isTimeout
          ? `Request timed out after ${DEFAULT_TIMEOUT_MS}ms`
          : error instanceof Error
            ? error.message
            : "Network error";
        const apiError = new ApiError(
          message,
          isTimeout ? 408 : 500,
          isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
        );

        if (attempt < maxAttempts) {
          // Jittered exponential backoff avoids synchronized retry storms.
          const jitter = Math.random() * BASE_RETRY_DELAY_MS * 0.3;
          await new Promise((resolve) =>
            setTimeout(resolve, BASE_RETRY_DELAY_MS * Math.pow(2, attempt) + jitter),
          );
          continue;
        }

        throw apiError;
      } finally {
        cleanup();
      }
    }

    throw new ApiError("Maximum retries reached", 500, "NETWORK_ERROR");
  }

  static async get<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static async post<T>(
    endpoint: string,
    body?: unknown,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    const reqOptions: HttpRequestOptions = { ...options, method: "POST" };
    if (body !== undefined) {
      reqOptions.body = JSON.stringify(body);
    }
    return this.request<T>(endpoint, reqOptions);
  }

  static async put<T>(
    endpoint: string,
    body?: unknown,
    options: HttpRequestOptions = {},
  ): Promise<T> {
    const reqOptions: HttpRequestOptions = { ...options, method: "PUT" };
    if (body !== undefined) {
      reqOptions.body = JSON.stringify(body);
    }
    return this.request<T>(endpoint, reqOptions);
  }

  static async delete<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  static connectWebSocket(path: string, onMessage: (data: unknown) => void): WebSocket {
    const wsUrl = BASE_URL.replace(/^http/, "ws") + path;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data) as unknown);
      } catch (err) {
        logger.error("WebSocket message parse error", err);
      }
    };
    return ws;
  }
}
