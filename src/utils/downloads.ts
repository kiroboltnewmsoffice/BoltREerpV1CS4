// Utility functions for file downloads and exports

export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  downloadFile(csvContent, filename, 'text/csv');
};

export const downloadJSON = (data: any, filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const downloadPDF = (content: string, filename: string) => {
  // Simple text-based PDF-like content
  // In a real app, you'd use a PDF generation library like jsPDF
  downloadFile(content, filename, 'application/pdf');
};

export const generateContractDocument = (contract: any, customer: any, unit: any, property: any) => {
  return `
CONTRACT AGREEMENT
==================

Contract Number: ${contract.contractNumber || 'N/A'}
Date: ${new Date(contract.signedDate || Date.now()).toLocaleDateString()}

CUSTOMER INFORMATION:
---------------------
Name: ${customer?.name || 'Unknown Customer'}
Email: ${customer?.email || 'N/A'}
Phone: ${customer?.phone || 'N/A'}
Address: ${customer?.address || 'N/A'}

PROPERTY DETAILS:
-----------------
Property: ${property?.name || 'Unknown Property'}
Location: ${property?.location || 'N/A'}
Unit Number: ${unit?.unitNumber || 'N/A'}
Unit Size: ${unit?.size || 'N/A'} sqm
Unit Type: ${unit?.type || 'N/A'}
Floor: ${unit?.floor || 'N/A'}

FINANCIAL TERMS:
----------------
Total Value: EGP ${(contract.totalValue || 0).toLocaleString()}
Payment Terms: ${contract.paymentTerms || 'Standard payment terms apply'}

CONTRACT STATUS:
----------------
Status: ${(contract.status || 'draft').replace('_', ' ').toUpperCase()}
Legal Review: ${contract.legalReviewed ? 'Completed' : 'Pending'}
${contract.reviewedBy ? `Reviewed By: ${contract.reviewedBy}` : ''}

ATTACHMENTS:
------------
${contract.documents ? contract.documents.map((doc: string) => `- ${doc}`).join('\n') : 'No attachments'}

TERMS AND CONDITIONS:
---------------------
1. This contract is subject to Egyptian property law
2. All payments must be made as per the agreed schedule
3. Property delivery is subject to completion and legal clearances
4. Any modifications to this contract must be in writing

Generated on: ${new Date().toLocaleString()}
System: Real Estate ERP v1.0

---
This is an electronically generated document.
`.trim();
};
