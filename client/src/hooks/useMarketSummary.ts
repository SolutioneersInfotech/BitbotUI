import { useCallback, useEffect, useRef, useState } from "react";

import { BASE_API_URL } from "@/config";

export type MarketSummaryBias = "Bullish" | "Bearish" | "Neutral";

export interface MarketSummary {
  symbol: string;
  timeframe: string;
  timestamp: string;
  bias: MarketSummaryBias;
  confidence: number;
  bullishFactors: string[];
  riskFactors: string[];
  source?: string;
}

async function fetchMarketSummary(
  symbol: string,
  signal?: AbortSignal
): Promise<MarketSummary> {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams({ symbol });
  const res = await fetch(`${BASE_API_URL}/analysis/summary?${query.toString()}`,
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
    throw new Error("Failed to fetch market summary");
  }

  return res.json();
}

export function useMarketSummary(symbol: string | null) {
  const [data, setData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadSummary = useCallback(async (activeSymbol: string | null) => {
    if (!activeSymbol) {
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
      const response = await fetchMarketSummary(activeSymbol, controller.signal);
      setData(response);
    } catch (err) {
      if ((err as DOMException).name === "AbortError") {
        return;
      }
      setError("Unable to load market summary.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadSummary(symbol);
    return () => abortRef.current?.abort();
  }, [loadSummary, symbol]);

  const refetch = useCallback(() => {
    loadSummary(symbol);
  }, [loadSummary, symbol]);

  return { data, loading, error, refetch };
}
