
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useActiveTime } from '@/hooks/use-active-time';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const SyncIndicator = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const { activeTime, formatActiveTime } = useActiveTime();
  const { toast } = useToast();
  
  // Update online status
  useEffect(() => {
    const handleStatusChange = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (online) {
        toast({
          title: "Connected",
          description: "Your connection has been restored"
        });
        setLastSynced(new Date());
      } else {
        toast({
          title: "Offline",
          description: "You are currently offline. Changes will sync when connection is restored",
          variant: "destructive"
        });
      }
    };
    
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    
    // Auto-sync effect simulation
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        setLastSynced(new Date());
        
        // Simulate auto-saving to localStorage
        const timestamp = new Date().toISOString();
        localStorage.setItem('lastAutoSave', timestamp);
        
        console.log('Auto-saved at:', timestamp);
      }
    }, 30000); // Every 30 seconds
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      clearInterval(syncInterval);
    };
  }, [toast]);
  
  // Format time since last sync
  const getTimeSinceLastSync = () => {
    const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);
    
    if (seconds < 60) {
      return 'Just now';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <Badge variant={isOnline ? "outline" : "destructive"} className={cn(
        "flex items-center gap-1 px-2 py-1 transition-all",
        isOnline && "border-green-500 text-green-500"
      )}>
        {isOnline ? (
          <>
            <CheckCircle className="h-3 w-3" />
            <span>Synced • {getTimeSinceLastSync()}</span>
          </>
        ) : (
          <>
            <AlertCircle className="h-3 w-3" />
            <span>Offline • Syncing on reconnect</span>
          </>
        )}
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
        ⏱️ Active: {formatActiveTime()}
      </Badge>
    </div>
  );
};
