
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Employee } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const EmployeeList = () => {
  const { employees, updateEmployee, deleteEmployee } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editName, setEditName] = useState('');
  const [editSiteLocation, setEditSiteLocation] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  
  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.siteLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Prepare employee for editing
  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditName(employee.name);
    setEditSiteLocation(employee.siteLocation);
    setEditStartDate(employee.startDate);
    setEditEndDate(employee.endDate || '');
    setEditNotes(employee.notes || '');
  };
  
  // Save edited employee
  const handleSave = () => {
    if (!editingEmployee) return;
    
    // Validate form data
    if (!editName.trim()) {
      toast.error('Please enter an employee name');
      return;
    }
    
    if (!editSiteLocation.trim()) {
      toast.error('Please enter a site location');
      return;
    }
    
    if (!editStartDate) {
      toast.error('Please select a start date');
      return;
    }
    
    // Validate end date is after start date if provided
    if (editEndDate && new Date(editEndDate) < new Date(editStartDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    // Update employee
    updateEmployee({
      ...editingEmployee,
      name: editName.trim(),
      siteLocation: editSiteLocation.trim(),
      startDate: editStartDate,
      endDate: editEndDate || undefined,
      notes: editNotes.trim() || undefined,
    });
    
    // Show success toast
    toast.success('Employee allocation updated successfully');
    
    // Clear editing state
    setEditingEmployee(null);
  };
  
  // Delete employee
  const handleDelete = (id: string) => {
    deleteEmployee(id);
    toast.success('Employee allocation deleted successfully');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <Card className="data-card mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Allocations</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees or sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredEmployees.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No employee allocations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Employee</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Site Location</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Start Date</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">End Date</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Notes</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{employee.name}</td>
                    <td className="py-3 px-4">{employee.siteLocation}</td>
                    <td className="py-3 px-4">{formatDate(employee.startDate)}</td>
                    <td className="py-3 px-4">{employee.endDate ? formatDate(employee.endDate) : 'Ongoing'}</td>
                    <td className="py-3 px-4">
                      {employee.notes ? (
                        <div className="max-w-xs truncate" title={employee.notes}>
                          {employee.notes}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEdit(employee)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Employee Allocation</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="editName">Employee Name</Label>
                                <Input
                                  id="editName"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="editSiteLocation">Site Location</Label>
                                <Input
                                  id="editSiteLocation"
                                  value={editSiteLocation}
                                  onChange={(e) => setEditSiteLocation(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="editStartDate">Start Date</Label>
                                <Input
                                  id="editStartDate"
                                  type="date"
                                  value={editStartDate}
                                  onChange={(e) => setEditStartDate(e.target.value)}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="editEndDate">End Date (Optional)</Label>
                                <Input
                                  id="editEndDate"
                                  type="date"
                                  value={editEndDate}
                                  onChange={(e) => setEditEndDate(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="grid gap-2">
                              <Label htmlFor="editNotes">Additional Notes (Optional)</Label>
                              <Textarea
                                id="editNotes"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleSave} className="bg-electric hover:bg-electric-dark">Save Changes</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(employee.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
