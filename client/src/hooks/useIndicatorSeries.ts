import { BASE_API_URL as baseURL } from "../config";

export type IndicatorSeries =
  | "sma"
  | "ema"
  | "bb"
  | "macd"
  | "rsi"
  | "sma50"
  | "ema50";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface BollingerPoint {
  middle: number | null;
  upper: number | null;
  lower: number | null;
}

export interface MACDSeries {
  macd: (number | null)[];
  signal: (number | null)[];
  hist: (number | null)[];
}

export interface IndicatorSeriesResponse {
  timestamps: number[];
  candles: Candle[];

  // overlays
  sma?: (number | null)[];
  ema?: (number | null)[];
  bb?: BollingerPoint[];
  rsi?: (number | null)[];

  // macd
  macd?: MACDSeries;
}

export async function fetchIndicatorSeries(
  symbol: string,
  interval: string,
  series: IndicatorSeries[]
): Promise<IndicatorSeriesResponse> {
  const params = new URLSearchParams({
    interval,
    series: series.join(","),
    limit: "500",
    smaPeriod: "50",
    emaPeriod: "20",
    bbPeriod: "20",
    bbStd: "2",
    rsiPeriod: "14",
  });
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL+`/commodities/indicators/${symbol}/series?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ⬅ added token support
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch indicator series");
  }

  const json = await res.json();

  return json.data as IndicatorSeriesResponse;
}
