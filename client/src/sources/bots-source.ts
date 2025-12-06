import { BASE_API_URL as baseURL } from "../config";

export interface CreateBotPayload {
  name: string;
  strategy_type: string;
  timeframe: string;
  symbol: string;
  exchange: string;
  configuration: any;
  brokerId?: string;
  userId: string;
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

export async function fetchBots(): Promise<Bot[]> {
  const res = await fetch(`${baseURL}/bots`);
  if (!res.ok) throw new Error("Failed to fetch bots");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createBot(payload: CreateBotPayload): Promise<Bot> {
  const res = await fetch(`${baseURL}/bots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to create bot");
  }

  return res.json();
}

export async function updateBotStatus(botId: string, status: "running" | "stopped") {
  const res = await fetch(`${baseURL}/bots/${botId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update bot status");
  return res.json();
}

export async function deleteBot(botId: string) {
  const res = await fetch(`${baseURL}/bots/${botId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete bot");
  return res.json();
}
