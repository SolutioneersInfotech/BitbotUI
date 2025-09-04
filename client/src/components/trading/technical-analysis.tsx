import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TechnicalIndicator } from "@shared/schema";

export function TechnicalAnalysis() {
  // Using a default commodity ID for demo purposes
  const { data: indicators } = useQuery<TechnicalIndicator>({
    queryKey: ["/api/technical-indicators", "default-gold-id"],
  });

  return (
    <Card className="bg-trading-card border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">RSI (14)</span>
            <div className="text-right">
              <div className="text-trading-warning font-medium" data-testid="indicator-rsi">
                {indicators?.rsi || "--"}
              </div>
              <div className="text-xs text-gray-500">Neutral</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">MACD</span>
            <div className="text-right">
              <div className="text-trading-success font-medium" data-testid="indicator-macd">
                {indicators?.macd || "--"}
              </div>
              <div className="text-xs text-trading-success">Bullish</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">SMA (50)</span>
            <div className="text-right">
              <div className="text-white font-medium" data-testid="indicator-sma">
                ${indicators?.sma50 || "--"}
              </div>
              <div className="text-xs text-gray-500">Support</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">EMA (20)</span>
            <div className="text-right">
              <div className="text-white font-medium" data-testid="indicator-ema">
                ${indicators?.ema20 || "--"}
              </div>
              <div className="text-xs text-trading-success">Above Price</div>
            </div>
          </div>

          {indicators?.signal && (
            <div className={`mt-6 p-4 rounded-lg border ${
              indicators.signal === 'BUY' 
                ? 'bg-trading-success bg-opacity-20 border-trading-success' 
                : indicators.signal === 'SELL'
                ? 'bg-trading-danger bg-opacity-20 border-trading-danger'
                : 'bg-trading-warning bg-opacity-20 border-trading-warning'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${
                  indicators.signal === 'BUY' 
                    ? 'text-trading-success' 
                    : indicators.signal === 'SELL'
                    ? 'text-trading-danger'
                    : 'text-trading-warning'
                }`} data-testid="trading-signal">
                  {indicators.signal} Signal
                </span>
                <span className={`text-sm ${
                  indicators.signal === 'BUY' 
                    ? 'text-trading-success' 
                    : indicators.signal === 'SELL'
                    ? 'text-trading-danger'
                    : 'text-trading-warning'
                }`} data-testid="signal-confidence">
                  {indicators.confidence}% Confidence
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {indicators.signal === 'BUY' 
                  ? "Strong bullish momentum detected. Consider entry at current levels."
                  : indicators.signal === 'SELL'
                  ? "Bearish signals emerging. Consider taking profits or shorting."
                  : "Mixed signals detected. Wait for clearer direction."
                }
              </p>
            </div>
          )}

          {!indicators && (
            <div className="mt-6 p-4 bg-trading-dark rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm text-center">
                No technical analysis data available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
