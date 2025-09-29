// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Coins, Gem, Truck, Flame, Plus, History } from "lucide-react";
// import type { Commodity, TradingStrategy } from "@shared/schema";

// const commodityIcons = {
//   "XAU/USD": Coins,
//   "XAG/USD": Gem,
//   "WTI": Truck,
//   "NG": Flame,
// };

// export function TradingSidebar() {
//   const { data: strategies } = useQuery<TradingStrategy[]>({
//     queryKey: ["/api/strategies"],
//   });

//   const { data: commodities, isLoading, error } = useQuery<Commodity[]>({
//     queryKey: ["commodities"],
//     queryFn: async () => {
//       const res = await fetch("http://localhost:3000/api/commodities");
//       if (!res.ok) {
//         throw new Error("Failed to fetch commodities");
//       }
//       return res.json();
//     },
//   });

//   return (
//     <aside className="w-64 bg-trading-card min-h-screen p-6">
//       <div className="space-y-6">
//         {/* Strategy Selection */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">Trading Strategies</h3>
//           <div className="space-y-2">
//             {strategies?.length ? (
//               strategies.map((strategy) => (
//                 <div
//                   key={strategy.id}
//                   className={`bg-trading-dark rounded-lg p-3 ${strategy.isActive
//                     ? 'border-l-4 border-trading-success'
//                     : 'cursor-pointer hover:border-l-4 hover:border-trading-info transition-all'
//                     }`}
//                   data-testid={`strategy-${strategy.name.toLowerCase().replace(' ', '-')}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className={strategy.isActive ? "text-white font-medium" : "text-gray-300"}>
//                       {strategy.name}
//                     </span>
//                     {strategy.isActive && (
//                       <span className="text-trading-success text-xs">ACTIVE</span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-400 text-sm">No strategies available</div>
//             )}
//           </div>
//         </div>

//         {/* Commodities Selector */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">Commodities</h3>

//           {/* scrollable container (both directions) */}
//           <div className="max-h-64 overflow-auto pr-2">
//             <div className="space-y-2 min-w-max">
//               {isLoading && <div className="text-gray-400 text-sm">Loading...</div>}
//               {error && <div className="text-red-400 text-sm">Failed to fetch commodities</div>}
//               {commodities?.length ? (
//                 commodities.map((commodity, index) => {
//                   const IconComponent =
//                     commodityIcons[commodity.symbol as keyof typeof commodityIcons] || Coins;

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-trading-dark rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors min-w-[300px] whitespace-nowrap"
//                     >
//                       {/* Left side */}
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
//                           <IconComponent className="h-4 w-4 text-white" />
//                         </div>
//                         <div>
//                           <div className="text-white font-medium">{commodity.name}</div>
//                           <div className="text-gray-400 text-xs">{commodity.symbol}</div>
//                         </div>
//                       </div>

//                       {/* Right side */}
//                       <div className="text-right flex-shrink-0">
//                         <div className="font-medium text-white">
//                           {commodity.price ? `$${commodity.price.toLocaleString()}` : "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 !isLoading && <div className="text-gray-400 text-sm">No commodities data available</div>
//               )}
//             </div>
//           </div>
//         </div>





//         {/* Quick Actions */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
//           <div className="space-y-2">
//             <Button className="w-full bg-trading-success hover:bg-green-600 text-white" data-testid="button-new-trade">
//               <Plus className="h-4 w-4 mr-2" />
//               New Trade
//             </Button>
//             <Button
//               variant="outline"
//               className="w-full bg-trading-dark hover:bg-gray-600 text-white border-gray-600"
//               data-testid="button-trade-history"
//             >
//               <History className="h-4 w-4 mr-2" />
//               Trade History
//             </Button>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }




// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Coins, Gem, Truck, Flame, Plus, History } from "lucide-react";
// import type { Commodity, TradingStrategy } from "@shared/schema";

// const commodityIcons = {
//   "XAU/USD": Coins,
//   "XAG/USD": Gem,
//   "WTI": Truck,
//   "NG": Flame,
// };

// interface TradingSidebarProps {
//   selectedCommodity: string | null;
//   onSelectCommodity: (symbol: string) => void;
// }

// export function TradingSidebar({
//   selectedCommodity,
//   onSelectCommodity,
// }: TradingSidebarProps) {
//   const { data: strategies } = useQuery<TradingStrategy[]>({
//     queryKey: ["/api/strategies"],
//   });

//   const { data: commodities, isLoading, error } = useQuery<Commodity[]>({
//     queryKey: ["commodities"],
//     queryFn: async () => {
//       const res = await fetch("http://localhost:3000/api/commodities");
//       if (!res.ok) {
//         throw new Error("Failed to fetch commodities");
//       }
//       return res.json();
//     },
//   });

//   return (
//     <aside className="w-64 bg-trading-card min-h-screen p-6">
//       <div className="space-y-6">
//         {/* Strategy Selection */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Trading Strategies
//           </h3>
//           <div className="space-y-2">
//             {strategies?.length ? (
//               strategies.map((strategy) => (
//                 <div
//                   key={strategy.id}
//                   className={`bg-trading-dark rounded-lg p-3 ${strategy.isActive
//                       ? "border-l-4 border-trading-success"
//                       : "cursor-pointer hover:border-l-4 hover:border-trading-info transition-all"
//                     }`}
//                   data-testid={`strategy-${strategy.name
//                     .toLowerCase()
//                     .replace(" ", "-")}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span
//                       className={
//                         strategy.isActive
//                           ? "text-white font-medium"
//                           : "text-gray-300"
//                       }
//                     >
//                       {strategy.name}
//                     </span>
//                     {strategy.isActive && (
//                       <span className="text-trading-success text-xs">
//                         ACTIVE
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-400 text-sm">
//                 No strategies available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Commodities Selector */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">Commodities</h3>

//           {/* scrollable container */}
//           <div className="max-h-64 overflow-auto pr-2">
//             <div className="space-y-2 min-w-max">
//               {isLoading && (
//                 <div className="text-gray-400 text-sm">Loading...</div>
//               )}
//               {error && (
//                 <div className="text-red-400 text-sm">
//                   Failed to fetch commodities
//                 </div>
//               )}
//               {commodities?.length ? (
//                 commodities.map((commodity, index) => {
//                   const IconComponent =
//                     commodityIcons[
//                     commodity.symbol as keyof typeof commodityIcons
//                     ] || Coins;

//                   const isSelected = selectedCommodity === commodity.symbol;

//                   return (
//                     <div
//                       key={index}
//                       onClick={() => onSelectCommodity(commodity.symbol)} // ✅ trigger parent callback
//                       className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors min-w-[300px] whitespace-nowrap
//                         ${isSelected
//                           ? "bg-trading-success border-l-4 border-green-500"
//                           : "bg-trading-dark hover:bg-gray-700"
//                         }`}
//                     >
//                       {/* Left side */}
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
//                           <IconComponent className="h-4 w-4 text-white" />
//                         </div>
//                         <div>
//                           <div className="text-white font-medium">
//                             {commodity.name}
//                           </div>
//                           <div className="text-gray-400 text-xs">
//                             {commodity.symbol}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right side */}
//                       <div className="text-right flex-shrink-0">
//                         <div className="font-medium text-white">
//                           {commodity.price
//                             ? `$${commodity.price.toLocaleString()}`
//                             : "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 !isLoading && (
//                   <div className="text-gray-400 text-sm">
//                     No commodities data available
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div>
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Quick Actions
//           </h3>
//           <div className="space-y-2">
//             <Button
//               className="w-full bg-trading-success hover:bg-green-600 text-white"
//               data-testid="button-new-trade"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               New Trade
//             </Button>
//             <Button
//               variant="outline"
//               className="w-full bg-trading-dark hover:bg-gray-600 text-white border-gray-600"
//               data-testid="button-trade-history"
//             >
//               <History className="h-4 w-4 mr-2" />
//               Trade History
//             </Button>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }



import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coins, Gem, Truck, Flame, Plus, History } from "lucide-react";
import type { Commodity, TradingStrategy } from "@shared/schema";
import { useCommodity } from "@/context/Commoditycontext";

const commodityIcons = {
  "XAU/USD": Coins,
  "XAG/USD": Gem,
  "WTI": Truck,
  "NG": Flame,
};

// ✅ helper: Yahoo → Engine symbol
const toEngineSymbol = (symbol: string) => {
  const table: Record<string, string> = {
    "BTC-USD": "BTCUSDT",
    "ETH-USD": "ETHUSDT",
    "SOL-USD": "SOLUSDT",
    "XRP-USD": "XRPUSDT",
    "ADA-USD": "ADAUSDT",
    "DOGE-USD": "DOGEUSDT",
    "BNB-USD": "BNBUSDT",
    "MATIC-USD": "MATICUSDT",
    "DOT-USD": "DOTUSDT",
    "LTC-USD": "LTCUSDT",
  };
  if (table[symbol]) return table[symbol];
  return symbol.replace(/-/g, "").replace("USD", "USDT");
};

export function TradingSidebar() {
  // 👇 global state use kar rahe hain
  const { selectedCommodity, setSelectedCommodity } = useCommodity();

  const { data: strategies } = useQuery<TradingStrategy[]>({
    queryKey: ["/api/strategies"],
  });

  const { data: commodities, isLoading, error } = useQuery<Commodity[]>({
    queryKey: ["commodities"],
    queryFn: async () => {
      const token = localStorage.getItem("token"); // token stored after login

      const res = await fetch("https://predator-production.up.railway.app/api/commodities", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ must include
        },
      });
      if (!res.ok) throw new Error("Failed to fetch commodities");
      return res.json();
    },
  });

  return (
    <aside className="w-64 bg-trading-card min-h-screen p-6">
      <div className="space-y-6">
        {/* Strategies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Trading Strategies
          </h3>
          <div className="space-y-2">
            {strategies?.length ? (
              strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className={`bg-trading-dark rounded-lg p-3 ${strategy.isActive
                    ? "border-l-4 border-trading-success"
                    : "cursor-pointer hover:border-l-4 hover:border-trading-info transition-all"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        strategy.isActive
                          ? "text-white font-medium"
                          : "text-gray-300"
                      }
                    >
                      {strategy.name}
                    </span>
                    {strategy.isActive && (
                      <span className="text-trading-success text-xs">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">
                No strategies available
              </div>
            )}
          </div>
        </div>

        {/* Commodities */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Commodities</h3>
          <div className="max-h-64 overflow-auto pr-2">
            <div className="space-y-2 min-w-max">
              {isLoading && (
                <div className="text-gray-400 text-sm">Loading...</div>
              )}
              {error && (
                <div className="text-red-400 text-sm">
                  Failed to fetch commodities
                </div>
              )}
              {commodities?.length ? (
                commodities.map((commodity, index) => {
                  const IconComponent =
                    commodityIcons[
                    commodity.symbol as keyof typeof commodityIcons
                    ] || Coins;

                  const engine = toEngineSymbol(commodity.symbol);
                  const isSelected = selectedCommodity === engine;

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedCommodity(engine)} // 👈 context update
                      className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors min-w-[300px] whitespace-nowrap
                        ${isSelected
                          ? "bg-trading-success border-l-4 border-green-500"
                          : "bg-trading-dark hover:bg-gray-700"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {commodity.name}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {commodity.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-medium text-white">
                          {commodity.price
                            ? `$${commodity.price.toLocaleString()}`
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                !isLoading && (
                  <div className="text-gray-400 text-sm">
                    No commodities data available
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button className="w-full bg-trading-success hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Trade
            </Button>
            <Button
              variant="outline"
              className="w-full bg-trading-dark hover:bg-gray-600 text-white border-gray-600"
            >
              <History className="h-4 w-4 mr-2" />
              Trade History
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

