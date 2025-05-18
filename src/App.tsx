import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ContactPage from "./pages/ContactPage";
import ContactDemo from "./pages/ContactDemo";
import DemoRequestPage from "./pages/DemoRequestPage";
import MultiPropertyPage from "./pages/MultiPropertyPage";
import Dashboard from "./pages/Dashboard";
import RoomsManagement from "./pages/dashboard/RoomsManagement";
import Bookings from "./pages/dashboard/Bookings";
import AiSalesAgent from "./pages/dashboard/AiSalesAgent";
import AiAutomation from "./pages/dashboard/AiAutomation";
import MarketingTemplates from "./pages/dashboard/MarketingTemplates";
import WhatsappOrders from "./pages/dashboard/WhatsappOrders";
import QrCodeGenerator from "./pages/dashboard/QrCodeGenerator";
import Settings from "./pages/dashboard/Settings";
import Billing from "./pages/dashboard/Billing";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/auth/RequireAuth";

// Front Office Pages
import FrontOffice from "./pages/dashboard/front-office/FrontOffice";
import Reservation from "./pages/dashboard/front-office/Reservation";
import WalkIn from "./pages/dashboard/front-office/WalkIn";
import TodaysEvents from "./pages/dashboard/front-office/TodaysEvents";
import GuestSelfServices from "./pages/dashboard/front-office/GuestSelfServices";
import GuestProfiles from "./pages/dashboard/front-office/GuestProfiles";
import ReservationList from "./pages/dashboard/front-office/ReservationList";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-demo" element={<ContactDemo />} />
            <Route path="/request-demo" element={<DemoRequestPage />} />
            <Route path="/multi-property" element={<MultiPropertyPage />} />
            
            
            {/* Protected Routes */}
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/rooms" element={<RoomsManagement />} />
              <Route path="/dashboard/bookings" element={<Bookings />} />
              <Route path="/dashboard/ai-sales-agent" element={<AiSalesAgent />} />
              <Route path="/dashboard/ai-automation" element={<AiAutomation />} />
              <Route path="/dashboard/marketing" element={<MarketingTemplates />} />
              <Route path="/dashboard/orders" element={<WhatsappOrders />} />
              <Route path="/dashboard/qr-codes" element={<QrCodeGenerator />} />
              <Route path="/dashboard/invoices" element={<Billing />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              
              {/* Front Office Routes */}
              <Route path="/dashboard/front-office" element={<FrontOffice />} />
              <Route path="/dashboard/front-office/reservation" element={<Reservation />} />
              <Route path="/dashboard/front-office/walk-in" element={<WalkIn />} />
              <Route path="/dashboard/front-office/events" element={<TodaysEvents />} />
              <Route path="/dashboard/front-office/guest-services" element={<GuestSelfServices />} />
              <Route path="/dashboard/front-office/guest-profiles" element={<GuestProfiles />} />
              <Route path="/dashboard/front-office/reservation-list" element={<ReservationList />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
          </div>
      </TooltipProvider>
    </QueryClientProvider>
    </ThemeProvider>
);
};

export default App;