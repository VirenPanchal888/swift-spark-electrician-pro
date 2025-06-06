
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationService } from '@/components/notifications/NotificationService';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Notifications = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full flex items-center justify-between bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] p-2 sm:p-4 text-white">
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "icon"} 
          onClick={() => navigate("/")} 
          className="text-white p-1"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Back</span>
        </Button>

        <h1 className={`text-base sm:text-xl font-semibold text-center flex-1 ${isMobile ? "mx-0.5" : "mx-2"}`}>
          <Bell className="inline h-4 w-4 mr-2" />
          {isMobile ? "SMS Notifications" : "SMS Notification Center"}
        </h1>

        <div className="w-8"></div> {/* Spacer for center alignment */}
      </header>

      <div className={`flex-1 ${isMobile ? 'p-2' : 'p-4'} w-full`}>
        <NotificationService />
      </div>
    </div>
  );
};

export default Notifications;
