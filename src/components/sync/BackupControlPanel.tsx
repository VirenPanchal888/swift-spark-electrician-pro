
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Download, 
  ServerCog, 
  Timer,
  File
} from 'lucide-react';
import { exportData, exportToExcel, exportToCSV } from '@/lib/backupUtils';
import { exportToPDF } from '@/lib/exportUtils';
import { SyncIndicator } from './SyncIndicator';
import { useActiveTime } from '@/hooks/use-active-time';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const BackupControlPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const { formatActiveTime } = useActiveTime();

  const handleImportClick = () => {
    setIsImportDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setFileContent(e.target.result as string);
          setIsImportDialogOpen(false);
          setIsConfirmDialogOpen(true);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleConfirmImport = async () => {
    try {
      await importData(fileContent);
      setIsConfirmDialogOpen(false);
      toast({
        title: "Import Successful",
        description: "Your data has been restored from backup"
      });
    } catch (err) {
      console.error("Import failed:", err);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-2 items-center">
            <ServerCog className="h-4 w-4" />
            <span className="hidden md:inline">🔁 Backup & Sync</span>
            <span className="inline md:hidden">🔁</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Data Control Panel</h4>
              <p className="text-sm text-muted-foreground">
                Manage your data backup and sync settings
              </p>
            </div>
            <div className="grid gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="justify-start w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Full Backup
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => exportData()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Complete JSON Backup
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel()}>
                    <File className="mr-2 h-4 w-4" />
                    Excel Spreadsheet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF()}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF Report with Screenshots
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCSV()}>
                    <FileText className="mr-2 h-4 w-4" />
                    CSV Archive (Zip)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleImportClick}
              >
                <Download className="mr-2 h-4 w-4 rotate-180" />
                Import Backup File
              </Button>
              <div className="mt-2">
                <SyncIndicator />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Data Control Panel</DialogTitle>
            <DialogDescription>
              Export, import, and manage your data
            </DialogDescription>
          </DialogHeader>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Backup Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Full Backup
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => exportData()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Complete JSON Backup
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => exportToExcel()}>
                    <File className="mr-2 h-4 w-4" />
                    Excel Spreadsheet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF()}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF Report with Screenshots
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCSV()}>
                    <FileText className="mr-2 h-4 w-4" />
                    CSV Archive (Zip)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleImportClick}
              >
                <Download className="mr-2 h-4 w-4 rotate-180" />
                Import Backup File
              </Button>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-2 mt-2">
            <Alert>
              <Timer className="h-4 w-4" />
              <AlertTitle>Session Information</AlertTitle>
              <AlertDescription>
                Active Time: {formatActiveTime()}
                <br />
                Auto-save is enabled
              </AlertDescription>
            </Alert>
            <SyncIndicator />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* File Input Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Backup File</DialogTitle>
            <DialogDescription>
              Please select a backup file to restore your data
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Backup File (JSON)
            </label>
            <input
              type="file"
              accept=".json"
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
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Import Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current data with the contents of {fileName}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              Yes, Import Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

