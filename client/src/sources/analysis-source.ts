import { BASE_API_URL } from "../config";

export type SignalType = "BUY" | "SELL" | "WAIT";
export type TrendLabel = "Bullish" | "Bearish" | "Neutral" | "Range";

export interface TimeframeSignalRow {
  tf: string;
  signal: SignalType;
  confidence: number;
  trend: TrendLabel;
  scores: { trend: number; momentum: number; oscillators: number; risk: number };
  keyLevels: { support: number | null; resistance: number | null };
  snapshot: {
    rsi: number | null;
    macd: number | null;
    emaFast: number | null;
    emaSlow: number | null;
    atr: number | null;
    adx: number | null;
    price: number | null;
  };
}

export interface MultiTimeframeSignalsResponse {
  success: boolean;
  symbol: string;
  asOf: string;
  timeframes: TimeframeSignalRow[];
  overall: {
    bias: "Bullish" | "Bearish" | "Neutral";
    confidence: number;
    bestTimeframe: string;
  };
}

export interface NewsItem {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  impact: "high" | "medium" | "low";
}

export interface SymbolNewsResponse {
  symbol: string;
  asOf: string;
  items: NewsItem[];
  overallSentiment: "positive" | "negative" | "neutral";
  keyThemes: string[];
  watchlist: string[];
  warning?: string;
}

const DEFAULT_TIMEFRAMES = ["15m", "1h", "4h", "1d", "1w"] as const;
const DEFAULT_LIMIT = 500;

export async function fetchMultiTimeframeSignals(
  symbol: string,
  timeframes: string[] = [...DEFAULT_TIMEFRAMES],
  limit: number = DEFAULT_LIMIT
): Promise<MultiTimeframeSignalsResponse> {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams({
    timeframes: timeframes.join(","),
    limit: String(limit),
  });

  const res = await fetch(
    `${BASE_API_URL}/analysis/signals/${symbol}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch signals");
  }

  return res.json();
}

export async function fetchSymbolNews(
  symbol: string
): Promise<SymbolNewsResponse> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_API_URL}/analysis/news/${symbol}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}
