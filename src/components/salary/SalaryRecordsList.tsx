
import React from "react";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SalaryRecordDetails } from "@/components/salary/SalaryRecordDetails";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalaryRecordsListProps {
  onBack: () => void;
}

export const SalaryRecordsList = ({ onBack }: SalaryRecordsListProps) => {
  const { salaryRecords } = useStore();
  const [selectedRecord, setSelectedRecord] = React.useState<string | null>(null);
  const isMobile = useIsMobile();

  // Group records by date
  const recordsByDate = React.useMemo(() => {
    const grouped: Record<string, typeof salaryRecords> = {};
    
    if (salaryRecords && salaryRecords.length > 0) {
      salaryRecords.forEach(record => {
        if (!grouped[record.date]) {
          grouped[record.date] = [];
        }
        grouped[record.date].push(record);
      });
    }
    
    return grouped;
  }, [salaryRecords]);

  // Get dates sorted in reverse chronological order
  const sortedDates = React.useMemo(() => {
    return Object.keys(recordsByDate).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [recordsByDate]);

  if (selectedRecord) {
    const record = salaryRecords.find(r => r.id === selectedRecord);
    if (record) {
      return <SalaryRecordDetails record={record} onBack={() => setSelectedRecord(null)} />;
    }
  }

  // Function to render mobile view cards
  const renderMobileView = () => {
    return sortedDates.map(date => (
      <div key={date} className="mb-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">
          {format(new Date(date), "MMMM d, yyyy")}
        </h3>
        
        <div className="space-y-3">
          {recordsByDate[date].map((record) => (
            <div 
              key={record.id}
              className="bg-card border rounded-lg p-3 flex justify-between items-center shadow-sm"
              onClick={() => setSelectedRecord(record.id)}
            >
              <div>
                <p className="font-medium text-sm">{record.employeeName}</p>
                <p className="text-xs text-muted-foreground">₹{record.salaryPaid.toFixed(2)} • {record.time}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Function to render desktop view tables
  const renderDesktopView = () => {
    return sortedDates.map(date => (
      <div key={date} className="mb-6">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">
          {format(new Date(date), "MMMM d, yyyy")}
        </h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Employee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recordsByDate[date].map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {record.employeeName}
                </TableCell>
                <TableCell>₹{record.salaryPaid.toFixed(2)}</TableCell>
                <TableCell>{record.time}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedRecord(record.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ));
  };

  return (
    <Card className="w-full animate-fade-in border-0 sm:border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">Salary Records</CardTitle>
      </CardHeader>
      
      <CardContent className="px-2 sm:px-6">
        {salaryRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No salary records found</p>
            <Button onClick={onBack} className="mt-4">
              Add New Record
            </Button>
          </div>
        ) : (
          <ScrollArea className={`${isMobile ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-180px)]'}`}>
            <div className={isMobile ? 'pr-2' : 'pr-4'}>
              {isMobile ? renderMobileView() : renderDesktopView()}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
