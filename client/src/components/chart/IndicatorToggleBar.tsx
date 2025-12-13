import { IndicatorConfig, IndicatorToggleKey, IndicatorToggleState } from "@/types/chart-types";
import { INDICATOR_CONFIG } from "@/types/chart-types";

type Props = {
  toggles: IndicatorToggleState;
  setToggles: React.Dispatch<React.SetStateAction<IndicatorToggleState>>;
  timeframe: string;
};

function getIndicatorTooltips(cfg: IndicatorConfig) {
  return {
    rsi: `RSI (${cfg.rsiPeriod}) — Measures momentum and overbought/oversold conditions.`,
    
    ema: `EMA (${cfg.emaFast}/${cfg.emaSlow}) — Fast & slow exponential moving averages for trend direction and pullbacks.`,
    
    sma: `SMA (${cfg.emaSlow}) — Simple moving average used to identify the primary trend.`,
    
    macd: `MACD (${cfg.macdFast}, ${cfg.macdSlow}, ${cfg.macdSignal}) — Momentum and trend convergence/divergence indicator.`,
    
    bbands: `Bollinger Bands (20, 2) — Volatility bands that expand and contract with market conditions.`,
    
    adx: `ADX (${cfg.adxPeriod}) — Measures trend strength (not bullish or bearish).`,
    
    atr: `ATR (${cfg.atrPeriod}) — Average True Range, indicates market volatility.`,
  };
}

export function IndicatorToggleBar({
  toggles,
  setToggles,
  timeframe,
}: Props) {
  const cfg = INDICATOR_CONFIG[timeframe] ?? INDICATOR_CONFIG["1d"];
  const tooltips = getIndicatorTooltips(cfg);
  const INDICATORS: { key: IndicatorToggleKey; label: string }[] = [
    { key: "rsi", label: `RSI ${cfg.rsiPeriod}` },
    { key: "sma", label: `SMA ${cfg.emaSlow}` },
    { key: "ema", label: `EMA ${cfg.emaFast}/${cfg.emaSlow}` },
    { key: "macd", label: `MACD` },
    { key: "bbands", label: "BB" },
    { key: "adx", label: `ADX ${cfg.adxPeriod}` },
    { key: "atr", label: `ATR ${cfg.atrPeriod}` },
  ];

  function toggle(indicator: IndicatorToggleKey) {
    setToggles((prev) => ({
      ...prev,
      [indicator]: !prev[indicator],
    }));
  }

  return (
    <div className="flex items-center space-x-2">
      {INDICATORS.map((i) => {
        const tooltip = tooltips[i.key];

        return (
          <div key={i.key} className="relative group">
            <button
              onClick={() => toggle(i.key)}
              className={
                toggles[i.key]
                  ? "px-3 py-1 rounded-md text-xs font-medium border transition-all bg-blue-600 text-white border-blue-600"
                  : "px-3 py-1 rounded-md text-xs font-medium border transition-all bg-trading-dark text-gray-400 border-gray-700 hover:bg-gray-800"
              }
            >
              {i.label}
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="rounded-md bg-black text-gray-200 text-xs px-3 py-2 shadow-lg border border-gray-700">
                <div className="font-semibold mb-1">{i.label}</div>
                <div className="text-gray-400">{tooltip}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
