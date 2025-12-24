
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

  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar />
      
      <main className="w-full px-3 py-4 sm:px-4 md:container md:px-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <h1 className="font-bold text-foreground text-xl sm:text-2xl">🖩 Calculation & Analysis</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExcelExport}
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <File className="h-3.5 w-3.5" />
              Excel
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePDFExport}
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <FileText className="h-3.5 w-3.5" />
              PDF
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleJSONExport}
              className="flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <FileJson className="h-3.5 w-3.5" />
              JSON
            </Button>
          </div>
        </div>
        
        <CalculationTool />
      </main>
    </div>
  );
};
export default Calculations;
