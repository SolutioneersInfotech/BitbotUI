import { useQuery } from "@tanstack/react-query";
import type { Trade } from "@shared/schema";
import { BASE_API_URL, BASE_API_URL as baseURL } from "../config";

const userId = "68ea1582539ded5dbe090fef";

console.log("312 base api url in trades source - ", BASE_API_URL);

export function useActiveTrades() {
    return useQuery<Trade[]>({
      queryKey: ["/api/trades", userId],
      queryFn: async () => {
        const response = await fetch(`${baseURL}/Activetrades?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch trades");
        return response.json();
      },
      enabled: !!userId,
    });
}

export function usecloseTrade() {
    return useQuery<Trade[]>({
      queryKey: ["/api/trades", userId],
      queryFn: async () => {
        const response = await fetch(`${baseURL}/Activetrades?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch trades");
        return response.json();
      },
      enabled: !!userId,
    });
}