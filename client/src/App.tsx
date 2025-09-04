import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import StrategiesPage from "@/pages/strategies-page";
import AnalysisPage from "@/pages/analysis-page";
import PortfolioPage from "@/pages/portfolio-page";
import ExpertPicksPage from "@/pages/expert-picks-page";
import { ProtectedRoute } from "./lib/protected-route";
import { CommodityProvider } from "./context/Commoditycontext";


function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/strategies" component={StrategiesPage} />
      <ProtectedRoute path="/analysis" component={AnalysisPage} />
      <ProtectedRoute path="/portfolio" component={PortfolioPage} />
      <ProtectedRoute path="/expert-picks" component={ExpertPicksPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CommodityProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </CommodityProvider>

    </QueryClientProvider>
  );
}

export default App;
