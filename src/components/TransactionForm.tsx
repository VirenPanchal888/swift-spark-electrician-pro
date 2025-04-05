
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const TransactionForm = () => {
  const { addTransaction } = useStore();
  const [materialName, setMaterialName] = useState('');
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!materialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }
    
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    // Add transaction to store
    addTransaction({
      materialName: materialName.trim(),
      amount: Number(amount),
      quantity: Number(quantity),
      date: new Date().toISOString(),
    });
    
    // Show success toast
    toast.success('Transaction added successfully');
    
    // Reset form
    setMaterialName('');
    setAmount('');
    setQuantity('');
  };
  
  return (
    <Card className="data-card">
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="materialName">Material Name</Label>
            <Input
              id="materialName"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g. Copper Wire"
              className="transition-all focus:ring-2 focus:ring-electric"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="transition-all focus:ring-2 focus:ring-electric"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full sparkle-btn bg-electric hover:bg-electric-dark">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
