import { BASE_API_URL as baseURL } from "../config";

export type IndicatorSeries =
  | "sma"
  | "ema"
  | "bb"
  | "macd"
  | "rsi"
  | "adx"
  | "atr";


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
  emaFast?: (number | null)[];
  emaSlow?: (number | null)[];
  bb?: BollingerPoint[];

  // oscillators / momentum
  rsi?: (number | null)[];
  adx?: (number | null)[];
  atr?: (number | null)[];

  // macd
  macd?: MACDSeries;
}


export async function fetchIndicatorSeries(
  symbol: string,
  interval: string,
  series: IndicatorSeries[],
  params?: {
        rsiPeriod?: number;
        emaFast?: number;
        emaSlow?: number;
        macdFast?: number;
        macdSlow?: number;
        macdSignal?: number;
        adxPeriod?: number;
        atrPeriod?: number;
    }
): Promise<IndicatorSeriesResponse> {
  const searchParams = new URLSearchParams({
    interval,
    series: series.join(","),
    limit: "500"
  });
  if (params?.rsiPeriod) searchParams.set("rsiPeriod", String(params.rsiPeriod));
    if (params?.emaFast) searchParams.set("emaFast", String(params.emaFast));
    if (params?.emaSlow) searchParams.set("emaSlow", String(params.emaSlow));
    if (params?.macdFast) searchParams.set("macdFast", String(params.macdFast));
    if (params?.macdSlow) searchParams.set("macdSlow", String(params.macdSlow));
    if (params?.macdSignal) searchParams.set("macdSignal", String(params.macdSignal));
    if (params?.adxPeriod) searchParams.set("adxPeriod", String(params.adxPeriod));
    if (params?.atrPeriod) searchParams.set("atrPeriod", String(params.atrPeriod));
  const token = localStorage.getItem("token");
  const res = await fetch(baseURL+`/commodities/indicators/${symbol}/series?${searchParams.toString()}`, {
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
