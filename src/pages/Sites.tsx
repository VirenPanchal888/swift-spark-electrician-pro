import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import SiteForm from '@/components/SiteForm';
import SiteEmployeeAllocation from '@/components/SiteEmployeeAllocation';
import SiteMaterialFlow from '@/components/SiteMaterialFlow';
import TaskBoard from '@/components/TaskBoard';
import SiteAttachments from '@/components/SiteAttachments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import SiteList from '@/components/sites/SiteList';
import SiteHeader from '@/components/sites/SiteHeader';
import SiteOverview from '@/components/sites/SiteOverview';
import SiteEmptyState from '@/components/sites/SiteEmptyState';
import { getStatusVariant, getStatusIcon } from '@/components/sites/StatusUtils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, UserPlus } from 'lucide-react';

const Sites = () => {
  const { sites, employees, siteMaterials, siteTasks } = useStore();
  const { toast } = useToast();
  
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [showAddSiteForm, setShowAddSiteForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  
  useEffect(() => {
    document.title = 'Site Tracker | Powerhouse Solutions';
    
    if (sites.length > 0 && !selectedSiteId) {
      setSelectedSiteId(sites[0].id);
    }
  }, [sites, selectedSiteId]);
  
  const selectedSite = sites.find(site => site.id === selectedSiteId);
  
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
      
      <main className="page-container animate-fade-in px-2">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar for site selection */}
          {showAddSiteForm ? (
            <div className="w-full lg:w-1/3">
              <SiteForm onClose={() => setShowAddSiteForm(false)} />
            </div>
          ) : (
            <SiteList
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSiteSelect={handleSiteSelection}
              onAddSiteClick={() => setShowAddSiteForm(true)}
              getSiteTasksCount={getSiteTasksCount}
              getStatusIcon={getStatusIcon}
            />
          )}
          
          {/* Main content area */}
          <div className="flex-1 max-w-full overflow-hidden">
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
                  <SiteHeader
                    name={selectedSite.name}
                    location={selectedSite.location}
                    startDate={selectedSite.startDate}
                    status={selectedSite.status}
                    getStatusVariant={getStatusVariant}
                    getSiteDuration={getSiteDuration}
                    getSiteMaterialsCount={getSiteMaterialsCount}
                    getSiteEmployeesCount={getSiteEmployeesCount}
                    siteId={selectedSite.id}
                  />
                  
                  <div className="flex justify-between items-center">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="overflow-x-auto scrollable-tabs">
                        <TabsList className="w-full justify-start">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="employees">Employees</TabsTrigger>
                          <TabsTrigger value="materials">Materials</TabsTrigger>
                          <TabsTrigger value="tasks">Tasks</TabsTrigger>
                          <TabsTrigger value="attachments">Attachments</TabsTrigger>
                        </TabsList>
                      </div>
                    </Tabs>
                    
                    {activeTab === 'employees' && (
                      <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="ml-2 flex-shrink-0">
                            <UserPlus className="h-4 w-4 mr-1" /> Add Worker
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <div className="p-6">
                            <h3 className="text-lg font-medium mb-4">Add Worker</h3>
                            {/* We'll reuse the built-in employee allocation dialog */}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  <TabsContent value="overview">
                    <SiteOverview
                      siteId={selectedSite.id}
                      getSiteEmployeesCount={getSiteEmployeesCount}
                      getSiteMaterialsCount={getSiteMaterialsCount}
                      siteTasks={siteTasks}
                      onTabChange={setActiveTab}
                    />
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
                </motion.div>
              ) : (
                <SiteEmptyState 
                  sitesCount={sites.length} 
                  onAddSiteClick={() => setShowAddSiteForm(true)} 
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sites;
