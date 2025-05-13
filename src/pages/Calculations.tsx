
import Navbar from '@/components/Navbar';
import CalculationTool from '@/components/CalculationTool';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { File, FileText, FileJson, Download } from 'lucide-react';
import { exportToExcel, exportData } from '@/lib/backupUtils';
import { exportToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const Calculations = () => {
  const { toast } = useToast();

  const handleExcelExport = () => {
    exportToExcel();
  };

  const handlePDFExport = () => {
    exportToPDF();
    toast({
      title: "PDF Export Successful",
      description: "Your data has been exported to a PDF file"
    });
  };

  const handleJSONExport = () => {
    exportData();
  };

  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="font-bold text-gray-900 mb-4 md:mb-0 text-2xl">🖩 Calculation & Analysis</h1>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={handleExcelExport}
              className="flex items-center gap-2"
            >
              <File className="h-4 w-4" />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePDFExport}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleJSONExport}
              className="flex items-center gap-2"
            >
              <FileJson className="h-4 w-4" />
              <span className="hidden sm:inline">Export JSON</span>
              <span className="sm:hidden">JSON</span>
            </Button>
          </div>
        </div>
        
        <CalculationTool />
      </main>
    </div>;
};
export default Calculations;
