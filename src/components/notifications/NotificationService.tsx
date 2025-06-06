
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Phone, Send, Database } from 'lucide-react';

interface SMSNotification {
  id: string;
  phone_number: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  created_at: string;
  employee_name?: string;
}

export const NotificationService = () => {
  const [message, setMessage] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const { toast } = useToast();

  const defaultPhoneNumber = '9607767057';

  const sendSMSNotification = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create notification record in database first
      const notificationData = {
        phone_number: defaultPhoneNumber,
        message: message.trim(),
        status: 'pending' as const,
        employee_name: employeeName.trim() || undefined,
        created_at: new Date().toISOString()
      };

      // In a real implementation, this would call your Supabase edge function
      // For now, we'll simulate the SMS sending
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const newNotification: SMSNotification = {
          ...notificationData,
          id: crypto.randomUUID(),
          status: 'sent'
        };

        setNotifications(prev => [newNotification, ...prev]);
        
        toast({
          title: "SMS Sent Successfully",
          description: `Message sent to ${defaultPhoneNumber}`,
        });

        // Clear form
        setMessage('');
        setEmployeeName('');
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      
      // Still record the failed attempt
      const failedNotification: SMSNotification = {
        id: crypto.randomUUID(),
        phone_number: defaultPhoneNumber,
        message: message.trim(),
        status: 'failed',
        employee_name: employeeName.trim() || undefined,
        created_at: new Date().toISOString()
      };

      setNotifications(prev => [failedNotification, ...prev]);
      
      toast({
        title: "SMS Failed",
        description: "Failed to send SMS. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SMS Sending Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Send SMS Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input 
              value={defaultPhoneNumber} 
              disabled 
              className="bg-gray-100"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Employee Name (Optional)</label>
            <Input 
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Enter employee name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={3}
            />
          </div>
          
          <Button 
            onClick={sendSMSNotification}
            disabled={isLoading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send SMS'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SMS History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No SMS notifications sent yet
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="border rounded-lg p-3 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {notification.employee_name && (
                        <p className="font-medium text-sm">
                          To: {notification.employee_name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {notification.phone_number}
                      </p>
                      <p className="text-sm mt-1">{notification.message}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        notification.status === 'sent' 
                          ? 'bg-green-100 text-green-800'
                          : notification.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
