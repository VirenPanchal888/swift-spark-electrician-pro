
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, Printer, Share, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SalaryForm } from "@/components/salary/SalaryForm";
import { SalaryRecordsList } from "@/components/salary/SalaryRecordsList";
import { SalaryHeader } from "@/components/salary/SalaryHeader";

const SalaryRecords = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"form" | "list">("form");

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SalaryHeader 
        activeView={activeView}
        onViewToggle={(view) => setActiveView(view)} 
        onBack={() => navigate("/")} 
      />
      
      <div className="flex-1 p-4">
        {activeView === "form" ? (
          <SalaryForm onViewRecords={() => setActiveView("list")} />
        ) : (
          <SalaryRecordsList onBack={() => setActiveView("form")} />
        )}
      </div>
    </div>
  );
};

export default SalaryRecords;
