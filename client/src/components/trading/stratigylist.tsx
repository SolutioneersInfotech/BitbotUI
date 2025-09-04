// src/components/trading/stratigylist.tsx
// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { CheckCircle2 } from "lucide-react";

// interface StrategyListProps {
//     onSelect?: (strategy: string) => void;
// }

// export default function StrategyList({ onSelect }: StrategyListProps) {
//     const [selected, setSelected] = useState<string>("");

//     // 👇 ab list me label + value dono
//     const strategies = [
//         { label: "SMA Crossover", value: "ma-crossover" },
//         // { label: "RSI + MACD", value: "rsi-macd" },
//         // { label: "Breakout", value: "breakout" },
//         // { label: "Mean Reversion", value: "mean-reversion" },
//         // { label: "Scalping", value: "scalping" },
//     ];

//     const handleSelect = (value: string) => {
//         setSelected(value);
//         if (onSelect) onSelect(value); // 👈 backend friendly value bhejna hai
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">
//                 Available Strategies
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {strategies.map((s) => (
//                     <Card
//                         key={s.value}
//                         onClick={() => handleSelect(s.value)}
//                         className={`relative cursor-pointer p-4 rounded-xl border transition
//               ${selected === s.value
//                                 ? "border-trading-success bg-trading-dark ring-2 ring-trading-success/50"
//                                 : "border-gray-700 bg-trading-card hover:border-trading-success hover:bg-trading-dark/40"
//                             }`}
//                     >
//                         <p className="text-white font-medium">{s.label}</p>
//                         {selected === s.value && (
//                             <CheckCircle2
//                                 className="absolute top-3 right-3 text-trading-success"
//                                 size={20}
//                             />
//                         )}
//                     </Card>
//                 ))}
//             </div>

//             {selected && (
//                 <div className="mt-4 text-trading-info">
//                     ✅ Selected Strategy:{" "}
//                     <span className="font-semibold">
//                         {strategies.find((s) => s.value === selected)?.label}
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// }



// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { CheckCircle2 } from "lucide-react";

// interface StrategyListProps {
//     onSelect?: (strategy: string | null) => void;
// }

// export default function StrategyList({ onSelect }: StrategyListProps) {
//     const [selected, setSelected] = useState<string | null>(null);

//     const strategies = [
//         { label: "SMA Crossover", value: "ma-crossover" },
//         { label: "RSI + MACD", value: "rsi-macd" },
//         { label: "Breakout", value: "breakout" },
//         { label: "Mean Reversion", value: "mean-reversion" },
//         { label: "Scalping", value: "scalping" },
//     ];

//     const handleSelect = (value: string) => {
//         // 👇 toggle logic: agar same select hai to unselect kar do
//         const newValue = selected === value ? null : value;
//         setSelected(newValue);
//         if (onSelect) onSelect(newValue);
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">Available Strategies</h2>

//             {selected && (
//                 <div className="mt-4 text-trading-info">
//                     ✅ Selected Strategy:{" "}
//                     <span className="font-semibold">
//                         {strategies.find((s) => s.value === selected)?.label}
//                     </span>
//                 </div>
//             )}
//             <br />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {strategies.map((s) => (
//                     <Card
//                         key={s.value}
//                         onClick={() => handleSelect(s.value)}
//                         className={`relative cursor-pointer p-4 rounded-xl border transition
//               ${selected === s.value
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


//         </div>
//     );
// }



// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { CheckCircle2 } from "lucide-react";

// interface StrategyListProps {
//     onSelect?: (strategy: string | null) => void;
//     currentSignal?: { type: string; price: number; reason?: string } | null;
// }

// export default function StrategyList({ onSelect, currentSignal }: StrategyListProps) {
//     const [selected, setSelected] = useState<string | null>(null);

//     const strategies = [
//         { label: "SMA Crossover", value: "ma-crossover" },
//         { label: "RSI + MACD", value: "rsi-macd" },
//         { label: "Breakout", value: "breakout" },
//         { label: "Mean Reversion", value: "mean-reversion" },
//         { label: "Scalping", value: "scalping" },
//     ];

//     const handleSelect = (value: string) => {
//         const newValue = selected === value ? null : value;
//         setSelected(newValue);
//         if (onSelect) onSelect(newValue);
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold mb-4 text-white">Available Strategies</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {strategies.map((s) => (
//                     <Card
//                         key={s.value}
//                         onClick={() => handleSelect(s.value)}
//                         className={`relative cursor-pointer p-4 rounded-xl border transition
//               ${selected === s.value
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

//             {/* ✅ Current Signal Card */}
//             {selected && (
//                 <div className="mt-6">
//                     <Card className="bg-trading-dark border border-gray-700 p-4 rounded-xl">
//                         {currentSignal ? (
//                             <div>
//                                 <p className="text-white font-medium">
//                                     Current Signal:{" "}
//                                     <span
//                                         className={
//                                             currentSignal.type === "BUY"
//                                                 ? "text-trading-success"
//                                                 : "text-trading-warning"
//                                         }
//                                     >
//                                         {currentSignal.type}
//                                     </span>
//                                 </p>
//                                 <p className="text-gray-400">Price: {currentSignal.price}</p>
//                                 {currentSignal.reason && (
//                                     <p className="text-gray-500 text-sm">Reason: {currentSignal.reason}</p>
//                                 )}
//                             </div>
//                         ) : (
//                             <p className="text-gray-400">No active signal right now</p>
//                         )}
//                     </Card>
//                 </div>
//             )}
//         </div>
//     );
// }

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface Signal {
    type: "BUY" | "SELL";
    price: number;
    reason?: string;
    suggestedSL?: number;
    suggestedTP?: number;
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
        { label: "RSI + MACD", value: "rsi-macd" },
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
                            <div>
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
                                <p className="text-gray-400">Entry: {displaySignal.price}</p>
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




