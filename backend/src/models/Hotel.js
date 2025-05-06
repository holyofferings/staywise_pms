const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
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
    uppercase: true,
    minlength: 15,
    maxlength: 15
  },
  stateCode: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  bankDetails: {
    accountName: {
      type: String,
      trim: true
    },
    accountNumber: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    bankName: {
      type: String,
      trim: true
    },
    branch: {
      type: String,
      trim: true
    }
  },
  logoUrl: {
    type: String
  },
  signatureUrl: {
    type: String
  },
  invoicePrefix: {
    type: String,
    default: 'INV'
  },
  nextInvoiceNumber: {
    type: Number,
    default: 1
  },
  defaultTerms: {
    type: String,
    default: '1. Payment due within 7 days of invoice date.\n2. This is a computer generated invoice and does not require signature.\n3. For any queries regarding this invoice, please contact our accounts department.'
  }
}, {
  timestamps: true
});

// Method to generate next invoice number
hotelSchema.methods.generateInvoiceNumber = function() {
  const year = new Date().getFullYear();
  const paddedNumber = String(this.nextInvoiceNumber).padStart(4, '0');
  this.nextInvoiceNumber += 1;
  return `${this.invoicePrefix}-${year}-${paddedNumber}`;
};

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 