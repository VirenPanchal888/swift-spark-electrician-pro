
import Navbar from '@/components/Navbar';
import EmployeeAllocationForm from '@/components/EmployeeAllocationForm';
import EmployeeList from '@/components/EmployeeList';

const Employees = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Employee Allocation</h1>
        
        <EmployeeAllocationForm />
        <EmployeeList />
      </main>
    </div>
  );
};

export default Employees;
