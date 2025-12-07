import { useState, useEffect } from "react";
import { Plus, Bot, Play, Pause, Trash2, ArrowLeft, Settings, Activity, Zap } from "lucide-react";
import CreateBotModal from "../components/trading/CreateBotModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { fetchBotPnL, fetchBotTrades } from "../sources/bots-source";
import { fetchBots, updateBotStatus, deleteBot, Bot as TradingBot } from "../sources/bots-source";

export default function Automation() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [bots, setBots] = useState<TradingBot[]>([]);
    const [loading, setLoading] = useState(true);
    const [botPnL, setBotPnL] = useState<Record<string, number>>({});
    const [tradeHistory, setTradeHistory] = useState<Record<string, any[]>>({});
    const [expandedBot, setExpandedBot] = useState<string | null>(null);

    useEffect(() => {
        loadBots();
    }, []);

    const loadBots = async () => {
        setLoading(true);
        try {
            const data = await fetchBots();
            setBots(data);
            const pnls: Record<string, number> = {};

            await Promise.all(
                data.map(async (bot) => {
                    try {
                        pnls[bot._id] = await fetchBotPnL(bot._id);
                    } catch (err) {
                        pnls[bot._id] = 0;
                    }
                })
            );

            setBotPnL(pnls);

        } catch (error) {
            console.error("Failed to load bots", error);
            setBots([]);
        }
        setLoading(false);
    };

    const loadTradeHistory = async (botId: string) => {
        if (tradeHistory[botId]) return; // prevent refetch

        try {
            const trades = await fetchBotTrades(botId);
            setTradeHistory((prev) => ({ ...prev, [botId]: trades }));
        } catch (err) {
            console.error("Failed to load trade history", err);
            setTradeHistory((prev) => ({ ...prev, [botId]: [] }));
        }
    };

    const toggleBotHistoryExpand = async (botId: string) => {
        if (expandedBot === botId) {
            setExpandedBot(null);
            return;
        }

        setExpandedBot(botId);
        await loadTradeHistory(botId);
    };


    const toggleBotStatus = async (botId: string, currentStatus: string) => {
        const newStatus = currentStatus === "running" ? "stopped" : "running";
        try {
            await updateBotStatus(botId, newStatus as "running" | "stopped");
            loadBots();
        } catch (error) {
            console.error("Failed to update bot status", error);
        }
    };

    const removeBot = async (botId: string) => {
        if (!confirm("Are you sure you want to delete this bot?")) return;
        try {
            await deleteBot(botId);
            loadBots();
        } catch (error) {
            console.error("Failed to delete bot", error);
        }
    };

    const getStrategyColor = (strategy: string) => {
        const colors: Record<string, string> = {
            RSI: "text-blue-500 bg-blue-500/10",
            Custom: "text-purple-500 bg-purple-500/10",
            "Moving Average": "text-emerald-500 bg-emerald-500/10",
        };
        return colors[strategy] || "text-gray-500 bg-gray-800";
    };

    return (
        <div className="flex flex-col h-full min-h-0 bg-trading-dark text-white">

            <div className="bg-trading-card border-b border-gray-700 p-5">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Dashboard
                            </Button>
                        </Link>

                        <h6 className="text-xl font-bold text-white flex items-center">
                            <Zap className="h-8 w-8 text-trading-warning mr-3" />
                            Trading Automation
                        </h6>
                    </div>
                    <div className="flex items-center space-x-3">
                        <p className="text-gray-400 whitespace-nowrap hidden sm:block">Create and manage automated trading bots</p>
                        <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-500 hover:bg-emerald-600">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Bot
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 p-6 overflow-y-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-trading-card border-gray-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-400 text-sm">Total Bots</h3>
                                <Bot className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="text-2xl font-bold text-white">{bots.length}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-trading-card border-gray-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-400 text-sm">Active Bots</h3>
                                <Activity className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {bots.filter((b) => b.status === "running").length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-trading-card border-gray-700">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-400 text-sm">Total Trades</h3>
                                <Settings className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div className="text-2xl font-bold text-white">0</div>
                        </CardContent>
                    </Card>
                </div>

                {loading ? (
                    <div className="text-center py-12 bg-trading-card rounded-lg border border-gray-700">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-600 border-t-emerald-500"></div>
                        <p className="text-gray-400 mt-4">Loading bots...</p>
                    </div>
                ) : bots.length === 0 ? (
                    <div className="text-center py-12 bg-trading-card rounded-lg border border-gray-700">
                        <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No bots yet</h3>
                        <p className="text-gray-400 mb-6">
                            Create your first trading bot to start automating your strategies
                        </p>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Your First Bot
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bots.map((bot) => (
                            <div key={bot._id} className="bg-trading-card rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
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
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${bot.status === "running"
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : bot.status === "error"
                                                ? "bg-red-500/10 text-red-500"
                                                : "bg-gray-800 text-gray-400"
                                            }`}
                                    >
                                        {bot.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Strategy:</span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${getStrategyColor(
                                                bot.strategy_type
                                            )}`}
                                        >
                                            {bot.strategy_type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Timeframe:</span>
                                        <span className="text-white">{bot.timeframe}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Created:</span>
                                        <span className="text-white">
                                            {new Date(bot.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">PnL:</span>
                                        <span
                                            className={
                                                botPnL[bot._id] >= 0
                                                    ? "text-emerald-400 font-semibold"
                                                    : "text-red-400 font-semibold"
                                            }
                                        >
                                            {botPnL[bot._id]?.toFixed(2)} USDT
                                        </span>
                                    </div>
                                    <div className="pt-3">
                                        <button
                                            onClick={() => toggleBotHistoryExpand(bot._id)}
                                            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
                                        >
                                            {expandedBot === bot._id ? "Hide Trade History ▲" : "Show Trade History ▼"}
                                        </button>
                                    </div>
                                    {expandedBot === bot._id && (
                                        <div className="mt-3 bg-black/30 border border-gray-700 rounded-lg p-4 animate-slideDown">
                                            {!tradeHistory[bot._id] ? (
                                                <p className="text-gray-500 text-sm">Loading...</p>
                                            ) : tradeHistory[bot._id].length === 0 ? (
                                                <p className="text-gray-500 text-sm">No trades yet.</p>
                                            ) : (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {tradeHistory[bot._id].map((t, i) => (
                                                        <div key={i} className="border-b border-gray-700 pb-2">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="uppercase font-semibold text-gray-300">
                                                                    {t.side}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(t.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>

                                                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                                                                <span>Price:</span>
                                                                <span className="text-white">{t.price}</span>
                                                            </div>

                                                            <div className="flex justify-between text-xs text-gray-400">
                                                                <span>Amount:</span>
                                                                <span className="text-white">{t.amount}</span>
                                                            </div>

                                                            {t.pnl !== undefined && (
                                                                <div className="flex justify-between text-xs">
                                                                    <span>PnL:</span>
                                                                    <span
                                                                        className={
                                                                            t.pnl >= 0
                                                                                ? "text-emerald-400"
                                                                                : "text-red-400"
                                                                        }
                                                                    >
                                                                        {t.pnl.toFixed(2)} USDT
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                                    <Button
                                        onClick={() => toggleBotStatus(bot._id, bot.status)}
                                        className={`flex-1 ${bot.status === "running"
                                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                            }`}
                                    >
                                        {bot.status === "running" ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" /> Stop
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" /> Start
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => removeBot(bot._id)}
                                        variant="outline"
                                        className="bg-trading-dark border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <CreateBotModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        loadBots();
                    }}
                />
            )}
        </div>
    );
}
