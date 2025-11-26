import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Activity, Target, DollarSign, PieChart } from "lucide-react";
import { Link } from "wouter";
import { ActiveTrades } from "@/components/trading/active-trades";
import type { Portfolio, Trade } from "@shared/schema";
import { useDeltaBalance } from "@/sources/portfolio-source";

export default function PortfolioPage() {
  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const userId = "68ea1582539ded5dbe090fef";

  const { data: trades } = useQuery<Trade[]>({
    queryKey: ["/api/trades", userId],
    queryFn: async () => {
      const response = await fetch(`https://predator-production.up.railway.app/api/Activetrades?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch trades");
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: deltaBalance } = useDeltaBalance();

  const walletBalance = Number(deltaBalance?.result?.[0]?.balance || 0);

  const activeTrades = trades?.filter(trade => trade.status === 'active') || [];
  const closedTrades = trades?.filter(trade => trade.status === 'closed') || [];

  const totalPnL = Number(portfolio?.totalPnl) || 0;
  const todayPnL = Number(portfolio?.todayPnl) || 0;
  const totalValue = Number(portfolio?.totalValue) || 0;

  const winningTrades = closedTrades.filter(trade => Number(trade.pnl) > 0);
  const losingTrades = closedTrades.filter(trade => Number(trade.pnl) < 0);
  const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

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
              <Wallet className="h-8 w-8 text-trading-success mr-3" />
              Portfolio Overview
            </h6>
          </div>

          <p className="text-gray-400 whitespace-nowrap hidden md:block mr-1">Track your trading performance and portfolio metrics</p>
        </div>
      </div>

  <div className="flex-1 min-h-0 p-6 overflow-y-auto">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Portfolio Value</h3>
                <Wallet className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-3xl font-bold text-white mb-1" >
                ${walletBalance.toLocaleString()}

              </div>
              <div className={`text-sm ${totalPnL >= 0 ? 'text-trading-success' : 'text-trading-danger'}`}>
                <span className="mr-1">{totalPnL >= 0 ? '↗' : '↘'}</span>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} Total P&L
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Today's P&L</h3>
                <DollarSign className="h-4 w-4 text-trading-info" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-portfolio-today-pnl">
                ${todayPnL.toFixed(2)}
              </div>
              <div className={`text-sm ${todayPnL >= 0 ? 'text-trading-success' : 'text-trading-danger'}`}>
                <span className="mr-1">{todayPnL >= 0 ? '↗' : '↘'}</span>
                {((todayPnL / totalValue) * 100).toFixed(2)}% today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Active Positions</h3>
                <Activity className="h-4 w-4 text-trading-warning" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-portfolio-active-positions">
                {activeTrades.length}
              </div>
              <div className="text-trading-info text-sm">
                Currently open
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Win Rate</h3>
                <Target className="h-4 w-4 text-trading-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-1" data-testid="text-portfolio-win-rate">
                {winRate.toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">
                {winningTrades.length}W / {losingTrades.length}L
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Winning Trades</span>
                    <span className="text-trading-success font-medium">{winningTrades.length}</span>
                  </div>
                  <Progress value={(winningTrades.length / (closedTrades.length || 1)) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Losing Trades</span>
                    <span className="text-trading-danger font-medium">{losingTrades.length}</span>
                  </div>
                  <Progress value={(losingTrades.length / (closedTrades.length || 1)) * 100} className="h-2 bg-trading-danger" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-trading-dark rounded">
                    <div className="text-lg font-semibold text-trading-success">
                      ${winningTrades.reduce((sum, trade) => sum + Number(trade.pnl), 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Gross Profit</div>
                  </div>
                  <div className="text-center p-3 bg-trading-dark rounded">
                    <div className="text-lg font-semibold text-trading-danger">
                      ${Math.abs(losingTrades.reduce((sum, trade) => sum + Number(trade.pnl), 0)).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Gross Loss</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Maximum Drawdown</span>
                  <span className="text-trading-danger font-medium">-2.8%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sharpe Ratio</span>
                  <span className="text-trading-success font-medium">1.45</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profit Factor</span>
                  <span className="text-trading-info font-medium">2.1</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Win</span>
                  <span className="text-trading-success font-medium">
                    ${winningTrades.length > 0 ? (winningTrades.reduce((sum, trade) => sum + Number(trade.pnl), 0) / winningTrades.length).toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Loss</span>
                  <span className="text-trading-danger font-medium">
                    ${losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + Number(trade.pnl), 0) / losingTrades.length).toFixed(2) : '0.00'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Risk/Reward Ratio</span>
                  <span className="text-trading-warning font-medium">1:1.8</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-300">Gold (XAU/USD)</span>
                  </div>
                  <span className="text-white font-medium">45%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-300">Silver (XAG/USD)</span>
                  </div>
                  <span className="text-white font-medium">25%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">Crude Oil (WTI)</span>
                  </div>
                  <span className="text-white font-medium">20%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-300">Natural Gas</span>
                  </div>
                  <span className="text-white font-medium">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card className="bg-trading-card border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Active Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveTrades />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-trading-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Trading Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {closedTrades.length > 0 ? (
              <div className="space-y-3">
                {closedTrades.slice(0, 5).map((trade) => {
                  const pnl = Number(trade.pnl) || 0;
                  const isProfitable = pnl >= 0;

                  return (
                    <div key={trade.id} className="flex items-center justify-between p-3 bg-trading-dark rounded" data-testid={`recent-trade-${trade.id}`}>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={trade.type === 'LONG' ? 'default' : 'secondary'}
                          className={trade.type === 'LONG' ? 'bg-trading-success' : 'bg-trading-danger'}
                        >
                          {trade.type}
                        </Badge>
                        <span className="text-white font-medium">Trade #{trade.id.substring(0, 8)}</span>
                        <span className="text-gray-400 text-sm">Entry: ${trade.entryPrice}</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${isProfitable ? 'text-trading-success' : 'text-trading-danger'}`}>
                          {isProfitable ? '+' : ''}${pnl.toFixed(2)}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {trade.closedAt ? new Date(trade.closedAt).toLocaleDateString() : 'Active'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No trading activity yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}