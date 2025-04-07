
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import SiteForm from '@/components/SiteForm';
import SiteEmployeeAllocation from '@/components/SiteEmployeeAllocation';
import SiteMaterialFlow from '@/components/SiteMaterialFlow';
import TaskBoard from '@/components/TaskBoard';
import SiteAttachments from '@/components/SiteAttachments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CircleCheck, 
  CirclePause, 
  CircleAlert,
  Plus,
  Search,
  Clock
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { SiteStatus } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const Sites = () => {
  const { sites, employees, siteMaterials, siteTasks } = useStore();
  const { toast } = useToast();
  
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    document.title = 'Site Tracker | Powerhouse Solutions';
    
    if (sites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId]);
  
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const selectedSite = sites.find(site => site.id === selectedSiteId);
  
  const getStatusVariant = (status: SiteStatus) => {
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
  
  const getStatusIcon = (status: SiteStatus, size = 16) => {
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
  
  // Calculate site metrics
  const getSiteTasksCount = (siteId: string) => {
    return siteTasks.filter(task => task.siteId === siteId).length;
  };
  
  const getSiteEmployeesCount = (siteId: string) => {
    return employees.filter(emp => emp.siteLocation === siteId).length;
  };
  
  const getSiteMaterialsCount = (siteId: string) => {
    return siteMaterials.filter(mat => mat.siteId === siteId).length;
  };
  
  const getSiteDuration = (site: { startDate: string }) => {
    const startDate = parseISO(site.startDate);
    const today = new Date();
    return differenceInDays(today, startDate);
  };
  
  const handleSiteSelection = (siteId: string) => {
    setSelectedSiteId(siteId);
    setActiveTab('overview');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar for site selection */}
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Site Tracker</h1>
              <Button onClick={() => setShowAddSiteForm(true)}>
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
            
            {showAddSiteForm ? (
              <SiteForm onClose={() => setShowAddSiteForm(false)} />
            ) : (
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
                        onClick={() => setShowAddSiteForm(true)}
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
                          onClick={() => handleSiteSelection(site.id)}
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
            )}
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {selectedSite ? (
                <motion.div
                  key={selectedSite.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h2 className="text-2xl font-bold">{selectedSite.name}</h2>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{selectedSite.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Started {format(parseISO(selectedSite.startDate), 'dd MMM yyyy')}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {getStatusVariant(selectedSite.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        <Card className="hover-card">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="bg-primary/10 rounded-full p-3">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Duration</div>
                              <div className="text-2xl font-semibold">{getSiteDuration(selectedSite)} days</div>
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
                              <div className="text-2xl font-semibold">{getSiteMaterialsCount(selectedSite.id)}</div>
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
                              <div className="text-2xl font-semibold">{getSiteEmployeesCount(selectedSite.id)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="employees">Employees</TabsTrigger>
                      <TabsTrigger value="materials">Materials</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Employee Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {getSiteEmployeesCount(selectedSite.id) === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground mb-2">No employees assigned</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setActiveTab('employees')}
                                >
                                  Assign Employees
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="text-2xl font-bold">{getSiteEmployeesCount(selectedSite.id)}</div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => setActiveTab('employees')}
                                >
                                  View All Employees
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Materials Overview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {getSiteMaterialsCount(selectedSite.id) === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-muted-foreground mb-2">No materials added</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setActiveTab('materials')}
                                >
                                  Add Materials
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="text-2xl font-bold">{getSiteMaterialsCount(selectedSite.id)}</div>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => setActiveTab('materials')}
                                >
                                  View All Materials
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {getSiteTasksCount(selectedSite.id) === 0 ? (
                            <div className="text-center py-4">
                              <p className="text-muted-foreground mb-2">No tasks created</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setActiveTab('tasks')}
                              >
                                Create Tasks
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                {siteTasks
                                  .filter(task => task.siteId === selectedSite.id)
                                  .slice(0, 3)
                                  .map(task => (
                                    <div key={task.id} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                                      <div className="mt-0.5">
                                        {task.status === 'completed' && <CircleCheck className="h-4 w-4 text-green-500" />}
                                        {task.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-500" />}
                                        {task.status === 'pending' && <CircleAlert className="h-4 w-4 text-yellow-500" />}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-medium">{task.title}</div>
                                        {task.description && (
                                          <div className="text-sm text-muted-foreground line-clamp-1">
                                            {task.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setActiveTab('tasks')}
                              >
                                View All Tasks
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="employees" className="space-y-4 mt-4">
                      <SiteEmployeeAllocation siteId={selectedSite.id} />
                    </TabsContent>
                    
                    <TabsContent value="materials" className="space-y-4 mt-4">
                      <SiteMaterialFlow siteId={selectedSite.id} />
                    </TabsContent>
                    
                    <TabsContent value="tasks" className="space-y-4 mt-4">
                      <TaskBoard siteId={selectedSite.id} />
                    </TabsContent>
                    
                    <TabsContent value="attachments" className="space-y-4 mt-4">
                      <SiteAttachments siteId={selectedSite.id} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Site Selected</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    {sites.length > 0 
                      ? "Select a site from the list to view details" 
                      : "You don't have any sites yet. Create your first site to get started!"}
                  </p>
                  {sites.length === 0 && (
                    <Button onClick={() => setShowAddSiteForm(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create Site
                    </Button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sites;

// Importing missing components
function Package(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.29 7 12 12l8.71-5M12 22V12"></path></svg>
}

function Users(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
}
