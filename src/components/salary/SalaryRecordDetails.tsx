
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Share } from "lucide-react";
import { SalaryRecord } from "@/lib/types";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { generateSalaryReceipt } from "@/lib/receiptUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalaryRecordDetailsProps {
  record: SalaryRecord;
  onBack: () => void;
}

export const SalaryRecordDetails = ({ record, onBack }: SalaryRecordDetailsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Generate and download Excel report for this specific record
  const generateExcelReport = () => {
    // Create worksheet data
    const worksheetData = [
      ["Salary Payment Receipt", "", "", ""],
      ["Employee Name:", record.employeeName, "", ""],
      ["Payment Date:", record.date, "Time:", record.time],
      ["Amount Paid:", `₹${record.salaryPaid.toFixed(2)}`, "", ""],
      ["Receipt Generated:", format(new Date(), "MM/dd/yyyy hh:mm a"), "", ""]
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Receipt");

    // Generate file name
    const fileName = `${record.employeeName.replace(/\s+/g, '_')}_Salary_Receipt_${format(new Date(), "yyyyMMdd")}.xlsx`;

    // Write to file and download
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Receipt Generated",
      description: "Salary receipt has been downloaded",
    });
  };

  // Generate and download PDF receipt
  const downloadReceipt = () => {
    try {
      generateSalaryReceipt(record);
      toast({
        title: "Receipt Generated",
        description: "Salary receipt PDF has been downloaded",
      });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    // Create message text
    const messageText = encodeURIComponent(
      `*Salary Payment Receipt*\n` +
      `Employee: ${record.employeeName}\n` +
      `Amount: ₹${record.salaryPaid.toFixed(2)}\n` +
      `Date: ${record.date}\n` +
      `Time: ${record.time}\n`
    );

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/?text=${messageText}`, '_blank');
  };
  
  return (
    <Card className={`w-full animate-fade-in ${isMobile ? 'border-0' : 'border'}`}>
      <CardHeader className={`flex flex-row items-center ${isMobile ? 'px-2 py-2' : 'px-6 py-4'}`}>
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-0.5 sm:p-2">
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <CardTitle className="text-base sm:text-xl">Salary Payment Details</CardTitle>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-2 pb-0' : 'px-6'}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Employee</p>
              <p className="text-base sm:text-lg font-medium">{record.employeeName}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Amount</p>
              <p className="text-base sm:text-lg font-medium">₹{record.salaryPaid.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Date</p>
              <p className="text-sm">{record.date}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Time</p>
              <p className="text-sm">{record.time}</p>
            </div>
          </div>
          
          {record.screenshot && (
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Transaction Screenshot</p>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={record.screenshot}
                  alt="Transaction Screenshot"
                  className="w-full object-contain max-h-48 sm:max-h-64"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className={`flex flex-col ${isMobile ? 'px-2 py-2 gap-2' : 'px-6 py-4 space-y-4'}`}>
        <Button 
          variant="default" 
          onClick={downloadReceipt}
          className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-sm py-2 sm:text-base"
        >
          <FileText className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        
        <div className={`flex w-full ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
          <Button 
            variant="outline" 
            onClick={generateExcelReport}
            className="flex-1 text-xs sm:text-sm py-1 sm:py-2"
          >
            <Download className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Export Excel
          </Button>
          
          <Button 
            variant="outline" 
            onClick={shareViaWhatsApp}
            className="flex-1 text-xs sm:text-sm py-1 sm:py-2"
          >
            <Share className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
