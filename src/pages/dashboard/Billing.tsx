import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Download, 
  PrinterIcon, 
  FileText,
  Edit,
  Save,
  ArrowLeft,
  Search,
  Filter,
  EyeIcon,
  Check,
  Clock,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { downloadInvoicePdf } from '../../api/invoice-api';

// Interface for Line Item
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
  taxRate?: number; // IGST rate (for interstate)
  cgstRate?: number; // Separate CGST rate
  sgstRate?: number; // Separate SGST rate
}

// Interface for Invoice
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
  };
  stateOfSupply: string;
  placeOfSupply: string;
  items: LineItem[];
  terms: string;
  signatureUrl: string;
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  totalAmount: number;
  createdAt: string;
}

// Interface for Indian states
interface IndianState {
  name: string;
  code: string;
  gstCode: string;
}

// List of Indian states with GST state codes
const indianStates: IndianState[] = [
  { name: "Andhra Pradesh", code: "AP", gstCode: "37" },
  { name: "Arunachal Pradesh", code: "AR", gstCode: "12" },
  { name: "Assam", code: "AS", gstCode: "18" },
  { name: "Bihar", code: "BR", gstCode: "10" },
  { name: "Chhattisgarh", code: "CG", gstCode: "22" },
  { name: "Goa", code: "GA", gstCode: "30" },
  { name: "Gujarat", code: "GJ", gstCode: "24" },
  { name: "Haryana", code: "HR", gstCode: "06" },
  { name: "Himachal Pradesh", code: "HP", gstCode: "02" },
  { name: "Jharkhand", code: "JH", gstCode: "20" },
  { name: "Karnataka", code: "KA", gstCode: "29" },
  { name: "Kerala", code: "KL", gstCode: "32" },
  { name: "Madhya Pradesh", code: "MP", gstCode: "23" },
  { name: "Maharashtra", code: "MH", gstCode: "27" },
  { name: "Manipur", code: "MN", gstCode: "14" },
  { name: "Meghalaya", code: "ML", gstCode: "17" },
  { name: "Mizoram", code: "MZ", gstCode: "15" },
  { name: "Nagaland", code: "NL", gstCode: "13" },
  { name: "Odisha", code: "OD", gstCode: "21" },
  { name: "Punjab", code: "PB", gstCode: "03" },
  { name: "Rajasthan", code: "RJ", gstCode: "08" },
  { name: "Sikkim", code: "SK", gstCode: "11" },
  { name: "Tamil Nadu", code: "TN", gstCode: "33" },
  { name: "Telangana", code: "TS", gstCode: "36" },
  { name: "Tripura", code: "TR", gstCode: "16" },
  { name: "Uttar Pradesh", code: "UP", gstCode: "09" },
  { name: "Uttarakhand", code: "UK", gstCode: "05" },
  { name: "West Bengal", code: "WB", gstCode: "19" },
  { name: "Delhi", code: "DL", gstCode: "07" },
  { name: "Jammu and Kashmir", code: "JK", gstCode: "01" },
  { name: "Puducherry", code: "PY", gstCode: "34" }
];

// Standard GST rates for dropdown
const gstRates = [5, 12, 18, 28];

// Sample invoice data for demonstration
const sampleInvoices: Invoice[] = [
  {
    id: "inv1",
    number: "INV-2023-0001",
    date: "2023-12-15",
    dueDate: "2023-12-30",
    customer: {
      name: "Rahul Sharma",
      address: "15A, Brigade Road, Bangalore, Karnataka - 560001",
      gstin: "29ABCDE1234F1Z5"
    },
    hotel: {
      name: "Hotel Bliss",
      address: "123 Main Street, Bangalore, Karnataka - 560001",
      gstin: "29AABCT1234A1Z5"
    },
    stateOfSupply: "29",
    placeOfSupply: "29",
    items: [
      {
        id: "item1",
        name: "Deluxe Room - 2 Nights",
        hsnSac: "996311",
        roomRent: 5000,
        additionalCharges: 0,
        inRoomService: 0,
        serviceCharge: 0,
        transportation: 0,
        quantity: 2,
        amount: 10000,
        taxRate: 18 // Default tax rate
      }
    ],
    terms: "1. Payment due within 15 days.\n2. This is a computer generated invoice.",
    signatureUrl: "",
    status: "paid",
    totalAmount: 11800,
    createdAt: "2023-12-15T10:30:00Z"
  },
  {
    id: "inv2",
    number: "INV-2024-0002",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    customer: {
      name: "Priya Patel",
      address: "42, MG Road, Mumbai, Maharashtra - 400001",
      gstin: "27PQRST5678G1Z5"
    },
    hotel: {
      name: "Hotel Bliss",
      address: "123 Main Street, Bangalore, Karnataka - 560001",
      gstin: "29AABCT1234A1Z5"
    },
    stateOfSupply: "29",
    placeOfSupply: "27",
    items: [
      {
        id: "item1",
        name: "Suite Room - 3 Nights",
        hsnSac: "996311",
        roomRent: 8000,
        additionalCharges: 0,
        inRoomService: 0,
        serviceCharge: 0,
        transportation: 0,
        quantity: 3,
        amount: 24000,
        taxRate: 18 // Default tax rate
      },
      {
        id: "item2",
        name: "Airport Transfer",
        hsnSac: "996412",
        roomRent: 1500,
        additionalCharges: 0,
        inRoomService: 0,
        serviceCharge: 0,
        transportation: 0,
        quantity: 1,
        amount: 1500,
        taxRate: 18 // Default tax rate
      }
    ],
    terms: "1. Payment due within 15 days.\n2. This is a computer generated invoice.",
    signatureUrl: "",
    status: "pending",
    totalAmount: 30090,
    createdAt: "2024-01-10T14:15:00Z"
  },
  {
    id: "inv3",
    number: "INV-2024-0003",
    date: "2024-01-15",
    dueDate: "2024-01-30",
    customer: {
      name: "Anand Desai",
      address: "78, Park Street, Kolkata, West Bengal - 700016",
      gstin: ""
    },
    hotel: {
      name: "Hotel Bliss",
      address: "123 Main Street, Bangalore, Karnataka - 560001",
      gstin: "29AABCT1234A1Z5"
    },
    stateOfSupply: "29",
    placeOfSupply: "19",
    items: [
      {
        id: "item1",
        name: "Conference Hall - Full Day",
        hsnSac: "997212",
        roomRent: 15000,
        additionalCharges: 0,
        inRoomService: 0,
        serviceCharge: 0,
        transportation: 0,
        quantity: 1,
        amount: 15000,
        taxRate: 18 // Default tax rate
      }
    ],
    terms: "1. Payment due within 15 days.\n2. This is a computer generated invoice.",
    signatureUrl: "",
    status: "overdue",
    totalAmount: 17700,
    createdAt: "2024-01-15T09:45:00Z"
  },
  {
    id: "inv4",
    number: "INV-2024-0004",
    date: "2024-02-01",
    dueDate: "2024-02-15",
    customer: {
      name: "Vijay Kumar",
      address: "25, Church Street, Bangalore, Karnataka - 560001",
      gstin: "29VKUMAR123K1Z5"
    },
    hotel: {
      name: "Hotel Bliss",
      address: "123 Main Street, Bangalore, Karnataka - 560001",
      gstin: "29AABCT1234A1Z5"
    },
    stateOfSupply: "29",
    placeOfSupply: "29",
    items: [
      {
        id: "item1",
        name: "Standard Room - 1 Night",
        hsnSac: "996311",
        roomRent: 3500,
        additionalCharges: 0,
        inRoomService: 0,
        serviceCharge: 0,
        transportation: 0,
        quantity: 1,
        amount: 3500,
        taxRate: 18 // Default tax rate
      },
      {
        id: "item2",
        name: "Room Service - Dinner",
        hsnSac: "996332",
        roomRent: 0,
        additionalCharges: 0,
        inRoomService: 1,
        serviceCharge: 800,
        transportation: 0,
        quantity: 1,
        amount: 800,
        taxRate: 18 // Default tax rate
      }
    ],
    terms: "1. Payment due within 15 days.\n2. This is a computer generated invoice.",
    signatureUrl: "",
    status: "draft",
    totalAmount: 5074,
    createdAt: "2024-02-01T16:20:00Z"
  }
];

// Convert number to words for invoice
const numberToWords = (num: number): string => {
  const single = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  if (num === 0) return "Zero";
  
  const convertLessThanThousand = (n: number): string => {
    if (n < 20) return single[n];
    
    const digit = n % 10;
    if (n < 100) return tens[Math.floor(n / 10)] + (digit ? " " + single[digit] : "");
    
    return single[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + convertLessThanThousand(n % 100) : "");
  };
  
  let word = "";
  let chunk = 0;
  const numString = num.toString();
  
  if (num < 0) return "Minus " + numberToWords(Math.abs(num));
  
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

// Update the InvoiceHeader component to have locked fields
const InvoiceHeader: React.FC<{
  hotel: {
    name: string;
    address: string;
    gstin: string;
  };
  setHotel: React.Dispatch<React.SetStateAction<{
    name: string;
    address: string;
    gstin: string;
  }>>;
  invoice: {
    number: string;
    date: string;
  };
  setInvoice: React.Dispatch<React.SetStateAction<{
    number: string;
    date: string;
  }>>;
  customer: {
    name: string;
    address: string;
    gstin: string;
  };
  setCustomer: React.Dispatch<React.SetStateAction<{
    name: string;
    address: string;
    gstin: string;
  }>>;
  stateOfSupply: string;
  setStateOfSupply: React.Dispatch<React.SetStateAction<string>>;
  placeOfSupply: string;
  setPlaceOfSupply: React.Dispatch<React.SetStateAction<string>>;
  isEditMode: boolean;
}> = ({ 
  hotel, setHotel, 
  invoice, setInvoice, 
  customer, setCustomer, 
  stateOfSupply, setStateOfSupply, 
  placeOfSupply, setPlaceOfSupply,
  isEditMode
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="hotel-name" className="text-xs">Hotel Name</Label>
            <Input 
              id="hotel-name"
              value={hotel.name}
              onChange={(e) => setHotel({...hotel, name: e.target.value})}
              disabled={true} // Always locked
              className="bg-gray-50 h-8 text-sm"
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="hotel-gstin" className="text-xs">Hotel GSTIN</Label>
            <Input 
              id="hotel-gstin"
              value={hotel.gstin}
              onChange={(e) => setHotel({...hotel, gstin: e.target.value.toUpperCase()})}
              disabled={true} // Always locked
              className="uppercase bg-gray-50 h-8 text-sm"
              maxLength={15}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="state-of-supply" className="text-xs">State of Supply</Label>
            <Select
              value={stateOfSupply}
              onValueChange={setStateOfSupply}
              disabled={true} // Always locked
            >
              <SelectTrigger id="state-of-supply" className="bg-gray-50 h-8 text-sm">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state.code} value={state.gstCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Label htmlFor="hotel-address" className="text-xs">Hotel Address</Label>
            <Textarea 
              id="hotel-address"
              value={hotel.address}
              onChange={(e) => setHotel({...hotel, address: e.target.value})}
              disabled={true} // Always locked
              className="bg-gray-50 h-8 min-h-0 text-sm py-1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="customer-name" className="text-xs">Customer Name</Label>
            <Input 
              id="customer-name"
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
              disabled={!isEditMode}
              className="h-8 text-sm"
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="customer-gstin" className="text-xs">Customer GSTIN</Label>
            <Input 
              id="customer-gstin"
              value={customer.gstin}
              onChange={(e) => setCustomer({...customer, gstin: e.target.value.toUpperCase()})}
              disabled={!isEditMode}
              className="uppercase h-8 text-sm"
              maxLength={15}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="customer-address" className="text-xs">Customer Address</Label>
          <Textarea 
            id="customer-address"
            value={customer.address}
            onChange={(e) => setCustomer({...customer, address: e.target.value})}
            disabled={!isEditMode}
            className="h-8 min-h-0 text-sm py-1"
          />
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="invoice-number" className="text-xs">Invoice Number</Label>
            <Input 
              id="invoice-number"
              value={invoice.number}
              onChange={(e) => setInvoice({...invoice, number: e.target.value})}
              disabled={true} // Always locked
              className="bg-gray-50 h-8 text-sm"
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="invoice-date" className="text-xs">Invoice Date</Label>
            <Input 
              id="invoice-date"
              type="date"
              value={invoice.date}
              onChange={(e) => setInvoice({...invoice, date: e.target.value})}
              disabled={true} // Always locked
              className="bg-gray-50 h-8 text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="w-1/2">
            <Label htmlFor="place-of-supply" className="text-xs">Place of Supply</Label>
            <Select
              value={placeOfSupply}
              onValueChange={setPlaceOfSupply}
              disabled={true} // Always locked
            >
              <SelectTrigger id="place-of-supply" className="bg-gray-50 h-8 text-sm">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {indianStates.map((state) => (
                  <SelectItem key={state.code} value={state.gstCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-1/2">
            <Label className="text-xs">Supply Type</Label>
            <div className="bg-gray-50 h-8 p-1 rounded border text-sm flex items-center">
              {stateOfSupply === placeOfSupply ? "Intrastate (CGST + SGST)" : "Interstate (IGST)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update the ItemTable component to include all specified columns
const ItemTable: React.FC<{
  items: LineItem[];
  setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
  isEditMode: boolean;
  stateOfSupply: string;
  placeOfSupply: string;
}> = ({ items, setItems, isEditMode, stateOfSupply, placeOfSupply }) => {
  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      name: "",
      hsnSac: "",
      roomRent: 0,
      additionalCharges: 0,
      inRoomService: 0,
      serviceCharge: 0,
      transportation: 0,
      quantity: 1,
      amount: 0,
      taxRate: 18, // Default IGST rate
      cgstRate: 9, // Default CGST rate
      sgstRate: 9  // Default SGST rate
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount
        if (['roomRent', 'additionalCharges', 'inRoomService', 'serviceCharge', 'transportation', 'quantity', 'taxRate', 'cgstRate', 'sgstRate'].includes(field as string)) {
          updatedItem.roomRent = typeof updatedItem.roomRent === 'string' 
            ? parseFloat(updatedItem.roomRent) 
            : updatedItem.roomRent;
            
          updatedItem.additionalCharges = typeof updatedItem.additionalCharges === 'string' 
            ? parseFloat(updatedItem.additionalCharges) 
            : updatedItem.additionalCharges;
            
          updatedItem.inRoomService = typeof updatedItem.inRoomService === 'string' 
            ? parseFloat(updatedItem.inRoomService) 
            : updatedItem.inRoomService;
            
          updatedItem.serviceCharge = typeof updatedItem.serviceCharge === 'string' 
            ? parseFloat(updatedItem.serviceCharge) 
            : updatedItem.serviceCharge;
            
          updatedItem.transportation = typeof updatedItem.transportation === 'string' 
            ? parseFloat(updatedItem.transportation) 
            : updatedItem.transportation;
            
          updatedItem.quantity = typeof updatedItem.quantity === 'string' 
            ? parseFloat(updatedItem.quantity) 
            : updatedItem.quantity;

          // Ensure tax rates are available
          updatedItem.taxRate = typeof updatedItem.taxRate === 'string' 
            ? parseFloat(updatedItem.taxRate) 
            : (updatedItem.taxRate || 18);
          
          updatedItem.cgstRate = typeof updatedItem.cgstRate === 'string'
            ? parseFloat(updatedItem.cgstRate)
            : (updatedItem.cgstRate || 9);
            
          updatedItem.sgstRate = typeof updatedItem.sgstRate === 'string'
            ? parseFloat(updatedItem.sgstRate)
            : (updatedItem.sgstRate || 9);
            
          // Calculate total amount (without taxes)
          const baseAmount = updatedItem.roomRent + updatedItem.additionalCharges + 
                            updatedItem.inRoomService + updatedItem.serviceCharge + 
                            updatedItem.transportation;
          updatedItem.amount = baseAmount * updatedItem.quantity;
        }
        
        // If user is updating IGST tax rate, update CGST and SGST to half of that by default
        if (field === 'taxRate' && isEditMode) {
          const igstRate = typeof value === 'string' ? parseFloat(value) : value;
          updatedItem.cgstRate = igstRate / 2;
          updatedItem.sgstRate = igstRate / 2;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Check if interstate or intrastate supply
  const isInterstate = stateOfSupply !== placeOfSupply;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Line Items</h3>
        {isEditMode && (
          <Button onClick={addItem} size="sm" className="flex items-center">
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[10%] text-center">HSN/SAC</TableHead>
              <TableHead className="w-[15%]">Description</TableHead>
              <TableHead className="w-[8%] text-right">Room Rent</TableHead>
              <TableHead className="w-[8%] text-right">Add. Charges</TableHead>
              {isInterstate ? (
                <>
                  <TableHead className="text-right w-[6%]">IGST %</TableHead>
                  <TableHead className="text-right w-[6%]">IGST Amt</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-right w-[5%]">CGST %</TableHead>
                  <TableHead className="text-right w-[5%]">CGST Amt</TableHead>
                  <TableHead className="text-right w-[5%]">SGST %</TableHead>
                  <TableHead className="text-right w-[5%]">SGST Amt</TableHead>
                </>
              )}
              <TableHead className="w-[6%] text-right">In Room Service</TableHead>
              <TableHead className="w-[6%] text-right">Service Charge</TableHead>
              <TableHead className="w-[6%] text-right">Transport</TableHead>
              {isInterstate ? (
                <>
                  <TableHead className="text-right w-[6%]">IGST Amt</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-right w-[5%]">CGST Amt</TableHead>
                  <TableHead className="text-right w-[5%]">SGST Amt</TableHead>
                </>
              )}
              <TableHead className="text-right w-[8%]">DAY TOTAL</TableHead>
              {isEditMode && <TableHead className="w-[4%]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              // Get the tax rates for this item
              const igstRate = item.taxRate || 18;
              const cgstRate = item.cgstRate || 9;
              const sgstRate = item.sgstRate || 9;
              
              // Calculate taxes based on state of supply
              const roomServiceTotal = item.inRoomService + item.serviceCharge + item.transportation;
              const roomRentTotal = item.roomRent + item.additionalCharges;
              
              // Tax calculations
              const roomRentIGST = isInterstate ? (roomRentTotal * igstRate / 100) : 0;
              const roomRentCGST = !isInterstate ? (roomRentTotal * cgstRate / 100) : 0;
              const roomRentSGST = !isInterstate ? (roomRentTotal * sgstRate / 100) : 0;
              
              const serviceIGST = isInterstate ? (roomServiceTotal * igstRate / 100) : 0;
              const serviceCGST = !isInterstate ? (roomServiceTotal * cgstRate / 100) : 0;
              const serviceSGST = !isInterstate ? (roomServiceTotal * sgstRate / 100) : 0;
              
              // Day total including taxes
              const itemTotal = roomRentTotal + roomServiceTotal + 
                roomRentIGST + roomRentCGST + roomRentSGST + 
                serviceIGST + serviceCGST + serviceSGST;
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="text-center font-medium">
                    {isEditMode ? (
                      <Input 
                        value={item.hsnSac}
                        onChange={(e) => updateItem(item.id, 'hsnSac', e.target.value)}
                        className="text-center"
                      />
                    ) : (
                      item.hsnSac
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditMode ? (
                      <Input 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      />
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditMode ? (
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.roomRent}
                        onChange={(e) => updateItem(item.id, 'roomRent', parseFloat(e.target.value))}
                        className="text-right w-28"
                      />
                    ) : (
                      item.roomRent.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditMode ? (
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.additionalCharges}
                        onChange={(e) => updateItem(item.id, 'additionalCharges', parseFloat(e.target.value))}
                        className="text-right"
                      />
                    ) : (
                      item.additionalCharges.toFixed(2)
                    )}
                  </TableCell>
                  
                  {/* Tax Rate Dropdowns and Tax on Room Rent */}
                  {isInterstate ? (
                    <>
                      <TableCell className="text-right">
                        {isEditMode ? (
                          <Select
                            value={String(igstRate)}
                            onValueChange={(value) => updateItem(item.id, 'taxRate', parseFloat(value))}
                          >
                            <SelectTrigger className="h-9 text-sm w-16">
                              <SelectValue placeholder="Tax %" />
                            </SelectTrigger>
                            <SelectContent>
                              {gstRates.map((rate) => (
                                <SelectItem key={rate} value={String(rate)}>
                                  {rate}%
                                </SelectItem>
                              ))}
                              <SelectItem value="0">0%</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          `${igstRate}%`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {roomRentIGST.toFixed(2)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right">
                        {isEditMode ? (
                          <Select
                            value={String(cgstRate)}
                            onValueChange={(value) => updateItem(item.id, 'cgstRate', parseFloat(value))}
                          >
                            <SelectTrigger className="h-9 text-sm w-16">
                              <SelectValue placeholder="CGST %" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="2.5">2.5%</SelectItem>
                              <SelectItem value="6">6%</SelectItem>
                              <SelectItem value="9">9%</SelectItem>
                              <SelectItem value="14">14%</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          `${cgstRate}%`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {roomRentCGST.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditMode ? (
                          <Select
                            value={String(sgstRate)}
                            onValueChange={(value) => updateItem(item.id, 'sgstRate', parseFloat(value))}
                          >
                            <SelectTrigger className="h-9 text-sm w-16">
                              <SelectValue placeholder="SGST %" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="2.5">2.5%</SelectItem>
                              <SelectItem value="6">6%</SelectItem>
                              <SelectItem value="9">9%</SelectItem>
                              <SelectItem value="14">14%</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          `${sgstRate}%`
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {roomRentSGST.toFixed(2)}
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell className="text-right">
                    {isEditMode ? (
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.inRoomService}
                        onChange={(e) => updateItem(item.id, 'inRoomService', parseFloat(e.target.value))}
                        className="text-right w-28"
                      />
                    ) : (
                      item.inRoomService.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditMode ? (
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.serviceCharge}
                        onChange={(e) => updateItem(item.id, 'serviceCharge', parseFloat(e.target.value))}
                        className="text-right w-28"
                      />
                    ) : (
                      item.serviceCharge.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditMode ? (
                      <Input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.transportation}
                        onChange={(e) => updateItem(item.id, 'transportation', parseFloat(e.target.value))}
                        className="text-right"
                      />
                    ) : (
                      item.transportation.toFixed(2)
                    )}
                  </TableCell>
                  
                  {/* Tax on Other Services */}
                  {isInterstate ? (
                    <TableCell className="text-right">
                      {serviceIGST.toFixed(2)}
                    </TableCell>
                  ) : (
                    <>
                      <TableCell className="text-right">
                        {serviceCGST.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {serviceSGST.toFixed(2)}
                      </TableCell>
                    </>
                  )}
                  
                  <TableCell className="text-right font-medium">
                    {itemTotal.toFixed(2)}
                  </TableCell>
                  {isEditMode && (
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={isInterstate ? 10 : 14} className="text-center py-4 text-gray-500">
                  {isEditMode ? "Click 'Add Item' to add line items" : "No items added"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Tax Summary Component
const TaxSummary: React.FC<{
  items: LineItem[];
  stateOfSupply: string;
  placeOfSupply: string;
  applyRoundOff: boolean;
  isEditMode: boolean;
  toggleRoundOff: () => void;
}> = ({ items, stateOfSupply, placeOfSupply, applyRoundOff, isEditMode, toggleRoundOff }) => {
  // Calculate tax based on whether it's interstate or intrastate
  const isInterstate = stateOfSupply !== placeOfSupply;
  
  // Calculate totals from line items
  let totalRoomRent = 0;
  let totalAdditionalCharges = 0;
  let totalInRoomService = 0;
  let totalServiceCharge = 0;
  let totalTransportation = 0;
  
  // Tax calculation variables
  let totalRoomRentIGST = 0;
  let totalRoomRentCGST = 0;
  let totalRoomRentSGST = 0;
  let totalServiceIGST = 0;
  let totalServiceCGST = 0;
  let totalServiceSGST = 0;
  
  items.forEach(item => {
    // Get item values
    const roomRent = item.roomRent || 0;
    const additionalCharges = item.additionalCharges || 0;
    const inRoomService = item.inRoomService || 0;
    const serviceCharge = item.serviceCharge || 0;
    const transportation = item.transportation || 0;
    const igstRate = item.taxRate || 18;
    const cgstRate = item.cgstRate || 9;
    const sgstRate = item.sgstRate || 9;
    
    // Add to total amounts
    totalRoomRent += roomRent;
    totalAdditionalCharges += additionalCharges;
    totalInRoomService += inRoomService;
    totalServiceCharge += serviceCharge;
    totalTransportation += transportation;
    
    // Calculate and add to total taxes
    const roomRentTotal = roomRent + additionalCharges;
    const serviceTotal = inRoomService + serviceCharge + transportation;
    
    if (isInterstate) {
      totalRoomRentIGST += roomRentTotal * igstRate / 100;
      totalServiceIGST += serviceTotal * igstRate / 100;
    } else {
      totalRoomRentCGST += roomRentTotal * cgstRate / 100;
      totalRoomRentSGST += roomRentTotal * sgstRate / 100;
      totalServiceCGST += serviceTotal * cgstRate / 100;
      totalServiceSGST += serviceTotal * sgstRate / 100;
    }
  });
  
  const totalRoomRentCharges = totalRoomRent + totalAdditionalCharges;
  const totalOtherServices = totalInRoomService + totalServiceCharge + totalTransportation;
  const subtotal = totalRoomRentCharges + totalOtherServices;
  
  // Total tax amount
  const totalTax = totalRoomRentIGST + totalRoomRentCGST + totalRoomRentSGST + 
                   totalServiceIGST + totalServiceCGST + totalServiceSGST;
  
  // Calculate total before round off
  const totalBeforeRoundOff = subtotal + totalTax;
  
  // Round off calculation
  const roundedTotal = Math.round(totalBeforeRoundOff);
  const roundOffAmount = roundedTotal - totalBeforeRoundOff;
  
  // Final total
  const grandTotal = applyRoundOff ? roundedTotal : totalBeforeRoundOff;

  return (
    <div className="space-y-2 text-sm">
      {/* Charges Summary */}
      <div className="border-b pb-2">
        <div className="flex justify-between items-center mb-1">
          <span>Room Rent:</span>
          <span>₹ {totalRoomRent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span>Additional Charges:</span>
          <span>₹ {totalAdditionalCharges.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span>In Room Service:</span>
          <span>₹ {totalInRoomService.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span>Service Charge:</span>
          <span>₹ {totalServiceCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span>Transportation:</span>
          <span>₹ {totalTransportation.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center font-medium pt-1 border-t">
          <span>Subtotal:</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Tax Breakdown */}
      <div className="border-b pb-2">
        <div className="font-medium mb-1">Tax Breakdown</div>
        {!isInterstate ? (
          <>
            <div className="flex justify-between items-center mb-1">
              <span>CGST (Room):</span>
              <span>₹ {totalRoomRentCGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>SGST (Room):</span>
              <span>₹ {totalRoomRentSGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>CGST (Service):</span>
              <span>₹ {totalServiceCGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>SGST (Service):</span>
              <span>₹ {totalServiceSGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1 pt-1 border-t font-medium">
              <span>Total CGST:</span>
              <span>₹ {(totalRoomRentCGST + totalServiceCGST).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1 font-medium">
              <span>Total SGST:</span>
              <span>₹ {(totalRoomRentSGST + totalServiceSGST).toFixed(2)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-1">
              <span>IGST (Room):</span>
              <span>₹ {totalRoomRentIGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span>IGST (Service):</span>
              <span>₹ {totalServiceIGST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-1 pt-1 border-t font-medium">
              <span>Total IGST:</span>
              <span>₹ {(totalRoomRentIGST + totalServiceIGST).toFixed(2)}</span>
            </div>
          </>
        )}
        
        {applyRoundOff && (
          <div className="flex justify-between items-center mb-1">
            <span>Round Off:</span>
            <span>₹ {roundOffAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center font-bold pt-1 border-t">
          <span>Total Tax:</span>
          <span>₹ {totalTax.toFixed(2)}</span>
        </div>
        
        {isEditMode && (
          <div className="flex items-center space-x-2 mt-1">
            <input 
              type="checkbox" 
              id="round-off" 
              checked={applyRoundOff}
              onChange={toggleRoundOff}
              className="rounded border-gray-300"
            />
            <Label htmlFor="round-off" className="text-xs">Apply round off</Label>
          </div>
        )}
      </div>
      
      {/* Grand Total */}
      <div>
        <div className="bg-gray-50 rounded-md p-2 text-center mb-2">
          <div className="text-xl font-bold">₹ {grandTotal.toFixed(2)}</div>
          <div className="text-xs italic">Rupees {numberToWords(Math.round(grandTotal))} Only</div>
        </div>
      </div>
    </div>
  );
};

// Main Billing Component with list view and invoice form
const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    // Try to load invoices from localStorage
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : sampleInvoices;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState<Invoice['status'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>(undefined);
  
  // Add state for controlling invoice view modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  
  // Update localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);
  
  // Ensure jsPDF is loaded by adding CDN links
  useEffect(() => {
    // Only add scripts if they don't already exist
    if (!document.getElementById('jspdf-script')) {
      const jsPdfScript = document.createElement('script');
      jsPdfScript.id = 'jspdf-script';
      jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jsPdfScript.async = true;
      document.body.appendChild(jsPdfScript);
      
      const jsPdfAutoTableScript = document.createElement('script');
      jsPdfAutoTableScript.id = 'jspdf-autotable-script';
      jsPdfAutoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.7.0/jspdf.plugin.autotable.min.js';
      jsPdfAutoTableScript.async = true;
      document.body.appendChild(jsPdfAutoTableScript);
    }
  }, []);
  
  // Filter invoices by status and search query
  const filteredInvoices = invoices.filter(invoice => 
    (currentFilter === 'all' || invoice.status === currentFilter) &&
    (searchQuery === "" || 
     invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
     invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle saving a new or edited invoice
  const handleSaveInvoice = (savedInvoice: Invoice) => {
    if (currentInvoice) {
      // Edit existing invoice
      setInvoices(invoices.map(inv => 
        inv.id === savedInvoice.id ? savedInvoice : inv
      ));
    } else {
      // Add new invoice
      setInvoices([...invoices, savedInvoice]);
    }
    setShowForm(false);
    setCurrentInvoice(undefined);
    
    // Open the view modal for the new/edited invoice
    setViewingInvoice(savedInvoice);
    setViewModalOpen(true);
  };

  // Handle viewing an invoice
  const handleViewInvoice = (invoice: Invoice) => {
    // Show invoice in modal
    setViewingInvoice(invoice);
    setViewModalOpen(true);
  };
  
  // Handle editing an invoice
  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setShowForm(true);
  };
  
  // Handle deleting an invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (showForm) {
    return (
      <DashboardLayout>
        <InvoiceForm 
          onBack={() => {
            setShowForm(false);
            setCurrentInvoice(undefined);
          }}
          onSave={handleSaveInvoice}
          existingInvoice={currentInvoice}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500">Manage your GST-compliant invoices</p>
          </div>
          <Button 
            onClick={() => {
              setCurrentInvoice(undefined);
              setShowForm(true);
            }} 
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Invoice
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setCurrentFilter(value as any)}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="pl-10 w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <TabsContent value="all" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    onView={handleViewInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="pending" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    onView={handleViewInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="paid" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    onView={handleViewInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="overdue" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    onView={handleViewInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    formatDate={formatDate}
                  />
                </TabsContent>
                
                <TabsContent value="draft" className="m-0">
                  <InvoiceList 
                    invoices={filteredInvoices} 
                    onView={handleViewInvoice}
                    onEdit={handleEditInvoice}
                    onDelete={handleDeleteInvoice}
                    formatDate={formatDate}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardHeader>
        </Card>
        
        {/* Invoice View Modal */}
        <InvoiceModal 
          invoice={viewingInvoice} 
          isOpen={viewModalOpen} 
          onClose={() => {
            setViewModalOpen(false);
            setViewingInvoice(null);
          }} 
        />
      </div>
    </DashboardLayout>
  );
};

// Invoice List Component
const InvoiceList: React.FC<{
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoiceId: string) => void;
  formatDate: (date: string) => string;
}> = ({ invoices, onView, onEdit, onDelete, formatDate }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                No invoices found. Create your first invoice.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.customer.name}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                <TableCell>₹ {invoice.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onView(invoice)}
                      className="h-8"
                    >
                      <EyeIcon className="h-3.5 w-3.5 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(invoice)}
                      className="h-8"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Update the InvoiceForm component to use full width
const InvoiceForm: React.FC<{
  onBack: () => void;
  onSave: (invoice: Invoice) => void;
  existingInvoice?: Invoice;
}> = ({ onBack, onSave, existingInvoice }) => {
  // State for invoice data
  const [hotel, setHotel] = useState({
    name: existingInvoice?.hotel.name || "Hotel Bliss",
    address: existingInvoice?.hotel.address || "123 Main Street, Bangalore, Karnataka - 560001",
    gstin: existingInvoice?.hotel.gstin || "29AABCT1234A1Z5"
  });
  
  const [invoice, setInvoice] = useState({
    number: existingInvoice?.number || `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    date: existingInvoice?.date || new Date().toISOString().slice(0, 10)
  });
  
  const [customer, setCustomer] = useState({
    name: existingInvoice?.customer.name || "",
    address: existingInvoice?.customer.address || "",
    gstin: existingInvoice?.customer.gstin || ""
  });
  
  // Default to Karnataka (29)
  const [stateOfSupply, setStateOfSupply] = useState(existingInvoice?.stateOfSupply || "29");
  const [placeOfSupply, setPlaceOfSupply] = useState(existingInvoice?.placeOfSupply || "29");
  
  const [items, setItems] = useState<LineItem[]>(existingInvoice?.items || []);
  const [terms, setTerms] = useState(
    existingInvoice?.terms || 
    "1. Payment due within 7 days of invoice date.\n" +
    "2. This is a computer generated invoice and does not require signature.\n" +
    "3. For any queries regarding this invoice, please contact our accounts department."
  );
  
  const [signatureUrl, setSignatureUrl] = useState(existingInvoice?.signatureUrl || "");
  const [applyRoundOff, setApplyRoundOff] = useState(true);
  const [isEditMode, setIsEditMode] = useState(!existingInvoice || existingInvoice.status === "draft");
  
  // Calculate subtotal from line items
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  
  // Toggle round off
  const toggleRoundOff = () => setApplyRoundOff(!applyRoundOff);
  
  // Toggle edit mode
  const toggleEditMode = () => setIsEditMode(!isEditMode);
  
  // Print the invoice
  const printInvoice = () => {
    window.print();
  };

  // Handle save invoice
  const handleSave = () => {
    // Calculate tax based on whether it's interstate or intrastate
    const isInterstate = stateOfSupply !== placeOfSupply;
    const gstRate = 18; // Standard GST rate
    
    // IGST or CGST+SGST depending on interstate/intrastate
    const totalTax = subtotal * gstRate / 100;
    
    // Calculate total amount
    const totalBeforeRoundOff = subtotal + totalTax;
    const totalAmount = applyRoundOff ? Math.round(totalBeforeRoundOff) : totalBeforeRoundOff;
    
    const newInvoice: Invoice = {
      id: existingInvoice?.id || `inv-${Date.now()}`,
      number: invoice.number,
      date: invoice.date,
      dueDate: new Date(new Date(invoice.date).setDate(new Date(invoice.date).getDate() + 15)).toISOString().slice(0, 10),
      customer,
      hotel,
      stateOfSupply,
      placeOfSupply,
      items,
      terms,
      signatureUrl,
      status: existingInvoice?.status || "pending",
      totalAmount,
      createdAt: existingInvoice?.createdAt || new Date().toISOString()
    };
    
    onSave(newInvoice);
  };

  return (
    <div className="mx-auto p-2 h-[calc(100vh-80px)] overflow-auto bg-gray-50">
      <div className="flex justify-between items-center mb-2 bg-white p-2 rounded-md shadow-sm">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-2 h-8 px-2 py-0">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-lg font-bold">
            {existingInvoice ? `Edit #${existingInvoice.number}` : "Create Invoice"}
          </h1>
        </div>
        <div className="flex gap-1">
          {isEditMode ? (
            <Button onClick={() => {
              handleSave();
              toggleEditMode();
            }} className="flex items-center gap-1 h-8 px-3 py-0">
              <Save className="h-4 w-4" />
              Save
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={toggleEditMode} className="flex items-center gap-1 h-8 px-3 py-0">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={printInvoice} className="flex items-center gap-1 h-8 px-3 py-0">
                <PrinterIcon className="h-4 w-4" />
                Print
              </Button>
              <Button onClick={() => downloadInvoicePdf(existingInvoice?.id)} className="flex items-center gap-1 h-8 px-3 py-0">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-gray-700">Header Details</h2>
            <div className="text-right">
              <div className="text-lg font-bold">TAX INVOICE</div>
              <div className="text-sm text-gray-500">Invoice #{invoice.number}</div>
            </div>
          </div>
          
          {/* Invoice Header - more compact grid */}
          <InvoiceHeader 
            hotel={hotel}
            setHotel={setHotel}
            invoice={invoice}
            setInvoice={setInvoice}
            customer={customer}
            setCustomer={setCustomer}
            stateOfSupply={stateOfSupply}
            setStateOfSupply={setStateOfSupply}
            placeOfSupply={placeOfSupply}
            setPlaceOfSupply={setPlaceOfSupply}
            isEditMode={isEditMode}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="md:col-span-3 bg-white p-3 rounded-md shadow-sm">
            {/* Items Table with reduced height */}
            <ItemTable 
              items={items}
              setItems={setItems}
              isEditMode={isEditMode}
              stateOfSupply={stateOfSupply}
              placeOfSupply={placeOfSupply}
            />
          </div>
          
          <div className="bg-white p-3 rounded-md shadow-sm overflow-auto" style={{ maxHeight: '400px' }}>
            {/* Tax Summary - vertical layout */}
            <h3 className="font-medium text-gray-700 mb-2">Tax Summary</h3>
            <TaxSummary 
              items={items}
              stateOfSupply={stateOfSupply}
              placeOfSupply={placeOfSupply}
              applyRoundOff={applyRoundOff}
              isEditMode={isEditMode}
              toggleRoundOff={toggleRoundOff}
            />
          </div>
        </div>
        
        <div className="bg-white p-3 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              {/* Terms & Signature with reduced height */}
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm">Terms & Conditions</Label>
                <Textarea 
                  id="terms"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  disabled={!isEditMode}
                  rows={2}
                  className="h-16 text-sm"
                />
              </div>
            </div>
            
            <div>
              <div className="space-y-1">
                <Label className="text-sm">Signature</Label>
                {isEditMode ? (
                  <div className="flex gap-2 items-center">
                    {signatureUrl && (
                      <div className="border rounded p-1 h-12 w-32 flex items-center justify-center">
                        <img 
                          src={signatureUrl} 
                          alt="Signature" 
                          className="max-h-10 max-w-full object-contain"
                        />
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setSignatureUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs"
                    />
                  </div>
                ) : (
                  <div className="border rounded p-2 h-16 flex items-center justify-center">
                    {signatureUrl ? (
                      <img 
                        src={signatureUrl} 
                        alt="Signature" 
                        className="max-h-12 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No signature added</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Declaration - simplified */}
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-center text-gray-500">
              This is a computer generated invoice. {stateOfSupply === placeOfSupply ? 
                `Subject to ${indianStates.find(state => state.gstCode === stateOfSupply)?.name} Jurisdiction.` : 
                `Inter-State Supply: From ${indianStates.find(state => state.gstCode === stateOfSupply)?.name} to ${indianStates.find(state => state.gstCode === placeOfSupply)?.name}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the StatusBadge component back
const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Check className="w-3 h-3 mr-1" /> Paid</Badge>;
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    case 'overdue':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Cancelled</Badge>;
    default:
      return null;
  }
};

// Add the InvoiceFooter component back
const InvoiceFooter: React.FC<{
  terms: string;
  setTerms: React.Dispatch<React.SetStateAction<string>>;
  signatureUrl: string;
  setSignatureUrl: React.Dispatch<React.SetStateAction<string>>;
  isEditMode: boolean;
}> = ({ terms, setTerms, signatureUrl, setSignatureUrl, isEditMode }) => {
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="terms">Terms & Conditions</Label>
        <Textarea 
          id="terms"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          disabled={!isEditMode}
          rows={3}
          className="h-20"
        />
      </div>
      
      <div className="space-y-1">
        <Label>Signature</Label>
        {isEditMode ? (
          <div className="flex flex-col gap-1">
            {signatureUrl && (
              <div className="border rounded p-1 h-16 flex items-center justify-center">
                <img 
                  src={signatureUrl} 
                  alt="Signature" 
                  className="max-h-14 max-w-full object-contain"
                />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleSignatureUpload}
              className="text-sm"
            />
          </div>
        ) : (
          <div className="border rounded p-2 h-20 flex items-center justify-center">
            {signatureUrl ? (
              <img 
                src={signatureUrl} 
                alt="Signature" 
                className="max-h-16 max-w-full object-contain"
              />
            ) : (
              <span className="text-gray-400">No signature added</span>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
      </div>
    </div>
  );
};

// Add the InvoiceModal component back
const InvoiceModal: React.FC<{
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ invoice, isOpen, onClose }) => {
  if (!invoice) return null;

  // Calculate tax amounts
  const isInterstate = invoice.stateOfSupply !== invoice.placeOfSupply;
  
  // Prepare totals
  let totalRoomRent = 0;
  let totalAdditionalCharges = 0;
  let totalInRoomService = 0;
  let totalServiceCharge = 0;
  let totalTransportation = 0;
  
  // Tax calculation variables
  let totalRoomRentIGST = 0;
  let totalRoomRentCGST = 0;
  let totalRoomRentSGST = 0;
  let totalServiceIGST = 0;
  let totalServiceCGST = 0;
  let totalServiceSGST = 0;
  
  invoice.items.forEach(item => {
    // Get values with defaults
    const roomRent = item.roomRent || 0;
    const additionalCharges = item.additionalCharges || 0;
    const inRoomService = item.inRoomService || 0;
    const serviceCharge = item.serviceCharge || 0;
    const transportation = item.transportation || 0;
    const igstRate = item.taxRate || 18;
    const cgstRate = item.cgstRate || 9;
    const sgstRate = item.sgstRate || 9;
    
    // Add to totals
    totalRoomRent += roomRent;
    totalAdditionalCharges += additionalCharges;
    totalInRoomService += inRoomService;
    totalServiceCharge += serviceCharge;
    totalTransportation += transportation;
    
    // Calculate and add taxes
    const roomRentTotal = roomRent + additionalCharges;
    const serviceTotal = inRoomService + serviceCharge + transportation;
    
    if (isInterstate) {
      totalRoomRentIGST += roomRentTotal * igstRate / 100;
      totalServiceIGST += serviceTotal * igstRate / 100;
    } else {
      totalRoomRentCGST += roomRentTotal * cgstRate / 100;
      totalRoomRentSGST += roomRentTotal * sgstRate / 100;
      totalServiceCGST += serviceTotal * cgstRate / 100;
      totalServiceSGST += serviceTotal * sgstRate / 100;
    }
  });
  
  const totalRoomRentCharges = totalRoomRent + totalAdditionalCharges;
  const totalOtherServices = totalInRoomService + totalServiceCharge + totalTransportation;
  const subtotal = totalRoomRentCharges + totalOtherServices;
  
  // Total tax
  const totalTax = totalRoomRentIGST + totalRoomRentCGST + totalRoomRentSGST + 
                   totalServiceIGST + totalServiceCGST + totalServiceSGST;
  
  // Grand total
  const total = totalRoomRentCharges + totalOtherServices + totalTax;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl">Invoice #{invoice.number}</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        
        <div className="p-4">
          {/* Invoice Header */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">TAX INVOICE</h2>
              <div className="mt-3">
                <p className="font-semibold">{invoice.hotel.name}</p>
                <p className="text-sm">{invoice.hotel.address}</p>
                <p className="text-sm">GSTIN: {invoice.hotel.gstin}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="border rounded-md p-2 bg-gray-50">
                <p><span className="text-gray-600">Bill No.:</span> {invoice.number}</p>
                <p><span className="text-gray-600">Bill Date:</span> {new Date(invoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="mt-2">
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
          
          {/* Customer Information with 2 columns */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b py-3">
            <div>
              <p className="font-medium italic">Mr. {invoice.customer.name}</p>
              <p className="text-sm mt-2">
                <span className="inline-block w-20">Mobile No.:</span>
              </p>
              <p className="text-sm">
                <span className="inline-block w-20">NATIONALITY:</span> IND
              </p>
              <p className="text-sm">
                <span className="inline-block w-20">CLIENT GSTIN:</span> {invoice.customer.gstin || "N/A"}
              </p>
            </div>
            <div>
              <p className="font-medium italic">M/S - {invoice.customer.name}</p>
              <p className="text-sm">{invoice.customer.address}</p>
              
              <div className="mt-3 flex">
                <div className="w-1/2">
                  <p className="text-sm">State Name: {indianStates.find(state => state.gstCode === invoice.placeOfSupply)?.name}</p>
                </div>
                <div className="w-1/2">
                  <p className="text-sm">State Code: {invoice.placeOfSupply}</p>
                </div>
              </div>
              
              <p className="text-sm mt-1">
                <span className="inline-block w-20">PARTY GSTIN:</span> {invoice.customer.gstin || "N/A"}
              </p>
            </div>
          </div>
          
          {/* Line Items Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-50 border">
                  <th className="border p-2 text-center">HSN/SAC</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-right">Room Rent</th>
                  <th className="border p-2 text-right">Add. Charges</th>
                  {isInterstate ? (
                    <>
                      <th className="border p-2 text-center">Tax %</th>
                      <th className="border p-2 text-right">IGST</th>
                    </>
                  ) : (
                    <>
                      <th className="border p-2 text-center">CGST %</th>
                      <th className="border p-2 text-right">CGST</th>
                      <th className="border p-2 text-center">SGST %</th>
                      <th className="border p-2 text-right">SGST</th>
                    </>
                  )}
                  <th className="border p-2 text-right">In Room Service</th>
                  <th className="border p-2 text-right">Service Charge</th>
                  <th className="border p-2 text-right">Transport</th>
                  {isInterstate ? (
                    <th className="border p-2 text-right">IGST</th>
                  ) : (
                    <>
                      <th className="border p-2 text-right">CGST</th>
                      <th className="border p-2 text-right">SGST</th>
                    </>
                  )}
                  <th className="border p-2 text-right">DAY TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => {
                  // Get the tax rate (default to 18%)
                  const igstRate = item.taxRate || 18;
                  const cgstRate = item.cgstRate || 9;
                  const sgstRate = item.sgstRate || 9;
                  
                  // Calculate taxes for each item
                  const roomRentTotal = (item.roomRent || 0) + (item.additionalCharges || 0);
                  const roomServiceTotal = (item.inRoomService || 0) + (item.serviceCharge || 0) + (item.transportation || 0);
                  
                  // Tax calculations
                  const roomRentIGST = isInterstate ? (roomRentTotal * igstRate / 100) : 0;
                  const roomRentCGST = !isInterstate ? (roomRentTotal * cgstRate / 100) : 0;
                  const roomRentSGST = !isInterstate ? (roomRentTotal * sgstRate / 100) : 0;
                  
                  const serviceIGST = isInterstate ? (roomServiceTotal * igstRate / 100) : 0;
                  const serviceCGST = !isInterstate ? (roomServiceTotal * cgstRate / 100) : 0;
                  const serviceSGST = !isInterstate ? (roomServiceTotal * sgstRate / 100) : 0;
                  
                  // Day total including taxes
                  const itemTotal = roomRentTotal + roomServiceTotal + 
                    roomRentIGST + roomRentCGST + roomRentSGST + 
                    serviceIGST + serviceCGST + serviceSGST;
                  
                  return (
                    <tr key={index} className="border">
                      <td className="border p-2 text-center">{item.hsnSac}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">₹{(item.roomRent || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="border p-2 text-right">₹{(item.additionalCharges || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      {isInterstate ? (
                        <>
                          <td className="border p-2 text-center">{igstRate}%</td>
                          <td className="border p-2 text-right">₹{roomRentIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </>
                      ) : (
                        <>
                          <td className="border p-2 text-center">{cgstRate}%</td>
                          <td className="border p-2 text-right">₹{roomRentCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="border p-2 text-center">{sgstRate}%</td>
                          <td className="border p-2 text-right">₹{roomRentSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </>
                      )}
                      <td className="border p-2 text-right">₹{(item.inRoomService || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="border p-2 text-right">₹{(item.serviceCharge || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="border p-2 text-right">₹{(item.transportation || 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      {isInterstate ? (
                        <td className="border p-2 text-right">₹{serviceIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      ) : (
                        <>
                          <td className="border p-2 text-right">₹{serviceCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="border p-2 text-right">₹{serviceSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </>
                      )}
                      <td className="border p-2 text-right font-medium">₹{itemTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  );
                })}
                <tr className="border font-medium">
                  <td className="border p-2 text-right" colSpan={2}>TOTAL:</td>
                  <td className="border p-2 text-right">₹{totalRoomRent.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border p-2 text-right">₹{totalAdditionalCharges.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  {isInterstate ? (
                    <>
                      <td className="border p-2 text-center"></td>
                      <td className="border p-2 text-right">₹{totalRoomRentIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2 text-center"></td>
                      <td className="border p-2 text-right">₹{totalRoomRentCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="border p-2 text-center"></td>
                      <td className="border p-2 text-right">₹{totalRoomRentSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </>
                  )}
                  <td className="border p-2 text-right">₹{totalInRoomService.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border p-2 text-right">₹{totalServiceCharge.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="border p-2 text-right">₹{totalTransportation.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  {isInterstate ? (
                    <td className="border p-2 text-right">₹{totalServiceIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  ) : (
                    <>
                      <td className="border p-2 text-right">₹{totalServiceCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="border p-2 text-right">₹{totalServiceSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </>
                  )}
                  <td className="border p-2 text-right">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Payment Details */}
          <div className="mt-4 flex justify-between">
            <div>
              <p className="font-medium">Mode Of Payments: CASH</p>
              <p className="mt-4 text-sm">Note: E & O.E</p>
              <p className="text-sm">Check Out Time 12 Noon</p>
              <p className="text-sm">All Disputes settle at Delhi Jurisdiction only.</p>
            </div>
            <div className="w-64">
              <div className="border grid grid-cols-2">
                <div className="border-r p-2">Other Room Dues</div>
                <div className="p-2 text-right">0.00</div>
                <div className="border-r border-t p-2">Less Advance</div>
                <div className="border-t p-2 text-right">0.00</div>
                <div className="border-r border-t p-2">Round Off (+/-)</div>
                <div className="border-t p-2 text-right">0.00</div>
                <div className="border-r border-t p-2 font-bold">Nett. Amount Due:</div>
                <div className="border-t p-2 text-right font-bold">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
              </div>
              <p className="text-right mt-1 italic font-medium">Rs. {numberToWords(Math.round(total))} ONLY</p>
            </div>
          </div>
          
          {/* Tax Summary */}
          <div className="mt-6 border-t pt-4">
            <p className="text-center font-medium mb-2">Tax Summary</p>
            <div className="flex justify-center">
              <table className="border-collapse border w-auto">
                <thead>
                  <tr className="bg-gray-50 border">
                    <th className="border p-2 text-center" colSpan={2}>Description</th>
                    <th className="border p-2 text-center">Taxable Value</th>
                    {isInterstate ? (
                      <th className="border p-2 text-center">IGST Amount</th>
                    ) : (
                      <>
                        <th className="border p-2 text-center">CGST Amount</th>
                        <th className="border p-2 text-center">SGST Amount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="border p-2" colSpan={2}>Room Rent and Additional Charges</td>
                    <td className="border p-2 text-right">₹{totalRoomRentCharges.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    {isInterstate ? (
                      <td className="border p-2 text-right">₹{totalRoomRentIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    ) : (
                      <>
                        <td className="border p-2 text-right">₹{totalRoomRentCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="border p-2 text-right">₹{totalRoomRentSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </>
                    )}
                  </tr>
                  <tr className="border">
                    <td className="border p-2" colSpan={2}>Services and Transportation</td>
                    <td className="border p-2 text-right">₹{totalOtherServices.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    {isInterstate ? (
                      <td className="border p-2 text-right">₹{totalServiceIGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    ) : (
                      <>
                        <td className="border p-2 text-right">₹{totalServiceCGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="border p-2 text-right">₹{totalServiceSGST.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </>
                    )}
                  </tr>
                  <tr className="border font-bold">
                    <td className="border p-2" colSpan={2}>Total</td>
                    <td className="border p-2 text-right">₹{subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    {isInterstate ? (
                      <td className="border p-2 text-right">₹{(totalRoomRentIGST + totalServiceIGST).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    ) : (
                      <>
                        <td className="border p-2 text-right">₹{(totalRoomRentCGST + totalServiceCGST).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="border p-2 text-right">₹{(totalRoomRentSGST + totalServiceSGST).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Bank Details */}
          <div className="mt-6 border-t pt-4">
            <p className="text-center italic">Please draw Cheque in favour of Below A/c</p>
            <div className="mt-2 flex justify-between px-10 text-sm">
              <div>
                <p><span className="font-medium">A/C NAME:</span> {invoice.hotel.name}</p>
                <p><span className="font-medium">IFSC CODE:</span> HDFC0001234</p>
                <p><span className="font-medium">BRANCH:</span> Main Branch</p>
              </div>
              <div>
                <p><span className="font-medium">A/C NO:</span> 50200099327150</p>
                <p><span className="font-medium">BANK NAME:</span> HDFC BANK</p>
              </div>
            </div>
          </div>
          
          {/* Signature Section */}
          <div className="mt-6 flex justify-between">
            <div>
              <p className="mb-10 text-sm">Manager/Cashier</p>
            </div>
            <div className="text-right">
              <p className="mb-10 text-sm">Guest Signature</p>
            </div>
          </div>
          
          {/* Download Button */}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => downloadInvoicePdf(invoice.id)} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Billing; 