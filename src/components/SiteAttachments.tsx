
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileIcon, ImageIcon, FileText, Plus, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SiteAttachmentsProps {
  siteId: string;
}

const SiteAttachments = ({ siteId }: SiteAttachmentsProps) => {
  const { documents, getSiteDocuments, addDocument, addSiteDocument, deleteSiteDocument } = useStore();
  const { toast } = useToast();
  
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);
  const [newAttachment, setNewAttachment] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileType: 'image',
    fileSize: 0,
  });
  
  const siteDocuments = getSiteDocuments(siteId);
  const siteDocsWithDetails = siteDocuments.map(siteDoc => {
    const doc = documents.find(d => d.id === siteDoc.documentId);
    return { ...siteDoc, details: doc };
  });
  
  const handleAddAttachment = () => {
    if (!newAttachment.title || !newAttachment.fileUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and file URL",
        variant: "destructive"
      });
      return;
    }
    
    // Add the document first
    const docId = crypto.randomUUID();
    addDocument({
      title: newAttachment.title,
      description: newAttachment.description,
      fileUrl: newAttachment.fileUrl,
      fileType: newAttachment.fileType,
      fileSize: newAttachment.fileSize || 0,
    });
    
    // Then associate it with the site
    addSiteDocument({
      siteId,
      documentId: docId,
      uploadDate: new Date().toISOString(),
      type: newAttachment.fileType,
    });
    
    toast({
      title: "Attachment Added",
      description: "The attachment has been added to the site"
    });
    
    // Reset form
    setNewAttachment({
      title: '',
      description: '',
      fileUrl: '',
      fileType: 'image',
      fileSize: 0,
    });
    
    setIsAddingAttachment(false);
  };
  
  const handleDeleteAttachment = (id: string) => {
    deleteSiteDocument(id);
    
    toast({
      title: "Attachment Removed",
      description: "The attachment has been removed from the site"
    });
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-10 w-10 text-blue-500" />;
      case 'pdf':
        return <FileIcon className="h-10 w-10 text-red-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Attachments & Logs</h3>
        <Dialog open={isAddingAttachment} onOpenChange={setIsAddingAttachment}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Attachment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Attachment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newAttachment.title} 
                  onChange={(e) => setNewAttachment({...newAttachment, title: e.target.value})}
                  placeholder="Document title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newAttachment.description} 
                  onChange={(e) => setNewAttachment({...newAttachment, description: e.target.value})}
                  placeholder="Brief description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-type">File Type</Label>
                <Tabs 
                  defaultValue="image" 
                  value={newAttachment.fileType}
                  onValueChange={(value) => setNewAttachment({...newAttachment, fileType: value})}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-url">File URL</Label>
                <Input 
                  id="file-url" 
                  value={newAttachment.fileUrl} 
                  onChange={(e) => setNewAttachment({...newAttachment, fileUrl: e.target.value})}
                  placeholder="URL to the file"
                />
                <p className="text-xs text-muted-foreground">
                  Note: In a production app, you would upload files to storage.
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddAttachment}>Add Attachment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-4">
          {siteDocsWithDetails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground mb-4">No attachments added to this site yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingAttachment(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> 
                Add Attachment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {siteDocsWithDetails.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 border rounded-lg hover-card flex flex-col"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <div className="font-medium line-clamp-1">{doc.details?.title || 'Unknown'}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(doc.uploadDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteAttachment(doc.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {doc.details?.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {doc.details.description}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      asChild
                    >
                      <a href={doc.details?.fileUrl} target="_blank" rel="noreferrer">
                        View File
                      </a>
                    </Button>
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

export default SiteAttachments;
