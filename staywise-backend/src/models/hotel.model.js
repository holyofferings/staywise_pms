const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    logo: {
      type: String
    },
    brandingColor: {
      type: String,
      default: '#3B82F6' // Default blue color
    },
    contactInfo: {
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
      },
      phone: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true
      }
    },
    features: {
      roomsEnabled: {
        type: Boolean,
        default: true
      },
      ordersEnabled: {
        type: Boolean,
        default: true
      },
      aiEnabled: {
        type: Boolean,
        default: false
      },
      marketingEnabled: {
        type: Boolean,
        default: false
      },
      automationsEnabled: {
        type: Boolean,
        default: false
      }
    },
    subscription: {
      plan: {
        type: String,
        enum: ['basic', 'professional', 'enterprise'],
        default: 'basic'
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'trial'],
        default: 'trial'
      },
      trialEnds: Date,
      maxRooms: {
        type: Number,
        default: 15 // Default for basic plan
      },
      maxSubAccounts: {
        type: Number,
        default: 3 // Default for basic plan
      }
    },
    settings: {
      checkInTime: {
        type: String,
        default: '14:00' // 2 PM default check-in time
      },
      checkOutTime: {
        type: String,
        default: '11:00' // 11 AM default check-out time
      },
      currency: {
        type: String,
        default: 'INR'
      },
      timeZone: {
        type: String,
        default: 'Asia/Kolkata'
      },
      taxRate: {
        type: Number,
        default: 18 // Default GST in India
      }
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

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 