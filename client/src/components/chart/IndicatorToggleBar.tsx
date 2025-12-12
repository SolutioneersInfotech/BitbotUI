import { IndicatorToggleKey, IndicatorToggleState } from "@/types/strategy-chart";


const INDICATORS: { key: IndicatorToggleKey; label: string }[] = [
  { key: "rsi", label: "RSI" },
  { key: "macd", label: "MACD" },
  { key: "sma50", label: "SMA 50" },
  { key: "ema20", label: "EMA 20" },
  { key: "bbands", label: "BB" },
];

export function IndicatorToggleBar({
  toggles,
  setToggles,
}: {
  toggles: IndicatorToggleState;
  setToggles: React.Dispatch<React.SetStateAction<IndicatorToggleState>>;
}) {
  function toggle(indicator: IndicatorToggleKey) {
    setToggles((prev: IndicatorToggleState) => ({
      ...prev,
      [indicator]: !prev[indicator],
    }));
  }

  return (
    <div className="flex items-center space-x-2">
      {INDICATORS.map((i) => (
        <button
          key={i.key}
          onClick={() => toggle(i.key)}
          className={
            toggles[i.key]
              ? "px-3 py-1 rounded-md text-xs font-medium border transition-all bg-blue-600 text-white border-blue-600"
              : "px-3 py-1 rounded-md text-xs font-medium border transition-all bg-trading-dark text-gray-400 border-gray-700 hover:bg-gray-800"
          }
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
