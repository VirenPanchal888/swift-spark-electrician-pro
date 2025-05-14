
import { useStore } from './store';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

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
  salaryRecords: any[];
  app_settings: {
    dark_mode: boolean;
    language: string;
    export_version: string;
    export_timestamp: number;
    app_version: string;
  };
  meta_data?: {
    total_cost: number;
    total_employees: number;
    total_sites: number;
    total_materials: number;
    export_timestamp: string;
    historical_data: boolean;
  };
  dashboardScreenshots?: Record<string, string>;
}

// Export all data to JSON file
export const exportData = async () => {
  const store = useStore.getState();
  
  // Show toast notification about the export starting
  toast({
    title: "Starting Comprehensive Backup",
    description: "Preparing full historical data export..."
  });
  
  // Capture dashboard screenshots if in browser environment
  let dashboardImages = {};
  if (typeof document !== 'undefined') {
    try {
      // Get all dashboard elements to capture
      const dashboardElements = document.querySelectorAll('.card, [data-export-capture="true"]');
      
      // Capture each element as an image
      for (let i = 0; i < dashboardElements.length; i++) {
        const element = dashboardElements[i];
        if (element instanceof HTMLElement) {
          const canvas = await html2canvas(element);
          const imageData = canvas.toDataURL('image/png');
          dashboardImages[`dashboard_${i}`] = imageData;
        }
      }
    } catch (error) {
      console.error("Failed to capture dashboard screenshots:", error);
    }
  }
  
  // Calculate totals for metadata
  const totalCost = store.calculateTotalCost();
  
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
    salaryRecords: store.salaryRecords || [],
    app_settings: {
      dark_mode: document.documentElement.getAttribute('data-theme') === 'dark',
      language: 'en-IN',
      export_version: '1.2.0',
      export_timestamp: Date.now(),
      app_version: '1.0.0'
    },
    meta_data: {
      total_cost: totalCost,
      total_employees: store.employees.length,
      total_sites: store.sites.length,
      total_materials: store.materials.length,
      export_timestamp: new Date().toISOString(),
      historical_data: true
    }
  };
  
  // Add screenshot data if available
  if (Object.keys(dashboardImages).length > 0) {
    backupData.dashboardScreenshots = dashboardImages;
  }
  
  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a download link and trigger it
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `powerhouse_full_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  toast({
    title: "Complete Backup Exported",
    description: "Your comprehensive historical data has been exported to a JSON file"
  });
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

// Export data to CSV file
export const exportToCSV = async () => {
  const store = useStore.getState();
  
  // Show toast notification
  toast({
    title: "Starting Comprehensive CSV Export",
    description: "Preparing complete historical data export..."
  });
  
  // Create a CSV string for each data type
  const exportData = {
    transactions: convertToCSV(store.transactions),
    employees: convertToCSV(store.employees),
    materials: convertToCSV(store.materials),
    sites: convertToCSV(store.sites),
    siteEmployees: convertToCSV(store.siteEmployees),
    siteMaterials: convertToCSV(store.siteMaterials),
    siteTasks: convertToCSV(store.siteTasks),
    siteDocuments: convertToCSV(store.siteDocuments),
    documents: convertToCSV(store.documents),
    salaryRecords: convertToCSV(store.salaryRecords || [])
  };
  
  // Create a zip file with all CSV files
  const zip = await import('jszip').then(module => new module.default());
  
  // Add each data type to the zip
  Object.entries(exportData).forEach(([key, value]) => {
    if (value && value.length > 0) {
      zip.file(`${key}.csv`, value);
    }
  });
  
  // Add metadata file
  const metadata = {
    exported_on: new Date().toISOString(),
    app_version: '1.0.0',
    total_transactions: store.transactions.length,
    total_employees: store.employees.length,
    total_materials: store.materials.length,
    total_sites: store.sites.length,
    total_documents: store.documents.length,
    total_salary_records: (store.salaryRecords || []).length,
    historical_data: true
  };
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  
  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Create a download link
  const url = URL.createObjectURL(content);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `powerhouse_complete_data_export_${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  toast({
    title: "Comprehensive CSV Export Successful",
    description: "Your complete historical data has been exported to CSV files in a zip archive"
  });
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

// Helper function to convert JSON to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle different data types
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
      return `"${String(value).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Export data to Excel file
export const exportToExcel = () => {
  const store = useStore.getState();
  
  // Create workbook with multiple sheets
  const wb = XLSX.utils.book_new();
  
  // Add transactions sheet
  if (store.transactions.length > 0) {
    const transactionsWS = XLSX.utils.json_to_sheet(store.transactions);
    XLSX.utils.book_append_sheet(wb, transactionsWS, "Transactions");
  }
  
  // Add employees sheet
  if (store.employees.length > 0) {
    const employeesWS = XLSX.utils.json_to_sheet(store.employees);
    XLSX.utils.book_append_sheet(wb, employeesWS, "Employees");
  }
  
  // Add materials sheet
  if (store.materials.length > 0) {
    const materialsWS = XLSX.utils.json_to_sheet(store.materials);
    XLSX.utils.book_append_sheet(wb, materialsWS, "Materials");
  }
  
  // Add sites sheet
  if (store.sites.length > 0) {
    const sitesWS = XLSX.utils.json_to_sheet(store.sites);
    XLSX.utils.book_append_sheet(wb, sitesWS, "Sites");
  }
  
  // Add site employees sheet
  if (store.siteEmployees.length > 0) {
    const siteEmployeesWS = XLSX.utils.json_to_sheet(store.siteEmployees);
    XLSX.utils.book_append_sheet(wb, siteEmployeesWS, "Site Employees");
  }
  
  // Add site materials sheet
  if (store.siteMaterials.length > 0) {
    const siteMaterialsWS = XLSX.utils.json_to_sheet(store.siteMaterials);
    XLSX.utils.book_append_sheet(wb, siteMaterialsWS, "Site Materials");
  }
  
  // Add site tasks sheet
  if (store.siteTasks.length > 0) {
    const siteTasksWS = XLSX.utils.json_to_sheet(store.siteTasks);
    XLSX.utils.book_append_sheet(wb, siteTasksWS, "Site Tasks");
  }
  
  // Add site documents sheet
  if (store.siteDocuments.length > 0) {
    const siteDocsWS = XLSX.utils.json_to_sheet(store.siteDocuments);
    XLSX.utils.book_append_sheet(wb, siteDocsWS, "Site Documents");
  }
  
  // Add documents sheet
  if (store.documents.length > 0) {
    const docsWS = XLSX.utils.json_to_sheet(store.documents);
    XLSX.utils.book_append_sheet(wb, docsWS, "Documents");
  }
  
  // Add salary records sheet
  if (store.salaryRecords && store.salaryRecords.length > 0) {
    const salaryRecordsWS = XLSX.utils.json_to_sheet(store.salaryRecords);
    XLSX.utils.book_append_sheet(wb, salaryRecordsWS, "Salary Records");
  }
  
  // Add metadata sheet
  const metadata = [
    {
      exported_on: new Date().toISOString(),
      app_version: '1.0.0',
      total_transactions: store.transactions.length,
      total_employees: store.employees.length,
      total_materials: store.materials.length,
      total_sites: store.sites.length,
      total_documents: store.documents.length,
      total_salary_records: (store.salaryRecords || []).length,
      historical_data: true
    }
  ];
  const metadataWS = XLSX.utils.json_to_sheet(metadata);
  XLSX.utils.book_append_sheet(wb, metadataWS, "Export Metadata");
  
  // Write workbook and trigger download
  XLSX.writeFile(wb, `powerhouse_complete_export_${new Date().toISOString().split('T')[0]}.xlsx`);
  
  toast({
    title: "Complete Excel Export Successful",
    description: "Your comprehensive historical data has been exported to an Excel file with multiple sheets"
  });
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
      if (backupData.salaryRecords) store.salaryRecords = backupData.salaryRecords;
      
      // Update theme if available
      if (backupData.app_settings?.dark_mode !== undefined) {
        const theme = backupData.app_settings.dark_mode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      }
      
      toast({
        title: "Data Restored Successfully",
        description: `Comprehensive backup from ${new Date(backupData.exported_on).toLocaleString()} has been imported`
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

// Import data from Excel file
export const importFromExcel = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Failed to read file");
        }
        
        // Parse the Excel file
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const store = useStore.getState();
        
        // Process each sheet in the workbook
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          switch(sheetName.toLowerCase()) {
            case 'transactions':
              if (jsonData.length > 0) store.transactions = jsonData as any[];
              break;
            case 'employees':
              if (jsonData.length > 0) store.employees = jsonData as any[];
              break;
            case 'materials':
              if (jsonData.length > 0) store.materials = jsonData as any[];
              break;
            case 'sites':
              if (jsonData.length > 0) store.sites = jsonData as any[];
              break;
            case 'site employees':
              if (jsonData.length > 0) store.siteEmployees = jsonData as any[];
              break;
            case 'site materials':
              if (jsonData.length > 0) store.siteMaterials = jsonData as any[];
              break;
            case 'site tasks':
              if (jsonData.length > 0) store.siteTasks = jsonData as any[];
              break;
            case 'site documents':
              if (jsonData.length > 0) store.siteDocuments = jsonData as any[];
              break;
            case 'documents':
              if (jsonData.length > 0) store.documents = jsonData as any[];
              break;
            case 'salary records':
              if (jsonData.length > 0) store.salaryRecords = jsonData as any[];
              break;
          }
        });
        
        toast({
          title: "Excel Import Successful",
          description: "Your comprehensive data has been imported from the Excel file"
        });
        
        resolve(true);
      } catch (error) {
        console.error("Failed to import from Excel:", error);
        toast({
          title: "Import Failed",
          description: "The Excel file format is invalid or unsupported",
          variant: "destructive"
        });
        reject(error);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import Failed",
        description: "Could not read the Excel file",
        variant: "destructive"
      });
      reject(new Error("FileReader error"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
