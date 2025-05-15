
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, File, FileText, FilePlusIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { exportData, exportToExcel, exportToCSV } from '@/lib/backupUtils';
import { exportToPDF } from '@/lib/exportUtils';
import { useState } from 'react';
import { useActiveTime } from '@/hooks/use-active-time';
import { SyncIndicator } from './SyncIndicator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { importData, importFromExcel } from '@/lib/backupUtils';
import { toast } from '@/components/ui/use-toast';

export const SiteDataStats = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { formatActiveTime } = useActiveTime();
  
  const transactions = useStore(state => state.transactions);
  const employees = useStore(state => state.employees);
  const materials = useStore(state => state.materials);
  const sites = useStore(state => state.sites);
  const documents = useStore(state => state.documents);
  
  const handleExport = async (exportFn: () => Promise<void> | void) => {
    try {
      setIsExporting(true);
      toast({
        title: "Export Started",
        description: "Preparing your file for download..."
      });
      
      await exportFn();
      
      toast({
        title: "Export Successful",
        description: "Your file has been downloaded successfully."
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsExporting(true);
      // Check file extension
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        await importData(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        await importFromExcel(file);
      } else {
        toast({
          title: "Import Failed",
          description: "Unsupported file format. Please use .json or .xlsx files.",
          variant: "destructive"
        });
      }
      
      setImportDialogOpen(false);
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <span>🧠 Data Control Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="justify-start w-full"
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Comprehensive Export Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport(exportData)}>
                <File className="mr-2 h-4 w-4" />
                Complete JSON Backup (All Historical Data)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport(exportToExcel)}>
                <File className="mr-2 h-4 w-4" />
                Full Excel Spreadsheet (All Sheets)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(exportToPDF)}>
                <FilePlusIcon className="mr-2 h-4 w-4" />
                Detailed PDF Report with Screenshots
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport(exportToCSV)}>
                <FileText className="mr-2 h-4 w-4" />
                Complete CSV Archive (Zip)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => setImportDialogOpen(true)}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4 rotate-180" />
            Import Data
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <SyncIndicator />
          
          <div className="text-xs text-muted-foreground">
            <div>Transactions: {transactions.length}</div>
            <div>Employees: {employees.length}</div>
            <div>Sites: {sites.length}</div>
          </div>
        </div>
      </CardContent>
      
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload JSON backup or Excel file to restore your complete historical data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <input
              type="file"
              accept=".json,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary file:text-primary-foreground
                         hover:file:bg-primary/90"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
