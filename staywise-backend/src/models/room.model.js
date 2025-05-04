const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
      enum: ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential', 'Other']
    },
    price: {
      base: {
        type: Number,
        required: [true, 'Room price is required'],
        min: 0
      },
      weekend: {
        type: Number,
        min: 0
      },
      seasonal: {
        type: Number,
        min: 0
      }
    },
    capacity: {
      adults: {
        type: Number,
        default: 2,
        min: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    availability: {
      type: Boolean,
      default: true
    },
    checkedInStatus: {
      type: Boolean,
      default: false
    },
    amenities: [String],
    images: [String],
    description: {
      type: String,
      trim: true
    },
    floor: {
      type: String,
      trim: true
    },
    size: {
      type: Number, // in square feet/meters
      min: 0
    },
    sizeUnit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    },
    viewType: {
      type: String,
      enum: ['City', 'Garden', 'Pool', 'Mountain', 'Beach', 'None'],
      default: 'None'
    },
    bedType: {
      type: String,
      enum: ['Twin', 'Queen', 'King', 'Double', 'Single', 'Multiple'],
      default: 'Queen'
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    maintenanceStatus: {
      isUnderMaintenance: {
        type: Boolean,
        default: false
      },
      maintenanceNote: String,
      maintenanceEndDate: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries on room number and hotel
roomSchema.index({ roomNumber: 1, hotelRef: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 