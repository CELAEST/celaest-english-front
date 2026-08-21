/**
 * Socket Client - celaest-english-back
 * Single global WebSocket client with automatic reconnection, keepalive ping, and visibility management
 */

const getWsUrl = () => {
  const apiUrl = (import.meta as any).env?.VITE_API_URL || "http://localhost:8080/api/v1";
  return apiUrl.replace(/^http/, "ws") + "/ws";
};

type Listener = (payload: unknown) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimeout: any = null;
  private pingInterval: any = null;
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
      // Pass JWT as WebSocket sub-protocol header if present
      this.ws = this.token ? new WebSocket(url, [this.token]) : new WebSocket(url);
    } catch (e: unknown) {
      this.handleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;

      // Keepalive ping every 30 seconds
      this.pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    this.ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        const type = rawData.type || rawData.event;
        const payload = rawData.payload ?? rawData;

        const handlers = this.listeners.get(type);
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
