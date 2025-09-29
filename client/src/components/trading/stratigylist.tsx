

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface Signal {
    type: "BUY" | "SELL";
    price: number;
    reason?: string;
    entryRange?: [number, number];   // 👈 नया जोड़ा
    suggestedSL?: number[];          // 👈 SL multiple हो सकता है
    suggestedTP?: number;            // 👈 TP
}

interface StrategyListProps {
    onSelect?: (strategy: string | null) => void;
    signals?: Signal[];
    latestPrice?: number;
}

export default function StrategyList({ onSelect, signals = [], latestPrice }: StrategyListProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const strategies = [
        { label: "SMA Crossover", value: "ma-crossover" },
        { label: "RSI + MACD", value: "rsi" },
        { label: "Breakout", value: "breakout" },
        { label: "Mean Reversion", value: "mean-reversion" },
        { label: "Scalping", value: "scalping" },
    ];

    const handleSelect = (value: string) => {
        const newValue = selected === value ? null : value;
        setSelected(newValue);
        if (onSelect) onSelect(newValue);
    };

    // ✅ last signal nikaalna
    const lastSignal = signals.length > 0 ? signals[signals.length - 1] : null;
    let displaySignal: Signal | null = null;

    if (lastSignal && latestPrice !== undefined) {
        if (
            (lastSignal.type === "BUY" && latestPrice <= lastSignal.price) ||
            (lastSignal.type === "SELL" && latestPrice >= lastSignal.price)
        ) {
            // 👉 abhi current signal active hai
            displaySignal = lastSignal;
        } else {
            // 👉 price entry se nikal gaya → last signal dikhana hai
            displaySignal = { ...lastSignal, reason: `(Last Signal)` };
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Available Strategies</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {strategies.map((s) => (
                    <Card
                        key={s.value}
                        onClick={() => handleSelect(s.value)}
                        className={`relative cursor-pointer p-4 rounded-xl border transition
              ${selected === s.value
                                ? "border-trading-success bg-trading-dark ring-2 ring-trading-success/50"
                                : "border-gray-700 bg-trading-card hover:border-trading-success hover:bg-trading-dark/40"
                            }`}
                    >
                        <p className="text-white font-medium">{s.label}</p>
                        {selected === s.value && (
                            <CheckCircle2 className="absolute top-3 right-3 text-trading-success" size={20} />
                        )}
                    </Card>
                ))}
            </div>

            {/* ✅ Signal Card */}
            {selected && (
                <div className="mt-6">
                    <Card className="bg-trading-dark border border-gray-700 p-4 rounded-xl">
                        {displaySignal ? (
                            <div className="space-y-2">
                                <p className="text-white font-medium">
                                    {displaySignal.reason === "(Last Signal)" ? "Last Signal:" : "Current Signal:"}{" "}
                                    <span
                                        className={
                                            displaySignal.type === "BUY"
                                                ? "text-trading-success"
                                                : "text-trading-warning"
                                        }
                                    >
                                        {displaySignal.type}
                                    </span>
                                </p>

                                {/* Entry */}
                                <p className="text-gray-400">Entry: {displaySignal.price}</p>

                                {/* Entry Range */}
                                {displaySignal.entryRange && (
                                    <p className="text-gray-400">
                                        Entry Range:{" "}
                                        <span className="text-white">
                                            {displaySignal.entryRange[0]} – {displaySignal.entryRange[1]}
                                        </span>
                                    </p>
                                )}

                                {/* Stop Loss */}
                                {displaySignal.suggestedSL && (
                                    <p className="text-gray-400">
                                        Stop Loss:{" "}
                                        <span className="text-red-400">
                                            {Array.isArray(displaySignal.suggestedSL)
                                                ? displaySignal.suggestedSL.join(", ")
                                                : displaySignal.suggestedSL}
                                        </span>
                                    </p>
                                )}

                                {/* Take Profit */}
                                {displaySignal.suggestedTP && (
                                    <p className="text-gray-400">
                                        Take Profit:{" "}
                                        <span className="text-green-400">{displaySignal.suggestedTP}</span>
                                    </p>
                                )}

                                {/* Reason */}
                                {displaySignal.reason && (
                                    <p className="text-gray-500 text-sm">Reason: {displaySignal.reason}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-400">No signal available</p>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}


// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { CheckCircle2 } from "lucide-react";

// interface Signal {
//     strategy?: string;
//     type: "BUY" | "SELL";
//     price: number;
//     reason?: string;
//     entryRange?: [number, number];
//     suggestedSL?: number[];
//     suggestedTP?: number;
// }

// interface StrategyListProps {
//     onSelect?: (strategy: string | null) => void;
//     signals?: Signal[];
//     latestPrice?: number;
// }

// export default function StrategyList({ onSelect, signals = [], latestPrice }: StrategyListProps) {
//     const [selected, setSelected] = useState<string | null>(null);

//     const strategies = [
//         { label: "SMA Crossover", value: "ma-crossover" },
//         { label: "RSI + MACD", value: "rsi" },
//         { label: "Breakout", value: "breakout" },
//         { label: "Mean Reversion", value: "mean-reversion" },
//         { label: "Scalping", value: "scalping" },
//     ];

//     const handleSelect = (value: string) => {
//         const newValue = selected === value ? null : value;
//         setSelected(newValue);
//         if (onSelect) onSelect(newValue);
//     };

//     // ✅ selected strategy ka last signal nikaalo
//     let displaySignal: Signal | null = null;

//     if (selected) {
//         const strategySignals = signals.filter(s => s.strategy === selected);
//         const lastSignal = strategySignals.length > 0 ? strategySignals[strategySignals.length - 1] : null;

//         if (lastSignal && latestPrice !== undefined) {
//             if (
//                 (lastSignal.type === "BUY" && latestPrice <= lastSignal.price) ||
//                 (lastSignal.type === "SELL" && latestPrice >= lastSignal.price)
//             ) {
//                 displaySignal = lastSignal;
//             } else {
//                 displaySignal = { ...lastSignal, reason: `(Last Signal)` };
//             }
//         }
//     }

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">Available Strategies</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {strategies.map((s) => (
//                     <Card
//                         key={s.value}
//                         onClick={() => handleSelect(s.value)}
//                         className={`relative cursor-pointer p-4 rounded-xl border transition
//                             ${selected === s.value
//                                 ? "border-trading-success bg-trading-dark ring-2 ring-trading-success/50"
//                                 : "border-gray-700 bg-trading-card hover:border-trading-success hover:bg-trading-dark/40"
//                             }`}
//                     >
//                         <p className="text-white font-medium">{s.label}</p>
//                         {selected === s.value && (
//                             <CheckCircle2 className="absolute top-3 right-3 text-trading-success" size={20} />
//                         )}
//                     </Card>
//                 ))}
//             </div>

//             {selected && (
//                 <div className="mt-6">
//                     <Card className="bg-trading-dark border border-gray-700 p-4 rounded-xl">
//                         {displaySignal ? (
//                             <div className="space-y-2">
//                                 <p className="text-white font-medium">
//                                     {displaySignal.reason === "(Last Signal)" ? "Last Signal:" : "Current Signal:"}{" "}
//                                     <span className={displaySignal.type === "BUY" ? "text-trading-success" : "text-trading-warning"}>
//                                         {displaySignal.type}
//                                     </span>
//                                 </p>

//                                 <p className="text-gray-400">Entry: {displaySignal.price}</p>

//                                 {displaySignal.entryRange && (
//                                     <p className="text-gray-400">
//                                         Entry Range:{" "}
//                                         <span className="text-white">{displaySignal.entryRange[0]} – {displaySignal.entryRange[1]}</span>
//                                     </p>
//                                 )}

//                                 {displaySignal.suggestedSL && (
//                                     <p className="text-gray-400">
//                                         Stop Loss: <span className="text-red-400">{displaySignal.suggestedSL.join(", ")}</span>
//                                     </p>
//                                 )}

//                                 {displaySignal.suggestedTP && (
//                                     <p className="text-gray-400">
//                                         Take Profit: <span className="text-green-400">{displaySignal.suggestedTP}</span>
//                                     </p>
//                                 )}

//                                 {displaySignal.reason && (
//                                     <p className="text-gray-500 text-sm">Reason: {displaySignal.reason}</p>
//                                 )}
//                             </div>
//                         ) : (
//                             <p className="text-gray-400">No signal available</p>
//                         )}
//                     </Card>
//                 </div>
//             )}
//         </div>
//     );
// }


