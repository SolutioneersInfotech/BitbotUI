export type IndicatorToggleState = {
  rsi: boolean;
  macd: boolean;
  sma50: boolean;
  ema20: boolean;
  bbands: boolean;
};

export type IndicatorToggleKey = keyof IndicatorToggleState;
