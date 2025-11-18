declare module '@shared/schema' {
  export interface Commodity {
    id: string;
    name: string;
    symbol: string;
    price?: number | string;
  }

  export interface TechnicalIndicator {
    confidence?: number;
    rsi?: number | string;
    macd?: number | string;
    sma50?: number | string;
    ema20?: number | string;
    signal?: 'BUY' | 'SELL' | 'HOLD' | string;
  }

  export interface TradingStrategy {
    id?: string;
    isActive?: boolean;
    name?: string;
  }

  export interface Trade {
    id: string;
    status?: string;
    pnl?: number | string;
    entryPrice?: number | string;
    closedAt?: string | null;
    type?: string;
    symbol?: string;
    currentPrice?: number | string;
  }

  export interface Portfolio {
    totalPnl?: number | string;
    todayPnl?: number | string;
    totalValue?: number | string;
  }

  export interface ExpertPick {
    id?: string;
    signal?: string;
    entryPrice?: number | string;
    stopLoss?: number | string;
    takeProfit?: number | string;
    expectedRoe?: number | string;
    confidence?: number;
    timeframe?: string;
    reasoning?: string;
    createdAt?: string;
    expiresAt?: string;
    commodity?: Commodity;
  }

  export type TechnicalIndicatorType = TechnicalIndicator;
  export type ExpertPickType = ExpertPick;
}
