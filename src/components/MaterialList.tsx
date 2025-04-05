
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { Edit, Trash, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Material } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Same form schema as in MaterialForm
const formSchema = z.object({
  materialName: z.string().min(1, 'Material name is required'),
  quantity: z.coerce.number().positive('Quantity must be a positive number'),
  unit: z.string().optional(),
  site: z.string().min(1, 'Site location is required'),
});

// Same units array as in MaterialForm
const UNITS = ['pieces', 'meters', 'kg', 'liters', 'rolls', 'boxes'];

const MaterialList = () => {
  const { materials, updateMaterial, deleteMaterial } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Material>('materialName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Initialize edit form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: '',
      quantity: 0,
      unit: 'pieces',
      site: '',
    },
  });

  // Reset form when selected material changes
  useEffect(() => {
    if (selectedMaterial) {
      form.reset({
        materialName: selectedMaterial.materialName,
        quantity: selectedMaterial.quantity,
        unit: selectedMaterial.unit || 'pieces',
        site: selectedMaterial.site,
      });
    }
  }, [selectedMaterial, form]);

  // Handle material edit
  const onEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsDialogOpen(true);
  };

  // Handle material deletion
  const onDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      deleteMaterial(id);
      toast.success('Material deleted successfully');
    }
  };

  // Handle edit form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedMaterial) {
      updateMaterial({
        ...selectedMaterial,
        materialName: values.materialName,
        quantity: values.quantity,
        unit: values.unit,
        site: values.site,
      });
      
      toast.success('Material updated successfully');
      setIsDialogOpen(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  // Handle sorting
  const handleSort = (key: keyof Material) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter and sort materials
  const filteredAndSortedMaterials = materials
    .filter((material) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        material.materialName.toLowerCase().includes(searchLower) ||
        material.site.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let compareA: string | number = a[sortKey] as string | number;
      let compareB: string | number = b[sortKey] as string | number;
      
      // Handle string comparison
      if (typeof compareA === 'string' && typeof compareB === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Material List</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No materials found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('materialName')}
                  >
                    Material Name {sortKey === 'materialName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity {sortKey === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort('site')}
                  >
                    Site {sortKey === 'site' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedMaterials.map((material) => (
                  <TableRow key={material.id} className="animate-fade-in">
                    <TableCell>{material.materialName}</TableCell>
                    <TableCell>
                      {material.quantity} {material.unit || 'pieces'}
                    </TableCell>
                    <TableCell>{material.site}</TableCell>
                    <TableCell>{formatDate(material.updatedAt)}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(material.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Material Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          step="any"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Location</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MaterialList;
