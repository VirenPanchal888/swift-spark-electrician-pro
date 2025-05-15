
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SalaryForm } from "@/components/salary/SalaryForm";
import { SalaryRecordsList } from "@/components/salary/SalaryRecordsList";
import { SalaryHeader } from "@/components/salary/SalaryHeader";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const SalaryRecords = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"form" | "list">("form");
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      <SalaryHeader 
        activeView={activeView}
        onViewToggle={(view) => setActiveView(view)} 
        onBack={() => navigate("/")} 
      />
      
      <div className={`container mx-auto ${isMobile ? 'px-2 pt-2' : 'px-4 pt-4'}`}>
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center">
                <Home className="h-3 w-3 mr-1" />
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Salary Records</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className={`flex-1 ${isMobile ? 'p-2' : 'p-4'} w-full`}>
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
