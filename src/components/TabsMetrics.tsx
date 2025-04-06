
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatRupees } from '@/lib/formatters';
import { Package2, Users, CreditCard } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';

const TabsMetrics = () => {
  const { transactions, employees, calculateTotalCost, calculateMaterialUsage } = useStore();
  const [activeTab, setActiveTab] = useState("totalSpent");
  
  // Metrics data
  const totalCost = calculateTotalCost();
  const materialCount = calculateMaterialUsage().length;
  
  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Animate counter effect for numbers
  const CounterAnimation = ({ value, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      // Animate from 0 to value over 1.5 seconds
      let start = 0;
      const end = parseInt(value.toString().replace(/[^\d.-]/g, ''));
      if (!end) return;
      
      // Get animation duration based on value size (faster for smaller numbers)
      const duration = Math.min(1500, Math.max(500, end / 10));
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start > end) start = end;
        setCount(Math.floor(start));
        if (start === end) clearInterval(timer);
      }, 16);
      
      return () => clearInterval(timer);
    }, [value]);
    
    return (
      <div className="text-3xl font-bold text-primary">
        {prefix}{typeof value === 'string' && value.includes('₹') 
          ? formatRupees(count) 
          : count}{suffix}
      </div>
    );
  };
  
  return (
    <div className="w-full mb-8">
      <Tabs 
        defaultValue="totalSpent" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger 
            value="totalSpent"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Total Spent</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="materialsUsed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="flex items-center">
              <Package2 className="mr-2 h-4 w-4" />
              <span>Materials Used</span>
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="activeEmployees"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              <span>Active Employees</span>
            </span>
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <TabsContent value="totalSpent" className="mt-0">
            <motion.div
              key="totalSpent"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-border shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Total Expenditure</h3>
                      <CounterAnimation value={formatRupees(totalCost)} />
                      <p className="text-muted-foreground mt-2">
                        {transactions.length} total transactions
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-primary/10 rounded-full p-6">
                      <CreditCard className="text-primary h-12 w-12" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-medium mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                      {transactions.slice(0, 3).map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div>
                            <p className="font-medium">{transaction.materialName}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.quantity} units
                            </p>
                          </div>
                          <span className="font-medium">
                            {formatRupees(transaction.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="materialsUsed" className="mt-0">
            <motion.div
              key="materialsUsed"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-border shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Materials Inventory</h3>
                      <CounterAnimation value={materialCount} suffix=" materials" />
                      <p className="text-muted-foreground mt-2">
                        Used across multiple sites
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-primary/10 rounded-full p-6">
                      <Package2 className="text-primary h-12 w-12" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-medium mb-3">Top Materials</h4>
                    <div className="space-y-2">
                      {calculateMaterialUsage().slice(0, 3).map((material) => (
                        <div key={material.materialName} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div>
                            <p className="font-medium">{material.materialName}</p>
                            <p className="text-sm text-muted-foreground">
                              Used across various sites
                            </p>
                          </div>
                          <span className="font-medium">
                            {material.totalQuantity} units
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="activeEmployees" className="mt-0">
            <motion.div
              key="activeEmployees"
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card className="border-border shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Workforce</h3>
                      <CounterAnimation value={employees.length} suffix=" employees" />
                      <p className="text-muted-foreground mt-2">
                        Working across {new Set(employees.map(e => e.siteLocation)).size} locations
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-primary/10 rounded-full p-6">
                      <Users className="text-primary h-12 w-12" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h4 className="font-medium mb-3">Team Members</h4>
                    <div className="space-y-2">
                      {employees.slice(0, 3).map((employee) => (
                        <div key={employee.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {employee.siteLocation}
                            </p>
                          </div>
                          <span className="text-sm px-2 py-1 bg-primary/10 rounded-full">
                            Since {new Date(employee.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default TabsMetrics;
