import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../ui/card";

interface Order {
    id: string;
    product_symbol: string;
    size: number;
    price: number;
    side: string;
    status: string;
    updated_at: string;
}

interface Fill {
    id: string;
    product_symbol: string;
    size: number;
    price: number;
    side: string;
    liquidity: string;
    created_at: string;
}

export default function DeltaHistory() {
    const [activeTab, setActiveTab] = useState<"orders" | "fills">("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [fills, setFills] = useState<Fill[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token"); // verifyAuth token

    const fetchOrders = async () => {
        console.log("🔥 Calling orders API...");
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("https://predator-production.up.railway.app/api/history/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrders(res.data.orders || []);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchFills = async () => {
        console.log("🔥 Calling Fills API...");
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("https://predator-production.up.railway.app/api/history/fills", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFills(res.data.fills || []);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load fills");
        } finally {
            setLoading(false);
        }
    };



    // fetch on tab change
    useEffect(() => {
        console.log("🔄 Active Tab:", activeTab)
        if (activeTab === "orders") fetchOrders();
        else fetchFills();
    }, [activeTab]);

    return (
        <Card>
            <div className="p-6 bg-gray-900 min-h-screen text-white">
                <h1 className="text-2xl font-bold mb-4">Delta Order & Fills History</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 rounded-lg ${activeTab === "orders"
                            ? "bg-blue-600"
                            : "bg-gray-700 hover:bg-gray-600"}`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("fills")}
                        className={`px-4 py-2 rounded-lg ${activeTab === "fills"
                            ? "bg-blue-600"
                            : "bg-gray-700 hover:bg-gray-600"}`}
                    >
                        Fills
                    </button>
                </div>

                {/* Loading */}
                {loading && <p className="text-blue-400">Loading...</p>}

                {/* Error */}
                {error && <p className="text-red-400 mb-4">{error}</p>}

                {/* Orders Table */}
                {activeTab === "orders" && !loading && (
                    <div className="overflow-auto">
                        <table className="w-full border border-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-2">Symbol</th>
                                    <th className="p-2">Side</th>
                                    <th className="p-2">Size</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="border-t border-gray-700">
                                        <td className="p-2">{o.product_symbol}</td>
                                        <td className="p-2">{o.side}</td>
                                        <td className="p-2">{o.size}</td>
                                        <td className="p-2">{o.price}</td>
                                        <td className="p-2">{o.status}</td>
                                        <td className="p-2">{new Date(o.updated_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Fills Table */}
                {activeTab === "fills" && !loading && (
                    <div className="overflow-auto">
                        <table className="w-full border border-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-2">Symbol</th>
                                    <th className="p-2">Side</th>
                                    <th className="p-2">Size</th>
                                    <th className="p-2">Price</th>
                                    <th className="p-2">Liquidity</th>
                                    <th className="p-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fills.map((f) => (
                                    <tr key={f.id} className="border-t border-gray-700">
                                        <td className="p-2">{f.product_symbol}</td>
                                        <td className="p-2">{f.side}</td>
                                        <td className="p-2">{f.size}</td>
                                        <td className="p-2">{f.price}</td>
                                        <td className="p-2">{f.liquidity}</td>
                                        <td className="p-2">{new Date(f.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Card>
    );
}
