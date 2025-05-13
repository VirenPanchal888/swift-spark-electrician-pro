
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Upload,
  CloudUpload,
  Save,
  Timer,
  File
} from 'lucide-react';
import { exportData, exportToExcel, exportToCSV, importData } from '@/lib/backupUtils';
import { exportToPDF } from '@/lib/exportUtils';
import { SyncIndicator } from './SyncIndicator';
import { useActiveTime } from '@/hooks/use-active-time';

export const BackupControlPanel = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { toast } = useToast();
  const { lastActive, formatActiveTime } = useActiveTime();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Check file extension
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        await importData(text);
        setImportDialogOpen(false);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        toast({
          title: "Excel Import",
          description: "Excel import functionality is in progress."
        });
      } else {
        toast({
          title: "Import Failed",
          description: "Unsupported file format. Please use .json files.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import data. The file might be corrupted.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <CloudUpload className="h-4 w-4" />
          Backup &amp; Sync
        </CardTitle>
        <CardDescription>
          {lastActive 
            ? `Last updated ${formatActiveTime(lastActive.getTime())}`
            : 'No recent changes'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="justify-start w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => exportData()}>
                <Save className="mr-2 h-4 w-4" />
                Full Backup (JSON)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportToExcel()}>
                <File className="mr-2 h-4 w-4" />
                Excel Spreadsheet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToPDF()}>
                <File className="mr-2 h-4 w-4" />
                PDF Report w/Screenshots
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV()}>
                <File className="mr-2 h-4 w-4" />
                CSV Archive (Zip)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Data
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <SyncIndicator />
          <div className="text-xs text-muted-foreground">
            <Timer className="inline-block mr-1 h-3 w-3" />
            Active for {formatActiveTime()}
          </div>
        </div>
      </CardContent>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload a JSON backup file to restore your data.
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
