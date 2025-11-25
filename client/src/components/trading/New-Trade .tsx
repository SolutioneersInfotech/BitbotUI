// import React, { useState } from "react";

// interface BrokerAccount {
//     id: string;
//     name: string;
// }

// interface TradeFormProps {
//     brokers: BrokerAccount[];
//     symbols: string[];
//     onSubmit: (data: TradePayload) => void;
// }

// export interface TradePayload {
//     brokerId: string;
//     symbol: string;
//     side: "BUY" | "SELL";
//     quantity: number;
//     price?: number;
// }

// const TradeForm: React.FC<TradeFormProps> = ({
//     brokers,
//     symbols,
//     onSubmit,
// }) => {
//     const [form, setForm] = useState<TradePayload>({
//         brokerId: "",
//         symbol: "",
//         side: "BUY",
//         quantity: 0,
//         price: undefined,
//     });

//     const handleChange = (
//         e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
//     ) => {
//         const { name, value } = e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]: name === "quantity" || name === "price" ? Number(value) : value,
//         }));
//     };

//     const submitHandler = (e: React.FormEvent) => {
//         e.preventDefault();
//         onSubmit(form);
//     };

//     return (
//         <form
//             onSubmit={submitHandler}
//             className="w-full max-w-xl bg-[#11161C] p-6 rounded-2xl space-y-6 border border-[#232A33]"
//         >
//             {/* Broker */}
//             <div className="flex flex-col gap-2">
//                 <label className="text-gray-300 text-sm font-medium">
//                     Select Broker *
//                 </label>
//                 <select
//                     name="brokerId"
//                     value={form.brokerId}
//                     onChange={handleChange}
//                     className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
//                 >
//                     <option value="">Choose Broker</option>
//                     {brokers.map((b) => (
//                         <option key={b.id} value={b.id}>
//                             {b.name} — {b.id.slice(0, 5)}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* Symbol */}
//             <div className="flex flex-col gap-2">
//                 <label className="text-gray-300 text-sm font-medium">
//                     Select Symbol *
//                 </label>
//                 <select
//                     name="symbol"
//                     value={form.symbol}
//                     onChange={handleChange}
//                     className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
//                 >
//                     <option value="">Choose Symbol</option>
//                     {symbols.map((s) => (
//                         <option key={s} value={s}>
//                             {s}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* BUY / SELL */}
//             <div className="flex gap-4">
//                 {["BUY", "SELL"].map((option) => (
//                     <button
//                         key={option}
//                         type="button"
//                         onClick={() =>
//                             setForm((prev) => ({ ...prev, side: option as "BUY" | "SELL" }))
//                         }
//                         className={`flex-1 text-center py-3 rounded-xl font-semibold ${form.side === option
//                                 ? option === "BUY"
//                                     ? "bg-green-500"
//                                     : "bg-red-500"
//                                 : "bg-[#1A1F26] border border-[#232A33] text-gray-300"
//                             }`}
//                     >
//                         {option}
//                     </button>
//                 ))}
//             </div>

//             {/* Quantity */}
//             <div className="flex flex-col gap-2">
//                 <label className="text-gray-300 text-sm font-medium">Quantity *</label>
//                 <input
//                     name="quantity"
//                     type="number"
//                     value={form.quantity}
//                     onChange={handleChange}
//                     className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
//                 />
//             </div>

//             {/* Price */}
//             <div className="flex flex-col gap-2">
//                 <label className="text-gray-300 text-sm font-medium">
//                     Price (Optional)
//                 </label>
//                 <input
//                     name="price"
//                     type="number"
//                     value={form.price ?? ""}
//                     onChange={handleChange}
//                     className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
//                 />
//             </div>

//             <button
//                 type="submit"
//                 className="w-full py-3 bg-indigo-600 rounded-xl text-white font-semibold"
//             >
//                 Execute Trade
//             </button>
//         </form>
//     );
// };

// export default TradeForm;
import React, { useEffect, useState } from "react";

interface BrokerAccount {
    _id: string;
    exchange: string;
    userAlias?: string;
}

interface TradeFormProps {
    onSubmit: (data: TradePayload) => void;
}

export interface TradePayload {
    brokerId: string;
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    price?: number;
}

const TradeForm: React.FC<TradeFormProps> = ({ onSubmit }) => {
    const [brokers, setBrokers] = useState<BrokerAccount[]>([]);
    const [symbols, setSymbols] = useState<string[]>([]);

    const [form, setForm] = useState<TradePayload>({
        brokerId: "",
        symbol: "",
        side: "BUY",
        quantity: 0,
        price: undefined,
    });

    // 🔥 Exchange-wise symbol list (same as CreateBotModal)
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

    // 🔹 Fetch connected brokers (same as CreateBotModal)
    useEffect(() => {
        async function fetchBrokers() {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                    "https://predator-production.up.railway.app/api/exchange/list",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await res.json();
                setBrokers(data);
            } catch (error) {
                console.error("Error fetching brokers:", error);
            }
        }

        fetchBrokers();
    }, []);

    // 🔥 When broker selected → update symbol list
    useEffect(() => {
        if (!form.brokerId) return;

        const selected = brokers.find((b) => b._id === form.brokerId);
        if (!selected) return;

        const exchange = selected.exchange.toLowerCase();
        setSymbols(symbolMap[exchange] || []);
    }, [form.brokerId, brokers]);

    const handleChange = (
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" ? Number(value) : value,
        }));
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form
            onSubmit={submitHandler}
            className="w-full max-w-xl bg-[#11161C] p-6 rounded-2xl space-y-6 border border-[#232A33]"
        >
            {/* Select Broker */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-medium">Select Broker *</label>
                <select
                    name="brokerId"
                    value={form.brokerId}
                    onChange={handleChange}
                    className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
                >
                    <option value="">Choose Broker</option>
                    {brokers.map((b) => (
                        <option key={b._id} value={b._id}>
                            {b.exchange} — {b.userAlias || b._id.slice(0, 5)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Symbol */}
            {form.brokerId && (
                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm font-medium">Select Symbol *</label>
                    <select
                        name="symbol"
                        value={form.symbol}
                        onChange={handleChange}
                        className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
                    >
                        <option value="">Choose Symbol</option>
                        {symbols.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* BUY / SELL */}
            <div className="flex gap-4">
                {["BUY", "SELL"].map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() =>
                            setForm((prev) => ({ ...prev, side: option as "BUY" | "SELL" }))
                        }
                        className={`flex-1 text-center py-3 rounded-xl font-semibold ${form.side === option
                                ? option === "BUY"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                : "bg-[#1A1F26] border border-[#232A33] text-gray-300"
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-medium">Quantity *</label>
                <input
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
                />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
                <label className="text-gray-300 text-sm font-medium">Price (Optional)</label>
                <input
                    name="price"
                    type="number"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    className="bg-[#1A1F26] border border-[#232A33] rounded-xl px-4 py-3 text-gray-200"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-indigo-600 rounded-xl text-white font-semibold"
            >
                Execute Trade
            </button>
        </form>
    );
};

export default TradeForm;
