
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
import { ArrowLeft, Printer, Share } from "lucide-react";
import { SalaryRecord } from "@/lib/types";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface SalaryRecordDetailsProps {
  record: SalaryRecord;
  onBack: () => void;
}

export const SalaryRecordDetails = ({ record, onBack }: SalaryRecordDetailsProps) => {
  const { toast } = useToast();

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
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <CardTitle className="text-xl">Salary Payment Details</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Employee</p>
              <p className="text-lg font-medium">{record.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-lg font-medium">₹{record.salaryPaid.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{record.date}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p>{record.time}</p>
            </div>
          </div>
          
          {record.screenshot && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Transaction Screenshot</p>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={record.screenshot}
                  alt="Transaction Screenshot"
                  className="w-full object-contain max-h-64"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex space-x-4">
        <Button 
          variant="outline" 
          onClick={generateExcelReport}
          className="flex-1"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
        
        <Button 
          variant="outline" 
          onClick={shareViaWhatsApp}
          className="flex-1"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};
