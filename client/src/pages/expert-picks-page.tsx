import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Target, DollarSign, Clock, Zap } from "lucide-react";
import { Link } from "wouter";
import type { ExpertPick, Commodity } from "@shared/schema";

interface ExpertPickWithCommodity extends ExpertPick {
  commodity: Commodity;
}

export default function ExpertPicksPage() {
  const { data: expertPicks, isLoading } = useQuery<ExpertPickWithCommodity[]>({
    queryKey: ["/api/expert-picks"],
  });

  const activePicks = expertPicks?.filter(pick => 
    !pick.expiresAt || new Date(pick.expiresAt) > new Date()
  ) || [];

  const buySignals = activePicks.filter(pick => pick.signal === 'BUY');
  const sellSignals = activePicks.filter(pick => pick.signal === 'SELL');

  return (
    <div className="min-h-screen bg-trading-dark text-white">
      {/* Header */}
      <div className="bg-trading-card border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Zap className="h-8 w-8 text-trading-warning mr-3" />
                Expert Picks
              </h1>
              <p className="text-gray-400 mt-1">AI-powered trade recommendations for popular commodities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Active Picks</h3>
                <Target className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-active-picks">
                {activePicks.length}
              </div>
              <div className="text-trading-success text-sm">
                Currently available
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Buy Signals</h3>
                <TrendingUp className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-buy-signals">
                {buySignals.length}
              </div>
              <div className="text-trading-success text-sm">
                Bullish opportunities
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Sell Signals</h3>
                <TrendingDown className="h-4 w-4 text-trading-danger" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-sell-signals">
                {sellSignals.length}
              </div>
              <div className="text-trading-danger text-sm">
                Bearish opportunities
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Avg. Expected ROE</h3>
                <DollarSign className="h-4 w-4 text-trading-warning" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-avg-roe">
                {activePicks.length > 0 ? 
                  (activePicks.reduce((sum, pick) => sum + Number(pick.expectedRoe), 0) / activePicks.length).toFixed(1) : 
                  '0.0'
                }%
              </div>
              <div className="text-trading-warning text-sm">
                Average return
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expert Picks List */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Current Trade Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading expert picks...</p>
              </div>
            ) : activePicks.length > 0 ? (
              <div className="space-y-4">
                {activePicks.map((pick) => {
                  const isProfitable = pick.signal === 'BUY' ? 
                    Number(pick.takeProfit) > Number(pick.entryPrice) : 
                    Number(pick.takeProfit) < Number(pick.entryPrice);
                  
                  const riskReward = pick.signal === 'BUY' ? 
                    (Number(pick.takeProfit) - Number(pick.entryPrice)) / (Number(pick.entryPrice) - Number(pick.stopLoss)) :
                    (Number(pick.entryPrice) - Number(pick.takeProfit)) / (Number(pick.stopLoss) - Number(pick.entryPrice));

                  return (
                    <div
                      key={pick.id}
                      className="bg-trading-dark rounded-lg p-6 border border-gray-700"
                      data-testid={`expert-pick-${pick.id}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-white">
                              {pick.commodity?.name} ({pick.commodity?.symbol})
                            </h3>
                            <Badge 
                              className={pick.signal === 'BUY' ? 'bg-trading-success' : 'bg-trading-danger'}
                            >
                              {pick.signal}
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline" 
                            className="border-trading-warning text-trading-warning"
                          >
                            {pick.timeframe}
                          </Badge>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold text-trading-warning">
                            {pick.confidence}% Confidence
                          </div>
                          <div className="text-sm text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {pick.createdAt ? new Date(pick.createdAt).toLocaleString() : 'Just now'}
                          </div>
                        </div>
                      </div>

                      {/* Trading Details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-trading-card p-4 rounded">
                          <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                          <div className="text-lg font-semibold text-white" data-testid={`entry-price-${pick.id}`}>
                            ${Number(pick.entryPrice).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-trading-card p-4 rounded">
                          <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                          <div className="text-lg font-semibold text-trading-danger" data-testid={`stop-loss-${pick.id}`}>
                            ${Number(pick.stopLoss).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-trading-card p-4 rounded">
                          <div className="text-xs text-gray-400 mb-1">Take Profit</div>
                          <div className="text-lg font-semibold text-trading-success" data-testid={`take-profit-${pick.id}`}>
                            ${Number(pick.takeProfit).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="bg-trading-card p-4 rounded">
                          <div className="text-xs text-gray-400 mb-1">Expected ROE</div>
                          <div className="text-lg font-semibold text-trading-warning" data-testid={`expected-roe-${pick.id}`}>
                            {Number(pick.expectedRoe).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Risk Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-between p-3 bg-trading-card rounded">
                          <span className="text-gray-400">Risk/Reward Ratio</span>
                          <span className="text-trading-info font-medium">
                            1:{riskReward.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-trading-card rounded">
                          <span className="text-gray-400">Signal Strength</span>
                          <span className={`font-medium ${
                            pick.confidence >= 80 ? 'text-trading-success' : 
                            pick.confidence >= 60 ? 'text-trading-warning' : 'text-trading-danger'
                          }`}>
                            {pick.confidence >= 80 ? 'Strong' : pick.confidence >= 60 ? 'Medium' : 'Weak'}
                          </span>
                        </div>
                      </div>

                      {/* Reasoning */}
                      {pick.reasoning && (
                        <div className="mb-4">
                          <h4 className="text-white font-medium mb-2">AI Analysis</h4>
                          <p className="text-gray-300 text-sm bg-trading-card p-3 rounded">
                            {pick.reasoning}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button 
                          className={pick.signal === 'BUY' ? 'bg-trading-success hover:bg-green-600' : 'bg-trading-danger hover:bg-red-600'}
                          data-testid={`button-execute-${pick.id}`}
                        >
                          Execute {pick.signal} Trade
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-trading-dark border-gray-600 text-white hover:bg-gray-600"
                          data-testid={`button-copy-parameters-${pick.id}`}
                        >
                          Copy Parameters
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-trading-dark border-gray-600 text-white hover:bg-gray-600"
                          data-testid={`button-set-alert-${pick.id}`}
                        >
                          Set Alert
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No active expert picks available</p>
                <p className="text-gray-500 text-sm">New recommendations will appear here when generated by our AI bot</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}