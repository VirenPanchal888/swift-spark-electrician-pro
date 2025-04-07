
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { SiteEmployee } from '@/lib/types';

interface SiteEmployeeAllocationProps {
  siteId: string;
}

const SiteEmployeeAllocation = ({ siteId }: SiteEmployeeAllocationProps) => {
  const { employees, getSiteEmployees, addSiteEmployee, deleteSiteEmployee } = useStore();
  const { toast } = useToast();
  
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newAllocation, setNewAllocation] = useState({
    employeeId: '',
    role: '',
    shift: '',
    contact: '',
    startDate: new Date()
  });
  const [startDateOpen, setStartDateOpen] = useState(false);
  
  const siteEmployees = getSiteEmployees(siteId);
  
  const availableEmployees = employees.filter(
    employee => !siteEmployees.some(se => se.employeeId === employee.id)
  );
  
  const handleAddEmployee = () => {
    if (!newAllocation.employeeId || !newAllocation.role || !newAllocation.shift) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    addSiteEmployee({
      siteId,
      employeeId: newAllocation.employeeId,
      role: newAllocation.role,
      shift: newAllocation.shift,
      contact: newAllocation.contact,
      startDate: newAllocation.startDate.toISOString()
    });
    
    toast({
      title: "Employee Allocated",
      description: "The employee has been assigned to the site"
    });
    
    // Reset form
    setNewAllocation({
      employeeId: '',
      role: '',
      shift: '',
      contact: '',
      startDate: new Date()
    });
    
    setIsAddingEmployee(false);
  };
  
  const handleRemoveEmployee = (id: string) => {
    deleteSiteEmployee(id);
    
    toast({
      title: "Employee Removed",
      description: "The employee has been removed from the site"
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Employee Allocation</h3>
        <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
          <DialogTrigger asChild>
            <Button disabled={availableEmployees.length === 0} size="sm">
              <Plus className="mr-1 h-4 w-4" /> Assign Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Employee to Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select 
                  value={newAllocation.employeeId} 
                  onValueChange={(value) => setNewAllocation({...newAllocation, employeeId: value})}
                  disabled={availableEmployees.length === 0}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.length === 0 ? (
                      <SelectItem value="no-employees" disabled>No available employees</SelectItem>
                    ) : (
                      availableEmployees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  value={newAllocation.role} 
                  onChange={(e) => setNewAllocation({...newAllocation, role: e.target.value})}
                  placeholder="E.g., Electrician, Site Manager"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <Select 
                  value={newAllocation.shift} 
                  onValueChange={(value) => setNewAllocation({...newAllocation, shift: value})}
                >
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                    <SelectItem value="day">Day (9 AM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (2 PM - 10 PM)</SelectItem>
                    <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact (Optional)</Label>
                <Input 
                  id="contact" 
                  value={newAllocation.contact} 
                  onChange={(e) => setNewAllocation({...newAllocation, contact: e.target.value})}
                  placeholder="Phone number or email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newAllocation.startDate ? format(newAllocation.startDate, "PP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newAllocation.startDate}
                      onSelect={(date) => {
                        setNewAllocation({...newAllocation, startDate: date ?? new Date()});
                        setStartDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddEmployee}>Assign Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {siteEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-muted-foreground mb-4">No employees assigned to this site yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingEmployee(true)}
                disabled={availableEmployees.length === 0}
              >
                <Plus className="mr-1 h-4 w-4" /> 
                Assign Employee
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteEmployees.map((siteEmployee) => {
                    const employee = employees.find(e => e.id === siteEmployee.employeeId);
                    return (
                      <TableRow key={siteEmployee.id}>
                        <TableCell className="font-medium">{employee?.name || 'Unknown'}</TableCell>
                        <TableCell>{siteEmployee.role}</TableCell>
                        <TableCell>
                          {siteEmployee.shift === 'morning' && 'Morning (6 AM - 2 PM)'}
                          {siteEmployee.shift === 'day' && 'Day (9 AM - 5 PM)'}
                          {siteEmployee.shift === 'evening' && 'Evening (2 PM - 10 PM)'}
                          {siteEmployee.shift === 'night' && 'Night (10 PM - 6 AM)'}
                        </TableCell>
                        <TableCell>{siteEmployee.contact || '-'}</TableCell>
                        <TableCell>{format(new Date(siteEmployee.startDate), 'dd MMM yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveEmployee(siteEmployee.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteEmployeeAllocation;
