import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type MarketBiasHeroCardProps = {
  bias: "Bullish" | "Bearish" | "Neutral";
  confidence: number;
  strategyText: string;
};

const biasStyles: Record<MarketBiasHeroCardProps["bias"], string> = {
  Bullish: "from-emerald-500/70 via-emerald-400/40 to-teal-500/70",
  Bearish: "from-rose-500/70 via-rose-400/40 to-orange-500/70",
  Neutral: "from-slate-500/70 via-slate-400/40 to-slate-600/70",
};

export function MarketBiasHeroCard({
  bias,
  confidence,
  strategyText,
}: MarketBiasHeroCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-[1px] bg-gradient-to-r h-full",
        biasStyles[bias]
      )}
    >
      <Card className="bg-trading-card border-0 rounded-2xl h-full">
        <CardContent className="p-6 lg:p-8 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                Market Bias
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
                {bias.toUpperCase()}
              </h2>
              <p className="text-gray-400 mt-2 text-sm">{strategyText}</p>
            </div>
            <Badge
              className={cn(
                "px-3 py-1 text-xs",
                bias === "Bullish"
                  ? "bg-emerald-500/20 text-emerald-200"
                  : bias === "Bearish"
                    ? "bg-rose-500/20 text-rose-200"
                    : "bg-slate-500/20 text-slate-200"
              )}
            >
              Confidence {Math.round(confidence)}%
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
