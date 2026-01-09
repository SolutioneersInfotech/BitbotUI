import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimeframeSignalRow } from "@/sources/analysis-source";

const formatNumber = (value: number | null | undefined, digits = 2) => {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(digits);
};

const toRangeLabel = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—";
  const delta = value * 0.003;
  return `${(value - delta).toFixed(2)} - ${(value + delta).toFixed(2)}`;
};

export function TradeSuggestionPanel({ row }: { row?: TimeframeSignalRow }) {
  if (!row) {
    return (
      <Card className="bg-trading-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Trade Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const signal = row.signal;
  const price = row.snapshot.price;
  const support = row.keyLevels.support;
  const resistance = row.keyLevels.resistance;
  const atr = row.snapshot.atr;

  const entryAnchor =
    signal === "BUY" ? support ?? price : signal === "SELL" ? resistance ?? price : price;

  const entryLabel = entryAnchor != null ? toRangeLabel(entryAnchor) : "—";

  let stopLoss: string = "—";
  if (entryAnchor != null) {
    if (atr != null) {
      stopLoss =
        signal === "SELL"
          ? formatNumber(entryAnchor + atr * 1.2)
          : formatNumber(entryAnchor - atr * 1.2);
    } else if (signal === "BUY" && support != null) {
      stopLoss = formatNumber(support * 0.995);
    } else if (signal === "SELL" && resistance != null) {
      stopLoss = formatNumber(resistance * 1.005);
    }
  }

  const targetOne =
    signal === "BUY" ? formatNumber(resistance) : formatNumber(support);
  const targetTwo =
    signal === "BUY" && resistance != null
      ? formatNumber(resistance * 1.015)
      : signal === "SELL" && support != null
        ? formatNumber(support * 0.985)
        : "—";

  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          Trade Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Signal</span>
          <Badge
            className={
              signal === "BUY"
                ? "bg-emerald-500/20 text-emerald-200"
                : signal === "SELL"
                  ? "bg-rose-500/20 text-rose-200"
                  : "bg-slate-500/20 text-slate-200"
            }
          >
            {signal}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Entry Zone</span>
          <span className="font-semibold text-white">{entryLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Stop Loss</span>
          <span className="font-semibold text-white">{stopLoss}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Targets</span>
            <span className="font-semibold text-white">{targetOne}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Extension</span>
            <span className="font-semibold text-white">{targetTwo}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Suggested levels are conservative and based on support/resistance and
          ATR volatility.
        </p>
      </CardContent>
    </Card>
  );
}
