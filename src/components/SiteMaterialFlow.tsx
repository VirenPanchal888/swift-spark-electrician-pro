
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Package, Plus, XCircle } from 'lucide-react';
import { format, compareDesc } from 'date-fns';

interface SiteMaterialFlowProps {
  siteId: string;
}

const SiteMaterialFlow = ({ siteId }: SiteMaterialFlowProps) => {
  const { materials, getSiteMaterials, addSiteMaterial, deleteSiteMaterial } = useStore();
  const { toast } = useToast();
  
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    materialId: '',
    materialName: '',
    quantity: 1,
    deliveryDate: new Date(),
    supplier: '',
    notes: ''
  });
  const [deliveryDateOpen, setDeliveryDateOpen] = useState(false);
  
  const siteMaterials = getSiteMaterials(siteId);
  const sortedMaterials = [...siteMaterials].sort((a, b) => 
    compareDesc(new Date(a.deliveryDate), new Date(b.deliveryDate))
  );
  
  const handleAddMaterial = () => {
    if (!newMaterial.materialName || newMaterial.quantity <= 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a material name and valid quantity",
        variant: "destructive"
      });
      return;
    }
    
    addSiteMaterial({
      siteId,
      materialId: newMaterial.materialId || crypto.randomUUID(),
      materialName: newMaterial.materialName,
      quantity: newMaterial.quantity,
      deliveryDate: newMaterial.deliveryDate.toISOString(),
      supplier: newMaterial.supplier,
      notes: newMaterial.notes
    });
    
    toast({
      title: "Material Added",
      description: "The material has been added to the site"
    });
    
    // Reset form
    setNewMaterial({
      materialId: '',
      materialName: '',
      quantity: 1,
      deliveryDate: new Date(),
      supplier: '',
      notes: ''
    });
    
    setIsAddingMaterial(false);
  };
  
  const handleDeleteMaterial = (id: string) => {
    deleteSiteMaterial(id);
    
    toast({
      title: "Material Removed",
      description: "The material has been removed from the site"
    });
  };
  
  const selectExistingMaterial = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setNewMaterial({
        ...newMaterial,
        materialId: material.id,
        materialName: material.materialName
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Material Flow</h3>
        <Dialog open={isAddingMaterial} onOpenChange={setIsAddingMaterial}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Material to Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Material</Label>
                <div className="flex gap-2">
                  <Input 
                    value={newMaterial.materialName} 
                    onChange={(e) => setNewMaterial({...newMaterial, materialName: e.target.value})}
                    placeholder="Material name"
                    className="flex-1"
                  />
                  {materials.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">Select Existing</Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 p-0">
                        <div className="max-h-60 overflow-auto">
                          {materials.map(material => (
                            <Button
                              key={material.id}
                              variant="ghost"
                              className="w-full justify-start text-left px-4 py-2"
                              onClick={() => selectExistingMaterial(material.id)}
                            >
                              {material.materialName}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  min="1"
                  value={newMaterial.quantity} 
                  onChange={(e) => setNewMaterial({...newMaterial, quantity: Number(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Delivery Date</Label>
                <Popover open={deliveryDateOpen} onOpenChange={setDeliveryDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="delivery-date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newMaterial.deliveryDate ? format(newMaterial.deliveryDate, "PP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newMaterial.deliveryDate}
                      onSelect={(date) => {
                        setNewMaterial({...newMaterial, deliveryDate: date ?? new Date()});
                        setDeliveryDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier (Optional)</Label>
                <Input 
                  id="supplier" 
                  value={newMaterial.supplier} 
                  onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                  placeholder="Supplier name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  value={newMaterial.notes} 
                  onChange={(e) => setNewMaterial({...newMaterial, notes: e.target.value})}
                  placeholder="Any additional information"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddMaterial}>Add Material</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-4">
          {siteMaterials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground mb-4">No materials added to this site yet</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingMaterial(true)}
              >
                <Plus className="mr-1 h-4 w-4" /> 
                Add Material
              </Button>
            </div>
          ) : (
            <div className="timeline">
              {sortedMaterials.map((material) => (
                <div className="timeline-item" key={material.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{material.materialName}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(material.deliveryDate), 'dd MMM yyyy')} • 
                        {material.quantity} units
                        {material.supplier && <> • From {material.supplier}</>}
                      </div>
                      {material.notes && (
                        <p className="text-sm mt-2 bg-muted/30 p-2 rounded">
                          {material.notes}
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
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

export default SiteMaterialFlow;
