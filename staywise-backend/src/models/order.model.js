const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['food', 'beverage', 'service', 'amenity', 'other'],
    default: 'food'
  },
  notes: String
});

const orderSchema = new mongoose.Schema(
  {
    guestName: {
      type: String,
      required: true,
      trim: true
    },
    roomRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    bookingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    hotelRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function(items) {
          return items.length > 0;
        },
        message: 'Order must contain at least one item'
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'],
      default: 'pending'
    },
    instructions: {
      type: String,
      trim: true
    },
    orderType: {
      type: String,
      enum: ['room_service', 'restaurant', 'service_request', 'other'],
      default: 'room_service'
    },
    source: {
      type: String,
      enum: ['whatsapp', 'chatbot', 'qr_code', 'phone', 'in_person'],
      default: 'qr_code'
    },
    deliveryTime: {
      requested: Date,
      actual: Date
    },
    paymentMethod: {
      type: String,
      enum: ['room_charge', 'cash', 'card', 'online'],
      default: 'room_charge'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
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
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
orderSchema.index({ hotelRef: 1, status: 1 });
orderSchema.index({ roomRef: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 