import { useQuery } from "@tanstack/react-query";

  const userId = "68ea1582539ded5dbe090fef";

  const baseURL = "http://localhost:3000/api";


export function useDeltaBalance() {
  return useQuery({
    queryKey: ["delta-balance", userId],
    queryFn: async () => {
      const response = await fetch(baseURL +
        `/delta/balance?userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch wallet balance");
      return response.json();
    },
    enabled: !!userId,
  });
}

export function useEquityChange() {
  return useQuery({
    queryKey: ["equity-change", userId],
    queryFn: async () => {
      const response = await fetch(baseURL +
        `/delta/equity_change?userId=${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch wallet balance");
      return response.json();
    },
    enabled: !!userId,
  });
}