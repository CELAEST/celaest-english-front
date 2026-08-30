/**
 * Socket Client - celaest-english-back
 * Single global WebSocket client with automatic reconnection, keepalive ping, and visibility management.
 *
 * Auth note: the token is sent as the FIRST message after the connection opens,
 * never as a WebSocket sub-protocol (sub-protocols leak tokens into proxy/CDN/WAF logs).
 */

import { ENV } from "../../shared/constants/env";
import { logger } from "../../shared/utils/logger";

const getWsUrl = () => ENV.apiUrl.replace(/^http/, "ws") + "/ws";

type Listener = (payload: unknown) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isIntentionalDisconnect = false;

  connect(token?: string): void {
    if (typeof window === "undefined") return;

    this.token = token || null;
    this.isIntentionalDisconnect = false;
    this.reconnectAttempts = 0;
    this.setupConnection();
  }

  private setupConnection(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    try {
      const url = getWsUrl();
      this.ws = new WebSocket(url);
    } catch (e: unknown) {
      logger.warn("WebSocket connection could not be created:", e);
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;

      if (this.token) {
        // Authenticate via first message instead of leaking the JWT in headers.
        this.ws?.send(JSON.stringify({ type: "auth", token: this.token }));
      }

      // Keepalive ping every 30 seconds
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    this.ws.onerror = () => {
      logger.warn("WebSocket error observed.");
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data) as {
          type?: string;
          event?: string;
          payload?: unknown;
        };
        const type = rawData.type || rawData.event;
        const payload = rawData.payload ?? rawData;

        const handlers = this.listeners.get(type ?? "");
        if (handlers) {
          handlers.forEach((fn) => fn(payload));
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    this.ws.onclose = () => {
      if (!this.isIntentionalDisconnect) {
        this.handleReconnect();
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      if (!this.isIntentionalDisconnect) {
        this.setupConnection();
      }
    }, delay);
  }

  on(event: string, fn: Listener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(fn);
    return () => this.listeners.get(event)?.delete(fn);
  }

  disconnect(): void {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.pingInterval) clearInterval(this.pingInterval);

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const socketClient = new SocketClient();
