import { useQuery } from "@tanstack/react-query";
import type { Trade } from "@shared/schema";

  const userId = "68ea1582539ded5dbe090fef";

  const baseURL = "https://predator-production.up.railway.app/api";

export function useActiveTrades() {
    return useQuery<Trade[]>({
      queryKey: ["/api/trades", userId],
      queryFn: async () => {
        const response = await fetch(baseURL + `/Activetrades?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch trades");
        return response.json();
      },
      enabled: !!userId,
    });
}