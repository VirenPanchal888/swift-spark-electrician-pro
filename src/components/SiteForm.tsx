
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X, Users, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SiteStatus, Employee } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface SiteFormProps {
  onClose: () => void;
}

const SiteForm = ({ onClose }: SiteFormProps) => {
  const { addSite, addSiteEmployee, employees, addEmployee } = useStore();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<SiteStatus>('active');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<{ 
    employeeId: string; 
    role: string;
  }[]>([]);
  const [showWorkerSelector, setShowWorkerSelector] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualWorkerName, setManualWorkerName] = useState('');
  const [manualWorkerRole, setManualWorkerRole] = useState('worker');
  const [manualWorkers, setManualWorkers] = useState<{name: string; role: string}[]>([]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !location || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Add the site
    const newSiteData = {
      name,
      location,
      status,
      startDate: startDate.toISOString()
    };
    
    // Store the new site ID after adding the site
    const newSite = addSite(newSiteData);
    const newSiteId = newSite.id;
    
    // Add workers to the site if any are selected from existing employees
    if (selectedWorkers.length > 0) {
      selectedWorkers.forEach(worker => {
        addSiteEmployee({
          siteId: newSiteId,
          employeeId: worker.employeeId,
          role: worker.role,
          shift: "day",  // Default value
          startDate: startDate.toISOString()
        });
      });
    }
    
    // Create and add manually entered workers
    if (manualWorkers.length > 0) {
      manualWorkers.forEach(worker => {
        // First add the employee to the system
        const employeeData = {
          name: worker.name,
          siteLocation: newSiteId,
          startDate: startDate.toISOString()
        };
        
        // Call addEmployee and then get the newly added employee from the store
        addEmployee(employeeData);
        
        // Find the employee by name in the updated store
        const newEmployee = useStore.getState().employees.find(
          emp => emp.name === worker.name && emp.siteLocation === newSiteId
        );
        
        // Then assign them to the site if we found the employee
        if (newEmployee) {
          addSiteEmployee({
            siteId: newSiteId,
            employeeId: newEmployee.id,
            role: worker.role,
            shift: "day",  // Default value
            startDate: startDate.toISOString()
          });
        }
      });
      
      toast({
        title: "Site Added with Workers",
        description: `${name} created with ${selectedWorkers.length + manualWorkers.length} assigned workers`
      });
    } else if (selectedWorkers.length > 0) {
      toast({
        title: "Site Added with Workers",
        description: `${name} created with ${selectedWorkers.length} assigned workers`
      });
    } else {
      toast({
        title: "Site Added",
        description: "The site has been successfully added"
      });
    }
    
    // Reset form
    setName('');
    setLocation('');
    setStatus('active');
    setStartDate(new Date());
    setSelectedWorkers([]);
    setManualWorkers([]);
    onClose();
  };
  
  const handleAddWorker = (employeeId: string) => {
    if (!selectedWorkers.some(w => w.employeeId === employeeId)) {
      setSelectedWorkers([...selectedWorkers, { employeeId, role: 'worker' }]);
    }
  };
  
  const handleRemoveWorker = (employeeId: string) => {
    setSelectedWorkers(selectedWorkers.filter(w => w.employeeId !== employeeId));
  };
  
  const handleUpdateWorkerRole = (employeeId: string, role: string) => {
    setSelectedWorkers(
      selectedWorkers.map(w => 
        w.employeeId === employeeId ? { ...w, role } : w
      )
    );
  };
  
  const handleAddManualWorker = () => {
    if (!manualWorkerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a worker name",
        variant: "destructive"
      });
      return;
    }
    
    // Add the worker to the manual workers list
    setManualWorkers([
      ...manualWorkers, 
      { name: manualWorkerName, role: manualWorkerRole }
    ]);
    
    // Reset the input fields for the next entry
    setManualWorkerName('');
    setManualWorkerRole('worker');
  };
  
  const handleRemoveManualWorker = (index: number) => {
    setManualWorkers(manualWorkers.filter((_, i) => i !== index));
  };
  
  const handleUpdateManualWorkerRole = (index: number, role: string) => {
    setManualWorkers(
      manualWorkers.map((worker, i) => 
        i === index ? { ...worker, role } : worker
      )
    );
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Add New Site</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input 
              id="site-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter site name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Enter location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as SiteStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Site Workers</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowWorkerSelector(!showWorkerSelector)}
                >
                  {showWorkerSelector ? "Hide" : "Existing Workers"} <Users className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowManualEntry(!showManualEntry)}
                >
                  {showManualEntry ? "Hide" : "Add New Workers"} <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showWorkerSelector && (
              <div className="border rounded-md p-3 space-y-3">
                <Label>Available Workers</Label>
                <ScrollArea className="h-32 border rounded-md p-2">
                  {employees.length > 0 ? (
                    employees.map(employee => (
                      <div key={employee.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`worker-${employee.id}`}
                            checked={selectedWorkers.some(w => w.employeeId === employee.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleAddWorker(employee.id);
                              } else {
                                handleRemoveWorker(employee.id);
                              }
                            }}
                          />
                          <label htmlFor={`worker-${employee.id}`}>{employee.name}</label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No workers available</p>
                  )}
                </ScrollArea>
              </div>
            )}
            
            {showManualEntry && (
              <div className="border rounded-md p-3 space-y-3">
                <Label className="mb-2 block">Add New Workers</Label>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="worker-name" className="text-xs">Worker Name</Label>
                    <Input 
                      id="worker-name"
                      value={manualWorkerName}
                      onChange={(e) => setManualWorkerName(e.target.value)}
                      placeholder="Enter worker name"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-[110px]">
                    <Label htmlFor="worker-role" className="text-xs">Role</Label>
                    <Select
                      value={manualWorkerRole}
                      onValueChange={(value) => setManualWorkerRole(value)}
                    >
                      <SelectTrigger id="worker-role" className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="helper">Helper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddManualWorker}
                    size="icon"
                    className="mb-0.5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {manualWorkers.length > 0 && (
                  <div className="mt-3">
                    <Label className="text-xs mb-2 block">Added Workers ({manualWorkers.length})</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {manualWorkers.map((worker, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                          <span className="font-medium">{worker.name}</span>
                          <div className="flex items-center gap-2">
                            <Select
                              value={worker.role}
                              onValueChange={(value) => handleUpdateManualWorkerRole(index, value)}
                            >
                              <SelectTrigger className="w-[110px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="technician">Technician</SelectItem>
                                <SelectItem value="worker">Worker</SelectItem>
                                <SelectItem value="helper">Helper</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveManualWorker(index)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {selectedWorkers.length > 0 && (
              <div className="border rounded-md p-3">
                <Label className="mb-2 block">Selected Existing Workers ({selectedWorkers.length})</Label>
                {selectedWorkers.map((worker) => {
                  const employee = employees.find(e => e.id === worker.employeeId);
                  return (
                    <div key={worker.employeeId} className="flex items-center justify-between mb-2">
                      <span>{employee?.name}</span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={worker.role}
                          onValueChange={(value) => handleUpdateWorkerRole(worker.employeeId, value)}
                        >
                          <SelectTrigger className="w-[110px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="technician">Technician</SelectItem>
                            <SelectItem value="worker">Worker</SelectItem>
                            <SelectItem value="helper">Helper</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveWorker(worker.employeeId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Site</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SiteForm;
