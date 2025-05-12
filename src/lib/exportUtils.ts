
import jsPDF from 'jspdf';
import { useStore } from './store';
import { MaterialUsage } from './types';
import { formatRupees } from './formatters';

// Export data to PDF file
export const exportToPDF = () => {
  const store = useStore.getState();
  const transactions = store.transactions;
  const materials = store.materials;
  
  // Calculate material usage data
  const materialUsage = store.calculateMaterialUsage();
  const totalCost = store.calculateTotalCost();
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text("Powerhouse Calculations Report", 20, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add summary section
  doc.setFontSize(14);
  doc.text("Summary", 20, 40);
  
  doc.setFontSize(12);
  doc.text(`Total Transactions: ${transactions.length}`, 20, 50);
  doc.text(`Total Materials: ${materials.length}`, 20, 60);
  doc.text(`Total Cost: ${formatRupees(totalCost)}`, 20, 70);
  
  // Add material usage breakdown
  doc.setFontSize(14);
  doc.text("Material Usage Breakdown", 20, 90);
  
  doc.setFontSize(10);
  doc.text("Material", 20, 100);
  doc.text("Quantity", 80, 100);
  doc.text("Total Cost", 120, 100);
  doc.text("Avg. Cost", 160, 100);
  
  // Draw a line
  doc.line(20, 102, 190, 102);
  
  // Add material usage data
  let yPosition = 110;
  materialUsage.forEach((material: MaterialUsage) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
      
      // Add header to new page
      doc.setFontSize(10);
      doc.text("Material", 20, yPosition);
      doc.text("Quantity", 80, yPosition);
      doc.text("Total Cost", 120, yPosition);
      doc.text("Avg. Cost", 160, yPosition);
      
      // Draw a line
      doc.line(20, yPosition + 2, 190, yPosition + 2);
      
      yPosition += 10;
    }
    
    doc.text(material.materialName.substring(0, 25), 20, yPosition);
    doc.text(material.totalQuantity.toFixed(2).toString(), 80, yPosition);
    doc.text(formatRupees(material.totalCost), 120, yPosition);
    doc.text(formatRupees(material.averageCost), 160, yPosition);
    
    yPosition += 10;
  });
  
  // Save the PDF file
  doc.save(`powerhouse_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
