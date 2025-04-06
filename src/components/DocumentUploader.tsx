
import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Camera, FileIcon, Upload, X } from 'lucide-react';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const documentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  file: z
    .instanceof(window.File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
    .refine(
      file => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only JPEG, PNG, WebP images and PDF documents are accepted'
    ),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const DocumentUploader = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addDocument } = useStore();

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: DocumentFormValues) => {
    setIsUploading(true);
    
    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      try {
        // Add document to store
        addDocument({
          title: data.title,
          description: data.description || '',
          fileUrl: base64String,
          fileType: data.file.type,
          fileSize: data.file.size,
        });
        
        // Show success toast
        toast({
          title: "Document uploaded",
          description: "Your document has been successfully saved.",
        });
        
        // Reset form
        form.reset();
        setFilePreview(null);
        setIsUploading(false);
      } catch (error) {
        console.error('Error uploading document:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
        setIsUploading(false);
      }
    };
    
    reader.readAsDataURL(data.file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    form.setValue('file', file, { shouldValidate: true });
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedFile = () => {
    form.setValue('file', undefined as any);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Document Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter a title for your document" 
              {...form.register('title')}
            />
          </FormControl>
          <FormMessage>{form.formState.errors.title?.message}</FormMessage>
        </FormItem>
        
        <FormItem>
          <FormLabel>Description (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Add a description" 
              className="resize-none" 
              {...form.register('description')}
            />
          </FormControl>
        </FormItem>
        
        <div className="space-y-4">
          <Label>Upload Document</Label>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={triggerFileInput}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              Select File
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={triggerCameraInput}
            >
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              accept={ACCEPTED_FILE_TYPES.join(',')}
              className="hidden"
              onChange={handleFileChange}
            />
            
            <input
              type="file"
              capture="environment"
              ref={cameraInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          {filePreview && (
            <div className="relative mt-4 border border-border rounded-md p-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 z-10"
                onClick={clearSelectedFile}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {form.getValues('file')?.type.startsWith('image/') ? (
                <div className="aspect-video flex items-center justify-center overflow-hidden rounded-md bg-muted">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="object-contain max-h-[200px] w-auto"
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center rounded-md bg-muted">
                  <FileIcon className="h-12 w-12 text-muted-foreground" />
                  <span className="text-muted-foreground ml-2">
                    {form.getValues('file')?.name}
                  </span>
                </div>
              )}
              
              <div className="mt-2 text-sm text-muted-foreground">
                {form.getValues('file') && (
                  <p>
                    {form.getValues('file')?.name} ({(form.getValues('file')?.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            </div>
          )}
          
          {form.formState.errors.file && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.file.message}
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-electric hover:bg-electric-dark"
          disabled={isUploading || !form.getValues('file')}
        >
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> 
              Upload Document
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DocumentUploader;
