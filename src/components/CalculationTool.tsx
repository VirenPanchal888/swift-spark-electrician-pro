
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { MaterialUsage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatRupees } from '@/lib/formatters';

const COLORS = ['#0077B6', '#00B4D8', '#90E0EF', '#FFD700', '#CAF0F8', '#03045E'];

const CalculationTool = () => {
  const { transactions, calculateTotalCost, calculateMaterialUsage } = useStore();
  const [materialUsage, setMaterialUsage] = useState<MaterialUsage[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    setTotalCost(calculateTotalCost());
    setMaterialUsage(calculateMaterialUsage());
  }, [transactions, calculateTotalCost, calculateMaterialUsage]);

  // Create data for pie chart
  const pieData = materialUsage.map((item) => ({
    name: item.materialName,
    value: item.totalCost,
  }));

  // Create data for bar chart
  const barData = materialUsage.map((item) => ({
    name: item.materialName,
    cost: item.totalCost,
    quantity: item.totalQuantity,
  }));

  // Create data for line chart (by date)
  const aggregateByDate = () => {
    const dateMap = new Map<string, number>();
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      const existingAmount = dateMap.get(date) || 0;
      dateMap.set(date, existingAmount + transaction.amount);
    });
    
    return Array.from(dateMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const lineData = aggregateByDate();

  // Custom tooltip formatter for currency values
  const currencyFormatter = (value: number) => formatRupees(value);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm font-normal">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-electric">
              {formatRupees(totalCost)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm font-normal">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-electric">
              {transactions.length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="data-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-500 text-sm font-normal">Materials Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-electric">
              {materialUsage.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="data-card">
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bar" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    if (name === "cost") {
                      return [formatRupees(value as number), "Cost (₹)"];
                    }
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar dataKey="cost" name="Cost (₹)" fill="#0077B6" />
                  <Bar dataKey="quantity" name="Quantity" fill="#FFD700" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="pie" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatRupees(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="line" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatRupees(value as number)} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    name="Daily Spending" 
                    stroke="#0077B6" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="data-card">
        <CardHeader>
          <CardTitle>Material Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Material</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Total Quantity</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Total Cost</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Avg. Cost Per Unit</th>
                </tr>
              </thead>
              <tbody>
                {materialUsage.map((material, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{material.materialName}</td>
                    <td className="py-3 px-4">{material.totalQuantity.toFixed(2)}</td>
                    <td className="py-3 px-4">{formatRupees(material.totalCost)}</td>
                    <td className="py-3 px-4">{formatRupees(material.averageCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculationTool;
