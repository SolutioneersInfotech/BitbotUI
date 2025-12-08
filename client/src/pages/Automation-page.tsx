import { useState, useEffect } from "react";
import { Plus, Bot, Play, Pause, Trash2, ArrowLeft, Settings, Activity, Zap } from "lucide-react";
import CreateBotModal from "../components/trading/CreateBotModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { fetchBotPnL, fetchBotTrades } from "../sources/bots-source";
import { fetchBots, updateBotStatus, deleteBot, Bot as TradingBot } from "../sources/bots-source";
import useBotWs from "../hooks/useBotWs";
import BotCard from "@/components/trading/BotCard";


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
            console.log("trades=======>",trades);
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
                            <BotCard
                                key={bot._id}
                                bot={bot}
                                pnl={botPnL[bot._id] ?? 0}
                                tradeHistory={tradeHistory[bot._id] ?? []}
                                loadTradeHistory={() => loadTradeHistory(bot._id)}
                                onDelete={() => removeBot(bot._id)}
                                onToggleStatus={() => toggleBotStatus(bot._id, bot.status)}
                            />
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
