import { useEffect, useRef } from "react";
import { socketClient } from "../../infrastructure/realtime/SocketClient";

/**
 * Enterprise hook to manage socket listeners with automatic cleanup.
 */
export function useSocket<T = unknown>(
  event: string,
  callback: (payload: T) => void,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handler = (payload: unknown) => {
      callbackRef.current(payload as T);
    };

    const unsubscribe = socketClient.on(event, handler);

    return () => {
      unsubscribe();
    };
  }, [event, enabled]);

  return socketClient;
}
