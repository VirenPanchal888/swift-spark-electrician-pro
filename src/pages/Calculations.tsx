import Navbar from '@/components/Navbar';
import CalculationTool from '@/components/CalculationTool';
const Calculations = () => {
  return <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="page-container animate-fade-in">
        <h1 className="font-bold text-gray-900 mb-8 text-2xl">🖩 Calculation & Analysis</h1>
        
        <CalculationTool />
      </main>
    </div>;
};
export default Calculations;