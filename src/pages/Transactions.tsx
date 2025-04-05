
import Navbar from '@/components/Navbar';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

const Transactions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Management</h1>
        
        <TransactionForm />
        <TransactionList />
      </main>
    </div>
  );
};

export default Transactions;
