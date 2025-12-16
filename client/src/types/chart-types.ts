export type IndicatorToggleKey =
  | "rsi"
  | "macd"
  | "sma"
  | "ema"
  | "bbands"
  | "adx"
  | "atr";

export type IndicatorToggleState = Record<IndicatorToggleKey, boolean>;


export type IndicatorConfig = {
    rsiPeriod: number;
    emaFast: number;
    emaSlow: number;
    adxPeriod: number;
    atrPeriod: number;
    macdFast: number;
    macdSlow: number;
    macdSignal: number;
};

export const INDICATOR_CONFIG: Record<string, IndicatorConfig> = {
    "1m": {
        rsiPeriod: 7,
        emaFast: 9,
        emaSlow: 21,
        adxPeriod: 10,
        atrPeriod: 10,
        macdFast: 8,
        macdSlow: 17,
        macdSignal: 9,
    },
    "15m": {
        rsiPeriod: 9,
        emaFast: 12,
        emaSlow: 26,
        adxPeriod: 14,
        atrPeriod: 14,
        macdFast: 12,
        macdSlow: 26,
        macdSignal: 9,
    },
    "1h": {
        rsiPeriod: 14,
        emaFast: 20,
        emaSlow: 50,
        adxPeriod: 14,
        atrPeriod: 14,
        macdFast: 12,
        macdSlow: 26,
        macdSignal: 9,
    },
    "4h": {
        rsiPeriod: 14,
        emaFast: 20,
        emaSlow: 50,
        adxPeriod: 14,
        atrPeriod: 14,
        macdFast: 12,
        macdSlow: 26,
        macdSignal: 9,
    },
    "1d": {
        rsiPeriod: 14,
        emaFast: 20,
        emaSlow: 50,
        adxPeriod: 14,
        atrPeriod: 14,
        macdFast: 12,
        macdSlow: 26,
        macdSignal: 9,
    },
    "1w": {
        rsiPeriod: 14,
        emaFast: 20,
        emaSlow: 50,
        adxPeriod: 14,
        atrPeriod: 14,
        macdFast: 12,
        macdSlow: 26,
        macdSignal: 9,
    },
};
