
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coins, Gem, Truck, Flame, Plus, History } from "lucide-react";
import type { Commodity, TradingStrategy } from "@shared/schema";
import { useCommodity } from "@/context/Commoditycontext";
import TradeForm from "./New-Trade "; // 👈 ADD THIS IMPORT

const commodityIcons = {
  "XAU/USD": Coins,
  "XAG/USD": Gem,
  "WTI": Truck,
  "NG": Flame,
};

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
  return table[symbol] || symbol.replace(/-/g, "").replace("USD", "USDT");
};

export function TradingSidebar() {
  const { selectedCommodity, setSelectedCommodity } = useCommodity();

  const [showTradeForm, setShowTradeForm] = useState(false);

  const { data: strategies } = useQuery<TradingStrategy[]>({
    queryKey: ["/api/strategies"],
  });

  const {
    data: commodities,
    isLoading,
    error,
  } = useQuery<Commodity[]>({
    queryKey: ["commodities"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://predator-production.up.railway.app/api/commodities",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch commodities");
      return res.json();
    },
  });

  const handleTradeSubmit = async (data: any) => {
    console.log("Submitted trade:", data);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...data,
        exchange: "delta",   // 🔥 REQUIRED FIELD
        type: data.price ? "LIMIT" : "MARKET", // optional but useful
      };

      const res = await fetch("https://predator-production.up.railway.app/api/trade/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Backend response:", result);

      if (res.ok) {
        alert("Trade Executed Successfully");
        setShowTradeForm(false);
      } else {
        alert(result.error || "Trade failed");
      }

    } catch (error) {
      alert("Failed to execute trade");
      console.error(error);
    }
  };


  return (
    <>
      {/* FULL SCREEN MODAL */}
      {showTradeForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="bg-trading-card w-[650px] rounded-xl p-6 border border-gray-700 relative shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setShowTradeForm(false)}
              className="absolute right-4 top-4 text-gray-300 hover:text-white text-xl"
            >
              ✕
            </button>

            {/* Render your form */}
            <TradeForm
              onSubmit={handleTradeSubmit}
            />
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-trading-card min-h-screen p-6">
        <div className="space-y-6">

          {/* Commodities */}
        <div className="-mr-1">
          <h3 className="text-lg font-semibold text-white mb-4">Commodities</h3>
          <div className="h-80 overflow-auto">
            <div className="space-y-1 min-w-max">
              {isLoading && (
                <div className="text-gray-400 text-sm">Loading...</div>
              )}
              {error && (
                <div className="text-red-400 text-sm">
                  Failed to fetch commodities
                </div>
              )}
              {commodities?.length
                ? commodities.map((commodity, index) => {
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
                        className={`flex items-center justify-between rounded-md p-3 h-9 cursor-pointer transition-colors min-w-[100px] whitespace-nowrap
                        ${
                          isSelected
                            ? "bg-trading-success border-l-4 border-green-500"
                            : "bg-trading-dark hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-2 w-2 text-white" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">
                              {commodity.name}
                            </div>
                            {/* <div className="text-gray-400 text-xs">
                            {commodity.symbol}
                          </div> */}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-white">
                            {Number.isFinite(Number(commodity.price))
                              ? `$${Math.round(
                                  Number(commodity.price)
                                ).toLocaleString()}`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                : !isLoading && (
                    <div className="text-gray-400 text-sm">
                      No commodities data available
                    </div>
                  )}
            </div>
          </div>
        </div>


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
                  className={`bg-trading-dark rounded-lg p-3 ${
                    strategy.isActive
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

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                className="w-full bg-trading-success hover:bg-green-600 text-white"
                onClick={() => setShowTradeForm(true)}
              >
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
    </>
  );
}
