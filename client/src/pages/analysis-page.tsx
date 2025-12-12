import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, Target } from "lucide-react";
import { Link } from "wouter";
import { TradingChart } from "@/components/trading/chart";
import type { Commodity, TechnicalIndicator } from "@shared/schema";
import { useState, useEffect } from "react";
import Chart from "@/components/chart/stratigy-chart";
import { TechnicalAnalysis } from "@/components/trading/technical-analysis";
import { useCommodityFromURL } from "@/hooks/useUrlParams";
import { fetchCommodityIndicators, useCommodities } from "@/sources/commodity-source";
import { cleanSymbol, normalizeToUSDT } from "@/lib/utils";
import { fetchIndicatorSeries } from "@/hooks/useIndicatorSeries";

export default function AnalysisPage() {
  const { data: commodities } = useCommodities();

  const [indicators, setIndicators] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState<boolean>(true);

  const [timeframe, setTimeframe] = useState("1H");
  const [chartData, setChartData] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);
  const commodity = useCommodityFromURL();
  useEffect(() => {
    setSelectedCommodity(commodity);
  }, [commodity]);

  useEffect(() => {
    setLoadingIndicators(true);
    async function loadIndicators() {
      const data = await fetchCommodityIndicators(selectedCommodity);
      setIndicators(data);
      setLoadingIndicators(false);
    }
    loadIndicators();
  }, [selectedCommodity]);

    return (
    <div className="flex flex-col h-full min-h-0 bg-trading-dark text-white">
      {/* Header */}
      <div className="bg-trading-card border-b border-gray-700 p-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back-Dashboard">
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
              onValueChange={(value) => { setSelectedCommodity(value); }}
            >
              <SelectTrigger
                className="w-28 bg-trading-dark border-gray-600 text-white"
                data-testid="select-commodity"
              >
                <SelectValue placeholder={"Select Commodity"} />
              </SelectTrigger>

              <SelectContent>
                {commodities?.map((commodity) => (
                  <SelectItem key={commodity.symbol} value={normalizeToUSDT(commodity.symbol)}>
                    {commodity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      <div className="flex-1 min-h-0 p-6 overflow-y-auto">
        {/* Analysis Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Signal Strength</h3>
                <Target className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-signal-strength">
                {indicators?.confidence || 0}%
              </div>
              <div className="text-trading-success text-sm">
                High confidence
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">RSI (14)</h3>
                <Activity className="h-4 w-4 text-trading-warning" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-rsi-value">
                {indicators?.rsi || '--'}
              </div>
              <div className="text-trading-warning text-sm">
                Neutral zone
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">MACD</h3>
                <TrendingUp className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-macd-value">
                {Number(indicators?.macd).toFixed(2) || '--'}
              </div>
              <div className="text-trading-success text-sm">
                Bullish signal
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Trend</h3>
                <TrendingUp className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-trend-direction">
                Bullish
              </div>
              <div className="text-trading-success text-sm">
                Strong uptrend
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Volatility</h3>
                <BarChart3 className="h-4 w-4 text-trading-info" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-volatility">
                Medium
              </div>
              <div className="text-trading-info text-sm">
                Stable movement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Technical Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-stretch">

          {/* CHART CARD */}
          <Card className="bg-trading-card border-gray-700 lg:col-span-3 flex flex-col h-full">
            <Chart strategy="" symbol={selectedCommodity ?? "BTCUSD"} />
          </Card>

          {/* TECHNICAL INDICATORS CARD */}
          <Card className="bg-trading-card border-gray-700 flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white text-center">
                Technical Indicators
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex-1 overflow-y-auto">
              <TechnicalAnalysis data={indicators} loading={loadingIndicators} />
            </CardContent>
          </Card>

        </div>

        {/* Market Analysis */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Market Analysis Summary</CardTitle>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}