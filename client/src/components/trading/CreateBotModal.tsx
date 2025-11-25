
import { useState, useEffect } from "react";
import { X, Bot, Code, TrendingUp } from "lucide-react";

interface CreateBotModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "strategy" | "configuration" | "broker";

export default function CreateBotModal({ onClose, onSuccess }: CreateBotModalProps) {
  const [step, setStep] = useState<Step>("strategy");
  const [botName, setBotName] = useState("");
  const [strategyType, setStrategyType] = useState<"RSI" | "Custom" | "">("");
  const [timeframe, setTimeframe] = useState("");
  const [pineScript, setPineScript] = useState("");
  const [rsiConfig, setRsiConfig] = useState({
    oversold: "30",
    overbought: "70",
    period: "14",
    quantity: "0.01", // 🔹 Default quantity
  });

  const [brokerAccounts, setBrokerAccounts] = useState<any[]>([]);
  const [selectedBrokerId, setSelectedBrokerId] = useState("");
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [loading, setLoading] = useState(false);

  const timeframes = [
    { value: "15m", label: "15 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" },
  ];

  // 🔹 Multi-exchange symbol map
  const symbolMap: Record<string, string[]> = {
    binance: [
      "BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT",
      "ADA/USDT", "DOGE/USDT", "BNB/USDT", "MATIC/USDT",
      "DOT/USDT", "LTC/USDT"
    ],
    delta: [
      "BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT",
      "ADA/USDT", "DOGE/USDT", "BNB/USDT", "MATIC/USDT",
      "DOT/USDT", "LTC/USDT"
    ]
  };

  // 🔹 Fetch connected brokers from backend
  useEffect(() => {
    async function fetchBrokers() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://predator-production.up.railway.app/api/exchange/list", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch brokers");
        const data = await res.json();
        setBrokerAccounts(data);
      } catch (err) {
        console.error("Error fetching brokers", err);
      }
    }
    fetchBrokers();
  }, []);

  const canProceed = () => {
    if (step === "strategy") return botName && strategyType && timeframe;
    if (step === "configuration") {
      if (strategyType === "Custom") return pineScript.trim().length > 0;
      if (strategyType === "RSI")
        return (
          rsiConfig.period &&
          rsiConfig.oversold &&
          rsiConfig.overbought &&
          rsiConfig.quantity
        );
    }
    if (step === "broker") return selectedBrokerId && symbol;
    return true;
  };

  const handleCreateBot = async () => {
    if (!botName || !strategyType || !timeframe || !selectedBrokerId || !symbol) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const configuration =
      strategyType === "RSI"
        ? rsiConfig
        : strategyType === "Custom"
          ? { pineScript }
          : {};

    try {
      const res = await fetch("https://predator-production.up.railway.app/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: botName,
          strategy_type: strategyType,
          timeframe,
          configuration,
          brokerId: selectedBrokerId,
          symbol,
        }),
      });
      console.log(botName, strategyType, timeframe, configuration, selectedBrokerId, symbol);

      if (!res.ok) throw new Error("Failed to create bot");
      onSuccess();
    } catch (error: any) {
      alert("Error creating bot: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#12141a] border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#12141a] border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Trading Bot</h2>
              <p className="text-gray-400 text-sm">
                {step === "strategy" && "Choose strategy and timeframe"}
                {step === "configuration" && "Configure strategy parameters"}
                {step === "broker" && "Select a connected broker and symbol"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-8">
            {(["strategy", "configuration", "broker"] as Step[]).map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s
                    ? "bg-emerald-500 text-white"
                    : index <
                      (["strategy", "configuration", "broker"] as Step[]).indexOf(
                        step
                      )
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-gray-800 text-gray-400"
                    }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${index <
                      (["strategy", "configuration", "broker"] as Step[]).indexOf(step)
                      ? "bg-emerald-500"
                      : "bg-gray-800"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Strategy */}
          {step === "strategy" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bot Name *
                </label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="My RSI Bot"
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Strategy Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStrategyType("RSI")}
                    className={`p-4 rounded-lg border-2 transition-all ${strategyType === "RSI"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-800 bg-[#1a1c24] hover:border-gray-700"
                      }`}
                  >
                    <TrendingUp
                      className={`w-8 h-8 mx-auto mb-2 ${strategyType === "RSI"
                        ? "text-emerald-500"
                        : "text-gray-400"
                        }`}
                    />
                    <div className="text-white font-medium">RSI Strategy</div>
                  </button>

                  <button
                    onClick={() => setStrategyType("Custom")}
                    className={`p-4 rounded-lg border-2 transition-all ${strategyType === "Custom"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-800 bg-[#1a1c24] hover:border-gray-700"
                      }`}
                  >
                    <Code
                      className={`w-8 h-8 mx-auto mb-2 ${strategyType === "Custom"
                        ? "text-emerald-500"
                        : "text-gray-400"
                        }`}
                    />
                    <div className="text-white font-medium">Custom Strategy</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Timeframe *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf.value}
                      onClick={() => setTimeframe(tf.value)}
                      className={`px-4 py-3 rounded-lg border font-medium transition-all ${timeframe === tf.value
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                        : "border-gray-800 bg-[#1a1c24] text-gray-400 hover:border-gray-700"
                        }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === "configuration" && strategyType === "RSI" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Oversold
                  </label>
                  <input
                    type="number"
                    value={rsiConfig.oversold}
                    onChange={(e) =>
                      setRsiConfig({ ...rsiConfig, oversold: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Overbought
                  </label>
                  <input
                    type="number"
                    value={rsiConfig.overbought}
                    onChange={(e) =>
                      setRsiConfig({ ...rsiConfig, overbought: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Period
                  </label>
                  <input
                    type="number"
                    value={rsiConfig.period}
                    onChange={(e) =>
                      setRsiConfig({ ...rsiConfig, period: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={rsiConfig.quantity}
                    onChange={(e) =>
                      setRsiConfig({ ...rsiConfig, quantity: e.target.value })
                    }
                    placeholder="0.01"
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2b: Custom Strategy */}
          {step === "configuration" && strategyType === "Custom" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Pine Script Code *
                </label>
                <textarea
                  value={pineScript}
                  onChange={(e) => setPineScript(e.target.value)}
                  placeholder="// Your Pine Script code here"
                  rows={10}
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white font-mono focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Broker + Symbol */}
          {step === "broker" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Select Connected Broker *
                </label>
                <select
                  value={selectedBrokerId}
                  onChange={(e) => setSelectedBrokerId(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 mb-4"
                >
                  <option value="">-- Choose Broker --</option>
                  {brokerAccounts.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.exchange} — {b.userAlias || b._id.slice(-5)}
                    </option>
                  ))}
                </select>

                {selectedBrokerId && (() => {
                  const selectedBroker = brokerAccounts.find(b => b._id === selectedBrokerId);
                  const exchange = selectedBroker?.exchange.toLowerCase() || "binance";
                  const availableSymbols = symbolMap[exchange] || [];

                  return (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Select Symbol *
                      </label>
                      <select
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        {availableSymbols.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#12141a] border-t border-gray-800 p-6 flex items-center justify-between">
          {step !== "strategy" && (
            <button
              onClick={() => {
                if (step === "configuration") setStep("strategy");
                else if (step === "broker") setStep("configuration");
              }}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Back
            </button>
          )}

          {step === "broker" ? (
            <button
              onClick={handleCreateBot}
              disabled={loading || !selectedBrokerId || !symbol}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Bot"}
            </button>
          ) : (
            <button
              onClick={() => {
                if (step === "strategy") setStep("configuration");
                else if (step === "configuration") setStep("broker");
              }}
              disabled={!canProceed()}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
