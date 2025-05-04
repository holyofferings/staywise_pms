const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true
    },
    guestPhone: {
      type: String,
      trim: true,
      required: [true, 'Guest phone is required']
    },
    roomRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required']
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required']
    },
    status: {
      type: String,
      enum: ['reserved', 'checked-in', 'checked-out', 'cancelled', 'no-show'],
      default: 'reserved'
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'upi', 'bank_transfer', 'other'],
      default: 'cash'
    },
    identityProof: {
      type: {
        type: String,
        enum: ['aadhar', 'pan', 'passport', 'driving_license', 'voter_id', 'other']
      },
      number: String,
      image: String
    },
    guestCount: {
      adults: {
        type: Number,
        default: 1,
        min: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    specialRequests: {
      type: String,
      trim: true
    },
    estimatedArrivalTime: String,
    calendarEventId: String, // For Google Calendar integration
    additionalServices: [{
      name: String,
      price: Number,
      date: Date
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: [{
      text: String,
      date: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    invoiceId: String,
    source: {
      type: String,
      enum: ['direct', 'website', 'phone', 'walk_in', 'ota', 'other'],
      default: 'direct'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Compound index for room availability queries
bookingSchema.index({ roomRef: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ hotelRef: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 