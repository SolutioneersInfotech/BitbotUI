import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Chart from "@/components/trading/stratigy-chart";
import { useCommodity } from "@/context/Commoditycontext";
import StrategyList from "@/components/trading/stratigylist";
import { useState } from "react";
import type { TradingStrategy } from "@shared/schema";

export default function StrategiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { selectedCommodity } = useCommodity();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>("");
  const [currentSignal, setCurrentSignal] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]); // ✅ all signals
  const [latestPrice, setLatestPrice] = useState<number>(); // ✅ current price

  // ✅ API Call for strategy data
  const fetchStrategyData = async (commodity: string, strategy: string) => {
    try {
      const token = localStorage.getItem("token");
      const url = `https://predator-production.up.railway.app/api/strategy/${commodity}/${strategy}?interval=1d&limit=500`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ send token here
        },
      });
      const data = await res.json();

      //     if (data.signals && data.signals.length > 0) {
      //       setCurrentSignal(data.signals[data.signals.length - 1]); // last signal
      //     } else {
      //       setCurrentSignal(null);
      //     }
      //   } catch (err) {
      //     console.error("Error fetching strategy data", err);
      //     setCurrentSignal(null);
      //   }
      // }
      if (data.signals && data.signals.length > 0) {
        setSignals(data.signals); // ✅ save full signals
        setCurrentSignal(data.signals[data.signals.length - 1]); // ✅ last signal
      } else {
        setSignals([]);
        setCurrentSignal(null);
      }

      // ✅ save latest market price
      if (data.candles && data.candles.length > 0) {
        setLatestPrice(data.candles[data.candles.length - 1].close);
      }
    } catch (err) {
      console.error("Error fetching strategy data", err);
      setSignals([]);
      setCurrentSignal(null);
      setLatestPrice(undefined);
    }
  };

  const { data: strategies, isLoading } = useQuery<TradingStrategy[]>({
    queryKey: ["/api/strategies"],
  });

  const toggleStrategyMutation = useMutation({
    mutationFn: async ({
      strategyId,
      isActive,
    }: {
      strategyId: string;
      isActive: boolean;
    }) => {
      await apiRequest("PATCH", `/api/strategies/${strategyId}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/strategies"] });
      toast({
        title: "Strategy updated",
        description: "Trading strategy has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update strategy",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-trading-dark text-white">
      {/* Header */}
      <div className="bg-trading-card border-b border-gray-700 p-5">
        {/* top-level flex with two children so justify-between can work */}
        <div className="flex items-center justify-between w-full">
          {/* LEFT: back button + title */}
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
              <BarChart3 className="h-8 w-8 text-trading-success mr-3" />
              Trading Strategies
            </h6>
          </div>

          {/* RIGHT: paragraph pushed to the far right */}
          <p className="text-gray-400 whitespace-nowrap mr-1">
            Configure and manage your automated trading strategies
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Strategy Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Active Strategies</h3>
                <Activity className="h-4 w-4 text-trading-success" />
              </div>
              <div
                className="text-2xl font-bold text-white mb-1"
                data-testid="text-active-strategies"
              >
                {strategies?.filter((s) => s.isActive).length || 0}
              </div>
              <div className="text-trading-success text-sm">
                Currently running
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Strategies</h3>
                <TrendingUp className="h-4 w-4 text-trading-info" />
              </div>
              <div
                className="text-2xl font-bold text-white mb-1"
                data-testid="text-total-strategies"
              >
                {strategies?.length || 0}
              </div>
              <div className="text-trading-info text-sm">
                Available strategies
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Win Rate</h3>
                <Target className="h-4 w-4 text-trading-warning" />
              </div>
              <div
                className="text-2xl font-bold text-white mb-1"
                data-testid="text-strategy-winrate"
              >
                68%
              </div>
              <div className="text-trading-success text-sm">
                <span className="mr-1">↗</span>+2.5% this week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-trading-card border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 text-sm">Total Profit</h3>
                <BarChart3 className="h-4 w-4 text-trading-success" />
              </div>
              <div
                className="text-2xl font-bold text-white mb-1"
                data-testid="text-strategy-profit"
              >
                $2,450
              </div>
              <div className="text-trading-success text-sm">
                <span className="mr-1">↗</span>+12.3% this month
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strategy List */}
          {/* <Card className="bg-trading-card border-gray-700">
            
            <StrategyList
              onSelect={(strategy) => {
                setSelectedStrategy(strategy);
                if (strategy && selectedCommodity) {
                  fetchStrategyData(selectedCommodity, strategy);
                } else {
                  setCurrentSignal(null);
                }
              }}
              currentSignal={currentSignal} // ✅ send to child
            />
          </Card> */}
          <Card className="bg-trading-card border-gray-700">
            <StrategyList
              onSelect={(strategy) => {
                setSelectedStrategy(strategy);
                if (strategy && selectedCommodity) {
                  fetchStrategyData(selectedCommodity, strategy);
                } else {
                  setSignals([]);
                  setCurrentSignal(null);
                  setLatestPrice(undefined);
                }
              }}
              signals={signals} // ✅ pass full signals
              latestPrice={latestPrice} // ✅ pass latest market price
            />
          </Card>

          {/* Right Card - New Card Example */}
          {/* Chart with selected commodity */}
          {/* <Card className="bg-trading-card border-gray-700">
            {selectedCommodity && selectedStrategy ? (
              <Chart symbol={selectedCommodity} strategy={selectedStrategy} />
            ) : (
              <p className="text-gray-400 p-6">Please select a commodity from Dashboard</p>
            )}
          </Card> */}
          <Card className="bg-trading-card border-gray-700">
            {selectedCommodity ? (
              <Chart
                symbol={selectedCommodity}
                strategy={selectedStrategy || null}
              />
            ) : (
              <p className="text-gray-400 p-6">
                Please select a commodity from Dashboard
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
