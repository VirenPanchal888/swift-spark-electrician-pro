
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
  
  // Define colors
  const primaryColor = '#9b87f5';
  const secondaryColor = '#7E69AB';
  const darkText = '#333333';
  const lightText = '#FFFFFF';
  const lightGray = '#F6F6F7';
  const borderColor = '#E5DEFF';
  
  // Set background color
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  
  // Add gradient header
  doc.setFillColor(155, 135, 245); // Primary purple
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add subtle pattern to header
  for (let i = 0; i < 40; i += 4) {
    doc.setDrawColor(255, 255, 255, 0.1);
    doc.setLineWidth(0.5);
    doc.line(0, i, 210, i);
  }
  
  // Add company logo at the top
  try {
    doc.addImage('/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png', 'PNG', 10, 8, 30, 30);
  } catch (error) {
    console.error('Failed to add logo to receipt', error);
  }
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('SALARY PAYMENT RECEIPT', 105, 25, { align: 'center' });
  
  // Add colored background for content
  doc.setFillColor(250, 250, 252);
  doc.rect(15, 50, 180, 225, 'F');
  
  // Add border
  doc.setDrawColor(155, 135, 245); // Border color
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 50, 180, 225, 3, 3, 'S');
  
  // Decorative elements
  doc.setDrawColor(155, 135, 245, 0.5);
  doc.setLineWidth(0.5);
  doc.line(15, 80, 195, 80); // Horizontal line below header info
  doc.line(15, 130, 195, 130); // Horizontal line below recipient details
  doc.line(15, 180, 195, 180); // Horizontal line below payment details
  
  // Add subtle watermark
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(60);
  doc.setTextColor(245, 245, 250, 0.5);
  doc.text('PAID', 105, 150, {
    align: 'center',
    angle: 45
  });
  
  // Set text color for content
  doc.setTextColor(darkText);
  doc.setFont('helvetica', 'normal');
  
  // Add receipt details
  const startY = 65;
  const startX = 25;
  const lineHeight = 10;
  let y = startY;
  
  // Receipt number and date section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Receipt: #${record.id.substring(0, 8).toUpperCase()}`, startX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${record.date}`, 145, y);
  y += lineHeight * 2;
  
  // Employee information
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor);
  doc.text('RECIPIENT INFORMATION', startX, y);
  y += lineHeight;
  
  // Add decorative accent
  doc.setFillColor(155, 135, 245, 0.2);
  doc.rect(startX, y, 3, 15, 'F');
  
  doc.setTextColor(darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Employee Name:`, startX + 8, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.employeeName}`, startX + 60, y + 5);
  y += lineHeight * 3.5;
  
  // Payment details section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(secondaryColor);
  doc.text('PAYMENT DETAILS', startX, y);
  y += lineHeight;
  
  // Add decorative accent
  doc.setFillColor(155, 135, 245, 0.2);
  doc.rect(startX, y, 3, 35, 'F');
  
  // Payment details in a nicely formatted layout
  doc.setTextColor(darkText);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Date:`, startX + 8, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.date}`, startX + 60, y + 5);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Time:`, startX + 8, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.time}`, startX + 60, y + 15);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Method:`, startX + 8, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cash`, startX + 60, y + 25);
  
  y += lineHeight * 4.5;
  
  // Payment amount (highlighted)
  doc.setFillColor(155, 135, 245, 0.15);
  doc.roundedRect(startX, y, 160, 20, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`AMOUNT PAID:`, startX + 8, y + 13);
  
  doc.setFontSize(14);
  doc.text(`${formatRupees(record.salaryPaid)}`, startX + 80, y + 13);
  y += lineHeight * 3;
  
  // Add the screenshot if available
  if (record.screenshot) {
    try {
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PAYMENT VERIFICATION', startX, y);
      y += 10;
      
      // Draw a border for the image
      doc.setDrawColor(155, 135, 245);
      doc.setLineWidth(0.5);
      doc.rect(60, y, 90, 45);
      
      // Add the image
      doc.addImage(record.screenshot, 'JPEG', 60, y, 90, 45);
      y += 50;
    } catch (error) {
      console.error('Failed to add image to receipt', error);
    }
  }
  
  // Add signature section
  y = 235;
  doc.setLineWidth(0.5);
  doc.line(25, y, 85, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Employer Signature', 55, y + 5, { align: 'center' });
  
  doc.line(125, y, 185, y);
  doc.text('Employee Signature', 155, y + 5, { align: 'center' });
  
  // Add footer
  doc.setFillColor(155, 135, 245);
  doc.rect(0, 277, 210, 20, 'F');
  
  // Add logo in footer
  try {
    doc.addImage('/lovable-uploads/e9592ba8-41f9-4a72-9de9-b581801a1755.png', 'PNG', 10, 279, 15, 15);
  } catch (error) {
    console.error('Failed to add logo to footer', error);
  }
  
  // Footer text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('This is an electronically generated receipt. No signature required.', 105, 287, { align: 'center' });
  
  // Add QR code placeholder (simulated with a square)
  doc.setDrawColor(255, 255, 255);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(175, 279, 15, 15, 1, 1, 'FD');
  
  // Save the PDF
  const fileName = `Salary_Receipt_${record.employeeName.replace(/\s+/g, '_')}_${record.date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
