export interface TradeLog {
  _id: string;
  botId: string;
  userId: string;
  exchange: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  amount: number;
  price: number;
  pnl?: number | null;
  orderId?: string;
  createdAt: string;
  closedAt?: string;
}
