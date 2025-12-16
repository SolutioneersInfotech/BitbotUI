import { cn } from "@/lib/utils";

type TimeframeOption = {
  label: string;
  value: string;
};

const TIMEFRAMES: TimeframeOption[] = [
  { label: "1M", value: "1m" },
  { label: "15M", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
];

export function TimeframeSelector({
  timeframe,
  setTimeframe,
}: {
  timeframe: string;
  setTimeframe: (tf: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setTimeframe(tf.value)}
          title={
            tf.value === "1m" ? "Scalping timeframe (high noise)" :
              tf.value === "15m" ? "Intraday timeframe" :
                tf.value === "1h" ? "Short-term trend" :
                  tf.value === "4h" ? "Swing trading" :
                    "Long-term trend"
          }
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-all border",
            timeframe === tf.value
              ? "bg-trading-success text-white border-trading-success"
              : "bg-trading-dark text-gray-400 border-gray-700 hover:bg-gray-800"
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
