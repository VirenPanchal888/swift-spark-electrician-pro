
import { ReactNode } from 'react';
import { CircleCheck, CirclePause, CircleAlert } from 'lucide-react';
import { SiteStatus } from '@/lib/types';

// Helper function to get status variant as string for Badge component
export const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
  switch (status) {
    case 'active':
      return "default";
    case 'paused':
      return "secondary";
    case 'completed':
      return "outline";
    default:
      return "default";
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
