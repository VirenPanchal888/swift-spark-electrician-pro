
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalaryHeaderProps {
  activeView: "form" | "list";
  onViewToggle: (view: "form" | "list") => void;
  onBack: () => void;
}

export const SalaryHeader = ({ activeView, onViewToggle, onBack }: SalaryHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-between bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] p-2 sm:p-4 text-white">
      <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={onBack} className="text-white p-1">
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="sr-only">Back</span>
      </Button>

      <h1 className={`text-base sm:text-xl font-semibold text-center flex-1 ${isMobile ? "mx-0.5" : "mx-2"}`}>
        {isMobile ? "Salary Records" : "Salary Department Records"}
      </h1>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewToggle(activeView === "form" ? "list" : "form")}
        className="text-white text-xs sm:text-sm p-1 sm:p-2"
      >
        {activeView === "form" ? "View All" : "Add New"}
      </Button>
    </header>
  );
};
