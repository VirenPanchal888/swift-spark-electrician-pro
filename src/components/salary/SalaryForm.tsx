
import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, X, Printer, Share } from "lucide-react";
import * as XLSX from 'xlsx';

interface SalaryFormProps {
  onViewRecords: () => void;
}

export const SalaryForm = ({ onViewRecords }: SalaryFormProps) => {
  const { addSalaryRecord, employees, getSalaryRecordsByEmployee } = useStore();
  const { toast } = useToast();
  
  // Form state
  const [employeeName, setEmployeeName] = useState("");
  const [salaryPaid, setSalaryPaid] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    employeeName: "",
    salaryPaid: "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateEmployeeName = (name: string) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name.trim()) {
      return "Please enter an employee name";
    } else if (!nameRegex.test(name)) {
      return "Please enter a valid name (letters and spaces only)";
    }
    return "";
  };

  const validateSalaryPaid = (salary: string) => {
    const salaryRegex = /^\d+(\.\d{1,2})?$/;
    if (!salary.trim()) {
      return "Please enter a salary amount";
    } else if (!salaryRegex.test(salary) || parseFloat(salary) <= 0) {
      return "Please enter a valid positive amount";
    }
    return "";
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, or JPG file",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const nameError = validateEmployeeName(employeeName);
    const salaryError = validateSalaryPaid(salaryPaid);
    
    setErrors({
      employeeName: nameError,
      salaryPaid: salaryError,
    });
    
    if (nameError || salaryError) {
      return;
    }
    
    // Get current date and time
    const now = new Date();
    const dateFormatted = format(now, "MM/dd/yyyy");
    const timeFormatted = format(now, "hh:mm a");
    
    // Create record
    try {
      addSalaryRecord({
        employeeName,
        salaryPaid: parseFloat(salaryPaid),
        screenshot: screenshot || undefined,
        date: dateFormatted,
        time: timeFormatted,
      });
      
      toast({
        title: "Success",
        description: "Salary record saved successfully!",
        variant: "default",
      });
      
      // Reset form
      setEmployeeName("");
      setSalaryPaid("");
      setScreenshot(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save record. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate and download Excel report
  const generateExcelReport = () => {
    if (!employeeName.trim()) {
      toast({
        title: "Select Employee",
        description: "Please enter an employee name first",
        variant: "destructive",
      });
      return;
    }

    // Get records for this employee
    const records = getSalaryRecordsByEmployee(employeeName);
    
    if (records.length === 0) {
      toast({
        title: "No Records",
        description: "No salary records found for this employee",
        variant: "destructive",
      });
      return;
    }

    // Create worksheet data
    const worksheetData = [
      ["Salary Payment Report", "", "", ""],
      ["Employee Name:", employeeName, "", ""],
      ["Generated on:", format(new Date(), "MM/dd/yyyy hh:mm a"), "", ""],
      ["", "", "", ""],
      ["Date", "Time", "Amount (₹)", "Notes"]
    ];

    // Add records to worksheet
    records.forEach(record => {
      worksheetData.push([
        record.date,
        record.time,
        record.salaryPaid,
        ""
      ]);
    });

    // Add total at the bottom
    const totalPaid = records.reduce((sum, record) => sum + record.salaryPaid, 0);
    worksheetData.push(["", "", "", ""]);
    worksheetData.push(["Total Paid:", "", `₹${totalPaid.toFixed(2)}`, ""]);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");

    // Generate file name
    const fileName = `${employeeName.replace(/\s+/g, '_')}_Salary_Report_${format(new Date(), "yyyyMMdd")}.xlsx`;

    // Write to file and download
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Report Generated",
      description: "Salary report has been downloaded",
    });
  };

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    if (!employeeName.trim()) {
      toast({
        title: "Select Employee",
        description: "Please enter an employee name first",
        variant: "destructive",
      });
      return;
    }

    const records = getSalaryRecordsByEmployee(employeeName);
    
    if (records.length === 0) {
      toast({
        title: "No Records",
        description: "No salary records found for this employee",
        variant: "destructive",
      });
      return;
    }

    const totalPaid = records.reduce((sum, record) => sum + record.salaryPaid, 0);
    
    // Create message text
    const messageText = encodeURIComponent(
      `*Salary Report for ${employeeName}*\n` +
      `Generated on: ${format(new Date(), "MM/dd/yyyy")}\n\n` +
      `Total Payments: ₹${totalPaid.toFixed(2)}\n` +
      `Number of payments: ${records.length}\n\n` +
      `Latest payment: ₹${records[0].salaryPaid.toFixed(2)} on ${records[0].date}`
    );

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/?text=${messageText}`, '_blank');
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Add Salary Record</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee-name" className="text-sm font-medium">
              Employee Name *
            </Label>
            <Input
              id="employee-name"
              placeholder="Enter employee name (e.g., John Doe)"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
                if (errors.employeeName) {
                  setErrors({ ...errors, employeeName: "" });
                }
              }}
              className={errors.employeeName ? "border-red-500" : ""}
              aria-label="Employee Name Input"
            />
            {errors.employeeName && (
              <p className="text-xs text-red-500 mt-1">{errors.employeeName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary-paid" className="text-sm font-medium">
              Salary Paid *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
              <Input
                id="salary-paid"
                type="text"
                placeholder="Enter amount (e.g., 500)"
                value={salaryPaid}
                onChange={(e) => {
                  setSalaryPaid(e.target.value);
                  if (errors.salaryPaid) {
                    setErrors({ ...errors, salaryPaid: "" });
                  }
                }}
                className={`pl-7 ${errors.salaryPaid ? "border-red-500" : ""}`}
                aria-label="Salary Amount Input"
              />
            </div>
            {errors.salaryPaid && (
              <p className="text-xs text-red-500 mt-1">{errors.salaryPaid}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="screenshot" className="text-sm font-medium">
              Upload Transaction Screenshot (Optional)
            </Label>
            <div className="flex flex-col">
              <input
                type="file"
                id="screenshot"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload Transaction Screenshot"
              />
              <Button
                type="button"
                variant="secondary"
                className="bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
            
            {screenshot && (
              <div className="relative w-24 h-24 mt-2">
                <img
                  src={screenshot}
                  alt="Transaction Screenshot"
                  className="w-24 h-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Input
                value={format(new Date(), "MM/dd/yyyy")}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time</Label>
              <Input
                value={format(new Date(), "hh:mm a")}
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button 
              type="submit"
              className="w-full transition-transform hover:scale-105 duration-300"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Salary Record
            </Button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="flex justify-between w-full">
          <Button 
            type="button" 
            variant="outline" 
            onClick={generateExcelReport}
            className="flex-1 mr-2"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={shareViaWhatsApp}
            className="flex-1 ml-2"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onViewRecords}
          className="w-full border border-[#4A90E2] text-[#4A90E2] bg-white hover:bg-gray-50"
        >
          View All Salary Records
        </Button>
      </CardFooter>
    </Card>
  );
};
