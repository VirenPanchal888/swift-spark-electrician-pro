
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Calculations from "./pages/Calculations";
import Employees from "./pages/Employees";
import Materials from "./pages/Materials";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Check if this is the first time the user visits the app in this session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
    }
    
    // Initialize theme from localStorage or set default
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Mark app as ready after a short delay to ensure smooth startup
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!appReady) {
    return null; // Return nothing during initial load to prevent flashing
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {showSplash ? (
              <Route path="/" element={<SplashScreen onComplete={() => setShowSplash(false)} />} />
            ) : (
              <Route path="/" element={<Index />} />
            )}
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/calculations" element={<Calculations />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
