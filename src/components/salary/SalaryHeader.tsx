
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalaryHeaderProps {
  activeView: "form" | "list";
  onViewToggle: (view: "form" | "list") => void;
  onBack: () => void;
}

export const SalaryHeader = ({ activeView, onViewToggle, onBack }: SalaryHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-between bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] p-4 text-white">
      <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back</span>
      </Button>

      <h1 className="text-xl font-semibold text-center flex-1">
        Salary Department Records
      </h1>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewToggle(activeView === "form" ? "list" : "form")}
        className="text-white text-sm"
      >
        {activeView === "form" ? "View All" : "Add New"}
      </Button>
    </header>
  );
};
