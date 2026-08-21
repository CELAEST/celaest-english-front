/**
 * Core HTTP Client
 * Enterprise HTTP driver with automatic retry, exponential backoff, and ApiError normalization
 */

import { ApiError } from "./ApiError";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api/v1";

export class HttpClient {
  private static token: string | null = null;

  static setAuthToken(token: string) {
    this.token = token;
  }

  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...options.headers,
    };

    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        const text = await response.text();
        let json: any = {};
        try {
          json = text ? JSON.parse(text) : {};
        } catch {
          json = { success: false, error: { message: "Invalid JSON response from server" } };
        }

        if (!response.ok) {
          const errorPayload = json.error || {};
          const message = typeof errorPayload === "string" ? errorPayload : (errorPayload.message || `HTTP error ${response.status}`);
          const code = typeof errorPayload === "object" ? errorPayload.code : undefined;

          if (response.status === 401 && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("celaest:unauthorized"));
          }

          throw new ApiError(message, response.status, code, typeof errorPayload === "object" ? errorPayload : undefined);
        }

        return (json.data !== undefined ? json.data : json) as T;
      } catch (error: unknown) {
        if (error instanceof ApiError) throw error;

        if (attempt < MAX_RETRIES) {
          attempt++;
          const delay = 500 * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        const msg = error instanceof Error ? error.message : "Network error";
        throw new ApiError(msg, 500, "NETWORK_ERROR");
      }
    }

    throw new ApiError("Maximum retries reached", 500, "NETWORK_ERROR");
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  static async post<T>(endpoint: string, body?: any): Promise<T> {
    const options: RequestInit = { method: "POST" };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    return this.request<T>(endpoint, options);
  }

  static async put<T>(endpoint: string, body?: any): Promise<T> {
    const options: RequestInit = { method: "PUT" };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }
    return this.request<T>(endpoint, options);
  }

  static connectWebSocket(path: string, onMessage: (data: any) => void): WebSocket {
    const wsUrl = BASE_URL.replace(/^http/, "ws") + path;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("WebSocket message parse error", err);
      }
    };
    return ws;
  }
}
