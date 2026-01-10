import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type MarketBiasHeroCardProps = {
  bias: "Bullish" | "Bearish" | "Neutral" | "Range";
  confidence: number;
  strategyText: string;
};

const biasStyles: Record<MarketBiasHeroCardProps["bias"], string> = {
  Bullish: "from-emerald-500/70 via-emerald-400/40 to-teal-500/70",
  Bearish: "from-rose-500/70 via-rose-400/40 to-orange-500/70",
  Neutral: "from-slate-500/70 via-slate-400/40 to-slate-600/70",
  Range: "from-slate-500/70 via-slate-400/40 to-slate-600/70",
};

export function MarketBiasHeroCard({
  bias,
  confidence,
  strategyText,
}: MarketBiasHeroCardProps) {
  const clampedConfidence = Math.min(Math.max(confidence, 0), 100);
  const biasScore =
    (bias === "Bullish" ? 1 : bias === "Bearish" ? -1 : 0) *
    clampedConfidence;
  const meterPosition = `${Math.min(
    Math.max((biasScore + 100) / 2, 0),
    100
  )}%`;

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
              <div className="flex items-center gap-2">
                <p className="text-sm uppercase tracking-[0.4em] text-gray-400">
                  Market Bias
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-200 transition"
                        aria-label="Market bias calculation details"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-2 text-sm">
                        <p>
                          Bias combines trend and oscillator signals from:
                        </p>
                        <ul className="list-disc list-inside text-gray-200 space-y-1">
                          <li>EMA fast/slow alignment</li>
                          <li>RSI momentum zone</li>
                          <li>MACD momentum</li>
                          <li>ADX trend strength</li>
                          <li>ATR volatility context</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              Confidence {Math.round(clampedConfidence)}%
            </Badge>
          </div>
          <div className="mt-6">
            <div className="relative h-3 rounded-full bg-gradient-to-r from-rose-500 via-slate-400 to-emerald-500">
              <div
                className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-white shadow-sm"
                style={{ left: meterPosition }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-gray-500">
              <span>Strong Sell</span>
              <span>Sell</span>
              <span>Neutral</span>
              <span>Buy</span>
              <span>Strong Buy</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
