import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { TimeframeSignalRow } from "@/sources/analysis-source";

const getRsiZone = (value: number | null) => {
  if (value == null) return "No data";
  if (value >= 70) return "Overbought";
  if (value <= 30) return "Oversold";
  return "Neutral";
};

const getAdxLabel = (value: number | null) => {
  if (value == null) return "No data";
  if (value < 20) return "Weak";
  if (value < 30) return "Building";
  if (value < 45) return "Strong";
  return "Very strong";
};

const getAtrLabel = (atr: number | null, price: number | null) => {
  if (atr == null || price == null) return "No data";
  const pct = (atr / price) * 100;
  if (pct < 0.5) return "Very low";
  if (pct < 1.25) return "Low";
  if (pct < 2.5) return "Moderate";
  if (pct < 3.75) return "High";
  return "Extreme";
};

export function IndicatorVisualCards({ row }: { row?: TimeframeSignalRow }) {
  if (!row) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`indicator-skeleton-${index}`} className="bg-trading-card border-gray-700">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const rsi = row.snapshot.rsi;
  const macd = row.snapshot.macd;
  const adx = row.snapshot.adx;
  const atr = row.snapshot.atr;
  const price = row.snapshot.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-trading-card border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">RSI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">
              {rsi != null ? rsi.toFixed(1) : "—"}
            </span>
            <span className="text-gray-400">{getRsiZone(rsi)}</span>
          </div>
          <Progress value={rsi ?? 0} className="h-2" />
        </CardContent>
      </Card>

      <Card className="bg-trading-card border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">MACD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">
              {macd != null ? macd.toFixed(2) : "—"}
            </span>
            <span className="text-gray-400">
              {macd == null ? "No data" : macd >= 0 ? "Bullish" : "Bearish"}
            </span>
          </div>
          <div className="text-xs text-gray-500">Momentum readout</div>
        </CardContent>
      </Card>

      <Card className="bg-trading-card border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">ADX</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">
              {adx != null ? adx.toFixed(1) : "—"}
            </span>
            <span className="text-gray-400">{getAdxLabel(adx)}</span>
          </div>
          <div className="text-xs text-gray-500">Trend strength</div>
        </CardContent>
      </Card>

      <Card className="bg-trading-card border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400">ATR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-semibold">
              {atr != null ? atr.toFixed(2) : "—"}
            </span>
            <span className="text-gray-400">{getAtrLabel(atr, price)}</span>
          </div>
          <div className="text-xs text-gray-500">Volatility</div>
        </CardContent>
      </Card>
    </div>
  );
}
