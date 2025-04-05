
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatRupees } from '@/lib/formatters';

const TransactionList = () => {
  const { transactions, updateTransaction, deleteTransaction } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editMaterialName, setEditMaterialName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  
  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => 
    transaction.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Prepare transaction for editing
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditMaterialName(transaction.materialName);
    setEditAmount(transaction.amount.toString());
    setEditQuantity(transaction.quantity.toString());
  };
  
  // Save edited transaction
  const handleSave = () => {
    if (!editingTransaction) return;
    
    // Validate form data
    if (!editMaterialName.trim()) {
      toast.error('Please enter a material name');
      return;
    }
    
    if (isNaN(Number(editAmount)) || Number(editAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (isNaN(Number(editQuantity)) || Number(editQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    // Update transaction
    updateTransaction({
      ...editingTransaction,
      materialName: editMaterialName.trim(),
      amount: Number(editAmount),
      quantity: Number(editQuantity),
    });
    
    // Show success toast
    toast.success('Transaction updated successfully');
    
    // Clear editing state
    setEditingTransaction(null);
  };
  
  // Delete transaction
  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaction deleted successfully');
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <Card className="data-card mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction History</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Material</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Amount</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Quantity</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Date</th>
                  <th className="py-2 px-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">{transaction.materialName}</td>
                    <td className="py-3 px-4">{formatRupees(transaction.amount)}</td>
                    <td className="py-3 px-4">{transaction.quantity}</td>
                    <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEdit(transaction)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="editMaterialName">Material Name</Label>
                              <Input
                                id="editMaterialName"
                                value={editMaterialName}
                                onChange={(e) => setEditMaterialName(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="editAmount">Amount (₹)</Label>
                                <Input
                                  id="editAmount"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                />
                              </div>
                              
                              <div className="grid gap-2">
                                <Label htmlFor="editQuantity">Quantity</Label>
                                <Input
                                  id="editQuantity"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleSave} className="bg-electric hover:bg-electric-dark">Save Changes</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDelete(transaction.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
