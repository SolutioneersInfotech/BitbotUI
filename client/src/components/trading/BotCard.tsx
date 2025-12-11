import { useEffect, useState, useMemo, useRef } from "react";
import { Bot, Pause, Play, Trash2 } from "lucide-react";
import useBotWs from "../../hooks/useBotWs";

type Trade = {
    botId?: string;
    side: string;
    createdAt: string | number | Date;
    price: number;
    amount: number;
    pnl?: number;
};

export default function BotCard({
    bot,
    pnl,
    tradeHistory,
    loadTradeHistory,
    onDelete,
    onToggleStatus,
}: any) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0);
    const [liveTrades, setLiveTrades] = useState<Trade[]>([]);
    const statusRef = useRef<HTMLSpanElement>(null);
    const commodityRef = useRef<HTMLSpanElement>(null);
    const [pillWidth, setPillWidth] = useState<number>(0);

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
        },
    });

    useEffect(() => {
        if (!expanded) {
            unsubscribe(bot._id);
            return;
        }

        const timeout = setTimeout(() => {
            subscribe(bot._id);
            loadTradeHistory();
        }, 300);

        return () => {
            clearTimeout(timeout);
            unsubscribe(bot._id);
        };
    }, [expanded]);

    useEffect(() => {
        const statusWidth = statusRef.current?.offsetWidth || 0;
        const commodityWidth = commodityRef.current?.offsetWidth || 0;

        const maxWidth = Math.max(statusWidth, commodityWidth);

        if (maxWidth !== pillWidth) {
            setPillWidth(maxWidth);
        }
    }, [bot.status, bot.symbol, expanded]);


    // ------------------------------
    // WINNING / LOSING TRADES + WIN RATE
    // ------------------------------
    const allTrades = useMemo(
        () => [...tradeHistory, ...liveTrades],
        [tradeHistory, liveTrades]
    );

    const winningTrades = allTrades.filter(
        (t) => t.pnl !== undefined && t.pnl > 0
    ).length;
    const losingTrades = allTrades.filter(
        (t) => t.pnl !== undefined && t.pnl < 0
    ).length;

    const totalCompleted = winningTrades + losingTrades;
    const winRate =
        totalCompleted > 0 ? (winningTrades / totalCompleted) * 100 : 0;
    // ------------------------------

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

                <div className="flex flex-col items-end">
                    {/* STATUS BADGE */}
                    <span
                        ref={statusRef}
                        style={{ width: pillWidth ? pillWidth : "auto" }}
                        className={`px-3 py-1 rounded-full text-xs font-bold text-center ${bot.status === "running"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        {bot.status.toUpperCase()}
                    </span>
                    {/* ⭐ Commodity Badge */}
                    <span
                        ref={statusRef}
                        style={{ width: pillWidth ? pillWidth : "auto" }}
                        className="mt-2 
                        px-3 py-1
                        rounded-full 
                        text-xs font-semibold
                        bg-blue-500/10 
                        text-blue-300
                        border border-blue-500/20"
                    >
                        {bot.symbol || bot.commodity || "N/A"}
                    </span>
                </div>
            </div>

            {/* BODY */}
            <div className="space-y-2 mb-4 text-sm">
                {/* CREATED */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white">
                        {new Date(bot.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* ⭐ WIN RATE BELOW CREATED */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-white">{winRate.toFixed(2)}%</span>
                </div>

                {/* REALIZED PNL */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Realized PnL:</span>
                    <span
                        className={
                            pnl.realized > 0
                                ? "text-emerald-400"
                                : pnl.realized < 0
                                    ? "text-red-400"
                                    : "text-blue-400"
                        }
                    >
                        {pnl.realized.toFixed(2)} USDT
                    </span>
                </div>

                {/* UNREALIZED LIVE PNL */}
                <div className="flex justify-between">
                    <span className="text-gray-400">Unrealized PnL:</span>
                    <span
                        className={pnl.unrealized >= 0 ? "text-emerald-400" : "text-red-400"}
                    >
                        {pnl.unrealized.toFixed(2)} USDT
                    </span>
                </div>

                {/* EXPAND BUTTON */}
                <button
    onClick={() => {
        setExpanded(!expanded);
        loadTradeHistory();
    }}
    className="
    w-full block px-2 py-1 
    text-sm text-emerald-400 
    bg-emerald-500/10
    hover:bg-emerald-500/20
    rounded
    transition
"

>
    {expanded ? "Hide Trade History ▲" : "Show Trade History ▼"}
</button>


                {/* EXPANDED SECTION */}
                {expanded && (
                    <div
    className="
        mt-3 bg-black/30 border border-gray-700 rounded-lg p-4 animate-slideDown
        max-h-80 overflow-y-auto custom-scroll
    "
>

                        {/* ⭐ WINNING / LOSING TRADES HERE (ONLY WHEN EXPANDED) */}
                        <div className="mb-4 space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Winning Trades:</span>
                                <span className="text-emerald-400">{winningTrades}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Losing Trades:</span>
                                <span className="text-red-400">{losingTrades}</span>
                            </div>
                        </div>

                        {/* TRADE HISTORY LIST */}
                        {allTrades.length === 0 ? (
                            <p className="text-gray-500 text-sm">No trades yet</p>
                        ) : (
                            allTrades.map((t, i) => (
                                <div key={i} className="border-b border-gray-700 pb-2 mb-2">
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

                                    { t?.pnl !== null && (
                                        <div className="flex justify-between text-xs">
                                            <span>PnL:</span>
                                            <span
                                                className={
                                                    t.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                                                }
                                            >
                                                {t?.pnl?.toFixed(4)} USDT
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="w-full pt-4 border-t border-gray-700">
                <div className="flex items-center gap-3">
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
