
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDriveDownload, HardDriveUpload } from 'lucide-react';
import { useStore } from '@/lib/store';
import { exportData } from '@/lib/backupUtils';
import { useState } from 'react';
import { useActiveTime } from '@/hooks/use-active-time';
import { SyncIndicator } from './SyncIndicator';

export const SiteDataStats = () => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { formatActiveTime } = useActiveTime();
  
  const transactions = useStore(state => state.transactions);
  const employees = useStore(state => state.employees);
  const materials = useStore(state => state.materials);
  const sites = useStore(state => state.sites);
  const documents = useStore(state => state.documents);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <span>🧠 Data Control Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => exportData()}
          >
            <HardDriveDownload className="mr-2 h-4 w-4" />
            Export Backup
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={() => setImportDialogOpen(true)}
          >
            <HardDriveUpload className="mr-2 h-4 w-4" />
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
    </Card>
  );
};
