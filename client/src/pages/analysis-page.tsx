import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, Target } from "lucide-react";
import { Link } from "wouter";
import { TradingChart } from "@/components/trading/chart";
import type { Commodity, TechnicalIndicator } from "@shared/schema";

export default function AnalysisPage() {
  const { data: commodities } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const { data: indicators } = useQuery<TechnicalIndicator>({
    queryKey: ["/api/technical-indicators", "commodity-1"],
  });

  return (
    <div className="min-h-screen bg-trading-dark text-white">
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
            <p className="text-gray-400 whitespace-nowrap hidden md:block">Advanced market analysis and trading signals</p>
            <Select defaultValue="commodity-1">
              <SelectTrigger className="w-48 bg-trading-dark border-gray-600 text-white" data-testid="select-commodity">
                <SelectValue placeholder="Select Commodity" />
              </SelectTrigger>
              <SelectContent>
                {commodities?.map((commodity) => (
                  <SelectItem key={commodity.id} value={commodity.id}>
                    {commodity.name} ({commodity.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-6">
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
                {indicators?.macd || '--'}
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

        {/* Chart and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TradingChart commodity={commodities?.[0]?.id ?? null} />
          </div>

          <div className="space-y-6">
            {/* Technical Indicators */}
            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Technical Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">RSI (14)</span>
                    <div className="text-right">
                      <div className="text-trading-warning font-medium" data-testid="indicator-rsi-detailed">
                        {indicators?.rsi || "--"}
                      </div>
                      <div className="text-xs text-gray-500">Neutral</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">MACD</span>
                    <div className="text-right">
                      <div className="text-trading-success font-medium" data-testid="indicator-macd-detailed">
                        {indicators?.macd || "--"}
                      </div>
                      <div className="text-xs text-trading-success">Bullish</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">SMA (50)</span>
                    <div className="text-right">
                      <div className="text-white font-medium" data-testid="indicator-sma-detailed">
                        ${indicators?.sma50 || "--"}
                      </div>
                      <div className="text-xs text-gray-500">Support</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">EMA (20)</span>
                    <div className="text-right">
                      <div className="text-white font-medium" data-testid="indicator-ema-detailed">
                        ${indicators?.ema20 || "--"}
                      </div>
                      <div className="text-xs text-trading-success">Above Price</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Signal */}
            {indicators?.signal && (
              <Card className={`border ${indicators.signal === 'BUY'
                  ? 'bg-trading-success bg-opacity-20 border-trading-success'
                  : indicators.signal === 'SELL'
                    ? 'bg-trading-danger bg-opacity-20 border-trading-danger'
                    : 'bg-trading-warning bg-opacity-20 border-trading-warning'
                }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`${indicators.signal === 'BUY'
                          ? 'bg-trading-success'
                          : indicators.signal === 'SELL'
                            ? 'bg-trading-danger'
                            : 'bg-trading-warning'
                        } text-white`}
                      data-testid="trading-signal-badge"
                    >
                      {indicators.signal} Signal
                    </Badge>
                    <span className={`text-sm font-medium ${indicators.signal === 'BUY'
                        ? 'text-trading-success'
                        : indicators.signal === 'SELL'
                          ? 'text-trading-danger'
                          : 'text-trading-warning'
                      }`} data-testid="signal-confidence-detailed">
                      {indicators.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {indicators.signal === 'BUY'
                      ? "Strong bullish momentum detected. Technical indicators are aligned for an upward move. Consider entry at current levels with proper risk management."
                      : indicators.signal === 'SELL'
                        ? "Bearish signals emerging. Multiple indicators suggest downward pressure. Consider taking profits or establishing short positions."
                        : "Mixed signals detected. Market is in consolidation phase. Wait for clearer direction before making significant moves."
                    }
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className={indicators.signal === 'BUY' ? 'bg-trading-success hover:bg-green-600' : 'bg-trading-danger hover:bg-red-600'}
                      size="sm"
                      data-testid="button-execute-signal"
                    >
                      Execute {indicators.signal}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-trading-dark border-gray-600 text-white hover:bg-gray-600"
                      data-testid="button-set-alert"
                    >
                      Set Alert
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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