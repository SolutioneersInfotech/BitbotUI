import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKeyLevels } from "@/hooks/useKeyLevels";

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

const formatNumber = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—";
  return numberFormatter.format(value);
};

const formatRange = (range?: { low: number; high: number } | null) => {
  if (!range) return "—";
  return `${formatNumber(range.low)} – ${formatNumber(range.high)}`;
};

type KeyLevelsCardProps = {
  symbol: string;
  timeframe: string;
  className?: string;
};

export function KeyLevelsCard({ symbol, timeframe, className }: KeyLevelsCardProps) {
  const { data, loading, error, refetch } = useKeyLevels(symbol, timeframe);

  const rows = [
    {
      label: "Resistance",
      value: data ? formatRange(data.resistance) : "—",
      labelClass: "text-rose-300/80",
      valueClass: "text-rose-200",
    },
    {
      label: "VWAP",
      value: data ? formatNumber(data.vwap) : "—",
      labelClass: "text-sky-300/80",
      valueClass: "text-sky-200",
    },
    {
      label: "Support",
      value: data ? formatRange(data.support) : "—",
      labelClass: "text-emerald-300/80",
      valueClass: "text-emerald-200",
    },
    {
      label: "Liquidity",
      value: data?.liquidity?.note ?? "—",
      labelClass: "text-amber-300/80",
      valueClass: "text-amber-200",
    },
  ];

  return (
    <Card className={cn("bg-trading-card border-gray-700", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-white">
          Key Levels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-4 pt-0 text-sm">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`key-level-skeleton-${index}`}
                className="flex items-center justify-between"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-between gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-2 text-xs text-rose-200">
            <span>Failed to load key levels</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-rose-200 hover:text-rose-100"
              onClick={refetch}
            >
              Retry
            </Button>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4"
            >
              <span className={cn("text-xs font-medium", row.labelClass)}>
                {row.label}
              </span>
              <span className={cn("text-sm font-semibold text-right", row.valueClass)}>
                {row.value}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
