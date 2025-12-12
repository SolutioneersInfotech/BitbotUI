import { cn } from "@/lib/utils";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"];

export function TimeframeSelector({ timeframe, setTimeframe }: { timeframe: string; setTimeframe: (tf: string) => void }) {
  return (
    <div className="flex items-center space-x-2">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => setTimeframe(tf.toLowerCase())}
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-all border",
            timeframe === tf.toLowerCase()
              ? "bg-trading-success text-white border-trading-success"
              : "bg-trading-dark text-gray-400 border-gray-700 hover:bg-gray-800"
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
