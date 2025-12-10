import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

function LoadingShimmer() {
  return (
    <div className="w-14 h-4 bg-gray-700 rounded animate-pulse" />
  );
}


function IndicatorRow({
  label,
  value,
  prefix = "",
  suffix = "",
  tooltip,
  loading = false,
  noArrows = false,
  colour
}: {
  label: string;
  value: number | string | null | undefined;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
  loading?: boolean;
  noArrows?: boolean;
  colour?: string;
}) {
  // Styling based on positive/negative numeric value
  let color = colour ?? "text-white";

  if(!colour){
    if (!loading && typeof value === "number") {
    if (value > 0) color = "text-green-400";
    else if (value < 0) color = "text-red-400";
    else color = "text-blue-400";
  }
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between cursor-help">
          <span className="text-gray-400">{label}</span>

          <div className="text-right font-medium flex items-center">
            {/* SHOW LOADER WHILE FETCHING */}
            {loading ? (
              <LoadingShimmer />
            ) : (
              <>
                <span className={color}>
                  {value !== null && value !== undefined
                    ? `${prefix}${typeof value === "number" ? value.toFixed(2) : value}${suffix}`
                    : "--"}
                </span>

                {!noArrows && typeof value === "number" && (
                  value > 0 ? (
                    <span className="text-green-400 ml-1">↑</span>
                  ) : value < 0 ? (
                    <span className="text-red-400 ml-1">↓</span>
                  ) : (
                    <span className="text-blue-400 ml-1">→</span>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </TooltipTrigger>

      {tooltip && (
        <TooltipContent>
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function formatMarketCap(value: number | null) {
  if (!value) return "--";

  if (value >= 1e12) return (value / 1e12).toFixed(2) + " T";
  if (value >= 1e9) return (value / 1e9).toFixed(2) + " B";
  if (value >= 1e6) return (value / 1e6).toFixed(2) + " M";

  return value.toFixed(2);
}


export function TechnicalAnalysis({ data: indicators }: { data: any }) {
  const loading = !indicators; // If null → all fields loading

  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white text-center">
          Technical Indicators
        </CardTitle>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">

            {/* ===== RSI VALUES ===== */}
            <IndicatorRow label="RSI 1H" value={indicators?.rsi1h} loading={loading} colour={indicators?.rsi1h > 50 ? "text-red-400" : "text-green-400"} noArrows/>
            <IndicatorRow label="RSI 4H" value={indicators?.rsi4h} loading={loading} colour={indicators?.rsi4h > 50 ? "text-red-400" : "text-green-400"} noArrows/>
            <IndicatorRow label="RSI 1D" value={indicators?.rsi1d} loading={loading} colour={indicators?.rsi1d > 50 ? "text-red-400" : "text-green-400"} noArrows/>
            <IndicatorRow label="RSI 1W" value={indicators?.rsi1w} loading={loading} colour={indicators?.rsi1w > 50 ? "text-red-400" : "text-green-400"} noArrows/>

            {/* ===== MACD ===== */}
            <IndicatorRow label="MACD" value={indicators?.macd} loading={loading} noArrows/>

            {/* ===== SMA ===== */}
            <IndicatorRow label="SMA 50" value={indicators?.sma50} prefix="$" loading={loading} colour="text-blue-400" noArrows/>

            {/* ===== MARKET DATA ===== */}
            <IndicatorRow label="Price" value={indicators?.price} prefix="$" loading={loading} colour="text-blue-400" noArrows/>
            <IndicatorRow label="24H High" value={indicators?.high24h} prefix="$" loading={loading} colour="text-green-400" noArrows/>
            <IndicatorRow label="24H Low" value={indicators?.low24h} prefix="$" loading={loading} colour="text-red-400" noArrows/>

            <IndicatorRow
              label="Market Cap"
              value={formatMarketCap(indicators?.marketCap)}
              loading={loading}
              noArrows
            />

            {/* ===== RETURNS ===== */}
            <IndicatorRow label="200D Return" value={indicators?.twoHundredDaysReturn} suffix="%" loading={loading} />
            <IndicatorRow label="1Y Return" value={indicators?.oneYearReturn} suffix="%" loading={loading} />
            <IndicatorRow label="YTD Return" value={indicators?.ytdReturn} suffix="%" loading={loading} />

          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
