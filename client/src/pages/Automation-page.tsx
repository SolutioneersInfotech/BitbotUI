// import { useState, useEffect } from "react";
// import { Plus, Bot, Play, Pause, Trash2, ArrowLeft, Settings, Activity, Zap } from "lucide-react";
// import CreateBotModal from "../components/trading/CreateBotModal";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Link } from "wouter";

// interface TradingBot {
//     id: string;
//     name: string;
//     strategy_type: string;
//     timeframe: string;
//     status: string;
//     created_at: string;
//     configuration: any;
// }

// export default function Automation() {
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [bots, setBots] = useState<TradingBot[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadBots();
//     }, []);

//     // Load bots from custom backend
//     // Load bots from custom backend
//     const loadBots = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("http://localhost:3000/api/bots"); // backend endpoint
//             const data: TradingBot[] = await res.json(); // backend now returns array directly
//             setBots(Array.isArray(data) ? data : []); // fallback to empty array
//         } catch (error) {
//             console.error("Failed to load bots", error);
//             setBots([]); // fallback to empty array to avoid crashes
//         }
//         setLoading(false);
//     };



//     const toggleBotStatus = async (botId: string, currentStatus: string) => {
//         console.log("Toggling bot:", botId);
//         const newStatus = currentStatus === "active" ? "stopped" : "active";
//         try {
//             await fetch(`http://localhost:3000/api/bots/${botId}/status`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status: newStatus }),
//             });
//             loadBots();
//         } catch (error) {
//             console.error("Failed to update bot status", error);
//         }
//     };

//     const deleteBot = async (botId: string) => {
//         if (!confirm("Are you sure you want to delete this bot?")) return;
//         try {
//             await fetch(`/api/bots/${botId}`, { method: "DELETE" });
//             loadBots();
//         } catch (error) {
//             console.error("Failed to delete bot", error);
//         }
//     };

//     const getStrategyColor = (strategy: string) => {
//         const colors: Record<string, string> = {
//             RSI: "text-blue-500 bg-blue-500/10",
//             Custom: "text-purple-500 bg-purple-500/10",
//             "Moving Average": "text-emerald-500 bg-emerald-500/10",
//         };
//         return colors[strategy] || "text-gray-500 bg-gray-800";
//     };

//     return (
//         <div className="min-h-screen bg-trading-dark text-white">
//             {/* Header */}
//             <div className="bg-trading-card border-b border-gray-700 p-6">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                         <Link href="/">
//                             <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
//                                 <ArrowLeft className="h-4 w-4 mr-2" />
//                                 Back to Dashboard
//                             </Button>
//                         </Link>
//                         <div>
//                             <h1 className="text-3xl font-bold text-white flex items-center">
//                                 <Zap className="h-8 w-8 text-trading-warning mr-3" />
//                                 Trading Automation
//                             </h1>
//                             <p className="text-gray-400 mt-1">Create and manage automated trading bots</p>
//                         </div>
//                     </div>
//                     <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-500 hover:bg-emerald-600">
//                         <Plus className="w-5 h-5 mr-2" />
//                         Create New Bot
//                     </Button>
//                 </div>
//             </div>

//             {/* Stats Section */}
//             <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     <Card className="bg-trading-card border-gray-700">
//                         <CardContent className="pt-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-gray-400 text-sm">Total Bots</h3>
//                                 <Bot className="h-4 w-4 text-blue-500" />
//                             </div>
//                             <div className="text-2xl font-bold text-white">{bots.length}</div>
//                         </CardContent>
//                     </Card>

//                     <Card className="bg-trading-card border-gray-700">
//                         <CardContent className="pt-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-gray-400 text-sm">Active Bots</h3>
//                                 <Activity className="h-4 w-4 text-emerald-500" />
//                             </div>
//                             <div className="text-2xl font-bold text-white">
//                                 {bots.filter((b) => b.status === "active").length}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <Card className="bg-trading-card border-gray-700">
//                         <CardContent className="pt-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <h3 className="text-gray-400 text-sm">Total Trades</h3>
//                                 <Settings className="h-4 w-4 text-yellow-500" />
//                             </div>
//                             <div className="text-2xl font-bold text-white">0</div>
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Bots List */}
//                 {loading ? (
//                     <div className="text-center py-12 bg-trading-card rounded-lg border border-gray-700">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-600 border-t-emerald-500"></div>
//                         <p className="text-gray-400 mt-4">Loading bots...</p>
//                     </div>
//                 ) : bots.length === 0 ? (
//                     <div className="text-center py-12 bg-trading-card rounded-lg border border-gray-700">
//                         <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                         <h3 className="text-xl font-semibold text-white mb-2">No bots yet</h3>
//                         <p className="text-gray-400 mb-6">
//                             Create your first trading bot to start automating your strategies
//                         </p>
//                         <Button
//                             onClick={() => setShowCreateModal(true)}
//                             className="bg-emerald-500 hover:bg-emerald-600"
//                         >
//                             <Plus className="w-5 h-5 mr-2" />
//                             Create Your First Bot
//                         </Button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {bots.map((bot) => (
//                             <div
//                                 key={bot.id}
//                                 className="bg-trading-card rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
//                             >
//                                 <div className="flex items-start justify-between mb-4">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
//                                             <Bot className="w-6 h-6 text-white" />
//                                         </div>
//                                         <div>
//                                             <h3 className="text-white font-semibold">{bot.name}</h3>
//                                             <p className="text-gray-400 text-sm">
//                                                 {bot.strategy_type} • {bot.timeframe}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <span
//                                         className={`px-3 py-1 rounded-full text-xs font-medium ${bot.status === "active"
//                                             ? "bg-emerald-500/10 text-emerald-500"
//                                             : bot.status === "error"
//                                                 ? "bg-red-500/10 text-red-500"
//                                                 : "bg-gray-800 text-gray-400"
//                                             }`}
//                                     >
//                                         {bot.status.toUpperCase()}
//                                     </span>
//                                 </div>

//                                 <div className="space-y-2 mb-4 text-sm">
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-400">Strategy:</span>
//                                         <span
//                                             className={`px-2 py-1 rounded text-xs font-medium ${getStrategyColor(
//                                                 bot.strategy_type
//                                             )}`}
//                                         >
//                                             {bot.strategy_type}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-400">Timeframe:</span>
//                                         <span className="text-white">{bot.timeframe}</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-400">Created:</span>
//                                         <span className="text-white">
//                                             {new Date(bot.created_at).toLocaleDateString()}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
//                                     <Button
//                                         onClick={() => toggleBotStatus(bot.id, bot.status)}
//                                         className={`flex-1 ${bot.status === "active"
//                                             ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
//                                             : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
//                                             }`}
//                                     >
//                                         {bot.status === "active" ? (
//                                             <>
//                                                 <Pause className="w-4 h-4 mr-2" /> Stop
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Play className="w-4 h-4 mr-2" /> Start
//                                             </>
//                                         )}
//                                     </Button>
//                                     <Button
//                                         onClick={() => deleteBot(bot.id)}
//                                         variant="outline"
//                                         className="bg-trading-dark border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-500"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {showCreateModal && (
//                 <CreateBotModal
//                     onClose={() => setShowCreateModal(false)}
//                     onSuccess={() => {
//                         setShowCreateModal(false);
//                         loadBots();
//                     }}
//                 />
//             )}
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { Plus, Bot, Play, Pause, Trash2, ArrowLeft, Settings, Activity, Zap } from "lucide-react";
import CreateBotModal from "../components/trading/CreateBotModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface TradingBot {
    _id: string; // Updated: MongoDB _id
    name: string;
    strategy_type: string;
    timeframe: string;
    status: string;
    created_at: string;
    configuration: any;
}

export default function Automation() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [bots, setBots] = useState<TradingBot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBots();
    }, []);

    // Load bots from backend
    const loadBots = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/bots"); // backend endpoint
            const data: TradingBot[] = await res.json();
            setBots(Array.isArray(data) ? data : []); // fallback to empty array
        } catch (error) {
            console.error("Failed to load bots", error);
            setBots([]);
        }
        setLoading(false);
    };

    // Toggle bot status
    const toggleBotStatus = async (botId: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "stopped" : "active";
        try {
            await fetch(`http://localhost:3000/api/bots/${botId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            loadBots();
        } catch (error) {
            console.error("Failed to update bot status", error);
        }
    };

    // Delete bot
    const deleteBot = async (botId: string) => {
        if (!confirm("Are you sure you want to delete this bot?")) return;
        try {
            await fetch(`http://localhost:3000/api/bots/${botId}`, { method: "DELETE" });
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
        <div className="min-h-screen bg-trading-dark text-white">
            {/* Header */}
            <div className="bg-trading-card border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <Zap className="h-8 w-8 text-trading-warning mr-3" />
                                Trading Automation
                            </h1>
                            <p className="text-gray-400 mt-1">Create and manage automated trading bots</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} className="bg-emerald-500 hover:bg-emerald-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Bot
                    </Button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="p-6">
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
                                {bots.filter((b) => b.status === "active").length}
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

                {/* Bots List */}
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
                            <div
                                key={bot._id} // updated
                                className="bg-trading-card rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                            >
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
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${bot.status === "active"
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
                                            {new Date(bot.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-4 border-t border-gray-700">
                                    <Button
                                        onClick={() => toggleBotStatus(bot._id, bot.status)} // updated
                                        className={`flex-1 ${bot.status === "active"
                                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                            }`}
                                    >
                                        {bot.status === "active" ? (
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
                                        onClick={() => deleteBot(bot._id)} // updated
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
