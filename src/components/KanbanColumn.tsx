
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SiteTask, TaskStatus } from '@/lib/types';
import TaskItem from './TaskItem';
import { Employee } from '@/lib/types';

interface KanbanColumnProps {
  title: ReactNode;
  tasks: SiteTask[];
  status: TaskStatus;
  tasksCount: number;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: SiteTask) => void;
  employees: Employee[];
}

const KanbanColumn = ({ 
  title, 
  tasks, 
  status, 
  tasksCount, 
  onDragOver, 
  onDrop, 
  onDragStart,
  employees
}: KanbanColumnProps) => {
  return (
    <div
      className="kanban-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="kanban-column-header bg-muted/30">
        <span className="flex items-center">
          {title}
        </span>
        <span className="text-sm bg-muted px-2 py-1 rounded-full">
          {tasksCount}
        </span>
      </div>
      <div className="kanban-column-content">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              employees={employees} 
              onDragStart={onDragStart} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KanbanColumn;
