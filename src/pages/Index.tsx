
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Briefcase, Calculator, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatRupees } from '@/lib/formatters';

const COLORS = ['#0077B6', '#00B4D8', '#90E0EF', '#FFD700'];

const Index = () => {
  const { transactions, employees, calculateTotalCost, calculateMaterialUsage } = useStore();
  
  const totalCost = calculateTotalCost();
  const materialCount = calculateMaterialUsage().length;
  
  // Create data for pie chart
  const pieData = transactions.length ? [
    { name: 'Materials', value: materialCount },
    { name: 'Employees', value: employees.length },
    { name: 'Transactions', value: transactions.length },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Powerhouse Solution</h1>
            <p className="text-gray-600 mt-2">Your daily electrician transaction & calculation tracker</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button className="bg-electric hover:bg-electric-dark sparkle-btn" asChild>
              <Link to="/transactions">
                <Activity className="mr-2 h-4 w-4" />
                New Transaction
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="data-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 text-sm font-normal">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-electric">
                  {formatRupees(totalCost)}
                </div>
                <div className="h-8 w-8 text-electric-light">₹</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="data-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 text-sm font-normal">Materials Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-electric">
                  {materialCount}
                </div>
                <Package className="h-8 w-8 text-electric-light" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="data-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-500 text-sm font-normal">Active Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-electric">
                  {employees.length}
                </div>
                <Briefcase className="h-8 w-8 text-electric-light" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="data-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and allocations</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 && employees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No activity recorded yet</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" asChild>
                      <Link to="/transactions">
                        <Activity className="mr-2 h-4 w-4" />
                        Add Transaction
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/employees">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Add Employee
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {transactions.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-3">Recent Transactions</h3>
                      <div className="space-y-2">
                        {transactions.slice(0, 3).map((transaction) => (
                          <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium">{transaction.materialName}</p>
                              <p className="text-sm text-gray-500">
                                {transaction.quantity} units - {formatRupees(transaction.amount)}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {transactions.length > 3 && (
                        <div className="mt-3 text-right">
                          <Button variant="link" className="text-electric px-0" asChild>
                            <Link to="/transactions">
                              View all transactions
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {employees.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-3">Employee Allocations</h3>
                      <div className="space-y-2">
                        {employees.slice(0, 3).map((employee) => (
                          <div key={employee.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-gray-500">{employee.siteLocation}</p>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(employee.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {employees.length > 3 && (
                        <div className="mt-3 text-right">
                          <Button variant="link" className="text-electric px-0" asChild>
                            <Link to="/employees">
                              View all employees
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="data-card">
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
              <CardDescription>Overview of your data</CardDescription>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-gray-500 mb-4">No data to display</p>
                  <Button variant="outline" asChild>
                    <Link to="/transactions">
                      Add Data
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="data-card bg-electric text-white flex flex-col items-center justify-center p-6">
            <Activity className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Track Transactions</h3>
            <p className="text-center mb-4">Log your daily material usage and expenses</p>
            <Button variant="secondary" className="w-full mt-2" asChild>
              <Link to="/transactions">Go to Transactions</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-electric-dark text-white flex flex-col items-center justify-center p-6">
            <Calculator className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Run Calculations</h3>
            <p className="text-center mb-4">Generate cost estimates and analyze your data</p>
            <Button variant="secondary" className="w-full mt-2" asChild>
              <Link to="/calculations">Go to Calculations</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-electric-light text-white flex flex-col items-center justify-center p-6">
            <Briefcase className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Employees</h3>
            <p className="text-center mb-4">Assign employees to job sites and track allocations</p>
            <Button variant="secondary" className="w-full mt-2" asChild>
              <Link to="/employees">Go to Employees</Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
