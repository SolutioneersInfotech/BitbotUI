// import { useState } from "react";
// import { X, Bot, Code, Settings as SettingsIcon, TrendingUp } from "lucide-react";

// interface CreateBotModalProps {
//   onClose: () => void;
//   onSuccess: () => void;
// }

// type Step = "strategy" | "configuration" | "broker";

// export default function CreateBotModal({ onClose, onSuccess }: CreateBotModalProps) {
//   const [step, setStep] = useState<Step>("strategy");
//   const [botName, setBotName] = useState("");
//   const [strategyType, setStrategyType] = useState<"RSI" | "Custom" | "">("");
//   const [timeframe, setTimeframe] = useState("");
//   const [pineScript, setPineScript] = useState("");
//   const [rsiConfig, setRsiConfig] = useState({
//     oversold: "30",
//     overbought: "70",
//     period: "14",
//   });
//   const [brokerConfig, setBrokerConfig] = useState({
//     apiKey: "",
//     apiSecret: "",
//     endpoint: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const timeframes = [
//     { value: "15min", label: "15 Minutes" },
//     { value: "1hour", label: "1 Hour" },
//     { value: "4hour", label: "4 Hours" },
//     { value: "1day", label: "1 Day" },
//     { value: "1week", label: "1 Week" },
//   ];

//   const canProceed = () => {
//     if (step === "strategy") return botName && strategyType && timeframe;
//     if (step === "configuration") return strategyType === "Custom" ? pineScript.trim().length > 0 : true;
//     return true;
//   };

//   const handleCreateBot = async () => {
//     if (!botName || !strategyType || !timeframe) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);

//     const configuration =
//       strategyType === "RSI" ? rsiConfig : strategyType === "Custom" ? { pineScript } : {};

//     try {
//       const res = await fetch("/api/bots", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: botName,
//           strategy_type: strategyType,
//           timeframe,
//           configuration,
//           status: "stopped",
//           broker_config: brokerConfig,
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to create bot");

//       onSuccess(); // close modal and reload list
//     } catch (error: any) {
//       alert("Error creating bot: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
//       <div className="bg-[#12141a] border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-[#12141a] border-b border-gray-800 p-6 flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
//               <Bot className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-white">Create Trading Bot</h2>
//               <p className="text-gray-400 text-sm">
//                 {step === "strategy" && "Choose strategy and timeframe"}
//                 {step === "configuration" && "Configure strategy parameters"}
//                 {step === "broker" && "Connect broker API"}
//               </p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           {/* Step Indicator */}
//           <div className="flex items-center justify-between mb-8">
//             {(["strategy", "configuration", "broker"] as Step[]).map((s, index) => (
//               <div key={s} className="flex items-center flex-1">
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s
//                       ? "bg-emerald-500 text-white"
//                       : index < (["strategy", "configuration", "broker"] as Step[]).indexOf(step)
//                         ? "bg-emerald-500/20 text-emerald-500"
//                         : "bg-gray-800 text-gray-400"
//                     }`}
//                 >
//                   {index + 1}
//                 </div>
//                 {index < 2 && (
//                   <div
//                     className={`flex-1 h-1 mx-2 rounded ${index < (["strategy", "configuration", "broker"] as Step[]).indexOf(step)
//                         ? "bg-emerald-500"
//                         : "bg-gray-800"
//                       }`}
//                   />
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Step Content */}
//           {step === "strategy" && (
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Bot Name *</label>
//                 <input
//                   type="text"
//                   value={botName}
//                   onChange={(e) => setBotName(e.target.value)}
//                   placeholder="My RSI Trading Bot"
//                   className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-3">Strategy Type *</label>
//                 <div className="grid grid-cols-2 gap-4">
//                   <button
//                     onClick={() => setStrategyType("RSI")}
//                     className={`p-4 rounded-lg border-2 transition-all ${strategyType === "RSI"
//                         ? "border-emerald-500 bg-emerald-500/10"
//                         : "border-gray-800 bg-[#1a1c24] hover:border-gray-700"
//                       }`}
//                   >
//                     <TrendingUp
//                       className={`w-8 h-8 mx-auto mb-2 ${strategyType === "RSI" ? "text-emerald-500" : "text-gray-400"
//                         }`}
//                     />
//                     <div className="text-white font-medium">RSI Strategy</div>
//                   </button>

//                   <button
//                     onClick={() => setStrategyType("Custom")}
//                     className={`p-4 rounded-lg border-2 transition-all ${strategyType === "Custom"
//                         ? "border-emerald-500 bg-emerald-500/10"
//                         : "border-gray-800 bg-[#1a1c24] hover:border-gray-700"
//                       }`}
//                   >
//                     <Code
//                       className={`w-8 h-8 mx-auto mb-2 ${strategyType === "Custom" ? "text-emerald-500" : "text-gray-400"
//                         }`}
//                     />
//                     <div className="text-white font-medium">Custom Strategy</div>
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-3">Timeframe *</label>
//                 <div className="grid grid-cols-5 gap-2">
//                   {timeframes.map((tf) => (
//                     <button
//                       key={tf.value}
//                       onClick={() => setTimeframe(tf.value)}
//                       className={`px-4 py-3 rounded-lg border font-medium transition-all ${timeframe === tf.value
//                           ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
//                           : "border-gray-800 bg-[#1a1c24] text-gray-400 hover:border-gray-700"
//                         }`}
//                     >
//                       {tf.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {step === "configuration" && strategyType === "Custom" && (
//             <div className="space-y-6">
//               <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
//                 <div className="flex items-start space-x-3">
//                   <Code className="w-5 h-5 text-purple-500 mt-0.5" />
//                   <div>
//                     <h4 className="text-white font-medium mb-1">Pine Script Editor</h4>
//                     <p className="text-sm text-gray-400">Enter your custom Pine Script strategy code</p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Pine Script Code *</label>
//                 <textarea
//                   value={pineScript}
//                   onChange={(e) => setPineScript(e.target.value)}
//                   placeholder="// Your Pine Script code here"
//                   rows={12}
//                   className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
//                 />
//               </div>
//             </div>
//           )}

//           {step === "broker" && (
//             <div className="space-y-6">
//               <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
//                 <div className="flex items-start space-x-3">
//                   <SettingsIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
//                   <div>
//                     <h4 className="text-white font-medium mb-1">Broker API Configuration</h4>
//                     <p className="text-sm text-gray-400">
//                       Connect your broker account to execute trades automatically
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
//                 <input
//                   type="text"
//                   value={brokerConfig.apiKey}
//                   onChange={(e) => setBrokerConfig({ ...brokerConfig, apiKey: e.target.value })}
//                   placeholder="Enter your broker API key"
//                   className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">API Secret</label>
//                 <input
//                   type="password"
//                   value={brokerConfig.apiSecret}
//                   onChange={(e) => setBrokerConfig({ ...brokerConfig, apiSecret: e.target.value })}
//                   placeholder="Enter your broker API secret"
//                   className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">API Endpoint</label>
//                 <input
//                   type="url"
//                   value={brokerConfig.endpoint}
//                   onChange={(e) => setBrokerConfig({ ...brokerConfig, endpoint: e.target.value })}
//                   placeholder="https://api.broker.com/v1"
//                   className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-[#12141a] border-t border-gray-800 p-6 flex items-center justify-between">
//           <div>
//             {step !== "strategy" && (
//               <button
//                 onClick={() => {
//                   if (step === "configuration") setStep("strategy");
//                   if (step === "broker") setStep("configuration");
//                 }}
//                 className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={onClose}
//               className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
//             >
//               Cancel
//             </button>

//             {step === "broker" ? (
//               <button
//                 onClick={handleCreateBot}
//                 disabled={loading}
//                 className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Creating..." : "Create Bot"}
//               </button>
//             ) : (
//               <button
//                 onClick={() => {
//                   if (step === "strategy") setStep("configuration");
//                   if (step === "configuration") setStep("broker");
//                 }}
//                 disabled={!canProceed()}
//                 className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import { X, Bot, Code, Settings as SettingsIcon, TrendingUp } from "lucide-react";

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
  });
  const [brokerConfig, setBrokerConfig] = useState({
    apiKey: "",
    apiSecret: "",
    endpoint: "",
  });
  const [loading, setLoading] = useState(false);

  const timeframes = [
    { value: "15m", label: "15 Minutes" },
    { value: "1h", label: "1 Hour" },
    { value: "4h", label: "4 Hours" },
    { value: "1d", label: "1 Day" },
    { value: "1w", label: "1 Week" },
  ];

  const canProceed = () => {
    if (step === "strategy") return botName && strategyType && timeframe;
    if (step === "configuration") {
      if (strategyType === "Custom") return pineScript.trim().length > 0;
      if (strategyType === "RSI") return rsiConfig.period && rsiConfig.oversold && rsiConfig.overbought;
    }
    return true;
  };

  const handleCreateBot = async () => {
    if (!botName || !strategyType || !timeframe) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    const configuration =
      strategyType === "RSI" ? rsiConfig : strategyType === "Custom" ? { pineScript } : {};

    try {
      const res = await fetch("http://localhost:3000/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: botName,
          strategy_type: strategyType,
          timeframe,
          configuration,
          status: "stopped",
          broker_config: brokerConfig,
        }),
      });

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
                {step === "broker" && "Connect broker API"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {(["strategy", "configuration", "broker"] as Step[]).map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step === s
                    ? "bg-emerald-500 text-white"
                    : index < (["strategy", "configuration", "broker"] as Step[]).indexOf(step)
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-gray-800 text-gray-400"
                    }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${index < (["strategy", "configuration", "broker"] as Step[]).indexOf(step)
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
              {/* Bot Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bot Name *</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="My RSI Trading Bot"
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Strategy Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Strategy Type *</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setStrategyType("RSI")}
                    className={`p-4 rounded-lg border-2 transition-all ${strategyType === "RSI"
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-800 bg-[#1a1c24] hover:border-gray-700"
                      }`}
                  >
                    <TrendingUp
                      className={`w-8 h-8 mx-auto mb-2 ${strategyType === "RSI" ? "text-emerald-500" : "text-gray-400"
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
                      className={`w-8 h-8 mx-auto mb-2 ${strategyType === "Custom" ? "text-emerald-500" : "text-gray-400"
                        }`}
                    />
                    <div className="text-white font-medium">Custom Strategy</div>
                  </button>
                </div>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">Timeframe *</label>
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

          {/* Step 2: Configuration (RSI) */}
          {step === "configuration" && strategyType === "RSI" && (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">RSI Settings</h4>
                    <p className="text-sm text-gray-400">
                      Configure RSI parameters for your trading bot
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Oversold</label>
                  <input
                    type="number"
                    value={rsiConfig.oversold}
                    onChange={(e) => setRsiConfig({ ...rsiConfig, oversold: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Overbought</label>
                  <input
                    type="number"
                    value={rsiConfig.overbought}
                    onChange={(e) => setRsiConfig({ ...rsiConfig, overbought: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Period</label>
                  <input
                    type="number"
                    value={rsiConfig.period}
                    onChange={(e) => setRsiConfig({ ...rsiConfig, period: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1c24] border border-gray-800 rounded-lg text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuration (Custom Pine Script) */}
          {step === "configuration" && strategyType === "Custom" && (
            <div className="space-y-6">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Code className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Pine Script Editor</h4>
                    <p className="text-sm text-gray-400">Enter your custom Pine Script strategy code</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Pine Script Code *</label>
                <textarea
                  value={pineScript}
                  onChange={(e) => setPineScript(e.target.value)}
                  placeholder="// Your Pine Script code here"
                  rows={12}
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Broker */}
          {step === "broker" && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <SettingsIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Broker API Configuration</h4>
                    <p className="text-sm text-gray-400">
                      Connect your broker account to execute trades automatically
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">API Key</label>
                <input
                  type="text"
                  value={brokerConfig.apiKey}
                  onChange={(e) => setBrokerConfig({ ...brokerConfig, apiKey: e.target.value })}
                  placeholder="Enter your broker API key"
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">API Secret</label>
                <input
                  type="password"
                  value={brokerConfig.apiSecret}
                  onChange={(e) => setBrokerConfig({ ...brokerConfig, apiSecret: e.target.value })}
                  placeholder="Enter your broker API secret"
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">API Endpoint</label>
                <input
                  type="url"
                  value={brokerConfig.endpoint}
                  onChange={(e) => setBrokerConfig({ ...brokerConfig, endpoint: e.target.value })}
                  placeholder="https://api.broker.com/v1"
                  className="w-full px-4 py-3 bg-[#1a1c24] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#12141a] border-t border-gray-800 p-6 flex items-center justify-between">
          <div>
            {step !== "strategy" && (
              <button
                onClick={() => {
                  if (step === "configuration") setStep("strategy");
                  if (step === "broker") setStep("configuration");
                }}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            {step === "broker" ? (
              <button
                onClick={handleCreateBot}
                disabled={loading}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Bot"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (step === "strategy") setStep("configuration");
                  if (step === "configuration") setStep("broker");
                }}
                disabled={!canProceed()}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
