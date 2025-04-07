
import { Building2, MapPin, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { SiteStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface SiteHeaderProps {
  name: string;
  location: string;
  startDate: string;
  status: SiteStatus;
  getStatusVariant: (status: SiteStatus) => React.ReactNode;
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
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{name}</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Started {format(parseISO(startDate), 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>
          <div>
            {getStatusVariant(status)}
          </div>
        </div>
        
        <SiteMetricsCards 
          site={{ startDate }}
          siteId={siteId}
          getSiteDuration={getSiteDuration}
          getSiteMaterialsCount={getSiteMaterialsCount}
          getSiteEmployeesCount={getSiteEmployeesCount}
        />
      </CardContent>
    </Card>
  );
};

// Sub-component for site metrics cards
interface SiteMetricsCardsProps {
  site: { startDate: string };
  siteId: string;
  getSiteDuration: (site: { startDate: string }) => number;
  getSiteMaterialsCount: (siteId: string) => number;
  getSiteEmployeesCount: (siteId: string) => number;
}

const SiteMetricsCards = ({
  site,
  siteId,
  getSiteDuration,
  getSiteMaterialsCount,
  getSiteEmployeesCount
}: SiteMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <Card className="hover-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Duration</div>
            <div className="text-2xl font-semibold">{getSiteDuration(site)} days</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Materials</div>
            <div className="text-2xl font-semibold">{getSiteMaterialsCount(siteId)}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover-card">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Employees</div>
            <div className="text-2xl font-semibold">{getSiteEmployeesCount(siteId)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Importing missing components
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.29 7 12 12l8.71-5M12 22V12"></path></svg>
}

function Users(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
}

export default SiteHeader;
