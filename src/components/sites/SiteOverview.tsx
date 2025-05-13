
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, CircleCheck, Clock, CircleAlert } from 'lucide-react';
import { SiteTask } from '@/lib/types';

interface SiteOverviewProps {
  siteId: string;
  getSiteEmployeesCount: (siteId: string) => number;
  getSiteMaterialsCount: (siteId: string) => number;
  siteTasks: SiteTask[];
  onTabChange: (tab: string) => void;
}

const SiteOverview = ({ 
  siteId, 
  getSiteEmployeesCount, 
  getSiteMaterialsCount, 
  siteTasks,
  onTabChange
}: SiteOverviewProps) => {
  const siteTasksFiltered = siteTasks.filter(task => task.siteId === siteId);
  
  return (
    <div className="space-y-4 mt-4 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg">Employee Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {getSiteEmployeesCount(siteId) === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-2">No employees assigned</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onTabChange('employees')}
                >
                  Assign Employees
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-2xl font-bold">{getSiteEmployeesCount(siteId)}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onTabChange('employees')}
                >
                  View All Employees
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-base sm:text-lg">Materials Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            {getSiteMaterialsCount(siteId) === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-2">No materials added</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onTabChange('materials')}
                >
                  Add Materials
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-2xl font-bold">{getSiteMaterialsCount(siteId)}</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => onTabChange('materials')}
                >
                  View All Materials
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="p-3 sm:p-4">
          <CardTitle className="text-base sm:text-lg">Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          {siteTasksFiltered.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">No tasks created</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTabChange('tasks')}
              >
                Create Tasks
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {siteTasksFiltered
                  .slice(0, 3)
                  .map(task => (
                    <div key={task.id} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                      <div className="mt-0.5 flex-shrink-0">
                        {task.status === 'completed' && <CircleCheck className="h-4 w-4 text-green-500" />}
                        {task.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-500" />}
                        {task.status === 'pending' && <CircleAlert className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{task.title}</div>
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
                onClick={() => onTabChange('tasks')}
              >
                View All Tasks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteOverview;
