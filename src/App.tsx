
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Calculations from "./pages/Calculations";
import Employees from "./pages/Employees";
import Materials from "./pages/Materials";
import Docs from "./pages/Docs";
import Sites from "./pages/Sites";
import SalaryRecords from "./pages/SalaryRecords";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import "./App.css";

const queryClient = new QueryClient();

// Initialize Supabase client
const supabaseUrl = 'https://wvghzvlkcovinxbayihf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Z2h6dmxrY292aW5meGJheWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODQyNjQsImV4cCI6MjA2NDc2MDI2NH0.gei5XmtGXDcdAF39pGr_o82PM1B_Oj_shClMo1KJj0Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  // Send startup notification
  const sendStartupNotification = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phone_number: '9607767057',
          message: 'SwiftSpark Electrician Pro application has started successfully! 🚀',
          employee_name: 'System'
        }
      });

      if (error) {
        console.error('Failed to send startup notification:', error);
      } else {
        console.log('Startup notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending startup notification:', error);
    }
  };

  // Check if this is the first time the user visits the app in this session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    
    if (hasVisited) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasVisited", "true");
      // Send startup notification on first visit
      sendStartupNotification();
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
            <Route path="/sites" element={<Sites />} />
            <Route path="/salary" element={<SalaryRecords />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
