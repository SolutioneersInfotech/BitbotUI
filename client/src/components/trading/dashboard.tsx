import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TradingSidebar } from "./sidebar";
import { TechnicalAnalysis } from "./technical-analysis";
import { ActiveTrades } from "./active-trades";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Activity,
  DollarSign,
  Target,
  Wallet,
  Headphones,
  Menu,
  X,
  Zap
} from "lucide-react";
import type { Portfolio, Commodity } from "@shared/schema";
import { useCommodity } from "@/context/Commoditycontext";
import Chart from "@/components/trading/stratigy-chart";
import { BrokerAccounts } from "./BrokerAccount";
import { useDeltaBalance, useEquityChange } from "@/sources/portfolio-source";
// import { BrokerAccounts } from "./BrokerAccount";
import { useActiveTrades } from "@/sources/trades-source";
import DeltaHistory from "./tradehistory";
import { fetchCommodityIndicators } from "@/sources/commodity-source";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // ✅ Fetch Active Trades for the user
  const { data: trades, isLoading, refetch } = useActiveTrades();

  const activeTrades = trades ? trades?.filter((trade) => trade.status === "active") || [] : [];

  // ✅ Global state via context
  const { selectedCommodity, setSelectedCommodity } = useCommodity();
  const [indicators, setIndicators] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState<boolean>(true);

  const { data: equity, isLoading : isLoadingEquity } = useEquityChange();

  console.log("Selected Commodity:", selectedCommodity);

  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "Technical Issue",
    message: ""
  });


  const { data: deltaBalance } = useDeltaBalance();

  console.log("db ",deltaBalance);

  const walletBalance = Number(deltaBalance?.result?.[0]?.balance || 0);

  const { data: portfolio } = useQuery<Portfolio>({
    queryKey: ["/api/portfolio"],
  });

  const { data: commodities } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSupportModal(false);
    setSupportForm({ name: "", email: "", subject: "Technical Issue", message: "" });
  };

  useEffect(() => {
    setLoadingIndicators(true);
  async function loadIndicators() {
    const data = await fetchCommodityIndicators(selectedCommodity);
    setIndicators(data);
    setLoadingIndicators(false);
  }
  loadIndicators();
  
}, [selectedCommodity]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-trading-dark text-white font-inter">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="w-64 bg-trading-card h-full overflow-y-auto flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
              <span className="font-semibold text-white">Menu</span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* ✅ Sidebar with commodity select */}
            <TradingSidebar
              commodities={commodities}
              onSelectCommodity={(c) => setSelectedCommodity(c)}
              selectedCommodity={selectedCommodity}
            />
          </div>
        </div>
      )}

      {/* Navigation - Full Width at Top */}
      <header className="flex-shrink-0 bg-trading-card border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4 text-white"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="text-2xl font-bold text-white">
                <TrendingUp className="inline h-6 w-6 text-trading-success mr-2" />
                BitBot
              </div>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link href="/" className="text-white hover:text-trading-success transition-colors">Dashboard</Link>
              <Link href="/strategies" className="text-gray-400 hover:text-white transition-colors">Strategies</Link>
              <Link href="/analysis" className="text-gray-400 hover:text-white transition-colors">Analysis</Link>
              <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</Link>
              <Link href="/expert-picks" className="text-gray-400 hover:text-white transition-colors">Expert Picks</Link>
              <Link href="/Automation-page" className="text-gray-400 hover:text-white transition-colors">Automation</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-trading-dark px-3 py-2 rounded-lg">
              <Wallet className="h-4 w-4 text-trading-success" />
              <span className="text-white font-medium" data-testid="text-portfolio-balance">
                ${Number(equity?.result?.curr_ae ?? 0).toFixed(2)}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              data-testid="button-logout"
            >
              Logout
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-trading-success to-trading-info rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0] || user?.email?.[0] || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area - Sidebar + Main */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - Fixed Width */}
        <aside className="hidden lg:block w-64 flex-shrink-0 h-full overflow-y-auto bg-trading-card border-r border-gray-700 sidebar-scroll">
          <TradingSidebar
            commodities={commodities}
            onSelectCommodity={(c) => setSelectedCommodity(c)}
            selectedCommodity={selectedCommodity}
          />
        </aside>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto min-h-0 p-6 bg-trading-dark">
          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Portfolio Value */}
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Portfolio Value</h3>
                  <TrendingUp className="h-4 w-4 text-trading-success" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">${(Number(deltaBalance?.meta?.net_equity ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
                <div className="text-trading-success text-sm">
                  <span className="mr-1">Available Margin : $</span>{(Number(deltaBalance?.result?.[0]?.available_balance ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            {/* Active Trades */}
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Active Trades</h3>
                  <Activity className="h-4 w-4 text-trading-info" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{activeTrades.length}</div>
                <div className="text-trading-info text-sm">
                  <span className="mr-1">Locked Margin : $</span>{(Number(deltaBalance?.result?.[0]?.blocked_margin ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            {/* Today's P&L */}
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Total Unrealized P&L</h3>
                  <DollarSign className="h-4 w-4 text-trading-success" />
                </div>
                <div className={(() => {
                  const upnl = Number(equity?.result?.upnl ?? 0);
                  const formatted = Math.abs(upnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
                  const colorClass = upnl < 0 ? "text-red-400" : "text-trading-success";
                  return `text-2xl font-bold mb-1 ${colorClass}`;
                })()}>
                  {(() => {
                  const upnl = Number(equity?.result?.upnl ?? 0);
                  const formatted = Math.abs(upnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });
                  return upnl < 0 ? `-$${formatted}` : `$${formatted}`;
                  })()}
                </div>
                {(() => {
                  const curr = Number(equity?.result?.curr_ae ?? 0);
                  const prev = Number(equity?.result?.previous_ae?.[0]?.total_amount_usd ?? 0);
                  const change = curr === 0 ? 0 : ((curr - prev) * 100) / curr;
                  const absFormatted = Math.abs(change).toFixed(2);

                  if (change < 0) {
                  return (
                    <div className="text-red-400 text-sm">
                    <span className="mr-1">↘</span>-{absFormatted}%
                    </div>
                  );
                  }

                  if (change === 0) {
                  return (
                    <div className="text-gray-400 text-sm">
                    <span className="mr-1">–</span>0.00%
                    </div>
                  );
                  }

                  return (
                  <div className="text-trading-success text-sm">
                    <span className="mr-1">↗</span>+{absFormatted}%
                  </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Win Rate */}
            <Card className="bg-trading-card border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm">Win Rate</h3>
                  <Target className="h-4 w-4 text-trading-warning" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">0%</div>
                <div className="text-gray-400 text-sm">No trades yet</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Technical Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <Card className="bg-trading-card border-gray-700 mb-6">
                {/* ✅ Pass selected commodity */}
                <Chart symbol={selectedCommodity} />
              </Card>

            </div>
            <div>
              <TechnicalAnalysis data={indicators} loading={loadingIndicators}/>
            </div>
          </div>

          {/* Tabs */}
          <Card className="bg-trading-card border-gray-700">
            <Tabs defaultValue="trades" className="w-full">
              <div className="border-b border-gray-700">
                <TabsList className="bg-transparent w-full justify-start px-6 overflow-x-auto flex-nowrap scrollbar-hide">
                  <TabsTrigger value="trades">Active Trades</TabsTrigger>
                  <TabsTrigger value="history">Trade History</TabsTrigger>
                  <TabsTrigger value="brokers">Broker Accounts</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="trades" className="p-6">
                <ActiveTrades activeTrades={activeTrades} isLoading={isLoading} refetch={refetch} />
              </TabsContent>
              <TabsContent value="history" className="p-6">
                <DeltaHistory />
              </TabsContent>
              <TabsContent value="brokers" className="p-6">

                <BrokerAccounts />


              </TabsContent>
              <TabsContent value="subscription" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free Plan */}
                  <Card className="bg-trading-dark border-gray-700">
                    <CardHeader><CardTitle className="text-white">Free Tier</CardTitle></CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-4">$0<span className="text-base text-gray-400">/month</span></div>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Basic market data</li>
                        <li>• 5 active trades</li>
                        <li>• Standard indicators</li>
                      </ul>
                      <Button variant="outline" className="w-full mt-6" disabled>Current Plan</Button>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="bg-gradient-to-br from-trading-purple to-trading-info">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        Pro Tier
                        <span className="bg-trading-warning text-black px-2 py-1 rounded text-xs">RECOMMENDED</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-white mb-4">$49<span className="text-base text-gray-200">/month</span></div>
                      <ul className="space-y-2 text-white">
                        <li>• Real-time market data</li>
                        <li>• Unlimited active trades</li>
                        <li>• All technical indicators</li>
                        <li>• Advanced AI recommendations</li>
                        <li>• 24/7 priority support</li>
                      </ul>
                      <Button className="w-full mt-6 bg-white hover:bg-gray-100 text-gray-900" onClick={() => setShowSubscriptionModal(true)}>
                        Upgrade to Pro
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </main>

        {/* Mobile Navigation - Fixed at Bottom */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-trading-card border-t border-gray-700 px-6 py-3 z-50">
          <div className="flex justify-start overflow-x-auto space-x-6 scrollbar-hide">
            <Link href="/" className="flex flex-col items-center text-white">
              <TrendingUp className="h-5 w-5 mb-1" />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link href="/strategies" className="flex flex-col items-center text-gray-400">
              <Target className="h-5 w-5 mb-1" />
              <span className="text-xs">Strategies</span>
            </Link>
            <Link href="/analysis" className="flex flex-col items-center text-gray-400">
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">Analysis</span>
            </Link>
            <Link href="/portfolio" className="flex flex-col items-center text-gray-400">
              <Wallet className="h-5 w-5 mb-1" />
              <span className="text-xs">Portfolio</span>
            </Link>
            <Link href="/expert-picks" className="flex flex-col items-center text-gray-400">
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs">Picks</span>
            </Link>
            <Link href="/Automation-page" className="flex flex-col items-center text-gray-400">
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs">Automation</span>
            </Link>
            <button onClick={() => setShowSupportModal(true)} className="flex flex-col items-center text-gray-400">
              <Headphones className="h-5 w-5 mb-1" />
              <span className="text-xs">Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <Modal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Upgrade to Pro</h2>
          <p className="text-gray-400 mb-6">Unlock advanced features and maximize your trading potential</p>
          <div className="space-y-4">
            <p className="text-white">Coming soon! Payment processing will be implemented.</p>
            <Button onClick={() => setShowSubscriptionModal(false)} className="w-full">Close</Button>
          </div>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Support</h2>
          <p className="text-gray-400 mb-6">Get help from our trading experts</p>
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Name</Label>
                <Input value={supportForm.name} onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })} className="bg-trading-dark border-gray-600 text-white" placeholder="Your name" required />
              </div>
              <div>
                <Label className="text-gray-300">Email</Label>
                <Input type="email" value={supportForm.email} onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })} className="bg-trading-dark border-gray-600 text-white" placeholder="Your email" required />
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Subject</Label>
              <Select value={supportForm.subject} onValueChange={(value) => setSupportForm({ ...supportForm, subject: value })}>
                <SelectTrigger className="bg-trading-dark border-gray-600 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                  <SelectItem value="Account Question">Account Question</SelectItem>
                  <SelectItem value="Trading Strategy Help">Trading Strategy Help</SelectItem>
                  <SelectItem value="Billing Question">Billing Question</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Message</Label>
              <Textarea value={supportForm.message} onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })} className="bg-trading-dark border-gray-600 text-white" placeholder="Describe your question or issue..." rows={4} required />
            </div>
            <Button type="submit" className="w-full">Submit Request</Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}





