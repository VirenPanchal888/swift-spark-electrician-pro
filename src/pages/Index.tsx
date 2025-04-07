
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Briefcase, Calculator, Package, Files } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatRupees } from '@/lib/formatters';
import TabsMetrics from '@/components/TabsMetrics';

const COLORS = ['#0077B6', '#00B4D8', '#90E0EF', '#FFD700', '#FD7E14'];

const Index = () => {
  const { transactions, employees, sites, calculateTotalCost, calculateMaterialUsage } = useStore();
  
  const totalCost = calculateTotalCost();
  const materialCount = calculateMaterialUsage().length;
  
  // Create data for pie chart
  const pieData = transactions.length ? [
    { name: 'Materials', value: materialCount },
    { name: 'Employees', value: employees.length },
    { name: 'Transactions', value: transactions.length },
    { name: 'Sites', value: sites.length }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="page-container animate-fade-in px-3 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 mobile-stack">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome to Powerhouse</h1>
            <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">Your daily electrician tracker</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto mobile-mt-4">
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 sparkle-btn" asChild>
              <Link to="/transactions">
                <Activity className="mr-2 h-4 w-4" />
                New Transaction
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <TabsMetrics />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mobile-grid-cols-1">
          <Card className="data-card md:col-span-2 lg:col-span-2">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and allocations</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {transactions.length === 0 && employees.length === 0 ? (
                <div className="text-center py-4 md:py-8">
                  <p className="text-muted-foreground mb-4">No activity recorded yet</p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                      <Link to="/transactions">
                        <Activity className="mr-2 h-4 w-4" />
                        Add Transaction
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                      <Link to="/employees">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Add Employee
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {transactions.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2 md:mb-3">Recent Transactions</h3>
                      <div className="space-y-2">
                        {transactions.slice(0, 3).map((transaction) => (
                          <div key={transaction.id} className="flex justify-between items-center p-2 md:p-3 bg-secondary rounded-md">
                            <div>
                              <p className="font-medium text-sm md:text-base">{transaction.materialName}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">
                                {transaction.quantity} units - {formatRupees(transaction.amount)}
                              </p>
                            </div>
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {transactions.length > 3 && (
                        <div className="mt-3 text-right">
                          <Button variant="link" className="text-primary px-0 text-sm" asChild>
                            <Link to="/transactions">
                              View all transactions
                              <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {employees.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2 md:mb-3">Employee Allocations</h3>
                      <div className="space-y-2">
                        {employees.slice(0, 3).map((employee) => (
                          <div key={employee.id} className="flex justify-between items-center p-2 md:p-3 bg-secondary rounded-md">
                            <div>
                              <p className="font-medium text-sm md:text-base">{employee.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">{employee.siteLocation}</p>
                            </div>
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {new Date(employee.startDate).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                      {employees.length > 3 && (
                        <div className="mt-3 text-right">
                          <Button variant="link" className="text-primary px-0 text-sm" asChild>
                            <Link to="/employees">
                              View all employees
                              <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {sites.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-2 md:mb-3">Active Sites</h3>
                      <div className="space-y-2">
                        {sites.slice(0, 3).map((site) => (
                          <div key={site.id} className="flex justify-between items-center p-2 md:p-3 bg-secondary rounded-md">
                            <div>
                              <p className="font-medium text-sm md:text-base">{site.name}</p>
                              <p className="text-xs md:text-sm text-muted-foreground">{site.location}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {site.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      {sites.length > 3 && (
                        <div className="mt-3 text-right">
                          <Button variant="link" className="text-primary px-0 text-sm" asChild>
                            <Link to="/sites">
                              View all sites
                              <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
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
          
          <Card className="data-card md:col-span-2 lg:col-span-2">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">Activity Distribution</CardTitle>
              <CardDescription>Overview of your data</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              {pieData.length > 0 ? (
                <div className="h-56 md:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
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
                <div className="flex flex-col items-center justify-center h-56 md:h-64">
                  <p className="text-muted-foreground mb-4">No data to display</p>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mt-4 md:mt-8 mobile-grid-cols-1">
          <Card className="data-card bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 md:p-6">
            <Activity className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Track Transactions</h3>
            <p className="text-center mb-3 md:mb-4 text-sm md:text-base">Log your daily material usage and expenses</p>
            <Button variant="secondary" className="w-full mt-1 md:mt-2 text-sm" asChild>
              <Link to="/transactions">Go to Transactions</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 md:p-6">
            <Calculator className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Run Calculations</h3>
            <p className="text-center mb-3 md:mb-4 text-sm md:text-base">Generate cost estimates and analyze your data</p>
            <Button variant="secondary" className="w-full mt-1 md:mt-2 text-sm" asChild>
              <Link to="/calculations">Go to Calculations</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 md:p-6">
            <Briefcase className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Manage Employees</h3>
            <p className="text-center mb-3 md:mb-4 text-sm md:text-base">Assign employees to job sites and track allocations</p>
            <Button variant="secondary" className="w-full mt-1 md:mt-2 text-sm" asChild>
              <Link to="/employees">Go to Employees</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-primary text-primary-foreground flex flex-col items-center justify-center p-4 md:p-6">
            <BuildingIcon className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Site Tracker</h3>
            <p className="text-center mb-3 md:mb-4 text-sm md:text-base">Monitor projects, materials and employees at each site</p>
            <Button variant="secondary" className="w-full mt-1 md:mt-2 text-sm" asChild>
              <Link to="/sites">Go to Sites</Link>
            </Button>
          </Card>
          
          <Card className="data-card bg-accent text-accent-foreground flex flex-col items-center justify-center p-4 md:p-6">
            <Files className="h-8 w-8 md:h-12 md:w-12 mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Document Library</h3>
            <p className="text-center mb-3 md:mb-4 text-sm md:text-base">Upload and manage important documents</p>
            <Button variant="secondary" className="w-full mt-1 md:mt-2 text-sm" asChild>
              <Link to="/docs">Go to Documents</Link>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

// Renamed Building to BuildingIcon to avoid naming conflict
function BuildingIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
}
