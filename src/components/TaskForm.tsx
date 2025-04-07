
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '@/lib/types';
import { Employee } from '@/lib/types';

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onAddTask: (task: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo: string;
  }) => void;
}

const TaskForm = ({ isOpen, onOpenChange, employees, onAddTask }: TaskFormProps) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as TaskStatus,
    assignedTo: ''
  });

  const handleAddTask = () => {
    if (!newTask.title) return;
    
    onAddTask(newTask);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      assignedTo: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              value={newTask.title} 
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-description">Description (Optional)</Label>
            <Textarea 
              id="task-description" 
              value={newTask.description} 
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <Select 
              value={newTask.status} 
              onValueChange={(value) => setNewTask({...newTask, status: value as TaskStatus})}
            >
              <SelectTrigger id="task-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-assigned">Assigned To (Optional)</Label>
            <Select 
              value={newTask.assignedTo} 
              onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
            >
              <SelectTrigger id="task-assigned">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not Assigned</SelectItem>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
