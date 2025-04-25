
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import RoomsManagement from "./pages/dashboard/RoomsManagement";
import BookingsManagement from "./pages/dashboard/BookingsManagement";
import AiSalesAgent from "./pages/dashboard/AiSalesAgent";
import AiAutomation from "./pages/dashboard/AiAutomation";
import MarketingTemplates from "./pages/dashboard/MarketingTemplates";
import WhatsappOrders from "./pages/dashboard/WhatsappOrders";
import QrCodeGenerator from "./pages/dashboard/QrCodeGenerator";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/rooms" element={<RoomsManagement />} />
            <Route path="/dashboard/bookings" element={<BookingsManagement />} />
            <Route path="/dashboard/ai-sales-agent" element={<AiSalesAgent />} />
            <Route path="/dashboard/ai-automation" element={<AiAutomation />} />
            <Route path="/dashboard/marketing" element={<MarketingTemplates />} />
            <Route path="/dashboard/orders" element={<WhatsappOrders />} />
            <Route path="/dashboard/qr-codes" element={<QrCodeGenerator />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
