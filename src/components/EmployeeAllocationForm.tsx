
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const EmployeeAllocationForm = () => {
  const { addEmployee } = useStore();
  const [name, setName] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!name.trim()) {
      toast.error('Please enter an employee name');
      return;
    }
    
    if (!siteLocation.trim()) {
      toast.error('Please enter a site location');
      return;
    }
    
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }
    
    // Validate end date is after start date if provided
    if (endDate && new Date(endDate) < new Date(startDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    // Add employee to store
    addEmployee({
      name: name.trim(),
      siteLocation: siteLocation.trim(),
      startDate,
      endDate: endDate || undefined,
      notes: notes.trim() || undefined,
    });
    
    // Show success toast
    toast.success('Employee allocation added successfully');
    
    // Reset form
    setName('');
    setSiteLocation('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  };
  
  return (
    <Card className="data-card">
      <CardHeader>
        <CardTitle>Add Employee Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Employee Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="siteLocation">Site Location</Label>
              <Input
                id="siteLocation"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                placeholder="e.g. 123 Main St"
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any special instructions or details..."
              className="transition-all focus:ring-2 focus:ring-electric"
              rows={3}
            />
          </div>
          
          <Button type="submit" className="w-full sparkle-btn bg-electric hover:bg-electric-dark">
            Add Allocation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeAllocationForm;
