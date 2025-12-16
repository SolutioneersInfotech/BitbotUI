// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Coins, Gem, Truck, Flame, RefreshCw } from "lucide-react";

// // 🔹 Commodity Icons
// const commodityIcons = {
//   "XAU/USD": Coins,
//   "XAG/USD": Gem,
//   "WTI": Truck,
//   "NG": Flame,
// };

// export function ActiveTrades({ activeTrades, isLoading, refetch }: { activeTrades: any, isLoading: boolean, refetch: any }) {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   // ✅ Hardcoded userId (replace with your actual user ID from DB)
//   const userId = "68ea1582539ded5dbe090fef";


//   // ✅ Close Trade Mutation
//   const closeTradesMutation = useMutation({
//     mutationFn: async (tradeId: string) => {
//       const res = await fetch(
//         `http://localhost:3000/api/trades/${tradeId}/close?userId=${userId}`,
//         {
//           method: "PATCH",
//         }
//       );
//       if (!res.ok) throw new Error("Failed to close trade");
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["/api/trades", userId] });
//       queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
//       toast({
//         title: "Trade closed",
//         description: "Your trade has been successfully closed.",
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Failed to close trade",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });


//   // ✅ Loading State
//   if (isLoading) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-400">Loading trades...</p>
//       </div>
//     );
//   }



//   // ✅ Empty State
//   if (activeTrades.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-400 mb-4">No active trades</p>
//         <Button className="bg-trading-success hover:bg-green-600">
//           Start Trading
//         </Button>
//       </div>
//     );
//   }

//   // ✅ Main Table
//   return (
//     <div className="overflow-x-auto">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-white">Active Trades</h2>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => refetch()}
//           className="flex items-center space-x-2"
//         >
//           <RefreshCw className="h-4 w-4" />
//           <span>Refresh</span>
//         </Button>
//       </div>

//       <table className="w-full">
//         <thead>
//           <tr className="text-gray-400 text-sm border-b border-gray-700">
//             <th className="text-left py-3">Symbol</th>
//             <th className="text-left py-3">Type</th>
//             <th className="text-left py-3">Entry Price</th>
//             <th className="text-left py-3">Current Price</th>
//             <th className="text-left py-3">P&L</th>
//             <th className="text-left py-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="text-white">
//           {activeTrades.map((trade) => {
//             const pnl = Number(trade.pnl) || 0;
//             const isProfitable = pnl >= 0;
//             const Icon =
//               commodityIcons[trade.symbol as keyof typeof commodityIcons] || Coins;

//             return (
//               <tr key={trade.id} className="border-b border-gray-700">
//                 <td className="py-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
//                       <Icon className="h-4 w-4 text-white" />
//                     </div>
//                     <span className="font-medium">{trade.symbol}</span>
//                   </div>
//                 </td>

//                 <td className="py-4">
//                   {(() => {
//                     const isLong = trade.type === "BUY" || trade.type === "LONG";
//                     const label = isLong ? "Long " : "Short";
//                     const icon = isLong ? "▲" : "▼";

//                     return (
//                       <span
//                         title={label}
//                         className={`inline-flex items-center gap-1  py-1 rounded-full text-sm font-medium
//                           ${isLong
//                             ? "bg-gradient-to-r from-trading-success/10 to-transparent text-trading-success "
//                             : "bg-gradient-to-r from-trading-danger/10 to-transparent text-trading-danger "
//                           }`}
//                       >
//                         <span
//                           aria-hidden
//                           className={`flex items-center justify-center w-5 h-5 rounded-full text-xs
//                             ${isLong ? "bg-trading-success/10 text-trading-success" : "bg-trading-danger/10 text-trading-danger"}`}
//                         >
//                           {icon}
//                         </span>
//                         <span className="uppercase tracking-wider">{label}</span>
//                       </span>
//                     );
//                   })()}
//                 </td>

//                 <td className="py-4">${trade.entryPrice}</td>
//                 <td className="py-4">
//                   ${Number(trade.currentPrice) > 1
//                     ? Number(trade.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 4, useGrouping: false })
//                     : trade.currentPrice}
//                 </td>

//                 <td className="py-4">
//                   <span
//                     className={
//                       isProfitable ? "text-trading-success" : "text-trading-danger"
//                     }
//                   >
//                     {isProfitable ? "+" : ""}${pnl.toFixed(2)}
//                   </span>
//                 </td>

//                 <td className="py-4">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-trading-danger hover:underline mr-4"
//                     onClick={() => closeTradesMutation.mutate(trade.id)}
//                     disabled={closeTradesMutation.isPending}
//                   >
//                     {closeTradesMutation.isPending ? "Closing..." : "Close"}
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-trading-info hover:underline"
//                   >
//                     Modify
//                   </Button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Coins, Gem, Truck, Flame, RefreshCw } from "lucide-react";

// 🔹 Commodity Icons
const commodityIcons = {
  "XAU/USD": Coins,
  "XAG/USD": Gem,
  "WTI": Truck,
  "NG": Flame,
};

type ActiveTradesProps = {
  activeTrades: any[];
  isLoading: boolean;
  refetch: () => void;
};

export function ActiveTrades({
  activeTrades,
  isLoading,
  refetch,
}: ActiveTradesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ✅ Close Trade Mutation (JWT based)
  const closeTradesMutation = useMutation({
    mutationFn: async (tradeId: string) => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/trades/${tradeId}/close`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to close trade");
      }
    },

    onSuccess: () => {
      // 🔥 Refetch latest data
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

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading trades...</p>
      </div>
    );
  }

  // ✅ Empty State
  if (activeTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No active trades</p>
        <Button className="bg-trading-success hover:bg-green-600">
          Start Trading
        </Button>
      </div>
    );
  }

  // ✅ Main Table
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Active Trades</h2>

        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

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
            const Icon =
              commodityIcons[
              trade.symbol as keyof typeof commodityIcons
              ] || Coins;

            return (
              <tr key={trade.id} className="border-b border-gray-700">
                {/* Symbol */}
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{trade.symbol}</span>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4">
                  {(() => {
                    const isLong =
                      trade.type === "BUY" || trade.type === "LONG";
                    const label = isLong ? "Long" : "Short";
                    const icon = isLong ? "▲" : "▼";

                    return (
                      <span
                        className={`inline-flex items-center gap-1 py-1 rounded-full text-sm font-medium
                        ${isLong
                            ? "bg-trading-success/10 text-trading-success"
                            : "bg-trading-danger/10 text-trading-danger"
                          }`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">
                          {icon}
                        </span>
                        <span className="uppercase tracking-wider">
                          {label}
                        </span>
                      </span>
                    );
                  })()}
                </td>

                {/* Entry */}
                <td className="py-4">${trade.entryPrice}</td>

                {/* Current */}
                <td className="py-4">
                  $
                  {Number(trade.currentPrice) > 1
                    ? Number(trade.currentPrice).toLocaleString(undefined, {
                      maximumFractionDigits: 4,
                      useGrouping: false,
                    })
                    : trade.currentPrice}
                </td>

                {/* PnL */}
                <td className="py-4">
                  <span
                    className={
                      isProfitable
                        ? "text-trading-success"
                        : "text-trading-danger"
                    }
                  >
                    {isProfitable ? "+" : ""}
                    ${pnl.toFixed(2)}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-trading-danger hover:underline mr-4"
                    onClick={() =>
                      closeTradesMutation.mutate(trade.id)
                    }
                    disabled={closeTradesMutation.isPending}
                  >
                    {closeTradesMutation.isPending
                      ? "Closing..."
                      : "Close"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-trading-info hover:underline"
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
