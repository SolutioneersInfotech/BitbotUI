import { useEffect, useState } from "react";
import { Bot, Pause, Play, Trash2 } from "lucide-react";
import useBotWs from "../../hooks/useBotWs";

type Trade = {
    botId?: string;
    side: string;
    createdAt: string | number | Date;
    price: number;
    amount: number;
    pnl?: any;
};

type BotType = {
    _id: string;
    name: string;
    strategy_type: string;
    timeframe: string;
    status: string;
    createdAt: string;
};

interface BotCardProps {
    bot: BotType;
    pnl: any;
    tradeHistory: Trade[];
    loadTradeHistory: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
}

export default function BotCard({
    bot,
    pnl,
    tradeHistory,
    loadTradeHistory,
    onDelete,
    onToggleStatus,
}: BotCardProps) {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);
    const [liveTrades, setLiveTrades] = useState<Trade[]>([]);

    console.log("tradehistory-------->", tradeHistory);

    // WebSocket subscription for THIS BOT only
    const { subscribe, unsubscribe } = useBotWs({
        onRuntime: (payload) => {
            if (payload.botId === bot._id) {
                setUnrealizedPnl(payload.unrealizedPnl ?? 0);
            }
        },
        onTrade: (trade) => {
            if (trade.botId === bot._id) {
                setLiveTrades((prev) => [trade, ...prev.slice(0, 10)]);
            }
        }
    });

    useEffect(() => {
        if (!expanded) {
            unsubscribe(bot._id);
            return;
        }

        // connect once
        const timeout = setTimeout(() => {
            subscribe(bot._id);   // subscribe AFTER ws connects
            loadTradeHistory();
        }, 300); // small delay = no more early calls

        return () => {
            clearTimeout(timeout);
            unsubscribe(bot._id);
        };
    }, [expanded]);


    return (
        <div className="bg-trading-card rounded-lg p-6 border border-gray-700 hover:border-gray-600">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">{bot.name}</h3>
                        <p className="text-gray-400 text-sm">
                            {bot.strategy_type} • {bot.timeframe}
                        </p>
                    </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bot.status === "running"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-gray-700 text-gray-300"
                    }`}>
                    {bot.status.toUpperCase()}
                </span>
            </div>

            {/* BODY */}
            <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">
                        {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Total PnL */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Realized PnL:</span>
                    <span className={pnl.realized.toFixed(2) > 0 ? "text-emerald-400" : pnl.realized.toFixed(2) < 0 ? "text-red-400" : "text-blue-400"}>
                        {pnl.realized.toFixed(2)} USDT
                    </span>
                </div>

                {/* Unrealized PnL (LIVE) */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Unrealized PnL:</span>
                    <span className={pnl.unrealized.toFixed(2) >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {pnl.unrealized.toFixed(2)} USDT
                    </span>
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => { setExpanded(!expanded); loadTradeHistory(); }}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                >
                    {expanded ? "Hide Trade History ▲" : "Show Trade History ▼"}
                </button>

                {/* TRADE HISTORY */}
                {expanded && (
                    <div className="mt-3 bg-black/30 border border-gray-700 rounded-lg p-4 animate-slideDown">
                        {
                            !tradeHistory ? (
                                <p className="text-gray-500 text-sm">Loading...</p>
                            ) : tradeHistory.length === 0 ? (
                                <p className="text-gray-500 text-sm">No trades yet</p>
                            ) :
                                [...liveTrades, ...tradeHistory].map((t, i) => (

                                    (<div key={i} className="border-b border-gray-700 pb-2 mb-2">
                                        <div className="flex justify-between">
                                            <span className="uppercase text-gray-200">{t.side}</span>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(t.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Price:</span>
                                            <span className="text-white">{t.price}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Amount:</span>
                                            <span className="text-white">{t.amount}</span>
                                        </div>

                                        {t.pnl !== undefined || t.pnl !== null && (
                                            <div className="flex justify-between text-xs">
                                                <span>PnL:</span>
                                                <span className={t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                                                    {t.pnl.toFixed(2)} USDT
                                                </span>
                                            </div>
                                        )}
                                    </div>)
                                ))}

                    </div>
                )}

            </div>

            {/* FOOTER BUTTONS */}
            <div className="w-full pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3">

                    {/* PLAY/PAUSE expands fully */}
                    <button
                        onClick={onToggleStatus}
                        className={`flex-1 py-2 rounded font-bold flex items-center justify-center ${bot.status === "running"
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            }`}
                    >
                        {bot.status === "running" ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                    </button>

                    {/* Delete icon (fixed size) */}
                    <button
                        onClick={onDelete}
                        className="p-2 rounded bg-trading-dark border border-gray-600 hover:text-red-500"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                </div>
            </div>


        </div>
    );
}
