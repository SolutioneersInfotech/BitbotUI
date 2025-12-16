// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, Trash } from "lucide-react";

// export function BrokerAccounts() {
//     const queryClient = useQueryClient();

//     // ✅ Fetch connected accounts
//     const { data: accounts, isLoading } = useQuery<any[]>({ // Specify accounts as an array
//         queryKey: ["/api/exchange/accounts"],
//     });

//     // ✅ Form state
//     const [brokerForm, setBrokerForm] = useState({
//         exchange: "",
//         apiKey: "",
//         apiSecret: "",
//         passphrase: "",
//     });

//     // ✅ Connect Broker API call
//     const { mutate: connectBroker, isPending: isConnecting } = useMutation({
//         mutationFn: async () => {
//             const res = await fetch("/api/exchange/connect", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(brokerForm),
//             });
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || "Failed to connect");
//             }
//             return res.json();
//         },
//         onSuccess: () => {
//             setBrokerForm({ exchange: "", apiKey: "", apiSecret: "", passphrase: "" });
//             queryClient.invalidateQueries({ queryKey: ["/api/exchange/accounts"] });
//         },
//     });

//     // ✅ Disconnect Broker API call
//     const { mutate: disconnectBroker } = useMutation({
//         mutationFn: async (id) => {
//             await fetch(`/api/exchange/disconnect/${id}`, { method: "DELETE" });
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["/api/exchange/accounts"] });
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         connectBroker();
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* ✅ Connect New Broker */}
//             <Card className="bg-trading-dark border-gray-700">
//                 <CardHeader>
//                     <CardTitle className="text-white">Connect Broker Account</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <Label className="text-gray-300">Exchange</Label>
//                             <Select
//                                 value={brokerForm.exchange}
//                                 onValueChange={(value) => setBrokerForm({ ...brokerForm, exchange: value })}
//                             >
//                                 <SelectTrigger className="bg-trading-card border-gray-600 text-white">
//                                     <SelectValue placeholder="Select exchange" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="binance">Binance</SelectItem>
//                                     <SelectItem value="delta">Delta Exchange</SelectItem>
//                                     <SelectItem value="okx">OKX</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div>
//                             <Label className="text-gray-300">API Key</Label>
//                             <Input
//                                 value={brokerForm.apiKey}
//                                 onChange={(e) => setBrokerForm({ ...brokerForm, apiKey: e.target.value })}
//                                 placeholder="Enter API Key"
//                                 required
//                                 className="bg-trading-card border-gray-600 text-white"
//                             />
//                         </div>

//                         <div>
//                             <Label className="text-gray-300">API Secret</Label>
//                             <Input
//                                 value={brokerForm.apiSecret}
//                                 onChange={(e) => setBrokerForm({ ...brokerForm, apiSecret: e.target.value })}
//                                 placeholder="Enter API Secret"
//                                 required
//                                 className="bg-trading-card border-gray-600 text-white"
//                             />
//                         </div>

//                         {/* OKX ke liye optional passphrase */}
//                         {brokerForm.exchange === "okx" && (
//                             <div>
//                                 <Label className="text-gray-300">Passphrase</Label>
//                                 <Input
//                                     value={brokerForm.passphrase}
//                                     onChange={(e) => setBrokerForm({ ...brokerForm, passphrase: e.target.value })}
//                                     placeholder="Enter Passphrase"
//                                     className="bg-trading-card border-gray-600 text-white"
//                                 />
//                             </div>
//                         )}

//                         <Button
//                             type="submit"
//                             className="w-full bg-trading-info hover:bg-blue-600"
//                             disabled={isConnecting}
//                         >
//                             {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                             {isConnecting ? "Connecting..." : "Connect"}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>

//             {/* ✅ Connected Accounts List */}
//             <Card className="bg-trading-dark border-gray-700">
//                 <CardHeader>
//                     <CardTitle className="text-white">Connected Accounts</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {isLoading ? (
//                         <div className="text-gray-400 text-center py-4">Loading...</div>
//                     ) : accounts && accounts.length > 0 ? (
//                         <ul className="space-y-3">
//                             {accounts.map((acc: any) => (
//                                 <li key={acc._id} className="flex items-center justify-between bg-trading-card p-3 rounded">
//                                     <div>
//                                         <div className="text-white font-semibold capitalize">{acc.exchange}</div>
//                                         <div className="text-gray-400 text-sm truncate">Key: {acc.maskedKey}</div>
//                                     </div>
//                                     <button
//                                         onClick={() => disconnectBroker(acc._id)}
//                                         className="text-gray-400 hover:text-red-500"
//                                         title="Disconnect"
//                                     >
//                                         <Trash className="h-5 w-5" />
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="text-gray-400 text-center py-4">No accounts connected</div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, Trash } from "lucide-react";

// export function BrokerAccounts() {
//     const queryClient = useQueryClient();

//     // ✅ Fetch connected accounts
//     const { data: accounts, isLoading } = useQuery<any[]>({
//         queryKey: ["/api/exchange/list"],
//         queryFn: async () => {
//             const res = await fetch("http://localhost:3000/api/exchange/list");
//             if (!res.ok) throw new Error("Failed to fetch accounts");
//             return res.json();
//         },
//     });

//     // ✅ Form state
//     const [brokerForm, setBrokerForm] = useState({
//         exchange: "",
//         apiKey: "",
//         apiSecret: "",
//         passphrase: "",
//     });

//     // ✅ Connect Broker API call
//     const { mutate: connectBroker, isPending: isConnecting } = useMutation({
//         mutationFn: async () => {
//             const res = await fetch("http://localhost:3000/api/exchange/connect", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(brokerForm),
//             });
//             if (!res.ok) {
//                 const err = await res.json();
//                 throw new Error(err.message || "Failed to connect");
//             }
//             return res.json();
//         },
//         onSuccess: () => {
//             setBrokerForm({ exchange: "", apiKey: "", apiSecret: "", passphrase: "" });
//             queryClient.invalidateQueries({ queryKey: ["accounts"] });
//         },
//     });

//     // ✅ Disconnect Broker API call
//     const { mutate: disconnectBroker } = useMutation({
//         mutationFn: async (id: string) => {
//             const res = await fetch(`http://localhost:3000/api/exchange/disconnect/${id}`, { method: "DELETE" });
//             if (!res.ok) throw new Error("Failed to disconnect account");
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["accounts"] });
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!brokerForm.exchange || !brokerForm.apiKey || !brokerForm.apiSecret) return;
//         connectBroker();
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* ✅ Connect New Broker */}
//             <Card className="bg-trading-dark border-gray-700">
//                 <CardHeader>
//                     <CardTitle className="text-white">Connect Broker Account</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div>
//                             <Label className="text-gray-300">Exchange</Label>
//                             <Select
//                                 value={brokerForm.exchange}
//                                 onValueChange={(value) => setBrokerForm({ ...brokerForm, exchange: value })}
//                             >
//                                 <SelectTrigger className="bg-trading-card border-gray-600 text-white">
//                                     <SelectValue placeholder="Select exchange" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="binance">Binance</SelectItem>
//                                     <SelectItem value="delta">Delta Exchange</SelectItem>
//                                     <SelectItem value="okx">OKX</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div>
//                             <Label className="text-gray-300">API Key</Label>
//                             <Input
//                                 value={brokerForm.apiKey}
//                                 onChange={(e) => setBrokerForm({ ...brokerForm, apiKey: e.target.value })}
//                                 placeholder="Enter API Key"
//                                 required
//                                 className="bg-trading-card border-gray-600 text-white"
//                             />
//                         </div>

//                         <div>
//                             <Label className="text-gray-300">API Secret</Label>
//                             <Input
//                                 value={brokerForm.apiSecret}
//                                 onChange={(e) => setBrokerForm({ ...brokerForm, apiSecret: e.target.value })}
//                                 placeholder="Enter API Secret"
//                                 required
//                                 className="bg-trading-card border-gray-600 text-white"
//                             />
//                         </div>

//                         {brokerForm.exchange === "okx" && (
//                             <div>
//                                 <Label className="text-gray-300">Passphrase</Label>
//                                 <Input
//                                     value={brokerForm.passphrase}
//                                     onChange={(e) => setBrokerForm({ ...brokerForm, passphrase: e.target.value })}
//                                     placeholder="Enter Passphrase"
//                                     className="bg-trading-card border-gray-600 text-white"
//                                 />
//                             </div>
//                         )}

//                         <Button
//                             type="submit"
//                             className="w-full bg-trading-info hover:bg-blue-600"
//                             disabled={isConnecting}
//                         >
//                             {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                             {isConnecting ? "Connecting..." : "Connect"}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>

//             {/* ✅ Connected Accounts List */}
//             <Card className="bg-trading-dark border-gray-700">
//                 <CardHeader>
//                     <CardTitle className="text-white">Connected Accounts</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {isLoading ? (
//                         <div className="text-gray-400 text-center py-4">Loading...</div>
//                     ) : accounts && accounts.length > 0 ? (
//                         <ul className="space-y-3">
//                             {accounts.map((acc: any) => (
//                                 <li key={acc._id} className="flex items-center justify-between bg-trading-card p-3 rounded">
//                                     <div>
//                                         <div className="text-white font-semibold capitalize">{acc.exchange}</div>
//                                         <div className="text-gray-400 text-sm truncate">Key: {acc.maskedKey}</div>
//                                     </div>
//                                     <button
//                                         onClick={() => disconnectBroker(acc._id)}
//                                         className="text-gray-400 hover:text-red-500"
//                                         title="Disconnect"
//                                     >
//                                         <Trash className="h-5 w-5" />
//                                     </button>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div className="text-gray-400 text-center py-4">No accounts connected</div>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash } from "lucide-react";

export function BrokerAccounts() {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token"); // JWT token from localStorage

    // ✅ Fetch connected accounts
    const { data: accounts, isLoading } = useQuery<any[]>({
        queryKey: ["/api/exchange/list"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/api/exchange/list", {
                headers: {
                    "Authorization": `Bearer ${token}`, // ✅ add token
                },
            });
            if (!res.ok) throw new Error("Failed to fetch accounts");
            return res.json();
        },
    });

    // ✅ Form state
    const [brokerForm, setBrokerForm] = useState({
        exchange: "",
        apiKey: "",
        apiSecret: "",
        passphrase: "",
    });

    // ✅ Connect Broker API call
    const { mutate: connectBroker, isPending: isConnecting } = useMutation({
        mutationFn: async () => {
            const res = await fetch("http://localhost:3000/api/exchange/connect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // ✅ add token
                },
                body: JSON.stringify(brokerForm),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to connect");
            }
            return res.json();
        },
        onSuccess: () => {
            setBrokerForm({ exchange: "", apiKey: "", apiSecret: "", passphrase: "" });
            queryClient.invalidateQueries({ queryKey: ["/api/exchange/list"] });
        },
    });

    // ✅ Disconnect Broker API call
    const { mutate: disconnectBroker } = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`https://predator-production.up.railway.app/api/exchange/disconnect/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`, // ✅ add token
                },
            });
            if (!res.ok) throw new Error("Failed to disconnect account");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/exchange/list"] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!brokerForm.exchange || !brokerForm.apiKey || !brokerForm.apiSecret) return;
        connectBroker();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ✅ Connect New Broker */}
            <Card className="bg-trading-dark border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Connect Broker Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="text-gray-300">Exchange</Label>
                            <Select
                                value={brokerForm.exchange}
                                onValueChange={(value) => setBrokerForm({ ...brokerForm, exchange: value })}
                            >
                                <SelectTrigger className="bg-trading-card border-gray-600 text-white">
                                    <SelectValue placeholder="Select exchange" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="binance">Binance</SelectItem>
                                    <SelectItem value="delta">Delta Exchange</SelectItem>
                                    <SelectItem value="okx">OKX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="text-gray-300">API Key</Label>
                            <Input
                                value={brokerForm.apiKey}
                                onChange={(e) => setBrokerForm({ ...brokerForm, apiKey: e.target.value })}
                                placeholder="Enter API Key"
                                required
                                className="bg-trading-card border-gray-600 text-white"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-300">API Secret</Label>
                            <Input
                                value={brokerForm.apiSecret}
                                onChange={(e) => setBrokerForm({ ...brokerForm, apiSecret: e.target.value })}
                                placeholder="Enter API Secret"
                                required
                                className="bg-trading-card border-gray-600 text-white"
                            />
                        </div>

                        {brokerForm.exchange === "okx" && (
                            <div>
                                <Label className="text-gray-300">Passphrase</Label>
                                <Input
                                    value={brokerForm.passphrase}
                                    onChange={(e) => setBrokerForm({ ...brokerForm, passphrase: e.target.value })}
                                    placeholder="Enter Passphrase"
                                    className="bg-trading-card border-gray-600 text-white"
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-trading-info hover:bg-blue-600"
                            disabled={isConnecting}
                        >
                            {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isConnecting ? "Connecting..." : "Connect"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* ✅ Connected Accounts List */}
            <Card className="bg-trading-dark border-gray-700">
                <CardHeader>
                    <CardTitle className="text-white">Connected Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-gray-400 text-center py-4">Loading...</div>
                    ) : accounts && accounts.length > 0 ? (
                        <ul className="space-y-3">
                            {accounts.map((acc: any) => (
                                <li key={acc._id} className="flex items-center justify-between bg-trading-card p-3 rounded">
                                    <div>
                                        <div className="text-white font-semibold capitalize">{acc.exchange}</div>
                                        <div className="text-gray-400 text-sm truncate">Key: {acc.maskedKey}</div>
                                    </div>
                                    <button
                                        onClick={() => disconnectBroker(acc._id)}
                                        className="text-gray-400 hover:text-red-500"
                                        title="Disconnect"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-400 text-center py-4">No accounts connected</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

