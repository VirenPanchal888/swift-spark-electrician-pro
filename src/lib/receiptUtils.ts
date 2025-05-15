
import jsPDF from 'jspdf';
import { SalaryRecord } from './types';
import { formatRupees } from './formatters';

/**
 * Generate a professional PDF receipt for salary payment
 */
export const generateSalaryReceipt = (record: SalaryRecord) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Add header with purple accent
  doc.setFillColor(155, 135, 245); // Light purple header
  doc.rect(0, 0, 210, 35, 'F');
  
  // Add company logo at the top
  try {
    doc.addImage('/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png', 'PNG', 10, 5, 25, 25);
  } catch (error) {
    console.error('Failed to add logo to receipt', error);
  }
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('SALARY PAYMENT RECEIPT', 105, 20, { align: 'center' });
  
  // Add border details
  doc.setDrawColor(155, 135, 245); // Purple border
  doc.setLineWidth(0.5);
  doc.rect(15, 45, 180, 230, 'S');
  
  // Set text color for content
  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  
  // Add receipt details
  const startY = 60;
  const startX = 25;
  const lineHeight = 10;
  let y = startY;
  
  // Receipt number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Receipt No: ${record.id.substring(0, 8).toUpperCase()}`, startX, y);
  y += lineHeight * 2;
  
  // Employee information
  doc.setFontSize(14);
  doc.text('RECIPIENT DETAILS', startX, y);
  y += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Name: ${record.employeeName}`, startX, y);
  y += lineHeight;
  
  // Draw horizontal separator
  y += lineHeight / 2;
  doc.line(startX, y, 185, y);
  y += lineHeight;
  
  // Payment details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PAYMENT DETAILS', startX, y);
  y += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Date: ${record.date}`, startX, y);
  y += lineHeight;
  doc.text(`Time: ${record.time}`, startX, y);
  y += lineHeight * 1.5;
  
  // Payment amount (highlighted)
  doc.setFillColor(245, 245, 250);
  doc.rect(startX, y - 5, 160, 15, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text(`Amount Paid: ${formatRupees(record.salaryPaid)}`, startX + 5, y + 3);
  y += lineHeight * 2;
  
  // Add payment method section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PAYMENT METHOD', startX, y);
  y += lineHeight;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Payment method: Cash', startX, y);
  y += lineHeight * 2;
  
  // Add the screenshot if available
  if (record.screenshot) {
    try {
      doc.addImage(record.screenshot, 'JPEG', 65, y, 80, 50);
      y += 55;
    } catch (error) {
      console.error('Failed to add image to receipt', error);
    }
  }
  
  // Add signature section
  y += lineHeight * 2;
  doc.line(startX, y, startX + 60, y);
  doc.text('Employer Signature', startX + 15, y + 5);
  
  doc.line(startX + 100, y, startX + 160, y);
  doc.text('Employee Signature', startX + 115, y + 5);
  
  // Add logo in footer
  try {
    doc.addImage('/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png', 'PNG', 15, 277, 15, 15);
  } catch (error) {
    console.error('Failed to add logo to footer', error);
  }
  
  // Add footer
  doc.setFillColor(155, 135, 245);
  doc.rect(0, 277, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('This is an electronically generated receipt. No signature required.', 105, 287, { align: 'center' });
  
  // Save the PDF
  const fileName = `Salary_Receipt_${record.employeeName.replace(/\s+/g, '_')}_${record.date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
