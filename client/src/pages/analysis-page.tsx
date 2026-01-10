import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Wind,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Chart from "@/components/chart/stratigy-chart";
import { TechnicalAnalysis } from "@/components/trading/technical-analysis";
import { useCommodityFromURL } from "@/hooks/useUrlParams";
import { fetchCommodityIndicators, useCommodities } from "@/sources/commodity-source";
import { cleanSymbol, normalizeToUSDT } from "@/lib/utils";
import {
  fetchMultiTimeframeSignals,
  fetchSymbolNews,
  type MultiTimeframeSignalsResponse,
  type SymbolNewsResponse,
} from "@/sources/analysis-source";
import { MarketBiasHeroCard } from "@/components/analysis/MarketBiasHeroCard";
import { MultiTimeframeSignalMatrix } from "@/components/analysis/MultiTimeframeSignalMatrix";
import { TradeSuggestionPanel } from "@/components/analysis/TradeSuggestionPanel";
import { ChartInsightsOverlay } from "@/components/analysis/ChartInsightsOverlay";
import { IndicatorVisualCards } from "@/components/analysis/IndicatorVisualCards";
import { NewsPanel } from "@/components/analysis/NewsPanel";

const DEFAULT_TIMEFRAMES = ["15m", "1h", "4h", "1d", "1w"] as const;

const getBiasBadge = (bias: string) => {
  if (bias === "Bullish") return "bg-emerald-500/20 text-emerald-200";
  if (bias === "Bearish") return "bg-rose-500/20 text-rose-200";
  return "bg-slate-500/20 text-slate-200";
};

const getVolatilityLabel = (atr: number | null, price: number | null) => {
  if (atr == null || price == null) return "—";
  const pct = (atr / price) * 100;
  if (pct < 0.5) return "Very Low";
  if (pct < 1.25) return "Low";
  if (pct < 2.5) return "Moderate";
  if (pct < 3.75) return "High";
  return "Extreme";
};

export default function AnalysisPage() {
  const { data: commodities } = useCommodities();
  const queryClient = useQueryClient();

  const [indicators, setIndicators] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState<boolean>(true);
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);
  const [activeTf, setActiveTf] = useState("1h");
  const commodity = useCommodityFromURL();

  useEffect(() => {
    setSelectedCommodity(commodity);
  }, [commodity]);

  useEffect(() => {
    if (!selectedCommodity) {
      setIndicators(null);
      setLoadingIndicators(false);
      return;
    }

    setLoadingIndicators(true);
    async function loadIndicators() {
      const data = await fetchCommodityIndicators(selectedCommodity);
      setIndicators(data);
      setLoadingIndicators(false);
    }
    loadIndicators();
  }, [selectedCommodity]);

  const symbol = selectedCommodity ?? "BTCUSD";
  const cleanedSymbol = cleanSymbol(symbol);

  const signalsQuery = useQuery<MultiTimeframeSignalsResponse>({
    queryKey: ["signals", cleanedSymbol],
    queryFn: async () => {
      try {
        return await fetchMultiTimeframeSignals(
          cleanedSymbol,
          [...DEFAULT_TIMEFRAMES],
          500
        );
      } catch (error) {
        console.error("Failed to load signals", error);
        return {
          success: false,
          symbol: cleanedSymbol,
          asOf: new Date().toISOString(),
          timeframes: [],
          overall: {
            bias: "Neutral",
            confidence: 0,
            bestTimeframe: "1h",
          },
        };
      }
    },
  });

  const newsQuery = useQuery<SymbolNewsResponse>({
    queryKey: ["news", cleanedSymbol],
    queryFn: async () => {
      try {
        return await fetchSymbolNews(cleanedSymbol);
      } catch (error) {
        console.error("Failed to load news", error);
        return {
          symbol: cleanedSymbol,
          asOf: new Date().toISOString(),
          items: [],
          overallSentiment: "neutral",
          keyThemes: [],
          watchlist: [],
          warning: "News feed unavailable. Showing cached highlights.",
        };
      }
    },
  });

  const signals = signalsQuery.data;

  useEffect(() => {
    if (!signals) return;
    setActiveTf(signals.overall?.bestTimeframe || "1h");
  }, [signals?.overall?.bestTimeframe, symbol]);

  const activeRow =
    signals?.timeframes?.find((row) => row.tf === activeTf) ??
    signals?.timeframes?.[0];

  const insights = useMemo(() => {
    if (!activeRow) return [];
    const nextInsights: string[] = [];
    const { emaFast, emaSlow, rsi, adx, macd } = activeRow.snapshot;

    if (emaFast != null && emaSlow != null) {
      nextInsights.push(
        emaFast >= emaSlow
          ? "EMA fast above EMA slow (bullish alignment)."
          : "EMA fast below EMA slow (bearish alignment)."
      );
    }

    if (rsi != null) {
      nextInsights.push(
        rsi >= 70
          ? "RSI in overbought zone."
          : rsi <= 30
            ? "RSI in oversold zone."
            : "RSI holding a neutral zone."
      );
    }

    if (adx != null) {
      nextInsights.push(
        adx < 20
          ? "ADX suggests weak trend strength."
          : adx < 30
            ? "ADX shows a building trend."
            : adx < 45
              ? "ADX confirms a strong trend."
              : "ADX confirms a very strong trend."
      );
    }

    if (macd != null) {
      nextInsights.push(
        macd >= 0 ? "MACD momentum positive." : "MACD momentum negative."
      );
    }

    if (activeRow.scores) {
      nextInsights.push(
        `Momentum ${Math.round(activeRow.scores.momentum)} · Risk ${Math.round(
          activeRow.scores.risk
        )}`
      );
    }

    return nextInsights;
  }, [activeRow]);

  const strategyText = signals?.overall?.bestTimeframe
    ? `Best alignment on ${signals.overall.bestTimeframe.toUpperCase()} timeframe.`
    : "Awaiting signal confirmation.";

  const momentumScore = activeRow?.scores?.momentum ?? 0;
  const riskScore = activeRow?.scores?.risk ?? 0;
  const volatilityLabel = getVolatilityLabel(
    activeRow?.snapshot.atr ?? null,
    activeRow?.snapshot.price ?? null
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-trading-dark text-white">
      {/* Header */}
      <div className="bg-trading-card border-b border-gray-700 p-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                data-testid="button-back-Dashboard"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <h6 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="h-8 w-8 text-trading-info mr-3" />
              Technical Analysis
            </h6>
          </div>

          <div className="flex items-center space-x-4">
            <p className="text-gray-400 whitespace-nowrap hidden md:block">
              Advanced market analysis and trading signals
            </p>

            <Select
              value={normalizeToUSDT(selectedCommodity)}
              onValueChange={(value) => {
                setSelectedCommodity(value);
              }}
            >
              <SelectTrigger
                className="w-28 bg-trading-dark border-gray-600 text-white"
                data-testid="select-commodity"
              >
                <SelectValue placeholder={"Select Commodity"} />
              </SelectTrigger>

              <SelectContent>
                {commodities?.map((commodity) => (
                  <SelectItem
                    key={commodity.symbol}
                    value={normalizeToUSDT(commodity.symbol)}
                  >
                    {commodity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1400px] space-y-8">
        {/* Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-3 h-full">
            <MarketBiasHeroCard
              bias={signals?.overall?.bias ?? "Neutral"}
              confidence={signals?.overall?.confidence ?? 0}
              strategyText={strategyText}
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 gap-4 lg:grid-rows-3 auto-rows-fr h-full">
            <Card className="bg-trading-card border-gray-700 h-full">
              <CardContent className="pt-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm">Momentum</h3>
                  <Zap className="h-4 w-4 text-trading-success" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(momentumScore)}
                </div>
                <p className="text-xs text-gray-400">
                  {momentumScore >= 70
                    ? "Strong push"
                    : momentumScore >= 45
                      ? "Building"
                      : "Cooling"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700 h-full">
              <CardContent className="pt-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm">Volatility</h3>
                  <Wind className="h-4 w-4 text-trading-info" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {volatilityLabel}
                </div>
                <p className="text-xs text-gray-400">ATR-based range</p>
              </CardContent>
            </Card>

            <Card className="bg-trading-card border-gray-700 h-full">
              <CardContent className="pt-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-400 text-sm">Risk</h3>
                  <ShieldAlert className="h-4 w-4 text-trading-warning" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(riskScore)}
                </div>
                <p className="text-xs text-gray-400">
                  {riskScore >= 70
                    ? "Elevated"
                    : riskScore >= 45
                      ? "Moderate"
                      : "Contained"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-3 flex flex-col">
            <MultiTimeframeSignalMatrix
              rows={signals?.timeframes}
              activeTf={activeTf}
              onSelectTf={setActiveTf}
              className="h-full"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div className="relative h-full">
              <Chart
                strategy=""
                symbol={symbol}
                timeframe={activeTf}
                onTimeframeChange={setActiveTf}
                showIndicators={true}
              />
              <ChartInsightsOverlay insights={insights} />
            </div>
          </div>

          <div className="lg:col-span-3 lg:sticky lg:top-24">
            <TradeSuggestionPanel row={activeRow} className="h-full" />
          </div>
        </div>

        {/* Row 3 */}
        <div className="space-y-6">
          <IndicatorVisualCards row={activeRow} />
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white text-center">
                Technical Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TechnicalAnalysis data={indicators} loading={loadingIndicators} />
            </CardContent>
          </Card>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">
                Market Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Bullish Factors</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-trading-success mr-2" />
                      MACD showing bullish crossover
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-trading-success mr-2" />
                      Price above 20-day EMA
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-trading-success mr-2" />
                      Strong volume confirmation
                    </li>
                    <li className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-trading-success mr-2" />
                      Support holding at key levels
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Risk Factors</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-trading-danger mr-2" />
                      RSI approaching overbought zone
                    </li>
                    <li className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-trading-danger mr-2" />
                      Resistance near recent highs
                    </li>
                    <li className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-trading-danger mr-2" />
                      Global economic uncertainty
                    </li>
                    <li className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-trading-danger mr-2" />
                      Fed policy changes ahead
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Badge className={getBiasBadge(signals?.overall?.bias ?? "Neutral")}
                >
                  {signals?.overall?.bias ?? "Neutral"} bias
                </Badge>
                <span className="text-xs text-gray-400">
                  {signals?.overall?.confidence
                    ? `${Math.round(signals.overall.confidence)}% confidence`
                    : "Awaiting confirmation"}
                </span>
              </div>
            </CardContent>
          </Card>

          <NewsPanel
            news={newsQuery.data}
            isLoading={newsQuery.isLoading}
            onRefresh={() =>
              queryClient.invalidateQueries({
                queryKey: ["news", cleanedSymbol],
              })
            }
          />
        </div>
        </div>
      </div>
    </div>
  );
}
