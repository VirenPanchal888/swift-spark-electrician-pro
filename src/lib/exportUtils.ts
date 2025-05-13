
import jsPDF from 'jspdf';
import { useStore } from './store';
import { MaterialUsage } from './types';
import { formatRupees } from './formatters';
import html2canvas from 'html2canvas';

// Export data to PDF file with dashboard screenshots
export const exportToPDF = async () => {
  const store = useStore.getState();
  const transactions = store.transactions;
  const materials = store.materials;
  const employees = store.employees;
  const sites = store.sites;
  
  // Calculate material usage data
  const materialUsage = store.calculateMaterialUsage();
  const totalCost = store.calculateTotalCost();
  
  // Create a new PDF document
  const doc = new jsPDF();
  let currentPage = 1;
  let yPosition = 20;
  
  // Helper function to add a new page
  const addNewPage = () => {
    doc.addPage();
    currentPage++;
    yPosition = 20;
    
    // Add header to new page
    doc.setFontSize(10);
    doc.text(`Powerhouse Report - Page ${currentPage}`, 20, 10);
  };
  
  // Add title
  doc.setFontSize(20);
  doc.text("Powerhouse Calculations Report", 20, yPosition);
  yPosition += 10;
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 10;
  
  // Add summary section
  doc.setFontSize(14);
  doc.text("Summary", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.text(`Total Transactions: ${transactions.length}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total Materials: ${materials.length}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total Employees: ${employees.length}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total Sites: ${sites.length}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total Cost: ${formatRupees(totalCost)}`, 20, yPosition);
  yPosition += 20;
  
  // Add material usage breakdown
  doc.setFontSize(14);
  doc.text("Material Usage Breakdown", 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.text("Material", 20, yPosition);
  doc.text("Quantity", 80, yPosition);
  doc.text("Total Cost", 120, yPosition);
  doc.text("Avg. Cost", 160, yPosition);
  yPosition += 2;
  
  // Draw a line
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 8;
  
  // Add material usage data
  materialUsage.forEach((material: MaterialUsage) => {
    if (yPosition > 270) {
      addNewPage();
    }
    
    doc.text(material.materialName.substring(0, 25), 20, yPosition);
    doc.text(material.totalQuantity.toFixed(2).toString(), 80, yPosition);
    doc.text(formatRupees(material.totalCost), 120, yPosition);
    doc.text(formatRupees(material.averageCost), 160, yPosition);
    
    yPosition += 10;
  });
  
  // Add dashboard screenshots if in browser environment
  if (typeof document !== 'undefined') {
    try {
      // Get all dashboard elements to capture
      const dashboardElements = document.querySelectorAll('.card:not(.site-card), [data-export-capture="true"]');
      
      // Capture each element as an image
      for (let i = 0; i < dashboardElements.length; i++) {
        const element = dashboardElements[i] as HTMLElement;
        if (element) {
          // Add a new page for each screenshot
          addNewPage();
          
          // Add section title
          doc.setFontSize(14);
          let elementTitle = "Dashboard Component";
          
          // Try to get a better title from the element
          const titleElement = element.querySelector('h1, h2, h3, .card-title');
          if (titleElement) {
            elementTitle = titleElement.textContent || elementTitle;
          }
          
          doc.text(`${elementTitle}`, 20, yPosition);
          yPosition += 10;
          
          // Capture the element
          const canvas = await html2canvas(element);
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate dimensions to fit the page while maintaining aspect ratio
          const imgWidth = Math.min(170, canvas.width);
          const imgHeight = canvas.height * imgWidth / canvas.width;
          
          // Add the image to the PDF
          doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      }
    } catch (error) {
      console.error("Failed to capture dashboard screenshots:", error);
      doc.text("Failed to capture dashboard screenshots", 20, yPosition);
      yPosition += 10;
    }
  }
  
  // Add export information
  doc.setFontSize(8);
  doc.text("* This report includes all available data from the Powerhouse application.", 20, 280);
  
  // Save the PDF file
  doc.save(`powerhouse_complete_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

