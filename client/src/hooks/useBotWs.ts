// src/hooks/useBotWs.ts
import { useEffect, useRef } from "react";

export default function useBotWs({
  onTrade,
  onRuntime,
  url,
}: {
  onTrade?: (payload: any) => void;
  onRuntime?: (payload: any) => void;
  url?: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = url ?? (location.protocol === "https:" ? "wss://" : "ws://") + location.host;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] connected");
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "trade") {
          onTrade?.(msg.data);
        } else if (msg.type === "runtime") {
          onRuntime?.(msg.data);
        }
      } catch (err) {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      console.log("[WS] closed, will not auto-reconnect in this hook");
    };

    ws.onerror = (err) => {
      console.warn("[WS] error", err);
    };

    return () => {
      try { ws.close(); } catch {}
    };
  }, []);

  function subscribe(botId: string) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      // try to send when ready
      wsRef.current?.addEventListener("open", () => {
        wsRef.current?.send(JSON.stringify({ action: "subscribe", botId }));
      }, { once: true });
      return;
    }
    ws.send(JSON.stringify({ action: "subscribe", botId }));
  }

  function unsubscribe(botId: string) {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ action: "unsubscribe", botId }));
  }

  return { subscribe, unsubscribe };
}
