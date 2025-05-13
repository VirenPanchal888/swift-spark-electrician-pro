
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sun, Moon, AlertTriangle, Info } from 'lucide-react';
import { useStore } from '@/lib/store';
import { exportData, exportToExcel, exportToCSV } from '@/lib/backupUtils';
import { exportToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { SiteDataStats } from '@/components/sync/SiteDataStats';

const Settings = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
  );
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetPin, setResetPin] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  
  const store = useStore();
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Theme Activated`,
      description: `The application is now using the ${newTheme} theme.`
    });
  };
  
  const handleResetApplication = async () => {
    if (resetPin !== 'Reset@888') {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsResetting(true);
    
    try {
      // Export all data before resetting
      toast({
        title: "Exporting Data Backups",
        description: "Creating backups before reset..."
      });
      
      // Export to all formats
      await exportData();
      await exportToExcel();
      await exportToPDF();
      await exportToCSV();
      
      toast({
        title: "Backups Created",
        description: "Your data has been backed up before reset"
      });
      
      // Clear all data in the store
      const stateKeys = [
        'transactions', 'employees', 'materials', 'documents', 'sites',
        'siteEmployees', 'siteMaterials', 'siteTasks', 'siteDocuments', 'salaryRecords'
      ];
      
      // Reset each state to empty array
      stateKeys.forEach(key => {
        useStore.setState(state => ({ [key]: [] }));
      });
      
      // Clear local storage except for theme preference
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (theme) localStorage.setItem('theme', theme);
      
      toast({
        title: "Application Reset Complete",
        description: "Your application has been reset to its initial state."
      });
      
      setResetDialogOpen(false);
      setResetPin('');
    } catch (error) {
      console.error("Reset failed:", error);
      toast({
        title: "Reset Failed",
        description: "An error occurred during the reset process.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Manage the visual preferences for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{theme === 'light' ? 'Light' : 'Dark'} Mode</span>
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Data Backup & Sync */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Backup, sync, and reset your application data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SiteDataStats />
              
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setResetDialogOpen(true)}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Reset Application Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About the Application */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                About This Application
              </CardTitle>
              <CardDescription>Information about the application and its purpose</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <p>
                  This construction management application was developed to streamline the process of managing construction projects, 
                  resources, and finances. It provides a comprehensive solution for tracking materials, employees, documents, 
                  transactions, and site progress all in one place.
                </p>
                <p>
                  The application enables construction managers to efficiently allocate resources, monitor expenses, 
                  generate reports, and maintain clear communication across all project stakeholders.
                </p>
                <p>
                  Key features include:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Site management and task tracking</li>
                  <li>Employee allocation and salary management</li>
                  <li>Materials inventory and usage tracking</li>
                  <li>Document storage and organization</li>
                  <li>Financial transaction recording</li>
                  <li>Data backup and export capabilities</li>
                </ul>
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm text-muted-foreground text-right italic">
                    Designed and Developed by Viren Panchal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Application Data</DialogTitle>
              <DialogDescription>
                This action will export all your data and then reset the application to its initial state.
                All data will be permanently removed. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Enter security PIN to confirm reset:</p>
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={resetPin}
                  onChange={(e) => setResetPin(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">PIN Format: Reset@888</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetDialogOpen(false)} disabled={isResetting}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleResetApplication}
                disabled={isResetting || !resetPin}
              >
                {isResetting ? "Exporting & Resetting..." : "Reset Application"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Settings;
