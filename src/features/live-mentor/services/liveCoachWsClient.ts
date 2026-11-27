import {
  getAuthTokenSafe,
  resolveProviderContextSafe,
} from "../../../infrastructure/http/coreAiGatewayClient";
import { ENV } from "../../../shared/constants/env";
import { CoachProfileContext } from "./liveCoachAiService";

export interface LiveWsServerEvent {
  type:
    | "ready"
    | "phase"
    | "user_transcript"
    | "clause_start"
    | "clause_end"
    | "turn_done"
    | "interrupted"
    | "error"
    | "pong";
  phase?: "listening" | "thinking" | "speaking";
  turnId?: number;
  clauseId?: number;
  text?: string;
  fullText?: string;
  language?: string;
  code?: string;
  message?: string;
}

export interface LiveWsClientHandlers {
  onJsonEvent: (ev: LiveWsServerEvent) => void;
  onBinaryAudio: (buf: ArrayBuffer) => void;
  onDisconnected?: () => void;
}

function buildLiveCoachWsUrl(token: string): string {
  const baseHttp = ENV.apiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
  const wsBase = baseHttp.replace(/^http:/i, "ws:").replace(/^https:/i, "wss:");
  return `${wsBase}/ws/live-coach?token=${encodeURIComponent(token)}`;
}

/**
 * Persistent full-duplex WebSocket client for Go /ws/live-coach:
 * - Pre-connects before the user presses "Iniciar" so handshake time is 0ms
 * - Streams raw binary Opus/WebM utterances up and binary MP3 frames down with 0% Base64 overhead
 */
export class LiveCoachWsClient {
  private ws: WebSocket | null = null;
  private connectPromise: Promise<boolean> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private handlers: LiveWsClientHandlers | null = null;

  public setHandlers(handlers: LiveWsClientHandlers | null): void {
    this.handlers = handlers;
  }

  public get isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public prewarm(): void {
    if (typeof WebSocket === "undefined") return;
    const token = getAuthTokenSafe();
    if (!token) return;
    void this.ensureConnected(2500);
  }

  public async ensureConnected(timeoutMs = 3200): Promise<boolean> {
    if (typeof WebSocket === "undefined") return false;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return true;
    if (this.connectPromise) return this.connectPromise;

    const token = getAuthTokenSafe();
    if (!token) return false;

    this.connectPromise = new Promise<boolean>((resolve) => {
      let settled = false;
      const done = (ok: boolean) => {
        if (settled) return;
        settled = true;
        this.connectPromise = null;
        resolve(ok);
      };

      const timer = setTimeout(() => {
        done(false);
      }, timeoutMs);

      try {
        const socket = new WebSocket(buildLiveCoachWsUrl(token));
        socket.binaryType = "arraybuffer";
        this.ws = socket;

        socket.onopen = () => {
          clearTimeout(timer);
          this.startHeartbeat();
          done(true);
        };

        socket.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this.handlers?.onBinaryAudio(event.data);
            return;
          }
          if (typeof event.data === "string") {
            try {
              const parsed = JSON.parse(event.data) as LiveWsServerEvent;
              this.handlers?.onJsonEvent(parsed);
            } catch {
              // ignore malformed frame
            }
          }
        };

        socket.onerror = () => {
          clearTimeout(timer);
          done(false);
        };

        socket.onclose = () => {
          clearTimeout(timer);
          this.stopHeartbeat();
          if (this.ws === socket) {
            this.ws = null;
          }
          done(false);
          this.handlers?.onDisconnected?.();
        };
      } catch {
        clearTimeout(timer);
        done(false);
      }
    });

    return this.connectPromise;
  }

  public async sendStart(profile: CoachProfileContext): Promise<boolean> {
    const ok = await this.ensureConnected();
    if (!ok || !this.ws || this.ws.readyState !== WebSocket.OPEN) return false;

    const provCtx = await resolveProviderContextSafe();
    const byok =
      !provCtx.isCore && provCtx.apiKey
        ? {
            provider: provCtx.providerId,
            apiKey: provCtx.apiKey,
            model: provCtx.config?.defaultModel || "",
          }
        : undefined;

    this.ws.send(
      JSON.stringify({
        type: "start",
        profile,
        byok,
      }),
    );
    return true;
  }

  public sendAudioBlob(blob: Blob): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    void blob.arrayBuffer().then((buf) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(buf);
      }
    });
  }

  public sendInterrupt(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type: "interrupt" }));
  }

  public close(): void {
    this.stopHeartbeat();
    this.connectPromise = null;
    if (this.ws) {
      const sock = this.ws;
      this.ws = null;
      sock.onopen = null;
      sock.onmessage = null;
      sock.onerror = null;
      sock.onclose = null;
      try {
        sock.close();
      } catch {
        // ignore
      }
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: "ping", t: Date.now() }));
        } catch {
          // ignore
        }
      }
    }, 20000);
  }

  private stopHeartbeat(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
