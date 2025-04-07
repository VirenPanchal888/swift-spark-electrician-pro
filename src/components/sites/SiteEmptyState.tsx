
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiteEmptyStateProps {
  sitesCount: number;
  onAddSiteClick: () => void;
}

const SiteEmptyState = ({ sitesCount, onAddSiteClick }: SiteEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Site Selected</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {sitesCount > 0 
          ? "Select a site from the list to view details" 
          : "You don't have any sites yet. Create your first site to get started!"}
      </p>
      {sitesCount === 0 && (
        <Button onClick={onAddSiteClick}>
          <Plus className="h-4 w-4 mr-2" /> Create Site
        </Button>
      )}
    </div>
  );
};

export default SiteEmptyState;
