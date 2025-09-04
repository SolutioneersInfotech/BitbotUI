import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Coins, Gem, Truck, Flame } from "lucide-react";
import type { Trade } from "@shared/schema";

const commodityIcons = {
  "XAU/USD": Coins,
  "XAG/USD": Gem,
  "WTI": Truck,
  "NG": Flame,
};

export function ActiveTrades() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: trades, isLoading } = useQuery<Trade[]>({
    queryKey: ["/api/trades"],
  });

  const closeTradesMutation = useMutation({
    mutationFn: async (tradeId: string) => {
      await apiRequest("PATCH", `/api/trades/${tradeId}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trades"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Trade closed",
        description: "Your trade has been successfully closed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to close trade",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading trades...</p>
      </div>
    );
  }

  const activeTrades = trades?.filter(trade => trade.status === 'active') || [];

  if (activeTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No active trades</p>
        <Button className="bg-trading-success hover:bg-green-600" data-testid="button-start-trading">
          Start Trading
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-700">
            <th className="text-left py-3">Symbol</th>
            <th className="text-left py-3">Type</th>
            <th className="text-left py-3">Entry Price</th>
            <th className="text-left py-3">Current Price</th>
            <th className="text-left py-3">P&L</th>
            <th className="text-left py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {activeTrades.map((trade) => {
            const pnl = Number(trade.pnl) || 0;
            const isProfitable = pnl >= 0;
            
            return (
              <tr key={trade.id} className="border-b border-gray-700" data-testid={`trade-row-${trade.id}`}>
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Coins className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">Trading Asset</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    trade.type === 'LONG' 
                      ? 'bg-trading-success bg-opacity-20 text-trading-success'
                      : 'bg-trading-danger bg-opacity-20 text-trading-danger'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="py-4" data-testid={`trade-entry-price-${trade.id}`}>
                  ${trade.entryPrice}
                </td>
                <td className="py-4" data-testid={`trade-current-price-${trade.id}`}>
                  ${trade.currentPrice || trade.entryPrice}
                </td>
                <td className="py-4">
                  <span className={isProfitable ? 'text-trading-success' : 'text-trading-danger'} data-testid={`trade-pnl-${trade.id}`}>
                    {isProfitable ? '+' : ''}${pnl.toFixed(2)}
                  </span>
                </td>
                <td className="py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-trading-danger hover:underline mr-4"
                    onClick={() => closeTradesMutation.mutate(trade.id)}
                    disabled={closeTradesMutation.isPending}
                    data-testid={`button-close-trade-${trade.id}`}
                  >
                    {closeTradesMutation.isPending ? "Closing..." : "Close"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-trading-info hover:underline"
                    data-testid={`button-modify-trade-${trade.id}`}
                  >
                    Modify
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
