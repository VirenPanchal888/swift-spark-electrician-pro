
import jsPDF from 'jspdf';
import { useStore } from './store';
import { MaterialUsage } from './types';
import { formatRupees } from './formatters';
import html2canvas from 'html2canvas';

// Export data to PDF file with dashboard screenshots and complete data
export const exportToPDF = async () => {
  const store = useStore.getState();
  const transactions = store.transactions;
  const materials = store.materials;
  const employees = store.employees;
  const sites = store.sites;
  const documents = store.documents;
  const siteEmployees = store.siteEmployees;
  const siteMaterials = store.siteMaterials;
  const siteTasks = store.siteTasks;
  const siteDocuments = store.siteDocuments;
  const salaryRecords = store.salaryRecords || [];
  
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
  doc.text(`Total Documents: ${documents.length}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Total Salary Records: ${salaryRecords.length}`, 20, yPosition);
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
  
  // Add detailed sections for each data type
  
  // Transactions
  addNewPage();
  doc.setFontSize(16);
  doc.text("Detailed Transactions", 20, yPosition);
  yPosition += 15;
  
  transactions.forEach((transaction, index) => {
    if (yPosition > 250) {
      addNewPage();
    }
    
    doc.setFontSize(12);
    doc.text(`Transaction #${index + 1}: ${formatRupees(transaction.amount)}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(transaction.date).toLocaleDateString()}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Material: ${transaction.materialName}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Quantity: ${transaction.quantity}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Site: ${transaction.site || "N/A"}`, 25, yPosition);
    yPosition += 6;
    // Skip transaction type since it doesn't exist in the Transaction type
    yPosition += 12;
  });
  
  // Employees
  addNewPage();
  doc.setFontSize(16);
  doc.text("Employee Records", 20, yPosition);
  yPosition += 15;
  
  employees.forEach((employee, index) => {
    if (yPosition > 250) {
      addNewPage();
    }
    
    doc.setFontSize(12);
    doc.text(`Employee #${index + 1}: ${employee.name}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.text(`Site Location: ${employee.siteLocation || "N/A"}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Start Date: ${employee.startDate || "N/A"}`, 25, yPosition);
    yPosition += 6;
    doc.text(`End Date: ${employee.endDate || "N/A"}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Notes: ${employee.notes || "N/A"}`, 25, yPosition);
    yPosition += 12;
    
    // Get salary records for this employee
    const empSalaryRecords = salaryRecords.filter(
      record => record.employeeName.toLowerCase() === employee.name.toLowerCase()
    );
    
    if (empSalaryRecords.length > 0) {
      doc.text(`Salary History (${empSalaryRecords.length} records):`, 25, yPosition);
      yPosition += 8;
      
      empSalaryRecords.slice(0, 3).forEach((record) => {
        doc.text(`- ${record.date}: ${formatRupees(record.salaryPaid)}`, 30, yPosition);
        yPosition += 6;
      });
      
      if (empSalaryRecords.length > 3) {
        doc.text(`... and ${empSalaryRecords.length - 3} more records`, 30, yPosition);
        yPosition += 6;
      }
      
      yPosition += 6;
    }
  });
  
  // Sites
  addNewPage();
  doc.setFontSize(16);
  doc.text("Site Details", 20, yPosition);
  yPosition += 15;
  
  sites.forEach((site, index) => {
    if (yPosition > 230) {
      addNewPage();
    }
    
    doc.setFontSize(12);
    doc.text(`Site #${index + 1}: ${site.name}`, 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    // Remove clientName as it doesn't exist in the Site type
    doc.text(`Location: ${site.location}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Status: ${site.status}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Start Date: ${site.startDate}`, 25, yPosition);
    yPosition += 6;
    // Remove expectedEndDate as it doesn't exist in the Site type
    yPosition += 12;
    
    // Site employees
    const siteEmps = siteEmployees.filter(se => se.siteId === site.id);
    if (siteEmps.length > 0) {
      doc.text(`Assigned Employees (${siteEmps.length}):`, 25, yPosition);
      yPosition += 6;
      siteEmps.slice(0, 3).forEach((se, i) => {
        // Use employee ID instead of name since employeeName doesn't exist
        const employee = employees.find(emp => emp.id === se.employeeId);
        const employeeName = employee ? employee.name : se.employeeId;
        doc.text(`- ${employeeName}`, 30, yPosition);
        yPosition += 4;
      });
      if (siteEmps.length > 3) {
        doc.text(`... and ${siteEmps.length - 3} more`, 30, yPosition);
        yPosition += 4;
      }
      yPosition += 6;
    }
    
    // Site materials
    const siteMats = siteMaterials.filter(sm => sm.siteId === site.id);
    if (siteMats.length > 0) {
      doc.text(`Material Allocations (${siteMats.length}):`, 25, yPosition);
      yPosition += 6;
      siteMats.slice(0, 3).forEach((sm, i) => {
        doc.text(`- ${sm.materialName}: ${sm.quantity}`, 30, yPosition);
        yPosition += 4;
      });
      if (siteMats.length > 3) {
        doc.text(`... and ${siteMats.length - 3} more`, 30, yPosition);
        yPosition += 4;
      }
      yPosition += 8;
    }
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
  
  // Save the PDF file with comprehensive name
  doc.save(`powerhouse_complete_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
