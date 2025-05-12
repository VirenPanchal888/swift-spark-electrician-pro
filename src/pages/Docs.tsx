import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentList from '@/components/DocumentList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload } from 'lucide-react';
const Docs = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const {
    toast
  } = useToast();
  const {
    documents
  } = useStore();
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <div className="flex flex-col justify-between mb-8">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">📑 Document Management</h1>
            <p className="text-gray-600 mt-2">Upload, view, and manage your documents and images</p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="upload" className="data-[state=active]:bg-electric data-[state=active]:text-white">
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Documents</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-electric-light data-[state=active]:text-white">
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                <span>My Documents</span>
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Upload images, screenshots or documents</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentUploader />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
                <CardDescription>View and manage your uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                <DocumentList documents={documents} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default Docs;