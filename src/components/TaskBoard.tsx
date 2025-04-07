
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { SiteTask, TaskStatus } from '@/lib/types';
import TaskForm from './TaskForm';
import KanbanColumn from './KanbanColumn';

interface TaskBoardProps {
  siteId: string;
}

const TaskBoard = ({ siteId }: TaskBoardProps) => {
  const { getSiteTasks, addSiteTask, updateTaskStatus, employees } = useStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const tasks = getSiteTasks(siteId);
  
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const handleAddTask = (newTask: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedTo: string;
  }) => {
    addSiteTask({
      siteId,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
      startDate: new Date().toISOString()
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
        <Button size="sm" onClick={() => setIsAddingTask(true)}>
          <Plus className="mr-1 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <TaskForm 
        isOpen={isAddingTask}
        onOpenChange={setIsAddingTask}
        employees={employees}
        onAddTask={handleAddTask}
      />
      
      <div className="kanban-container">
        <KanbanColumn
          title={<>
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            Pending
          </>}
          tasks={pendingTasks}
          status="pending"
          tasksCount={pendingTasks.length}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          employees={employees}
        />
        
        <KanbanColumn
          title={<>
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            In Progress
          </>}
          tasks={inProgressTasks}
          status="in-progress"
          tasksCount={inProgressTasks.length}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          employees={employees}
        />
        
        <KanbanColumn
          title={<>
            <CheckCheck className="h-4 w-4 mr-2 text-green-500" />
            Completed
          </>}
          tasks={completedTasks}
          status="completed"
          tasksCount={completedTasks.length}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          employees={employees}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
