export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface TechnicalIndicatorData {
  rsi: number;
  macd: number;
  sma50: number;
  ema20: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
}

export interface ChartDataPoint {
  time: string;
  price: number;
}

export interface TradeSignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  message: string;
}
