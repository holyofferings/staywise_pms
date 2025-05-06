import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add type declaration for jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => any;
    lastAutoTable: {
      finalY: number;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Invoice interfaces from your existing types
interface LineItem {
  id: string;
  name: string;
  hsnSac: string;
  roomRent: number;
  additionalCharges: number;
  inRoomService: number;
  serviceCharge: number;
  transportation: number;
  quantity: number;
  amount: number;
  taxRate: number;
  cgstRate?: number;
  sgstRate?: number;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  customer: {
    name: string;
    address: string;
    gstin: string;
  };
  hotel: {
    name: string;
    address: string;
    gstin: string;
    id: string;
  };
  stateOfSupply: string;
  placeOfSupply: string;
  items: LineItem[];
  terms: string;
  signatureUrl: string;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  subtotal: number;
  totalTax: number;
  roundOff: number;
  totalAmount: number;
  createdAt: string;
}

/**
 * Get all invoices
 */
export const getAllInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await axios.get(`${API_URL}/invoices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (id: string): Promise<Invoice> => {
  try {
    const response = await axios.get(`${API_URL}/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new invoice
 */
export const createInvoice = async (invoice: Partial<Invoice>): Promise<Invoice> => {
  try {
    const response = await axios.post(`${API_URL}/invoices`, invoice, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Update an invoice
 */
export const updateInvoice = async (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
  try {
    const response = await axios.put(`${API_URL}/invoices/${id}`, invoice, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error);
    throw error;
  }
};

/**
 * Generate HTML representation of the invoice
 * @param invoice The invoice data
 * @returns HTML string
 */
const generateInvoiceHTML = (invoice: any): string => {
  const isInterstate = invoice.stateOfSupply !== invoice.placeOfSupply;
  
  // Calculate totals
  let subtotal = 0;
  let totalTax = 0;
  
  // Process items for display
  const itemsHTML = invoice.items.map((item: any) => {
    const amount = item.amount || 0;
    const igstRate = item.taxRate || 18;
    const cgstRate = item.cgstRate || 9;
    const sgstRate = item.sgstRate || 9;
    
    const igstAmount = isInterstate ? amount * igstRate / 100 : 0;
    const cgstAmount = !isInterstate ? amount * cgstRate / 100 : 0;
    const sgstAmount = !isInterstate ? amount * sgstRate / 100 : 0;
    
    const taxAmount = isInterstate ? igstAmount : (cgstAmount + sgstAmount);
    const total = amount + taxAmount;
    
    subtotal += amount;
    totalTax += taxAmount;
    
    // Return HTML row based on tax type
    if (isInterstate) {
      return `
        <tr>
          <td class="item-name">${item.name}</td>
          <td class="hsn-sac">${item.hsnSac || 'N/A'}</td>
          <td class="amount">₹${amount.toFixed(2)}</td>
          <td class="tax-rate">${igstRate}%</td>
          <td class="tax-amount">₹${igstAmount.toFixed(2)}</td>
          <td class="total">₹${total.toFixed(2)}</td>
        </tr>
      `;
    } else {
      return `
        <tr>
          <td class="item-name">${item.name}</td>
          <td class="hsn-sac">${item.hsnSac || 'N/A'}</td>
          <td class="amount">₹${amount.toFixed(2)}</td>
          <td class="tax-rate">${cgstRate}%</td>
          <td class="tax-amount">₹${cgstAmount.toFixed(2)}</td>
          <td class="tax-rate">${sgstRate}%</td>
          <td class="tax-amount">₹${sgstAmount.toFixed(2)}</td>
          <td class="total">₹${total.toFixed(2)}</td>
        </tr>
      `;
    }
  }).join('');
  
  const grandTotal = subtotal + totalTax;
  
  // Format the grand total in words
  const numberToWords = (num: number): string => {
    const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (num === 0) return "Zero";
    
    const convertLessThanThousand = (n: number): string => {
      if (n < 20) return single[n];
      
      const digit = n % 10;
      if (n < 100) return tens[Math.floor(n / 10)] + (digit ? " " + single[digit] : "");
      
      return single[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertLessThanThousand(n % 100) : "");
    };
    
    let word = "";
    
    // Handle lakhs and crores for Indian number system
    if (num >= 10000000) { // Crore
      word += convertLessThanThousand(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    
    if (num >= 100000) { // Lakh
      word += convertLessThanThousand(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }
    
    if (num >= 1000) { // Thousand
      word += convertLessThanThousand(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    
    if (num > 0) {
      word += convertLessThanThousand(num);
    }
    
    return word.trim();
  };
  
  const amountInWords = `${numberToWords(Math.round(grandTotal))} Rupees Only`;
  
  // Create HTML template with better formatting
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.number}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @page {
          size: A4;
          margin: 1cm;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
          font-size: 12px;
          line-height: 1.4;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: white;
        }
        .invoice-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: #1a73e8;
        }
        .company-details {
          margin-bottom: 20px;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          border: 1px solid #eee;
          padding: 10px;
          background-color: #f9f9f9;
        }
        .invoice-details div {
          width: 45%;
        }
        .customer-heading, .invoice-heading {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1a73e8;
        }
        .detail-row {
          margin-bottom: 3px;
        }
        .detail-label {
          font-weight: bold;
          display: inline-block;
          width: 100px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #1a73e8;
          color: white;
          font-weight: normal;
        }
        .item-name {
          width: 30%;
        }
        .hsn-sac {
          width: 10%;
        }
        .amount, .tax-rate, .tax-amount, .total {
          width: 10%;
          text-align: right;
        }
        .amount-in-words {
          margin: 10px 0;
          font-style: italic;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .total-row {
          font-weight: bold;
          background-color: #f2f2f2;
        }
        .grand-total {
          font-weight: bold;
          font-size: 14px;
          background-color: #eaf1fb;
        }
        .terms {
          margin-top: 20px;
          border: 1px solid #eee;
          padding: 10px;
          background-color: #f9f9f9;
        }
        .terms-heading {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #1a73e8;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-box {
          width: 45%;
          border-top: 1px solid #333;
          padding-top: 5px;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 10px;
          color: #666;
          border-top: 1px dashed #ddd;
          padding-top: 10px;
        }
        .controls {
          padding: 10px;
          margin-bottom: 20px;
          text-align: center;
        }
        .control-button {
          padding: 10px 20px;
          background-color: #1a73e8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 0 5px;
          font-size: 14px;
        }
        .control-button:hover {
          background-color: #1557b0;
        }
        @media print {
          .controls {
            display: none;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
            border: none;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="controls">
        <button class="control-button" onclick="window.print()">Print Invoice</button>
        <button class="control-button" onclick="window.close()">Close</button>
      </div>
      
      <div class="invoice-container">
        <div class="invoice-header">
          <h1 class="invoice-title">TAX INVOICE</h1>
        </div>
        
        <div class="company-details">
          <div class="company-name">${invoice.hotel.name}</div>
          <div>${invoice.hotel.address}</div>
          <div><strong>GSTIN:</strong> ${invoice.hotel.gstin}</div>
        </div>
        
        <div class="invoice-details">
          <div>
            <div class="customer-heading">Bill To:</div>
            <div><strong>${invoice.customer.name}</strong></div>
            <div>${invoice.customer.address || 'N/A'}</div>
            ${invoice.customer.gstin ? `<div><strong>GSTIN:</strong> ${invoice.customer.gstin}</div>` : ''}
          </div>
          <div>
            <div class="invoice-heading">Invoice Details:</div>
            <div class="detail-row"><span class="detail-label">Invoice No:</span> ${invoice.number}</div>
            <div class="detail-row"><span class="detail-label">Date:</span> ${new Date(invoice.date).toLocaleDateString('en-IN')}</div>
            <div class="detail-row"><span class="detail-label">Due Date:</span> ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
            <div class="detail-row"><span class="detail-label">Supply Type:</span> ${isInterstate ? 'Interstate (IGST)' : 'Intrastate (CGST + SGST)'}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th class="item-name">Description</th>
              <th class="hsn-sac">HSN/SAC</th>
              <th class="amount">Amount</th>
              ${isInterstate ? `
                <th class="tax-rate">IGST Rate</th>
                <th class="tax-amount">IGST Amt</th>
              ` : `
                <th class="tax-rate">CGST Rate</th>
                <th class="tax-amount">CGST Amt</th>
                <th class="tax-rate">SGST Rate</th>
                <th class="tax-amount">SGST Amt</th>
              `}
              <th class="total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr class="total-row">
              <td colspan="2">Subtotal</td>
              <td class="amount">₹${subtotal.toFixed(2)}</td>
              ${isInterstate ? `
                <td></td>
                <td></td>
              ` : `
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              `}
              <td></td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Tax</td>
              <td></td>
              ${isInterstate ? `
                <td></td>
                <td class="tax-amount">₹${totalTax.toFixed(2)}</td>
              ` : `
                <td></td>
                <td class="tax-amount">₹${(totalTax / 2).toFixed(2)}</td>
                <td></td>
                <td class="tax-amount">₹${(totalTax / 2).toFixed(2)}</td>
              `}
              <td></td>
            </tr>
            <tr class="grand-total">
              <td colspan="2">GRAND TOTAL</td>
              <td></td>
              ${isInterstate ? `
                <td></td>
                <td></td>
              ` : `
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              `}
              <td class="total">₹${grandTotal.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="amount-in-words">
          Amount in words: <strong>${amountInWords}</strong>
        </div>
        
        <div class="terms">
          <div class="terms-heading">Terms and Conditions</div>
          <div>${invoice.terms ? invoice.terms.replace(/\n/g, '<br>') : ''}</div>
        </div>
        
        <div class="signatures">
          <div class="signature-box">
            <div>Authorized Signature</div>
          </div>
          <div class="signature-box">
            <div>Customer Signature</div>
          </div>
        </div>
        
        <div class="footer">
          <div>This is a computer generated invoice and does not require signature.</div>
          ${isInterstate ? 
            `Inter-State Supply from ${invoice.stateOfSupply} to ${invoice.placeOfSupply}` : 
            `Subject to ${invoice.stateOfSupply} Jurisdiction.`
          }
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Download invoice as a printable HTML
 * This generates a printable HTML page instead of a PDF
 */
export const downloadInvoicePdf = (id: string): void => {
  try {
    console.log('Starting invoice generation for ID:', id);

    // Find invoice in local state
    const savedInvoices = localStorage.getItem('invoices');
    const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];
    const invoice = invoices.find((inv: any) => inv.id === id);
    
    if (!invoice) {
      console.error('Invoice not found');
      alert('Invoice not found. Please save the invoice first.');
      return;
    }
    
    // Generate HTML content
    const htmlContent = generateInvoiceHTML(invoice);
    
    // Create a blob with the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Open the URL in a new window
    const newWindow = window.open(url, '_blank');
    
    // Cleanup the URL once the window is loaded
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        URL.revokeObjectURL(url);
      });
    }
    
    console.log('Invoice opened in new window');
  } catch (error) {
    console.error('Error generating invoice:', error);
    alert(`Failed to generate invoice: ${error.message || 'Unknown error'}`);
  }
}; 