// import { useQuery } from "@tanstack/react-query";
// import type { Trade } from "@shared/schema";
// import { BASE_API_URL as baseURL } from "../config";

// const userId = "68ea1582539ded5dbe090fef";

// export function useActiveTrades() {
//     return useQuery<Trade[]>({
//       queryKey: ["/api/trades", userId],
//       queryFn: async () => {
//         const response = await fetch(`${baseURL}/Activetrades?userId=${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch trades");
//         return response.json();
//       },
//       enabled: !!userId,
//     });
// }

// export function usecloseTrade() {
//     return useQuery<Trade[]>({
//       queryKey: ["/api/trades", userId],
//       queryFn: async () => {
//         const response = await fetch(`${baseURL}/Activetrades?userId=${userId}`);
//         if (!response.ok) throw new Error("Failed to fetch trades");
//         return response.json();
//       },
//       enabled: !!userId,
//     });
// }

import { useQuery } from "@tanstack/react-query";
import type { Trade } from "@shared/schema";
import { BASE_API_URL as baseURL } from "../config";

/**
 * ✅ Fetch active trades (JWT based)
 */
export function useActiveTrades() {
  return useQuery<Trade[]>({
    queryKey: ["/api/trades"], // ❌ userId removed
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseURL}/active-trades`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 JWT only
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trades");
      }

      return response.json();
    },
  });
}

/**
 * ❌ This hook was duplicate / wrong
 * If you want close trade → useMutation, not useQuery
 * Keeping it removed for now
 */
