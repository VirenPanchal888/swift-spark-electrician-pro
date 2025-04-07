
import { useState } from 'react';
import { Site, SiteStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Search } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface SiteListProps {
  sites: Site[];
  selectedSiteId: string | null;
  onSiteSelect: (siteId: string) => void;
  onAddSiteClick: () => void;
  getSiteTasksCount: (siteId: string) => number;
  getStatusIcon: (status: SiteStatus, size?: number) => React.ReactNode;
}

const SiteList = ({
  sites,
  selectedSiteId,
  onSiteSelect,
  onAddSiteClick,
  getSiteTasksCount,
  getStatusIcon
}: SiteListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         site.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSiteDuration = (site: { startDate: string }) => {
    const startDate = parseISO(site.startDate);
    const today = new Date();
    return differenceInDays(today, startDate);
  };

  return (
    <div className="w-full lg:w-1/4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Tracker</h1>
        <Button onClick={onAddSiteClick}>
          <Plus className="h-4 w-4 mr-2" /> New Site
        </Button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Sites ({filteredSites.length})</CardTitle>
          <CardDescription>Select a site to view details</CardDescription>
        </CardHeader>
        <CardContent className="p-0 max-h-[60vh] overflow-auto">
          {filteredSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <p className="text-muted-foreground mb-4">No sites found</p>
              <Button 
                variant="outline" 
                onClick={onAddSiteClick}
              >
                <Plus className="mr-1 h-4 w-4" /> 
                Add Your First Site
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredSites.map((site) => (
                <button
                  key={site.id}
                  className={`w-full text-left p-4 hover:bg-accent/50 transition-colors ${
                    selectedSiteId === site.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => onSiteSelect(site.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <span>{site.name}</span>
                        {getStatusIcon(site.status)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {site.location}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(site.startDate), 'dd MMM yyyy')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge 
                        variant="outline" 
                        className="mb-1"
                      >
                        {getSiteTasksCount(site.id)} tasks
                      </Badge>
                      <span className="text-xs">
                        {getSiteDuration(site)}d active
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteList;
