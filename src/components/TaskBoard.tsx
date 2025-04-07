
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCheck, Clock, Plus, AlertCircle, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteTask, TaskStatus } from '@/lib/types';

interface TaskBoardProps {
  siteId: string;
}

const TaskBoard = ({ siteId }: TaskBoardProps) => {
  const { getSiteTasks, addSiteTask, updateTaskStatus, employees } = useStore();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as TaskStatus,
    assignedTo: ''
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const tasks = getSiteTasks(siteId);
  
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    addSiteTask({
      siteId,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
      startDate: new Date().toISOString()
    });
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      assignedTo: ''
    });
    
    setIsAddingTask(false);
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: SiteTask) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskStatus(taskId, status);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Task Board</h3>
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
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
      </div>
      
      <div className="kanban-container">
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, 'pending')}
        >
          <div className="kanban-column-header bg-muted/30">
            <span className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Pending
            </span>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {pendingTasks.length}
            </span>
          </div>
          <div className="kanban-column-content">
            <AnimatePresence>
              {pendingTasks.map(task => (
                <motion.div
                  key={task.id}
                  className="kanban-item"
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.assignedTo && (
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        {employees.find(e => e.id === task.assignedTo)?.name.charAt(0) || '?'}
                      </div>
                      <span>{employees.find(e => e.id === task.assignedTo)?.name || 'Unknown'}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, 'in-progress')}
        >
          <div className="kanban-column-header bg-muted/30">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              In Progress
            </span>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="kanban-column-content">
            <AnimatePresence>
              {inProgressTasks.map(task => (
                <motion.div
                  key={task.id}
                  className="kanban-item"
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.assignedTo && (
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        {employees.find(e => e.id === task.assignedTo)?.name.charAt(0) || '?'}
                      </div>
                      <span>{employees.find(e => e.id === task.assignedTo)?.name || 'Unknown'}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div 
          className="kanban-column"
          onDragOver={handleDragOver}
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, 'completed')}
        >
          <div className="kanban-column-header bg-muted/30">
            <span className="flex items-center">
              <CheckCheck className="h-4 w-4 mr-2 text-green-500" />
              Completed
            </span>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {completedTasks.length}
            </span>
          </div>
          <div className="kanban-column-content">
            <AnimatePresence>
              {completedTasks.map(task => (
                <motion.div
                  key={task.id}
                  className="kanban-item"
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.assignedTo && (
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <div className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mr-2">
                        {employees.find(e => e.id === task.assignedTo)?.name.charAt(0) || '?'}
                      </div>
                      <span>{employees.find(e => e.id === task.assignedTo)?.name || 'Unknown'}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
