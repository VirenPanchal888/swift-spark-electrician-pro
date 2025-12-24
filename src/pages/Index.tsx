import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { BadgeIndianRupee, BarChart3, Building2, Calculator, FileText, User, Wallet } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const {
    transactions,
    employees,
    materials,
    sites
  } = useStore();
  
  const features = [{
    title: "Transactions",
    description: `${transactions.length} Transactions recorded`,
    icon: <BadgeIndianRupee />,
    path: "/transactions",
    color: "bg-blue-500"
  }, {
    title: "Calculations",
    description: "Cost estimates and analytics",
    icon: <Calculator />,
    path: "/calculations",
    color: "bg-green-500"
  }, {
    title: "Employees",
    description: `${employees.length} Employees listed`,
    icon: <User />,
    path: "/employees",
    color: "bg-yellow-500"
  }, {
    title: "Materials",
    description: `${materials.length} Materials tracked`,
    icon: <BarChart3 />,
    path: "/materials",
    color: "bg-purple-500"
  }, {
    title: "Documents",
    description: "Receipts and permits",
    icon: <FileText />,
    path: "/docs",
    color: "bg-red-500"
  }, {
    title: "Sites",
    description: `${sites.length} Sites managed`,
    icon: <Building2 />,
    path: "/sites",
    color: "bg-indigo-500"
  }, {
    title: "Salary Records",
    description: "Manage employee payments",
    icon: <Wallet />,
    path: "/salary",
    color: "bg-pink-500"
  }];
  
  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      <div className="w-full px-3 py-4 sm:px-4 md:container md:px-6 space-y-4">
        <h1 className="font-bold text-lg sm:text-xl">🛠 Electrician Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md active:scale-[0.98]" 
              onClick={() => navigate(feature.path)}
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                  <div className={`${feature.color} p-2 rounded-full text-primary-foreground`}>
                    {feature.icon}
                  </div>
                </div>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Index;
