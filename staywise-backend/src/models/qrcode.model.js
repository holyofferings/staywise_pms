const mongoose = require('mongoose');

const inputFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'email', 'tel', 'textarea', 'select', 'checkbox'],
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    label: String,
    value: String
  }],
  placeholder: String,
  validation: {
    pattern: String,
    message: String
  }
});

const qrCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    roomRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    url: {
      type: String,
      required: true
    },
    shortCode: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['room_service', 'feedback', 'information', 'custom'],
      default: 'room_service'
    },
    guestInputSchema: {
      type: [inputFieldSchema],
      default: []
    },
    redirectAfterSubmit: {
      type: Boolean,
      default: false
    },
    redirectUrl: {
      type: String
    },
    active: {
      type: Boolean,
      default: true
    },
    expiresAt: Date,
    scans: {
      type: Number,
      default: 0
    },
    submissions: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    customization: {
      logo: String,
      primaryColor: String,
      backgroundColor: String,
      headerText: String,
      footerText: String
    }
  },
  {
    timestamps: true
  }
);

// Compound index for faster queries
qrCodeSchema.index({ hotelRef: 1, type: 1 });
qrCodeSchema.index({ shortCode: 1 }, { unique: true });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode; 