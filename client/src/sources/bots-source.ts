// import { TradeLog } from "@/types/bots-trading";
// import { BASE_API_URL as baseURL } from "../config";

// export interface CreateBotPayload {
//   name: string;
//   strategy_type: string;
//   timeframe: string;
//   symbol: string;
//   exchange: string;
//   configuration: any;
//   brokerId?: string;
//   userId: string;
// }

// export interface Bot {
//   _id: string;
//   name: string;
//   strategy_type: string;
//   timeframe: string;
//   symbol: string;
//   exchange: string;
//   status: "running" | "stopped" | "error";
//   createdAt: string;
//   configuration: any;
// }

// export async function fetchBots(): Promise<Bot[]> {
//   const res = await fetch(`${baseURL}/bots`);
//   if (!res.ok) throw new Error("Failed to fetch bots");
//   const data = await res.json();
//   return Array.isArray(data) ? data : [];
// }

// export async function createBot(payload: CreateBotPayload): Promise<Bot> {
//   const res = await fetch(`${baseURL}/bots`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const errorMessage = await res.text();
//     throw new Error(errorMessage || "Failed to create bot");
//   }

//   return res.json();
// }

// export async function updateBotStatus(botId: string, status: "running" | "stopped") {
//   const res = await fetch(`${baseURL}/bots/${botId}/status`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ status }),
//   });

//   if (!res.ok) throw new Error("Failed to update bot status");
//   return res.json();
// }

// export async function deleteBot(botId: string) {
//   const res = await fetch(`${baseURL}/bots/${botId}`, {
//     method: "DELETE",
//   });

//   if (!res.ok) throw new Error("Failed to delete bot");
//   return res.json();
// }

// export async function fetchBotTrades(botId: string): Promise<TradeLog[]> {
//   const res = await fetch(`${baseURL}/bots/${botId}/trades`);

//   if (!res.ok) throw new Error("Failed to fetch trade history");

//   const data = await res.json();
//   return data?.trades ;
// }


// export async function fetchBotPnL(botId: string): Promise<number> {
//   const res = await fetch(`${baseURL}/bots/${botId}/pnl`);

//   if (!res.ok) throw new Error("Failed to fetch PnL");

//   const data = await res.json();
//   console.log("data====>>",data);
//   return data ?? {};
// }


import { TradeLog } from "@/types/bots-trading";
import { BASE_API_URL as baseURL } from "../config";

/* ---------------- TYPES ---------------- */

export interface CreateBotPayload {
  name: string;
  strategy_type: string;
  timeframe: string;
  symbol: string;
  exchange: string;
  configuration: any;
  brokerId?: string;
}

export interface Bot {
  _id: string;
  name: string;
  strategy_type: string;
  timeframe: string;
  symbol: string;
  exchange: string;
  status: "running" | "stopped" | "error";
  createdAt: string;
  configuration: any;
}

/* ---------------- HELPERS ---------------- */

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/* ---------------- API CALLS ---------------- */

/**
 * ✅ Fetch bots for logged-in user (JWT based)
 */
export async function fetchBots(): Promise<Bot[]> {
  const res = await fetch(`${baseURL}/bots`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch bots");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * ✅ Create bot (NO userId, JWT based)
 */
export async function createBot(payload: CreateBotPayload): Promise<Bot> {
  const res = await fetch(`${baseURL}/bots`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to create bot");
  }

  return res.json();
}

/**
 * ✅ Update bot status
 */
export async function updateBotStatus(
  botId: string,
  status: "running" | "stopped"
) {
  const res = await fetch(`${baseURL}/bots/${botId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update bot status");
  return res.json();
}

/**
 * ✅ Delete bot
 */
export async function deleteBot(botId: string) {
  const res = await fetch(`${baseURL}/bots/${botId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete bot");
  return res.json();
}

/**
 * ✅ Fetch bot trades (botId based, user resolved via JWT)
 */
export async function fetchBotTrades(botId: string): Promise<TradeLog[]> {
  const res = await fetch(`${baseURL}/bots/${botId}/trades`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch trade history");

  const data = await res.json();
  return data?.trades ?? [];
}

/**
 * ✅ Fetch bot PnL
 */
export async function fetchBotPnL(botId: string): Promise<number> {
  const res = await fetch(`${baseURL}/bots/${botId}/pnl`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch PnL");

  const data = await res.json();
  return data ?? 0;
}
