import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { BadgeIndianRupee, BarChart3, Building2, Calculator, File, FileText, Home, User, Wallet, Bell } from "lucide-react";

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
  }, {
    title: "SMS Notifications",
    description: "Send SMS to 9607767057",
    icon: <Bell />,
    path: "/notifications",
    color: "bg-orange-500"
  }];
  
  return <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 space-y-6">
        <h1 className="font-bold mb-6 text-xl">🛠 Electrician Dashboard (Navigate to the different dashboards)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => <Card key={index} className="hover:border-primary/50 cursor-pointer transition-all hover:shadow-md" onClick={() => navigate(feature.path)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <div className={`${feature.color} p-2 rounded-full text-white`}>
                    {feature.icon}
                  </div>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>)}
        </div>
      </div>
    </div>;
};
export default Index;
