const mongoose = require('mongoose');

// Line Item Schema
const lineItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hsnSac: {
    type: String,
    trim: true
  },
  roomRent: {
    type: Number,
    default: 0
  },
  additionalCharges: {
    type: Number,
    default: 0
  },
  inRoomService: {
    type: Number,
    default: 0
  },
  serviceCharge: {
    type: Number,
    default: 0
  },
  transportation: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 18
  },
  cgstRate: {
    type: Number,
    default: 9
  },
  sgstRate: {
    type: Number,
    default: 9
  }
});

const invoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  customer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true
    },
    mobileNumber: {
      type: String,
      trim: true
    }
  },
  hotel: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    gstin: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    }
  },
  stateOfSupply: {
    type: String,
    required: true,
    trim: true
  },
  placeOfSupply: {
    type: String,
    required: true,
    trim: true
  },
  items: [lineItemSchema],
  terms: {
    type: String,
    trim: true
  },
  signatureUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  subtotal: {
    type: Number,
    required: true
  },
  // Tax Summary
  taxDetails: {
    roomRentIGST: { type: Number, default: 0 },
    roomRentCGST: { type: Number, default: 0 },
    roomRentSGST: { type: Number, default: 0 },
    serviceIGST: { type: Number, default: 0 },
    serviceCGST: { type: Number, default: 0 },
    serviceSGST: { type: Number, default: 0 }
  },
  totalTax: {
    type: Number,
    required: true
  },
  roundOff: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    default: 'CASH',
    enum: ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE']
  },
  paymentDetails: {
    type: String,
    trim: true
  },
  paymentDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdfUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Middleware to calculate tax details before saving
invoiceSchema.pre('save', function(next) {
  try {
    const isInterstate = this.stateOfSupply !== this.placeOfSupply;
    
    // Reset tax summary
    this.taxDetails.roomRentIGST = 0;
    this.taxDetails.roomRentCGST = 0;
    this.taxDetails.roomRentSGST = 0;
    this.taxDetails.serviceIGST = 0;
    this.taxDetails.serviceCGST = 0;
    this.taxDetails.serviceSGST = 0;
    
    // Calculate subtotal and taxes
    let subtotal = 0;
    
    this.items.forEach(item => {
      const roomRentTotal = (item.roomRent || 0) + (item.additionalCharges || 0);
      const serviceTotal = (item.inRoomService || 0) + (item.serviceCharge || 0) + (item.transportation || 0);
      
      subtotal += roomRentTotal + serviceTotal;
      
      if (isInterstate) {
        this.taxDetails.roomRentIGST += roomRentTotal * (item.taxRate || 18) / 100;
        this.taxDetails.serviceIGST += serviceTotal * (item.taxRate || 18) / 100;
      } else {
        this.taxDetails.roomRentCGST += roomRentTotal * (item.cgstRate || 9) / 100;
        this.taxDetails.roomRentSGST += roomRentTotal * (item.sgstRate || 9) / 100;
        this.taxDetails.serviceCGST += serviceTotal * (item.cgstRate || 9) / 100;
        this.taxDetails.serviceSGST += serviceTotal * (item.sgstRate || 9) / 100;
      }
    });
    
    this.subtotal = subtotal;
    
    // Calculate total tax
    const totalTax = 
      this.taxDetails.roomRentIGST + 
      this.taxDetails.roomRentCGST + 
      this.taxDetails.roomRentSGST + 
      this.taxDetails.serviceIGST + 
      this.taxDetails.serviceCGST + 
      this.taxDetails.serviceSGST;
    
    this.totalTax = totalTax;
    
    // Total amount before roundoff
    const totalBeforeRoundOff = subtotal + totalTax;
    
    // Round off calculation (to nearest rupee)
    const roundedTotal = Math.round(totalBeforeRoundOff);
    this.roundOff = roundedTotal - totalBeforeRoundOff;
    
    // Final total
    this.totalAmount = roundedTotal;
    
    next();
  } catch (error) {
    next(error);
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice; 