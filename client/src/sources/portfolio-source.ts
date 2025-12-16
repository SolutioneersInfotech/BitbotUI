// import { useQuery } from "@tanstack/react-query";

// const userId = "68ea1582539ded5dbe090fef";

// import { BASE_API_URL as baseURL } from "../config";

// function normalizeSymbol(obj: any) {
//   // try multiple likely keys and return uppercase symbol if available
//   return (
//     obj?.asset_symbol ??
//     obj?.assetSymbol ??
//     obj?.symbol ??
//     obj?.currency ??
//     obj?.asset ??
//     ""
//   )
//     .toString()
//     .toUpperCase();
// }

// /**
//  * useDeltaBalance - fetches delta/balance and returns selected currency object
//  * @param currency - asset symbol to pick from result array, e.g. "USD", "BTC", "ETH", "INR"
//  */
// export function useDeltaBalance(currency = "USD") {
//   return useQuery({
//     queryKey: ["delta-balance", userId, currency?.toUpperCase()],
//     queryFn: async () => {
//       const res = await fetch(`${baseURL}/delta/balance?userId=${userId}`);
//       if (!res.ok) throw new Error("Failed to fetch wallet balance");
//       return res.json();
//     },
//     enabled: !!userId,
//     // Keep the entire raw payload but also return a selected currency object for convenience
//     select: (data: any) => {
//       const list: any[] = Array.isArray(data?.result) ? data.result : [];

//       // Prefer exact match on normalized symbol
//       const key = (currency || "USD").toString().toUpperCase();

//       let found =
//         list.find((r) => normalizeSymbol(r) === key) ||
//         // fallback: try matching against possible "asset" id or name with lowercase
//         list.find((r) => (r?.asset_id?.toString() ?? "") === currency) ||
//         // last fallback: USD if present
//         list.find((r) => normalizeSymbol(r) === "USD") ||
//         // last resort: first element
//         list[0] ||
//         null;

//       return {
//         raw: data,
//         selected: found,
//       };
//     },
//     // (optional) staleTime / cacheTime can be tuned here
//     staleTime: 30 * 1000,
//   });
// }

// export function useEquityChange() {
//   return useQuery({
//     queryKey: ["equity-change", userId],
//     queryFn: async () => {
//       const response = await fetch(
//         baseURL + `/delta/equity_change?userId=${userId}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch wallet balance");
//       return response.json();
//     },
//     enabled: !!userId,
//   });
// }


import { useQuery } from "@tanstack/react-query";
import { BASE_API_URL as baseURL } from "../config";

function normalizeSymbol(obj: any) {
  return (
    obj?.asset_symbol ??
    obj?.assetSymbol ??
    obj?.symbol ??
    obj?.currency ??
    obj?.asset ??
    ""
  )
    .toString()
    .toUpperCase();
}

/**
 * useDeltaBalance - JWT based (NO userId)
 */
export function useDeltaBalance(currency = "USD") {
  return useQuery({
    queryKey: ["delta-balance", currency?.toUpperCase()],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseURL}/delta/balance`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 JWT only
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch wallet balance");
      }

      return res.json();
    },
    select: (data: any) => {
      const list: any[] = Array.isArray(data?.result) ? data.result : [];

      const key = (currency || "USD").toUpperCase();

      const found =
        list.find((r) => normalizeSymbol(r) === key) ||
        list.find((r) => normalizeSymbol(r) === "USD") ||
        list[0] ||
        null;

      return {
        raw: data,
        selected: found,
      };
    },
    staleTime: 30 * 1000,
  });
}

/**
 * useEquityChange - JWT based (NO userId)
 */
export function useEquityChange() {
  return useQuery({
    queryKey: ["equity-change"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${baseURL}/delta/equity_change`, {
        headers: {
          Authorization: `Bearer ${token}`, // 🔥 JWT only
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equity change");
      }

      return response.json();
    },
  });
}
