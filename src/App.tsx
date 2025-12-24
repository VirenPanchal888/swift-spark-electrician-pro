import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Calculations from "./pages/Calculations";
import Employees from "./pages/Employees";
import Materials from "./pages/Materials";
import Docs from "./pages/Docs";
import Sites from "./pages/Sites";
import SalaryRecords from "./pages/SalaryRecords";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

const queryClient = new QueryClient();

// Route persistence component
const RoutePersistence = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Save current route to sessionStorage for instant restoration on refresh
    sessionStorage.setItem('lastRoute', location.pathname);
  }, [location.pathname]);
  
  return null;
};

// Navigate to last route on mount
const RestoreRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const lastRoute = sessionStorage.getItem('lastRoute');
    // Only navigate if we're at root and there's a saved route that's not root
    if (location.pathname === '/' && lastRoute && lastRoute !== '/') {
      navigate(lastRoute, { replace: true });
    }
  }, []);
  
  return null;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if this is a refresh or first visit
    // Use sessionStorage to track if app was already loaded in this session
    const hasVisited = sessionStorage.getItem('appLoaded');
    return !hasVisited; // Only show splash on first visit
  });

  useEffect(() => {
    if (showSplash) {
      // Mark that app has been loaded
      sessionStorage.setItem('appLoaded', 'true');
      
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500); // Reduced splash time

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoutePersistence />
          <RestoreRoute />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/calculations" element={<Calculations />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/salary" element={<SalaryRecords />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
