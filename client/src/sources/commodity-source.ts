import { useQuery } from "@tanstack/react-query";
import { BASE_API_URL as baseURL } from "../config";
import type { Commodity } from "@shared/schema";

export function useCommodities() {
  return useQuery<Commodity[]>({
    queryKey: ["commodities"],
    queryFn: async () => {
      const res = await fetch("/api/commodities");
      if (!res.ok) {
        throw new Error("Failed to fetch commodities");
      }
      return res.json();
    },
  });
}

export interface CommodityIndicators {
  price: number | null;
  high: number | null;
  low: number | null;
  fiftyDayAverage: number | null;
  twoHundredDayAverage: number | null;
  beta: number | null;
  marketCap: number | null;
  forwardPE: number | null;
  priceToBook: number | null;
  profitMargins: number | null;
  recommendationKey: string | null;
  recommendationMean: number | null;
  rsi: number | null;
}

export async function fetchCommodityIndicators(
  symbol: string
): Promise<CommodityIndicators> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${baseURL}/commodities/indicators/${symbol}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ⬅ added token support
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch commodity indicators:", res.status, res.statusText);
    return {} as CommodityIndicators;
  }

  const json = await res.json();
  return json.indicators as CommodityIndicators;
}
