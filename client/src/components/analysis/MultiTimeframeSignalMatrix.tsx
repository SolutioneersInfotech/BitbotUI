import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TimeframeSignalRow } from "@/sources/analysis-source";

type MultiTimeframeSignalMatrixProps = {
  rows?: TimeframeSignalRow[];
  activeTf?: string;
  onSelectTf?: (tf: string) => void;
};

const signalStyles: Record<
  TimeframeSignalRow["signal"],
  { label: string; className: string }
> = {
  BUY: { label: "Buy", className: "bg-emerald-500/20 text-emerald-200" },
  SELL: { label: "Sell", className: "bg-rose-500/20 text-rose-200" },
  WAIT: { label: "Wait", className: "bg-slate-500/20 text-slate-200" },
};

export function MultiTimeframeSignalMatrix({
  rows,
  activeTf,
  onSelectTf,
}: MultiTimeframeSignalMatrixProps) {
  const showSkeleton = !rows || rows.length === 0;

  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white">
          Multi-Timeframe Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showSkeleton
          ? Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`signal-skeleton-${index}`}
                className="grid grid-cols-[60px_90px_1fr_120px] items-center gap-3"
              >
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : rows.map((row) => {
              const signalStyle = signalStyles[row.signal];
              return (
                <button
                  key={row.tf}
                  type="button"
                  onClick={() => onSelectTf?.(row.tf)}
                  className={cn(
                    "grid grid-cols-[60px_90px_1fr_120px] items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                    activeTf === row.tf
                      ? "bg-slate-800/80"
                      : "hover:bg-slate-800/40"
                  )}
                >
                  <span className="text-sm font-semibold text-white">
                    {row.tf.toUpperCase()}
                  </span>
                  <Badge className={cn("w-fit", signalStyle.className)}>
                    {signalStyle.label}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={row.confidence}
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-gray-400">
                      {Math.round(row.confidence)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{row.trend}</span>
                </button>
              );
            })}
      </CardContent>
    </Card>
  );
}
