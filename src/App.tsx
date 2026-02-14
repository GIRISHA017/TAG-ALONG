import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Lockout from "./pages/Lockout";
import NewDevicePending from "./pages/NewDevicePending";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Explore from "./pages/Explore";
import EventDetail from "./pages/EventDetail";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import HostEvent from "./pages/HostEvent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { authState, user, isLockedOut } = useAuth();

  if (authState === "splash") return <SplashScreen />;
  if (isLockedOut) return <Lockout />;
  if (authState === "new_device_pending") return <NewDevicePending />;
  if (authState === "login") return <Login />;
  if (authState === "register") return <Register />;
  if (authState === "forgot_password") return <ForgotPassword />;
  if (authState === "authenticated" && user) return <>{children}</>;

  return <Login />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthGate><Index /></AuthGate>} />
            <Route path="/events" element={<AuthGate><Events /></AuthGate>} />
            <Route path="/explore/:category" element={<AuthGate><Explore /></AuthGate>} />
            <Route path="/event/:id" element={<AuthGate><EventDetail /></AuthGate>} />
            <Route path="/chat" element={<AuthGate><Chat /></AuthGate>} />
            <Route path="/notifications" element={<AuthGate><Notifications /></AuthGate>} />
            <Route path="/profile" element={<AuthGate><Profile /></AuthGate>} />
            <Route path="/host-event" element={<AuthGate><HostEvent /></AuthGate>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
