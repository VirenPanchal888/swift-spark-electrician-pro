
import { useStore } from './store';
import { toast } from '@/hooks/use-toast';

// Type for backup format
export interface BackupData {
  user_id: string;
  exported_on: string;
  transactions: any[];
  employees: any[];
  materials: any[];
  sites: any[];
  siteEmployees: any[];
  siteMaterials: any[];
  siteTasks: any[];
  siteDocuments: any[];
  documents: any[];
  app_settings: {
    dark_mode: boolean;
    language: string;
  };
}

// Export all data to JSON file
export const exportData = () => {
  const store = useStore.getState();
  
  const backupData: BackupData = {
    user_id: `user_${Math.floor(Math.random() * 10000)}`,
    exported_on: new Date().toISOString(),
    transactions: store.transactions,
    employees: store.employees,
    materials: store.materials,
    sites: store.sites,
    siteEmployees: store.siteEmployees,
    siteMaterials: store.siteMaterials,
    siteTasks: store.siteTasks,
    siteDocuments: store.siteDocuments,
    documents: store.documents,
    app_settings: {
      dark_mode: document.documentElement.getAttribute('data-theme') === 'dark',
      language: 'en-IN'
    }
  };
  
  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link and trigger it
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `powerhouse_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  toast({
    title: "Backup Exported Successfully",
    description: "Your data has been exported to a JSON file"
  });
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

// Import data from backup file
export const importData = (jsonData: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const backupData = JSON.parse(jsonData) as BackupData;
      const store = useStore.getState();
      
      // Update store with imported data
      if (backupData.transactions) store.transactions = backupData.transactions;
      if (backupData.employees) store.employees = backupData.employees;
      if (backupData.materials) store.materials = backupData.materials;
      if (backupData.sites) store.sites = backupData.sites;
      if (backupData.siteEmployees) store.siteEmployees = backupData.siteEmployees;
      if (backupData.siteMaterials) store.siteMaterials = backupData.siteMaterials;
      if (backupData.siteTasks) store.siteTasks = backupData.siteTasks;
      if (backupData.siteDocuments) store.siteDocuments = backupData.siteDocuments;
      if (backupData.documents) store.documents = backupData.documents;
      
      // Update theme if available
      if (backupData.app_settings?.dark_mode !== undefined) {
        const theme = backupData.app_settings.dark_mode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
      
      toast({
        title: "Data Restored Successfully",
        description: `Backup from ${new Date(backupData.exported_on).toLocaleString()} has been imported`
      });
      
      resolve(true);
    } catch (error) {
      console.error("Failed to import data:", error);
      toast({
        title: "Import Failed",
        description: "The backup file format is invalid",
        variant: "destructive"
      });
      reject(error);
    }
  });
};
