
import { format, parseISO } from 'date-fns';
import { Edit, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import SiteEditForm from '@/components/SiteEditForm';
import { useState } from 'react';

interface SiteHeaderProps {
  name: string;
  location: string;
  startDate: string;
  status: string;
  getStatusVariant: (status: string) => "default" | "destructive" | "outline" | "secondary";
  getSiteDuration: (site: { startDate: string }) => number;
  getSiteMaterialsCount: (siteId: string) => number;
  getSiteEmployeesCount: (siteId: string) => number;
  siteId: string;
}

const SiteHeader = ({ 
  name, 
  location, 
  startDate, 
  status, 
  getStatusVariant, 
  getSiteDuration,
  getSiteMaterialsCount,
  getSiteEmployeesCount,
  siteId
}: SiteHeaderProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  
  const statusVariant = getStatusVariant(status);
  const duration = getSiteDuration({ startDate });
  const materialCount = getSiteMaterialsCount(siteId);
  const employeeCount = getSiteEmployeesCount(siteId);
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <Badge variant={statusVariant}>{status}</Badge>
          </div>
          <div className="flex items-center mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" /> 
            <span>{location}</span>
          </div>
          <div className="flex items-center mt-1 text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" /> 
            <span>Started {format(parseISO(startDate), 'MMM d, yyyy')} ({duration} days ago)</span>
          </div>
        </div>
        
        <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Edit className="h-4 w-4 mr-1" /> Edit Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <SiteEditForm 
              site={{ id: siteId, name, location, startDate, status: status as any, createdAt: '', updatedAt: '' }} 
              onClose={() => setShowEditForm(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mt-2">
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs font-medium">Total Materials</div>
          <div className="text-2xl font-bold">{materialCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs font-medium">Total Workers</div>
          <div className="text-2xl font-bold">{employeeCount}</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs font-medium">Active Since</div>
          <div className="text-2xl font-bold">{duration} days</div>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <div className="text-muted-foreground text-xs font-medium">Status</div>
          <div className="text-2xl font-bold capitalize">{status}</div>
        </div>
      </div>
    </div>
  );
};

export default SiteHeader;
