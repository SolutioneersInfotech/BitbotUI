import { useCallback, useEffect, useRef, useState } from "react";

import { BASE_API_URL } from "@/config";

export type KeyLevelsResponse = {
  success: boolean;
  symbol: string;
  timeframe: string;
  asOf: string;
  resistance: { low: number; high: number };
  support: { low: number; high: number };
  vwap: number | null;
  liquidity: { side: "above" | "below"; price: number; note: string };
  source: "gemini" | "fallback";
};

async function fetchKeyLevels(
  symbol: string,
  timeframe: string,
  signal?: AbortSignal
): Promise<KeyLevelsResponse> {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams({ timeframe });
  const res = await fetch(
    `${BASE_API_URL}/analysis/key-levels/${symbol}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      signal,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch key levels");
  }

  return res.json();
}

export function useKeyLevels(symbol: string, timeframe: string) {
  const [data, setData] = useState<KeyLevelsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadKeyLevels = useCallback(async (activeSymbol: string, activeTf: string) => {
    if (!activeSymbol || !activeTf) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetchKeyLevels(
        activeSymbol,
        activeTf,
        controller.signal
      );
      if (!response.success) {
        throw new Error("Key levels response unsuccessful");
      }
      setData(response);
    } catch (err) {
      if ((err as DOMException).name === "AbortError") {
        return;
      }
      setError("Failed to load key levels");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadKeyLevels(symbol, timeframe);
    return () => abortRef.current?.abort();
  }, [loadKeyLevels, symbol, timeframe]);

  const refetch = useCallback(() => {
    loadKeyLevels(symbol, timeframe);
  }, [loadKeyLevels, symbol, timeframe]);

  return { data, loading, error, refetch };
}
