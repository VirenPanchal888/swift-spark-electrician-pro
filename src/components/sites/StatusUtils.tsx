
import { ReactNode } from 'react';
import { CircleCheck, CirclePause, CircleAlert } from 'lucide-react';
import { SiteStatus } from '@/lib/types';

// Helper function to get status variant
export const getStatusVariant = (status: SiteStatus): ReactNode => {
  switch (status) {
    case 'active':
      return <span className="status-indicator status-active flex gap-2 items-center">
        <CircleCheck className="h-4 w-4" /> Active
      </span>;
    case 'paused':
      return <span className="status-indicator status-paused flex gap-2 items-center">
        <CirclePause className="h-4 w-4" /> Paused
      </span>;
    case 'completed':
      return <span className="status-indicator status-completed flex gap-2 items-center">
        <CircleCheck className="h-4 w-4" /> Completed
      </span>;
    default:
      return null;
  }
};

// Helper function to get status icon
export const getStatusIcon = (status: SiteStatus, size = 16): ReactNode => {
  switch (status) {
    case 'active':
      return <CircleCheck className={`h-${size} w-${size} text-green-500`} />;
    case 'paused':
      return <CirclePause className={`h-${size} w-${size} text-amber-500`} />;
    case 'completed':
      return <CircleCheck className={`h-${size} w-${size} text-indigo-500`} />;
    default:
      return <CircleAlert className={`h-${size} w-${size} text-gray-500`} />;
  }
};
