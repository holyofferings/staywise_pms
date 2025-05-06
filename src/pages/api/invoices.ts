import type { NextApiRequest, NextApiResponse as BaseNextApiResponse } from 'next';

// Define extended NextApiResponse type that includes setHeader
type NextApiResponse = BaseNextApiResponse & {
  setHeader: (name: string, value: string) => void;
};

// Define the invoice interface
interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  roomType: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  gstin: string;
  sacCode: string;
  cgst: number;
  sgst: number;
  igst: number;
  hotelDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  guestDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

// Mock database for invoices
let invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2023-001",
    date: "2023-06-15",
    customerName: "John Smith",
    roomType: "Deluxe",
    amount: 12500,
    status: "paid",
    gstin: "22AAAAA0000A1Z5",
    sacCode: "996311",
    cgst: 1125,
    sgst: 1125,
    igst: 0,
    hotelDetails: {
      name: "Hotel Sunshine",
      address: "123 Main Street, City, State, 400001",
      phone: "+91 9876543210",
      email: "contact@hotelsunshine.com"
    },
    guestDetails: {
      name: "John Smith",
      address: "456 Park Avenue, City, State, 500001",
      phone: "+91 9876543211",
      email: "john.smith@example.com"
    },
    items: [
      {
        description: "Deluxe Room (3 nights)",
        quantity: 3,
        rate: 3500,
        amount: 10500
      },
      {
        description: "Room Service",
        quantity: 1,
        rate: 2000,
        amount: 2000
      }
    ]
  },
  {
    id: "2",
    invoiceNumber: "INV-2023-002",
    date: "2023-06-18",
    customerName: "Jane Doe",
    roomType: "Suite",
    amount: 18500,
    status: "pending",
    gstin: "22BBBBB0000B1Z5",
    sacCode: "996311",
    cgst: 1665,
    sgst: 1665,
    igst: 0,
    hotelDetails: {
      name: "Hotel Sunshine",
      address: "123 Main Street, City, State, 400001",
      phone: "+91 9876543210",
      email: "contact@hotelsunshine.com"
    },
    guestDetails: {
      name: "Jane Doe",
      address: "789 Oak Street, City, State, 600001",
      phone: "+91 9876543212",
      email: "jane.doe@example.com"
    },
    items: [
      {
        description: "Suite Room (2 nights)",
        quantity: 2,
        rate: 7500,
        amount: 15000
      },
      {
        description: "Breakfast",
        quantity: 4,
        rate: 500,
        amount: 2000
      },
      {
        description: "Airport Transfer",
        quantity: 1,
        rate: 1500,
        amount: 1500
      }
    ]
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/invoices - List all invoices
  if (req.method === 'GET') {
    // Check if there's a query for a specific invoice
    const { id } = req.query;
    
    if (id) {
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        return res.status(200).json(invoice);
      } else {
        return res.status(404).json({ error: 'Invoice not found' });
      }
    }
    
    return res.status(200).json(invoices);
  }

  // POST /api/invoices - Create a new invoice
  if (req.method === 'POST') {
    const invoice = req.body as Invoice;
    
    // Validate the invoice
    if (!invoice.customerName || !invoice.items || invoice.items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate an ID if not provided
    if (!invoice.id) {
      invoice.id = Date.now().toString();
    }
    
    // Add the invoice to the database
    invoices.push(invoice);
    
    return res.status(201).json(invoice);
  }

  // PUT /api/invoices/:id - Update an invoice
  if (req.method === 'PUT') {
    const { id } = req.query;
    const updatedInvoice = req.body as Invoice;
    
    // Find the invoice
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Update the invoice
    invoices[index] = { ...invoices[index], ...updatedInvoice };
    
    return res.status(200).json(invoices[index]);
  }

  // DELETE /api/invoices/:id - Delete an invoice
  if (req.method === 'DELETE') {
    const { id } = req.query;
    
    // Find the invoice
    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    // Remove the invoice
    invoices.splice(index, 1);
    
    return res.status(200).json({ message: 'Invoice deleted successfully' });
  }

  // Method not allowed
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
} 