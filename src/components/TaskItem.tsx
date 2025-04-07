
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { SiteTask } from '@/lib/types';
import { Employee } from '@/lib/types';

interface TaskItemProps {
  task: SiteTask;
  employees: Employee[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: SiteTask) => void;
}

const TaskItem = ({ task, employees, onDragStart }: TaskItemProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e, task);
  };

  return (
    <div
      key={task.id}
      className="kanban-item"
      draggable
      onDragStart={handleDragStart}
    >
      <motion.div
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
    </div>
  );
};

export default TaskItem;
