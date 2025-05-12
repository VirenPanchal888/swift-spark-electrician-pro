
import { useState, useEffect } from 'react';

export function useActiveTime() {
  const [activeTime, setActiveTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [lastActive, setLastActive] = useState<Date>(new Date());

  useEffect(() => {
    // Load from sessionStorage if available
    const storedTime = sessionStorage.getItem('activeTime');
    const storedLastActive = sessionStorage.getItem('lastActive');
    
    if (storedTime) {
      setActiveTime(parseInt(storedTime, 10));
    }
    
    if (storedLastActive) {
      setLastActive(new Date(storedLastActive));
    }
    
    // Update active time every second
    const timer = setInterval(() => {
      if (isActive) {
        setActiveTime(prevTime => {
          const newTime = prevTime + 1;
          sessionStorage.setItem('activeTime', newTime.toString());
          return newTime;
        });
      }
    }, 1000);
    
    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
      } else {
        setIsActive(true);
        setLastActive(new Date());
        sessionStorage.setItem('lastActive', new Date().toISOString());
      }
    };
    
    // User activity listeners
    const resetTimer = () => {
      setIsActive(true);
      setLastActive(new Date());
      sessionStorage.setItem('lastActive', new Date().toISOString());
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keypress', resetTimer);
    document.addEventListener('click', resetTimer);
    
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keypress', resetTimer);
      document.removeEventListener('click', resetTimer);
    };
  }, [isActive]);
  
  // Format active time into human-readable string
  const formatActiveTime = () => {
    const hours = Math.floor(activeTime / 3600);
    const minutes = Math.floor((activeTime % 3600) / 60);
    const seconds = activeTime % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  return { activeTime, formatActiveTime, isActive, lastActive };
}
