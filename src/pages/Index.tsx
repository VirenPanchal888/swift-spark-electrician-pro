
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BadgeIndianRupee, BarChart3, Building2, Calculator, File, FileText, Home, User, Wallet, Bell, Send } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    transactions,
    employees,
    materials,
    sites
  } = useStore();

  const sendTestSMS = async () => {
    try {
      console.log('Sending test SMS...');
      
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: {
          phone_number: '9607767057',
          message: 'Test message from SwiftSpark Electrician Pro! Your SMS integration is working correctly. 🔌⚡',
          employee_name: 'System Test'
        }
      });

      if (error) {
        console.error('SMS sending failed:', error);
        throw new Error(error.message || 'Failed to send SMS');
      }

      console.log('SMS sent successfully:', data);
      
      toast({
        title: "SMS Sent Successfully",
        description: "Test message sent to 9607767057",
      });
      
    } catch (error) {
      console.error('SMS sending failed:', error);
      
      toast({
        title: "SMS Failed",
        description: `Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };
  
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
        <div className="flex justify-between items-center">
          <h1 className="font-bold mb-6 text-xl">🛠 Electrician Dashboard (Navigate to the different dashboards)</h1>
          <Button onClick={sendTestSMS} className="bg-green-600 hover:bg-green-700">
            <Send className="h-4 w-4 mr-2" />
            Send Test SMS
          </Button>
        </div>
        
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
